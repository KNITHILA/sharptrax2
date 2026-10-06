// Run: npm run verify:catalog
// Optional: BASELINE_REF=<git ref> (default: baseline-pre-seo)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { categories } from "../src/data/servicesCatalog.ts";

const BASELINE_REF = process.env.BASELINE_REF || "baseline-pre-seo";
const FROZEN_SLUGS = [
  "robotic-automation",
  "plasma-transferred-arc-welding-system",
  "welding-rotator",
  "pull-through-welding-automation-system",
  "mig-welding-system",
  "tig-longitudinal-welding-spm",
  "saw-submerged-arc-welding",
  "column-and-boom",
  "port-welding-machine-spm",
  "head-and-tailstock-units",
  "hydraulic-end-cap-welding-spm",
  "tankweld-pro-automated-tank-welding-solution",
  "robotic-gantry-automation",
  "robotic-trolley-welding",
  "material-tilter",
  "welding-positioners",
  "l-type-positioner",
  "scissor-rollers",
  "welding-turn-table",
  "plasma-cnc-machine",
  "torch-weaving-unit",
  "avc-unit",
  "laser-seam-tracking-unit",
  "welding-torch",
  "cross-slides",
  "membrane-panel-welding-system",
];

let failed = false;
const fail = (msg: string) => {
  console.error(`FAIL: ${msg}`);
  failed = true;
};
const ok = (msg: string) => console.log(`ok:   ${msg}`);

// ---------- 1. Count, slugs, names ----------
const products = categories.flatMap((c) => c.products);

if (products.length === 26) ok("26 products");
else fail(`expected 26 products, found ${products.length}`);

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugs = products.map((p) => p.slug);
const badSlugs = slugs.filter((s) => typeof s !== "string" || !slugRe.test(s));
if (badSlugs.length) fail(`invalid slug format: ${badSlugs.join(", ")}`);
else ok("all slugs match ^[a-z0-9]+(-[a-z0-9]+)*$");

const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupSlugs.length) fail(`duplicate slugs: ${dupSlugs.join(", ")}`);
else ok("slugs are unique");

const lowerNames = products.map((p) => p.name.toLowerCase());
const dupNames = lowerNames.filter((n, i) => lowerNames.indexOf(n) !== i);
if (dupNames.length) fail(`duplicate product names (case-insensitive): ${dupNames.join(", ")}`);
else ok("product names are unique (needed for slugByName)");

if (isDeepStrictEqual(slugs, FROZEN_SLUGS)) ok("slugs match the frozen table, in order");
else {
  slugs.forEach((s, i) => {
    if (s !== FROZEN_SLUGS[i]) fail(`slug #${i + 1}: expected "${FROZEN_SLUGS[i]}", got "${s}"`);
  });
}

// ---------- 2. Parity with baseline Services.tsx ----------
function extractBaselineCategories(): unknown {
  const src = execFileSync(
    "git",
    ["show", `${BASELINE_REF}:./src/pages/Services.tsx`],
    { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
  );
  const marker = "const categories: Category[] = ";
  const start = src.indexOf(marker);
  if (start === -1) throw new Error("array start marker not found in baseline Services.tsx");
  const arrStart = start + marker.length;
  const end = src.indexOf("\n];", arrStart);
  if (end === -1) throw new Error("array end not found in baseline Services.tsx");
  const literal = src.slice(arrStart, end + 2); // include the closing "]"
  return new Function(`return (${literal});`)();
}

function firstDiff(a: any, b: any, p = "$"): string | null {
  if (isDeepStrictEqual(a, b)) return null;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${p}: array length ${a.length} (baseline) vs ${b.length} (catalog)`;
    for (let i = 0; i < a.length; i++) {
      const d = firstDiff(a[i], b[i], `${p}[${i}]`);
      if (d) return d;
    }
  } else if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const d = firstDiff(a[k], b[k], `${p}.${k}`);
      if (d) return d;
    }
  }
  return `${p}: ${JSON.stringify(a)} (baseline) vs ${JSON.stringify(b)} (catalog)`;
}

try {
  const baseline = extractBaselineCategories();
  const withoutSlug = JSON.parse(
    JSON.stringify(categories, (k, v) => (k === "slug" ? undefined : v))
  );
  const diff = firstDiff(baseline, withoutSlug);
  if (diff) fail(`catalog differs from baseline (${BASELINE_REF}): ${diff}`);
  else ok(`catalog is identical to ${BASELINE_REF} Services.tsx (ignoring slug)`);
} catch (e) {
  fail(`could not read baseline "${BASELINE_REF}": ${(e as Error).message}`);
}

// ---------- 3. Missing media (report only) ----------
const publicDir = path.join(process.cwd(), "public");
const missing: string[] = [];
for (const p of products) {
  for (const f of [...p.imgs, ...(p.videos ?? [])]) {
    if (/^https?:\/\//i.test(f)) continue;
    const onDisk = path.join(publicDir, ...f.split("/").filter(Boolean));
    if (!fs.existsSync(onDisk)) missing.push(`${p.name}: ${f}`);
  }
}
if (missing.length === 0) ok("all local image/video paths exist under public/");
else {
  console.warn(`\nREPORT (not a failure): ${missing.length} media path(s) not found under public/:`);
  missing.forEach((m) => console.warn(`  - ${m}`));
}

console.log(failed ? "\nverify:catalog FAILED" : "\nverify:catalog PASSED");
process.exit(failed ? 1 : 0);