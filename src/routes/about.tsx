import { createFileRoute } from '@tanstack/react-router';
import { InfoPage, infoHead, type Faq, type InfoSection } from '@/components/toolkit/info-page';
const T = 'About Us – Free YouTube Creator Tools | VidsIQ';
const D = 'Who we are and how VidsIQ helps creators worldwide research channels, check video SEO, generate metadata and save permitted assets for free.';
const sections: InfoSection[] = [
  { h: 'Our mission', p: 'VidsIQ gives creators, marketers and researchers in every country fast, free tools that turn public YouTube data into clear next steps — no signup, no installs.' },
  { h: 'What you can do here', p: 'Audit a channel, estimate monetization eligibility, check a video’s SEO score, extract or generate tags, titles and descriptions, read transcripts, and save thumbnails and permitted audio or video.', tools: ['Monetization Checker', 'SEO Score Checker', 'Tag Generator', 'Transcript Generator'] },
  { h: 'How our data works', p: 'Statistics come from public YouTube records at the moment you search and may be cached for a few seconds to keep the site fast. AI tools write suggestions from the details you provide.' },
  { h: 'What the results can—and cannot—tell you', p: 'Public counts describe visible activity. Monetization guesses, earnings scenarios and SEO scores are estimates, not private analytics or guarantees. Confirm account decisions in YouTube Studio.' },
  { h: 'Responsible use', p: 'Only download content you own or have permission to use, and respect creators’ rights and YouTube’s terms. Private, age-restricted and live videos are not supported.' },
];
const faqs: Faq[] = [
  ['Is VidsIQ free?', 'Yes. Every tool is free to use with no account required.'],
  ['Are you affiliated with YouTube or Google?', 'No. VidsIQ is an independent service and is not endorsed by YouTube or Google.'],
  ['Do you store my searches?', 'We do not require accounts. Public lookups may be cached briefly to speed up repeat requests; we never access private channel data.'],
  ['Can I use the tools on my phone?', 'Yes. Every page works on phones, tablets and desktops.'],
];
export const Route = createFileRoute('/about')({ head: () => infoHead('/about', T, D, faqs, 'AboutPage'), component: () => <InfoPage h1="About VidsIQ" intro="Free, fast YouTube tools for creators everywhere." sections={sections} faqs={faqs} /> });
