import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const IS_VERCEL = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Read a JSON data file. Uses Vercel Blob in production, local files in dev.
 * Returns null if the file doesn't exist.
 */
export async function readData<T>(key: string): Promise<T | null> {
  if (IS_VERCEL) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: key });
    const match = blobs.find((b) => b.pathname === key);
    if (!match) return null;
    const res = await fetch(match.url);
    return (await res.json()) as T;
  }

  const filePath = path.join(process.cwd(), "data", key);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

/**
 * Write a JSON data file. Uses Vercel Blob in production, local files in dev.
 */
export async function writeData(key: string, data: unknown): Promise<void> {
  if (IS_VERCEL) {
    const { put } = await import("@vercel/blob");
    await put(key, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return;
  }

  const filePath = path.join(process.cwd(), "data", key);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}
