# Portfolio content dossier — Luvish Gulati (facts only; single source of truth for the build)

All facts below are verified from the resume, live GitHub, or the Henry codebase. The builder
must not invent metrics, employers, or capabilities beyond this file.

## Identity
- Name: **Luvish Gulati**
- Positioning: **Product-minded software engineer & AI builder** — owns products from
  discovery/PRDs through code, launch, GTM, and analytics. Targeting Product Manager
  (especially AI-PM) and product-engineer roles.
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
- Repo: https://github.com/Luvishgulati03/ai-agent-
- One-liner: a terminal-first AI chief-of-staff that remembers, learns, schedules, and acts —
  built local-first on an 8GB M1 Air for ~$0 marginal cost (no API keys; orchestrates
  subscription CLIs).
- Architecture points (all real, all in the repo):
  - **Memory engine (flagship module)**: files-as-truth + SQLite index; hybrid retrieval
    (vector cosine + full-text, rank-fused) plus **spreading activation** over a typed
    memory graph; episodic/semantic/procedural tiers; decay, reinforcement, supersede;
    every recall returns an explainable trace.
  - **Knowledge RAG**: local embeddings (bge-small-en-v1.5, 384d, ~10ms, $0), contextual-prefix
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
  PRDs for all three personas; piloted at 2–3 accredited institutions.

### 4. Risk AI Council (work product — PM/GTM case study)
- Repo: https://github.com/Luvishgulati03/risk-council-final-iterATION- (final iteration)
- AI-risk assessment platform; Luvish led GTM + content: target users, launch messaging,
  site structure, learning programs across 6 AI risk categories (NIST AI RMF, EU AI Act).

### 5. CarbonNex (work product — product case study)
- Repo: https://github.com/Luvishgulati03/carbonnex-website
- ESG reporting product; Luvish designed core workflows as APM.

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
