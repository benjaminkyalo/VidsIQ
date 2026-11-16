import { describe, expect, it } from 'vitest';
import { allTools, findToolBySlug, toolSlug } from './tools';
import { toolSearchIdentity } from './tool-seo';

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
});