"use client";

import type { Article } from "@/types";
import SaveButton from "@/components/SaveButton";
import { useKnowledge } from "@/components/KnowledgeProvider";

function ImportanceBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "bg-red-100 text-red-800"
      : score >= 6
        ? "bg-amber-100 text-amber-800"
        : "bg-zinc-100 text-zinc-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {score}/10
    </span>
  );
}

function TopicTag({ topic }: { topic: string }) {
  return (
    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
      {topic}
    </span>
  );
}

export default function ArticleCard({ article }: { article: Article }) {
  const { isRead, markRead } = useKnowledge();
  const read = isRead(article.id);

  return (
    <article
      className={`rounded-lg border p-5 shadow-sm ${read ? "border-zinc-100 bg-zinc-50" : "border-zinc-200 bg-white"}`}
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug text-zinc-900">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            onClick={() => markRead(article.id)}
          >
            {article.title}
          </a>
          {read && (
            <span className="ml-2 text-xs font-normal text-zinc-400">read</span>
          )}
        </h3>
        <ImportanceBadge score={article.importanceScore} />
      </div>

      <p className="mb-1 text-sm text-zinc-500">
        {article.source} &middot;{" "}
        {new Date(article.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <p className="mb-3 text-sm leading-relaxed text-zinc-700">
        {article.summary}
      </p>

      <p className="mb-3 text-sm italic text-zinc-600">
        Why it matters: {article.whyItMatters}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {article.topics.map((topic) => (
            <TopicTag key={topic} topic={topic} />
          ))}
        </div>
        <SaveButton itemId={article.id} itemType="article" data={article} />
      </div>
    </article>
  );
}
