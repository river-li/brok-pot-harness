const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const { join } = require("node:path");
const {
  importLocalPlugin,
  listLocalPluginPointers,
  pluginBundlePath,
} = require("../../dist/local/plugin-files.js");

function fixture(t) {
  const root = fs.mkdtempSync(join(os.tmpdir(), "grokbot-plugin-import-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = join(root, "source"),
    data = join(root, "data");
  fs.mkdirSync(source);
  return { root, source, data };
}
test("copied bundles remain usable without the source and retain pinned versions", (t) => {
  const { source, data } = fixture(t);
  fs.mkdirSync(join(source, "skills/proof"), { recursive: true });
  fs.writeFileSync(join(source, "skills/proof/SKILL.md"), "first version");
  fs.writeFileSync(join(source, "helper.sh"), "#!/bin/sh\nprintf copied", {
    mode: 0o755,
  });
  fs.symlinkSync("helper.sh", join(source, "alias.sh"));
  const first = importLocalPlugin(data, source, "proof");
  assert.equal(
    fs.lstatSync(join(first.path, "alias.sh")).isSymbolicLink(),
    false,
  );
  assert.equal(fs.statSync(join(first.path, "alias.sh")).mode & 0o777, 0o755);
  assert.equal(importLocalPlugin(data, source, "proof").digest, first.digest);
  fs.writeFileSync(join(source, "skills/proof/SKILL.md"), "second version");
  const second = importLocalPlugin(data, source, "proof");
  assert.equal(second.pluginId, first.pluginId);
  assert.notEqual(second.digest, first.digest);
  fs.rmSync(source, { recursive: true });
  assert.equal(
    fs.readFileSync(
      join(pluginBundlePath(data, first), "skills/proof/SKILL.md"),
      "utf8",
    ),
    "first version",
  );
  assert.equal(
    fs.readFileSync(
      join(pluginBundlePath(data, second), "skills/proof/SKILL.md"),
      "utf8",
    ),
    "second version",
  );
  assert.equal(listLocalPluginPointers(data)[0].digest, second.digest);
});
test("failed imports cannot replace the catalog or copy external resources", (t) => {
  const { root, source, data } = fixture(t);
  fs.writeFileSync(join(source, "SKILL.md"), "original");
  const first = importLocalPlugin(data, source, "proof");
  fs.writeFileSync(join(root, "outside"), "must stay outside");
  fs.symlinkSync("../outside", join(source, "escape"));
  assert.throws(() => importLocalPlugin(data, source, "proof"), /outside/);
  assert.equal(listLocalPluginPointers(data)[0].digest, first.digest);
  fs.unlinkSync(join(source, "escape"));
  fs.symlinkSync(".", join(source, "cycle"));
  assert.throws(() => importLocalPlugin(data, source, "proof"), /cycle/);
  assert.equal(listLocalPluginPointers(data)[0].digest, first.digest);
  assert.deepEqual(fs.readdirSync(join(data, "plugins/local")), ["proof"]);
});
test("invalid paths cannot escape snapshot storage", (t) => {
  const { root, source, data } = fixture(t);
  fs.writeFileSync(join(source, "SKILL.md"), "original");
  const first = importLocalPlugin(data, source, "proof");
  assert.throws(
    () => pluginBundlePath(data, { ...first, slug: "../outside" }),
    /Invalid/,
  );
  assert.throws(
    () => importLocalPlugin(data, first.path, "nested"),
    /separate/,
  );
  fs.rmSync(first.path, { recursive: true });
  fs.symlinkSync(root, first.path);
  assert.throws(() => pluginBundlePath(data, first), /escapes/);
});
