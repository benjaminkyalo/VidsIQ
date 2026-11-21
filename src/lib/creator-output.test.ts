import { expect, it } from 'vitest';
import { creatorItems } from './creator-output';

it('keeps ten title suggestions at or below 70 characters', () => {
  const input = [...Array.from({ length: 12 }, (_, i) => `${i + 1}. Useful title ${i}`), 'x'.repeat(71)].join('\n');
  const result = creatorItems('Title Generator', input);
  expect(result).toHaveLength(10);
  expect(result[0]).toBe('Useful title 0');
  expect(result.every(item => item.length <= 70)).toBe(true);
});
it('keeps copied tags within the displayed 500-character budget', () => {
  const result = creatorItems('Tag Generator', Array.from({ length: 30 }, (_, i) => `#${i} ${'x'.repeat(30)}`).join('\n'));
  expect(result.join(', ').length).toBeLessThanOrEqual(500);
  expect(result.length).toBeGreaterThan(0);
  expect(result.every(tag => !tag.startsWith('#'))).toBe(true);
});
it('preserves meaningful leading digits in channel names', () => {
  expect(creatorItems('Channel Name Generator', '360 Creators\n1. 24 Frame Studio')).toEqual(['360 Creators', '24 Frame Studio']);
});