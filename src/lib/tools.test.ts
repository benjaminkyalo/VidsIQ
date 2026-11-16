import { describe, expect, it } from 'vitest';
 import { allTools, findToolBySlug, featuredToolNames, featuredTools, toolSlug } from './tools';
describe('tool pages', () => {
  it('gives every tool a unique page address', () => { expect(new Set(allTools.map(t => toolSlug(t.name))).size).toBe(allTools.length); });
  it('maps monetization checker address', () => { expect(toolSlug('Monetization Checker')).toBe('monetization-checker'); expect(findToolBySlug('monetization-checker')?.name).toBe('Monetization Checker'); });
  it('shows eight recognised tools in the navbar panel', () => {
    expect(featuredToolNames).toEqual(['Monetization Checker','Subscriber Count','YouTube to MP3','YouTube to MP4','Thumbnail Downloader','Transcript Generator','Tag Extractor','Money Calculator','YouTube Shorts Downloader','Playlist Downloader','Audio Downloader','Subtitle Downloader','Video Summarizer','Title Generator','Profile Downloader','Keyword Finder']);
    expect(featuredTools.length).toBe(16);
    expect(featuredTools.every(Boolean)).toBe(true);
    expect(allTools.some(t => t.name === 'YouTube to MP3')).toBe(true);
  });
});
