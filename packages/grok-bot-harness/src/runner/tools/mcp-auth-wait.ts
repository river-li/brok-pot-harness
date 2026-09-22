init_errors();
function armMcpAuthWait(register, emission) {
  if (register == null || emission.variant !== "connect") return;
  let pending;
  try {
    pending = register({ serverId: emission.serverId, connector: emission.connector });
  } catch (error42) {
    reportHostDiagnostic({ kind: "mcp_connect_card_failed", errorClass: errorClassOf(error42) });
    return;
  }
  void pending.catch((error42) => {
    reportHostDiagnostic({ kind: "mcp_connect_card_failed", errorClass: errorClassOf(error42) });
  });
}
