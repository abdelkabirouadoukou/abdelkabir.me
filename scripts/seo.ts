/**
 * Generates the crawler-facing files from src/lib/site.ts so they can never drift
 * from the real metadata:  public/sitemap.xml · public/robots.txt · public/.well-known/security.txt
 *
 * Runs automatically before `build` / `vercel-build` (see package.json) or by hand: `bun run seo`.
 * <lastmod> is the date of the last git commit (falls back to today), so it only
 * changes when the site actually does.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SITE, absolute } from "../src/lib/site";

const root = join(import.meta.dir, "..");
const out = (rel: string, body: string) => {
  const file = join(root, "public", rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
  console.log(`[seo] wrote public/${rel}`);
};

const today = new Date().toISOString().slice(0, 10);
const lastmod = (() => {
  try {
    const r = Bun.spawnSync(["git", "log", "-1", "--format=%cs"], { cwd: root });
    const d = r.stdout.toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : today;
  } catch {
    return today;
  }
})();

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- sitemap.xml: one page, plus its share image ---- */
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${x(absolute("/"))}</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${x(absolute(SITE.ogImage))}</image:loc>
      <image:title>${x(SITE.name)}</image:title>
      <image:caption>${x(SITE.ogImageAlt)}</image:caption>
    </image:image>
  </url>
</urlset>
`,
);

/* ---- robots.txt ---- */
out(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${absolute("/sitemap.xml")}
`,
);

/* ---- security.txt (RFC 9116): must expire within a year, so refresh it every build ---- */
const expires = new Date(Date.now() + 330 * 24 * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, ".000Z");
out(
  ".well-known/security.txt",
  `Contact: mailto:${SITE.email}
Expires: ${expires}
Preferred-Languages: en
Canonical: ${absolute("/.well-known/security.txt")}
`,
);
