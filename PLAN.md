# AI News Digest — Build Plan for Claude Code

## What this is

A personal AI news digest app. The real goal is twofold:

1. Build a useful product that helps me track AI developments and learn new concepts
2. Learn how to work with Claude Code effectively — prompting, iterating, reviewing, and steering an AI coding agent

Every phase below includes **what to build** and **what Claude Code skill to practise**.

---

## Ground rules for working with Claude Code

These habits matter more than the code itself.

- **One task at a time.** Never ask Claude Code to build an entire feature in one prompt. Break it down. "Create the Article type and a mock data file" is better than "build the digest page with data model and components."
- **Read what it writes.** After every generation, read the code. Ask Claude Code to explain anything you don't understand. This is how you learn.
- **Commit often.** After each small task, review the diff and commit. This gives you clean rollback points and teaches you to work incrementally.
- **Correct early.** If Claude Code takes a wrong direction, stop it immediately. Say what's wrong and what you want instead. Steering is the core skill.
- **Use the PLAN.** Reference this file in your prompts: "Look at PLAN.md, I'm starting task 1.3." This keeps context tight.
- **Ask "why" often.** When Claude Code makes an architectural choice, ask it to justify the decision. You'll learn faster this way.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js (App Router) | Industry standard, good docs, easy deployment |
| Language | TypeScript | Catches errors early, Claude Code is strong with TS |
| Styling | Tailwind CSS | Fast iteration, no separate CSS files to manage |
| Data (MVP) | Local JSON files | Zero setup, easy to inspect, swap to a DB later |
| Data (V2) | SQLite via better-sqlite3 | Still local, but queryable and structured |
| AI | Anthropic API (Claude) | For concept explanations, summaries, quiz generation |
| Deployment | Vercel | Free tier, zero-config for Next.js |

---

## Phase 1 — Scaffold and mock UI

**Goal:** A clickable prototype with fake data. Nothing real yet.

**Claude Code skills to practise:** Project setup, file structure, component generation, iterating on UI.

### Tasks

**1.1 — Initialise the project**

Prompt: *"Create a new Next.js project with TypeScript and Tailwind. Use the App Router. Set up the folder structure with: app/, components/, lib/, data/, and types/. Add a README that describes the project."*

After: Check the file tree. Read `tsconfig.json` and `tailwind.config`. Ask Claude Code to explain any config you don't understand.

**1.2 — Define the core types**

Prompt: *"Look at PLAN.md. Create TypeScript types in types/index.ts for: Article, Concept, SavedItem, and UserKnowledge. Keep them simple — MVP only. Add JSDoc comments explaining each field."*

```typescript
// Target shape — guide Claude Code toward this, don't dictate exact syntax

type Article = {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string        // ISO date
  summary: string
  topics: string[]
  importanceScore: number    // 1–10
  whyItMatters: string
  clusterId?: string         // for grouping duplicates
}

type Concept = {
  id: string
  name: string
  slug: string
  simpleExplanation: string
  deeperExplanation: string
  whyItMattersNow: string
  relatedConcepts: string[]  // concept IDs
  examples: string[]
  resources: { title: string; url: string }[]
}
```

After: Read the types carefully. Do they make sense? Ask Claude Code: *"Are there any fields I'm missing for a news digest MVP?"*

**1.3 — Create mock data**

Prompt: *"Create mock data files in data/: mock-articles.ts (8–10 articles about real recent AI topics) and mock-concepts.ts (5–6 concepts like MCP, evals, distillation, inference-time compute, tool calling). Make them realistic. Export them as arrays."*

After: Read the mock data. Is it plausible? This is your chance to practise reviewing generated content, not just code.

**1.4 — Build the digest page**

Prompt: *"Create the main digest page at app/page.tsx. It should show today's top AI stories using the mock articles data. Group articles by topic. Each article card should show: title, source, importance score (as a visual indicator), summary, topics as tags, and a 'why it matters' line. Use Tailwind. Keep the design clean and readable — not flashy."*

After: Run the app. Does it look right? If not, steer: *"The cards are too wide. Make the max width narrower and add more spacing between cards."* This is where you learn to iterate with Claude Code.

**1.5 — Build the concept explainer page**

Prompt: *"Create a page at app/learn/[slug]/page.tsx that shows a single concept. Use the mock concepts data. The page should have: the concept name, a simple one-paragraph explanation, a deeper explanation section, a 'why it matters now' section, related concepts as clickable links, examples, and resource links. Include a text input at the top of app/learn/page.tsx where I can type a term — for now just filter/search the mock concepts."*

After: Navigate between concepts. Do the related concept links work? Is the explanation structure clear?

**1.6 — Build the saved items page**

Prompt: *"Create app/library/page.tsx. It should show saved articles and concepts. For now, use React state to handle saving — a simple toggle on article cards and concept pages. Show saved items grouped by type (articles vs concepts) with the date saved."*

After: Test saving and unsaving. Does state persist across navigation? (It won't — that's fine for now. Note it as a future fix.)

**1.7 — Add navigation and layout**

Prompt: *"Create a shared layout with a sidebar or top nav. Sections: Digest (home), Learn, Library. Add active-state styling to show which section I'm on. The layout should work on mobile too."*

After: Resize the browser. Does it work on mobile? If not, iterate.

### Phase 1 checkpoint

You should now have:
- [x] A running Next.js app with four pages
- [x] Clean TypeScript types
- [x] Realistic mock data
- [x] A UI you can click through

**Claude Code skills gained:** Project scaffolding, component iteration, reading generated code, steering corrections, working with types.

---

## Phase 2 — Real content pipeline

**Goal:** Replace mock data with real AI news, ingested and processed.

**Claude Code skills to practise:** Working with external data, building utility functions, multi-step logic, error handling.

### Tasks

**2.1 — Set up RSS ingestion**

Prompt: *"Create a lib/sources.ts file listing RSS feed URLs for AI news. Start with 5–6 good sources (e.g., The Verge AI, Ars Technica AI, MIT Technology Review, Simon Willison's blog, Hacker News AI). Then create lib/ingest.ts with a function that fetches all feeds, parses them, and returns an array of Article objects. Use a lightweight RSS parser. Handle errors gracefully — if one feed fails, continue with the others."*

After: Run the ingestion function. Inspect the output. Ask Claude Code: *"Show me how to run this as a script from the command line so I can test it."*

**2.2 — Deduplication**

Prompt: *"Add a deduplication step in lib/deduplicate.ts. After ingestion, group articles that are about the same story. Use title similarity and a time window. Assign a shared clusterId to grouped articles and pick the best one as the primary (prefer longer summaries, higher-quality sources)."*

After: Test with your real ingested data. Are the clusters sensible? This is a good place to ask Claude Code: *"Walk me through the similarity algorithm you chose and why."*

**2.3 — Topic tagging**

Prompt: *"Create lib/topics.ts. Define a fixed set of topics: models, agents, policy, tools, research, chips, robotics, startups, open-source, safety. Write a function that assigns topics to each article based on keyword matching in the title and summary. An article can have multiple topics."*

After: Review the tagging results. Are they reasonable? Where does keyword matching fall short? (This sets up a later improvement using Claude for smarter tagging.)

**2.4 — Importance scoring**

Prompt: *"Add a basic importance scoring function in lib/scoring.ts. Score each article 1–10 based on heuristics: source quality (assign each source a base weight), keyword signals (e.g., 'launches', 'announces', 'breakthrough' score higher), and recency (today's news scores higher than yesterday's). Document the scoring logic clearly with comments."*

After: Sort your articles by score. Does the ranking feel right? What's missing? Write down what you'd improve — this becomes a V2 task.

**2.5 — Wire the pipeline together**

Prompt: *"Create lib/pipeline.ts that runs the full pipeline: fetch → parse → deduplicate → tag → score → save to a JSON file in data/digest.json. Then update the digest page to read from this file instead of mock data. Add a way to trigger the pipeline — for now, a script I can run manually."*

After: Run the pipeline end to end. Load the digest page. You should see real AI news, tagged and scored.

**2.6 — Add a "why it matters" summary**

Prompt: *"For each top-scoring article (score 7+), use the Anthropic API to generate a short 'why it matters' summary. Create lib/ai.ts with a function that takes an article title and summary and returns a one-sentence explanation of why this development is significant. Add rate limiting and caching so I don't call the API unnecessarily."*

After: Read the generated summaries. Are they useful? Too generic? Iterate on the prompt inside `lib/ai.ts`.

### Phase 2 checkpoint

You should now have:
- [x] Real articles from RSS feeds
- [x] Deduplication working
- [x] Topic tags on every article
- [x] Importance scores
- [x] AI-generated "why it matters" for top stories
- [x] A manual pipeline you can trigger

**Claude Code skills gained:** Building multi-step data pipelines, working with APIs, error handling, prompt iteration, testing with real data.

---

## Phase 3 — Concept explainer (AI-powered)

**Goal:** Turn the static concept pages into an AI-powered learning tool.

**Claude Code skills to practise:** Prompt engineering, structured AI output, caching, building interactive features.

### Tasks

**3.1 — Build the "explain this" flow**

Prompt: *"Update the Learn page. Replace the mock concept search with a real input box where I can paste a term, tweet, headline, or short post. When I submit, call the Anthropic API to: identify the core concept, generate a simple explanation, generate a deeper explanation, explain why it matters now, list 3–5 related concepts, give 2–3 examples, and suggest what to read next. Return this as structured data matching the Concept type. Display the result on a new concept page."*

After: Test with real inputs: "MCP", "inference-time compute", a paste of a real tweet about AI. Are the explanations clear and useful? Iterate on the prompt.

**3.2 — Cache generated concepts**

Prompt: *"Save every generated concept to data/concepts.json so I don't re-generate explanations I've already asked for. When I search for a term, check the cache first. Show cached concepts in a browseable list on the Learn page."*

After: Generate a few concepts, then restart the app. Do they persist?

**3.3 — Related concept linking**

Prompt: *"When a concept page lists related concepts, make them clickable. If the related concept already exists in the cache, link directly to it. If not, show it as a suggestion I can click to generate."*

After: Click through a chain of related concepts. Does it feel like a useful knowledge graph?

### Phase 3 checkpoint

- [x] Working "explain this" input
- [x] AI-generated concept pages with structured output
- [x] Concept caching
- [x] Related concept navigation

**Claude Code skills gained:** Prompt engineering for structured output, caching strategies, building AI-powered features iteratively.

---

## Phase 4 — Knowledge tracking

**Goal:** Track what I've read and learned. Surface gaps.

**Claude Code skills to practise:** State management, building dashboards, generating quizzes with AI.

### Tasks

**4.1 — Track reading history**

Prompt: *"Add read-tracking. When I click through to an article, mark it as read. Store read history in data/user-knowledge.json. Show a read/unread indicator on article cards. Add a 'read history' section to the Library page."*

**4.2 — Track concept understanding**

Prompt: *"On each concept page, add a self-assessment: 'How well do you understand this?' with options: New to me / Heard of it / Could explain it / Know it well. Save this to user knowledge. Show the status on the Learn page's concept list."*

**4.3 — Build the "Am I up to date?" dashboard**

Prompt: *"Create app/knowledge/page.tsx. Show: topics I've read about (and how much), concepts I've marked as understood vs still learning, gaps — important topics I haven't engaged with at all, a simple progress summary. Use the article topics and concept data to assess coverage."*

**4.4 — Add quiz mode**

Prompt: *"Add a quiz feature at app/knowledge/quiz/page.tsx. Use the Anthropic API to generate 5 multiple-choice questions based on concepts I've marked as 'learning' or articles I've read recently. After I answer, show my score and explain any wrong answers. Save quiz results to user knowledge."*

### Phase 4 checkpoint

- [x] Reading history tracked
- [x] Concept understanding self-assessment
- [x] Knowledge dashboard showing gaps
- [x] AI-generated quizzes

---

## Phase 5 — Polish and deploy

**Goal:** Make it usable daily. Ship it.

### Tasks

**5.1 — Scheduled pipeline** — Run ingestion automatically (cron or on-demand API route)

**5.2 — Better search** — Full-text search across articles and concepts

**5.3 — Responsive polish** — Test and fix every page on mobile

**5.4 — Deploy to Vercel** — Set up environment variables, deploy, test

**5.5 — README and documentation** — Ask Claude Code to write a thorough README

---

## Claude Code workflow cheat sheet

Use these prompt patterns throughout the project:

| Situation | Prompt pattern |
|-----------|---------------|
| Start a task | *"Look at PLAN.md, I'm starting task 2.3. Here's what I want..."* |
| Understand code | *"Explain what this function does and why you structured it this way."* |
| Fix something | *"This component renders X but I expected Y. Fix it."* |
| Improve code | *"Review lib/pipeline.ts. What would you improve?"* |
| Learn a concept | *"I don't understand how RSS parsing works in this code. Explain it to me."* |
| Steer direction | *"Stop. I don't want to use a database yet. Keep it as JSON files for now."* |
| Iterate on AI prompts | *"The concept explanations are too technical. Make the prompt simpler. Aim for someone who reads tech news but doesn't code."* |
| Review before commit | *"Show me a summary of all changes since the last commit."* |
| Recover from mistakes | *"That last change broke the layout. Revert and try a different approach."* |

---

## V2 — UI Design Pass, Email Sources & Personalisation

MVP is complete (phases 1-5). V2 adds three capabilities in four phases, ordered so each builds on the last: reusable UI components first (needed by settings pages), then personalisation (needs those components), then email sources (benefits from personalised scoring), then polish.

**MCP tools used during development:**
- **Playwright MCP** — screenshot pages after UI changes instead of manually opening the browser
- **Gmail MCP** — inspect inbox and test newsletter parsing during Phase 8 development

---

## Phase 6 — UI Foundation & Design Pass

**Goal:** Fix design issues, add dark mode, create reusable components, improve accessibility.

**Claude Code skills to practise:** MCP tool usage (Playwright), component extraction, design systems, accessibility.

### Tasks

**6.1 — Fix font override**

Remove the `body { font-family: Arial }` rule in `app/globals.css` that overrides the Geist fonts already configured in `layout.tsx`.

**6.2 — Add system-automatic dark mode**

Add `@media (prefers-color-scheme: dark)` block in `app/globals.css` redefining CSS variables. Add `dark:` Tailwind variants to all components: NavBar, ArticleCard, DigestView, SaveButton, ConceptLevelPicker, and all pages. Follows OS setting automatically — no manual toggle.

**6.3 — Create reusable Button component**

New file: `components/ui/Button.tsx`. Variants: primary (blue), secondary (outlined), ghost (text-only). Sizes: sm, md, lg. Replace inline button styles across quiz page, knowledge page, learn page.

**6.4 — Create reusable Input component**

New file: `components/ui/Input.tsx`. Extract search input pattern from DigestView. Include `aria-label` prop. Reuse in learn page search and settings page (Phase 7).

**6.5 — Improve ArticleCard**

Add left border colour by importance (red >= 8, amber >= 6, grey < 6). Add ARIA labels to save button and article link. Export `ArticleCardSkeleton` for loading states.

**6.6 — Improve progress bars**

Colour-code by coverage: red < 25%, amber 25-50%, green > 50%. Show percentage text beside each bar.

**6.7 — Add loading skeletons**

New file: `components/ui/Skeleton.tsx`. Simple pulsing placeholder. Use in DigestView, learn page, knowledge page while data fetches.

**6.8 — Add ARIA labels throughout**

Add `aria-label` to all interactive elements missing text labels in DigestView, NavBar, SaveButton, ArticleCard, quiz page. Add `role="search"` to search input wrappers.

**6.9 — Extract quiz option styles**

Move long inline conditional class strings in `app/knowledge/quiz/page.tsx` into a helper function.

**6.10 — Playwright visual verification**

Use Playwright MCP to screenshot every page at desktop (1280x720) and mobile (375x812). Verify dark mode, new components, accessibility. Development workflow only — no app code.

### Phase 6 checkpoint

- [ ] Geist fonts rendering correctly
- [ ] Dark mode follows OS setting on all pages
- [ ] Reusable Button, Input, Skeleton components
- [ ] ArticleCard has importance border + ARIA labels
- [ ] Progress bars colour-coded
- [ ] Loading skeletons on data-fetching pages
- [ ] Playwright screenshots confirm all pages look correct

---

## Phase 7 — Interest Profile & Personalised Scoring

**Goal:** Add user preferences that influence article ranking. Single-user, localStorage-based.

**Claude Code skills to practise:** State management, API design, building settings UIs.

### Tasks

**7.1 — Define InterestProfile type**

Add to `types/index.ts`:
```typescript
type InterestProfile = {
  topicWeights: Record<string, number>;    // 0-2, default 1.0
  sourceWeights: Record<string, number>;   // 0-2, default 1.0
  topicReadCounts: Record<string, number>; // auto-tracked
};
```

**7.2 — Create InterestProfileProvider**

New file: `components/InterestProfileProvider.tsx`. Same pattern as KnowledgeProvider — localStorage, context, hooks. Provides `getTopicWeight`, `setTopicWeight`, `getSourceWeight`, `setSourceWeight`. Auto-increments `topicReadCounts` when articles are marked read. Wrap in `layout.tsx`.

**7.3 — Build settings page**

New file: `app/settings/page.tsx`. Two sections: topic preferences (suppress/normal/boost per topic) and source preferences (suppress/normal/boost per source). Add Settings link to NavBar.

**7.4 — Create personalisation API endpoint**

New file: `app/api/personalize/route.ts`. POST accepts `InterestProfile`, reads `digest.json`, applies adjustments on top of base scores (topic boost, source boost, reading frequency boost), returns re-ranked articles. Keeps `lib/scoring.ts` untouched — personalisation is a separate layer.

**7.5 — Update DigestView to use personalised scoring**

On mount, if user has an interest profile, POST to `/api/personalize` and re-sort articles. Fall back to default order on failure.

**7.6 — Auto-track reading patterns**

When `markRead` fires in KnowledgeProvider, also update InterestProfileProvider's `topicReadCounts` for the article's topics.

**7.7 — Knowledge-weighted concept recommendations**

Sort concepts on learn page: unassessed and "new" first, "know-it-well" last. Surface concepts related to frequently-read topics higher.

### Phase 7 checkpoint

- [ ] InterestProfile stored in localStorage
- [ ] Settings page with topic and source weight controls
- [ ] `/api/personalize` re-ranks articles based on preferences
- [ ] DigestView shows personalised article order
- [ ] Reading history auto-updates topic read counts
- [ ] Concept recommendations reflect knowledge level

---

## Phase 8 — Email Newsletter Sources (Gmail Integration)

**Goal:** Ingest email newsletters alongside RSS feeds. Use Gmail MCP during development, `googleapis` package in production.

**Claude Code skills to practise:** MCP tool usage (Gmail), API integration, HTML parsing, extending existing pipelines.

**Target newsletters:** TLDR AI, The Batch (Andrew Ng), Import AI (Jack Clark), Ben's Bites, The Neuron, Every, The Rundown AI.

### Tasks

**8.1 — Extend source type system**

Update `lib/sources.ts` with typed union:
```typescript
type RssSource = { type: "rss"; name: string; url: string };
type EmailSource = { type: "email"; name: string; senderEmail: string };
type Source = RssSource | EmailSource;
```
Add email sources for all 7 newsletters.

**8.2 — Set up Google API credentials**

Create Google Cloud project, enable Gmail API, create OAuth 2.0 credentials, get refresh token (one-time manual flow). Add credentials to `.env.local`. New file: `lib/gmail.ts` — Gmail client using `googleapis` package.

Install: `googleapis` npm package.

**8.3 — Build email content extractor**

New file: `lib/email-parser.ts`. Strips HTML, splits newsletter body into individual story items, extracts title/URL/summary for each. Start with TLDR AI (most structured format), add other newsletter parsers incrementally.

**8.4 — Create email ingestion handler**

Update `lib/ingest.ts` — add `fetchEmailSource()` alongside existing `fetchFeed()`. Update `ingestAll()` to handle both source types via `source.type` discriminant.

**8.5 — Update scoring for email sources**

Add source weights to `lib/scoring.ts`: Import AI (4), The Batch (4), TLDR AI (3), Ben's Bites (3), The Neuron (3), Every (3), The Rundown AI (3).

**8.6 — Add mock newsletter articles**

Add 3-4 mock articles with newsletter source names to `data/mock-articles.ts` so the app works without Gmail credentials.

### Phase 8 checkpoint

- [ ] Source type system supports RSS and email
- [ ] Gmail API client connects and fetches emails
- [ ] Email parser extracts articles from at least TLDR AI
- [ ] Pipeline ingests newsletter articles alongside RSS
- [ ] Newsletter articles appear in digest with correct scoring
- [ ] App works without Gmail credentials (falls back to mock data)

---

## Phase 9 — Polish & Integration

**Goal:** Error handling, edge cases, full visual regression, documentation.

### Tasks

**9.1 — Add error boundary**

New file: `components/ErrorBoundary.tsx`. Wrap main content in `layout.tsx`.

**9.2 — Edge case handling**

- Gmail credentials missing: skip email sources silently
- No articles after personalisation: show "adjust your preferences" message
- localStorage unavailable: degrade to in-memory fallback

**9.3 — Playwright full visual regression**

Screenshot every page at desktop + mobile. Verify dark mode, settings, newsletter articles, personalised ordering.

**9.4 — Update CLAUDE.md and PLAN.md**

Document: InterestProfile, email ingestion, settings page, `/api/personalize`, new source types, Gmail setup.

### Phase 9 checkpoint

- [ ] Error boundary catches render crashes
- [ ] Graceful degradation for missing credentials / empty states
- [ ] All pages verified via Playwright at desktop + mobile
- [ ] Documentation updated

---

## V3 ideas (don't build yet)

These are parked for after V2 is solid:

- Concept dependency graph visualisation
- Tweet/X post paste that auto-extracts and explains concepts
- Flashcard mode for concept revision
- Timeline view for tracking how a story develops
- Category briefings (e.g., "models this week", "policy this week")
- Notes and annotations on saved items
- SQLite migration for better querying
- Email digest export
- Custom Claude Code skills (news-analyst, concept-explainer, quiz-writer)
- Claude Code hooks (lint after edits, README updates, schema change warnings)

---

## What success looks like

After Phase 5 (MVP), you should be able to:

1. Open the app and see today's important AI news, ranked and explained
2. Paste any AI term or tweet and get a clear, structured explanation
3. See what you've learned and where your gaps are
4. Take quizzes to test your understanding
5. Have a growing personal knowledge base of AI concepts

After Phase 9 (V2), you should also be able to:

6. See the app in dark mode that follows your OS setting
7. Set topic and source preferences that change how articles are ranked
8. See newsletter articles from your inbox alongside RSS articles
9. Get concept recommendations tailored to your reading patterns
10. Trust that the app handles errors and edge cases gracefully

And you should have learned:

1. How to break work into small tasks for Claude Code
2. How to read and review AI-generated code critically
3. How to iterate and steer when things go wrong
4. How to build AI-powered features with good prompt engineering
5. How to work incrementally — commit, test, then move on
6. How to use MCP tools (Playwright, Gmail) in your development workflow
7. How to extend an existing pipeline with new data sources
8. How to build personalisation features on top of existing systems
