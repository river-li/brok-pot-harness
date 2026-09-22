/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/prompts/gpt-helpers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function usesGptPersistenceInstructions(modelInfo) {
  return modelInfo?.isGpt5 === true || modelInfo?.isGpt5Family === true || modelInfo?.isGpt51 === true || modelInfo?.isGpt52 === true || modelInfo?.isGpt54 === true || modelInfo?.isGpt55 === true || modelInfo?.isGpt56 === true || modelInfo?.isGpt52Codex === true || modelInfo?.isGpt53Codex === true || modelInfo?.isGpt53CodexSpark === true;
}

