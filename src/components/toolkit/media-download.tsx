import { useState, useRef } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, Download, Loader2, Music, Plus, RotateCcw, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMediaDownload, type PublicRecord } from '@/lib/tool-data.functions';
import { MEDIA_DEADLINE_MS, withinDeadline } from '@/lib/request-deadline';
import { SiteImage } from './site-image';
import { downloadText } from './result-controls';
type GetMedia=ReturnType<typeof useServerFn<typeof getMediaDownload>>;
type Quality='1080'|'720'|'480'|'360';
type Bitrate='128'|'192'|'320';
// Fetch through the same-origin proxy, retrying alternate instances when a file comes back empty.
export async function fetchMedia(getMedia:GetMedia,id:string,mode:'audio'|'video',quality:Quality,onProgress:(p:number)=>void,bitrate:Bitrate='192',onStage?:(stage:string)=>void):Promise<{blob:Blob;filename:string}>{
 let deadline=AbortSignal.timeout(MEDIA_DEADLINE_MS);
 const url=`https://www.youtube.com/watch?v=${id}`;
 let src=await withinDeadline(getMedia({data:{url,mode,quality,bitrate}}),deadline);
 if(src.error)throw new Error(src.error);
 if(src.dedicated){
  deadline=AbortSignal.timeout(300_000);
  while(src.state==='queued'||src.state==='processing'){
   onStage?.(src.state==='queued'?'Queued':'Converting');
   await withinDeadline(new Promise(resolve=>setTimeout(resolve,1000)),deadline);
   src=await withinDeadline(getMedia({data:{url,mode,quality,bitrate,job:src.job}}),deadline);
   if(src.error)throw new Error(src.error);
  }
  if(src.state!=='ready'||!src.job)throw new Error('The converted file is not available. Please try again.');
 }
 if(!src.url&&!src.job)throw new Error('Download unavailable. Please try again later.');
 onStage?.('Downloading');
 for(let attempt=0;attempt<(src.dedicated?1:3)&&(src.url||src.job);attempt++){
  deadline.throwIfAborted();
  if(attempt>0){if(src.next===undefined)break;src=await withinDeadline(getMedia({data:{url,mode,quality,bitrate,attempt:src.next}}),deadline);if(!src.url)break;}
  const ctl=new AbortController();let stall:ReturnType<typeof setTimeout>|undefined;
  const arm=()=>{clearTimeout(stall);stall=setTimeout(()=>ctl.abort(),20000);};
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
  try{
   arm();const signal=AbortSignal.any([deadline,ctl.signal]);
   const path=src.dedicated&&src.job?`/api/media?job=${encodeURIComponent(src.job)}`:`/api/media?u=${encodeURIComponent(src.url??'')}`;
   const r=await fetch(path,{signal});
   if(!r.ok||!r.body)continue;
   const type=r.headers.get('content-type')??'';
   if(!/^(audio\/|video\/|application\/octet-stream)/i.test(type))throw new Error('The service did not return a media file.');
   const total=Number(r.headers.get('Estimated-Content-Length')??0);
   reader=r.body.getReader();const parts:BlobPart[]=[];let got=0;
   for(;;){arm();const {done,value}=await withinDeadline(reader.read(),signal);if(done)break;parts.push(new Uint8Array(value).buffer);got+=value.length;onProgress(total?Math.min(99,Math.round(got/total*100)):-got);}
   if(src.dedicated&&src.size!==got)throw new Error('The file transfer was incomplete. Please retry.');
   if(got>1024)return {blob:new Blob(parts,{type}),filename:src.filename??(mode==='video'?'video.mp4':'audio.mp3')};
  }catch(error){if(deadline.aborted)throw new Error(src.dedicated?'The download took longer than 5 minutes. Please try again later.':'The download took longer than 60 seconds. Please try again later.');if(src.dedicated)throw error;}
  finally{clearTimeout(stall);void reader?.cancel().catch(()=>{});ctl.abort();}
 }
 throw new Error('The download service could not prepare this video. Please try again later or choose a shorter permitted video.');
}
function saveBlob(blob:Blob,name:string){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
const progressLabel=(p:number)=>p>0?`${p}%`:p<0?`${(-p/1048576).toFixed(1)} MB`:'Preparing…';
const VIDEO_TOOLS=['Video Downloader','YouTube URL Downloader','YouTube Shorts Downloader','YouTube to MP4'];
export function MediaDownload({tool,id}:{tool:string;id:string|null}) {
 const getMedia=useServerFn(getMediaDownload);
 const [mode,setMode]=useState<'audio'|'video'>(VIDEO_TOOLS.includes(tool)?'video':'audio');
 const [quality,setQuality]=useState<Quality>('720');const [bitrate,setBitrate]=useState<Bitrate>('192');
 const [busy,setBusy]=useState(false);const [err,setErr]=useState('');const [done,setDone]=useState<{blob:Blob;filename:string}|null>(null);const [progress,setProgress]=useState(0);const [stage,setStage]=useState('Preparing');
 if(!id)return <p className="text-primary">Enter a valid video URL or video ID.</p>;
 const options:{v:string;label:string;hint:string}[]=mode==='audio'?[{v:'128',label:'128 kbps',hint:'Smaller file'},{v:'192',label:'192 kbps',hint:'Best pick'},{v:'320',label:'320 kbps',hint:'Best sound'}]:[{v:'1080',label:'1080p',hint:'Full HD'},{v:'720',label:'720p',hint:'Best pick'},{v:'480',label:'480p',hint:'Saves data'},{v:'360',label:'360p',hint:'Smallest'}];
 const selected=mode==='audio'?bitrate:quality;
 const pick=(v:string)=>{setDone(null);setErr('');if(mode==='audio')setBitrate(v as Bitrate);else setQuality(v as Quality);};
 const start=async()=>{setBusy(true);setErr('');setDone(null);setProgress(0);setStage('Preparing');try{const f=await fetchMedia(getMedia,id,mode,quality,setProgress,bitrate,setStage);saveBlob(f.blob,f.filename);setDone(f);}catch(e){setErr(e instanceof Error?e.message:'The download service is unavailable right now. Please try again later.');}finally{setBusy(false);}};
 return <div className="dl-panel">
  <div className="dl-switch" role="tablist" aria-label="File type">{(['audio','video'] as const).map(m=><button key={m} type="button" role="tab" aria-selected={mode===m} disabled={busy} className={mode===m?'is-on':''} onClick={()=>{setMode(m);setDone(null);setErr('');}}>{m==='audio'?<Music/>:<Video/>}{m==='audio'?'MP3 audio':'MP4 video'}</button>)}</div>
  <div className="dl-options" role="radiogroup" aria-label={mode==='audio'?'Audio quality':'Video quality'}>{options.map(o=><button key={o.v} type="button" role="radio" aria-checked={selected===o.v} disabled={busy} className={selected===o.v?'is-on':''} onClick={()=>pick(o.v)}><strong>{o.label}</strong><span>{o.hint}</span></button>)}</div>
  <Button size="lg" className="dl-go" disabled={busy} onClick={()=>void start()}>{busy?<Loader2 className="animate-spin"/>:<Download/>}{busy?`${stage}… ${progress?progressLabel(progress):''}`:`Convert & download ${mode==='audio'?'MP3':'MP4'}`}</Button>
  {busy&&<div className="dl-bar" aria-hidden="true"><span style={{width:progress>0?`${progress}%`:'35%'}} className={progress>0?'':'is-indeterminate'}/></div>}
  {done&&<div className="dl-done"><CheckCircle2/><div className="min-w-0"><strong className="block break-words">{done.filename}</strong><span>{(done.blob.size/1048576).toFixed(1)} MB saved to your device</span></div><Button variant="outline" size="sm" onClick={()=>saveBlob(done.blob,done.filename)}><Download/>Save again</Button></div>}
  {err&&<div role="alert" className="dl-error"><p>{err}</p><Button variant="outline" size="sm" onClick={()=>void start()}><RotateCcw/>Try again</Button></div>}
  <ul className="dl-facts"><li>Free, no sign-up</li><li>No pop-ups or redirects</li><li>Works on phone, tablet and computer</li></ul>
 </div>;
}
type RowState={state:'idle'|'busy'|'done'|'error';progress:number;note:string};
const idle:RowState={state:'idle',progress:0,note:''};
// Playlist queue: one shared format/quality choice, selectable rows, and sequential batch saving so the free service is not overloaded.
export function PlaylistDownloader({records,next,busy,onMore}:{records:PublicRecord[];next?:string|undefined;busy:boolean;onMore:()=>void}){
 const getMedia=useServerFn(getMediaDownload);
 const [mode,setMode]=useState<'audio'|'video'>('audio');const [quality,setQuality]=useState<Quality>('720');const [bitrate,setBitrate]=useState<Bitrate>('192');
 const [rows,setRows]=useState<Record<string,RowState>>({});const [picked,setPicked]=useState<Set<string>>(new Set());const [running,setRunning]=useState(false);const stop=useRef(false);
 if(!records.length)return null;
 const ids=records.map(v=>v.id);const set=(id:string,r:Partial<RowState>)=>setRows(p=>({...p,[id]:{...(p[id]??idle),...r}}));
 const one=async(id:string)=>{set(id,{state:'busy',progress:0,note:''});try{const f=await fetchMedia(getMedia,id,mode,quality,n=>set(id,{progress:n}),bitrate);saveBlob(f.blob,f.filename);set(id,{state:'done',note:`${(f.blob.size/1048576).toFixed(1)} MB saved`});}catch(e){set(id,{state:'error',note:e instanceof Error?e.message:'Download failed.'});}};
 const batch=async(list:string[])=>{setRunning(true);stop.current=false;for(const id of list){if(stop.current)break;if(rows[id]?.state==='done')continue;await one(id);}setRunning(false);};
 const doneCount=ids.filter(i=>rows[i]?.state==='done').length;const failed=ids.filter(i=>rows[i]?.state==='error');
 const allPicked=picked.size===ids.length;const toggle=(id:string)=>setPicked(p=>{const n=new Set(p);if(n.has(id))n.delete(id);else n.add(id);return n;});
 const options=mode==='audio'?[['128','128 kbps'],['192','192 kbps'],['320','320 kbps']]:[['1080','1080p'],['720','720p'],['480','480p'],['360','360p']];
 const selected=mode==='audio'?bitrate:quality;
 return <div className="dl-panel space-y-4">
  <div className="dl-switch" role="tablist" aria-label="File type">{(['audio','video'] as const).map(m=><button key={m} type="button" role="tab" aria-selected={mode===m} disabled={running} className={mode===m?'is-on':''} onClick={()=>setMode(m)}>{m==='audio'?<Music/>:<Video/>}{m==='audio'?'MP3 audio':'MP4 video'}</button>)}</div>
  <div className="dl-options" role="radiogroup" aria-label="Quality">{options.map(([v,l])=><button key={v} type="button" role="radio" aria-checked={selected===v} disabled={running} className={selected===v?'is-on':''} onClick={()=>mode==='audio'?setBitrate(v as Bitrate):setQuality(v as Quality)}><strong>{l}</strong></button>)}</div>
  <div className="flex flex-wrap items-center gap-2">
   {running?<Button size="lg" variant="outline" onClick={()=>{stop.current=true;}}>Stop after current</Button>:<Button size="lg" className="dl-go" onClick={()=>void batch(picked.size?ids.filter(i=>picked.has(i)):ids)}><Download/>{picked.size?`Download ${picked.size} selected`:`Download all ${ids.length}`} as {mode==='audio'?'MP3':'MP4'}</Button>}
   {!running&&failed.length>0&&<Button variant="outline" onClick={()=>void batch(failed)}><RotateCcw/>Retry {failed.length} failed</Button>}
   <Button variant="outline" onClick={()=>downloadText(records.map((v,i)=>`${i+1}. ${v.title} — https://www.youtube.com/watch?v=${v.id}`).join('\n'),'playlist-links.txt')}><Download/>Export links</Button>
  </div>
  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground"><label className="flex items-center gap-2"><input type="checkbox" checked={allPicked} onChange={()=>setPicked(allPicked?new Set():new Set(ids))}/>Select all</label><span>{doneCount} of {records.length} saved</span></div>
  <div className="dl-bar" aria-hidden="true"><span style={{width:`${records.length?Math.round(doneCount/records.length*100):0}%`}}/></div>
  <ul className="space-y-3">{records.map((v,i)=>{const r=rows[v.id]??idle;return <li key={`${v.id}-${i}`} className="grid grid-cols-[auto_96px_minmax(0,1fr)] items-start gap-3 border-b border-border pb-3">
   <input type="checkbox" className="mt-2" aria-label={`Select ${v.title}`} checked={picked.has(v.id)} onChange={()=>toggle(v.id)}/>
   {v.thumbnail?<SiteImage src={v.thumbnail} alt="" width={96} height={54} className="w-24 rounded-md"/>:<span/>}
   <div className="min-w-0 space-y-2"><p className="text-sm font-semibold break-words"><span className="text-muted-foreground">{i+1}. </span>{v.title}</p>
    <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="outline" disabled={running||r.state==='busy'} onClick={()=>void one(v.id)}>{r.state==='busy'?<Loader2 className="animate-spin"/>:r.state==='done'?<CheckCircle2/>:<Download/>}{r.state==='busy'?progressLabel(r.progress):r.state==='done'?'Save again':mode==='audio'?'MP3':'MP4'}</Button>{r.note&&<span role={r.state==='error'?'alert':undefined} className={`text-xs ${r.state==='error'?'text-primary':'text-muted-foreground'}`}>{r.note}</span>}</div></div></li>;})}</ul>
  {next&&<Button variant="outline" disabled={busy} onClick={onMore}><Plus/>Load more videos</Button>}
 </div>;
}
