// Portfolio pre-publish audit (v3 structure). Run from the henry repo root (Playwright lives there):
//   cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
// Exit 0 = safe to publish. Any FAIL = fix before pushing.
// Also writes a full-page screenshot to shots/v3.png.
import { chromium } from "/Users/luvishgulati/dev/henry/node_modules/playwright/index.mjs";

const REPO = "/Users/luvishgulati/dev/portfolio";
const PAGE = `file://${REPO}/index.html`;

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

/* ---------- desktop screenshot ---------- */
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

await b.close();

/* ---------- link hygiene ---------- */
const httpLinks = dom.links.filter((l) => /^https?:/i.test(l));
const insecure = httpLinks.filter((l) => !l.startsWith("https://"));
// Every project/company link must be https and point somewhere real.
const projectRepos = [
  "https://github.com/Luvishgulati03/ai-agent-",
  "https://github.com/Luvishgulati03/luvish-ai-twin-recruiters",
  "https://github.com/Luvishgulati03/risk-council-final-iterATION-",
  "https://github.com/Luvishgulati03/carbonnex-website",
  "https://github.com/Luvishgulati03/Compiler-Project",
];

const checks = {
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
  "6 project covers + 6 project rows": dom.thumbs === 6 && dom.projRows === 6,
  "3 work-experience rows": dom.xpRows === 3,
  "skill tiles rendered": dom.tiles >= 20,
  "icon-only buttons have aria-labels": dom.iconBtnsLabelled,
  "all external links https": insecure.length === 0,
  "every project repo linked": projectRepos.every((r) => dom.links.includes(r)),
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
};

let failed = 0;
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}
if (errors.length) console.log("errors:", errors);
if (external.length) console.log("external:", external.slice(0, 5));
if (insecure.length) console.log("insecure links:", insecure);
if (dom.sections.length) console.log("missing sections:", dom.sections);
console.log(`\nscreenshot: ${REPO}/shots/v3.png`);
process.exit(failed ? 1 : 0);
