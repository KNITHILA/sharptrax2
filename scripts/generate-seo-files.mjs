// Runs after prerender. Writes dist/sitemap.xml and dist/robots.txt.
// Slugs are read from src/data/servicesCatalog.ts (single source of truth).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function loadSiteUrl() {
  let value = (process.env.VITE_SITE_URL || "").trim();
  if (!value) {
    for (const f of [".env.production.local", ".env.production", ".env"]) {
      const p = path.join(ROOT, f);
      if (!fs.existsSync(p)) continue;
      const m = fs
        .readFileSync(p, "utf8")
        .match(/^\s*VITE_SITE_URL\s*=\s*(.*)$/m);
      if (m) {
        value = m[1].trim().replace(/^["']|["']$/g, "");
        if (value) break;
      }
    }
  }
  if (!value) fail("VITE_SITE_URL is missing (.env.production).");
  if (!/^https?:\/\//i.test(value)) fail(`VITE_SITE_URL must start with http(s)://, got "${value}".`);
  return value.replace(/\/+$/, "");
}

function loadSlugs() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/servicesCatalog.ts"), "utf8");
  const slugs = [...src.matchAll(/^\s*slug:\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"/gm)].map((m) => m[1]);
  if (slugs.length !== 26) fail(`Expected 26 slugs in the catalog, found ${slugs.length}.`);
  if (new Set(slugs).size !== slugs.length) fail("Duplicate slugs in the catalog.");
  return slugs;
}

const SITE_URL = loadSiteUrl();
const slugs = loadSlugs();

if (!fs.existsSync(DIST)) fail("dist/ not found. Run vite build and prerender first.");
for (const s of slugs) {
  if (!fs.existsSync(path.join(DIST, "services", s, "index.html"))) {
    fail(`Missing prerendered page for "${s}". Run the prerender step first.`);
  }
}

const pages = ["/", "/about-us", "/industries", "/gallery", "/contact", "/location"];
const urls = [
  ...pages.map((p) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`)),
  ...slugs.map((s) => `${SITE_URL}/services/${s}`),
];
// /services is intentionally excluded: it canonicalises to /services/robotic-automation.

const lastmod = new Date().toISOString().slice(0, 10);
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => `  <url>\n    <loc>${esc(u)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join("\n") +
  `\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

// Overwrites anything copied from public/ (generated files win).
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(DIST, "robots.txt"), robots, "utf8");

if (urls.length !== 32) fail(`Sitemap should have 32 URLs, has ${urls.length}.`);
console.log(`ok:   sitemap.xml written (${urls.length} URLs, lastmod ${lastmod})`);
console.log(`ok:   robots.txt written (Sitemap: ${SITE_URL}/sitemap.xml)`);
console.log("generate-seo-files DONE");