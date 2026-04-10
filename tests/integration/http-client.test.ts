import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {HttpFallbackClient} from "../../src/client/http-fallback-client";

let server: import("node:http").Server;
let port = 0;

beforeAll(async () => {
  const http = await import("node:http");
  server = http.createServer((req, res) => {
    if (req.url === "/ok") {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify({ok: true, data: {id: "x1"}}));
      return;
    }

    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(JSON.stringify({ok: false, code: "NOT_FOUND", message: "missing"}));
  });

  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === "object") port = addr.port;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("http fallback client", () => {
  it("returns parsed response", async () => {
    const client = new HttpFallbackClient({baseUrl: `http://127.0.0.1:${port}`, headers: {}, timeoutMs: 1000});
    const res = await client.request({method: "GET", path: "/ok"});
    expect(res.ok).toBe(true);
  });

  it("throws mapped cli error on 404", async () => {
    const client = new HttpFallbackClient({baseUrl: `http://127.0.0.1:${port}`, headers: {}, timeoutMs: 1000});
    await expect(client.request({method: "GET", path: "/missing"})).rejects.toBeTruthy();
  });
});