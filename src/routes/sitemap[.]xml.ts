import { createFileRoute } from '@tanstack/react-router';
import { allTools, toolSlug } from '@/lib/tools';
import { blogPosts } from '@/lib/blog-posts';

const staticPages = ['/', '/blogs', '/about', '/contact', '/privacy', '/terms', '/youtube-seo', '/write-for-us'];

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = [
          ...staticPages.map(path => ({ path, priority: path === '/' ? '1.0' : '0.5' })),
          ...blogPosts.map(p => ({ path: `/blogs/${p.slug}`, priority: '0.7' })),
          ...allTools.map(tool => ({ path: `/tools/${toolSlug(tool.name)}`, priority: '0.8' })),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${origin}${u.path}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
        });
      },
    },
  },
});
