const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const { join } = require("node:path");
const { createLocalMcpStore } = require("../../dist/local/mcp-store.js");
const validation = {
  parseConfig: (value) => ({ mcpServers: value.mcpServers }),
  validateName: (name) => {
    assert.ok(!["__proto__", "constructor", "prototype"].includes(name));
    return name;
  },
};
test("local MCP identities and secrets persist without a vendor account", async (t) => {
  const root = fs.mkdtempSync(join(os.tmpdir(), "grokbot-mcp-store-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = createLocalMcpStore(root, validation);
  await Promise.all([
    store.addServers({
      one: {
        command: "node",
        args: ["server.js"],
        env: { TOKEN: "fixture-secret" },
      },
    }),
    store.addServers({
      two: {
        url: "http://127.0.0.1/mcp",
        headers: { Authorization: "Bearer fixture" },
      },
    }),
  ]);
  const before = await store.getConfigForEdit();
  assert.deepEqual(Object.keys(before.config.mcpServers), ["one", "two"]);
  assert.notEqual(before.serverIdsByName.one, before.serverIdsByName.two);
  assert.equal(fs.statSync(store.file).mode & 0o777, 0o600);
  const fresh = createLocalMcpStore(root, validation);
  assert.deepEqual(await fresh.getConfigForEdit(), before);
  await fresh.setConfig(
    { mcpServers: { two: before.config.mcpServers.two } },
    { two: before.serverIdsByName.two },
  );
  await fresh.addServers({ three: { command: "python3" } });
  const after = await fresh.getConfigForEdit();
  assert.equal(after.serverIdsByName.two, before.serverIdsByName.two);
  assert.ok(after.serverIdsByName.three > before.serverIdsByName.two);
  const display = await fresh.listServers();
  assert.equal(display.servers[0].hasStaticCredentialHeaders, true);
  assert.equal(display.servers[0].isTeamServer, false);
  await Promise.all([
    fresh.removeServer(after.serverIdsByName.two.toString()),
    fresh.addServers({ four: { command: "node" } }),
  ]);
  assert.deepEqual(
    Object.keys((await fresh.getConfigForEdit()).config.mcpServers),
    ["three", "four"],
  );
  fs.writeFileSync(store.file, "{ broken");
  await assert.rejects(fresh.listServers(), /JSON format/);
});
