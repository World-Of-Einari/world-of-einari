import OpenAI from 'openai';
import { getOpenAiKey } from './ssm';
import { isRateLimited } from './rate-limit';
import { verifyOriginSecret } from './cors';
import { runChat } from './chat';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history?: Message[];
}

/**
 * Validates the incoming request and delegates to runChat.
 *
 * @param getStream - factory called with extra headers once tool detection
 *                    is complete, returns the writable stream for tokens
 */
export async function handleChat(
  body: ChatRequestBody,
  headers: Record<string, string | undefined>,
  getStream: (extraHeaders: Record<string, string>) => NodeJS.WritableStream,
): Promise<void> {
  if (!verifyOriginSecret(headers)) {
    throw new Error('Forbidden');
  }

  const ip = headers['x-forwarded-for']?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    throw new Error('Rate limited');
  }

  const { message, history = [] } = body;

  if (!message?.trim()) {
    throw new Error('Message is required');
  }

  const apiKey = await getOpenAiKey();
  const openai = new OpenAI({ apiKey });

  await runChat(openai, history, message, getStream);
}
