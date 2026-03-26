import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Writable } from 'stream';

import { handleChat } from './core/handle-chat';
import { corsHeaders } from './core/cors';
import { resolveHttpError } from './utilities/resolve-http-error';
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

  if (!event.body) {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 400,
      headers: corsHeaders,
    }).end('Request body is required');
    return;
  }

  if (event.body.length > 10_000) {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 413,
      headers: corsHeaders,
    }).end('Request body too large');
    return;
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(event.body ?? '{}');
  } catch {
    awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 400,
      headers: corsHeaders,
    }).end('Invalid JSON');
    return;
  }

  const headers = event.headers as Record<string, string | undefined>;

  try {
    await handleChat(parsedBody, headers, (extraHeaders) =>
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
