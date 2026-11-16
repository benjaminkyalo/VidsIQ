import { createFileRoute } from '@tanstack/react-router';
const ALLOWED=[/^co\.otomir23\.me$/,/^api\.cobalt\.liubquanti\.click$/,/^[a-z0-9-]+\.meowing\.de$/];
export const Route=createFileRoute('/api/media')({server:{handlers:{GET:async({request})=>{
 let target:URL;
 try{target=new URL(new URL(request.url).searchParams.get('u')??'');}catch{return new Response('Invalid media request',{status:400});}
 if(target.protocol!=='https:'||!ALLOWED.some(r=>r.test(target.hostname))||!target.pathname.startsWith('/tunnel'))return new Response('Host not allowed',{status:400});
 try{
  const r=await fetch(target.toString(),{signal:request.signal});
  if(!r.ok||!r.body)return new Response('Media unavailable',{status:502});
  const h=new Headers({'Content-Type':r.headers.get('content-type')??'application/octet-stream','Cache-Control':'no-store'});
  for(const k of ['estimated-content-length','content-length'])if(r.headers.get(k))h.set(k==='content-length'?'Estimated-Content-Length':k,r.headers.get(k)!);
  return new Response(r.body,{headers:h});
 }catch{return new Response('Media service unavailable',{status:502});}
}}}});
