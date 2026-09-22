const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { WebSocket } = require("ws");
const { attachLocalVoiceServer } = require("../../dist/local/voice-server.js");
const {
  mintLocalVoiceCredential,
} = require("../../dist/local/voice-credential.js");

test("Voice gateway tickets are authenticated, private, short-lived and single-use", async (t) => {
  const server = http.createServer((req, res) => {
    if (!bridge.handleRequest(req, res)) {
      res.writeHead(404);
      res.end();
    }
  });
  const bridge = attachLocalVoiceServer(server, "gateway-fixture");
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  t.after(async () => {
    bridge.close();
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  });
  const base = "http://127.0.0.1:" + server.address().port;
  const mint = (headers = {}) =>
    fetch(base + "/local/voice/credential", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: "{}",
    });
  assert.equal((await mint()).status, 401);
  assert.equal(
    (
      await mint({
        authorization: "Bearer gateway-fixture",
        origin: "https://untrusted.invalid",
      })
    ).status,
    403,
  );
  const response = await mint({ authorization: "Bearer gateway-fixture" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  const ticket = await response.json();
  assert.equal(ticket.model, "grokbot-local-voice");
  assert.match(ticket.clientSecret, /^[a-f0-9]{64}$/);
  assert.ok(
    ticket.expiresAtUnixSeconds * 1000 > Date.now() &&
      ticket.expiresAtUnixSeconds * 1000 < Date.now() + 61000,
  );
  const dial = (secret, origin) =>
    new WebSocket(
      base.replace("http:", "ws:") + "/local/voice?model=grokbot-local-voice",
      ["grokbot-voice." + secret],
      origin ? { origin } : {},
    );
  const rejected = (socket, status) =>
    new Promise((resolve, reject) => {
      socket.on("unexpected-response", (_req, res) => {
        try {
          assert.equal(res.statusCode, status);
          res.resume();
          socket.terminate();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      socket.on("error", () => {});
      socket.on("open", () => reject(Error("Unexpected socket acceptance")));
    });
  await rejected(dial(ticket.clientSecret, "https://untrusted.invalid"), 403);
  const ws = dial(ticket.clientSecret, "file://"),
    events = [];
  t.after(() => ws.terminate());
  ws.on("message", (data) => events.push(JSON.parse(data)));
  await new Promise((r, j) => {
    ws.on("open", r);
    ws.on("error", j);
  });
  await rejected(dial(ticket.clientSecret), 401);
  assert.ok(events.some((e) => e.type === "session.created"));
  const oldBase = process.env.SAND_HOST_GATEWAY_URL,
    oldToken = process.env.SAND_HOST_GATEWAY_TOKEN;
  t.after(() => {
    if (oldBase === undefined) delete process.env.SAND_HOST_GATEWAY_URL;
    else process.env.SAND_HOST_GATEWAY_URL = oldBase;
    if (oldToken === undefined) delete process.env.SAND_HOST_GATEWAY_TOKEN;
    else process.env.SAND_HOST_GATEWAY_TOKEN = oldToken;
  });
  process.env.SAND_HOST_GATEWAY_URL = base;
  process.env.SAND_HOST_GATEWAY_TOKEN = "gateway-fixture";
  const credential = await mintLocalVoiceCredential();
  assert.equal(
    credential.websocketUrl,
    base.replace("http:", "ws:") + "/local/voice",
  );
  assert.notEqual(credential.clientSecret, "gateway-fixture");
  const now = Date.now;
  t.mock.method(Date, "now", () => now() + 61000);
  await rejected(dial(credential.clientSecret), 401);
  t.mock.restoreAll();
  process.env.SAND_HOST_GATEWAY_URL = "http://untrusted.invalid";
  await assert.rejects(mintLocalVoiceCredential(), /loopback/);
});
