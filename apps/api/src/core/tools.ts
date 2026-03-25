import OpenAI from 'openai';

/**
 * Tool definitions passed to the OpenAI API on every request.
 * - show_contact_form: client-side UI trigger, no server execution
 * - submit_contact_request: writes to DynamoDB and publishes to SNS
 */
export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'show_contact_form',
      description:
        'Show a contact form when the user wants to get in touch with Einari, leave a message, or make an enquiry.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'submit_contact_request',
      description:
        "Submit a contact request after collecting the visitor's name, email and message.",
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Full name of the visitor' },
          email: { type: 'string', description: 'Email address of the visitor' },
          message: { type: 'string', description: 'Message from the visitor' },
        },
        required: ['name', 'email', 'message'],
      },
    },
  },
];
