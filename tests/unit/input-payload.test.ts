import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {parseStructuredInput} from "../../src/input/payload";

describe("structured input", () => {
  it("parses inline JSON", async () => {
    const parsed = await parseStructuredInput('{"x":1}');
    expect(parsed).toEqual({x: 1});
  });

  it("parses file JSON", async () => {
    const tmp = path.join(os.tmpdir(), `agora-input-${Date.now()}.json`);
    fs.writeFileSync(tmp, '{"y":2}', "utf8");
    const parsed = await parseStructuredInput(undefined, tmp);
    expect(parsed).toEqual({y: 2});
  });
});