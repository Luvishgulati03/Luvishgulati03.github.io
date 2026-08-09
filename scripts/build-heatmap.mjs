/**
 * BUILD-TIME ONLY. Bakes GitHub contribution data into index.html as static markup
 * so the shipped page makes zero external requests at runtime.
 *
 * Refresh the source data (requires `gh auth login`):
 *   gh api graphql -f query='query { user(login: "Luvishgulati03") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }' \
 *     > data/github-contributions.json
 *
 * Then re-bake:
 *   node scripts/build-heatmap.mjs
 *
 * Idempotent: it rewrites the regions between the BEGIN/END markers in index.html.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = join(ROOT, "index.html");
const DATA = join(ROOT, "data", "github-contributions.json");

const cal = JSON.parse(readFileSync(DATA, "utf8")).data.user.contributionsCollection.contributionCalendar;
const weeks = cal.weeks;
const total = cal.totalContributions;
const days = weeks.flatMap((w) => w.contributionDays);

// GitHub-style bucketing.
const level = (c) => (c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4);

/* ---------- heatmap cells (column = week, row = weekday) ---------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pretty = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const cells = weeks
  .map((w) =>
    w.contributionDays
      .map((d) => {
        const l = level(d.contributionCount);
        const cls = l ? ` class="l${l}"` : "";
        // Tooltip only where there is something to say — keeps the DOM lean.
        const t = d.contributionCount
          ? ` title="${d.contributionCount} contribution${d.contributionCount === 1 ? "" : "s"} on ${pretty(d.date)}"`
          : "";
        return `<i${cls}${t}></i>`;
      })
      .join("")
  )
  .join("\n");

/* ---------- month labels, placed on the week column where the month turns ---------- */
const labels = [];
let lastMonth = -1;
let lastCol = -99;
weeks.forEach((w, i) => {
  const m = Number(w.contributionDays[0].date.split("-")[1]) - 1;
  if (m !== lastMonth && i - lastCol >= 3 && i <= weeks.length - 3) {
    labels.push(`<span style="grid-column:${i + 1}">${MONTHS[m]}</span>`);
    lastMonth = m;
    lastCol = i;
  } else if (m !== lastMonth) {
    lastMonth = m;
  }
});

/* ---------- decorative hero band (explicitly NOT contribution data) ---------- */
// Deterministic so the committed HTML is stable across rebuilds.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260808);
const COLS = 70, ROWS = 7;
const band = [];
for (let c = 0; c < COLS; c++) {
  for (let r = 0; r < ROWS; r++) {
    // Denser toward the bottom rows, like a settled mosaic.
    const bias = 0.10 + (r / (ROWS - 1)) * 0.55;
    const v = rand();
    let cls = "";
    if (v < bias * 0.10) cls = " class=\"c\"";
    else if (v < bias * 0.18) cls = " class=\"b\"";
    else if (v < bias * 0.26) cls = " class=\"a\"";
    else if (v < bias * 0.62) cls = " class=\"n\"";
    else if (v < bias) cls = " class=\"m\"";
    band.push(`<i${cls}></i>`);
  }
}
// A few bright accents so the band reads as "activity".
[42, 137, 260, 331, 404, 468].forEach((i) => { band[i] = '<i class="d"></i>'; });

/* ---------- splice into index.html ---------- */
let html = readFileSync(HTML, "utf8");
const put = (name, payload) => {
  const re = new RegExp(`(<!--${name}-->)[\\s\\S]*?(<!--/${name}-->)`);
  if (re.test(html)) html = html.replace(re, `$1${payload}$2`);
  else html = html.replace(`<!--${name}-->`, `<!--${name}-->${payload}<!--/${name}-->`);
};

put("HERO_BAND", "\n" + band.join("") + "\n");
put("GH_MONTHS", "\n" + labels.join("") + "\n");
put("GH_GRID", "\n" + cells + "\n");

// Keep the count and the aria-label honest and in sync with the data file.
html = html
  // Attribute-tolerant + FATAL on no-match (audit 2026-08-09 B-H9): the old exact
  // pattern missed the live markup's extra `data-count` attribute and no-op'd
  // silently — the nightly deploy would have pushed a frozen headline forever.
  .replace(/<b id="ghcount"([^>]*?)data-n="\d+">\d+<\/b>/, `<b id="ghcount"$1data-n="${total}">${total}</b>`)
  .replace(
    /(aria-label="GitHub contribution heatmap for Luvishgulati03: )[^"]*(")/,
    `$1${total} contributions between ${pretty(days[0].date)} and ${pretty(days[days.length - 1].date)}.$2`
  );

if (!html.includes(`data-n="${total}">${total}</b>`)) {
  console.error("FATAL: ghcount marker did not update — page structure drifted (see AGENT-GUIDE.md)");
  process.exit(2);
}
writeFileSync(HTML, html);
console.log(
  `baked: ${total} contributions · ${days.length} days · ${weeks.length} weeks · ` +
  `${days.filter((d) => d.contributionCount > 0).length} active days · ${labels.length} month labels · ${band.length} band cells`
);
