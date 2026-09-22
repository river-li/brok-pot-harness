/* Run inside the local Box. Uses a fresh host/data directory and a deterministic
 * Responses fixture; the actual retained agent loop and sandbox tools execute.
 * This does not validate external model inference. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const { join } = require("node:path");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");
const root = process.env.GROKBOT_ROOT || "/home/box";
const hostEntry = join(root, "sand-host/host-main.cjs");
const { readSSE } = require(join(root, "sand-host/local/responses.js"));

(async () => {
  const temp = await fsp.mkdtemp("/tmp/grokbot-agent-test-");
  const token = randomUUID();
  const marker = `runtime-ok-${randomUUID()}`;
  const outputPath = join(temp, "tool-output.txt");
  const testDiscovery = process.env.GROKBOT_TEST_DISCOVERY === "1";
  const testDesktop = process.env.GROKBOT_TEST_DESKTOP === "1";
  const testLocalExec = process.env.GROKBOT_TEST_LOCAL_EXEC === "1";
  const testWebFetch = process.env.GROKBOT_TEST_WEB_FETCH === "1";
  const testWebSearch = process.env.GROKBOT_TEST_WEB_SEARCH === "1";
  let webSearchStep = 0;
  const testMcp = process.env.GROKBOT_TEST_MCP === "1";
  let mcpStep = 0,
    mcpHttpCalls = 0,
    mcpSseCalls = 0;
  let webFetchStep = 0,
    webFetchRequests = 0;
  let localExecStep = 0,
    providerDispatches = 0;
  const providerController = new AbortController();
  let providerLoop;
  let discoveryDone = false;
  let desktopLaunched = false,
    desktopRequests = 0,
    desktopFinished = false;
  let browserClicked = false,
    desktopKeyPressed = false;
  let desktopViewId;
  // The exec daemon runs as box; make only this isolated test directory writable.
  await fsp.chmod(temp, 0o777);
  let requests = 0,
    classifierRequests = 0,
    memoryRequests = 0,
    fixtureFailure;
  const observations = [];
  const server = http.createServer(async (req, res) => {
    try {
      if (testMcp && req.url === "/mcp") {
        await require("./mcp-fixture.cjs").handleHttp(req, res, (text) => {
          assert.equal(text, marker);
          mcpHttpCalls++;
        });
        return;
      }
      if (testMcp && (req.url === "/sse" || req.url.startsWith("/sse-post?"))) {
        await require("./mcp-fixture.cjs").handleLegacySse(req, res, (text) => {
          assert.equal(text, marker);
          mcpSseCalls++;
        });
        return;
      }
      if (req.url === "/fetch-page") {
        webFetchRequests++;
        // The retained runner auto-approves WebFetch interaction queries; it
        // does not enable the optional WebFetch classifier mode (unlike Shell).
        assert.equal(
          req.headers.authorization,
          undefined,
          "WebFetch must not forward the model key",
        );
        res.writeHead(200, { "content-type": "text/html" });
        res.end(
          `<h1>WebFetch verification</h1><p>${marker}</p><a href="/next">Next page</a>`,
        );
        return;
      }
      if (req.url === "/fixture") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(
          '<!doctype html><title>Local runtime verification</title><h1>Local runtime verification</h1><button onclick="fetch(\'/fixture-click\',{method:\'POST\'}).then(()=>this.textContent=\'Click verified\')">Verify local click</button><script>addEventListener("keydown",e=>{if(e.key==="F8")fetch("/fixture-key",{method:"POST"})})</script>',
        );
        return;
      }
      if (req.url === "/fixture-click" || req.url === "/fixture-key") {
        assert.equal(req.method, "POST");
        if (req.url === "/fixture-click") browserClicked = true;
        else desktopKeyPressed = true;
        res.writeHead(200);
        res.end("ok");
        return;
      }
      if (req.url === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
      }
      assert.equal(req.url, "/v1/responses");
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const input = JSON.parse(Buffer.concat(chunks));
      const names = input.tools.map((t) => t.name);
      if (names.includes("Computer")) {
        desktopRequests++;
        console.log(
          "Desktop fixture request",
          desktopRequests,
          "tools",
          names.join(", "),
        );
        const id = `desktop-${desktopRequests}`;
        const results = input.input.filter(
          (x) => x.type === "function_call_output",
        );
        const latest = results.at(-1)?.output;
        const latestText =
          typeof latest === "string"
            ? latest
            : (latest || [])
                .filter((p) => p.type === "input_text")
                .map((p) => p.text)
                .join("\n");
        if (latestText)
          console.log("Desktop result", latestText.slice(0, 3000));
        let output;
        let toolName, toolArgs;
        if (desktopRequests === 1) {
          toolName = "Computer";
          toolArgs = { action: "screenshot" };
        } else if (desktopRequests === 2) {
          assert.ok(
            input.input.some(
              (x) =>
                x.type === "function_call_output" &&
                Array.isArray(x.output) &&
                x.output.some((p) => p.type === "input_image"),
            ),
            "Desktop child must receive a real screenshot",
          );
          toolName = "browser_navigate";
          toolArgs = {
            url: `http://127.0.0.1:${server.address().port}/fixture`,
            newTab: true,
          };
        } else if (desktopRequests === 3) {
          assert.match(
            latestText,
            /Local runtime verification/,
            "Browser must load the fixture page",
          );
          toolName = "browser_snapshot";
          toolArgs = {};
        } else if (desktopRequests === 4) {
          const line = latestText
            .split("\n")
            .find((x) => x.includes("Verify local click"));
          const ref = line?.match(/\[ref=([^\]]+)\]/)?.[1];
          assert.ok(ref, "Browser snapshot must identify the fixture button");
          toolName = "browser_click";
          toolArgs = {
            ref,
            element:
              "Click the Verify local click button in the local runtime verification fixture",
          };
        } else if (desktopRequests === 5) {
          assert.ok(
            browserClicked,
            "Browser click must reach the actual local page handler",
          );
          toolName = "Computer";
          toolArgs = {
            action: "key",
            key: "F8",
            description: "Press F8 in the local runtime verification fixture",
          };
        } else if (desktopRequests === 6) {
          assert.ok(
            desktopKeyPressed,
            "Desktop key must reach the actual local page handler",
          );
          toolName = "browser_tabs";
          toolArgs = { action: "close" };
        } else {
          assert.match(
            latestText,
            /closed/i,
            "The fixture tab must close successfully",
          );
          desktopFinished = true;
          res.writeHead(200, { "content-type": "text/event-stream" });
          res.write(
            `data: ${JSON.stringify({ type: "response.output_text.delta", delta: "desktop-fixture-complete" })}\n\n`,
          );
          output = [
            {
              type: "message",
              id,
              role: "assistant",
              content: [
                { type: "output_text", text: "desktop-fixture-complete" },
              ],
            },
          ];
        }
        if (toolName) {
          res.writeHead(200, { "content-type": "text/event-stream" });
          output = [
            {
              type: "function_call",
              id,
              call_id: id,
              name: toolName,
              arguments: JSON.stringify(toolArgs),
            },
          ];
        }
        res.end(
          `data: ${JSON.stringify({ type: "response.completed", response: { id, status: "completed", output } })}\n\n`,
        );
        return;
      }
      if (names.length === 0) {
        assert.ok(
          input.input.some(
            (x) =>
              x.role === "system" &&
              JSON.stringify(x.content).includes("<<SAND_MEMORY_EXTRACTION>>"),
          ),
          "Only the known post-turn extraction may omit tools",
        );
        memoryRequests++;
        res.writeHead(200, { "content-type": "text/event-stream" });
        const message = {
          type: "message",
          id: "memory-message",
          role: "assistant",
          content: [{ type: "output_text", text: "NONE" }],
        };
        res.write(
          `data: ${JSON.stringify({ type: "response.output_text.delta", delta: "NONE" })}\n\n`,
        );
        res.end(
          `data: ${JSON.stringify({ type: "response.completed", response: { id: "memory-response", status: "completed", output: [message] } })}\n\n`,
        );
        return;
      }
      if (names.includes("classify_auto_review_action")) {
        classifierRequests++;
        const context = JSON.parse(
          input.input.find((x) => x.role === "user").content[0].text,
        );
        console.log(
          "Review fixture",
          classifierRequests,
          "action",
          context.proposed_tool_call.action,
        );
        assert.ok(
          JSON.stringify(context.trusted_user_instructions).includes(marker),
          "Review must receive the trusted test request",
        );
        const target = JSON.stringify(context.proposed_tool_call);
        const targetArgs = context.proposed_tool_call.arguments;
        const fetchesOwnPage =
          testWebFetch &&
          context.proposed_tool_call.action === "web_fetch" &&
          targetArgs.url ===
            `http://127.0.0.1:${server.address().port}/fetch-page`;
        const callsOwnMcp =
          testMcp &&
          /fixture_stdio|fixture_http|fixture_sse/.test(target) &&
          target.includes(marker);
        if (
          target.includes(
            `http://127.0.0.1:${server.address().port}/fixture`,
          ) &&
          targetArgs.view_id
        )
          desktopViewId = targetArgs.view_id;
        const closesOwnTab =
          desktopViewId &&
          targetArgs.action_kind === "browser_tabs" &&
          targetArgs.tabs_action === "close" &&
          targetArgs.view_id === desktopViewId &&
          targetArgs.box?.box_id === agentId;
        assert.ok(
          target.includes(outputPath) ||
            fetchesOwnPage ||
            callsOwnMcp ||
            (testDesktop &&
              (/desktop-fixture-task|local runtime verification fixture/.test(
                target,
              ) ||
                target.includes(
                  `http://127.0.0.1:${server.address().port}/fixture`,
                ) ||
                closesOwnTab)),
          `Review must cover only the fixture action: ${target.slice(0, 1500)}`,
        );
        assert.equal(input.tool_choice.name, "classify_auto_review_action");
        const item = {
          type: "function_call",
          id: `review-${classifierRequests}`,
          call_id: `review-call-${classifierRequests}`,
          name: "classify_auto_review_action",
          arguments: JSON.stringify({
            decision: "ALLOW",
            reason: "The fixture requested this temporary file write.",
            blocked_effect: "none",
            outbound_authorization: "not_outbound",
          }),
        };
        res.writeHead(200, { "content-type": "text/event-stream" });
        res.end(
          `data: ${JSON.stringify({ type: "response.completed", response: { id: `review-${classifierRequests}`, status: "completed", output: [item] } })}\n\n`,
        );
        return;
      }
      requests++;
      assert.ok(
        requests <= (testMcp ? 16 : 12),
        "Agent should finish within the expected model request count",
      );
      const results = input.input.filter(
        (x) => x.type === "function_call_output",
      );
      console.log(
        "Fixture request",
        requests,
        "tool results",
        results.length,
        "tools",
        names.join(", "),
      );
      if (requests === 1)
        for (const tool of input.tools)
          assert.equal(
            tool.parameters.type,
            "object",
            `${tool.name} needs a JSON Schema object`,
          );
      if (results.length)
        console.log(
          "Latest tool result",
          typeof results.at(-1).output === "string"
            ? results.at(-1).output.slice(0, 1400)
            : JSON.stringify(
                results.at(-1).output.map((p) => ({
                  ...p,
                  image_url: p.image_url ? "[image]" : undefined,
                })),
              ).slice(0, 1400),
        );
      observations.push({ names, results });
      let name, args;
      if ((testDiscovery || testDesktop) && !discoveryDone) {
        discoveryDone = true;
        name = "GetDynamicTools";
        args = { namespace: "cursor", toolName: "Task" };
      } else if (!fs.existsSync(outputPath)) {
        if ((testDiscovery || testDesktop) && results.length === 1) {
          const discovered = JSON.parse(
            results[0].output.find(
              (p) => p.type === "input_text" && p.text.startsWith("{"),
            ).text,
          );
          assert.equal(discovered.tool, "Task");
          assert.ok(
            discovered.inputSchema.properties.subagent_type.enum.includes(
              "computerUse",
            ),
          );
        }
        assert.equal(
          results.length,
          testDiscovery || testDesktop ? 1 : 0,
          "Shell did not create its output file",
        );
        name = names.find((n) => /^(Shell|Bash|RunShell|Exec)$/i.test(n));
        assert.ok(name, "A shell tool must be available");
        args = {
          command: `printf '%s' '${marker}' > '${outputPath}' && cat '${outputPath}'`,
          block_until_ms: 10000,
          description: "Write and read the sandbox verification file",
        };
      } else if (
        !observations.some((o) =>
          o.results.some(
            (r) =>
              Array.isArray(r.output) &&
              r.output.some((p) => p.type === "input_image"),
          ),
        )
      ) {
        name = names.find((n) => /^Screenshot$/i.test(n));
        assert.ok(name, "Screenshot tool must be available");
        args = {};
      } else if (testMcp && mcpStep < 11) {
        mcpStep++;
        if (mcpStep === 1) {
          name = "GetDynamicTools";
          args = { namespace: "cursor", toolName: "AddMcpServer" };
        } else if (mcpStep === 2) {
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "AddMcpServer",
            arguments: {
              name: "fixture_stdio",
              command: "/exec-daemon/node",
              args: ["/opt/grokbot/tests/mcp-fixture.cjs"],
              env: { GROKBOT_MCP_TEST_VALUE: "configured-locally" },
            },
          };
        } else if (mcpStep === 3) {
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "AddMcpServer",
            arguments: {
              name: "fixture_http",
              url: `http://127.0.0.1:${server.address().port}/mcp`,
              headers: { Authorization: "Bearer fixture-mcp-token" },
            },
          };
        } else if (mcpStep === 4 || mcpStep === 6) {
          if (mcpStep === 6)
            assert.ok(
              JSON.stringify(results.at(-1).output).includes(
                `fixture-stdio:${marker}`,
              ),
              "Real stdio MCP tool must return its result",
            );
          name = "GetDynamicTools";
          args = {
            namespace: mcpStep === 4 ? "fixture_stdio" : "fixture_http",
            toolName: "echo",
          };
        } else if (mcpStep === 5 || mcpStep === 7) {
          const descriptor = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.equal(
            descriptor.tool,
            "echo",
            "The added server must be discoverable before calling it",
          );
          name = "CallDynamicTool";
          args = {
            namespace: mcpStep === 5 ? "fixture_stdio" : "fixture_http",
            toolName: "echo",
            arguments: { text: marker },
          };
        } else if (mcpStep === 8) {
          assert.ok(
            JSON.stringify(results.at(-1).output).includes(
              `fixture-http:${marker}`,
            ),
            "Real HTTP MCP tool must return its result",
          );
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "AddMcpServer",
            arguments: {
              name: "fixture_sse",
              url: `http://127.0.0.1:${server.address().port}/sse`,
              headers: { Authorization: "Bearer fixture-mcp-token" },
            },
          };
        } else if (mcpStep === 9) {
          name = "GetDynamicTools";
          args = { namespace: "fixture_sse", toolName: "echo" };
        } else if (mcpStep === 10) {
          const descriptor = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.equal(
            descriptor.tool,
            "echo",
            "The SSE server must be discoverable before calling it",
          );
          name = "CallDynamicTool";
          args = {
            namespace: "fixture_sse",
            toolName: "echo",
            arguments: { text: marker },
          };
        } else {
          assert.ok(
            JSON.stringify(results.at(-1).output).includes(
              `fixture-sse:${marker}`,
            ),
            "Real legacy SSE MCP tool must return its result",
          );
          name = "SendToUser";
          args = { type: "text", content: marker, end_turn: true };
        }
      } else if (testWebFetch && webFetchStep < 3) {
        webFetchStep++;
        if (webFetchStep === 1) {
          name = "GetDynamicTools";
          args = { namespace: "cursor", toolName: "WebFetch" };
        } else if (webFetchStep === 2) {
          const discovered = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.equal(discovered.tool, "WebFetch");
          assert.equal(discovered.inputSchema.properties.url.type, "string");
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "WebFetch",
            arguments: {
              url: `http://127.0.0.1:${server.address().port}/fetch-page`,
            },
          };
        } else {
          const output = JSON.stringify(results.at(-1).output);
          assert.match(output, /# WebFetch verification/);
          assert.ok(
            output.includes(marker),
            "Fetched page content must return to the model",
          );
          assert.ok(
            output.includes(`http://127.0.0.1:${server.address().port}/next`),
            "Relative links must resolve",
          );
          name = "SendToUser";
          args = { type: "text", content: marker, end_turn: true };
        }
      } else if (testWebSearch && webSearchStep < 3) {
        webSearchStep++;
        if (webSearchStep === 1) {
          name = "GetDynamicTools";
          args = { namespace: "cursor", toolName: "WebSearch" };
        } else if (webSearchStep === 2) {
          const discovered = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.equal(discovered.tool, "WebSearch");
          assert.equal(
            discovered.inputSchema.properties.search_term.type,
            "string",
          );
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "WebSearch",
            arguments: { search_term: "site:docs.searxng.org Search API" },
          };
        } else {
          const output = JSON.stringify(results.at(-1).output);
          assert.ok(
            output.includes("https://docs.searxng.org/dev/search_api.html"),
            "A real public search result URL must reach the model",
          );
          assert.match(output, /Search API/);
          name = "SendToUser";
          args = { type: "text", content: marker, end_turn: true };
        }
      } else if (testDesktop && !desktopLaunched) {
        desktopLaunched = true;
        name = "CallDynamicTool";
        args = {
          namespace: "cursor",
          toolName: "Task",
          arguments: {
            description: "Desktop fixture verification",
            subagent_type: "computerUse",
            prompt: `desktop-fixture-task: capture a screenshot, open http://127.0.0.1:${server.address().port}/fixture, click Verify local click, press F8, close the test tab and report desktop-fixture-complete. All actions are on this isolated local runtime verification fixture. Marker: ${marker}`,
            run_in_background: false,
          },
        };
      } else if (testLocalExec && localExecStep < 4) {
        localExecStep++;
        if (localExecStep === 1) {
          name = "GetDynamicTools";
          args = { namespace: "cursor", toolName: "ListMachines" };
        } else if (localExecStep === 2) {
          name = "CallDynamicTool";
          args = {
            namespace: "cursor",
            toolName: "ListMachines",
            arguments: {},
          };
        } else if (localExecStep === 3) {
          const body = JSON.parse(
            results
              .at(-1)
              .output.find(
                (p) => p.type === "input_text" && p.text.startsWith("{"),
              ).text,
          );
          assert.ok(
            body.machines.some(
              (m) => m.machineId === "fixture-computer" && m.connected,
            ),
            "The real local bridge must advertise the connected fixture computer",
          );
          name = "Read";
          args = { path: outputPath, machineId: "fixture-computer" };
        } else {
          assert.match(
            JSON.stringify(results.at(-1).output),
            /Local tools are turned off/,
            "The local permission gate must reject the read",
          );
          assert.equal(
            providerDispatches,
            0,
            "Rejected local reads must never reach the device",
          );
          name = "SendToUser";
          args = { type: "text", content: marker, end_turn: true };
        }
      } else {
        name = names.find((n) => /^Send(ToUser|Message)$/i.test(n));
        assert.ok(name, "User-message tool must be available");
        args = { type: "text", content: marker, end_turn: true };
      }
      const id = `fixture-${requests}`;
      const call = {
        type: "function_call",
        id: `item-${id}`,
        call_id: `call-${id}`,
        name,
        arguments: JSON.stringify(args),
        status: "completed",
      };
      res.writeHead(200, { "content-type": "text/event-stream" });
      const emit = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
      emit({ type: "response.created", response: { id } });
      emit({
        type: "response.output_item.added",
        item: { ...call, arguments: "" },
      });
      emit({
        type: "response.function_call_arguments.delta",
        item_id: call.id,
        delta: call.arguments,
      });
      emit({ type: "response.output_item.done", item: call });
      emit({
        type: "response.completed",
        response: {
          id,
          model: "local-fixture",
          status: "completed",
          output: [call],
          usage: { input_tokens: 100, output_tokens: 20, total_tokens: 120 },
        },
      });
      res.end("data: [DONE]\n\n");
    } catch (error) {
      fixtureFailure ??= error;
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { code: "fixture_failure" } }));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const reservation = http.createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const logfile = join(temp, "host.log");
  const log = fs.openSync(logfile, "w", 0o600);
  const startHost = () =>
    spawn(process.execPath, [hostEntry], {
      stdio: ["ignore", log, log],
      env: {
        ...process.env,
        GROKBOT_LOCAL_MODE: "1",
        GROKBOT_MODEL: "local-fixture",
        LITELLM_API_KEY: "fixture-only",
        GROKBOT_RESPONSES_BASE_URL: `http://127.0.0.1:${server.address().port}/v1`,
        SAND_PACKAGED: "1",
        SAND_HOST_IN_BOX: "1",
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
    });
  let host = startHost();
  const base = `http://127.0.0.1:${port}`;
  const call = async (method, args = {}) => {
    const r = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    const b = await r.json();
    assert.equal(r.status, 200, JSON.stringify(b));
    return b;
  };
  let agentId;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (host.exitCode !== null)
        throw Error("Isolated host exited during startup");
      try {
        ready = (await fetch(base + "/health")).ok;
        if (ready) break;
      } catch {}
      await delay(200);
    }
    assert.ok(ready, "Isolated host must become ready");
    if (testLocalExec) {
      await call("setHostSettings", {
        localToolPermission: "never",
        localToolPermissionMachineId: "fixture-computer",
      });
      const stream = await fetch(base + "/local-exec/requests", {
        headers: { authorization: `Bearer ${token}` },
        signal: providerController.signal,
      });
      assert.equal(stream.status, 200);
      const frames = readSSE(stream.body);
      const { value: welcome } = await frames.next();
      assert.equal(welcome.kind, "welcome");
      const posted = await fetch(base + "/local-exec/responses", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          providerId: welcome.providerId,
          frames: [
            {
              kind: "hello",
              localRoot: temp,
              terminalsFolder: join(temp, "terminals"),
              computerId: "fixture-computer",
              label: "Integration fixture",
            },
          ],
        }),
      });
      assert.equal(posted.status, 200);
      providerLoop = (async () => {
        for await (const frame of frames)
          if (
            ["exec", "download", "upload", "messages-op"].includes(frame.kind)
          )
            providerDispatches++;
      })().catch((error) => {
        if (!providerController.signal.aborted) fixtureFailure ??= error;
      });
    }
    const { agent } = await call("createAgent", {
      name: "Sandbox integration fixture",
      description: "Local runtime verification",
      isIntroductionSuppressed: true,
      isKickstartRequested: false,
    });
    agentId = agent.id;
    await call("sendPrompt", {
      agentId: agent.id,
      prompt: `Local integration fixture: write ${marker} to the temporary file ${outputPath}, read it back using the sandbox shell, capture a screenshot, ${testWebFetch ? `use WebFetch to read http://127.0.0.1:${server.address().port}/fetch-page, ` : ""}${testWebSearch ? "use WebSearch to find the public SearXNG Search API documentation, " : ""}${testDesktop ? "run the desktop-fixture-task computerUse subagent to click Verify local click and press F8 on the local runtime verification fixture, " : ""}${testMcp ? `I confirm adding fixture_stdio (/exec-daemon/node /opt/grokbot/tests/mcp-fixture.cjs with GROKBOT_MCP_TEST_VALUE=configured-locally) and fixture_http (http://127.0.0.1:${server.address().port}/mcp with Authorization Bearer fixture-mcp-token) and fixture_sse (http://127.0.0.1:${server.address().port}/sse with the same fixture header) to this isolated test host. Invoke each echo tool with ${marker}. These are controlled local test servers and may execute their fixture code. ` : ""}and report the marker.`,
      clientNonce: randomUUID(),
    });
    let transcript;
    for (let i = 0; i < 180; i++) {
      if (fixtureFailure) throw fixtureFailure;
      const trays = await call("getTrays");
      const errors = (Array.isArray(trays) ? trays : trays.trays || []).filter(
        (t) => t.kind === "error",
      );
      assert.equal(errors.length, 0, JSON.stringify(errors));
      transcript = await call("getAgentTranscript", { id: agent.id });
      if (
        memoryRequests > 0 &&
        (!testDesktop || desktopFinished) &&
        transcript.some(
          (m) =>
            m.kind === "send-message" &&
            m.message.type === "text" &&
            m.message.content === marker,
        )
      )
        break;
      await delay(500);
    }
    assert.equal(
      await fsp.readFile(outputPath, "utf8"),
      marker,
      "Shell must create the actual file",
    );
    assert.ok(
      observations.some((o) =>
        o.results.some((r) => JSON.stringify(r.output).includes(marker)),
      ),
      "Shell stdout must return to the model",
    );
    assert.ok(
      observations.some((o) =>
        o.results.some(
          (r) =>
            Array.isArray(r.output) &&
            r.output.some((p) => p.type === "input_image"),
        ),
      ),
      "Screenshot bytes must return to the model",
    );
    assert.ok(
      transcript.some(
        (m) =>
          m.kind === "send-message" &&
          m.message.type === "text" &&
          m.message.content === marker,
      ),
      "SendToUser must persist its message",
    );
    assert.ok(
      classifierRequests > 0,
      "The original Auto-review gate must run through the local API",
    );
    assert.ok(
      memoryRequests > 0,
      "Post-turn memory extraction must run through the local API",
    );
    if (testDesktop) {
      assert.ok(
        desktopFinished,
        "The original computerUse subagent must complete its task",
      );
      assert.ok(
        browserClicked && desktopKeyPressed,
        "Browser and desktop mutations must execute in the isolated fixture",
      );
    }
    if (testWebFetch) {
      assert.equal(webFetchStep, 3);
      assert.equal(
        webFetchRequests,
        1,
        "The host must really fetch the approved page once",
      );
    }
    if (testMcp) {
      assert.equal(mcpStep, 11);
      assert.equal(mcpHttpCalls, 1);
      assert.equal(mcpSseCalls, 1);
      const state = await call("getMcpState");
      assert.equal(state.servers.length, 3);
      assert.ok(
        state.servers.every(
          (s) => s.status === "connected" && s.toolCount === 1,
        ),
        "All original manager rows must be connected",
      );
      const stored = JSON.parse(
        await fsp.readFile(join(temp, "data/mcp-servers.json"), "utf8"),
      );
      assert.equal(Object.keys(stored.mcpServers).length, 3);
      assert.equal(
        (await fsp.stat(join(temp, "data/mcp-servers.json"))).mode & 0o777,
        0o600,
      );
      assert.deepEqual(
        await call("getMcpCatalog"),
        [],
        "Local custom MCP use must not fetch the vendor marketplace",
      );
      const stdio = state.servers.find(
        (s) => s.serverIdentifier === "fixture_stdio",
      );
      const instructions =
        "Use this server only for the local integration fixture.";
      await call("setMcpCustomInstructions", {
        serverId: stdio.id,
        instructions,
      });
      const disabled = await call("toggleMcpToolDisabled", {
        serverId: stdio.id,
        toolName: "echo",
      });
      assert.equal(disabled.find((t) => t.name === "echo").isDisabled, true);
      const disabledState = await call("getMcpState");
      assert.equal(
        disabledState.servers.find((s) => s.id === stdio.id).toolCount,
        0,
      );
      for (let i = 0; i < 40; i++) {
        if (!(await (await fetch(base + "/health")).json()).isBusy) break;
        await delay(250);
      }
      assert.equal(
        (await (await fetch(base + "/health")).json()).isBusy,
        false,
        "Finish the turn before restarting",
      );
      const stopped = new Promise((resolve) => host.once("exit", resolve));
      host.kill("SIGTERM");
      await Promise.race([stopped, delay(5000)]);
      if (host.exitCode === null) host.kill("SIGKILL");
      await stopped;
      host = startHost();
      let restarted = false;
      for (let i = 0; i < 100; i++) {
        try {
          if ((await fetch(base + "/health")).ok) {
            restarted = true;
            break;
          }
        } catch {}
        await delay(200);
      }
      assert.ok(
        restarted,
        "The isolated host must restart from persisted state",
      );
      const restored = await call("getMcpState");
      assert.deepEqual(
        restored.servers.map((s) => s.id).sort(),
        state.servers.map((s) => s.id).sort(),
      );
      const restoredStdio = restored.servers.find((s) => s.id === stdio.id);
      assert.equal(restoredStdio.customInstructions, instructions);
      assert.equal(restoredStdio.disabledToolCount, 1);
      const enabled = await call("toggleMcpToolDisabled", {
        serverId: stdio.id,
        toolName: "echo",
      });
      assert.equal(enabled.find((t) => t.name === "echo").isDisabled, false);
      for (const row of restored.servers)
        assert.equal(
          (await call("removeMcpServer", { serverId: row.id })).removed,
          true,
        );
      assert.deepEqual((await call("getMcpState")).servers, []);
      console.log(
        "PASS MCP configuration, tool toggles and instructions survive host restart; server removal clears all rows.",
      );
    }
    if (testLocalExec)
      assert.equal(
        localExecStep,
        4,
        "Device discovery and permission rejection must complete",
      );
    if (testWebSearch) {
      assert.equal(
        webSearchStep,
        3,
        "WebSearch discovery, public search and result return must finish",
      );
      console.log(
        "PASS original Agent dynamically discovers WebSearch and receives real public SearXNG search results.",
      );
    }
    console.log(
      "PASS isolated original Agent → Responses fixture → real Sandbox shell/screenshot → transcript.",
    );
  } catch (error) {
    console.error("Diagnostic directory:", temp);
    console.error((await fsp.readFile(logfile, "utf8")).slice(-7000));
    throw error;
  } finally {
    providerController.abort();
    await providerLoop;
    if (testMcp) {
      const state = await call("getMcpState").catch(() => ({ servers: [] }));
      for (const server of state.servers)
        await call("removeMcpServer", { serverId: server.id }).catch(() => {});
    }
    if (agentId) await call("deleteAgents", { ids: [agentId] }).catch(() => {});
    host.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => host.once("exit", resolve)),
      delay(5000),
    ]);
    if (host.exitCode === null) host.kill("SIGKILL");
    fs.closeSync(log);
    server.closeAllConnections();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
