import {describe, expect, it, vi} from "vitest";
import {setProfile, writeConfigFile} from "../../src/config/profiles";
import {resolveConfig} from "../../src/config/loader";

describe("config resolution", () => {
  it("prioritizes flags over env and config", () => {
    writeConfigFile({
      activeProfile: "default",
      profiles: {
        default: {
          name: "default",
          baseUrl: "http://config.example",
          authType: "apiKey",
          apiKey: "cfg"
        }
      }
    });

    vi.stubEnv("AGORA_BASE_URL", "http://env.example");
    vi.stubEnv("AGORA_API_KEY", "env-key");

    const resolved = resolveConfig({
      baseUrl: "http://flag.example"
    });

    expect(resolved.baseUrl).toBe("http://flag.example");
    expect(resolved.headers["X-API-Key"]).toBe("env-key");
  });

  it("reads selected profile", () => {
    setProfile("ops", {name: "ops", baseUrl: "http://ops", authType: "bearer", token: "t1"});
    const resolved = resolveConfig({profile: "ops"});
    expect(resolved.profile).toBe("ops");
    expect(resolved.headers.Authorization).toBe("Bearer t1");
  });
});