/** Editorial page content for priority tools, keyed by catalog tool name. Browser-safe. */
export type PageGuideSection =
  | { kind: 'steps'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'cards'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'checks'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'warn'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'formats'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'table'; title: string; intro?: string; head: string[]; rows: string[][] }
  | { kind: 'text'; title: string; paragraphs: string[] };

export type PageGuideContent = {
  h1: string;
  hero: string;
  introTitle: string;
  intro: string[];
  sections: PageGuideSection[];
  closingTitle: string;
  closing: string;
  faqIntro: string;
  faqs: [string, string][];
  related: { slug: string; label: string }[];
  externalLink?: { href: string; label: string };
};

const transcript: PageGuideContent = {
  h1: 'YouTube Transcript Generator: Get Any Video Transcript in Seconds',
  hero: 'Paste a YouTube link to get the full text of the video, ready to copy, search, or download as TXT or SRT. Free, no signup, on any device.',
  introTitle: 'Turn Any YouTube Video into Text',
  intro: [
    'Paste a YouTube link into the box above. In a few seconds you’ll see the full text of the video, ready to copy, search, or download. It’s free, needs no signup, and works on regular videos, Shorts, and live stream replays that have captions.',
    'Students use it for notes and study guides. Writers and marketers use it to repurpose videos into blog posts. Researchers use it to quote and cite accurately. Anyone who prefers reading to watching uses it to skim a video in a minute.',
  ],
  sections: [
    { kind: 'steps', title: 'How to Get a YouTube Transcript', items: [
      ['Copy the video link', 'Copy the URL from your browser, or tap Share > Copy link in the YouTube app.'],
      ['Paste it into the box', 'Drop the link into the field at the top of this page. A recognized link starts automatically.'],
      ['Read the transcript', 'The full text appears on the page. Pick another caption language when the video offers more than one.'],
      ['Copy or download', 'Show or hide timestamps, copy the text, or download it as a TXT or SRT file.'],
    ] },
    { kind: 'checks', title: 'What You Can Do With the Transcript', items: [
      ['Copy in one click', 'Copy the whole text, with or without timestamps.'],
      ['Show or hide timestamps', 'Each time links to that exact moment in the video.'],
      ['Download as TXT', 'For notes, documents, and AI tools.'],
      ['Download as SRT', 'For subtitles and video editors.'],
      ['Search the text', 'Use the search box to find any word or quote instantly.'],
      ['Choose a language', 'Switch between caption tracks when the video has several.'],
    ] },
    { kind: 'formats', title: 'Supported Link Formats', items: [
      ['Standard video', 'youtube.com/watch?v=VIDEO_ID'],
      ['Short link', 'youtu.be/VIDEO_ID'],
      ['YouTube Shorts', 'youtube.com/shorts/VIDEO_ID'],
      ['Mobile video', 'm.youtube.com/watch?v=VIDEO_ID'],
      ['Live stream replay', 'youtube.com/live/VIDEO_ID'],
    ] },
    { kind: 'cards', title: 'Why Use VidsIQ’s Transcript Generator?', items: [
      ['Free to use', 'No credits, no account, and no hidden fees.'],
      ['No signup or software', 'Works in your browser on any device.'],
      ['Fast', 'Most transcripts load in a few seconds.'],
      ['Clean output', 'Readable text, with or without timestamps.'],
      ['No YouTube password', 'Only the public video link is needed; your login is never requested.'],
    ] },
    { kind: 'cards', title: 'Who Uses a Transcript Generator?', items: [
      ['Students', 'Turn lectures and tutorials into study notes.'],
      ['Content creators', 'Repurpose your own videos into blogs, newsletters, and social posts.'],
      ['Researchers and journalists', 'Find and check exact quotes.'],
      ['Marketers', 'Study what competitors say and how they say it.'],
      ['Language learners', 'Read along while you listen.'],
      ['Deaf and hard-of-hearing viewers', 'Follow a video when audio isn’t an option.'],
      ['Busy people', 'Skim a long video before deciding to watch it.'],
    ] },
    { kind: 'checks', title: 'Tips for Getting the Most From a Transcript', items: [
      ['Proofread before you publish', 'Auto-generated captions can misspell names, brands, and technical terms.'],
      ['Use timestamps to cite', 'Note the time of a quote so readers can verify it.'],
      ['Summarize long videos', 'Paste the text into your favourite AI assistant and ask for key points or an outline.'],
      ['Add punctuation and paragraphs', 'Raw captions are one long stream; a quick edit makes them readable.'],
      ['Credit the creator', 'Quote briefly, credit the creator, and link to the video instead of republishing the full transcript.'],
    ] },
  ],
  closingTitle: 'Ready to turn a video into text?',
  closing: 'Whether you’re studying, researching, or repurposing your own videos, VidsIQ’s YouTube Transcript Generator gets you the full text in seconds.',
  faqIntro: 'Answers about accuracy, languages, file formats, AI tools, and responsible reuse.',
  faqs: [
    ['How do I get the transcript of a YouTube video?', 'Copy the video URL and paste it into the box above. The text appears in a few seconds. You can also open the video on YouTube, expand the description, and choose Show transcript, but a generator lets you copy and download it more easily.'],
    ['Is this YouTube transcript generator free?', 'Yes. It’s free, with no account, no payment, and no download credits.'],
    ['Do I need to sign up or install anything?', 'No. It runs in your browser, so there’s no extension, app, or account to set up.'],
    ['Can I download the transcript as a file?', 'Yes. Download it as a plain text (TXT) file for notes and documents, or as an SRT subtitle file for video editing.'],
    ['Can I get the transcript with timestamps?', 'Yes. Show times to see when each line is spoken, or hide them for clean, copy-ready text.'],
    ['Why does the transcript say it is unavailable?', 'Transcripts come from the video’s captions. If the creator turned captions off, or YouTube hasn’t generated them yet (common for brand-new uploads, very short clips, or videos with little clear speech), there’s nothing to retrieve. Try again later, or try another video.'],
    ['How accurate is the transcript?', 'Creator-uploaded captions are usually very accurate. Auto-generated captions are good for clear speech but can miss names, accents, jargon, and fast talking. Always proofread before quoting or publishing.'],
    ['Can I get a transcript in another language?', 'If the video has captions in more than one language, choose the one you want from the language menu. Otherwise you get the original caption language. For another language, paste the text into a translation tool.'],
    ['Does it work on YouTube Shorts?', 'Yes. Paste the Shorts link and it works like any other video, as long as the Short has captions.'],
    ['Can I use the transcript on my phone?', 'Yes. Paste the link, then tap Copy or Download. It works on Android, iPhone, and tablets.'],
    ['Does it work on long videos, podcasts, and live stream replays?', 'Yes, as long as captions exist. Very long transcripts may take a few extra seconds to load.'],
    ['Can I use the transcript with ChatGPT or other AI tools?', 'Yes. Copy the text and paste it into any AI assistant to summarize, extract key points, write an outline, or draft a blog post. For very long videos, paste it in sections.'],
    ['Is it legal to use a YouTube transcript?', 'The words in a video belong to its creator. Personal notes, study, accessibility, and short cited quotes are generally fine. Republishing a full transcript, or passing it off as your own, can infringe copyright. Credit the creator and check the rules where you live for commercial use. This is not legal advice.'],
    ['Can I get the transcript of a private or deleted video?', 'No. Only public and unlisted videos with captions can be read.'],
    ['Does this tool download the video?', 'No. It only retrieves the text. It doesn’t download, rip, or convert video or audio.'],
    ['How do I turn a transcript into a blog post?', 'Download the TXT, remove filler words, add headings and paragraphs, then rewrite it in your own voice and embed the video with credit. Lightly edited transcripts read poorly and rank poorly.'],
  ],
  related: [
    { slug: 'video-summarizer', label: 'YouTube Video Summarizer' },
    { slug: 'subtitle-downloader', label: 'YouTube Subtitle Downloader' },
    { slug: 'youtube-without-ads', label: 'Watch YouTube without ads' },
    { slug: 'thumbnail-downloader', label: 'YouTube Thumbnail Downloader' },
  ],
};

const withoutAds: PageGuideContent = {
  h1: 'How to Watch YouTube Without Ads: Every Option Explained',
  hero: 'Paste a link to watch in our clean, distraction-free player with captions, speed, theater, and fullscreen controls. YouTube controls the ads it serves, so some may still appear; every option is explained below.',
  introTitle: 'The Short Answer',
  intro: [
    'The only official way to watch YouTube without ads is YouTube Premium (and, in some countries, a lighter Premium plan). Everything else is either a partial workaround or comes with risks.',
    'Below is every option, what it really does, and what to avoid, so you can pick the one that fits. The VidsIQ player above gives you a clean page without comments, recommendations feed, or clutter around the video.',
  ],
  sections: [
    { kind: 'table', title: 'Your Options at a Glance', head: ['Option', 'Removes ads?', 'Cost', 'What to know'], rows: [
      ['YouTube Premium', 'Yes, on videos', 'Paid monthly', 'Official. Also adds background play and offline downloads.'],
      ['Premium Lite (some countries)', 'Most videos', 'Paid, lower', 'Fewer features than Premium. Check what’s included where you live.'],
      ['Family or Student plan', 'Yes, on videos', 'Paid, lower per person', 'Same ad-free benefit. Eligibility rules apply.'],
      ['Ad blocker extensions', 'Sometimes', 'Free', 'Against YouTube’s terms, often blocked, and extensions can be a security risk.'],
      ['Unofficial or modded apps', 'Sometimes', 'Free', 'Not safe. Breaks the rules, can carry malware, can lose your account access.'],
      ['YouTube Kids', 'No', 'Free', 'Still shows ads.'],
      ['Skip button and ad settings', 'Reduces', 'Free', 'Safe and official, but ads still appear.'],
    ] },
    { kind: 'text', title: 'The Official Way: YouTube Premium', paragraphs: [
      'YouTube Premium removes ads from videos across the website, mobile app, and TV app when you’re signed in to your paid account. It also includes background play (audio keeps playing with the screen off), offline downloads in the app, and YouTube Music Premium. Prices and plans vary by country, so check YouTube’s own Premium page for your region before deciding.',
      'One thing Premium does not remove: sponsor segments that creators place inside their own videos. Those are part of the video itself, not YouTube ads.',
    ] },
    { kind: 'checks', title: 'Free Ways to Make Ads Less Annoying', items: [
      ['Use the Skip button', 'Many ads become skippable after a few seconds.'],
      ['Jump past sponsor segments', 'Use chapters or tap forward to skip a creator’s sponsored section.'],
      ['Use My Ad Center', 'In your Google account, choose which kinds of ads you see and stop irrelevant or repetitive ones.'],
      ['Report bad ads', 'Use the ad’s menu to stop seeing it or report it.'],
      ['Watch on a bigger screen', 'Many people find ads less intrusive on a TV than on a phone.'],
      ['Pick creators with fewer mid-rolls', 'Many channels place ads only at the start.'],
    ] },
    { kind: 'warn', title: 'What to Avoid', items: [
      ['“Ad-free” apps and modded APKs', 'They’re unofficial, unsafe, and often carry malware or steal logins.'],
      ['Sites that ask you to sign in with Google', 'A real ad-free site never needs your YouTube password. VidsIQ never asks for it.'],
      ['Extensions with broad permissions', 'An extension that can read every page you visit can read your emails and banking too.'],
      ['Anything promising “unlimited free Premium”', 'If it sounds too good to be true, it is.'],
    ] },
    { kind: 'text', title: 'Is YouTube Premium Worth It?', paragraphs: [
      'It’s worth it if you watch YouTube daily, listen to music or podcasts in the background, download videos for travel, or share a Family plan. It’s probably not worth it if you watch occasionally, mainly on a TV, and don’t mind skipping ads.',
    ] },
    { kind: 'text', title: 'Why Does YouTube Show Ads at All?', paragraphs: [
      'Ads pay for YouTube’s servers and give creators a share of revenue. Premium is the alternative: you pay directly, and creators earn a share of your subscription instead. Using official options keeps the creators you watch paid.',
    ] },
  ],
  closingTitle: 'Pick the option that fits you',
  closing: 'There’s no magic switch that removes every ad for free, but you do have good options. Choose Premium for the full ad-free experience, use the free settings above to make ads far less annoying, and stay clear of anything that asks for your login or install permissions.',
  faqIntro: 'Honest answers about Premium, ad blockers, safety, family plans, and creator earnings.',
  faqs: [
    ['Can I watch YouTube without ads for free?', 'Not fully. There’s no official free way to remove ads. You can reduce them with the Skip button, My Ad Center settings, and by skipping sponsor segments, but ads will still appear.'],
    ['What is the best way to watch YouTube without ads?', 'YouTube Premium is the official, safe, and most reliable way. It removes ads on videos across web, mobile, and TV.'],
    ['Does the VidsIQ player remove YouTube ads?', 'No tool outside YouTube can guarantee that. The VidsIQ player gives you a clean, distraction-free page with captions, speed, theater, and fullscreen controls, but YouTube decides which ads to serve.'],
    ['Is YouTube Premium worth paying for?', 'If you watch daily, use background play, download videos, or share a Family plan, most people find it worth it. If you watch rarely, free ad-reducing settings may be enough.'],
    ['Does YouTube Premium remove all ads?', 'It removes YouTube’s ads on videos. It does not remove sponsorships that a creator puts inside their own video, and some promotional placements may still appear.'],
    ['Is there a cheaper Premium option?', 'Depending on your country, there may be a lighter Premium plan, plus Family and Student plans that lower the cost per person. Plans and prices vary by region, so check YouTube’s Premium page.'],
    ['Are ad blockers safe or legal for YouTube?', 'They aren’t illegal in most places, but they go against YouTube’s terms, and YouTube actively works to block them, which can cause slow or blocked playback. Extensions can also request broad access to your browsing, so install only from trusted sources.'],
    ['Why does YouTube keep showing an ad blocker warning?', 'YouTube detects some blockers and limits playback for people using them. The official fix is Premium, or turning the blocker off for YouTube.'],
    ['Are ad-free YouTube apps and websites safe?', 'Most aren’t. Modded apps and “ad-free” sites that ask you to sign in with your Google account are common sources of malware and account theft. Avoid them.'],
    ['Does YouTube Kids have ads?', 'Yes. YouTube Kids shows ads, though with stricter rules about what’s allowed. Premium members get ad-free viewing there too.'],
    ['Does Premium work on my TV and phone?', 'Yes. Sign in with your Premium account on the website, the mobile app, and supported TV and streaming devices to get ad-free videos.'],
    ['Can I share YouTube Premium with my family?', 'Yes, through a Family plan, which lets members of one household share a single subscription. Eligibility rules apply.'],
    ['Does Premium include YouTube Music?', 'Yes. Premium includes YouTube Music Premium, so music plays ad-free and in the background.'],
    ['How do I skip sponsor segments inside a video?', 'Use the video’s chapters if the creator added them, or tap or drag forward on the timeline. Premium doesn’t remove sponsor segments because they’re part of the video.'],
    ['Do creators still get paid if I use Premium?', 'Yes. Creators earn a share of Premium revenue based on how much Premium members watch their content.'],
    ['How can I reduce the number of irrelevant ads?', 'Open My Ad Center in your Google account to control the topics and brands you see, and use the ad menu to stop or report ads you don’t want.'],
  ],
  related: [
    { slug: 'transcript-generator', label: 'YouTube Transcript Generator' },
    { slug: 'thumbnail-downloader', label: 'YouTube Thumbnail Downloader' },
    { slug: 'video-summarizer', label: 'YouTube Video Summarizer' },
  ],
  externalLink: { href: 'https://www.youtube.com/premium', label: 'YouTube’s official Premium page' },
};

const guides: Record<string, PageGuideContent> = {
  'Transcript Generator': transcript,
  'YouTube Without Ads': withoutAds,
};

export function getPageGuide(toolName: string): PageGuideContent | undefined {
  return guides[toolName];
}
