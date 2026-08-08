# luvishgulati03.github.io — personal portfolio (v3)

Hand-written HTML — one homepage plus two self-contained case-study pages. No frameworks, no
build step, no dependencies, no external requests. Open `index.html` in a browser and that's the
whole site.

**Live:** https://luvishgulati03.github.io/

> Editing this repo with an agent? Read **[AGENT-GUIDE.md](AGENT-GUIDE.md)** first — file map,
> the baked-data marker conventions, and the rules that aren't negotiable.

## Design language

A **blueprint grid**: a single centred ~1060 px column on a pitch-dark ground, framed by 1 px
dashed rules with small corner tick marks at every section intersection, and diagonal-hatch
strips separating the major sections. Section titles are lowercase with a period —
`work experience.`, `featured projects.`, `technical skills.`, `github.`, `henry stats.`

1. **Recruiters scan a homepage in 6–10 seconds**, so the profile row states name, role,
   location and a live IST clock above the fold, with every contact route one row below.
2. **One flagship beats five even ones.** Henry (an open-source local-first AI agent) leads the
   project list and is the only row carrying a `FLAGSHIP` tag.
3. **Honesty is a design element.** The `github.` heatmap shows the *real* contribution total
   pulled from the GitHub GraphQL API — not a flattering invention. The decorative mosaic in the
   hero band is `aria-hidden` and carries no count, precisely so it can't be misread as data.
   The one project without a public repo says "case study · private repo" instead of a dead link.
4. **Dark-first with a real light theme** — tokenised, toggled and persisted. Inverting a dark
   site with a CSS filter is an accessibility anti-pattern, so light is a genuine second palette.

## GitHub contribution data

The shipped page makes **zero** network requests, so contribution data is fetched at build time
and baked into the HTML as static markup.

```sh
# 1. refresh the source data (requires `gh auth login`)
gh api graphql -f query='query { user(login: "Luvishgulati03") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }' \
  > data/github-contributions.json

# 2. re-bake into index.html (idempotent)
node scripts/build-heatmap.mjs
```

`scripts/build-heatmap.mjs` rewrites the regions between the `<!--GH_GRID-->`, `<!--GH_MONTHS-->`
and `<!--HERO_BAND-->` markers, and keeps the headline count and the heatmap's `aria-label` in
sync with `data/github-contributions.json`. The count on the page is always whatever is in that
file — never hand-edited.

## Adding a real photo (avatar slot)

There is no photo yet, so the profile row shows a monochrome **LG** monogram. To swap in a real
headshot, drop the file at `assets/me.jpg` and replace the avatar block in `index.html`
(search for `<!-- Swap for`):

```html
<img class="avatar" src="assets/me.jpg" alt="Luvish Gulati" width="88" height="88">
```

Nothing else changes — `.avatar` already carries `object-fit: cover`. (Optionally drop
`filter: grayscale(1)` from the `.avatar` rule if the photo should be in colour.)

## Constraint: zero dependencies

Everything — CSS, JS, the project cover art, the skill icons, the favicon — is inline in
`index.html`. Nothing is fetched at runtime: no CDN, no web fonts (system stack only), no
analytics, no trackers, no hotlinked logos. This is enforced, not aspirational: the audit fails
if a single request leaves `file://`.

## How to run

```
open index.html          # macOS
```

No install, no server, no `npm`.

## Layout

```
index.html                       the homepage
AGENT-GUIDE.md                   context file for agents editing this repo
index-v2-backup.html             previous version, kept for reference
content-dossier.md               the only source of factual claims on the site
projects/risk-ai-council.html    case study — Risk AI Council (GTM + content)
projects/carbonnex.html          case study — CarbonNex (ESG reporting workflows)
data/henry-stats.json            real Henry numbers, baked in between STAT markers
data/github-contributions.json   GitHub GraphQL response, baked in at build time
scripts/build-stats.mjs          reads Henry's live DBs → data/henry-stats.json
scripts/build-heatmap.mjs        bakes contribution data into index.html
scripts/audit.mjs                pre-publish gate (also writes the review screenshots)
assets/Luvish_Gulati_Resume.pdf  résumé (linked with <a download>)
assets/og-card.html              1200×630 source for the social card
assets/og.png                    rendered card, referenced by og:image / twitter:image
shots/                           review screenshots
```

## Real numbers, baked in

The `henry stats.` section shows live figures from Henry's own databases — queries answered,
memories formed, how long it's been running. They're baked into the HTML between
`<!--STAT:key-->…<!--/STAT-->` comment markers so the page still makes zero network requests, and
refreshed by re-running `scripts/build-stats.mjs` and re-injecting between the markers. The audit
fails if any baked value disagrees with `data/henry-stats.json`. Full flow in
[AGENT-GUIDE.md](AGENT-GUIDE.md).

## Verified before shipping

```sh
cd ~/dev/henry && node ~/dev/portfolio/scripts/audit.mjs
```

47 headless-Chromium checks across the homepage and both case-study pages: zero console errors,
zero external requests, no horizontal scroll at 360/375/768/1440, every nav anchor resolves,
single `h1` with no heading-level skips, lowercase-period section titles, blueprint framing
present, 371 real heatmap cells with the count matching the data file, the clock actually ticks,
every project linked over https, icon-only buttons carry `aria-label`s, og/twitter tags intact,
the STAT markers hold exactly the values in `data/henry-stats.json` and survive the count-up
animation, both case pages load clean with a working back-link and theme toggle, and no content
from the reference site leaked in.

## Contact

Luvish Gulati — Bengaluru, India
[Gulatiluvish@gmail.com](mailto:Gulatiluvish@gmail.com) ·
[LinkedIn](https://www.linkedin.com/in/luvish-gulati-282a84184) ·
[GitHub](https://github.com/Luvishgulati03)
