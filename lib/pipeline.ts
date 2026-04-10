import { ingestAll } from "@/lib/ingest";
import { deduplicate } from "@/lib/deduplicate";
import { tagAll } from "@/lib/topics";
import { scoreAll } from "@/lib/scoring";
import { enrichTopArticles } from "@/lib/ai";
import { writeData } from "@/lib/storage";
import type { Article } from "@/types";

/**
 * Run the full pipeline: fetch → deduplicate → tag → score → save.
 * Returns the processed articles.
 */
export async function runPipeline(): Promise<Article[]> {
  console.log("1. Fetching RSS feeds...");
  const raw = await ingestAll();
  console.log(`   Got ${raw.length} raw articles`);

  console.log("2. Deduplicating...");
  const deduped = deduplicate(raw);
  console.log(`   ${raw.length} → ${deduped.length} (removed ${raw.length - deduped.length})`);

  console.log("3. Tagging topics...");
  const tagged = tagAll(deduped);

  console.log("4. Scoring importance...");
  const scored = scoreAll(tagged);

  // Sort by score descending
  scored.sort((a, b) => b.importanceScore - a.importanceScore);

  const topCount = scored.filter((a) => a.importanceScore >= 7).length;
  console.log(`5. Generating "why it matters" for ${topCount} top articles...`);
  const enriched = await enrichTopArticles(scored);

  console.log("6. Saving to digest.json...");
  await writeData("digest.json", enriched);
  console.log(`   Saved ${enriched.length} articles`);

  return enriched;
}
