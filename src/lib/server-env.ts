// Server settings pasted into /etc/vidsiq.env may carry quotes, spaces or Windows
// line endings; read every key through here so a stray character never breaks sign-in.
export function cleanSetting(value: string | undefined) {
  return (value ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
}
/** First non-empty cleaned value among the given setting names (server-only). */
export function serverSetting(...names: string[]) {
  for (const name of names) { const v = cleanSetting(process.env[name]); if (v) return v; }
  return '';
}
