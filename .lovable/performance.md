# Global performance readiness

## Implemented
- Public YouTube upstream JSON is reused at the edge where Cache API is available, with bounded per-instance fallback and coalescing of identical requests.
- Statistics freshness is 30 seconds; upload lists and comments 60 seconds; discovery searches 5 minutes. Failures are not cached. Session data and media tunnel URLs are excluded.
- Browser lookup results are reused across submissions and explicit refresh invalidates browser results. Public upstream cache windows still apply.
- Tool code warms when the visitor interacts with the form, without speculative YouTube API calls; navigation preloads only on intent.
- Image host connections start earlier. Existing lazy image loading and route splitting are preserved.

## Verified
- No published visitor vitals were available for the preceding seven days. Global p75 and real capacity cannot yet be assessed.
- Local real channel lookup completed in 0.99 seconds; repeat submission made zero additional server requests.
- Real video tags rendered; mobile thumbnail download saved 21,011 bytes, with no horizontal overflow or browser errors.
- 22 tests passed. A unit test confirms 1,000 identical concurrent cache calls share one upstream invocation; this is NOT a production load test.

## Launch decisions and remaining limits
1. Publish and gather at least 30 readings per page/metric before ranking page speed. Target p75 LCP <= 2.5 seconds, FCP <= 1.8 seconds, INP <= 200 milliseconds, CLS <= 0.1.
2. Validate sustained load and bursts on owned infrastructure without load-testing third-party community services. Track errors, cache hit rates, latency and quota usage.
3. Obtain a dependable media-processing provider with explicit throughput and long-audio support before claiming thousands-of-users download reliability. Community providers have no service guarantee; cache cannot make conversion or transfer instant.
4. Check YouTube API quota against actual search volume: unique discovery requests remain costly even with caching. For abusive public traffic, add a shared gateway rate limit and provider circuit breakers, not an in-memory global-limit claim.
5. For very large downloads, move delivery to a provider-backed streaming download flow with verification; current complete-file buffering protects against empty saves but consumes browser memory.
6. Edge caching is best effort and local to available cache locations, not a globally coordinated queue. The current 64-pending-request bound is per instance, not a sitewide visitor limit.

No instant-every-tool or production capacity guarantee has been established.