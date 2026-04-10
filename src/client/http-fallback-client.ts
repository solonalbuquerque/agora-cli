import {CliError} from "../errors/cli-error";
import {EXIT_CODES} from "../errors/exit-codes";
import {AgoraApiResponse, AgoraInstanceClient, RequestOptions} from "./agora-instance-client";

export type HttpFallbackClientOptions = {
  baseUrl: string;
  headers: Record<string, string>;
  timeoutMs: number;
  requestId?: string;
};

export class HttpFallbackClient implements AgoraInstanceClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeoutMs: number;
  private readonly requestId?: string;

  public constructor(options: HttpFallbackClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.defaultHeaders = options.headers;
    this.timeoutMs = options.timeoutMs;
    this.requestId = options.requestId;
  }

  public async request<T = unknown>(options: RequestOptions): Promise<AgoraApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${options.path}`);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || this.timeoutMs);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...(this.requestId ? {"X-Request-Id": this.requestId} : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal
      });

      const text = await response.text();
      const parsed = text ? (JSON.parse(text) as AgoraApiResponse<T>) : ({ok: response.ok} as AgoraApiResponse<T>);

      if (!response.ok) {
        const message = typeof parsed.message === "string" ? parsed.message : `Request failed with status ${response.status}`;
        const err = new CliError(message, String(parsed.code || response.status), response.status >= 500 ? EXIT_CODES.API_5XX : EXIT_CODES.API_4XX, parsed);
        (err as CliError & {status?: number}).status = response.status;
        throw err;
      }

      return parsed;
    } catch (error) {
      if (error instanceof CliError) throw error;

      if (error instanceof Error && error.name === "AbortError") {
        throw new CliError("Request timed out", "NETWORK_TIMEOUT", EXIT_CODES.NETWORK_TIMEOUT, {path: options.path});
      }

      throw new CliError("Network request failed", "NETWORK_ERROR", EXIT_CODES.NETWORK_TIMEOUT, error);
    } finally {
      clearTimeout(timer);
    }
  }
}