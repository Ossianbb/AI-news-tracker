"use client";

import { useKnowledge } from "@/components/KnowledgeProvider";
import type { ConceptLevel } from "@/types";

const levels: { value: ConceptLevel; label: string }[] = [
  { value: "new", label: "New to me" },
  { value: "heard-of-it", label: "Heard of it" },
  { value: "could-explain", label: "Could explain it" },
  { value: "know-it-well", label: "Know it well" },
];

export default function ConceptLevelPicker({
  conceptId,
}: {
  conceptId: string;
}) {
  const { getConceptLevel, setConceptLevel } = useKnowledge();
  const current = getConceptLevel(conceptId);

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        How well do you understand this?
      </h2>
      <div className="flex flex-wrap gap-2">
        {levels.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setConceptLevel(conceptId, value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              current === value
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
