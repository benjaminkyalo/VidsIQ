import { Check, Search, Images, Tags, Banknote, Ban, MessageSquare, ThumbsDown, ChartNoAxesColumnIncreasing, Play, UserRound, AlignLeft, Image, LockKeyhole, Link, EyeOff, History, Code, TriangleAlert, ThumbsUp, ChartNoAxesCombined, Clock, Eye, Video, Radio, Users, Lightbulb, Database, AudioLines, KeyRound, Calendar, Trash2, Music, Flame, ChartPie, Hash, Trophy, Download, Shield, Rocket, FileText, Captions, Sparkles, ListVideo, BadgeCheck, Type } from 'lucide-react';
export const essentialTools = [
  { name: 'Monetization Checker', icon: Check, description: 'Review subscriber totals, channel history, and estimated earnings. Monetization status is inferred, not verified.' },
  { name: 'Channel ID Finder', icon: Search, description: 'Resolve a channel link or @handle to its permanent channel ID for embeds, integrations, and research.' },
  { name: 'Image Tool', icon: Images, description: 'Preview video thumbnails or retrieve a channel’s public profile image without taking a screenshot.' },
  { name: 'Tag Extractor', icon: Tags, description: 'Copy published video tags into a comma-separated list. Some videos have no public tags.' },
  { name: 'Money Calculator', icon: Banknote, description: 'Model ad earnings from a view count and your chosen revenue per 1,000 views (RPM).' },
  { name: 'Shadowban Detector', icon: Ban, description: 'Check whether a channel can be found publicly. Visibility alone cannot confirm recommendation suppression.' },
  { name: 'Comments Viewer', icon: MessageSquare, description: 'Read loaded public comments alongside their authors, likes, reply counts, and publication dates.' },
  { name: 'Dislike Checker', icon: ThumbsDown, description: 'Compare reported likes with third-party dislike estimates, rather than official dislike analytics.' },
];
export const additionalTools = [
  { name: 'YouTube Stats – Top 100 Channels', icon: ChartNoAxesColumnIncreasing, description: 'Discover channels by topic and load up to 100 search results. This is not a verified subscriber leaderboard.' },
  { name: 'YouTube Without Ads', icon: Play, description: 'Open a video in an embedded player with playback controls. YouTube may still serve ads.' },
  { name: 'Profile Downloader', icon: UserRound, description: 'Save the channel profile image returned by YouTube for reference or permitted reuse.' },
  { name: 'Description Viewer', icon: AlignLeft, description: 'Read the full published video description, preserve its links and line breaks, and copy or export the text.' },
  { name: 'Thumbnail Viewer', icon: Image, description: 'Compare available thumbnail sizes before choosing a preview or saving an image.' },
  { name: 'Private Video Checker', icon: LockKeyhole, description: 'Inspect available privacy and embedding flags. A missing record does not establish why a video is unavailable.' },
  { name: 'Link Viewer', icon: Link, description: 'Identify the content type, video ID, playlist reference, and start offset contained in a YouTube link.' },
  { name: 'Private YouTube Viewer', icon: EyeOff, description: 'Look up accessible metadata for a video link; private content remains inaccessible without authorization.' },
  { name: 'Channel History Viewer', icon: History, description: 'Browse published uploads with thumbnails and dates to examine a channel’s posting history.' },
  { name: 'YouTube Embed Viewer', icon: Code, description: 'Preview an embedded video and copy iframe markup with your chosen start time.' },
  { name: 'Age Restricted Viewer', icon: TriangleAlert, description: 'Read available age-restriction and embedding flags without bypassing playback restrictions.' },
  { name: 'Like Counter', icon: ThumbsUp, description: 'Read a video’s public like total and refresh it when you need an updated count.' },
  { name: 'SEO Score Checker', icon: ChartNoAxesCombined, description: 'Assess title, description, and tags against a metadata checklist. The score is not a search-ranking prediction.' },
  { name: 'Watch Time Calculator', icon: Clock, description: 'Convert views and average viewing minutes into estimated hours; compare the total with a 4,000-hour target.' },
  { name: 'Views to Money', icon: Eye, description: 'Translate a view total into an illustrative earnings scenario using an adjustable RPM.' },
  { name: 'Video Money Calculator', icon: Video, description: 'Use a video’s public views as a starting point, then set an RPM to estimate advertising income.' },
  { name: 'Advanced Money Calculator', icon: ChartNoAxesCombined, description: 'Combine estimated ad earnings with sponsorship and affiliate amounts you supply.' },
  { name: 'Live Stream Calculator', icon: Radio, description: 'Add estimated ad revenue, donations, and membership income to model a stream’s earnings.' },
  { name: 'Comment Finder', icon: MessageSquare, description: 'Filter the comments loaded from a video by a word or phrase; unloaded comments are not searched.' },
  { name: 'Live Subscriber Count', icon: Users, description: 'Monitor the public subscriber total with manual refresh. YouTube rounds counts, and brief caching may apply.' },
  { name: 'Channel Ideas', icon: Lightbulb, description: 'Explore template-based channel concepts built around your topic and possible content formats.' },
  { name: 'Metadata Viewer', icon: Database, description: 'Inspect accessible titles, descriptions, identifiers, dates, and statistics in one record.' },
  { name: 'BPM Finder', icon: AudioLines, description: 'Measure tempo by tapping along to a beat or enter a known BPM. Automatic audio analysis is not connected.' },
  { name: 'Find YouTube Channel', icon: Search, description: 'Locate channels from a name or topic and follow the matching public channel links.' },
  { name: 'Keyword Finder', icon: KeyRound, description: 'Extract candidate keywords from a video’s title, description, and available tags—not search-volume data.' },
  { name: 'YouTube URL Finder', icon: Link, description: 'Search for videos and copy their watch links without manually rebuilding URLs.' },
  { name: 'Tag Finder', icon: Tags, description: 'Read the tags attached to a video and compare wording for topic research.' },
  { name: 'Upload Date Finder', icon: Calendar, description: 'Retrieve the public publication timestamp in UTC, which may differ from the original upload time.' },
  { name: 'Deleted Video Finder', icon: Trash2, description: 'Open a video’s Wayback Machine history. Archived pages may contain details but no playable media.' },
  { name: 'Royalty-Free Music', icon: Music, description: 'Visit YouTube’s Audio Library and review each track’s license and attribution requirements.' },
  { name: 'Clickbait Title Generator', icon: Flame, description: 'Draft attention-grabbing title variations from your topic. Suggestions are templates, not measured CTR forecasts.' },
  { name: 'Comment Generator', icon: MessageSquare, description: 'Create supportive or question-based comment drafts, then personalize them for the video.' },
  { name: 'Comment Sentiment Analysis', icon: ChartPie, description: 'Count positive and negative keyword matches in loaded comments. Context, sarcasm, and language can affect accuracy.' },
  { name: 'Hashtag Generator', icon: Hash, description: 'Turn topic words into hashtag suggestions for videos and Shorts without promising additional reach.' },
  { name: 'YouTube Rank Checker', icon: Trophy, description: 'Find a video’s position within the returned keyword search results; rankings may differ between viewers.' },
  { name: 'Account Viewer', icon: UserRound, description: 'Review a channel’s public identity, handle, description, and creation date.' },
  { name: 'Channel Viewer', icon: Users, description: 'Compare public subscribers, lifetime views, and upload totals in a channel overview.' },
  { name: 'Playlist Viewer', icon: Play, description: 'Extract a playlist identifier and inspect the information encoded in its link; playlist contents are not listed.' },
  { name: 'Shorts Viewer', icon: Play, description: 'Look up a Short’s published title, description, and available engagement figures.' },
  { name: 'Video Viewer', icon: Video, description: 'Read a video’s available statistics and publication details without opening its watch page.' },
  { name: 'Data Viewer', icon: Database, description: 'Inspect a public video or channel record and export the returned metadata as text.' },
  { name: 'Title Viewer', icon: AlignLeft, description: 'Retrieve the exact published video title and copy it without surrounding page text.' },
  { name: 'URL Viewer', icon: Link, description: 'Inspect an identifier and start time, then copy a normalized watch link when available.' },
  { name: 'MP3 Downloader', icon: Music, description: 'Prepare an MP3 from a permitted video. Conversion depends on third-party availability, especially for longer tracks.' },
  { name: 'YouTube Shorts Downloader', icon: Download, description: 'Save a permitted Short as MP4 with a choice of requested video qualities.' },
  { name: 'YouTube URL Downloader', icon: Download, description: 'Convert a permitted watch link into an MP4 download; availability and quality depend on the source.' },
  { name: 'Transcript Generator', icon: FileText, description: 'Get the full timestamped transcript of a video with captions, then search, copy, or export it as text.' },
  { name: 'Subtitle Downloader', icon: Captions, description: 'Download a video’s captions as SRT, VTT, or plain text in any available language.' },
  { name: 'Video Summarizer', icon: Sparkles, description: 'Get an AI-powered summary of a captioned video: a one-line TL;DR, key points, and the main takeaway.' },
  { name: 'Playlist Downloader', icon: ListVideo, description: 'Download a whole public YouTube playlist as MP3 or MP4 — pick a quality, select videos or save them all in one click.' },
  { name: 'Subscriber Count', icon: Users, description: 'See any channel’s public subscriber count, total views, and video count from a link or @handle.' },
  { name: 'Tag Generator', icon: Tags, description: 'Get AI-suggested video tags from a topic or video link, ready to copy as a comma-separated list.' },
  { name: 'Title Generator', icon: Type, description: 'Get ten AI-written title ideas in different styles for your next video, each under 70 characters.' },
  { name: 'Description Generator', icon: AlignLeft, description: 'Draft a complete video description with a hook, chapter outline, call to subscribe, and hashtags.' },
  { name: 'Channel Name Generator', icon: BadgeCheck, description: 'Brainstorm short, brandable channel names for your niche, then check availability on YouTube.' },
  { name: 'Shorts to MP3', icon: Music, description: 'Save the audio of a permitted YouTube Short as an MP3 file from its link.' },
  { name: 'YouTube to MP3', icon: Music, description: 'Free online YouTube to MP3 converter: paste a link and download the audio as an MP3 in one step, on phone or desktop.' },
  { name: 'YouTube to MP4', icon: Video, description: 'Free online YouTube to MP4 downloader: paste a link and save the video in 1080p, 720p, 480p, or 360p.' },
  { name: 'Thumbnail Downloader', icon: Image, description: 'Save a video’s available thumbnail as an image file, separate from its video download.' },
];
export const allTools = [...essentialTools, ...additionalTools, { name: 'Video Downloader', icon: Download, description: 'Request an MP4 quality for a video you own or may download. Some sources cannot be converted.' }, { name: 'Audio Downloader', icon: Music, description: 'Extract MP3 audio from permitted video content; long recordings may fail at the external conversion service.' }];
export const benefits = [
  { name: 'Improved Channel Performance', icon: ChartNoAxesCombined, description: 'Compare public views, upload history, and subscriber totals before deciding which topics deserve closer review.' },
  { name: 'Enhanced Security & Privacy', icon: Shield, description: 'Research public records without entering a YouTube password or private account credentials.' },
  { name: 'Better Content Strategy', icon: Lightbulb, description: 'Use published titles, descriptions, and tags as research material—not as guarantees of future reach.' },
  { name: 'Time-Saving Automation', icon: Rocket, description: 'Copy channel IDs, export descriptions, and save available thumbnails without collecting each item by hand.' },
];
export type Tool = typeof allTools[number];
// Highest-demand tools people arrive looking for, shown first in the navbar panel.
export const featuredToolNames = ['Monetization Checker','Subscriber Count','YouTube to MP3','YouTube to MP4','Thumbnail Downloader','Transcript Generator','Tag Extractor','Money Calculator','YouTube Shorts Downloader','Playlist Downloader','Audio Downloader','Subtitle Downloader','Video Summarizer','Title Generator','Profile Downloader','Keyword Finder'];
export const featuredTools = featuredToolNames.map(n => allTools.find(t => t.name === n)!);
export const toolSlug = (name: string) => name.toLowerCase().replace(/[–—]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const findToolBySlug = (slug: string) => allTools.find(t => toolSlug(t.name) === slug);

/** Priority tools promoted sitewide (homepage strip, footer) for search visibility. */
export const priorityTools = ['Monetization Checker','YouTube to MP3','YouTube to MP4','YouTube Without Ads'] as const;
