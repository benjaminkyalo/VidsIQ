import { describe, expect, it } from 'vitest';
import { allTools, findToolBySlug, toolSlug } from './tools';
import { searchOverrides, toolSearchIdentity } from './tool-seo';

describe('individual search destinations', () => {
  it('assigns every catalog tool its own self-referencing destination', () => {
    const identities = allTools.map(toolSearchIdentity);
    expect(new Set(identities.map(identity => identity.path)).size).toBe(allTools.length);
    for (const tool of allTools) {
      const identity = toolSearchIdentity(tool);
      expect(identity.path).toBe(`/tools/${toolSlug(tool.name)}`);
      expect(findToolBySlug(identity.path.slice('/tools/'.length))?.name).toBe(tool.name);
    }
  });
  it('opens the MP3 Downloader at its individual tool address', () => {
    const tool = findToolBySlug('mp3-downloader');
    expect(tool).toBeDefined();
    if (!tool) throw new Error('MP3 Downloader missing');
    expect(toolSearchIdentity(tool).path).toBe('/tools/mp3-downloader');
  });
  it('targets searched phrases on priority tool titles', () => {
    const title = (slug: string) => toolSearchIdentity(findToolBySlug(slug)!).title;
    expect(title('monetization-checker')).toContain('YouTube Monetization Checker');
    expect(title('youtube-without-ads')).toContain('Watch YouTube Without Ads');
    expect(title('transcript-generator')).toContain('YouTube Transcript Generator');
    expect(title('thumbnail-downloader')).toContain('YouTube Thumbnail Downloader');
    expect(title('seo-score-checker')).toContain('YouTube SEO Checker');
    expect(title('thumbnail-viewer')).toContain('YouTube Thumbnail Viewer & Preview');
    expect(title('hashtag-generator')).toContain('YouTube Hashtag Generator');
    expect(title('live-subscriber-count')).toContain('Live Subscriber Counter');
    expect(title('like-counter')).toContain('YouTube Like Counter');
    expect(title('views-to-money')).toContain('YouTube Views to Money Converter');
    expect(title('youtube-shorts-downloader')).toContain('YouTube Shorts Downloader');
  });
  it('keeps every override title and description within search snippet limits', () => {
    for (const { title, description } of Object.values(searchOverrides)) {
      expect(title.length).toBeLessThanOrEqual(70);
      expect(description.length).toBeLessThanOrEqual(170);
    }
  });
});
