import { Check, ArrowRight } from 'lucide-react';
import { benefits } from '@/lib/tools';
import { Button } from '@/components/ui/button';
const practices = [
 ['Compare like with like', 'Lifetime views and daily averages describe different periods. Compare channels of similar age and content format before drawing conclusions.'],
 ['Keep your assumptions visible', 'Revenue scenarios depend on the RPM you choose. They do not reveal a creator’s payments, audience geography, or current income.'],
 ['Review metadata in context', 'Tags and hashtags can describe a topic, but copying another video’s wording does not guarantee discovery or ranking.'],
 ['Confirm private facts directly', 'Use YouTube Studio or ask the creator for enrollment, valid watch hours, strikes, and other information not available publicly.'],
];
function CopyList({ items, checks = false }: { items: string[][]; checks?: boolean }) {
 return <ul className={checks ? 'copy-list check-list' : 'copy-list'}>{items.map(([title,text]) => <li key={title}>{checks ? <Check className="text-primary" /> : <span className="text-primary">•</span>}<p><strong>{title}:</strong> {text}</p></li>)}</ul>;
}
export function Information({ onStart }: { onStart: () => void }) {
 return <section className="information-section"><div className="information-inner"><div className="section-heading"><h2>Read the numbers in context</h2><p>A public channel report is a research starting point, not a replacement for YouTube Studio. Counts describe published activity; estimates depend on assumptions; private account decisions require confirmation from the creator.</p></div><div className="copy-block"><h3>What public research can help you do</h3><div className="benefit-grid">{benefits.map(t => <article key={t.name} className="benefit-card"><span className="tool-icon"><t.icon /></span><h4>{t.name}</h4><p>{t.description}</p></article>)}</div></div><div className="copy-block"><h3>Before acting on a channel report</h3><CopyList items={practices} checks /></div><aside className="why-choose"><h3>When a result is missing</h3><p>A deleted or private video, disabled comments, hidden subscriber totals, or an external service limit can prevent a result from appearing. Missing data is not proof of a penalty or zero activity.</p><p>Use the original public link, check the result’s stated limits, and retry later if a connected service is unavailable. For download tasks, only use content you own or have permission to save.</p><Button variant="link" onClick={onStart} className="px-0">Review a channel <ArrowRight /></Button></aside></div></section>;
}
