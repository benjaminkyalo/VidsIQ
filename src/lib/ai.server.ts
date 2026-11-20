import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { aiFailureMessage, retryableAiStatus } from './ai-failure';
import { serverSetting } from './server-env';

const RUN_ID = 'X-Lovable-AIG-Run-ID';
function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
    const response = await fetch(input, { ...init, headers });
    runId ??= response.headers.get(RUN_ID)?.trim() || undefined;
    return response;
  };
}

export class AiError extends Error { constructor(message: string, public status: number) { super(message); } }

const GATEWAY_MODEL = 'openai/gpt-6-astra';
const DIRECT_MODEL = 'gpt-5.1';
const ATTEMPTS = 3;

type Provider = { provider: ReturnType<typeof createOpenAI>; model: string; gateway: boolean };

// Self-hosted installs have no Lovable key, so a direct OpenAI-compatible endpoint wins when configured.
function resolveProvider(): Provider {
  const directKey = serverSetting('AI_API_KEY', 'OPENAI_API_KEY');
  if (directKey) {
    return {
      provider: createOpenAI({
        baseURL: serverSetting('AI_BASE_URL') || 'https://api.openai.com/v1',
        apiKey: directKey,
      }),
      model: serverSetting('AI_MODEL') || DIRECT_MODEL,
      gateway: false,
    };
  }
  const apiKey = serverSetting('LOVABLE_API_KEY');
  if (!apiKey) throw new AiError('AI writing is not configured.', 401);
  return {
    provider: createOpenAI({
      baseURL: 'https://ai.gateway.lovable.dev/v1',
      apiKey,
      headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
      fetch: runIdFetch(),
    }),
    model: GATEWAY_MODEL,
    gateway: true,
  };
}

// Runs on the server only; retries transient provider failures with backoff so a brief busy spell never fails the request.
export async function aiText(instructions: string, prompt: string): Promise<string> {
  const { provider, model, gateway } = resolveProvider();
  let lastStatus = 0;
  let lastMessage = '';
  for (let i = 0; i < ATTEMPTS; i++) {
    let failure: unknown;
    const result = streamText({
      model: provider.responses(model),
      system: instructions,
      prompt,
      maxRetries: 0,
      onError: ({ error }) => { failure = error; },
      ...(gateway
        ? { providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', reasoningSummary: 'auto', store: false, include: ['reasoning.encrypted_content'] } } }
        : {}),
    });
    let text = '';
    try { text = await result.text; } catch (e) { failure ??= e; }
    if (!failure && text.trim()) return text.trim();
    const details = failure as { statusCode?: number; responseBody?: string; responseHeaders?: Record<string, string> } | undefined;
    lastStatus = details?.statusCode ?? 0;
    lastMessage = !failure ? 'The AI service returned no usable content for this request.' : aiFailureMessage(lastStatus, details?.responseBody);
    if (!retryableAiStatus(lastStatus)) break;
    const retryAfter = details?.responseHeaders?.['retry-after'];
    const seconds = Number(retryAfter);
    const wait = retryAfter ? (Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now()) : 800 * 2 ** i + Math.random() * 300;
    // Do not hold a visitor request open through a long rate-limit window.
    if (wait > 30000) break;
    if (i < ATTEMPTS - 1) await new Promise(r => setTimeout(r, Math.max(800, wait)));
  }
  throw new AiError(lastMessage || aiFailureMessage(lastStatus), lastStatus || 500);
}
