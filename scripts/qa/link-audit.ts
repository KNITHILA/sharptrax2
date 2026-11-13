import { chromium } from "playwright";
import { categories } from "../../src/data/servicesCatalog";

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:4173";

const nameBySlug = new Map(
  categories.flatMap((c) => c.products).map((p) => [p.slug, p.name] as const)
);

const routes = [
  "/", "/about-us", "/services", "/services/welding-rotator",
  "/gallery", "/contact", "/location", "/industries",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

let failures = 0;
const ok = (m: string) => console.log("ok:   " + m);
const fail = (m: string) => { failures++; console.log("FAIL: " + m); };

const browser = await chromium.launch();
const seenSlugs = new Set<string>();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });

    const hrefs = await page.$$eval('a[href^="/services"]', (as) =>
      as.map((a) => a.getAttribute("href") || "")
    );

    // 1. No legacy URLs anywhere
    const legacy = hrefs.filter((h) => h.includes("?cat=") || h.includes("&prod="));
    legacy.length === 0
      ? ok(`${vp.name} ${route}: no legacy links (${hrefs.length} /services links)`)
      : fail(`${vp.name} ${route}: legacy links -> ${legacy.join(", ")}`);

    // 2. Every /services/<slug> link points at a real slug
    for (const h of hrefs) {
      const m = h.match(/^\/services\/([^/?#]+)$/);
      if (!m) continue;
      if (nameBySlug.has(m[1])) seenSlugs.add(m[1]);
      else fail(`${vp.name} ${route}: unknown slug in ${h}`);
    }

    // 3. Per-section expectations
    const count = (sel: string) => page.locator(sel).count();
    if (route === "/") {
      const n = await count('section:has(h2:has-text("Automation Solutions")) a[href^="/services/"]');
      n === 6 ? ok(`${vp.name} / home cards = 6`) : fail(`${vp.name} / home cards = ${n}, expected 6`);
    }
    if (route === "/services/welding-rotator") {
      const n = await count('section:has(h3:has-text("Related Systems")) a[href^="/services/"]');
      n === 3 ? ok(`${vp.name} related cards = 3`) : fail(`${vp.name} related cards = ${n}, expected 3`);
    }
    if (route === "/gallery") {
      const n = await count('a[href^="/services/"]');
      n > 26 ? ok(`${vp.name} gallery links = ${n}`) : fail(`${vp.name} gallery links = ${n}`);
    }
    const f = await count('footer a[href^="/services/"]');
    f === 6 ? ok(`${vp.name} ${route}: footer links = 6`) : fail(`${vp.name} ${route}: footer links = ${f}, expected 6`);
  }
  await page.close();
}

// 4. Navbar alone must expose all 26 machines
seenSlugs.size === 26
  ? ok("all 26 machines are linked from the site")
  : fail(`only ${seenSlugs.size}/26 machines linked`);

// 5. Every linked target loads with the correct <h1>
const page = await browser.newPage();
for (const slug of seenSlugs) {
  await page.goto(`${BASE}/services/${slug}`, { waitUntil: "networkidle" });
  const h1 = (await page.locator("h1").first().textContent())?.trim();
  h1 === nameBySlug.get(slug) ? ok(`target ${slug}`) : fail(`target ${slug} -> h1="${h1}"`);
}

await browser.close();
console.log(failures ? `\nqa:links FAILED (${failures})` : "\nqa:links PASSED");
process.exit(failures ? 1 : 0);