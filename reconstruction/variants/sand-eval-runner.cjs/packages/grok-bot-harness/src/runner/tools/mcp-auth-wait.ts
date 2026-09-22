/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/mcp-auth-wait.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function armMcpAuthWait(register, emission) {
  if (register == null || emission.variant !== "connect") return;
  let pending;
  try {
    pending = register({ serverId: emission.serverId, connector: emission.connector });
  } catch (error3) {
    reportHostDiagnostic({ kind: "mcp_connect_card_failed", errorClass: errorClassOf(error3) });
    return;
  }
  void pending.catch((error3) => {
    reportHostDiagnostic({ kind: "mcp_connect_card_failed", errorClass: errorClassOf(error3) });
  });
}

