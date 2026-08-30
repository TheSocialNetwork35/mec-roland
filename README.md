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

Die lokale Umgebung stellt D1 und R2 bereit. Öffentliche Routen bleiben frei; `/pflege` und die Schreib-API prüfen eine zufällige, `HttpOnly`-geschützte Sitzung serverseitig in D1. `ADMIN_PASSWORD_HASH` kann optional gesetzt werden (siehe `.env.example`).

## Produktion

Der Build erzeugt Cloudflare-kompatibles ESM mit statischen Assets, D1-Migration und R2-Binding:

```bash
npm run build
```

Erforderliche Bindings:

- D1: `DB`
- R2: `FILES`
- Secret: `ADMIN_PASSWORD_HASH` im Format `pbkdf2_sha256:210000:SALT:HASH`

Das Pflege-Passwort wird nie im Repository gespeichert. Die Anwendung vergleicht ausschliesslich einen konstantzeitlich geprüften Hash des zufällig erzeugten Hochentropie-Passworts, begrenzt Fehlversuche pro Client und legt nach erfolgreicher Anmeldung eine nicht erratbare Sitzung für zwölf Stunden in D1 an. Ein Cloudflare-Runtime-Wert kann den projektspezifischen Standard-Hash durch PBKDF2-SHA-256 ersetzen.

## Qualitätsprüfung

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Die Sitemap liegt unter `/sitemap.xml`, Robots-Regeln unter `/robots.txt`, das Web-App-Manifest unter `/manifest.webmanifest`.
