import { downloaderContent } from '@/lib/downloader-content';

export function DownloaderSeo({ toolName }: { toolName: string }) {
  const c = downloaderContent(toolName);
  if (!c) return null;
  return <section className="dl-seo" aria-labelledby="dl-seo-title">
    <div className="dl-seo-inner">
      <h2 id="dl-seo-title">{c.heading}</h2>
      <p className="dl-seo-intro">{c.intro}</p>
      <h3>{c.stepsTitle ?? 'How to download in 4 easy steps'}</h3>
      <ol className="dl-seo-steps">{c.steps.map((s, i) => <li key={s.h}><span className="dl-seo-num">{i + 1}</span><div><h4>{s.h}</h4><p>{s.p}</p></div></li>)}</ol>
      <h3>Why choose VidsIQ</h3>
      <div className="dl-seo-features">{c.features.map(f => <div key={f.h} className="dl-seo-card"><h4>{f.h}</h4><p>{f.p}</p></div>)}</div>
      {c.sections.map(s => <div key={s.h} className="dl-seo-block"><h3>{s.h}</h3><p>{s.p}</p></div>)}
      {c.keywords?.length ? <p className="dl-seo-tags" aria-label="Popular searches">{c.keywords.map(k => <span key={k}>{k}</span>)}</p> : null}
    </div>
  </section>;
}
