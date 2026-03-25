import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { corsHeaders, handleChat, ChatRequestBody } from './handler';
import { Writable } from 'stream';

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
    const stream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: corsHeaders,
    });
    stream.end();
    return;
  }

  if (method !== 'POST') {
    const stream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 405,
      headers: corsHeaders,
    });
    stream.end('Method not allowed');
    return;
  }

  let body: ChatRequestBody;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    const stream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 400,
      headers: corsHeaders,
    });
    stream.end('Invalid JSON');
    return;
  }

  const headers = event.headers as Record<string, string | undefined>;

  // responseHeaders is populated by handleChat before streaming begins
  const responseHeaders: Record<string, string> = {};

  const tokenStream = awslambda.HttpResponseStream.from(responseStream, {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      ...responseHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
    },
  });

  try {
    await handleChat(body, headers, tokenStream, responseHeaders);
  } catch (err) {
    console.error('[lambda] handler error:', err);

    if (!tokenStream.writableEnded && (tokenStream as any).writableLength === 0) {
      const e = err as any;
      let statusCode = 500;
      let message = 'Internal Server Error';

      const errorMessage = typeof e?.message === 'string' ? e.message : '';
      const errorStatus = typeof e?.status === 'number' ? e.status : e?.statusCode;
      const errorCode = typeof e?.code === 'string' ? e.code : '';

      if (errorStatus === 400 || /message is required/i.test(errorMessage)) {
        statusCode = 400;
        message = errorMessage || 'Bad Request';
      } else if (
        errorStatus === 429 ||
        errorCode === 'RATE_LIMITED' ||
        /rate limit/i.test(errorMessage)
      ) {
        statusCode = 429;
        message = errorMessage || 'Rate limited';
      } else if (typeof errorStatus === 'number' && errorStatus >= 400 && errorStatus <= 599) {
        statusCode = errorStatus;
        message = errorMessage || 'Error';
      }

      const errorStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode,
        headers: corsHeaders,
      });
      errorStream.end(message);
      return;
    }

    if (!tokenStream.writableEnded) tokenStream.end();
  }
});
