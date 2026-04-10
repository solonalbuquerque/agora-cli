import {describe, expect, it} from "vitest";
import {buildAuthHeaders} from "../../src/config/auth";

describe("auth headers", () => {
  it("builds bearer header", () => {
    const headers = buildAuthHeaders({name: "p", baseUrl: "x", authType: "bearer", token: "abc"});
    expect(headers.Authorization).toBe("Bearer abc");
  });

  it("builds api key header", () => {
    const headers = buildAuthHeaders({name: "p", baseUrl: "x", authType: "apiKey", apiKey: "k1", apiKeyHeader: "X-Key"});
    expect(headers["X-Key"]).toBe("k1");
  });

  it("builds hmac headers", () => {
    const headers = buildAuthHeaders({name: "p", baseUrl: "x", authType: "agentHmac", agentId: "a1", agentSecret: "s1"});
    expect(headers["X-Agent-Id"]).toBe("a1");
    expect(headers["X-Signature"]).toBeTruthy();
  });
});