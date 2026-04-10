import { GoogleGenAI } from "@google/genai";
import type { Article } from "@/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];

/**
 * Generate a one-sentence "why it matters" summary for an article.
 * Tries multiple models in order — falls back if one is overloaded.
 */
export async function generateWhyItMatters(
  article: Pick<Article, "title" | "summary">
): Promise<string> {
  const prompt = `You are an AI news analyst. Given this article title and summary, write ONE sentence explaining why this development matters for people following AI. Be specific and insightful, not generic. No preamble — just the sentence.

Title: ${article.title}
Summary: ${article.summary}`;

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text?.trim() ?? "";
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      console.log(`   ${model} failed (${status}), trying next...`);
    }
  }

  throw new Error("All models unavailable");
}

/**
 * Add "why it matters" to top-scoring articles (score 7+).
 * Processes sequentially to stay within rate limits.
 */
export async function enrichTopArticles(articles: Article[]): Promise<Article[]> {
  const result: Article[] = [];

  for (const article of articles) {
    if (article.importanceScore >= 7 && article.summary.length > 0) {
      try {
        const whyItMatters = await generateWhyItMatters(article);
        result.push({ ...article, whyItMatters });
        console.log(`   ✓ ${article.title.slice(0, 60)}...`);
      } catch (error) {
        console.error(`   ✗ Failed: ${article.title.slice(0, 60)} — ${error}`);
        result.push(article);
      }
    } else {
      result.push(article);
    }
  }

  return result;
}
