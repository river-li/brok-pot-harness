/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/types.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var noopPluginMetricsLogger = {
  log: () => {
  },
  increment: () => {
  },
  distribution: () => {
  },
  captureException: () => {
  }
};
var mcpServerConfigSchema = external_exports.object({
  command: external_exports.string().optional(),
  args: external_exports.array(external_exports.string()).optional(),
  env: external_exports.record(external_exports.string(), external_exports.string()).optional(),
  url: external_exports.string().optional(),
  headers: external_exports.record(external_exports.string(), external_exports.string()).optional(),
  cwd: external_exports.string().optional(),
  /** Path to .env file to load environment variables from (stdio servers). */
  envFile: external_exports.string().optional(),
  /** Static OAuth client credentials for remote servers. */
  auth: external_exports.object({
    CLIENT_ID: external_exports.string(),
    CLIENT_SECRET: external_exports.string().optional(),
    scopes: external_exports.array(external_exports.string()).optional()
  }).optional(),
  /** Restrict which tools are exposed. If set, unlisted tools are disabled. */
  enabledTools: external_exports.array(external_exports.string()).optional(),
  /**
   * Declared placement for remote servers: whether tool calls and the OAuth
   * grant live on the backend ("server") or the user's machine ("client").
   * Wins over any probed placement when set. Ignored for stdio servers, which
   * are always client-placed.
   */
  placement: external_exports.enum(["server", "client"]).optional()
});
var mcpConfigSchema = external_exports.object({
  mcpServers: external_exports.record(external_exports.string(), mcpServerConfigSchema).optional()
});

