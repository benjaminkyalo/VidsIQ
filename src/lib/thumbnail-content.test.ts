import { describe, expect, it } from 'vitest';
import { thumbnailFaqSchema, thumbnailFaqs, thumbnailLinkFormats, thumbnailSizes } from './thumbnail-content';

describe('Thumbnail Downloader page content', () => {
  it('provides sixteen distinct frequently asked questions', () => {
    expect(thumbnailFaqs).toHaveLength(16);
    expect(new Set(thumbnailFaqs.map(([question]) => question)).size).toBe(16);
  });

  it('keeps schema questions visible in the page FAQs', () => {
    const visible = new Set(thumbnailFaqs.map(([question]) => question));
    expect(thumbnailFaqSchema.length).toBe(5);
    for (const [question] of thumbnailFaqSchema) expect(visible.has(question)).toBe(true);
  });

  it('lists the five sizes supported by the existing resolution control', () => {
    expect(thumbnailSizes.map(([, resolution]) => resolution)).toEqual(['1280 × 720', '640 × 480', '480 × 360', '320 × 180', '120 × 90']);
  });

  it('documents the common video link families accepted by the parser', () => {
    expect(thumbnailLinkFormats).toHaveLength(6);
    expect(thumbnailLinkFormats.every(([, format]) => format?.includes('VIDEO_ID') === true)).toBe(true);
  });
});
