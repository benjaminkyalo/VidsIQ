import { useRef, useState } from 'react';
import { Captions, CaptionsOff, Gauge, Film, Maximize } from 'lucide-react';
const RATES=[0.5,0.75,1,1.25,1.5,1.75,2];
export function EmbedPlayer({id,offset}:{id:string;offset:number}){
  const [theater,setTheater]=useState(false);
  const [ccOn,setCcOn]=useState(true);
  const [rate,setRate]=useState(1);
  const [menu,setMenu]=useState(false);
  const wrap=useRef<HTMLDivElement>(null);
  const frame=useRef<HTMLIFrameElement>(null);
  const post=(func:string,args:unknown[] =[])=>{try{frame.current?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'https://www.youtube-nocookie.com');}catch{/* player not ready yet */}};
  function toggleCc(){const next=!ccOn;setCcOn(next);post(next?'enableCaptions':'disableCaptions',[next]);}
  function pickRate(v:number){setRate(v);setMenu(false);post('setPlaybackRate',[v]);}
  function toggleFull(){const el=wrap.current;if(!el)return;if(document.fullscreenElement)void document.exitFullscreen();else void el.requestFullscreen?.().catch(()=>{});}
  return <div className={theater?"fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/95 p-4":"space-y-2"}>
    <div ref={wrap} className="player-shell">
      <iframe ref={frame} title="YouTube video player" className={theater?"aspect-video w-full max-w-[min(100%,calc((100vh-6rem)*16/9))] rounded-md":"aspect-video w-full rounded-md"} src={`https://www.youtube-nocookie.com/embed/${id}?start=${offset}&autoplay=1&rel=0&controls=1&fs=1&cc_load_policy=1&cc_lang_pref=en&modestbranding=1&playsinline=1&enablejsapi=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share" allowFullScreen/>
      <div className="player-chips">
        {menu&&<div className="player-menu" role="group">
          <p className="player-menu-title">Playback speed</p>
          {RATES.map(v=><button key={v} type="button" aria-pressed={v===rate} onClick={()=>pickRate(v)}>{v===1?'Normal':`${v}×`}</button>)}
        </div>}
        <button type="button" title="Subtitles (CC)" aria-pressed={ccOn} onClick={toggleCc}>{ccOn?<Captions/>:<CaptionsOff/>}</button>
        <button type="button" title="Playback speed" aria-expanded={menu} onClick={()=>setMenu(m=>!m)}><Gauge/></button>
        <button type="button" title="Theater mode" aria-pressed={theater} onClick={()=>setTheater(t=>!t)}><Film/></button>
        <button type="button" title="Fullscreen" onClick={toggleFull}><Maximize/></button>
        <span className="player-brand" aria-label="YouTube">
          <svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="5" fill="#ff0033"/><path d="M11.5 5.8v8.4l6.6-4.2z" fill="#fff"/></svg>
          <span>YouTube</span>
        </span>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">Speed and subtitles apply to this player only. YouTube may ignore speed requests for some videos.</p>
  </div>;
}
