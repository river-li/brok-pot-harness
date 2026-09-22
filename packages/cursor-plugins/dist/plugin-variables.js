/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/plugin-variables.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function expandPluginVariables(value, pluginPath) {
  return value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => pluginPath).replace(/\$\{CURSOR_PLUGIN_ROOT\}/g, () => pluginPath);
}

