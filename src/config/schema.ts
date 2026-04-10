export type AuthType = "bearer" | "apiKey" | "agentHmac";

export type Profile = {
  name: string;
  baseUrl: string;
  authType: AuthType;
  token?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  agentId?: string;
  agentSecret?: string;
};

export type ConfigFile = {
  activeProfile: string;
  profiles: Record<string, Profile>;
};

export type ResolvedConfig = {
  profile: string;
  baseUrl: string;
  authType: AuthType;
  headers: Record<string, string>;
  timeoutMs: number;
  requestId?: string;
  json: boolean;
  verbose: boolean;
  noColor: boolean;
  yes: boolean;
};

export type GlobalFlagInput = {
  profile?: string;
  baseUrl?: string;
  timeout?: number;
  requestId?: string;
  json?: boolean;
  verbose?: boolean;
  noColor?: boolean;
  yes?: boolean;
};