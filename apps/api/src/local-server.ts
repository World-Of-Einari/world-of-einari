/**
 * Local dev server — simulates the Lambda Function URL environment.
 * Run with: pnpm dev
 * The Angular dev server proxies /api/chat → http://localhost:3001/chat
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import { corsHeaders, handleChat, ChatRequestBody } from './handler.js';

const app = express();
const PORT = process.env['PORT'] ?? 3001;

app.use(express.json());

// CORS preflight
app.options('/chat', (_, res) => {
  res.set(corsHeaders).sendStatus(200);
});

app.post('/chat', async (req: Request, res: Response) => {
  const body = req.body as ChatRequestBody;
  const headers = req.headers as Record<string, string | undefined>;

  res.set({
    ...corsHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'X-Accel-Buffering': 'no',
    'Cache-Control': 'no-cache',
  });

  try {
    await handleChat(body, headers, res);
  } catch (err: unknown) {
    console.error('[local] handler error:', err);
    if (!res.writableEnded) {
      if (err instanceof Error && err.message === 'Message is required') {
        res.status(400).end('Message is required');
      } else if (err instanceof Error && err.message === 'Forbidden') {
        res.status(403).end('Forbidden');
      } else if (err instanceof Error && err.message === 'Rate limited') {
        res.status(429).end('Too many requests');
      } else {
        res.status(500).end('Internal server error');
      }
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
