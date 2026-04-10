/**
 * Quick test — run with:
 *   npx tsx scripts/test-scoring.ts
 */
import { ingestAll } from "../lib/ingest";
import { deduplicate } from "../lib/deduplicate";
import { tagAll } from "../lib/topics";
import { scoreAll } from "../lib/scoring";

async function main() {
  const raw = await ingestAll();
  const deduped = deduplicate(raw);
  const tagged = tagAll(deduped);
  const scored = scoreAll(tagged);

  // Sort by score descending
  scored.sort((a, b) => b.importanceScore - a.importanceScore);

  console.log("Top 10 articles by importance:\n");
  for (const article of scored.slice(0, 10)) {
    console.log(`  ${article.importanceScore}/10  [${article.topics.join(", ")}]`);
    console.log(`         ${article.title}`);
    console.log(`         ${article.source}\n`);
  }

  // Score distribution
  const dist: Record<number, number> = {};
  for (const a of scored) {
    dist[a.importanceScore] = (dist[a.importanceScore] ?? 0) + 1;
  }
  console.log("Score distribution:");
  for (let i = 10; i >= 1; i--) {
    if (dist[i]) console.log(`  ${i}/10: ${dist[i]} articles`);
  }
}

main();
