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

Die lokale Umgebung stellt D1 und R2 bereit. Öffentliche Routen bleiben frei; `/pflege` und die Schreib-API prüfen eine zufällige, `HttpOnly`-geschützte Sitzung serverseitig in D1. Für die lokale Anmeldung muss `ADMIN_PASSWORD_HASH` in einer ignorierten `.dev.vars` gesetzt werden (siehe `.dev.vars.example`).

## Produktion

Die Anwendung wird als Cloudflare Worker mit global ausgelieferten Static Assets betrieben. D1 speichert CMS-Daten und Sitzungen, R2 die hochgeladenen Bilder und PDFs.

```bash
npx wrangler d1 migrations apply mec-roland-db --remote
npx wrangler secret put ADMIN_PASSWORD_HASH
npm run deploy
```

Erforderliche Bindings:

- D1: `DB`
- R2: `FILES`
- Secret: `ADMIN_PASSWORD_HASH` im Format `pbkdf2_sha256:210000:SALT:HASH`
- Variable: `SITE_URL` als kanonische öffentliche Basis-URL für Metadata, Open Graph, Robots und Sitemap

Das Pflege-Passwort wird nie im Repository gespeichert. Ohne das Cloudflare-Secret bleibt die Anmeldung geschlossen. Die Anwendung vergleicht ausschliesslich einen konstantzeitlich geprüften Hash des Passworts, begrenzt Fehlversuche pro Client und legt nach erfolgreicher Anmeldung eine nicht erratbare Sitzung für zwölf Stunden in D1 an.

### Pflege-Passwort ändern

Das bestehende Klartext-Passwort kann nicht aus dem Hash ausgelesen werden. Zum Zurücksetzen wird lokal ein neuer PBKDF2-Hash erzeugt und anschliessend als Cloudflare-Secret gespeichert:

```bash
npm run auth:hash
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler d1 execute mec-roland-db --remote --command "DELETE FROM admin_sessions"
```

Der erste Befehl fragt das neue Passwort verdeckt zweimal ab und gibt ausschliesslich den Hash aus. Diesen Hash beim zweiten Befehl in die verdeckte Cloudflare-Eingabe einfügen. Der dritte Befehl meldet vorhandene Pflege-Sitzungen ab, damit nur noch das neue Passwort gilt.

## Qualitätsprüfung

```bash
npm run lint
npx tsc --noEmit
npm run deploy:check
```

Die Sitemap liegt unter `/sitemap.xml`, Robots-Regeln unter `/robots.txt`, das Web-App-Manifest unter `/manifest.webmanifest`.
