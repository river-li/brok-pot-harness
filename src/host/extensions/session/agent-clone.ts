var import_node_fs78 = require("node:fs");
var import_node_path128 = require("node:path");
init_errors();
var SandAgentCloneError = class extends SandDomainError {
  name = "SandAgentCloneError";
};
var STORE_FILENAME = "store.db";
var AUTOMATION_CONFIG_FILENAME2 = "automation.json";
function listAgentAutomationConfigFiles(automationsDir) {
  let entries;
  try {
    entries = (0, import_node_fs78.readdirSync)(automationsDir, { withFileTypes: true });
  } catch (error41) {
    reportFallbackUnlessAbsent("agent_clone", error41);
    return [];
  }
  const configs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const configPath = (0, import_node_path128.join)(automationsDir, entry.name, AUTOMATION_CONFIG_FILENAME2);
    if (!(0, import_node_fs78.existsSync)(configPath)) continue;
    configs.push({ folderName: entry.name, configPath });
  }
  return configs;
}
function rewriteClonedAgentIdentity(targetDir, newAgentId, includesChatHistory, createAgentDb) {
  const db = createAgentDb((0, import_node_path128.join)(targetDir, STORE_FILENAME), {
    recoverOnCorruption: false,
    rejectIfCorrupt: true
  });
  try {
    db.set("agentId", newAgentId);
    db.setAgentOrigin("user");
    db.clearAgentPurpose();
    db.clearTransientState();
    if (!includesChatHistory) db.clearConversation();
    const avatarPath = (0, import_node_path128.join)(targetDir, CANONICAL_AVATAR_FILENAME);
    const existing = db.getSandProfile();
    db.setSandProfile({
      description: existing.description,
      avatarPath: (0, import_node_fs78.existsSync)(avatarPath) ? avatarPath : null
    });
  } finally {
    db.close();
  }
}
function copyIfPresent(sourcePath, targetPath) {
  if ((0, import_node_fs78.existsSync)(sourcePath)) (0, import_node_fs78.copyFileSync)(sourcePath, targetPath);
}
function cloneStoreDb(sourceDir, targetDir) {
  const sourceDbPath = (0, import_node_path128.join)(sourceDir, STORE_FILENAME);
  if (!(0, import_node_fs78.existsSync)(sourceDbPath)) {
    throw new SandAgentCloneError("This agent's data is missing and can't be duplicated.");
  }
  checkpointSandAgentDb(sourceDbPath);
  (0, import_node_fs78.copyFileSync)(sourceDbPath, (0, import_node_path128.join)(targetDir, STORE_FILENAME));
}
function writeClonedProfile(sourceDir, targetDir, cloneName) {
  const source = readSandProfileFile(getSandProfilePath(sourceDir));
  writeSandProfileFile(getSandProfilePath(targetDir), {
    name: cloneName,
    description: source?.description ?? "",
    title: source?.title ?? "",
    avatarShape: source?.avatarShape ?? "",
    avatarColor: source?.avatarColor ?? "",
    namedBy: "app"
  });
}
function cloneAutomations(sourceDir, targetDir) {
  const targetAutomationsDir = getAgentAutomationsDir(targetDir);
  for (const { folderName, configPath } of listAgentAutomationConfigFiles(
    getAgentAutomationsDir(sourceDir)
  )) {
    const destDir = (0, import_node_path128.join)(targetAutomationsDir, folderName);
    (0, import_node_fs78.mkdirSync)(destDir, { recursive: true });
    (0, import_node_fs78.copyFileSync)(configPath, (0, import_node_path128.join)(destDir, AUTOMATION_CONFIG_FILENAME2));
  }
}
function cloneAvatarFiles(sourceDir, targetDir) {
  resolveDerivedAvatarFilename(
    sourceDir,
    readLegacyProfileAvatarField(getSandProfilePath(sourceDir))
  );
  for (const name17 of listConventionalAvatarFilenames(sourceDir)) {
    (0, import_node_fs78.copyFileSync)((0, import_node_path128.join)(sourceDir, name17), (0, import_node_path128.join)(targetDir, name17));
  }
}
function cloneAgentDir(sourceDir, targetDir, newAgentId, cloneName, createAgentDb) {
  (0, import_node_fs78.mkdirSync)(targetDir, { recursive: true });
  try {
    cloneStoreDb(sourceDir, targetDir);
    writeClonedProfile(sourceDir, targetDir, cloneName);
    copyIfPresent(getSandSettingsPath(sourceDir), getSandSettingsPath(targetDir));
    writeSandSettingsFile(getSandSettingsPath(targetDir), {
      hiddenFromSidebar: false
    });
    cloneAvatarFiles(sourceDir, targetDir);
    cloneAutomations(sourceDir, targetDir);
    rewriteClonedAgentIdentity(targetDir, newAgentId, false, createAgentDb);
  } catch (error41) {
    (0, import_node_fs78.rmSync)(targetDir, { recursive: true, force: true });
    throw error41;
  }
}
