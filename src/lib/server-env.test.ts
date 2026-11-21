import { afterEach, expect, it } from 'vitest';
import { cleanSetting, serverSetting } from './server-env';

afterEach(() => { delete process.env['TEST_KEY_A']; delete process.env['TEST_KEY_B']; });

it('removes quotes, spaces and Windows line endings around a saved key', () => {
  expect(cleanSetting(` 'abc123'\r`)).toBe('abc123');
  expect(cleanSetting('"abc123"')).toBe('abc123');
});

it('treats a blank or quotes-only key as missing and falls back to the next name', () => {
  process.env['TEST_KEY_A'] = ' "" ';
  process.env['TEST_KEY_B'] = 'second';
  expect(serverSetting('TEST_KEY_A', 'TEST_KEY_B')).toBe('second');
});
