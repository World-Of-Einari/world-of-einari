import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './system-prompt';

/**
 * Builds the message array for an OpenAI request from the system prompt,
 * conversation history, and current user message.
 */
export function buildMessages(
  history: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  message: string,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message },
  ];
}
