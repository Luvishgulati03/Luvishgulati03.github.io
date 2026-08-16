# Portfolio content dossier — Luvish Gulati (facts only; single source of truth for the build)

All facts below are verified from the resume, live GitHub, or the Henry codebase. The builder
must not invent metrics, employers, or capabilities beyond this file.

## Identity
- Name: **Luvish Gulati**
- Positioning: **AI-native product engineer** — currently a software engineering intern
  who owns products across discovery, architecture, implementation, launch, GTM and
  analytics. Targeting AI product-engineering roles with a clear path into AI product
  management. This wording is intentionally honest about the current title while making
  the product direction clear.
- Location: Bengaluru, India (Domlur)
- Email: Gulatiluvish@gmail.com
- LinkedIn: https://www.linkedin.com/in/luvish-gulati-282a84184
- GitHub: https://github.com/Luvishgulati03
- Education: B.Tech CS, Amity University (2021–2025)
- Resume PDF: available for download button (file supplied at build time)

## Experience (for timeline/about — keep employer names, they're public resume facts)
1. **GrowthX** — Software Engineering Intern (Jun 2026–present, Bengaluru).
   Built an end-to-end notification platform (React Native/Expo, Next.js, Convex, FCM):
   native + in-app + web push + email digests, unified preferences, per-channel controls,
   read states. Shipped improvements generating **516 opens / 447 clicks in 30 days**.
   Built an AI operations agent drafting Slack replies; led app-install GTM; ADB test
   framework covering **53/57 notification scenarios (~2 days QA saved)**.
2. **Pink Unicorn Algorithms (Globerra)** — Associate Product Manager (Aug 2025–May 2026).
   Owned 3 products: CarbonNex (ESG reporting), Rapidero (6 logistics modules, automated
   shipment pricing — **4+ hrs/day manual work removed**), Risk AI Council (GTM + Content
   Lead: NIST AI RMF / EU AI Act aligned learning programs). Built AI voice agents (GetVocal.ai).
3. **Cvent** — Associate Product Consultant Intern (Jun–Aug 2025). 10+ enterprise accounts;
   client journeys → product briefs; proposed AI support solution to leadership.

## Projects (curated — quality over quantity; dupes/forks excluded)

### 1. FLAGSHIP — Henry: a personal AI agent / digital twin (open source)
- Repo: https://github.com/Luvishgulati03/henry-digital-personality-of-luvish
- One-liner: a terminal-first AI chief-of-staff that remembers, learns, schedules, and acts —
  built local-first on an 8GB M1 Air for ₹0 API spend per run (no API keys; orchestrates
  subscription CLIs).
- Architecture points (all real, all in the repo):
  - **Memory engine (flagship module)**: files-as-truth + SQLite index; hybrid retrieval
    (vector cosine + full-text, rank-fused) plus **spreading activation** over a typed
    memory graph; episodic/semantic/procedural tiers; decay, reinforcement, supersede;
    every recall returns an explainable trace.
  - **Knowledge RAG**: local embeddings (bge-small-en-v1.5, 384d, ~10ms, ₹0 API spend), contextual-prefix
    chunking, score-threshold + per-source caps + domain boosts, distilled "strategy cards"
    layer, precision@5/MRR eval harness gating every ranking change.
  - **Safety by construction**: explicit approval gate — nothing outbound (email, GitHub,
    applications) without operator sign-off; drafts-only Gmail integration.
  - **Orchestration**: dispatches work to multiple provider CLIs with session reuse, intent
    tiering (light/default/heavy models), subprocess admission control tuned for 8GB RAM.
  - **Autonomy**: cron scheduler (reminders, random-daily mail checks, pre-approved execution),
    macOS + Telegram notifications, job-application tracker.
  - **Mission-control dashboard**: live SSE heartbeat, 3D memory hologram, recall lab that
    lights up the activation subgraph and explains *why* each memory matched, latency/coverage
    metrics with engine-failure separation.
- Story angle: built as a job-search force multiplier and a daily driver — the portfolio
  itself is tracked by it. Product thinking: every module has acceptance criteria, evals
  before tuning, measured latency budgets.

### 2. AI Digital Twin for Recruiters
- Repo: https://github.com/Luvishgulati03/luvish-ai-twin-recruiters (has a ⭐)
- Context-aware chatbot recruiters can interrogate about Luvish — his experience, projects,
  and working style — instead of reading a static resume.

### 3. Coding Efficiency Measurement System (full-stack assessment platform)
- No public repo — present as a case study (Python/Flask/SQLite/JS).
- **Net Efficiency Score**: grades the coding *process*, not just output — keystrokes,
  idle time, tab switches, copy/paste, debugging patterns, focus intervals, complexity.
- Role-based workflows (admin/teacher/student), code execution, session recording;
  PRDs for all three personas; piloted at **one institution, Amity University Noida
  (AUUP)**, where Luvish studied.

### 4. Risk AI Council (work product — PM/GTM case study)
- Repo: https://github.com/Luvishgulati03/risk-council-final-iterATION- (final iteration)
- AI-risk assessment platform; Luvish owned the assessment structure, six-category
  taxonomy, learning programs, target users, launch messaging, site structure and
  website design. The taxonomy aligns to NIST AI RMF and the EU AI Act.

### 5. CarbonNex (work product — product case study)
- Repo: https://github.com/Luvishgulati03/carbonnex-website
- ESG compliance-management product; Luvish designed the full software architecture as
  APM, with the goal of automating how organisations collect ESG data, handle gaps and
  prepare compliance reporting.

### 6. Compiler in C (engineering depth signal)
- Repo: https://github.com/Luvishgulati03/Compiler-Project
- A compiler built in C (lexer → parser → semantic analysis → codegen) for a Compiler
  Construction course — proof of CS fundamentals.

### Excluded (dupes/minor): carbonnexupdatedfinal, RISK-COUNCIL-ASSESSMENT-2,
ai-risk-council-assessment-website-, apr, django-appointment (library fork), dance-with-me,
insighthub-globerra-, personal-ai-agent-starter (mention inside Henry story if useful).

## Skills (group, don't wall-of-tags)
Product: Discovery, PRDs, Roadmapping, GTM, User Journeys, Mixpanel, Agile.
Engineering: TypeScript/JavaScript, Python, React Native/Expo, Next.js, Flask, Convex,
MongoDB/MySQL/SQLite, Firebase, REST, System Design, ADB, Automated Testing.
AI: LLMs, agentic systems, RAG, prompt engineering, conversational AI, workflow automation.

## Voice
Confident, concrete, zero fluff. Every claim tied to a shipped thing or a number.
First person. No "passionate about leveraging synergies" language, ever.

## Update 2026-08-09 — GrowthX breadth + Henry capabilities (canonical)

GrowthX shipped work (public-safe phrasing — NO internal ticket numbers, repo
names, or internal usage metrics on the site): community notifications to mobile
end to end (unified in-app+push gating, per-channel/per-type preferences with
timed mutes, native OS banners, membership + broadcast-pagination fixes);
member-connect notification matrix + web push + email-digest controls; events —
AI field reviewer + completeness gate on submissions, venue-help concierge,
reviewer alerts; app-install GTM banner across transactional emails with
UTM-tracked deep links; device-level notification E2E harness (drives a real
device over adb, asserts push-vs-silence against the OS); Mixpanel
instrumentation shipping with features.

Henry one-liner capabilities (site intro): human-like memory engine (semantic +
lexical recall over an associative graph, nightly consolidation), cited RAG over
GTM/PM playbooks, Telegram standup bot, morning job scout, approval-gated
outbound, maintains + deploys this website. ₹0 API spend per run, 8GB M1 Air.

## Update 2026-08-15 — TWO FLAGSHIP AGENTS (canonical, supplied by Luvish)

Positioning, verbatim intent: **two flagship agents, one architecture.**
"Henry runs my life; Bose teaches a school." Bose is the headline (the product);
Henry is the origin story (the personal agent Bose was extracted from). On the
site they carry **equal weight**; neither is the sidekick.

### Henry (refreshed — supersedes the 2026-08-09 capability list above for site copy)

Terminal-first personal AI agent, now positioned as Luvish's **project-management
twin**. Real and shipped:

- **Two-store memory (Engram)** plus a separate **knowledge RAG** over **900+
  modules**, whose ranking changes are **eval-gated**.
- **Routing brain**: picks the capability and the model tier per request.
- **Job-scout pipeline**: Naukri + open web + X, batched scoring against his
  resume, producing a daily shortlist.
- **Format-locked resume / cover-letter tailoring** (output must return in the
  exact document format, not free prose).
- **Telegram two-way DM bridge**, all of it behind a **single update pump**.
- **Standup module**: group intake, clarify pass, daily summaries.
- **Scheduler and reminders.**
- **Mission-control dashboard.**
- **Daily tech-tweet pipeline** with hard safety rails: one post per day, a kill
  switch, and every post mirrored back to him.
- TypeScript ESM, a zero-heavy-dependencies approach, and runs on an **M1 Air**.
- Public repo (already linked on the site):
  https://github.com/Luvishgulati03/henry-digital-personality-of-luvish

### Bose (new)

Henry's twin for schools: an **AI teacher and proctor**. Real and shipped:

- **Privacy-first identity airlock**: AES-256-GCM vault, pseudonymous IDs,
  scrub-before-persist. A student's name never reaches an external model.
- **Class-scoped RAG** over the school's own syllabus + answer bank, on **local
  embeddings** (₹0 API spend per run).
- **Tutor mode**: guide / hint / full-answer policies, plus per-student style cards.
- **Pattern-learned question-paper engine**: blueprints extracted from past
  papers, then new papers with model answers and rubrics, relevance-guarded.
- **Online test site**: auto-grading, per-question right/wrong feedback, pass/fail.
- **Exam mode**: timed windows, randomized question order, identity checks and integrity
  signals for tab switches, fullscreen exits, copy/paste and device changes. Camera-based
  checks run in the browser; video never leaves the device.
- **Teacher evidence and controls**: teachers can inspect the evidence timeline, scores,
  student activity and decision history.
- **Karma points + tier ladder + class leaderboards.**
- **Teacher automation**: grading suggestions, doubt clustering, worksheets;
  everything student-facing sits behind **teacher approval**.
- **Right-to-forget erasure.**
- **Demo-ready.** **Private repo. Never link a repo for Bose.**

Planned school network layer, not yet shipped:

- Bose will score each student's learning journey using exam preparation, knowledge
  learned and product activity, converted into points on a student scoreboard.
- Teachers will control and inspect student scores and activity.
- A school's score will be the average of its student scores. The plan is to compare AI
  adoption between schools in the same area.
- Students use a chat-first interface similar in interaction model to Claude.
- The commercial plan is to sell Bose to schools. No pilots, customers, adoption or
  revenue may be claimed yet.

Problem context supplied by Luvish: Bose is being developed in response to India's exam
integrity problem, including the 2026 CJP-led protests around alleged NEET paper leaks and
demands for transparency. Public copy must keep the boundary clear: Bose currently helps
schools detect and review cheating signals. It does not claim to stop national paper-leak
networks.

### Bose / Henry publication rules (hard)

1. **Never** name a school, a customer, a student, or any student data.
2. **Never** attribute Bose (or Henry) to an employer. No "GrowthX" anywhere near
   either agent. GrowthX stays exactly where it already is: the work-experience
   row and the intro paragraph, as a public resume fact about employment.
3. **No repo link for Bose**, and no repo-private detail (file layout, internal
   module names beyond the ones listed above, schemas, prompts).
4. **No fabricated metrics.** No user counts, no revenue, no uptime, no adoption. Avoid
   test-count marketing because the current Henry worktree is not fully green and the
   counts change quickly. Publish only stable, verifiable numbers such as 900+ knowledge
   modules, AES-256-GCM, ₹0 API spend per run and M1 Air.

## Update 2026-08-17 — portfolio voice and audience (canonical, supplied by Luvish)

- Primary audience: HR and hiring teams for AI-native product-engineering and AI-product
  roles.
- Copy: short, direct, simple and human. No em dashes, inflated claims or dollar signs.
  Costs use Indian rupees.
- Visuals should explain the product, not decorate the page. Interactions must be useful,
  accessible and motion-safe.
- Prefer official employer icons when they can be bundled locally with little effort;
  otherwise use clean, recognisable monograms.
