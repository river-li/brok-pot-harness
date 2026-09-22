var SKILL_CHANGE_DEBOUNCE_MS = 50;
var RESERVED_SKILL_FILES = /* @__PURE__ */ new Set([SKILL_FILENAME, LEGACY_WORKFLOW_FILENAME, "runs.json"]);
var recordParseCache = new StatKeyedParseCache();
function getGlobalSkillsDir(sandRoot) {
  return (0, import_node_path116.join)(sandRoot, "workflows");
}
var GlobalSkillLibrary = class {
  constructor(libraryDir) {
    this.libraryDir = libraryDir;
    this.dir = new WatchedDirectory(
      libraryDir,
      createDebouncePolicy({
        name: "sand-skill-library-change",
        delayMs: SKILL_CHANGE_DEBOUNCE_MS
      })
    );
    this.renameLegacyRecipeFiles();
  }
  libraryDir;
  dir;
  renameLegacyRecipeFiles() {
    for (const id of this.listIds()) {
      const legacyPath = (0, import_node_path116.join)(this.folder(id), LEGACY_WORKFLOW_FILENAME);
      try {
        if (!(0, import_node_fs68.statSync)(legacyPath).isFile()) continue;
      } catch {
        continue;
      }
      try {
        (0, import_node_fs68.statSync)(this.path(id));
        continue;
      } catch {
      }
      try {
        (0, import_node_fs68.renameSync)(legacyPath, this.path(id));
      } catch {
        continue;
      }
    }
  }
  getLocation() {
    return this.libraryDir;
  }
  setOnChange(onChange) {
    this.dir.setOnChange(onChange);
  }
  folder(id) {
    return (0, import_node_path116.join)(this.libraryDir, id);
  }
  path(id) {
    return (0, import_node_path116.join)(this.folder(id), SKILL_FILENAME);
  }
  listIds() {
    return this.dir.listSubdirectoryNames();
  }
  listHelperScripts(id) {
    let entries;
    try {
      entries = (0, import_node_fs68.readdirSync)(this.folder(id), { withFileTypes: true });
    } catch (error42) {
      reportFallbackUnlessAbsent("skill_library", error42);
      return [];
    }
    return entries.filter((entry) => entry.isFile() && !RESERVED_SKILL_FILES.has(entry.name)).map((entry) => entry.name).sort();
  }
  get(id) {
    if (!isSafeFolderId(id)) return null;
    return recordParseCache.read([this.path(id), this.folder(id)], () => this.readRecord(id));
  }
  readRecord(id) {
    let raw;
    try {
      raw = (0, import_node_fs68.readFileSync)(this.path(id), "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("skill_library", error42);
      return null;
    }
    const parsed2 = parseSkillFile(raw);
    if (parsed2 == null || parsed2.body.length === 0) return null;
    let createdAt = Date.now();
    try {
      const stats = (0, import_node_fs68.statSync)(this.path(id));
      createdAt = Math.floor(stats.birthtimeMs || stats.mtimeMs);
    } catch {
    }
    return {
      id,
      name: parsed2.name.length > 0 ? parsed2.name : id,
      description: parsed2.description,
      body: parsed2.body,
      suggestedTrigger: parsed2.trigger,
      sourceRef: parsed2.sourceRef,
      helperScripts: this.listHelperScripts(id),
      createdAt,
      filePath: this.path(id)
    };
  }
  has(id) {
    return this.get(id) != null;
  }
  list() {
    const records2 = [];
    for (const id of this.listIds()) {
      const record2 = this.get(id);
      if (record2 != null) records2.push(record2);
    }
    return records2.sort((a, b2) => a.createdAt - b2.createdAt);
  }
  count() {
    return this.listIds().filter((id) => this.get(id) != null).length;
  }
  uniqueId(name17) {
    const base = slugifySkillName(name17);
    const existing = new Set(this.listIds());
    if (!existing.has(base)) return base;
    for (let suffix = 2; suffix < 1e3; suffix++) {
      const candidate = `${base}-${suffix}`;
      if (!existing.has(candidate)) return candidate;
    }
    return `${base}-${Date.now()}`;
  }
  create(spec) {
    const name17 = clampSkillName(spec.name);
    const body = clampSkillBody(spec.body);
    if (name17.length === 0 || body.length === 0) return null;
    if (this.count() >= SKILL_MAX_PER_AGENT) return null;
    const id = this.uniqueId(name17);
    return this.write(id, {
      name: name17,
      description: clampSkillDescription(spec.description),
      body,
      trigger: null,
      sourceRef: spec.sourceRef ?? null
    });
  }
  update(id, spec) {
    if (!isSafeFolderId(id) || this.get(id) == null) return null;
    const name17 = clampSkillName(spec.name);
    const body = clampSkillBody(spec.body);
    if (name17.length === 0 || body.length === 0) return null;
    return this.write(id, {
      name: name17,
      description: clampSkillDescription(spec.description),
      body,
      trigger: null,
      sourceRef: spec.sourceRef ?? null
    });
  }
  writeAt(id, spec) {
    if (!isSafeFolderId(id)) return null;
    return this.write(id, { ...spec, trigger: null });
  }
  existingFrontmatter(id) {
    let raw;
    try {
      raw = (0, import_node_fs68.readFileSync)(this.path(id), "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("skill_library", error42);
      return {};
    }
    return parseSkillFile(raw)?.data ?? {};
  }
  write(id, spec) {
    this.dir.writeFileAtomic(this.path(id), serializeSkillFile(spec, this.existingFrontmatter(id)));
    return this.get(id);
  }
  remove(id) {
    if (!isSafeFolderId(id)) return false;
    const folder = this.folder(id);
    try {
      if (!(0, import_node_fs68.statSync)(folder).isDirectory()) return false;
    } catch (error42) {
      reportFallbackUnlessAbsent("skill_library", error42);
      return false;
    }
    (0, import_node_fs68.rmSync)(folder, { recursive: true, force: true });
    this.dir.scheduleNotify();
    return true;
  }
};
