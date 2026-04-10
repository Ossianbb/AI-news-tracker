import { readData } from "@/lib/storage";
import { mockArticles } from "@/data/mock-articles";
import type { Article } from "@/types";

/** GET /api/articles — return all articles (digest.json + mock fallback) */
export async function GET() {
  const articles = await readData<Article[]>("digest.json");
  return Response.json(articles ?? mockArticles);
}
