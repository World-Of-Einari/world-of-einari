/**
 * Centralised configuration for the chat Lambda.
 * All magic numbers and environment-dependent values live here.
 */
export const config = {
  openai: {
    model: 'gpt-4o' as const,
    maxTokens: {
      chat: 512,
      toolFollowUp: 128,
    },
  },
  rateLimit: {
    max: 10,
    windowMs: 60_000,
  },
  message: {
    maxLength: 1000,
    historyLimit: 10,
  },
  contact: {
    nameMaxLength: 200,
    emailMaxLength: 200,
    messageMaxLength: 2000,
    ttlDays: 180,
  },
} as const;
