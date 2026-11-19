import { useToolSubmission } from '@/hooks/use-tool-submission';
import { SiteImage } from '@/components/toolkit/site-image';
import { InputPreview } from '@/components/toolkit/input-preview';
import { createFileRoute, Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link as LinkIcon, Wrench, CircleCheck, Zap, ArrowRight, ChartNoAxesCombined, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateToolInput } from '@/lib/tool-engine';
const MonetizationGuide = lazy(() => import('@/components/toolkit/monetization-guide').then(m => ({ default: m.MonetizationGuide })));
const RevenueIntelligence = lazy(() => import('@/components/toolkit/revenue-intelligence').then(m => ({ default: m.RevenueIntelligence })));
import { loadToolWorkspace, warmToolWorkspace } from '@/components/toolkit/workspace-loader';
const ToolWorkspace = lazy(loadToolWorkspace);
import { priorityTools, allTools, essentialTools, additionalTools, type Tool, toolSlug } from '@/lib/tools';
import { SiteShell, scrollToChannelChecks } from '@/components/toolkit/site-shell';
import { Information } from '@/components/toolkit/information';
// Step images live in public/ as plain files so they load on any host, not
// only on Lovable's asset CDN (the /__l5e/ pointer URLs 404 on a self-hosted VPS).
const enterSmall = '/enter-youtube-480.webp';
const enterLarge = '/enter-youtube-960.webp';
const selectSmall = '/select-tool-480.webp';
const selectLarge = '/select-tool-960.webp';
export const Route = createFileRoute('/')({
 head: () => ({ meta: [
  { title: 'Free YouTube Downloader – MP3 & MP4 Online + Monetization Checker | VidsIQ' },
  { name: 'description', content: 'Free online YouTube downloader: convert YouTube to MP3 or MP4 (HD), check channel monetization, and watch without ads. Fast, free, no signup.' },
  { property: 'og:title', content: 'Free YouTube Downloader – MP3 & MP4 Online + Monetization Checker | VidsIQ' },
  { property: 'og:description', content: 'Free online YouTube downloader: convert YouTube to MP3 or MP4 (HD), check channel monetization, and watch without ads. Fast, free, no signup.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: Index,
});
const workflows = [
 ['Channel research','Compare public subscriber totals, upload dates, and lifetime views. Keep private analytics separate from public estimates.','Channel Viewer'],
 ['Metadata review','Read a published title and description, inspect available tags, and use the checklist to spot missing metadata.','SEO Score Checker'],
 ['Creator assets','Compare thumbnail sizes or save a profile image. Reuse downloaded assets only when you have permission.','Image Tool'],
 ['Revenue planning','Change the RPM and view count to compare earnings scenarios before adding sponsorship or affiliate assumptions.','Money Calculator'],
];
function ToolCard({ tool, onSelect }: { tool: Tool; onSelect: (name: string) => void }) {
 return <article className="tool-card"><span className="tool-icon"><tool.icon /></span><h3>{tool.name}</h3><p>{tool.description}</p><div className="flex flex-wrap items-center gap-3"><Button variant="link" onClick={() => onSelect(tool.name)} className="learn-link" aria-label={`Use ${tool.name} here`}>Use now</Button><Link to="/tools/$slug" params={{ slug: toolSlug(tool.name) }} className="learn-link inline-flex items-center gap-1 font-semibold" aria-label={`Learn more about ${tool.name}`}>Learn more <ArrowRight className="size-4" /></Link></div></article>;
}
function ResultsPreview() {
 return <div className="results-preview" aria-label="Illustrative channel analytics preview"><div className="preview-channel"><span className="preview-avatar">T</span><div><strong>Creator Channel</strong><p>Channel overview & performance</p><span className="preview-label">Channel ID · UC…</span></div></div><div className="preview-stats">{[['Subscribers','308.0M'],['Total Views','19.8B'],['Total Videos','24.9K'],['Joined','2011']].map(([k,v]) => <div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div><strong className="preview-table-title">Estimated Revenue Matrix</strong><div className="preview-table"><div><span>Metric</span><span>Daily</span><span>Monthly</span><span>Yearly</span></div>{['Estimated Earnings','Estimated Views','Average Daily Views'].map(k => <div key={k}><span>{k}</span><span>—</span><span>—</span><span>—</span></div>)}</div><p className="preview-note">Illustrative preview · Not live channel data</p></div>;
}
function Index() {
 const [tool, setTool] = useState('Monetization Checker');
 const [url, setUrl] = useState('');
 const [error, setError] = useState('');
 const { submitted, submit: submitInput } = useToolSubmission(tool, url);
 const input = useRef<HTMLInputElement>(null);
 function choose(name: string) { setTool(name); setError(''); document.getElementById('tool-action')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); input.current?.focus({ preventScroll: true }); }

 useEffect(() => {
  if (window.location.hash === '#channel-checks') scrollToChannelChecks();
 }, []);
 function submit(e: React.FormEvent) {
  e.preventDefault();
  try {
   submitInput();
   setError('');
  } catch(e) { setError(e instanceof Error && e.name !== 'ZodError' ? e.message : 'Keep your input under 2,000 characters.'); input.current?.focus(); }
 }
 return <SiteShell onTool={choose}><main><section className="hero-section"><div className="hero-inner"><h1>Free YouTube Downloader: MP3 & MP4<br className="hidden lg:block" /> & <span className="text-primary">Monetization Checker</span></h1><p className="hero-subtitle">Convert permitted YouTube videos to MP3 or MP4 online, check any channel’s monetization eligibility, and watch without ads. Free, fast, no signup needed.</p><form id="tool-action" onFocus={warmToolWorkspace} onPointerEnter={warmToolWorkspace} onSubmit={submit} className="tool-action"><input maxLength={2000} ref={input} aria-label="Channel or Video URL, ID, or username" placeholder="Paste a YouTube channel link, video URL, or @username" value={url} onChange={e => { setUrl(e.target.value); setError(''); }} /><Select value={tool} onValueChange={setTool}><SelectTrigger aria-label="Select tool"><SelectValue /></SelectTrigger><SelectContent className="max-h-80">{allTools.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select><Button type="submit" className="submit-button">Check Now</Button></form>{error && <p role="alert" className="input-error"><AlertCircle />{error}</p>}<div className="micro-indicators"><span><LinkIcon />Paste your YouTube link</span><span><Wrench />Choose a tool</span><span><CircleCheck />Review your report</span></div><nav className="priority-tools" aria-label="Popular tools">{priorityTools.map(n => <Link key={n} to="/tools/$slug" params={{ slug: toolSlug(n) }}>{n}</Link>)}</nav><InputPreview input={url} /></div></section>{submitted&&<div className="results-section"><Suspense fallback={<p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin" />Loading tool…</p>}><ToolWorkspace key={submitted.version} tool={submitted.tool} input={submitted.input}/></Suspense></div>}{(submitted?.tool??tool)==='Monetization Checker'&&<Suspense fallback={null}><RevenueIntelligence/><MonetizationGuide onShadowban={()=>choose('Shadowban Detector')}/></Suspense>}<section id="channel-checks" className="tools-section"><div className="wide-container"><div className="section-heading"><h2>Channel checks and creator research</h2><p>Start with public channel facts, video metadata, or an earnings scenario.</p></div><div className="tool-grid">{essentialTools.map(t => <ToolCard key={t.name} tool={t} onSelect={choose} />)}</div><div className="more-tools"><span className="more-badge"><Zap />MORE TOOLS</span><p>Find a specific task: comments, links, images, calculations, or permitted downloads.</p></div><div className="tool-grid additional-grid">{additionalTools.map(t => <ToolCard key={t.name} tool={t} onSelect={choose} />)}</div></div></section><section className="how-section"><div className="section-heading"><h2>How It Works</h2><p>From a public link to the details that matter for your research.</p></div><div className="steps-container"><div className="step-row"><div className="step-visual"><SiteImage src={enterLarge} srcSet={`${enterSmall} 480w, ${enterLarge} 960w`} sizes="(max-width: 640px) calc(100vw - 72px), 440px" alt="Red YouTube play button over sculpted waves" loading="lazy" width={1088} height={608} /><span className="step-icon"><LinkIcon /></span></div><div className="step-copy"><h3>Enter YouTube URL</h3><p>Use a public channel link, video URL, or @handle. Calculators and idea generators also accept the inputs shown on their own pages.</p></div></div><div className="step-row reverse"><div className="step-visual"><SiteImage src={selectLarge} srcSet={`${selectSmall} 480w, ${selectLarge} 960w`} sizes="(max-width: 640px) calc(100vw - 72px), 440px" alt="Video and audio creator tools on a desktop workstation" loading="lazy" width={1088} height={608} /><span className="step-icon"><Wrench /></span></div><div className="step-copy"><h3>Select a Tool</h3><p>Select the result you need: channel statistics, published tags, a thumbnail, or an earnings calculation.</p></div></div><div className="step-row"><div className="step-visual"><ResultsPreview /><span className="step-icon"><ChartNoAxesCombined /></span></div><div className="step-copy"><h3>Review the result</h3><p>Separate reported counts from estimates. Where available, copy the details or export a file for later comparison.</p></div></div></div></section><section className="testimonials-section"><div className="section-heading"><h2>Four practical creator workflows</h2><p>Choose a starting point based on the question you need to answer.</p></div><div className="testimonials-grid">{workflows.map(([title,text,name]) => <article className="testimonial" key={title}><h3 className="text-xl font-semibold">{title}</h3><p>{text}</p><Link to="/tools/$slug" params={{ slug: toolSlug(name ?? '') }} className="learn-link inline-flex items-center gap-2">{name}<ArrowRight className="size-4" /></Link></article>)}</div></section><Information onStart={() => choose('Monetization Checker')} /></main><Button className="back-to-top" variant="secondary" size="icon" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ChevronUp /></Button></SiteShell>;
}
