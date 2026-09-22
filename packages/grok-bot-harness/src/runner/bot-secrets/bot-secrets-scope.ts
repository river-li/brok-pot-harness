/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/bot-secrets/bot-secrets-scope.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function subagentHandlesUntrustedContent(subagentType) {
  return isComputerUseSubagentType(subagentType) || isBrowserUseSubagentType(subagentType);
}
function subagentInheritsBotSecrets(subagentType) {
  return !subagentHandlesUntrustedContent(subagentType);
}

