"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  EncryptedConnectionStore,
  normalizeGatewayUrl,
  probeGateway,
  resumeSavedConnection,
  serverIdentity,
  storageIsSecure,
} = require("../remote-client-connection.cjs");

const token = "fixture-gateway-token-6f1992c870cb4ea89f";
const requiredCapabilities = ["orderedReplicasV1", "sendAcceptanceV1"];

function encryptedStorage(backend = "os_crypt") {
  const key = Buffer.alloc(32, 0x5a);
  return {
    isAsyncEncryptionAvailable: async () => backend !== "basic_text",
    getSelectedStorageBackend: () => backend,
    async encryptStringAsync(value) {
      const nonce = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);
      const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
      return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]);
    },
    async decryptStringAsync(contents) {
      const nonce = contents.subarray(0, 12);
      const tag = contents.subarray(12, 28);
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
      decipher.setAuthTag(tag);
      return { result: Buffer.concat([decipher.update(contents.subarray(28)), decipher.final()]).toString("utf8"), shouldReEncrypt: false };
    },
  };
}

test("server URL validation requires true loopback behind the authenticated tunnel", () => {
  assert.equal(normalizeGatewayUrl("http://127.0.0.1:1540"), "http://127.0.0.1:1540");
  assert.equal(normalizeGatewayUrl("http://[::1]:1540"), "http://[::1]:1540");
  assert.equal(normalizeGatewayUrl("http://127.19.0.8:1540"), "http://127.19.0.8:1540");
  for (const invalid of [
    "https://bots.example.com",
    "http://bots.example.com:1540",
    "http://127.example.com:1540",
    "http://127.0.0.1.example.com:1540",
    "https://user:secret@bots.example.com",
    "https://bots.example.com/?token=hidden",
    "https://bots.example.com/gateway",
    "file:///tmp/gateway",
  ]) assert.throws(() => normalizeGatewayUrl(invalid));
});

test("authenticated bootstrap requires current Host capabilities and rejects redirects", async () => {
  let request;
  const goodFetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ capabilities: requiredCapabilities }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  const compatible = await probeGateway("http://127.0.0.1:1540", token, goodFetch);
  assert.equal(compatible.gatewayUrl, "http://127.0.0.1:1540");
  assert.equal(request.url, "http://127.0.0.1:1540/api/getHostStatus");
  assert.equal(request.options.headers.authorization, "Bearer " + token);
  assert.equal(request.options.redirect, "error");
  assert.deepEqual(JSON.parse(request.options.body), { includeManagedCapabilities: false });

  await assert.rejects(
    probeGateway("http://127.0.0.1:1540", token, async () => new Response("", { status: 401 })),
    (error) => error.code === "UNAUTHORIZED" && !error.message.includes(token),
  );
  await assert.rejects(
    probeGateway("http://127.0.0.1:1540", token, async () => new Response(JSON.stringify({ capabilities: [] }), { status: 200 })),
    (error) => error.code === "INCOMPATIBLE",
  );
  await assert.rejects(
    probeGateway("http://127.0.0.1:1540", token, async () => { throw new Error("fetch failure"); }),
    (error) => error.code === "UNREACHABLE" && !error.message.includes("fetch failure"),
  );
});

test("saved resume handles auth and secure-store failures without losing the server URL", async () => {
  let loads = 0;
  let launches = 0;
  const saved = { gatewayUrl: "http://127.0.0.1:1540", token };
  const unauthorized = await resumeSavedConnection(
    async () => { loads++; return saved; },
    async () => { throw Object.assign(new Error("The Gateway token was rejected."), { code: "UNAUTHORIZED" }); },
    async () => { launches++; },
  );
  assert.equal(unauthorized.launching, false);
  assert.equal(unauthorized.code, "UNAUTHORIZED");
  assert.equal(unauthorized.gatewayUrl, saved.gatewayUrl);
  assert.ok(!JSON.stringify(unauthorized).includes(token));
  assert.equal(loads, 1);
  assert.equal(launches, 0);

  const storageFailure = await resumeSavedConnection(
    async () => { throw Object.assign(new Error("The saved connection could not be decrypted."), { code: "DECRYPT_FAILED" }); },
    async () => { throw new Error("must not be called"); },
    async () => { throw new Error("must not be called"); },
  );
  assert.equal(storageFailure.launching, false);
  assert.equal(storageFailure.code, "DECRYPT_FAILED");
  assert.equal(storageFailure.gatewayUrl, "");
});

test("saved connections use OS encryption and isolated server profiles", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-remote-client-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const storage = encryptedStorage();
  const store = new EncryptedConnectionStore(root, storage, { platform: "darwin" });
  const firstUrl = "http://127.0.0.1:1540";
  const secondUrl = "http://127.0.0.1:1541";
  const displayPorts = { vncPort: 6280, vncControlPort: 6281 };
  const firstId = await store.save(firstUrl, token, displayPorts);
  const secondId = serverIdentity(secondUrl);
  assert.notEqual(firstId, secondId);
  assert.deepEqual(await store.load(firstId), { version: 1, gatewayUrl: firstUrl, token, ...displayPorts });
  assert.deepEqual(await store.loadActive(), { identity: firstId, gatewayUrl: firstUrl, token, ...displayPorts });
  assert.notEqual(store.profilePath(firstId), store.profilePath(secondId));
  assert.equal(fs.statSync(store.connectionPath(firstId)).mode & 0o777, 0o600);
  assert.equal(fs.statSync(store.activePath()).mode & 0o777, 0o600);
  assert.ok(!fs.readFileSync(store.connectionPath(firstId), "utf8").includes(token));
  assert.ok(!fs.readFileSync(store.connectionPath(firstId), "utf8").includes(firstUrl));
  assert.equal(fs.readFileSync(store.activePath(), "utf8").trim(), firstId);
  store.activate(secondId);
  assert.equal(await store.loadActive(), null);
  store.clearActive();
  assert.equal(fs.existsSync(store.activePath()), false);
});

test("basic_text and unavailable storage cannot persist a token", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-remote-client-insecure-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const basicText = encryptedStorage("basic_text");
  const store = new EncryptedConnectionStore(root, basicText, { platform: "darwin" });
  assert.equal(await storageIsSecure(basicText), false);
  assert.equal(await storageIsSecure(encryptedStorage(), { platform: "linux" }), false);
  await assert.rejects(store.save("http://127.0.0.1:1540", token), (error) => error.code === "SECURE_STORAGE_UNAVAILABLE");
  assert.equal(fs.existsSync(path.join(root, "servers")), false);
  assert.equal(await storageIsSecure({ isAsyncEncryptionAvailable: async () => false }), false);
});

test("a stalled optional secure-store probe fails within its bound", async () => {
  const started = Date.now();
  assert.equal(await storageIsSecure({ isAsyncEncryptionAvailable: () => new Promise(() => {}) }, { platform: "darwin", timeoutMs: 20 }), false);
  assert.ok(Date.now() - started < 1000);
});

test("display tunnel ports must be valid and distinct", () => {
  const { normalizeDisplayPorts } = require("../remote-client-connection.cjs");
  assert.deepEqual(normalizeDisplayPorts(), { vncPort: 6180, vncControlPort: 6181 });
  assert.throws(() => normalizeDisplayPorts({ vncPort: 6180, vncControlPort: 6180 }));
  assert.throws(() => normalizeDisplayPorts({ vncPort: 80, vncControlPort: 6181 }));
});
