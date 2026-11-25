import { useEffect, useState } from 'react';
import { validateToolInput } from '@/lib/tool-engine';

export function useToolSubmission(tool: string, input: string) {
  const [submitted, setSubmitted] = useState<{ tool: string; input: string; version: number } | null>(null);
  const current = submitted?.tool === tool && submitted.input === input.trim() ? submitted : null;
  const submit = () => {
    const text = validateToolInput(tool, input);
    setSubmitted(previous => previous?.tool === tool && previous.input === text ? previous : { tool, input: text, version: Date.now() });
  };
  useEffect(() => {
    if (!input.trim()) { setSubmitted(null); return; }
    const timer = setTimeout(() => {
      try { submit(); } catch { /* Incomplete input waits for explicit submission. */ }
    }, /youtu\.?be|^@|^UC[\w-]{20,}|list=/i.test(input.trim()) ? 50 : 600);
    return () => clearTimeout(timer);
  }, [tool, input]);
  return { submitted: current, submit };
}