/* Run inside the Box. Three original agents use real MCP transports against a
 * deterministic model fixture: two inline scopes and one workspace scope.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const { join } = require("node:path");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");
const { respond } = require("./mcp-inline-fixture.cjs");

(async () => {
  const temp = await fsp.mkdtemp("/tmp/grokbot-inline-mcp-");
  await fsp.chmod(temp, 0o777);
  const data = join(temp, "data");
  await fsp.mkdir(data);
  const token = randomUUID(),
    runId = randomUUID();
  const cases = ["alpha", "beta", "workspace"].map((identity) => ({
    identity,
    marker: `inline-${identity}-${runId}`,
    step: 0,
    done: false,
  }));
  const sessions = new Map(),
    calls = [],
    agents = [];
  let fixtureFailure,
    reviews = 0,
    memoryRequests = 0;
  let resolveArrivals;
  const arrivals = new Promise((resolve) => (resolveArrivals = resolve));
  const arriving = new Set();
  const body = async (req) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return JSON.parse(Buffer.concat(chunks));
  };
  const emit = (res, output) => {
    const id = randomUUID();
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.end(
      `data: ${JSON.stringify({ type: "response.completed", response: { id, status: "completed", output } })}\n\n`,
    );
  };
  const tool = (name, args) => ({
    type: "function_call",
    id: randomUUID(),
    call_id: randomUUID(),
    name,
    arguments: JSON.stringify(args),
    status: "completed",
  });
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://fixture");
      if (
        url.pathname.startsWith("/mcp/") ||
        url.pathname.startsWith("/sse/") ||
        url.pathname.startsWith("/sse-post/")
      ) {
        const identity = url.pathname.split("/")[2];
        assert.ok(cases.some((c) => c.identity === identity));
        assert.equal(
          req.headers.authorization,
          `Bearer fixture-${identity}`,
          "A connection must use only its own credentials",
        );
        if (url.pathname.startsWith("/sse/") && req.method === "GET") {
          const id = randomUUID();
          sessions.set(id, { identity, res });
          res.on("close", () => sessions.delete(id));
          res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
          });
          res.write(
            `event: endpoint\ndata: /sse-post/${identity}?id=${id}\n\n`,
          );
          return;
        }
        if (url.pathname.startsWith("/sse/") || req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        const message = await body(req);
        if (message.method === "initialize") await delay(150);
        if (message.method === "tools/call") {
          assert.equal(
            message.params.arguments.text,
            cases.find((c) => c.identity === identity).marker,
          );
          const kind = url.pathname.startsWith("/mcp/") ? "http" : "sse";
          calls.push({ identity, kind });
          if (kind === "http") {
            arriving.add(identity);
            console.log('HTTP MCP arrival:', identity);
            if (arriving.has('alpha') && arriving.has('beta')) resolveArrivals();
            if (identity !== 'workspace') await Promise.race([
              arrivals,
              delay(20000).then(() => {
                throw Error("Agents did not overlap at the HTTP MCP barrier");
              }),
            ]);
          }
        }
        const result = respond(message, identity);
        if (url.pathname.startsWith("/sse-post/")) {
          const session = sessions.get(url.searchParams.get("id"));
          assert.equal(session?.identity, identity);
          if (result)
            session.res.write(
              `event: message\ndata: ${JSON.stringify(result)}\n\n`,
            );
          res.writeHead(202);
          res.end();
          return;
        }
        res.writeHead(result ? 200 : 202, {
          "content-type": "application/json",
        });
        res.end(result ? JSON.stringify(result) : undefined);
        return;
      }
      assert.equal(req.url, "/v1/responses");
      const input = await body(req),
        names = input.tools.map((t) => t.name);
      if (!names.length) {
        memoryRequests++;
        emit(res, [
          {
            type: "message",
            id: randomUUID(),
            role: "assistant",
            content: [{ type: "output_text", text: "NONE" }],
          },
        ]);
        return;
      }
      if (names.includes("classify_auto_review_action")) {
        const context = JSON.parse(
          input.input.find((x) => x.role === "user").content[0].text,
        );
        assert.ok(
          cases.some((c) =>
            JSON.stringify(context.trusted_user_instructions).includes(
              c.marker,
            ),
          ),
        );
        assert.match(
          JSON.stringify(context.proposed_tool_call),
          /shared|pipes|events/,
        );
        reviews++;
        emit(res, [
          tool("classify_auto_review_action", {
            decision: "ALLOW",
            reason: "Only the requested local MCP fixture echo.",
            blocked_effect: "none",
            outbound_authorization: "not_outbound",
          }),
        ]);
        return;
      }
      const c = cases.find((c) =>
        JSON.stringify(input.input).includes(c.marker),
      );
      assert.ok(c, "Identify the original agent turn");
      const result = input.input
        .filter((x) => x.type === "function_call_output")
        .at(-1);
      console.log('Model step:', c.identity, c.step);
      const providers =
        c.identity === "workspace" ? ["shared"] : ["shared", "pipes", "events"];
      const index = Math.floor(c.step / 2);
      if (c.step > 0 && c.step % 2 === 0) {
        const output = JSON.stringify(result?.output);
        assert.ok(
          output.includes(c.identity) && output.includes(c.marker),
          "MCP result must return to its own agent",
        );
        assert.ok(
          !output.includes("gbl_"),
          "Internal registration names must not reach the model",
        );
      }
      if (index === providers.length) {
        c.done = true;
        emit(res, [
          tool("SendToUser", {
            type: "text",
            content: c.marker,
            end_turn: true,
          }),
        ]);
        return;
      }
      const namespace = providers[index];
      let next;
      if (c.step % 2 === 0)
        next = tool("GetDynamicTools", { namespace, toolName: "echo" });
      else {
        const output = JSON.stringify(result?.output);
        assert.ok(output.includes("echo"), "Inline tool must be discoverable");
        assert.ok(output.includes(`Echo from ${c.identity}`), "Discovery must use this task's configuration");
        next = tool("CallDynamicTool", {
          namespace,
          toolName: "echo",
          arguments: { text: c.marker },
        });
      }
      c.step++;
      emit(res, [next]);
    } catch (error) {
      fixtureFailure ??= error;
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const fixtureUrl = `http://127.0.0.1:${server.address().port}`;
  const httpConfig = (identity) => ({
    url: `${fixtureUrl}/mcp/${identity}`,
    headers: { Authorization: `Bearer fixture-${identity}` },
  });
  const stored = {
    version: 1,
    nextServerId: 2,
    serverIdsByName: { shared: "1" },
    mcpServers: { shared: httpConfig("workspace") },
  };
  const storePath = join(data, "mcp-servers.json"),
    originalStore = JSON.stringify(stored);
  await fsp.writeFile(storePath, originalStore, { mode: 0o600 });
  const reservation = http.createServer();
  await new Promise((r) => reservation.listen(0, "127.0.0.1", r));
  const port = reservation.address().port;
  await new Promise((r) => reservation.close(r));
  const logfile = join(temp, "host.log"),
    log = fs.openSync(logfile, "w", 0o600);
  const host = spawn(
    process.execPath,
    [join(process.env.GROKBOT_ROOT || "/home/box", "sand-host/host-main.cjs")],
    {
      stdio: ["ignore", log, log],
      env: {
        ...process.env,
        GROKBOT_LOCAL_MODE: "1",
        GROKBOT_MODEL: "local-fixture",
        LITELLM_API_KEY: "fixture-only",
        GROKBOT_RESPONSES_BASE_URL: `${fixtureUrl}/v1`,
        SAND_PACKAGED: "1",
        SAND_HOST_IN_BOX: "1",
        SAND_DATA_ROOT: data,
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
    const r = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(r.status, 200, method);
    return r.json();
  };
  const waitFor = async (predicate, label, timeout = 60000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      if (fixtureFailure) throw fixtureFailure;
      assert.equal(host.exitCode, null, "Host exited");
      if (await predicate()) return;
      await delay(200);
    }
    throw Error(`Timed out: ${label}`);
  };
  try {
    await waitFor(
      async () => {
        try {
          return (await fetch(`${base}/health`)).ok;
        } catch {
          return false;
        }
      },
      "host startup",
      20000,
    );
    assert.equal((await call("getMcpState")).servers.length, 1);
    for (const c of cases) {
      const { agent } = await call("createAgent", {
        name: `Inline MCP ${c.identity}`,
        description: "Temporary concurrent MCP scope verification",
        isIntroductionSuppressed: true,
        isKickstartRequested: false,
      });
      c.agentId = agent.id;
      agents.push(agent.id);
    }
    await Promise.all(
      cases.map((c) =>
        call("sendPrompt", {
          agentId: c.agentId,
          clientNonce: randomUUID(),
          prompt: `Authorized local integration test ${c.marker}. Use the provided local MCP echo tools with exactly ${c.marker}, then SendToUser exactly that marker. Only these controlled local fixture servers are authorized.`,
          ...(c.identity === "workspace"
            ? {}
            : {
                mcpConfigJson: JSON.stringify({
                  mcpServers: {
                    shared: httpConfig(c.identity),
                    pipes: {
                      command: "/exec-daemon/node",
                      args: ["/opt/grokbot/tests/mcp-inline-fixture.cjs"],
                      env: {
                        GROKBOT_MCP_IDENTITY: c.identity,
                        GROKBOT_MCP_PID_FILE: join(temp, `${c.identity}.pids`),
                      },
                    },
                    events: {
                      url: `${fixtureUrl}/sse/${c.identity}`,
                      headers: {
                        Authorization: `Bearer fixture-${c.identity}`,
                      },
                    },
                  },
                }),
              }),
        }),
      ),
    );
    await waitFor(
      async () => {
        const trays = await call("getTrays");
        assert.deepEqual(
          (Array.isArray(trays) ? trays : trays.trays || []).filter(
            (t) => t.kind === "error",
          ),
          [],
        );
        const transcripts = await Promise.all(
          cases.map((c) => call("getAgentTranscript", { id: c.agentId })),
        );
        return (
          transcripts.every((t, i) =>
            t.some(
              (m) =>
                m.kind === "send-message" &&
                m.message?.content === cases[i].marker,
            ),
          ) && !(await fetch(`${base}/health`).then((r) => r.json())).isBusy
        );
      },
      "all three agent replies and scope cleanup",
      120000,
    );
    assert.ok(cases.every((c) => c.done));
    assert.equal(arriving.size, 3);
    assert.ok(reviews >= 7);
    assert.ok(memoryRequests > 0);
    assert.deepEqual(calls.map((c) => `${c.identity}:${c.kind}`).sort(), [
      "alpha:http",
      "alpha:sse",
      "beta:http",
      "beta:sse",
      "workspace:http",
    ]);
    assert.equal(
      await fsp.readFile(storePath, "utf8"),
      originalStore,
      "Inline configurations must not change workspace storage",
    );
    assert.deepEqual(
      (await call("getMcpState")).servers.map((s) => s.serverIdentifier),
      ["shared"],
    );
    await waitFor(
      async () => sessions.size === 0,
      "temporary SSE connections to close",
      10000,
    );
    for (const c of cases.filter((c) => c.identity !== "workspace")) {
      const pids = (
        await fsp.readFile(join(temp, `${c.identity}.pids`), "utf8")
      )
        .trim()
        .split("\n")
        .map(Number);
      assert.equal(
        pids.length,
        1,
        "A scoped stdio client must be reused within its turn",
      );
      await waitFor(
        async () =>
          pids.every((pid) => {
            try {
              process.kill(pid, 0);
              return false;
            } catch {
              return true;
            }
          }),
        "temporary stdio process exit",
        10000,
      );
    }
    console.log(
      "PASS concurrent original agents: separate inline credentials, HTTP/stdio/SSE, Auto-review, unchanged workspace configuration, hidden internal names and closed temporary clients.",
    );
  } finally {
    for (const id of agents)
      await call("deleteAgents", { ids: [id] }).catch(() => {});
    await call("removeMcpServer", { serverId: "1" }).catch(() => {});
    host.kill("SIGTERM");
    await Promise.race([new Promise((r) => host.once("exit", r)), delay(5000)]);
    if (host.exitCode === null) host.kill("SIGKILL");
    for (const { res } of sessions.values()) res.end();
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
    fs.closeSync(log);
    console.log("Inline MCP diagnostics:", temp);
  }
})().catch((error) => {
  console.error(error.stack);
  process.exitCode = 1;
});
