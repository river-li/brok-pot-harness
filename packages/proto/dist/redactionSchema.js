/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/redactionSchema.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var REDACTION_SCHEMA = {
  "agent.v1.AdoptArgs": {
    "source_agent_id": "SAFE"
  },
  "agent.v1.AdoptResult": {
    "source_agent_id": "SAFE",
    "target_agent_id": "SAFE",
    "project_root_id": "SAFE",
    "success": "SAFE",
    "error": "CODE"
  },
  "agent.v1.CreateAgentHostSessionRequest": {
    "session_id": "SAFE",
    "session_options": "SAFE",
    "client_instance_id": "SAFE"
  },
  "agent.v1.AgentHostSessionOptions": {
    "workspace_paths": "PATH",
    "worktree_main_path": "PATH",
    "is_glass_root": "SAFE",
    "interaction_policy": "SAFE",
    "owning_project": "CODE",
    "local_subagent_limits": "SAFE",
    "hosted_mcp_routing_enabled": "SAFE",
    "hosted_mcp_local_grant_identifiers": "SAFE"
  },
  "agent.v1.AgentHostLocalSubagentLimits": {
    "max_running": "SAFE"
  },
  "agent.v1.AgentHostOwningProject": {
    "project_agent_id": "SAFE",
    "project_name": "CODE"
  },
  "agent.v1.ListAgentHostSessionsRequest": {
    "include_children": "SAFE",
    "limit": "SAFE",
    "parent_session_id": "SAFE",
    "workspace_paths_filter": "PATH",
    "match_any_workspace_root": "SAFE",
    "owner_client_instance_id": "SAFE",
    "include_owner_unrooted_sessions": "SAFE"
  },
  "agent.v1.WatchAgentHostSessionsRequest": {
    "workspace_paths_filter": "PATH",
    "match_any_workspace_root": "SAFE",
    "owner_client_instance_id": "SAFE",
    "include_owner_unrooted_sessions": "SAFE"
  },
  "agent.v1.HasAgentHostSessionRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.HasAgentHostSessionResponse": {
    "exists": "SAFE"
  },
  "agent.v1.SessionParent": {
    "parent_session_id": "SAFE",
    "parent_tool_call_id": "SAFE",
    "root_session_id": "SAFE"
  },
  "agent.v1.AgentHostSession": {
    "session_id": "SAFE",
    "forked_from_session_id": "SAFE",
    "parent": "SAFE",
    "title": "CODE",
    "updated_at": "SAFE",
    "model_id": "SAFE",
    "running_turn_id": "SAFE",
    "queued_turn_ids": "SAFE",
    "workspace": "SAFE"
  },
  "agent.v1.AgentHostSubagentStarted": {
    "turn_id": "SAFE",
    "parent_tool_call_id": "SAFE",
    "child_session_id": "SAFE",
    "root_session_id": "SAFE"
  },
  "agent.v1.AgentHostSessionDeleted": {
    "session_id": "SAFE"
  },
  "agent.v1.AgentHostWorkspace": {
    "workspace_paths": "PATH",
    "worktree_main_path": "PATH",
    "display_path": "PATH"
  },
  "agent.v1.AgentHostBackgroundTaskCompleted": {},
  "agent.v1.SendAgentHostMessageRequest": {
    "session_id": "SAFE",
    "text": "CODE",
    "model_id": "SAFE",
    "message_id": "SAFE"
  },
  "agent.v1.SendAgentHostActionRequest": {
    "session_id": "SAFE",
    "model_id": "SAFE"
  },
  "agent.v1.SendAgentHostMessageResponse": {
    "turn_id": "SAFE"
  },
  "agent.v1.SendAgentHostActionResponse": {
    "turn_id": "SAFE"
  },
  "agent.v1.ForkAgentHostSessionRequest": {
    "session_id": "SAFE",
    "through_turn_id": "SAFE"
  },
  "agent.v1.ForkAgentHostSessionResponse": {
    "session_id": "SAFE"
  },
  "agent.v1.AttachAgentHostSessionRequest": {
    "session_id": "SAFE",
    "client_instance_id": "SAFE"
  },
  "agent.v1.UpdateAgentHostDaemonAuthRequest": {
    "access_token": "CREDENTIALS",
    "client_instance_id": "SAFE"
  },
  "agent.v1.UpdateAgentHostDaemonAuthResponse": {
    "rejection_reason": "CODE"
  },
  "agent.v1.SetAgentHostSessionTitleRequest": {
    "session_id": "SAFE",
    "title": "CODE"
  },
  "agent.v1.SetAgentHostSessionTitleResponse": {},
  "agent.v1.OpenAgentHostSurfaceChannelRequest": {
    "client_instance_id": "SAFE",
    "workspace_paths": "PATH"
  },
  "agent.v1.AgentHostSurfaceChannelHeartbeat": {
    "epoch_ms": "SAFE"
  },
  "agent.v1.AgentHostSurfaceAuthRefreshRequest": {
    "reason": "CODE"
  },
  "agent.v1.AgentHostSurfaceCallbackInvocation": {
    "callback_id": "SAFE",
    "session_id": "SAFE",
    "target_client_instance_id": "SAFE",
    "root_session_id": "SAFE"
  },
  "agent.v1.RespondAgentHostSurfaceCallbackRequest": {
    "callback_id": "SAFE",
    "client_instance_id": "SAFE"
  },
  "agent.v1.RespondAgentHostSurfaceCallbackResponse": {
    "accepted": "SAFE"
  },
  "agent.v1.PushAgentHostSessionPermissionsRequest": {
    "session_id": "SAFE",
    "client_instance_id": "SAFE"
  },
  "agent.v1.PushAgentHostSessionPermissionsResponse": {
    "accepted": "SAFE"
  },
  "agent.v1.AgentHostSurfaceCallbackError": {
    "message": "CODE",
    "code": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalWriteDetails": {
    "path": "PATH",
    "reason": "CODE",
    "is_new_file": "SAFE",
    "diff_string": "CODE",
    "before": "CODE",
    "after": "CODE",
    "block_reason": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalReadDetails": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.AgentHostSurfaceApprovalShellDetails": {
    "command": "CODE",
    "working_directory": "PATH",
    "timeout": "SAFE",
    "reason": "CODE",
    "hook_source": "SAFE",
    "is_sandbox_available": "SAFE",
    "is_sandbox_enabled": "SAFE",
    "can_allowlist": "SAFE",
    "not_allowed_commands": "CODE",
    "suggested_allowlist_entries": "CODE",
    "smart_mode_approval_reason": "CODE",
    "smart_mode_approval_request_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalDeleteDetails": {
    "path": "PATH"
  },
  "agent.v1.AgentHostSurfaceApprovalMcpDetails": {
    "name": "SAFE",
    "tool_name": "SAFE",
    "provider_identifier": "SAFE",
    "args": "CODE",
    "source": "SAFE",
    "reason": "CODE",
    "hook_source": "SAFE",
    "can_allowlist": "SAFE",
    "smart_mode_approval_reason": "CODE",
    "smart_mode_approval_request_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalOperation": {
    "type": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalRequest": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceApprovalResult": {
    "approved": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.AgentHostSurfaceMcpElicitationRequest": {
    "server_name": "SAFE",
    "tool_name": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceMcpElicitationResult": {},
  "agent.v1.McpElicitationRequest": {
    "request_id": "SAFE",
    "message": "CODE",
    "requested_schema_json": "CODE"
  },
  "agent.v1.McpElicitationResponse": {
    "content": "CODE"
  },
  "agent.v1.AgentHostSurfacePermissionsPullRequest": {},
  "agent.v1.AgentHostSurfacePermissionsSnapshot": {},
  "agent.v1.AgentHostSurfaceConversationSearchRequest": {},
  "agent.v1.AgentHostSurfaceConversationSearchResult": {},
  "agent.v1.AgentHostSurfaceFileChangeNotify": {
    "path": "PATH",
    "before": "CODE",
    "after": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceHookRequest": {
    "step": "SAFE"
  },
  "agent.v1.AgentHostSurfaceHookResult": {},
  "agent.v1.AgentHostSurfaceGitRequest": {},
  "agent.v1.AgentHostSurfaceGitResult": {},
  "agent.v1.AgentHostSurfaceCanvasRequest": {},
  "agent.v1.AgentHostSurfaceCanvasResult": {},
  "agent.v1.AgentHostSurfacePluginsRequest": {},
  "agent.v1.AgentHostSurfacePluginsResult": {},
  "agent.v1.AgentHostSurfaceAgentStoreRequest": {},
  "agent.v1.AgentHostSurfaceAgentStoreResult": {},
  "agent.v1.AgentHostCCPluginSourceInfo": {
    "name": "SAFE",
    "marketplace": "SAFE",
    "github_repo": "PATH",
    "git_url": "PATH",
    "local_path": "PATH",
    "version": "SAFE",
    "raw": "CODE"
  },
  "agent.v1.AgentHostCursorPluginSourceInfo": {
    "name": "SAFE",
    "version": "SAFE",
    "plugin_db_id": "SAFE",
    "configured_variables": "CREDENTIALS",
    "marketplace": "SAFE",
    "marketplace_db_id": "SAFE"
  },
  "agent.v1.AgentHostUserLocalPluginSourceInfo": {
    "name": "SAFE",
    "local_path": "PATH"
  },
  "agent.v1.AgentHostExtensionPluginSourceInfo": {
    "name": "SAFE",
    "local_path": "PATH",
    "extension_id": "SAFE"
  },
  "agent.v1.AgentHostPluginIdentifier": {},
  "agent.v1.AgentHostPluginDescriptor": {
    "install_path": "PATH",
    "load_error": "CODE",
    "display_name": "SAFE",
    "version": "SAFE",
    "description": "CODE",
    "author_name": "SAFE",
    "configured_variables": "CREDENTIALS"
  },
  "agent.v1.AgentHostPluginLoadFailure": {
    "plugin_name": "SAFE",
    "plugin_id": "SAFE",
    "plugin_db_id": "SAFE",
    "marketplace_name": "SAFE",
    "error_message": "CODE"
  },
  "agent.v1.AgentHostPluginsSnapshotArgs": {},
  "agent.v1.AgentHostPluginsSnapshotResult": {},
  "agent.v1.AgentHostPluginsReloadArgs": {},
  "agent.v1.AgentHostPluginsReloadResult": {},
  "agent.v1.AgentHostSurfaceMcpWriterRequest": {},
  "agent.v1.AgentHostSurfaceMcpWriterResult": {},
  "agent.v1.AgentHostSurfaceCloudSubagentCreateOrResume": {},
  "agent.v1.AgentHostSurfaceCloudSubagentRun": {
    "agent_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentRequest": {},
  "agent.v1.AgentHostSurfaceCloudSubagentCreateOrResumeResult": {
    "agent_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentCompleted": {
    "final_message": "CODE",
    "tool_call_count": "SAFE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentBackground": {
    "background_reason": "SAFE",
    "transcript_path": "PATH",
    "final_message": "CODE",
    "tool_call_count": "SAFE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentAborted": {
    "error": "CODE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentFailed": {
    "error": "CODE"
  },
  "agent.v1.AgentHostSurfaceCloudSubagentRunResult": {},
  "agent.v1.AgentHostSurfaceCloudSubagentResult": {},
  "agent.v1.AgentHostSurfaceAdoptRequest": {},
  "agent.v1.AgentHostSurfaceAdoptResult": {},
  "agent.v1.AgentHostSurfaceSavedModelParametersRequest": {
    "model_id": "SAFE",
    "max_mode": "SAFE",
    "root_session_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceSavedModelParametersResult": {},
  "agent.v1.AgentHostSurfaceRequiredGlobalCommandsRequest": {
    "subagent_type": "SAFE",
    "root_session_id": "SAFE"
  },
  "agent.v1.AgentHostSurfaceRequiredGlobalCommandsResult": {},
  "agent.v1.AgentHostSurfaceFindSubagentRequest": {},
  "agent.v1.AgentHostSurfaceFindSubagentResult": {},
  "agent.v1.AgentHostDurableSubagentInvocationRecord": {
    "parent_session_id": "SAFE",
    "root_session_id": "SAFE",
    "parent_tool_call_id": "SAFE",
    "child_session_id": "SAFE",
    "kind": "SAFE",
    "outcome": "CODE"
  },
  "agent.v1.AgentHostSurfaceGlobalCommand": {
    "name": "SAFE",
    "content": "CODE"
  },
  "agent.v1.AgentHostSurfaceRequestContextRequest": {},
  "agent.v1.AgentHostSurfaceRequestContextResult": {},
  "agent.v1.AgentExecPermissions": {
    "allow": "CODE",
    "deny": "CODE",
    "approval_mode": "SAFE",
    "read_boundary": "SAFE",
    "user_sandbox_data_folder_name": "SAFE",
    "dashboard_terminal_allowlist_overridden_by_permissions_file": "SAFE",
    "smart_allowlist_enabled": "SAFE",
    "smart_allowlist_denylist": "CODE",
    "prompt_workspace_writes": "SAFE"
  },
  // Blob IDs are opaque store keys; blob bytes are conversation content.
  "agent.v1.GetAgentHostSessionBlobsRequest": {
    "session_id": "SAFE",
    "blob_ids": "SAFE",
    "max_response_bytes": "SAFE"
  },
  "agent.v1.AgentHostSessionBlob": {
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.GetAgentHostSessionBlobsResponse": {
    "missing_blob_ids": "SAFE",
    "oversize_blob_ids": "SAFE",
    "remaining_blob_ids": "SAFE"
  },
  "agent.v1.GetAgentHostDaemonInfoRequest": {
    "expected_api_schema_revision": "SAFE"
  },
  "agent.v1.GetAgentHostDaemonInfoResponse": {
    "daemon_version": "SAFE",
    "api_schema_revision": "SAFE",
    "listen_address": "PATH",
    "build_identity": "SAFE",
    "capabilities": "SAFE"
  },
  "agent.v1.ShutdownAgentHostDaemonRequest": {
    "reason": "CODE"
  },
  "agent.v1.AgentHostTurnStarted": {
    "turn_id": "SAFE"
  },
  "agent.v1.AgentHostTurnInteractionsSuperseded": {
    "turn_id": "SAFE"
  },
  "agent.v1.AgentHostTurnLifecycle": {
    "turn_id": "SAFE"
  },
  "agent.v1.AgentHostResponseMetadata": {
    "server_region": "SAFE",
    "transport_mode": "SAFE"
  },
  "agent.v1.WatchAgentHostSessionTurnLifecycleRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.AgentHostReconnectTrigger": {
    "error_class": "SAFE",
    "connect_code_name": "SAFE",
    "originating_request_id": "SAFE",
    "attempt_request_id": "SAFE",
    // The retry endpoint can be a URL or provider label and may contain
    // user-specific infrastructure names.
    "endpoint_url": "CODE"
  },
  "agent.v1.AgentHostTurnAwaitingInput": {
    "turn_id": "SAFE",
    "request_id": "SAFE",
    "interaction_id": "SAFE"
  },
  "agent.v1.AgentHostInteractionResolved": {
    "turn_id": "SAFE",
    "interaction_id": "SAFE"
  },
  "agent.v1.AgentHostInteractionCancelled": {
    "reason": "CODE"
  },
  "agent.v1.AgentHostInteractionFailed": {
    "error": "CODE"
  },
  "agent.v1.AgentHostPendingInteraction": {
    "interaction_id": "SAFE",
    "turn_id": "SAFE"
  },
  "agent.v1.WatchAgentHostSessionInteractionsRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.AgentHostTurnSettled": {
    "turn_id": "SAFE",
    "outcome": "SAFE",
    "detail": "CODE",
    "error": "CODE"
  },
  "agent.v1.AgentHostTurnError": {
    "kind": "SAFE",
    "title": "CODE",
    "detail": "CODE",
    "is_retryable": "SAFE",
    "connect_code": "SAFE",
    "inference_request_error_type": "SAFE",
    "request_id": "SAFE",
    "error_details": "CODE",
    "action": "SAFE"
  },
  "agent.v1.AgentHostTurnOptions": {
    "generation_uuid": "SAFE",
    "custom_system_prompt": "CODE",
    "enable_agent_retries": "SAFE",
    "fixed_retry_delay_ms": "SAFE",
    "endless_retries": "SAFE",
    "agent_session_id": "SAFE",
    "is_running_in_test": "SAFE",
    "stall_advisory_timeout_ms": "SAFE",
    "stall_fail_timeout_ms": "SAFE",
    "request_context_blob_transport_mode": "SAFE",
    "request_context_blob_max_bytes": "SAFE",
    "request_context_dynamic_inline_max_bytes": "SAFE",
    "suggest_next_prompt": "SAFE",
    "blob_encryption_key": "CREDENTIALS",
    "request_headers": {
      "key": "SAFE",
      "value": "CREDENTIALS"
    }
  },
  "agent.v1.DeleteAgentHostSessionRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.InterruptAgentHostTurnRequest": {
    "session_id": "SAFE",
    "turn_id": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.CancelQueuedAgentHostTurnRequest": {
    "session_id": "SAFE",
    "turn_id": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.RespondToAgentHostInteractionRequest": {
    "session_id": "SAFE",
    "interaction_id": "SAFE"
  },
  "agent.v1.AgentHostBackgroundWork": {
    "id": "SAFE",
    "kind": "SAFE",
    "state": "SAFE",
    "owner_id": "SAFE",
    // Metadata values include raw subagent/shell titles and working directories
    // (see encodeBackgroundWorkMetadata). Treat as CODE so proto redaction
    // does not log user-derived text/paths as SAFE.
    "metadata": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.WatchAgentHostSessionBackgroundWorkRequest": {
    "session_id": "SAFE",
    "kind": "SAFE",
    "state": "SAFE",
    "owner_id": "SAFE"
  },
  "agent.v1.AbortAgentHostBackgroundWorkRequest": {
    "session_id": "SAFE",
    "work_id": "SAFE"
  },
  "agent.v1.AbortAllAgentHostBackgroundWorkRequest": {
    "session_id": "SAFE",
    "kind": "SAFE",
    "state": "SAFE",
    "owner_id": "SAFE"
  },
  "agent.v1.WatchAgentHostSessionShellOutputRequest": {
    "session_id": "SAFE",
    "shell_id": "SAFE"
  },
  "agent.v1.AgentHostShellOutputSnapshot": {
    "shell_id": "SAFE",
    "command": "CODE",
    "cwd": "PATH",
    "buffered_output": "CODE",
    "tool_call_id": "SAFE",
    "title": "CODE"
  },
  "agent.v1.AgentHostShellOutputChunk": {
    "shell_id": "SAFE",
    "stdout": "CODE",
    "stderr": "CODE"
  },
  "agent.v1.AgentHostShellLifecycle": {
    "shell_id": "SAFE",
    "abort_reason": "CODE"
  },
  "agent.v1.WriteAgentHostSessionShellInputRequest": {
    "session_id": "SAFE",
    "shell_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.NameAgentRequest": {
    "user_message": "CODE"
  },
  "agent.v1.NameAgentResponse": {
    "name": "CODE"
  },
  "agent.v1.UpdateConversationMetadataRequest": {
    "conversation_id": "SAFE",
    "name": "CODE",
    "workspace_paths": "PATH"
  },
  "agent.v1.UpdateConversationMetadataResponse": {},
  "agent.v1.ListLocalSubscriptionToolsRequest": {
    "conversation_id": "SAFE"
  },
  "agent.v1.ListLocalSubscriptionToolsResponse": {},
  "agent.v1.LocalSubscriptionToolDefinition": {
    "tool_name": "SAFE",
    "description": "SAFE",
    "input_schema_json": "SAFE"
  },
  "agent.v1.CallLocalSubscriptionToolRequest": {
    "conversation_id": "SAFE",
    "tool_name": "SAFE",
    "tool_args_json": "CODE"
  },
  "agent.v1.CallLocalSubscriptionToolResponse": {
    "result_json": "CODE",
    "is_error": "SAFE",
    "watch_expires_at_unix_ms": "SAFE"
  },
  "agent.v1.SubscriptionDeliveryEntry": {
    "subscription_id": "SAFE",
    "event_id": "SAFE",
    "inbox_rel_path": "PATH"
  },
  "agent.v1.SubscriptionRemovedEntry": {
    "subscription_id": "SAFE",
    "inbox_rel_path": "PATH"
  },
  "agent.v1.LocalAgentMailboxEntry": {
    "local_agent_mailbox_entry_id": "SAFE"
  },
  "agent.v1.StreamLocalAgentMailboxRequest": {},
  "agent.v1.StreamLocalAgentMailboxRequest.ConversationCursor": {
    "conversation_id": "SAFE",
    "after_offset": "SAFE"
  },
  "agent.v1.LocalAgentMailboxDelivery": {
    "conversation_id": "SAFE",
    "offset": "SAFE"
  },
  "agent.v1.LocalAgentMailboxGap": {
    "conversation_id": "SAFE",
    "after_offset": "SAFE",
    "resume_offset": "SAFE",
    "reason": "SAFE"
  },
  "agent.v1.LocalAgentMailboxEnded": {
    "conversation_id": "SAFE",
    "reason": "SAFE"
  },
  "agent.v1.StreamLocalAgentMailboxHeartbeat": {},
  "agent.v1.StreamLocalAgentMailboxResponse": {},
  "agent.v1.GetPromptContextUsageRequest": {
    "conversation_id": "SAFE",
    "snapshot_blob_id": "SAFE"
  },
  "agent.v1.GetPromptContextUsageResponse": {},
  "agent.v1.CreateTranscriptOverviewRequest": {
    "formatted_conversation": "CODE"
  },
  "agent.v1.CreateTranscriptOverviewResponse": {
    "overview": "CODE"
  },
  "agent.v1.GetUsableModelsRequest": {
    "custom_model_ids": "SAFE"
  },
  "agent.v1.GetAllowedModelIntentsResponse": {
    "model_intents": "SAFE"
  },
  "agent.v1.ShellCommandParsingResult.Redirect": {
    "operator": "SAFE",
    "target_node_type": "SAFE",
    "target_text": "PATH"
  },
  "agent.v1.GetWorkerIdResponse": {
    "worker_id": "SAFE"
  },
  "agent.v1.WatchStatusResponse": {
    "worker_id": "SAFE",
    "status": "SAFE",
    "connected": "SAFE",
    "claimed": "SAFE"
  },
  "agent.v1.BlobEntry": {
    "id": "SAFE",
    "value": "CODE"
  },
  "agent.v1.HookAdditionalContext": {
    "hook_event_name": "SAFE",
    "content": "CODE"
  },
  "agent.v1.SubmittedCustomMode": {
    "id": "PATH",
    "label": "SAFE",
    "source": "SAFE",
    "source_path": "PATH",
    "source_hash": "SAFE",
    "managed_skill_id": "SAFE",
    "plugin_id": "SAFE",
    "plugin_snapshot_token": "CREDENTIALS"
  },
  "agent.v1.CustomModeDescriptor": {
    "id": "PATH",
    "label": "SAFE",
    "description": "CODE",
    "icon": "SAFE",
    "color": "SAFE",
    "source": "SAFE",
    "source_path": "PATH",
    "source_hash": "SAFE",
    "managed_skill_id": "SAFE",
    "plugin_id": "SAFE",
    "plugin_snapshot_token": "CREDENTIALS"
  },
  "agent.v1.SubmittedExitedCustomMode": {
    "id": "PATH",
    "label": "SAFE"
  },
  "agent.v1.PreFetchedBlob": {
    "id": "SAFE",
    "value": "CODE"
  },
  "agent.v1.UploadConversationBlobsRequest": {
    "conversation_id": "SAFE",
    "chunk_index": "SAFE",
    "total_chunks": "SAFE"
  },
  "agent.v1.UploadConversationBlobsResponse": {},
  "agent.v1.LocalPromptQualityInvocation": {
    "invocation_id": "SAFE",
    "attempt_request_id": "SAFE",
    "attempt": "SAFE",
    "started_at": "SAFE",
    "completed_at": "SAFE",
    "model_id": "SAFE",
    "provider_name": "SAFE",
    "status": "SAFE",
    "messages": "CODE",
    "response_messages": "CODE",
    "tools_json": "CODE",
    "prompt_tokens": "SAFE",
    "completion_tokens": "SAFE",
    "total_tokens": "SAFE",
    "token_limit": "SAFE",
    "error_message": "CODE",
    "prompt_tag": "SAFE",
    "feature_type": "SAFE"
  },
  "agent.v1.UploadLocalAgentRunToPromptQualityRequest": {
    "schema_version": "SAFE",
    "generation_uuid": "SAFE",
    "conversation_id": "SAFE",
    "payload_digest": "SAFE",
    "terminal_status": "SAFE",
    "created_at": "SAFE"
  },
  "agent.v1.UploadLocalAgentRunToPromptQualityResponse": {
    "request_id": "SAFE",
    "primary_invocation_id": "SAFE"
  },
  "agent.v1.GetSignedUrlForAttachedMediaRequest": {
    "key": "SAFE",
    "mime_type": "SAFE",
    "conversation_id": "SAFE",
    "content_length_bytes": "SAFE"
  },
  "agent.v1.GetSignedUrlForAttachedMediaResponse": {
    "key": "SAFE",
    "post_url": "CREDENTIALS",
    "post_fields": {
      "key": "SAFE",
      "value": "CREDENTIALS"
    },
    "put_url": "CREDENTIALS",
    "get_url": "CREDENTIALS",
    "expires_at_unix_ms": "SAFE",
    "refresh_after_unix_ms": "SAFE"
  },
  "agent.v1.NotifyConversationCloneRequest": {
    "conversation_id": "SAFE",
    "source_conversation_id": "SAFE",
    "source_request_id": "SAFE"
  },
  "agent.v1.NotifyConversationCloneResponse": {},
  "agent.v1.GetNewChatNudgeLegacyModelPickerRequest": {
    "current_model": "SAFE",
    "max_mode": "SAFE"
  },
  "agent.v1.GetNewChatNudgeLegacyModelPickerResponse": {},
  "agent.v1.NudgeBumpVariant": {
    "banner_message": "SAFE",
    "banner_description": "SAFE"
  },
  "agent.v1.NudgeAskVariant": {
    "popup_message": "SAFE",
    "accept_label": "SAFE"
  },
  "agent.v1.NudgeSilentSwitchVariant": {},
  "agent.v1.NewChatNudge": {
    "nudge_id": "SAFE",
    "target_model": "SAFE",
    "experiment_name": "SAFE"
  },
  "agent.v1.GetNewChatNudgeParameterizedModelPickerRequest": {},
  "agent.v1.GetNewChatNudgeParameterizedModelPickerResponse": {},
  "agent.v1.NewChatNudgeV2": {
    "nudge_id": "SAFE",
    "experiment_name": "SAFE"
  },
  "agent.v1.IdeEditorsStateFile": {
    "relative_path": "PATH",
    "absolute_path": "PATH",
    "current_line_text": "CODE"
  },
  "agent.v1.TaskArgs": {
    "description": "CODE",
    "prompt": "CODE",
    "model": "SAFE",
    "resume": "SAFE",
    "agent_id": "SAFE",
    "attachments": "PATH",
    "mode": "SAFE",
    "responding_to_message_ids": "SAFE",
    "environment": "SAFE"
  },
  "agent.v1.TaskToolCall": {
    "cloud_agent_bc_id": "SAFE"
  },
  "agent.v1.TaskToolCallArgsProto": {
    "description": "CODE",
    "prompt": "CODE",
    "model": "SAFE",
    "subagent_type": "SAFE",
    "resume": "SAFE",
    "attachments": "PATH",
    "environment": "SAFE",
    "cloud_base_branch": "SAFE",
    "cloud_requested_environment_build_id": "SAFE",
    "interrupt": "SAFE"
  },
  "agent.v1.NewCloudVmTarget": {
    "environment_build_id": "SAFE",
    "base_branch": "SAFE"
  },
  "agent.v1.SelfHostedWorkerTarget": {
    "worker_id": "SAFE"
  },
  "agent.v1.SelfHostedPoolTarget": {
    "pool": "SAFE"
  },
  "agent.v1.SelfHostedWorkerLabel": {
    "key": "SAFE",
    "value": "SAFE"
  },
  "agent.v1.CloudSubagentInheritedContext": {
    "automation_run_bc_id": "SAFE",
    "inline_mcp_config_json": "CREDENTIALS",
    "resolved": "SAFE",
    "inline_mcp_config_blob_id": "SAFE"
  },
  "agent.v1.PreparedTaskSubagent": {
    "subagent_id": "SAFE",
    "subagent_type_name": "SAFE",
    "analytics_subagent_type": "SAFE",
    "resolved_model_id": "SAFE",
    "subagent_request_id": "SAFE",
    "tool_call_id": "SAFE",
    "parent_request_id": "SAFE",
    "root_parent_request_id": "SAFE",
    "task_prompt": "CODE",
    "task_description": "CODE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_id": "SAFE",
    "marketplace_id": "SAFE",
    "subagent_source": "SAFE",
    "parent_model_name": "SAFE",
    "result_suffix": "CODE",
    "configured_steps": "SAFE",
    "tool_name": "SAFE",
    "provider_tool_name": "SAFE",
    "prepared_timestamp_unix_ms": "SAFE",
    "cloud_subagent_bc_id": "SAFE",
    "usage_uuid": "SAFE"
  },
  "agent.v1.TaskSuccess": {
    "agent_id": "SAFE",
    "result_suffix": "CODE",
    "transcript_path": "PATH"
  },
  "agent.v1.TaskError": {
    "error": "CODE"
  },
  "agent.v1.ToolCall": {
    "hook_additional_contexts": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.PiTruncation": {
    "truncated_by": "SAFE"
  },
  "agent.v1.PiReadToolArgs": {
    "path": "PATH"
  },
  "agent.v1.PiReadToolSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiReadToolError": {
    "error": "CODE"
  },
  "agent.v1.PiBashToolArgs": {
    "command": "CODE"
  },
  "agent.v1.PiBashToolSuccess": {
    "output": "CODE",
    "full_output_path": "PATH"
  },
  "agent.v1.PiBashToolError": {
    "error": "CODE",
    "full_output_path": "PATH"
  },
  "agent.v1.PiEditReplacement": {
    "old_text": "CODE",
    "new_text": "CODE"
  },
  "agent.v1.PiEditToolArgs": {
    "path": "PATH"
  },
  "agent.v1.PiEditToolSuccess": {
    "output": "CODE",
    "diff": "CODE",
    "patch": "CODE"
  },
  "agent.v1.PiEditToolError": {
    "error": "CODE"
  },
  "agent.v1.PiEditToolRejected": {
    "reason": "CODE"
  },
  "agent.v1.PiWriteToolArgs": {
    "path": "PATH",
    "content": "CODE"
  },
  "agent.v1.PiWriteToolSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiWriteToolError": {
    "error": "CODE"
  },
  "agent.v1.PiWriteToolRejected": {
    "reason": "CODE"
  },
  "agent.v1.PiGrepToolArgs": {
    "pattern": "CODE",
    "path": "PATH",
    "glob": "PATH"
  },
  "agent.v1.PiGrepToolSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiGrepToolError": {
    "error": "CODE"
  },
  "agent.v1.PiFindToolArgs": {
    "pattern": "PATH",
    "path": "PATH"
  },
  "agent.v1.PiFindToolSuccess": {
    "output": "PATH"
  },
  "agent.v1.PiFindToolError": {
    "error": "CODE"
  },
  "agent.v1.PiLsToolArgs": {
    "path": "PATH"
  },
  "agent.v1.PiLsToolSuccess": {
    "output": "PATH"
  },
  "agent.v1.PiLsToolError": {
    "error": "CODE"
  },
  "agent.v1.PiReadExecArgs": {
    "path": "PATH"
  },
  "agent.v1.PiReadExecSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiReadExecError": {
    "error": "CODE"
  },
  "agent.v1.PiBashExecArgs": {
    "command": "CODE"
  },
  "agent.v1.PiBashExecSuccess": {
    "output": "CODE",
    "full_output_path": "PATH"
  },
  "agent.v1.PiBashExecError": {
    "error": "CODE",
    "full_output_path": "PATH"
  },
  "agent.v1.PiEditExecArgs": {
    "path": "PATH"
  },
  "agent.v1.PiEditExecSuccess": {
    "output": "CODE",
    "diff": "CODE",
    "patch": "CODE"
  },
  "agent.v1.PiEditExecError": {
    "error": "CODE"
  },
  "agent.v1.PiEditExecRejected": {
    "reason": "CODE"
  },
  "agent.v1.PiWriteExecArgs": {
    "path": "PATH",
    "content": "CODE"
  },
  "agent.v1.PiWriteExecSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiWriteExecError": {
    "error": "CODE"
  },
  "agent.v1.PiWriteExecRejected": {
    "reason": "CODE"
  },
  "agent.v1.PiGrepExecArgs": {
    "pattern": "CODE",
    "path": "PATH",
    "glob": "PATH"
  },
  "agent.v1.PiGrepExecSuccess": {
    "output": "CODE"
  },
  "agent.v1.PiGrepExecError": {
    "error": "CODE"
  },
  "agent.v1.PiFindExecArgs": {
    "pattern": "PATH",
    "path": "PATH"
  },
  "agent.v1.PiFindExecSuccess": {
    "output": "PATH"
  },
  "agent.v1.PiFindExecError": {
    "error": "CODE"
  },
  "agent.v1.PiLsExecArgs": {
    "path": "PATH"
  },
  "agent.v1.PiLsExecSuccess": {
    "output": "PATH"
  },
  "agent.v1.PiLsExecError": {
    "error": "CODE"
  },
  "agent.v1.SetActiveBranchArgs": {
    "path": "PATH",
    "branch_name": "SAFE"
  },
  "agent.v1.SetActiveBranchError": {
    "error": "CODE"
  },
  "agent.v1.GetPrCodeTourArgs": {
    "tool_call_id": "SAFE",
    "revision_id": "SAFE"
  },
  "agent.v1.PrCodeTourRevisionSnapshot": {
    "revision_id": "SAFE",
    "status": "SAFE",
    "head_sha": "SAFE",
    "feedback": "CODE",
    "updated_at_ms": "SAFE",
    "is_current": "SAFE",
    "markdown": "CODE"
  },
  "agent.v1.GetPrCodeTourError": {
    "error": "CODE"
  },
  "agent.v1.UpdatePrCodeTourArgs": {
    "feedback": "CODE",
    "tool_call_id": "SAFE",
    "base_sha": "SAFE",
    "head_sha": "SAFE",
    "source_revision_id": "SAFE",
    "revision_id": "SAFE",
    "markdown": "CODE",
    "heading": "SAFE",
    "artifact_path": "PATH",
    "artifact_alt": "CODE",
    "scope_commit_hashes": "SAFE",
    "explicit_user_prompt": "CODE"
  },
  "agent.v1.UpdatePrCodeTourSuccess": {
    "revision_id": "SAFE",
    "message": "CODE",
    "execution_mode": "SAFE"
  },
  "agent.v1.UpdatePrCodeTourError": {
    "error": "CODE"
  },
  "agent.v1.RecordCiInvestigationFinding": {
    "check_name": "SAFE",
    "details_url": "PATH",
    "tldr": "CODE",
    "root_cause": "CODE",
    "failing_signal": "CODE",
    "suggested_next_step": "CODE",
    "diff_relation": "SAFE",
    "diff_relation_evidence": "CODE",
    "flake_assessment": "SAFE",
    "flake_evidence": "CODE",
    "rerun_available": "SAFE",
    "rerun_evidence": "CODE",
    "recommended_action": "SAFE",
    "recommended_action_evidence": "CODE",
    "confidence": "SAFE"
  },
  "agent.v1.RecordCiInvestigationOverall": {
    "summary": "CODE",
    "themes": "CODE",
    "recommended_action": "SAFE",
    "recommended_action_evidence": "CODE",
    "check_keys": "SAFE"
  },
  "agent.v1.RecordCiInvestigationFindingsArgs": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.RecordCiInvestigationFindingsSuccess": {
    "message": "CODE"
  },
  "agent.v1.RecordCiInvestigationFindingsError": {
    "error": "CODE"
  },
  "agent.v1.FetchCloudAgentDataArgs": {
    "bc_ids": "SAFE",
    "sources": "SAFE",
    "statuses": "SAFE",
    "active_since": "SAFE"
  },
  "agent.v1.FetchCloudAgentDataSuccess": {
    "summary": "CODE",
    "written_paths": "PATH",
    "unavailable_bc_ids": "SAFE"
  },
  "agent.v1.FetchCloudAgentDataError": {
    "error": "CODE"
  },
  "agent.v1.GetAgentStatusArgs": {
    "tool_call_id": "SAFE",
    "agent_ids": "SAFE"
  },
  "agent.v1.GetAgentStatusWorker": {
    "bc_id": "SAFE",
    "name": "CODE",
    "lifecycle": "SAFE",
    "turn_in_flight": "SAFE",
    "last_terminal_turn_status": "SAFE",
    "pr_url": "SAFE",
    "last_activity_at_ms": "SAFE"
  },
  "agent.v1.GetAgentStatusSuccess": {
    "message": "CODE"
  },
  "agent.v1.GetAgentStatusError": {
    "error": "CODE"
  },
  "agent.v1.GetAgentStatusResult": {},
  "agent.v1.GetAgentStatusToolCall": {},
  "agent.v1.SendToAgentArgs": {
    "tool_call_id": "SAFE",
    "agent_id": "SAFE",
    "message": "CODE",
    "delivery": "SAFE",
    "title": "CODE"
  },
  "agent.v1.SendToAgentSuccess": {
    "worker_bc_id": "SAFE",
    "delivered_as": "SAFE",
    "message": "CODE"
  },
  "agent.v1.SendToAgentError": {
    "error": "CODE"
  },
  "agent.v1.SendToAgentResult": {},
  "agent.v1.SendToAgentToolCall": {},
  "agent.v1.ReadAgentTranscriptArgs": {
    "tool_call_id": "SAFE",
    "agent_id": "SAFE",
    "mode": "SAFE",
    "max_turns": "SAFE"
  },
  "agent.v1.ReadAgentTranscriptSuccess": {
    "transcript": "CODE",
    "truncated": "SAFE"
  },
  "agent.v1.ReadAgentTranscriptError": {
    "error": "CODE"
  },
  "agent.v1.ReadAgentTranscriptResult": {},
  "agent.v1.ReadAgentTranscriptToolCall": {},
  "agent.v1.CreateAgentArgs": {
    "tool_call_id": "SAFE",
    "prompt": "CODE",
    "name": "CODE",
    "model": "SAFE",
    "base_branch": "CODE",
    "machine_type": "SAFE",
    "worker_id": "SAFE",
    "pool": "CODE",
    "labels": "CODE",
    "environment_build_id": "SAFE"
  },
  "agent.v1.CreateAgentSuccess": {
    "agent_id": "SAFE",
    "message": "CODE"
  },
  "agent.v1.CreateAgentError": {
    "error": "CODE",
    "placement_approval_state": "SAFE"
  },
  "agent.v1.CreateAgentResult": {},
  "agent.v1.CreateAgentToolCall": {},
  "agent.v1.RequestAccessSuccess": {
    "decision": "SAFE",
    "message": "CODE"
  },
  "agent.v1.RequestAccessError": {
    "error": "CODE"
  },
  "agent.v1.RequestAccessResult": {},
  "agent.v1.StopAgentArgs": {
    "tool_call_id": "SAFE",
    "agent_id": "SAFE"
  },
  "agent.v1.StopAgentSuccess": {
    "worker_bc_id": "SAFE",
    "message": "CODE"
  },
  "agent.v1.StopAgentError": {
    "error": "CODE"
  },
  "agent.v1.StopAgentResult": {},
  "agent.v1.StopAgentToolCall": {},
  "agent.v1.CommunicateUpdateArgs": {
    "current_step": "CODE",
    "final_summary": "CODE",
    "completed_subtitle": "CODE"
  },
  "agent.v1.CommunicateUpdateSuccess": {
    "current_step": "CODE",
    "message_index": "SAFE"
  },
  "agent.v1.CommunicateUpdateError": {
    "error": "CODE"
  },
  "agent.v1.CloudCanvasToolDiagnostic": {
    "message": "CODE",
    "code": "SAFE"
  },
  "agent.v1.WriteCanvasArgs": {
    "contents": "CODE",
    "canvas_id": "SAFE",
    "title": "CODE"
  },
  "agent.v1.WriteCanvasSuccess": {
    "canvas_id": "SAFE",
    "title": "CODE",
    "url": "PATH"
  },
  "agent.v1.WriteCanvasFailure": {
    "detail": "CODE"
  },
  "agent.v1.ReadCanvasArgs": {
    "canvas_id": "SAFE",
    "url": "PATH"
  },
  "agent.v1.ReadCanvasSuccess": {
    "canvas_id": "SAFE",
    "title": "CODE",
    "url": "PATH",
    "source": "CODE"
  },
  "agent.v1.ReadCanvasFailure": {
    "detail": "CODE"
  },
  "agent.v1.SendMessageText": {
    "content": "CODE"
  },
  "agent.v1.SendMessageAttachment": {
    "url": "PATH",
    "alt": "CODE"
  },
  "agent.v1.SendMessageSuccess": {
    "message_id": "SAFE"
  },
  "agent.v1.SendMessageError": {
    "error": "CODE"
  },
  "agent.v1.SendToUserArgs": {
    "message": "CODE"
  },
  "agent.v1.SendToUserError": {
    "error": "CODE"
  },
  "agent.v1.SendFinalSummaryArgs": {
    "final_summary": "CODE"
  },
  "agent.v1.SendFinalSummarySuccess": {
    "final_summary": "CODE"
  },
  "agent.v1.SendFinalSummaryError": {
    "error": "CODE"
  },
  "agent.v1.CommunicateUpdateHistoryEntry": {
    "step": "CODE",
    "message_index": "SAFE"
  },
  "agent.v1.CommunicateUpdateTurnState": {
    "final_summary": "CODE",
    "completed_subtitle": "CODE"
  },
  "agent.v1.AiAttributionArgs": {
    "file_paths": "PATH",
    "commit_hashes": "SAFE",
    "output_mode": "SAFE",
    "max_commits": "SAFE",
    "include_line_ranges": "SAFE"
  },
  "agent.v1.AiAttributionSuccess": {
    "attribution_text": "CODE",
    "output_location": "PATH"
  },
  "agent.v1.AiAttributionError": {
    "error": "CODE"
  },
  "agent.v1.TruncatedToolCallError": {
    "error": "CODE"
  },
  "agent.v1.AgentConversationTurn": {
    "request_id": "SAFE"
  },
  "agent.v1.AgentConversationTurnStructure": {
    "request_id": "SAFE",
    "encrypted_model": "SAFE",
    // Catalog display name chosen by the router, never user content.
    "routed_model_display_name": "SAFE",
    // Model-facing names of Cursor's own offloaded tools (AwaitShell, ...),
    // never user content.
    "dynamic_tool_names": "SAFE",
    "user_message": "CODE",
    "steps": "CODE",
    "user_message_id": "SAFE"
  },
  "agent.v1.ShellConversationTurnStructure": {
    "shell_command": "CODE",
    "shell_output": "CODE"
  },
  "agent.v1.ShellCommandAction": {
    "exec_id": "SAFE"
  },
  "agent.v1.AsyncAskQuestionCompletionAction": {
    "original_tool_call_id": "SAFE"
  },
  "agent.v1.ConversationAction": {
    "triggering_auth_id": "SAFE",
    "triggering_user_info": "SAFE",
    "request_context_parts": "CODE"
  },
  "agent.v1.PromptTokenBreakdownCategory": {
    "id": "SAFE",
    "label": "SAFE",
    "character_count": "SAFE"
  },
  "agent.v1.PromptTokenBreakdownSnapshot": {},
  "agent.v1.PromptContextSourceRef": {
    "source_type": "SAFE",
    "content_path": "SAFE"
  },
  "agent.v1.PromptContextNode": {
    "id": "SAFE",
    "parent_id": "SAFE",
    "kind": "SAFE",
    "label": "CODE",
    "category_id": "SAFE",
    "inline_content": "CODE"
  },
  "agent.v1.PromptContextUsageTree": {},
  "agent.v1.PromptContextUsageSnapshot": {
    "root_prompt_messages_json": "SAFE"
  },
  "agent.v1.ConversationTokenDetails": {
    "prompt_context_usage_snapshot_blob_id": "SAFE"
  },
  "agent.v1.TriggeringUserInfo": {
    "auth_id": "SAFE",
    "user_id": "SAFE"
  },
  "agent.v1.BackgroundTaskCompletionAction": {
    "system_reminder": "CODE"
  },
  "agent.v1.BackgroundTaskCompletion": {
    "task_id": "SAFE",
    "title": "CODE",
    "detail": "CODE",
    "output_path": "PATH",
    "thread_id": "SAFE",
    "reason": "SAFE",
    "subagent_id": "SAFE",
    "tool_call_id": "SAFE",
    "notification_context": "SAFE",
    "record_only": "SAFE"
  },
  "agent.v1.SubagentDispatchStep": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.SubagentRunState": {
    "parent_tool_call_id": "SAFE",
    "subagent_id": "SAFE",
    "title": "CODE",
    "detail": "CODE",
    "transcript_path": "PATH",
    "output_path": "PATH"
  },
  "agent.v1.UserDisplayInfo": {
    "user_id": "SAFE",
    "display_name": "SAFE",
    "email": "SAFE",
    "profile_picture_url": "SAFE"
  },
  "agent.v1.UserMessage": {
    "text": "CODE",
    "rich_text": "CODE",
    "text_blob_id": "SAFE",
    "rich_text_blob_id": "SAFE",
    "message_id": "SAFE",
    "prompt_reference_id": "SAFE",
    "thread_id": "SAFE",
    "simulated_message_metadata": "CODE",
    "best_of_n_group_id": "SAFE",
    "conversation_state_blob_id": "SAFE",
    "subagent_system_reminder": "CODE",
    "triggering_user_info": "SAFE",
    "hook_additional_contexts": "CODE",
    "project_details": "CODE",
    "started_at_ms": "SAFE",
    "completed_at_ms": "SAFE",
    "sent_by_agent_id": "SAFE"
  },
  "agent.v1.ProjectDetails": {
    "name": "CODE",
    "subagent": "CODE",
    "side_chat": "CODE"
  },
  "agent.v1.ProjectSubagentDetails": {
    "store_dir": "CODE"
  },
  "agent.v1.ProjectSideChatDetails": {
    "store_dir": "CODE"
  },
  "agent.v1.UserMessage.SimulatedMessageMetadata": {
    "fsd_finding_action": "SAFE",
    "task_id": "SAFE",
    "title": "CODE",
    "url": "CODE"
  },
  "agent.v1.SubscriptionEventDisplay": {
    "display_label": "CODE",
    "resource_url": "CODE",
    "subscription_id": "SAFE"
  },
  "agent.v1.AssistantMessage": {
    "text": "CODE",
    "started_at_ms": "SAFE",
    "completed_at_ms": "SAFE"
  },
  "agent.v1.ThinkingMessage": {
    "text": "CODE",
    "started_at_ms": "SAFE",
    "completed_at_ms": "SAFE"
  },
  "agent.v1.InteractionUpdate": {
    "message_started_at_ms": "SAFE"
  },
  "agent.v1.ShellCommand": {
    "command": "CODE"
  },
  "agent.v1.ShellOutput": {
    "stdout": "CODE",
    "stderr": "CODE"
  },
  "agent.v1.ConversationSummary": {
    "summary": "CODE"
  },
  "agent.v1.ConversationSummaryArchive": {
    "summary": "CODE",
    // Note: summarized_messages and summary_message are blob IDs, not actual content
    "summarized_messages": "SAFE",
    "summary_message": "SAFE"
  },
  "agent.v1.ConversationPlan": {
    "plan": "CODE"
  },
  "agent.v1.ConversationSearchArgs": {
    "query": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.AgentStoreConflictArgs": {
    "advance": "SAFE"
  },
  "agent.v1.AgentStoreConflictCursor": {
    "journal_epoch": "SAFE",
    "seq": "SAFE",
    "last_event_id": "SAFE"
  },
  "agent.v1.AgentStoreConflictError": {
    "error": "CODE"
  },
  "agent.v1.AgentStoreConflictEvent": {
    "v": "SAFE",
    "event_id": "SAFE",
    "journal_epoch": "SAFE",
    "seq": "SAFE",
    "ts_ms": "SAFE",
    "kind": "SAFE",
    "store_id": "SAFE",
    "original_rel_path": "PATH",
    "conflict_rel_path": "PATH",
    "original_abs_path": "PATH",
    "conflict_abs_path": "PATH",
    "preserved_bytes": "SAFE",
    "scope_kind": "SAFE",
    "limit_bytes": "SAFE",
    "usage_bytes": "SAFE"
  },
  "agent.v1.AgentStoreConflictSuccess": {
    "gap": "SAFE"
  },
  "agent.v1.ConversationSearchError": {
    "error": "CODE"
  },
  "agent.v1.ConversationSearchHit": {
    "conversation_id": "SAFE",
    "title": "CODE",
    "source": "SAFE",
    "updated_at_ms": "SAFE",
    "snippet": "CODE"
  },
  "agent.v1.ConversationSearchSuccess": {
    "truncated": "SAFE",
    "partial": "SAFE",
    "rebuilding": "SAFE"
  },
  "agent.v1.PlanRegistryEntry": {
    "id": "SAFE",
    "path": "PATH"
  },
  "agent.v1.GoalState": {
    "conversation_id": "SAFE",
    "goal_id": "SAFE",
    "objective": "CODE",
    "status": "SAFE",
    "idle_continuations_without_tool_calls": "SAFE",
    "active_duration_ms": "SAFE",
    "last_accrued_at_ms": "SAFE",
    "continuation_count": "SAFE",
    "agent_session_id": "SAFE"
  },
  "agent.v1.CreateGoalArgs": {
    "objective": "CODE"
  },
  "agent.v1.CreateGoalSuccess": {},
  "agent.v1.GoalError": {
    "error": "CODE"
  },
  "agent.v1.UpdateGoalArgs": {
    "status": "SAFE"
  },
  "agent.v1.UpdateGoalSuccess": {
    "status": "SAFE"
  },
  "agent.v1.TrackedGitRepo": {
    "repo_path": "PATH",
    "branch_name": "SAFE"
  },
  "agent.v1.FileState": {
    "content": "CODE",
    "initial_content": "CODE"
  },
  "agent.v1.FileStateStructure": {
    "content": "CODE",
    "initial_content": "CODE"
  },
  "agent.v1.BackgroundSubagentCompletionAction": {
    "parent_tool_call_id": "SAFE",
    "subagent_id": "SAFE",
    "final_assistant_message": "CODE",
    "transcript_path": "PATH",
    "status_path": "PATH"
  },
  "agent.v1.UserMessageAction": {
    "user_message": "CODE",
    "request_context": "CODE",
    "send_to_interaction_listener": "SAFE",
    "prepend_user_messages": "CODE",
    "backgrounded_tool_call_ids": "SAFE",
    "interrupted_pending_tool_call_resolutions": "CODE",
    "conversation_history": "CODE"
  },
  "agent.v1.SubscriptionNotificationAction": {
    "notifications": "CODE",
    "request_context": "CODE",
    "send_to_interaction_listener": "SAFE"
  },
  "agent.v1.ResumeAction": {
    "request_context": "CODE"
  },
  "agent.v1.InjectContextAction": {
    "injection_id": "SAFE",
    "expected_run_id": "SAFE",
    "user_context": "CODE",
    "system_context": "CODE"
  },
  "agent.v1.UserContextInjection": {
    "user_message": "CODE",
    "request_context": "CODE"
  },
  "agent.v1.SystemContextInjection": {
    "producer": "SAFE",
    "content": "CODE"
  },
  "agent.v1.ContextInjectionState": {
    "queued": "SAFE",
    "delivered": "SAFE",
    "queued_for_next_turn": "SAFE",
    "cancelled": "SAFE",
    "rejected": "SAFE"
  },
  "agent.v1.ContextInjectionQueued": {},
  "agent.v1.ContextInjectionDelivered": {
    "step": "SAFE",
    "delivery_batch_id": "SAFE",
    "delivered_at_ms": "SAFE"
  },
  "agent.v1.ContextInjectionQueuedForNextTurn": {},
  "agent.v1.ContextInjectionCancelled": {},
  "agent.v1.ContextInjectionRejected": {
    "reason": "SAFE"
  },
  "agent.v1.ConversationHistory": {
    "messages": "CODE",
    "replace_user_info": "SAFE"
  },
  "agent.v1.ConversationHistoryMessage": {
    "user": "CODE",
    "assistant": "CODE",
    "tool": "CODE"
  },
  "agent.v1.ConversationHistoryUserMessage": {
    "content": "CODE"
  },
  "agent.v1.ConversationHistoryUserContent": {
    "text": "CODE",
    "image": "CODE"
  },
  "agent.v1.ConversationHistoryTextContent": {
    "text": "CODE"
  },
  "agent.v1.ConversationHistoryImageContent": {
    "data": "CODE",
    "mime_type": "SAFE"
  },
  "agent.v1.ConversationHistoryAssistantMessage": {
    "content": "CODE"
  },
  "agent.v1.ConversationHistoryAssistantContent": {
    "text": "CODE",
    "reasoning": "CODE",
    "redacted_reasoning": "CODE",
    "tool_call": "CODE"
  },
  "agent.v1.ConversationHistoryReasoningContent": {
    "text": "CODE",
    "signature": "CODE"
  },
  "agent.v1.ConversationHistoryRedactedReasoningContent": {
    "data": "CODE"
  },
  "agent.v1.ConversationHistoryToolCall": {
    "tool_call_id": "SAFE",
    "tool_name": "SAFE",
    "args_json": "CODE"
  },
  "agent.v1.ConversationHistoryToolMessage": {
    "tool_call_id": "SAFE",
    "tool_name": "SAFE",
    "content": "CODE",
    "is_error": "SAFE",
    "hook_additional_contexts": "CODE"
  },
  "agent.v1.ConversationHistoryToolResultContent": {
    "text": "CODE",
    "image": "CODE"
  },
  "agent.v1.CancelAction": {
    "reason": "CODE",
    "backgrounded_tool_call_ids": "SAFE",
    "interrupted_pending_tool_call_resolutions": "CODE"
  },
  "agent.v1.CancelSubagentAction": {
    "subagent_id": "SAFE"
  },
  "agent.v1.BackgroundShellAction": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.BackgroundSubagentAction": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.InterruptedPendingToolCallResolution": {
    "tool_call_id": "SAFE",
    "shell_result": "CODE",
    "task_result": "CODE"
  },
  "agent.v1.InterruptedPendingToolCallResolutions": {
    "resolutions": "CODE"
  },
  "agent.v1.CanvasGetUrlArgs": {
    "canvas_id": "SAFE"
  },
  "agent.v1.CanvasGetUrlResult": {
    "url": "SAFE"
  },
  "agent.v1.CanvasRegisterArgs": {
    "path": "PATH"
  },
  "agent.v1.CanvasRegisterSuccess": {
    "canvas_id": "SAFE"
  },
  "agent.v1.CanvasRegisterError": {
    "error": "CODE"
  },
  "agent.v1.CanvasRegisterResult": {},
  "agent.v1.CanvasDestroyArgs": {
    "canvas_id": "SAFE"
  },
  "agent.v1.CanvasDestroyResult": {},
  "agent.v1.ExecutePlanAction": {
    "request_context": "CODE",
    "plan_file_uri": "PATH",
    "plan_file_content": "CODE",
    "kickoff_message_id": "SAFE",
    "plan_id": "SAFE",
    "plan_file_path": "PATH"
  },
  "agent.v1.GoalContinuationAction": {},
  "agent.v1.ExecutePlanInfo": {
    "plan_id": "SAFE",
    "plan_title": "SAFE"
  },
  "agent.v1.ApiKeyCredentials": {
    "api_key": "CREDENTIALS",
    "base_url": "SAFE"
  },
  "agent.v1.ClientLlmGatewayCredential": {
    "bearer_token": "CREDENTIALS"
  },
  "agent.v1.AzureCredentials": {
    "api_key": "CREDENTIALS",
    "base_url": "SAFE",
    "deployment": "SAFE"
  },
  "agent.v1.BedrockCredentials": {
    "access_key": "CREDENTIALS",
    "secret_key": "CREDENTIALS",
    "region": "SAFE",
    "session_token": "CREDENTIALS"
  },
  "agent.v1.ModelDetails": {
    "model_id": "SAFE",
    "display_model_id": "SAFE",
    "display_name": "SAFE",
    "display_name_short": "SAFE",
    "aliases": "SAFE"
  },
  "agent.v1.AgentRunRequest": {
    "conversation_group_id": "SAFE",
    "conversation_id": "SAFE",
    "custom_system_prompt": "CODE",
    "dev_raw_model_slug": "SAFE",
    "harness": "SAFE",
    "computer_use_coordinate_mode": "SAFE",
    "can_create_cloud_subagents": "SAFE",
    "suppress_subagent_progress_update_tool": "SAFE",
    "run_id": "SAFE",
    "agent_session_id": "SAFE",
    // Custom subagent names (user-defined in workspace config) also flow through this field,
    // so classify as CODE since names may contain identifying or project-specific info.
    "subagent_type_name": "CODE",
    "client_llm_gateway_credential": "CREDENTIALS"
  },
  "agent.v1.SystemPromptSpec": {
    // Caller-authored prompt text; same classification as the legacy
    // custom_system_prompt field it supersedes.
    "replace": "CODE",
    "append": "CODE"
  },
  "agent.v1.AgentWebSocketRunIdentity": {
    "run_id": "SAFE",
    "request_id": "SAFE"
  },
  "agent.v1.AgentWebSocketHeader": {
    "name": "SAFE",
    "value": "CREDENTIALS"
  },
  "agent.v1.AgentWebSocketClientMessage": {
    "run_id": "SAFE",
    "message": "CODE"
  },
  "agent.v1.AgentWebSocketClientHalfClose": {
    "run_id": "SAFE"
  },
  "agent.v1.AgentWebSocketCancelRun": {
    "run_id": "SAFE"
  },
  "agent.v1.AgentWebSocketServerMessage": {
    "run_id": "SAFE",
    "message": "CODE"
  },
  "agent.v1.AgentWebSocketConnectErrorDetail": {
    "type_name": "SAFE",
    "binary_value": "CODE"
  },
  "agent.v1.AgentWebSocketConnectError": {
    "raw_message": "CODE"
  },
  "agent.v1.ContextInjectionStateUpdate": {
    "injection_id": "SAFE",
    "state": "SAFE"
  },
  "agent.v1.TextDeltaUpdate": {
    "text": "CODE"
  },
  "agent.v1.RoutedModelUpdate": {
    // Catalog display name of the routed model (e.g. "Opus 4.8"), never user
    // content.
    "display_name": "SAFE"
  },
  "agent.v1.ToolCallStartedUpdate": {
    "call_id": "SAFE",
    "model_call_id": "SAFE"
  },
  "agent.v1.ToolCallCompletedUpdate": {
    "call_id": "SAFE",
    "model_call_id": "SAFE"
  },
  "agent.v1.ToolCallDeltaUpdate": {
    "call_id": "SAFE",
    "model_call_id": "SAFE"
  },
  "agent.v1.PartialToolCallUpdate": {
    "call_id": "SAFE",
    "args_text_delta": "CODE",
    "model_call_id": "SAFE"
  },
  "agent.v1.ThinkingDeltaUpdate": {
    "text": "CODE"
  },
  "agent.v1.SummaryUpdate": {
    "summary": "CODE"
  },
  "agent.v1.PromptSuggestionUpdate": {
    "suggestion": "CODE"
  },
  "agent.v1.ActiveBranchChange": {
    "path": "PATH",
    "branch_name": "SAFE"
  },
  "agent.v1.FeedbackRequestCategory": {
    "id": "SAFE",
    "label": "SAFE"
  },
  "agent.v1.FeedbackRequestCategoryGroup": {
    "id": "SAFE",
    "prompt": "SAFE",
    "categories": "SAFE"
  },
  "agent.v1.FeedbackRequestUpdate": {
    "request_id": "SAFE",
    "canonical_model_name": "SAFE",
    "categories": "SAFE",
    "category_groups": "SAFE",
    "show_form_immediately": "SAFE",
    "title": "SAFE",
    "negative_title": "SAFE",
    "comment_placeholder": "SAFE"
  },
  "agent.v1.ResponseComparisonStarted": {
    "display_order": "SAFE",
    "parent_invocation_id": "SAFE",
    "alternate_invocation_id": "SAFE",
    "parent_response": "CODE",
    "comparison_config_id": "SAFE",
    "alternate_model_id": "SAFE"
  },
  "agent.v1.ResponseComparisonTextDelta": {
    "text": "CODE"
  },
  "agent.v1.ResponseComparisonSkipped": {
    "reason": "SAFE"
  },
  "agent.v1.ResponseComparisonUpdate": {
    "comparison_id": "SAFE",
    "started": "SAFE",
    "text_delta": "CODE",
    "completed": "SAFE",
    "skipped": "SAFE"
  },
  "agent.v1.PostRequestPromptUpdate": {
    "title": "SAFE",
    "message": "SAFE",
    "button_label": "SAFE",
    "button_url": "SAFE"
  },
  "agent.v1.GrokBotNudgeUpdate": {
    // Closed taxonomy label the server picked (e.g. "Inbox & Briefings"). The
    // user's prompt decided which label, but the label itself is one of ten
    // fixed strings, never user content.
    "job": "SAFE",
    // Body copy resolved from server config, authored by us.
    "description": "SAFE"
  },
  "agent.v1.InteractionQuery": {},
  "agent.v1.InteractionResponse": {},
  "agent.v1.ListArtifactsRequest": {
    "extra_paths": "PATH"
  },
  "agent.v1.ListArtifactsResponse": {
    "path_errors": {
      "key": "PATH",
      "value": "CODE"
    }
  },
  "agent.v1.ArtifactPathError": {
    "kind": "SAFE",
    "code": "SAFE",
    "message": "PATH"
  },
  "agent.v1.AskQuestionInteractionQuery": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.ConversationStateStructure": {
    "pending_tool_calls": "CODE",
    "previous_workspace_uris": "PATH",
    "read_paths": "PATH",
    "tracked_git_repo_branches": "CODE",
    "active_branch_name": "SAFE",
    "agent_type": "SAFE",
    "conversation_started_timestamp_ms": "SAFE",
    "conversation_started_time_zone": "SAFE",
    // Opaque tool-call ids (same class as subagent_threads keys); receiver-side
    // dedupe set for at-least-once ask_question answer delivery.
    "completed_ask_question_tool_call_ids": "SAFE",
    "durable_skill_blocks": "CODE",
    "durable_custom_mode_id": "PATH",
    // Note: The following bytes fields are blob IDs (opaque references), not the actual content.
    // The blob IDs themselves are not secret - only the content they reference is.
    "root_prompt_messages_json": "SAFE",
    "turns": "SAFE",
    "todos": "SAFE",
    "summary": "SAFE",
    "plan": "SAFE",
    "summary_archive": "SAFE",
    "file_states": {
      "key": "PATH",
      "value": "SAFE"
      // blob ID reference
    },
    "file_states_v2": {
      "key": "PATH",
      "value": "CODE"
    },
    "summary_archives": "SAFE",
    "plans": {
      "key": "SAFE"
    },
    "communicate_update_history": "CODE",
    "communicate_update_states_by_parent_tool_call_id": {
      "key": "SAFE",
      "value": "CODE"
    },
    "subagent_runs_by_parent_tool_call_id": {
      "key": "SAFE",
      "value": "CODE"
    },
    "communicate_update_final_summary": "CODE",
    "communicate_update_completed_subtitle": "CODE",
    "subagent_states": {
      "key": "SAFE",
      "value": "CODE"
    },
    "subagent_state_refs": {
      "key": "SAFE",
      "value": "SAFE"
      // blob ID reference
    },
    "subagent_threads": {
      "key": "SAFE",
      "value": "SAFE"
    },
    "recent_user_message_ids": "SAFE",
    "recent_user_message_ids_older_turn_count": "SAFE"
  },
  "agent.v1.ShellCommandParsingResult.ExecutableCommandArg": {
    "type": "SAFE",
    "value": "CODE"
  },
  "agent.v1.ShellCommandParsingResult.ExecutableCommand": {
    "name": "CODE",
    "full_text": "CODE"
  },
  "agent.v1.CommandClassifierResult.ClassifiedCommand": {
    "name": "CODE",
    "arguments": "CODE",
    "suggested_allowlist_entry": "CODE",
    "subcommand_tokens": "CODE"
  },
  "agent.v1.ShellArgs": {
    "command": "CODE",
    "working_directory": "PATH",
    "tool_call_id": "SAFE",
    "simple_commands": "CODE",
    "description": "SAFE",
    "smart_mode_approval": "CODE",
    "conversation_id": "SAFE",
    "admin_command_denylist": "CODE",
    "request_id": "SAFE",
    "secret_scope_id": "SAFE"
  },
  "agent.v1.ShellAllowlistPrecheckArgs": {
    "command": "CODE",
    "working_directory": "PATH",
    "parsing_result": "CODE",
    "classifier_result": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.ShellAllowlistPrecheckResult": {
    "allowlisted": "SAFE"
  },
  "agent.v1.WebFetchAllowlistPrecheckArgs": {
    "url": "PATH",
    "tool_call_id": "SAFE"
  },
  "agent.v1.WebFetchAllowlistPrecheckResult": {
    "allowlisted": "SAFE"
  },
  "agent.v1.SmartModeApproval": {
    "request_id": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.ShellHookApprovalRequirement": {
    "kind": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.ShellOutputNotificationConfig": {
    "pattern": "CODE",
    "reason": "CODE",
    "debounce": "SAFE",
    "notification_limit": "SAFE"
  },
  "agent.v1.ForceBackgroundShellArgs": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.ForceBackgroundSubagentArgs": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.SmartModeClassifierArgs": {
    "tool_call_id": "SAFE",
    "parent_conversation_id": "SAFE",
    "target": "CODE",
    "conversation_context": "CODE"
  },
  "agent.v1.SmartModeClassifierConversationMessage": {
    "role": "SAFE",
    "content": "CODE"
  },
  "agent.v1.SmartModeRiskTarget": {
    "action": "SAFE",
    "arguments": "CODE"
  },
  "agent.v1.SmartModeClassifierSuccess": {
    "decision": "SAFE",
    "block_reason": "CODE",
    "proposed_allow_rule": "CODE"
  },
  "agent.v1.SmartModeClassifierError": {
    "error": "CODE"
  },
  "agent.v1.ShellStreamStdout": {
    "data": "CODE"
  },
  "agent.v1.ShellStreamStderr": {
    "data": "CODE"
  },
  "agent.v1.ShellStreamExit": {
    "cwd": "PATH"
  },
  "agent.v1.ShellStreamBackgrounded": {
    "command": "CODE",
    "working_directory": "PATH"
  },
  "agent.v1.ShellStreamHookContext": {
    "hook_additional_contexts": "CODE"
  },
  "agent.v1.OutputLocation": {
    "file_path": "PATH"
  },
  "agent.v1.ShellSuccess": {
    "command": "CODE",
    "working_directory": "PATH",
    "signal": "SAFE",
    "stdout": "CODE",
    "stderr": "CODE",
    "interleaved_output": "CODE",
    "output_head": "CODE",
    "output_tail": "CODE"
  },
  "agent.v1.ShellFailure": {
    "command": "CODE",
    "working_directory": "PATH",
    "signal": "SAFE",
    "stdout": "CODE",
    "stderr": "CODE",
    "interleaved_output": "CODE",
    "output_head": "CODE",
    "output_tail": "CODE"
  },
  "agent.v1.ShellTimeout": {
    "command": "CODE",
    "working_directory": "PATH"
  },
  "agent.v1.ShellRejected": {
    "command": "CODE",
    "working_directory": "PATH",
    "reason": "CODE"
  },
  "agent.v1.ShellPermissionDenied": {
    "command": "CODE",
    "working_directory": "PATH",
    "error": "CODE"
  },
  "agent.v1.ShellSpawnError": {
    "command": "CODE",
    "working_directory": "PATH",
    "error": "CODE"
  },
  "agent.v1.ShellSandboxUnsupported": {
    "command": "CODE",
    "working_directory": "PATH",
    "sandbox_policy_type": "SAFE",
    "reason": "CODE"
  },
  "agent.v1.ShellPartialResult": {
    "stdout_delta": "CODE",
    "stderr_delta": "CODE"
  },
  "agent.v1.ShellResult": {
    "terminals_folder": "PATH"
  },
  "agent.v1.ShellToolCall": {
    "description": "SAFE"
  },
  "agent.v1.ShellToolCallStdoutDelta": {
    "content": "CODE"
  },
  "agent.v1.ShellToolCallStderrDelta": {
    "content": "CODE"
  },
  "agent.v1.ReadToolArgs": {
    "path": "PATH"
  },
  "agent.v1.ReadToolSuccess": {
    "content": "CODE",
    "data": "CODE",
    "path": "PATH",
    "data_blob_id": "SAFE",
    "content_blob_id": "SAFE",
    "related_cursor_rule_paths": "PATH",
    "related_cursor_rules": "CODE"
  },
  "agent.v1.ReadToolError": {
    "error_message": "CODE"
  },
  "agent.v1.ReadArgs": {
    "path": "PATH",
    "tool_call_id": "SAFE",
    "encoding_hint": "SAFE"
  },
  "agent.v1.ReadSuccess": {
    "path": "PATH",
    "content": "CODE",
    "data": "CODE",
    "output_blob_id": "SAFE"
  },
  "agent.v1.ReadError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.ReadRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.ReadFileNotFound": {
    "path": "PATH"
  },
  "agent.v1.ReadPermissionDenied": {
    "path": "PATH"
  },
  "agent.v1.ReadInvalidFile": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.EditArgs": {
    "path": "PATH",
    "stream_content": "CODE"
  },
  "agent.v1.EditSuccess": {
    "path": "PATH",
    "diff_string": "CODE",
    "before_full_file_content": "CODE",
    "after_full_file_content": "CODE",
    "message": "CODE"
  },
  "agent.v1.EditFileNotFound": {
    "path": "PATH"
  },
  "agent.v1.EditReadPermissionDenied": {
    "path": "PATH"
  },
  "agent.v1.EditWritePermissionDenied": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.EditRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.EditError": {
    "path": "PATH",
    "error": "CODE",
    "model_visible_error": "CODE"
  },
  "agent.v1.EditToolCallDelta": {
    "stream_content_delta": "CODE"
  },
  "agent.v1.ReplaceEnvToolCall": {
    "associated_pod_key": "SAFE"
  },
  "agent.v1.ReplaceEnvToolCallDelta": {
    "associated_pod_key": "SAFE"
  },
  "agent.v1.DeleteArgs": {
    "path": "PATH",
    "tool_call_id": "SAFE"
  },
  "agent.v1.DeleteSuccess": {
    "path": "PATH",
    "deleted_file": "PATH",
    "prev_content": "CODE"
  },
  "agent.v1.DeleteFileNotFound": {
    "path": "PATH"
  },
  "agent.v1.DeleteNotFile": {
    "path": "PATH",
    "actual_type": "SAFE"
  },
  "agent.v1.DeletePermissionDenied": {
    "path": "PATH",
    "client_visible_error": "CODE"
  },
  "agent.v1.DeleteFileBusy": {
    "path": "PATH"
  },
  "agent.v1.DeleteRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.DeleteError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.GlobToolArgs": {
    "target_directory": "PATH",
    "glob_pattern": "PATH"
  },
  "agent.v1.GlobToolError": {
    "error": "CODE"
  },
  "agent.v1.GlobToolSuccess": {
    "pattern": "PATH",
    "path": "PATH",
    "files": "PATH"
  },
  "agent.v1.GrepArgs": {
    "pattern": "CODE",
    "path": "PATH",
    "glob": "PATH",
    "output_mode": "SAFE",
    "type": "SAFE",
    "sort": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.GrepError": {
    "error": "CODE"
  },
  "agent.v1.GrepSuccess": {
    "pattern": "CODE",
    "path": "PATH",
    "output_mode": "SAFE",
    "workspace_results": {
      "key": "PATH",
      "value": "CODE"
    }
  },
  "agent.v1.GrepFileCount": {
    "file": "PATH"
  },
  "agent.v1.GrepFilesResult": {
    "files": "PATH"
  },
  "agent.v1.GrepFileMatch": {
    "file": "PATH"
  },
  "agent.v1.GrepContentMatch": {
    "content": "CODE"
  },
  "agent.v1.GrepStream": {
    "pattern": "CODE"
  },
  "agent.v1.LsArgs": {
    "path": "PATH",
    "ignore": "PATH",
    "tool_call_id": "SAFE"
  },
  "agent.v1.LsDirectoryTreeNode": {
    "abs_path": "PATH",
    "full_subtree_extension_counts": {
      "key": "SAFE",
      "value": "SAFE"
    }
  },
  "agent.v1.LsDirectoryTreeNode.File": {
    "name": "PATH"
  },
  "agent.v1.LsError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.LsRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.TerminalMetadata": {
    "cwd": "PATH"
  },
  "agent.v1.TerminalMetadata.Command": {
    "command": "CODE"
  },
  "agent.v1.SemSearchToolArgs": {
    "query": "CODE",
    "target_directories": "PATH",
    "explanation": "CODE"
  },
  "agent.v1.SemSearchToolSuccess": {
    "results": "CODE"
  },
  "agent.v1.SemSearchToolError": {
    "error_message": "CODE"
  },
  "agent.v1.WebSearchArgs": {
    "search_term": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.WebSearchError": {
    "error": "CODE"
  },
  "agent.v1.WebSearchRejected": {
    "reason": "CODE"
  },
  "agent.v1.WebSearchReference": {
    "title": "CODE",
    "url": "SAFE",
    "chunk": "CODE"
  },
  "agent.v1.WebSearchRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "agent.v1.McpAllowlistPrecheckArgs": {
    "provider_identifier": "SAFE",
    "tool_name": "SAFE",
    "tool_call_id": "SAFE",
    "annotations_json": "SAFE"
  },
  "agent.v1.McpAllowlistPrecheckResult": {
    "allowlisted": "SAFE"
  },
  "agent.v1.McpArgs": {
    "name": "SAFE",
    "args": {
      "key": "SAFE"
    },
    "tool_call_id": "SAFE",
    "provider_identifier": "SAFE",
    "tool_name": "SAFE",
    "smart_mode_approval": "CODE",
    "smart_mode_approval_only": "SAFE",
    "skip_approval": "SAFE",
    "server_identifier": "SAFE"
  },
  "agent.v1.McpStateExecArgs": {
    "server_identifiers": "SAFE",
    "kick_only": "SAFE"
  },
  "agent.v1.McpTextContent": {
    "text": "CODE"
  },
  "agent.v1.McpError": {
    "error": "CODE",
    "needs_auth": "SAFE"
  },
  "agent.v1.McpRejected": {
    "reason": "CODE"
  },
  "agent.v1.McpPermissionDenied": {
    "error": "CODE"
  },
  "agent.v1.McpStateServer": {
    "server_name": "SAFE",
    "server_identifier": "SAFE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "status": "SAFE",
    "error_message": "CODE"
  },
  "agent.v1.McpStateError": {
    "error": "CODE"
  },
  "agent.v1.McpStateRejected": {
    "reason": "CODE"
  },
  "agent.v1.ListMcpResourcesExecResult.McpResource": {
    "uri": "PATH",
    "name": "SAFE",
    "description": "CODE",
    "mime_type": "SAFE",
    "server": "SAFE",
    "annotations": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.ListMcpResourcesError": {
    "error": "CODE"
  },
  "agent.v1.ListMcpResourcesRejected": {
    "reason": "CODE"
  },
  "agent.v1.ReadMcpResourceExecArgs": {
    "server": "SAFE",
    "uri": "PATH",
    "download_path": "PATH",
    "tool_call_id": "SAFE",
    "smart_mode_approval": "CODE"
  },
  "agent.v1.ReadMcpResourceSuccess": {
    "uri": "PATH",
    "name": "SAFE",
    "description": "CODE",
    "mime_type": "SAFE",
    "text": "CODE",
    "download_path": "PATH",
    "blob": "CODE",
    "annotations": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.ReadMcpResourceError": {
    "uri": "PATH",
    "error": "CODE"
  },
  "agent.v1.ReadMcpResourceRejected": {
    "uri": "PATH",
    "reason": "CODE"
  },
  "agent.v1.ReadMcpResourceNotFound": {
    "uri": "PATH"
  },
  "agent.v1.McpImageContent": {
    "mime_type": "SAFE",
    "data": "CODE"
  },
  "agent.v1.ListMcpResourcesExecArgs": {
    "server": "SAFE"
  },
  "agent.v1.McpToolCall": {
    "description": "SAFE"
  },
  "agent.v1.McpToolError": {
    "error": "CODE",
    "read_tool_def_reminder": "CODE"
  },
  "agent.v1.McpToolDefinition": {
    "name": "SAFE",
    "provider_identifier": "SAFE",
    "tool_name": "SAFE",
    "description": "CODE",
    "input_schema_json": "SAFE",
    "output_schema_json": "SAFE",
    "annotations_json": "SAFE"
  },
  "agent.v1.McpInstructions": {
    "server_name": "SAFE",
    "instructions": "CODE",
    "server_identifier": "SAFE"
  },
  "agent.v1.McpDescriptor": {
    "server_name": "SAFE",
    "server_identifier": "SAFE",
    "folder_path": "PATH",
    "server_use_instructions": "CODE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_db_id": "SAFE",
    "marketplace_id": "SAFE"
  },
  "agent.v1.McpToolDescriptor": {
    "tool_name": "SAFE",
    "definition_path": "PATH",
    "description": "SAFE",
    "input_schema": "SAFE",
    "input_schema_json": "SAFE",
    "annotations_json": "SAFE"
  },
  "agent.v1.McpFileSystemOptions": {
    "workspace_project_dir": "PATH"
  },
  "agent.v1.AskQuestionArgs": {
    "title": "CODE",
    "async_original_tool_call_id": "SAFE"
  },
  "agent.v1.AskQuestionArgs.Question": {
    "id": "SAFE",
    "prompt": "CODE"
  },
  "agent.v1.AskQuestionArgs.Option": {
    "id": "SAFE",
    "label": "CODE"
  },
  "agent.v1.AskQuestionSuccess.Answer": {
    "question_id": "SAFE",
    "selected_option_ids": "SAFE",
    "freeform_text": "CODE"
  },
  "agent.v1.AskQuestionError": {
    "error_message": "CODE"
  },
  "agent.v1.AskQuestionRejected": {
    "reason": "CODE"
  },
  "agent.v1.AwaitArgs": {
    "task_id": "SAFE",
    "regex": "CODE"
  },
  "agent.v1.AwaitTaskComplete": {
    "task_id": "SAFE",
    "output_file_path": "PATH",
    "regex_match": "CODE",
    "wake_reason": "SAFE"
  },
  "agent.v1.AwaitTaskStillRunning": {
    "task_id": "SAFE",
    "output_file_path": "PATH",
    "regex_match": "CODE",
    "wake_reason": "SAFE"
  },
  "agent.v1.AwaitError": {
    "error": "CODE"
  },
  "agent.v1.TodoItem": {
    "id": "SAFE",
    "content": "CODE",
    "dependencies": "SAFE"
  },
  "agent.v1.UpdateTodosError": {
    "error": "CODE"
  },
  "agent.v1.ReadTodosArgs": {
    "id_filter": "SAFE"
  },
  "agent.v1.ReadTodosError": {
    "error": "CODE"
  },
  "agent.v1.Phase": {
    "name": "CODE"
  },
  "agent.v1.CreatePlanArgs": {
    "plan": "CODE",
    "overview": "CODE",
    "name": "CODE"
  },
  "agent.v1.CreatePlanResult": {
    "plan_uri": "PATH"
  },
  "agent.v1.CreatePlanError": {
    "error": "CODE"
  },
  "agent.v1.CreatePlanRequestQuery": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.SwitchModeArgs": {
    "target_mode_id": "SAFE",
    "explanation": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.SwitchModeSuccess": {
    "from_mode_id": "SAFE",
    "to_mode_id": "SAFE"
  },
  "agent.v1.SwitchModeError": {
    "error": "CODE"
  },
  "agent.v1.SwitchModeRejected": {
    "reason": "CODE"
  },
  "agent.v1.SwitchModeRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "agent.v1.SelectedImage": {
    "uuid": "SAFE",
    "path": "PATH",
    "mime_type": "SAFE",
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.SelectedDocument": {
    "uuid": "SAFE",
    "filename": "PATH",
    "mime_type": "SAFE",
    "path": "PATH",
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.SelectedDocument.BlobIdWithData": {
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.PromptUploadRef": {
    "upload_id": "SAFE"
  },
  "agent.v1.ExtraContextEntry": {
    "data": "CODE",
    "blob_id": "SAFE"
  },
  "agent.v1.SelectedFile": {
    "content": "CODE",
    "path": "PATH",
    "relative_path": "PATH"
  },
  "agent.v1.SelectedCodeSelection": {
    "content": "CODE",
    "path": "PATH",
    "relative_path": "PATH"
  },
  "agent.v1.SelectedTerminal": {
    "content": "CODE",
    "title": "CODE",
    "path": "PATH"
  },
  "agent.v1.SelectedTerminalSelection": {
    "content": "CODE",
    "title": "CODE",
    "path": "PATH"
  },
  "agent.v1.SelectedFolder": {
    "path": "PATH",
    "relative_path": "PATH"
  },
  "agent.v1.SelectedExternalLink": {
    "url": "SAFE",
    "uuid": "SAFE",
    "pdf_content": "CODE",
    "filename": "PATH",
    "blob_id": "SAFE"
  },
  "agent.v1.SelectedGitDiff": {
    "content": "CODE",
    "full_content_length_char_count": "SAFE"
  },
  "agent.v1.SelectedGitDiffFromBranchToMain": {
    "content": "CODE",
    "full_content_length_char_count": "SAFE"
  },
  "agent.v1.SelectedGitCommit": {
    "sha": "SAFE",
    "message": "CODE",
    "description": "CODE",
    "diff": "CODE"
  },
  "agent.v1.SelectedPullRequest": {
    "url": "SAFE",
    "title": "CODE",
    "folder_path": "PATH",
    "summary_json": "CODE",
    "description": "CODE",
    "blob_id": "SAFE"
  },
  "agent.v1.SelectedGitPRDiffSelection": {
    "pr_url": "SAFE",
    "file_path": "PATH",
    "diff_content": "CODE",
    "blob_id": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionCommitParams": {
    "files_to_commit": "PATH",
    "files_to_exclude_from_commit": "PATH",
    "should_stage_all_changes": "SAFE",
    "create_pr_draft": "SAFE",
    "files_to_commit_with_status": "SAFE",
    "files_to_exclude_from_commit_with_status": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionCreateBranchParams": {},
  "agent.v1.SelectedAgenticGitActionPushParams": {
    "files_to_push": "PATH",
    "create_pr_draft": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionFixMergeConflictsParams": {
    "base_branch": "SAFE",
    "pr_url": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionBabysitPrInCloudParams": {
    "base_branch": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionUpdateBranchParams": {
    "base_branch": "SAFE"
  },
  "agent.v1.SelectedAgenticGitActionPullLocallyParams": {
    "remote_branch": "SAFE"
  },
  "agent.v1.SelectedAgenticGitAction": {
    "commit_params": "SAFE",
    "commit_and_push_params": "SAFE",
    "push_params": "SAFE",
    "create_pr_params": "SAFE",
    "create_pr_with_changes_params": "SAFE",
    "create_branch_and_commit_params": "SAFE",
    "create_branch_commit_and_push_params": "SAFE",
    "create_branch_params": "SAFE",
    "fix_merge_conflicts_params": "SAFE",
    "babysit_pr_in_cloud_params": "SAFE",
    "update_branch_params": "SAFE",
    "apply_locally_params": "SAFE",
    "checkout_branch_params": "SAFE",
    "branch_context": "SAFE",
    "path_to_template_file": "PATH",
    "path_to_template_dir": "PATH"
  },
  "agent.v1.SelectedAgenticGitFileWithStatus": {
    "path": "PATH",
    "status": "SAFE"
  },
  "agent.v1.SelectedGitBranchContext": {
    "current_branch": "SAFE",
    "base_branch": "SAFE",
    "agent_branch_prefix": "SAFE"
  },
  "agent.v1.SelectedCursorCommand": {
    "name": "SAFE",
    "content": "CODE",
    "full_path": "PATH",
    "display_name": "SAFE"
  },
  "agent.v1.SelectedPluginCapabilityRef": {
    "plugin_id": "SAFE",
    "capability_type": "SAFE",
    "source_path": "PATH",
    "snapshot_token": "CREDENTIALS",
    "resolved_commit_sha": "SAFE"
  },
  "agent.v1.SelectedDocumentation": {
    "doc_id": "SAFE",
    "name": "SAFE"
  },
  "agent.v1.SelectedPastChat": {
    "agent_id": "SAFE",
    "name": "SAFE"
  },
  "agent.v1.RecentAgent": {
    "name": "SAFE",
    "path": "PATH",
    "overview": "CODE"
  },
  "agent.v1.CallFrame": {
    "function_name": "CODE",
    "url": "SAFE"
  },
  "agent.v1.StackTrace": {
    "raw_stack_trace": "CODE"
  },
  "agent.v1.SelectedConsoleLog": {
    "message": "CODE",
    "level": "SAFE",
    "client_name": "SAFE",
    "session_id": "SAFE",
    "object_data_json": "CODE"
  },
  "agent.v1.SelectedUIElement": {
    "element": "CODE",
    "xpath": "CODE",
    "text_content": "CODE",
    "extra": "CODE",
    "component": "CODE",
    "component_props_json": "CODE"
  },
  "agent.v1.SelectedContext": {
    "extra_context": "CODE",
    "cursor_commands": "CODE",
    "selected_subagents": "SAFE",
    "selected_skills": "CODE"
  },
  "agent.v1.InvocationContext.MicrosoftTeamsThread": {
    "thread": "CODE",
    "channel_name": "SAFE",
    "team_name": "SAFE",
    "channel_description": "CODE",
    "team_description": "CODE"
  },
  "agent.v1.InvocationContext.SlackThread": {
    "thread": "CODE",
    "channel_name": "SAFE",
    "channel_purpose": "CODE",
    "channel_topic": "CODE",
    "sender_name": "CODE",
    "sender_id": "SAFE",
    "sender_type": "SAFE"
  },
  "agent.v1.InvocationContext.GithubPR": {
    "title": "CODE",
    "description": "CODE",
    "comments": "CODE",
    "ci_failures": "CODE"
  },
  "agent.v1.InvocationContext.IdeState.File": {
    "path": "PATH",
    "relative_path": "PATH",
    "active_command": "CODE"
  },
  "agent.v1.InvocationContext.IdeState.File.CursorPosition": {
    "text": "CODE"
  },
  "agent.v1.InvocationContext.IdeState.ViewedPullRequest": {
    "url": "SAFE",
    "title": "CODE",
    "folder_path": "PATH",
    "summary_json": "CODE",
    "description": "CODE"
  },
  "agent.v1.RequestContextArgs": {
    "notes_session_id": "SAFE",
    "workspace_id": "SAFE",
    "read_only_pinned_tree_sha": "SAFE",
    "read_only_plugin_cache_root": "PATH"
  },
  "agent.v1.RequestContextError": {
    "error": "CODE"
  },
  "agent.v1.RequestContextRejected": {
    "reason": "CODE"
  },
  "agent.v1.ImageProto": {
    "uuid": "SAFE",
    "path": "PATH",
    "task_specific_description": "CODE",
    "mime_type": "SAFE",
    "data": "CODE"
  },
  "agent.v1.GitRepoInfo": {
    "path": "PATH",
    "status": "CODE",
    "branch_name": "PATH",
    "remote_url": "PATH",
    "previous_branch_is_ancestor": "SAFE",
    "is_origin_backed": "SAFE"
  },
  "agent.v1.RequestContextEnv": {
    "artifacts_folder": "PATH",
    "process_working_directory": "PATH",
    "os_version": "SAFE",
    "workspace_paths": "PATH",
    "shell": "SAFE",
    "terminals_folder": "PATH",
    "agent_shared_notes_folder": "PATH",
    "agent_conversation_notes_folder": "PATH",
    "time_zone": "SAFE",
    "project_folder": "PATH",
    "agent_transcripts_folder": "PATH",
    "sandbox_network_has_defaults": "SAFE",
    "sandbox_network_explicit_allowlist": "SAFE",
    "computer_use_supported": "SAFE",
    "dev_force_next_smart_mode_classifier_block_token": "CREDENTIALS",
    "dev_delay_next_smart_mode_classifier_token": "CREDENTIALS",
    "dev_mock_prompt_time": "SAFE"
  },
  "agent.v1.MountedAgentStore": {
    "path": "PATH",
    "alias": "PATH",
    "kind": "SAFE",
    "read_only": "SAFE",
    "inherited_from_path": "PATH"
  },
  "agent.v1.UserAgentStoreWebContext": {
    "store_id": "SAFE",
    "portal_base_url": "SAFE"
  },
  "agent.v1.DebugModeConfig": {
    "log_path": "PATH",
    "server_endpoint": "SAFE",
    "session_id": "SAFE"
  },
  "agent.v1.SkillDescriptor": {
    "name": "SAFE",
    "description": "CODE",
    "folder_path": "PATH",
    "parse_error": "CODE",
    "readme_file_path": "PATH"
  },
  "agent.v1.RequestContext": {
    "admin_command_denylist": "CODE",
    "commit_attribution_message": "CODE",
    "conversation_notes_listing": "CODE",
    "git_repo_info_complete": "SAFE",
    "pr_attribution_message": "CODE",
    "shared_notes_listing": "CODE",
    "cloud_rule": "CODE",
    "user_intent_summary": "CODE",
    "file_contents": {
      "key": "PATH",
      "value": "CODE"
    },
    "hooks_additional_context": "CODE",
    "hook_additional_contexts": "CODE",
    "custom_subagents": "SAFE",
    "disabled_team_rules": "PATH"
  },
  "agent.v1.RequestContextPartReferences": {
    "rules_blob_id": "SAFE",
    "rules_byte_length": "SAFE",
    "skills_blob_id": "SAFE",
    "skills_byte_length": "SAFE",
    "subagents_blob_id": "SAFE",
    "subagents_byte_length": "SAFE",
    "mcps_blob_id": "SAFE",
    "mcps_byte_length": "SAFE",
    "dynamic_context": "CODE"
  },
  "agent.v1.RequestContextRulesPart": {
    "rules": "CODE",
    "non_file_rules": "CODE",
    "cloud_rule": "CODE"
  },
  "agent.v1.RequestContextSkillsPart": {
    "agent_skills": "CODE",
    "skill_options": "CODE"
  },
  "agent.v1.RequestContextSubagentsPart": {
    "custom_subagents": "CODE"
  },
  "agent.v1.RequestContextMcpsPart": {
    "tools": "CODE",
    "mcp_instructions": "CODE",
    "mcp_file_system_options": "CODE",
    "mcp_meta_tool_options": "CODE"
  },
  "agent.v1.RecentlyAddedPlugin": {
    "display_name": "SAFE",
    "description": "CODE",
    "mcp_servers": "SAFE"
  },
  "agent.v1.MatchedInstalledPlugin": {
    "display_name": "SAFE",
    "description": "CODE",
    "matched_keyword": "SAFE",
    "mcp_servers": "SAFE"
  },
  "agent.v1.RecentlyAddedPlugin.CapabilityDescriptor": {
    "name": "SAFE",
    "description": "CODE"
  },
  "agent.v1.PrecomputedHumanChange": {
    "path": "PATH"
  },
  "agent.v1.PrecomputedHumanChangeRenderedDiff": {
    "before_context_lines": "CODE",
    "removed_lines": "CODE",
    "added_lines": "CODE",
    "after_context_lines": "CODE"
  },
  "agent.v1.HooksConfigInfo": {
    "configured_steps": "SAFE"
  },
  "agent.v1.PermissionsAutoRunInstructions": {
    "allow_instructions": "CODE",
    "block_instructions": "CODE"
  },
  "agent.v1.CursorRuleTypeFileGlobs": {
    "globs": "PATH"
  },
  "agent.v1.CursorRuleTypeAgentFetched": {
    "description": "CODE"
  },
  "agent.v1.CursorRule": {
    "full_path": "PATH",
    "content": "CODE",
    "git_remote_origin": "PATH",
    "parse_error": "CODE",
    "environments": "SAFE",
    "disabled_environments": "SAFE",
    "scoped_to": "SAFE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_id": "SAFE",
    "marketplace_id": "SAFE",
    "frontmatter": "CODE"
  },
  "agent.v1.AgentSkill": {
    "full_path": "PATH",
    "content": "CODE",
    "description": "CODE",
    "parse_error": "CODE",
    "environments": "SAFE",
    "disabled_environments": "SAFE",
    "scoped_to": "SAFE",
    "git_remote_origin": "PATH",
    "disable_model_invocation": "SAFE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_id": "SAFE",
    "marketplace_id": "SAFE",
    "globs": "PATH"
  },
  "agent.v1.AgentSkillMetadata": {
    "full_path": "PATH",
    "description": "CODE",
    "parse_error": "CODE",
    "environments": "SAFE",
    "disabled_environments": "SAFE",
    "scoped_to": "SAFE",
    "git_remote_origin": "PATH",
    "disable_model_invocation": "SAFE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_id": "SAFE",
    "marketplace_id": "SAFE",
    "globs": "PATH"
  },
  "agent.v1.SubagentTypeCustom": {
    "name": "SAFE"
  },
  "agent.v1.CustomSubagent": {
    "full_path": "PATH",
    "name": "SAFE",
    "description": "CODE",
    "tools": "SAFE",
    "model": "SAFE",
    "prompt": "CODE",
    "plugin": "SAFE",
    "marketplace": "SAFE",
    "plugin_id": "SAFE",
    "marketplace_id": "SAFE",
    "source": "SAFE"
  },
  "agent.v1.FetchArgs": {
    "url": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.FetchSuccess": {
    "url": "SAFE",
    "content": "CODE",
    "content_type": "SAFE"
  },
  "agent.v1.FetchError": {
    "url": "SAFE",
    "error": "CODE"
  },
  "agent.v1.GenerateImageArgs": {
    "description": "CODE",
    "file_path": "PATH",
    "reference_image_paths": "PATH",
    "aspect_ratio": "SAFE"
  },
  "agent.v1.GenerateImageSuccess": {
    "file_path": "PATH",
    "image_data": "CODE"
  },
  "agent.v1.GenerateImageError": {
    "error": "CODE"
  },
  "agent.v1.GenerateImageRequestQuery": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.GenerateImageRequestResponse.Approved": {
    "description": "CODE"
  },
  "agent.v1.GenerateImageRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "agent.v1.GetMcpToolsArgs": {
    "server": "SAFE",
    "tool_name": "SAFE",
    "pattern": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.GetMcpToolsSuccess": {
    "content": "CODE",
    "output_file_path": "PATH"
  },
  "agent.v1.GetMcpToolsError": {
    "error": "CODE"
  },
  "agent.v1.ClickAction": {
    "modifier_keys": "SAFE"
  },
  "agent.v1.DragAction": {
    "modifier_keys": "SAFE"
  },
  "agent.v1.ScrollAction": {
    "modifier_keys": "SAFE"
  },
  "agent.v1.TypeAction": {
    "text": "CODE"
  },
  "agent.v1.KeyAction": {
    "key": "SAFE"
  },
  "agent.v1.ComputerUseArgs": {
    "tool_call_id": "SAFE",
    "description": "CODE",
    "desktop_lease_actor_id": "SAFE"
  },
  "agent.v1.ComputerUseSuccess": {
    "screenshot": "CODE",
    "log": "CODE",
    "screenshot_path": "PATH"
  },
  "agent.v1.ComputerUseError": {
    "error": "CODE",
    "log": "CODE",
    "screenshot": "CODE",
    "screenshot_path": "PATH"
  },
  "agent.v1.ReflectArgs": {
    "unexpected_action_outcomes": "CODE",
    "relevant_instructions": "CODE",
    "scenario_analysis": "CODE",
    "critical_synthesis": "CODE",
    "next_steps": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.ReflectError": {
    "error": "CODE"
  },
  "agent.v1.ApplyAgentDiffArgs": {
    "agent_id": "SAFE"
  },
  "agent.v1.AppliedAgentChange": {
    "path": "PATH",
    "before_content": "CODE",
    "after_content": "CODE",
    "error": "CODE",
    "message_for_model": "CODE"
  },
  "agent.v1.ApplyAgentDiffError": {
    "error": "CODE"
  },
  "agent.v1.ReadLintsToolArgs": {
    "paths": "PATH"
  },
  "agent.v1.FileDiagnostics": {
    "path": "PATH"
  },
  "agent.v1.DiagnosticItem": {
    "message": "CODE",
    "source": "SAFE",
    "code": "SAFE"
  },
  "agent.v1.ReadLintsToolError": {
    "error_message": "CODE"
  },
  "agent.v1.RecordScreenArgs": {
    "tool_call_id": "SAFE",
    "save_as_filename": "PATH"
  },
  "agent.v1.RecordScreenSaveSuccess": {
    "path": "PATH"
  },
  "agent.v1.RecordScreenFailure": {
    "error": "CODE"
  },
  "agent.v1.ReplaceEnvConfig": {
    "install_script": "CODE",
    "dockerfile_contents": "CODE"
  },
  "agent.v1.RepoCheckoutRefOverride": {
    "repo_url": "PATH",
    "ref": "PATH"
  },
  "agent.v1.ReplaceEnvSuccess": {
    "setup_logs": "CODE"
  },
  "agent.v1.ReplaceEnvFailure": {
    "error_message": "CODE",
    "setup_logs": "CODE"
  },
  "agent.v1.SetupVmEnvironmentArgs": {
    "update_command": "CODE",
    "install_command": "CODE",
    "start_command": "CODE",
    "dockerfile_contents": "CODE"
  },
  "agent.v1.BackgroundShellSpawnArgs": {
    "command": "CODE",
    "working_directory": "PATH",
    "tool_call_id": "SAFE",
    "description": "CODE",
    "smart_mode_approval": "CODE",
    "skip_approval": "SAFE",
    "conversation_id": "SAFE",
    "admin_command_denylist": "CODE",
    "request_id": "SAFE",
    "secret_scope_id": "SAFE"
  },
  "agent.v1.BackgroundShellSpawnSuccess": {
    "command": "CODE",
    "working_directory": "PATH"
  },
  "agent.v1.BackgroundShellSpawnError": {
    "command": "CODE",
    "working_directory": "PATH",
    "error": "CODE"
  },
  "agent.v1.WriteShellStdinArgs": {
    "chars": "CODE"
  },
  "agent.v1.WriteShellStdinError": {
    "error": "CODE"
  },
  "agent.v1.BackgroundSubagentSpawnArgs": {
    "subagent_id": "SAFE",
    "prompt": "CODE",
    "tool_call_id": "SAFE",
    "resume_from_id": "SAFE",
    "description": "CODE",
    "model_id": "SAFE"
  },
  "agent.v1.BackgroundSubagentSpawnSuccess": {
    "subagent_id": "SAFE",
    "output_file_path": "PATH"
  },
  "agent.v1.BackgroundSubagentSpawnError": {
    "subagent_id": "SAFE",
    "error": "CODE"
  },
  "agent.v1.BackgroundSubagentAbortArgs": {
    "subagent_id": "SAFE"
  },
  "agent.v1.BackgroundSubagentAbortSuccess": {
    "subagent_id": "SAFE"
  },
  "agent.v1.BackgroundSubagentAbortError": {
    "subagent_id": "SAFE",
    "error": "CODE"
  },
  "agent.v1.WriteArgs": {
    "path": "PATH",
    "file_text": "CODE",
    "tool_call_id": "SAFE",
    "file_bytes": "CODE",
    "encoding_hint": "SAFE"
  },
  "agent.v1.WriteSuccess": {
    "path": "PATH",
    "file_content_after_write": "CODE"
  },
  "agent.v1.WritePermissionDenied": {
    "path": "PATH",
    "directory": "PATH",
    "operation": "SAFE",
    "error": "CODE"
  },
  "agent.v1.WriteNoSpace": {
    "path": "PATH"
  },
  "agent.v1.WriteError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.WriteRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.StrReplaceArgs": {
    "path": "PATH",
    "old_text": "CODE",
    "new_text": "CODE"
  },
  "agent.v1.StrReplaceSuccess": {
    "path": "PATH",
    "old_text": "CODE",
    "new_text": "CODE"
  },
  "agent.v1.StrReplaceFileNotFound": {
    "path": "PATH"
  },
  "agent.v1.StrReplaceReadPermissionDenied": {
    "path": "PATH"
  },
  "agent.v1.StrReplaceWritePermissionDenied": {
    "path": "PATH"
  },
  "agent.v1.StrReplaceNoMatch": {
    "path": "PATH",
    "old_text": "CODE"
  },
  "agent.v1.StrReplaceMultipleMatches": {
    "path": "PATH",
    "old_text": "CODE"
  },
  "agent.v1.StrReplaceRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.StrReplaceError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.DiagnosticsArgs": {
    "path": "PATH",
    "tool_call_id": "SAFE"
  },
  "agent.v1.DiagnosticsSuccess": {
    "path": "PATH"
  },
  "agent.v1.Diagnostic": {
    "message": "CODE",
    "source": "SAFE",
    "code": "SAFE"
  },
  "agent.v1.DiagnosticsError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.DiagnosticsRejected": {
    "path": "PATH",
    "reason": "CODE"
  },
  "agent.v1.DiagnosticsFileNotFound": {
    "path": "PATH"
  },
  "agent.v1.DiagnosticsPermissionDenied": {
    "path": "PATH"
  },
  "agent.v1.CanvasDiagnosticsArgs": {
    "path": "PATH",
    "tool_call_id": "SAFE"
  },
  "agent.v1.CanvasDiagnosticsSuccess": {
    "path": "PATH",
    "diagnostics": "CODE"
  },
  "agent.v1.CanvasDiagnosticsError": {
    "path": "PATH",
    "error": "CODE"
  },
  "agent.v1.CanvasDiagnosticsResult": {
    "canvas_id": "SAFE",
    "title": "CODE",
    "save_state": "SAFE",
    "save_detail": "CODE"
  },
  "agent.v1.RepositoryIndexingInfo": {
    "relative_workspace_path": "PATH",
    "remote_urls": "PATH",
    "remote_names": "PATH",
    "repo_name": "PATH",
    "repo_owner": "PATH",
    "workspace_uri": "PATH",
    "path_encryption_key": "CREDENTIALS"
  },
  "agent.v1.ExecServerMessage": {
    "exec_id": "SAFE",
    "machine_id": "SAFE"
  },
  "agent.v1.ExecClientMessage": {
    "exec_id": "SAFE",
    "hook_additional_contexts": "CODE"
  },
  "agent.v1.ExecClientThrow": {
    "error": "CODE",
    "stack_trace": "CODE",
    "error_code": "SAFE"
  },
  "agent.v1.SpanContext": {
    "trace_id": "SAFE",
    "span_id": "SAFE",
    "trace_state": "SAFE"
  },
  "agent.v1.Error": {
    "message": "CODE"
  },
  "agent.v1.SandboxPolicy": {
    "additional_readwrite_paths": "PATH",
    "additional_readonly_paths": "PATH",
    "debug_output_dir": "PATH",
    "additional_read_paths": "PATH"
  },
  "agent.v1.NetworkPolicyLoggingConfig": {
    "decision_log_path": "PATH",
    "log_format": "SAFE"
  },
  "agent.v1.NetworkPolicy": {
    "deny": "SAFE",
    "allow": "SAFE"
  },
  "agent.v1.KeystrokeEvent": {
    "display_text": "CODE"
  },
  "agent.v1.ZoomCandidate": {
    "action_type": "SAFE",
    "context": "CODE"
  },
  "agent.v1.IdlePeriod": {
    "preceding_action_type": "SAFE",
    "following_action_type": "SAFE"
  },
  "agent.v1.VideoCut": {
    "reason": "CODE"
  },
  "agent.v1.DecisionInput": {
    "video_path": "PATH"
  },
  "agent.v1.RecordingDataPackage": {
    "raw_video_path": "PATH",
    "polished_video_path": "PATH"
  },
  "agent.v1.GetBlobArgs": {
    "blob_id": "SAFE"
  },
  "agent.v1.GetBlobResult": {
    "blob_data": "CODE",
    "error": "CODE"
  },
  "agent.v1.SetBlobArgs": {
    "blob_id": "SAFE",
    "blob_data": "CODE"
  },
  "agent.v1.KvServerMessage": {
    "id": "SAFE"
  },
  "agent.v1.KvClientMessage": {
    "id": "SAFE"
  },
  "agent.v1.TruncatedToolCall": {
    "original_step_blob_id": "SAFE"
  },
  "agent.v1.ReadExecSuccess": {
    "output_blob_id": "SAFE"
  },
  "agent.v1.InvocationContext": {
    "blob_id": "SAFE"
  },
  "agent.v1.ConversationState": {
    "root_prompt_messages_json": "CODE",
    "pending_tool_calls": "CODE",
    "file_states": {
      "key": "PATH",
      "value": "CODE"
    },
    "plans": {
      "key": "SAFE"
    },
    "communicate_update_history": "CODE",
    "communicate_update_states_by_parent_tool_call_id": {
      "key": "SAFE",
      "value": "CODE"
    },
    "communicate_update_final_summary": "CODE",
    "communicate_update_completed_subtitle": "CODE"
  },
  "agent.v1.SubagentPersistedState": {
    "model_id": "SAFE",
    "first_class_bc_id": "SAFE",
    "cloud_requested_environment_build_id": "SAFE"
  },
  "agent.v1.CloudSubagentReference": {
    "bc_id": "SAFE",
    "transcript_path": "PATH"
  },
  "agent.v1.RequestedModel": {
    "api_key_credentials": "CREDENTIALS",
    "azure_credentials": "CREDENTIALS",
    "bedrock_credentials": "CREDENTIALS",
    "model_id": "SAFE"
  },
  "agent.v1.RequestedModel.ModelParameterValue": {
    "id": "SAFE",
    "value": "CODE"
  },
  "agent.v1.SubagentModelOverride": {
    "subagent_type": "SAFE"
  },
  "agent.v1.SummaryCompletedUpdate": {
    "hook_message": "CODE"
  },
  "agent.v1.PreCompactRequestQuery": {
    "trigger": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.PreCompactRequestResponse": {
    "user_message": "CODE"
  },
  "agent.v1.PreToolUseRequestQuery": {
    "tool_name": "SAFE",
    "tool_input": "CODE",
    "tool_use_id": "SAFE",
    "cwd": "PATH",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.PreToolUseRequestResponse": {
    "permission": "SAFE",
    "user_message": "CODE",
    "agent_message": "CODE",
    "updated_input": "CODE",
    "additional_context": "CODE"
  },
  "agent.v1.PostToolUseRequestQuery": {
    "tool_name": "SAFE",
    "tool_input": "CODE",
    "tool_output": "CODE",
    "duration_ms": "SAFE",
    "tool_use_id": "SAFE",
    "cwd": "PATH",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.PostToolUseRequestResponse": {
    "additional_context": "CODE"
  },
  "agent.v1.PostToolUseFailureRequestQuery": {
    "tool_name": "SAFE",
    "tool_input": "CODE",
    "error_message": "CODE",
    "failure_type": "SAFE",
    "duration_ms": "SAFE",
    "tool_use_id": "SAFE",
    "is_interrupt": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.PostToolUseFailureRequestResponse": {
    "additional_context": "CODE"
  },
  "agent.v1.SubagentArgs": {
    "tool_call_id": "SAFE",
    "subagent_type": "SAFE",
    "model_id": "SAFE",
    "prompt": "CODE",
    "readonly": "SAFE",
    "resume_agent_id": "SAFE",
    "fork_agent_id": "SAFE",
    "root_parent_conversation_id": "SAFE",
    "parent_conversation_id": "SAFE",
    "api_key_credentials": "CREDENTIALS",
    "azure_credentials": "CREDENTIALS",
    "bedrock_credentials": "CREDENTIALS",
    "mode": "SAFE",
    "environment": "SAFE",
    "cloud_base_branch": "SAFE"
  },
  "agent.v1.ClientContinuationConfig": {
    "nudge_message": "SAFE",
    "escape_message_template": "SAFE",
    "children_completed_message_template": "SAFE"
  },
  "agent.v1.SubagentSuccess": {
    "agent_id": "SAFE",
    "final_message": "CODE",
    "transcript_path": "PATH"
  },
  "agent.v1.SubagentError": {
    "agent_id": "SAFE",
    "error": "CODE"
  },
  "agent.v1.SubagentAwaitArgs": {
    "agent_id": "SAFE"
  },
  "agent.v1.SubagentAwaitComplete": {
    "agent_id": "SAFE",
    "transcript_path": "PATH",
    "final_message": "CODE"
  },
  "agent.v1.SubagentAwaitStillRunning": {
    "agent_id": "SAFE",
    "transcript_path": "PATH"
  },
  "agent.v1.SubagentAwaitNotFound": {
    "agent_id": "SAFE"
  },
  "agent.v1.SubagentAwaitError": {
    "agent_id": "SAFE",
    "error": "CODE"
  },
  "agent.v1.SubagentStartRequestQuery": {
    "subagent_id": "SAFE",
    "subagent_type": "SAFE",
    "task": "CODE",
    "parent_conversation_id": "SAFE",
    "tool_call_id": "SAFE",
    "subagent_model": "SAFE",
    "git_branch": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.SubagentStartRequestResponse": {
    "permission": "SAFE",
    "user_message": "CODE",
    "additional_context": "CODE"
  },
  "agent.v1.SubagentStopRequestQuery": {
    "subagent_id": "SAFE",
    "subagent_type": "SAFE",
    "status": "SAFE",
    "summary": "CODE",
    "parent_conversation_id": "SAFE",
    "error_message": "CODE",
    "modified_files": "PATH",
    "git_branch": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "task": "CODE",
    "description": "CODE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.SubagentStopRequestResponse": {
    "followup_message": "CODE",
    "additional_context": "CODE"
  },
  "agent.v1.StopRequestQuery": {
    "status": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.StopRequestResponse": {
    "followup_message": "CODE"
  },
  "agent.v1.BeforeSubmitPromptRequestQuery": {
    "prompt": "CODE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE",
    "composer_mode": "SAFE"
  },
  "agent.v1.BeforeSubmitPromptAttachment": {
    "type": "SAFE",
    "file_path": "PATH"
  },
  "agent.v1.BeforeSubmitPromptRequestResponse": {
    "user_message": "CODE",
    "additional_context": "CODE"
  },
  "agent.v1.AfterAgentResponseRequestQuery": {
    "text": "CODE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE",
    "input_tokens": "SAFE",
    "output_tokens": "SAFE",
    "cache_read_tokens": "SAFE",
    "cache_write_tokens": "SAFE"
  },
  "agent.v1.AfterAgentThoughtRequestQuery": {
    "text": "CODE",
    "duration_ms": "SAFE",
    "conversation_id": "SAFE",
    "generation_id": "SAFE",
    "model": "SAFE",
    "model_id": "SAFE",
    "model_params": "CODE"
  },
  "agent.v1.PrewarmRequest": {
    "conversation_group_id": "SAFE",
    "conversation_id": "SAFE",
    "best_of_n_group_id": "SAFE",
    "custom_system_prompt": "CODE",
    "harness": "SAFE",
    "computer_use_coordinate_mode": "SAFE",
    "can_create_cloud_subagents": "SAFE",
    "suppress_subagent_progress_update_tool": "SAFE",
    "agent_session_id": "SAFE",
    // Custom subagent names flow through here too; see AgentRunRequest comment.
    "subagent_type_name": "CODE",
    "client_llm_gateway_credential": "CREDENTIALS"
  },
  "agent.v1.ExecRequest": {
    "command": "CODE",
    "cwd": "PATH",
    "args": "CODE",
    "environment": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.StdoutEvent": {
    "data": "CODE"
  },
  "agent.v1.StderrEvent": {
    "data": "CODE"
  },
  "agent.v1.ListDirectoryRequest": {
    "path": "PATH"
  },
  "agent.v1.DirectoryEntry": {
    "name": "PATH",
    "path": "PATH"
  },
  "agent.v1.ReadTextFileRequest": {
    "path": "PATH"
  },
  "agent.v1.ReadTextFileResponse": {
    "content": "CODE"
  },
  "agent.v1.WriteTextFileRequest": {
    "path": "PATH",
    "content": "CODE"
  },
  "agent.v1.ReadBinaryFileRequest": {
    "path": "PATH"
  },
  "agent.v1.ReadBinaryFileResponse": {
    "content": "CODE"
  },
  "agent.v1.ReadFileRequest": {
    "path": "PATH"
  },
  "agent.v1.ReadFileResponse": {
    "chunk": "CODE"
  },
  "agent.v1.ReadFileComplete": {
    "sha256": "CODE"
  },
  "agent.v1.WriteBinaryFileRequest": {
    "path": "PATH",
    "content": "CODE"
  },
  "agent.v1.GetWorkspaceChangesHashRequest": {
    "root_path": "PATH",
    "base_ref": "SAFE"
  },
  "agent.v1.GetWorkspaceChangesHashResponse": {
    "hash": "SAFE"
  },
  "agent.v1.BatchGetDiffItem": {
    "fetch_branches": "SAFE",
    "known_base_sha": "SAFE",
    "known_head_sha": "SAFE",
    "known_workspace_hash": "SAFE",
    "use_cat_file_batch": "SAFE"
  },
  "agent.v1.BatchGetDiffResult": {
    "fetched_branches": "SAFE",
    "failed_branches": "SAFE",
    "resolved_base_sha": "SAFE",
    "resolved_head_sha": "SAFE",
    "resolved_workspace_hash": "SAFE"
  },
  "agent.v1.BatchGetDiffError": {
    "message": "CODE"
  },
  "agent.v1.RefreshGithubAccessTokenRequest": {
    "github_access_token": "CREDENTIALS",
    "hostname": "SAFE",
    "repo_url": "SAFE",
    "clone_username": "SAFE"
  },
  "agent.v1.WarmRemoteAccessServerRequest": {
    "commit": "SAFE",
    "connection_token": "CREDENTIALS"
  },
  "agent.v1.DownloadCursorServerRequest": {
    "commit": "SAFE"
  },
  "agent.v1.ExportFileRequest": {
    "path": "PATH",
    "workspace_root_path": "PATH"
  },
  "agent.v1.ExportFileResponse": {
    "content_chunk": "CODE",
    "metadata": "SAFE"
  },
  "agent.v1.ExportFileMetadata": {
    "total_bytes": "SAFE"
  },
  "agent.v1.ArtifactUploadMetadata": {
    "absolute_path": "PATH",
    "artifact_relative_path": "PATH",
    "last_error": "CODE",
    "upload_id": "SAFE"
  },
  "agent.v1.ArtifactUploadInstruction": {
    "absolute_path": "PATH",
    "artifact_relative_path": "PATH",
    "upload_url": "SAFE",
    "method": "SAFE",
    "headers": {
      "key": "SAFE",
      "value": "SAFE"
    },
    "content_type": "SAFE",
    "slack_upload_url": "SAFE",
    "slack_file_id": "SAFE"
  },
  "agent.v1.ArtifactUploadDispatchResult": {
    "absolute_path": "PATH",
    "message": "CODE",
    "slack_file_id": "SAFE"
  },
  "agent.v1.PersistArtifactToAgentStoreInstruction": {
    "absolute_path": "PATH",
    "artifact_relative_path": "PATH"
  },
  "agent.v1.PersistArtifactToAgentStoreResult": {
    "absolute_path": "PATH",
    "message": "CODE"
  },
  "agent.v1.RestoreArtifactInstruction": {
    "absolute_path": "PATH",
    "artifact_relative_path": "PATH",
    "download_url": "CREDENTIALS"
  },
  "agent.v1.RestoreArtifactResult": {
    "error_message": "CODE"
  },
  "agent.v1.GetMcpRefreshTokensResponse": {
    "refresh_tokens": {
      "key": "SAFE",
      "value": "CREDENTIALS"
    }
  },
  "agent.v1.UpdateEnvironmentVariablesRequest": {
    "env": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.ScopedSecretValues": {
    "values": {
      "key": "SAFE",
      "value": "CREDENTIALS"
    }
  },
  "agent.v1.SyncScopedSecretsRequest": {
    "scope_id": "SAFE",
    "revision": "SAFE"
  },
  "agent.v1.SyncScopedSecretsResponse": {
    "revision": "SAFE"
  },
  "agent.v1.RunScopedOverlay": {
    "run_id": "SAFE",
    "holder": "SAFE"
  },
  "agent.v1.ReloadPluginsRequest": {
    "reload_targets": "SAFE"
  },
  "agent.v1.InstallPluginArtifactRequest": {
    "download_url": "CREDENTIALS",
    "target_root": "PATH",
    "artifact_digest": "SAFE"
  },
  "agent.v1.LoadMcpServersRequest": {
    // Full MCP config JSON: stdio server env blocks routinely carry API keys.
    "mcp_config_json": "CREDENTIALS",
    "remove_missing": "SAFE"
  },
  "agent.v1.LoadMcpServersResponse": {
    "loaded_server_names": "SAFE"
  },
  "agent.v1.DesktopLeaseRequest": {
    "acquire": "SAFE",
    "release": "SAFE",
    "get_state": "SAFE"
  },
  "agent.v1.DesktopLeaseAcquire": {
    "actor_id": "SAFE"
  },
  "agent.v1.DesktopLeaseRelease": {
    "actor_id": "SAFE"
  },
  "agent.v1.DesktopLeaseOwner": {
    "kind": "SAFE",
    "actor_id": "SAFE",
    "expires_at_unix_ms": "SAFE"
  },
  "agent.v1.DesktopLeaseResponse": {
    "status": "SAFE",
    "owner": "SAFE",
    "message": "SAFE"
  },
  "agent.v1.ResourceLimits": {
    "scope": "SAFE",
    "memory_limit_bytes": "SAFE",
    "cpu_limit_mcores": "SAFE",
    "disk_limit_bytes": "SAFE",
    "workspace_path": "PATH",
    "display_label": "CODE"
  },
  "agent.v1.ResourceSample": {
    "sampled_at_ms": "SAFE",
    "memory_used_bytes": "SAFE",
    "memory_available_bytes": "SAFE",
    "cpu_used_mcores": "SAFE",
    "disk_used_bytes": "SAFE",
    "pressure": "SAFE"
  },
  "agent.v1.GetResourceUsageRequest": {
    "cursor": "SAFE",
    "omit_history": "SAFE"
  },
  "agent.v1.GetResourceUsageResponse": {
    "limits": "SAFE",
    "current": "SAFE",
    "history": "SAFE",
    "next_cursor": "SAFE"
  },
  "agent.v1.CursorPackagePrompt": {
    "name": "SAFE",
    "file_path": "PATH"
  },
  "agent.v1.CursorPackage": {
    "name": "SAFE",
    "description": "CODE",
    "folder_path": "PATH",
    "parse_error": "CODE",
    "readme_file_path": "PATH"
  },
  "agent.v1.McpToolNotFound": {
    "name": "SAFE",
    "available_tools": "SAFE"
  },
  "agent.v1.McpServerNotFound": {
    "name": "SAFE",
    "available_servers": "SAFE"
  },
  "agent.v1.Frame": {
    "id": "SAFE",
    "method": "SAFE",
    "data": "CODE",
    "error": "CODE",
    "bc_id": "SAFE"
  },
  "agent.v1.Process": {
    "shell": "SAFE",
    "args": "CODE"
  },
  "agent.v1.SpawnPtyRequest": {
    "cwd": "PATH",
    "env": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.SpawnPtyResponse": {
    "pty_id": "SAFE"
  },
  "agent.v1.AttachPtyRequest": {
    "pty_id": "SAFE",
    "last_event_id": "SAFE"
  },
  "agent.v1.PtyEvent": {
    "event_id": "SAFE"
  },
  "agent.v1.PtyData": {
    "data": "CODE"
  },
  "agent.v1.SendInputRequest": {
    "pty_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.ResizePtyRequest": {
    "pty_id": "SAFE"
  },
  "agent.v1.PtyInfo": {
    "pty_id": "SAFE",
    "shell": "SAFE",
    "cwd": "PATH",
    "process_args": "CODE"
  },
  "agent.v1.TerminatePtyRequest": {
    "pty_id": "SAFE"
  },
  "agent.v1.TmuxSession": {
    "session_id": "SAFE",
    "session_name": "SAFE",
    "display_name": "SAFE",
    "cwd": "PATH",
    "shell": "SAFE",
    "process_args": "CODE"
  },
  "agent.v1.CreateTmuxSessionRequest": {
    "session_name": "SAFE",
    "display_name": "SAFE",
    "cwd": "PATH",
    "env": {
      "key": "SAFE",
      "value": "CODE"
    }
  },
  "agent.v1.KillTmuxSessionRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.AttachTmuxSessionRequest": {
    "session_id": "SAFE"
  },
  "agent.v1.AttachTmuxSessionResponse": {
    "pty_id": "SAFE"
  },
  "agent.v1.BlameByFilePathArgs": {
    "file_path": "PATH"
  },
  "agent.v1.BlameByFilePathSuccess": {
    "content": "CODE"
  },
  "agent.v1.BlameByFilePathError": {
    "error_message": "CODE"
  },
  "agent.v1.ReportBugArgs": {
    "title": "CODE",
    "file": "PATH",
    "start_line": "SAFE",
    "end_line": "SAFE",
    "description": "CODE",
    "severity": "SAFE",
    "category": "SAFE",
    "rationale": "CODE"
  },
  "agent.v1.ReportBugSuccess": {
    "output": "CODE"
  },
  "agent.v1.ReportBugError": {
    "error_message": "CODE"
  },
  "agent.v1.BugfixResultItem": {
    "bug_id": "SAFE",
    "bug_title": "CODE",
    "explanation": "CODE",
    "severity": "SAFE"
  },
  "agent.v1.ReportBugfixResultsArgs": {
    "summary": "CODE"
  },
  "agent.v1.ReportBugfixResultsError": {
    "error": "CODE"
  },
  "agent.v1.SelectedImage.BlobIdWithData": {
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.SelectedVideo.BlobIdWithData": {
    "blob_id": "SAFE",
    "data": "CODE"
  },
  "agent.v1.SelectedVideo.SignedUrl": {
    "url": "CREDENTIALS",
    "key": "SAFE",
    "expires_at_unix_ms": "SAFE",
    "refresh_after_unix_ms": "SAFE",
    "conversation_id": "SAFE"
  },
  "agent.v1.SelectedVideo": {
    "blob_id": "SAFE",
    "data": "CODE",
    "signed_url": "CREDENTIALS",
    "uuid": "SAFE",
    "path": "PATH",
    "filename": "PATH",
    "mime_type": "SAFE",
    "materialize_to_filesystem": "SAFE"
  },
  "agent.v1.SelectedSubagent": {
    "name": "SAFE"
  },
  "agent.v1.SelectedBrowser": {
    "browser_id": "SAFE",
    "url": "SAFE",
    "page_title": "CODE"
  },
  "agent.v1.StartGrindExecutionArgs": {
    "explanation": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.StartGrindExecutionError": {
    "error": "CODE"
  },
  "agent.v1.StartGrindPlanningArgs": {
    "explanation": "CODE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.StartGrindPlanningError": {
    "error": "CODE"
  },
  "agent.v1.WebFetchArgs": {
    "url": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.WebFetchSuccess": {
    "url": "SAFE",
    "markdown": "CODE"
  },
  "agent.v1.WebFetchError": {
    "url": "SAFE",
    "error": "CODE"
  },
  "agent.v1.WebFetchRejected": {
    "reason": "CODE"
  },
  "agent.v1.WebFetchRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "agent.v1.PrManagementArgs": {
    "tool_call_id": "SAFE"
  },
  "agent.v1.CreatePrAction": {
    "title": "CODE",
    "body": "CODE",
    "base_branch": "PATH",
    "branch_name": "PATH",
    "add_labels": "PATH",
    "repo_url": "PATH"
  },
  "agent.v1.UpdatePrAction": {
    "pr_url": "SAFE",
    "title": "CODE",
    "body": "CODE",
    "base_branch": "PATH",
    "branch_name": "PATH",
    "add_labels": "PATH",
    "remove_labels": "PATH",
    "repo_url": "PATH"
  },
  "agent.v1.PostCommentAction": {
    "pr_url": "SAFE",
    "branch_name": "PATH",
    "body": "CODE",
    "repo_url": "PATH",
    "path": "PATH",
    "side": "SAFE",
    "reply_to_reference": "SAFE"
  },
  "agent.v1.ResolveCommentAction": {
    "pr_url": "SAFE",
    "branch_name": "PATH",
    "repo_url": "PATH",
    "comment_reference": "SAFE"
  },
  "agent.v1.GetCiStatusAction": {
    "pr_url": "SAFE",
    "branch_name": "PATH",
    "repo_url": "PATH"
  },
  "agent.v1.SetPrStatusAction": {
    "pr_url": "SAFE",
    "branch_name": "PATH",
    "repo_url": "PATH"
  },
  "agent.v1.PrManagementSuccess": {
    "pr_url": "SAFE",
    "message": "CODE"
  },
  "agent.v1.PrManagementError": {
    "error": "CODE"
  },
  "agent.v1.EditPrLabelsArgs": {
    "tool_call_id": "SAFE",
    "pr_url": "SAFE",
    "add_labels": "PATH",
    "remove_labels": "PATH"
  },
  "agent.v1.EditPrLabelsResult": {},
  "agent.v1.EditPrLabelsSuccess": {
    "pr_url": "SAFE",
    "pr_number": "SAFE",
    "message": "CODE"
  },
  "agent.v1.EditPrLabelsError": {
    "error": "CODE"
  },
  "agent.v1.EditPrLabelsToolCall": {},
  "agent.v1.PrManagementRejected": {
    "reason": "CODE"
  },
  "agent.v1.PrManagementRegistered": {
    "message": "CODE",
    "title": "CODE",
    "body": "CODE",
    "base_branch": "PATH",
    "branch_name": "PATH"
  },
  "agent.v1.PrManagementNeedsConfirmation": {
    "message": "CODE",
    "discovered_pr_url": "SAFE",
    "discovered_pr_title": "CODE",
    "branch_name": "PATH"
  },
  "agent.v1.PrManagementRequestResponse.Rejected": {
    "reason": "CODE"
  },
  // Deprecated: Kept for wire compatibility with persisted data
  "agent.v1.UserGitContext": {
    "username": "SAFE",
    "email": "SAFE"
  },
  "agent.v1.ConnectScmArgs": {
    "tool_call_id": "SAFE",
    "github": "SAFE"
  },
  "agent.v1.ConnectScmGithub": {
    "repository": "SAFE",
    "ghe_application": "SAFE"
  },
  "agent.v1.ConnectScmGithubRepository": {
    "owner": "SAFE",
    "repo": "SAFE"
  },
  "agent.v1.ConnectScmError": {
    "error": "CODE"
  },
  "agent.v1.ConnectScmRejected": {
    "reason": "CODE"
  },
  "agent.v1.ConnectScmRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "agent.v1.ConnectScmRequestResponse.Failed": {
    "error": "CODE"
  },
  "agent.v1.McpAuthArgs": {
    "server_identifier": "SAFE",
    "tool_call_id": "SAFE"
  },
  "agent.v1.McpAuthSuccess": {
    "server_identifier": "SAFE"
  },
  "agent.v1.McpAuthError": {
    "error": "CODE"
  },
  "agent.v1.McpAuthRejected": {
    "reason": "CODE"
  },
  "agent.v1.McpAuthRequestResponse.Rejected": {
    "reason": "CODE"
  },
  "aiserver.v1.GetGoogleContactImportAuthUrlResponse": {
    "auth_url": "CREDENTIALS",
    "csrf_token": "CREDENTIALS"
  },
  "aiserver.v1.GkwConnectorRow": {
    "connected": "SAFE",
    "description": "SAFE",
    "first_indexed_at_ms": "SAFE",
    "indexed_through_ms": "SAFE",
    "provider": "SAFE",
    "provider_account_email": "SAFE",
    "status": "SAFE",
    "title": "SAFE"
  },
  "aiserver.v1.GetGkwConnectorAuthUrlRequest": {
    "provider": "SAFE"
  },
  "aiserver.v1.GetGkwConnectorAuthUrlResponse": {
    "auth_url": "CREDENTIALS"
  },
  "aiserver.v1.ConnectGkwConnectorCallbackRequest": {
    "code": "CODE",
    "state": "CREDENTIALS"
  },
  "aiserver.v1.ConnectGkwConnectorCallbackResponse": {
    "provider": "SAFE",
    "provider_account_email": "SAFE"
  },
  "aiserver.v1.SetGkwConnectorStatusRequest": {
    "provider": "SAFE",
    "status": "SAFE"
  },
  "aiserver.v1.CanvasStoreRoot": {
    "canvases_root": "PATH",
    "store_id": "SAFE",
    "store_kind": "SAFE"
  },
  "aiserver.v1.ConnectGoogleContactImportCallbackRequest": {
    "code": "CODE",
    "state": "CREDENTIALS"
  },
  "agent.v1.ClaimWorkerRequest": {
    "http_mcp_config_json": "CREDENTIALS",
    "mcp_config_json": "CREDENTIALS",
    "bc_id": "SAFE",
    "agent_store_claim_config": "SAFE",
    "user_email": "SAFE",
    "repo_urls": "SAFE",
    "repos": "SAFE",
    "machine_resources_enabled": "SAFE"
  },
  "agent.v1.ClaimWorkerRepo": {
    "repo_url": "SAFE",
    "ref": "SAFE",
    "primary": "SAFE"
  },
  "agent.v1.AgentStoreClaimConfig": {
    "self": "SAFE",
    "mounts": "SAFE"
  },
  "agent.v1.AgentStoreClaimMount": {
    "kind": "SAFE",
    "source_id": "SAFE"
  },
  "agent.v1.OpenDesktopSessionRequest": {
    "session_id": "SAFE",
    "worker_session_secret": "CREDENTIALS",
    "control_mode": "SAFE"
  },
  "agent.v1.OpenDesktopSessionResponse": {
    "unavailable_reason": "SAFE"
  },
  "agent.v1.DesktopStreamStart": {
    "session_id": "SAFE",
    "worker_session_secret": "CREDENTIALS"
  },
  "agent.v1.DesktopChunk": {
    "data": "CODE"
  },
  "agent.v1.DesktopStreamClientMessage": {
    "start": "SAFE",
    "chunk": "SAFE",
    "ping": "SAFE",
    "close": "SAFE"
  },
  "agent.v1.DesktopStreamServerMessage": {
    "chunk": "SAFE",
    "ping": "SAFE",
    "close": "SAFE"
  },
  "agent.v1.DesktopPing": {
    "nonce": "SAFE"
  },
  "agent.v1.DesktopClose": {
    "reason": "SAFE"
  },
  "agent.v1.PrefetchCursorServerRequest": {
    "commit": "SAFE",
    "bc_id": "SAFE"
  },
  "agent.v1.PrefetchCursorServerResponse": {
    "accepted": "SAFE",
    "already_downloaded": "SAFE",
    "unavailable_reason": "SAFE"
  },
  "agent.v1.StartCursorServerRequest": {
    "commit": "SAFE",
    "bc_id": "SAFE"
  },
  "agent.v1.StartCursorServerResponse": {
    "port": "SAFE",
    "connection_token": "CREDENTIALS",
    "accepted": "SAFE",
    "unavailable_reason": "SAFE"
  },
  "agent.v1.OpenCursorServerConnectionRequest": {
    "connection_id": "SAFE",
    "worker_connection_secret": "CREDENTIALS",
    "port": "SAFE",
    "bc_id": "SAFE"
  },
  "agent.v1.OpenCursorServerConnectionResponse": {
    "accepted": "SAFE",
    "unavailable_reason": "SAFE"
  },
  "agent.v1.CursorServerStreamStart": {
    "connection_id": "SAFE",
    "worker_connection_secret": "CREDENTIALS"
  },
  "agent.v1.CursorServerChunk": {
    "data": "CODE"
  },
  "agent.v1.CursorServerPing": {
    "nonce": "SAFE"
  },
  "agent.v1.CursorServerClose": {
    "reason": "SAFE"
  },
  "agent.v1.CursorServerStreamClientMessage": {
    "start": "SAFE",
    "chunk": "SAFE",
    "ping": "SAFE",
    "close": "SAFE"
  },
  "agent.v1.CursorServerStreamServerMessage": {
    "chunk": "SAFE",
    "ping": "SAFE",
    "close": "SAFE"
  }
};

