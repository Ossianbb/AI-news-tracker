import { readData } from "@/lib/storage";
import { mockArticles } from "@/data/mock-articles";
import DigestView from "@/components/DigestView";
import type { Article } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await readData<Article[]>("digest.json");
  const data = articles ?? [...mockArticles].sort(
    (a, b) => b.importanceScore - a.importanceScore
  );
  return <DigestView articles={data} />;
}
