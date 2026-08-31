'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, Image as ImageIcon, Link2, Loader2, LogOut, MousePointer2, RefreshCw, Save, Settings2, Type, Upload, X } from 'lucide-react';
import type { AdminIdentity } from '@/lib/admin-auth';
import type { SiteContent } from '@/lib/site-content';

type MediaItem = { id: string; filename: string; contentType: string; size: number; objectKey: string; createdAt: string; createdBy: string; url?: string };
type Tool = 'browse' | 'text' | 'media' | 'link';
type Selection = { kind: 'text' | 'image' | 'file' | 'link'; path: string; label: string; altPath?: string };
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const toolLabels: Record<Tool, string> = { browse: 'Navigieren', text: 'Text', media: 'Bilder & PDFs', link: 'Links' };
const seoKeyByPath: Record<string, keyof SiteContent['seo']> = { '/': 'home', '/menue/': 'menu', '/team/': 'team', '/kontakt/': 'contact', '/links/': 'links', '/impressum/': 'imprint' };

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function pathParts(path: string): Array<string | number> { return path.split('.').map((part) => /^\d+$/.test(part) ? Number(part) : part); }
function readPath(root: unknown, path: string): unknown {
  return pathParts(path).reduce<unknown>((value, key) => value == null ? undefined : (value as Record<string | number, unknown>)[key], root);
}
function writePath<T>(root: T, path: string, value: unknown): T {
  const next = clone(root); const parts = pathParts(path); let target: unknown = next;
  for (const key of parts.slice(0, -1)) target = (target as Record<string | number, unknown>)[key];
  (target as Record<string | number, unknown>)[parts.at(-1)!] = value;
  return next;
}

export function VisualSiteEditor({ initialContent, initialMedia, user }: { initialContent: SiteContent; initialMedia: MediaItem[]; user: AdminIdentity }) {
  const [content, setContent] = useState(initialContent);
  const contentRef = useRef(content);
  const committedRef = useRef(initialContent);
  const [media, setMedia] = useState(initialMedia.map((item) => ({ ...item, url: `/media-file/${item.id}` })));
  const [tool, setTool] = useState<Tool>('browse');
  const toolRef = useRef<Tool>('browse');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [draft, setDraft] = useState('');
  const [altDraft, setAltDraft] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('Navigieren ist aktiv. Wähle ein Werkzeug, um Inhalte anzuklicken.');
  const [currentPath, setCurrentPath] = useState('/');
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => {
    toolRef.current = tool;
    const root = frameRef.current?.contentDocument?.documentElement;
    if (root) root.dataset.cmsTool = tool;
    setStatus(tool === 'browse' ? 'Links und Navigation funktionieren normal.' : `${toolLabels[tool]}-Werkzeug aktiv: gewünschten Inhalt anklicken.`);
  }, [tool]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      try {
        const path = frameRef.current?.contentWindow?.location.pathname;
        if (path) setCurrentPath((current) => current === path ? current : path);
      } catch { /* The preview is always same-origin; ignore transient navigation states. */ }
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  function connectPreview() {
    const frame = frameRef.current; const doc = frame?.contentDocument;
    if (!frame || !doc) return;
    setCurrentPath(frame.contentWindow?.location.pathname || '/');
    doc.documentElement.dataset.cmsTool = toolRef.current;
    let style = doc.getElementById('mec-visual-editor-style') as HTMLStyleElement | null;
    if (!style) { style = doc.createElement('style'); style.id = 'mec-visual-editor-style'; doc.head.append(style); }
    style.textContent = `
      html[data-cms-tool="text"] [data-cms-text],
      html[data-cms-tool="media"] [data-cms-image], html[data-cms-tool="media"] [data-cms-file],
      html[data-cms-tool="link"] [data-cms-link] { cursor: pointer !important; outline: 1px dashed rgba(222,44,31,.48); outline-offset: 4px; transition: outline-color 140ms ease, box-shadow 140ms ease; }
      html[data-cms-tool="text"] [data-cms-text]:hover,
      html[data-cms-tool="media"] [data-cms-image]:hover, html[data-cms-tool="media"] [data-cms-file]:hover,
      html[data-cms-tool="link"] [data-cms-link]:hover { outline: 3px solid #ef3b2d; outline-offset: 4px; box-shadow: 0 0 0 7px rgba(239,59,45,.16); }
      html[data-cms-tool]:not([data-cms-tool="browse"]) body { padding-bottom: 54px; }
      html[data-cms-tool]:not([data-cms-tool="browse"]) body::after { content: 'Bearbeitungsmodus · ' attr(data-cms-tool); position: fixed; z-index: 2147483647; right: 14px; bottom: 14px; padding: 8px 12px; border-radius: 999px; color: white; background: #111; font: 700 11px/1 system-ui; letter-spacing: .08em; text-transform: uppercase; pointer-events: none; }
    `;
    const click = (event: MouseEvent) => {
      const activeTool = toolRef.current;
      if (activeTool === 'browse') return;
      const target = event.target as Element | null;
      if (!target || typeof target.closest !== 'function') return;
      const selector = activeTool === 'text' ? '[data-cms-text]' : activeTool === 'media' ? '[data-cms-image],[data-cms-file]' : '[data-cms-link]';
      const editable = target.closest<HTMLElement>(selector);
      if (!editable) return;
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
      const path = editable.dataset.cmsText || editable.dataset.cmsImage || editable.dataset.cmsFile || editable.dataset.cmsLink;
      if (!path) return;
      const kind = editable.dataset.cmsImage ? 'image' : editable.dataset.cmsFile ? 'file' : editable.dataset.cmsLink ? 'link' : 'text';
      const nextSelection: Selection = { kind, path, label: editable.dataset.cmsLabel || editable.textContent?.trim().slice(0, 80) || 'Inhalt', altPath: editable.dataset.cmsAlt };
      setSelection(nextSelection);
      setDraft(String(readPath(contentRef.current, path) ?? ''));
      setAltDraft(nextSelection.altPath ? String(readPath(contentRef.current, nextSelection.altPath) ?? '') : '');
    };
    doc.addEventListener('click', click, true);
  }

  async function persist(next: SiteContent, success = 'Gespeichert und sofort veröffentlicht.') {
    setSaving(true); setStatus('Änderungen werden veröffentlicht …');
    try {
      const response = await fetch('/api/pflege/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(next) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Speichern fehlgeschlagen');
      setContent(next); contentRef.current = next; committedRef.current = next; setStatus(success); setSelection(null); setSettingsOpen(false);
      frameRef.current?.contentWindow?.location.reload();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Speichern fehlgeschlagen'); }
    finally { setSaving(false); }
  }

  async function saveSelection() {
    if (!selection) return;
    let next = writePath(contentRef.current, selection.path, draft);
    if (selection.altPath) next = writePath(next, selection.altPath, altDraft);
    await persist(next);
  }

  async function upload(file: File, useForSelection = true) {
    setUploading(true); setStatus(`${file.name} wird hochgeladen …`);
    try {
      const form = new FormData(); form.set('file', file);
      const response = await fetch('/api/pflege/media', { method: 'POST', body: form });
      const result = await response.json() as MediaItem & { error?: string; url?: string };
      if (!response.ok) throw new Error(result.error || 'Upload fehlgeschlagen');
      const item = { ...result, url: result.url || `/media-file/${result.id}` };
      setMedia((items) => [...items, item]);
      if (useForSelection) setDraft(item.url);
      setStatus(`${file.name} wurde hochgeladen${useForSelection ? ' und ausgewählt' : ''}.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Upload fehlgeschlagen'); }
    finally { setUploading(false); }
  }

  async function deleteMedia(item: MediaItem) {
    if (!window.confirm(`„${item.filename}“ wirklich löschen?`)) return;
    const response = await fetch(`/api/pflege/media/${item.id}`, { method: 'DELETE' });
    if (response.ok) { setMedia((items) => items.filter((entry) => entry.id !== item.id)); setStatus(`${item.filename} wurde gelöscht.`); }
    else setStatus('Datei konnte nicht gelöscht werden.');
  }

  const currentSeoKey = seoKeyByPath[currentPath] || 'home';

  return <div className="visual-editor">
    <header className="visual-toolbar">
      <div className="visual-toolbar__brand"><img src={content.global.logo} alt="" /><div><strong>Website-Pflege</strong><span>{currentPath}</span></div></div>
      <div className="visual-tools" role="group" aria-label="Bearbeitungswerkzeuge">
        <ToolButton active={tool === 'browse'} label="Navigieren" onClick={() => setTool('browse')}><MousePointer2 /></ToolButton>
        <ToolButton active={tool === 'text'} label="Text" onClick={() => setTool('text')}><Type /></ToolButton>
        <ToolButton active={tool === 'media'} label="Bilder & PDFs" onClick={() => setTool('media')}><ImageIcon /></ToolButton>
        <ToolButton active={tool === 'link'} label="Links" onClick={() => setTool('link')}><Link2 /></ToolButton>
      </div>
      <div className="visual-toolbar__actions">
        <button type="button" onClick={() => setLibraryOpen(true)} title="Medienbibliothek"><FileText /><span>Medien</span></button>
        <button type="button" onClick={() => setSettingsOpen(true)} title="Seiteneinstellungen"><Settings2 /><span>Seite</span></button>
        <button type="button" onClick={() => frameRef.current?.contentWindow?.location.reload()} title="Vorschau neu laden"><RefreshCw /><span>Neu laden</span></button>
        <a href={currentPath} target="_blank" rel="noreferrer" title="Öffentliche Seite öffnen"><ExternalLink /><span>Öffnen</span></a>
        <form action="/api/pflege/logout" method="post"><button type="submit" title={`Abmelden (${user.name})`}><LogOut /><span>Abmelden</span></button></form>
      </div>
    </header>
    <div className="visual-stage"><iframe ref={frameRef} src="/" title="Live-Vorschau der Website" onLoad={connectPreview} /></div>
    <output className="visual-status" aria-live="polite">{saving && <Loader2 className="spin" />}{status}</output>

    {selection && <EditorPanel title={selection.label} eyebrow={selection.kind === 'text' ? 'Text bearbeiten' : selection.kind === 'link' ? 'Link bearbeiten' : selection.kind === 'file' ? 'PDF bearbeiten' : 'Bild bearbeiten'} onClose={() => setSelection(null)}>
      {selection.kind === 'text' ? <label className="visual-field"><span>Inhalt</span><textarea autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} rows={Math.min(12, Math.max(3, draft.split('\n').length + 2))} /></label> : <>
        <label className="visual-field"><span>{selection.kind === 'link' ? 'Linkziel' : selection.kind === 'file' ? 'PDF-URL' : 'Bild-URL'}</span><input value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
        {selection.altPath && <label className="visual-field"><span>Bildbeschreibung</span><textarea value={altDraft} onChange={(event) => setAltDraft(event.target.value)} rows={3} /></label>}
        {(selection.kind === 'image' || selection.kind === 'file') && <><label className="visual-upload"><Upload />{uploading ? 'Upload läuft …' : selection.kind === 'file' ? 'Neues PDF hochladen' : 'Neues Bild hochladen'}<input type="file" disabled={uploading} accept={selection.kind === 'file' ? 'application/pdf' : 'image/jpeg,image/png,image/webp,image/avif'} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ''; }} /></label><MediaPicker items={media.filter((item) => selection.kind === 'file' ? item.contentType === 'application/pdf' : item.contentType.startsWith('image/'))} onPick={(item) => setDraft(item.url || `/media-file/${item.id}`)} selected={draft} /></>}
      </>}
      <div className="visual-panel__footer"><button className="visual-secondary" type="button" onClick={() => setSelection(null)}>Abbrechen</button><button className="visual-primary" type="button" disabled={saving} onClick={() => void saveSelection()}>{saving ? <Loader2 className="spin" /> : <Save />} Speichern & veröffentlichen</button></div>
    </EditorPanel>}

    {settingsOpen && <EditorPanel title="Seiteneinstellungen" eyebrow={currentPath} onClose={() => setSettingsOpen(false)} wide>
      <h3>SEO & Teilen</h3>
      <label className="visual-field"><span>SEO-Titel</span><input value={content.seo[currentSeoKey].title} onChange={(event) => setContent(writePath(content, `seo.${currentSeoKey}.title`, event.target.value))} /></label>
      <label className="visual-field"><span>Meta-Beschreibung</span><textarea rows={4} value={content.seo[currentSeoKey].description} onChange={(event) => setContent(writePath(content, `seo.${currentSeoKey}.description`, event.target.value))} /></label>
      <label className="visual-field"><span>Social-Preview-Bild</span><input value={content.seo[currentSeoKey].image} onChange={(event) => setContent(writePath(content, `seo.${currentSeoKey}.image`, event.target.value))} /></label>
      <CollectionSettings content={content} currentPath={currentPath} onChange={setContent} />
      <div className="visual-panel__footer"><button className="visual-secondary" type="button" onClick={() => { setContent(committedRef.current); contentRef.current = committedRef.current; setSettingsOpen(false); }}>Abbrechen</button><button className="visual-primary" type="button" disabled={saving} onClick={() => void persist(content)}>{saving ? <Loader2 className="spin" /> : <Save />} Speichern & veröffentlichen</button></div>
    </EditorPanel>}

    {libraryOpen && <EditorPanel title="Medienbibliothek" eyebrow="Bilder und PDFs" onClose={() => setLibraryOpen(false)} wide>
      <label className="visual-upload visual-upload--large"><Upload />{uploading ? 'Upload läuft …' : 'Bild oder PDF hochladen'}<small>JPG, PNG, WebP, AVIF oder PDF · maximal 20 MB</small><input type="file" disabled={uploading} accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, false); event.target.value = ''; }} /></label>
      <div className="visual-library">{media.map((item) => <article key={item.id}>{item.contentType.startsWith('image/') ? <img src={item.url} alt="" /> : <FileText />}<div><strong>{item.filename}</strong><span>{Math.round(item.size / 1024)} KB</span></div><button type="button" onClick={() => void navigator.clipboard.writeText(item.url || `/media-file/${item.id}`)}>URL kopieren</button><button className="danger" type="button" onClick={() => void deleteMedia(item)}>Löschen</button></article>)}</div>
    </EditorPanel>}
  </div>;
}

function ToolButton({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={active ? 'is-active' : ''} aria-pressed={active} onClick={onClick}>{children}<span>{label}</span></button>;
}

function EditorPanel({ title, eyebrow, onClose, wide = false, children }: { title: string; eyebrow: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  return <aside className={`visual-panel${wide ? ' visual-panel--wide' : ''}`} aria-label={title}><header><div><span>{eyebrow}</span><h2>{title}</h2></div><button type="button" onClick={onClose} aria-label="Schliessen"><X /></button></header><div className="visual-panel__body">{children}</div></aside>;
}

function MediaPicker({ items, onPick, selected }: { items: MediaItem[]; onPick: (item: MediaItem) => void; selected: string }) {
  if (!items.length) return null;
  return <div className="visual-picker">{items.map((item) => { const url = item.url || `/media-file/${item.id}`; return <button type="button" key={item.id} className={selected === url ? 'is-selected' : ''} onClick={() => onPick(item)}>{item.contentType.startsWith('image/') ? <img src={url} alt="" /> : <FileText />}<span>{item.filename}</span></button>; })}</div>;
}

function CollectionSettings({ content, currentPath, onChange }: { content: SiteContent; currentPath: string; onChange: (next: SiteContent) => void }) {
  const collections: Array<{ title: string; path: string; labels: string[]; template: JsonValue }> = [
    { title: 'Navigation', path: 'global.navigation', labels: content.global.navigation.map((item) => item.label || 'Neuer Link'), template: { label: 'Neuer Link', href: '/' } },
    { title: 'Öffnungszeiten', path: 'global.openingTimes', labels: content.global.openingTimes, template: 'Neue Öffnungszeit' },
  ];
  if (currentPath === '/') collections.push({ title: 'Willkommen-Absätze', path: 'home.welcomeParagraphs', labels: content.home.welcomeParagraphs, template: 'Neuer Absatz' });
  if (currentPath === '/menue/') { collections.push({ title: 'Menü-Absätze', path: 'menu.introParagraphs', labels: content.menu.introParagraphs, template: 'Neuer Absatz' }); collections.push({ title: 'Galeriebilder', path: 'menu.gallery', labels: content.menu.gallery.map((item) => item.alt || item.src), template: { src: content.home.heroImage, alt: 'Neues Galeriebild' } }); }
  if (currentPath === '/team/') collections.push({ title: 'Teammitglieder', path: 'team.members', labels: content.team.members.map((item) => item.name), template: { name: 'Neues Teammitglied', description: 'Beschreibung ergänzen', image: content.team.heroImage, alt: 'Neues Teammitglied' } });
  if (currentPath === '/kontakt/') collections.push({ title: 'Kontakt-Absätze', path: 'contact.paragraphs', labels: content.contact.paragraphs, template: 'Neuer Absatz' });
  if (currentPath === '/links/') collections.push({ title: 'Lieferanten & Links', path: 'links.items', labels: content.links.items.map((item) => item.label), template: { intro: 'Unser Partner:', label: 'Neuer Link', href: 'https://' } });
  return <div className="visual-collections"><h3>Elemente auf dieser Seite</h3>{collections.map((collection) => { const items = readPath(content, collection.path) as JsonValue[]; return <section key={collection.path}><div><strong>{collection.title}</strong><button type="button" onClick={() => onChange(writePath(content, collection.path, [...items, clone(collection.template)]))}>Hinzufügen</button></div>{collection.labels.map((label, index) => <article key={`${collection.path}-${index}`}><span>{String(label).slice(0, 90)}</span><button type="button" disabled={items.length <= 1} onClick={() => onChange(writePath(content, collection.path, items.filter((_, itemIndex) => itemIndex !== index)))}>Entfernen</button></article>)}</section>; })}</div>;
}
