function hostDiagnosticTelemetry(diagnostic) {
  return {
    level: diagnostic.kind === "send_ledger_degraded" ? "error" : "warn",
    event: HOST_DIAGNOSTIC_EVENT,
    metadata: hostDiagnosticMetadata(diagnostic)
  };
}
function hostDiagnosticMetadata(diagnostic) {
  switch (diagnostic.kind) {
    case "brain_docs_compensation_failed":
    case "computer_use_prewarm_skipped":
    case "fallback_taken":
    case "labeling_failed":
    case "scm_connect_surface_failed":
      return {
        kind: diagnostic.kind,
        stage: diagnostic.stage,
        error_class: diagnostic.errorClass
      };
    case "window_guard_refused":
      return { kind: diagnostic.kind, stage: diagnostic.stage };
    case "playwright_mcp_install_failed":
    case "playwright_server_unavailable":
      return {
        kind: diagnostic.kind,
        reason: diagnostic.reason,
        error_class: diagnostic.errorClass
      };
    case "summary_preview_degraded":
      return {
        kind: diagnostic.kind,
        agent_id: diagnostic.agentId,
        error_class: diagnostic.errorClass
      };
    case "transcript_mirror_stale":
      return {
        kind: diagnostic.kind,
        agent_id: diagnostic.agentId,
        reason: diagnostic.reason,
        error_class: diagnostic.errorClass
      };
    case "template_import_cleanup_failed":
      return {
        kind: diagnostic.kind,
        agent_id: diagnostic.agentId,
        stage: diagnostic.stage,
        error_class: diagnostic.errorClass
      };
    case "auto_review_shadow_classify_failed":
    case "automation_floor_probe_failed":
    case "brain_docs_channel_config_corrupt":
    case "loop_mitigation_report_failed":
    case "cloud_agent_updates_stream_failed":
    case "mcp_connect_card_failed":
    case "send_ledger_degraded":
    case "tab_sweep_failed":
    case "window_assignment_persist_failed":
    case "watch_unavailable":
      return { kind: diagnostic.kind, error_class: diagnostic.errorClass };
  }
}
