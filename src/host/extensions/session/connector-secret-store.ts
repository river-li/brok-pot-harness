/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/connector-secret-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs80 = require("node:fs");
var import_node_path129 = require("node:path");
init_errors();
var SandConnectorSecretStore = class {
  constructor(secretsRoot) {
    this.secretsRoot = secretsRoot;
  }
  secretsRoot;
  filePath(agentId, platform2) {
    return (0, import_node_path129.join)(this.secretsRoot, agentId, `${platform2}.json`);
  }
  read(agentId, platform2) {
    try {
      const parsed2 = JSON.parse((0, import_node_fs80.readFileSync)(this.filePath(agentId, platform2), "utf8"));
      return parsed2 != null && typeof parsed2 === "object" ? parsed2 : {};
    } catch (error42) {
      if (error42.code !== "ENOENT") {
        reportSessionDiagnostic({
          family: "store_db",
          kind: "connector_secrets_unreadable",
          agentId,
          errorClass: errorLogTag(error42)
        });
      }
      return {};
    }
  }
  setSecret(agentId, platform2, field, value) {
    if (!isSafeFolderId(agentId) || !isSafeFolderId(platform2) || field.length === 0) {
      return false;
    }
    const merged = { ...this.read(agentId, platform2), [field]: value };
    writeFileAtomicSync(this.filePath(agentId, platform2), `${JSON.stringify(merged, null, 2)}
`);
    return true;
  }
  getSecret(agentId, platform2, field) {
    if (!isSafeFolderId(agentId) || !isSafeFolderId(platform2)) return null;
    const value = this.read(agentId, platform2)[field];
    return typeof value === "string" && value.length > 0 ? value : null;
  }
  removeAgentPlatform(agentId, platform2) {
    if (!isSafeFolderId(agentId) || !isSafeFolderId(platform2)) return;
    (0, import_node_fs80.rmSync)(this.filePath(agentId, platform2), { force: true });
  }
};

