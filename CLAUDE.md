# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server (Turbopack) at localhost:3000
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint (flat config, Next.js + TypeScript rules)
npx tsx scripts/run-pipeline.ts   # Run the RSS ingestion pipeline
npx tsx scripts/test-ingest.ts    # Test RSS fetching only
```

There are no automated tests yet. Pipeline scripts in `scripts/` serve as manual test runners for individual pipeline stages.

## Architecture

**Next.js 16 App Router** with React 19, TypeScript, Tailwind CSS 4. All pages are client components (`"use client"`). Data is stored in local JSON files (`data/digest.json`, `data/concepts.json`) — no database.

### Data pipeline (`lib/`)

```
RSS feeds (lib/sources.ts) → ingest() → deduplicate() → topics() → scoring() → enrichTopArticles() → data/digest.json
```

- `ingest.ts` — fetches RSS feeds, returns Article[]
- `deduplicate.ts` — groups similar articles by title similarity (0.6 threshold) within 48-hour window
- `topics.ts` — keyword-based tagging across 10 fixed topics
- `scoring.ts` — heuristic scoring 1-10 (source weight + keywords + recency)
- `ai.ts` — Gemini 2.5 Flash for "why it matters" summaries and concept generation
- `pipeline.ts` — orchestrates the full pipeline, writes digest.json

### API routes (`app/api/`)

- `GET /api/articles` — returns digest.json (falls back to mock data)
- `GET /api/concepts` — returns cached concepts.json
- `POST /api/explain` — generates a Concept via Gemini from user input, caches to concepts.json
- `POST /api/quiz` — generates quiz questions via Gemini from concept list (validates response shape before returning)
- `GET|POST /api/pipeline` — triggers RSS pipeline; requires `CRON_SECRET` in production, open in dev

### Client state

Two React context providers wrap the app in `layout.tsx`:
- **SavedItemsProvider** — tracks saved articles/concepts in localStorage. Each `SavedItem` stores a full `snapshot` of the article/concept at save time, so saved items survive pipeline refreshes.
- **KnowledgeProvider** — tracks read articles and concept understanding levels in localStorage.

### Pages

- `/` — digest home, groups articles by topic from digest.json
- `/learn` — browse/search concepts, input box to generate new ones via AI
- `/learn/[slug]` — individual concept detail page
- `/library` — saved articles and concepts
- `/knowledge` — learning progress dashboard
- `/knowledge/quiz` — AI-generated quizzes

## Key conventions

- **Next.js 16 has breaking changes** from earlier versions. Always read `node_modules/next/dist/docs/` before using Next.js APIs — do not rely on training data.
- Types are defined in `types/index.ts`: Article, Concept, SavedItem, UserKnowledge, ConceptLevel.
- AI calls use `@google/genai` (Gemini 2.5 Flash), configured via `GEMINI_API_KEY` in `.env.local`.
- Generated data files (`digest.json`, `concepts.json`) are gitignored.
- Mock data in `data/mock-articles.ts` and `data/mock-concepts.ts` serves as fallback.
- Path alias: `@/*` maps to project root.
- `POST /api/explain` caches concepts by exact name/slug match only — no substring matching.
- On concept detail pages, generated concepts take priority over mock concepts with the same slug.
- Progress and quiz pages fetch live data from `/api/articles` and `/api/concepts`, falling back to mocks.
- See `PLAN.md` for the phased build roadmap — phases 1-5 complete (MVP done).
