"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { configured, deployPayload, serverEnvironment, writeSettings } = require("../unified-local.cjs");

test("portable runtime deploys from its own verified inventory and rejects edited inputs", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brokpot-unified-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const payload = path.join(root, "bundled");
  const target = path.join(payload, "runtime", "server.cjs");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, "server");
  const manifest = {
    schemaVersion: 1,
    digest: "",
    files: [{ path: "runtime/server.cjs", sha256: crypto.createHash("sha256").update("server").digest("hex"), mode: 420 }],
  };
  manifest.digest = crypto.createHash("sha256").update(
    manifest.files.map((entry) => `${entry.path}:${entry.sha256}:${entry.mode}\n`).join(""),
  ).digest("hex");
  fs.writeFileSync(path.join(payload, "manifest.json"), JSON.stringify(manifest));
  const destination = deployPayload(payload, path.join(root, "installed"));
  assert.equal(fs.readFileSync(path.join(destination, "runtime/server.cjs"), "utf8"), "server");
  assert.equal(deployPayload(payload, path.join(root, "installed")), destination);
  fs.writeFileSync(target, "tampered");
  assert.throws(() => deployPayload(payload, path.join(root, "other")), /failed verification/);
});

test("model settings stay in private state and server child drops inherited credentials", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brokpot-settings-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeSettings(root, { url: "https://models.example/v1", model: "sample-model", key: "private-example" });
  assert.equal(configured(root), true);
  assert.equal(fs.statSync(path.join(root, "server.env")).mode & 0o777, 0o600);
  writeSettings(root, { url: "https://models.example/v1", model: "sample-model", key: "" });
  assert.match(fs.readFileSync(path.join(root, "server.env"), "utf8"), /LITELLM_API_KEY=private-example/);
  assert.throws(() => writeSettings(root, { url: "https://models.example/v1", model: "bad\nvalue", key: "" }));
  const env = serverEnvironment(root);
  assert.equal(env.GBH_SERVER_PROJECT, "brokpot-local");
  assert.equal(env.ELECTRON_RUN_AS_NODE, "1");
  assert.equal(env.LITELLM_API_KEY, undefined);
  for (const name of ["GBH_SERVER_ENV_FILE", "GBH_SERVER_GATEWAY_PORT", "GBH_SERVER_VNC_PORT", "SAND_HOST_GATEWAY_URL"]) {
    const previous = process.env[name];
    process.env[name] = name.endsWith("PORT") ? "27540" : "/tmp/foreign-server.env";
    try { assert.equal(serverEnvironment(root)[name], undefined); }
    finally { if (previous === undefined) delete process.env[name]; else process.env[name] = previous; }
  }
});
