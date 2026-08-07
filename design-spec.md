# Portfolio design spec — Fable, 2026-08-07

Evidence base: recruiter eye-tracking (6–10s homepage scan), PM-portfolio conversion research,
AI-agent demo credibility patterns. Every section decision below is tied to that research —
do not restructure. Facts come ONLY from `content-dossier.md`; never invent metrics.

## Product decisions (locked)

- **One page**, narrative scroll (brittanychiang lineage — engineer-clean) + ONE bento proof
  strip + ONE terminal moment. No multi-page, no router.
- **Audience disambiguation in the hero**: reader must know in seconds this is an *engineer
  who thinks like a PM* pivoting to AI-PM — stated, not inferred.
- **1 flagship case study (Henry) + 2 supporting case studies + compact "more builds" row.**
  Research: >3–4 uneven case studies reads as padding.
- **Contact above the fold AND repeated at the end.** Email, LinkedIn, GitHub, resume PDF —
  one click each, no gates.
- **Honesty as design**: the terminal demo is labeled "recorded session"; learnings section
  includes real misses. All-upside narratives read as staged.

## Copy (locked, builder may only micro-polish)

- H1: `Product-minded engineer. I don't just spec products — I ship them.`
- Sub: `APM → SWE intern → builder of Henry, an open-source AI chief-of-staff that runs my
  job hunt. Looking for AI-PM & product-engineering roles · Bengaluru or remote.`
- Flagship section kicker (large, standalone): `Most PM candidates show decks. I show a
  running agent.`
- Proof strip (bento tiles, big numbers, small labels — from dossier only):
  `516 opens / 447 clicks in 30 days` (notification platform, GrowthX) ·
  `53/57 test scenarios automated` (~2 days QA saved) · `4+ hrs/day of manual ops removed`
  (Rapidero) · `3 products owned as APM` · `$0/mo marginal AI cost` (Henry, local-first) ·
  `6 AI-risk categories shipped` (NIST AI RMF-aligned).
- Section order: Hero → Proof strip → Flagship: Henry → Two case studies → More builds →
  How I think / About → Contact.

## Flagship case study — Henry (the center of gravity)

Follow this template exactly (research: what AI-PM screens grade):
1. **Hook** — started as a job-hunt force multiplier; became the daily driver that schedules,
   remembers, drafts, and watches the inbox.
2. **Decisions — 5 trade-offs, each naming the option NOT chosen** (from dossier/reality):
   local-first memory vs cloud vector DB; subscription-CLI orchestration vs metered API keys;
   approval gate on every outbound action vs full autonomy; score-threshold retrieval vs
   pure top-K; two stores (decaying personal memory vs versioned knowledge) vs one.
3. **Architecture diagram** — inline SVG, perceive → decide → act with the memory system and
   the **approval boundary drawn explicitly** (safety thinking is the AI-PM differentiator).
   Hand-drawn-clean style, labeled, theme-aware colors.
4. **Terminal widget** — "▶ recorded session" replay, typed-out lines (CSS/JS animation):
   a reminder being set in plain English, a knowledge query answered with cited sources,
   an approval prompt refusing to send email without sign-off. Content: realistic Henry
   transcript (writer supplies), clearly labeled recorded, replay + skip controls,
   `prefers-reduced-motion` renders it static-complete.
5. **Metrics row** — open source, TypeScript, local-first on 8GB M1 Air, ~$0 marginal cost,
   sub-second memory recall (real numbers from dossier only).
6. **Learnings — 3 honest misses** (real): the runaway 15-min scheduler that ground an 8GB
   machine down → admission control; cards-first ranking that buried fresh imports → caught
   by the eval harness, fixed with score-interleave; a provider auth failure that masqueraded
   as success → failure-separation rule everywhere.
7. **Artifacts** — repo link + "the README reads like a case study" + architecture doc link.
8. Secondary live proof: link the AI Twin for Recruiters chatbot ("interrogate my AI twin").

Two supporting case studies (shorter, same skeleton: situation → decisions → metric → learning):
**Risk AI Council** (PM/GTM: audience, messaging, 6 risk categories, NIST/EU-AI-Act) and
**Coding Efficiency Measurement System** (0→1 full-stack: Net Efficiency Score grades the
*process*; PRDs ×3 personas; piloted at 2–3 institutions).
More-builds row (compact cards, one line + repo link): AI Twin for Recruiters · CarbonNex ·
C Compiler.

## Visual direction

- **Dark-first**: near-black indigo base (#0a0e1a family), ONE accent — electric cyan/mint
  (terminal-heritage, matches Henry's identity), warm off-white text. Real light theme via
  tokens + toggle + `prefers-color-scheme` (research: CSS-invert fake dark mode is an
  anti-pattern). Persist choice in localStorage.
- Typography: system stack (`-apple-system, Inter, Segoe UI…`) for prose; monospace
  (`SF Mono, JetBrains Mono fallbacks`) for accents, numbers, terminal, section indices
  (`01 /`, `02 /`). Type scale generous; H1 clamp ~2.6–4.5rem.
- Whitespace is the luxury. Max content width ~1080px; case studies ~760px measure.
- Motion: subtle only — scroll-reveal (IntersectionObserver, translateY 12px + fade, once),
  terminal typing, accent underline sweeps on links, bento tiles lift 2px on hover. Full
  `prefers-reduced-motion` support. NO parallax, NO cursor effects, NO 3D.
- Mobile-first single column; bento collapses 3→2→1; terminal widget horizontal-scrolls
  never overflows the page.

## Technical (non-negotiable)

- ONE self-contained `index.html` — inline CSS/JS, zero external requests, no frameworks,
  no CDN. Inline SVG favicon (data URI, "LG" mark or terminal caret). Target LCP < 1s.
- OG/Twitter cards: `assets/og.png` 1200×630 — build a small `og.html` card and screenshot
  it with the Playwright already installed in `~/dev/henry` (reuse that node_modules via
  `NODE_PATH` or a tiny script there — do not npm-install anything new in portfolio/).
- `<title>Luvish Gulati — Product-Minded Engineer & AI Builder</title>`, meta description,
  canonical `https://luvishgulati03.github.io/`, JSON-LD Person schema (name, url, sameAs
  LinkedIn+GitHub, jobTitle, address Bengaluru).
- Semantic landmarks, alt text, AA contrast in both themes, visible focus states,
  `aria-label`s on icon links. Resume: `assets/Luvish_Gulati_Resume.pdf` (already present),
  plain `<a download>`.
- README.md for the portfolio repo itself (repos get audited): what it is, the research-driven
  design rationale in 5 lines, the zero-dependency constraint, how to run (open index.html).

## Acceptance criteria (verified in headless browser before done)

1. Zero console errors; zero external network requests (assert via Playwright route audit).
2. Hero communicates name + level + target + contact with NO scrolling at 1440×900, 390×844.
3. Theme toggle flips and persists; both themes AA-readable; system preference respected.
4. Terminal replay types, is skippable, static under reduced-motion.
5. All links resolve (repo URLs from dossier verbatim, LinkedIn, mailto, resume download).
6. Lighthouse-class perf: single file, no blocking external assets; total page ≤ 400KB
   excluding resume PDF and og.png.
7. Screenshots captured at desktop + mobile in both themes for review.
