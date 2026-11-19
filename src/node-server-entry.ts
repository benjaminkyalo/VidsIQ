import "#nitro-vite-setup";
import { serve } from "srvx/node";
import { useNitroApp } from "nitro/app";

const nitroApp = useNitroApp();

// Nitro's standard Node entry exports an empty object after starting a listener.
// The prerender preview instead needs a Fetch API handler. Export both capabilities
// and avoid opening a second port while the build is rendering static pages.
if (process.env["TSS_PRERENDERING"] !== "true") {
  const parsedPort = Number.parseInt(process.env["NITRO_PORT"] ?? process.env["PORT"] ?? "");
  const hostname = process.env["NITRO_HOST"] || process.env["HOST"];
  const cert = process.env["NITRO_SSL_CERT"];
  const key = process.env["NITRO_SSL_KEY"];
  serve({
    port: Number.isNaN(parsedPort) ? 3000 : parsedPort,
    ...(hostname ? { hostname } : {}),
    ...(cert && key ? { tls: { cert, key } } : {}),
    fetch: nitroApp.fetch,
  });
}

export default {
  fetch: (request: Request) => nitroApp.fetch(request),
};
