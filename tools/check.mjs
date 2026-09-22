// Validates the built site: internal links and images resolve, every EN page has an AR
// twin whose hreflang links point back, and no internal draft notes leaked into the copy.
// Run: node tools/check.mjs  (exit 1 on any problem)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BANNED = ['Draft one', 'to confirm', 'To add', 'withheld', 'قيد التأكيد', 'قيد الإضافة', 'المسودة', 'placeholder'];
const problems = [];

const list = (dir) => existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.html')) : [];
const en = list(ROOT);
const ar = list(join(ROOT, 'ar'));

for (const f of en) if (f !== '404.html' && !ar.includes(f)) problems.push(`No Arabic twin for ${f}`);
for (const f of ar) if (!en.includes(f)) problems.push(`No English twin for ar/${f}`);

function checkFile(rel) {
  const abs = join(ROOT, rel);
  const html = readFileSync(abs, 'utf8');
  for (const b of BANNED) {
    const re = new RegExp(b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const inText = html.replace(/<script[\s\S]*?<\/script>/g, '');
    if (re.test(inText)) problems.push(`${rel}: contains banned draft text "${b}"`);
  }
  const attrs = [...html.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)].map((m) => m[1]);
  for (const raw of attrs) {
    for (const piece of raw.split(',')) {
      const v = piece.trim().split(/\s+/)[0];
      if (!v || /^(https?:|mailto:|tel:|#|data:|javascript:)/.test(v)) continue;
      const clean = v.split('#')[0].split('?')[0];
      let target = clean.startsWith('/') ? join(ROOT, clean) : resolve(dirname(abs), clean);
      if (clean.endsWith('/')) target = join(target, 'index.html');
      if (!existsSync(target)) problems.push(`${rel}: broken link/asset "${v}"`);
    }
  }
  const lang = rel.startsWith('ar/') ? 'ar' : 'en';
  const other = lang === 'ar' ? 'en' : 'ar';
  const alt = html.match(new RegExp(`<link rel="alternate" hreflang="${other}" href="([^"]+)"`));
  if (!alt && rel !== '404.html') problems.push(`${rel}: missing hreflang="${other}"`);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: missing <title>`);
  if (!/name="description" content="[^"]{20,}"/.test(html)) problems.push(`${rel}: missing/short description`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${rel}: expected exactly one <h1>, found ${h1}`);
}

for (const f of en) checkFile(f);
for (const f of ar) checkFile('ar/' + f);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`OK: ${en.length} EN + ${ar.length} AR pages, links, images, hreflang, titles, no draft notes.`);
