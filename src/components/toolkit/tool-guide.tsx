import { ChevronDown } from 'lucide-react';
import { getToolGuide } from '@/lib/tool-guides';
import { toolSearchIdentity } from '@/lib/tool-seo';
import type { Tool } from '@/lib/tools';
import { WatchSearchGuide } from './watch-search-guide';
import { getToolSearchContent, relatedTools } from '@/lib/tool-search-content';
import { Link } from '@tanstack/react-router';

export function ToolGuide({ tool }: { tool: Tool }) {
  const guide = getToolGuide(tool);
  const content = getToolSearchContent(tool);
  return <>
    {tool.name === 'YouTube Without Ads' && <WatchSearchGuide/>}
    {content && <section className="tools-section border-t border-border"><div className="wide-container max-w-4xl space-y-8">{content.questions.map(([question, answer], index) => <div key={question}>{index === 0 ? <h2 className="text-2xl font-semibold">{question}</h2> : <h3 className="text-xl font-semibold">{question}</h3>}<p className="text-sm text-muted-foreground mt-4 leading-relaxed">{answer}</p></div>)}<div className="flex flex-wrap gap-x-6 gap-y-3">{relatedTools(tool).map(related => <Link key={related.slug} to="/tools/$slug" params={{ slug: related.slug }} className="underline text-primary text-sm">{related.name}</Link>)}</div></div></section>}
    <section className="tools-section border-t border-border"><div className="wide-container"><div className="section-heading"><h2>Understanding your {toolSearchIdentity(tool).name} results</h2></div><dl className="grid md:grid-cols-2 gap-x-10 gap-y-7">{[['Accepted input', guide.input], ['What the result contains', guide.output], ['Important limits', guide.limit], ['Your next step', guide.next]].map(([h,p]) => <div key={h} className="min-w-0 border-b border-border pb-5"><dt className="font-semibold mb-2">{h}</dt><dd className="text-sm text-muted-foreground leading-relaxed">{p}</dd></div>)}</dl></div></section>
    <section className="tools-section border-t border-border"><div className="wide-container max-w-4xl"><div className="section-heading"><h2>{toolSearchIdentity(tool).name}: questions & answers</h2></div>{guide.faqs.map(([q,a]) => <details key={q} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium leading-relaxed hover:underline [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"/></summary><p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p></details>)}</div></section>
  </>;
}