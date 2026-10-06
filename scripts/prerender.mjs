// Post-build prerender: snapshots /services + the 26 machine routes into static HTML.
// Run after `vite build`:  node scripts/prerender.mjs
import http from "node:http";
import fs from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const IS_VERCEL = !!process.env.VERCEL;

function fail(msg) {
  console.error(`\nprerender FAILED: ${msg}`);
  process.exit(1);
}

/* ---------- preconditions ---------- */
if (!existsSync(path.join(DIST, "index.html"))) {
  fail("dist/index.html not found. Run `vite build` first.");
}

const siteUrl = (loadEnv("production", ROOT, "VITE_").VITE_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
if (!/^https?:\/\/[^/\s]+/i.test(siteUrl)) {
  fail("VITE_SITE_URL is missing or invalid. Set it in .env.production (e.g. https://www.yourdomain.com).");
}
if (siteUrl.includes("your-domain")) {
  fail("VITE_SITE_URL is still the placeholder. Put your real production domain in .env.production.");
}

/* ---------- routes from the catalog (slug + name, in order) ---------- */
const catalogSrc = readFileSync(path.join(ROOT, "src/data/servicesCatalog.ts"), "utf8");
const products = [...catalogSrc.matchAll(/slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({
  slug: m[1],
  name: m[2],
}));
if (products.length !== 26) {
  fail(`expected 26 products in the catalog, found ${products.length}`);
}

const routes = [
  // /services shows the first machine; its canonical points at that machine's URL
  { route: "/services", out: path.join(DIST, "services", "index.html"), expected: products[0] },
  ...products.map((p) => ({
    route: `/services/${p.slug}`,
    out: path.join(DIST, "services", p.slug, "index.html"),
    expected: p,
  })),
];

/* ---------- tiny static server with SPA fallback ---------- */
// The fallback always serves the ORIGINAL index.html held in memory, so the
// prerendered files written during this run are never served back to the crawler.
const template = readFileSync(path.join(DIST, "index.html"));
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    const ext = path.extname(urlPath).toLowerCase();

    if (ext) {
      const filePath = path.join(DIST, urlPath);
      if (filePath.startsWith(DIST)) {
        try {
          const st = await fs.stat(filePath);
          if (st.isFile()) {
            res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
            res.end(await fs.readFile(filePath));
            return;
          }
        } catch {
          /* fall through to 404 */
        }
      }
      res.writeHead(404).end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(template);
  } catch {
    res.writeHead(500).end("Server error");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

/* ---------- browser launch ---------- */
// Vercel's build image lacks Chromium's system libraries (libnspr4 etc.),
// so there we use @sparticuz/chromium, which bundles them.
// Locally we use the Playwright-managed Chromium (npx playwright install chromium).
async function launchBrowser() {
  if (IS_VERCEL) {
    const { default: sparticuz } = await import("@sparticuz/chromium");
    return chromium.launch({
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }
  return chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

/* ---------- render ---------- */
let browser;
try {
  browser = await launchBrowser();

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Keep it fast and deterministic: only same-origin scripts/styles/documents.
  // Images, media, fonts and every external host (YouTube iframes, fonts) are blocked;
  // their elements stay in the DOM, which is all the snapshot needs.
  await page.route("**/*", (route) => {
    const req = route.request();
    const url = req.url();
    const local = url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:");
    if (!local || ["image", "media", "font"].includes(req.resourceType())) {
      return route.abort();
    }
    return route.continue();
  });
  page.on("pageerror", (err) => console.warn(`warn: page error: ${err.message}`));

  // Original title/description, read from a route that doesn't use useSeo.
  await page.goto(`${origin}/about-us`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#root > *", { timeout: 30000 });
  const defaults = await page.evaluate(() => ({
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
  }));

  for (const { route, out, expected } of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });

    // Playwright signature: waitForFunction(fn, arg, options)
    await page.waitForFunction(
      ({ name, slug }) => {
        const h1 = document.querySelector("h1");
        const canon = document.querySelector('link[rel="canonical"][data-seo]');
        return (
          !!h1 &&
          h1.textContent.trim() === name &&
          !!canon &&
          (canon.getAttribute("href") || "").endsWith("/services/" + slug)
        );
      },
      { name: expected.name, slug: expected.slug },
      { timeout: 30000 },
    );

    // let the image fade-in / entrance animations settle
    await new Promise((r) => setTimeout(r, 700));

    const canonical = await page.evaluate(
      () => document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    );
    const wantCanonical = `${siteUrl}/services/${expected.slug}`;
    if (canonical !== wantCanonical) {
      throw new Error(`${route}: canonical is "${canonical}", expected "${wantCanonical}"`);
    }

    const html = await page.evaluate((d) => {
      document.body.removeAttribute("style"); // drop the modal scroll-lock leftover
      const root = document.documentElement;
      root.setAttribute("data-default-title", d.title);
      if (d.description !== null) root.setAttribute("data-default-description", d.description);
      return "<!DOCTYPE html>\n" + root.outerHTML;
    }, defaults);

    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, html, "utf8");
    console.log(`ok:   prerendered ${route}`);
  }

  console.log(`\nprerender DONE: ${routes.length} files written to dist/services`);
} catch (err) {
  console.error(err);
  await browser?.close().catch(() => {});
  server.close();
  fail(err instanceof Error ? err.message : String(err));
}

await browser?.close().catch(() => {});
server.close();