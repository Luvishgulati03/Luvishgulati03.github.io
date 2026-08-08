#!/usr/bin/env node
/**
 * Refreshes data/henry-stats.json from Henry's REAL local state — no invented numbers.
 * Sources: Henry's Engram memory db (queries answered = "Luvish asked:" memories, the
 * one-per-conversation-turn record Henry writes; total memories) and activity.jsonl
 * (first-ever event → active-since). Run before deploying; the deploy step bakes these
 * into index.html between the STATS markers (see AGENT-GUIDE.md).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const HENRY = process.env.HENRY_DIR || "/Users/luvishgulati/dev/henry";
const require = createRequire(path.join(HENRY, "package.json"));
const Database = require("better-sqlite3");

const db = new Database(path.join(HENRY, "data", "engram.db"), { readonly: true });
const queriesAnswered = db.prepare("SELECT COUNT(*) AS n FROM memory WHERE content LIKE 'Luvish asked:%' OR content LIKE 'Dad asked:%'").get().n;
const totalMemories = db.prepare("SELECT COUNT(*) AS n FROM memory").get().n;
db.close();

const activityPath = path.join(HENRY, "data", "activity.jsonl");
let activeSinceIso = new Date().toISOString();
try {
  const firstLine = fs.readFileSync(activityPath, "utf8").split("\n").find(Boolean);
  const first = JSON.parse(firstLine);
  if (first?.timestamp) activeSinceIso = first.timestamp;
} catch { /* fresh install: today */ }

const days = Math.max(1, Math.round((Date.now() - new Date(activeSinceIso).getTime()) / 86_400_000));
const activeFor = days < 30 ? "<1 month" : days < 365 ? `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""}` : `${(days / 365).toFixed(1)} years`;

const stats = {
  generatedAt: new Date().toISOString(),
  queriesAnswered,
  totalMemories,
  activeSinceIso,
  activeFor,
  embeddingDims: 384,
  runsOn: "8GB M1 Air",
  marginalCost: "$0",
};

const out = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "data", "henry-stats.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(stats, null, 2)}\n`);
console.log(JSON.stringify(stats, null, 2));
