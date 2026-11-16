import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/toolkit/site-shell';
import { ToolAction } from '@/components/toolkit/tool-action';
import { ToolGuide } from '@/components/toolkit/tool-guide';
import { allTools, findToolBySlug, toolSlug } from '@/lib/tools';
import { toolSearchHead, toolSearchIdentity } from '@/lib/tool-seo';
import { relatedTools } from '@/lib/tool-search-content';
const RevenueIntelligence = lazy(() => import('@/components/toolkit/revenue-intelligence').then(m => ({ default: m.RevenueIntelligence })));
const MonetizationGuide = lazy(() => import('@/components/toolkit/monetization-guide').then(m => ({ default: m.MonetizationGuide })));
export const Route = createFileRoute('/tools/$slug')({
  validateSearch: (search: Record<string, unknown>): { url?: string } => typeof search['url'] === 'string' && search['url'].length <= 2000 ? { url: search['url'] } : {},
  loader: ({ params }) => { const tool = findToolBySlug(params.slug); if (!tool) throw notFound(); return { name: tool.name, description: tool.description }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'Tool not found | VidsIQ' }, { name: 'robots', content: 'noindex' }] };
    return toolSearchHead(loaderData);
  },
  notFoundComponent: () => <SiteShell><main className="hero-section"><div className="hero-inner"><h1>Tool not found</h1><Link to="/" className="text-primary">Back to all tools</Link></div></main></SiteShell>,
  component: ToolPage,
});
function ToolPage() {
  const { slug } = Route.useParams();
  const { url } = Route.useSearch();
  const tool = findToolBySlug(slug);
  if (!tool) throw notFound();
  const others = relatedTools(tool);
  return <SiteShell><main><section className="hero-section"><div className="hero-inner"><span className="tool-icon mx-auto mb-4"><tool.icon /></span><h1>Free <span className="text-primary">{toolSearchIdentity(tool).name}</span></h1><p className="hero-subtitle">{tool.description}</p><ToolAction key={`${tool.name}:${url ?? ''}`} initialTool={tool.name} initialInput={url ?? ''} /></div></section>
  {tool.name === 'Monetization Checker' && <Suspense fallback={null}><RevenueIntelligence /><MonetizationGuide onShadowban={() => {}} /></Suspense>}
  <ToolGuide tool={tool} />
  <section className="tools-section"><div className="wide-container"><div className="section-heading"><h2>Continue your research</h2><p>Choose another task from the creator toolkit.</p></div><div className="tool-grid">{others.map(t => <article key={t.name} className="tool-card"><span className="tool-icon"><t.icon /></span><h3>{t.name}</h3><p>{t.description}</p><Link to="/tools/$slug" params={{ slug: toolSlug(t.name) }} className="learn-link inline-flex items-center gap-1 font-semibold">{t.name} <ArrowRight className="size-4" /></Link></article>)}</div></div></section></main></SiteShell>;
}
