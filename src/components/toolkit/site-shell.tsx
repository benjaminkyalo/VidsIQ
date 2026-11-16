import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import { Youtube, ChevronDown, Menu, Facebook, Twitter, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { featuredTools, toolSlug, type Tool } from '@/lib/tools';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Brand() {
  return <span className="brand"><Youtube className="brand-icon" /><span>Vids<span className="text-primary">IQ</span></span></span>;
}

// Brings the "Channel checks and creator research" section into view. The router
// restores the previous scroll position shortly after navigation settles, so the
// jump is re-asserted twice unless the visitor takes over scrolling first.
export function scrollToChannelChecks() {
  const target = document.getElementById('channel-checks');
  if (!target) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go = () => target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  go();
  let takenOver = false;
  const takeOver = () => { takenOver = true; };
  window.addEventListener('wheel', takeOver, { passive: true });
  window.addEventListener('pointerdown', takeOver, { passive: true });
  window.addEventListener('keydown', takeOver);
  for (const ms of [150, 400]) window.setTimeout(() => {
    if (takenOver || window.location.hash !== '#channel-checks') return;
    if (Math.abs(target.getBoundingClientRect().top) <= 24) return;
    go();
  }, ms);
  window.setTimeout(() => {
    window.removeEventListener('wheel', takeOver);
    window.removeEventListener('pointerdown', takeOver);
    window.removeEventListener('keydown', takeOver);
  }, 700);
  return true;
}

function ToolsMenu({ onTool }: { onTool?: ((name: string) => void) | undefined }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const ignoreFocus = useRef(false);
  const router = useRouter();
  const onHome = useRouterState({ select: s => s.location.pathname === '/' });
  const openNow = () => { if (ignoreFocus.current) return; if (timer.current !== null) window.clearTimeout(timer.current); timer.current = null; setOpen(true); };
  const closeLater = () => { if (timer.current !== null) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(false), 140); };
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      const trigger = document.querySelector<HTMLButtonElement>('.nav-tools');
      if (trigger && !trigger.contains(document.activeElement)) { ignoreFocus.current = true; trigger.focus(); ignoreFocus.current = false; }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const goToMore = () => {
    setOpen(false);
    if (scrollToChannelChecks()) return;
    router.navigate({ to: '/', hash: 'channel-checks' });
  };
  const item = (t: Tool) => onTool
    ? <button type="button" className="tools-panel-item" key={t.name} onClick={() => { setOpen(false); onTool(t.name); }}><t.icon className="text-primary" />{t.name}</button>
    : <Link to="/tools/$slug" params={{ slug: toolSlug(t.name) }} className="tools-panel-item" key={t.name} onClick={() => setOpen(false)}><t.icon className="text-primary" />{t.name}</Link>;
  return <div className="tools-menu" onMouseEnter={openNow} onMouseLeave={closeLater} onFocus={openNow} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
    <Button type="button" variant="ghost" className="nav-tools" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(o => !o)}>Tools <ChevronDown className={open ? 'nav-tools-open' : undefined} /></Button>
    {open && <div className="tools-panel" role="group" aria-label="Tools menu"><div className="tools-panel-scroll">
      <div className="tools-panel-grid">{featuredTools.map(item)}</div>
      <button type="button" className="tools-panel-more" onClick={goToMore}>More tools <ArrowRight /></button>
    </div></div>}
  </div>;
}

export function SiteShell({ children, onTool }: { children: ReactNode; onTool?: (name: string) => void }) {
  return <><header className="site-header"><div className="header-inner"><Link to="/" aria-label="VidsIQ home"><Brand /></Link><nav className="desktop-nav" aria-label="Main navigation"><ToolsMenu onTool={onTool} /><Link to="/youtube-seo">YouTube SEO</Link><Link to="/blogs">Blogs</Link><Link to="/about">About Us</Link><Link to="/contact">Contact Us</Link></nav><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open navigation"><Menu /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to="/">Home & Tools</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/youtube-seo">YouTube SEO</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/blogs">Blogs</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/about">About Us</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/contact">Contact Us</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></header>{children}<footer className="site-footer"><div className="footer-grid"><div><Link to="/"><Brand /></Link><p>VidsIQ brings public channel research, metadata utilities, earnings calculators, and permitted asset downloads together.</p><div className="social-links"><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="Twitter / X"><Twitter /></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube /></a></div></div><div><h3>FEATURED TOOLS</h3>{['Tag Extractor','Shadowban Detector','Money Calculator','Image Tool','Thumbnail Viewer'].map(name => <Button variant="link" className="footer-tool" key={name} onClick={() => onTool ? onTool(name) : window.location.assign('/')}>{name}</Button>)}</div><div><h3>QUICK LINKS</h3><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/contact">Contact Support</Link><Link to="/youtube-seo">YouTube SEO Guide</Link><Link to="/blogs">Latest Blogs</Link><Link to="/write-for-us">Write for Us</Link></div><div><h3>PRIVACY & LEGAL</h3><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms and Conditions</Link><Link to="/contact" className="mail-link"><Mail className="text-primary" />Contact us</Link></div></div><div className="copyright">© 2026 VidsIQ. All rights reserved.</div></footer></>;
}
