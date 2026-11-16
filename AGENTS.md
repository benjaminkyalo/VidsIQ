<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application structure
- Keep the creator tool catalog in a browser-safe shared module and use the shared site shell for content routes, so tool names and navigation remain consistent.
- Tool selection must not fabricate analytics or download progress; unconnected tools show an explicit unavailable state, while browser-safe thumbnail and link utilities can resolve public video IDs.
- Keep input parsing and calculator formulas in the shared, tested tool engine; render tool workflows in a reusable inline workspace below the action form, so reports follow the screenshot layout.
- Retrieve public YouTube records through server functions, calling the YouTube API directly when GOOGLE_API_KEY (or YOUTUBE_API_KEY) is set and falling back to the connector gateway, so the same code runs on any host; deliver image downloads through validated, host-allowlisted same-origin server routes.

- Derive report averages and earnings scenarios in the tested shared engine using elapsed channel age; never infer actual monetization or current revenue from lifetime totals.
- Every catalog tool has its own page at /tools/<slug> (slug derived by toolSlug in the shared catalog) reusing the shared ToolAction form, so each tool is indexable and linkable.
- Derive each tool's search identity, self-canonical, and WebApplication metadata in the browser-safe shared SEO module, so crawlers identify tools individually without hardcoded deployment hosts.
- Cache only successful public upstream YouTube JSON with bounded request coalescing and short freshness windows; never cache sessions or expiring media links, to reduce quota use without leaking private data.
- Warm the shared workspace chunk on form interaction and reuse query results across tool submissions; explicit refresh invalidates browser results while upstream counts retain a short freshness window.
- Share submission state through useToolSubmission; isolate player, media, and copy/export controls, coalesce AI drafts with Query, and bound media waits; consume AI streams without timer cancellation to avoid discarding billed work.
- Validate AI suggestion lists in the shared creator-output module and retry only explicit rate-limit/server failures, so displayed limits and copied content agree without replaying terminal failures.
- Accept player events only from the current YouTube iframe and use supported caption-module commands; reset controls per video to avoid stale playback settings.

- Render all site images through SiteImage with explicit intrinsic dimensions; default to lazy loading and asynchronous decoding, and prioritize only immediately needed imagery to avoid offscreen competition.
- Site artwork lives as plain files in public/ with responsive srcSet/sizes, not CDN asset pointers: the /__l5e/ pointer URLs only resolve on Lovable hosting and 404 on the self-hosted VPS.
- Self-host interface fonts through Fontsource with swap rendering and preload first-screen weights; avoid transformed text cards and blurred control surfaces to keep rendering stable without external font requests.
- Prerender only explicitly enumerated visitor-independent public pages, deriving tool paths from the catalog and disabling automatic discovery; keep submissions and media endpoints dynamic so cached HTML never captures user data.
- Share paste-time image previews between homepage and tool forms: derive video thumbnails locally and debounce explicit channel lookups with query reuse, avoiding speculative topic searches.
- Fetch captions server-side from YouTube's public player tracks and parse/format them in the tested shared transcript module; AI writing and summaries run only in server functions through the shared AI server helper, so keys and prompts never reach the browser.
- Keep per-tool editorial guides in a browser-safe catalog keyed by tool name; render questions and answers as native details in initial HTML so public answers remain crawlable without FAQ rich-result claims.
- Derive privacy/access reports in the tested browser-safe access-report module; preserve missing flags and region allowlists distinctly so unknown evidence never becomes a private verdict or guaranteed playback.
- Render country lists through shared CountryLabel/CountryList with locally bundled flag artwork and English names; keep ISO codes as internal values so availability checks remain unchanged.
- Recent-upload titles link to the checker using its validated optional URL search input; ToolAction initializes from that input and uses the usual auto-submit flow, while YouTube viewing remains a separate link.
- Preserve published channel keywords in the shared record mapper and parse them with public-tags; channel reports may show explicitly labeled recent-video tags when channel keywords are absent, never invented channel tags.
- Player recommendations reuse cached public channel-report uploads without blocking playback and link to the same player tool; they are recent channel uploads, not YouTube's personalized suggestions.
- Keep watch-page search guidance in initial HTML via the shared ToolGuide and its dedicated guide module, with tool-specific search identity overrides; preserve playback behavior when improving discoverability.
- Keep task-specific search guidance and related-tool choices in the browser-safe search-content catalog; render it in initial HTML and derive title intent from it to avoid generic cross-page filler without changing tool workflows.
