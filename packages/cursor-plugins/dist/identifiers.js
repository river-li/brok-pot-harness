/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/identifiers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getPluginDbId(ident) {
  switch (ident.source) {
    case "cursor-first-party":
    case "cursor-third-party":
      return ident.sourceInfo.pluginDbId;
    case "claude-plugin":
    case "user-local":
    case "extension":
      return void 0;
    default: {
      const _exhaustive = ident;
      return void 0;
    }
  }
}

