import OpenAI from 'openai';
import { getOpenAiKey } from './ssm';

import { isRateLimited } from './rate-limit';
import { runChat } from './chat';
import { logger } from './logger';
import { verifyOriginSecret } from '../utilities/verify-secret-origin';
import { config } from '../config';
import { AppError } from '../utilities/resolve-http-error';
import { ChatRequestSchema } from '../utilities/schemas';

/**
 * Validates the incoming request and delegates to runChat.
 *
 * @param getStream - factory called with extra headers once tool detection
 *                    is complete, returns the writable stream for tokens
 */
export async function handleChat(
  body: unknown,
  headers: Record<string, string | undefined>,
  getStream: (extraHeaders: Record<string, string>) => NodeJS.WritableStream,
): Promise<void> {
  if (!verifyOriginSecret(headers)) {
    logger.warn('forbidden_request', { ip: headers['x-forwarded-for'] });
    throw new AppError(403, 'Forbidden');
  }

  const ip = headers['x-forwarded-for']?.split(',')[0].trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    logger.warn('rate_limited', { ip });
    throw new AppError(429, 'Rate limited');
  }

  const result = ChatRequestSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Invalid request';
    throw new AppError(400, message);
  }

  const { message, history = [] } = result.data;

  logger.info('chat_request', { ip, historyLength: history.length });

  const apiKey = await getOpenAiKey();
  const openai = new OpenAI({ apiKey });

  await runChat(openai, history, message, getStream);
}
