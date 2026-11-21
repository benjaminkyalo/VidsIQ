import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useToolSubmission } from './use-tool-submission';

it('clears results when input is cleared and avoids duplicate manual submission', async () => {
  const hook = renderHook(({input}) => useToolSubmission('Thumbnail Downloader', input), { initialProps: { input: 'https://youtu.be/jNQXAC9IVRw' } });
  await waitFor(() => expect(hook.result.current.submitted).not.toBeNull());
  const first = hook.result.current.submitted;
  act(() => hook.result.current.submit());
  expect(hook.result.current.submitted).toBe(first);
  hook.rerender({ input: '' });
  expect(hook.result.current.submitted).toBeNull();
});