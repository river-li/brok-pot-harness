/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/mcp-placeholder-variables.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PLACEHOLDER = /\$\{(?:env:([A-Z][A-Z0-9_]*)|([A-Z][A-Z0-9_]*)(?::-([^}]*))?)\}/g;
var LOADER_PROVIDED = /* @__PURE__ */ new Set(["CURSOR_PLUGIN_ROOT", "CLAUDE_PLUGIN_ROOT"]);
var ACRONYMS = /* @__PURE__ */ new Set([
  "api",
  "aws",
  "db",
  "dd",
  "gcp",
  "http",
  "https",
  "id",
  "mcp",
  "ssl",
  "tls",
  "uri",
  "url"
]);
function humanize(name17) {
  return name17.split("_").filter((word) => word.length > 0).map((word) => {
    const lower = word.toLowerCase();
    return ACRONYMS.has(lower) ? word.toUpperCase() : word.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}
function collectFromStrings(value, into) {
  if (typeof value === "string") {
    for (const [, envName, plainName, defaultValue] of value.matchAll(PLACEHOLDER)) {
      const name17 = envName !== null && envName !== void 0 ? envName : plainName;
      if (name17 === void 0 || LOADER_PROVIDED.has(name17) || into.has(name17)) {
        continue;
      }
      const reference = envName === void 0 ? `\${${name17}}` : `\${env:${name17}}`;
      into.set(name17, { reference, defaultValue });
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFromStrings(item, into);
    }
    return;
  }
  if (value !== null && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectFromStrings(nested, into);
    }
  }
}
function inferMcpPlaceholderVariables(config2) {
  if ((config2 === null || config2 === void 0 ? void 0 : config2.mcpServers) === void 0) {
    return void 0;
  }
  const placeholders = /* @__PURE__ */ new Map();
  collectFromStrings(config2.mcpServers, placeholders);
  if (placeholders.size === 0) {
    return void 0;
  }
  const properties = {};
  for (const name17 of [...placeholders.keys()].sort()) {
    const { reference, defaultValue } = placeholders.get(name17);
    properties[name17] = Object.assign({ type: "string", title: humanize(name17), description: defaultValue === void 0 || defaultValue.length === 0 ? `Referenced as \`${reference}\` in this plugin's MCP configuration.` : `Referenced as \`${reference}\` in this plugin's MCP configuration. Defaults to \`${defaultValue}\` when left blank.` }, isSecretPluginVariableName(name17) ? { writeOnly: true } : {});
  }
  return { type: "object", properties };
}

