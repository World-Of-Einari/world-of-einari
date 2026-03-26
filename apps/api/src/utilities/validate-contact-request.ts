import { ContactRequest } from '../tools/submit-contact-request';
import { config } from '../config';

/**
 * Validates a contact request payload.
 * Throws if any field is missing, malformed, or exceeds length limits.
 */
export function validateContactRequest(args: ContactRequest): void {
  if (!args.name?.trim() || args.name.length > config.contact.nameMaxLength) {
    throw new Error('Invalid name');
  }
  if (
    !args.email?.trim() ||
    args.email.length > config.contact.emailMaxLength ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)
  ) {
    throw new Error('Invalid email');
  }
  if (!args.message?.trim() || args.message.length > config.contact.messageMaxLength) {
    throw new Error('Invalid message');
  }
}
