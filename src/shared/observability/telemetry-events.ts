/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/telemetry-events.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_LOG_KEY = "sand";
var TELEMETRY_DROPPED_EVENT = "sand.telemetry.dropped";
var TELEMETRY_DROP_REASONS = [
  "ship_failed",
  "overflow_evicted",
  "replay_expired",
  "backend_dropped",
  "account_rotated"
];
var TELEMETRY_DROP_UNIT_BY_REASON = {
  ship_failed: "attempts",
  overflow_evicted: "entries",
  replay_expired: "entries",
  backend_dropped: "entries",
  account_rotated: "entries"
};
var TELEMETRY_SHIP_TIMEOUT_EVENT = "sand.telemetry.ship_timeout";
var TURN_START_EVENT = "agent.turn.start";
var TURN_OUTCOME_EVENT = "agent.turn.outcome";
var TURN_OUTCOME_DETAIL_EVENT = "sand.turn.outcome_detail";
var TOOL_CALL_ERROR_EVENT = "sand.tool_call.error";
var TOOL_CALL_STALLED_EVENT = "sand.tool_call.stalled";
var TOOL_CALL_STARTED_EVENT = "sand.tool_call.started";
var TOOL_CALL_COMPLETED_EVENT = "sand.tool_call.completed";
var DYNAMIC_TOOL_CALL_EVENT = "grok_bot.tool_call.dynamic";
var TOOL_CALL_ARGS_REJECTED_EVENT = "sand.tool_call.args_rejected";
var BROWSER_OPERATION_EVENT = "sand.browser.operation";
var COMPUTER_OPERATION_EVENT = "sand.computer.operation";
var APPLE_MESSAGES_TOOL_CALL_EVENT = "sand.apple_messages.tool_call";
var AGENT_DELETE_EVENT = "sand.agent.delete";
var AGENT_ERROR_EVENT = "sand.agent.error";
var AGENT_ERROR_DETAIL_EVENT = "sand.agent.error.detail";
var SUMMARY_LIFECYCLE_EVENT = "sand.summary.lifecycle";
var SUMMARY_PERSISTED_EVENT = "sand.summary.persisted";
var AGENT_IDENTITY_SYNC_EVENT = "sand.agent_identity_sync";
var BOX_STORE_SYNC_EVENT = "sand.box_store_sync";
var BOX_STORE_DB_CAPTURE_EVENT = "sand.box_store_db_capture";
var BOX_STORE_MANIFEST_CONFLICT_EVENT = "sand.box_store_manifest_conflict";
var WORKING_STATE_EXPORT_EVENT = "sand.working_state_export";
var WORKING_STATE_WARM_EVENT = "sand.working_state.warm";
var TRANSCRIPT_PUBLISH_EVENT = "sand.transcript.publish";
var JOURNAL_OUTCOME_EVENT = "sand.journal.outcome";
var HOST_LOG_EVENT = "sand.host.log";
var DESKTOP_LOG_EVENT = "sand.desktop.log";
var BOX_LOG_EVENT = "sand.box.log";
var BOX_LOG_SHIP_EVENT = "sand.box.log_ship";
var DESKTOP_HEALTH_EVENT = "sand.box.desktop_health";
var HOST_STARTUP_EVENT = "sand.host.startup";
var HOST_LIFECYCLE_EVENT = "sand.host.lifecycle";
var HOST_EVENT_LOOP_EVENT = "sand.host.event_loop";
var MCP_AUTH_CLEANUP_EVENT = "sand.mcp_auth_cleanup";
var MCP_DISCOVERY_FAILED_EVENT = "sand.mcp.discovery_failed";
var CONNECTOR_AUTH_EVENT = "sand.connector_auth";
var SKILL_PUBLISH_EDGE_FAILED_EVENT = "sand.skill_publish.edge_failed";
var PLUGIN_SKILLS_SYNC_EVENT = "sand.plugin_skills.sync";
var TEACH_RECORDING_CAP_STOP_FAILED_EVENT = "sand.teach.cap_stop_failed";
var TEACH_RECORDING_START_FAILED_EVENT = "sand.teach.recording_start_failed";
var BOX_COPY_IN_EVENT = "sand.box_copy_in";
var INFERENCE_CREDENTIAL_RENEWAL_EVENT = "sand.inference_credential.renewal";
var DAEMON_PING_EVENT = "sand.box.daemon_ping";
var BOX_BOOT_STAGE_EVENT = "sand.box.boot_stage";
var BOX_BOOT_FAILURE_EVENT = "sand.box.boot_failure";
var EGRESS_TUNNEL_EVENT = "sand.box.egress_tunnel";
var HOST_BOOT_FETCH_EVENT = "sand.box.host_boot_fetch";
var BOX_IMAGE_CHECK_EVENT = "sand.box.image_check";
var EXEC_DAEMON_RESTART_EVENT = "sand.box.exec_daemon_restart";
var BOX_MEMORY_SAMPLE_EVENT = "sand.box.memory_sample";
var BOX_CHROME_PROFILE_SAMPLE_EVENT = "sand.box.chrome_profile_sample";
var BOX_CHROME_LAUNCH_EVENT = "sand.box.chrome_launch";
var BOX_PROCESS_CRASH_EVENT = "sand.box.process_crash";
var SUPERVISOR_RESTART_EVENT = "sand.box.supervisor_restart";
var COOKIE_PERSIST_EVENT = "sand.box.cookie_persist";
var WEB_BOT_AUTH_EVENT = "sand.box.web_bot_auth";
var GATEWAY_COMMAND_ERROR_EVENT = "sand.gateway_command_error";
var GATEWAY_COMMAND_TIMING_EVENT = "sand.gateway_command_timing";
var AUTOMATION_LIFECYCLE_EVENT = "sand.automation.lifecycle";
var AUTOMATION_AGENT_GONE_RECOVERED_EVENT = "sand.automation.agent_gone_recovered";
var AUTOMATION_SHADOW_PRUNE_EVENT = "sand.automation.shadow_prune";
var AUTO_REVIEW_DISPLAY_RECHECK_FAILED_EVENT = "sand.auto_review.display_recheck_failed";
var AUTO_REVIEW_EXPIRE_SWEEP_FAILED_EVENT = "sand.auto_review.expire_sweep_failed";
var MCP_HOST_EDGE_FAILED_EVENT = "sand.mcp.host_edge_failed";
var HOST_CRASH_EVENT = "sand.host.crash";
var HOST_INVARIANT_VIOLATION_EVENT = "sand.host.invariant_violation";
var TURN_INTERRUPT_EVENT = "sand.turn.interrupt";
var TURN_AWAIT_EVENT = "sand.turn.await";
var TURN_RETRY_EVENT = "sand.turn.retry";
var TURN_MEMBER_OUTCOME_EVENT = "sand.turn.member_outcome";
var CLOSING_SEND_NUDGE_EVENT = "sand.turn.closing_send_nudge";
var USER_MESSAGE_RECEIVED_EVENT = "sand.user_message.received";
var SUBAGENT_REVIVAL_EVENT = "sand.subagent.revival";
var SUBAGENT_STALLED_EVENT = "sand.subagent.stalled";
var SHELL_REVIVAL_EVENT = "sand.shell.revival";
var COMPUTER_USE_USAGE_EVENT = "sand.computer_use.usage";
var COMPUTER_USE_DISPATCH_EVENT = "sand.computer_use.dispatch";
var TTFT_EVENT = "sand.ttft";
var SEND_DISPATCH_EVENT = "sand.send_dispatch";
var QUEUE_ACCEPTED_EVENT = "sand.queue.accepted";
var QUEUE_DEQUEUED_EVENT = "sand.queue.dequeued";
var QUEUE_WATCHDOG_EVENT = "sand.queue.watchdog";
var ACK_OBLIGATION_EVENT = "sand.ack.obligation";
var PENDING_WAKE_EVENT = "sand.pending_wake";
var CHROME_SESSION_STAGE_EVENT = "sand.chrome_session_stage";
var COOKIE_ORIGIN_APPROVAL_EVENT = "sand.cookie_origin_approval";
var CREDENTIAL_FILL_OUTCOME_EVENT = "sand.credential_fill.outcome";
var AGENT_OPEN_EVENT = "sand.agent.open";
var HOST_UPGRADE_EVENT = "sand.host.upgrade";
var HTTP_PROXY_NAME_CHANGED_EVENT = "sand.http_proxy.name_changed";
var UPGRADE_RESUME_EVENT = "sand.upgrade_resume";
var TURN_USAGE_EVENT = "sand.turn.usage";
var TURN_PREFIX_DIFF_EVENT = "sand.turn.prefix_diff";
var TURN_WEDGED_REAP_EVENT = "sand.turn.wedged_reap";
var TURN_EMPTY_DELIVERY_EVENT = "sand.turn.empty_delivery";
var TURN_USAGE_SCHEMA_VERSION = "2";
var BOX_RECREATE_DECIDED_EVENT = "sand.box.recreate_decided";
var BOX_HELP_EVENT = "sand.box_help";
var CLIENT_RESOURCE_EVENT = "sand.client_resource";
var POLICY_STOPPED_EVENT = "sand.policy.stopped";
var SESSION_STORE_DB_EVENT = "sand.session.store_db";
var SESSION_MAINTENANCE_EVENT = "sand.session.maintenance";
var SESSION_MATERIALIZE_EVENT = "sand.session.materialize";
var SESSION_SUMMARY_BUILD_EVENT = "sand.session.summary_build";
var CONVERSATION_GC_EVENT = "sand.conversation.gc";
var SEARCH_INDEX_HEALTH_EVENT = "sand.search_index.health";
var HOST_EVENT_BUS_EVENT = "sand.host.event_bus";
var BOX_STORE_DIAGNOSTIC_EVENT = "sand.box_store.diagnostic";
var AUTOMATION_CLOUD_SYNC_EVENT = "sand.automation.cloud_sync";
var MANAGED_SETUP_LOAD_FAILED_EVENT = "sand.managed_setup.load_failed";
var ATTACHMENT_READ_MISS_EVENT = "sand.attachment.read_miss";
var ACTION_AUDIT_DROP_EVENT = "sand.action_audit.drop";
var BOT_TEMPLATE_SHARE_FAILED_EVENT = "sand.bot_template_share.failed";
var REMOTE_AGENT_MESSAGING_FAILED_EVENT = "sand.remote_agent_messaging.failed";
var LOCAL_EXEC_SERVER_BRIDGE_FAILED_EVENT = "sand.local_exec.server_bridge_failed";
var HOST_DIAGNOSTIC_EVENT = "sand.host.diagnostic";
var EXPERIMENTS_DIAGNOSTIC_EVENT = "sand.experiments.diagnostic";
var LOCAL_EXEC_REFUSED_EVENT = "sand.local_exec.refused";
var LOCAL_EXEC_FAILED_EVENT = "sand.local_exec.exec_failed";
var LOCAL_EXEC_CWD_STATES = ["missing", "exists", "unset"];
var LOCAL_EXEC_PROVIDER_EVENT = "sand.local_exec.provider";
var MEMORY_SYNTHESIS_EVENT = "sand.memory.synthesis";
var AGENT_LOOP_DETECTED_EVENT = "sand.agent.loop_detected";
var AGENT_LOOP_MITIGATION_EVENT = "sand.agent.loop_mitigation";
var BOT_BLOCK_EVENT = "sand.bot_block";
var BOT_BLOCK_DETAIL_EVENT = "sand.bot_block_detail";
var BOT_BLOCK_RESOLVED_EVENT = "sand.bot_block_resolved";
var SITE_VISITED_EVENT = "sand.site.visited";
var SITE_VISITED_DETAIL_EVENT = "sand.site.visited_detail";
var WEBAUTHN_PROXY_EVENT = "sand.webauthn_proxy";
var WEBAUTHN_SIGN_ERROR_CLASSES = [
  "no_credentials",
  "pin_not_set",
  "pin_blocked",
  "pin_other",
  "cancelled_or_timeout",
  "unsupported_option",
  "hid_error",
  "ambiguous_credential",
  "bad_options",
  "create_unsupported",
  "platform_api",
  "signer_other",
  "helper_spawn_failed",
  "helper_no_result"
];
var WEBAUTHN_PROVIDER_EVENT = "sand.webauthn_proxy.provider";

