"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockConcepts } from "@/data/mock-concepts";
import type { Concept } from "@/types";

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedConcepts, setGeneratedConcepts] = useState<Concept[]>([]);
  const router = useRouter();

  // Load cached concepts from the API
  useEffect(() => {
    fetch("/api/concepts")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Concept[]) => setGeneratedConcepts(data))
      .catch(() => {});
  }, []);

  // Combine mock + generated, avoiding duplicates by slug
  const allConcepts = [
    ...mockConcepts,
    ...generatedConcepts.filter(
      (gc) => !mockConcepts.some((mc) => mc.slug === gc.slug)
    ),
  ];

  const filtered = allConcepts.filter((concept) => {
    const q = search.toLowerCase();
    return (
      concept.name.toLowerCase().includes(q) ||
      concept.simpleExplanation.toLowerCase().includes(q) ||
      concept.whyItMattersNow.toLowerCase().includes(q) ||
      concept.relatedConcepts.some((rc) => rc.toLowerCase().includes(q))
    );
  });

  async function handleExplain(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const concept: Concept = await res.json();
      // Navigate to the generated concept page
      router.push(`/learn/${concept.slug}?generated=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Learn
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Paste any AI term, headline, or tweet to get an explanation
        </p>
      </header>

      {/* AI-powered explain input */}
      <form onSubmit={handleExplain} className="mb-8">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Explain this
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 'RAG', 'mixture of experts', or paste a headline…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Explain"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </form>

      {/* Divider */}
      <div className="mb-6 border-t border-zinc-200" />

      {/* Browse existing concepts */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Browse concepts
      </h2>
      <input
        type="text"
        placeholder="Search concepts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No concepts found matching &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((concept) => (
            <Link
              key={concept.id}
              href={`/learn/${concept.slug}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <h2 className="text-base font-semibold text-zinc-900">
                {concept.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                {concept.simpleExplanation}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
