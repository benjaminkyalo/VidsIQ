import { createFileRoute } from '@tanstack/react-router';
import { InfoPage, infoHead, type Faq, type InfoSection } from '@/components/toolkit/info-page';
const T = 'Write for Us – YouTube Growth Guest Posts | VidsIQ';
const D = 'Submit a guest post about YouTube SEO, channel growth, monetization or video marketing. Read our topics, quality standards and submission guidelines.';
const sections: InfoSection[] = [
  { h: 'Topics we accept', p: 'YouTube SEO, keyword research, titles and thumbnails, Shorts strategy, channel growth, monetization and the YouTube Partner Program, analytics, creator tools and video marketing for global audiences.' },
  { h: 'Quality standards', p: 'Original, unpublished articles of 1,200+ words, written from real experience, with practical steps, screenshots or data where possible. No AI-spun, keyword-stuffed or promotional content.' },
  { h: 'Formatting', p: 'Use clear H2/H3 headings, short paragraphs, and cite sources for statistics. Write for a worldwide audience in plain English.' },
  { h: 'Links', p: 'One relevant author bio link is allowed. We may add links to our own tools where they help readers, and we edit for clarity and accuracy.', tools: ['SEO Score Checker', 'Keyword Finder', 'Title Generator'] },
  { h: 'How to submit', p: 'Send three topic ideas with a one-line summary each, plus two samples of your published work, through our Contact page. We reply only to accepted pitches.' },
];
const faqs: Faq[] = [
  ['Do you accept paid guest posts?', 'No. Articles are accepted on quality alone.'],
  ['Can I republish my article elsewhere?', 'No. Accepted articles must stay exclusive to VidsIQ.'],
  ['How long does a review take?', 'We aim to review pitches within two weeks.'],
];
export const Route = createFileRoute('/write-for-us')({ head: () => infoHead('/write-for-us', T, D, faqs), component: () => <InfoPage h1="Write for Us" intro="Share your YouTube expertise with creators around the world." sections={sections} faqs={faqs} cta="Explore our tools" /> });
