import express, { Request, Response } from 'express';

const app = express();

// Parse JSON bodies
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'einarinau-api' });
});

app.post('/chat', (req: Request, res: Response) => {
  // Stub for now — later this becomes the RAG + MCP entrypoint.
  // Expect shape: { message: string }
  const body = (req.body ?? {}) as { message?: string };
  const message = body.message?.trim() ?? '';

  res.json({
    answer:
      message.length === 0
        ? 'Ask me about Angular, MCP, RAG, Postgres — this endpoint will be wired up soon.'
        : `You said: ${message}`,
    sources: [] as Array<{ title: string; url?: string; snippet?: string }>,
    toolCalls: [] as Array<{ tool: string; args: unknown; result: unknown }>,
  });
});

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '0.0.0.0';

app.listen(port, host, () => {
  // Keep it similar to Fastify's logger output
  // eslint-disable-next-line no-console
  console.log(`einarinau-api listening on http://${host}:${port}`);
});