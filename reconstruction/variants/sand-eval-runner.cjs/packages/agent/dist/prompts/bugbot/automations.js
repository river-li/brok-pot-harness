/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/prompts/bugbot/automations.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path41 = __toESM(require("node:path"), 1);
init_dist2();
function automationToolNameToSnakeCase(name17) {
  return name17.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").toLowerCase();
}
var AUTOMATION_MEMORY_DIRECTORY_NAME = "memories";
var AUTOMATION_MEMORY_DEFAULT_FILE = "MEMORIES.md";
var AUTOMATION_MEMORY_INSTRUCTION_MARKER = "__CURSOR_AUTOMATION_MEMORY_INSTRUCTIONS__";
var AUTOMATION_MEMORY_UNAVAILABLE_INSTRUCTION = "Automation memory is unavailable for this run. Do not attempt to read or write memory; continue with the available context and tools.";
function getMountedPathModule(mountPath) {
  return import_node_path41.default.win32.isAbsolute(mountPath) && !import_node_path41.default.posix.isAbsolute(mountPath) ? import_node_path41.default.win32 : import_node_path41.default.posix;
}
function resolveAutomationMemoryDirectory(stores) {
  const automationStore = stores.find((store) => store.kind === MountedAgentStoreKind.PRINCIPAL && store.alias === AGENT_STORE_AUTOMATION_MOUNT_NAME);
  const mountPath = automationStore?.path?.trim();
  if (mountPath === void 0 || mountPath.length === 0) {
    return void 0;
  }
  return getMountedPathModule(mountPath).join(mountPath, AUTOMATION_MEMORY_DIRECTORY_NAME);
}
function buildAutomationMemoryInstruction(memoryDirectory) {
  const pathModule = getMountedPathModule(memoryDirectory);
  const defaultFile = pathModule.join(memoryDirectory, AUTOMATION_MEMORY_DEFAULT_FILE);
  const directoryPrefix = `${memoryDirectory}${pathModule.sep}`;
  return [
    `Your durable memories live in the directory ${memoryDirectory}; use your normal file tools on it.`,
    `At the start of a run, inspect ${directoryPrefix} for prior context. Read ${defaultFile} if it exists, along with any relevant topic files.`,
    "When you learn something that should persist across runs, update those files with ordinary file edits.",
    "Prefer short, factual notes. Re-read a file before rewriting it if another run may have changed it.",
    `Prefer per-topic files under ${directoryPrefix} over one ever-growing note when topics diverge.`,
    "Do not invent a memory tool \u2014 write the files directly."
  ].join(" ");
}
function materializeAutomationMemoryInstruction(automationInstructions, stores) {
  if (!automationInstructions.includes(AUTOMATION_MEMORY_INSTRUCTION_MARKER)) {
    return automationInstructions;
  }
  const memoryDirectory = resolveAutomationMemoryDirectory(stores);
  const replacement = memoryDirectory !== void 0 ? buildAutomationMemoryInstruction(memoryDirectory) : AUTOMATION_MEMORY_UNAVAILABLE_INSTRUCTION;
  return automationInstructions.split(AUTOMATION_MEMORY_INSTRUCTION_MARKER).join(replacement);
}

