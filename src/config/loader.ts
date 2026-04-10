import {CliError} from "../errors/cli-error";
import {EXIT_CODES} from "../errors/exit-codes";
import {buildAuthHeaders} from "./auth";
import {envConfig} from "./env";
import {readConfigFile} from "./profiles";
import {GlobalFlagInput, Profile, ResolvedConfig} from "./schema";

const DEFAULT_TIMEOUT_MS = 30_000;

function applyEnvToProfile(profile: Profile): Profile {
  const env = envConfig();
  return {
    ...profile,
    authType: env.authType || profile.authType,
    token: env.token || profile.token,
    apiKey: env.apiKey || profile.apiKey,
    apiKeyHeader: env.apiKeyHeader || profile.apiKeyHeader,
    agentId: env.agentId || profile.agentId,
    agentSecret: env.agentSecret || profile.agentSecret,
    baseUrl: env.baseUrl || profile.baseUrl
  };
}

export function resolveConfig(flags: GlobalFlagInput = {}): ResolvedConfig {
  const cfg = readConfigFile();
  const env = envConfig();

  const profileName = flags.profile || env.profile || cfg.activeProfile;
  const baseProfile = cfg.profiles[profileName];

  if (!baseProfile) {
    throw new CliError(`Profile not found: ${profileName}`, "PROFILE_NOT_FOUND", EXIT_CODES.AUTH_CONFIG);
  }

  const profile = applyEnvToProfile(baseProfile);

  if (flags.baseUrl) profile.baseUrl = flags.baseUrl;

  if (!profile.baseUrl) {
    throw new CliError("Missing base URL. Set --base-url or AGORA_BASE_URL or config profile.", "MISSING_BASE_URL", EXIT_CODES.AUTH_CONFIG);
  }

  const headers = buildAuthHeaders(profile);
  const timeoutMs = flags.timeout || env.timeout || DEFAULT_TIMEOUT_MS;

  return {
    profile: profileName,
    baseUrl: profile.baseUrl,
    authType: profile.authType,
    headers,
    timeoutMs,
    requestId: flags.requestId || env.requestId,
    json: Boolean(flags.json),
    verbose: Boolean(flags.verbose),
    noColor: Boolean(flags.noColor),
    yes: Boolean(flags.yes)
  };
}