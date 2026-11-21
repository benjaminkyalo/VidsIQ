import { SiteImage } from '@/components/toolkit/site-image';
import { CircleCheck, Info, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { toolSlug } from '@/lib/tools';
import { parseChannelTags } from '@/lib/public-tags';
import type { PublicRecord } from '@/lib/tool-data.functions';
import { channelEstimates } from '@/lib/tool-engine';

function ReportMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
 return <article className="report-metric"><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}

export function ChannelReport({ record, input, monetization }: { record: PublicRecord; input: string; monetization: boolean }) {
 const compact = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
 const full = (value: number) => value.toLocaleString('en-US');
 const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
 const joined = new Date(record.publishedAt);
 const validDate = !Number.isNaN(joined.getTime());
 const views = record.views === undefined ? null : Number(record.views);
 const videos = record.videos === undefined ? null : Number(record.videos);
 const subscribers = record.hiddenSubscribers || record.subscribers === undefined ? null : Number(record.subscribers);
  const estimates = views === null ? null : channelEstimates(views, record.publishedAt);
  const guess: 'likely' | 'unlikely' | null = subscribers === null ? null
    : subscribers >= 1000 && views !== null && views >= 100000 && estimates !== null && estimates.days >= 90 ? 'likely' : 'unlikely';
 const average = views !== null && videos !== null && videos > 0 ? Math.round(views / videos) : null;
 const month = validDate ? joined.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Not provided';
 return <div className="channel-report">
  <div className="report-channel">
   {record.thumbnail && <SiteImage src={record.thumbnail} alt={`${record.title} profile`} width={88} height={88} />}
   <div className="min-w-0"><h2>{record.title}</h2>{(record.handle || (input.startsWith('@') ? input : '')) && <p className="report-handle">{record.handle || input}</p>}<p className="report-description">{record.description}</p><div className="report-identifiers"><span>Channel ID: <code>{record.channelId || record.id}</code></span><span>Joined: {month}</span></div></div>
  </div>
  <div className="report-metrics">
   <ReportMetric label="Subscribers" value={subscribers === null ? 'Unavailable' : compact(subscribers)} detail={subscribers === null ? 'Not publicly provided' : full(subscribers)} />
   <ReportMetric label="Total Views" value={views === null ? 'Unavailable' : compact(views)} detail={views === null ? 'Not publicly provided' : full(views)} />
   <ReportMetric label="Total Videos" value={videos === null ? 'Unavailable' : compact(videos)} detail={videos === null ? 'Not publicly provided' : full(videos)} />
   <ReportMetric label="Joined Date" value={validDate ? String(joined.getUTCFullYear()) : 'Unavailable'} detail={month} />
   <ReportMetric label="Channel Age" value={estimates ? `${estimates.years} ${estimates.years === 1 ? 'year' : 'years'}` : 'Unavailable'} detail={month} />
   <ReportMetric label="Avg Views / Video" value={average === null ? 'Unavailable' : compact(average)} detail={average === null ? 'Not publicly provided' : full(average)} />
  </div>
  {monetization && <div className="report-status"><h3>Monetization Estimate</h3><div className="report-status-content"><span className="report-status-icon"><CircleCheck /></span><div><strong>{guess === 'likely' ? 'Likely monetized — estimate' : guess === 'unlikely' ? 'Unlikely monetized — estimate' : 'Status unavailable'}</strong><p>{guess === 'likely' ? 'Public subscribers, lifetime views, and channel age suggest possible monetization. Approval and eligible watch time are not verified.' : guess === 'unlikely' ? 'Public metrics do not meet this tool’s estimation criteria. This does not establish the channel’s actual monetization status.' : 'Subscriber data is hidden or unavailable, so an estimate cannot be made.'}</p></div></div></div>}
  {monetization && <section className="report-revenue"><h3>Estimated Revenue Matrix</h3>{estimates ? <><div className="report-table-scroll"><table><thead><tr><th>Metric</th><th>Daily</th><th>Monthly</th><th>Yearly</th></tr></thead><tbody>{estimates.earnings.map((row, index) => <tr key={index}><td>Estimated Earnings ({['Low', 'Mid', 'High'][index]})</td>{row.map((value, column) => <td key={column}>{money(value)}</td>)}</tr>)}<tr><td>Estimated Daily / Monthly / Yearly Views</td>{estimates.views.map((value, index) => <td key={index}>{compact(value)}</td>)}</tr></tbody></table></div><p className="report-assumptions"><strong>Assumptions:</strong> Lifetime views ÷ actual elapsed days since the channel joined; monthly = 30 days, yearly = 365 days. Illustrative earnings rates: $2 / $6 / $10 per 1,000 total views. These are scenarios, not measured CPM or RPM. Watch hours, current traffic, ad eligibility, and actual earnings are unavailable; historical averages are not a forecast.</p></> : <p className="text-muted-foreground">Public view counts and a valid channel creation date are required to estimate revenue.</p>}</section>}
  {monetization && <><section className="report-detail"><h3>Key Insights</h3><ul className="report-insights">
   <li><Info />Channel age: {estimates ? `${estimates.years} years` : 'Unavailable'}.</li>
   <li><Info />Average views per video: {average === null ? 'Unavailable' : full(average)}.</li>
   <li><Info />Subscriber threshold: {subscribers === null ? 'Unavailable' : subscribers >= 1000 ? '1,000 subscriber minimum met; valid watch hours and other requirements still need verification.' : 'Below the 1,000 subscriber advertising-revenue threshold.'}</li>
   <li><Info />Public statistics cannot verify monetization approval or eligible watch time.</li>
   <li><Info />Lifetime average upload frequency: {estimates && videos !== null ? `${(videos / estimates.days * 30).toFixed(1)} videos per 30 days` : 'Unavailable'}.</li>
   <li><Info />Lifetime views per current subscriber: {views !== null && subscribers !== null && subscribers > 0 ? (views / subscribers).toFixed(1) : 'Unavailable'}; not an engagement rate.</li>
  </ul></section><section className="report-detail"><h3>Recent Uploads</h3><p className="text-sm text-muted-foreground mb-4">Latest public videos from this channel, with views and publish dates.</p>{record.uploadsError ? <p role="alert" className="text-primary">{record.uploadsError}</p> : record.recentUploads?.length ? <ul className="report-uploads">{record.recentUploads.map(video => <li key={video.id}><div className="min-w-0 flex-1 space-y-2"><Link to="/tools/$slug" params={{ slug: toolSlug('Monetization Checker') }} search={{ url: `https://www.youtube.com/watch?v=${video.id}` }}>{video.title}</Link><small className="block">{video.views === undefined ? 'Views unavailable' : full(Number(video.views)) + ' views'} · {new Date(video.publishedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</small></div><Button asChild variant="outline" size="sm"><Link to="/tools/$slug" params={{ slug: toolSlug('YouTube Without Ads') }} search={{ url: `https://www.youtube.com/watch?v=${video.id}` }} aria-label={`Watch it Here!: ${video.title}`}><Play/>Watch it Here!</Link></Button></li>)}</ul> : <p className="text-muted-foreground">No recent public uploads were returned.</p>}</section></>}
  <section className="report-detail"><h3>Channel Tags</h3>{parseChannelTags(record.channelKeywords).length ? <div className="report-tags">{parseChannelTags(record.channelKeywords).map(tag => <span key={tag}>{tag}</span>)}</div> : <><p className="text-muted-foreground">This channel has no published channel keywords in the returned public data.</p>{record.recentUploads?.some(video => video.tags.length > 0) && <div className="mt-4 space-y-3"><h4 className="font-semibold">Tags from recent videos</h4><div className="report-tags">{[...new Set(record.recentUploads.flatMap(video => video.tags))].map(tag => <span key={tag}>{tag}</span>)}</div><p className="text-sm text-muted-foreground">Published video tags, not channel keywords.</p></div>}</>}</section>
 </div>;
}