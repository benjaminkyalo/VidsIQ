export type DownloaderContent = { kind: 'mp3' | 'mp4' | 'shorts' | 'watch' | 'playlist'; stepsTitle?: string; heading: string; intro: string; steps: { h: string; p: string }[]; features: { h: string; p: string }[]; sections: { h: string; p: string }[]; keywords?: string[] };

const mp3: DownloaderContent = {
  kind: 'mp3',
  heading: 'Free YouTube to MP3 Converter – Download MP3 Online in 320kbps',
  intro: 'VidsIQ is a fast, free YouTube to MP3 converter that works in any browser. Paste a YouTube link, choose 128, 192 or 320 kbps, and download the audio as an MP3 file — no app, no sign-up and no pop-up ads. Use it for podcasts, lectures, interviews, music you have rights to and any audio you want to hear offline.',
  steps: [
    { h: 'Copy the YouTube link', p: 'Open the video on YouTube or the YouTube app, tap Share and copy the URL. Normal videos, music videos and Shorts links all work.' },
    { h: 'Paste it above', p: 'Paste the link into the box at the top of this page. The video thumbnail appears instantly so you know you picked the right one.' },
    { h: 'Choose MP3 quality', p: 'Pick 128 kbps for small files, 192 kbps as the best everyday choice, or 320 kbps for the highest sound quality.' },
    { h: 'Convert & download', p: 'Press Convert & download. The MP3 file saves straight to your phone, tablet or computer.' },
  ],
  features: [
    { h: 'Up to 320 kbps audio', p: 'Choose the bitrate that suits you, from compact 128 kbps files to high quality 320 kbps MP3.' },
    { h: 'Free, no account needed', p: 'Convert permitted videos without paying or registering. File, duration and service-capacity limits apply.' },
    { h: 'No pop-ups or redirects', p: 'A clean converter without fake download buttons, redirect pages or surprise tabs.' },
    { h: 'Works on every device', p: 'Use it on Android, iPhone, iPad, Windows, Mac, Linux and Chromebook — in Chrome, Safari, Firefox, Edge or Opera.' },
    { h: 'Nothing to install', p: 'An online YouTube MP3 downloader that runs in your browser, so there is no software or extension to install.' },
    { h: 'Temporary file handling', p: 'Dedicated conversions temporarily store files and video IDs for delivery and reuse, then remove expired files. No visitor download history is recorded by the conversion service.' },
  ],
  sections: [
    { h: 'A direct way to convert YouTube to MP3', p: 'Paste the link, pick a quality and start the download. Conversion time depends on video length, source availability and server demand; the download shows its current stage rather than promising an instant file.' },
    { h: 'YouTube MP3 downloader for iPhone and Android', p: 'On iPhone, open this page in Safari, convert the video and find the MP3 in the Files app under Downloads. On Android, the MP3 saves to your Downloads folder and plays in any music player.' },
    { h: 'Which MP3 quality should I choose?', p: '128 kbps is fine for speech, podcasts and saving storage. 192 kbps is a good balance for music. 320 kbps gives the best sound but makes a bigger file. The output can never sound better than the original upload.' },
    { h: 'Use it responsibly', p: 'Only convert videos you own, have permission to save, or that are licensed for free reuse such as Creative Commons. Respect creators and YouTube’s terms.' },
  ],
  keywords: ['YouTube to MP3', 'YouTube MP3 converter', 'YouTube MP3 downloader', 'YT to MP3', 'YouTube to MP3 320kbps', 'free MP3 downloader', 'online MP3 converter', 'convert YouTube to audio', 'YouTube audio downloader', 'MP3 download free'],
};

const mp4: DownloaderContent = {
  kind: 'mp4',
  heading: 'Free YouTube Video Downloader – Download YouTube to MP4 in HD 1080p',
  intro: 'Download YouTube videos as MP4 in 1080p, 720p, 480p or 360p with VidsIQ — a free online YouTube video downloader. Paste the link, pick your quality and save the video to watch offline on any phone, tablet, laptop or TV. No software, no registration, no pop-ups.',
  steps: [
    { h: 'Copy the video URL', p: 'Copy the link from the YouTube website or tap Share → Copy link in the YouTube app.' },
    { h: 'Paste it above', p: 'Paste the link in the box at the top. The video preview loads right away.' },
    { h: 'Pick a resolution', p: 'Choose 1080p Full HD, 720p HD, 480p or 360p for a smaller file that saves data.' },
    { h: 'Download the MP4', p: 'Tap Convert & download and the MP4 saves to your device, ready to play offline.' },
  ],
  features: [
    { h: 'HD up to 1080p', p: 'Save videos in Full HD, HD or a lighter quality when storage or data is limited.' },
    { h: 'Plays everywhere', p: 'MP4 works on every phone, computer, smart TV and video editor without extra apps.' },
    { h: 'Free and no sign-up', p: 'An online YouTube video downloader with no account, no trial and no hidden cost.' },
    { h: 'Clean and safe', p: 'No fake buttons, no redirects to other sites and nothing to install on your device.' },
    { h: 'Clear conversion status', p: 'Follow preparation and download progress. Video length, source availability and server demand affect waiting time.' },
    { h: 'All devices and browsers', p: 'Works on Android, iPhone, iPad, Windows, Mac and Linux in any modern browser.' },
  ],
  sections: [
    { h: 'Download YouTube videos online without software', p: 'You do not need a desktop program or browser extension to save YouTube videos. VidsIQ runs entirely in the browser: paste the link, choose MP4 and the file downloads directly.' },
    { h: 'How to download YouTube videos on iPhone', p: 'Open this page in Safari, paste the link and convert. The MP4 goes to Files → Downloads; from there you can save it to Photos with the Share button.' },
    { h: 'How to download YouTube videos on Android and PC', p: 'Paste the link, choose a quality and download. On Android the video lands in your Downloads folder; on Windows or Mac it saves to your default download location.' },
    { h: '1080p, 720p, 480p or 360p?', p: '1080p looks best on large screens, 720p is sharp on phones and laptops, while 480p and 360p save data and storage. If a video was uploaded in lower quality, the highest available version is used.' },
    { h: 'Use it responsibly', p: 'Only download videos you own, have permission to save, or that are licensed for reuse. Respect creators and YouTube’s terms.' },
  ],
  keywords: ['YouTube to MP4', 'YouTube video downloader', 'download YouTube videos', 'YouTube downloader HD', 'YouTube 1080p downloader', 'free video downloader', 'online video downloader', 'YT to MP4', 'save YouTube video', 'YouTube MP4 converter'],
};

const shorts: DownloaderContent = {
  kind: 'shorts',
  heading: 'YouTube Shorts Downloader – Download Shorts as MP4 or MP3 Free',
  intro: 'Save permitted YouTube Shorts with the free VidsIQ Shorts downloader. Paste a Shorts link and download the vertical video as MP4 in HD, or grab just the sound as MP3. Works on phones and computers with no app, no added watermark and no sign-up.',
  steps: [
    { h: 'Copy the Shorts link', p: 'In the YouTube app tap Share → Copy link on the Short. Links like youtube.com/shorts/… work directly.' },
    { h: 'Paste it above', p: 'Paste the link at the top of this page and the Short’s preview appears instantly.' },
    { h: 'Choose MP4 or MP3', p: 'Pick MP4 to keep the video or MP3 to save only the audio or trending sound.' },
    { h: 'Download', p: 'Tap Convert & download and the Short saves to your phone or computer.' },
  ],
  features: [
    { h: 'HD vertical video', p: 'Keeps the original 9:16 format so Shorts look right on your phone.' },
    { h: 'MP4 or MP3', p: 'Save the full Short or just its sound in one place.' },
    { h: 'No watermark added', p: 'VidsIQ does not stamp its own logo on your downloads.' },
    { h: 'Smaller mobile downloads', p: 'Choose a lower resolution for smaller files. Download time depends on video size, your connection and server demand.' },
    { h: 'Free, no account', p: 'Save permitted Shorts without registration. File, duration and service-capacity limits apply.' },
    { h: 'Every device', p: 'Works on Android, iPhone, tablets and computers in any browser.' },
  ],
  sections: [
    { h: 'The easiest YouTube Shorts video downloader', p: 'Shorts are YouTube’s vertical videos up to a few minutes long. VidsIQ recognises Shorts links automatically, so you can save them the same way as any other video — paste, pick, download.' },
    { h: 'Download Shorts on iPhone and Android', p: 'Open VidsIQ in your phone’s browser, paste the Shorts link and download. On iPhone the file appears in Files → Downloads; on Android it goes to your Downloads folder and gallery apps.' },
    { h: 'Save Shorts sounds as MP3', p: 'Want the audio from a Short? Switch to MP3 and download just the sound — handy for listening offline when you have the rights to it.' },
    { h: 'Use it responsibly', p: 'Download only Shorts you created, have permission to save, or that are licensed for reuse, and credit creators.' },
  ],
  keywords: ['YouTube Shorts downloader', 'download YouTube Shorts', 'Shorts to MP4', 'Shorts to MP3', 'save YouTube Shorts', 'YT Shorts downloader', 'Shorts video downloader', 'download Shorts free', 'Shorts downloader online', 'YouTube Shorts saver'],
};

const watch: DownloaderContent = {
  kind: 'watch',
  stepsTitle: 'How to watch a YouTube video here in 4 steps',
  heading: 'Watch YouTube Without Ads Interrupting You – Free Clean Video Player Online',
  intro: 'VidsIQ gives you a clean, distraction-free way to watch any public YouTube video in your browser. Paste a link and the video starts in a focused player with no comments, no autoplay rabbit holes and no clutter around it — plus captions, speed, theater mode and fullscreen. It works on phones, tablets, laptops and smart-TV browsers, with nothing to install and no sign-in.',
  steps: [
    { h: 'Copy the video link', p: 'In YouTube or the YouTube app tap Share → Copy link. Watch links, youtu.be links, Shorts and live videos all work.' },
    { h: 'Paste it above', p: 'Paste the link into the box at the top. The thumbnail appears straight away so you know it is the right video.' },
    { h: 'The video plays here', p: 'Playback starts automatically in the clean player, with the title, channel and details shown below it.' },
    { h: 'Control how you watch', p: 'Turn on captions, change speed, switch to theater mode or go fullscreen. Pick the next video from the same channel below the player.' },
  ],
  features: [
    { h: 'Distraction-free player', p: 'Just the video — no comments, no endless recommendation feed and no sidebar pulling your attention away.' },
    { h: 'Free and no sign-up', p: 'No account, no password and no subscription needed to watch public videos here.' },
    { h: 'Captions, speed & fullscreen', p: 'Turn on available subtitles, slow down lectures, speed up tutorials and watch fullscreen or in theater mode.' },
    { h: 'Works on any device', p: 'Android, iPhone, iPad, Windows, Mac, Chromebook and smart-TV browsers — in Chrome, Safari, Firefox, Edge or Opera.' },
    { h: 'No extension or app', p: 'Nothing to install, so it also works on school, office and shared computers where extensions are blocked.' },
    { h: 'Keep watching here', p: 'The Popular songs/videos section shows recent uploads from the same channel, and each one opens in this player too, so you stay in a calm viewing space.' },
  ],
  sections: [
    { h: 'Can you really watch YouTube without ads?', p: 'Honest answer: the only official way to remove YouTube ads everywhere is YouTube Premium. VidsIQ plays videos through YouTube’s own embedded player, so YouTube may still show an ad on some videos, and in-video sponsor segments are part of the video itself. What VidsIQ removes is everything else — comments, the busy homepage, autoplay feeds and on-page clutter — which is why many people find it a calmer way to watch.' },
    { h: 'Why do some videos show fewer ads in an embedded player?', p: 'Ads are decided by YouTube, the creator’s monetization settings and the viewer’s region. Many videos that are not monetized play with no ads at all. We never block, skip or alter YouTube advertising, so creators are treated fairly.' },
    { h: 'Best for kids, students and focused work', p: 'Share a single video with a child or a class without exposing them to comments and a feed of other videos. Students can slow down lectures and read captions; workers can play a tutorial in theater mode next to their notes.' },
    { h: 'Video won’t play? Here is why', p: 'The owner may have turned off embedding, or the video can be private, age-restricted, removed or blocked in your country. These limits come from YouTube and cannot be bypassed. Use our privacy and access checker to see the public reason, or open the video on YouTube instead.' },
    { h: 'Watch on iPhone, Android and TV', p: 'On phones, open VidsIQ in Safari or Chrome and paste the link — tap fullscreen and rotate for a cinema view. On a smart TV or console browser, open the same page and paste the link to play on the big screen.' },
    { h: 'Want the video offline instead?', p: 'For videos you own or have permission to save, use the VidsIQ YouTube to MP4 downloader for video or YouTube to MP3 for audio-only listening without a connection.' },
  ],
};

const playlist: DownloaderContent = {
  kind: 'playlist',
  stepsTitle: 'How to download a YouTube playlist in 4 steps',
  heading: 'Free YouTube Playlist Downloader – Save Whole Playlists as MP3 or MP4',
  intro: 'VidsIQ lists every video in a public YouTube playlist and lets you save the ones you need as MP3 audio or MP4 video in one go. Pick one quality for the whole list, tick the videos you want — or download them all — and VidsIQ saves them one after another with a live counter. Free, no sign-up, nothing to install.',
  steps: [
    { h: 'Copy the playlist link', p: 'Open the playlist on YouTube and copy its URL. It contains list= — a video link opened from a playlist works too.' },
    { h: 'Paste it above', p: 'Paste the link into the box at the top. Every video in the playlist appears with its thumbnail and position number.' },
    { h: 'Choose MP3 or MP4 and quality', p: 'Pick MP3 at 128, 192 or 320 kbps, or MP4 from 360p to 1080p. The choice applies to every video in the list.' },
    { h: 'Download all or selected', p: 'Press Download all, or tick only the videos you want. Files save one by one, and any that fail can be retried in one click.' },
  ],
  features: [
    { h: 'Whole playlist in one click', p: 'Queue the full list and let VidsIQ save each file in order while you do something else.' },
    { h: 'Pick only what you need', p: 'Tick individual videos or use Select all — no need to download a 200-video list to get five songs.' },
    { h: 'MP3 up to 320 kbps, MP4 up to 1080p', p: 'One quality setting for the whole batch, so every file matches.' },
    { h: 'Live progress & retry', p: 'See how many are saved, stop after the current file and retry only the ones that failed.' },
    { h: 'Export the full list', p: 'Save every title and link as a text file for notes, study lists or backups.' },
    { h: 'Free on every device', p: 'Works in Chrome, Safari, Firefox and Edge on Android, iPhone, Windows, Mac and Chromebook.' },
  ],
  sections: [
    { h: 'Download a YouTube playlist to MP3', p: 'Perfect for lecture series, podcast seasons, audiobooks and music you have the rights to. Choose MP3, pick 192 kbps for everyday listening or 320 kbps for the best sound, and press Download all.' },
    { h: 'Download a YouTube playlist to MP4', p: 'Save a course, tutorial series or your own channel’s uploads as MP4 videos for offline viewing on a flight or with weak internet. 720p is the best balance of quality and size.' },
    { h: 'Why files save one at a time', p: 'Downloading in sequence is more reliable than firing dozens of conversions at once — fewer failures, no browser freezes and each file finishes properly. Your browser may ask once to allow multiple downloads; tap Allow.' },
    { h: 'Large playlists', p: 'The first batch of videos loads straight away; press Load more videos to add the rest. Very long videos can take longer or fail to convert — use Retry failed to try those again.' },
    { h: 'Private and unlisted playlists', p: 'Only public playlists can be listed. Private playlists, and private or removed videos inside a playlist, are not shown — that is set by YouTube and cannot be bypassed.' },
    { h: 'Use it responsibly', p: 'Download only playlists you own, have permission to save, or that are licensed for reuse such as Creative Commons. Respect creators and YouTube’s terms.' },
  ],
  keywords: ['YouTube playlist downloader', 'download YouTube playlist', 'YouTube playlist to MP3', 'YouTube playlist to MP4', 'playlist downloader online', 'download entire YouTube playlist', 'bulk YouTube downloader', 'YT playlist downloader', 'free playlist downloader', 'save YouTube playlist offline'],
};

const byTool: Record<string, DownloaderContent> = {
  'YouTube to MP3': mp3, 'MP3 Downloader': mp3, 'Audio Downloader': mp3,
  'YouTube to MP4': mp4, 'Video Downloader': mp4,
  'YouTube Shorts Downloader': shorts,
  'YouTube Without Ads': watch,
  'Playlist Downloader': playlist,
};
export function downloaderContent(toolName: string): DownloaderContent | undefined { return byTool[toolName]; }
