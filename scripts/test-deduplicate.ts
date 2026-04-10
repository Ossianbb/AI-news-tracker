/**
 * Quick test — run with:
 *   npx tsx scripts/test-deduplicate.ts
 */
import { ingestAll } from "../lib/ingest";
import { deduplicate } from "../lib/deduplicate";

async function main() {
  console.log("Fetching RSS feeds...");
  const raw = await ingestAll();
  console.log(`Raw articles: ${raw.length}`);

  const deduped = deduplicate(raw);
  console.log(`After deduplication: ${deduped.length}`);
  console.log(`Removed ${raw.length - deduped.length} duplicates\n`);

  // Show any clustered articles
  const clustered = deduped.filter((a) => a.clusterId);
  if (clustered.length > 0) {
    console.log("Clustered stories (kept the best version):");
    for (const article of clustered) {
      console.log(`  [${article.source}] ${article.title}`);
    }
  } else {
    console.log("No duplicate stories found today.");
  }
}

main();
