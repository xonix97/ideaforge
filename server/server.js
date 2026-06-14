// IdeaForge API — generate ideas server-side + a community board of upvoted ideas.
// © 2026 IdeaForge / Abhyudaya Mishra. All rights reserved. Proprietary — see LICENSE.
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const db = new Database(join(__dirname, "ideaforge.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    pitch TEXT NOT NULL,
    votes INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const audiences = ["indie game devs","Shopify merchants","Discord community owners","freelance designers","podcast hosts","newsletter writers","fitness coaches","online tutors","solo founders","local restaurants"];
const problems = ["spend hours on repetitive busywork","can't tell which content converts","lose track of leads","struggle to price their work","drown in customer DMs","have no idea why users churn"];
const mechanisms = ["AI copilot","no-code dashboard","Chrome extension","Slack bot","automated weekly report","smart inbox"];
const twists = ["priced per-result, not per-seat","that sets itself up in 60 seconds","with a generous free tier","fine-tuned on your own data","that's open-source at the core"];
const prefixes = ["Loop","Nova","Pulse","Quill","Forge","Beacon","Hatch","Glide","Orbit","Ember"];
const suffixes = ["ly","HQ","flow","kit","base","wise","stack","labs","io"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

app.get("/api/idea", (_req, res) => {
  const name = pick(prefixes) + pick(suffixes);
  const aud = pick(audiences), prob = pick(problems), mech = pick(mechanisms), twist = pick(twists);
  res.json({
    name,
    tagline: `${cap(mech)} for ${aud}`,
    pitch: `For ${aud} who ${prob}, ${name} is a ${mech} that fixes it — ${twist}.`,
  });
});

// Community board: save an idea (or upvote if it already exists)
app.post("/api/ideas", (req, res) => {
  const { name, tagline, pitch } = req.body || {};
  if (!name || !tagline || !pitch) return res.status(400).json({ error: "name, tagline, pitch required" });

  const existing = db.prepare("SELECT * FROM ideas WHERE name = ? AND tagline = ?").get(name, tagline);
  if (existing) {
    db.prepare("UPDATE ideas SET votes = votes + 1 WHERE id = ?").run(existing.id);
    return res.json({ ...existing, votes: existing.votes + 1, upvoted: true });
  }
  const id = "idea_" + Math.random().toString(36).slice(2, 10);
  db.prepare("INSERT INTO ideas (id, name, tagline, pitch) VALUES (?, ?, ?, ?)").run(id, name, tagline, pitch);
  res.json({ id, name, tagline, pitch, votes: 1 });
});

// Leaderboard
app.get("/api/ideas/top", (_req, res) => {
  res.json(db.prepare("SELECT * FROM ideas ORDER BY votes DESC LIMIT 20").all());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IdeaForge API on :${PORT}`));
