#!/usr/bin/env node
/**
 * Re-injects data/henry-stats.json values into index.html between the STAT markers
 * (an opening comment "STAT:<key>", the value, then a closing "/STAT" comment).
 *
 * Run build-stats.mjs first — it reads Henry's live databases — then this. The markers
 * are always preserved so the next refresh can find them again.
 *
 * Two conventions this MUST honour, both enforced by scripts/audit.mjs:
 *   1. values are HTML-escaped — activeFor is "<1 month", which would otherwise be
 *      parsed as a tag and break the page;
 *   2. generatedAt renders as en-GB day/short-month/year in UTC, e.g. "8 Aug 2026".
 *
 * Idempotent: running it twice with unchanged JSON leaves index.html byte-identical.
 * Exit 2 = no markers found at all, i.e. the page structure drifted — stop and look.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const statsPath = path.join(root, "data", "henry-stats.json");
const pagePath = path.join(root, "index.html");

const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
const before = fs.readFileSync(pagePath, "utf8");
let html = before;

/** Text going into an HTML text node. `<` and `&` are the ones that actually bite. */
const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Must match the format scripts/audit.mjs recomputes from the JSON. */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });

let replaced = 0;
const skipped = [];
for (const [key, value] of Object.entries(stats)) {
  const pattern = new RegExp(`(<!--STAT:${key}-->)([\\s\\S]*?)(<!--/STAT-->)`, "g");
  if (!pattern.test(html)) { skipped.push(key); continue; }
  pattern.lastIndex = 0;
  const display = escapeHtml(key === "generatedAt" ? formatDate(value) : value);
  html = html.replace(pattern, `$1${display}$3`);
  replaced += 1;
}

const changed = html !== before;
if (changed) fs.writeFileSync(pagePath, html);

console.log(
  `refreshed ${replaced} stat marker(s)${changed ? "" : " — already up to date"}` +
  (skipped.length ? `; not shown on the page: ${skipped.join(", ")}` : "")
);
console.log("now run:  cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs");

// Extra keys in the JSON that the page doesn't display (activeSinceIso, embeddingDims)
// are fine to skip. Zero markers found is not — that means index.html drifted.
if (replaced === 0) {
  console.error("ERROR: no STAT markers found in index.html — see AGENT-GUIDE.md §4");
  process.exit(2);
}
