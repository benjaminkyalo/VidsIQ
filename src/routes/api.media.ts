import { createFileRoute } from '@tanstack/react-router';
import { conversionBase, conversionTicket } from '@/lib/conversion-service';
const ALLOWED=[/^co\.otomir23\.me$/,/^api\.cobalt\.liubquanti\.click$/,/^[a-z0-9-]+\.meowing\.de$/];
export const Route=createFileRoute('/api/media')({server:{handlers:{GET:async({request})=>{
 const params=new URL(request.url).searchParams;
 const ticket=params.get('job');
 if(ticket){
  const parsed=conversionTicket.safeParse(ticket);
  if(!parsed.success)return new Response('Invalid conversion ticket',{status:400});
  const url=process.env['CONVERSION_SERVICE_URL'];const key=process.env['CONVERTER_API_KEY'];
  if(!url||!key)return new Response('Conversion service unavailable',{status:503});
  try{
   const r=await fetch(new URL(`/v1/files/${parsed.data}`,conversionBase(url)),{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.any([request.signal,AbortSignal.timeout(300000)]),redirect:'manual'});
   if(!r.ok||!r.body)return new Response('Converted file unavailable or expired',{status:r.status===404?404:502});
   const type=r.headers.get('content-type')??'';
   if(!/^(audio\/mpeg|video\/mp4)(;|$)/i.test(type))return new Response('Invalid converted file',{status:502});
   const headers=new Headers({'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
   const length=r.headers.get('content-length');if(length)headers.set('Estimated-Content-Length',length);
   return new Response(r.body,{headers});
  }catch{return new Response('Conversion service unavailable',{status:502});}
 }
 let target:URL;
 try{target=new URL(new URL(request.url).searchParams.get('u')??'');}catch{return new Response('Invalid media request',{status:400});}
 if(target.protocol!=='https:'||!ALLOWED.some(r=>r.test(target.hostname))||!target.pathname.startsWith('/tunnel'))return new Response('Host not allowed',{status:400});
 try{
  const r=await fetch(target.toString(),{signal:request.signal});
  if(!r.ok||!r.body)return new Response('Media unavailable',{status:502});
  const h=new Headers({'Content-Type':r.headers.get('content-type')??'application/octet-stream','Cache-Control':'no-store'});
  for(const k of ['estimated-content-length','content-length']){const value=r.headers.get(k);if(value)h.set(k==='content-length'?'Estimated-Content-Length':k,value);}
  return new Response(r.body,{headers:h});
 }catch{return new Response('Media service unavailable',{status:502});}
}}}});
