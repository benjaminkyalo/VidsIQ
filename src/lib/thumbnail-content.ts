export const thumbnailPageContent = {
  title: 'YouTube Thumbnail Downloader – Free HD & Full Size | VidsIQ',
  description: 'Download any YouTube thumbnail in HD, 1280x720 or max resolution. Paste the video link, click download, and save the image free. No signup, no watermark.',
  h1: 'YouTube Thumbnail Downloader: Download HD Thumbnails in One Click',
  heroDescription: 'Paste a YouTube video link to preview and save its available thumbnail sizes, from small images up to 1280 × 720 HD when available. Free, with no signup or added watermark.',
  introduction: 'Paste a YouTube video link into the box above and submit it. Choose from five common thumbnail sizes, preview your selection, and save the image. It is free, needs no signup, and adds no watermark.',
  closing: 'Whether you are researching what works in your niche, building a presentation, or saving a thumbnail you designed yourself, VidsIQ helps you retrieve the available full-quality image in a few simple steps.',
};

export const thumbnailSteps = [
  { title: 'Copy the video link', text: 'Open the video on YouTube and copy the URL from the address bar, or tap Share, then Copy link, in the app.' },
  { title: 'Paste it into the box', text: 'Drop the link into the field at the top of this page. A recognized video link submits automatically; you can also use Submit.' },
  { title: 'Choose a thumbnail size', text: 'Use the resolution menu to compare the available image sizes. Start with 1280 × 720 when you need the largest common HD option.' },
  { title: 'Preview and save', text: 'Check the selected image, then choose Download thumbnail. If a size is unavailable, select a smaller option and try again.' },
];

export const thumbnailLinkFormats = [
  ['Standard video', 'youtube.com/watch?v=VIDEO_ID'],
  ['Short link', 'youtu.be/VIDEO_ID'],
  ['YouTube Shorts', 'youtube.com/shorts/VIDEO_ID'],
  ['Mobile video', 'm.youtube.com/watch?v=VIDEO_ID'],
  ['Live video', 'youtube.com/live/VIDEO_ID'],
  ['Embedded video', 'youtube.com/embed/VIDEO_ID'],
];

export const thumbnailSizes = [
  ['Maximum resolution (HD)', '1280 × 720', 'Design work, blog posts, presentations'],
  ['Standard definition', '640 × 480', 'Website previews'],
  ['High quality', '480 × 360', 'Social posts and small embeds'],
  ['Medium quality', '320 × 180', 'Lists and galleries'],
  ['Default', '120 × 90', 'Tiny previews'],
];

export const thumbnailFeatures = [
  ['Free to use', 'No account, download credits, or payment is required.'],
  ['No software needed', 'Paste a link and save the image directly through your browser.'],
  ['Original source image', 'VidsIQ retrieves the available YouTube image without adding a watermark or extra compression.'],
  ['Five common sizes', 'Use the resolution menu to compare and select the size that fits your project.'],
  ['Made for any device', 'The page works on desktop, tablet, Android, and iPhone browsers with download support.'],
  ['No YouTube password', 'Only the video link and selected public thumbnail are needed; your YouTube login is not requested.'],
];

export const thumbnailAudiences = [
  ['YouTubers', 'Study what makes thumbnails clear and compelling in your niche.'],
  ['Graphic designers', 'Collect references for mockups, mood boards, and client presentations.'],
  ['Bloggers and journalists', 'Retrieve a video preview image for an article, with appropriate permission and credit.'],
  ['Social media managers', 'Prepare video recap posts and community content using artwork you may reuse.'],
  ['Teachers and students', 'Save permitted reference images for slides and lesson materials.'],
  ['Video editors', 'Retrieve your own old thumbnails for re-edits and design comparisons.'],
];

export const thumbnailTips = [
  ['Start with 1280 × 720 pixels', 'Use a 16:9 image and follow YouTube’s current file-size and format requirements when uploading your own thumbnail.'],
  ['Keep text short and readable', 'Use only a few words with enough size and contrast to remain clear on a phone screen.'],
  ['Create a clear focal point', 'A distinct subject, expression, or object can help viewers understand the topic quickly.'],
  ['Protect the bottom-right corner', 'Keep important details away from the area where YouTube places the duration badge.'],
  ['Complement the title', 'Make the thumbnail and title work together instead of repeating exactly the same words.'],
  ['Test with your own analytics', 'Compare thumbnail changes in YouTube Studio; no design formula guarantees clicks or rankings.'],
];

export const thumbnailFaqs: [string, string][] = [
  ['How do I download a YouTube thumbnail?', 'Copy the video URL and paste it into the box above. After the thumbnail loads, choose a resolution, preview the image, and select Download thumbnail.'],
  ['Is this YouTube thumbnail downloader free?', 'Yes. VidsIQ does not require an account, payment, or download credits for this tool. Source availability and your browser’s download support still apply.'],
  ['What is the best resolution for a YouTube thumbnail?', '1280 × 720 pixels with a 16:9 ratio is the commonly recommended upload size. Choose the maximum-resolution option here when it is available for the video.'],
  ['Why is the HD or max resolution option missing?', 'Some videos, especially older ones or videos with automatically generated artwork, do not expose a 1280 × 720 image. Select a smaller size from the resolution menu.'],
  ['Can I download thumbnails from YouTube Shorts?', 'Yes. Paste a supported Shorts link and the tool resolves its video ID, then loads the available thumbnail sizes like it does for a regular video.'],
  ['Can I download a thumbnail on my phone?', 'Yes. Paste the link, choose a size, and tap Download thumbnail. Your browser normally saves it to Downloads or Files; available browser behavior can vary by device.'],
  ['Is it legal to download YouTube thumbnails?', 'A thumbnail can belong to the video creator or another rights holder. Personal reference is different from republication. For commercial or public reuse, obtain permission or confirm that your use is permitted under the law that applies to you.'],
  ['Can I use a downloaded thumbnail in my own video or blog?', 'Only when you own the artwork, have permission, or have another valid legal basis for that use. Do not present somebody else’s thumbnail as your own; credit alone does not replace permission.'],
  ['What image format are thumbnails saved in?', 'VidsIQ requests the available JPG thumbnail from YouTube and saves it with a .jpg filename.'],
  ['Does the tool download the video too?', 'No. It only retrieves the selected still thumbnail image. It does not download, rip, or convert the video.'],
  ['Do I need to install anything?', 'No. The tool runs in your browser, so there is no extension, app, or desktop software to install.'],
  ['Does the thumbnail have a watermark?', 'VidsIQ does not add a watermark. The downloaded file is the available source image returned by YouTube.'],
  ['Can I download a thumbnail from a private or deleted video?', 'A private, deleted, or otherwise unavailable video may not expose an accessible thumbnail. This tool cannot bypass privacy or recover deleted artwork.'],
  ['Can I get the thumbnail without using a tool?', 'Yes. Replace VIDEO_ID in https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg with the video ID. That resolution is not available for every video; VidsIQ also gives you smaller size choices and a download button.'],
  ['How do I change my own video’s thumbnail?', 'Open YouTube Studio, go to Content, select your video, then open Details and the Thumbnail options. Custom thumbnail availability and verification requirements are controlled by YouTube.'],
  ['Can I download thumbnails in bulk?', 'No. This page handles one video at a time. Paste each link in turn to retrieve and save its thumbnail.'],
];

const faqSchemaQuestions = new Set([
  'How do I download a YouTube thumbnail?',
  'Is this YouTube thumbnail downloader free?',
  'What is the best resolution for a YouTube thumbnail?',
  'Can I download thumbnails from YouTube Shorts?',
  'Is it legal to download YouTube thumbnails?',
]);

export const thumbnailFaqSchema = thumbnailFaqs.filter(([question]) => faqSchemaQuestions.has(question));
