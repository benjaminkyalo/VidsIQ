import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SiteShell } from '@/components/toolkit/site-shell';
import { toolSlug } from '@/lib/tools';

export type InfoSection = { h: string; p: string; tools?: string[] };
export type Faq = [string, string];

export function infoHead(path: string, title: string, desc: string, faqs: Faq[], type = 'WebPage') {
  return {
    meta: [
      { title }, { name: 'description', content: desc },
      { property: 'og:title', content: title }, { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' }, { property: 'og:url', content: path },
      { name: 'twitter:card', content: 'summary' }, { name: 'twitter:title', content: title }, { name: 'twitter:description', content: desc },
    ],
    links: [{ rel: 'canonical', href: path }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      { '@type': type, name: title, description: desc, url: path },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: '/' }, { '@type': 'ListItem', position: 2, name: title.split(' | ')[0], item: path }] },
      ...(faqs.length ? [{ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : []),
    ] }) }],
  };
}

export function InfoPage({ h1, intro, sections, faqs, faqTitle = 'Frequently asked questions', cta = 'Explore all free tools' }: { h1: string; intro: string; sections: InfoSection[]; faqs: Faq[]; faqTitle?: string; cta?: string }) {
  return <SiteShell><main className="content-page">
    <h1>{h1}</h1><p>{intro}</p>
    {sections.map(s => <section key={s.h}><h2>{s.h}</h2><p>{s.p}</p>{s.tools && <div className="flex flex-wrap gap-2 mt-3 mb-4">{s.tools.map(t => <Button key={t} asChild variant="outline" size="sm"><Link to="/tools/$slug" params={{ slug: toolSlug(t) }}>{t} <ArrowRight /></Link></Button>)}</div>}</section>)}
    {faqs.length > 0 && <><h2>{faqTitle}</h2><Accordion type="single" collapsible>{faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent><p>{a}</p></AccordionContent></AccordionItem>)}</Accordion></>}
    <Button asChild className="mt-6"><Link to="/">{cta} <ArrowRight /></Link></Button>
  </main></SiteShell>;
}
