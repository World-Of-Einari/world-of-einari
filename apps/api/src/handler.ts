import OpenAI from 'openai';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { SYSTEM_PROMPT } from './system-prompt';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history?: Message[];
}

//  SSM cache
let cachedApiKey: string | null = null;

async function getOpenAiKey(): Promise<string> {
  // Local dev: use env var directly
  if (process.env['OPENAI_API_KEY']) {
    return process.env['OPENAI_API_KEY'];
  }

  // Lambda: fetch from SSM and cache in-memory for the lifetime of the instance
  if (cachedApiKey) return cachedApiKey;

  const ssm = new SSMClient({});
  const command = new GetParameterCommand({
    Name: process.env['SSM_PARAMETER_NAME'] ?? '/world-of-einari/openai-api-key',
    WithDecryption: true,
  });

  const response = await ssm.send(command);
  const value = response.Parameter?.Value;

  if (!value) throw new Error('Failed to retrieve OpenAI API key from SSM');

  cachedApiKey = value;
  return cachedApiKey;
}

const RATE_LIMIT_MAX = 10; // max requests
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function pruneRateLimitStore(now: number): void {
  for (const [ip, entry] of rateLimitStore) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    pruneRateLimitStore(now);
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? 'http://localhost:4200';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Origin-Verify',
};

// Secret header verification

function verifyOriginSecret(headers: Record<string, string | undefined>): boolean {
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];
  console.log('[verifyOriginSecret] expected:', expectedSecret);
  console.log('[verifyOriginSecret] all header keys:', Object.keys(headers));
  console.log('[verifyOriginSecret] x-origin-verify:', headers['x-origin-verify']);
  console.log('[verifyOriginSecret] X-Origin-Verify:', headers['X-Origin-Verify']);
  if (!expectedSecret) return true;
  const incoming = headers['x-origin-verify'] ?? headers['X-Origin-Verify'];
  console.log('[verifyOriginSecret] incoming:', incoming);
  console.log('[verifyOriginSecret] match:', incoming === expectedSecret);
  return incoming === expectedSecret;
}

export async function handleChat(
  body: ChatRequestBody,
  headers: Record<string, string | undefined>,
  responseStream: NodeJS.WritableStream,
): Promise<void> {
  if (!verifyOriginSecret(headers)) {
    responseStream.end();
    throw new Error('Forbidden');
  }

  // CloudFront forwards the real client IP in this header
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
  const openai = new OpenAI({ apiKey });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 512,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: 'user', content: message },
    ],
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) responseStream.write(token);
  }

  responseStream.end();
}
