import { z } from 'zod/mini';

import { ContactRequestSchema } from './schemas';
import { AppError } from './resolve-http-error';

/**
 * Validates a contact request payload using Zod.
 * Throws an AppError with status 400 if validation fails.
 */
export function validateContactRequest(args: unknown): z.infer<typeof ContactRequestSchema> {
  const result = ContactRequestSchema.safeParse(args);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Invalid contact request';
    throw new AppError(400, message);
  }
  return result.data;
}
