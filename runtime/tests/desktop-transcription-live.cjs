/* Exercise the retained recorder and IPC with synthetic microphone audio.
 * A separate Electron profile never records the hardware microphone or sends
 * the recognized draft to a model. Run create-speech-fixtures.py first.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const { spawn, execFileSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { setTimeout: delay } = require("node:timers/promises");

(async () => {
  const root = path.resolve(__dirname, "../..");
  const base = "http://127.0.0.1:1540";
  const token = fs
    .readFileSync(path.join(root, ".runtime/gateway-token"), "utf8")
    .trim();
  const fixture = JSON.parse(
    fs.readFileSync(
      path.join(root, ".runtime/tests/speech/manifest.json"),
      "utf8",
    ),
  ).find((s) => s.language === "en");
  assert.ok(
    fixture && fs.existsSync(fixture.path),
    "Generate the local speech fixtures first",
  );
  const call = async (method, args = {}) => {
    const response = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, 200, `${method} HTTP status`);
    return response.json();
  };
  const reservation = net.createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const profile = fs.mkdtempSync(
    path.join(root, ".runtime/profiles/voice-test-"),
  );
  const log = fs.openSync(path.join(profile, "desktop.log"), "w", 0o600);
  const env = {
    ...process.env,
    GROKBOT_LOCAL_MODE: "1",
    SAND_BACKEND_URL: "http://127.0.0.1:9",
    SAND_USER_DATA_DIR: profile,
    SAND_HOST_GATEWAY_URL: base,
    SAND_HOST_GATEWAY_TOKEN: token,
    SAND_DEV_BOX_CONTROL_PLANE: "0",
    SAND_ATTACH_PROD_BOX: "0",
    SAND_DISABLE_TELEMETRY: "1",
    SAND_DISABLE_ANALYTICS: "1",
  };
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.LITELLM_API_KEY;
  const child = spawn(
    require("electron"),
    [
      path.join(root, ".runtime/desktop"),
      `--user-data-dir=${profile}`,
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${port}`,
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
      // Only this synthetic-input test needs the audio utility to read a fixture.
      "--disable-features=AudioServiceSandbox",
      `--use-file-for-fake-audio-capture=${fixture.path}%noloop`,
    ],
    { env, stdio: ["ignore", log, log] },
  );
  let agentId, socket, command;
  const pending = new Map();
  const waitFor = async (predicate, timeout, label) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      assert.equal(
        child.exitCode,
        null,
        "The isolated desktop exited unexpectedly",
      );
      if (await predicate()) return;
      await delay(200);
    }
    throw new Error(`Timed out waiting for ${label}`);
  };
  try {
    let page;
    await waitFor(
      async () => {
        try {
          const pages = await fetch(`http://127.0.0.1:${port}/json/list`, {
            signal: AbortSignal.timeout(1000),
          }).then((r) => r.json());
          page = pages.find(
            (p) =>
              p.type === "page" &&
              p.url ===
                pathToFileURL(
                  path.join(root, ".runtime/desktop/dist/renderer/index.html"),
                ).href,
          );
          return !!page;
        } catch {
          return false;
        }
      },
      30000,
      "rebuilt Grok Bot test window",
    );
    socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    let sequence = 0;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data),
        item = pending.get(message.id);
      if (!item) return;
      pending.delete(message.id);
      clearTimeout(item.timer);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    });
    command = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`${method} timed out`));
        }, 10000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    const evaluate = async (expression) => {
      const result = await command("Runtime.evaluate", {
        expression,
        returnByValue: true,
      });
      assert.equal(
        result.exceptionDetails,
        undefined,
        "Renderer evaluation must succeed",
      );
      return result.result?.value;
    };
    const click = (label) =>
      evaluate(`(() => {
      const button = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === ${JSON.stringify(label)} && !b.closest('[inert]') && b.getBoundingClientRect().width > 0 && getComputedStyle(b).visibility === 'visible');
      if (!button || button.disabled) return false;
      button.click(); return true;
    })()`);
    const name = `Voice input verification ${randomUUID().slice(0, 8)}`;
    ({
      agent: { id: agentId },
    } = await call("createAgent", {
      name,
      description: "Temporary synthetic microphone test",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    }));
    await waitFor(() => click(name), 20000, "test Bot in sidebar");
    await waitFor(
      () =>
        evaluate(
          `!document.querySelector('input[aria-label="Search or create Bots"]') && document.querySelector('button[aria-label="View conversation details"]')?.innerText.includes(${JSON.stringify(name)})`,
        ),
      10000,
      "selected test conversation",
    );
    await waitFor(
      () =>
        evaluate(
          `!!document.querySelector('[contenteditable="true"][aria-label="Prompt"]')`,
        ),
      10000,
      "composer",
    );
    await delay(500);
    assert.equal(
      await evaluate(
        `document.querySelector('[aria-label="Prompt"]').textContent.trim()`,
      ),
      "",
    );
    assert.ok(
      await click("Start voice input"),
      "Start the original voice recorder",
    );
    await waitFor(
      () =>
        evaluate(
          `[...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === 'Stop dictation')`,
        ),
      10000,
      "recording state",
    );
    console.log("Original recorder is capturing the synthetic audio fixture.");
    await delay(fixture.durationMs + 1000);
    assert.ok(
      await click("Stop dictation"),
      "Stop the original voice recorder",
    );
    await waitFor(
      () =>
        evaluate(
          `document.querySelector('[aria-label="Prompt"]')?.textContent.toLowerCase().includes('project folder')`,
        ),
      60000,
      "transcription in composer",
    );
    const text = await evaluate(
      `document.querySelector('[aria-label="Prompt"]').textContent.trim()`,
    );
    assert.match(text.toLowerCase(), /local voice transcription test/);
    assert.deepEqual(
      await call("getAgentTranscript", { id: agentId }),
      [],
      "Dictation must remain a draft",
    );
    const screenshot = await command("Page.captureScreenshot", {
      format: "png",
    });
    fs.writeFileSync(
      path.join(root, ".runtime/tests/desktop-transcription-live.png"),
      Buffer.from(screenshot.data, "base64"),
      { mode: 0o600 },
    );
    console.log(JSON.stringify({ text }));
    console.log(
      "PASS original desktop recorder → main IPC → authenticated host → local Whisper → unsent composer draft.",
    );
  } finally {
    let daemonPid;
    try {
      daemonPid = JSON.parse(
        fs.readFileSync(
          path.join(profile, "sand-data/local-exec-daemon.json"),
          "utf8",
        ),
      ).pid;
    } catch {}
    if (command && socket?.readyState === WebSocket.OPEN)
      await command("Browser.close").catch(() => {});
    socket?.close();
    for (const item of pending.values()) clearTimeout(item.timer);
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await Promise.race([
        new Promise((resolve) => child.once("exit", resolve)),
        delay(5000),
      ]);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
    // The normal app's exit hooks stop its daemon. Cover an abnormal test exit
    // too, using only the PID belonging to this newly created test profile.
    if (Number.isSafeInteger(daemonPid)) {
      try {
        const executable = execFileSync(
          "ps",
          ["-p", String(daemonPid), "-o", "command="],
          { encoding: "utf8" },
        ).trim();
        if (
          executable.endsWith(
            path.join(root, ".runtime/desktop/dist/local-exec-daemon/main.cjs"),
          )
        )
          process.kill(daemonPid, "SIGTERM");
      } catch {}
    }
    fs.closeSync(log);
    if (agentId) await call("deleteAgents", { ids: [agentId] });
    console.log("Isolated desktop diagnostics:", profile);
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
