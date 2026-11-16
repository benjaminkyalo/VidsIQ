import { expect, it } from 'vitest';
import { recordKeywords } from './public-tags';
it('includes published tags in the common displayed and copied keyword list', () => {
  expect(recordKeywords({title:'Garden flowers',description:'Plant flowers',tags:['orchids']})).toEqual(['flowers','garden','plant','orchids']);
});