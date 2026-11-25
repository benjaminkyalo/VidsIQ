import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar, Clock } from 'lucide-react';
import { SiteShell } from '@/components/toolkit/site-shell';
import { SiteImage } from '@/components/toolkit/site-image';
import { infoHead } from '@/components/toolkit/info-page';
import { blogPosts } from '@/lib/blog-posts';
import { blogImages } from '@/lib/blog-images';

const T = 'YouTube Growth Blog – Tips, SEO & Monetization | VidsIQ';
const D = 'Practical YouTube guides: how to get monetized, rank videos in search, write better titles and descriptions, use tags and estimate earnings.';

function Blogs() {
  return <SiteShell><main className="blog-page">
    <header className="blog-hero"><h1>Recent <span className="text-primary">Articles</span></h1><p>Expert tips, guides, and insights to help you grow your YouTube channel and maximize your success</p></header>
    <div className="blog-grid">{blogPosts.map((p, i) => <article key={p.title} className="blog-card">
      <Link to="/blogs/$slug" params={{ slug: p.slug }}>
        <div className="blog-media"><SiteImage src={blogImages[p.image]} alt={p.title} width={1088} height={608} priority={i < 3} sizes="(max-width: 700px) 100vw, 33vw" /><span className="blog-badge">{p.category}</span></div>
        <div className="blog-body"><div className="blog-meta"><span><Calendar />{p.date}</span><span><Clock />{p.readTime}</span></div><h2>{p.title}</h2><p>{p.excerpt}</p></div>
      </Link>
    </article>)}</div>
  </main></SiteShell>;
}

export const Route = createFileRoute('/blogs/')({ head: () => infoHead('/blogs', T, D, [], 'CollectionPage'), component: Blogs });
