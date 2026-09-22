/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/host-secret-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs5 = require("node:fs");
init_zod();

// @recovered-fragment 2/2
var hostSecretsSchema = external_exports.object({ machineId: external_exports.string().min(1) });
var machineIdCache;
async function getOrCreateHostMachineId(path31 = getHostSecretsPath()) {
  if (machineIdCache != null) return machineIdCache;
  const existing = await readMachineId(path31);
  if (existing != null) {
    machineIdCache = existing;
    return existing;
  }
  const machineId = crypto.randomUUID();
  await writeMachineId(path31, machineId);
  machineIdCache = machineId;
  return machineId;
}
async function readMachineId(path31) {
  try {
    const raw = await import_node_fs5.promises.readFile(path31, "utf8");
    const parsed2 = hostSecretsSchema.safeParse(JSON.parse(raw));
    return parsed2.success ? parsed2.data.machineId : null;
  } catch (error42) {
    reportFallbackUnlessAbsent("host_secret_store", error42);
    return null;
  }
}
async function writeMachineId(path31, machineId) {
  await writeFileAtomic(path31, JSON.stringify({ machineId }, null, 2));
}

