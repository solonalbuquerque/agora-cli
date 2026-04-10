import fs from "node:fs";

export async function parseStructuredInput(input?: string, inputFile?: string, inputStdin?: boolean): Promise<unknown> {
  const selected = [Boolean(input), Boolean(inputFile), Boolean(inputStdin)].filter(Boolean).length;
  if (selected > 1) {
    throw new Error("Use only one of --input, --input-file, or --input-stdin.");
  }

  if (input) return JSON.parse(input);
  if (inputFile) return JSON.parse(fs.readFileSync(inputFile, "utf8"));
  if (inputStdin) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(Buffer.from(chunk));
    }

    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  }

  return undefined;
}