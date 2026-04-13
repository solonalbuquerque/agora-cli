import {describe, expect, it} from "vitest";
import {buildExternalCapabilityExecutionBody, mapCapabilityListRows} from "../../src/commands/capabilities/shared";

describe("capabilities shared helpers", () => {
  it("maps legacy service fields into capability rows", () => {
    expect(mapCapabilityListRows({data: [{id: "svc_echo", serviceCode: "svc_echo", name: "Echo", status: "active"}]})).toEqual([
      {id: "svc_echo", code: "svc_echo", name: "Echo", status: "active"}
    ]);
  });

  it("builds external execution payload with canonical and legacy identifiers", () => {
    expect(
      buildExternalCapabilityExecutionBody({
        capabilityId: "svc_echo",
        input: {message: "hello"},
        idempotencyKey: "idem-123",
        correlationId: "corr-123"
      })
    ).toEqual({
      capabilityCode: "svc_echo",
      serviceCode: "svc_echo",
      input: {message: "hello"},
      idempotencyKey: "idem-123",
      correlationId: "corr-123"
    });
  });
});
