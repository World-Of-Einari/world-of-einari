/**
 * Local dev server — simulates the Lambda Function URL environment.
 * Run with: pnpm dev
 * The Angular dev server proxies /api/chat → http://localhost:3001/chat
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handleChat, ChatRequestBody } from './core/handle-chat';
import { corsHeaders } from './core/cors.js';
import { resolveHttpError } from './core/errors.js';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

app.use(express.json());

app.options('/chat', (_, res) => {
  res.set(corsHeaders).sendStatus(200);
});

app.post('/chat', async (req: Request, res: Response) => {
  const body = req.body as ChatRequestBody;
  const headers = req.headers as Record<string, string | undefined>;

  try {
    await handleChat(body, headers, (extraHeaders) => {
      res.set({
        ...corsHeaders,
        ...extraHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-cache',
      });
      return res;
    });
  } catch (err: unknown) {
    console.error('[local] error:', err);
    if (!res.writableEnded) {
      const { statusCode, message } = resolveHttpError(err);
      res.status(statusCode).end(message);
    }
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`[api] local dev server running at http://localhost:${PORT}`);
  console.log(
    `[api] OpenAI key: ${process.env['OPENAI_API_KEY'] ? '✓ found in env' : '✗ missing — add to .env'}`,
  );
});
