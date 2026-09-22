/* Test the rebuilt Electron UI against the running local host and real model.
 * Start the development app with --remote-debugging-port=19223 first. The test
 * keeps its new verification chat for inspection and never changes permissions.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { randomUUID } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");

(async () => {
  const root = path.resolve(__dirname, "../..");
  const base = process.env.GROKBOT_GATEWAY_URL || "http://127.0.0.1:1540";
  const token = fs
    .readFileSync(path.join(root, ".runtime/gateway-token"), "utf8")
    .trim();
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
  const health = await fetch(`${base}/health`).then((r) => r.json());
  assert.equal(health.ok, true);
  assert.equal(
    health.isBusy,
    false,
    "Wait for the current user task to finish before testing",
  );
  const previousIds = new Set((await call("listAgents")).map((a) => a.id));
  const pages = await fetch("http://127.0.0.1:19223/json/list", {
    signal: AbortSignal.timeout(3000),
  }).then((r) => r.json());
  const page = pages.find(
    (p) =>
      p.type === "page" &&
      p.url ===
        pathToFileURL(
          path.join(root, ".runtime/desktop/dist/renderer/index.html"),
        ).href,
  );
  assert.ok(
    page,
    "The rebuilt local Grok Bot development window must be running",
  );
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    clearTimeout(item.timer);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  const command = (method, params = {}) =>
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
    const value = await command("Runtime.evaluate", {
      expression,
      returnByValue: true,
    });
    assert.equal(
      value.exceptionDetails,
      undefined,
      "Renderer evaluation must succeed",
    );
    return value.result?.value;
  };
  const click = (label) =>
    evaluate(`(() => {
    const button = document.querySelector('button[aria-label=${JSON.stringify(label)}]');
    if (!button || button.disabled) return false;
    button.click(); return true;
  })()`);
  const waitFor = async (
    predicate,
    timeout = 10000,
    state = "desktop state",
  ) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      if (await predicate()) return;
      await delay(200);
    }
    throw new Error(`The expected ${state} did not appear`);
  };
  const outputPath = `/tmp/grokbot-desktop-test-${randomUUID()}.txt`;
  const box = process.env.GROKBOT_TEST_CONTAINER || "gbh-local-app-1";
  try {
    assert.ok(
      !(await evaluate(
        `document.querySelector('[aria-label="Prompt"]')?.textContent?.trim()`,
      )),
      "Do not replace an existing user draft",
    );
    assert.ok(await click("New chat"));
    await waitFor(
      () =>
        evaluate(
          `!!document.querySelector('input[aria-label="Search or create Bots"]')`,
        ),
      10000,
      "recipient picker",
    );
    await waitFor(
      () =>
        evaluate(
          `!!document.querySelector('[contenteditable="true"][aria-label="Prompt"]')`,
        ),
      10000,
      "prompt composer",
    );
    assert.ok(
      !(await evaluate(
        `document.querySelector('[aria-label="Prompt"]').textContent.trim()`,
      )),
      "Do not replace a saved new-chat draft",
    );
    const marker = `desktop-runtime-ok-${randomUUID()}`;
    const prompt = `This is an authorized local desktop integration test. In the Linux sandbox, use Shell to write the exact string ${marker} to ${outputPath} and read it back. Use SendToUser to reply with exactly the file contents, then end the turn. Only touch this temporary test file. Do not use my Mac.`;
    await evaluate(
      `document.querySelector('[contenteditable="true"][aria-label="Prompt"]').focus()`,
    );
    await command("Input.insertText", { text: prompt });
    const botName = `Desktop verification ${randomUUID().slice(0, 8)}`;
    await evaluate(
      `document.querySelector('input[aria-label="Search or create Bots"]').focus()`,
    );
    await command("Input.insertText", { text: botName });
    await waitFor(
      () =>
        evaluate(
          `[...document.querySelectorAll('button[role="option"]')].some(button=>button.innerText.includes(${JSON.stringify(botName)}))`,
        ),
      10000,
      "create Bot option",
    );
    await evaluate(
      `[...document.querySelectorAll('button[role="option"]')].find(button=>button.innerText.includes(${JSON.stringify(botName)})).click()`,
    );
    await waitFor(
      () =>
        evaluate(
          `!!document.querySelector('button[aria-label="Send message"]:not(:disabled)')`,
        ),
      30000,
      "enabled Send button",
    );
    assert.ok(await click("Send message"));
    let agentId;
    await waitFor(async () => {
      for (const agent of await call("listAgents")) {
        if (previousIds.has(agent.id)) continue;
        const transcript = await call("getAgentTranscript", { id: agent.id });
        if (JSON.stringify(transcript).includes(marker)) {
          agentId = agent.id;
          return true;
        }
      }
      return false;
    }, 20000);
    console.log(
      "Desktop test sent its prompt through the original UI; agent:",
      agentId,
    );
    let finished = false;
    const end = Date.now() + 240000;
    let previousCount = -1;
    while (Date.now() < end) {
      const transcript = await call("getAgentTranscript", { id: agentId });
      if (transcript.length !== previousCount) {
        previousCount = transcript.length;
        console.log("Transcript entries:", previousCount);
      }
      const state = await fetch(`${base}/health`).then((r) => r.json());
      assert.equal(
        state.busyOnlyAwaitingApproval,
        false,
        "The test needs manual approval; review it in the app without changing permissions",
      );
      if (
        transcript.some(
          (m) =>
            m.kind === "send-message" &&
            m.message?.type === "text" &&
            m.message.content === marker,
        ) &&
        !state.isBusy
      ) {
        finished = true;
        break;
      }
      await delay(1000);
    }
    assert.ok(
      finished,
      "The real model must finish and persist the expected reply",
    );
    const actual = execFileSync(
      "docker",
      [
        "exec",
        box,
        "/exec-daemon/node",
        "-e",
        `process.stdout.write(require('node:fs').readFileSync(${JSON.stringify(outputPath)}))`,
      ],
      { encoding: "utf8", timeout: 10000 },
    );
    assert.equal(
      actual,
      marker,
      "The sandbox tool must actually write the requested file",
    );
    await waitFor(() =>
      evaluate(
        `document.body.innerText.split(${JSON.stringify(marker)}).length >= 3`,
      ),
    );
    assert.ok(
      !(await evaluate(
        `document.querySelector('[aria-label="Prompt"]')?.textContent?.trim()`,
      )),
      "The sent prompt must clear from the composer",
    );
    const screenshot = await command("Page.captureScreenshot", {
      format: "png",
    });
    const directory = path.join(root, ".runtime/tests");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "desktop-live.png"),
      Buffer.from(screenshot.data, "base64"),
      { mode: 0o600 },
    );
    console.log(
      "PASS original Electron UI → local host → real model → sandbox tool → persisted, rendered reply.",
    );
    console.log(
      "Verification chat retained; screenshot:",
      path.join(directory, "desktop-live.png"),
    );
  } finally {
    try {
      execFileSync(
        "docker",
        [
          "exec",
          box,
          "/exec-daemon/node",
          "-e",
          `require('node:fs').rmSync(${JSON.stringify(outputPath)},{force:true})`,
        ],
        { timeout: 10000 },
      );
    } finally {
      for (const item of pending.values()) clearTimeout(item.timer);
      socket.close();
    }
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
