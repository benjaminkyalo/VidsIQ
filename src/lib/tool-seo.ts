import { toolSlug, type Tool } from './tools';
import { getToolSearchContent } from './tool-search-content';
import { thumbnailFaqSchema, thumbnailPageContent } from './thumbnail-content';
import { getPageGuide } from './page-guides';

/** Search-demand overrides for priority tools: titles and descriptions use the phrases people actually search. */
export const searchOverrides: Record<string, { title: string; description: string }> = {
  'Monetization Checker': {
    title: 'YouTube Monetization Checker — Is a Channel Monetized? | VidsIQ',
    description: 'Free YouTube monetization checker: paste any channel or video link to see subscribers, channel age, eligibility signals and estimated earnings in seconds.',
  },
  'YouTube Without Ads': {
    title: 'Watch YouTube Without Ads – Every Option Explained | VidsIQ',
    description: 'Want to watch YouTube without ads? Compare the official ad-free option, free ways to cut interruptions, and the risks of blockers and unofficial apps.',
  },
  'Transcript Generator': {
    title: 'YouTube Transcript Generator – Free Video to Text | VidsIQ',
    description: 'Get the full transcript of any YouTube video in seconds. Copy it, toggle timestamps, or download as TXT or SRT. Free, no signup, works on any device.',
  },
  'Thumbnail Downloader': {
    title: thumbnailPageContent.title,
    description: thumbnailPageContent.description,
  },
  'Title Generator': {
    title: 'YouTube Title Generator — Free AI Video Title Ideas | VidsIQ',
    description: 'Free AI YouTube title generator: enter your topic and get ten catchy, search-friendly title ideas under 70 characters, ready to copy.',
  },
  'Description Generator': {
    title: 'YouTube Description Generator — Free AI Descriptions | VidsIQ',
    description: 'Free AI YouTube description generator: write a full video description with a hook, chapters, call to subscribe and hashtags, ready to copy.',
  },
  'Tag Generator': {
    title: 'YouTube Tag Generator — Free AI Tags for Videos | VidsIQ',
    description: 'Free AI YouTube tag generator: get relevant video tags from a topic or link, ready to copy as a comma-separated list.',
  },
};

export function toolSearchIdentity(tool: Pick<Tool, 'name' | 'description'>) {
  const name = /youtube/i.test(tool.name) ? tool.name : `YouTube ${tool.name}`;
  const path = `/tools/${toolSlug(tool.name)}`;
  const content = getToolSearchContent(tool);
  const override = searchOverrides[tool.name];
  const title = override?.title ?? `${name}${content ? ` — ${content.intent}` : ''} | VidsIQ`;
  return {
    name,
    path,
    title,
    description: override?.description ?? tool.description,
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
          ...(tool.name === 'Thumbnail Downloader' || getPageGuide(tool.name) ? [{
            '@type': 'FAQPage',
            mainEntity: (getPageGuide(tool.name)?.faqs ?? thumbnailFaqSchema).map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          }] : []),
        ],
      }),
    }],
  };
}