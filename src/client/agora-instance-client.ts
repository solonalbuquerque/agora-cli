export type ListParams = Record<string, string | number | boolean | undefined>;

export type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: ListParams;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export type AgoraApiResponse<T = unknown> = {
  ok?: boolean;
  data?: T;
  meta?: unknown;
  [key: string]: unknown;
};

export interface AgoraInstanceClient {
  request<T = unknown>(options: RequestOptions): Promise<AgoraApiResponse<T>>;
}