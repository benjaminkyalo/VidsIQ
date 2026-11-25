import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { getToolData } from '@/lib/tool-data.functions';
import { toolSlug } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { SiteImage } from './site-image';

export function PlayerRecommendations({ id, tool }: { id: string; tool: string }) {
  const getData = useServerFn(getToolData);
  const data = { input: `https://www.youtube.com/watch?v=${id}`, mode: 'report' as const, query: '', order: 'relevance' as const };
  const { data: response, isPending, isFetching, refetch, isError } = useQuery({
    queryKey: ['public-youtube', data], queryFn: () => getData({ data }), staleTime: 15000, gcTime: 300000, retry: false,
  });
  const channel = response?.records[0];
  const videos = channel?.recentUploads?.filter(video => video.id !== id) ?? [];
  const error = isError || response?.error || channel?.uploadsError;
  return <section aria-label="Popular songs and videos from this channel" className="border-t border-border pt-6 space-y-4">
    <h3 className="text-xl font-semibold">Popular songs/videos from {channel?.title || 'this channel'}</h3>
    {isPending ? <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin"/>Loading videos…</p> : error ? <div className="space-y-3"><p role="alert" className="text-sm text-muted-foreground">More videos are unavailable right now.</p><Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}><RefreshCw/>Try again</Button></div> : videos.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{videos.map(video => <Link key={video.id} to="/tools/$slug" params={{ slug: toolSlug(tool) }} search={{ url: `https://www.youtube.com/watch?v=${video.id}` }} className="min-w-0 group" aria-label={`Watch it Here!: ${video.title}`}>
      <SiteImage src={video.thumbnail} alt={video.title} width={480} height={270} className="w-full aspect-video object-cover rounded-md"/>
      <h4 className="text-sm font-semibold mt-3 group-hover:text-primary break-words">{video.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{video.views === undefined ? 'Views unavailable' : `${Number(video.views).toLocaleString('en-GB')} views`}</p>
      <span className="inline-flex items-center gap-2 text-sm text-primary mt-2"><Play className="size-4"/>Watch it Here!</span>
    </Link>)}</div> : <p className="text-sm text-muted-foreground">No other recent public uploads were returned.</p>}
  </section>;
}