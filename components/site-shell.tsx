import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { SmartHeader } from '@/components/smart-header';

export function SiteHeader({ content }: { content: SiteContent['global'] }) {
  return <SmartHeader content={content} />;
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const global = content.global; const labels = content.labels;
  return <footer className="footer">
    <div className="shell footer__main">
      <Link className="brand brand--footer" href="/"><img src={global.logo} alt={global.restaurantName} width="425" height="215" /></Link>
      <p>{global.addressStreet} · {global.addressPostalCity}</p>
      <div className="footer__links"><a href={`tel:${global.phoneHref}`}>{global.phoneDisplay}</a><a href={`mailto:${global.emailPrimary}`}>{global.emailPrimary}</a><Link href="/impressum/">{labels.footerImprint}</Link><a className="footer__route" href={global.mapUrl} target="_blank" rel="noreferrer" aria-label={labels.routeCta}><ArrowUpRight aria-hidden="true" /></a></div>
    </div>
    <div className="shell footer__fineprint">© {new Date().getFullYear()} {global.companyName} · {global.footerText}</div>
  </footer>;
}
