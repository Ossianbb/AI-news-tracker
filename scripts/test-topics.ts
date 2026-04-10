/**
 * Quick test — run with:
 *   npx tsx scripts/test-topics.ts
 */
import { ingestAll } from "../lib/ingest";
import { deduplicate } from "../lib/deduplicate";
import { tagAll } from "../lib/topics";

async function main() {
  const raw = await ingestAll();
  const deduped = deduplicate(raw);
  const tagged = tagAll(deduped);

  // Count articles per topic
  const counts: Record<string, number> = {};
  for (const article of tagged) {
    for (const topic of article.topics) {
      counts[topic] = (counts[topic] ?? 0) + 1;
    }
  }

  console.log("Topic breakdown:\n");
  for (const [topic, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${topic}: ${count}`);
  }

  console.log(`\nSample tagged articles:\n`);
  for (const article of tagged.slice(0, 8)) {
    console.log(`  [${article.topics.join(", ")}] ${article.title}`);
  }
}

main();
