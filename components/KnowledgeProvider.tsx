"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ConceptLevel } from "@/types";

const STORAGE_KEY_READ = "knowledge:readArticleIds";
const STORAGE_KEY_LEVELS = "knowledge:conceptLevels";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

type KnowledgeContextType = {
  /** Check if an article has been read */
  isRead: (articleId: string) => boolean;
  /** Mark an article as read */
  markRead: (articleId: string) => void;
  /** Get all read article IDs */
  readArticleIds: string[];
  /** Get the understanding level for a concept */
  getConceptLevel: (conceptId: string) => ConceptLevel | undefined;
  /** Set the understanding level for a concept */
  setConceptLevel: (conceptId: string, level: ConceptLevel) => void;
  /** All concept levels */
  conceptLevels: Record<string, ConceptLevel>;
};

const KnowledgeContext = createContext<KnowledgeContextType | null>(null);

export function KnowledgeProvider({ children }: { children: React.ReactNode }) {
  const [readArticleIds, setReadArticleIds] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEY_READ, [])
  );
  const [conceptLevels, setConceptLevels] = useState<Record<string, ConceptLevel>>(() =>
    loadFromStorage<Record<string, ConceptLevel>>(STORAGE_KEY_LEVELS, {})
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(readArticleIds));
  }, [readArticleIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(conceptLevels));
  }, [conceptLevels]);

  const isRead = useCallback(
    (articleId: string) => readArticleIds.includes(articleId),
    [readArticleIds]
  );

  const markRead = useCallback((articleId: string) => {
    setReadArticleIds((prev) =>
      prev.includes(articleId) ? prev : [...prev, articleId]
    );
  }, []);

  const getConceptLevel = useCallback(
    (conceptId: string) => conceptLevels[conceptId],
    [conceptLevels]
  );

  const setConceptLevel = useCallback(
    (conceptId: string, level: ConceptLevel) => {
      setConceptLevels((prev) => ({ ...prev, [conceptId]: level }));
    },
    []
  );

  return (
    <KnowledgeContext
      value={{
        isRead,
        markRead,
        readArticleIds,
        getConceptLevel,
        setConceptLevel,
        conceptLevels,
      }}
    >
      {children}
    </KnowledgeContext>
  );
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within a KnowledgeProvider");
  }
  return context;
}
