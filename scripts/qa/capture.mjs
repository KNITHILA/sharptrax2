// Usage: node scripts/qa/capture.mjs --base http://localhost:4173 --out qa/baseline
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { LEGACY, WIDTHS } from "./urls.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const BASE = arg("base", "http://localhost:4173").replace(/\/$/, "");
const OUT = arg("out", "qa/baseline");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
let count = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (let i = 0; i < LEGACY.length; i++) {
    const { cat, prod, slug } = LEGACY[i];
    const url = `${BASE}/services?cat=${cat}&prod=${encodeURIComponent(prod)}`;
    const id = `${String(i + 1).padStart(2, "0")}-${slug}-${width}`;

    await page.goto(url, { waitUntil: "load" });
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

    // Wait for the right machine to render
    await page.waitForFunction(
      (name) =>
        document.querySelector("h1")?.textContent?.trim().toLowerCase() ===
        name.toLowerCase(),
      prod,
      { timeout: 15000 }
    );
    // Wait for fonts and images, then for the image fade-in to finish
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      [...document.images].every((img) => img.complete)
    );
    await page.waitForTimeout(900);

    const data = await page.evaluate(() => ({
      url: location.pathname + location.search,
      h1: document.querySelector("h1")?.textContent?.trim() ?? null,
      text: document.body.innerText,
      imgs: [...document.querySelectorAll("img")].map((n) => n.getAttribute("src")),
      media: [...document.querySelectorAll("video, iframe")].map(
        (n) => n.getAttribute("src")
      ),
    }));
    fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(data, null, 2));

    await page.screenshot({
      path: path.join(OUT, `${id}.png`),
      fullPage: true,
      animations: "disabled",
      mask: [
        page.locator("video"),
        page.locator("iframe"),
        page.locator('a[aria-label="Contact us on WhatsApp"]'),
      ],
    });
    count++;
    console.log(`captured ${id}`);
  }
  await context.close();
}

await browser.close();
console.log(`\nDone: ${count} pages -> ${OUT}`);