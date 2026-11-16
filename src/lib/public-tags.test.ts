import { describe, expect, it } from 'vitest';
import { parseChannelTags, publicTags } from './public-tags';
describe('public tag evidence', () => {
  it('preserves quoted channel phrases and removes duplicates', () => {
    expect(parseChannelTags('music "live mixes" music')).toEqual(['music', 'live mixes']);
  });
  it('uses published channel keywords when available', () => {
    expect(publicTags({ channelKeywords: 'music "live mixes"', tags: [] })).toEqual(['music', 'live mixes']);
  });
  it('does not invent missing tags', () => {
    expect(publicTags({ tags: [] })).toEqual([]);
  });
});