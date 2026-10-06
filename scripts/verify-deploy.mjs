// Usage:
//   npm run verify:deploy -- https://staging.example.com
//   npm run verify:deploy -- https://www.sharptraxtechnologies.com
//   npm run verify:deploy -- http://localhost:4173 --local   (skips slash-redirect checks; vite preview doesn't do them)
// Optional: --site=https://www.sharptraxtechnologies.com  (expected canonical origin; defaults to VITE_SITE_URL)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//i.test(a)) || "").replace(/\/+$/, "");
const LOCAL = args.includes("--local");

if (!base) {
  console.error("Usage: npm run verify:deploy -- <base-url> [--local] [--site=<canonical origin>]");
  process.exit(1);
}

function loadSiteUrl() {
  const flag = args.find((a) => a.startsWith("--site="));
  if (flag) return flag.slice(7).replace(/\/+$/, "");
  let value = (process.env.VITE_SITE_URL || "").trim();
  if (!value) {
    for (const f of [".env.production.local", ".env.production", ".env"]) {
      const p = path.join(ROOT, f);
      if (!fs.existsSync(p)) continue;
      const m = fs.readFileSync(p, "utf8").match(/^\s*VITE_SITE_URL\s*=\s*(.*)$/m);
      if (m) {
        value = m[1].trim().replace(/^["']|["']$/g, "");
        if (value) break;
      }
    }
  }
  if (!value) {
    console.error("FAIL: VITE_SITE_URL missing; pass --site=<origin>.");
    process.exit(1);
  }
  return value.replace(/\/+$/, "");
}

const SITE = loadSiteUrl();
const catalog = fs.readFileSync(path.join(ROOT, "src/data/servicesCatalog.ts"), "utf8");
const slugs = [...catalog.matchAll(/^\s*slug:\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"/gm)].map((m) => m[1]);
if (slugs.length !== 26) {
  console.error(`FAIL: expected 26 slugs, found ${slugs.length}`);
  process.exit(1);
}

let failures = 0;
let warnings = 0;
const ok = (m) => console.log(`ok:   ${m}`);
const bad = (m) => { failures++; console.log(`FAIL: ${m}`); };
const warn = (m) => { warnings++; console.log(`warn: ${m}`); };

async function get(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    const body = res.status >= 300 && res.status < 400 ? "" : await res.text();
    return { status: res.status, headers: res.headers, body };
  } catch (e) {
    return { status: 0, headers: new Headers(), body: "", error: String(e) };
  }
}

function locationPath(res, from) {
  const loc = res.headers.get("location");
  if (!loc) return null;
  try { return new URL(loc, from).pathname; } catch { return null; }
}

const canonicalOf = (html) =>
  (html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "").match(/href=["']([^"']+)["']/i)?.[1] || null;

async function checkMachine(slug) {
  const url = `${base}/services/${slug}`;
  const r = await get(url);
  const expected = `${SITE}/services/${slug}`;
  const problems = [];
  if (r.status !== 200) problems.push(`status ${r.status}`);
  else {
    const canon = canonicalOf(r.body);
    if (canon !== expected) problems.push(`canonical "${canon}" != "${expected}"`);
    if (!/<h1[\s>]/i.test(r.body)) problems.push("no <h1> in HTML (not prerendered?)");
    if (!/application\/ld\+json/i.test(r.body)) problems.push("no JSON-LD");
    if (!new RegExp(`property=["']og:url["'][^>]*content=["']${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(r.body)
        && !r.body.includes(expected)) problems.push("og:url missing");
  }
  problems.length ? bad(`/services/${slug}: ${problems.join("; ")}`) : ok(`/services/${slug}`);
}

async function checkSlash(slug) {
  const url = `${base}/services/${slug}/`;
  const r = await get(url);
  const to = locationPath(r, url);
  if (r.status === 301 && to === `/services/${slug}`) ok(`/services/${slug}/ -> 301 /services/${slug}`);
  else bad(`/services/${slug}/ expected 301 -> /services/${slug}, got ${r.status}${to ? ` -> ${to}` : ""}`);
}

async function main() {
  console.log(`Checking ${base} (expected canonical origin: ${SITE})${LOCAL ? " [local mode]" : ""}\n`);

  // /services (first machine, canonical -> robotic-automation)
  {
    const r = await get(`${base}/services`);
    const canon = canonicalOf(r.body);
    r.status === 200 && canon === `${SITE}/services/robotic-automation`
      ? ok("/services (canonical -> /services/robotic-automation)")
      : bad(`/services: status ${r.status}, canonical "${canon}"`);
  }

  // 26 machine pages
  for (const s of slugs) await checkMachine(s);

  // Slash variants
  if (LOCAL) {
    warn("slash-variant redirects skipped (--local)");
  } else {
    for (const s of slugs) await checkSlash(s);
    const r = await get(`${base}/services/`);
    const to = locationPath(r, `${base}/services/`);
    if (r.status === 301 && to === "/services") ok("/services/ -> 301 /services");
    else if (r.status === 200) warn("/services/ serves 200 (no redirect); its canonical covers it");
    else bad(`/services/ unexpected status ${r.status}`);
  }

  // Legacy URL: server can't redirect; SPA shell must load so the client redirect runs
  {
    const url = `${base}/services?cat=welding-automation&prod=Welding%20Rotator`;
    const r = await get(url);
    r.status === 200 && /id=["']root["']/.test(r.body) && /\/assets\/.+\.js/.test(r.body)
      ? ok("legacy ?cat=&prod= URL loads the app shell (client redirect handles it)")
      : bad(`legacy URL: status ${r.status}, app shell missing`);
  }

  // Bogus slug: SPA fallback, must not claim a machine canonical
  {
    const r = await get(`${base}/services/definitely-not-a-machine`);
    const canon = canonicalOf(r.body);
    r.status === 200 && /id=["']root["']/.test(r.body) && !(canon || "").includes("definitely-not-a-machine")
      ? ok("bogus slug falls back to the SPA shell (client redirects to /services)")
      : bad(`bogus slug: status ${r.status}, canonical "${canon}"`);
  }

  // sitemap.xml
  {
    const r = await get(`${base}/sitemap.xml`);
    if (r.status !== 200) bad(`/sitemap.xml status ${r.status}`);
    else {
      const locs = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const issues = [];
      if (!/<urlset/.test(r.body)) issues.push("not a urlset");
      if (locs.length !== 32) issues.push(`${locs.length} URLs (expected 32)`);
      if (locs.some((l) => !l.startsWith(SITE))) issues.push(`URL outside ${SITE}`);
      if (locs.includes(`${SITE}/services`)) issues.push("/services must not be listed");
      for (const s of slugs) if (!locs.includes(`${SITE}/services/${s}`)) { issues.push(`missing ${s}`); break; }
      issues.length ? bad(`/sitemap.xml: ${issues.join("; ")}`) : ok("/sitemap.xml (32 URLs)");
    }
  }

  // robots.txt
  {
    const r = await get(`${base}/robots.txt`);
    r.status === 200 && /User-agent:\s*\*/i.test(r.body) && /Allow:\s*\//i.test(r.body) &&
    r.body.includes(`Sitemap: ${SITE}/sitemap.xml`)
      ? ok("/robots.txt")
      : bad(`/robots.txt: status ${r.status} or content wrong`);
  }

  console.log(`\n${failures ? "verify:deploy FAILED" : "verify:deploy PASSED"} (${failures} failures, ${warnings} warnings)`);
  process.exit(failures ? 1 : 0);
}

main();