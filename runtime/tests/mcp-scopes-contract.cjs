const assert = require("node:assert/strict");
const test = require("node:test");
const { createScopedBoxMcpExec } = require("../../dist/local/mcp-scopes.js");
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
};
const config = (credential) =>
  JSON.stringify({
    mcpServers: {
      shared: { url: "http://fixture", headers: { authorization: credential } },
    },
  });
function fixture() {
  const clients = new Map(),
    closed = [],
    calls = [];
  let beforeLoad = async () => {};
  const raw = {
    async loadServers(json) {
      await beforeLoad();
      const desired = JSON.parse(json).mcpServers;
      for (const [name, client] of clients)
        if (
          !Object.hasOwn(desired, name) ||
          JSON.stringify(desired[name]) !== JSON.stringify(client.config)
        ) {
          closed.push(client);
          clients.delete(name);
        }
      for (const [name, config] of Object.entries(desired))
        if (!clients.has(name)) clients.set(name, { config });
    },
    async listTools(names) {
      return [...clients]
        .filter(([name]) => !names.length || names.includes(name))
        .map(([name]) => ({
          serverIdentifier: name,
          tools: [
            {
              name: `${name}-echo`,
              toolName: "echo",
              providerIdentifier: name,
            },
          ],
        }));
    },
    async executeTool(ctx, args, options) {
      calls.push({ args, options });
      const client = clients.get(args.providerIdentifier);
      assert.ok(client);
      return { client, credential: client.config.headers.authorization };
    },
  };
  const port = createScopedBoxMcpExec(raw, {
    parseConfig(v) {
      assert.ok(
        v && typeof v.mcpServers === "object" && !Array.isArray(v.mcpServers),
      );
      return v;
    },
    validateName(name) {
      assert.ok(!["__proto__", "constructor", "prototype"].includes(name));
      return name.trim();
    },
  });
  const args = {
    name: "shared-echo",
    toolName: "echo",
    providerIdentifier: "shared",
  };
  return {
    port,
    clients,
    closed,
    calls,
    args,
    setBeforeLoad(fn) {
      beforeLoad = fn;
    },
  };
}
test("Concurrent same-name clients keep credentials and sessions separate from the workspace", async () => {
  const f = fixture();
  await f.port.loadServers(config("workspace"));
  const workspace = (await f.port.executeTool({}, f.args)).client;
  const alphaReady = deferred(),
    betaReady = deferred(),
    release = deferred();
  const turn = (credential, ready, other) =>
    f.port.withConfigScope(config(credential), async () => {
      const tools = await f.port.listInlineTools([], config(credential));
      assert.equal(tools[0].serverIdentifier, "shared");
      assert.equal(tools[0].tools[0].name, "shared-echo");
      const first = await f.port.executeInlineTool(
        {},
        f.args,
        config(credential),
      );
      ready.resolve();
      await other.promise;
      await release.promise;
      const second = await f.port.executeInlineTool(
        {},
        f.args,
        config(credential),
      );
      assert.equal(first.client, second.client);
      assert.equal(second.credential, credential);
      return first.client;
    });
  const a = turn("alpha", alphaReady, betaReady),
    b = turn("beta", betaReady, alphaReady);
  await Promise.all([alphaReady.promise, betaReady.promise]);
  assert.deepEqual(
    (await f.port.listTools([])).map((x) => x.serverIdentifier),
    ["shared"],
  );
  const hidden = [...f.clients.keys()].find((name) => name !== "shared");
  await assert.rejects(
    f.port.executeTool({}, { ...f.args, providerIdentifier: hidden }),
    /not configured/,
  );
  assert.equal(
    (await f.port.executeTool({}, f.args, { agentId: "fork" })).client,
    workspace,
  );
  assert.deepEqual(
    JSON.parse(f.calls.at(-1).options.configJson),
    JSON.parse(config("workspace")),
  );
  release.resolve();
  const [ac, bc] = await Promise.all([a, b]);
  assert.notEqual(ac, bc);
  assert.equal(f.clients.size, 1);
  assert.ok(f.closed.includes(ac) && f.closed.includes(bc));
  assert.equal(f.clients.get("shared"), workspace);
});
test("Identical configurations get fresh sessions; exceptions and late work release their scope", async () => {
  const f = fixture();
  let late, first;
  const json = config("same");
  await assert.rejects(
    f.port.withConfigScope(json, async () => {
      first = (await f.port.executeInlineTool({}, f.args, json)).client;
      const gate = deferred();
      late = {
        gate,
        promise: gate.promise.then(() =>
          f.port.executeInlineTool({}, f.args, json),
        ),
      };
      throw new Error("turn interrupted");
    }),
    /turn interrupted/,
  );
  late.gate.resolve();
  await assert.rejects(late.promise, /no active task scope/);
  assert.equal(f.clients.size, 0);
  await f.port.withConfigScope(json, async () => {
    const second = (await f.port.executeInlineTool({}, f.args, json)).client;
    assert.notEqual(first, second);
    await f.port.withConfigScope(undefined, () =>
      assert.rejects(
        f.port.executeInlineTool({}, f.args, json),
        /no active task scope/,
      ),
    );
  });
  assert.equal(f.clients.size, 0);
});
test("Failed pushes recover and delayed discovery cannot resurrect a finished scope", async () => {
  const f = fixture();
  let fail = true;
  f.setBeforeLoad(async () => {
    if (fail) {
      fail = false;
      throw Error("load failed");
    }
  });
  await assert.rejects(
    f.port.withConfigScope(config("one"), () =>
      f.port.listInlineTools([], config("one")),
    ),
    /load failed/,
  );
  assert.equal(f.clients.size, 0);
  const start = deferred(),
    release = deferred();
  let pending;
  f.setBeforeLoad(async () => {
    start.resolve();
    await release.promise;
  });
  const turn = f.port.withConfigScope(config("two"), async () => {
    pending = f.port.listInlineTools([], config("two"));
    pending.catch(() => {});
    await start.promise;
  });
  await start.promise;
  release.resolve();
  await turn;
  await assert.rejects(pending, /no active task scope/);
  assert.equal(f.clients.size, 0);
});
test("Validation and empty overrides never fall back to workspace credentials", async () => {
  const f = fixture();
  await f.port.loadServers(config("workspace"));
  await assert.rejects(
    f.port.withConfigScope("credential-secret", async () => {}),
    (error) => !error.message.includes("credential-secret"),
  );
  const empty = JSON.stringify({ mcpServers: {} });
  await f.port.withConfigScope(empty, async () => {
    assert.deepEqual(await f.port.listInlineTools([], empty), []);
    await assert.rejects(
      f.port.executeInlineTool({}, f.args, empty),
      /not configured for this task/,
    );
    assert.equal(f.port.currentTransport("shared"), "unknown");
  });
  await f.port.dispose();
  await assert.rejects(f.port.loadServers(empty), /closed/);
});
