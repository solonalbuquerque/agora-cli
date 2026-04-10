import {describe, expect, it} from "vitest";
import {CliError} from "../../src/errors/cli-error";
import {EXIT_CODES} from "../../src/errors/exit-codes";
import {mapError} from "../../src/errors/mapper";

describe("error mapper", () => {
  it("keeps cli error as-is", () => {
    const input = new CliError("x", "Y", EXIT_CODES.API_4XX);
    expect(mapError(input)).toBe(input);
  });

  it("maps generic errors", () => {
    const mapped = mapError(new Error("boom"));
    expect(mapped.code).toBe("UNEXPECTED");
  });
});