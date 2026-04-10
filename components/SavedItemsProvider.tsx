"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { SavedItem } from "@/types";

const STORAGE_KEY = "savedItems";

function loadFromStorage(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type SavedItemsContextType = {
  savedItems: SavedItem[];
  isSaved: (itemId: string) => boolean;
  toggleSave: (itemId: string, itemType: "article" | "concept") => void;
};

const SavedItemsContext = createContext<SavedItemsContextType | null>(null);

export function SavedItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  const isSaved = useCallback(
    (itemId: string) => savedItems.some((item) => item.itemId === itemId),
    [savedItems]
  );

  const toggleSave = useCallback(
    (itemId: string, itemType: "article" | "concept") => {
      setSavedItems((prev) => {
        const exists = prev.some((item) => item.itemId === itemId);
        if (exists) {
          return prev.filter((item) => item.itemId !== itemId);
        }
        return [
          ...prev,
          { itemId, itemType, savedAt: new Date().toISOString() },
        ];
      });
    },
    []
  );

  return (
    <SavedItemsContext value={{ savedItems, isSaved, toggleSave }}>
      {children}
    </SavedItemsContext>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider");
  }
  return context;
}
