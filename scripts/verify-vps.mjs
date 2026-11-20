const missing = ['GOOGLE_API_KEY'].filter((name) => !process.env[name]?.trim());

if (missing.length) {
  console.error(`Missing required settings: ${missing.join(', ')}`);
  console.error('Load them with: node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs');
  process.exit(1);
}

const apifyToken = process.env.APIFY_DIRECT_TOKEN?.trim() || process.env.APIFY_TOKEN?.trim();
const serviceUrl = process.env.CONVERSION_SERVICE_URL?.trim();
const serviceKey = process.env.CONVERTER_API_KEY?.trim();

if (!apifyToken && !(serviceUrl && serviceKey)) {
  console.error('Missing download settings: set APIFY_DIRECT_TOKEN, or both CONVERSION_SERVICE_URL and CONVERTER_API_KEY.');
  console.error('Load them with: node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs');
  process.exit(1);
}

if (apifyToken) {
  console.log('Downloads: Apify (personal token configured).');
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
console.log(`AI writing: ${process.env.AI_API_KEY?.trim() ? 'configured' : 'not configured (optional)'}.`);
