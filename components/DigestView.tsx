"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/types";

/** Group articles by their first topic */
function groupByTopic(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};
  for (const article of articles) {
    const topic = article.topics[0] ?? "other";
    if (!groups[topic]) groups[topic] = [];
    groups[topic].push(article);
  }
  return groups;
}

function matchesQuery(article: Article, query: string): boolean {
  const q = query.toLowerCase();
  return (
    article.title.toLowerCase().includes(q) ||
    article.summary.toLowerCase().includes(q) ||
    article.source.toLowerCase().includes(q) ||
    article.topics.some((t) => t.toLowerCase().includes(q)) ||
    (article.whyItMatters?.toLowerCase().includes(q) ?? false)
  );
}

export default function DigestView({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? articles.filter((a) => matchesQuery(a, query.trim()))
    : articles;

  const grouped = groupByTopic(filtered);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          AI News Digest
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Today&apos;s top stories, ranked by importance
        </p>
      </header>

      <input
        type="text"
        placeholder="Search articles…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No articles matching &ldquo;{query}&rdquo;
        </p>
      ) : (
        Object.entries(grouped).map(([topic, articles]) => (
          <section key={topic} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              {topic}
            </h2>
            <div className="flex flex-col gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
