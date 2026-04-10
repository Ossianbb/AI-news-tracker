import Parser from "rss-parser";
import type { Article } from "@/types";
import { sources } from "@/lib/sources";

const parser = new Parser({
  timeout: 10_000,
});

/**
 * Fetch a single RSS feed and convert its items to Article objects.
 * Returns an empty array if the feed fails (so one broken feed
 * doesn't stop the others).
 */
async function fetchFeed(source: {
  name: string;
  url: string;
}): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);

    return (feed.items ?? []).map((item) => ({
      id: item.guid ?? item.link ?? `${source.name}-${item.title}`,
      title: item.title ?? "Untitled",
      source: source.name,
      url: item.link ?? "",
      publishedAt: item.isoDate ?? new Date().toISOString(),
      summary: stripHtml(item.contentSnippet ?? item.content ?? ""),
      topics: [],
      importanceScore: 0,
      whyItMatters: "",
    }));
  } catch (error) {
    console.error(`Failed to fetch ${source.name}: ${error}`);
    return [];
  }
}

/** Remove HTML tags and trim whitespace from a string */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

/**
 * Fetch all RSS feeds and return a flat array of articles.
 * Feeds are fetched in parallel. Failed feeds are skipped.
 */
export async function ingestAll(): Promise<Article[]> {
  const results = await Promise.allSettled(sources.map(fetchFeed));

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  // Sort newest first
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return articles;
}
