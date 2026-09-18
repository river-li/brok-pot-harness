function hostExtensionDiagnosticTelemetry(diagnostic) {
  switch (diagnostic.extension) {
    case "box_store":
      return {
        level: "warn",
        event: BOX_STORE_DIAGNOSTIC_EVENT,
        metadata: { kind: diagnostic.kind, error_class: diagnostic.errorClass }
      };
    case "automation_cloud_sync":
      return {
        level: "error",
        event: AUTOMATION_CLOUD_SYNC_EVENT,
        metadata: {
          operation: diagnostic.operation,
          agent_id: diagnostic.agentId,
          error_type: diagnostic.errorType,
          error_code: diagnostic.errorCode
        }
      };
    case "managed_setup":
      return {
        level: diagnostic.kind === "managed_skills" ? "error" : "warn",
        event: MANAGED_SETUP_LOAD_FAILED_EVENT,
        metadata: { kind: diagnostic.kind, error_class: diagnostic.errorClass }
      };
    case "attachments":
      return {
        level: "warn",
        event: ATTACHMENT_READ_MISS_EVENT,
        metadata: {
          kind: diagnostic.kind,
          has_active: String(diagnostic.hasActive)
        }
      };
    case "action_audit":
      return {
        level: "error",
        event: ACTION_AUDIT_DROP_EVENT,
        metadata: { error_class: diagnostic.errorClass }
      };
    case "bot_template_share":
      return {
        level: "error",
        event: BOT_TEMPLATE_SHARE_FAILED_EVENT,
        metadata: { error_class: diagnostic.errorClass }
      };
    case "remote_agent_messaging":
      return {
        level: "error",
        event: REMOTE_AGENT_MESSAGING_FAILED_EVENT,
        metadata: { error_class: diagnostic.errorClass }
      };
    case "local_exec":
      return {
        level: "warn",
        event: LOCAL_EXEC_SERVER_BRIDGE_FAILED_EVENT,
        metadata: { kind: diagnostic.kind, error_class: diagnostic.errorClass }
      };
    case "mcp":
      return {
        level: "info",
        event: MCP_HOST_EDGE_FAILED_EVENT,
        metadata: { leg: diagnostic.leg, error_class: diagnostic.errorClass }
      };
  }
}
