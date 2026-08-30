# Sicherheit

## Verwaltungszugriff

`/pflege` und `/api/pflege/*` treffen keine Autorisierungsentscheidung im Browser. Die Anwendung akzeptiert ausschliesslich eine von Cloudflare Access verifizierte E-Mail oder eine Sites-Identität, deren E-Mail in `ADMIN_EMAILS` enthalten ist. Die lokale `@sites.test`-Identität wird nur von der lokalen Sites-Laufzeit erzeugt.

Für die Produktionsdomain müssen beide Pfadmuster durch eine Cloudflare-Access-Allow-Policy auf die Betreiber beschränkt werden:

- `/pflege*`
- `/api/pflege/*`

Die Policy ist default-deny. Änderungen an der Betreibergruppe werden in Cloudflare Access vorgenommen, nicht im Browser-Code.

## Daten und Uploads

- Inhalte liegen in D1; Dateien liegen in R2.
- Uploads sind auf JPG, PNG, WebP, AVIF und PDF sowie 20 MB begrenzt.
- R2-Objektnamen werden serverseitig erzeugt; Client-Pfade werden nicht vertraut.
- Secrets gehören nicht in Git. Laufzeitwerte werden über das Hosting-Control-Plane bzw. Cloudflare konfiguriert.
