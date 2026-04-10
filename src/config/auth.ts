import crypto from "node:crypto";
import {Profile} from "./schema";

export function buildAuthHeaders(profile: Profile): Record<string, string> {
  switch (profile.authType) {
    case "bearer": {
      if (!profile.token) return {};
      return {Authorization: `Bearer ${profile.token}`};
    }

    case "apiKey": {
      if (!profile.apiKey) return {};
      return {[profile.apiKeyHeader || "X-API-Key"]: profile.apiKey};
    }

    case "agentHmac": {
      if (!profile.agentId || !profile.agentSecret) return {};
      const timestamp = new Date().toISOString();
      const payload = `${profile.agentId}.${timestamp}`;
      const signature = crypto.createHmac("sha256", profile.agentSecret).update(payload).digest("hex");

      return {
        "X-Agent-Id": profile.agentId,
        "X-Timestamp": timestamp,
        "X-Signature": signature
      };
    }

    default:
      return {};
  }
}