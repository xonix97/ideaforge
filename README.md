# IdeaForge — SaaS Idea Generator

A meta little SaaS: it generates **SaaS startup ideas** in one click. Slick UI, save-your-favourites, and a real Node/Express + SQLite backend with a community upvote board.

🔗 **Live demo:** https://xonix97.github.io/ideaforge/

> © 2026 Abhyudaya Mishra. All rights reserved. Proprietary — see [LICENSE](./LICENSE).

## What's here

| Part | Stack | Notes |
|---|---|---|
| **Frontend** (`index.html`) | Vanilla JS, zero deps | Forge ideas, save favourites (localStorage). Hosts on GitHub Pages. |
| **API** (`server/`) | Node + Express + SQLite | Server-side idea generation + a community board you can upvote. |

## Frontend
Combines an audience + a problem + a mechanism + a twist into a weirdly-specific startup idea, with a suggested build difficulty and price point. Save the ones you like.

## Backend
- `GET  /api/idea` — generate an idea server-side
- `POST /api/ideas` — submit an idea to the community board (or upvote if it exists)
- `GET  /api/ideas/top` — leaderboard of most-upvoted ideas

```bash
cd server
npm install
npm start          # API on http://localhost:3000
```

## Deploy the backend (free)
GitHub Pages is static-only, so deploy `server/` to **Render**, **Railway**, or **Fly.io** (free tiers), then point the frontend at your API URL to enable the live community board.

## License
Proprietary — All Rights Reserved. See [LICENSE](./LICENSE).
