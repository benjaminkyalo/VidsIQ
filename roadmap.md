# Breadcrumb address correction
- [x] Correct only breadcrumb identifiers across tools, information pages and articles; verified all 83 public pages, 164 absolute identifiers on 79 breadcrumb-bearing pages, preserved metadata, and eight focused checks. Live VPS deployment remains the owner's next step.

# Apify downloads on the live site
- [x] Let the MP3, MP4 and Shorts flow call Apify directly with a personal token so it works on the self-hosted VPS as well as the Lovable preview, keep the connector gateway path for Lovable hosting, prefer Apify whenever it is configured, cover it with focused tests, and document the one server setting.

# Channel video labels
- [x] Rename the player section to “Popular songs/videos from [channel name]”, keep its source description accurate, and verify the live channel name renders on desktop and mobile.

# VPS build reliability
- [x] Fix `build:node` hanging after prerender lines: added a Node-only entry with the Fetch API export required by prerender, restored Nitro SSR registration, preserved normal PM2 listening, and added a self-hosted successful-build exit guard. Verified all 83 static pages and exit code 0 in 17 seconds; deployment guidance updated.

# Thumbnail Downloader content
- [x] Apply only the supplied YouTube Thumbnail Downloader text, FAQs, and search metadata without changing the existing page design or working preview/download flow; verify responsive layout, links, and tests. Sixteen FAQs render in initial HTML, a real 480 × 360 preview downloaded as a valid 15.9 KB JPG, mobile has no overflow, and 13 focused tests pass.

# Transparent brand logo
# Dedicated conversion service
- [ ] Fix live converter-wide failure: both the supplied video `dHMjH2LbNSA` and the known public test video `jNQXAC9IVRw` reach the dedicated worker and end in the generic conversion error; identify the upstream cause, preserve existing limits/security, and verify real MP3/MP4 delivery.
- [ ] Migrate existing VPS credentials privately from the owner's old environment file into `/etc/vidsiq.env`; do not print, request, or commit their values, and preserve optional AI settings when present.
- [x] Audit every media path for the live failure: Video Downloader, Audio Downloader, MP3 Downloader, YouTube Shorts Downloader, YouTube URL Downloader, Shorts to MP3, YouTube to MP3, YouTube to MP4, and Playlist Downloader all use the shared `getMediaDownload`/`fetchMedia` flow; status polling and `/api/media` read the same two settings, and the converter authenticates jobs/files with the same key. No separate bypass or settled download records exist; all are affected by the website process configuration, not separate screen logic.
- [ ] Restore live website settings and recover from the current 502 — the owner confirmed `/etc/vidsiq.env` does not exist; the two values entered as shell assignments did not create that file or configure PM2, and the literal placeholder converter key was not a real credential. Live homepage and MP3 page now return nginx 502 because Node starts with `--env-file=/etc/vidsiq.env`. Owner must create the private file with the real Google key and the converter key copied privately from `/etc/vidsiq-converter.env`, pass `scripts/verify-vps.mjs`, restart through `ecosystem.config.cjs`, and rerun a real download.
- [x] Improve download speed without changing the workflow: quick initial status checks, lower completion-detection delay, no unnecessary browser chunk copies, and exact-quality progressive MP4 fast path with existing fallbacks and validation preserved. Five converter tests and 64 site tests pass; real browser saves produced valid MP3/MP4 files, a 0.16-second cached repeat, and no desktop/mobile errors. Live VPS timings require deployment by the owner.
- [x] Build isolated conversion workers, bounded queue, file validation, cache, and authenticated delivery.
- [x] Connect MP3, MP4, Shorts and shared download workflows to dedicated jobs without free-service fallback when configured.
- [x] Verify service tests, real YouTube MP3/MP4 worker conversion and file validation; test all three downloader pages plus Save again at desktop/phone widths using a temporary browser-to-worker bridge. Actual files saved, no overflow/errors; new short conversions about four seconds and cached deliveries under one second locally. Document VPS installation and operating limits.
- [ ] Activate and benchmark live conversions — requires installation on the owner's VPS and private service credentials; no VPS access is connected. Production website-to-service connection, container build and real Shorts source coverage remain unverified; local browser acceptance used the same 19-second public video on all three pages, not a real Shorts upload.

- [x] Improve and verify all six AI flows: titles, tags, channel names, descriptions, summaries, and SEO rewrites returned real results; copy and stale-output clearing verified. Removed AI timer cancellation and unsafe retries; enforced title/tag limits. All 59 tests pass and build is clean.
- [x] Correct caption commands, validate iframe messages, include player origin/referrer, reset controls per video, and verify theater/Escape plus mobile fit without publishing.
- [ ] Confirm actual playback, captions, and speed changes — blocked by YouTube’s bot-verification screen in the test browser; no restriction bypass attempted. Other tools are deferred by the owner.
- [x] Replace the header and footer artwork with the user-supplied transparent VidsIQ logo, remove the white badge, and verify desktop/mobile rendering.

# Screenshot recreation
- [x] Recreate header, hero, and complete tool grids.
- [x] Recreate alternating illustrated steps, testimonials, information, and footer.
- [x] Wire tool selection and navigation; verify desktop and mobile.

# Typography and preview
- [x] Apply Poppins and larger sitewide text.
- [x] Verify narrow-screen typography.
- [x] Investigate slow preview loading: local page loads in 0.41 seconds with no runtime errors; no visitor measurements are available and hosted preview returns a platform page rather than app content.

# Full selector functionality
- [x] Match inline channel report and statistics to the supplied screenshots.
- [x] Include Key Insights, recent uploads with live views/dates, and public channel tags.
- [x] Add screenshot-matched Revenue Intelligence explanation with truthful public-data limitations.
- [x] Add global market, audience, and full diagnostic sections; remove country-specific wording across the site.
- [x] Audit all 45 selector tools, improve valid-input workflows, and verify tool-specific outputs or honest unavailable states.
- [x] Add and verify the estimated revenue matrix using elapsed channel age and total views, with explicit assumptions.
- [x] Add validated inputs and dedicated tool result workflows.
- [x] Implement calculators, URL utilities, thumbnail downloads, text tools, and tap tempo.
- [x] Connect public YouTube metadata, search, comments, and channel analytics.
- [x] Verify real inputs, downloads, calculation rules, and mobile results: 11 tests pass; live metadata, channel IDs, search, comments, dislike estimates, thumbnail/profile files, hashtags, and mobile calculators exercised.
- [x] Identify YouTube access limitations without fabricated results: monetization and shadowban are not public statuses; private/age restrictions cannot be bypassed; Top 100 is channel discovery rather than a verified global leaderboard.
- [x] Connect MP4/MP3 delivery through community services; long-media reliability remains dependent on provider availability.

# Theme and sync
- [x] Restyle whole site to Optima blue background, white cards, green accents, navy footer per latest screenshots; verified hero, tool grids, and footer.
- [x] Push current site to GitHub repo benjaminkyalo/youtubedownloadpro: 111 files committed on the site branch, pull request #1 open against `main`.
- [ ] Two-way Git sync — blocked: the user must connect the repository in Project settings → Git; the agent cannot connect it.
# Tool pages (youtubetoolkit.com parity)
- [x] Dedicated page per tool, card and menu links, verified in browser.

## Open tasks
- [x] Image previews: shared pasted-video thumbnails and debounced channel-profile lookup on homepage and all 57 tool forms; metadata imagery now remains beside calculator results. Verified all 57 page previews, real channel images at desktop/mobile widths, clearing input, and real Watch Time Calculator metadata. Sixteen tests pass and latest build is clean; worldwide image delivery remains dependent on YouTube and visitor connections.
- [x] Global delivery and crawler readiness: configured all 63 public pages for prerendering with automatic discovery disabled, preserved live submissions, allowed named AI crawlers, and added factual Organization metadata. English only; no translated folders or nonexistent hreflang destinations. Nine tests pass, all public pages respond, and desktop/mobile Link Viewer works. Published static output and worldwide delivery remain unverified until publication; no visitor vitals were recorded in the last seven days. Firewall, HTTP/3, and hosted compression cannot be verified from local checks. llms.txt and sitemap submission were not explicitly requested and were not performed.
- [x] Wording review: rewrote all 57 tool descriptions and shared search descriptions, removed duplicate homepage paragraphs and unsupported testimonials, and clarified stale claims. All 63 pages return successfully; 18 tests and desktop/mobile Link Viewer checks pass. Contact details and finalized legal documents still require owner-provided material; this copy review does not establish Google indexing readiness.
- [x] Image performance: responsive CDN artwork reduces each displayed illustration to about 9–23 KB; all images use shared loading defaults with dimensions and asynchronous decoding. Verified desktop/mobile artwork, pasted thumbnails, and an original-quality image download; future uploads follow the recorded optimization standard. Global visitor speed remains unmeasured (no published vitals).
- [x] Individual tool search: verified independent titles, self-canonicals, crawlable metadata, and structured tool identities for all 57 pages; direct Link Viewer submission works. Public search indexing requires publishing and remains Google's decision.
- [x] Global performance: reuse public lookups, prevent duplicate requests, warm tool code on interaction, and verify real tool flows; 22 tests pass, real channel/video results and mobile thumbnail downloads verified.
- [ ] Verify thousands-of-users capacity — requires published traffic measurements and a reliable media provider; free community download services offer no capacity guarantee.
- [x] Site speed: lazy-loaded tool workspace and guide sections; first paint ~0.5s, results code loads only after submit
- [x] Added the 12 youtubetoolkit dead-404 pages as catalog tools mapped to existing behaviors; all 17 tests pass, pages verified live.
- [x] Real MP3/MP4 downloads via free cobalt community instance (co.otomir23.me): getMediaDownload server fn + MediaDownload UI; verified end-to-end — 3.4MB MP3 and 29.9MB 720p MP4 downloaded in browser test.
- [x] Add 10 high-demand tools (verified live; 31 tests pass): Transcript Generator, Subtitle Downloader, Video Summarizer (AI), Playlist Downloader, Subscriber Count, Tag/Channel Name/Description/Title Generators (AI), Shorts to MP3.

# Navbar tools menu
- [x] Hover-triggered panel below the navbar listing all 69 tools in columns; verified open/stay-open/close, links on tool pages, selection on home, mobile unchanged.

# Panel sizing and picks
- [x] Enlarge the hover-panel tool entries and curate them to the most searched / most essential tools.

# Panel button
- [x] Make the More tools button small and professional (compact outlined control, not a big red block).

# Blog cards
- [x] Recreate blog page as article card grid with first 5 posts, all posts in one editable list.
- [x] Individual indexable page per blog post (metadata, Article schema, sitemap, prerender).

# Tool value and screenshot results
- [x] Implement approved reliability fixes without publication: unified submission state hides stale results and prevents identical re-submissions; AI waits for video metadata and coalesces requests; media and AI have 60-second deadlines; empty media retries preserve the successful filename; downloader inputs reject handles; keyword display/copy share one list; caption signatures are fetched fresh; monetization is explicitly an estimate; watch FAQs match available controls. Removed unreferenced legacy lookups and separated player/media/result controls. All 52 tests pass; real thumbnail saving, one AI request producing ten titles, real keyword clipboard equality, monetization estimate, player theater mode, and mobile overflow checks pass. Free conversion reliability and YouTube playback restrictions remain external limitations; no publication performed.
- [x] Review code strength and failure handling without implementation or publication: all 42 tests pass; reproduced stale results after clearing input, downloader handle validation mismatch, missing watch controls described in FAQs, and multiple attempted AI calls for one video submission (blocked to avoid spending). Source review confirms incomplete media deadline, display/copy keyword mismatch, cached expiring caption URLs, misleading monetization verdicts, duplicate submission logic, unreferenced legacy YouTube functions, and missing failure-flow regression tests. Corrective changes await approval; publication remains the owner’s responsibility.
- [x] Improve all tool search pages without changing functionality: 68 additional task-specific guides (136 distinct questions and answers), intent-specific titles, relevant follow-up links, and shorter FAQ questions without repeated tool names. All 69 pages have unique titles, self-canonicals, and at least ten initial-HTML FAQs; desktop/mobile thumbnail results verified, tests pass. Search inclusion requires publication and remains Google’s decision.
- [x] Preserve YouTube Without Ads functionality; improve its search identity, crawlable viewing/ad-limit guidance, 15 specific FAQs and related-tool links. Verified initial HTML, self-canonical, real-video player loading, mobile overflow and 20 relevant tests; build OK. Search inclusion requires publication; YouTube verification still limits playback testing.
- [x] Refine first screenshot tool (Private YouTube Viewer): single identity header, green/red/unknown evidence indicators, region/access summaries, current-privacy comparison, and real-link verification. Screenshot video returns public, 1:35:04, BY/RU restrictions; copy and country checks work, missing record stays unknown, desktop/mobile checked, 23 relevant tests pass, build OK. Playback remains subject to YouTube restrictions.
- [x] Expand the three privacy/access tools to show evidence, region restrictions, access guidance, copyable reports, and permitted playback.
- [x] Improve shared video result summaries with views, likes, comments, readable duration, publication details, and export/copy actions; preserve the existing channel report.
- [x] Add at least ten relevant questions and answers to every individual tool page, with tool-specific purpose and limitations. Answers render in initial HTML; these are useful FAQs, not a verified global top-ten search ranking.
- [x] Verify the screenshot’s real video: privacy public, duration 1:35:04, blocked BY/RU; copy/export, missing-video guidance, country selection, and real Video Viewer export pass. All 69 pages return 200 with ten FAQs, phone overflow absent, 39 tests pass, latest build OK. YouTube requires bot-verification sign-in in the test browser, so embedded playback itself is not verified. Other tools retain existing workflows; this first pass does not establish screenshot parity for tools not pictured.

# VPS hosting
- [x] Add permanent PM2 startup loading `/etc/vidsiq.env`, converter health/settings verification without secret output, boot persistence instructions, and current VPS paths; dummy authorized health check and missing-settings failure pass. An actual PM2 start, config restart, save, kill and resurrect cycle retained all dummy settings and the env-file argument.
- [ ] Run the one-time VPS adoption commands after deployment — requires the owner's terminal; current live process settings cannot be changed from this workspace.
- [x] Verify local YouTube Without Ads through a fresh pasted link: real playback, captions off/on, 1.5x playback, theater/Escape, fullscreen, Reload restoring playback, and 320/390px control fit. All 63 tests and build pass.
- [x] Recheck deployed player after the owner publishes this update — owner confirmed YouTube Without Ads works live on vidsiq.com; local playback and live playback both pass.
- [ ] Node build target, direct YouTube/AI providers, env template, DEPLOY.md, verify
- [ ] Push to GitHub so VPS deploy is a simple git pull + build + restart flow

- [ ] VPS: push Node build + DEPLOY.md + AI provider switch to GitHub (in progress)

# Google Search Console + Analytics (Nov 17 2026)
- [ ] Connect Google Search Console, verify vidsiq.com via META tag, submit sitemap.
- [ ] Add Google Analytics (gtag) tracking with user's GA4 Measurement ID.
- [ ] Keyword strategy: capture "youtube mp3/mp4 downloader" demand (user screenshots show vidsiq.com already indexed in Google).

# Apify downloads (Nov 20 2026)
- [x] Connect Apify YouTube downloader to MP3/MP4/Shorts guided flow; real MP3 test passed in preview.
- [ ] Push to GitHub + add APIFY key on VPS — waits on owner saying "deploy".

- [x] Push Apify download update + sitemap origin fix to GitHub lovable-site (8aa24d7)
