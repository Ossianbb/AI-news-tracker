"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * A clickable pill that generates a concept explanation when clicked.
 * Used for related concepts that aren't in the cache yet.
 */
export default function GenerateConceptLink({ name }: { name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: name }),
      });

      if (!res.ok) throw new Error("Failed");

      const concept = await res.json();
      router.push(`/learn/${concept.slug}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm text-zinc-500 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
    >
      {loading ? "Generating…" : `${name} +`}
    </button>
  );
}
