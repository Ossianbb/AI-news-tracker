/**
 * Run the full ingestion pipeline — run with:
 *   npx tsx scripts/run-pipeline.ts
 */
import { runPipeline } from "../lib/pipeline";

async function main() {
  console.log("=== AI News Digest Pipeline ===\n");
  const articles = await runPipeline();
  console.log(`\nDone! Top 5 stories:\n`);

  for (const article of articles.slice(0, 5)) {
    console.log(`  ${article.importanceScore}/10  ${article.title}`);
    console.log(`         [${article.topics.join(", ")}] — ${article.source}\n`);
  }
}

main();
