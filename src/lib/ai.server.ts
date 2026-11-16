import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AI_DEADLINE_MS, withinDeadline } from './request-deadline';

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

const MODEL = 'openai/gpt-6-astra';
const ATTEMPTS = 3;
const RETRYABLE = (status: number) => status === 0 || status === 408 || status === 429 || status >= 500;

// Runs on the server only; retries transient gateway failures with backoff so a brief busy spell never fails the request.
export async function aiText(instructions: string, prompt: string): Promise<string> {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new AiError('AI writing is not configured.', 401);
  const provider = createOpenAI({
    baseURL: 'https://ai.gateway.lovable.dev/v1',
    apiKey,
    headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    fetch: runIdFetch(),
  });
  const deadline = AbortSignal.timeout(AI_DEADLINE_MS);
  let lastStatus = 0;
  for (let i = 0; i < ATTEMPTS; i++) {
    if (deadline.aborted) throw new AiError('AI writing took too long. Please try again.', 408);
    let failure: unknown;
    const result = streamText({
      model: provider.responses(MODEL),
      system: instructions,
      prompt,
      maxRetries: 0,
      abortSignal: deadline,
      onError: ({ error }) => { failure = error; },
      providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', reasoningSummary: 'auto', store: false, include: ['reasoning.encrypted_content'] } },
    });
    let text = '';
    try { text = await withinDeadline(result.text, deadline); } catch (e) { failure ??= e; }
    if (deadline.aborted) throw new AiError('AI writing took too long. Please try again.', 408);
    if (!failure && text.trim()) return text.trim();
    lastStatus = (failure as { statusCode?: number } | undefined)?.statusCode ?? 0;
    if (lastStatus === 402) throw new AiError('AI writing is paused because AI credits have run out.', 402);
    if (lastStatus === 401 || lastStatus === 403) throw new AiError('AI writing is not available for this request.', 403);
    if (!RETRYABLE(lastStatus)) break;
    if (i < ATTEMPTS - 1) await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
  if (lastStatus === 429) throw new AiError('AI writing is busy right now. Please try again in a minute.', 429);
  throw new AiError('AI writing could not complete this request. Please try again.', lastStatus || 500);
}
