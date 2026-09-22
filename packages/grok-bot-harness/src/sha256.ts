/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/sha256.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto6 = require("node:crypto");
function sha256Hex(data) {
  return (0, import_node_crypto6.createHash)("sha256").update(data).digest("hex");
}
function sha256HexOfText(text2) {
  return (0, import_node_crypto6.createHash)("sha256").update(text2, "utf8").digest("hex");
}

