import OpenAI from 'openai';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history?: Message[];
}

// ─── SSM cache ───────────────────────────────────────────────────────────────

let cachedApiKey: string | null = null;

async function getOpenAiKey(): Promise<string> {
  // Local dev: use env var directly
  if (process.env['OPENAI_API_KEY']) {
    return process.env['OPENAI_API_KEY'];
  }

  // Lambda: fetch from SSM and cache in-memory for the lifetime of the instance
  if (cachedApiKey) return cachedApiKey;

  const ssm = new SSMClient({});
  const command = new GetParameterCommand({
    Name: process.env['SSM_PARAMETER_NAME'] ?? '/world-of-einari/openai-api-key',
    WithDecryption: true,
  });

  const response = await ssm.send(command);
  const value = response.Parameter?.Value;

  if (!value) throw new Error('Failed to retrieve OpenAI API key from SSM');

  cachedApiKey = value;
  return cachedApiKey;
}

// ─── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a helpful assistant embedded in Einari Naukkarinen's personal portfolio website (einarinau.com).
Your role is to help visitors learn about Einari and facilitate contact.

About Einari:
- Principal Software Engineer based in London, UK
- 10+ years of experience, 5+ years as Principal Engineer
- Currently at LexisNexis Risk Solutions
- Specialises in modern web technologies: Angular, React, TypeScript, Node.js
- Strong background in cloud infrastructure: AWS (S3, CloudFront, Lambda, RDS, Route 53), Terraform, GitHub Actions CI/CD
- Experienced in large-scale geospatial engineering: vector tiles, MVT/protobuf, Deck.gl, Google Maps, Elasticsearch
- Led the GitHub InnerSource initiative at LexisNexis
- Built AI developer tooling with OpenAI, RAG, and MCP
- Previously at Business of Fashion, Tieto, and Basware

If someone wants to get in touch, direct them to scroll to the Contact section on the site or reach out via LinkedIn (linkedin.com/in/enaukkarinen).

Tone: concise, direct, technically literate. Keep responses to 2-4 sentences unless more detail is clearly needed. Never invent specific dates, company names, or details not provided above.`;

// ─── Rate limiting ───────────────────────────────────────────────────────────

const RATE_LIMIT_MAX = 10; // max requests
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// ─── CORS headers ────────────────────────────────────────────────────────────

const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? 'http://localhost:4200';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Origin-Verify',
};

// ─── Secret header verification ──────────────────────────────────────────────

function verifyOriginSecret(headers: Record<string, string | undefined>): boolean {
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];

  // Skip verification in local dev (no secret configured)
  if (!expectedSecret) return true;

  const incoming = headers['x-origin-verify'] ?? headers['X-Origin-Verify'];
  return incoming === expectedSecret;
}

// ─── Core handler ────────────────────────────────────────────────────────────

export async function handleChat(
  body: ChatRequestBody,
  headers: Record<string, string | undefined>,
  responseStream: NodeJS.WritableStream,
): Promise<void> {
  if (!verifyOriginSecret(headers)) {
    responseStream.end();
    throw new Error('Forbidden');
  }

  // CloudFront forwards the real client IP in this header
  const ip = headers['x-forwarded-for']?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    responseStream.end();
    throw new Error('Rate limited');
  }

  const { message, history = [] } = body;

  if (!message?.trim()) {
    throw new Error('Message is required');
  }

  const apiKey = await getOpenAiKey();
  const openai = new OpenAI({ apiKey });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 512,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: 'user', content: message },
    ],
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) responseStream.write(token);
  }

  responseStream.end();
}
