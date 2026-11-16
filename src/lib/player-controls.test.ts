import { expect, it } from 'vitest';
import { captionCommands, playbackError } from './player-controls';

it('uses supported caption module commands instead of nonexistent caption methods', () => {
  expect(captionCommands(false)).toEqual([{ func: 'unloadModule', args: ['captions'] }]);
  expect(captionCommands(true)[0]).toEqual({ func: 'loadModule', args: ['captions'] });
});
it('distinguishes private video errors from owner embedding restrictions', () => {
  expect(playbackError(100)).toBe('This video is unavailable, removed, or private.');
  expect(playbackError(150)).toBe('The creator does not allow this video to play on other websites.');
});