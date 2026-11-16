import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SiteShell } from '@/components/toolkit/site-shell';
import { toolSlug } from '@/lib/tools';

const TITLE = 'YouTube SEO Tools & Guide – Rank Videos Higher | VidsIQ';
const DESC = 'Free YouTube SEO tools and a practical guide: tag generator, title and description generators, keyword finder, rank checker, and answers to common YouTube SEO questions.';

const sections = [
  { h: 'Find the keywords viewers actually type', p: 'Start with the words your audience uses. Pull keywords from videos that already rank, then confirm the topic with real searches before you record.', tools: ['Keyword Finder', 'Tag Extractor', 'YouTube Rank Checker'] },
  { h: 'Write titles that earn the click', p: 'Put the main keyword near the start, keep titles under about 70 characters so they are not cut off, and promise one clear result.', tools: ['Title Generator', 'Clickbait Title Generator'] },
  { h: 'Descriptions, chapters and hashtags', p: 'Use the first two lines to summarise the video, add timestamps as chapters, link related videos, and finish with two or three relevant hashtags.', tools: ['Description Generator', 'Hashtag Generator'] },
  { h: 'Tags that support your topic', p: 'Tags help most with misspellings and closely related phrases. Stay within the 500-character limit and keep every tag relevant.', tools: ['Tag Generator', 'Tag Finder'] },
  { h: 'Captions and transcripts', p: 'Accurate captions make your spoken words readable for search and for viewers watching without sound.', tools: ['Transcript Generator', 'Subtitle Downloader'] },
  { h: 'Thumbnails and audit', p: 'Compare your thumbnail with competitors at every size, then run a metadata check before publishing.', tools: ['Thumbnail Viewer', 'SEO Score Checker'] },
];

const faqs: [string, string][] = [
  ['What is YouTube SEO?', 'YouTube SEO is improving your video title, description, tags, captions, thumbnail and viewer engagement so YouTube search and recommendations show your video to more of the right people.'],
  ['How do I rank my YouTube video higher?', 'Target a specific keyword, use it in the title and first lines of the description, add chapters and captions, design a clear thumbnail, and keep viewers watching. Watch time and click-through rate matter more than any single tag.'],
  ['Do YouTube tags still matter?', 'Tags play a small role. YouTube says they mainly help with commonly misspelled words. Your title, thumbnail and description have a bigger effect.'],
  ['How many tags should I use on YouTube?', 'There is no fixed number. Use a handful of relevant tags and stay under YouTube’s 500-character tag limit.'],
  ['How long should a YouTube title be?', 'Up to 100 characters are allowed, but around 60–70 characters avoids titles being cut off in search and on phones.'],
  ['How do I find keywords for YouTube?', 'Type your topic into YouTube search and note the autocomplete suggestions, look at the titles and tags of top-ranking videos, and use our Keyword Finder to pull keywords from any video.'],
  ['How can I see the tags on someone else’s YouTube video?', 'Paste the video link into our free Tag Extractor. It lists the public tags as a comma-separated list you can copy. Some videos have no tags.'],
  ['Why is my YouTube video not getting views?', 'Common reasons are a topic nobody searches for, a weak title or thumbnail, a slow intro that loses viewers, or a new channel without history yet. Check your metadata with the SEO Score Checker.'],
  ['Do hashtags help on YouTube?', 'Hashtags can help viewers discover related videos. Use two or three relevant ones; more than 15 makes YouTube ignore all of them.'],
  ['How do I check where my video ranks on YouTube?', 'Use our YouTube Rank Checker: enter a keyword and your video link to see its position in the returned search results. Results can differ between viewers and countries.'],
  ['Are these YouTube SEO tools free?', 'Yes. Every tool on VidsIQ is free to use with no signup.'],
];

export const Route = createFileRoute('/youtube-seo')({
  head: () => ({
    meta: [
      { title: TITLE }, { name: 'description', content: DESC },
      { property: 'og:title', content: TITLE }, { property: 'og:description', content: DESC },
      { property: 'og:type', content: 'article' }, { property: 'og:url', content: '/youtube-seo' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: '/youtube-seo' }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) }],
  }),
  component: Page,
});

const LINKED = ['SEO Score Checker', 'Keyword Finder', 'Tag Extractor', 'YouTube Rank Checker'];
function linkTools(text: string) {
  const parts = text.split(new RegExp(`(${LINKED.join('|')})`));
  return parts.map((p, i) => LINKED.includes(p) ? <Link key={i} to="/tools/$slug" params={{ slug: toolSlug(p) }} className="text-primary underline underline-offset-4">{p}</Link> : p);
}

function Page() {
  return <SiteShell><main className="content-page">
    <h1>YouTube SEO: Free Tools and a Practical Guide</h1>
    <p>Get your videos found in YouTube search. Each step below links to a free tool you can use right now — paste a link or topic and get a result in seconds.</p>
    {sections.map(s => <section key={s.h}><h2>{s.h}</h2><p>{s.p}</p><div className="flex flex-wrap gap-2 mt-3">{s.tools.map(t => <Button key={t} asChild variant="outline" size="sm"><Link to="/tools/$slug" params={{ slug: toolSlug(t) }}>{t} <ArrowRight /></Link></Button>)}</div></section>)}
    <h2>YouTube SEO questions, answered</h2>
    <Accordion type="single" collapsible>{faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent><p>{linkTools(a)}</p></AccordionContent></AccordionItem>)}</Accordion>
    <Button asChild className="mt-6"><Link to="/">Explore all free tools <ArrowRight /></Link></Button>
  </main></SiteShell>;
}
