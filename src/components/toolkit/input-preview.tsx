import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Loader2 } from 'lucide-react';
import { parseYouTubeInput } from '@/lib/tool-engine';
import { getToolData } from '@/lib/tool-data.functions';
import { SiteImage } from './site-image';

export function InputPreview({ input }: { input: string }) {
  const getData = useServerFn(getToolData);
  const [settled, setSettled] = useState('');
  const [failedImage, setFailedImage] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSettled(input.trim()), 450);
    return () => clearTimeout(timer);
  }, [input]);
  let videoId = '';
  let channelInput = '';
  try {
    const parsed = parseYouTubeInput(input.trim());
    if (parsed.kind === 'video') videoId = parsed.value;
    if (parsed.kind === 'channel' || parsed.kind === 'handle') channelInput = input.trim();
  } catch { /* No preview for incomplete links, topics, or calculator numbers. */ }
  const { data, isFetching } = useQuery({
    queryKey: ['channel-image-preview', channelInput],
    queryFn: () => getData({ data: { input: channelInput, mode: 'channel', query: '', order: 'relevance' } }),
    enabled: Boolean(channelInput) && settled === channelInput,
    staleTime: 30_000,
    gcTime: 300_000,
    retry: false,
  });
  const record = data?.records.length === 1 ? data.records[0] : undefined;
  const src = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : record?.thumbnail;
  if (src && failedImage !== src) return <div className={videoId ? 'mx-auto mt-4 w-full max-w-sm overflow-hidden rounded-md border border-border bg-card' : 'mx-auto mt-4 flex w-full max-w-sm items-center gap-4 border-t border-border py-4 text-left'}>
    <SiteImage key={src} src={src} alt={videoId ? 'Video thumbnail preview' : `${record?.title ?? 'Channel'} profile preview`} width={videoId ? 480 : 88} height={videoId ? 360 : 88} priority onError={() => setFailedImage(src)} className={videoId ? 'aspect-video w-full object-cover' : 'size-22 shrink-0 rounded-full object-cover'} />
    {!videoId && <div className="min-w-0"><p className="font-semibold break-words">{record?.title}</p>{record?.handle && <p className="text-sm text-muted-foreground break-words">{record.handle}</p>}</div>}
  </div>;
  if (channelInput && (settled !== channelInput || isFetching)) return <div role="status" className="mx-auto mt-4 flex min-h-22 max-w-sm items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" />Loading channel image…</div>;
  if (channelInput && data?.error) return <p className="mt-4 text-sm text-muted-foreground">Channel image unavailable. You can still submit the link.</p>;
  return null;
}