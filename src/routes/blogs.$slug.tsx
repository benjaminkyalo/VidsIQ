import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteShell } from '@/components/toolkit/site-shell';
import { SiteImage } from '@/components/toolkit/site-image';
import { findBlogPost } from '@/lib/blog-posts';
import { blogImages } from '@/lib/blog-images';
import { toolSlug } from '@/lib/tools';

export const Route = createFileRoute('/blogs/$slug')({
  loader: ({ params }) => { const post = findBlogPost(params.slug); if (!post) throw notFound(); return post; },
  head: ({ params, loaderData: p }) => {
    const path = `/blogs/${params.slug}`;
    if (!p) return { meta: [{ title: 'Article not found | VidsIQ' }, { name: 'robots', content: 'noindex' }] };
    const title = `${p.title} | VidsIQ`;
    return {
      meta: [
        { title }, { name: 'description', content: p.excerpt },
        { property: 'og:title', content: title }, { property: 'og:description', content: p.excerpt },
        { property: 'og:type', content: 'article' }, { property: 'og:url', content: path },
        { property: 'article:published_time', content: p.isoDate }, { property: 'article:section', content: p.category },
        { name: 'twitter:card', content: 'summary_large_image' }, { name: 'twitter:title', content: title }, { name: 'twitter:description', content: p.excerpt },
      ],
      links: [{ rel: 'canonical', href: path }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        { '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.isoDate, articleSection: p.category, url: path, mainEntityOfPage: path, publisher: { '@type': 'Organization', name: 'VidsIQ' } },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blogs' },
          { '@type': 'ListItem', position: 3, name: p.title, item: path },
        ] },
      ] }) }],
    };
  },
  notFoundComponent: () => <SiteShell><main className="content-page"><h1>Article not found</h1><Button asChild><Link to="/blogs">Back to the blog</Link></Button></main></SiteShell>,
  component: Article,
});

function Article() {
  const p = Route.useLoaderData();
  return <SiteShell><main className="content-page blog-article">
    <Link to="/blogs" className="text-primary">← All articles</Link>
    <span className="blog-badge blog-badge-inline">{p.category}</span>
    <h1>{p.title}</h1>
    <div className="blog-meta"><span><Calendar />{p.date}</span><span><Clock />{p.readTime}</span></div>
    {blogImages[p.image] && <SiteImage src={blogImages[p.image]} alt={p.title} width={1088} height={608} priority className="blog-cover" />}
    <p>{p.excerpt}</p>
    {p.sections.map(s => <section key={s.h}><h2>{s.h}</h2><p>{s.p}</p></section>)}
    <Button asChild className="mt-6"><Link to="/tools/$slug" params={{ slug: toolSlug(p.tool) }}>Try the free {p.tool} <ArrowRight /></Link></Button>
  </main></SiteShell>;
}
