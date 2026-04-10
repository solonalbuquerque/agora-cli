import crypto from "node:crypto";

export function buildIdempotencyKey(seed?: string): string {
  if (seed) {
    return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 24);
  }

  return crypto.randomUUID().replace(/-/g, "");
}