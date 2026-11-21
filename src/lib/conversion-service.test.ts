import { afterEach, expect, it, vi } from 'vitest';
import { conversionBase, requestConversion } from './conversion-service';
afterEach(()=>vi.unstubAllGlobals());
it('only allows HTTPS or exact loopback HTTP configuration',()=>{
  expect(conversionBase('http://127.0.0.1:8090').hostname).toBe('127.0.0.1');
  expect(()=>conversionBase('http://converter.example')).toThrow();
  expect(()=>conversionBase('https://converter.example/other')).toThrow();
});
it('does not follow conversion-service redirects or accept unexpected tickets',async()=>{
  const fetch=vi.fn().mockResolvedValue(new Response(JSON.stringify({ticket:'bad',state:'ready'})));
  vi.stubGlobal('fetch',fetch);
  await expect(requestConversion({url:'https://converter.example',key:'test-only'},{video_id:'jNQXAC9IVRw',mode:'audio',quality:'720',bitrate:'192'})).rejects.toThrow();
  expect(fetch.mock.calls[0]?.[1]?.redirect).toBe('manual');
});