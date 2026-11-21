export type TranscriptSegment = { start: number; duration: number; text: string };
const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
const decode = (s: string) => s.replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) => entities[e] ?? (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : m));

// Parses YouTube timedtext (srv3 <p t d> in ms, or legacy <text start dur> in seconds).
export function parseTimedText(xml: string): TranscriptSegment[] {
  const out: TranscriptSegment[] = [];
  for (const m of xml.matchAll(/<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g)) {
    const text = decode((m[3] ?? '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    if (text) out.push({ start: Number(m[1]) / 1000, duration: Number(m[2] ?? 0) / 1000, text });
  }
  if (out.length) return out;
  for (const m of xml.matchAll(/<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g)) {
    const text = decode(decode(m[3] ?? '')).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) out.push({ start: Number(m[1]), duration: Number(m[2] ?? 0), text });
  }
  return out;
}
const pad = (n: number, w = 2) => String(Math.floor(n)).padStart(w, '0');
export function clock(sec: number, sep = ',', hours = true) {
  const h = sec / 3600, m = (sec % 3600) / 60, s = sec % 60, ms = Math.round((sec % 1) * 1000) % 1000;
  return `${hours ? `${pad(h)}:` : ''}${pad(m)}:${pad(s)}${sep ? `${sep}${pad(ms, 3)}` : ''}`;
}
export function shortClock(sec: number) { return sec >= 3600 ? clock(sec, '', true) : clock(sec, '', false); }
export function toSrt(segs: TranscriptSegment[]) {
  return segs.map((s, i) => `${i + 1}\n${clock(s.start)} --> ${clock(s.start + (s.duration || 2))}\n${s.text}\n`).join('\n');
}
export function toVtt(segs: TranscriptSegment[]) {
  return `WEBVTT\n\n${segs.map(s => `${clock(s.start, '.')} --> ${clock(s.start + (s.duration || 2), '.')}\n${s.text}\n`).join('\n')}`;
}
export function toPlain(segs: TranscriptSegment[], timestamps: boolean) {
  return segs.map(s => timestamps ? `[${shortClock(s.start)}] ${s.text}` : s.text).join(timestamps ? '\n' : ' ');
}
