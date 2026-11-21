export function retryableAiStatus(status: number) {
  return status === 429 || (status >= 500 && status <= 599);
}

export function aiFailureMessage(status: number, responseBody?: string): string {
  try {
    const body = JSON.parse(responseBody ?? '') as { message?: unknown; error?: { message?: unknown } };
    const message = body.error?.message ?? body.message;
    if (typeof message === 'string' && message.trim()) return message.slice(0, 500);
  } catch { /* No safe gateway message was supplied. */ }
  if (status === 401) return 'AI writing is not configured correctly.';
  if (status === 402) return 'AI writing is paused because AI credits have run out.';
  if (status === 403) return 'AI writing is not available for this request.';
  if (status === 404) return 'The AI service is currently unavailable.';
  if (status === 429) return 'AI writing is busy. Please try again later.';
  return 'AI writing could not complete this request.';
}