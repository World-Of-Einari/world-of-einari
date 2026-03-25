import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Writable } from 'stream';
import { handleChat, ChatRequestBody } from './core/handle-chat';
import { corsHeaders } from './core/cors';
import { resolveHttpError } from './core/errors';
import { logger } from './core/logger';

declare const awslambda: {
  streamifyResponse: (
    handler: (event: APIGatewayProxyEventV2, responseStream: Writable) => Promise<void>,
  ) => unknown;
  HttpResponseStream: {
    from: (
      stream: Writable,
      metadata: { statusCode: number; headers: Record<string, string> },
    ) => Writable;
  };
};

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  const method = event.requestContext.http.method.toUpperCase();

  if (method === 'OPTIONS') {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: corsHeaders,
    }).end();
    return;
  }

  if (method !== 'POST') {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 405,
      headers: corsHeaders,
    }).end('Method not allowed');
    return;
  }

  let body: ChatRequestBody;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 400,
      headers: corsHeaders,
    }).end('Invalid JSON');
    return;
  }

  const headers = event.headers as Record<string, string | undefined>;

  try {
    await handleChat(body, headers, (extraHeaders) =>
      awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          ...extraHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Accel-Buffering': 'no',
        },
      }),
    );
  } catch (err) {
    logger.error('[lambda] error:', err);
    const { statusCode, message } = resolveHttpError(err);
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode,
      headers: corsHeaders,
    }).end(message);
  }
});
