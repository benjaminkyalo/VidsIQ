import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteShell } from '@/components/toolkit/site-shell';
import { toolSlug } from '@/lib/tools';
import { breadcrumbUrl } from '@/lib/breadcrumb-url';

const TITLE = 'Free YouTube SEO Checker & Creator Tools | VidsIQ';
const DESC = 'Improve YouTube videos with an SEO checker, title and tag generators, thumbnail preview, transcript tools and channel statistics. Explore VidsIQ creator tools.';

const jumpLinks = [
  ['#seo-checker', 'SEO Checker'],
  ['#thumbnails', 'Thumbnails'],
  ['#titles-tags', 'Titles & Tags'],
  ['#transcripts', 'Transcripts'],
  ['#monetization', 'Monetization'],
  ['#live-counters', 'Live Counters'],
  ['#shorts', 'Shorts'],
  ['#workflow', 'Workflow'],
  ['#faq', 'FAQ'],
] as const;

const pillars = [
  {
    label: 'Optimize Videos',
    body: 'Audit video metadata with the SEO Score Checker, then draft focused titles, descriptions, tags and hashtags around the phrase your audience searches.',
    tool: 'SEO Score Checker',
  },
  {
    label: 'Review Thumbnails & Text',
    body: 'Inspect full-resolution thumbnails across available sizes and turn captioned videos into clean transcripts or subtitle files.',
    tool: 'Thumbnail Viewer',
  },
  {
    label: 'Understand Channel Data',
    body: 'Track public subscriber and like totals, review channel structure, and model earnings ranges as estimates rather than private revenue.',
    tool: 'Monetization Checker',
  },
];

const workflowSteps = [
  ['1. Research', 'Start with one clear topic and identify the exact phrasing viewers type into YouTube search.'],
  ['2. Optimize', 'Lead your title and opening description lines with that topic, then add only relevant tags and hashtags.'],
  ['3. Preview', 'Check that your thumbnail stays sharp and legible at smaller mobile sizes before publishing.'],
  ['4. Review', 'Compare public statistics over time and confirm private analytics and confirmed earnings inside YouTube Studio.'],
] as const;

const faqs: [string, string][] = [
  ['What does a YouTube SEO checker look at?', 'It reviews your video title, description, tags, hashtags, chapters, captions and thumbnail signals so you can spot metadata improvements before or after publishing. It cannot guarantee rankings or views.'],
  ['How many subscribers and watch hours do I need to be monetized?', 'Full Partner Program eligibility generally requires 1,000 subscribers plus either 4,000 public watch hours in the past 12 months or 10 million public Shorts views in 90 days. YouTube also offers earlier tiers with limited features—confirm current rules in YouTube Studio.'],
  ['Does a monetization checker confirm earnings?', 'No. A public-data check only surfaces eligibility indicators and illustrative estimates. Always verify enrollment and actual payouts inside YouTube Studio.'],
  ['Is the views-to-money result guaranteed?', 'No. Earnings depend on RPM, which varies widely by niche, audience region, video length, format and the share of monetized views. Shorts usually earn far less per view than long-form videos.'],
  ['Are live subscriber and like counts exact?', 'Public counts may be rounded by YouTube, delayed, hidden by the creator or briefly cached. Treat displayed figures as public indicators rather than exact real-time studio records.'],
  ['How long should a YouTube title be?', 'YouTube allows up to 100 characters, but keeping titles around 60 characters helps prevent them from being cut off in search results and on phones.'],
  ['Do YouTube tags and hashtags still matter?', 'Tags play a supporting role—mostly for spelling variations and topic context within the 500-character limit. Hashtags are clickable, with the first three shown above your title; using more than 15 causes YouTube to ignore all of them.'],
  ['How can I see the tags or keywords on another video?', 'Paste any public video link into our Tag Extractor or Keyword Finder to inspect available published tags and candidate keywords. Some creators leave tags empty.'],
  ['Can I use these tools without signing up?', 'Yes. Every tool on VidsIQ is free to use in your browser with no account or browser extension required.'],
  ['Is downloading YouTube Shorts allowed?', 'Only for videos you own or have explicit permission to use. Downloading someone else’s content without permission may break YouTube’s Terms of Service and copyright law.'],
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
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'VidsIQ', item: breadcrumbUrl('/') },
              { '@type': 'ListItem', position: 2, name: 'YouTube SEO Checker & Creator Tools', item: breadcrumbUrl('/youtube-seo') },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(([q, a]) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          },
        ],
      }),
    }],
  }),
  component: Page,
});

const LINKED = ['SEO Score Checker', 'Keyword Finder', 'Tag Extractor', 'YouTube Rank Checker', 'Monetization Checker', 'Views to Money'];
function linkTools(text: string) {
  const parts = text.split(new RegExp(`(${LINKED.join('|')})`));
  return parts.map((p, i) => LINKED.includes(p) ? <Link key={i} to="/tools/$slug" params={{ slug: toolSlug(p) }} className="text-primary underline underline-offset-4">{p}</Link> : p);
}

function ToolLinks({ tools }: { tools: string[] }) {
  return <div className="flex flex-wrap gap-2 mt-3 mb-6">{tools.map(t => <Button key={t} asChild variant="outline" size="sm"><Link to="/tools/$slug" params={{ slug: toolSlug(t) }}>{t} <ArrowRight /></Link></Button>)}</div>;
}

function Page() {
  return <SiteShell><main className="content-page">
    <h1>Free YouTube SEO Checker &amp; Creator Tools</h1>
    <p>Make better-informed decisions before and after you publish. Paste a video link, channel handle or topic into VidsIQ to audit metadata, compare thumbnails, draft titles and tags, extract transcripts, check monetization signals and monitor public counters—free, with no sign-up.</p>

    <nav aria-label="Page sections" className="flex flex-wrap gap-2 mb-8">
      {jumpLinks.map(([href, label]) => <a key={href} href={href} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:border-primary hover:text-primary transition-colors">{label}</a>)}
    </nav>

    <section className="grid gap-4 sm:grid-cols-3 mb-10" aria-label="Core creator tool groups">
      {pillars.map(p => <article key={p.label} className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between gap-3"><div><h2 className="!mt-0 !mb-2 !text-lg font-semibold text-foreground">{p.label}</h2><p className="!mb-0 text-sm">{p.body}</p></div><Link to="/tools/$slug" params={{ slug: toolSlug(p.tool) }} className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">Open {p.tool} <ArrowRight className="size-3.5" /></Link></article>)}
    </section>

    <section id="seo-checker">
      <h2>YouTube SEO Checker: Audit Any Video or Channel</h2>
      <p>A YouTube SEO checker reviews the public signals that help viewers discover your video across YouTube search, suggested feeds and web results. Inspect a published video link or check your draft metadata to see what to tighten first:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-5">
        <li><strong className="text-foreground">Title:</strong> main keyword placement, character length and whether it truncates on mobile screens.</li>
        <li><strong className="text-foreground">Description:</strong> primary topic in the opening two lines, natural wording, links and chapter timestamps.</li>
        <li><strong className="text-foreground">Tags and hashtags:</strong> topic relevance, character budget and the first three hashtags shown above your title.</li>
        <li><strong className="text-foreground">Thumbnail and captions:</strong> visual clarity at small sizes and subtitle availability for search and silent viewing.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-5 mb-2">YouTube Channel SEO Checker</h3>
      <p>Auditing an entire channel? Inspect the channel name, handle, about section, published keywords and upload history so new visitors immediately understand what you publish and why to subscribe.</p>
      <ToolLinks tools={['SEO Score Checker', 'Channel Viewer', 'Keyword Finder', 'YouTube Rank Checker']} />
    </section>

    <section id="thumbnails">
      <h2>YouTube Thumbnail Viewer &amp; Preview</h2>
      <p>Inspect any public video thumbnail at full resolution and compare every available size before saving or designing your own. Small, crowded text is one of the fastest ways a strong video loses clicks—check legibility at compact sizes before you publish.</p>
      <ToolLinks tools={['Thumbnail Viewer', 'Thumbnail Downloader']} />
    </section>

    <section id="titles-tags">
      <h2>YouTube Title, Tag &amp; Hashtag Generators</h2>
      <h3 className="text-xl font-semibold mt-4 mb-2">Title &amp; description drafting</h3>
      <p>Enter your topic to generate title ideas that lead with the main keyword, stay near 60 characters so they do not cut off, and promise a clear takeaway without misleading clickbait. Pair them with a structured description and chapter outline.</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Tags and hashtags</h3>
      <p>Build relevant video tags for spelling variations and topic context, and pick a tight set of clickable hashtags for videos and Shorts. Skip unrelated terms—staying focused helps viewers and algorithms understand the subject.</p>
      <ToolLinks tools={['Title Generator', 'Description Generator', 'Tag Generator', 'Tag Extractor', 'Hashtag Generator']} />
    </section>

    <section id="transcripts">
      <h2>YouTube Transcript Generator</h2>
      <p>Convert any captioned video into clean, readable text in seconds. Use transcripts to draft articles, pull accurate quotes, create study notes or export subtitle files as TXT or SRT—then review for accuracy before publishing.</p>
      <ToolLinks tools={['Transcript Generator', 'Subtitle Downloader']} />
    </section>

    <section id="monetization">
      <h2>YouTube Monetization Checker &amp; Views-to-Money Converter</h2>
      <p>Compare any public channel against Partner Program milestones—1,000 subscribers with 4,000 public watch hours in 12 months or 10 million public Shorts views in 90 days—alongside original-content and policy basics.</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">How much does YouTube pay for views?</h3>
      <p>Creator payouts come from RPM (revenue per 1,000 views), not a fixed per-view rate. RPM varies widely by niche, audience location, video length and format, and Shorts typically earn far less per view than long-form uploads.</p>
      <p className="rounded-md border border-border bg-card px-4 py-3 text-foreground font-medium">Formula: Estimated earnings = (views ÷ 1,000) × RPM</p>
      <p>Treat every calculator output as a planning estimate rather than confirmed income; check private earnings inside YouTube Studio.</p>
      <ToolLinks tools={['Monetization Checker', 'Views to Money', 'Money Calculator']} />
    </section>

    <section id="live-counters">
      <h2>Live Subscriber Counter &amp; YouTube Like Counter</h2>
      <p>Check a channel’s public subscriber total or a video’s public like count and refresh whenever you need an updated reading—handy for milestone tracking, competitor checks and quick campaign snapshots. Public figures may be rounded or briefly cached by YouTube.</p>
      <ToolLinks tools={['Live Subscriber Count', 'Like Counter']} />
    </section>

    <section id="shorts">
      <h2>YouTube Shorts Downloader &amp; Converter (Your Own Videos)</h2>
      <p>Need a copy of a Short you published? Save your own Short as MP4 or MP3 for editing, archiving or reposting on other platforms. Only download videos you own or have explicit permission to use; downloading others’ content may violate YouTube’s Terms of Service and copyright law.</p>
      <ToolLinks tools={['YouTube Shorts Downloader', 'Shorts to MP3']} />
    </section>

    <section id="workflow">
      <h2>A Practical Workflow for YouTube Creators</h2>
      <ol className="grid gap-4 sm:grid-cols-2 list-none pl-0 mb-8">
        {workflowSteps.map(([step, text]) => <li key={step} className="rounded-lg border border-border bg-card p-4"><strong className="block text-foreground mb-1">{step}</strong><span className="text-sm text-muted-foreground">{text}</span></li>)}
      </ol>
    </section>

    <section aria-labelledby="alternative-heading" className="rounded-lg border border-border bg-card p-5 mb-8">
      <h2 id="alternative-heading" className="!mt-0 !mb-2 !text-xl">Looking for a vidIQ Alternative?</h2>
      <p className="!mb-0">VidsIQ is an independent site and is not affiliated with vidIQ. If you want fast, free YouTube checks in your browser without installing an extension or creating an account, start with any tool linked above.</p>
    </section>

    <section id="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="mb-8">
        {faqs.map(([q, a]) => <details key={q} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-foreground hover:underline [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="size-4 shrink-0 text-muted-foreground group-open:rotate-180" /></summary><p className="!mb-4 text-sm leading-relaxed">{linkTools(a)}</p></details>)}
      </div>
    </section>

    <div className="flex flex-wrap items-center gap-3 mb-8">
      <Button asChild><Link to="/tools/$slug" params={{ slug: toolSlug('SEO Score Checker') }}>Open YouTube SEO Checker <ArrowRight /></Link></Button>
      <Button asChild variant="outline"><Link to="/">Explore all free tools <ArrowRight /></Link></Button>
    </div>

    <p className="text-xs text-muted-foreground border-t border-border pt-4">VidsIQ is not affiliated with or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.</p>
  </main></SiteShell>;
}
