export type SeoEntry = { title: string; description: string; image: string };
export type LinkItem = { label: string; href: string };
export type TeamMember = { name: string; description: string; image: string; alt: string };
export type GalleryImage = { src: string; alt: string };

export type SiteContent = {
  global: {
    restaurantName: string;
    tagline: string;
    companyName: string;
    phoneDisplay: string;
    phoneHref: string;
    emailPrimary: string;
    emailImprint: string;
    addressStreet: string;
    addressPostalCity: string;
    mapUrl: string;
    logo: string;
    mapImage: string;
    openingTimes: string[];
    orderingNote: string;
    navigation: LinkItem[];
    footerText: string;
  };
  notice: { label: string; title: string; body: string };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    heroImage: string;
    welcomeEyebrow: string;
    welcomeTitle: string;
    welcomeParagraphs: string[];
    featureImage: string;
    featureImageAlt: string;
  };
  menu: {
    title: string;
    introParagraphs: string[];
    preOrderText: string;
    restDayText: string;
    pdfLabel: string;
    pdfUrl: string;
    gallery: GalleryImage[];
  };
  team: { title: string; heroImage: string; heroImageAlt: string; members: TeamMember[] };
  contact: { title: string; paragraphs: string[]; capacity: string; addressLabel: string };
  links: { title: string; items: Array<{ intro: string; label: string; href: string }> };
  imprint: { title: string; contactLabel: string };
  seo: Record<'home' | 'menu' | 'team' | 'contact' | 'links' | 'imprint', SeoEntry>;
};

const media = (filename: string) => `/media/${filename}`;

export const defaultSiteContent: SiteContent = {
  global: {
    restaurantName: 'Mec Roland',
    tagline: 'Das Restaurant mit Herz',
    companyName: 'Mec Roland GmbH',
    phoneDisplay: '055 283 49 19',
    phoneHref: '+41552834919',
    emailPrimary: 'mecroland@hotmail.com',
    emailImprint: 'info@mec-roland.ch',
    addressStreet: 'Wildbrunnstrasse 2',
    addressPostalCity: '8722 Kaltbrunn',
    mapUrl: 'https://goo.gl/maps/GGknfabJr5XtHkQ17',
    logo: media('99-Mec-Roland-Weiss-breit.png'),
    mapImage: media('124-Karte-Mec-Roland.jpg'),
    openingTimes: ['Mi. – So.: 11.00 – 14.00 / 17.00 – 21.00 Uhr', 'Mo. und Di. geschlossen'],
    orderingNote: 'Sofortbedienung oder telefonische Vorbestellung (mind. 1 Std. vorher)',
    navigation: [
      { href: '/', label: 'Restaurant' },
      { href: '/menue/', label: 'Menü' },
      { href: '/team/', label: 'Team' },
      { href: '/kontakt/', label: 'Kontakt' },
      { href: '/links/', label: 'Links' },
    ],
    footerText: 'Mec Roland GmbH, Wildbrunnstrasse 2, 8722 Kaltbrunn, Telefon 055 283 49 19',
  },
  notice: {
    label: 'Aktuell',
    title: 'Gutscheinkarte Mec Roland',
    body: 'Bezahlen Sie die Konsumation bargeldlos und bequem mit der aufladbaren Innocard. Mindestbetrag Fr. 30.–',
  },
  home: {
    heroEyebrow: 'Das Restaurant mit Herz',
    heroTitle: 'Ehrliches Essen.\nHerzlich serviert.',
    heroLead: 'Der beliebte Gastrotreffpunkt zwischen Uznach und Kaltbrunn – geführt mit Freude, Leidenschaft und viel Herz.',
    heroImage: media('79-burger-breit1.jpg'),
    welcomeEyebrow: 'Willkommen',
    welcomeTitle: 'Herzlich willkommen im Restaurant mit Herz',
    welcomeParagraphs: [
      'Der beliebte Gastrotreffpunkt Mec Roland präsentiert sich an verkehrstechnisch bester Lage zwischen Uznach und Kaltbrunn.',
      'Mit ansteckender Freude und Leidenschaft bedienen Sie Gastgeber Roland Lekeu und sein motiviertes Team speditiv und kompetent.',
      'Ob Stammkundschaft oder Neuankömmling – Roland und sein Team freuen sich auf Ihren Besuch.',
    ],
    featureImage: media('208-MecRoland_Roland.jpg'),
    featureImageAlt: 'Roland Lekeu vor dem Restaurant Mec Roland',
  },
  menu: {
    title: 'Menü',
    introParagraphs: [
      'Unsere Burger werden mit viel Liebe und Kreativität frisch zubereitet.',
      'Die Eier direkt vom Hof des Nachbarn, das Fleisch vom Dorfmetzger – wir legen grossen Wert auf die Verwendung von regionalen Zutaten.',
      'Beim Geschirr und der Verpackung ist uns der Umweltgedanke ein grosses Anliegen.',
      'Die Sofortbedienung mit kurzer Wartezeit der Gäste ist unsere Stärke und Herausforderung.',
    ],
    preOrderText: 'Für den (noch) schnelleren Imbiss während Stosszeiten empfehlen wir eine telefonische Vorbestellung (mindestens 1 Stunde im voraus).',
    restDayText: 'Montag Ruhetag',
    pdfLabel: 'PDF Speisekarte',
    pdfUrl: media('391-MecRoland_Speisekarte_06-2024.pdf'),
    gallery: [
      ['358-fischbaguette.png', 'Fischbaguette'], ['357-fitnessteller.png', 'Fitnessteller'],
      ['355-gemischtersalat-1.png', 'Gemischter Salat'], ['352-salatmaison.png', 'Salat Maison'],
      ['351-schnipo.png', 'Schnitzel mit Pommes'], ['350-spiesslibaguette.png', 'Spiesslibaguette'],
      ['199-MecRoland_Essen-01.jpg', 'Gericht aus der Küche des Mec Roland'], ['200-MecRoland_Essen-02.jpg', 'Frisch zubereitetes Gericht'],
      ['201-MecRoland_Essen-03.jpg', 'Gericht im Mec Roland'], ['203-MecRoland_Essen-05.jpg', 'Mec Roland Speise'],
      ['204-MecRoland_Essen-06.jpg', 'Mec Roland Speise'], ['205-MecRoland_Essen-07.jpg', 'Mec Roland Speise'],
      ['206-MecRoland_Essen-08.jpg', 'Mec Roland Speise'], ['207-MecRoland_Essen-09.jpg', 'Mec Roland Speise'],
      ['202-MecRoland_Essen-04.jpg', 'Mec Roland Speise'],
    ].map(([filename, alt]) => ({ src: media(filename), alt })),
  },
  team: {
    title: 'Unser Team',
    heroImage: media('244-mec-roland-team-.jpg'),
    heroImageAlt: 'Das Team des Mec Roland',
    members: [
      { name: 'Roland Lekeu', description: 'Kreativer Patron und innovativer Gründer mit Herz vor bereits 20 Jahren – wer ihn kennt liebt ihn und sein Essen.', image: media('162-Mec-Roland_Roland-Lekeu.jpg'), alt: 'Roland Lekeu' },
      { name: 'Claudia Konrad', description: 'Mit Kompetenz und Humor behält sie auch in hektischen Zeiten den Überblick und zaubert den Gästen ein Lächeln ins Gesicht.', image: media('158-Mec-Roland_Claudia-Konrad.jpg'), alt: 'Claudia Konrad' },
      { name: 'Lucie Sůlová', description: 'Ihre freundliche und warmherzige Art im Service schätzen unsere Stammkunden bereits seit 10 Jahren.', image: media('171-Mec-Roland_Lucie-Suelova1.jpg'), alt: 'Lucie Sůlová' },
      { name: 'Dile Gjetaj', description: 'Dank familiärer und charmanter Bedienung seit 3 Jahren beliebt im Service bei Gross und Klein.', image: media('170-Mec-Roland_Dile-Gjetay1.jpg'), alt: 'Dile Gjetaj' },
      { name: 'Rosa Castro', description: 'Schon seit 8 Jahren sorgt unsere Reinigungsperle für Sauberkeit und Glanz im Lokal.', image: media('163-Mec-Roland_Rosa-de-Pinto.jpg'), alt: 'Rosa Castro' },
    ],
  },
  contact: {
    title: 'Kontakt',
    paragraphs: [
      'Ob Privat-, Vereins- oder Geschäftsanlass – unser Restaurant ist bestens geeignet, dass auch Ihr Anlass zum Erfolg wird! Gerne passen wir uns Ihrem Event an.',
      'Wir beraten Sie gerne kompetent und setzen Ihre Wünsche in die Tat um.',
      'Kommen Sie vorbei und lassen Sie sich von uns überraschen!',
    ],
    capacity: 'Kapazität bis 70 Personen – während der Sommerzeit zusätzlich 50 Aussenplätze.',
    addressLabel: 'Adresse',
  },
  links: {
    title: 'Links',
    items: [
      { intro: 'Unser Lieferant von Fleisch:', label: 'Metzgerei Jud Uznach', href: 'http://www.jud-metzgerei.ch' },
      { intro: 'Unser Lieferant von Gemüse:', label: 'Kistler Gemüse Benken', href: 'http://www.kistler-gemuese.ch' },
    ],
  },
  imprint: { title: 'Impressum', contactLabel: 'Kontaktadresse' },
  seo: {
    home: { title: 'Mec Roland, Kaltbrunn | Das Restaurant mit Herz', description: 'Restaurant Mec Roland in Kaltbrunn: Burger und regionale Küche, frisch zubereitet und herzlich serviert.', image: '/og.png' },
    menu: { title: 'Menü | Mec Roland, Kaltbrunn', description: 'Entdecken Sie die Speisekarte und frisch zubereiteten Burger des Restaurant Mec Roland in Kaltbrunn.', image: media('199-MecRoland_Essen-01.jpg') },
    team: { title: 'Team | Mec Roland, Kaltbrunn', description: 'Lernen Sie Roland Lekeu und das herzliche Team des Restaurant Mec Roland kennen.', image: media('244-mec-roland-team-.jpg') },
    contact: { title: 'Kontakt | Mec Roland, Kaltbrunn', description: 'Adresse, Telefon, Öffnungszeiten und Informationen für Anlässe im Restaurant Mec Roland in Kaltbrunn.', image: media('208-MecRoland_Roland.jpg') },
    links: { title: 'Links | Mec Roland, Kaltbrunn', description: 'Regionale Lieferanten und Partner des Restaurant Mec Roland in Kaltbrunn.', image: media('79-burger-breit1.jpg') },
    imprint: { title: 'Impressum | Mec Roland, Kaltbrunn', description: 'Impressum und Kontaktadresse der Mec Roland GmbH in Kaltbrunn.', image: media('79-burger-breit1.jpg') },
  },
};
