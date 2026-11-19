const required = ['GOOGLE_API_KEY', 'CONVERSION_SERVICE_URL', 'CONVERTER_API_KEY'];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length) {
  console.error(`Missing required settings: ${missing.join(', ')}`);
  console.error('Load them with: node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs');
  process.exit(1);
}

const serviceUrl = new URL(process.env.CONVERSION_SERVICE_URL);
if (!['http:', 'https:'].includes(serviceUrl.protocol)) {
  throw new Error('CONVERSION_SERVICE_URL must use HTTP or HTTPS.');
}

const health = new URL('/health', serviceUrl);
const response = await fetch(health, {
  headers: { Authorization: `Bearer ${process.env.CONVERTER_API_KEY}` },
  signal: AbortSignal.timeout(5000),
});

if (!response.ok) {
  throw new Error(`Conversion service health check returned HTTP ${response.status}.`);
}

console.log('VidsIQ settings loaded: YouTube and conversion settings are present.');
console.log(`Conversion service health: HTTP ${response.status}.`);
console.log(`AI writing: ${process.env.AI_API_KEY?.trim() ? 'configured' : 'not configured (optional)'}.`);
