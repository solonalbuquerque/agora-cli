import {describe, expect, it} from "vitest";
import ServicesExecute from "../../src/commands/services/execute";
import WalletTransfer from "../../src/commands/wallet/transfer";
import AuthLogin from "../../src/commands/auth/login";

describe("command contracts", () => {
  it("services execute exposes structured input flags", () => {
    expect(ServicesExecute.flags.input).toBeTruthy();
    expect(ServicesExecute.flags["input-file"]).toBeTruthy();
    expect(ServicesExecute.flags["input-stdin"]).toBeTruthy();
  });

  it("wallet transfer supports idempotency key", () => {
    expect(WalletTransfer.flags["idempotency-key"]).toBeTruthy();
  });

  it("auth login supports non-interactive mode", () => {
    expect(AuthLogin.flags["non-interactive"]).toBeTruthy();
  });
});