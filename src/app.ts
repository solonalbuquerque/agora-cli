import {Flags} from "@oclif/core";
import {createClient} from "./client";
import {AgoraInstanceClient} from "./client/agora-instance-client";
import {resolveConfig} from "./config/loader";
import {GlobalFlagInput, ResolvedConfig} from "./config/schema";

export const globalFlags = {
  profile: Flags.string({description: "Config profile name"}),
  "base-url": Flags.string({description: "AGORA Instance base URL"}),
  json: Flags.boolean({description: "Machine-readable JSON output", default: false}),
  verbose: Flags.boolean({description: "Verbose error output", default: false}),
  "no-color": Flags.boolean({description: "Disable color output", default: false}),
  yes: Flags.boolean({description: "Assume yes for confirmations", default: false}),
  timeout: Flags.integer({description: "Request timeout in ms"}),
  "request-id": Flags.string({description: "Attach X-Request-Id header"})
};

export type AppContext = {
  config: ResolvedConfig;
  client: AgoraInstanceClient;
};

export function createAppContext(flags: Record<string, unknown>): AppContext {
  const config = resolveConfig({
    profile: flags.profile as GlobalFlagInput["profile"],
    baseUrl: flags["base-url"] as GlobalFlagInput["baseUrl"],
    timeout: flags.timeout as GlobalFlagInput["timeout"],
    requestId: flags["request-id"] as GlobalFlagInput["requestId"],
    json: flags.json as GlobalFlagInput["json"],
    verbose: flags.verbose as GlobalFlagInput["verbose"],
    noColor: flags["no-color"] as GlobalFlagInput["noColor"],
    yes: flags.yes as GlobalFlagInput["yes"]
  });

  const client = createClient({
    baseUrl: config.baseUrl,
    headers: config.headers,
    timeoutMs: config.timeoutMs,
    requestId: config.requestId
  });

  return {config, client};
}