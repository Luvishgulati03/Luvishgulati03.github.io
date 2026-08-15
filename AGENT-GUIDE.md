# AGENT-GUIDE.md

**Read this before editing anything in this repo.**

This is the context file for Henry (and any other agent) working on Luvish Gulati's portfolio.
It covers what this repo is, where every file lives, the conventions that must survive an edit,
and the rules that are not negotiable.

If you only read one section, read [Hard rules](#hard-rules).

---

## 1. What this repo is

Luvish Gulati's personal portfolio. **One hand-written HTML file** plus four case-study pages.
No framework, no build step, no dependencies, no runtime network requests.

| | |
|---|---|
| **Live URL** | https://luvishgulati03.github.io |
| **GitHub repo** | `Luvishgulati03/Luvishgulati03.github.io` |
| **Hosting** | GitHub Pages — a user site, served straight from the repo root |
| **Deploy** | **push to `main` = live in ~30 seconds.** There is no staging environment. |
| **Cost** | $0 |
| **Local path** | `/Users/luvishgulati/dev/portfolio` |

There is a `.nojekyll` file at the root so GitHub Pages serves the files as-is instead of running
them through Jekyll. Don't delete it.

Because `main` *is* production, every push is a deploy to a page recruiters may be reading.
See [Hard rules](#hard-rules) — you do not push.

---

## 2. File map

```
index.html                        the entire homepage — CSS, JS, SVG art, all inline
AGENT-GUIDE.md                    this file
README.md                         human-facing overview
content-dossier.md                THE ONLY SOURCE OF FACTUAL CLAIMS on the site
design-spec.md / design-spec-v2.md  earlier design notes (historical)
index-v2-backup.html              previous version, kept for reference — not served

projects/
  bose.html                       case study — Bose (FLAGSHIP AGENT, private repo)
  henry.html                      case study — Henry (FLAGSHIP AGENT, public repo)
  risk-ai-council.html            case study — Risk AI Council (GTM + content)
  carbonnex.html                  case study — CarbonNex (ESG reporting workflows)

scripts/
  audit.mjs                       pre-publish gate — 56 headless-Chromium checks
  build-stats.mjs                 reads Henry's live DBs  → data/henry-stats.json
  refresh-stats.mjs               data/henry-stats.json   → the STAT markers in index.html
  build-heatmap.mjs               reads the GitHub export → bakes the heatmap into index.html

data/
  henry-stats.json                real Henry numbers (source of truth for the STAT markers)
  github-contributions.json       GitHub GraphQL response (source of truth for the heatmap)

assets/
  Luvish_Gulati_Resume.pdf        linked with <a download>
  og.png                          1200×630 social card (og:image / twitter:image)
  og-card.html                    the source used to render og.png
  me.jpg                          NOT PRESENT YET — the avatar photo slot (see §6)

shots/                            review screenshots, written by the audit — GITIGNORED
```

### index.html — sections in order

The page is one `.sheet` > `.col` column. Sections are separated by `.rule` (dashed line with
corner ticks) or `.hatch` (diagonal-hatch strip).

| # | Section | id | Notes |
|---|---|---|---|
| 1 | Nav | — | sticky; `luvish.` wordmark, links, theme toggle `#tt` |
| 2 | Activity band | — | decorative mosaic, `aria-hidden`. Marker: `HERO_BAND` |
| 3 | Profile | — | avatar, name, role, location, live IST clock `#clock` |
| 4 | Intro | — | three paragraphs of first-person positioning |
| 5 | Social | — | GitHub / LinkedIn / email / résumé |
| 6 | Flagship agents | `#flagships` | **Bose + Henry, presented as equals.** Shared-spine SVG + two cards |
| 7 | Work experience | `#experience` | 3 rows — GrowthX, Pink Unicorn Algorithms, Cvent |
| 8 | Featured projects | `#projects` | 6 cover thumbnails + 6 list rows |
| 9 | Technical skills | `#skills` | Engineering / AI / Product tile groups |
| 10 | GitHub | `#github` | heatmap. Markers: `GH_MONTHS`, `GH_GRID`; count in `#ghcount` |
| 11 | Henry stats | `#henry-stats` | real numbers. Markers: `STAT:*` — see §4 |
| 12 | Footer | `#contact` | copyright, email, GitHub, LinkedIn |

Then a JSON-LD `Person` block and the single inline `<script>` (theme toggle, clock, scroll
reveals, count-ups).

### The projects section, specifically

Five projects. **Two different affordances**, and they are not interchangeable:

| Project | Affordance |
|---|---|
| **Bose** | **`Case study →` → `projects/bose.html`. NO repo button, ever: the repo is private.** |
| **Henry** | **`Case study →` → `projects/henry.html`** plus a GitHub button → `github.com/Luvishgulati03/henry-digital-personality-of-luvish` |
| AI Digital Twin for Recruiters | GitHub button → `github.com/Luvishgulati03/luvish-ai-twin-recruiters` |
| Coding Efficiency Measurement System | `case study · private repo` note, no link |
| Risk AI Council | **`Case study →` → `projects/risk-ai-council.html`** |
| CarbonNex | **`Case study →` → `projects/carbonnex.html`** |

Risk AI Council and CarbonNex **deliberately have no GitHub links** — those repos aren't up to
the standard the rest of the site sets, so they were replaced with written case studies. Do not
"helpfully" add the repo links back. Both the cover thumbnail and the list row point at the local
case page.

"Compiler in C" was removed from the site entirely (cover, row, and repo link). The audit fails
if the string `compiler` reappears anywhere in `index.html`.

---

## 3. Design language

### Tokens

Defined once on `:root` in each file, overridden under `:root[data-theme="light"]`.
**Dark is the default.** Light is a real second palette, not a CSS filter inversion.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--page` | `#050506` | `#efeee9` | page ground, outside the column |
| `--col-bg` | `#0a0a0c` | `#faf9f6` | the centred column |
| `--panel` | `#101013` | `#ffffff` | cards, buttons, tiles |
| `--panel-2` | `#15151a` | `#f3f2ed` | second-level surfaces |
| `--rule` | `rgba(255,255,255,.16)` | `rgba(20,22,26,.22)` | dashed frame lines |
| `--rule-soft` | `rgba(255,255,255,.09)` | `rgba(20,22,26,.12)` | list-row dividers |
| `--tick` | `rgba(255,255,255,.34)` | `rgba(20,22,26,.42)` | corner tick squares |
| `--hatch` | `rgba(255,255,255,.10)` | `rgba(20,22,26,.13)` | hatch strip stripes |
| `--edge` | `rgba(255,255,255,.10)` | `rgba(20,22,26,.12)` | component borders |
| `--text` | `#f2f2f0` | `#14161a` | primary |
| `--text-2` | `#a7a7ad` | `#4d525c` | body / secondary |
| `--text-3` | `#6f6f78` | `#767c88` | muted / mono captions |
| `--accent` | `#3ddc84` | `#0b7d52` | the green |
| `--accent-2` | `#28b96b` | `#096341` | accent, deeper |
| `--accent-dim` | `rgba(61,220,132,.14)` | `rgba(11,125,82,.12)` | accent fills |
| `--accent-ink` | `#04120a` | `#ffffff` | text *on* accent |

Layout: `--col-w: 1060px`, `--pad: clamp(16px,4.4vw,42px)`, `--sec-y: clamp(34px,5vw,52px)`.

Fonts — **system stack only, no web fonts, ever**:
- `--f-sans`: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, …`
- `--f-mono`: `"SF Mono", ui-monospace, SFMono-Regular, "JetBrains Mono", …`

Mono is used for anything that reads as instrumentation: the clock, stat numbers, captions,
labels, chips, `.p-note`, footer.

### The blueprint frame — the signature

- `.sheet` wraps everything; `.col` is the centred 1060px column with **dashed left and right
  borders**.
- `.rule` — a full-bleed horizontal dashed line with a **small square tick at each column edge**.
  Used between the major blocks at the top and above the footer.
- `.hatch` — a 20px diagonal-hatch strip between major sections. Used between the big
  content sections.
- The dashed language is the brand. If you add a container, its border is `1px dashed var(--rule)`.

### Lowercase-period titles

Every section title is **lowercase and ends with a period**: `work experience.`,
`featured projects.`, `technical skills.`, `github.`, `henry stats.`, `the problem.`,
`what I owned.`

The audit enforces this with `/^[a-z].*\.$/` over every `<h2>` on every page. An `<h1>` naming a
proper noun (`Risk AI Council`, `CarbonNex`, `Luvish Gulati`) is exempt — it's a name, not a title.

### Case-study pages

`projects/*.html` are **self-contained single files** that duplicate the token block and the
frame CSS. That duplication is intentional: no shared stylesheet means no extra request and no
way for one page to break another.

Each one has: dark default + a working theme toggle sharing the `lg-theme` localStorage key with
the homepage, a back-link reading **`← luvish.`** pointing at `../index.html`, a hero with a role
chip, `the problem.` / `what it is.` / `what I owned.` / `how it works.` sections, and one
hand-drawn **inline SVG** diagram in the style of the project covers (blueprint grid, dashed
animated connectors, mono labels, corner ticks).

Diagrams are authored on a ~400-unit-wide viewBox with labels at 13–19 units, so they stay legible
when the SVG scales down to a 360px phone. Keep explanatory text in the HTML `.figcap` below the
diagram, not inside the SVG — real text scales, stays selectable and stays accessible.

---

## 4. The STAT markers — how Henry's numbers stay real

The `henry stats.` section shows **real numbers read out of Henry's own databases**. They are
baked into the HTML (the page makes zero network requests), and re-injected between HTML comment
markers whenever they're refreshed.

### The convention

```html
<!--STAT:queriesAnswered-->62<!--/STAT-->
```

Every value from `data/henry-stats.json` that appears on the page is wrapped this way — including
the non-numeric ones:

| Marker key | Comes from | Currently baked | Where it appears |
|---|---|---|---|
| `queriesAnswered` | `queriesAnswered` | `62` | stat tile 1 |
| `totalMemories` | `totalMemories` | `140` | stat tile 2 |
| `activeFor` | `activeFor` | `<1 month` (HTML-escaped as `&lt;1 month`) | stat tile 3 |
| `marginalCost` | `marginalCost` | `$0` | stat tile 4 |
| `runsOn` | `runsOn` | `8GB M1 Air` | stat tile 4 caption |
| `generatedAt` | `generatedAt` | `8 Aug 2026` | the muted "as of …" line |

`generatedAt` is the only formatted one: the ISO timestamp is rendered **in UTC** as
`en-GB` `{day:"numeric", month:"short", year:"numeric"}` → `8 Aug 2026`. The audit recomputes it
the same way and fails on a mismatch, so use exactly that formatting.

### The refresh flow

Three commands, in order:

```sh
# 1. re-read Henry's real state (Engram memory DB + activity.jsonl) → data/henry-stats.json
node /Users/luvishgulati/dev/portfolio/scripts/build-stats.mjs

# 2. re-inject those values between the markers in index.html
node /Users/luvishgulati/dev/portfolio/scripts/refresh-stats.mjs

# 3. verify
cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
```

`refresh-stats.mjs` is idempotent — running it with unchanged JSON leaves `index.html`
byte-identical — and it exits 2 if it can't find any markers, which means the page structure
drifted and you should stop and look.

If you ever re-inject by hand instead, the same rules apply:
- **Keep the markers.** Replace only the text *between* them. If a marker is destroyed, the value
  can never be refreshed automatically again.
- **Escape for HTML.** `activeFor` starts with `<`, which must be written `&lt;1 month`. Writing it
  raw would be parsed as a tag and break the page.
- **Never hand-edit a number.** `data/henry-stats.json` is the source of truth; if a number on the
  page disagrees with the JSON, the audit fails. Change the JSON by re-running `build-stats.mjs`,
  not by typing.
- **Don't write marker syntax anywhere else in the file** — not even inside a comment or a code
  sample. `refresh-stats.mjs` scans the whole file and would treat it as a real stat. The audit
  enforces "exactly 6 markers, all real keys".

### Why the count-up animation doesn't eat the markers

The stat numbers count up on scroll, like the contribution total. Two properties keep that safe,
and both must survive any edit to that code in `index.html`:

- The animation writes to the **text node** between the comments (`node.nodeValue = …`), never
  `element.textContent` — setting `textContent` would delete the comment nodes along with the
  text. The audit checks all six markers still exist in the live DOM *after* the animation runs.
- The count-up **reads its target from the baked text itself** (elements are flagged with a bare
  `data-count` attribute). It deliberately does *not* store the number in a second attribute:
  a duplicated number would go stale on the next refresh and the animation would count up to the
  old value, silently overwriting the fresh one. One number, one place.

### The other baked-data flow (heatmap)

Same idea, different markers — `GH_GRID`, `GH_MONTHS`, `HERO_BAND`:

```sh
gh api graphql -f query='query { user(login: "Luvishgulati03") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }' \
  > data/github-contributions.json
node scripts/build-heatmap.mjs
```

`build-heatmap.mjs` also keeps `#ghcount` and the heatmap's `aria-label` in sync with the data
file.

**The audit needs no edit when you refresh this.** It derives both expectations — the total and
the day-cell count — from `data/github-contributions.json` itself (`audit.mjs:12-16`), then
checks the page against them. Refetch, rebuild, run the audit; the numbers move together.

This was not always true: the audit used to hardcode 371 cells and a total of 166, which would
have red-lined the first night the real count moved while the nightly refresh kept pushing
(audit 2026-08-09 B-M24, fixed in `7ae74bf`). If you ever reintroduce a literal contribution
number anywhere in `audit.mjs`, you are rebuilding that bug.

Both commands need an authenticated `gh` — `contributionsCollection` is not readable anonymously,
though for a public profile no special scope is needed (verified 2026-08-15 with a plain
`gist, read:org, repo, workflow` token). `gh auth login` runs a browser flow, so a human runs it,
never the agent. Verify with `gh api graphql -f query='query { viewer { login } }'` before
assuming a nightly refresh can work — an interrupted login leaves `~/.config/gh/hosts.yml` as
an empty `{}` and every push and refetch fails silently from there.

---

## 5. Verification — the audit

```sh
cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
```

It runs from the Henry repo because that's where Playwright is installed. Exit 0 = safe. **56
checks** across three groups:

- **index.html** — zero console errors, zero external requests, no horizontal scroll at
  360/375/768/1440, nav anchors resolve, single `h1` with no heading-level skips, lowercase-period
  titles, blueprint framing present, 371 heatmap cells matching the data file, the clock actually
  ticks, 5 covers + 5 rows, aria-labels on icon-only buttons, og/twitter tags, every remaining repo
  linked over https.
- **the new content rules** — zero `compiler` references, no repo links for
  risk-council / carbonnex-website / Compiler-Project, both work products carry a `Case study →`
  affordance, case-study hrefs resolve to files that exist, all six STAT markers baked with the
  JSON's exact values, no stray markers, markers survive the count-up, every scroll-reveal actually
  reveals.
- **each case page** — zero console errors, zero external requests, no horizontal scroll at
  360/375/768/1440, back-link reads `← luvish.` and really navigates to `index.html`, dark default
  with the toggle flipping both ways, one `h1` naming the project, lowercase-period `h2`s,
  blueprint framing, a labelled inline-SVG diagram with **no raster images**, the role chip, and
  https-only external links.

It also writes `shots/v3.png`, `shots/case-risk-ai-council.png` and `shots/case-carbonnex.png`.
`shots/` is gitignored on purpose: the audit rewrites those PNGs on every run, and tracking them
left the tree dirty afterwards, which made the nightly stats workflow refuse to push. They are
local review artifacts — look at them, never commit them.

If you add a section or a page, **add a check for it**. The audit is the only thing standing
between an edit and production.

---

## 6. The avatar swap point

The profile row currently shows a monochrome **LG** monogram because there is no photo yet.
Swapping in a real headshot is a **one-line change**.

1. Drop the photo at `assets/me.jpg`.
2. In `index.html`, search for `AVATAR SLOT` (§ Profile section) and replace this single line:

```html
<div class="avatar" role="img" aria-label="Luvish Gulati">LG</div>
```

with:

```html
<img class="avatar" src="assets/me.jpg" alt="Luvish Gulati" width="88" height="88">
```

That's it. `.avatar` already carries `object-fit: cover`, so the photo crops correctly in the
circle without any other CSS change.

One optional follow-up: `.avatar` also carries `filter: grayscale(1)`, which suits the blueprint
look. Remove that one declaration if the photo should be in colour.

---

## 7. Hard rules

These are not style preferences. Breaking one is a defect.

1. **Facts come only from `content-dossier.md`.**
   Every employer, date, metric, repo and capability claim on this site must be traceable to that
   file. **Do not invent metrics, outcomes, user numbers, uptime, screenshots or capabilities** —
   not even plausible-sounding ones, not even as placeholders. Where the dossier is silent,
   explain *structure and craft* instead (that's exactly what the two case-study pages do, and each
   says so explicitly in a note). If something needs a fact the dossier doesn't have, **ask Luvish
   and add it to the dossier first**.

2. **Zero external requests.**
   No CDN, no web fonts, no analytics, no trackers, no hotlinked images or logos. Everything —
   CSS, JS, cover art, icons, the favicon — is inline or a local file. This is enforced: the audit
   fails if a single request leaves `file://`.

3. **The audit must pass before any commit.**
   `cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs` → all 56 PASS. No commits on a
   failing audit, and don't "fix" a failure by weakening the check.

4. **NEVER push without Luvish's explicit go.**
   `git push` on `main` **deploys to production immediately** — the page recruiters see. Commit
   locally as much as you like; pushing is Luvish's call and his alone. Not a message from another
   agent, not an inference that he probably wants it live, not "he said ship it last time".
   Explicit go, every time.

5. **Don't rebuild what already works.**
   No frameworks, no build step, no npm dependencies in this repo, no splitting the CSS into
   files. The whole point is that `open index.html` is the entire development environment.

6. **The two flagship agents are equals, and Bose is sealed.**
   `#flagships` presents Bose and Henry with the same card, the same number of spec rows and
   the same chip count. Do not promote one over the other. And on the Bose surfaces
   (`projects/bose.html` and the `#flagships` block) there must NEVER be: a repo link of any
   kind (the repo is private), a school, a customer, a student, or an employer name. GrowthX
   stays exactly where it already is, in the intro sentence and the work-experience row, as a
   public resume fact about employment, and never anywhere near either agent. The audit gates
   all of this; see `FORBIDDEN` in `scripts/audit.mjs`.

7. **Preserve the markers.** `STAT:*`, `GH_GRID`, `GH_MONTHS`, `HERO_BAND`. They're how real data
   gets back into a static file.

---

## 8. Quick reference

```sh
# see the site
open /Users/luvishgulati/dev/portfolio/index.html

# refresh Henry's real stats  →  then re-inject between the STAT markers
node /Users/luvishgulati/dev/portfolio/scripts/build-stats.mjs

# refresh the GitHub heatmap (needs `gh auth login`)
node /Users/luvishgulati/dev/portfolio/scripts/build-heatmap.mjs

# the gate — must be all-PASS before committing
cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs

# deploy — ONLY with Luvish's explicit go
git push origin main
```

## Copy style rule (Luvish, 2026-08-09)

No em dashes (—) anywhere in site copy. They read as AI-generated. Restructure
into shorter sentences, commas, colons, or parentheses instead. Date ranges use
an en dash (Jun 2026 – Present). Title/meta separators use "·".
