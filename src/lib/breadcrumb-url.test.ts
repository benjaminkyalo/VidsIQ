import { describe, expect, it } from 'vitest';
import { breadcrumbUrl } from './breadcrumb-url';
import { allTools, toolSlug } from './tools';

describe('production breadcrumb addresses', () => {
  it('uses the complete production homepage address', () => {
    expect(breadcrumbUrl('/')).toBe('https://vidsiq.com/');
  });

  it('preserves every catalog tool path on the production origin', () => {
    for (const tool of allTools) {
      const path = `/tools/${toolSlug(tool.name)}`;
      expect(breadcrumbUrl(path)).toBe(`https://vidsiq.com${path}`);
    }
  });

  it('preserves information and article destinations', () => {
    for (const path of ['/contact', '/blogs', '/blogs/how-to-get-a-transcript-of-a-youtube-video']) {
      expect(breadcrumbUrl(path)).toBe(`https://vidsiq.com${path}`);
    }
  });
});