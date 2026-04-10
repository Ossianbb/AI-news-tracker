import type { Article } from "@/types";

/**
 * Base quality score for each source.
 * Higher = more trusted / relevant for AI news.
 */
const sourceWeights: Record<string, number> = {
  "Ars Technica – AI": 3,
  "MIT Technology Review – AI": 4,
  "The Verge – AI": 3,
  "Simon Willison's Weblog": 5,
  "Hacker News – Front Page": 2,
  "TechCrunch – AI": 3,
};

/** Keywords in the title/summary that suggest a big story */
const signalKeywords: { word: string; weight: number }[] = [
  { word: "launches", weight: 2 },
  { word: "announces", weight: 2 },
  { word: "breakthrough", weight: 3 },
  { word: "release", weight: 1 },
  { word: "open source", weight: 2 },
  { word: "state-of-the-art", weight: 2 },
  { word: "first", weight: 1 },
  { word: "new model", weight: 2 },
  { word: "safety", weight: 1 },
  { word: "regulation", weight: 1 },
  { word: "billion", weight: 1 },
  { word: "acquisition", weight: 1 },
  { word: "partnership", weight: 1 },
];

/**
 * Score an article from 1–10 based on:
 *   - Source quality (how relevant/trusted the source is)
 *   - Keyword signals (words that suggest importance)
 *   - Recency (today's news scores higher than older news)
 *   - Topic relevance (articles tagged "other" score lower)
 */
export function scoreArticle(article: Article): Article {
  let score = 0;

  // 1. Source quality (0–5 points)
  score += sourceWeights[article.source] ?? 2;

  // 2. Keyword signals (0–4 points, capped)
  const text = `${article.title} ${article.summary}`.toLowerCase();
  let keywordScore = 0;
  for (const { word, weight } of signalKeywords) {
    if (text.includes(word)) {
      keywordScore += weight;
    }
  }
  score += Math.min(keywordScore, 4);

  // 3. Recency (0–3 points)
  const hoursAgo =
    (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (hoursAgo <= 6) {
    score += 3;
  } else if (hoursAgo <= 24) {
    score += 2;
  } else if (hoursAgo <= 48) {
    score += 1;
  }

  // 4. Penalty for untagged articles (-2 points)
  if (article.topics.length === 1 && article.topics[0] === "other") {
    score -= 2;
  }

  // Clamp to 1–10
  const finalScore = Math.max(1, Math.min(10, score));

  return { ...article, importanceScore: finalScore };
}

/**
 * Score all articles in an array.
 */
export function scoreAll(articles: Article[]): Article[] {
  return articles.map(scoreArticle);
}
