var MANAGED_SKILLS_DIRNAME = "managed-skills";
var MANAGED_SKILLS_CACHE_FILENAME = "cache.json";
var MANAGED_SKILL_FILES_DIRNAME = "skills";
function getManagedSkillsDir(sandRoot) {
  return (0, import_node_path112.join)(sandRoot, MANAGED_SKILLS_DIRNAME);
}
function getManagedSkillsCachePath(cacheDir) {
  return (0, import_node_path112.join)(cacheDir, MANAGED_SKILLS_CACHE_FILENAME);
}
function getManagedSkillFilePath(cacheDir, id) {
  return (0, import_node_path112.join)(cacheDir, MANAGED_SKILL_FILES_DIRNAME, id, "SKILL.md");
}
function isManagedSkill(value) {
  if (!isUnknownRecord(value)) return false;
  return typeof value.id === "string" && value.id.length > 0 && typeof value.name === "string" && typeof value.description === "string" && typeof value.body === "string" && value.body.length > 0;
}
function readManagedSkillsCache(cacheDir) {
  try {
    const parsed2 = JSON.parse(
      (0, import_node_fs64.readFileSync)(getManagedSkillsCachePath(cacheDir), "utf8")
    );
    if (typeof parsed2.fetchedAt !== "number" || !Number.isFinite(parsed2.fetchedAt) || !Array.isArray(parsed2.skills) || !parsed2.skills.every(isManagedSkill)) {
      return null;
    }
    return { fetchedAt: parsed2.fetchedAt, skills: parsed2.skills };
  } catch (error41) {
    reportFallbackUnlessAbsent("managed_skills_cache", error41);
    return null;
  }
}
function writeManagedSkillsCache(cacheDir, skills) {
  const body = `${JSON.stringify(
    { fetchedAt: Date.now(), skills },
    null,
    2
  )}
`;
  (0, import_node_fs64.mkdirSync)(cacheDir, { recursive: true, mode: AGENT_READABLE_SKILL_DIR_MODE });
  (0, import_node_fs64.chmodSync)(cacheDir, AGENT_READABLE_SKILL_DIR_MODE);
  writeFileAtomicSync(getManagedSkillsCachePath(cacheDir), body, {
    mode: AGENT_READABLE_SKILL_FILE_MODE
  });
  materializeManagedSkillFiles(cacheDir, skills);
}
function materializeManagedSkillFiles(cacheDir, skills) {
  const filesDir = (0, import_node_path112.join)(cacheDir, MANAGED_SKILL_FILES_DIRNAME);
  (0, import_node_fs64.mkdirSync)(filesDir, { recursive: true, mode: AGENT_READABLE_SKILL_DIR_MODE });
  (0, import_node_fs64.chmodSync)(filesDir, AGENT_READABLE_SKILL_DIR_MODE);
  const keep = new Set(skills.map((skill) => skill.id));
  for (const entry of (0, import_node_fs64.readdirSync)(filesDir, { withFileTypes: true })) {
    if (!keep.has(entry.name)) {
      (0, import_node_fs64.rmSync)((0, import_node_path112.join)(filesDir, entry.name), { recursive: true, force: true });
    }
  }
  for (const skill of skills) {
    const skillDir2 = (0, import_node_path112.join)(filesDir, skill.id);
    (0, import_node_fs64.mkdirSync)(skillDir2, { recursive: true, mode: AGENT_READABLE_SKILL_DIR_MODE });
    (0, import_node_fs64.chmodSync)(skillDir2, AGENT_READABLE_SKILL_DIR_MODE);
    const content = serializeSkillFile({
      name: skill.name,
      description: skill.description,
      body: skill.body,
      trigger: null
    });
    writeFileAtomicSync(getManagedSkillFilePath(cacheDir, skill.id), content, {
      mode: AGENT_READABLE_SKILL_FILE_MODE
    });
  }
}
