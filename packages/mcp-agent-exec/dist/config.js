/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/config.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var commandBasedMcpServer = external_exports.object({
  type: external_exports.literal("stdio").optional(),
  command: external_exports.string(),
  args: external_exports.array(external_exports.string()).optional(),
  env: external_exports.record(external_exports.string(), external_exports.string()).optional(),
  cwd: external_exports.string().optional()
});
var mcpAuthConfig = external_exports.object({
  CLIENT_ID: external_exports.string(),
  CLIENT_SECRET: external_exports.string().optional(),
  scopes: external_exports.array(external_exports.string()).optional()
});
var MAX_CA_BUNDLE_LENGTH = 128 * 1024;
var mcpTlsConfig = external_exports.object({
  caBundle: external_exports.string().trim().min(1).max(MAX_CA_BUNDLE_LENGTH)
}).strict();
var mcpPlacementSchema = external_exports.enum(["server", "client"]);
var remoteMcpServer = external_exports.object({
  type: external_exports.enum(["http", "sse"]).optional(),
  url: external_exports.string(),
  headers: external_exports.record(external_exports.string(), external_exports.string()).optional(),
  auth: mcpAuthConfig.optional(),
  tls: mcpTlsConfig.optional(),
  placement: mcpPlacementSchema.optional()
});
var mcpServerSchema = external_exports.union([commandBasedMcpServer, remoteMcpServer]);
var mcpConfigSchema2 = external_exports.object({
  mcpServers: external_exports.record(external_exports.string(), mcpServerSchema)
});

