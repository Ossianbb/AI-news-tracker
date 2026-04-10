import type { Article } from "@/types";

/**
 * Compare two strings and return a similarity score between 0 and 1.
 * Uses word overlap — the percentage of words that appear in both titles.
 */
function similarity(a: string, b: string): number {
  const wordsA = new Set(normalise(a).split(" "));
  const wordsB = new Set(normalise(b).split(" "));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) overlap++;
  }

  // Divide by the smaller set so "Claude launches new model" matches
  // "Anthropic launches Claude, a new model" reasonably well
  return overlap / Math.min(wordsA.size, wordsB.size);
}

/** Lowercase, remove punctuation, filter out short filler words */
function normalise(text: string): string {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to",
    "for", "of", "is", "it", "by", "with", "from", "as", "its",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word))
    .join(" ");
}

/** Check if two articles were published within this many hours of each other */
function withinTimeWindow(a: Article, b: Article, hours: number): boolean {
  const diff = Math.abs(
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  return diff <= hours * 60 * 60 * 1000;
}

/**
 * Pick the best article from a cluster to be the "primary" one.
 * Prefers longer summaries and earlier publication.
 */
function pickPrimary(cluster: Article[]): Article {
  return cluster.sort((a, b) => {
    // Prefer longer summary (more detail)
    const lenDiff = b.summary.length - a.summary.length;
    if (lenDiff !== 0) return lenDiff;
    // Tie-break: earlier publication
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  })[0];
}

/**
 * Group articles that cover the same story, assign a shared clusterId,
 * and return the deduplicated list (one primary per cluster + all
 * articles that didn't match any cluster).
 *
 * Similarity threshold: 0.6 (60% word overlap)
 * Time window: 48 hours
 */
export function deduplicate(articles: Article[]): Article[] {
  const SIMILARITY_THRESHOLD = 0.6;
  const TIME_WINDOW_HOURS = 48;

  // Each cluster is an array of articles about the same story
  const clusters: Article[][] = [];
  const assigned = new Set<string>();

  for (let i = 0; i < articles.length; i++) {
    if (assigned.has(articles[i].id)) continue;

    const cluster: Article[] = [articles[i]];
    assigned.add(articles[i].id);

    for (let j = i + 1; j < articles.length; j++) {
      if (assigned.has(articles[j].id)) continue;

      if (
        withinTimeWindow(articles[i], articles[j], TIME_WINDOW_HOURS) &&
        similarity(articles[i].title, articles[j].title) >= SIMILARITY_THRESHOLD
      ) {
        cluster.push(articles[j]);
        assigned.add(articles[j].id);
      }
    }

    clusters.push(cluster);
  }

  // Build the final list: one primary per cluster, all tagged with a clusterId
  const result: Article[] = [];

  for (const cluster of clusters) {
    const clusterId = `cluster-${cluster[0].id}`;

    if (cluster.length === 1) {
      // No duplicates — keep as-is
      result.push(cluster[0]);
    } else {
      // Tag all articles in the cluster, return only the primary
      const primary = pickPrimary(cluster);
      result.push({ ...primary, clusterId });
    }
  }

  return result;
}
