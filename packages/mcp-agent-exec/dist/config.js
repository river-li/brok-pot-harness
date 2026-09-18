var __awaiter30 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
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
var mcpPlacementSchema = external_exports.enum([
  "server",
  "client"
]);
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
function getMcpConfig(configPath_1) {
  return __awaiter30(this, arguments, void 0, function* (configPath, envLookup = (key) => process.env[key]) {
    try {
      const configString = yield (0, import_promises15.readFile)(configPath, "utf8");
      const raw = parse5(configString);
      const expanded = expandEnvVarsWithLookup2(raw, envLookup);
      return mcpConfigSchema2.parse(expanded);
    } catch (_a20) {
      return { mcpServers: {} };
    }
  });
}
