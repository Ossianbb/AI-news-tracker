/** A single news article from an RSS feed or other source */
export type Article = {
  /** Unique identifier */
  id: string;
  /** Article headline */
  title: string;
  /** Publication or blog name */
  source: string;
  /** Link to the original article */
  url: string;
  /** ISO 8601 date string */
  publishedAt: string;
  /** Short summary of the article */
  summary: string;
  /** Topic tags (e.g. "models", "policy", "agents") */
  topics: string[];
  /** Importance ranking from 1 (low) to 10 (high) */
  importanceScore: number;
  /** One-sentence explanation of why this story matters */
  whyItMatters: string;
  /** Shared ID for articles covering the same story */
  clusterId?: string;
};

/** An AI concept with layered explanations */
export type Concept = {
  /** Unique identifier */
  id: string;
  /** Display name (e.g. "Inference-Time Compute") */
  name: string;
  /** URL-safe slug (e.g. "inference-time-compute") */
  slug: string;
  /** Plain-language, one-paragraph explanation */
  simpleExplanation: string;
  /** More detailed technical explanation */
  deeperExplanation: string;
  /** Why this concept is relevant right now */
  whyItMattersNow: string;
  /** IDs of related concepts */
  relatedConcepts: string[];
  /** Concrete examples illustrating the concept */
  examples: string[];
  /** Further reading */
  resources: { title: string; url: string }[];
};

/** An item the user has saved to their library */
export type SavedItem = {
  /** ID of the saved article or concept */
  itemId: string;
  /** Whether this is an article or a concept */
  itemType: "article" | "concept";
  /** ISO 8601 date string when the item was saved */
  savedAt: string;
  /** Snapshot of the full article or concept at save time */
  snapshot?: Article | Concept;
};

/** Tracks the user's reading history and concept understanding */
export type UserKnowledge = {
  /** IDs of articles the user has read */
  readArticleIds: string[];
  /** Self-assessed understanding level per concept ID */
  conceptLevels: Record<string, ConceptLevel>;
};

/** How well the user understands a concept */
export type ConceptLevel = "new" | "heard-of-it" | "could-explain" | "know-it-well";
