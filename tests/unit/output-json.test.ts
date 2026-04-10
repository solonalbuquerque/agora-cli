import {describe, expect, it} from "vitest";
import {toJsonEnvelope, toJsonError} from "../../src/output/json";

describe("json output", () => {
  it("creates stable success envelope", () => {
    expect(toJsonEnvelope({id: 1})).toEqual({ok: true, data: {id: 1}});
  });

  it("creates stable error envelope", () => {
    expect(toJsonError("X", "failed")).toEqual({
      ok: false,
      error: {code: "X", message: "failed"}
    });
  });
});