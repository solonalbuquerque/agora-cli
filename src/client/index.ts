import {AgoraInstanceClient} from "./agora-instance-client";
import {HttpFallbackClient} from "./http-fallback-client";
import {OfficialSdkClient} from "./official-sdk-client";

type ClientFactoryOptions = {
  baseUrl: string;
  headers: Record<string, string>;
  timeoutMs: number;
  requestId?: string;
};

export function createClient(options: ClientFactoryOptions): AgoraInstanceClient {
  const useSdk = process.env.AGORA_USE_SDK === "true";
  if (useSdk) {
    const sdk = tryLoadSdk(options);
    if (sdk) return new OfficialSdkClient({sdk});
  }

  return new HttpFallbackClient(options);
}

function tryLoadSdk(options: ClientFactoryOptions): {request<T>(options: unknown): Promise<T>} | null {
  try {
    // Optional dependency by design for standalone OSS repo bootstrap.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sdkModule = require("@agora/sdk");
    if (!sdkModule?.createClient) return null;
    return sdkModule.createClient({
      baseUrl: options.baseUrl,
      headers: options.headers,
      timeoutMs: options.timeoutMs
    });
  } catch {
    return null;
  }
}