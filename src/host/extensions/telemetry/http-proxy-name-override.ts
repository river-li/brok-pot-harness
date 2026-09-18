var import_promises72 = require("node:fs/promises");
init_errors();
init_unknown_record();
var MAX_NAME_LENGTH = 128;
var VISIBLE_ASCII = /^[\x21-\x7e]+$/;
function normalizeHttpProxyName(raw) {
  if (typeof raw !== "string") return void 0;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) return void 0;
  if (!VISIBLE_ASCII.test(trimmed)) return void 0;
  return trimmed;
}
function parseOverride(raw) {
  const parsed2 = parseJsonOrUndefined(raw);
  if (!isUnknownRecord(parsed2)) return void 0;
  if (parsed2.schemaVersion !== 1) return void 0;
  const bootId = parsed2.bootId;
  if (typeof bootId !== "string" || bootId.length === 0) return void 0;
  const writtenAtMs = parsed2.writtenAtMs;
  if (typeof writtenAtMs !== "number" || !Number.isFinite(writtenAtMs)) return void 0;
  if (parsed2.name === null) {
    return { schemaVersion: 1, name: null, bootId, writtenAtMs };
  }
  const name17 = normalizeHttpProxyName(parsed2.name);
  if (name17 === void 0) return void 0;
  return { schemaVersion: 1, name: name17, bootId, writtenAtMs };
}
function createHttpProxyNameOverrideStore(path31 = getHttpProxyNameOverridePath()) {
  return {
    read: async (bootId) => {
      let raw;
      try {
        raw = await (0, import_promises72.readFile)(path31, "utf8");
      } catch (error41) {
        const reason = errorLogTag(error41);
        return reason.includes("ENOENT") ? { kind: "absent" } : { kind: "unavailable", reason };
      }
      const override = parseOverride(raw);
      if (override === void 0) return { kind: "stale" };
      if (bootId === void 0 || override.bootId !== bootId) return { kind: "stale" };
      return { kind: "present", override };
    },
    write: async (override) => {
      const record2 = { schemaVersion: 1, ...override };
      try {
        await writeFileAtomic(path31, JSON.stringify(record2));
        return { kind: "written" };
      } catch (error41) {
        return { kind: "unavailable", reason: errorLogTag(error41) };
      }
    }
  };
}
async function resolveStartupHttpProxyName(args) {
  const read = await args.store.read(args.bootId);
  if (read.kind === "present") {
    return { name: read.override.name ?? void 0, source: "override" };
  }
  if (args.envName !== void 0) return { name: args.envName, source: "env" };
  return { name: void 0, source: "unset" };
}
