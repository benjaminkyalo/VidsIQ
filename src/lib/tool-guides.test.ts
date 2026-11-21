import { expect, it } from 'vitest';
import { allTools } from './tools';
import { getToolGuide } from './tool-guides';
it('provides at least ten answers for every catalog tool', () => {
  expect(allTools.length).toBe(69);
  for (const tool of allTools) expect(getToolGuide(tool).faqs.length).toBeGreaterThanOrEqual(10);
});