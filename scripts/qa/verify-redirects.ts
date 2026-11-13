import { chromium } from "playwright";
import { categories } from "../../src/data/servicesCatalog";

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:4173";

let failures = 0;
const ok = (m: string) => console.log("ok:   " + m);
const fail = (m: string) => { failures++; console.log("FAIL: " + m); };

const browser = await chromium.launch();
const page = await browser.newPage();

const finalPath = () => new URL(page.url()).pathname + new URL(page.url()).search;
const h1 = async () => (await page.locator("h1").first().textContent())?.trim();

for (const cat of categories) {
  for (const p of cat.products) {
    // 1. New URL loads the right machine
    await page.goto(`${BASE}/services/${p.slug}`, { waitUntil: "networkidle" });
    (await h1()) === p.name && finalPath() === `/services/${p.slug}`
      ? ok(`new   /services/${p.slug}`)
      : fail(`new   /services/${p.slug} -> ${finalPath()} h1="${await h1()}"`);

    // 2. Legacy URL redirects to the new URL
    const legacy = `${BASE}/services?cat=${cat.id}&prod=${encodeURIComponent(p.name)}`;
    await page.goto(legacy, { waitUntil: "networkidle" });
    finalPath() === `/services/${p.slug}` && (await h1()) === p.name
      ? ok(`legacy ${p.slug}`)
      : fail(`legacy ${p.slug} -> ${finalPath()}`);

    // 3. Case-insensitive product name still resolves (old behaviour)
    await page.goto(
      `${BASE}/services?cat=${cat.id}&prod=${encodeURIComponent(p.name.toUpperCase())}`,
      { waitUntil: "networkidle" }
    );
    finalPath() === `/services/${p.slug}`
      ? ok(`legacy-case ${p.slug}`)
      : fail(`legacy-case ${p.slug} -> ${finalPath()}`);
  }
}

// 4. Invalid cases land on /services (first machine, no redirect loop)
for (const [label, url] of [
  ["unknown slug", `${BASE}/services/does-not-exist`],
  ["bad cat", `${BASE}/services?cat=nope&prod=Welding%20Rotator`],
  ["bad prod", `${BASE}/services?cat=welding-automation&prod=nope`],
  ["cat only", `${BASE}/services?cat=welding-automation`],
] as const) {
  await page.goto(url, { waitUntil: "networkidle" });
  finalPath().startsWith("/services") && !finalPath().startsWith("/services/") &&
  (await h1()) === categories[0].products[0].name
    ? ok(label)
    : fail(`${label} -> ${finalPath()}`);
}

// 5. Back button doesn't loop: about -> legacy (redirected) -> back = about
await page.goto(`${BASE}/about-us`, { waitUntil: "networkidle" });
await page.goto(
  `${BASE}/services?cat=welding-automation&prod=Welding%20Rotator`,
  { waitUntil: "networkidle" }
);
await page.goBack({ waitUntil: "networkidle" });
finalPath() === "/about-us" ? ok("back button") : fail(`back button -> ${finalPath()}`);

// 6. Hard refresh on a deep link
await page.goto(`${BASE}/services/welding-rotator`, { waitUntil: "networkidle" });
await page.reload({ waitUntil: "networkidle" });
(await h1()) === "Welding Rotator" ? ok("hard refresh") : fail("hard refresh");

await browser.close();
console.log(failures ? `\nverify:redirects FAILED (${failures})` : "\nverify:redirects PASSED");
process.exit(failures ? 1 : 0);