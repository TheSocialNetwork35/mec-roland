import type { Metadata } from 'next';
import { Baloo_2, Source_Sans_3 } from 'next/font/google';
import { getSiteContent } from '@/lib/content-store';
import './globals.css';

const sourceSans = Source_Sans_3({ variable: '--font-body', subsets: ['latin'], display: 'swap' });
const baloo = Baloo_2({ variable: '--font-display', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://mec-roland.ch'),
  title: { default: 'Mec Roland, Kaltbrunn | Das Restaurant mit Herz', template: '%s | Mec Roland, Kaltbrunn' },
  description: 'Restaurant Mec Roland in Kaltbrunn: Burger und regionale Küche, frisch zubereitet und herzlich serviert.',
  applicationName: 'Mec Roland',
  category: 'Restaurant',
  icons: { icon: '/media/10-Mec-Roland-Weiss.png' },
  openGraph: { type: 'website', locale: 'de_CH', siteName: 'Mec Roland', images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Mec Roland – Das Restaurant mit Herz' }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent(); const g = content.global;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: g.restaurantName, legalName: g.companyName,
    image: ['https://mec-roland.ch/og.png'], url: 'https://mec-roland.ch/', telephone: g.phoneHref, email: g.emailPrimary,
    address: { '@type': 'PostalAddress', streetAddress: g.addressStreet, postalCode: g.addressPostalCity.split(' ')[0], addressLocality: g.addressPostalCity.replace(/^\d+\s*/, ''), addressCountry: 'CH' },
    openingHours: g.openingTimes, servesCuisine: 'Burger',
  };
  return <html lang="de-CH"><body className={`${sourceSans.variable} ${baloo.variable}`}><a className="skip-link" href="#main-content">Zum Inhalt springen</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /></body></html>;
}
