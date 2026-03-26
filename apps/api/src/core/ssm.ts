import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

let cachedApiKey: string | null = null;

/**
 * Retrieves the OpenAI API key from SSM Parameter Store.
 * Caches the result in memory for the lifetime of the Lambda instance.
 * In local development, returns the OPENAI_API_KEY env var directly.
 */
export async function getOpenAiKey(): Promise<string> {
  if (process.env['OPENAI_API_KEY']) {
    return process.env['OPENAI_API_KEY'];
  }

  if (cachedApiKey) return cachedApiKey;

  const ssm = new SSMClient({});
  const response = await ssm.send(
    new GetParameterCommand({
      Name: process.env['SSM_PARAMETER_NAME'] ?? '/world-of-einari/openai-api-key',
      WithDecryption: true,
    }),
  );

  const value = response.Parameter?.Value;
  if (!value) throw new Error('Failed to retrieve OpenAI API key from SSM');

  cachedApiKey = value;
  return cachedApiKey;
}
