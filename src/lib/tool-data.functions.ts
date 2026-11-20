import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { parseYouTubeInput } from './tool-engine';
const requestSchema = z.object({ input: z.string().trim().min(1).max(2000), mode: z.enum(['video','channel','search','comments','history','rank','dislikes','channelSearch','report','playlist']), query: z.string().trim().max(200).default(''), pageToken: z.string().max(500).optional(), order: z.enum(['relevance','date','viewCount']).default('relevance') });
export type PublicRecord = { recentUploads?: PublicRecord[]; uploadsError?: string; channelKeywords?: string;  id: string; title: string; description: string; thumbnail: string; channelId: string; channelTitle: string; handle?: string | undefined; publishedAt: string; views?: string | undefined; likes?: string | undefined; comments?: string | undefined; subscribers?: string | undefined; hiddenSubscribers?: boolean | undefined; videos?: string | undefined; duration?: string | undefined; regionRestriction?: { allowed?: string[]; blocked?: string[] } | undefined; tags: string[]; embeddable?: boolean | undefined; privacy?: string | undefined; ageRestricted?: boolean | undefined; uploads?: string | undefined; banner?: string | undefined; live?: string | undefined };
export type CommentRecord = { id: string; author: string; text: string; likes: number; publishedAt: string; replies: number };
export type DataResponse = { records: PublicRecord[]; comments: CommentRecord[]; nextPageToken?: string | undefined; error?: string | undefined; status?: number | undefined; dislikes?: number | undefined; likes?: number | undefined };
type ApiItem = { id?: string | undefined | { videoId?: string | undefined; channelId?: string | undefined }; snippet?: { title?: string | undefined; description?: string | undefined; channelId?: string | undefined; channelTitle?: string | undefined; publishedAt?: string | undefined; customUrl?: string | undefined; tags?: string[]; liveBroadcastContent?: string | undefined; thumbnails?: Record<string,{ url?: string | undefined }>; resourceId?: { videoId?: string | undefined }; topLevelComment?: { id?: string | undefined; snippet?: { authorDisplayName?: string | undefined; textOriginal?: string | undefined; likeCount?: number | undefined; publishedAt?: string | undefined } }; totalReplyCount?: number | undefined }; statistics?: { viewCount?: string | undefined; likeCount?: string | undefined; commentCount?: string | undefined; subscriberCount?: string | undefined; hiddenSubscriberCount?: boolean | undefined; videoCount?: string | undefined }; contentDetails?: { regionRestriction?: { allowed?: string[]; blocked?: string[] }; duration?: string | undefined; contentRating?: { ytRating?: string | undefined }; relatedPlaylists?: { uploads?: string | undefined } }; status?: { privacyStatus?: string | undefined; embeddable?: boolean | undefined }; brandingSettings?: { channel?: { keywords?: string }; image?: { bannerExternalUrl?: string | undefined } } };
function record(v: ApiItem): PublicRecord {
 const s=v.snippet; const stats=v.statistics;
 return { ...(v.brandingSettings?.channel?.keywords ? { channelKeywords: v.brandingSettings.channel.keywords } : {}), id: typeof v.id === 'string' ? v.id : v.id?.videoId ?? v.id?.channelId ?? s?.resourceId?.videoId ?? '', title:s?.title ?? '',description:s?.description ?? '',thumbnail:s?.thumbnails?.['high']?.url ?? s?.thumbnails?.['medium']?.url ?? s?.thumbnails?.['default']?.url ?? '',channelId:s?.channelId ?? '',channelTitle:s?.channelTitle ?? '',handle:s?.customUrl,publishedAt:s?.publishedAt ?? '',views:stats?.viewCount,likes:stats?.likeCount,comments:stats?.commentCount,subscribers:stats?.subscriberCount,hiddenSubscribers:stats?.hiddenSubscriberCount,videos:stats?.videoCount,duration:v.contentDetails?.duration,tags:s?.tags ?? [],embeddable:v.status?.embeddable,privacy:v.status?.privacyStatus,regionRestriction:v.contentDetails?.regionRestriction,ageRestricted:v.contentDetails ? v.contentDetails?.contentRating?.ytRating === 'ytAgeRestricted' : undefined,uploads:v.contentDetails?.relatedPlaylists?.uploads,banner:v.brandingSettings?.image?.bannerExternalUrl,live:s?.liveBroadcastContent };
}
export const getToolData = createServerFn({ method:'POST' }).inputValidator((data:unknown) => requestSchema.parse(data)).handler(async ({data}):Promise<DataResponse> => {
 const empty={records:[],comments:[]};
 try {
  const parsed=parseYouTubeInput(data.input);
  if(data.mode==='dislikes') {
   if(parsed.kind!=='video') return {...empty,error:'Enter a video link or video ID.'};
   const r=await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${parsed.value}`,{signal:AbortSignal.timeout(15000)});
   if(!r.ok) return {...empty,error:`Dislike estimates are unavailable (${r.status}).`,status:r.status};
   const result=await r.json() as {dislikes?:number;likes?:number};
   return {...empty,dislikes:result.dislikes,likes:result.likes};
  }
  const googleKey=process.env['GOOGLE_API_KEY'] || process.env['YOUTUBE_API_KEY']; const key=process.env['UDC_YOUTUBE_DATA_API_2_API_KEY']; const lovableKey=process.env['LOVABLE_API_KEY'];
  if(!googleKey && (!key || !lovableKey)) return {...empty,error:'The YouTube connection is not configured.'};
  const { cachedPublicJson } = await import('./public-data-cache.server');
  async function api(endpoint:string,params:Record<string,string>) {
   const qs=new URLSearchParams(Object.entries(params).sort(([a],[b])=>a.localeCompare(b)));
   const url=`https://connector-gateway.lovable.dev/udc_youtube_data_api_2/youtube/v3/${endpoint}?${qs}`;
   return cachedPublicJson(url,endpoint,async()=>{
     const response=googleKey ? await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${qs}&key=${encodeURIComponent(googleKey)}`,{signal:AbortSignal.timeout(20000)}) : await fetch(url,{headers:{Authorization:`Bearer ${lovableKey}`,'X-Connection-Api-Key':key ?? ''},signal:AbortSignal.timeout(20000)});
    if(!response.ok) { const body=await response.text(); console.error('YouTube request failed',response.status,body); throw new Error(`YouTube could not complete this request (${response.status}). Check API access, quota, or whether comments are enabled.`); }
    return await response.json() as {items?:ApiItem[];nextPageToken?:string};
   });
  }
  if(data.mode==='search' || data.mode==='rank' || data.mode==='channelSearch') {
   const x=await api('search',{part:'snippet',q:data.query || parsed.value,type:data.mode==='channelSearch' ? 'channel' : 'video',maxResults:'50',order:data.order,...(data.pageToken?{pageToken:data.pageToken}:{})});
   return {...empty,records:(x.items ?? []).map(record),nextPageToken:x.nextPageToken};
  }
  if(data.mode==='playlist') {
   if(!parsed.playlist) return {...empty,error:'Enter a YouTube playlist link (it contains list=).'};
   const x=await api('playlistItems',{part:'snippet',playlistId:parsed.playlist,maxResults:'50',...(data.pageToken?{pageToken:data.pageToken}:{})});
   const items=(x.items??[]).map(v=>record({...v,id:v.snippet?.resourceId?.videoId ?? ''})).filter(v=>v.id&&v.title!=='Private video'&&v.title!=='Deleted video');
   if(!items.length&&!data.pageToken) return {...empty,error:'This playlist is empty, private, or unavailable.'};
   return {...empty,records:items,nextPageToken:x.nextPageToken};
  }
  if(data.mode==='comments') {
   if(parsed.kind!=='video') return {...empty,error:'Enter a video URL or ID to load comments.'};
   const x=await api('commentThreads',{part:'snippet',videoId:parsed.value,maxResults:'100',textFormat:'plainText',order:'relevance',...(data.pageToken?{pageToken:data.pageToken}:{})});
   return {...empty,comments:(x.items ?? []).map(v=>({id:v.snippet?.topLevelComment?.id ?? '',author:v.snippet?.topLevelComment?.snippet?.authorDisplayName ?? '',text:v.snippet?.topLevelComment?.snippet?.textOriginal ?? '',likes:v.snippet?.topLevelComment?.snippet?.likeCount ?? 0,publishedAt:v.snippet?.topLevelComment?.snippet?.publishedAt ?? '',replies:v.snippet?.totalReplyCount ?? 0})),nextPageToken:x.nextPageToken};
  }
  if(data.mode==='video'&&parsed.kind!=='video') {
   if(parsed.kind!=='query')return {...empty,error:'This tool requires a video URL, video ID, or video search phrase.'};
   const results=await api('search',{part:'snippet',q:parsed.value,type:'video',maxResults:'10'});
   return {...empty,records:(results.items??[]).map(record),...(!results.items?.length?{error:'No public videos match that search.'}:{})};
  }
  let channelId=parsed.kind==='channel'?parsed.value:'';
  if(parsed.kind==='video') {
   const x=await api('videos',{part:'snippet,statistics,contentDetails,status',id:parsed.value});
   if(!x.items?.length) return {...empty,error:'Video unavailable. It may be private, deleted, restricted, or an invalid ID; public data cannot distinguish these reliably.'};
   if(data.mode==='video') return {...empty,records:x.items.map(record)};
   channelId=x.items[0]?.snippet?.channelId ?? '';
  }
  let channel;
  if(parsed.kind==='handle') channel=await api('channels',{part:'snippet,statistics,contentDetails,brandingSettings',forHandle:parsed.value});
  else if(channelId) channel=await api('channels',{part:'snippet,statistics,contentDetails,brandingSettings',id:channelId});
  else {
   const found=await api('search',{part:'snippet',q:parsed.value,type:'channel',maxResults:'10'});
   return {...empty,records:(found.items ?? []).map(record)};
  }
  if(!channel.items?.length) return {...empty,error:'No public channel found for this input.'};
  if(data.mode==='report') {
   const first=channel.items[0];
   if(!first)return {...empty,error:'Channel unavailable.'};
   const report=record(first);if(first.brandingSettings?.channel?.keywords)report.channelKeywords=first.brandingSettings.channel.keywords;
   const uploads=first.contentDetails?.relatedPlaylists?.uploads;
   if(uploads)try{
    const list=await api('playlistItems',{part:'snippet',playlistId:uploads,maxResults:'8'});
    const ids=(list.items??[]).map(v=>v.snippet?.resourceId?.videoId).filter((id):id is string=>Boolean(id));
    if(ids.length){const videos=await api('videos',{part:'snippet,statistics,contentDetails',id:ids.join(',')});const items=(videos.items??[]).map(record);report.recentUploads=ids.flatMap(id=>items.filter(v=>v.id===id));}
   }catch{report.uploadsError='Recent uploads could not be loaded. Try submitting again.';}
   return {...empty,records:[report]};
  }
  if(data.mode==='history') {
   const uploads=channel.items[0]?.contentDetails?.relatedPlaylists?.uploads;
   if(!uploads) return {...empty,error:'Upload history is unavailable for this channel.'};
   const x=await api('playlistItems',{part:'snippet',playlistId:uploads,maxResults:'50',...(data.pageToken?{pageToken:data.pageToken}:{})});
   return {...empty,records:(x.items ?? []).map(v=>record({...v,id:v.snippet?.resourceId?.videoId ?? ''})),nextPageToken:x.nextPageToken};
  }
  return {...empty,records:channel.items.map(record)};
 } catch(e) { return {...empty,error:e instanceof Error ? e.message : 'The tool request could not complete. Please try again.'}; }
});
const downloadSchema = z.object({ url: z.string().trim().min(1).max(2000), mode: z.enum(['audio','video']), quality: z.enum(['1080','720','480','360']).default('720'), bitrate: z.enum(['128','192','320']).default('192'), attempt: z.number().int().min(0).max(5).default(0), job: z.string().regex(/^([a-f0-9]{32}\.[a-f0-9]{64}|apify:[A-Za-z0-9]{10,24})$/).optional() });
const COBALT_INSTANCES=['https://co.otomir23.me/','https://api.cobalt.liubquanti.click/'];
export type MediaDownloadResponse = { next?: number | undefined; url?: string | undefined; filename?: string | undefined; error?: string | undefined; job?: string | undefined; state?: 'queued'|'processing'|'ready'|'error' | undefined; size?: number | undefined; dedicated?: boolean | undefined };
export const getMediaDownload = createServerFn({ method:'POST' }).inputValidator((d:unknown) => downloadSchema.parse(d)).handler(async ({data}):Promise<MediaDownloadResponse> => {
 try {
  const parsed=parseYouTubeInput(data.url);
  if(parsed.kind!=='video') return {error:'Enter a video link or video ID.'};
  const apify=await import('./apify-service');
  if(data.job?.startsWith('apify:')||apify.apifyConfigured()){
   try{const j=data.job?await apify.checkApify(data.job):await apify.startApify(parsed.value,data.mode,data.quality);return {dedicated:true,...j};}
   catch(error){return {dedicated:true,error:error instanceof Error?error.message:'Conversion unavailable.'};}
  }
  const serviceUrl=process.env['CONVERSION_SERVICE_URL'];
  const serviceKey=process.env['CONVERTER_API_KEY'];
  if(serviceUrl || serviceKey || data.job){
   if(!serviceUrl || !serviceKey)return {error:'The dedicated conversion service is not fully configured.'};
   const {requestConversion}=await import('./conversion-service');
   try{
    const job=await requestConversion({url:serviceUrl,key:serviceKey},{video_id:parsed.value,mode:data.mode,quality:data.quality,bitrate:data.bitrate},data.job);
    return {dedicated:true,job:job.ticket,state:job.state,filename:job.filename,size:job.size,error:job.error};
   }catch(error){return {dedicated:true,error:error instanceof Error?error.message:'Conversion unavailable.'};}
  }
  const watchUrl=`https://www.youtube.com/watch?v=${parsed.value}`;
  const body=data.mode==='audio' ? {url:watchUrl,downloadMode:'audio',audioFormat:'mp3',audioBitrate:data.bitrate} : {url:watchUrl,videoQuality:data.quality};
  // Race every remaining service at once and keep the first ready file, so one slow host never delays the user.
  const ask=async(i:number)=>{const response=await fetch(COBALT_INSTANCES[i] ?? '',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw new Error('bad');const r=await response.json() as {status?:string;url?:string;filename?:string};if(r.status!=='tunnel'||!r.url)throw new Error('none');return {i,url:r.url,filename:r.filename ?? 'download'};};
  const order=COBALT_INSTANCES.map((_,i)=>i).filter(i=>i>=data.attempt);
  try{const w=await Promise.any(order.map(ask));const rest=order.filter(i=>i!==w.i&&i>data.attempt-1&&i>w.i);return {url:w.url,filename:w.filename,next:rest[0]};}
  catch{return {error:'The download service is unavailable right now. Please try again later.'};}
 } catch { return {error:'The download service is unavailable right now. Please try again later.'}; }
});
