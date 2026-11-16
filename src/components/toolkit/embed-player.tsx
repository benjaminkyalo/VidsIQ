import { useEffect, useRef, useState } from 'react';
import { Captions, CaptionsOff, Gauge, Film, Maximize, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { captionCommands, playbackError, PLAYER_ORIGIN } from '@/lib/player-controls';
const RATES=[0.5,0.75,1,1.25,1.5,1.75,2];
export function EmbedPlayer({id,offset}:{id:string;offset:number}){
  const [theater,setTheater]=useState(false);
  const [ccOn,setCcOn]=useState(true);
  const [rate,setRate]=useState(1);
  const [menu,setMenu]=useState(false);
  const [origin,setOrigin]=useState('');
  const [error,setError]=useState('');
  const [ready,setReady]=useState(false);
  const wrap=useRef<HTMLDivElement>(null);
  const frame=useRef<HTMLIFrameElement>(null);
  const post=(func:string,args:unknown[] =[])=>{try{frame.current?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),PLAYER_ORIGIN);}catch{/* player not ready yet */}};
  const listen=()=>frame.current?.contentWindow?.postMessage(JSON.stringify({event:'listening',id:'vidsiq-player',channel:'widget'}),PLAYER_ORIGIN);
  useEffect(()=>setOrigin(window.location.origin),[]);
  useEffect(()=>{
    setError('');setReady(false);setRate(1);setCcOn(true);setMenu(false);
    const receive=(event:MessageEvent)=>{
      if(event.origin!==PLAYER_ORIGIN||event.source!==frame.current?.contentWindow)return;
      try{
        const data=typeof event.data==='string'?JSON.parse(event.data):event.data;
        if(!data||typeof data!=='object')return;
        if(data.event==='onReady'||data.event==='initialDelivery'){
          setReady(true);post('addEventListener',['onError']);post('addEventListener',['onStateChange']);
        }
        if(data.event==='onError')setError(playbackError(Number(data.info)));
        if(data.event==='infoDelivery'&&typeof data.info?.playbackRate==='number')setRate(data.info.playbackRate);
      }catch{/* Ignore unrelated iframe messages. */}
    };
    window.addEventListener('message',receive);
    const timer=window.setInterval(listen,1000);
    return()=>{window.clearInterval(timer);window.removeEventListener('message',receive);};
  },[id,offset,origin]);
  useEffect(()=>{if(!theater)return;const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setTheater(false);};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);},[theater]);
  function toggleCc(){const next=!ccOn;setCcOn(next);for(const command of captionCommands(next))post(command.func,command.args);}
  function pickRate(v:number){setRate(v);setMenu(false);post('setPlaybackRate',[v]);}
  function toggleFull(){const el=wrap.current;if(!el)return;if(document.fullscreenElement)void document.exitFullscreen();else void el.requestFullscreen?.().catch(()=>{});}
  return <div className={theater?"fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/95 p-4":"space-y-2"}>
    <div ref={wrap} className="player-shell">
      <iframe ref={frame} title="YouTube video player" referrerPolicy="strict-origin-when-cross-origin" onLoad={listen} className={theater?"aspect-video w-full max-w-[min(100%,calc((100vh-6rem)*16/9))] rounded-md":"aspect-video w-full rounded-md"} src={`${PLAYER_ORIGIN}/embed/${id}?start=${offset}&autoplay=1&rel=0&controls=1&fs=1&cc_load_policy=1&cc_lang_pref=en&playsinline=1&enablejsapi=1${origin?`&origin=${encodeURIComponent(origin)}`:''}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share" allowFullScreen/>
      <div className="player-chips">
        {menu&&<div className="player-menu" role="group">
          <p className="player-menu-title">Playback speed</p>
          {RATES.map(v=><Button variant="ghost" key={v} type="button" aria-pressed={v===rate} onClick={()=>pickRate(v)}>{v===1?'Normal':`${v}×`}</Button>)}
        </div>}
        <Button variant="ghost" size="icon" type="button" title="Play video" aria-label="Play video" disabled={!ready||!!error} onClick={()=>post('playVideo')}><Play/></Button>
        <Button variant="ghost" size="icon" type="button" title="Subtitles (CC)" aria-label="Subtitles (CC)" disabled={!ready||!!error} aria-pressed={ccOn} onClick={toggleCc}>{ccOn?<Captions/>:<CaptionsOff/>}</Button>
        <Button variant="ghost" size="icon" type="button" title="Playback speed" aria-label="Playback speed" disabled={!ready||!!error} aria-expanded={menu} onClick={()=>setMenu(m=>!m)}><Gauge/></Button>
        <Button variant="ghost" size="icon" type="button" title="Theater mode" aria-label="Theater mode" aria-pressed={theater} onClick={()=>setTheater(t=>!t)}><Film/></Button>
        <Button variant="ghost" size="icon" type="button" title="Fullscreen" aria-label="Fullscreen" onClick={toggleFull}><Maximize/></Button>
        <span className="player-brand" aria-label="YouTube">
          <svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="5" className="fill-primary"/><path d="M11.5 5.8v8.4l6.6-4.2z" className="fill-primary-foreground"/></svg>
          <span>YouTube</span>
        </span>
      </div>
    </div>
    {error&&<p role="alert" className="text-sm text-primary">{error}</p>}
  </div>;
}
