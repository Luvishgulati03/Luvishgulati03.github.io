// Portfolio pre-publish audit. Run from the henry repo root (Playwright lives there):
//   cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
// Exit 0 = safe to publish. Any FAIL = fix before pushing.
import { chromium } from "playwright";

const PAGE = "file:///Users/luvishgulati/dev/portfolio/index.html";
const b = await chromium.launch();
const errors = [];
const external = [];
const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.route("**/*", (route) => {
  const u = route.request().url();
  if (!u.startsWith("file://") && !u.startsWith("data:")) external.push(u);
  route.continue();
});
await page.goto(PAGE, { waitUntil: "load" });
await page.waitForTimeout(1200);
const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
const checks = {
  "zero console/page errors": errors.length === 0,
  "zero external requests": external.length === 0,
  "no mobile horizontal scroll": !hscroll,
  "mailto present": links.some((l) => l.startsWith("mailto:")),
  "linkedin present": links.some((l) => l.includes("linkedin.com/in/")),
  "resume download present": await page.evaluate(() => !!document.querySelector('a[download][href$=".pdf"]')),
  "flagship repo linked": links.includes("https://github.com/Luvishgulati03/ai-agent-"),
};
await b.close();
let failed = 0;
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}
if (errors.length) console.log("errors:", errors);
if (external.length) console.log("external:", external.slice(0, 5));
process.exit(failed ? 1 : 0);
