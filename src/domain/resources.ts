import {AgoraInstanceClient} from "../client/agora-instance-client";

export async function listResource(client: AgoraInstanceClient, path: string, query?: Record<string, unknown>): Promise<unknown> {
  return client.request({method: "GET", path, query: query as Record<string, string | number | boolean | undefined>});
}

export async function getResource(client: AgoraInstanceClient, path: string): Promise<unknown> {
  return client.request({method: "GET", path});
}

export async function postResource(client: AgoraInstanceClient, path: string, body?: unknown): Promise<unknown> {
  return client.request({method: "POST", path, body});
}

export async function patchResource(client: AgoraInstanceClient, path: string, body?: unknown): Promise<unknown> {
  return client.request({method: "PATCH", path, body});
}