'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { SiteContent } from '@/lib/site-content';

export function SmartHeader({ content }: { content: SiteContent['global'] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0);
        setScrolled(y > 32);
        setHidden(!menuOpen && y > 180 && y > lastY.current + 5);
        if (y < lastY.current - 5) setHidden(false);
        lastY.current = y;
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.body.classList.add('menu-is-open');
    window.addEventListener('keydown', close);
    return () => { document.body.classList.remove('menu-is-open'); window.removeEventListener('keydown', close); };
  }, [menuOpen]);

  return <header className="site-header" data-scrolled={scrolled} data-hidden={hidden} data-menu-open={menuOpen}>
    <div className="nav-shell shell">
      <Link className="brand" href="/" aria-label={`${content.restaurantName} – Startseite`}><img src={content.logo} alt={content.restaurantName} width="425" height="215" /></Link>
      <nav className="desktop-nav" aria-label="Hauptnavigation">{content.navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</Link>)}</nav>
      <a className="nav-call" href={`tel:${content.phoneHref}`}><Phone aria-hidden="true" /><span>{content.phoneDisplay}</span></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="navigation-drawer" aria-label={menuOpen ? 'Menü schliessen' : 'Menü öffnen'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </div>
    <div className="nav-drawer" id="navigation-drawer" aria-hidden={!menuOpen}>
      <div className="shell nav-drawer__inner">
        <nav aria-label="Menü">{content.navigation.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ '--nav-index': index } as CSSProperties}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}<ArrowUpRight aria-hidden="true" /></Link>)}</nav>
        <address><p><MapPin aria-hidden="true" /> {content.addressStreet}<br />{content.addressPostalCity}</p><a href={`tel:${content.phoneHref}`}><Phone aria-hidden="true" /> {content.phoneDisplay}</a><a href={`mailto:${content.emailPrimary}`}><Mail aria-hidden="true" /> {content.emailPrimary}</a></address>
      </div>
    </div>
  </header>;
}
