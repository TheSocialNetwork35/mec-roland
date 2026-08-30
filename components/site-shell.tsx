import Link from 'next/link';
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';

export function SiteHeader({ content }: { content: SiteContent['global'] }) {
  return <header className="site-header">
    <div className="topbar"><div className="shell topbar__inner">
      <p><MapPin aria-hidden="true" /> {content.addressStreet} · {content.addressPostalCity}</p>
      <div><a href={`tel:${content.phoneHref}`}><Phone aria-hidden="true" /> {content.phoneDisplay}</a><a href={`mailto:${content.emailPrimary}`}><Mail aria-hidden="true" /> {content.emailPrimary}</a></div>
    </div></div>
    <div className="shell nav-wrap">
      <Link className="brand" href="/" aria-label={`${content.restaurantName} – Startseite`}><img src={content.logo} alt={content.restaurantName} width="425" height="215" /></Link>
      <nav aria-label="Hauptnavigation">{content.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <details className="mobile-menu"><summary aria-label="Menü öffnen"><Menu className="open-icon" aria-hidden="true" /><X className="close-icon" aria-hidden="true" /></summary><nav aria-label="Mobile Navigation">{content.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></details>
    </div>
  </header>;
}

export function SiteFooter({ content }: { content: SiteContent['global'] }) {
  return <footer className="footer">
    <div className="shell footer__main">
      <Link className="brand brand--footer" href="/"><img src={content.logo} alt={content.restaurantName} width="425" height="215" /></Link>
      <p>{content.companyName}<br />{content.addressStreet}<br />{content.addressPostalCity}</p>
      <div className="footer__links"><a href={`tel:${content.phoneHref}`}>{content.phoneDisplay}</a><a href={`mailto:${content.emailPrimary}`}>{content.emailPrimary}</a><Link href="/impressum/">Impressum</Link><Link href="/pflege/">Pflege</Link></div>
    </div>
    <div className="shell footer__fineprint">© {new Date().getFullYear()} {content.companyName} · {content.footerText}</div>
  </footer>;
}
