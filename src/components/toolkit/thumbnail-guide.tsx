import { Link } from '@tanstack/react-router';
import { ArrowUp, Check, ChevronDown } from 'lucide-react';
import {
  thumbnailAudiences,
  thumbnailFaqs,
  thumbnailFeatures,
  thumbnailLinkFormats,
  thumbnailPageContent,
  thumbnailSizes,
  thumbnailSteps,
  thumbnailTips,
} from '@/lib/thumbnail-content';

export function ThumbnailGuide() {
  return <>
    <section className="dl-seo" aria-labelledby="thumbnail-intro-title">
      <div className="dl-seo-inner">
        <h2 id="thumbnail-intro-title">Download Any YouTube Thumbnail in Seconds</h2>
        <p className="dl-seo-intro">{thumbnailPageContent.introduction}</p>
        <p className="mt-4">Creators use it for design research, designers for mockups and presentations, and editors for clean cover images. The page works on desktop, phone, and tablet screens.</p>

        <h3>How to Download a YouTube Thumbnail</h3>
        <ol className="dl-seo-steps">{thumbnailSteps.map((step, index) => <li key={step.title}><span className="dl-seo-num">{index + 1}</span><div><h4>{step.title}</h4><p>{step.text}</p></div></li>)}</ol>

        <h3>Supported Link Formats</h3>
        <p>Use a complete link or its 11-character video ID. Extra sharing parameters do not prevent a recognized video link from resolving.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{thumbnailLinkFormats.map(([label, format]) => <div key={label} className="min-w-0 rounded-lg border border-border bg-card p-4"><strong className="block">{label}</strong><code className="mt-2 block break-words text-sm text-muted-foreground">{format}</code></div>)}</div>

        <h3>YouTube Thumbnail Sizes and Resolutions</h3>
        <p>The maximum-resolution image only exists when YouTube provides it. If your selected size is unavailable, choose the next smaller option.</p>
        <div className="mt-5 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead className="bg-card"><tr><th className="p-4">Quality</th><th className="p-4">Resolution</th><th className="p-4">Best for</th></tr></thead><tbody>{thumbnailSizes.map(([quality, resolution, use]) => <tr key={quality} className="border-t border-border"><th scope="row" className="p-4">{quality}</th><td className="p-4 text-muted-foreground">{resolution}</td><td className="p-4 text-muted-foreground">{use}</td></tr>)}</tbody></table></div>

        <h3>Why Use VidsIQ’s Thumbnail Downloader?</h3>
        <div className="dl-seo-features">{thumbnailFeatures.map(([title, text]) => <div key={title} className="dl-seo-card"><h4 className="flex items-center gap-2"><Check className="size-5" />{title}</h4><p>{text}</p></div>)}</div>

        <h3>Who Uses a Thumbnail Downloader?</h3>
        <div className="dl-seo-features">{thumbnailAudiences.map(([title, text]) => <div key={title} className="dl-seo-card"><h4>{title}</h4><p>{text}</p></div>)}</div>

        <h3>Tips for Great YouTube Thumbnails</h3>
        <p>Use downloaded artwork as permitted reference, then make design choices that communicate your own video clearly.</p>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">{thumbnailTips.map(([title, text]) => <li key={title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"><Check className="mt-1 size-5 shrink-0" /><div><h4>{title}</h4><p>{text}</p></div></li>)}</ul>

        <div className="mt-10 rounded-lg border border-border bg-card p-6"><h3 className="mt-0">Ready to save your image?</h3><p>{thumbnailPageContent.closing}</p><a href="#tool-action" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline">Paste a link above <ArrowUp className="size-5" /></a></div>
      </div>
    </section>

    <section className="tools-section border-t border-border" aria-labelledby="thumbnail-faq-title">
      <div className="wide-container max-w-4xl">
        <div className="section-heading"><h2 id="thumbnail-faq-title">Frequently Asked Questions</h2><p>Answers about image quality, supported links, phone downloads, file formats, and responsible reuse.</p></div>
        {thumbnailFaqs.map(([question, answer]) => <details key={question} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium leading-relaxed hover:underline [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="size-5 shrink-0 text-muted-foreground group-open:rotate-180" /></summary><p className="pb-5 text-base leading-relaxed text-muted-foreground">{answer}</p></details>)}
        <nav className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Related image tools"><span className="text-muted-foreground">Related tools:</span><Link className="text-primary underline" to="/tools/$slug" params={{ slug: 'thumbnail-viewer' }}>YouTube Thumbnail Viewer</Link><Link className="text-primary underline" to="/tools/$slug" params={{ slug: 'profile-downloader' }}>YouTube Profile Downloader</Link></nav>
      </div>
    </section>
  </>;
}
