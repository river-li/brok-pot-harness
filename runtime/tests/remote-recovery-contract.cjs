"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const sourcePath = path.join(__dirname, "../../src/host/extensions/transcript/sand-upgrade-resume-store.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const storeSource = source.slice(source.indexOf("function parseInterruptedUserTurnFile(raw) {"));

function makeStore(root, writer = atomicWrite) {
  const context = {
    import_node_fs95: fs,
    import_node_path154: path,
    SAND_INTERRUPTED_USER_TURNS_FILE_NAME: "host-interrupted-user-turns.json",
    isUnknownRecord: (value) => typeof value === "object" && value !== null && !Array.isArray(value),
    reportFallbackUnlessAbsent: () => {},
    writeFileAtomicSync: writer,
  };
  vm.runInNewContext(storeSource + "\nglobalThis.InterruptedTurnStore = SandInterruptedUserTurnStore;", context);
  return new context.InterruptedTurnStore(root);
}

function atomicWrite(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = file + ".contract.tmp";
  fs.writeFileSync(temporary, content, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

test("interrupted-turn store preserves the accepted ID and acknowledgement state across restart", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-interrupted-turn-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = makeStore(root);

  store.recordAccepted("bot-a", "user-1", 1700000000123);
  store.recordRunning("bot-a", "user-1", 1700000000999);
  store.markVisibleAck("bot-a", ["user-1"]);
  const restarted = makeStore(root);
  const interrupted = restarted.markRunningInterrupted();

  assert.deepEqual(JSON.parse(JSON.stringify(interrupted)), [{
    agentId: "bot-a",
    userMessageId: "user-1",
    acceptedAtMs: 1700000000123,
    startedAtMs: interrupted[0].startedAtMs,
    state: "interrupted",
    visibleAck: true,
    interruptedAtMs: interrupted[0].interruptedAtMs,
  }]);
  assert.equal(restarted.find("bot-a", "user-1").acceptedAtMs, 1700000000123);
  assert.equal(restarted.find("bot-b", "user-1"), null);
});

test("unresolved records are retained without a fixed-count eviction", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-interrupted-turn-count-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = makeStore(root);
  for (let index = 0; index < 300; index += 1) {
    store.recordAccepted("bot-a", "user-" + index, index + 1);
  }

  const restarted = makeStore(root);
  assert.equal(restarted.listPending().length, 300);
  assert.equal(restarted.find("bot-a", "user-0").acceptedAtMs, 1);
  assert.equal(restarted.find("bot-a", "user-299").acceptedAtMs, 300);
});

test("explicit stop retires only the selected Bot turn IDs before runner interruption", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-interrupted-turn-stop-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = makeStore(root);
  store.recordAccepted("bot-a", "active-turn", 1);
  store.recordRunning("bot-a", "active-turn", 2);
  store.recordAccepted("bot-a", "other-pending-turn", 3);
  store.recordAccepted("bot-b", "another-bot-turn", 4);

  store.clearAgent("bot-a", ["active-turn"]);

  assert.equal(store.find("bot-a", "active-turn"), null);
  assert.ok(store.find("bot-a", "other-pending-turn"));
  assert.ok(store.find("bot-b", "another-bot-turn"));
  assert.equal(store.listInterrupted().length, 0,
    "accepted and running records stay unpublished until the explicit boot transition");
});

test("journal write failures propagate to the caller", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-interrupted-turn-write-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = makeStore(root, () => { throw new Error("fixture journal write failure"); });

  assert.throws(() => store.recordAccepted("bot-a", "user-1", 1), /fixture journal write failure/);
});
