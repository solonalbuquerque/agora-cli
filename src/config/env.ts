import {GlobalFlagInput} from "./schema";

export function envConfig(): GlobalFlagInput & {
  profile?: string;
  authType?: "bearer" | "apiKey" | "agentHmac";
  token?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  agentId?: string;
  agentSecret?: string;
} {
  return {
    profile: process.env.AGORA_PROFILE,
    baseUrl: process.env.AGORA_BASE_URL,
    timeout: process.env.AGORA_TIMEOUT_MS ? Number(process.env.AGORA_TIMEOUT_MS) : undefined,
    requestId: process.env.AGORA_REQUEST_ID,
    authType: process.env.AGORA_AUTH_TYPE as "bearer" | "apiKey" | "agentHmac" | undefined,
    token: process.env.AGORA_BEARER_TOKEN,
    apiKey: process.env.AGORA_API_KEY,
    apiKeyHeader: process.env.AGORA_API_KEY_HEADER,
    agentId: process.env.AGORA_AGENT_ID,
    agentSecret: process.env.AGORA_AGENT_SECRET
  };
}