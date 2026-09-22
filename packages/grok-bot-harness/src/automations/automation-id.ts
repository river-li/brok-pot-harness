/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-id.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function stableAutomationId({
  agentId,
  localId
}) {
  const hex = sha256Hex(Buffer.from(`${agentId}\0${localId}`));
  const variant = (Number.parseInt(hex[16] ?? "0", 16) & 3 | 8).toString(16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(
    13,
    16
  )}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

