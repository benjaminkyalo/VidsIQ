/**
 * BLOG POSTS — edit this list to add, remove or change articles (newest first).
 * - slug: the web address, e.g. /blogs/how-to-get-monetized (lowercase, hyphens, unique).
 * - image: a key from src/lib/blog-images.ts (add the picture there).
 * - tool: exact tool name the article recommends.
 * - sections: the article body; add as many { h, p } blocks as you like.
 * New posts automatically get their own page, search metadata and sitemap entry.
 */
export type BlogPost = {
  slug: string; title: string; excerpt: string; category: string;
  date: string; isoDate: string; readTime: string; image: string; tool: string;
  sections: { h: string; p: string }[];
};

export const blogPosts: BlogPost[] = [
  { slug: 'how-to-get-monetized-on-youtube', title: 'How to Get Monetized on YouTube in 2026', excerpt: 'Requirements for the Partner Program: 1,000 subscribers plus 4,000 watch hours, or 10 million Shorts views in 90 days — and how to close the gap.', category: 'Monetization', date: 'Nov 11, 2026', isoDate: '2026-11-11', readTime: '7 min read', image: 'monetized', tool: 'Monetization Checker', sections: [
    { h: 'The eligibility thresholds', p: 'To join the YouTube Partner Program for ad revenue, a channel needs 1,000 subscribers plus either 4,000 valid public watch hours in the last 12 months or 10 million valid public Shorts views in the last 90 days. Lower fan-funding tiers may open earlier in some regions.' },
    { h: 'Measure your gap', p: 'Work out how many subscribers and watch hours you still need, then divide by the weeks you want to reach the goal. A clear weekly target turns a vague ambition into a publishing plan.' },
    { h: 'Grow watch time deliberately', p: 'Longer videos that hold attention, playlists that chain related uploads, and end screens pointing to your next video all add watch hours faster than one-off uploads.' },
    { h: 'Stay within the policies', p: 'Reused content, misleading metadata and community guideline strikes can block approval even when thresholds are met. Review the monetization policies before you apply.' },
  ] },
  { slug: 'how-to-rank-youtube-videos-in-search', title: 'How to Rank YouTube Videos in Search', excerpt: 'Pick one keyword, place it early, add chapters and captions, and keep viewers watching. Score your metadata before you publish.', category: 'SEO', date: 'Nov 05, 2026', isoDate: '2026-11-05', readTime: '9 min read', image: 'rank', tool: 'SEO Score Checker', sections: [
    { h: 'Choose one main keyword', p: 'Each video should target one phrase people actually type. Use YouTube search suggestions to find wording viewers use, then build the title and description around it.' },
    { h: 'Place the keyword where it counts', p: 'Put the phrase near the start of the title and in the first sentence of the description. Say it naturally in the video so captions reinforce it.' },
    { h: 'Add chapters and captions', p: 'Timestamped chapters help viewers jump to answers and can appear in search results. Accurate captions make spoken content readable and accessible.' },
    { h: 'Retention decides the rest', p: 'Search placement follows satisfaction. A strong opening, quick delivery of the promised answer and tight editing keep viewers watching, which matters more than any tag.' },
  ] },
  { slug: 'youtube-titles-and-descriptions-that-get-clicks', title: 'Write Titles and Descriptions That Get Clicks', excerpt: 'Keep titles near 60–70 characters, promise one clear result, and use the first two description lines as a summary.', category: 'Growth', date: 'Oct 30, 2026', isoDate: '2026-10-30', readTime: '6 min read', image: 'titles', tool: 'Title Generator', sections: [
    { h: 'One promise per title', p: 'The best titles state a single, specific outcome. Keep them around 60–70 characters so they are not cut off on phones.' },
    { h: 'Match title and thumbnail', p: 'The thumbnail should show what the title promises without repeating the same words. Together they answer “why should I watch this now?”' },
    { h: 'Use the first two description lines', p: 'Only the opening lines show before “more”. Summarize the value and include your main keyword there; put links and chapters below.' },
    { h: 'Test and refine', p: 'If click-through rate is low after a few days, try a clearer title. Small wording changes can noticeably change performance.' },
  ] },
  { slug: 'youtube-tags-and-hashtags-that-help', title: 'Tags and Hashtags That Still Help', excerpt: 'Tags catch misspellings and related phrases; two or three hashtags help discovery. See what top videos use.', category: 'SEO', date: 'Oct 22, 2026', isoDate: '2026-10-22', readTime: '5 min read', image: 'tags', tool: 'Tag Extractor', sections: [
    { h: 'What tags really do', p: 'YouTube says tags play a minor role, mainly helping with commonly misspelled words. Use a handful of accurate tags rather than long lists.' },
    { h: 'Hashtags for discovery', p: 'Two or three relevant hashtags in the description can appear above the title and link to hashtag pages. Avoid unrelated or excessive hashtags.' },
    { h: 'Learn from top videos', p: 'Extract tags from videos already ranking for your topic to see which related phrases they cover, then use only the ones that genuinely fit your video.' },
  ] },
  { slug: 'how-much-do-youtubers-earn', title: 'How Much Do YouTubers Earn?', excerpt: 'Earnings depend on audience country, niche and watch time. Compare realistic scenarios rather than one number.', category: 'Analytics', date: 'Oct 15, 2026', isoDate: '2026-10-15', readTime: '8 min read', image: 'earn', tool: 'Money Calculator', sections: [
    { h: 'Why there is no single number', p: 'Ad rates vary widely by viewer location, topic, season and how many views are monetized. Two channels with equal views can earn very different amounts.' },
    { h: 'RPM versus CPM', p: 'CPM is what advertisers pay per thousand ad impressions. RPM is what a creator actually receives per thousand views after YouTube’s share and unmonetized views.' },
    { h: 'Beyond ads', p: 'Memberships, Super Thanks, sponsorships, affiliate links and products often outweigh ad revenue for established creators.' },
    { h: 'Estimate with scenarios', p: 'Use low, typical and high RPM scenarios to see a realistic range instead of relying on one figure. Actual earnings are only visible in YouTube Studio.' },
  ] },
];

export const findBlogPost = (slug: string) => blogPosts.find(p => p.slug === slug);
