import { ContactRequest } from '../tools/submit-contact-request';

/**
 * Validates a contact request payload.
 * Throws if any field is missing, malformed, or exceeds length limits.
 */
export function validateContactRequest(args: ContactRequest): void {
  if (!args.name?.trim() || args.name.length > 200) {
    throw new Error('Invalid name');
  }
  if (
    !args.email?.trim() ||
    args.email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)
  ) {
    throw new Error('Invalid email');
  }
  if (!args.message?.trim() || args.message.length > 2000) {
    throw new Error('Invalid message');
  }
}
