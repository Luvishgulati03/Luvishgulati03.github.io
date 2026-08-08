// Portfolio pre-publish audit (v3 structure + case-study pages).
// Run from the henry repo root (Playwright lives there):
//   cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
// Exit 0 = safe to publish. Any FAIL = fix before pushing.
// Writes shots/v3.png plus one screenshot per case-study page.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "/Users/luvishgulati/dev/henry/node_modules/playwright/index.mjs";

const REPO = "/Users/luvishgulati/dev/portfolio";
const PAGE = `file://${REPO}/index.html`;

const CASE_PAGES = [
  { file: "projects/risk-ai-council.html", shot: "case-risk-ai-council.png", h1: "Risk AI Council" },
  { file: "projects/carbonnex.html", shot: "case-carbonnex.png", h1: "CarbonNex" },
];

/** Scroll the whole page so every IntersectionObserver reveal fires, then return
 *  to the top. Without this a fullPage screenshot captures .reveal sections at
 *  opacity:0 — and it also verifies the reveals actually work. */
async function scrollThrough(p) {
  await p.evaluate(async () => {
    // the page sets scroll-behavior:smooth, which would swallow scripted steps
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 350));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
    document.documentElement.style.scrollBehavior = prev;
  });
  return p.evaluate(() => document.querySelectorAll(".reveal:not(.in)").length);
}

const b = await chromium.launch();
const errors = [];
const external = [];

const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("request", (r) => {
  const u = r.url();
  if (!u.startsWith("file://") && !u.startsWith("data:") && !u.startsWith("about:")) external.push(u);
});

await page.goto(PAGE, { waitUntil: "load" });
await page.waitForTimeout(600);

/* ---------- structure ---------- */
const dom = await page.evaluate(() => {
  const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
  const navHrefs = [...document.querySelectorAll(".nav-links a[href^='#']")].map((a) => a.getAttribute("href"));
  return {
    links,
    navHrefs,
    navTargetsResolve: navHrefs.every((h) => !!document.querySelector(h)),
    sections: ["experience", "projects", "skills", "github", "henry-stats", "contact"].filter((id) => !document.getElementById(id)),
    h1: document.querySelectorAll("h1").length,
    h2s: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    headingOrderOk: (() => {
      const hs = [...document.querySelectorAll("h1,h2,h3")].map((h) => +h.tagName[1]);
      return hs[0] === 1 && hs.every((lv, i) => i === 0 || lv - hs[i - 1] <= 1);
    })(),
    hmCells: document.querySelectorAll("#hm i").length,
    hmLabelled: (document.getElementById("hm")?.getAttribute("aria-label") || ""),
    ghCount: document.getElementById("ghcount")?.getAttribute("data-n"),
    hatches: document.querySelectorAll(".hatch").length,
    rules: document.querySelectorAll(".rule").length,
    thumbs: document.querySelectorAll(".thumb").length,
    projRows: document.querySelectorAll(".plist li").length,
    xpRows: document.querySelectorAll(".xp li").length,
    tiles: document.querySelectorAll(".tile").length,
    caseBtns: [...document.querySelectorAll(".plist .p-btns a")].map((a) => ({
      href: a.getAttribute("href"),
      text: a.textContent.replace(/\s+/g, " ").trim(),
    })),
    iconBtnsLabelled: [...document.querySelectorAll("a.sq, button.tt")].every(
      (el) => (el.getAttribute("aria-label") || "").trim().length > 0
    ),
    ogTags: Object.fromEntries(
      ["og:title", "og:description", "og:image", "og:url", "og:type"].map((p) => [
        p,
        document.querySelector(`meta[property="${p}"]`)?.getAttribute("content") || "",
      ])
    ),
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content") || "",
    resumePdf: !!document.querySelector('a[download][href$=".pdf"]'),
    title: document.title,
  };
});

/* ---------- clock actually ticks ---------- */
const t1 = await page.textContent("#clock");
await page.waitForTimeout(1400);
const t2 = await page.textContent("#clock");
const clockFormat = /^\d{2}:\d{2}:\d{2}$/.test(t2.trim());

/* ---------- henry stats: count-up runs AND leaves the STAT markers intact ---------- */
await page.evaluate(() => document.getElementById("henry-stats").scrollIntoView());
await page.waitForTimeout(1500);
const statDom = await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
  const markers = {};
  let n;
  while ((n = walker.nextNode())) {
    const m = /^STAT:(\w+)$/.exec(n.nodeValue.trim());
    if (m) {
      // the value is the text node sitting between this comment and its closer
      let txt = "";
      for (let s = n.nextSibling; s; s = s.nextSibling) {
        if (s.nodeType === 8 && s.nodeValue.trim() === "/STAT") break;
        if (s.nodeType === 3) txt += s.nodeValue;
      }
      markers[m[1]] = txt.trim();
    }
  }
  return {
    markers,
    ghcount: document.getElementById("ghcount")?.textContent.trim(),
  };
});

/* ---------- desktop screenshot (after every reveal has fired) ---------- */
const idxUnrevealed = await scrollThrough(page);
await page.screenshot({ path: `${REPO}/shots/v3.png`, fullPage: true });

/* ---------- responsive sweep ---------- */
const overflow = {};
for (const w of [360, 375, 768, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(250);
  overflow[w] = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
}
await ctx.close();

/* ============================================================
   CASE-STUDY PAGES
   ============================================================ */
const caseResults = [];
for (const cp of CASE_PAGES) {
  const abs = path.join(REPO, cp.file);
  const res = { ...cp, exists: fs.existsSync(abs), errors: [], external: [], shotPath: `${REPO}/shots/${cp.shot}` };
  if (!res.exists) { caseResults.push(res); continue; }

  const cctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const cpage = await cctx.newPage();
  cpage.on("pageerror", (e) => res.errors.push(String(e)));
  cpage.on("console", (m) => m.type() === "error" && res.errors.push(m.text()));
  cpage.on("request", (r) => {
    const u = r.url();
    if (!u.startsWith("file://") && !u.startsWith("data:") && !u.startsWith("about:")) res.external.push(u);
  });

  await cpage.goto(`file://${abs}`, { waitUntil: "load" });
  await cpage.waitForTimeout(500);

  Object.assign(res, await cpage.evaluate(() => ({
    title: document.title,
    h1Count: document.querySelectorAll("h1").length,
    h1Text: document.querySelector("h1")?.textContent.trim() || "",
    h2s: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    backHref: document.querySelector("header .mark")?.getAttribute("href") || "",
    backText: (document.querySelector("header .mark")?.textContent || "").replace(/\s+/g, " ").trim(),
    rules: document.querySelectorAll(".rule").length,
    hatches: document.querySelectorAll(".hatch").length,
    figs: document.querySelectorAll(".fig svg").length,
    figLabelled: [...document.querySelectorAll(".fig svg")].every(
      (s) => (s.getAttribute("aria-label") || "").trim().length > 20
    ),
    chips: [...document.querySelectorAll(".chip")].map((c) => c.textContent.trim()),
    imgTags: document.querySelectorAll("img").length,
    iconBtnsLabelled: [...document.querySelectorAll("button.tt")].every(
      (el) => (el.getAttribute("aria-label") || "").trim().length > 0
    ),
    httpLinks: [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => /^https?:/i.test(h)),
  })));

  /* theme: dark default → toggle → light → toggle back → dark */
  res.themeDefault = await cpage.getAttribute("html", "data-theme");
  await cpage.click("#tt");
  await cpage.waitForTimeout(150);
  res.themeAfter1 = await cpage.getAttribute("html", "data-theme");
  await cpage.click("#tt");
  await cpage.waitForTimeout(150);
  res.themeAfter2 = await cpage.getAttribute("html", "data-theme");

  /* screenshot (dark, full page, after every reveal has fired) */
  res.unrevealed = await scrollThrough(cpage);
  await cpage.screenshot({ path: res.shotPath, fullPage: true });

  /* responsive sweep */
  res.overflow = {};
  for (const w of [360, 375, 768, 1440]) {
    await cpage.setViewportSize({ width: w, height: 900 });
    await cpage.waitForTimeout(250);
    res.overflow[w] = await cpage.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
  }

  /* back-link actually navigates home (do this last — it leaves the page) */
  await cpage.setViewportSize({ width: 1440, height: 1000 });
  await cpage.click("header .mark");
  await cpage.waitForLoadState("load");
  res.landedUrl = cpage.url();
  res.landedH1 = await cpage.evaluate(() => document.querySelector("h1")?.textContent.trim() || "");

  await cctx.close();
  caseResults.push(res);
}

await b.close();

/* ============================================================
   SOURCE-LEVEL CHECKS
   ============================================================ */
const idxSrc = fs.readFileSync(path.join(REPO, "index.html"), "utf8");
const statsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data", "henry-stats.json"), "utf8"));

// The exact strings that must sit between the STAT markers in index.html.
const expectedStats = {
  queriesAnswered: String(statsJson.queriesAnswered),
  totalMemories: String(statsJson.totalMemories),
  activeFor: statsJson.activeFor,
  marginalCost: statsJson.marginalCost,
  runsOn: statsJson.runsOn,
  generatedAt: new Date(statsJson.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }),
};
const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const srcMarkers = {};
for (const m of idxSrc.matchAll(/<!--STAT:(\w+)-->([\s\S]*?)<!--\/STAT-->/g)) {
  srcMarkers[m[1]] = decode(m[2]).trim();
}
const statMismatches = Object.entries(expectedStats)
  .filter(([k, v]) => srcMarkers[k] !== v)
  .map(([k, v]) => `${k}: baked "${srcMarkers[k] ?? "MISSING"}" ≠ json "${v}"`);
const statDomMismatches = Object.entries(expectedStats)
  .filter(([k, v]) => statDom.markers[k] !== v)
  .map(([k, v]) => `${k}: dom "${statDom.markers[k] ?? "MISSING"}" ≠ json "${v}"`);

/* ---------- link hygiene ---------- */
const httpLinks = dom.links.filter((l) => /^https?:/i.test(l));
const insecure = httpLinks.filter((l) => !l.startsWith("https://"));
const projectRepos = [
  "https://github.com/Luvishgulati03/ai-agent-",
  "https://github.com/Luvishgulati03/luvish-ai-twin-recruiters",
];
// Repos that must NOT be linked anywhere on the page any more.
const bannedRepos = dom.links.filter((l) => /risk-council|carbonnex-website|Compiler-Project/i.test(l));
// Relative .html links from index must resolve to real files.
const caseHrefs = [...new Set(dom.links.filter((l) => /^projects\/.+\.html$/.test(l)))];
const missingCaseFiles = caseHrefs.filter((h) => !fs.existsSync(path.join(REPO, h)));
// Two rows must offer "Case study →"; the rest keep their GitHub repo buttons.
const caseStudyBtns = dom.caseBtns.filter((b) => /^projects\/.+\.html$/.test(b.href));
const repoBtns = dom.caseBtns.filter((b) => /^https:\/\/github\.com\//.test(b.href));
const caseBtnsOk =
  caseStudyBtns.length === 2 &&
  caseStudyBtns.every((b) => /case\s*study/i.test(b.text)) &&
  repoBtns.length === 2 &&
  caseStudyBtns.length + repoBtns.length === dom.caseBtns.length;

const checks = {
  /* ---- index: existing gates ---- */
  "zero console/page errors": errors.length === 0,
  "zero external requests": external.length === 0,
  "no horizontal scroll @360/375/768/1440": Object.values(overflow).every((v) => v === false),
  "nav anchors resolve to real sections": dom.navHrefs.length >= 3 && dom.navTargetsResolve,
  "all v3 sections present": dom.sections.length === 0,
  "single h1 + no heading level skips": dom.h1 === 1 && dom.headingOrderOk,
  "lowercase section titles with a period": dom.h2s.length >= 5 && dom.h2s.every((t) => /^[a-z].*\.$/.test(t)),
  "blueprint framing (dashed rules + hatch strips)": dom.rules >= 3 && dom.hatches >= 4,
  "heatmap present (371 real day cells)": dom.hmCells === 371,
  "heatmap labelled + count matches data": /166 contributions/.test(dom.hmLabelled) && dom.ghCount === "166",
  "clock ticks (hh:mm:ss, value advances)": clockFormat && t1 !== t2,
  "5 project covers + 5 project rows": dom.thumbs === 5 && dom.projRows === 5,
  "3 work-experience rows": dom.xpRows === 3,
  "skill tiles rendered": dom.tiles >= 20,
  "icon-only buttons have aria-labels": dom.iconBtnsLabelled,
  "all external links https": insecure.length === 0,
  "remaining project repos linked": projectRepos.every((r) => dom.links.includes(r)),
  "flagship repo linked": dom.links.includes("https://github.com/Luvishgulati03/ai-agent-"),
  "mailto present": dom.links.some((l) => l.startsWith("mailto:")),
  "linkedin present": dom.links.some((l) => l.includes("linkedin.com/in/")),
  "resume download present": dom.resumePdf,
  "og tags intact": Object.values(dom.ogTags).every(Boolean) &&
    dom.ogTags["og:image"].endsWith("/assets/og.png") &&
    dom.twitterCard === "summary_large_image",
  "no Deepak/reference-site content leaked": !/deepak|notesneo|resumegpt|menuviz|polygo|linknest|wakatime|leetcode/i.test(
    dom.links.join(" ") + " " + dom.title + " " + dom.h2s.join(" ")
  ),

  /* ---- index: new gates ---- */
  "index has zero Compiler references": !/compiler/i.test(idxSrc),
  "no repo links for riskaicouncil / carbonnex / compiler": bannedRepos.length === 0,
  "both work products use a Case study → affordance": caseBtnsOk,
  "case-study links resolve to existing files": caseHrefs.length === 2 && missingCaseFiles.length === 0,
  "STAT markers baked with the JSON's exact values": statMismatches.length === 0,
  "no stray STAT markers (exactly the 6 real keys)":
    Object.keys(srcMarkers).length === 6 &&
    Object.keys(srcMarkers).every((k) => k in expectedStats),
  "STAT markers survive the count-up in the DOM": statDomMismatches.length === 0,
  "count-up lands on the real contribution total": statDom.ghcount === "166",
  "every scroll-reveal section actually reveals": idxUnrevealed === 0,

  /* ---- case pages ---- */
  "case pages exist": caseResults.every((r) => r.exists),
  "case pages: zero console/page errors": caseResults.every((r) => r.errors.length === 0),
  "case pages: zero external requests": caseResults.every((r) => r.external.length === 0),
  "case pages: no horizontal scroll @360/375/768/1440": caseResults.every(
    (r) => r.overflow && Object.values(r.overflow).every((v) => v === false)
  ),
  "case pages: back-link reads '← luvish.' and points home": caseResults.every(
    (r) => r.backHref === "../index.html" && /←\s*luvish\./.test(r.backText)
  ),
  "case pages: back-link navigates to index.html": caseResults.every(
    (r) => /\/index\.html$/.test(r.landedUrl) && r.landedH1.startsWith("Luvish Gulati")
  ),
  "case pages: dark default + theme toggle flips both ways": caseResults.every(
    (r) => r.themeDefault === "dark" && r.themeAfter1 === "light" && r.themeAfter2 === "dark"
  ),
  "case pages: single h1 naming the project": caseResults.every((r) => r.h1Count === 1 && r.h1Text === r.h1),
  "case pages: lowercase section titles with a period": caseResults.every(
    (r) => r.h2s.length >= 4 && r.h2s.every((t) => /^[a-z].*\.$/.test(t))
  ),
  "case pages: blueprint framing (rules + hatch strips)": caseResults.every(
    (r) => r.rules >= 2 && r.hatches >= 3
  ),
  "case pages: labelled inline-SVG diagram, no raster images": caseResults.every(
    (r) => r.figs >= 1 && r.figLabelled && r.imgTags === 0
  ),
  "case pages: role chip present": caseResults.every((r) => r.chips.length >= 2) &&
    caseResults[0].chips.includes("GTM + Content Lead @ Pink Unicorn Algorithms") &&
    caseResults[1].chips.includes("Associate Product Manager"),
  "case pages: theme toggle labelled": caseResults.every((r) => r.iconBtnsLabelled),
  "case pages: all external links https": caseResults.every((r) => r.httpLinks.every((h) => h.startsWith("https://"))),
  "case pages: every scroll-reveal section actually reveals": caseResults.every((r) => r.unrevealed === 0),
};

let failed = 0;
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

if (errors.length) console.log("\nindex errors:", errors);
if (external.length) console.log("index external:", external.slice(0, 5));
if (insecure.length) console.log("insecure links:", insecure);
if (dom.sections.length) console.log("missing sections:", dom.sections);
if (bannedRepos.length) console.log("banned repo links still present:", bannedRepos);
if (missingCaseFiles.length) console.log("missing case files:", missingCaseFiles);
if (statMismatches.length) console.log("stat marker mismatches (source):", statMismatches);
if (statDomMismatches.length) console.log("stat marker mismatches (dom):", statDomMismatches);
for (const r of caseResults) {
  if (r.errors.length) console.log(`${r.file} errors:`, r.errors);
  if (r.external.length) console.log(`${r.file} external:`, r.external.slice(0, 5));
}

console.log(`\nbaked stats: ${JSON.stringify(srcMarkers)}`);
console.log(`screenshots:\n  ${REPO}/shots/v3.png`);
for (const r of caseResults) console.log(`  ${r.shotPath}`);
console.log(`\n${Object.keys(checks).length - failed}/${Object.keys(checks).length} checks passed`);
process.exit(failed ? 1 : 0);
