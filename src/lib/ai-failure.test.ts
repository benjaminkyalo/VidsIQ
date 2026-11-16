import { expect, it } from 'vitest';
import { aiFailureMessage, retryableAiStatus } from './ai-failure';

it('never retries timeout, network-unknown, refusal, credit, or configuration failures', () => {
  for (const status of [0, 200, 400, 401, 402, 403, 404, 408]) expect(retryableAiStatus(status)).toBe(false);
});
it('allows only rate limits and server failures to retry', () => {
  expect(retryableAiStatus(429)).toBe(true);
  expect(retryableAiStatus(503)).toBe(true);
});
it('preserves the safe gateway recovery message', () => {
  expect(aiFailureMessage(402, JSON.stringify({ error: { message: 'AI credits are temporarily held. Wait for the hold to clear.' } }))).toBe('AI credits are temporarily held. Wait for the hold to clear.');
});