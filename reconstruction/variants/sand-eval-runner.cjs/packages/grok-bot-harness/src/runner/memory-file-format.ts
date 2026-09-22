/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/memory-file-format.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto39 = require("node:crypto");
init_zod();
var MEMORY_PROFILE_HEADER = [
  "# About the user",
  "",
  "<!-- Enduring facts: who the user is, how to address them, lasting preferences.",
  "     Kept in mind every turn. Safe to read, grep, and edit.",
  '     One fact per line, as "- (YYYY-MM-DD) <fact>". -->',
  ""
].join("\n");
var MEMORY_LOG_HEADER = [
  "# Memory log",
  "",
  '<!-- Dated facts, one per line as "- (YYYY-MM-DD) <fact>". Safe to read, grep, and edit. -->',
  ""
].join("\n");
function memoryIdFor(content) {
  return (0, import_node_crypto39.createHash)("sha1").update(memoryDedupeKey(content)).digest("hex").slice(0, 16);
}
var MEMORY_EVIDENCE_FILE = /^([0-9a-f-]{36})\.json$/;
function memoryEvidenceFileName(id) {
  return `${id}.json`;
}
function memoryEvidenceIdFromFileName(name17) {
  return MEMORY_EVIDENCE_FILE.exec(name17)?.[1] ?? null;
}
var memoryEvidenceFileSchema = external_exports.object({
  id: external_exports.string().refine((id) => memoryEvidenceIdFromFileName(memoryEvidenceFileName(id)) !== null),
  occurredAt: external_exports.number().finite().nonnegative(),
  user: external_exports.string(),
  assistant: external_exports.string()
});

