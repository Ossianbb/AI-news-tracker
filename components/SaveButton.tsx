"use client";

import { useSavedItems } from "@/components/SavedItemsProvider";
import type { Article, Concept } from "@/types";

export default function SaveButton({
  itemId,
  itemType,
  data,
}: {
  itemId: string;
  itemType: "article" | "concept";
  data?: Article | Concept;
}) {
  const { isSaved, toggleSave } = useSavedItems();
  const saved = isSaved(itemId);

  return (
    <button
      onClick={() => toggleSave(itemId, itemType, data)}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        saved
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
