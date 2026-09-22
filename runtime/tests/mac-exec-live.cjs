/* Real Mac daemon + original UI approval, with a deterministic model fixture.
 * The Box, gateway, desktop profile and all touched files belong to this test.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { execFileSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");
const { desktopFixture } = require("./desktop-fixture.cjs");

(async () => {
  const root = path.resolve(__dirname, "../..");
  const run = randomUUID(),
    marker = `mac-exec-${run}`;
  const temp = path.join(root, ".runtime/tests", marker);
  const machineLabel = `Local Mac 本地 ${run.slice(0, 8)}`;
  fs.mkdirSync(temp, { recursive: true, mode: 0o700 });
  const file = path.join(temp, "allowed.txt"),
    denied = path.join(temp, "denied.txt");
  const token = randomUUID(),
    modelToken = randomUUID();
  const container = `grokbot-mac-test-${run.slice(0, 8)}`;
  let step = 0,
    machineId,
    failure,
    reviews = 0,
    app,
    base,
    started = false;
  const observations = [];
  const tool = (name, args) => ({
    type: "function_call",
    id: randomUUID(),
    call_id: randomUUID(),
    name,
    arguments: JSON.stringify(args),
    status: "completed",
  });
  const emit = (res, output) => {
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.end(
      `data: ${JSON.stringify({ type: "response.completed", response: { id: randomUUID(), status: "completed", output } })}\n\n`,
    );
  };
  const server = http.createServer(async (req, res) => {
    try {
      assert.equal(req.url, "/v1/responses");
      assert.equal(req.headers.authorization, `Bearer ${modelToken}`);
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const input = JSON.parse(Buffer.concat(chunks)),
        names = input.tools?.map((t) => t.name) || [];
      if (!names.length)
        return emit(res, [
          {
            type: "message",
            id: randomUUID(),
            role: "assistant",
            content: [{ type: "output_text", text: "NONE" }],
          },
        ]);
      if (names.includes("classify_auto_review_action")) {
        assert.ok(
          JSON.stringify(input.input).includes(temp),
          "Review may approve only this fixture directory",
        );
        reviews++;
        return emit(res, [
          tool("classify_auto_review_action", {
            decision: "ALLOW",
            reason: "The test controls these temporary files.",
            blocked_effect: "none",
            outbound_authorization: "not_outbound",
          }),
        ]);
      }
      const results = input.input.filter(
        (x) => x.type === "function_call_output",
      );
      const latest = JSON.stringify(results.at(-1)?.output);
      observations.push({ step, latest });
      console.log("Mac fixture step:", step);
      let next;
      switch (step++) {
        case 0:
          next = tool("GetDynamicTools", {
            namespace: "cursor",
            toolName: "ListMachines",
          });
          break;
        case 1:
          next = tool("CallDynamicTool", {
            namespace: "cursor",
            toolName: "ListMachines",
            arguments: {},
          });
          break;
        case 2: {
          const result = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.equal(
            result.machines.length,
            1,
            "Only the private test desktop must be registered",
          );
          assert.ok(
            result.machines[0].connected,
            "The real Mac daemon must be connected",
          );
          machineId = result.machines[0].machineId;
          assert.equal(
            result.machines[0].label,
            machineLabel,
            "ListMachines must see the name saved through the original Settings UI",
          );
          next = tool("Shell", {
            machineId,
            command: `printf '%s' '${marker}' > '${file}' && cat '${file}'`,
            block_until_ms: 10000,
            description: "Write and read the Mac verification file",
          });
          break;
        }
        case 3:
          assert.ok(
            latest.includes(marker),
            `Mac Shell output missing: ${latest}`,
          );
          assert.equal(fs.readFileSync(file, "utf8"), marker);
          next = tool("Read", { machineId, path: file });
          break;
        case 4:
          assert.ok(
            latest.includes(marker),
            `Mac Read output missing: ${latest}`,
          );
          next = tool("Shell", {
            machineId,
            command: `printf '%s' '${marker}' > '${denied}'`,
            block_until_ms: 10000,
            description: "This fixture action will be denied",
          });
          break;
        case 5:
          assert.match(
            latest,
            /denied|declined|rejected|refused/i,
            "The denied tool must return its refusal",
          );
          assert.equal(fs.existsSync(denied), false);
          next = tool("SendToUser", {
            type: "text",
            content: marker,
            end_turn: true,
          });
          break;
        case 6:
          next = tool("GetDynamicTools", {
            namespace: "cursor",
            toolName: "ListMachines",
          });
          break;
        case 7:
          next = tool("CallDynamicTool", {
            namespace: "cursor",
            toolName: "ListMachines",
            arguments: {},
          });
          break;
        case 8: {
          const result = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.deepEqual(
            result.machines,
            [{ machineId, label: machineLabel, connected: true }],
            "The retained Agent must see the same identity and saved label after both restarts",
          );
          next = tool("SendToUser", {
            type: "text",
            content: marker + "-restarted",
            end_turn: true,
          });
          break;
        }
        default:
          throw Error("Unexpected extra agent inference");
      }
      assert.ok(names.includes(next.name));
      emit(res, [next]);
    } catch (error) {
      failure = error;
      res.writeHead(500, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ error: { message: "Mac fixture assertion failed" } }),
      );
    }
  });
  await new Promise((resolve) => server.listen(0, "0.0.0.0", resolve));
  const docker = (args) =>
    execFileSync("docker", args, {
      encoding: "utf8",
      timeout: 30000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
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
  try {
    for (const sub of ["data", "workspace"]) fs.mkdirSync(path.join(temp, sub));
    const args = [
      "run",
      "-d",
      "--name",
      container,
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
      GROKBOT_MODEL: "gpt-5.6-sol",
      GROKBOT_RESPONSES_BASE_URL: `http://host.docker.internal:${server.address().port}/v1`,
      LITELLM_API_KEY: modelToken,
    };
    for (const [key, value] of Object.entries(env))
      args.push("-e", `${key}=${value}`);
    for (const [source, target] of [
      [path.join(root, ".runtime/build/sand-host"), "/home/box/sand-host:ro"],
      [path.join(root, ".runtime/build/deps"), "/home/box/deps:ro"],
      [path.join(temp, "data"), "/home/box/sand-data"],
      [path.join(temp, "workspace"), "/workspace"],
      [
        path.join(root, "runtime/box-entrypoint.sh"),
        "/opt/grokbot/box-entrypoint.sh:ro",
      ],
    ])
      args.push("-v", `${source}:${target}`);
    args.push(
      "public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8",
      "/opt/grokbot/box-entrypoint.sh",
    );
    docker(args);
    started = true;
    base = `http://${docker(["port", container, "1340/tcp"])}`;
    console.log("Private Mac execution test diagnostics:", temp);
    let healthy = false;
    for (let i = 0; i < 150; i++) {
      try {
        if (
          (await fetch(base + "/health", { signal: AbortSignal.timeout(1000) }))
            .ok
        ) {
          healthy = true;
          break;
        }
      } catch {}
      await delay(400);
    }
    assert.ok(healthy, "The private Box host must start");
    app = await desktopFixture({
      root,
      profile: path.join(temp, "profile"),
      base,
      token,
    });
    const name = `Mac verification ${run.slice(0, 8)}`;
    const { agent } = await call("createAgent", {
      name,
      description: "Private Mac tool test",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    });
    await app.waitFor(() => app.click(name), 20000, "the test Bot");
    await app.waitFor(
      () =>
        app.evaluate(
          `document.querySelector('button[aria-label="View conversation details"]')?.innerText.includes(${JSON.stringify(name)})`,
        ),
      10000,
      "the test conversation",
    );
    await delay(2000);
    const openComputerSettings = async () => {
      await app.waitFor(
        () => app.click("Open account menu"),
        5000,
        "the account menu",
      );
      await app.waitFor(
        () =>
          app.clickElement(
            `[...document.querySelectorAll('[role="menuitem"]')].find(e => e.textContent.trim() === 'Settings')`,
          ),
        5000,
        "Settings",
      );
      await app.waitFor(() => app.click("Computer"), 5000, "Computer settings");
    };
    await openComputerSettings();
    await app.waitFor(
      () =>
        app.evaluate(
          `!!document.querySelector('#sand-setting-computers input')`,
        ),
      10000,
      "the retained computer name editor",
    );
    await app.evaluate(`(() => {
      const input = document.querySelector('#sand-setting-computers input');
      input.focus();
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(machineLabel)});
      input.dispatchEvent(new Event('input', {bubbles:true}));
    })()`);
    await app.waitFor(
      () =>
        app.clickElement(
          `document.querySelector('#sand-setting-computers button[type="submit"]')`,
        ),
      5000,
      "save the local computer name",
    );
    const labelsFile = path.join(temp, "data/machine-labels.json");
    await app.waitFor(
      () =>
        fs.existsSync(labelsFile) &&
        Object.values(
          JSON.parse(fs.readFileSync(labelsFile, "utf8")).labels,
        ).includes(machineLabel),
      10000,
      "the persisted local name",
    );
    await app.waitFor(
      () =>
        app.evaluate(
          `document.querySelector('#sand-setting-computers button[type="submit"]')?.disabled === true`,
        ),
      10000,
      "confirmed name in the retained UI",
    );
    await app.screenshot(path.join(temp, "renamed-settings.png"));
    await app.pressEscape();
    await app.waitFor(() => app.evaluate(`!document.querySelector('#sand-setting-computers input')`), 5000, "close settings");
    if (process.env.GROKBOT_TEST_MAC_SETTINGS_ONLY !== "1") {
      await call("sendPrompt", {
        agentId: agent.id,
        clientNonce: randomUUID(),
        prompt: `Run the authorized Mac fixture using only files under ${temp}. Discover the connected Mac, write/read ${file}, Read it again, and request writing ${denied}. The test will approve only the first two actions and deny the last one. Then reply with ${marker}.`,
      });
      const resolved = new Set();
      const deadline = Date.now() + 120000;
      let completed = false;
      while (Date.now() < deadline) {
        if (failure) throw failure;
        assert.equal(
          await app.evaluate(
            `document.body.innerText.includes("Your answer didn't go through")`,
          ),
          false,
          "The original approval response must reach the local gateway",
        );
        const transcript = await call("getAgentTranscript", { id: agent.id });
        fs.writeFileSync(
          path.join(temp, "transcript.json"),
          JSON.stringify(transcript, null, 2),
          { mode: 0o600 },
        );
        const asks = transcript.filter(
          (entry) =>
            entry.kind === "send-message" &&
            entry.message.type === "local-tool-permission",
        );
        for (const entry of asks) {
          const ask = entry.message.ask;
          if (ask.status !== "pending" || resolved.has(ask.requestId)) continue;
          if (resolved.size === 0)
            assert.equal(
              fs.existsSync(file),
              false,
              "Shell must not run before approval",
            );
          if (resolved.size === 2) assert.equal(fs.existsSync(denied), false);
          const label = resolved.size < 2 ? "Allow once" : "Deny once";
          await app.waitFor(
            () =>
              app.evaluate(
                `[...document.querySelectorAll('button')].some(b => (b.getAttribute('aria-label') === ${JSON.stringify(label)} || b.innerText.trim() === ${JSON.stringify(label)}) && !b.closest('[inert]') && b.getBoundingClientRect().width > 0)`,
              ),
            10000,
            "the approval card",
          );
          await delay(150);
          await app.screenshot(
            path.join(temp, `approval-${resolved.size}.png`),
          );
          await app.waitFor(
            () => app.click(label),
            10000,
            `${label} in original approval card`,
          );
          resolved.add(ask.requestId);
          console.log("Resolved original UI approval:", label);
        }
        if (
          transcript.some(
            (m) => m.kind === "send-message" && m.message.content === marker,
          ) &&
          !(await fetch(base + "/health").then((r) => r.json())).isBusy
        ) {
          completed = true;
          break;
        }
        await delay(250);
      }
      if (failure) throw failure;
      assert.ok(completed, "The original agent must finish the Mac tools test");
      assert.equal(
        resolved.size,
        3,
        "Each Mac action must be approved or denied in the UI",
      );
      assert.equal(fs.readFileSync(file, "utf8"), marker);
      assert.equal(fs.existsSync(denied), false);
      assert.ok(reviews >= 2);
      assert.equal(
        JSON.parse(
          fs.readFileSync(
            path.join(temp, "profile/sand-data/settings.json"),
            "utf8",
          ),
        ).localToolPermission,
        "ask",
      );
      await app.screenshot(path.join(temp, "completed.png"));
      console.log(
        "PASS original Mac daemon: discovery, Ask, UI Allow once, Shell/Read results, UI denial, persisted reply and idle.",
      );
    }
    await openComputerSettings();
    await app.waitFor(
      () =>
        app.clickElement(
          `document.querySelector('#sand-setting-local-execution button[aria-haspopup]')`,
        ),
      10000,
      "the local tool permission selector",
    );
    await app.waitFor(
      () =>
        app.clickElement(
          `[...document.querySelectorAll('[role="option"], [role="menuitem"], [role="menuitemradio"]')].find(e => e.textContent.trim() === 'Never allow')`,
        ),
      5000,
      "Never permission",
    );
    const settingsFile = path.join(temp, "profile/sand-data/settings.json");
    await app.waitFor(
      () =>
        JSON.parse(fs.readFileSync(settingsFile, "utf8"))
          .localToolPermission === "never",
      10000,
      "saved Never permission",
    );
    await app.waitFor(
      () =>
        app.evaluate(
          `(() => { const button = document.querySelector('#sand-setting-local-execution button[aria-haspopup]'); return !!button && !button.disabled && button.innerText.includes('Never allow'); })()`,
        ),
      10000,
      "the confirmed Never setting in the UI",
    );
    await delay(150);
    await app.screenshot(path.join(temp, "never-settings.png"));
    await app.close();
    app = null;
    docker(["restart", container]);
    // Docker may assign a new host port after restarting an ephemeral mapping.
    base = `http://${docker(["port", container, "1340/tcp"])}`;
    await (async () => {
      for (let attempt = 0; attempt < 300; attempt++) {
        try {
          if (
            (
              await fetch(base + "/health", {
                signal: AbortSignal.timeout(1000),
              })
            ).ok
          )
            return;
        } catch {}
        await delay(300);
      }
      throw Error("Private Box must become healthy after restart");
    })();
    app = await desktopFixture({
      root,
      profile: path.join(temp, "profile"),
      base,
      token,
    });
    await app.waitFor(
      () =>
        app.clickElement(
          `[...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label')?.startsWith(${JSON.stringify(name)}))`,
        ),
      20000,
      "the Bot after desktop restart",
    );
    await delay(2500);
    assert.equal(
      JSON.parse(fs.readFileSync(settingsFile, "utf8")).localToolPermission,
      "never",
      "Startup resync must preserve the saved machine permission",
    );
    assert.deepEqual(
      Object.values(
        JSON.parse(
          fs.readFileSync(path.join(temp, "data/settings.json"), "utf8"),
        ).localToolPermissionByMachineId,
      ),
      ["never"],
      "The host must retain the same per-machine permission",
    );
    console.log(
      "PASS original desktop Settings saves Never and preserves it after restart.",
    );
    await openComputerSettings();
    await app.waitFor(
      () =>
        app.evaluate(
          `document.querySelector('#sand-setting-computers input')?.value === ${JSON.stringify(machineLabel)}`,
        ),
      10000,
      "saved machine name after desktop and Box restart",
    );
    await app.screenshot(path.join(temp, "renamed-after-restart.png"));
    await app.pressEscape();
    await app.waitFor(() => app.evaluate(`!document.querySelector('#sand-setting-computers input')`), 5000, "close settings after restart");
    if (process.env.GROKBOT_TEST_MAC_SETTINGS_ONLY !== "1") {
      await call("sendPrompt", {
        agentId: agent.id,
        clientNonce: randomUUID(),
        prompt:
          "Check ListMachines again after restarting the local desktop and Box. Report the verification marker. Do not execute commands or modify files.",
      });
      await app.waitFor(
        async () => {
          if (failure) throw failure;
          const transcript = await call("getAgentTranscript", { id: agent.id });
          return (
            transcript.some(
              (m) =>
                m.kind === "send-message" &&
                m.message.content === marker + "-restarted",
            ) && !(await fetch(base + "/health").then((r) => r.json())).isBusy
          );
        },
        60000,
        "original Agent discovery after restart",
      );
    }
    const savedId = Object.keys(
      JSON.parse(fs.readFileSync(labelsFile, "utf8")).labels,
    )[0];
    assert.deepEqual(
      await call("getLocalMachineLabel", { machineId: savedId }),
      { machineId: savedId, label: machineLabel },
    );
    const deniedName = await fetch(`${base}/api/setLocalMachineLabel`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ machineId: savedId, label: "unauthorized" }),
    });
    assert.equal(deniedName.status, 401);
    const invalidName = await fetch(`${base}/api/setLocalMachineLabel`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ machineId: savedId, label: " " }),
    });
    assert.equal(invalidName.status, 400);
    assert.equal(
      (await call("getLocalMachineLabel", { machineId: savedId })).label,
      machineLabel,
    );
    console.log(
      "PASS local computer rename: original UI, original Agent discovery, stable identity, both restarts, unchanged permissions and authenticated validation.",
    );
  } finally {
    fs.writeFileSync(
      path.join(temp, "observations.json"),
      JSON.stringify(observations, null, 2),
      { mode: 0o600 },
    );
    if (app) {
      await app.screenshot(path.join(temp, "last-screen.png")).catch(() => {});
      fs.writeFileSync(
        path.join(temp, "last-screen.txt"),
        await app.evaluate("document.body.innerText").catch(() => ""),
        { mode: 0o600 },
      );
      await app.close();
    }
    if (started) {
      fs.writeFileSync(
        path.join(temp, "host.log"),
        docker(["logs", container]),
        { mode: 0o600 },
      );
      docker(["rm", "-f", container]);
    }
    server.closeAllConnections();
    server.close();
    console.log("Private Mac execution diagnostics:", temp);
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
