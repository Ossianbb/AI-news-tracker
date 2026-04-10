import { notFound } from "next/navigation";
import Link from "next/link";
import { mockConcepts } from "@/data/mock-concepts";
import { readData } from "@/lib/storage";
import SaveButton from "@/components/SaveButton";
import GenerateConceptLink from "@/components/GenerateConceptLink";
import ConceptLevelPicker from "@/components/ConceptLevelPicker";
import type { Concept } from "@/types";

/** Load all concepts: mock + any AI-generated ones from cache */
async function getAllConcepts(): Promise<Concept[]> {
  const generated = (await readData<Concept[]>("concepts.json")) ?? [];
  return [...mockConcepts, ...generated];
}

export function generateStaticParams() {
  return mockConcepts.map((concept) => ({ slug: concept.slug }));
}

export const dynamicParams = true;

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allConcepts = await getAllConcepts();
  const concept = allConcepts.find((c) => c.slug === slug);

  if (!concept) return notFound();

  // Find related concepts — check by ID or by name match
  const relatedConcepts = allConcepts.filter(
    (c) =>
      concept.relatedConcepts.includes(c.id) ||
      concept.relatedConcepts.some(
        (rc) => rc.toLowerCase() === c.name.toLowerCase()
      )
  );

  // Related concepts that aren't in our data yet (can be generated)
  const uncachedRelated = concept.relatedConcepts.filter(
    (rc) =>
      !allConcepts.some(
        (c) =>
          c.id === rc || c.name.toLowerCase() === rc.toLowerCase()
      )
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link
        href="/learn"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        &larr; Back to concepts
      </Link>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 text-3xl font-bold tracking-tight text-zinc-900">
          {concept.name}
        </h1>
        <SaveButton itemId={concept.id} itemType="concept" />
      </div>

      {/* Simple explanation */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          In plain terms
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700">
          {concept.simpleExplanation}
        </p>
      </section>

      {/* Deeper explanation */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Going deeper
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700">
          {concept.deeperExplanation}
        </p>
      </section>

      {/* Why it matters now */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Why it matters now
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700">
          {concept.whyItMattersNow}
        </p>
      </section>

      {/* Examples */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Examples
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700">
          {concept.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </section>

      {/* Related concepts — cached ones are clickable links */}
      {(relatedConcepts.length > 0 || uncachedRelated.length > 0) && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Related concepts
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((related) => (
              <Link
                key={related.id}
                href={`/learn/${related.slug}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
              >
                {related.name}
              </Link>
            ))}
            {uncachedRelated.map((name) => (
              <GenerateConceptLink key={name} name={name} />
            ))}
          </div>
        </section>
      )}

      {/* Self-assessment */}
      <section className="mb-6">
        <ConceptLevelPicker conceptId={concept.id} />
      </section>

      {/* Resources */}
      {concept.resources.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Further reading
          </h2>
          <ul className="space-y-1">
            {concept.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
