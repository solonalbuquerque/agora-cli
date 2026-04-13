import {describe, expect, it} from "vitest";
import CapabilitiesExecute from "../../src/commands/capabilities/execute";
import WalletTransfer from "../../src/commands/wallet/transfer";
import AuthLogin from "../../src/commands/auth/login";

describe("command contracts", () => {
  it("capabilities execute exposes structured input flags", () => {
    expect(CapabilitiesExecute.flags.input).toBeTruthy();
    expect(CapabilitiesExecute.flags["input-file"]).toBeTruthy();
    expect(CapabilitiesExecute.flags["input-stdin"]).toBeTruthy();
  });

  it("wallet transfer supports idempotency key", () => {
    expect(WalletTransfer.flags["idempotency-key"]).toBeTruthy();
  });

  it("auth login supports non-interactive mode", () => {
    expect(AuthLogin.flags["non-interactive"]).toBeTruthy();
  });
});
