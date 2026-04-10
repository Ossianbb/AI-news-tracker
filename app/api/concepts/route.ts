import { readData } from "@/lib/storage";
import type { Concept } from "@/types";

/** GET /api/concepts — return all cached AI-generated concepts */
export async function GET() {
  const concepts = await readData<Concept[]>("concepts.json");
  return Response.json(concepts ?? []);
}
