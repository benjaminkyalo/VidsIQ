import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Download, Loader2, Music, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMediaDownload, type PublicRecord } from '@/lib/tool-data.functions';
import { MEDIA_DEADLINE_MS, withinDeadline } from '@/lib/request-deadline';
import { SiteImage } from './site-image';
import { downloadText } from './result-controls';
type GetMedia=ReturnType<typeof useServerFn<typeof getMediaDownload>>;
type Quality='1080'|'720'|'480'|'360';
// Fetch through the same-origin proxy, retrying alternate instances when a file comes back empty.
export async function fetchMedia(getMedia:GetMedia,id:string,mode:'audio'|'video',quality:Quality,onProgress:(p:number)=>void):Promise<{blob:Blob;filename:string}>{
 const deadline=AbortSignal.timeout(MEDIA_DEADLINE_MS);
 const url=`https://www.youtube.com/watch?v=${id}`;
 let src=await withinDeadline(getMedia({data:{url,mode,quality}}),deadline);
 if(src.error||!src.url)throw new Error(src.error??'Download unavailable. Please try again later.');
 for(let attempt=0;attempt<3&&src.url;attempt++){
  deadline.throwIfAborted();
  if(attempt>0){if(src.next===undefined)break;src=await withinDeadline(getMedia({data:{url,mode,quality,attempt:src.next}}),deadline);if(!src.url)break;}
  const ctl=new AbortController();let stall:ReturnType<typeof setTimeout>|undefined;
  const arm=()=>{clearTimeout(stall);stall=setTimeout(()=>ctl.abort(),20000);};
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
  try{
   arm();const signal=AbortSignal.any([deadline,ctl.signal]);
   const r=await fetch(`/api/media?u=${encodeURIComponent(src.url)}`,{signal});
   if(!r.ok||!r.body)continue;
   const type=r.headers.get('content-type')??'';
   if(!/^(audio\/|video\/|application\/octet-stream)/i.test(type))throw new Error('The service did not return a media file.');
   const total=Number(r.headers.get('Estimated-Content-Length')??0);
   reader=r.body.getReader();const parts:BlobPart[]=[];let got=0;
   for(;;){arm();const {done,value}=await withinDeadline(reader.read(),signal);if(done)break;parts.push(new Uint8Array(value).buffer);got+=value.length;onProgress(total?Math.min(99,Math.round(got/total*100)):-got);}
   if(got>1024)return {blob:new Blob(parts,{type}),filename:src.filename??(mode==='video'?'video.mp4':'audio.mp3')};
  }catch(error){if(deadline.aborted)throw new Error('The download took longer than 60 seconds. Please try again later.');}
  finally{clearTimeout(stall);void reader?.cancel().catch(()=>{});ctl.abort();}
 }
 throw new Error('The free download service could not prepare this video. Please try again later or choose a shorter permitted video.');
}
function saveBlob(blob:Blob,name:string){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
const progressLabel=(p:number)=>p>0?`${p}%`:p<0?`${(-p/1048576).toFixed(1)} MB`:'Preparing…';
export function MediaDownload({tool,id}:{tool:string;id:string|null}) {
 const getMedia=useServerFn(getMediaDownload);
 const video=['Video Downloader','YouTube URL Downloader','YouTube Shorts Downloader','YouTube to MP4'].includes(tool);
 const [format,setFormat]=useState(video?'720':'mp3');const [busy,setBusy]=useState(false);const [err,setErr]=useState('');const [done,setDone]=useState('');const [progress,setProgress]=useState(0);
 if(!id)return <p className="text-primary">Enter a valid video URL or video ID.</p>;
 return <div className="space-y-4">
  <p className="text-sm text-muted-foreground">Download {video?'MP4 video':'MP3 audio'} of content you own or have permission to download.</p>
  <Select value={format} onValueChange={setFormat}><SelectTrigger aria-label="Download format"><SelectValue/></SelectTrigger><SelectContent>{(video?['1080','720','480','360']:['mp3']).map(v=><SelectItem key={v} value={v}>{v==='mp3'?'MP3 audio':`MP4 ${v}p`}</SelectItem>)}</SelectContent></Select>
  <Button disabled={busy} onClick={async()=>{setBusy(true);setErr('');setDone('');setProgress(0);try{const f=await fetchMedia(getMedia,id,video?'video':'audio',format==='mp3'?'720':format as Quality,setProgress);saveBlob(f.blob,f.filename);setDone(`${f.filename} (${(f.blob.size/1048576).toFixed(1)} MB)`);}catch(e){setErr(e instanceof Error?e.message:'The download service is unavailable right now. Please try again later.');}finally{setBusy(false);}}}>{busy?<Loader2 className="animate-spin"/>:<Download/>}{busy?`Downloading… ${progressLabel(progress)}`:'Download'}</Button>
  {done&&<p className="text-sm text-muted-foreground">Downloaded: {done}</p>}
  {err&&<p role="alert" className="text-sm text-primary">{err}</p>}
  <p className="text-sm text-muted-foreground">Downloads are prepared by a free third-party service and may occasionally be unavailable.</p>
 </div>;
}
function PlaylistRow({v,getMedia}:{v:PublicRecord;getMedia:GetMedia}){
 const [busy,setBusy]=useState<''|'audio'|'video'>('');const [progress,setProgress]=useState(0);const [err,setErr]=useState('');const [ok,setOk]=useState('');
 const go=async(mode:'audio'|'video')=>{setBusy(mode);setErr('');setOk('');setProgress(0);try{const f=await fetchMedia(getMedia,v.id,mode,'720',setProgress);saveBlob(f.blob,f.filename);setOk(`${(f.blob.size/1048576).toFixed(1)} MB saved`);}catch(e){setErr(e instanceof Error?e.message:'Download failed.');}finally{setBusy('');}};
 return <li className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-border pb-3">{v.thumbnail?<SiteImage src={v.thumbnail} alt="" width={96} height={54} className="w-24 rounded-md"/>:<span/>}<div className="min-w-0 space-y-2"><a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="block text-sm font-semibold break-words">{v.title}</a><div className="flex flex-wrap gap-2"><Button size="sm" disabled={!!busy} onClick={()=>void go('audio')}>{busy==='audio'?<Loader2 className="animate-spin"/>:<Music/>}{busy==='audio'?progressLabel(progress):'MP3'}</Button><Button size="sm" variant="outline" disabled={!!busy} onClick={()=>void go('video')}>{busy==='video'?<Loader2 className="animate-spin"/>:<Download/>}{busy==='video'?progressLabel(progress):'MP4 720p'}</Button></div>{ok&&<p className="text-xs text-muted-foreground">{ok}</p>}{err&&<p role="alert" className="text-xs text-primary">{err}</p>}</div></li>;
}
export function PlaylistDownloader({records,next,busy,onMore}:{records:PublicRecord[];next?:string|undefined;busy:boolean;onMore:()=>void}){
 const getMedia=useServerFn(getMediaDownload);
 if(!records.length)return null;
 return <div className="space-y-4"><p className="text-sm text-muted-foreground">{records.length} videos loaded. Save items you own or have permission to download. The free conversion service handles one file at a time best.</p><Button variant="outline" onClick={()=>downloadText(records.map((v,i)=>`${i+1}. ${v.title} — https://www.youtube.com/watch?v=${v.id}`).join('\n'),'playlist-links.txt')}><Download/>Export all links</Button><ul className="space-y-3">{records.map((v,i)=><PlaylistRow key={`${v.id}-${i}`} v={v} getMedia={getMedia}/>)}</ul>{next&&<Button variant="outline" disabled={busy} onClick={onMore}><Plus/>Load more videos</Button>}</div>;
}
