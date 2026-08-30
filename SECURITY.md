# Sicherheit

## Verwaltungszugriff

`/pflege` und `/api/pflege/*` treffen keine Autorisierungsentscheidung im Browser. Die Anwendung akzeptiert ausschliesslich ein zufälliges 256-Bit-Sitzungstoken, dessen SHA-256-Hash serverseitig in D1 vorliegt. Das Pflege-Passwort wird mit PBKDF2-SHA-256 (mindestens 100.000 Iterationen) geprüft und nie im Klartext gespeichert.

Nach fünf falschen Versuchen wird der Client für 15 Minuten gesperrt. Das Sitzungscookie ist `HttpOnly`, `Secure`, `SameSite=Strict`, auf die gesamte Anwendung begrenzt, wird beim Logout widerrufen und läuft nach zwölf Stunden ab. `ADMIN_PASSWORD_HASH` kann den projektspezifischen Standard-Hash als Cloudflare-Laufzeitwert ersetzen.

Für die Produktionsdomain müssen beide Pfadmuster durch eine Cloudflare-Access-Allow-Policy auf die Betreiber beschränkt werden:

- `/pflege*`
- `/api/pflege/*`

Die Policy ist default-deny. Änderungen an der Betreibergruppe werden in Cloudflare Access vorgenommen, nicht im Browser-Code.

## Daten und Uploads

- Inhalte liegen in D1; Dateien liegen in R2.
- Uploads sind auf JPG, PNG, WebP, AVIF und PDF sowie 20 MB begrenzt.
- R2-Objektnamen werden serverseitig erzeugt; Client-Pfade werden nicht vertraut.
- Secrets gehören nicht in Git. Laufzeitwerte werden über das Hosting-Control-Plane bzw. Cloudflare konfiguriert.
