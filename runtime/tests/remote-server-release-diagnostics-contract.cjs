"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { assignmentInspectorScript, verifyBoxVncRoute } = require("./remote-server-live.cjs");

test("display route validation accepts the configured primary and fork tunnels", () => {
  assert.deepEqual(verifyBoxVncRoute("http://127.0.0.1:33251/vnc.html", {
    primaryPort: 33251,
    forkPort: 38383,
    expectedWindowIndex: 1,
  }), { kind: "primary", port: 33251, pathname: "/vnc.html", windowIndex: 1 });

  assert.deepEqual(verifyBoxVncRoute("http://127.0.0.1:38383/vnc.html?path=websockify%3Ftoken%3D2", {
    primaryPort: 33251,
    forkPort: 38383,
    expectedWindowIndex: 2,
  }), { kind: "fork", port: 38383, pathname: "/vnc.html", windowIndex: 2 });
  assert.deepEqual(verifyBoxVncRoute("http://127.0.0.1:38383/vnc.html?path=websockify%3Ftoken%3D4", {
    primaryPort: 33251,
    forkPort: 38383,
    expectedWindowIndex: 4,
  }), { kind: "fork", port: 38383, pathname: "/vnc.html", windowIndex: 4 });
});

test("display route validation rejects untrusted hosts, ports and fork paths", () => {
  const ports = { primaryPort: 33251, forkPort: 38383, expectedWindowIndex: 2 };
  assert.throws(() => verifyBoxVncRoute("http://example.com:33251/vnc.html", ports), /loopback tunnel/);
  assert.throws(() => verifyBoxVncRoute("http://127.0.0.1:31337/vnc.html", ports), /control tunnel port/);
  assert.throws(() => verifyBoxVncRoute("http://127.0.0.1:38383/vnc.html?path=websockify%3Ftoken%3D1", ports), /match that Bot's persisted/);
  assert.throws(() => verifyBoxVncRoute("http://127.0.0.1:38383/vnc.html?path=other", ports), /match that Bot's persisted/);
});

test("bounded window-assignment inspector outputs selected indexes without ownership tokens or parse snippets", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-window-assignment-contract-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "assignments.json");
  const token = "SENTINEL_WINDOW_OWNER_TOKEN_DO_NOT_PRINT";
  fs.writeFileSync(file, JSON.stringify({
    assignments: { "agent-a": 2, "agent-b": 3, unrelated: 4 },
    tokens: { "agent-a": token, "agent-b": token, unrelated: token },
  }));

  const selected = spawnSync(process.execPath, ["-e", assignmentInspectorScript(), "--", file, "agent-a", "agent-b"], {
    encoding: "utf8",
    timeout: 3000,
  });
  assert.equal(selected.status, 0, selected.stderr);
  assert.deepEqual(JSON.parse(selected.stdout), { "agent-a": 2, "agent-b": 3 });
  assert.ok(!selected.stdout.includes(token) && !selected.stderr.includes(token));

  fs.writeFileSync(file, `{"assignments":{"agent-a":2},"tokens":"${token}`);
  const malformed = spawnSync(process.execPath, ["-e", assignmentInspectorScript(), "--", file, "agent-a"], {
    encoding: "utf8",
    timeout: 3000,
  });
  assert.equal(malformed.status, 1);
  assert.ok(!malformed.stdout.includes(token) && !malformed.stderr.includes(token));
  assert.equal(malformed.stderr.trim(), "Could not read persisted Box window assignments.");
});

test("failed live acceptance writes a bounded diagnostic report without starting Docker", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-diagnostic-contract-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const script = path.join(__dirname, "remote-server-live.cjs");
  const result = spawnSync(process.execPath, [script, "--test-failure-report"], {
    encoding: "utf8",
    timeout: 10000,
    env: { ...process.env, GBH_REMOTE_TEST_OUTPUT: root },
  });
  assert.equal(result.status, 1, result.stderr);
  const run = fs.readdirSync(root).find((name) => name.startsWith("remote-server-"));
  assert.ok(run, "failure-report run directory should remain available for diagnosis");
  const reportPath = path.join(root, run, "diagnostics", "report.json");
  const reportText = fs.readFileSync(reportPath, "utf8");
  assert.ok(Buffer.byteLength(reportText) < 16000, "failure report is bounded for CI artifact upload");
  const report = JSON.parse(reportText);
  assert.equal(report.result, "failed");
  assert.equal(report.stage, "intentional failure-report contract");
  assert.equal(report.failure.message, "Intentional diagnostic failure fixture.");
  assert.equal(report.cleanupFailure, null);
  assert.deepEqual(report.cleanupCommands, []);
  assert.equal(report.fixture, "deterministic Responses API fixture; no external inference");
});
