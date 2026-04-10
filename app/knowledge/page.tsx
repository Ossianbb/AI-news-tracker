"use client";

import Link from "next/link";
import { useKnowledge } from "@/components/KnowledgeProvider";
import { mockArticles } from "@/data/mock-articles";
import { mockConcepts } from "@/data/mock-concepts";
import type { ConceptLevel } from "@/types";

const levelLabels: Record<ConceptLevel, string> = {
  new: "New to me",
  "heard-of-it": "Heard of it",
  "could-explain": "Could explain it",
  "know-it-well": "Know it well",
};

const levelColors: Record<ConceptLevel, string> = {
  new: "bg-zinc-100 text-zinc-600",
  "heard-of-it": "bg-amber-100 text-amber-700",
  "could-explain": "bg-blue-100 text-blue-700",
  "know-it-well": "bg-green-100 text-green-700",
};

export default function KnowledgePage() {
  const { readArticleIds, conceptLevels } = useKnowledge();

  // Count articles read per topic
  const allArticles = mockArticles;
  const topicCounts: Record<string, { read: number; total: number }> = {};
  for (const article of allArticles) {
    for (const topic of article.topics) {
      if (!topicCounts[topic]) topicCounts[topic] = { read: 0, total: 0 };
      topicCounts[topic].total++;
      if (readArticleIds.includes(article.id)) {
        topicCounts[topic].read++;
      }
    }
  }

  // Topics with no reads at all
  const allTopics = Object.keys(topicCounts);
  const unreadTopics = allTopics.filter((t) => topicCounts[t].read === 0);

  // Concept progress
  const assessedConcepts = Object.entries(conceptLevels);
  const unassessedConcepts = mockConcepts.filter(
    (c) => !conceptLevels[c.id]
  );

  const totalRead = readArticleIds.length;
  const totalAssessed = assessedConcepts.length;
  const knownWell = assessedConcepts.filter(
    ([, level]) => level === "know-it-well"
  ).length;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Am I up to date?
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your reading and learning progress
        </p>
      </header>

      {/* Quiz link */}
      <Link
        href="/knowledge/quiz"
        className="mb-8 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100"
      >
        <div>
          <p className="font-semibold text-blue-900">Test yourself</p>
          <p className="text-sm text-blue-700">
            Take a quiz on the concepts you&apos;re learning
          </p>
        </div>
        <span className="text-blue-600">&rarr;</span>
      </Link>

      {/* Summary stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900">{totalRead}</p>
          <p className="text-xs text-zinc-500">Articles read</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900">{totalAssessed}</p>
          <p className="text-xs text-zinc-500">Concepts assessed</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900">{knownWell}</p>
          <p className="text-xs text-zinc-500">Know well</p>
        </div>
      </div>

      {/* Topic coverage */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Topic coverage
        </h2>
        {allTopics.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No articles read yet. Start reading on the Digest page!
          </p>
        ) : (
          <div className="space-y-2">
            {allTopics.map((topic) => {
              const { read, total } = topicCounts[topic];
              const pct = Math.round((read / total) * 100);
              return (
                <div key={topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-zinc-700">{topic}</span>
                    <span className="text-zinc-500">
                      {read}/{total} read
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Gaps — topics not read */}
      {unreadTopics.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Gaps — topics you haven&apos;t read about
          </h2>
          <div className="flex flex-wrap gap-2">
            {unreadTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Concept understanding */}
      {assessedConcepts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Concept understanding
          </h2>
          <div className="space-y-2">
            {assessedConcepts.map(([id, level]) => {
              const concept = mockConcepts.find((c) => c.id === id);
              const name = concept?.name ?? id;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2"
                >
                  <span className="text-sm text-zinc-700">{name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${levelColors[level]}`}
                  >
                    {levelLabels[level]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Unassessed concepts */}
      {unassessedConcepts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Not yet assessed
          </h2>
          <div className="flex flex-wrap gap-2">
            {unassessedConcepts.map((c) => (
              <a
                key={c.id}
                href={`/learn/${c.slug}`}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-200"
              >
                {c.name}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
