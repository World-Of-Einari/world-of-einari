import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { corsHeaders, handleChat, ChatRequestBody } from './handler';
import { Writable } from 'stream';

// awslambda.streamifyResponse is injected by the Lambda runtime
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

  // Handle CORS preflight
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

  // Check origin secret — reject if wrong
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];
  if (expectedSecret && headers['x-origin-verify'] !== expectedSecret) {
    const stream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 403,
      headers: corsHeaders,
    });
    stream.end('Forbidden');
    return;
  }

  const tokenStream = awslambda.HttpResponseStream.from(responseStream, {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
    },
  });

  try {
    await handleChat(body, headers, tokenStream);
  } catch (err) {
    console.error('[lambda] handler error:', err);

    // If no data has been written yet, we can still change the status code
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
      } else if (errorStatus === 429 || errorCode === 'RATE_LIMITED' || /rate limit/i.test(errorMessage)) {
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

    // If some data was already written, just ensure the stream is closed
    if (!tokenStream.writableEnded) tokenStream.end();
  }
});
