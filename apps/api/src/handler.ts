import OpenAI from 'openai';
import { getOpenAiKey } from './core/ssm';
import { isRateLimited } from './core/rate-limit';
import { runChat } from './core/chat';
import { SYSTEM_PROMPT } from './system-prompt';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history?: Message[];
}

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? 'http://localhost:4200';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Origin-Verify',
  'Access-Control-Expose-Headers': 'X-Tool-Action',
};

/**
 * Verifies the origin secret header to prevent direct Lambda invocation
 * from outside the CloudFront distribution.
 */
function verifyOriginSecret(headers: Record<string, string | undefined>): boolean {
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];
  if (!expectedSecret) return true;
  const incoming = headers['x-origin-verify'] ?? headers['X-Origin-Verify'];
  return incoming === expectedSecret;
}

/**
 * Main chat handler. Validates the request, enforces rate limiting,
 * and delegates to runChat which handles tool calls and streaming.
 *
 * @param responseHeaders - mutable headers object; handler sets X-Tool-Action if needed
 */
export async function handleChat(
  body: ChatRequestBody,
  headers: Record<string, string | undefined>,
  responseStream: NodeJS.WritableStream,
  responseHeaders: Record<string, string>,
): Promise<void> {
  if (!verifyOriginSecret(headers)) {
    responseStream.end();
    throw new Error('Forbidden');
  }

  const ip = headers['x-forwarded-for']?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    responseStream.end();
    throw new Error('Rate limited');
  }

  const { message, history = [] } = body;

  if (!message?.trim()) {
    responseStream.end();
    throw new Error('Message is required');
  }

  const apiKey = await getOpenAiKey();
  const openai = new OpenAI({
    apiKey,
  });

  const toolAction = await runChat(openai, SYSTEM_PROMPT, history, message, responseStream);

  if (toolAction) {
    responseHeaders['X-Tool-Action'] = toolAction;
  }

  responseStream.end();
}
