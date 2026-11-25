export const accessTools = ['Private Video Checker', 'Private YouTube Viewer', 'Age Restricted Viewer'];
export type AccessEvidence = { privacy?: string | undefined; embeddable?: boolean | undefined; ageRestricted?: boolean | undefined; duration?: string | undefined; regionRestriction?: { allowed?: string[]; blocked?: string[] } | undefined };
export function readableDuration(iso?: string) {
  const m = iso?.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!m) return 'Not provided';
  const seconds = Number(m[1] ?? 0) * 86400 + Number(m[2] ?? 0) * 3600 + Number(m[3] ?? 0) * 60 + Math.floor(Number(m[4] ?? 0));
  const h = Math.floor(seconds / 3600), min = Math.floor(seconds % 3600 / 60), s = seconds % 60;
  return `${h ? `${h}:` : ''}${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
export function accessReport(record?: AccessEvidence, country = '') {
  const privacy = record?.privacy ?? 'Unavailable';
  const accessible = privacy === 'public' || privacy === 'unlisted';
  const region = record?.regionRestriction;
  const code = country.trim().toUpperCase();
  const regionStatus = !region ? 'No region-restriction metadata returned'
    : code && region.blocked?.includes(code) ? `Blocked in ${code}`
    : code && region.allowed && !region.allowed.includes(code) ? `Not on the allowed list for ${code}`
    : code ? `No listed block for ${code}` : 'Restrictions reported — select a country to check';
  const canEmbed = accessible && record?.embeddable === true && record.ageRestricted === false;
  const requirements = privacy === 'private'
    ? ['Ask the owner to invite your exact Google account email.', 'Sign in to the invited account on YouTube.']
    : accessible ? ['Open the video on YouTube using its link.', ...(record?.ageRestricted ? ['Follow YouTube’s age-verification requirements.'] : []), 'Country, account, and copyright restrictions may still affect playback.']
    : ['Confirm that the link and video ID are correct.', 'Ask the owner whether the video was removed or made private.', 'A missing public record does not distinguish private, deleted, or restricted content.'];
  return { privacy, canEmbed, regionStatus, requirements, duration: readableDuration(record?.duration), embed: record?.embeddable === undefined ? 'Not provided' : record.embeddable ? 'Allowed by metadata' : 'Not allowed', age: record?.ageRestricted === undefined ? 'Not provided' : record.ageRestricted ? 'Age-restricted' : 'No reported age flag' };
}