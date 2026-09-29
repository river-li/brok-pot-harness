const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function fixture(t) {
  const parent = path.resolve(__dirname, "../../.runtime/tests");
  fs.mkdirSync(parent, { recursive: true });
  const base = fs.mkdtempSync(path.join(parent, "attachment-security-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.join(base, "host");
  const agent = path.join(root, "agents/test-agent");
  const attachments = path.join(agent, "attachments");
  const assets = path.join(agent, "assets");
  const outside = path.join(base, "outside");
  for (const dir of [attachments, assets, outside]) fs.mkdirSync(dir, { recursive: true });
  const context = vm.createContext({
    require, Buffer, Uint8Array,
    init_errors() {}, init_system_errno() {},
    SandDomainError: Error,
    findSystemErrno: (error) => error.code,
    reanchorSandPath: (value) => value,
    getSandRootDir: () => root,
    getAgentAttachmentsDir: (dir) => path.join(dir, "attachments"),
    getAgentAssetsDir: (dir) => path.join(dir, "assets"),
    SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT: path.join(base, "cloud"),
    reportFallbackUnlessAbsent() {},
    lexicalBoxFilePath: () => null,
    attachmentByteLimitForName: () => 1024 * 1024,
    imageMimeFromPath: (value) => value.endsWith(".png") ? "image/png" : undefined,
    servableImageMimeFromPath: (value) => value.endsWith(".png") ? "image/png" : null,
    videoMimeFromPath: () => undefined,
    audioMimeFromPath: () => undefined,
    withDisplayableImageSource: async (value, read) => read(value),
    readImageFileDimensions: () => ({ width: 1, height: 1 }),
    isTextPreviewableName: (value) => value.endsWith(".txt"),
    looksLikeBinary: () => false,
  });
  for (const source of ["src/shared/node/paths.ts", "src/host/extensions/attachments/attachments-service.ts"]) {
    vm.runInContext(fs.readFileSync(path.resolve(__dirname, "../..", source), "utf8"), context, { filename: source });
  }
  return { base, root, agent, attachments, assets, outside, api: context };
}

test("actual attachment fragments retain normal reads and reject file/directory symlink escapes", async (t) => {
  const f = fixture(t);
  for (const [name, contents] of [["note.txt", "allowed text"], ["image.png", "allowed image"]]) {
    fs.writeFileSync(path.join(f.attachments, name), contents);
    fs.writeFileSync(path.join(f.outside, name), "private sentinel");
  }
  assert.equal((await f.api.readAttachmentText(f.agent, path.join(f.attachments, "note.txt"))).text, "allowed text");
  assert.equal(Buffer.from((await f.api.readHostAttachmentChunk(f.agent, path.join(f.attachments, "note.txt"), 0, 100)).bytesBase64, "base64").toString(), "allowed text");
  assert.ok((await f.api.readHostAttachmentImage(path.join(f.attachments, "image.png"))).dataUrl);
  fs.symlinkSync(path.join(f.outside, "note.txt"), path.join(f.attachments, "escape.txt"));
  fs.symlinkSync(path.join(f.outside, "image.png"), path.join(f.attachments, "escape.png"));
  fs.symlinkSync(f.outside, path.join(f.attachments, "escape-dir"));
  fs.symlinkSync(path.join(f.attachments, "note.txt"), path.join(f.attachments, "internal.txt"));
  assert.equal((await f.api.readAttachmentText(f.agent, path.join(f.attachments, "internal.txt"))).text, "allowed text");
  for (const file of [path.join(f.attachments, "escape.txt"), path.join(f.attachments, "escape-dir/note.txt"), path.join(f.outside, "note.txt")]) {
    assert.equal(await f.api.readAttachmentText(f.agent, file), null);
    assert.equal(await f.api.readHostAttachmentChunk(f.agent, file, 0, 100), null);
  }
  assert.equal(await f.api.readHostAttachmentImage(path.join(f.attachments, "escape.png")), null);
  fs.rmSync(f.assets, { recursive: true });
  fs.symlinkSync(f.outside, f.assets);
  assert.equal(await f.api.readHostAttachmentChunk(f.agent, path.join(f.assets, "note.txt"), 0, 100), null);
  fs.rmSync(f.attachments, { recursive: true });
  fs.symlinkSync(f.outside, f.attachments);
  assert.equal(await f.api.readAttachmentText(f.agent, path.join(f.attachments, "note.txt")), null);
  assert.equal(await f.api.readHostAttachmentChunk(f.agent, path.join(f.attachments, "note.txt"), 0, 100), null);
  assert.equal(await f.api.readHostAttachmentImage(path.join(f.attachments, "image.png")), null);
});

test("chunk uploads reject symlink parts and escaped storage roots without changing sentinel bytes", async (t) => {
  const f = fixture(t);
  const parts = path.join(f.attachments, ".uploads");
  fs.mkdirSync(parts);
  const sentinel = path.join(f.outside, "sentinel.txt");
  fs.writeFileSync(sentinel, "private sentinel");
  const upload = (offset = 0) => f.api.ingestAttachmentChunk(f.agent, { uploadId: "security-test", filename: "note.txt", offset, totalSize: 6, bytes: Buffer.from("abc") });
  const part = path.join(parts, "security-test.part");
  fs.symlinkSync(sentinel, part);
  await assert.rejects(upload());
  await assert.rejects(upload(3));
  assert.equal(fs.readFileSync(sentinel, "utf8"), "private sentinel");
  fs.unlinkSync(part);
  fs.linkSync(sentinel, part);
  await assert.rejects(upload(), /private file/);
  await assert.rejects(upload(3), /private file/);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "private sentinel");
  fs.unlinkSync(part);
  assert.equal(await upload(), null);
  const complete = await upload(3);
  assert.equal(fs.readFileSync(complete.absolutePath, "utf8"), "abcabc");
  fs.rmSync(parts, { recursive: true });
  fs.symlinkSync(f.outside, parts);
  await assert.rejects(upload(), /outside/);
  assert.equal(fs.existsSync(path.join(f.outside, "security-test.part")), false);
  fs.rmSync(f.attachments, { recursive: true });
  fs.symlinkSync(f.outside, f.attachments);
  await assert.rejects(upload(), /outside/);
  assert.equal(fs.existsSync(path.join(f.outside, ".uploads")), false);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "private sentinel");
});

test("scoped media roots cannot be redirected to other Host data", async (t) => {
  const f = fixture(t);
  const privateDir = path.join(f.root, "private");
  fs.mkdirSync(privateDir);
  fs.writeFileSync(path.join(privateDir, "note.txt"), "private sentinel");
  fs.rmSync(f.attachments, { recursive: true });
  fs.symlinkSync(privateDir, f.attachments);
  assert.equal(await f.api.readAttachmentText(f.agent, path.join(f.attachments, "note.txt")), null);
  assert.equal(await f.api.readHostAttachmentChunk(f.agent, path.join(f.attachments, "note.txt"), 0, 100), null);
  await assert.rejects(f.api.ingestAttachmentChunk(f.agent, {
    uploadId: "security-test", filename: "note.txt", offset: 0, totalSize: 3, bytes: Buffer.from("abc"),
  }), /outside/);
  assert.equal(fs.existsSync(path.join(privateDir, ".uploads")), false);
});
