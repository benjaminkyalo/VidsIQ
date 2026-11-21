export type CreatorTool = 'Tag Generator' | 'Title Generator' | 'Description Generator' | 'Channel Name Generator';

/** Validate the returned content rather than trusting a prompt to enforce limits. */
export function creatorItems(tool: CreatorTool, text: string): string[] {
  if (tool === 'Description Generator') return text.trim() ? [text.trim()] : [];
  const lines = [...new Set(text.split('\n').map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["“]|["”]$/g, '').trim()).filter(Boolean))];
  if (tool === 'Title Generator') return lines.filter(line => line.length <= 70).slice(0, 10);
  if (tool === 'Channel Name Generator') return lines.slice(0, 15);
  const tags: string[] = [];
  for (const line of lines) {
    const tag = line.replace(/^#+/, '').trim();
    if (!tag || tags.includes(tag)) continue;
    if ([...tags, tag].join(', ').length <= 500) tags.push(tag);
    if (tags.length === 25) break;
  }
  return tags;
}