# AI News Tracker

A personal AI news digest and learning tool. Tracks AI developments from RSS feeds, ranks and explains them, and helps build a personal knowledge base of AI concepts.

The full build plan lives in [`PLAN.md`](./PLAN.md).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Local JSON files** for data (MVP); SQLite later
- **Anthropic API** for concept explanations, summaries, and quizzes

## Folder structure

```
app/         Next.js App Router pages and layouts
components/  Reusable React components
lib/         Utilities, data pipeline, AI helpers
data/        Mock data and generated JSON (articles, concepts, user knowledge)
types/       Shared TypeScript types
public/      Static assets
```

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Status

Phase 1 — scaffold and mock UI. See `PLAN.md` for the roadmap.
