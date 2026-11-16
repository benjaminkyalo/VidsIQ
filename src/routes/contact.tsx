import { createFileRoute } from '@tanstack/react-router';
import { InfoPage, infoHead, type Faq, type InfoSection } from '@/components/toolkit/info-page';
const T = 'Contact Support | VidsIQ';
const D = 'Contact VidsIQ support for help with tools, downloads, bug reports, feedback, partnerships or guest posts. Check quick fixes for common issues first.';
const sections: InfoSection[] = [
  { h: 'How to reach us', p: 'A dedicated support email is being set up. Until it is live, check the quick fixes and answers below — they solve most problems right away.' },
  { h: 'When you write to us, include', p: 'The tool you used, the YouTube link you pasted, what you expected, what happened, and your device and browser. This helps us reproduce the problem quickly.' },
  { h: 'Quick fixes for downloads', p: 'Short videos and clips download most reliably. If a download fails, wait a minute and try again, or try a shorter video. Private, age-restricted and live videos cannot be downloaded.', tools: ['YouTube to MP3', 'YouTube to MP4'] },
  { h: 'Quick fixes for missing data', p: 'Make sure the video or channel is public and the link is complete. Transcript and summary tools only work on videos that have captions.', tools: ['Transcript Generator', 'Video Summarizer'] },
  { h: 'Partnerships and guest posts', p: 'Creators, agencies and writers interested in collaborating can read our Write for Us guidelines before getting in touch.' },
];
const faqs: Faq[] = [
  ['Why did my download fail?', 'Longer videos and mixes can be refused by the free conversion service. Try again after a minute or use a shorter clip.'],
  ['Why does a channel show no subscriber count?', 'The channel has chosen to hide its subscriber count, so it is not publicly available.'],
  ['How quickly will you reply?', 'We aim to answer support messages within a few working days once the support inbox is live.'],
  ['Can I request a new tool?', 'Yes. Feature requests are welcome — tell us what you want to do and which YouTube links you would use it with.'],
];
export const Route = createFileRoute('/contact')({ head: () => infoHead('/contact', T, D, faqs, 'ContactPage'), component: () => <InfoPage h1="Contact Support" intro="Get help with any tool, report a problem, or suggest a feature." sections={sections} faqs={faqs} cta="Back to the tools" /> });
