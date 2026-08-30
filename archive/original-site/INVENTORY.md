# Bestandsaufnahme mec-roland.ch

Erfasst am 30. August 2026. Dieses Archiv hält den öffentlich erreichbaren Stand der bestehenden WordPress-Website vor dem Redesign fest.

## Gesicherte Routen

- `/` – Restaurant / Startseite
- `/menue/` – Menü, Bildergalerie und Speisekarten-PDF
- `/team/` – Teambild sowie fünf Teamprofile
- `/kontakt/` – Anlassinformationen, Kapazitäten und Adresse
- `/links/` – zwei regionale Lieferantenlinks
- `/impressum/` – Kontaktadresse und Impressumsangaben
- `/beispiel-seite/` – veröffentlichte WordPress-Beispielseite; in der neuen Website auf `/` weitergeleitet

Die WordPress-Sitemap, Robots-Datei, REST-Daten und vollständigen gerenderten HTML-Antworten liegen neben diesem Dokument.

## Zentrale Fakten

- Betrieb: Mec Roland GmbH
- Claim: Das Restaurant mit Herz
- Adresse: Wildbrunnstrasse 2, 8722 Kaltbrunn
- Telefon: 055 283 49 19 (`+41552834919`)
- Öffentliche E-Mail im Kopfbereich: `mecroland@hotmail.com`
- E-Mail im Impressum: `info@mec-roland.ch`
- Öffnungszeiten: Mi. – So. 11.00 – 14.00 / 17.00 – 21.00 Uhr; Mo. und Di. geschlossen
- Vorbestellung: mindestens eine Stunde vorher
- Google-Maps-Link: `https://goo.gl/maps/GGknfabJr5XtHkQ17`
- Lieferantenlinks: Metzgerei Jud Uznach und Kistler Gemüse Benken

## Gestaltung

- Markenfarben: Rot `#d30000`, Schwarz `#000000` / `#0a0a0a`, Weiss `#ffffff`
- Überschriften und Navigation: Baloo
- Fliesstext: Source Sans Pro
- Grundlayout: schwarzer Seitenhintergrund, zentrierter weisser Inhaltskasten, roter Kontaktbalken, Burger-Hero, rote Meldungsbox
- Wort-/Bildmarke: `Mec-Roland-Weiss-breit.png`
- Wiederkehrende Elemente: Burger-Hero, Meldung „Aktuell“, Öffnungszeiten, Kartenbild und dunkler Footer

## Inhalte und Medien

- `pages.json` enthält alle sieben WordPress-Seitendatensätze inklusive Original-Builder-Inhalten.
- `html/` enthält die sechs tatsächlich genutzten Seiten als vollständige HTML-Antworten.
- `media-page-1.json` enthält alle 43 WordPress-Medienobjekte samt Metadaten.
- `media/` enthält alle 43 Originaldateien: Logos, Hero- und Teamfotos, Portraits, Speisenbilder, historische Kampagnenbilder und sechs PDF-Speisekarten.
- `media-inventory.tsv` listet ID, Datum, Slug, MIME-Typ und Original-URL jedes Medienobjekts.
- `theme/` enthält die erreichbaren CSS-, JavaScript- und WOFF2-Dateien der visuellen WordPress/Divi-Ausgabe.
- `discovered-urls.txt` enthält sämtliche aus den Seiten entdeckten internen und externen URLs.

## Inhaltliche Auffälligkeiten

- Die Menüseite enthält zusätzlich den älteren Satz „Montag Ruhetag“, während der globale Öffnungszeitenblock Montag und Dienstag als geschlossen ausweist. Beide sichtbaren Originalangaben wurden ohne erfundene Korrektur übernommen und sind im CMS separat änderbar.
- Das WordPress-REST-Feld des Impressums enthält ältere Builder-Daten; massgeblich für das Redesign war die aktuell gerenderte öffentliche HTML-Seite.
- Das Teamprofil nennt „Rosa Castro“, während die ursprüngliche Bilddatei „Rosa-de-Pinto“ heisst. Sichtbarer Name und Originalbild wurden unverändert zugeordnet.
