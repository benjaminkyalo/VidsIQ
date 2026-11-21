export const PLAYER_ORIGIN = 'https://www.youtube-nocookie.com';
export function captionCommands(enabled: boolean) {
  return enabled
    ? [{ func: 'loadModule', args: ['captions'] }, { func: 'setOption', args: ['captions', 'track', { languageCode: 'en' }] }]
    : [{ func: 'unloadModule', args: ['captions'] }];
}
export function playbackError(code: number) {
  if (code === 100) return 'This video is unavailable, removed, or private.';
  if (code === 101 || code === 150) return 'The creator does not allow this video to play on other websites.';
  if (code === 153) return 'YouTube could not verify this player’s website identity. Please reload the page.';
  return 'YouTube could not play this video. Please try another available video.';
}