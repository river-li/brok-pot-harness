/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/schema-version.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SUPPORTED_SCHEMA_IDS = /* @__PURE__ */ new Set([
  "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"
]);
var VERSION_SEGMENT_PATTERN = /^v?(\d+\.\d+(?:\.\d+)?)$/;
function readSchemaId(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return void 0;
  }
  const schema2 = data["$schema"];
  return typeof schema2 === "string" && schema2.length > 0 ? schema2 : void 0;
}
function extractSchemaVersion(id) {
  let segments;
  try {
    segments = new URL(id).pathname.split("/");
  } catch (_a19) {
    segments = id.split("/");
  }
  for (const segment of segments) {
    const match2 = VERSION_SEGMENT_PATTERN.exec(segment);
    if (match2 !== null) {
      return match2[1];
    }
  }
  return void 0;
}
function resolveSchemaVersion(id) {
  var _a19;
  if (id === void 0) {
    return { kind: "absent" };
  }
  if (SUPPORTED_SCHEMA_IDS.has(id)) {
    return { kind: "supported", id, version: (_a19 = extractSchemaVersion(id)) !== null && _a19 !== void 0 ? _a19 : id };
  }
  return { kind: "unsupported", id };
}
function schemaVersionsDisagree(pluginSchemaId, mcpSchemaId) {
  if (pluginSchemaId === void 0 || mcpSchemaId === void 0) {
    return false;
  }
  const pluginVersion = extractSchemaVersion(pluginSchemaId);
  const mcpVersion = extractSchemaVersion(mcpSchemaId);
  if (pluginVersion === void 0 || mcpVersion === void 0) {
    return false;
  }
  return pluginVersion !== mcpVersion;
}

