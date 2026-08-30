import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const htmlDir = new URL("../archive/original-site/html/", import.meta.url);
const files = (await readdir(htmlDir)).filter((file) => file.endsWith(".html"));
const records = [];
const urls = new Set();

for (const file of files) {
  const html = await readFile(new URL(file, htmlDir), "utf8");
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    urls.add(match[1]);
  }
  const stylesheets = [...html.matchAll(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]+href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const bodyClass = html.match(/<body[^>]+class=["']([^"']*)["']/i)?.[1] ?? "";
  records.push({ file: basename(file), title, bodyClass, stylesheets });
}

await writeFile(new URL("../archive/original-site/discovered-urls.txt", import.meta.url), `${[...urls].sort((a, b) => a.localeCompare(b)).join("\n")}\n`);
await writeFile(new URL("../archive/original-site/html-inventory.json", import.meta.url), `${JSON.stringify(records, null, 2)}\n`);
