import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { categories, type Category, type Product } from "../src/data/servicesCatalog";
import { buildSeo } from "../src/lib/seo";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE_URL = (loadEnv("production", ROOT, "VITE_").VITE_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

if (!/^https?:\/\/[^/\s]+/i.test(SITE_URL) || SITE_URL.includes("your-domain")) {
  console.error("FAIL: VITE_SITE_URL missing or still the placeholder in .env.production");
  process.exit(1);
}

const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&");

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g)) out[m[1]] = decode(m[2]);
  return out;
}

interface Entry {
  route: string;
  file: string;
  product: Product;
  category: Category;
}

const entries: Entry[] = [
  {
    route: "/services",
    file: path.join(DIST, "services", "index.html"),
    product: categories[0].products[0],
    category: categories[0],
  },
];
for (const c of categories) {
  for (const p of c.products) {
    entries.push({
      route: `/services/${p.slug}`,
      file: path.join(DIST, "services", p.slug, "index.html"),
      product: p,
      category: c,
    });
  }
}

function verify(entry: Entry): string[] {
  const errs: string[] = [];
  if (!existsSync(entry.file)) return ["file missing"];

  const html = readFileSync(entry.file, "utf8");
  const headEnd = html.indexOf("</head>");
  const bodyStart = html.indexOf("<body");
  if (headEnd < 0 || bodyStart < 0) return ["malformed document"];
  const head = html.slice(0, headEnd);
  const body = decode(html.slice(bodyStart));

  const seo = buildSeo(entry.product, entry.category, SITE_URL);

  // title
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decode(titleMatch[1]).trim() : "";
  if (title !== seo.title) errs.push(`title "${title}" != "${seo.title}"`);

  // meta tags: exactly one of each, with the right value
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const metaValues = (attr: "name" | "property", key: string) =>
    metas.filter((m) => m[attr] === key).map((m) => m.content ?? "");
  const expectOne = (attr: "name" | "property", key: string, want: string) => {
    const vals = metaValues(attr, key);
    if (vals.length !== 1) errs.push(`${key}: found ${vals.length} tag(s), expected 1`);
    else if (vals[0] !== want) errs.push(`${key}: "${vals[0]}" != "${want}"`);
  };
  expectOne("name", "description", seo.description);
  for (const m of seo.metas) expectOne(m.attr, m.key, m.content);

  // canonical
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => attrs(m[0]))
    .filter((l) => l.rel === "canonical");
  if (canonicals.length !== 1) errs.push(`canonical: found ${canonicals.length}, expected 1`);
  else if (canonicals[0].href !== seo.canonical)
    errs.push(`canonical "${canonicals[0].href}" != "${seo.canonical}"`);

  // JSON-LD
  const blocks = [
    ...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  if (blocks.length !== 2) errs.push(`JSON-LD: found ${blocks.length} block(s), expected 2`);
  else {
    try {
      const parsed = blocks.map((b) => JSON.parse(b[1]) as Record<string, unknown>);
      const types = parsed.map((p) => p["@type"]).sort().join(",");
      if (types !== "BreadcrumbList,Product") errs.push(`JSON-LD types: ${types}`);
      const prod = parsed.find((p) => p["@type"] === "Product");
      if (prod?.name !== entry.product.name) errs.push("JSON-LD Product.name wrong");
    } catch (e) {
      errs.push(`JSON-LD not valid JSON: ${(e as Error).message}`);
    }
  }

  // default-head stamps (used by useSeo when leaving a machine page)
  if (!/<html\b[^>]*data-default-title="/.test(html)) errs.push("missing data-default-title on <html>");

  // visible content without JS
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1 ? decode(h1[1].replace(/<[^>]*>/g, "")).trim() : "";
  if (h1Text !== entry.product.name) errs.push(`h1 "${h1Text}" != "${entry.product.name}"`);

  if (!body.includes(entry.product.desc)) errs.push("description text not in HTML body");
  for (const f of entry.product.features ?? []) {
    if (!body.includes(f)) errs.push(`feature missing from body: "${f.slice(0, 50)}…"`);
  }

  const links = (html.match(/href="\/services\/[^"]+"/g) ?? []).length;
  if (links < 20) errs.push(`only ${links} /services/… links in markup (need >= 20)`);

  return errs;
}

let failures = 0;
for (const entry of entries) {
  const errs = verify(entry);
  if (errs.length) {
    failures += errs.length;
    errs.forEach((e) => console.error(`FAIL: ${entry.route}: ${e}`));
  } else {
    console.log(`ok:   ${entry.route}`);
  }
}

if (entries.length !== 27) {
  failures++;
  console.error(`FAIL: expected 27 files, have ${entries.length}`);
}

if (failures) {
  console.error(`\nverify:prerender FAILED (${failures} problem${failures === 1 ? "" : "s"})`);
  process.exit(1);
}
console.log(`\nverify:prerender PASSED (${entries.length} files)`);