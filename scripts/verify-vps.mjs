// Same cleanup the site applies: ignore stray quotes, spaces and Windows line endings.
const setting = (...names) => { for (const n of names) { const v = (process.env[n] ?? '').trim().replace(/^['"]|['"]$/g, '').trim(); if (v) return v; } return ''; };
const missing = ['GOOGLE_API_KEY'].filter((name) => !setting(name));

if (missing.length) {
  console.error(`Missing required settings: ${missing.join(', ')}`);
  console.error('Load them with: node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs');
  process.exit(1);
}

const apifyToken = setting('APIFY_DIRECT_TOKEN', 'APIFY_TOKEN');
const serviceUrl = setting('CONVERSION_SERVICE_URL');
const serviceKey = setting('CONVERTER_API_KEY');

if (!apifyToken && !(serviceUrl && serviceKey)) {
  console.error('Missing download settings: set APIFY_DIRECT_TOKEN, or both CONVERSION_SERVICE_URL and CONVERTER_API_KEY.');
  console.error('Load them with: node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs');
  process.exit(1);
}

if (apifyToken) {
  // Presence is not enough: confirm Apify actually accepts the key before going live.
  let status = 0;
  try {
    const r = await fetch('https://api.apify.com/v2/users/me', { headers: { Authorization: `Bearer ${apifyToken}` }, signal: AbortSignal.timeout(15000) });
    status = r.status;
  } catch {
    console.error('Could not reach Apify to check the download key. Check the server internet connection.');
    process.exit(1);
  }
  if (status !== 200) {
    console.error(`Apify rejected APIFY_DIRECT_TOKEN (HTTP ${status}). Create a new token in Apify and save it again in /etc/vidsiq.env.`);
    process.exit(1);
  }
  console.log('Downloads: Apify key accepted by Apify.');
}

if (serviceUrl && serviceKey) {
  const service = new URL(serviceUrl);
  if (!['http:', 'https:'].includes(service.protocol)) {
    throw new Error('CONVERSION_SERVICE_URL must use HTTP or HTTPS.');
  }
  const health = new URL('/health', service);
  let response;
  try {
    response = await fetch(health, {
      headers: { Authorization: `Bearer ${serviceKey}` },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    console.error(`Conversion service is not reachable at ${health.href}. Start it, or remove the converter settings and use APIFY_DIRECT_TOKEN instead.`);
    process.exit(1);
  }
  if (!response.ok) {
    throw new Error(`Conversion service health check returned HTTP ${response.status}.`);
  }
  console.log(`Conversion service health: HTTP ${response.status}.`);
}

console.log('VidsIQ settings loaded: YouTube and download settings are present.');
console.log(`AI writing: ${setting('AI_API_KEY', 'OPENAI_API_KEY') ? 'configured' : 'not configured (optional)'}.`);
