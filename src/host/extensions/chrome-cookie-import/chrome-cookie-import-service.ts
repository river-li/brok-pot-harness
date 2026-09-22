var import_node_child_process12 = require("node:child_process");
var import_node_fs56 = require("node:fs");
var import_promises49 = require("node:fs/promises");
var import_node_os23 = require("node:os");
var import_node_path99 = require("node:path");
var import_node_util10 = require("node:util");
init_errors();
init_unknown_record();
var SAND_COOKIE_IMPORT_TOKEN = "sand-cookie-import-host";
var runFile = (0, import_node_util10.promisify)(import_node_child_process12.execFile);
var SAND_COOKIE_IMPORT_SCRIPT = "/usr/local/bin/sand-cookie-import.mjs";
function resolveImportScript() {
  const bundled = (0, import_node_path99.join)((0, import_node_path99.dirname)(process.argv[1] ?? ""), "box-scripts", "sand-cookie-import.mjs");
  return (0, import_node_fs56.existsSync)(bundled) ? bundled : SAND_COOKIE_IMPORT_SCRIPT;
}
var ChromeCookieImportResultError = class extends SandDomainError {
  name = "ChromeCookieImportResultError";
};
var ChromeCookieImportGateOffError = class extends SandDomainError {
  name = "ChromeCookieImportGateOffError";
};
function asCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null;
}
function parseImportOutcome(stdout) {
  const line = stdout.split("\n").map((candidate) => candidate.trim()).filter((candidate) => candidate.length > 0).at(-1);
  let parsed2 = null;
  try {
    parsed2 = line == null ? null : JSON.parse(line);
  } catch {
    throw new ChromeCookieImportResultError("the cookie-import script's result line is not JSON");
  }
  const record2 = typeof parsed2 === "object" && parsed2 !== null ? parsed2 : {};
  if (typeof record2.error === "string" && record2.error.length > 0) {
    throw new ChromeCookieImportResultError("the cookie-import script reported a failure");
  }
  const injected = asCount(record2.injected);
  if (injected === null) {
    throw new ChromeCookieImportResultError(
      "the cookie-import script reported no usable result line"
    );
  }
  const chromeDebugPorts = asCount(record2.chromeDebugPorts);
  const monitorsReached = asCount(record2.monitorsReached);
  return {
    injected,
    sites: asCount(record2.sites) ?? 0,
    ...chromeDebugPorts != null ? { chromeDebugPorts } : {},
    ...monitorsReached != null ? { monitorsReached } : {}
  };
}
function isChromeCookieRecord(value) {
  if (!isUnknownRecord(value)) return false;
  return typeof value.name === "string" && value.name.length > 0 && typeof value.value === "string" && typeof value.domain === "string" && value.domain.length > 0 && typeof value.path === "string";
}
function createChromeCookieImporter(deps) {
  return {
    inject: async (cookies) => {
      if (!deps.isEnabled()) {
        deps.log("chrome cookie import refused: gate off");
        throw new ChromeCookieImportGateOffError(CHROME_COOKIE_IMPORT_UNAVAILABLE);
      }
      const records2 = cookies.filter(isChromeCookieRecord);
      if (records2.length === 0) return { injected: 0, sites: 0, chromeDebugPorts: 0 };
      const batchPath = await deps.writeBatchFile(JSON.stringify(records2));
      try {
        const stdout = await deps.runImportScript(batchPath);
        return parseImportOutcome(stdout);
      } finally {
        await deps.removeBatchFile(batchPath).catch((error42) => {
          deps.log(`chrome cookie import: could not remove the batch file (${errorLogTag(error42)})`);
        });
      }
    }
  };
}
async function writeCookieBatchToTmp(json3) {
  const dir = await (0, import_promises49.mkdtemp)((0, import_node_path99.join)((0, import_node_os23.tmpdir)(), "sand-cookie-import-"));
  const path31 = (0, import_node_path99.join)(dir, "batch.json");
  await (0, import_promises49.writeFile)(path31, json3, { encoding: "utf-8", mode: 384 });
  return path31;
}
async function removeCookieBatchDir(batchPath) {
  await (0, import_promises49.rm)((0, import_node_path99.dirname)(batchPath), { recursive: true, force: true });
}
async function runCookieImportScript(batchPath) {
  const { stdout } = await runFile(process.execPath, [resolveImportScript()], {
    env: {
      ...process.env,
      SAND_COOKIE_IMPORT_BATCH_PATH: batchPath,
      SAND_COOKIE_IMPORT_TOKEN
    }
  });
  return stdout;
}
