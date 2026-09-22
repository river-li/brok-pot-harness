/* Original voice UI, fake microphone file, real local STT/TTS and original Agent.
 * A private Box/profile and deterministic Responses server isolate all effects.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  http = require("node:http");
const { randomUUID } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");
const { desktopFixture } = require("./desktop-fixture.cjs");

(async () => {
  const root = path.resolve(__dirname, "../.."),
    run = randomUUID();
  const temp = path.join(root, ".runtime/tests/voice-" + run),
    data = path.join(temp, "data");
  for (const dir of [data, path.join(temp, "workspace")])
    fs.mkdirSync(dir, { recursive: true });
  const token = randomUUID(),
    modelToken = "voice-fixture-key",
    marker = "voice-proof-" + run;
  const container = "grokbot-voice-test-" + run.slice(0, 8),
    modelRequests = [];
  let app,
    base,
    started = false,
    failure,
    step = 0,
    reviews = 0,
    voiceUser = false,
    voiceResult = false,
    agentId;
  const tool = (name, args) => ({
    type: "function_call",
    id: randomUUID(),
    call_id: randomUUID(),
    name,
    arguments: JSON.stringify(args),
    status: "completed",
  });
  const message = (text) => ({
    type: "message",
    id: randomUUID(),
    role: "assistant",
    content: [{ type: "output_text", text }],
  });
  const emit = (res, output) => {
    const id = randomUUID();
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.write(
      `data: ${JSON.stringify({ type: "response.created", response: { id } })}\n\n`,
    );
    for (const item of output)
      if (item.type === "message")
        for (const p of item.content)
          res.write(
            `data: ${JSON.stringify({ type: "response.output_text.delta", delta: p.text })}\n\n`,
          );
    res.end(
      `data: ${JSON.stringify({ type: "response.completed", response: { id, status: "completed", output } })}\n\n`,
    );
  };
  const model = http.createServer(async (req, res) => {
    try {
      assert.equal(req.url, "/v1/responses");
      assert.equal(req.headers.authorization, "Bearer " + modelToken);
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = JSON.parse(Buffer.concat(chunks)),
        names = request.tools?.map((t) => t.name) || [];
      modelRequests.push({ names, input: request.input });
      fs.writeFileSync(
        path.join(temp, "model-requests.json"),
        JSON.stringify(modelRequests, null, 2),
        { mode: 0o600 },
      );
      if (names.includes("send_task")) {
        const words = request.input
          .filter((i) => i.role === "user")
          .flatMap((i) => i.content ?? [])
          .map((i) => i.text ?? "")
          .join(" ");
        const landed = request.input
          .filter((i) => i.type === "function_call_output")
          .some((i) => JSON.stringify(i.output).includes(marker));
        if (landed) {
          voiceResult = true;
          return emit(res, [
            message("Your local task is complete. Goodbye."),
            tool("end_the_call", {}),
          ]);
        }
        if (!words) return emit(res, [message("Hello, I am ready.")]);
        assert.match(words.toLowerCase(), /local voice transcription test/);
        voiceUser = true;
        if (
          request.input.some(
            (i) => i.type === "function_call" && i.name === "send_task",
          )
        )
          return emit(res, [tool("stay_silent", {})]);
        return emit(res, [
          message("I will check that."),
          tool("send_task", {
            request: `Write ${marker} into /workspace/voice-proof.txt, read it back and tell the caller the result.`,
          }),
        ]);
      }
      if (!names.length)
        return emit(res, [message("Local voice task completed.")]);
      if (names.includes("classify_auto_review_action")) {
        assert.ok(
          JSON.stringify(request.input).includes("/workspace/voice-proof.txt"),
        );
        reviews++;
        return emit(res, [
          tool("classify_auto_review_action", {
            decision: "ALLOW",
            reason: "Only the private voice fixture file.",
            blocked_effect: "none",
            outbound_authorization: "not_outbound",
          }),
        ]);
      }
      if (step++ === 0)
        return emit(res, [
          tool("Shell", {
            command: `printf '%s' '${marker}' > /workspace/voice-proof.txt && cat /workspace/voice-proof.txt`,
            block_until_ms: 10000,
            description: "Write and read the voice verification file",
          }),
        ]);
      assert.ok(
        JSON.stringify(
          request.input.filter((i) => i.type === "function_call_output").at(-1),
        ).includes(marker),
      );
      return emit(res, [
        tool("SendToUser", { type: "text", content: marker, end_turn: true }),
      ]);
    } catch (error) {
      failure ??= error;
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
  await new Promise((r) => model.listen(0, "0.0.0.0", r));
  const docker = (...args) =>
    execFileSync("docker", args, {
      encoding: "utf8",
      timeout: 30000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  const api = async (method, args = {}) => {
    const response = await fetch(base + "/api/" + method, {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, 200, method + " status");
    return response.json();
  };
  const waitFor = async (predicate, label, timeout = 120000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (failure) throw failure;
      if (await predicate()) return;
      await delay(250);
    }
    throw Error("Timed out: " + label);
  };
  try {
    // The fake capture starts with silence so the original call greeting can play.
    const source = path.join(root, ".runtime/tests/speech/en.wav"),
      capture = path.join(temp, "capture.wav");
    assert.ok(fs.existsSync(source), "Run create-speech-fixtures.py first.");
    execFileSync("python3", [
      "-c",
      `import sys,wave\nwith wave.open(sys.argv[1],'rb') as i:\n p=i.getparams();audio=i.readframes(i.getnframes())\nwith wave.open(sys.argv[2],'wb') as o:\n o.setparams(p);o.writeframes(bytes(p.framerate*p.nchannels*p.sampwidth*10)+audio+bytes(p.framerate*p.nchannels*p.sampwidth*2))`,
      source,
      capture,
    ]);
    const network = Object.keys(
      JSON.parse(
        docker(
          "inspect",
          "-f",
          "{{json .NetworkSettings.Networks}}",
          "gbh-local-speech-1",
        ),
      ),
    )[0];
    const args = [
      "run",
      "-d",
      "--name",
      container,
      "--network",
      network,
      "--platform",
      "linux/amd64",
      "--init",
      "--shm-size",
      "1gb",
      "-p",
      "127.0.0.1::1340",
      "--add-host",
      "host.docker.internal:host-gateway",
      "--entrypoint",
      "/bin/bash",
    ];
    const env = {
      SAND_PACKAGED: "1",
      SAND_HOST_IN_BOX: "1",
      SAND_DATA_ROOT: "/home/box/sand-data",
      SAND_GATEWAY_BIND_HOST: "0.0.0.0",
      SAND_HOST_PORT: "1340",
      SAND_GATEWAY_TOKEN: token,
      GROKBOT_MODEL: "local-fixture",
      GROKBOT_RESPONSES_BASE_URL: `http://host.docker.internal:${model.address().port}/v1`,
      LITELLM_API_KEY: modelToken,
      GROKBOT_TRANSCRIPTION_BASE_URL: "http://speech:8000",
      GROKBOT_TTS_BASE_URL: "http://speech:8000",
    };
    for (const [key, value] of Object.entries(env))
      args.push("-e", `${key}=${value}`);
    for (const [from, to] of [
      [path.join(root, ".runtime/build/sand-host"), "/home/box/sand-host:ro"],
      [path.join(root, ".runtime/build/deps"), "/home/box/deps:ro"],
      [data, "/home/box/sand-data"],
      [path.join(temp, "workspace"), "/workspace"],
      [
        path.join(root, "runtime/box-entrypoint.sh"),
        "/opt/grokbot/box-entrypoint.sh:ro",
      ],
    ])
      args.push("-v", `${from}:${to}`);
    args.push(
      "public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8",
      "/opt/grokbot/box-entrypoint.sh",
    );
    docker(...args);
    started = true;
    base = "http://" + docker("port", container, "1340/tcp");
    console.log("Voice diagnostics:", temp);
    await waitFor(
      async () => {
        try {
          return (
            await fetch(base + "/health", { signal: AbortSignal.timeout(1000) })
          ).ok;
        } catch {
          return false;
        }
      },
      "private host startup",
      90000,
    );
    const { agent } = await api("createAgent", {
      name: "Local voice verification",
      description: "Original voice and task flow verification.",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    });
    agentId = agent.id;
    await api("setAgentVoice", {
      id: agentId,
      voiceId: "carina",
      voiceLanguage: "en",
    });
    app = await desktopFixture({
      root,
      profile: path.join(temp, "profile"),
      base,
      token,
      enableVoice: true,
      extraArgs: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
        "--disable-features=AudioServiceSandbox",
        `--use-file-for-fake-audio-capture=${capture}%noloop`,
      ],
    });
    await app.waitFor(
      () => app.click("Start a voice call"),
      20000,
      "original call button",
    );
    await app.waitFor(
      () =>
        app.evaluate(
          "document.body.innerText.includes('Hang up') || !!document.querySelector('button[aria-label=\"Hang up\"]')",
        ),
      20000,
      "live call controls",
    );
    console.log("Original call UI connected.");
    let entry;
    await waitFor(async () => {
      const transcript = await api("getAgentTranscript", { id: agentId });
      fs.writeFileSync(
        path.join(temp, "transcript.json"),
        JSON.stringify(transcript, null, 2),
      );
      entry = transcript.find((e) => e.kind === "voice-call");
      return !!entry && voiceResult;
    }, "voice task outcome, spoken goodbye and persisted call");
    assert.ok(voiceUser && voiceResult && reviews > 0);
    assert.equal(
      fs.readFileSync(path.join(temp, "workspace/voice-proof.txt"), "utf8"),
      marker,
    );
    const saved = await api("getVoiceCall", {
      id: agentId,
      callId: entry.call.callId,
    });
    const record = saved.record ?? saved;
    fs.writeFileSync(
      path.join(temp, "voice-record.json"),
      JSON.stringify(record, null, 2),
    );
    assert.equal(record.ending, "hung-up");
    assert.equal(record.model, "grokbot-local-voice");
    assert.ok(
      record.turns.some(
        (t) =>
          t.speaker === "user" &&
          /local voice transcription test/i.test(t.text),
      ),
    );
    assert.ok(
      record.turns.some(
        (t) =>
          t.speaker === "assistant" && /local task is complete/i.test(t.text),
      ),
    );
    assert.ok(record.toolCalls.some((t) => t.name === "send_task"));
    assert.ok(record.toolCalls.some((t) => t.name === "end_the_call"));
    assert.ok(record.nudges.some((n) => JSON.stringify(n).includes(marker)));
    await app.screenshot(path.join(temp, "voice-completed.png"));
    console.log(
      "PASS original call UI → real local STT → original task tool/Auto-review/Shell → work nudge → real local TTS → goodbye/hangup → persisted call record.",
    );
  } catch (error) {
    if (app) {
      console.error(
        await app
          .evaluate("document.body.innerText.slice(-2500)")
          .catch(() => ""),
      );
      await app.screenshot(path.join(temp, "failure.png")).catch(() => {});
    }
    throw error;
  } finally {
    if (app) await app.close();
    if (started) {
      try {
        fs.writeFileSync(
          path.join(temp, "host.log"),
          docker("logs", "--tail", "300", container),
          { mode: 0o600 },
        );
      } catch {}
      docker("rm", "-f", container);
    }
    model.closeAllConnections();
    await new Promise((r) => model.close(r));
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
