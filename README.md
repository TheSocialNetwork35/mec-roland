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

Die lokale Umgebung stellt D1 und R2 bereit. Öffentliche Routen bleiben frei; `/pflege` und die Schreib-API prüfen eine signierte, `HttpOnly`-geschützte Sitzung serverseitig. Für den lokalen Login müssen `ADMIN_PASSWORD_HASH` und `ADMIN_SESSION_SECRET` gesetzt sein (siehe `.env.example`).

## Produktion

Der Build erzeugt Cloudflare-kompatibles ESM mit statischen Assets, D1-Migration und R2-Binding:

```bash
npm run build
```

Erforderliche Bindings:

- D1: `DB`
- R2: `FILES`
- Secret: `ADMIN_PASSWORD_HASH` im Format `pbkdf2_sha256:210000:SALT:HASH`
- Secret: `ADMIN_SESSION_SECRET` als zufälliger Wert mit mindestens 32 Bytes

Das Pflege-Passwort wird nie im Repository gespeichert. Die Anwendung vergleicht ausschliesslich den PBKDF2-SHA-256-Hash, begrenzt Fehlversuche pro Client und setzt nach erfolgreicher Anmeldung eine signierte Sitzung für zwölf Stunden. Beide Werte werden in Cloudflare als verschlüsselte Secrets konfiguriert.

## Qualitätsprüfung

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Die Sitemap liegt unter `/sitemap.xml`, Robots-Regeln unter `/robots.txt`, das Web-App-Manifest unter `/manifest.webmanifest`.
