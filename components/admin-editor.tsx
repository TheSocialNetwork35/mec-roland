'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ExternalLink, FileText, Loader2, LogOut, Plus, Save, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { AdminIdentity } from '@/lib/admin-auth';
import type { SiteContent } from '@/lib/site-content';

type MediaItem = { id: string; filename: string; contentType: string; size: number; objectKey: string; createdAt: string; createdBy: string };
type Path = Array<string | number>;

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

export function AdminEditor({ initialContent, initialMedia, user }: { initialContent: SiteContent; initialMedia: MediaItem[]; user: AdminIdentity }) {
  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState(initialMedia);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('Alle Änderungen werden erst mit „Speichern“ veröffentlicht.');

  function update(path: Path, value: unknown) {
    setContent((current) => {
      const next = clone(current); let target: unknown = next;
      for (let index = 0; index < path.length - 1; index += 1) target = (target as Record<string | number, unknown>)[path[index]];
      (target as Record<string | number, unknown>)[path.at(-1)!] = value;
      return next;
    });
  }

  async function save() {
    setSaving(true); setStatus('Inhalte werden gespeichert …');
    try {
      const response = await fetch('/api/pflege/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(content) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Speichern fehlgeschlagen');
      setStatus('Gespeichert und veröffentlicht.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Speichern fehlgeschlagen'); }
    finally { setSaving(false); }
  }

  async function upload(file: File) {
    setUploading(true); setStatus(`${file.name} wird hochgeladen …`);
    const form = new FormData(); form.set('file', file);
    try {
      const response = await fetch('/api/pflege/media', { method: 'POST', body: form });
      const result = await response.json() as MediaItem & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Upload fehlgeschlagen');
      setMedia((items) => [...items, result]); setStatus(`${file.name} wurde hochgeladen.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Upload fehlgeschlagen'); }
    finally { setUploading(false); }
  }

  async function deleteMedia(item: MediaItem) {
    if (!window.confirm(`„${item.filename}“ wirklich löschen? Verwendete Inhalte können danach fehlen.`)) return;
    const response = await fetch(`/api/pflege/media/${item.id}`, { method: 'DELETE' });
    if (response.ok) { setMedia((items) => items.filter((entry) => entry.id !== item.id)); setStatus(`${item.filename} wurde gelöscht.`); }
    else setStatus('Datei konnte nicht gelöscht werden.');
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/" target="_blank"><img src={content.global.logo} alt={content.global.restaurantName} width="425" height="215" /><ExternalLink aria-hidden="true" /></Link>
      <div><p className="admin-kicker">Website-Verwaltung</p><h1>Pflege</h1></div>
      <p className="admin-user">Angemeldet als<br /><strong>{user.name}</strong></p>
      <form action="/api/pflege/logout" method="post"><button className="admin-signout" type="submit"><LogOut aria-hidden="true" /> Abmelden</button></form>
    </aside>
    <main className="admin-main">
      <header className="admin-toolbar"><div><p className="admin-kicker">Mec Roland</p><h2>Inhalte bearbeiten</h2></div><div className="admin-actions"><output aria-live="polite">{status}</output><Button onClick={save} disabled={saving} className="admin-save">{saving ? <Loader2 className="spin" /> : <Save />} Speichern</Button></div></header>
      <Tabs defaultValue="global" className="admin-tabs">
        <TabsList className="admin-tabs__list" aria-label="Inhaltsbereiche">
          <TabsTrigger value="global">Allgemein</TabsTrigger><TabsTrigger value="home">Startseite</TabsTrigger><TabsTrigger value="menu">Menü</TabsTrigger><TabsTrigger value="team">Team</TabsTrigger><TabsTrigger value="contact">Kontakt & Links</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger><TabsTrigger value="media">Medien</TabsTrigger>
        </TabsList>
        <TabsContent value="global"><Section title="Allgemeine Angaben" description="Kontaktdaten, Öffnungszeiten, Navigation und Footer.">
          <FieldGrid>
            <TextField label="Restaurantname" value={content.global.restaurantName} onChange={(v) => update(['global','restaurantName'], v)} />
            <TextField label="Claim" value={content.global.tagline} onChange={(v) => update(['global','tagline'], v)} />
            <TextField label="Firmenname" value={content.global.companyName} onChange={(v) => update(['global','companyName'], v)} />
            <TextField label="Telefon (Anzeige)" value={content.global.phoneDisplay} onChange={(v) => update(['global','phoneDisplay'], v)} />
            <TextField label="Telefon (Link)" value={content.global.phoneHref} onChange={(v) => update(['global','phoneHref'], v)} />
            <TextField label="E-Mail öffentlich" value={content.global.emailPrimary} onChange={(v) => update(['global','emailPrimary'], v)} />
            <TextField label="E-Mail Impressum" value={content.global.emailImprint} onChange={(v) => update(['global','emailImprint'], v)} />
            <TextField label="Strasse" value={content.global.addressStreet} onChange={(v) => update(['global','addressStreet'], v)} />
            <TextField label="PLZ / Ort" value={content.global.addressPostalCity} onChange={(v) => update(['global','addressPostalCity'], v)} />
            <TextField label="Google-Maps-Link" value={content.global.mapUrl} onChange={(v) => update(['global','mapUrl'], v)} />
            <MediaField label="Logo" value={content.global.logo} onChange={(v) => update(['global','logo'], v)} />
            <MediaField label="Kartenbild" value={content.global.mapImage} onChange={(v) => update(['global','mapImage'], v)} />
          </FieldGrid>
          <StringList label="Öffnungszeiten" values={content.global.openingTimes} onChange={(v) => update(['global','openingTimes'], v)} />
          <TextAreaField label="Hinweis Vorbestellung" value={content.global.orderingNote} onChange={(v) => update(['global','orderingNote'], v)} />
          <TextAreaField label="Footer-Text" value={content.global.footerText} onChange={(v) => update(['global','footerText'], v)} />
          <h3 className="admin-subtitle">Oberfläche & Microcopy</h3><FieldGrid>
            <TextField label="Hero-Menübutton" value={content.labels.heroMenuCta} onChange={(v) => update(['labels','heroMenuCta'], v)} />
            <TextField label="Scroll-Hinweis" value={content.labels.heroScroll} onChange={(v) => update(['labels','heroScroll'], v)} />
            <TextAreaField label="Laufband-Text" value={content.labels.marquee} onChange={(v) => update(['labels','marquee'], v)} />
            <TextField label="Team-Link Startseite" value={content.labels.homeTeamCta} onChange={(v) => update(['labels','homeTeamCta'], v)} />
            <TextField label="Bildlegende Startseite" value={content.labels.homeFeatureCaption} onChange={(v) => update(['labels','homeFeatureCaption'], v)} />
            <TextField label="Hero-Seitenindex" value={content.labels.pageIndex} onChange={(v) => update(['labels','pageIndex'], v)} />
            <TextField label="Kicker Menüseite" value={content.labels.menuEyebrow} onChange={(v) => update(['labels','menuEyebrow'], v)} />
            <TextField label="Kicker Teamseite" value={content.labels.teamEyebrow} onChange={(v) => update(['labels','teamEyebrow'], v)} />
            <TextField label="Kicker Kontaktseite" value={content.labels.contactEyebrow} onChange={(v) => update(['labels','contactEyebrow'], v)} />
            <TextField label="Kicker Linksseite" value={content.labels.linksEyebrow} onChange={(v) => update(['labels','linksEyebrow'], v)} />
            <TextField label="Kicker Impressum" value={content.labels.imprintEyebrow} onChange={(v) => update(['labels','imprintEyebrow'], v)} />
            <TextField label="Galerie-Kicker" value={content.labels.galleryEyebrow} onChange={(v) => update(['labels','galleryEyebrow'], v)} />
            <TextField label="Galerie-Titel" value={content.labels.galleryTitle} onChange={(v) => update(['labels','galleryTitle'], v)} />
            <TextField label="Galerie-Einleitung" value={content.labels.galleryLead} onChange={(v) => update(['labels','galleryLead'], v)} />
            <TextField label="Karten-Button" value={content.labels.mapCta} onChange={(v) => update(['labels','mapCta'], v)} />
            <TextField label="Besuch: Öffnungszeiten-Kicker" value={content.labels.visitHoursEyebrow} onChange={(v) => update(['labels','visitHoursEyebrow'], v)} />
            <TextField label="Besuch: Öffnungszeiten-Titel" value={content.labels.visitHoursTitle} onChange={(v) => update(['labels','visitHoursTitle'], v)} />
            <TextField label="Besuch: Vorbestellung-Kicker" value={content.labels.visitOrderEyebrow} onChange={(v) => update(['labels','visitOrderEyebrow'], v)} />
            <TextField label="Besuch: Vorbestellung-Titel" value={content.labels.visitOrderTitle} onChange={(v) => update(['labels','visitOrderTitle'], v)} />
            <TextField label="Besuch: Ort-Kicker" value={content.labels.visitPlaceEyebrow} onChange={(v) => update(['labels','visitPlaceEyebrow'], v)} />
            <TextField label="Besuch: Ort-Titel" value={content.labels.visitPlaceTitle} onChange={(v) => update(['labels','visitPlaceTitle'], v)} />
            <TextField label="Routen-Link" value={content.labels.routeCta} onChange={(v) => update(['labels','routeCta'], v)} />
            <TextField label="Footer: Impressum" value={content.labels.footerImprint} onChange={(v) => update(['labels','footerImprint'], v)} />
            <TextField label="Impressum: Telefon" value={content.labels.legalPhone} onChange={(v) => update(['labels','legalPhone'], v)} />
            <TextField label="Impressum: E-Mail" value={content.labels.legalEmail} onChange={(v) => update(['labels','legalEmail'], v)} />
          </FieldGrid>
          <ObjectList title="Navigation" items={content.global.navigation} addLabel="Navigationspunkt" onAdd={() => update(['global','navigation'], [...content.global.navigation, { label: '', href: '/' }])} onRemove={(i) => update(['global','navigation'], content.global.navigation.filter((_, index) => index !== i))}>{(item, i) => <FieldGrid><TextField label="Bezeichnung" value={item.label} onChange={(v) => update(['global','navigation',i,'label'], v)} /><TextField label="URL" value={item.href} onChange={(v) => update(['global','navigation',i,'href'], v)} /></FieldGrid>}</ObjectList>
        </Section></TabsContent>
        <TabsContent value="home"><Section title="Startseite" description="Hero, Willkommenstext, Bild und aktuelle Meldung.">
          <FieldGrid><TextField label="Hero-Kicker" value={content.home.heroEyebrow} onChange={(v) => update(['home','heroEyebrow'], v)} /><TextAreaField label="Hero-Titel (Zeilenumbruch mit Enter)" value={content.home.heroTitle} onChange={(v) => update(['home','heroTitle'], v)} /><TextAreaField label="Hero-Einleitung" value={content.home.heroLead} onChange={(v) => update(['home','heroLead'], v)} /><MediaField label="Hero-Bild" value={content.home.heroImage} onChange={(v) => update(['home','heroImage'], v)} /><TextField label="Willkommen-Kicker" value={content.home.welcomeEyebrow} onChange={(v) => update(['home','welcomeEyebrow'], v)} /><TextField label="Willkommen-Titel" value={content.home.welcomeTitle} onChange={(v) => update(['home','welcomeTitle'], v)} /><MediaField label="Portrait-/Restaurantbild" value={content.home.featureImage} onChange={(v) => update(['home','featureImage'], v)} /><TextField label="Bildbeschreibung" value={content.home.featureImageAlt} onChange={(v) => update(['home','featureImageAlt'], v)} /></FieldGrid>
          <StringList label="Willkommen-Absätze" multiline values={content.home.welcomeParagraphs} onChange={(v) => update(['home','welcomeParagraphs'], v)} />
          <h3 className="admin-subtitle">Aktuelle Meldung</h3><FieldGrid><TextField label="Label" value={content.notice.label} onChange={(v) => update(['notice','label'], v)} /><TextField label="Titel" value={content.notice.title} onChange={(v) => update(['notice','title'], v)} /><TextAreaField label="Text" value={content.notice.body} onChange={(v) => update(['notice','body'], v)} /></FieldGrid>
        </Section></TabsContent>
        <TabsContent value="menu"><Section title="Menüseite" description="Einleitung, Speisekarte und komplette Bildergalerie.">
          <FieldGrid><TextField label="Seitentitel" value={content.menu.title} onChange={(v) => update(['menu','title'], v)} /><TextAreaField label="Vorbestelltext" value={content.menu.preOrderText} onChange={(v) => update(['menu','preOrderText'], v)} /><TextField label="Ruhetag-Text" value={content.menu.restDayText} onChange={(v) => update(['menu','restDayText'], v)} /><TextField label="PDF-Bezeichnung" value={content.menu.pdfLabel} onChange={(v) => update(['menu','pdfLabel'], v)} /><MediaField label="PDF-URL" value={content.menu.pdfUrl} onChange={(v) => update(['menu','pdfUrl'], v)} /></FieldGrid>
          <StringList label="Einleitungsabsätze" multiline values={content.menu.introParagraphs} onChange={(v) => update(['menu','introParagraphs'], v)} />
          <ObjectList title="Galeriebilder" items={content.menu.gallery} addLabel="Galeriebild" onAdd={() => update(['menu','gallery'], [...content.menu.gallery, { src: '', alt: '' }])} onRemove={(i) => update(['menu','gallery'], content.menu.gallery.filter((_, index) => index !== i))}>{(item, i) => <FieldGrid><MediaField label="Bild-URL" value={item.src} onChange={(v) => update(['menu','gallery',i,'src'], v)} /><TextField label="Alternativtext" value={item.alt} onChange={(v) => update(['menu','gallery',i,'alt'], v)} /></FieldGrid>}</ObjectList>
        </Section></TabsContent>
        <TabsContent value="team"><Section title="Teamseite" description="Teambild und beliebig viele Teammitglieder.">
          <FieldGrid><TextField label="Seitentitel" value={content.team.title} onChange={(v) => update(['team','title'], v)} /><MediaField label="Teambild" value={content.team.heroImage} onChange={(v) => update(['team','heroImage'], v)} /><TextField label="Teambild-Beschreibung" value={content.team.heroImageAlt} onChange={(v) => update(['team','heroImageAlt'], v)} /></FieldGrid>
          <ObjectList title="Teammitglieder" items={content.team.members} addLabel="Teammitglied" onAdd={() => update(['team','members'], [...content.team.members, { name: '', description: '', image: '', alt: '' }])} onRemove={(i) => update(['team','members'], content.team.members.filter((_, index) => index !== i))}>{(item, i) => <FieldGrid><TextField label="Name" value={item.name} onChange={(v) => update(['team','members',i,'name'], v)} /><TextAreaField label="Beschreibung" value={item.description} onChange={(v) => update(['team','members',i,'description'], v)} /><MediaField label="Portrait" value={item.image} onChange={(v) => update(['team','members',i,'image'], v)} /><TextField label="Alternativtext" value={item.alt} onChange={(v) => update(['team','members',i,'alt'], v)} /></FieldGrid>}</ObjectList>
        </Section></TabsContent>
        <TabsContent value="contact"><Section title="Kontakt, Links & Impressum" description="Anlassinformationen, Lieferanten und rechtliche Kontaktangaben.">
          <h3 className="admin-subtitle">Kontakt</h3><FieldGrid><TextField label="Seitentitel" value={content.contact.title} onChange={(v) => update(['contact','title'], v)} /><TextAreaField label="Kapazität" value={content.contact.capacity} onChange={(v) => update(['contact','capacity'], v)} /><TextField label="Adress-Überschrift" value={content.contact.addressLabel} onChange={(v) => update(['contact','addressLabel'], v)} /></FieldGrid><StringList label="Kontaktabsätze" multiline values={content.contact.paragraphs} onChange={(v) => update(['contact','paragraphs'], v)} />
          <h3 className="admin-subtitle">Links</h3><TextField label="Seitentitel Links" value={content.links.title} onChange={(v) => update(['links','title'], v)} /><ObjectList title="Lieferanten & Links" items={content.links.items} addLabel="Link" onAdd={() => update(['links','items'], [...content.links.items, { intro: '', label: '', href: '' }])} onRemove={(i) => update(['links','items'], content.links.items.filter((_, index) => index !== i))}>{(item, i) => <FieldGrid><TextField label="Einleitung" value={item.intro} onChange={(v) => update(['links','items',i,'intro'], v)} /><TextField label="Bezeichnung" value={item.label} onChange={(v) => update(['links','items',i,'label'], v)} /><TextField label="URL" value={item.href} onChange={(v) => update(['links','items',i,'href'], v)} /></FieldGrid>}</ObjectList>
          <h3 className="admin-subtitle">Impressum</h3><FieldGrid><TextField label="Seitentitel" value={content.imprint.title} onChange={(v) => update(['imprint','title'], v)} /><TextField label="Kontakt-Überschrift" value={content.imprint.contactLabel} onChange={(v) => update(['imprint','contactLabel'], v)} /></FieldGrid>
        </Section></TabsContent>
        <TabsContent value="seo"><Section title="SEO & Social Sharing" description="Titel, Beschreibungen und Social-Preview-Bilder jeder öffentlichen Seite.">{Object.entries(content.seo).map(([key, item]) => <div className="seo-card" key={key}><h3>{seoNames[key] ?? key}</h3><FieldGrid><TextField label="SEO-Titel" value={item.title} onChange={(v) => update(['seo',key,'title'], v)} /><TextAreaField label="Meta-Beschreibung" value={item.description} onChange={(v) => update(['seo',key,'description'], v)} /><MediaField label="Social-Preview-Bild" value={item.image} onChange={(v) => update(['seo',key,'image'], v)} /></FieldGrid></div>)}</Section></TabsContent>
        <TabsContent value="media"><Section title="Bilder & PDFs" description="Dateien hochladen, URL kopieren oder nicht mehr benötigte Uploads löschen.">
          <label className="upload-box"><Upload aria-hidden="true" /><strong>{uploading ? 'Upload läuft …' : 'Bild oder PDF hochladen'}</strong><span>JPG, PNG, WebP, AVIF oder PDF · maximal 20 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ''; }} /></label>
          <MediaLibrary items={media} onDelete={deleteMedia} />
        </Section></TabsContent>
      </Tabs>
    </main>
  </div>;
}

const seoNames: Record<string, string> = { home: 'Startseite', menu: 'Menü', team: 'Team', contact: 'Kontakt', links: 'Links', imprint: 'Impressum' };

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="admin-section"><div className="admin-section__head"><p className="admin-kicker">Inhaltsbereich</p><h2>{title}</h2><p>{description}</p></div><div className="admin-section__body">{children}</div></section>; }
function FieldGrid({ children }: { children: React.ReactNode }) { return <div className="field-grid">{children}</div>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { const id = useId(); return <div className="admin-field"><Label htmlFor={id}>{label}</Label><Input id={id} value={value} onChange={(event) => onChange(event.target.value)} /></div>; }
function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { const id = useId(); return <div className="admin-field admin-field--wide"><Label htmlFor={id}>{label}</Label><Textarea id={id} value={value} rows={4} onChange={(event) => onChange(event.target.value)} /></div>; }
function MediaField(props: { label: string; value: string; onChange: (value: string) => void }) { return <div className="media-field"><TextField {...props} />{props.value && (props.value.toLowerCase().endsWith('.pdf') || props.value.includes('/media-file/')) ? <a href={props.value} target="_blank" rel="noreferrer"><FileText aria-hidden="true" /> Datei öffnen</a> : props.value ? <img src={props.value} alt="Vorschau" /> : null}</div>; }

function StringList({ label, values, onChange, multiline = false }: { label: string; values: string[]; onChange: (values: string[]) => void; multiline?: boolean }) {
  return <div className="list-editor"><div className="list-editor__head"><h3>{label}</h3><Button variant="outline" onClick={() => onChange([...values, ''])}><Plus /> Eintrag</Button></div>{values.map((value, index) => <div className="list-row" key={index}>{multiline ? <Textarea value={value} rows={3} aria-label={`${label} ${index + 1}`} onChange={(event) => onChange(values.map((item, i) => i === index ? event.target.value : item))} /> : <Input value={value} aria-label={`${label} ${index + 1}`} onChange={(event) => onChange(values.map((item, i) => i === index ? event.target.value : item))} />}<Button variant="destructive" size="icon" aria-label="Eintrag löschen" onClick={() => onChange(values.filter((_, i) => i !== index))}><Trash2 /></Button></div>)}</div>;
}

function ObjectList<T>({ title, items, addLabel, onAdd, onRemove, children }: { title: string; items: T[]; addLabel: string; onAdd: () => void; onRemove: (index: number) => void; children: (item: T, index: number) => React.ReactNode }) {
  return <div className="object-list"><div className="list-editor__head"><h3>{title}</h3><Button variant="outline" onClick={onAdd}><Plus /> {addLabel}</Button></div>{items.map((item, index) => <article key={index}><div className="object-list__number">{String(index + 1).padStart(2, '0')}<Button variant="destructive" size="icon" aria-label={`${addLabel} löschen`} onClick={() => onRemove(index)}><Trash2 /></Button></div>{children(item, index)}</article>)}</div>;
}

function MediaLibrary({ items, onDelete }: { items: MediaItem[]; onDelete: (item: MediaItem) => void }) {
  const [copied, setCopied] = useState('');
  if (!items.length) return <p className="empty-media">Noch keine Dateien über die Pflege hochgeladen.</p>;
  return <div className="media-library">{items.map((item) => { const url = `/media-file/${item.id}`; const isImage = item.contentType.startsWith('image/'); return <article key={item.id}>{isImage ? <img src={url} alt="" /> : <div className="pdf-preview"><FileText /></div>}<div><strong>{item.filename}</strong><span>{formatBytes(item.size)} · {new Date(item.createdAt).toLocaleDateString('de-CH')}</span></div><div className="media-library__actions"><Button variant="outline" size="icon" aria-label="URL kopieren" onClick={() => { void navigator.clipboard.writeText(url); setCopied(item.id); }}>{copied === item.id ? <Check /> : <Copy />}</Button><Button variant="destructive" size="icon" aria-label="Datei löschen" onClick={() => onDelete(item)}><Trash2 /></Button></div></article>; })}</div>;
}
function formatBytes(size: number) { return size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`; }
