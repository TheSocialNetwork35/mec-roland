import { z } from 'zod';

const cleanText = z.string().max(10_000);
const shortText = z.string().max(500);
const link = z.object({ label: shortText, href: shortText });
const seo = z.object({ title: shortText, description: cleanText, image: shortText });

export const siteContentSchema = z.object({
  global: z.object({
    restaurantName: shortText, tagline: shortText, companyName: shortText,
    phoneDisplay: shortText, phoneHref: shortText, emailPrimary: shortText, emailImprint: shortText,
    addressStreet: shortText, addressPostalCity: shortText, mapUrl: shortText, logo: shortText, mapImage: shortText,
    openingTimes: z.array(shortText).max(14), orderingNote: cleanText, navigation: z.array(link).max(20), footerText: cleanText,
  }),
  notice: z.object({ label: shortText, title: shortText, body: cleanText }),
  home: z.object({
    heroEyebrow: shortText, heroTitle: shortText, heroLead: cleanText, heroImage: shortText,
    welcomeEyebrow: shortText, welcomeTitle: shortText, welcomeParagraphs: z.array(cleanText).max(30),
    featureImage: shortText, featureImageAlt: shortText,
  }),
  menu: z.object({
    title: shortText, introParagraphs: z.array(cleanText).max(50), preOrderText: cleanText,
    restDayText: shortText, pdfLabel: shortText, pdfUrl: shortText,
    gallery: z.array(z.object({ src: shortText, alt: shortText })).max(100),
  }),
  team: z.object({
    title: shortText, heroImage: shortText, heroImageAlt: shortText,
    members: z.array(z.object({ name: shortText, description: cleanText, image: shortText, alt: shortText })).max(50),
  }),
  contact: z.object({ title: shortText, paragraphs: z.array(cleanText).max(30), capacity: cleanText, addressLabel: shortText }),
  links: z.object({ title: shortText, items: z.array(z.object({ intro: cleanText, label: shortText, href: shortText })).max(50) }),
  imprint: z.object({ title: shortText, contactLabel: shortText }),
  seo: z.object({ home: seo, menu: seo, team: seo, contact: seo, links: seo, imprint: seo }),
});
