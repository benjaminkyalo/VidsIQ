import { Link } from '@tanstack/react-router';
import { ArrowUp, Check, ChevronDown, ExternalLink, X } from 'lucide-react';
import type { PageGuideContent, PageGuideSection } from '@/lib/page-guides';

function Section({ section }: { section: PageGuideSection }) {
  const intro = 'intro' in section && section.intro ? <p>{section.intro}</p> : null;
  switch (section.kind) {
    case 'text':
      return <><h3>{section.title}</h3>{section.paragraphs.map(p => <p key={p} className="mt-4">{p}</p>)}</>;
    case 'steps':
      return <><h3>{section.title}</h3>{intro}<ol className="mt-5 grid gap-4 md:grid-cols-2">{section.items.map(([t, d], i) => <li key={t} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span><div><h4>{t}</h4><p>{d}</p></div></li>)}</ol></>;
    case 'cards':
      return <><h3>{section.title}</h3>{intro}<div className="dl-seo-features">{section.items.map(([t, d]) => <div key={t} className="dl-seo-card"><h4>{t}</h4><p>{d}</p></div>)}</div></>;
    case 'checks':
    case 'warn': {
      const Icon = section.kind === 'warn' ? X : Check;
      return <><h3>{section.title}</h3>{intro}<ul className="mt-5 grid gap-4 md:grid-cols-2">{section.items.map(([t, d]) => <li key={t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"><Icon className={`mt-1 size-5 shrink-0 ${section.kind === 'warn' ? 'text-destructive' : ''}`} /><div><h4>{t}</h4><p>{d}</p></div></li>)}</ul></>;
    }
    case 'formats':
      return <><h3>{section.title}</h3>{intro}<div className="mt-5 grid gap-3 sm:grid-cols-2">{section.items.map(([l, f]) => <div key={l} className="min-w-0 rounded-lg border border-border bg-card p-4"><strong className="block">{l}</strong><code className="mt-2 block break-words text-sm text-muted-foreground">{f}</code></div>)}</div></>;
    case 'table':
      return <><h3>{section.title}</h3>{intro}<div className="mt-5 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead className="bg-card"><tr>{section.head.map(h => <th key={h} className="p-4">{h}</th>)}</tr></thead><tbody>{section.rows.map(([first, ...rest]) => <tr key={first} className="border-t border-border"><th scope="row" className="p-4">{first}</th>{rest.map((c, i) => <td key={i} className="p-4 text-muted-foreground">{c}</td>)}</tr>)}</tbody></table></div></>;
  }
}

export function PageGuide({ guide }: { guide: PageGuideContent }) {
  return <>
    <section className="dl-seo" aria-labelledby="page-guide-intro">
      <div className="dl-seo-inner">
        <h2 id="page-guide-intro">{guide.introTitle}</h2>
        {guide.intro.map((p, i) => <p key={p} className={i === 0 ? 'dl-seo-intro' : 'mt-4'}>{p}</p>)}
        {guide.sections.map(s => <Section key={s.title} section={s} />)}
        {guide.externalLink && <p className="mt-6"><a href={guide.externalLink.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary underline">{guide.externalLink.label} <ExternalLink className="size-4" /></a></p>}
        <div className="mt-10 rounded-lg border border-border bg-card p-6"><h3 className="mt-0">{guide.closingTitle}</h3><p>{guide.closing}</p><a href="#tool-action" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline">Paste a link above <ArrowUp className="size-5" /></a></div>
      </div>
    </section>
    <section className="tools-section border-t border-border" aria-labelledby="page-guide-faq">
      <div className="wide-container max-w-4xl">
        <div className="section-heading"><h2 id="page-guide-faq">Frequently Asked Questions</h2><p>{guide.faqIntro}</p></div>
        {guide.faqs.map(([q, a]) => <details key={q} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium leading-relaxed hover:underline [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="size-5 shrink-0 text-muted-foreground group-open:rotate-180" /></summary><p className="pb-5 text-base leading-relaxed text-muted-foreground">{a}</p></details>)}
        <nav className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Related tools"><span className="text-muted-foreground">Related tools:</span>{guide.related.map(r => <Link key={r.slug} className="text-primary underline" to="/tools/$slug" params={{ slug: r.slug }}>{r.label}</Link>)}</nav>
      </div>
    </section>
  </>;
}
