import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ConceptInput = { name: string; description: string };

/**
 * POST /api/quiz
 * Takes { concepts: { name, description }[] } — concepts with their definitions.
 * Returns { questions: QuizQuestion[] }
 */
export async function POST(request: Request) {
  const { concepts } = (await request.json()) as { concepts: ConceptInput[] };

  if (!concepts || concepts.length === 0) {
    return Response.json(
      { error: "At least one concept is required" },
      { status: 400 }
    );
  }

  const conceptDetails = concepts
    .map((c) => `- ${c.name}: ${c.description}`)
    .join("\n");

  const prompt = `You are an AI educator creating a quiz. Generate 5 multiple-choice questions based ONLY on the concept definitions provided below. Do NOT use your own knowledge — use ONLY the definitions given.

Concepts and their definitions:
${conceptDetails}

Return a JSON array (no markdown, no code fences, just raw JSON) with exactly 5 objects matching this structure:

[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "A brief explanation of why the correct answer is right"
  }
]

Rules:
- Each question should have exactly 4 options
- correctIndex is 0-based (0 = first option, 3 = last)
- Mix up which position the correct answer is in
- Questions should test understanding, not just recall
- Explanations should be clear and educational
- Only return valid JSON, nothing else`;

  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];

  try {
    let text = "";
    let succeeded = false;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        text = response.text?.trim() ?? "";
        succeeded = true;
        break;
      } catch {
        continue;
      }
    }

    if (!succeeded) {
      return Response.json(
        { error: "Gemini is temporarily overloaded. Please wait a minute and try again." },
        { status: 503 }
      );
    }

    const questions = JSON.parse(text) as QuizQuestion[];
    return Response.json({ questions });
  } catch (error) {
    console.error("Quiz API error:", error);
    return Response.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
