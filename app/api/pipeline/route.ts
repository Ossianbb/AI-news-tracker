import { runPipeline } from "@/lib/pipeline";

/**
 * Checks the CRON_SECRET if one is configured.
 * Accepts Bearer token (Vercel Cron) or ?secret= query param (manual trigger).
 * If no CRON_SECRET is set, allows all requests (local dev).
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Allow unauthenticated access only in local dev
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization");
  const bearerToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const { searchParams } = new URL(request.url);
  const queryToken = searchParams.get("secret");

  return bearerToken === secret || queryToken === secret;
}

async function handlePipeline(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await runPipeline();
    return Response.json({
      ok: true,
      articlesProcessed: articles.length,
      topStories: articles.slice(0, 5).map((a) => a.title),
    });
  } catch (error: unknown) {
    console.error("Pipeline error:", error);
    return Response.json(
      { error: "Pipeline failed", detail: String(error) },
      { status: 500 }
    );
  }
}

/** GET /api/pipeline — used by Vercel Cron */
export const GET = handlePipeline;

/** POST /api/pipeline — for manual triggers */
export const POST = handlePipeline;
