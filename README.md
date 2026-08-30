# Mec Roland

Modernes Multi-Page-Redesign für das Restaurant Mec Roland in Kaltbrunn – mit vollständig bearbeitbaren Inhalten unter `/pflege`, D1-Inhaltsspeicher, R2-Medienablage und serverseitig geschützter Verwaltung.

## Projektstruktur

- `app/`, `components/`, `lib/` – produktive Website und CMS
- `archive/original-site/` – vollständige Bestandsaufnahme der bisherigen Website
- `scripts/` – reproduzierbare Inventarisierungshilfe

## Lokal starten

```bash
npm install
npm run dev
```

Die lokale Sites-Umgebung stellt D1, R2 und eine lokale Testidentität bereit. Öffentliche Routen bleiben frei; `/pflege` und die Schreib-API prüfen die Identität serverseitig.

## Produktion

Der Build erzeugt Cloudflare-kompatibles ESM mit statischen Assets, D1-Migration und R2-Binding:

```bash
npm run build
```

Erforderliche Bindings:

- D1: `DB`
- R2: `FILES`
- Laufzeitvariable: `ADMIN_EMAILS` als kommagetrennte Allowlist für die Sites-Anmeldung

Für die öffentliche Domain wird eine Cloudflare-Access-Anwendung für `mec-roland.ch/pflege*` und `mec-roland.ch/api/pflege/*` mit einer Allow-Policy für die Betreiber eingerichtet. Cloudflare Access liefert die verifizierte E-Mail an die Anwendung; ohne Access- oder erlaubte Sites-Identität bleibt der Verwaltungsbereich geschlossen.

## Qualitätsprüfung

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Die Sitemap liegt unter `/sitemap.xml`, Robots-Regeln unter `/robots.txt`, das Web-App-Manifest unter `/manifest.webmanifest`.
