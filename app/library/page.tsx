"use client";

import Link from "next/link";
import { useSavedItems } from "@/components/SavedItemsProvider";
import ArticleCard from "@/components/ArticleCard";
import type { Article, Concept } from "@/types";

export default function LibraryPage() {
  const { savedItems } = useSavedItems();

  const savedArticles = savedItems
    .filter((item) => item.itemType === "article" && item.snapshot)
    .map((item) => ({
      ...item,
      data: item.snapshot as Article,
    }));

  const savedConcepts = savedItems
    .filter((item) => item.itemType === "concept" && item.snapshot)
    .map((item) => ({
      ...item,
      data: item.snapshot as Concept,
    }));

  const isEmpty = savedArticles.length === 0 && savedConcepts.length === 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Library
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your saved articles and concepts
        </p>
      </header>

      {isEmpty ? (
        <p className="text-sm text-zinc-500">
          Nothing saved yet. Hit the &ldquo;Save&rdquo; button on any article or
          concept to add it here.
        </p>
      ) : (
        <>
          {savedArticles.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Articles ({savedArticles.length})
              </h2>
              <div className="flex flex-col gap-4">
                {savedArticles.map((item) => (
                  <div key={item.itemId}>
                    <ArticleCard article={item.data!} />
                    <p className="mt-1 text-xs text-zinc-400">
                      Saved{" "}
                      {new Date(item.savedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {savedConcepts.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Concepts ({savedConcepts.length})
              </h2>
              <div className="flex flex-col gap-3">
                {savedConcepts.map((item) => (
                  <div key={item.itemId}>
                    <Link
                      href={`/learn/${item.data!.slug}`}
                      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
                    >
                      <h3 className="text-base font-semibold text-zinc-900">
                        {item.data!.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                        {item.data!.simpleExplanation}
                      </p>
                    </Link>
                    <p className="mt-1 text-xs text-zinc-400">
                      Saved{" "}
                      {new Date(item.savedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
