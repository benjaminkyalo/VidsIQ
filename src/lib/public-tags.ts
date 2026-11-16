import { keywords } from './tool-engine';

export function parseChannelTags(keywords?: string): string[] {
  return [...new Set((keywords?.match(/"[^"]+"|\S+/g) ?? []).map(tag => tag.replace(/^"|"$/g, '').trim()).filter(Boolean))];
}

export function publicTags(record: { channelKeywords?: string; tags: string[] }) {
  return record.channelKeywords ? parseChannelTags(record.channelKeywords) : record.tags;
}

export function recordKeywords(record: { title: string; description: string; channelKeywords?: string; tags: string[] }) {
  return keywords(`${record.title} ${record.description} ${publicTags(record).join(' ')}`);
}