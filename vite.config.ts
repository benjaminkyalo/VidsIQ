// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { allTools, toolSlug } from "./src/lib/tools";
import { blogPosts } from "./src/lib/blog-posts";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Only visitor-independent content is frozen. Live tool submissions stay dynamic.
    pages: [
      ...["/", "/blogs", "/about", "/contact", "/privacy", "/terms", "/youtube-seo", "/write-for-us"].map(path => ({ path })),
      ...blogPosts.map(p => ({ path: `/blogs/${p.slug}` })),
      ...allTools.map(tool => ({ path: `/tools/${toolSlug(tool.name)}` })),
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
  // `bun run build:node` (BUILD_TARGET=node) produces a plain Node server for VPS
  // hosting in dist/; the default build keeps the hosting platform target.
  ...(process.env["BUILD_TARGET"] === "node" ? { nitro: { preset: "node-server" } } : {}),
});
