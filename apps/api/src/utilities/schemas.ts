import { z } from 'zod/mini';
z.config(z.locales.en());

import { config } from '../config';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Message is required'),
      z.maxLength(config.message.maxLength, 'Message too long'),
    ),
  history: z.optional(
    z.array(MessageSchema).check(z.maxLength(config.message.historyLimit, 'History too long')),
  ),
});

export const ContactRequestSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Name is required'),
      z.maxLength(config.contact.nameMaxLength, 'Name too long'),
    ),
  email: z
    .string()
    .check(
      z.trim(),
      z.email('Invalid email'),
      z.maxLength(config.contact.emailMaxLength, 'Email too long'),
    ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Message is required'),
      z.maxLength(config.contact.messageMaxLength, 'Message too long'),
    ),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ContactRequest = z.infer<typeof ContactRequestSchema>;
