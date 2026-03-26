import OpenAI from 'openai';

import { tools } from '../tools/definitions';
import { submitContactRequest } from '../tools/submit-contact-request';
import { getShowContactFormHeader } from '../tools/show-contact-form';

import { buildMessages } from '../utilities/build-messages';
import { logger } from './logger';

/**
 * Makes a non-streaming OpenAI request to detect whether the model
 * wants to invoke a tool before the response stream is opened.
 */
async function detectToolCall(
  openai: OpenAI,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<{
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall;
  assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessage;
} | null> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 512,
    stream: false,
    messages,
    tools,
    tool_choice: 'auto',
  });

  const choice = response.choices[0];

  if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
    return {
      toolCall: choice.message.tool_calls[0],
      assistantMessage: choice.message,
    };
  }

  return null;
}

/**
 * Streams a follow-up response after a tool call has been handled.
 */
async function streamToolFollowUp(
  openai: OpenAI,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessage,
  toolCallId: string,
  toolResult: string,
  responseStream: NodeJS.WritableStream,
): Promise<void> {
  const followUp = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 128,
    stream: true,
    messages: [
      ...messages,
      assistantMessage,
      { role: 'tool', tool_call_id: toolCallId, content: toolResult },
    ],
  });

  for await (const chunk of followUp) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) responseStream.write(token);
  }
}

/**
 * Streams a normal conversational response.
 */
async function streamResponse(
  openai: OpenAI,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  responseStream: NodeJS.WritableStream,
): Promise<void> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 512,
    stream: true,
    messages,
    tools,
    tool_choice: 'auto',
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) responseStream.write(token);
  }
}

/**
 * Runs a single chat turn.
 *
 * Detects tool calls before opening the response stream so all
 * response headers are known upfront. The getStream factory is
 * called with any extra headers once tool detection is complete.
 */
export async function runChat(
  openai: OpenAI,
  history: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  message: string,
  getStream: (extraHeaders: Record<string, string>) => NodeJS.WritableStream,
): Promise<void> {
  const messages = buildMessages(history, message);
  const toolResult = await detectToolCall(openai, messages);

  if (toolResult) {
    const { toolCall, assistantMessage } = toolResult;
    logger.info('tool_call', { tool: toolResult.toolCall.function.name });

    if (toolCall.function.name === 'show_contact_form') {
      const stream = getStream(getShowContactFormHeader());
      await streamToolFollowUp(
        openai,
        messages,
        assistantMessage,
        toolCall.id,
        'Contact form displayed to user',
        stream,
      );
      stream.end();
      return;
    }

    if (toolCall.function.name === 'submit_contact_request') {
      const args = JSON.parse(toolCall.function.arguments);
      await submitContactRequest(args);
      const stream = getStream({});
      await streamToolFollowUp(
        openai,
        messages,
        assistantMessage,
        toolCall.id,
        'Contact request submitted successfully',
        stream,
      );
      stream.end();
      return;
    }
  }

  const stream = getStream({});
  await streamResponse(openai, messages, stream);
  stream.end();
}
