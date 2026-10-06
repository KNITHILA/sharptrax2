import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { categories } from "../src/data/servicesCatalog";
import { buildSeo, buildTitle, buildDescription } from "../src/lib/seo";
import {
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  TITLE_SUFFIX,
  TITLE_SUFFIX_SHORT,
} from "../src/config/site";

const TEST_SITE = "https://www.example-test.com";
let failures = 0;

const ok = (m: string) => console.log(`ok:   ${m}`);
const bad = (m: string) => {
  failures++;
  console.error(`FAIL: ${m}`);
};
const check = (cond: boolean, pass: string, fail: string) => (cond ? ok(pass) : bad(fail));

/* ---------- env ---------- */
const siteUrl = (loadEnv("production", process.cwd(), "VITE_").VITE_SITE_URL ?? "").trim();
check(
  /^https?:\/\/[^/\s]+/i.test(siteUrl) && !siteUrl.includes("your-domain"),
  `VITE_SITE_URL is set (${siteUrl})`,
  "VITE_SITE_URL missing or still the placeholder in .env.production",
);

/* ---------- unit tests: buildDescription / buildTitle ---------- */
{
  const short = "A short description.";
  check(buildDescription(short) === short, "short description unchanged", "short description altered");

  const sentence = "First sentence ends here.";
  const long = `${sentence} ${"word ".repeat(60)}`;
  check(
    buildDescription(long) === sentence,
    "cuts at last sentence end within limit",
    `sentence cut wrong: "${buildDescription(long)}"`,
  );

  const noEnd = "word ".repeat(60).trim();
  const cut = buildDescription(noEnd);
  check(
    cut.endsWith("…") && cut.length <= MAX_DESCRIPTION_LENGTH && cut.slice(0, -1).endsWith("word"),
    "falls back to word boundary + ellipsis",
    `word-boundary cut wrong (len ${cut.length}): "${cut}"`,
  );

  check(
    buildTitle("Welding Rotator") === `Welding Rotator | ${TITLE_SUFFIX}`,
    "short name gets full suffix",
    "short title wrong",
  );
  const longName = "Plasma Transferred Arc Welding System";
  check(
    buildTitle(longName) === `${longName} | ${TITLE_SUFFIX_SHORT}`,
    "long name gets short suffix",
    "long title wrong",
  );
}

/* ---------- all 26 machines ---------- */
const titles = new Set<string>();
const descriptions = new Set<string>();
const canonicals = new Set<string>();
let count = 0;

for (const category of categories) {
  for (const product of category.products) {
    count++;
    const errs: string[] = [];
    const seo = buildSeo(product, category, TEST_SITE);

    const fullTitle = `${product.name} | ${TITLE_SUFFIX}`;
    const expectedTitle =
      fullTitle.length <= MAX_TITLE_LENGTH ? fullTitle : `${product.name} | ${TITLE_SUFFIX_SHORT}`;
    if (seo.title !== expectedTitle) errs.push(`title "${seo.title}" != "${expectedTitle}"`);
    if (seo.title.length > MAX_TITLE_LENGTH) errs.push(`title too long (${seo.title.length})`);

    if (!seo.description) errs.push("empty description");
    if (seo.description.length > MAX_DESCRIPTION_LENGTH)
      errs.push(`description ${seo.description.length} > ${MAX_DESCRIPTION_LENGTH}`);
    const normDesc = product.desc.replace(/\s+/g, " ").trim();
    const body = seo.description.replace(/…$/, "");
    if (!normDesc.startsWith(body)) errs.push("description is not a prefix of desc");
    if (!seo.description.endsWith("…") && !/[.!?]$/.test(seo.description))
      errs.push("description neither ends a sentence nor with …");

    if (seo.canonical !== `${TEST_SITE}/services/${product.slug}`)
      errs.push(`canonical wrong: ${seo.canonical}`);
    if (!/^https:\/\//.test(seo.canonical)) errs.push("canonical not absolute");

    if (!seo.image.startsWith(`${TEST_SITE}/`)) errs.push(`image not absolute: ${seo.image}`);
    if (seo.image.includes(" ")) errs.push("image URL contains a space");

    const need = [
      "og:type", "og:site_name", "og:title", "og:description", "og:url", "og:image",
      "twitter:card", "twitter:title", "twitter:description", "twitter:image",
    ];
    for (const key of need) {
      const hit = seo.metas.find((m) => m.key === key);
      if (!hit || !hit.content) errs.push(`missing ${key}`);
    }
    const metaVal = (k: string) => seo.metas.find((m) => m.key === k)?.content;
    if (metaVal("og:url") !== seo.canonical) errs.push("og:url != canonical");
    if (metaVal("og:title") !== seo.title) errs.push("og:title != title");
    if (metaVal("twitter:card") !== "summary_large_image") errs.push("twitter:card wrong");

    // JSON-LD
    try {
      const round = JSON.parse(JSON.stringify(seo.jsonLd)) as Array<Record<string, unknown>>;
      if (round.length !== 2) errs.push("expected 2 JSON-LD blocks");
      const bc = round.find((b) => b["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<{ position: number; name: string; item: string }> }
        | undefined;
      const pr = round.find((b) => b["@type"] === "Product") as
        | Record<string, unknown>
        | undefined;
      if (!bc) errs.push("no BreadcrumbList");
      else {
        const items = bc.itemListElement;
        if (items.length !== 3 || items.some((it, i) => it.position !== i + 1))
          errs.push("breadcrumb positions wrong");
        if (items[2]?.name !== product.name || items[2]?.item !== seo.canonical)
          errs.push("breadcrumb last item wrong");
        if (items.some((it) => !/^https:\/\//.test(it.item))) errs.push("breadcrumb URL not absolute");
      }
      if (!pr) errs.push("no Product");
      else {
        if (pr.name !== product.name) errs.push("Product.name wrong");
        if (pr.description !== product.desc) errs.push("Product.description not the full desc");
        if ("offers" in pr) errs.push("Product has offers (no prices exist)");
        if ((pr.brand as { name?: string } | undefined)?.name !== "Sharptrax Technologies")
          errs.push("Product.brand wrong");
        if (pr.category !== category.title) errs.push("Product.category wrong");
        const imgs = pr.image as string[];
        if (!Array.isArray(imgs) || imgs.length !== product.imgs.length || imgs.some((i) => i.includes(" ")))
          errs.push("Product.image wrong");
      }
    } catch (e) {
      errs.push(`JSON-LD invalid: ${(e as Error).message}`);
    }

    titles.add(seo.title);
    descriptions.add(seo.description);
    canonicals.add(seo.canonical);

    if (errs.length) errs.forEach((e) => bad(`${product.slug}: ${e}`));
    else ok(`${product.slug}`);
  }
}

check(count === 26, "26 machines checked", `expected 26 machines, got ${count}`);
check(titles.size === count, "all titles unique", "duplicate titles");
check(descriptions.size === count, "all descriptions unique", "duplicate descriptions");
check(canonicals.size === count, "all canonicals unique", "duplicate canonicals");

check(
  existsSync(path.join(process.cwd(), ".env.production")),
  ".env.production exists",
  ".env.production missing",
);

if (failures) {
  console.error(`\nverify:seo FAILED (${failures} problem${failures === 1 ? "" : "s"})`);
  process.exit(1);
}
console.log("\nverify:seo PASSED");