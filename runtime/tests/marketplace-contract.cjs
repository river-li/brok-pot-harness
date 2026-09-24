const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { MARKETPLACE_SOURCES } = require("../../dist/local/marketplace.js");
const { createLocalBotRecipeStore } = require("../../dist/local/bot-recipes.js");
const { createLocalPluginStore } = require("../../dist/local/plugins.js");
const { hashLocalPluginDirectory, localPluginId } = require("../../dist/local/plugin-files.js");

function githubFixture(source) {
  const files = new Map();
  if (source.kind === "skill") {
    files.set("LICENSE", Buffer.from("Apache-2.0 fixture license\n"));
    files.set(
      "skills/chrome-extensions/SKILL.md",
      Buffer.from("---\nname: chrome-extensions\ndescription: Chrome fixture skill.\n---\nPinned Chrome Skill body.\n"),
    );
    files.set(
      "skills/chrome-extensions/references/manifest.md",
      Buffer.from("Pinned reference file.\n"),
    );
  } else {
    files.set(".mcp.json", Buffer.from('{"mcpServers":{}}\n'));
    files.set(".grok-plugin/plugin.json", Buffer.from('{"name":"firecrawl"}\n'));
    files.set("README.md", Buffer.from("AGPL-3.0\n"));
    files.set("commands/skill-gen.md", Buffer.from("Original command template.\n"));
    for (const skill of source.supportedSkills)
      files.set(
        `skills/${skill.name}/SKILL.md`,
        Buffer.from(`---\nname: ${skill.name}\ndescription: ${skill.description}\n---\n${skill.name} pinned body.\n`),
      );
  }
  const tree = [...files].map(([entryPath, bytes]) => ({
    path: entryPath,
    type: "blob",
    mode: "100644",
    size: bytes.byteLength,
    sha: createHash("sha1")
      .update(`blob ${bytes.byteLength}\0`)
      .update(bytes)
      .digest("hex"),
  }));
  const fetcher = async (input) => {
    const url = String(input);
    if (url.includes("api.github.com"))
      return new Response(JSON.stringify({ truncated: false, tree }), {
        headers: { "content-type": "application/json" },
      });
    const entryPath = url.split(`/${source.revision}/`)[1];
    const bytes = files.get(entryPath);
    if (!bytes) return new Response("missing", { status: 404 });
    return new Response(bytes, { headers: { "content-length": String(bytes.byteLength) } });
  };
  return { fetcher, files };
}

function pluginPorts() {
  const walkSkills = (directory, relative = "") => {
    const output = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name), childRelative = path.join(relative, entry.name);
      if (entry.isDirectory()) output.push(...walkSkills(child, childRelative));
      else if (entry.name === "SKILL.md") {
        const content = fs.readFileSync(child, "utf8"), name = content.match(/^name:\s*(.+)$/m)?.[1];
        output.push({ name: name ?? path.basename(path.dirname(child)), description: content.match(/^description:\s*(.+)$/m)?.[1] ?? "", content });
      }
    }
    return output;
  };
  return {
    async load(directory) {
      const manifestPath = path.join(directory, ".cursor-plugin/plugin.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      let mcpConfig = { mcpServers: {} };
      if (fs.existsSync(path.join(directory, ".mcp.json")))
        mcpConfig = JSON.parse(fs.readFileSync(path.join(directory, ".mcp.json"), "utf8"));
      return {
        displayName: manifest.displayName,
        description: manifest.description,
        repository: manifest.repository,
        homepage: manifest.homepage,
        variablesSchema: manifest.variables,
        mcpConfig,
        skills: walkSkills(directory),
      };
    },
    fields(schema) {
      return {
        fields: Object.entries(schema?.properties ?? {}).map(([key, value]) => ({
          key,
          label: value.title ?? key,
          type: "string",
          isRequired: (schema.required ?? []).includes(key),
          isSecret: value.writeOnly === true,
          defaultValue: value.default,
        })),
        unsupportedFieldKeys: [],
      };
    },
    validateVariables(schema, values) {
      return (schema.required ?? []).every((key) => typeof values[key] === "string" && values[key].length > 0);
    },
    validateConfig(value) {
      assert.ok(value && value.mcpServers && typeof value.mcpServers === "object");
      return value;
    },
    validateName(value) { return value; },
    validateManifest(value) {
      try { JSON.parse(value); return { success: true }; }
      catch { return { success: false }; }
    },
  };
}

test("pinned catalog installs full selected files, records provenance, and edits offline", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-marketplace-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = MARKETPLACE_SOURCES.find((item) => item.entryId === "gbh.firecrawl-web-research");
  const { fetcher, files } = githubFixture(source);
  const originalFetch = global.fetch;
  let requests = 0;
  global.fetch = (...args) => { requests++; return fetcher(...args); };
  t.after(() => { global.fetch = originalFetch; });
  const store = createLocalPluginStore(root, pluginPorts());
  const pluginId = localPluginId(source.slug);
  const catalog = await store.catalog();
  const entry = catalog.plugins.find((item) => item.pluginId === pluginId);
  assert.equal(entry.marketplaceMetadata.installationState, "not_installed");
  assert.equal(entry.description.includes(source.revision), false);
  assert.equal(entry.marketplaceMetadata.revision, source.revision);
  assert.equal(entry.marketplaceMetadata.commands[0].name, "skill-gen");
  assert.equal(entry.skills.length, 11);
  await store.installPlugin({
    pluginId,
    variables: {
      FIRECRAWL_MCP_URL: "http://127.0.0.1:49127/firecrawl/mcp",
      FIRECRAWL_API_KEY: "fixture-secret-value",
    },
  });
  assert.equal(requests, files.size + 1);
  const statePath = path.join(root, "plugins/local-installs.json");
  const installed = JSON.parse(fs.readFileSync(statePath, "utf8")).plugins[pluginId];
  const snapshot = path.join(root, "plugins/local", source.slug, installed.digest);
  assert.ok(fs.existsSync(path.join(snapshot, "skills/firecrawl-search/SKILL.md")));
  assert.ok(fs.existsSync(path.join(snapshot, ".marketplace-source/commands/skill-gen.md")));
  assert.ok(fs.existsSync(path.join(snapshot, ".marketplace-source/firecrawl.mcp.json")));
  assert.match(fs.readFileSync(path.join(snapshot, ".mcp.json"), "utf8"), /FIRECRAWL_MCP_URL:-https/);
  const stateBytes = fs.readFileSync(statePath, "utf8");
  const skillPath = path.join(snapshot, "skills/firecrawl-search/SKILL.md");
  fs.appendFileSync(skillPath, "\nlocal operator note\n");
  const edited = fs.readFileSync(skillPath, "utf8");
  const editedFiles = hashLocalPluginDirectory(snapshot).files;
  const beforeDigest = installed.digest;
  const offlineRequests = requests;
  global.fetch = async () => { requests++; throw Error("source unavailable"); };
  await store.updatePluginInstall({
    pluginId,
    variables: {
      FIRECRAWL_MCP_URL: "http://127.0.0.1:49128/firecrawl/mcp",
      FIRECRAWL_API_KEY: "second-fixture-secret",
    },
  });
  assert.equal(requests, offlineRequests, "configuration edits should not fetch the pinned repository");
  const updated = JSON.parse(fs.readFileSync(statePath, "utf8")).plugins[pluginId];
  assert.equal(updated.digest, beforeDigest);
  assert.equal(fs.readFileSync(skillPath, "utf8"), edited);
  assert.notEqual(fs.readFileSync(statePath, "utf8"), stateBytes);
  assert.deepEqual(updated.marketplace.installedSourceFiles, installed.marketplace.installedSourceFiles);
  const view = (await store.catalog()).plugins.find((item) => item.pluginId === pluginId);
  assert.equal(view.marketplaceMetadata.installationState, "installed");
  assert.equal(view.marketplaceMetadata.configurationState, "configured");
  assert.deepEqual(view.marketplaceMetadata.modifiedPaths, ["skills/firecrawl-search/SKILL.md"]);
  assert.equal(JSON.stringify(view).includes("second-fixture-secret"), false);
  assert.equal(JSON.stringify(await store.effective()).includes("second-fixture-secret"), false);
  assert.equal(JSON.stringify(await store.listServers()).includes("second-fixture-secret"), false);
  const restarted = createLocalPluginStore(root, pluginPorts());
  assert.deepEqual((await restarted.effective())[0].modifiedPaths, ["skills/firecrawl-search/SKILL.md"]);
  const pointerPath = path.join(root, "plugins/local", source.slug, "current.json");
  fs.unlinkSync(pointerPath);
  const recovered = createLocalPluginStore(root, pluginPorts());
  assert.equal(
    (await recovered.catalog()).plugins.find((item) => item.pluginId === pluginId)
      .marketplaceMetadata.installationState,
    "installed",
    "the authoritative install record repairs its derived pointer after restart",
  );
  await recovered.uninstallPlugin({ pluginId });
  assert.equal(fs.existsSync(pointerPath), false);
  assert.equal(fs.existsSync(path.join(root, "plugins/local-installs.json")), true);
  assert.equal(fs.readFileSync(skillPath, "utf8"), edited, "uninstall preserves the snapshot bytes");
  assert.equal(
    (await recovered.catalog()).plugins.find((item) => item.pluginId === pluginId)
      .marketplaceMetadata.installationState,
    "not_installed",
  );
  global.fetch = (...args) => { requests++; return fetcher(...args); };
  await recovered.installPlugin({
    pluginId,
    variables: {
      FIRECRAWL_MCP_URL: "http://127.0.0.1:49127/firecrawl/mcp",
      FIRECRAWL_API_KEY: "fixture-secret-value",
    },
  });
  const reinstalled = JSON.parse(fs.readFileSync(statePath, "utf8")).plugins[pluginId];
  assert.equal(reinstalled.digest, beforeDigest, "reinstall uses the pinned source digest");
  assert.ok(fs.existsSync(skillPath), "the clean pinned snapshot is installed again");
  assert.notEqual(fs.readFileSync(skillPath, "utf8"), edited,
    "old local edits must not be described as pristine source content");
  assert.deepEqual((await recovered.catalog()).plugins.find((item) =>
    item.pluginId === pluginId).marketplaceMetadata.modifiedPaths, []);
  const recovery = fs.readdirSync(path.dirname(snapshot))
    .filter((name) => name.startsWith(".uninstalled-edits-"));
  assert.equal(recovery.length, 1);
  const archivedSnapshot = path.join(path.dirname(snapshot), recovery[0], "snapshot");
  assert.deepEqual(hashLocalPluginDirectory(archivedSnapshot).files, editedFiles,
    "reinstall preserves the old snapshot's files and modes");
  assert.equal(fs.readFileSync(path.join(archivedSnapshot,
    "skills/firecrawl-search/SKILL.md"), "utf8"), edited,
    "reinstall preserves every byte of the previous user-edited snapshot");
});

test("local recipe preview/import/update/remove is lossless, idempotent, and binds Bots across restart", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-bot-recipes-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const recipe = {
    profile: { name: "Recipe Bot", description: "A user supplied recipe.", avatarShape: "circle", avatarColor: "#345678" },
    memory: [{ kind: "profile", createdAt: "2026-09-24T00:00:00Z", content: "Keep answers concise." }],
    skills: [{ name: "review", description: "Review files.", content: "Check correctness before style." }],
    routines: [],
    plugins: [{ name: "Chrome Extension Builder", pluginId: localPluginId("gbh-chrome-extensions") }],
    gettingStarted: { skill: "review" },
  };
  const json = JSON.stringify(recipe);
  const store = createLocalBotRecipeStore(root);
  assert.deepEqual(store.preview(json).skills.map((item) => item.name), ["review"]);
  assert.equal(store.preview(json).gettingStartedSkill, "review");
  const builtIn = store.list().find((item) => item.shareId === "GBHLOCALCHROMEEXT0001");
  assert.equal(builtIn.builtIn, true);
  assert.equal(builtIn.editable, false);
  assert.equal(builtIn.gettingStartedSkill, undefined);
  const reordered = JSON.stringify({
    plugins: recipe.plugins,
    routines: recipe.routines,
    skills: recipe.skills,
    memory: recipe.memory,
    profile: recipe.profile,
    gettingStarted: recipe.gettingStarted,
  });
  const [first, replay] = await Promise.all([store.import(json), store.import(reordered)]);
  assert.equal(first.shareId, replay.shareId);
  assert.equal(first.editable, true);
  assert.equal(first.avatarShape, "circle");
  assert.equal(first.avatarColor, "#345678");
  assert.equal(first.gettingStartedSkill, "review");
  const details = store.get(first.shareId, first.version);
  assert.equal(details.memory[0].kind, "profile");
  assert.equal(details.memory[0].createdAt, "2026-09-24T00:00:00Z");
  assert.deepEqual(details.gettingStarted, { skill: "review" });
  const binding = await store.claim(first.shareId, first.version, "agent-recipe-one");
  await store.complete("agent-recipe-one", binding.operationId);
  const prompt = {
    prompt: "Frozen setup instructions for the original Bot name.",
    richText: "Frozen visible setup text.",
  };
  assert.deepEqual(
    await store.recordSetupPrompt("agent-recipe-one", binding.operationId, prompt, binding.setupClientNonce),
    { prompt, clientNonces: [binding.setupClientNonce] },
  );
  const retryNonce = await store.beginSetupResume("agent-recipe-one", binding.operationId);
  const restarted = createLocalBotRecipeStore(root);
  const same = await restarted.claim(first.shareId, first.version, "agent-recipe-one");
  assert.equal(same.operationId, binding.operationId);
  assert.equal(same.setupStatus, "pending");
  assert.ok(same.setupClientNonces.includes(retryNonce));
  const replayedSetup = await restarted.recordSetupPrompt("agent-recipe-one", binding.operationId, {
      prompt: "A replay after the Bot profile changed.",
    }, retryNonce);
  assert.deepEqual(replayedSetup.prompt, prompt);
  assert.ok(replayedSetup.clientNonces.includes(retryNonce));
  await restarted.completeSetup("agent-recipe-one", binding.operationId);
  assert.equal(
    createLocalBotRecipeStore(root).getBinding("agent-recipe-one").setupStatus,
    "accepted",
  );
  await assert.rejects(
    restarted.claim("GBHLOCALCHROMEEXT0001", 1, "agent-recipe-one"),
    /different recipe import/,
  );
  assert.throws(
    () => restarted.preview(JSON.stringify({ ...recipe, skills: [{ ...recipe.skills[0], requires: ["silently-dropped"] }] })),
    /unsupported fields/,
  );
  assert.throws(
    () => restarted.preview(JSON.stringify({ ...recipe, profile: { ...recipe.profile, avatarColor: 17 } })),
    /profile\.avatarColor must be a string/,
  );
  const noOp = await restarted.update(first.shareId, json);
  assert.equal(noOp.version, first.version);
  const updated = await restarted.update(first.shareId, JSON.stringify({ ...recipe, profile: { ...recipe.profile, description: "Updated." } }));
  assert.equal(updated.version, first.version + 1);
  await restarted.remove(first.shareId);
  await restarted.remove(first.shareId);
  assert.equal(createLocalBotRecipeStore(root).getBinding("agent-recipe-one").operationId, binding.operationId);
});

test("recovered recipe setup retries send the frozen Host prompt shape", async () => {
  const renderer = fs.readFileSync(
    path.join(__dirname, "../renderer-src/assets/index-C6zjACOA.js"),
    "utf8",
  );
  const start = renderer.indexOf("function mXe(t) {");
  const end = renderer.indexOf("\nfunction Wq(t) {", start);
  assert.ok(start >= 0 && end > start, "the recovered recipe setup sender is present");
  const source = renderer.slice(start, end);
  const sendRecipeSetup = new Function(
    "WKe",
    "HKe",
    "KKe",
    `${source}\nreturn mXe;`,
  )(
    () => { throw new Error("replay must not regenerate conversational setup"); },
    () => { throw new Error("replay must not regenerate standard setup"); },
    "untrusted",
  );
  const frozen = {
    prompt: "Frozen instructions for the original Bot name.",
    richText: "Frozen visible setup copy.",
  };
  let sent;
  sendRecipeSetup({
    agent: { id: "local-bot", name: "Name edited after import" },
    setup: {
      setupPrompt: frozen,
      setupOperationId: "operation-1",
      setupClientNonce: "nonce-1",
      automations: [],
      plugins: [],
      memories: [],
      skills: [],
    },
    sendPrompt: (args) => {
      sent = args;
      return Promise.resolve();
    },
    onSent() {},
    onFailed(error) { throw error; },
  });
  await new Promise(setImmediate);
  assert.equal(sent.prompt, frozen.prompt);
  assert.equal(sent.richText, frozen.richText);
  assert.equal(sent.clientNonce, "nonce-1");
  assert.equal(sent.recipeSetupOperationId, "operation-1");
  assert.equal(sent.automationWriteProvenance, "template_import");
});
