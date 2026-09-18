var import_node_fs74 = require("node:fs");
var import_node_path122 = require("node:path");
var MEMBERSHIP_FILENAME = "projects.json";
function getAgentProjectsPath(agentDir) {
  return (0, import_node_path122.join)(agentDir, MEMBERSHIP_FILENAME);
}
var AgentProjectMembership = class {
  constructor(agentDir) {
    this.agentDir = agentDir;
  }
  agentDir;
  get path() {
    return getAgentProjectsPath(this.agentDir);
  }
  read() {
    let raw;
    try {
      raw = (0, import_node_fs74.readFileSync)(this.path, "utf8");
    } catch (error41) {
      reportFallbackUnlessAbsent("project_membership", error41);
      return /* @__PURE__ */ new Set();
    }
    try {
      const parsed2 = JSON.parse(raw);
      return toSafeSlugSet(parsed2.projects);
    } catch {
      return /* @__PURE__ */ new Set();
    }
  }
  write(slugs) {
    const file2 = { projects: [...slugs].sort() };
    writeFileAtomicSync(this.path, `${JSON.stringify(file2, null, 2)}
`);
  }
  join(slug) {
    if (!isSafeFolderId(slug)) return false;
    const slugs = this.read();
    if (slugs.has(slug)) return true;
    slugs.add(slug);
    this.write(slugs);
    return true;
  }
  leave(slug) {
    if (!isSafeFolderId(slug)) return false;
    const slugs = this.read();
    if (!slugs.has(slug)) return true;
    slugs.delete(slug);
    this.write(slugs);
    return true;
  }
  pruneMissing(projectExists) {
    const slugs = this.read();
    let changed = false;
    for (const slug of [...slugs]) {
      if (!projectExists(slug)) {
        slugs.delete(slug);
        changed = true;
      }
    }
    if (changed) this.write(slugs);
  }
};
function toSafeSlugSet(value) {
  if (!Array.isArray(value)) return /* @__PURE__ */ new Set();
  return new Set(
    value.filter((slug) => typeof slug === "string" && isSafeFolderId(slug))
  );
}
