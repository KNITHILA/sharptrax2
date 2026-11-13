// Usage: node scripts/qa/diff.mjs --a qa/baseline --b qa/current --out qa/diff
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const A = arg("a", "qa/baseline");
const B = arg("b", "qa/current");
const OUT = arg("out", "qa/diff");
const MAX_PIXELS = Number(arg("max", "0"));
fs.mkdirSync(OUT, { recursive: true });

const filesA = fs.readdirSync(A).filter((f) => /\.(png|json)$/.test(f));
const filesB = new Set(fs.readdirSync(B));
let failures = 0;

for (const f of filesA) {
  if (!filesB.has(f)) {
    console.log(`MISSING in current: ${f}`);
    failures++;
    continue;
  }
  if (f.endsWith(".json")) {
    const a = fs.readFileSync(path.join(A, f), "utf8");
    const b = fs.readFileSync(path.join(B, f), "utf8");
    if (a !== b) {
      console.log(`JSON DIFF: ${f}`);
      failures++;
    }
    continue;
  }
  const imgA = PNG.sync.read(fs.readFileSync(path.join(A, f)));
  const imgB = PNG.sync.read(fs.readFileSync(path.join(B, f)));
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    console.log(
      `SIZE DIFF: ${f} (${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height})`
    );
    failures++;
    continue;
  }
  const diff = new PNG({ width: imgA.width, height: imgA.height });
  const n = pixelmatch(imgA.data, imgB.data, diff.data, imgA.width, imgA.height, {
    threshold: 0.1,
  });
  if (n > MAX_PIXELS) {
    fs.writeFileSync(path.join(OUT, f), PNG.sync.write(diff));
    console.log(`PIXEL DIFF: ${f} (${n} px) -> ${path.join(OUT, f)}`);
    failures++;
  }
}
for (const f of filesB) {
  if (/\.(png|json)$/.test(f) && !filesA.includes(f)) {
    console.log(`EXTRA in current: ${f}`);
    failures++;
  }
}

console.log(failures === 0 ? "\nPASS: no differences" : `\nFAIL: ${failures} difference(s)`);
process.exit(failures === 0 ? 0 : 1);