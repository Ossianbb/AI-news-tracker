/**
 * Quick test script — run with:
 *   npx tsx scripts/test-ingest.ts
 */
import { ingestAll } from "../lib/ingest";

async function main() {
  console.log("Fetching RSS feeds...\n");
  const articles = await ingestAll();
  console.log(`Got ${articles.length} articles total.\n`);

  // Show the 5 most recent
  for (const article of articles.slice(0, 5)) {
    console.log(`[${article.source}] ${article.title}`);
    console.log(`  ${article.publishedAt}`);
    console.log(`  ${article.summary.slice(0, 120)}...`);
    console.log();
  }
}

main();
