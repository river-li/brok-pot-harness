var import_node_fs84 = require("node:fs");
var import_node_path135 = require("node:path");
init_scheduling();
var LEGACY_WORKFLOWS_DIRNAME = "workflows";
var MANAGED_SKILLS_CHANGE_DEBOUNCE_MS = 50;
var pluginSkillParseCache = new StatKeyedParseCache();
var managedSkillsIndexCache = new StatKeyedParseCache();
var pluginSkillsIndexCache = new StatKeyedParseCache();
function readPluginSkillFileFacts(filePath) {
  let raw;
  try {
    raw = (0, import_node_fs84.readFileSync)(filePath, "utf8");
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_store", error41);
    return null;
  }
  const parsed2 = parseSkillFile(raw);
  if (parsed2 == null || parsed2.body.length === 0) return null;
  let helperScripts = [];
  try {
    helperScripts = (0, import_node_fs84.readdirSync)((0, import_node_path135.dirname)(filePath), {
      withFileTypes: true
    }).filter((entry) => entry.isFile() && entry.name !== "SKILL.md").map((entry) => entry.name).sort();
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_store", error41);
    helperScripts = [];
  }
  return {
    name: parsed2.name,
    description: parsed2.description,
    body: parsed2.body,
    disableModelInvocation: parsed2.data["disable-model-invocation"] === true,
    helperScripts
  };
}
function agentHasSkills(agentDir) {
  const legacyDir = (0, import_node_path135.join)(agentDir, LEGACY_WORKFLOWS_DIRNAME);
  let entries;
  try {
    entries = (0, import_node_fs84.readdirSync)(legacyDir, { withFileTypes: true });
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_store", error41);
    return false;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      (0, import_node_fs84.statSync)((0, import_node_path135.join)(legacyDir, entry.name, LEGACY_WORKFLOW_FILENAME));
      return true;
    } catch {
      continue;
    }
  }
  return false;
}
var FileSkillStore = class {
  constructor(agentDir, globalDir, resolveUserTimeZone = () => void 0, isFiveMinuteAutomationFloorEnabled = () => false) {
    this.agentDir = agentDir;
    this.library = new GlobalSkillLibrary(globalDir);
    this.managedDir = getManagedSkillsDir((0, import_node_path135.dirname)(globalDir));
    this.managedDirWatcher = new WatchedDirectory(
      this.managedDir,
      createDebouncePolicy({
        name: "sand-managed-skills-change",
        delayMs: MANAGED_SKILLS_CHANGE_DEBOUNCE_MS
      })
    );
    this.pluginSkillsDir = getPluginSkillsDir((0, import_node_path135.dirname)(globalDir));
    this.pluginSkillsDirWatcher = new WatchedDirectory(
      this.pluginSkillsDir,
      createDebouncePolicy({
        name: "sand-plugin-skills-change",
        delayMs: MANAGED_SKILLS_CHANGE_DEBOUNCE_MS
      })
    );
    this.automations = new FileAutomationStore(
      getAgentAutomationsDir(agentDir),
      resolveUserTimeZone,
      isFiveMinuteAutomationFloorEnabled
    );
    this.migrateLegacyPerAgentSkills();
  }
  agentDir;
  library;
  automations;
  managedDir;
  managedDirWatcher;
  pluginSkillsDir;
  pluginSkillsDirWatcher;
  getLocation() {
    return this.library.getLocation();
  }
  setOnChange(onChange) {
    this.library.setOnChange(onChange);
    this.managedDirWatcher.setOnChange(onChange);
    this.pluginSkillsDirWatcher.setOnChange(onChange);
    this.automations.setOnChange(onChange);
  }
  skillFromRecord(record2) {
    return {
      id: record2.id,
      name: record2.name,
      description: record2.description,
      body: record2.body,
      trigger: null,
      source: "workflow",
      sourceRef: record2.sourceRef,
      pluginId: null,
      publishedByCurrentUser: false,
      scheduleDescription: null,
      createdAt: record2.createdAt,
      lastRunAt: null,
      nextRunAt: null,
      helperScripts: record2.helperScripts,
      runs: [],
      filePath: record2.filePath
    };
  }
  managedSkillToSkill(skill, fetchedAt) {
    const skillFilePath = getManagedSkillFilePath(this.managedDir, skill.id);
    let hasSkillFile = false;
    try {
      hasSkillFile = (0, import_node_fs84.statSync)(skillFilePath).isFile();
    } catch (error41) {
      reportFallbackUnlessAbsent("skill_store", error41);
      hasSkillFile = false;
    }
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      body: skill.body,
      trigger: null,
      source: "managed",
      sourceRef: null,
      pluginId: null,
      publishedByCurrentUser: false,
      scheduleDescription: null,
      createdAt: fetchedAt,
      lastRunAt: null,
      nextRunAt: null,
      helperScripts: [],
      runs: [],
      filePath: hasSkillFile ? skillFilePath : getManagedSkillsCachePath(this.managedDir)
    };
  }
  readManagedSkillsIndex() {
    return managedSkillsIndexCache.read(
      [getManagedSkillsCachePath(this.managedDir)],
      () => readManagedSkillsCache(this.managedDir)
    );
  }
  readPluginSkillsIndex() {
    return pluginSkillsIndexCache.read(
      [getPluginSkillsCachePath(this.pluginSkillsDir)],
      () => readPluginSkillsCache(this.pluginSkillsDir)
    );
  }
  managedSkills(excludedIds = /* @__PURE__ */ new Set()) {
    const cache3 = this.readManagedSkillsIndex();
    if (cache3 == null) return [];
    return cache3.skills.filter((skill) => !excludedIds.has(skill.id)).map((skill) => this.managedSkillToSkill(skill, cache3.fetchedAt));
  }
  pluginSkillToSkill(record2, index) {
    const facts = pluginSkillParseCache.read(
      [record2.filePath, (0, import_node_path135.dirname)(record2.filePath)],
      () => readPluginSkillFileFacts(record2.filePath)
    );
    if (facts == null) return null;
    return {
      id: record2.id,
      name: facts.name.length > 0 ? facts.name : record2.name,
      description: facts.description.length > 0 ? facts.description : record2.description,
      body: facts.body,
      trigger: null,
      source: "plugin",
      sourceRef: null,
      pluginId: record2.pluginId,
      publishedByCurrentUser: record2.publisherUserId != null && record2.publisherUserId === index.currentUserId,
      disableModelInvocation: facts.disableModelInvocation,
      scheduleDescription: null,
      createdAt: index.fetchedAt,
      lastRunAt: null,
      nextRunAt: null,
      helperScripts: facts.helperScripts,
      runs: [],
      filePath: record2.filePath
    };
  }
  pluginSkills(excludedIds = /* @__PURE__ */ new Set()) {
    const cache3 = this.readPluginSkillsIndex();
    if (cache3 == null) return [];
    const skills = [];
    for (const record2 of cache3.skills) {
      if (excludedIds.has(record2.id) || excludedIds.has(slugifySkillName(record2.name))) continue;
      const skill = this.pluginSkillToSkill(record2, cache3);
      if (skill != null) skills.push(skill);
    }
    return skills;
  }
  pluginSkillRecord(id) {
    const cache3 = this.readPluginSkillsIndex();
    return cache3?.skills.find((record2) => record2.id === id) ?? null;
  }
  listAll() {
    return this.listAllFrom({ definitionsOnly: false });
  }
  listAllFrom({ definitionsOnly }) {
    const records2 = this.library.list().filter((record2) => !RESERVED_MANAGED_SKILL_IDS.has(record2.id));
    const userIds = new Set(records2.map((record2) => record2.id));
    const skills = records2.map((record2) => this.skillFromRecord(record2));
    const managed = this.managedSkills(userIds);
    const claimedIds = /* @__PURE__ */ new Set([...userIds, ...managed.map((skill) => skill.id)]);
    const plugins = this.pluginSkills(claimedIds);
    const autos = (definitionsOnly ? this.automations.listDefinitions() : this.automations.list()).map(automationToSkill);
    return [...managed, ...plugins, ...skills, ...autos];
  }
  list() {
    return this.listAllFrom({ definitionsOnly: true });
  }
  get(id) {
    const record2 = RESERVED_MANAGED_SKILL_IDS.has(id) ? null : this.library.get(id);
    if (record2 != null) return this.skillFromRecord(record2);
    const managedAll = this.managedSkills();
    const managed = managedAll.find((skill) => skill.id === id);
    if (managed != null) return managed;
    const claimedIds = /* @__PURE__ */ new Set([
      ...this.library.list().map((userRecord) => userRecord.id),
      ...managedAll.map((skill) => skill.id)
    ]);
    const plugin = this.pluginSkills(claimedIds).find((skill) => skill.id === id);
    if (plugin != null) return plugin;
    const automation = this.automations.get(id);
    return automation == null ? null : automationToSkill(automation);
  }
  create(spec, provenance) {
    const name17 = clampSkillName(spec.name);
    if (name17.length === 0) return null;
    if (spec.trigger != null) {
      return this.createAutomation({ ...spec, name: name17 }, provenance);
    }
    const body = clampSkillBody(spec.body);
    if (body.length === 0) return null;
    const record2 = this.library.create({
      name: name17,
      description: spec.description,
      body,
      trigger: null,
      sourceRef: spec.sourceRef ?? null
    });
    if (record2 == null) return null;
    return this.skillFromRecord(record2);
  }
  createAutomation(spec, provenance) {
    if (spec.trigger == null) return null;
    const automation = this.automations.upsert(
      {
        name: spec.name,
        prompt: spec.body,
        trigger: cronTrigger(spec.trigger.schedule),
        isEnabled: spec.trigger.isEnabled
      },
      provenance
    );
    return automation == null ? null : automationToSkill(automation);
  }
  update(id, spec, provenance) {
    const current = this.get(id);
    if (current == null) return null;
    const name17 = clampSkillName(spec.name);
    if (name17.length === 0) return null;
    if (current.source === "automation") {
      const isEnabled = spec.trigger?.isEnabled ?? current.trigger?.isEnabled ?? true;
      const schedule = spec.trigger?.schedule ?? current.trigger?.schedule ?? "";
      const existing = this.automations.get(id);
      const trigger2 = schedule.trim().length > 0 ? cronTrigger(schedule) : existing?.trigger ?? cronTrigger("");
      const automation = this.automations.update(
        id,
        {
          name: name17,
          prompt: spec.body,
          trigger: trigger2,
          isEnabled
        },
        provenance
      );
      return automation == null ? null : automationToSkill(automation);
    }
    const body = clampSkillBody(spec.body);
    if (body.length === 0) return null;
    if (current.source === "plugin") {
      if (!current.publishedByCurrentUser) return null;
      return this.updatePluginSkill(id, { name: name17, description: spec.description, body });
    }
    const record2 = this.library.update(id, {
      name: name17,
      description: spec.description,
      body,
      trigger: null,
      sourceRef: spec.sourceRef ?? current.sourceRef
    });
    return record2 == null ? null : this.skillFromRecord(record2);
  }
  updatePluginSkill(id, spec) {
    const record2 = this.pluginSkillRecord(id);
    if (record2 == null) return null;
    let existing = {};
    try {
      existing = parseSkillFile((0, import_node_fs84.readFileSync)(record2.filePath, "utf8"))?.data ?? {};
    } catch (error41) {
      reportFallbackUnlessAbsent("skill_store", error41);
      return null;
    }
    this.pluginSkillsDirWatcher.writeFileAtomic(
      record2.filePath,
      serializeSkillFile({ ...spec, trigger: null }, existing)
    );
    return this.get(id);
  }
  setTriggerEnabled(id, isEnabled) {
    const automation = this.automations.setEnabled(id, isEnabled);
    return automation == null ? null : automationToSkill(automation);
  }
  remove(id) {
    const source = this.get(id)?.source;
    if (source === "managed" || source === "plugin") return false;
    if (this.library.get(id) != null) {
      return this.library.remove(id);
    }
    return this.automations.remove(id);
  }
  importMarkdown(markdown, fallbackName) {
    const spec = skillSpecFromMarkdown(markdown, fallbackName);
    if (spec == null) return null;
    const record2 = this.library.create({
      name: spec.name,
      description: spec.description,
      body: spec.body,
      trigger: null,
      sourceRef: spec.sourceRef ?? null
    });
    if (record2 == null) return null;
    return { id: record2.id, name: record2.name };
  }
  importLiveSource(source, fallbackName) {
    const trimmed = source.trim();
    if (trimmed.length === 0) return null;
    const name17 = clampSkillName(fallbackName ?? deriveSkillNameFromUrl(trimmed));
    if (name17.length === 0) return null;
    const record2 = this.library.create(liveSkillSpecFromSource({ name: name17, source: trimmed }));
    if (record2 == null) return null;
    return { id: record2.id, name: record2.name };
  }
  portLocalSkills(homeDir, cwd) {
    const imported = [];
    const skipped2 = [];
    for (const source of discoverLocalSkillFiles(homeDir, cwd)) {
      const result = this.importLiveSource(source.path, source.fallbackName);
      if (result == null) {
        skipped2.push({ source: source.label, reason: "could not link" });
      } else {
        imported.push(result);
      }
    }
    return { imported, skipped: skipped2 };
  }
  migrateLegacyPerAgentSkills() {
    const legacyDir = (0, import_node_path135.join)(this.agentDir, LEGACY_WORKFLOWS_DIRNAME);
    let entries;
    try {
      entries = (0, import_node_fs84.readdirSync)(legacyDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const id = entry.name;
      const legacyFolder = (0, import_node_path135.join)(legacyDir, id);
      if (this.library.has(id)) continue;
      try {
        (0, import_node_fs84.renameSync)(legacyFolder, (0, import_node_path135.join)(this.library.getLocation(), id));
      } catch {
        let raw;
        try {
          raw = (0, import_node_fs84.readFileSync)((0, import_node_path135.join)(legacyFolder, LEGACY_WORKFLOW_FILENAME), "utf8");
        } catch {
          continue;
        }
        const parsed2 = parseSkillFile(raw);
        if (parsed2 == null || parsed2.body.length === 0) continue;
        this.library.writeAt(id, {
          name: parsed2.name.length > 0 ? parsed2.name : id,
          description: parsed2.description,
          body: parsed2.body,
          trigger: null
        });
      }
    }
    this.library.renameLegacyRecipeFiles();
    (0, import_node_fs84.rmSync)(legacyDir, { recursive: true, force: true });
  }
};
function discoverLocalSkillFiles(homeDir, cwd) {
  const sources = [];
  const seen = /* @__PURE__ */ new Set();
  const add2 = (path31, label, fallbackName) => {
    if (seen.has(path31)) return;
    seen.add(path31);
    try {
      if ((0, import_node_fs84.statSync)(path31).isFile()) {
        sources.push({ path: path31, label, fallbackName });
      }
    } catch {
    }
  };
  for (const dir of [cwd, homeDir]) {
    add2((0, import_node_path135.join)(dir, "CLAUDE.md"), `${dir}/CLAUDE.md`, "Claude memory");
    add2((0, import_node_path135.join)(dir, "AGENTS.md"), `${dir}/AGENTS.md`, "Agents memory");
    add2((0, import_node_path135.join)(dir, ".claude", "CLAUDE.md"), `${dir}/.claude/CLAUDE.md`, "Claude memory");
  }
  const rulesDir = (0, import_node_path135.join)(cwd, ".cursor", "rules");
  let ruleEntries = [];
  try {
    ruleEntries = (0, import_node_fs84.readdirSync)(rulesDir, { withFileTypes: true });
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_store", error41);
    ruleEntries = [];
  }
  for (const entry of ruleEntries) {
    if (!entry.isFile()) continue;
    if (!/\.(mdc|md)$/i.test(entry.name)) continue;
    add2(
      (0, import_node_path135.join)(rulesDir, entry.name),
      `.cursor/rules/${entry.name}`,
      entry.name.replace(/\.(mdc|md)$/i, "")
    );
  }
  return sources;
}
