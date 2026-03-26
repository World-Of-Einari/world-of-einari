import OpenAI from 'openai';
import { getOpenAiKey } from './ssm';
import { isRateLimited } from './rate-limit';
import { verifyOriginSecret } from './cors';
import { runChat } from './chat';
import { logger } from './logger';
import { ChatRequestBody } from '@einarinau/chat-types';

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
    logger.warn('forbidden_request', { ip: headers['x-forwarded-for'] });
    throw new Error('Forbidden');
  }

  const ip = headers['x-forwarded-for']?.split(',')[0].trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    logger.warn('rate_limited', { ip });
    throw new Error('Rate limited');
  }

  const { message, history = [] } = body;

  if (!message?.trim()) {
    throw new Error('Message is required');
  }

  if (message.length > 1000) {
    throw new Error('Message too long');
  }

  logger.info('chat_request', { ip, historyLength: history.length });

  const apiKey = await getOpenAiKey();
  const openai = new OpenAI({ apiKey });

  await runChat(openai, history, message, getStream);
}
