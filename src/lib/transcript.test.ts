import { describe, expect, it } from 'vitest';
import { parseTimedText, toSrt, toVtt, shortClock } from './transcript';
const xml = '<timedtext><body><p t="120" d="4480" w="1"><s ac="0">Do</s><s t="79"> you</s></p><p t="4600" d="1000">Tom &amp; Jerry</p></body></timedtext>';
describe('transcripts', () => {
  it('parses srv3 caption timing and text', () => expect(parseTimedText(xml)).toEqual([{ start: 0.12, duration: 4.48, text: 'Do you' }, { start: 4.6, duration: 1, text: 'Tom & Jerry' }]));
  it('formats SRT timestamps', () => expect(toSrt(parseTimedText(xml)).split('\n')[1]).toBe('00:00:00,120 --> 00:00:04,600'));
  it('formats VTT timestamps', () => expect(toVtt(parseTimedText(xml))).toContain('00:00:04.600 --> 00:00:05.600'));
  it('shows short clocks', () => { expect(shortClock(75)).toBe('01:15'); expect(shortClock(3725)).toBe('01:02:05'); });
});
