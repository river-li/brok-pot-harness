/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/folder-id.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isSafeFolderId(id) {
  return typeof id === "string" && id.length > 0 && !id.includes("/") && !id.includes("\\") && !id.includes("\0") && id !== "." && id !== "..";
}

