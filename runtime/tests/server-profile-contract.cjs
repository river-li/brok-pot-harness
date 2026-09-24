"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { containerApiUrl, runtimeEnv, serverConfig } = require("../server.cjs");

test("server profile creates private persistent data and Box-writable workspace", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-server-profile-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const config = serverConfig({ GBH_SERVER_STATE_DIR: root, GBH_SERVER_PROJECT: "gbh-test-41" });
  const env = runtimeEnv(config, {
    LITELLM_API_KEY: "fixture-shell-provider-key",
    GROKBOT_CONTAINER_API_URL: "http://localhost:9333/v1",
    GROKBOT_MODEL: "fixture-model-from-shell",
  });
  assert.equal(config.projectName, "gbh-test-41");
  assert.equal(fs.statSync(config.stateDir).mode & 0o777, 0o700);
  assert.equal(fs.statSync(config.dataDir).mode & 0o777, 0o700);
  assert.equal(fs.statSync(config.workspaceDir).mode & 0o777, 0o777);
  assert.equal(fs.statSync(path.join(config.stateDir, "gateway-token")).mode & 0o777, 0o600);
  assert.equal(fs.statSync(config.envFile).mode & 0o777, 0o600);
  assert.equal(env.LITELLM_API_KEY, "fixture-shell-provider-key");
  assert.equal(env.GROKBOT_MODEL, "fixture-model-from-shell");
  assert.equal(env.GROKBOT_CONTAINER_API_URL, "http://host.docker.internal:9333/v1");
  assert.equal(env.SAND_GATEWAY_REQUIRE_AUTH, "1");
  assert.equal(env.GROKBOT_GATEWAY_HOST_BIND, "127.0.0.1");
  assert.equal(env.GROKBOT_VNC_HOST_BIND, "127.0.0.1");
  assert.equal(env.GROKBOT_VNC_CONTROL_HOST_BIND, "127.0.0.1");
});

test("server endpoint validation rewrites loopback and rejects invalid API URLs", () => {
  assert.equal(containerApiUrl({ GROKBOT_CONTAINER_API_URL: "http://127.0.0.1:9000/v1" }), "http://host.docker.internal:9000/v1");
  assert.equal(containerApiUrl({ GROKBOT_CONTAINER_API_URL: "http://[::1]:9000/v1" }), "http://host.docker.internal:9000/v1");
  assert.equal(containerApiUrl({ GROKBOT_CONTAINER_API_URL: "https://api.example.net/v1" }), "https://api.example.net/v1");
  assert.throws(() => containerApiUrl({ GROKBOT_CONTAINER_API_URL: "ftp://api.example.net/v1" }));
  assert.throws(() => containerApiUrl({ GROKBOT_CONTAINER_API_URL: "https://api.example.com/v1" }, { required: true }));
});

test("server profile rejects invalid project and host port values", () => {
  assert.throws(() => serverConfig({ GBH_SERVER_PROJECT: "UPPER CASE" }));
  assert.throws(() => serverConfig({ GBH_SERVER_GATEWAY_PORT: "80" }));
  assert.throws(() => serverConfig({ GBH_SERVER_VNC_PORT: "70000" }));
});

test("nonempty shell settings override server.env while blank shell values keep configured values", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-server-precedence-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const config = serverConfig({ GBH_SERVER_STATE_DIR: root, GBH_SERVER_PROJECT: "gbh-test-precedence" });
  fs.mkdirSync(path.dirname(config.envFile), { recursive: true });
  fs.writeFileSync(config.envFile, [
    "GROKBOT_CONTAINER_API_URL=https://configured.example.net/v1",
    "GROKBOT_MODEL=configured-model",
    "LITELLM_API_KEY=configured-key",
    "",
  ].join("\n"));
  const env = runtimeEnv(config, {
    GROKBOT_CONTAINER_API_URL: "",
    GROKBOT_MODEL: "shell-model",
    LITELLM_API_KEY: "shell-key",
  });
  assert.equal(env.GROKBOT_CONTAINER_API_URL, "https://configured.example.net/v1");
  assert.equal(env.GROKBOT_MODEL, "shell-model");
  assert.equal(env.LITELLM_API_KEY, "shell-key");
});
