# Portfolio v2 — VISUAL-FIRST redesign (Fable, 2026-08-07)

Operator feedback on v1: "too long, too text-heavy, feels bad — more interactive, more
visual, like deepakmodi.dev (the animations)". This spec supersedes design-spec.md for
LAYOUT/DENSITY; content facts still come ONLY from content-dossier.md. v1's copy may be
reused in fragments but cut total visible prose by ~65%. Depth moves behind interactions
(accordions/tabs), never deleted outright.

## What we're taking from the reference (rebuilt vanilla, self-contained)
- Playful nav: letter-stagger hover effect on nav links (each letter lifts/duplicates on
  hover — CSS/JS, no library). Sticky, glassy blur nav.
- Hero: avatar + name huge + a TYPING/cycling line (types, holds, deletes: "I ship
  products." / "I build AI agents." / "I turn PRDs into repos.") with blinking caret.
  Location + IST clock (live, local JS) + pulsing OPEN-TO-WORK badge. Subtle animated
  background: faint grid + 2 slow-drifting radial glows (GPU-cheap, reduced-motion off).
- Avatar: no photo exists — animated gradient-ring "LG" monogram (drop-in <img> slot
  documented in README for when Dad adds a real photo).
- Stats: count-up-on-scroll number tiles (IntersectionObserver), the receipts numbers.
- Projects as VISUAL CARDS: grid of 6, each with a generated inline-SVG cover (stylized
  per project: terminal art for Henry, chat bubbles for AI Twin, gauge for Coding
  Efficiency, shield grid for Risk Council, leaf/chart for CarbonNex, cogs/AST for
  Compiler), tech tag chips, GitHub + live links, hover = lift + tilt (max ~4deg,
  perspective) + accent glow border. Henry card spans 2 columns, tagged FLAGSHIP.
- Skills: icon chip grid (inline SVG marks via CC0 simple-icons paths for ~14 real techs
  from the dossier ONLY — TS, JS, Python, React/RN, Next.js, Flask, MongoDB, SQLite,
  Firebase, Node, Git, Convex(text chip ok), Expo, Playwright) + one slow CSS marquee row
  of product-skill words (PRDs · GTM · Mixpanel · Roadmapping · …). Hover: chip pops.
- Footer: "Built by me + Henry, my AI agent — every commit public" linking the repos,
  small heartbeat pulse animation on the word Henry.

## Keep from v1 (non-negotiable)
- The recorded-session TERMINAL — it becomes the hero of the Henry section, full-width
  centerpiece. Keep replay/skip + reduced-motion static.
- Approval-boundary architecture diagram — collapsed into a "See the architecture" tab or
  accordion within the Henry section (visible on demand, not a wall).
- The 5 decisions → compact interactive accordion cards (question-style headers, e.g.
  "Why no API keys?" — one-tap expand). Honest-misses → 3 small cards, kept.
- Receipts numbers, all real; case studies Risk AI Council + Coding Efficiency compressed
  to ~90 visible words each with a "more" expander; hero CTA row (email/LinkedIn/GitHub/
  résumé); theme toggle (dark default + light); OG/schema/canonical; a11y + AA contrast;
  reduced-motion covers EVERY animation incl. typing, marquee, tilts, count-ups, glows.

## Section order v2 (one page, much shorter visible height)
nav → hero (typing) → stats strip → PROJECTS grid (visual, early! recruiters click
projects) → Henry spotlight (terminal + accordions + diagram tab) → experience as a
compact animated timeline (3 roles, 2 lines each) → skills grid + marquee → contact
mega-CTA → footer easter egg.

## Hard constraints (unchanged)
ONE self-contained index.html, zero external requests, no frameworks/CDN (all animation
vanilla CSS/JS), ≤450KB total page, LCP <1s, mobile-first single column (cards 2→1,
tilt disabled on touch), zero console errors, all v1 acceptance criteria re-verified via
scripts/audit.mjs PLUS: typing animation runs and stops cleanly, marquee pauses on hover,
count-ups fire once, accordions keyboard-accessible (button + aria-expanded), tab order
sane. Screenshots: desktop+mobile × dark+light, hero + full.
