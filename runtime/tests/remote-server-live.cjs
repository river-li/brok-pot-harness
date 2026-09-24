"use strict";

/* Isolated server/client boundary test: private Compose project, real Box, and
 * a deterministic Responses fixture. It does not test external inference. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { spawn } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");
const { probeGateway } = require("../remote-client-connection.cjs");

const repository = path.resolve(__dirname, "../..");
const node = process.execPath;
const providerKey = "gbh-private-integration-fixture-key";
const pinnedImage = "public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8";

function privateFile(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, value, { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

function runProcess(command, args, env, logFile) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: repository, env, stdio: ["ignore", "pipe", "pipe"] });
    const chunks = [];
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => chunks.push(chunk));
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      const output = Buffer.concat(chunks);
      privateFile(logFile, output);
      resolve({ code: code ?? 1, signal, output: output.toString("utf8") });
    });
  });
}

async function findFreePort() {
  const server = http.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

function sseText(response) {
  const id = "fixture-response-" + randomUUID();
  const output = [{
    type: "function_call",
    id: id + "-item",
    call_id: id + "-call",
    name: response.name,
    arguments: JSON.stringify(response.arguments),
    status: "completed",
  }];
  return "data: " + JSON.stringify({
    type: "response.completed",
    response: { id, model: "gbh-deterministic-fixture", status: "completed", output },
  }) + "\n\n";
}

function sendToolResponse(res, name, args) {
  if (res.destroyed) return;
  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
  res.end(sseText({ name, arguments: args }));
}

function sendTextResponse(res, text) {
  if (res.destroyed) return;
  const id = "fixture-memory-" + randomUUID();
  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
  res.end("data: " + JSON.stringify({
    type: "response.completed",
    response: {
      id,
      model: "gbh-deterministic-fixture",
      status: "completed",
      output: [{ type: "message", id: id + "-message", role: "assistant", content: [{ type: "output_text", text }] }],
    },
  }) + "\n\n");
}

function createResponsesFixture() {
  const tasks = new Map();
const observations = { modelRequests: 0, classifierRequests: 0, authorizedRequests: 0, fixtureErrors: 0, requestInputs: [], bootstrapToolSets: [], localExecToolResults: [] };
  let fixtureFailure = null;

  function addTask(marker, { blockAtCall = 0, acknowledgeFirst = false, localExec = null, uiLocalApproval = null } = {}) {
    let signalBlocked;
    const blocked = new Promise((resolve) => { signalBlocked = resolve; });
    const task = {
      marker,
      filename: marker + ".txt",
      blockAtCall,
      acknowledgeFirst,
      acknowledged: false,
      localExec,
      uiLocalApproval,
      modelCalls: 0,
      phase: 0,
      signalBlocked,
      blocked,
      blockReleased: null,
    };
    tasks.set(marker, task);
    return task;
  }

  function findTask(body) {
    const input = JSON.stringify(body.input || []);
    let selected = null;
    let lastOffset = -1;
    for (const [marker, task] of tasks) {
      const offset = input.lastIndexOf(marker);
      if (offset > lastOffset) {
        selected = offset < 0 ? selected : task;
        lastOffset = offset;
      }
    }
    return selected;
  }

  async function handle(req, res) {
    try {
      if (req.method !== "POST" || req.url !== "/v1/responses") {
        res.writeHead(404).end();
        return;
      }
      observations.authorizedRequests++;
      if (req.headers.authorization !== "Bearer " + providerKey) {
        res.writeHead(401, { "content-type": "application/json" }).end("{\"error\":\"fixture credential required\"}");
        return;
      }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks));
      const tools = Array.isArray(body.tools) ? body.tools : [];
      const names = tools.map((tool) => tool.name).filter((name) => typeof name === "string");
      if (body.tool_choice?.name === "classify_auto_review_action" || (names.length === 1 && names[0] === "classify_auto_review_action")) {
        observations.classifierRequests++;
        const task = findTask(body);
        if (!task || !JSON.stringify(body.input || []).includes(task.marker)) {
          observations.bootstrapToolSets.push(names);
          sendToolResponse(res, "classify_auto_review_action", {
            decision: "DENY",
            reason: "The isolated fixture approves only registered test tasks.",
            blocked_effect: "No registered fixture marker was present.",
            outbound_authorization: "not_outbound",
          });
          return;
        }
        sendToolResponse(res, "classify_auto_review_action", {
          decision: "ALLOW",
          reason: "The isolated test asked the server Box to write this private fixture file.",
          blocked_effect: "none",
          outbound_authorization: "not_outbound",
        });
        return;
      }
      if (names.length === 0) {
        sendTextResponse(res, "NONE");
        return;
      }
      const task = findTask(body);
      if (!task) {
        observations.bootstrapToolSets.push(names);
        const send = names.find((name) => /^Send(ToUser|Message)$/i.test(name));
        if (send) {
          sendToolResponse(res, send, {
            type: "text",
            content: "The isolated server fixture is ready. Send a test task to create a Box file.",
            end_turn: true,
          });
        } else {
          sendTextResponse(res, "The isolated server fixture is ready for an explicit test task.");
        }
        return;
      }
      observations.modelRequests++;
      const serializedInput = JSON.stringify(body.input || []);
      observations.requestInputs.push({
        toolNames: names,
        markers: [...tasks.keys()].filter((marker) => serializedInput.includes(marker)),
      });
      task.modelCalls++;
      if (task.blockAtCall === task.modelCalls) {
        task.signalBlocked();
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 120_000);
          timeout.unref();
          task.blockReleased = () => { clearTimeout(timeout); resolve(); };
          res.once("close", () => { clearTimeout(timeout); resolve(); });
        });
        if (res.destroyed) return;
      }
      if (task.acknowledgeFirst && !task.acknowledged) {
        task.acknowledged = true;
        sendToolResponse(res, names.find((name) => /^Send(ToUser|Message)$/i.test(name)) || "SendToUser", {
          type: "text",
          content: "I have accepted the Box task " + task.marker + " and am starting it. If this Bot restarts before the file arrives, ask me to continue this same task.",
          end_turn: false,
        });
        return;
      }
      if (task.localExec) {
        if (task.phase === 0) {
          const read = names.find((name) => name === "Read");
          if (!read) throw new Error("Remote Agent did not offer the local Read tool.");
          task.phase = 1;
          sendToolResponse(res, read, {
            path: task.localExec.path,
            machineId: task.localExec.machineId,
          });
          return;
        }
        if (task.phase === 1) {
          const localToolResults = (body.input || []).filter((item) => item?.type === "function_call_output")
            .slice(-3)
            .map((item) => {
              const output = typeof item.output === "string" ? item.output : JSON.stringify(item.output ?? null);
              return output.slice(0, 1200);
            });
          observations.localExecToolResults.push({ marker: task.marker, results: localToolResults });
          const returnedInput = JSON.stringify(localToolResults);
          if (!returnedInput.includes(task.localExec.expectedRefusal)) {
            throw new Error("The local Read result did not contain the expected safe refusal. Tool output samples: " + returnedInput.slice(-3600));
          }
          const send = names.find((name) => /^Send(ToUser|Message)$/i.test(name));
          if (!send) throw new Error("Remote Agent did not offer SendToUser after the local Read refusal.");
          task.phase = 2;
          sendToolResponse(res, send, {
            type: "text",
            content: task.marker + " " + task.localExec.expectedRefusal,
            end_turn: true,
          });
          return;
        }
      }
      if (task.uiLocalApproval) {
        if (task.phase === 0) {
          const discover = names.find((name) => name === "GetDynamicTools");
          if (!discover) throw new Error("Remote Client fixture did not offer dynamic tool discovery.");
          task.phase = 1;
          sendToolResponse(res, discover, { namespace: "cursor", toolName: "ListMachines" });
          return;
        }
        if (task.phase === 1) {
          const list = names.find((name) => name === "CallDynamicTool");
          if (!list) throw new Error("Remote Client fixture did not offer dynamic tool calls.");
          task.phase = 2;
          sendToolResponse(res, list, { namespace: "cursor", toolName: "ListMachines", arguments: {} });
          return;
        }
        if (task.phase === 2) {
          const findConnectedMachine = (value) => {
            if (typeof value === "string") {
              try { return findConnectedMachine(JSON.parse(value)); } catch { return null; }
            }
            if (Array.isArray(value)) {
              for (const item of value) { const found = findConnectedMachine(item); if (found) return found; }
              return null;
            }
            if (!value || typeof value !== "object") return null;
            if (Array.isArray(value.machines)) {
              const found = value.machines.find((machine) => machine?.connected === true && typeof machine.machineId === "string");
              if (found) return found;
            }
            for (const child of Object.values(value)) { const found = findConnectedMachine(child); if (found) return found; }
            return null;
          };
          const machine = findConnectedMachine(body.input || []);
          if (!machine) throw new Error("Remote Client did not report a connected local-exec machine.");
          const read = names.find((name) => name === "Read");
          if (!read) throw new Error("Remote Client fixture did not offer the local Read tool.");
          task.uiLocalApproval.machineId = machine.machineId;
          task.phase = 3;
          sendToolResponse(res, read, {
            path: task.uiLocalApproval.path,
            machineId: machine.machineId,
          });
          return;
        }
        if (task.phase === 3) {
          const returnedInput = JSON.stringify(body.input || []);
          if (!/denied|declined|rejected|permission/i.test(returnedInput)) {
            throw new Error("The Remote Client local Read did not return a visible permission denial.");
          }
          const send = names.find((name) => /^Send(ToUser|Message)$/i.test(name));
          if (!send) throw new Error("Remote Client fixture did not offer SendToUser after approval denial.");
          task.phase = 4;
          sendToolResponse(res, send, {
            type: "text",
            content: task.marker + " The local read was denied and the fixture path remains untouched.",
            end_turn: true,
          });
          return;
        }
      }
      if (task.phase === 0) {
        const shell = names.find((name) => /^(Shell|Bash|RunShell|Exec)$/i.test(name));
        if (!shell) throw new Error("Remote Agent did not offer its sandbox Shell tool.");
        task.phase = 1;
        sendToolResponse(res, shell, {
          command: "printf '%s' '" + task.marker + "' > '/workspace/" + task.filename + "' && cat '/workspace/" + task.filename + "'",
          block_until_ms: 10000,
          description: "Write and verify an isolated Box file for the remote client test.",
        });
        return;
      }
      if (task.phase === 1) {
        const returnedInput = JSON.stringify(body.input || []);
        if (!returnedInput.includes(task.marker)) throw new Error("Agent did not preserve the fixture marker between Box tool calls.");
        const send = names.find((name) => /^Send(ToUser|Message)$/i.test(name));
        if (!send) throw new Error("Remote Agent did not offer SendToUser.");
        task.phase = 2;
        sendToolResponse(res, send, {
          type: "attachment",
          url: "file:///workspace/" + task.filename,
          alt: "Box generated fixture file",
          end_turn: true,
        });
        return;
      }
      sendTextResponse(res, "NONE");
    } catch (error) {
      if (error && typeof error === "object") error.code = "REMOTE_FIXTURE_FAILURE";
      fixtureFailure = error;
      observations.fixtureErrors++;
      if (!res.destroyed) res.writeHead(500, { "content-type": "application/json" }).end("{\"error\":\"deterministic fixture failed\"}");
    }
  }

  const server = http.createServer((req, res) => { void handle(req, res); });
  return { server, tasks, observations, addTask, get failure() { return fixtureFailure; } };
}

async function gatewayCall(base, token, method, args = {}, { expectedStatus = 200 } = {}) {
  const response = await fetch(base + "/api/" + method, {
    method: "POST",
    headers: { authorization: "Bearer " + token, "content-type": "application/json" },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, expectedStatus, method + " returned HTTP " + response.status);
  if (expectedStatus !== 200) return null;
  return response.json();
}

async function waitFor(predicate, label, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await predicate();
      if (value) return value;
    } catch (error) {
      if (error?.code === "REMOTE_FIXTURE_FAILURE") throw error;
      lastError = error;
    }
    await delay(500);
  }
  throw new Error("Timed out waiting for " + label + (lastError ? ": " + lastError.message : ""));
}

async function openEventStream(base, token) {
  const controller = new AbortController();
  const response = await fetch(base + "/events", {
    headers: { authorization: "Bearer " + token, "accept-encoding": "identity" },
    signal: controller.signal,
  });
  assert.equal(response.status, 200, "authenticated Gateway event stream must open");
  const observed = [];
  const completed = (async () => {
    const reader = response.body.getReader();
    let pending = "";
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        pending += Buffer.from(value).toString("utf8");
        const lines = pending.split("\n");
        pending = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try { observed.push(JSON.parse(line.slice(6))); } catch {}
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") throw error;
    }
  })();
  return {
    observed,
    async close() {
      controller.abort();
      await completed.catch(() => {});
    },
  };
}

async function openLocalExecProvider(base, token) {
  const controller = new AbortController();
  const response = await fetch(base + "/local-exec/requests", {
    headers: { authorization: "Bearer " + token, "accept-encoding": "identity" },
    signal: controller.signal,
  });
  assert.equal(response.status, 200, "authenticated local-exec device stream must open");
  const observed = [];
  let resolveWelcome;
  let rejectWelcome;
  const welcomePromise = new Promise((resolve, reject) => { resolveWelcome = resolve; rejectWelcome = reject; });
  const reader = response.body.getReader();
  const completed = (async () => {
    let pending = "";
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        pending += Buffer.from(value).toString("utf8");
        const lines = pending.split("\n");
        pending = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const frame = JSON.parse(line.slice(6));
          observed.push(frame);
          if (frame.kind === "welcome") resolveWelcome(frame);
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") rejectWelcome(error);
    }
  })();
  const welcome = await Promise.race([
    welcomePromise,
    delay(10000).then(() => { throw new Error("Authenticated local-exec stream did not send its welcome frame."); }),
  ]);
  return {
    providerId: welcome.providerId,
    observed,
    async post(frames) {
      const posted = await fetch(base + "/local-exec/responses", {
        method: "POST",
        headers: { authorization: "Bearer " + token, "content-type": "application/json" },
        body: JSON.stringify({ providerId: welcome.providerId, frames }),
      });
      assert.equal(posted.status, 200, "authenticated device hello must be accepted");
    },
    async close() {
      controller.abort();
      await completed.catch(() => {});
    },
  };
}

function userMessages(transcript, marker) {
  return transcript.filter((entry) => entry.kind === "message" && entry.role === "user" && String(entry.content || "").includes(marker));
}

function attachmentEntry(transcript) {
  return transcript.find((entry) => entry.kind === "send-message" && entry.message?.type === "attachment");
}

async function downloadAttachment(base, token, agentId, attachment, expectedText) {
  assert.ok(attachment && typeof attachment.message.url === "string", "Agent transcript must contain a Box file attachment");
  const filePath = new URL(attachment.message.url).pathname;
  const size = await gatewayCall(base, token, "readAttachmentChunk", { agentId, path: filePath, offset: 0, length: 0 });
  assert.equal(size.totalSize, Buffer.byteLength(expectedText));
  const chunk = await gatewayCall(base, token, "readAttachmentChunk", { agentId, path: filePath, offset: 0, length: size.totalSize });
  assert.equal(Buffer.from(chunk.bytesBase64, "base64").toString("utf8"), expectedText);
  return filePath;
}

async function main() {
  const id = randomUUID().replace(/-/g, "").slice(0, 10);
  const runRoot = path.join(repository, ".runtime/tests", "remote-server-" + id);
  const stateDir = path.join(runRoot, "server-state");
  const diagnosticsDir = path.join(runRoot, "diagnostics");
  fs.mkdirSync(diagnosticsDir, { recursive: true, mode: 0o700 });
  const envFile = path.join(stateDir, "server.env");
  const projectName = "gbh-remote-test-" + id;
  const gatewayPort = await findFreePort();
  const vncPort = await findFreePort();
  const vncControlPort = await findFreePort();
  const fixturePort = await findFreePort();
  const gatewayUrl = "http://127.0.0.1:" + gatewayPort;
  const cliEnv = {
    ...process.env,
    GBH_SERVER_STATE_DIR: stateDir,
    GBH_SERVER_ENV_FILE: envFile,
    GBH_SERVER_PROJECT: projectName,
    GBH_SERVER_GATEWAY_PORT: String(gatewayPort),
    GBH_SERVER_VNC_PORT: String(vncPort),
    GBH_SERVER_VNC_CONTROL_PORT: String(vncControlPort),
    GROKBOT_CONTAINER_API_URL: "http://host.docker.internal:" + fixturePort + "/v1",
    LITELLM_API_KEY: providerKey,
  };
  const fixture = createResponsesFixture();
  let serverStarted = false;
  let currentToken = "";
  let mainFailure = null;
  let eventStream = null;
  let commandNumber = 0;
  const observedDesktopReview = [];
  const commandLog = (name) => path.join(diagnosticsDir, `${String(++commandNumber).padStart(2, "0")}-${name}.log`);

  const invoke = async (name) => {
    const result = await runProcess(node, [path.join(repository, "runtime/server.cjs"), name], cliEnv, commandLog(name));
    if (result.code !== 0) throw new Error("Server command " + name + " failed with exit " + result.code + "; see private diagnostics at " + diagnosticsDir);
    return result.output;
  };
  const readToken = () => fs.readFileSync(path.join(stateDir, "gateway-token"), "utf8").trim();
  const waitReady = async () => waitFor(async () => {
    const response = await fetch(gatewayUrl + "/health", { signal: AbortSignal.timeout(1500) });
    return response.ok;
  }, "server health");

  try {
    await new Promise((resolve, reject) => {
      fixture.server.once("error", reject);
      fixture.server.listen(fixturePort, "0.0.0.0", resolve);
    });
    const install = await runProcess(node, [path.join(repository, "runtime/server.cjs"), "install"], cliEnv, commandLog("install"));
    assert.equal(install.code, 0, "private server install must succeed");
    const uiReviewMode = process.env.GBH_REMOTE_TEST_UI_REVIEW === "1";
    if (uiReviewMode) privateFile(path.join(stateDir, "gateway-token"), "gbh-ui-fixture-not-a-real-secret-token\n");
    privateFile(envFile, [
      "GROKBOT_CONTAINER_API_URL=http://host.docker.internal:" + fixturePort + "/v1",
      "GROKBOT_MODEL=gbh-deterministic-fixture",
      "GROKBOT_CONTEXT_TOKENS=128000",
      "GROKBOT_REASONING_EFFORT=low",
      "GROKBOT_INFERENCE_TIMEOUT_MS=120000",
      "LITELLM_API_KEY=",
      "",
    ].join("\n"));

    await invoke("start");
    serverStarted = true;
    await waitReady();
    currentToken = readToken();

    const publicHealth = await fetch(gatewayUrl + "/health");
    assert.equal(publicHealth.status, 200, "health probe is intentionally public");
    await gatewayCall(gatewayUrl, "", "getHostStatus", { includeManagedCapabilities: false }, { expectedStatus: 401 });
    await gatewayCall(gatewayUrl, "wrong-token-fixture-value", "getHostStatus", { includeManagedCapabilities: false }, { expectedStatus: 401 });
    const compatible = await probeGateway(gatewayUrl, currentToken);
    assert.ok(compatible.capabilities.includes("sendAcceptanceV1"));
    const missingEvents = await fetch(gatewayUrl + "/events");
    assert.equal(missingEvents.status, 401, "event stream requires Gateway auth");
    const authorizedEvents = await openEventStream(gatewayUrl, currentToken);
    eventStream = authorizedEvents;

    const agentA = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Remote fixture Bot A " + id,
      description: "Isolated remote Box task fixture",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    const agentB = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Remote fixture Bot B " + id,
      description: "Isolated second Bot for ownership checks",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    const markerA = "remote-box-a-" + id;
    const markerB = "remote-box-b-" + id;
    fixture.addTask(markerA);
    fixture.addTask(markerB);
    const nonceA = randomUUID();
    const nonceB = randomUUID();
    const promptA = "In the server Box, create a file containing exactly " + markerA + ". Send that file as an attachment.";
    const promptB = "In the server Box, create a separate file containing exactly " + markerB + ". Send that file as an attachment.";
    await Promise.all([
      gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentA.id, clientNonce: nonceA, prompt: promptA }),
      gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentB.id, clientNonce: nonceB, prompt: promptB }),
    ]);
    // Replaying an identical nonce after acceptance is an idempotent no-op.
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentA.id, clientNonce: nonceA, prompt: promptA });
    await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const [a, b] = await Promise.all([
        gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentA.id }),
        gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentB.id }),
      ]);
      return attachmentEntry(a) && attachmentEntry(b) ? { a, b } : null;
    }, "concurrent Bot file tasks");
    let transcriptA = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentA.id });
    let transcriptB = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentB.id });
    assert.equal(userMessages(transcriptA, markerA).length, 1, "nonce replay must not duplicate Bot A's user prompt");
    assert.equal(userMessages(transcriptB, markerB).length, 1, "Bot B's prompt must remain in its own transcript");
    const attachmentA = attachmentEntry(transcriptA);
    const attachmentB = attachmentEntry(transcriptB);
    const downloadedA = await downloadAttachment(gatewayUrl, currentToken, agentA.id, attachmentA, markerA);
    const downloadedB = await downloadAttachment(gatewayUrl, currentToken, agentB.id, attachmentB, markerB);
    assert.notEqual(downloadedA, downloadedB, "each Bot attachment must stay scoped to its own data");
    const boxStatus = await gatewayCall(gatewayUrl, currentToken, "getForeverBoxStatus", { id: agentA.id });
    assert.equal(boxStatus.vncUrl, `http://127.0.0.1:${vncPort}/vnc.html`,
      "server Box display URLs must resolve through the configured loopback SSH tunnel port");
    const hasTaskEvent = (agentId, marker) => authorizedEvents.observed.some((event) => {
      const encoded = JSON.stringify(event);
      return encoded.includes(agentId) && encoded.includes(marker);
    });
    assert.ok(hasTaskEvent(agentA.id, markerA) && hasTaskEvent(agentB.id, markerB),
      "authenticated SSE must deliver task-specific transcript events before disconnect");
    await eventStream.close();
    eventStream = null;
    const reconnected = await openEventStream(gatewayUrl, currentToken);
    eventStream = reconnected;
    const roster = await gatewayCall(gatewayUrl, currentToken, "listAgents");
    assert.ok(roster.some((agent) => agent.id === agentA.id) && roster.some((agent) => agent.id === agentB.id));
    transcriptA = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentA.id });
    assert.equal((await downloadAttachment(gatewayUrl, currentToken, agentA.id, attachmentEntry(transcriptA), markerA)), downloadedA,
      "reconnected client must recover the server-owned attachment path");
    await reconnected.close();
    eventStream = null;

    const unauthenticatedDeviceStream = await fetch(gatewayUrl + "/local-exec/requests");
    assert.equal(unauthenticatedDeviceStream.status, 401, "local-machine device streams require Gateway authentication");
    const unauthenticatedDeviceResponse = await fetch(gatewayUrl + "/local-exec/responses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: "unknown", frames: [] }),
    });
    assert.equal(unauthenticatedDeviceResponse.status, 401, "local-machine device responses require Gateway authentication");

    await gatewayCall(gatewayUrl, currentToken, "setHostSettings", {
      localToolPermission: "never",
      localToolPermissionMachineId: "fixture-computer",
    });
    const deviceProvider = await openLocalExecProvider(gatewayUrl, currentToken);
    await deviceProvider.post([{
      kind: "hello",
      localRoot: runRoot,
      terminalsFolder: path.join(runRoot, "device-terminals"),
      computerId: "fixture-computer",
      label: "Disposable local-exec fixture",
    }]);
    const deniedLocalPath = path.join(runRoot, "never-read-local-file-" + id);
    assert.equal(fs.existsSync(deniedLocalPath), false);
    const deniedLocalMarker = "remote-local-exec-denied-" + id;
    const deniedLocalTask = fixture.addTask(deniedLocalMarker, {
      localExec: {
        path: deniedLocalPath,
        machineId: "fixture-computer",
        expectedRefusal: "Local tools are turned off",
      },
    });
    const deniedLocalAgent = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Remote local-exec permission fixture " + id,
      description: "Verifies the Host retains its Never permission before device dispatch",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: deniedLocalAgent.id,
      clientNonce: randomUUID(),
      prompt: "Read the local computer file " + deniedLocalPath + " using machineId fixture-computer. Do not access any other file. Marker " + deniedLocalMarker + ".",
    });
    const deniedLocalTranscript = await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: deniedLocalAgent.id });
      return transcript.some((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes(deniedLocalMarker)) ? transcript : null;
    }, "the server-side Never permission refusal");
    assert.equal(deniedLocalTask.phase, 2, "the deterministic model must receive the Host's permission refusal and finish its response");
    assert.ok(deviceProvider.observed.every((frame) => frame.kind === "welcome"),
      "a denied local Read must not send an action frame to the authenticated device");
    assert.equal(fs.existsSync(deniedLocalPath), false, "the fixture path must remain untouched by the denied local Read");
    assert.ok(deniedLocalTranscript.some((entry) => entry.kind === "send-message" && entry.message?.content?.includes("Local tools are turned off")));
    await deviceProvider.close();

    await gatewayCall(gatewayUrl, currentToken, "setHostSettings", {
      localToolPermission: "ask",
      localToolPermissionMachineId: "fixture-computer",
    });
    const unavailableLocalPath = path.join(runRoot, "disconnected-local-file-" + id);
    assert.equal(fs.existsSync(unavailableLocalPath), false);
    const unavailableLocalMarker = "remote-local-exec-disconnected-" + id;
    const unavailableLocalTask = fixture.addTask(unavailableLocalMarker, {
      localExec: {
        path: unavailableLocalPath,
        machineId: "fixture-computer",
        expectedRefusal: "No registered machines were available when this turn started.",
      },
    });
    const unavailableLocalAgent = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Remote local-exec disconnect fixture " + id,
      description: "Verifies Ask does not run a local tool after the device stream disconnects",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: unavailableLocalAgent.id,
      clientNonce: randomUUID(),
      prompt: "Read the local computer file " + unavailableLocalPath + " using machineId fixture-computer. Do not access any other file. Marker " + unavailableLocalMarker + ".",
    });
    const unavailableLocalTranscript = await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: unavailableLocalAgent.id });
      return transcript.some((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes(unavailableLocalMarker)) ? transcript : null;
    }, "the disconnected local-tool Ask-surface refusal");
    assert.equal(unavailableLocalTask.phase, 2, "the deterministic model must receive the no-device refusal and finish its response");
    assert.ok(unavailableLocalTranscript.some((entry) => entry.kind === "send-message" && entry.message?.content?.includes("No registered machines were available when this turn started.")));
    assert.equal(fs.existsSync(unavailableLocalPath), false, "the disconnected local Read path must remain untouched");

    if (uiReviewMode) {
      const desktopMarker = "remote-ui-box-file-" + id;
      const desktopTask = fixture.addTask(desktopMarker);
      const approvalMarker = "remote-ui-local-exec-deny-" + id;
      const approvalPath = path.join(runRoot, "remote-client-denied-read-" + id + ".missing");
      assert.equal(fs.existsSync(approvalPath), false);
      const approvalTask = fixture.addTask(approvalMarker, { uiLocalApproval: { path: approvalPath } });
      const releasePath = path.join(diagnosticsDir, "ui-review-release");
      const uiReview = {
        gatewayUrl,
        tokenFile: path.join(stateDir, "gateway-token"),
        projectName,
        marker: desktopMarker,
        vncPort,
        vncControlPort,
        prompt: "In the server Box, create a file containing exactly " + desktopMarker + ". Send that file as an attachment.",
        localApprovalMarker: approvalMarker,
        localApprovalPath: approvalPath,
        localApprovalPrompt: "Read only the exact local Mac path " + approvalPath + " using its connected machine. This is a disposable nonexistent test path. Do not create or change any file. Ask for approval and wait. Marker " + approvalMarker + ".",
        localApprovalExpected: "The desktop should show a local computer permission card. Deny it once; the fixture should then report that the read was denied.",
        releasePath,
      };
      privateFile(path.join(diagnosticsDir, "ui-review.json"), JSON.stringify(uiReview, null, 2) + "\n");
      console.log("Waiting for the independent Remote Client UI review; details are in private diagnostics.");
      const deadline = Date.now() + 20 * 60_000;
      while (!fs.existsSync(releasePath) && Date.now() < deadline) {
        if (fixture.failure) throw fixture.failure;
        await delay(500);
      }
      assert.ok(fs.existsSync(releasePath), "independent desktop review must release the private fixture before timeout");
      const releaseText = fs.readFileSync(releasePath, "utf8").trim();
      assert.ok(releaseText.includes(desktopMarker), "desktop reviewer must confirm the downloaded fixture marker");
      assert.ok(releaseText.includes(approvalMarker), "desktop reviewer must confirm the local computer approval denial marker");
      const desktopResult = await waitFor(async () => {
        if (fixture.failure) throw fixture.failure;
        const roster = await gatewayCall(gatewayUrl, currentToken, "listAgents");
        for (const agent of roster) {
          const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agent.id });
          if (userMessages(transcript, desktopMarker).length === 1 && attachmentEntry(transcript)) {
            return { agentId: agent.id, transcript };
          }
        }
        return null;
      }, "desktop-created Box file task");
      assert.equal(desktopTask.phase, 2, "desktop task must execute both the real Box Shell write and attachment delivery");
      await downloadAttachment(gatewayUrl, currentToken, desktopResult.agentId, attachmentEntry(desktopResult.transcript), desktopMarker);
      const approvalResult = await waitFor(async () => {
        if (fixture.failure) throw fixture.failure;
        const roster = await gatewayCall(gatewayUrl, currentToken, "listAgents");
        for (const agent of roster) {
          const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agent.id });
          const result = transcript.find((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes(approvalMarker));
          if (userMessages(transcript, approvalMarker).length === 1 && result) return { agent, transcript, result };
        }
        return null;
      }, "Remote Client local-machine approval denial");
      assert.equal(approvalTask.phase, 4, "the local Read must finish only after the client denies its approval card");
      assert.match(approvalResult.result.message.content, /denied and the fixture path remains untouched/i);
      assert.equal(fs.existsSync(approvalPath), false, "the denied local Read path must remain absent");
      observedDesktopReview.push("independent packaged desktop downloaded a real Box attachment and denied a local-computer Read approval");
    }

    const markerExplicitStop = "remote-explicit-stop-before-ack-" + id;
    const explicitlyStoppedTask = fixture.addTask(markerExplicitStop, { blockAtCall: 1 });
    const agentExplicitStop = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Explicitly stopped accepted task " + id,
      description: "Verifies user Stop retires server recovery and ack-redrive state",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: agentExplicitStop.id,
      clientNonce: randomUUID(),
      prompt: "Start work for " + markerExplicitStop + " and wait for me to stop it.",
    });
    await waitFor(() => explicitlyStoppedTask.modelCalls === 1 ? true : null, "the explicit-stop task to enter its blocked request");
    const stopped = await gatewayCall(gatewayUrl, currentToken, "interruptAgentRun", { id: agentExplicitStop.id });
    assert.equal(stopped.hadActiveRun, true, "the retained Stop action must interrupt an active server task");
    await waitFor(async () => {
      const host = await gatewayCall(gatewayUrl, currentToken, "getHostStatus", { includeManagedCapabilities: false });
      return host.isBusy === false ? host : null;
    }, "explicitly stopped Host turn to settle");
    assert.equal(explicitlyStoppedTask.modelCalls, 1, "explicit Stop must not restart the cancelled provider request");
    const interruptedJournalPath = path.join(stateDir, "data", "host-interrupted-user-turns.json");
    const stoppedJournal = fs.existsSync(interruptedJournalPath)
      ? JSON.parse(fs.readFileSync(interruptedJournalPath, "utf8")).pending
      : [];
    assert.ok(!stoppedJournal.some((entry) => entry.agentId === agentExplicitStop.id),
      "explicit Stop must retire that Bot's accepted-turn recovery record before interruption");
    const ackJournalPath = path.join(stateDir, "data", "ack-obligations.json");
    const stoppedAckJournal = fs.existsSync(ackJournalPath)
      ? JSON.parse(fs.readFileSync(ackJournalPath, "utf8")).pending
      : [];
    assert.ok(!stoppedAckJournal.some((entry) => entry.agentId === agentExplicitStop.id),
      "explicit Stop before visible acknowledgment must also retire the independent ack-redrive obligation");

    const coalescedMarkerBlocker = "remote-coalesced-blocker-" + id;
    const coalescedBlocker = fixture.addTask(coalescedMarkerBlocker, { blockAtCall: 1 });
    const coalescedMarkerA = "remote-coalesced-a-" + id;
    const coalescedMarkerB = "remote-coalesced-b-" + id;
    const coalescedTaskA = fixture.addTask(coalescedMarkerA);
    const coalescedTaskB = fixture.addTask(coalescedMarkerB);
    const agentCoalesced = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Coalesced same-Bot tasks " + id,
      description: "Tests exact accepted-message ownership when adjacent user turns coalesce",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    const coalescedPromptA = "Create a Box file containing exactly " + coalescedMarkerA + ".";
    const coalescedPromptB = "Create a different Box file containing exactly " + coalescedMarkerB + " and send it as an attachment.";
    const coalescedNonceA = randomUUID();
    const coalescedNonceB = randomUUID();
    const blockerPrompt = "Wait for the next message before doing any work. Marker " + coalescedMarkerBlocker + ".";
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: agentCoalesced.id,
      clientNonce: randomUUID(),
      prompt: blockerPrompt,
    });
    await waitFor(() => coalescedBlocker.modelCalls === 1 ? true : null, "the same-Bot predecessor request to block in the fixture");
    // Keep the scheduler occupied while both accepts are durably queued. The
    // first stale turn must then be proven recoverable into the second turn;
    // racing two HTTP requests could instead start A before B was accepted.
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: agentCoalesced.id,
      clientNonce: coalescedNonceA,
      prompt: coalescedPromptA,
    });
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: agentCoalesced.id,
      clientNonce: coalescedNonceB,
      prompt: coalescedPromptB,
    });
    await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentCoalesced.id });
      return attachmentEntry(transcript) ? transcript : null;
    }, "coalesced same-Bot file task");
    const coalescedTranscript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentCoalesced.id });
    assert.equal(userMessages(coalescedTranscript, coalescedMarkerA).length, 1, "the earlier coalesced acceptance must remain in the original Bot transcript");
    assert.equal(userMessages(coalescedTranscript, coalescedMarkerB).length, 1, "the later coalesced acceptance must remain in the original Bot transcript");
    assert.equal(userMessages(coalescedTranscript, coalescedMarkerBlocker).length, 1, "the test-only blocking predecessor must remain identifiable as a separate accepted turn");
    const acceptedCoalescedMessageIds = {
      blocker: userMessages(coalescedTranscript, coalescedMarkerBlocker)[0].id,
      a: userMessages(coalescedTranscript, coalescedMarkerA)[0].id,
      b: userMessages(coalescedTranscript, coalescedMarkerB)[0].id,
    };
    assert.equal(coalescedTaskA.modelCalls, 0, "the earlier queued acceptance should be recovered into the covering same-Bot turn, not run as a second request");
    assert.equal(coalescedTaskB.phase, 2, "the covering request must execute its Box file task and attachment delivery");
    const coveringRequests = fixture.observations.requestInputs.filter((request) =>
      request.markers.includes(coalescedMarkerA) && request.markers.includes(coalescedMarkerB));
    const requestsForAOnly = fixture.observations.requestInputs.filter((request) =>
      request.markers.includes(coalescedMarkerA) && !request.markers.includes(coalescedMarkerB));
    assert.equal(coalescedTaskB.modelCalls, 2, "the covering file task must issue its Shell and attachment model requests");
    assert.equal(coveringRequests.length, 2, "both covering requests must contain the exact accepted A and B messages");
    assert.equal(requestsForAOnly.length, 0, "the earlier accepted task must not run as a separate model request");
    await downloadAttachment(gatewayUrl, currentToken, agentCoalesced.id, attachmentEntry(coalescedTranscript), coalescedMarkerB);
    await waitFor(async () => {
      const host = await gatewayCall(gatewayUrl, currentToken, "getHostStatus", { includeManagedCapabilities: false });
      return host.isBusy === false ? host : null;
    }, "the covering same-Bot turn to settle");
    const recoveryJournalPath = path.join(stateDir, "data", "host-interrupted-user-turns.json");
    const pendingBeforeRestart = fs.existsSync(recoveryJournalPath)
      ? JSON.parse(fs.readFileSync(recoveryJournalPath, "utf8")).pending
      : [];
    const coalescedPending = pendingBeforeRestart.filter((entry) => entry.agentId === agentCoalesced.id);
    const coalescedTargetIds = [acceptedCoalescedMessageIds.a, acceptedCoalescedMessageIds.b];
    assert.ok(!coalescedPending.some((entry) => coalescedTargetIds.includes(entry.userMessageId)),
      "after the covering turn settles, the exact A/B accepted IDs must be cleared from durable recovery state");
    assert.equal(coalescedPending.length, 1, "the only remaining recovery record for this Bot must be the separate test-only blocker");
    assert.equal(coalescedPending[0].userMessageId, acceptedCoalescedMessageIds.blocker,
      "the predecessor blocker must not be mistaken for either coalesced target turn");
    assert.equal(coalescedPending[0].state, "running",
      "the settled covering turn must leave only the still-running predecessor blocker before server shutdown");
    await invoke("stop");
    serverStarted = false;
    const stoppedRecoveryJournal = fs.existsSync(recoveryJournalPath)
      ? JSON.parse(fs.readFileSync(recoveryJournalPath, "utf8")).pending
      : [];
    const blockerAfterStop = stoppedRecoveryJournal.find((entry) =>
      entry.agentId === agentCoalesced.id && entry.userMessageId === acceptedCoalescedMessageIds.blocker);
    assert.equal(blockerAfterStop?.state, "interrupted",
      "graceful server stop must persist the exact still-running blocker as interrupted");
    assert.ok(!stoppedRecoveryJournal.some((entry) =>
      entry.agentId === agentCoalesced.id && coalescedTargetIds.includes(entry.userMessageId)),
    "graceful stop must keep the completed coalesced A/B IDs retired");
    await invoke("start");
    serverStarted = true;
    currentToken = readToken();
    await waitReady();
    const hasInterruptionNotice = (entries, userMessageId) => entries.some((entry) =>
      entry.kind === "send-message" && entry.message?.type === "text" &&
      entry.message.content.includes("interrupted-user-turn:" + userMessageId));
    const publishedBlockerNotice = await waitFor(async () => {
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentCoalesced.id });
      return hasInterruptionNotice(transcript, acceptedCoalescedMessageIds.blocker) ? transcript : null;
    }, "the superseded test blocker interruption notice");
    assert.ok(!hasInterruptionNotice(publishedBlockerNotice, acceptedCoalescedMessageIds.a) &&
      !hasInterruptionNotice(publishedBlockerNotice, acceptedCoalescedMessageIds.b),
      "the completed A/B work must not be reported interrupted when the unrelated blocker is recovered");
    const coalescedActiveSnapshot = await gatewayCall(gatewayUrl, currentToken, "openAgent", { id: agentCoalesced.id });
    assert.ok(Array.isArray(coalescedActiveSnapshot) && coalescedActiveSnapshot.length > 0, "reopened Bot must return its persisted active transcript snapshot");
    assert.ok(hasInterruptionNotice(coalescedActiveSnapshot, acceptedCoalescedMessageIds.blocker),
      "the active Bot snapshot must show the separate interrupted blocker after restart");
    assert.ok(!hasInterruptionNotice(coalescedActiveSnapshot, acceptedCoalescedMessageIds.a) &&
      !hasInterruptionNotice(coalescedActiveSnapshot, acceptedCoalescedMessageIds.b),
      "the active Bot snapshot must not mark either completed coalesced task interrupted");
    assert.equal(coalescedBlocker.modelCalls, 1, "the synthetic blocker must be surfaced for explicit continuation, not silently replayed");
    const coalescedAfterRestart = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentCoalesced.id });
    await downloadAttachment(gatewayUrl, currentToken, agentCoalesced.id, attachmentEntry(coalescedAfterRestart), coalescedMarkerB);
    assert.equal(explicitlyStoppedTask.modelCalls, 1, "restart must not auto-redrive a task the user explicitly stopped");
    const stoppedAfterRestart = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentExplicitStop.id });
    assert.ok(!stoppedAfterRestart.some((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes("interrupted-user-turn:")),
      "restart must not publish a false server-restart notice for an explicitly stopped task");

    // Hold the first model response after Gateway acceptance, then restart. The
    // persisted AckObligations journal redrives work that has no user-visible ack.
    const markerRecovery = "remote-recovery-before-ack-" + id;
    const recoveryTask = fixture.addTask(markerRecovery, { blockAtCall: 1 });
    const agentRecovery = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Recovery before acknowledgment " + id,
      description: "Tests accepted in-flight request recovery",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    const recoveryNonce = randomUUID();
    const recoveryPrompt = "Create a Box file with " + markerRecovery + " and return it as an attachment.";
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentRecovery.id, clientNonce: recoveryNonce, prompt: recoveryPrompt });
    await waitFor(() => recoveryTask.modelCalls > 0, "first accepted model request");
    await recoveryTask.blocked;
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentRecovery.id, clientNonce: recoveryNonce, prompt: recoveryPrompt });
    await invoke("stop");
    serverStarted = false;
    await invoke("start");
    serverStarted = true;
    currentToken = readToken();
    await waitReady();
    await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      if (recoveryTask.modelCalls < 2) return null;
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentRecovery.id });
      return attachmentEntry(transcript) ? transcript : null;
    }, "unacknowledged accepted prompt recovery");
    let recoveredTranscript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentRecovery.id });
    assert.equal(userMessages(recoveredTranscript, markerRecovery).length, 1, "redrive must not duplicate the original user message");
    const recoveredAttachment = attachmentEntry(recoveredTranscript);
    await downloadAttachment(gatewayUrl, currentToken, agentRecovery.id, recoveredAttachment, markerRecovery);

    // An initial visible SendToUser fulfills the ack obligation. If the Host is
    // stopped while later work is in flight, the persisted transcript exposes
    // the pending task; an explicit follow-up resumes it without server replay.
    const markerAcknowledged = "remote-recovery-after-ack-" + id;
    const acknowledgedTask = fixture.addTask(markerAcknowledged, { acknowledgeFirst: true, blockAtCall: 2 });
    const agentAcknowledged = (await gatewayCall(gatewayUrl, currentToken, "createAgent", {
      name: "Recovery after visible acknowledgment " + id,
      description: "Tests user-visible in-progress state across restart",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
      clientNonce: randomUUID(),
    })).agent;
    const acknowledgedNonce = randomUUID();
    const acknowledgedPrompt = "Create a Box file with " + markerAcknowledged + " and return it as an attachment.";
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", { agentId: agentAcknowledged.id, clientNonce: acknowledgedNonce, prompt: acknowledgedPrompt });
    await waitFor(() => acknowledgedTask.modelCalls >= 1, "initial visible progress acknowledgment");
    await waitFor(async () => {
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id });
      return transcript.some((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes(markerAcknowledged));
    }, "visible progress message");
    await waitFor(() => acknowledgedTask.modelCalls >= 2, "post-ack in-flight work");
    await acknowledgedTask.blocked;
    await invoke("stop");
    serverStarted = false;
    await invoke("start");
    serverStarted = true;
    currentToken = readToken();
    await waitReady();
    await delay(7000);
    assert.equal(acknowledgedTask.modelCalls, 2, "already acknowledged in-flight work must not be silently duplicated on restart");
    const incompleteTranscript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id });
    assert.equal(userMessages(incompleteTranscript, markerAcknowledged).length, 1);
    const originalAcknowledgedMessage = userMessages(incompleteTranscript, markerAcknowledged)[0];
    const progressMessage = incompleteTranscript.find((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes(markerAcknowledged));
    assert.ok(progressMessage, "the original Bot transcript must retain its visible interrupted-task notice");
    const interruptionNotice = incompleteTranscript.find((entry) => entry.kind === "send-message" && entry.message?.type === "text" && entry.message.content.includes("interrupted-user-turn:" + originalAcknowledgedMessage.id));
    assert.ok(interruptionNotice, "restart must persist an actionable interruption notice linked to the accepted user turn");
    assert.equal(interruptionNotice.replyTo, originalAcknowledgedMessage.id, "interruption notice must identify the accepted turn it describes");
    assert.ok(interruptionNotice.message.content.includes("/continue-interrupted " + originalAcknowledgedMessage.id), "notice must provide the explicit same-task continuation command");
    assert.equal(attachmentEntry(incompleteTranscript), undefined, "transcript must clearly remain incomplete until the user resumes it");
    const reopenedInterruptedTranscript = await gatewayCall(gatewayUrl, currentToken, "openAgent", { id: agentAcknowledged.id });
    assert.ok(reopenedInterruptedTranscript.some((entry) => entry.id === interruptionNotice.id && entry.message?.content?.includes("/continue-interrupted " + originalAcknowledgedMessage.id)),
      "reopening the active Bot after restart must include the same actionable interruption notice");

    const followUpNonce = randomUUID();
    await gatewayCall(gatewayUrl, currentToken, "sendPrompt", {
      agentId: agentAcknowledged.id,
      clientNonce: followUpNonce,
      prompt: "/continue-interrupted " + originalAcknowledgedMessage.id,
    });
    await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id });
      const attachment = attachmentEntry(transcript);
      if (!attachment) return null;
      if (acknowledgedTask.phase < 2) return null;
      return transcript;
    }, "explicit same-turn continuation finishes the original acknowledged Box task");
    const resumedTranscript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id });
    assert.equal(userMessages(resumedTranscript, markerAcknowledged).length, 1,
      "resume must preserve exactly one copy of the original accepted request");
    assert.ok(resumedTranscript.some((entry) => entry.kind === "message" && entry.role === "user" && entry.content === "/continue-interrupted " + originalAcknowledgedMessage.id),
      "resume must add an explicit continuation command in the original Bot session");

    await waitFor(async () => {
      if (fixture.failure) throw fixture.failure;
      const [hostStatus, transcript] = await Promise.all([
        gatewayCall(gatewayUrl, currentToken, "getHostStatus", { includeManagedCapabilities: false }),
        gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id }),
      ]);
      return hostStatus.isBusy === false && transcript.some((entry) =>
        entry.kind === "send-message" && entry.message?.type === "text" &&
        entry.message.content.includes(`This previously interrupted task was resumed by a follow-up in this Bot. Check the latest transcript entry for its result. interrupted-user-turn:${originalAcknowledgedMessage.id}`)
      ) ? transcript : null;
    }, "same-task recovery to become idle with its durable notice updated", 60_000);

    await invoke("update");
    serverStarted = true;
    currentToken = readToken();
    await waitReady();
    for (const agent of [agentA, agentB, agentRecovery, agentAcknowledged]) {
      const transcript = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agent.id });
      assert.ok(Array.isArray(transcript) && transcript.length > 0, "server update must preserve Bot transcripts");
    }
    const latestAcknowledged = await gatewayCall(gatewayUrl, currentToken, "getAgentTranscript", { id: agentAcknowledged.id });
    assert.ok(latestAcknowledged.some((entry) => entry.kind === "send-message" && entry.message?.content?.includes("was resumed by a follow-up")),
      "the persistent interruption notice must show that the task was resumed");
    await downloadAttachment(gatewayUrl, currentToken, agentAcknowledged.id, attachmentEntry(latestAcknowledged), markerAcknowledged);

    const oldToken = currentToken;
    await invoke("rotate-token");
    currentToken = readToken();
    assert.notEqual(currentToken, oldToken, "server must generate a fresh Gateway credential");
    await gatewayCall(gatewayUrl, oldToken, "getHostStatus", { includeManagedCapabilities: false }, { expectedStatus: 401 });
    const rotated = await probeGateway(gatewayUrl, currentToken);
    assert.ok(rotated.capabilities.includes("orderedReplicasV1"));
    const oldEvents = await fetch(gatewayUrl + "/events", { headers: { authorization: "Bearer " + oldToken } });
    assert.equal(oldEvents.status, 401, "rotated credential must also protect SSE");
    await downloadAttachment(gatewayUrl, currentToken, agentA.id, attachmentA, markerA);

    const dockerEnginePlatform = require("node:child_process").execFileSync("docker", ["info", "--format", "{{.OSType}}/{{.Architecture}}"], { encoding: "utf8" }).trim();
    const imagePlatform = require("node:child_process").execFileSync("docker", ["image", "inspect", pinnedImage, "--format", "{{.Os}}/{{.Architecture}}"], { encoding: "utf8" }).trim();
    assert.equal(imagePlatform, "linux/amd64", "test must use the pinned amd64 Box image");
    const report = {
      result: "passed",
      fixture: "deterministic Responses API fixture; no external inference",
      testRunnerPlatform: process.platform + "/" + os.arch(),
      dockerEnginePlatform,
      boxImagePlatform: imagePlatform,
      projectName,
      gatewayPort,
      tests: [
        "authenticated Gateway readiness, 401 API and SSE, compatible capability handshake",
        "concurrent two-Bot Shell tasks, distinct persisted Box files and transcript ownership",
        "authenticated readAttachmentChunk file download and client stream disconnect/reconnect",
        "authenticated local-exec device handshake, Never-policy denial before file access, and provider removal after SSE disconnect",
        "disconnected local computer returns the Host's actionable no-machine refusal without touching its target path",
        "explicit user Stop retires both manual interrupted-turn recovery and pre-ack automatic redrive state",
        "two same-Bot accepted turns coalesce, both IDs remain in the transcript, the covering turn clears the exact A/B recovery IDs while preserving its separate blocker, and its Box file survives restart",
        "idempotent prompt nonce and unacknowledged task redrive after Host restart",
        "post-ack interrupted task appears in transcript and reopened Bot snapshot, then explicit follow-up resumes the same file task without duplicate replay",
        "state-preserving server update and Gateway token rotation",
        ...observedDesktopReview,
      ],
      observations: fixture.observations,
      diagnosticPath: diagnosticsDir,
    };
    privateFile(path.join(diagnosticsDir, "report.json"), JSON.stringify(report, null, 2) + "\n");
    console.log("PASS isolated remote server + real Box flow (deterministic model fixture).");
    console.log("Tested Docker host architecture: " + os.arch() + "; pinned Box image: " + imagePlatform + ".");
    console.log("Private diagnostics: " + diagnosticsDir);
  } catch (error) {
    mainFailure = error;
  } finally {
    if (eventStream) await eventStream.close();
    try { fixture.server.closeAllConnections(); } catch {}
    await new Promise((resolve) => fixture.server.close(() => resolve())).catch(() => {});
    let cleanupFailure = null;
    if (serverStarted) {
      try { await invoke("stop"); } catch (error) { cleanupFailure = error; }
    }
    if (fs.existsSync(envFile)) {
      const composeArgs = [
        "compose", "--env-file", envFile, "--project-name", projectName,
        "-f", path.join(repository, "runtime/compose.yaml"), "down", "--remove-orphans",
      ];
      const cleanupEnv = {
        ...cliEnv,
        GROKBOT_GATEWAY_TOKEN: readToken(),
        GROKBOT_SEARCH_SECRET: fs.readFileSync(path.join(stateDir, "search-secret"), "utf8").trim(),
      };
      try {
        const down = await runProcess("docker", composeArgs, cleanupEnv, commandLog("compose-down"));
        assert.equal(down.code, 0, "isolated Compose project cleanup must succeed; see private diagnostics");
        const remaining = require("node:child_process").execFileSync("docker", ["compose", "--env-file", envFile, "--project-name", projectName,
          "-f", path.join(repository, "runtime/compose.yaml"), "ps", "--all", "-q"], {
          cwd: repository, env: cleanupEnv, encoding: "utf8",
        }).trim();
        assert.equal(remaining, "", "isolated Compose project must have no remaining containers");
      } catch (error) {
        cleanupFailure = cleanupFailure || error;
        privateFile(path.join(diagnosticsDir, "cleanup-failure.txt"), String(error.stack || error));
      }
    }
    if (mainFailure) {
      privateFile(path.join(diagnosticsDir, "failure.txt"), String(mainFailure.stack || mainFailure));
      privateFile(path.join(diagnosticsDir, "fixture-summary.json"), JSON.stringify(fixture.observations, null, 2) + "\n");
      throw new Error(String(mainFailure.message || mainFailure) + (cleanupFailure ? "; cleanup also failed: " + cleanupFailure.message : "") + "; private diagnostics: " + diagnosticsDir);
    }
    if (cleanupFailure) throw new Error("Isolated server cleanup failed: " + cleanupFailure.message + "; state and private diagnostics retained at " + runRoot);
    await fsp.rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
