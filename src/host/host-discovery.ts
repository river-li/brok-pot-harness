var import_node_fs27 = require("node:fs");
init_zod();
var discoverySchema = external_exports.object({
  port: external_exports.number().int().positive(),
  pid: external_exports.number().int().positive(),
  startedAt: external_exports.number(),
  scheme: external_exports.enum(GATEWAY_SCHEMES).optional(),
  host: external_exports.string().optional(),
  token: external_exports.string().optional()
});
async function writeGatewayDiscovery(info2, path31 = getGatewayDiscoveryPath()) {
  await writeFileAtomic(path31, JSON.stringify(info2, null, 2));
}
async function clearGatewayDiscovery(path31 = getGatewayDiscoveryPath()) {
  await import_node_fs27.promises.rm(path31, { force: true });
}
