import { toolSlug, type Tool } from './tools';
import { getToolSearchContent } from './tool-search-content';

export function toolSearchIdentity(tool: Pick<Tool, 'name' | 'description'>) {
  const name = /youtube/i.test(tool.name) ? tool.name : `YouTube ${tool.name}`;
  const path = `/tools/${toolSlug(tool.name)}`;
  const content = getToolSearchContent(tool);
  const title = tool.name === 'YouTube Without Ads' ? 'Watch YouTube Online — Ad-Free Options & Player | VidsIQ' : `${name}${content ? ` — ${content.intent}` : ''} | VidsIQ`;
  return {
    name,
    path,
    title,
    description: tool.name === 'YouTube Without Ads' ? 'Watch YouTube videos in our online player with captions, speed and fullscreen controls. Learn what works for ad-free viewing and troubleshoot playback.' : tool.description,
  };
}

export function toolSearchHead(tool: Pick<Tool, 'name' | 'description'>) {
  const identity = toolSearchIdentity(tool);
  return {
    meta: [
      { title: identity.title },
      { name: 'description', content: identity.description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: identity.title },
      { property: 'og:description', content: identity.description },
      { property: 'og:url', content: identity.path },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: identity.title },
      { name: 'twitter:description', content: identity.description },
    ],
    links: [{ rel: 'canonical', href: identity.path }],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${identity.path}#application`,
            name: identity.name,
            url: identity.path,
            description: identity.description,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any',
            isAccessibleForFree: true,
            publisher: { '@type': 'Organization', name: 'VidsIQ' },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'VidsIQ', item: '/' },
              { '@type': 'ListItem', position: 2, name: identity.name, item: identity.path },
            ],
          },
        ],
      }),
    }],
  };
}