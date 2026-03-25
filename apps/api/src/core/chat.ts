import OpenAI from 'openai';
import { tools } from './tools';
import { submitContactRequest } from './contact';

/**
 * Builds the base message array for an OpenAI request
 * from the system prompt, conversation history, and current message.
 */
function buildMessages(
  systemPrompt: string,
  history: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  message: string,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];
}

/**
 * Streams a follow-up OpenAI response after a tool call has been handled.
 * Sends the tool result back to the model so it can generate a confirmation.
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
 * Handles a tool call returned by the model.
 * - show_contact_form: signals the client via response headers, streams acknowledgement
 * - submit_contact_request: persists the contact request, streams confirmation
 *
 * @returns the tool action name if a UI action should be triggered, null otherwise
 */
export async function handleToolCall(
  openai: OpenAI,
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  assistantMessage: OpenAI.Chat.Completions.ChatCompletionMessage,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  responseStream: NodeJS.WritableStream,
): Promise<string | null> {
  const { name, arguments: rawArgs } = toolCall.function;

  if (name === 'show_contact_form') {
    await streamToolFollowUp(
      openai,
      messages,
      assistantMessage,
      toolCall.id,
      'Contact form displayed to user',
      responseStream,
    );
    return 'show_contact_form';
  }

  if (name === 'submit_contact_request') {
    const args = JSON.parse(rawArgs);
    await submitContactRequest(args);
    await streamToolFollowUp(
      openai,
      messages,
      assistantMessage,
      toolCall.id,
      'Contact request submitted successfully',
      responseStream,
    );
    return null;
  }

  return null;
}

/**
 * Streams a normal conversational response from the model.
 */
export async function streamResponse(
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
 * Orchestrates a single chat turn.
 * First makes a non-streaming request to detect tool calls,
 * then either handles the tool or falls through to streaming.
 *
 * @returns the tool action name if a UI action should be triggered, null otherwise
 */
export async function runChat(
  openai: OpenAI,
  systemPrompt: string,
  history: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  message: string,
  responseStream: NodeJS.WritableStream,
): Promise<string | null> {
  const messages = buildMessages(systemPrompt, history, message);

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
    const toolCall = choice.message.tool_calls[0];
    return handleToolCall(openai, toolCall, choice.message, messages, responseStream);
  }

  // No tool call — stream a normal response
  await streamResponse(openai, messages, responseStream);
  return null;
}
