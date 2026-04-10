"use client";

import { useState } from "react";
import Link from "next/link";
import { useKnowledge } from "@/components/KnowledgeProvider";
import { mockConcepts } from "@/data/mock-concepts";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type QuizState = "idle" | "loading" | "playing" | "results";

export default function QuizPage() {
  const { conceptLevels, readArticleIds } = useKnowledge();
  const [state, setState] = useState<QuizState>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState("");

  // Concepts the user is learning (assessed but not "know-it-well")
  const learningConcepts = mockConcepts.filter((c) => {
    const level = conceptLevels[c.id];
    return level && level !== "know-it-well";
  });

  // If no concepts assessed, use all mock concepts
  const quizConcepts =
    learningConcepts.length > 0 ? learningConcepts : mockConcepts;

  async function startQuiz() {
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepts: quizConcepts.map((c) => ({
            name: c.name,
            description: c.simpleExplanation,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate quiz");
      }

      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setCurrentIndex(0);
      setShowExplanation(false);
      setState("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  function selectAnswer(optionIndex: number) {
    if (showExplanation) return; // already answered
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  }

  function nextQuestion() {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setState("results");
    }
  }

  const score = answers.filter(
    (a, i) => a === questions[i]?.correctIndex
  ).length;

  if (state === "idle" || state === "loading") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <Link
          href="/knowledge"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          &larr; Back to progress
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">
          Quiz
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Test your understanding of AI concepts. The quiz is based on{" "}
          {learningConcepts.length > 0
            ? "concepts you're currently learning"
            : "all available concepts"}
          .
        </p>

        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-zinc-700">
            Topics covered:
          </h2>
          <div className="flex flex-wrap gap-2">
            {quizConcepts.map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          disabled={state === "loading"}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {state === "loading" ? "Generating questions…" : "Start quiz"}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (state === "playing") {
    const q = questions[currentIndex];
    const selected = answers[currentIndex];
    const isCorrect = selected === q.correctIndex;

    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="mb-4 text-sm text-zinc-500">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <h2 className="mb-6 text-lg font-semibold text-zinc-900">
          {q.question}
        </h2>

        <div className="mb-6 flex flex-col gap-3">
          {q.options.map((option, i) => {
            let style =
              "rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm transition-colors";

            if (showExplanation) {
              if (i === q.correctIndex) {
                style =
                  "rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-left text-sm text-green-800";
              } else if (i === selected && !isCorrect) {
                style =
                  "rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-left text-sm text-red-800";
              } else {
                style =
                  "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-400";
              }
            } else {
              style += " hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
            }

            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                disabled={showExplanation}
                className={style}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mb-6">
            <p
              className={`mb-2 text-sm font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}
            >
              {isCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="text-sm text-zinc-600">{q.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <button
            onClick={nextQuestion}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {currentIndex < questions.length - 1
              ? "Next question"
              : "See results"}
          </button>
        )}
      </div>
    );
  }

  // Results
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">
        Results
      </h1>
      <p className="mb-6 text-lg text-zinc-600">
        You scored{" "}
        <span className="font-bold text-zinc-900">
          {score}/{questions.length}
        </span>
      </p>

      <div className="mb-8 space-y-4">
        {questions.map((q, i) => {
          const wasCorrect = answers[i] === q.correctIndex;
          return (
            <div
              key={i}
              className={`rounded-lg border p-4 ${wasCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <p className="mb-1 text-sm font-medium text-zinc-900">
                {i + 1}. {q.question}
              </p>
              <p className="text-sm text-zinc-600">
                {wasCorrect ? (
                  <>Your answer: {q.options[answers[i]!]}</>
                ) : (
                  <>
                    Your answer: {q.options[answers[i]!]} — Correct answer:{" "}
                    {q.options[q.correctIndex]}
                  </>
                )}
              </p>
              {!wasCorrect && (
                <p className="mt-1 text-sm italic text-zinc-500">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setState("idle");
            setQuestions([]);
          }}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href="/knowledge"
          className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Back to progress
        </Link>
      </div>
    </div>
  );
}
