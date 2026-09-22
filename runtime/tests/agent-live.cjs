/* Run inside the local Box with a working model key. A separate host/database
 * exercises the retained agent, Auto-review and sandbox against the real API. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const { join } = require("node:path");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");

(async () => {
  assert.ok(
    process.env.LITELLM_API_KEY,
    "Set LITELLM_API_KEY before running the live test",
  );
  const temp = await fsp.mkdtemp("/tmp/grokbot-agent-live-");
  await fsp.chmod(temp, 0o777); // The retained execution daemon runs as box.
  const token = randomUUID();
  const marker = `live-runtime-ok-${randomUUID()}`;
  const outputPath = join(temp, "tool-output.txt");
  const upstream = (
    process.env.GROKBOT_RESPONSES_BASE_URL || "http://litellm.home/v1"
  ).replace(/\/$/, "");
  const { readSSE } = require(
    join(
      process.env.GROKBOT_ROOT || "/home/box",
      "sand-host/local/responses.js",
    ),
  );
  const observations = {
    toolNames: new Set(),
    returnedMarker: false,
    returnedImage: false,
    reviewAllowed: false,
    memoryRequests: 0,
  };
  let proxyFailure;
  // Observe the real API exchange without replacing any model decisions. Keep
  // credentials, prompts and image contents out of the diagnostic output.
  const proxy = http.createServer(async (req, res) => {
    const controller = new AbortController();
    res.on("close", () => controller.abort());
    try {
      assert.equal(req.url, "/v1/responses");
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks),
        request = JSON.parse(body);
      const review = request.tools?.some(
        (t) => t.name === "classify_auto_review_action",
      );
      if (!request.tools?.length) observations.memoryRequests++;
      for (const item of request.input || [])
        if (item.type === "function_call_output") {
          if (JSON.stringify(item.output).includes(marker))
            observations.returnedMarker = true;
          if (
            Array.isArray(item.output) &&
            item.output.some(
              (p) => p.type === "input_image" && p.image_url?.length > 100,
            )
          )
            observations.returnedImage = true;
        }
      const response = await fetch(`${upstream}/responses`, {
        method: "POST",
        body,
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          authorization: req.headers.authorization,
        },
      });
      res.writeHead(response.status, {
        "content-type":
          response.headers.get("content-type") || "application/json",
      });
      if (!response.ok) {
        res.end(await response.text());
        return;
      }
      for await (const event of readSSE(response.body)) {
        const items =
          event.type === "response.output_item.done"
            ? [event.item]
            : event.type === "response.completed"
              ? event.response.output || []
              : [];
        for (const item of items)
          if (item.type === "function_call") {
            observations.toolNames.add(item.name);
            if (
              review &&
              item.name === "classify_auto_review_action" &&
              JSON.parse(item.arguments).decision === "ALLOW"
            )
              observations.reviewAllowed = true;
          }
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      res.end();
    } catch (error) {
      if (!controller.signal.aborted) {
        proxyFailure = error;
        res.destroy();
      }
    }
  });
  await new Promise((resolve) => proxy.listen(0, "127.0.0.1", resolve));
  const reservation = http.createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const logfile = join(temp, "host.log");
  const log = fs.openSync(logfile, "w", 0o600);
  const host = spawn(
    process.execPath,
    [join(process.env.GROKBOT_ROOT || "/home/box", "sand-host/host-main.cjs")],
    {
      stdio: ["ignore", log, log],
      env: {
        ...process.env,
        GROKBOT_LOCAL_MODE: "1",
        SAND_PACKAGED: "1",
        SAND_HOST_IN_BOX: "1",
        GROKBOT_RESPONSES_BASE_URL: `http://127.0.0.1:${proxy.address().port}/v1`,
        SAND_DATA_ROOT: join(temp, "data"),
        SAND_HOST_PORT: String(port),
        SAND_GATEWAY_TOKEN: token,
        SAND_GATEWAY_BIND_HOST: "127.0.0.1",
        SAND_BACKEND_URL: "http://127.0.0.1:9",
        SAND_DISABLE_TELEMETRY: "1",
        SAND_DISABLE_ANALYTICS: "1",
        SAND_BOX_AUTO_UPDATE: "0",
        SAND_BOX_STORE_SYNC: "0",
        SAND_BOX_STORE_COPY_IN: "0",
      },
    },
  );
  const base = `http://127.0.0.1:${port}`;
  const call = async (method, args = {}) => {
    const response = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, 200, `${method} HTTP status`);
    return response.json();
  };
  let agentId;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      assert.equal(host.exitCode, null, "Isolated host exited during startup");
      try {
        if ((await fetch(base + "/health")).ok) {
          ready = true;
          break;
        }
      } catch {}
      await delay(200);
    }
    assert.ok(ready, "Isolated host must become ready");
    const { agent } = await call("createAgent", {
      name: "Real model integration verification",
      description: "Temporary local runtime test",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    });
    agentId = agent.id;
    console.log("Live test started:", agentId, "diagnostics:", temp);
    await call("sendPrompt", {
      agentId,
      clientNonce: randomUUID(),
      prompt: `This is an authorized local runtime integration test. In the Linux sandbox, use Shell to write the exact string ${marker} to ${outputPath} and read it back. Then capture one sandbox screenshot. Finally use SendToUser to reply with exactly ${marker} and end the turn. Only touch this temporary test file. Do not use the user's Mac, external websites or any other files.`,
    });
    const deadline =
      Date.now() + Number(process.env.GROKBOT_LIVE_TEST_TIMEOUT_MS || 240000);
    let transcript = [],
      finished = false,
      previousCount = -1;
    while (Date.now() < deadline) {
      if (proxyFailure) throw proxyFailure;
      const trays = await call("getTrays");
      const errors = (Array.isArray(trays) ? trays : trays.trays || []).filter(
        (t) => t.kind === "error",
      );
      assert.equal(
        errors.length,
        0,
        "Live agent reported an error; inspect the isolated host log",
      );
      transcript = await call("getAgentTranscript", { id: agentId });
      if (transcript.length !== previousCount) {
        previousCount = transcript.length;
        console.log(
          "Transcript entries:",
          previousCount,
          "latest kind:",
          transcript.at(-1)?.kind,
        );
      }
      const reply = transcript.some(
        (m) =>
          m.kind === "send-message" &&
          m.message.type === "text" &&
          m.message.content === marker,
      );
      const health = await (await fetch(base + "/health")).json();
      if (reply && !health.isBusy) {
        finished = true;
        break;
      }
      await delay(1000);
    }
    await fsp.writeFile(
      join(temp, "transcript.json"),
      JSON.stringify(transcript, null, 2),
      { mode: 0o600 },
    );
    assert.ok(
      finished,
      "The live agent must finish the turn and send the exact marker",
    );
    assert.equal(
      await fsp.readFile(outputPath, "utf8"),
      marker,
      "Real Shell must create the test file",
    );
    assert.ok(
      observations.returnedMarker,
      "Real Shell output must return to the model",
    );
    assert.ok(
      observations.toolNames.has("Screenshot"),
      "The model must call the real screenshot tool",
    );
    assert.ok(
      observations.returnedImage,
      "Actual screenshot bytes must return to the model",
    );
    assert.ok(
      observations.reviewAllowed,
      "The real Auto-review model must approve the authorized action",
    );
    assert.ok(
      observations.memoryRequests > 0,
      "Post-turn memory extraction must call the real API",
    );
    await fsp.writeFile(
      join(temp, "observations.json"),
      JSON.stringify(
        { ...observations, toolNames: [...observations.toolNames] },
        null,
        2,
      ),
    );
    console.log(
      "PASS real model → original agent/Auto-review → sandbox file and screenshot → persisted reply → idle.",
    );
  } finally {
    console.log("Live test diagnostics:", temp);
    if (agentId) await call("deleteAgents", { ids: [agentId] }).catch(() => {});
    host.kill("SIGTERM");
    if (host.exitCode === null)
      await Promise.race([
        new Promise((resolve) => host.once("exit", resolve)),
        delay(5000),
      ]);
    if (host.exitCode === null) host.kill("SIGKILL");
    fs.closeSync(log);
    proxy.closeAllConnections();
    proxy.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
