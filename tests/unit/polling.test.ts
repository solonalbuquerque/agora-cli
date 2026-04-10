import {describe, expect, it} from "vitest";
import {pollUntil} from "../../src/utils/polling";

describe("polling", () => {
  it("polls until terminal state", async () => {
    let count = 0;
    const result = await pollUntil({
      get: async () => ({status: count++ >= 2 ? "done" : "running"}),
      isTerminal: (v) => v.status === "done",
      intervalMs: 1,
      timeoutMs: 500,
      onUpdate: () => undefined
    });

    expect(result.status).toBe("done");
  });
});