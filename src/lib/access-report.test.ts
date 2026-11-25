import { describe, expect, it } from 'vitest';
import { accessReport, readableDuration } from './access-report';
describe('privacy evidence', () => {
  it('does not label a missing public record private', () => expect(accessReport().privacy).toBe('Unavailable'));
  it('does not treat a missing embed flag as a denial', () => expect(accessReport({ privacy: 'public' }).embed).toBe('Not provided'));
  it('allows preview only for accessible, embeddable, non-age-gated evidence', () => {
    expect(accessReport({ privacy: 'public', embeddable: true, ageRestricted: false }).canEmbed).toBe(true);
    expect(accessReport({ privacy: 'unlisted', embeddable: true, ageRestricted: false }).canEmbed).toBe(true);
    expect(accessReport({ privacy: 'private', embeddable: true, ageRestricted: false }).canEmbed).toBe(false);
    expect(accessReport({ privacy: 'public', embeddable: true, ageRestricted: true }).canEmbed).toBe(false);
  });
  it('checks blocked country codes', () => expect(accessReport({regionRestriction:{blocked:['BY','RU']}}, 'ru').regionStatus).toBe('Blocked in RU'));
  it('checks allowed-only lists without treating an empty list as global availability', () => expect(accessReport({regionRestriction:{allowed:['KE']}}, 'GB').regionStatus).toBe('Not on the allowed list for GB'));
  it('formats the screenshot duration accurately', () => expect(readableDuration('PT1H35M4S')).toBe('1:35:04'));
});