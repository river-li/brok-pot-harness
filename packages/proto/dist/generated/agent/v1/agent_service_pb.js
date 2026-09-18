var __protoPackage146, __protoMessage3139, LocalPromptQualityInvocationStatus, LocalAgentMailboxEndedReason, ClientHeartbeat, PrewarmRequest, AgentClientMessage, TtftBreakdown, AgentServerMessage, NameAgentRequest, NameAgentResponse, UpdateConversationMetadataRequest, UpdateConversationMetadataResponse, GetPromptContextUsageRequest, GetPromptContextUsageResponse, CreateTranscriptOverviewRequest, CreateTranscriptOverviewResponse, GetUsableModelsRequest, GetUsableModelsResponse, GetDefaultModelForCliRequest, GetDefaultModelForCliResponse, GetAllowedModelIntentsRequest, GetAllowedModelIntentsResponse, BlobEntry, UploadConversationBlobsRequest, UploadConversationBlobsResponse, LocalPromptQualityInvocation, UploadLocalAgentRunToPromptQualityRequest, UploadLocalAgentRunToPromptQualityResponse, GetSignedUrlForAttachedMediaRequest, GetSignedUrlForAttachedMediaResponse, NotifyConversationCloneRequest, NotifyConversationCloneResponse, GetNewChatNudgeLegacyModelPickerRequest, GetNewChatNudgeLegacyModelPickerResponse, NudgeBumpVariant, NudgeAskVariant, NudgeSilentSwitchVariant, NewChatNudge, ListLocalSubscriptionToolsRequest, LocalSubscriptionToolDefinition, ListLocalSubscriptionToolsResponse, CallLocalSubscriptionToolRequest, CallLocalSubscriptionToolResponse, SubscriptionDeliveryEntry, SubscriptionRemovedEntry, LocalAgentMailboxEntry, StreamLocalAgentMailboxRequest, StreamLocalAgentMailboxRequest_ConversationCursor, LocalAgentMailboxDelivery, LocalAgentMailboxGap, LocalAgentMailboxEnded, StreamLocalAgentMailboxHeartbeat, StreamLocalAgentMailboxResponse, GetNewChatNudgeParameterizedModelPickerRequest, GetNewChatNudgeParameterizedModelPickerResponse, NewChatNudgeV2;
var init_agent_service_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/agent_service_pb.js"() {
    "use strict";
    init_esm();
    init_agent_pb();
    init_requested_model_pb();
    init_mcp_pb();
    init_exec_pb();
    init_kv_pb();
    init_compact();
    __protoPackage146 = "agent.v1.";
    __protoMessage3139 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage146;
      }
    };
    LocalPromptQualityInvocationStatus = /* @__PURE__ */ enumType(proto3, __protoPackage146, "LocalPromptQualityInvocationStatus", [[0, "UNSPECIFIED"], [1, "SUCCESS"], [2, "ERRORED"], [3, "ABORTED"]], 1);
    LocalAgentMailboxEndedReason = /* @__PURE__ */ enumType(proto3, __protoPackage146, "LocalAgentMailboxEndedReason", [[0, "UNSPECIFIED"], [1, "NO_ACTIVE_SUBSCRIPTIONS"], [2, "STORE_DELETED"], [3, "MIGRATED_TO_CLOUD"]], 1);
    ClientHeartbeat = class _ClientHeartbeat extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientHeartbeat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientHeartbeat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientHeartbeat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientHeartbeat, a, b2);
      }
      static $() {
        return ["ClientHeartbeat"];
      }
    };
    PrewarmRequest = class _PrewarmRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.selectedSubagentModels = [];
        this.selectedSubagentModelDetails = [];
        this.preFetchedBlobs = [];
        this.subagentModelOverrides = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrewarmRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrewarmRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrewarmRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrewarmRequest, a, b2);
      }
      static $() {
        return ["PrewarmRequest|1 model_details #0|9 requested_model #1?|2 conversation_id 9?|3 conversation_state #2|4 mcp_tools #3|5 mcp_file_system_options #4?|6 best_of_n_group_id 9?|7 try_use_best_of_n_promotion 8?|8 custom_system_prompt 9?|10 suggest_next_prompt 8?|11 subagent_type_name 9?|12 exclude_workspace_context 8?|13 harness 9?|14 selected_subagent_models #1*|15 selected_subagent_model_details #0*|16 conversation_group_id 9?|17 pre_fetched_blobs #5*|18 client_supports_inline_images 8?|19 subagent_model_overrides #6*|20 can_create_cloud_subagents 8?|21 suppress_subagent_progress_update_tool 8?|22 client_supports_send_to_user 8?|23 computer_use_coordinate_mode 9?|24 agent_session_id 9?|25 client_supports_prompt_context_usage_rpc 8?|26 client_supports_routed_model_update 8?|27 client_llm_gateway_credential #7?|28 client_supports_preview_card 8?|29 started_as_new_project 8?|30 first_project_onboarding 8?", ModelDetails2, RequestedModel, ConversationStateStructure, McpTools, McpFileSystemOptions, PreFetchedBlob, SubagentModelOverride, ClientLlmGatewayCredential];
      }
    };
    AgentClientMessage = class _AgentClientMessage extends __protoMessage3139 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentClientMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentClientMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentClientMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentClientMessage, a, b2);
      }
      static $() {
        return ["AgentClientMessage|1 run_request #0 message|2 exec_client_message #1 message|5 exec_client_control_message #2 message|3 kv_client_message #3 message|4 conversation_action #4 message|6 interaction_response #5 message|7 client_heartbeat #6 message|8 prewarm_request #7 message", AgentRunRequest, ExecClientMessage, ExecClientControlMessage, KvClientMessage, ConversationAction, InteractionResponse, ClientHeartbeat, PrewarmRequest];
      }
    };
    TtftBreakdown = class _TtftBreakdown extends __protoMessage3139 {
      constructor(data) {
        super();
        this.serverFirstTokenMs = 0;
        this.preStreamSetupMs = 0;
        this.waitForFirstEventMs = 0;
        this.slowPoolWaitMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TtftBreakdown().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TtftBreakdown().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TtftBreakdown().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TtftBreakdown, a, b2);
      }
      static $() {
        return ["TtftBreakdown|1 server_first_token_ms 1|2 pre_stream_setup_ms 1|3 wait_for_first_event_ms 1|4 provider_ttft_ms 1?|5 slow_pool_wait_ms 1"];
      }
    };
    AgentServerMessage = class _AgentServerMessage extends __protoMessage3139 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentServerMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentServerMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentServerMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentServerMessage, a, b2);
      }
      static $() {
        return ["AgentServerMessage|1 interaction_update #0 message|2 exec_server_message #1 message|5 exec_server_control_message #2 message|3 conversation_checkpoint_update #3 message|4 kv_server_message #4 message|7 interaction_query #5 message|8 ttft_breakdown #6", InteractionUpdate, ExecServerMessage, ExecServerControlMessage, ConversationStateStructure, KvServerMessage, InteractionQuery, TtftBreakdown];
      }
    };
    NameAgentRequest = class _NameAgentRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.userMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NameAgentRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NameAgentRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NameAgentRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NameAgentRequest, a, b2);
      }
      static $() {
        return ["NameAgentRequest|1 user_message 9"];
      }
    };
    NameAgentResponse = class _NameAgentResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NameAgentResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NameAgentResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NameAgentResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NameAgentResponse, a, b2);
      }
      static $() {
        return ["NameAgentResponse|1 name 9"];
      }
    };
    UpdateConversationMetadataRequest = class _UpdateConversationMetadataRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.workspacePaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateConversationMetadataRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateConversationMetadataRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateConversationMetadataRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateConversationMetadataRequest, a, b2);
      }
      static $() {
        return ["UpdateConversationMetadataRequest|1 conversation_id 9|2 name 9?|3 only_set_name_if_empty 8?|4 workspace_paths 9*"];
      }
    };
    UpdateConversationMetadataResponse = class _UpdateConversationMetadataResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateConversationMetadataResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateConversationMetadataResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateConversationMetadataResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateConversationMetadataResponse, a, b2);
      }
      static $() {
        return ["UpdateConversationMetadataResponse"];
      }
    };
    GetPromptContextUsageRequest = class _GetPromptContextUsageRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.snapshotBlobId = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPromptContextUsageRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPromptContextUsageRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPromptContextUsageRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPromptContextUsageRequest, a, b2);
      }
      static $() {
        return ["GetPromptContextUsageRequest|1 conversation_id 9|2 snapshot_blob_id 12"];
      }
    };
    GetPromptContextUsageResponse = class _GetPromptContextUsageResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPromptContextUsageResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPromptContextUsageResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPromptContextUsageResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPromptContextUsageResponse, a, b2);
      }
      static $() {
        return ["GetPromptContextUsageResponse|1 snapshot #0", PromptContextUsageSnapshot];
      }
    };
    CreateTranscriptOverviewRequest = class _CreateTranscriptOverviewRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.formattedConversation = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateTranscriptOverviewRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateTranscriptOverviewRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateTranscriptOverviewRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateTranscriptOverviewRequest, a, b2);
      }
      static $() {
        return ["CreateTranscriptOverviewRequest|1 formatted_conversation 9"];
      }
    };
    CreateTranscriptOverviewResponse = class _CreateTranscriptOverviewResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.overview = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateTranscriptOverviewResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateTranscriptOverviewResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateTranscriptOverviewResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateTranscriptOverviewResponse, a, b2);
      }
      static $() {
        return ["CreateTranscriptOverviewResponse|1 overview 9"];
      }
    };
    GetUsableModelsRequest = class _GetUsableModelsRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.customModelIds = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetUsableModelsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetUsableModelsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetUsableModelsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetUsableModelsRequest, a, b2);
      }
      static $() {
        return ["GetUsableModelsRequest|1 custom_model_ids 9*"];
      }
    };
    GetUsableModelsResponse = class _GetUsableModelsResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.models = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetUsableModelsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetUsableModelsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetUsableModelsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetUsableModelsResponse, a, b2);
      }
      static $() {
        return ["GetUsableModelsResponse|1 models #0*", ModelDetails2];
      }
    };
    GetDefaultModelForCliRequest = class _GetDefaultModelForCliRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetDefaultModelForCliRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetDefaultModelForCliRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetDefaultModelForCliRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetDefaultModelForCliRequest, a, b2);
      }
      static $() {
        return ["GetDefaultModelForCliRequest"];
      }
    };
    GetDefaultModelForCliResponse = class _GetDefaultModelForCliResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetDefaultModelForCliResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetDefaultModelForCliResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetDefaultModelForCliResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetDefaultModelForCliResponse, a, b2);
      }
      static $() {
        return ["GetDefaultModelForCliResponse|1 model #0", ModelDetails2];
      }
    };
    GetAllowedModelIntentsRequest = class _GetAllowedModelIntentsRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetAllowedModelIntentsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetAllowedModelIntentsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetAllowedModelIntentsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetAllowedModelIntentsRequest, a, b2);
      }
      static $() {
        return ["GetAllowedModelIntentsRequest"];
      }
    };
    GetAllowedModelIntentsResponse = class _GetAllowedModelIntentsResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.modelIntents = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetAllowedModelIntentsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetAllowedModelIntentsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetAllowedModelIntentsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetAllowedModelIntentsResponse, a, b2);
      }
      static $() {
        return ["GetAllowedModelIntentsResponse|1 model_intents 9*"];
      }
    };
    BlobEntry = class _BlobEntry extends __protoMessage3139 {
      constructor(data) {
        super();
        this.id = new Uint8Array(0);
        this.value = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlobEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlobEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlobEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlobEntry, a, b2);
      }
      static $() {
        return ["BlobEntry|1 id 12|2 value 12"];
      }
    };
    UploadConversationBlobsRequest = class _UploadConversationBlobsRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.blobs = [];
        this.chunkIndex = 0;
        this.totalChunks = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadConversationBlobsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadConversationBlobsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadConversationBlobsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadConversationBlobsRequest, a, b2);
      }
      static $() {
        return ["UploadConversationBlobsRequest|1 conversation_id 9|2 blobs #0*|3 chunk_index 5|4 total_chunks 5", BlobEntry];
      }
    };
    UploadConversationBlobsResponse = class _UploadConversationBlobsResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadConversationBlobsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadConversationBlobsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadConversationBlobsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadConversationBlobsResponse, a, b2);
      }
      static $() {
        return ["UploadConversationBlobsResponse"];
      }
    };
    LocalPromptQualityInvocation = class _LocalPromptQualityInvocation extends __protoMessage3139 {
      constructor(data) {
        super();
        this.invocationId = "";
        this.attemptRequestId = "";
        this.attempt = 0;
        this.startedAt = "";
        this.completedAt = "";
        this.modelId = "";
        this.providerName = "";
        this.status = LocalPromptQualityInvocationStatus.UNSPECIFIED;
        this.messages = [];
        this.responseMessages = [];
        this.toolsJson = "";
        this.promptTokens = protoInt64.zero;
        this.completionTokens = protoInt64.zero;
        this.totalTokens = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalPromptQualityInvocation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalPromptQualityInvocation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalPromptQualityInvocation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalPromptQualityInvocation, a, b2);
      }
      static $() {
        return ["LocalPromptQualityInvocation|1 invocation_id 9|2 attempt_request_id 9|3 attempt 5|4 started_at 9|5 completed_at 9|6 model_id 9|7 provider_name 9|8 status #0|9 messages 12*|10 response_messages 12*|11 tools_json 9|12 prompt_tokens 3|13 completion_tokens 3|14 total_tokens 3|15 token_limit 3?|16 error_message 9?|17 prompt_tag 9?|18 feature_type 9?", LocalPromptQualityInvocationStatus];
      }
    };
    UploadLocalAgentRunToPromptQualityRequest = class _UploadLocalAgentRunToPromptQualityRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.schemaVersion = 0;
        this.generationUuid = "";
        this.conversationId = "";
        this.payloadDigest = "";
        this.invocations = [];
        this.terminalStatus = LocalPromptQualityInvocationStatus.UNSPECIFIED;
        this.createdAt = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadLocalAgentRunToPromptQualityRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadLocalAgentRunToPromptQualityRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadLocalAgentRunToPromptQualityRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadLocalAgentRunToPromptQualityRequest, a, b2);
      }
      static $() {
        return ["UploadLocalAgentRunToPromptQualityRequest|1 schema_version 5|2 generation_uuid 9|3 conversation_id 9|4 payload_digest 9|5 invocations #0*|6 terminal_status #1|7 created_at 9", LocalPromptQualityInvocation, LocalPromptQualityInvocationStatus];
      }
    };
    UploadLocalAgentRunToPromptQualityResponse = class _UploadLocalAgentRunToPromptQualityResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.requestId = "";
        this.primaryInvocationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadLocalAgentRunToPromptQualityResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadLocalAgentRunToPromptQualityResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadLocalAgentRunToPromptQualityResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadLocalAgentRunToPromptQualityResponse, a, b2);
      }
      static $() {
        return ["UploadLocalAgentRunToPromptQualityResponse|1 request_id 9|2 primary_invocation_id 9"];
      }
    };
    GetSignedUrlForAttachedMediaRequest = class _GetSignedUrlForAttachedMediaRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSignedUrlForAttachedMediaRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSignedUrlForAttachedMediaRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSignedUrlForAttachedMediaRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSignedUrlForAttachedMediaRequest, a, b2);
      }
      static $() {
        return ["GetSignedUrlForAttachedMediaRequest|3 conversation_id 9|1 key 9?|2 mime_type 9?|4 content_length_bytes 3?"];
      }
    };
    GetSignedUrlForAttachedMediaResponse = class _GetSignedUrlForAttachedMediaResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.key = "";
        this.postUrl = "";
        this.getUrl = "";
        this.expiresAtUnixMs = protoInt64.zero;
        this.refreshAfterUnixMs = protoInt64.zero;
        this.postFields = {};
        this.putUrl = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSignedUrlForAttachedMediaResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSignedUrlForAttachedMediaResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSignedUrlForAttachedMediaResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSignedUrlForAttachedMediaResponse, a, b2);
      }
      static $() {
        return ["GetSignedUrlForAttachedMediaResponse|1 key 9|2 post_url 9|3 get_url 9|4 expires_at_unix_ms 3|5 refresh_after_unix_ms 3|6 post_fields 9,9|7 put_url 9"];
      }
    };
    NotifyConversationCloneRequest = class _NotifyConversationCloneRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.sourceConversationId = "";
        this.sourceRequestId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NotifyConversationCloneRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NotifyConversationCloneRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NotifyConversationCloneRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NotifyConversationCloneRequest, a, b2);
      }
      static $() {
        return ["NotifyConversationCloneRequest|1 conversation_id 9|2 source_conversation_id 9|3 source_request_id 9"];
      }
    };
    NotifyConversationCloneResponse = class _NotifyConversationCloneResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NotifyConversationCloneResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NotifyConversationCloneResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NotifyConversationCloneResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NotifyConversationCloneResponse, a, b2);
      }
      static $() {
        return ["NotifyConversationCloneResponse"];
      }
    };
    GetNewChatNudgeLegacyModelPickerRequest = class _GetNewChatNudgeLegacyModelPickerRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.currentModel = "";
        this.maxMode = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetNewChatNudgeLegacyModelPickerRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetNewChatNudgeLegacyModelPickerRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetNewChatNudgeLegacyModelPickerRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetNewChatNudgeLegacyModelPickerRequest, a, b2);
      }
      static $() {
        return ["GetNewChatNudgeLegacyModelPickerRequest|1 current_model 9|2 max_mode 8"];
      }
    };
    GetNewChatNudgeLegacyModelPickerResponse = class _GetNewChatNudgeLegacyModelPickerResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetNewChatNudgeLegacyModelPickerResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetNewChatNudgeLegacyModelPickerResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetNewChatNudgeLegacyModelPickerResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetNewChatNudgeLegacyModelPickerResponse, a, b2);
      }
      static $() {
        return ["GetNewChatNudgeLegacyModelPickerResponse|1 nudge #0?", NewChatNudge];
      }
    };
    NudgeBumpVariant = class _NudgeBumpVariant extends __protoMessage3139 {
      constructor(data) {
        super();
        this.bannerMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NudgeBumpVariant().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NudgeBumpVariant().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NudgeBumpVariant().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NudgeBumpVariant, a, b2);
      }
      static $() {
        return ["NudgeBumpVariant|1 banner_message 9|2 banner_description 9?"];
      }
    };
    NudgeAskVariant = class _NudgeAskVariant extends __protoMessage3139 {
      constructor(data) {
        super();
        this.popupMessage = "";
        this.acceptLabel = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NudgeAskVariant().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NudgeAskVariant().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NudgeAskVariant().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NudgeAskVariant, a, b2);
      }
      static $() {
        return ["NudgeAskVariant|1 popup_message 9|2 accept_label 9"];
      }
    };
    NudgeSilentSwitchVariant = class _NudgeSilentSwitchVariant extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NudgeSilentSwitchVariant().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NudgeSilentSwitchVariant().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NudgeSilentSwitchVariant().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NudgeSilentSwitchVariant, a, b2);
      }
      static $() {
        return ["NudgeSilentSwitchVariant"];
      }
    };
    NewChatNudge = class _NewChatNudge extends __protoMessage3139 {
      constructor(data) {
        super();
        this.nudgeId = "";
        this.targetModel = "";
        this.experimentName = "";
        this.variant = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewChatNudge().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewChatNudge().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewChatNudge().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewChatNudge, a, b2);
      }
      static $() {
        return ["NewChatNudge|1 nudge_id 9|2 target_model 9|3 experiment_name 9|4 bump #0 variant|5 ask #1 variant|6 silent_switch #2 variant", NudgeBumpVariant, NudgeAskVariant, NudgeSilentSwitchVariant];
      }
    };
    ListLocalSubscriptionToolsRequest = class _ListLocalSubscriptionToolsRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListLocalSubscriptionToolsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListLocalSubscriptionToolsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListLocalSubscriptionToolsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListLocalSubscriptionToolsRequest, a, b2);
      }
      static $() {
        return ["ListLocalSubscriptionToolsRequest"];
      }
    };
    LocalSubscriptionToolDefinition = class _LocalSubscriptionToolDefinition extends __protoMessage3139 {
      constructor(data) {
        super();
        this.toolName = "";
        this.description = "";
        this.inputSchemaJson = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalSubscriptionToolDefinition().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalSubscriptionToolDefinition().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalSubscriptionToolDefinition().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalSubscriptionToolDefinition, a, b2);
      }
      static $() {
        return ["LocalSubscriptionToolDefinition|1 tool_name 9|2 description 9|3 input_schema_json 9"];
      }
    };
    ListLocalSubscriptionToolsResponse = class _ListLocalSubscriptionToolsResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.tools = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListLocalSubscriptionToolsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListLocalSubscriptionToolsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListLocalSubscriptionToolsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListLocalSubscriptionToolsResponse, a, b2);
      }
      static $() {
        return ["ListLocalSubscriptionToolsResponse|1 tools #0*", LocalSubscriptionToolDefinition];
      }
    };
    CallLocalSubscriptionToolRequest = class _CallLocalSubscriptionToolRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.toolName = "";
        this.toolArgsJson = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CallLocalSubscriptionToolRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CallLocalSubscriptionToolRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CallLocalSubscriptionToolRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CallLocalSubscriptionToolRequest, a, b2);
      }
      static $() {
        return ["CallLocalSubscriptionToolRequest|1 conversation_id 9|2 tool_name 9|3 tool_args_json 9"];
      }
    };
    CallLocalSubscriptionToolResponse = class _CallLocalSubscriptionToolResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.resultJson = "";
        this.isError = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CallLocalSubscriptionToolResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CallLocalSubscriptionToolResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CallLocalSubscriptionToolResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CallLocalSubscriptionToolResponse, a, b2);
      }
      static $() {
        return ["CallLocalSubscriptionToolResponse|1 result_json 9|2 is_error 8|3 watch_expires_at_unix_ms 3?"];
      }
    };
    SubscriptionDeliveryEntry = class _SubscriptionDeliveryEntry extends __protoMessage3139 {
      constructor(data) {
        super();
        this.subscriptionId = "";
        this.eventId = "";
        this.inboxRelPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubscriptionDeliveryEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubscriptionDeliveryEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubscriptionDeliveryEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubscriptionDeliveryEntry, a, b2);
      }
      static $() {
        return ["SubscriptionDeliveryEntry|1 subscription_id 9|2 event_id 9|3 inbox_rel_path 9"];
      }
    };
    SubscriptionRemovedEntry = class _SubscriptionRemovedEntry extends __protoMessage3139 {
      constructor(data) {
        super();
        this.subscriptionId = "";
        this.inboxRelPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubscriptionRemovedEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubscriptionRemovedEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubscriptionRemovedEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubscriptionRemovedEntry, a, b2);
      }
      static $() {
        return ["SubscriptionRemovedEntry|1 subscription_id 9|2 inbox_rel_path 9"];
      }
    };
    LocalAgentMailboxEntry = class _LocalAgentMailboxEntry extends __protoMessage3139 {
      constructor(data) {
        super();
        this.localAgentMailboxEntryId = "";
        this.payload = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalAgentMailboxEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalAgentMailboxEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalAgentMailboxEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalAgentMailboxEntry, a, b2);
      }
      static $() {
        return ["LocalAgentMailboxEntry|1 local_agent_mailbox_entry_id 9|2 subscription_delivery #0 payload|3 subscription_removed #1 payload", SubscriptionDeliveryEntry, SubscriptionRemovedEntry];
      }
    };
    StreamLocalAgentMailboxRequest = class _StreamLocalAgentMailboxRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversations = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamLocalAgentMailboxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamLocalAgentMailboxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamLocalAgentMailboxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamLocalAgentMailboxRequest, a, b2);
      }
      static $() {
        return ["StreamLocalAgentMailboxRequest|1 conversations #0*", StreamLocalAgentMailboxRequest_ConversationCursor];
      }
    };
    StreamLocalAgentMailboxRequest_ConversationCursor = class _StreamLocalAgentMailboxRequest_ConversationCursor extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.afterOffset = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamLocalAgentMailboxRequest_ConversationCursor().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamLocalAgentMailboxRequest_ConversationCursor().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamLocalAgentMailboxRequest_ConversationCursor().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamLocalAgentMailboxRequest_ConversationCursor, a, b2);
      }
      static $() {
        return ["StreamLocalAgentMailboxRequest.ConversationCursor|1 conversation_id 9|2 after_offset 9"];
      }
    };
    LocalAgentMailboxDelivery = class _LocalAgentMailboxDelivery extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.offset = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalAgentMailboxDelivery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalAgentMailboxDelivery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalAgentMailboxDelivery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalAgentMailboxDelivery, a, b2);
      }
      static $() {
        return ["LocalAgentMailboxDelivery|1 conversation_id 9|2 offset 9|3 entry #0", LocalAgentMailboxEntry];
      }
    };
    LocalAgentMailboxGap = class _LocalAgentMailboxGap extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.afterOffset = "";
        this.resumeOffset = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalAgentMailboxGap().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalAgentMailboxGap().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalAgentMailboxGap().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalAgentMailboxGap, a, b2);
      }
      static $() {
        return ["LocalAgentMailboxGap|1 conversation_id 9|2 after_offset 9|3 resume_offset 9"];
      }
    };
    LocalAgentMailboxEnded = class _LocalAgentMailboxEnded extends __protoMessage3139 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.reason = LocalAgentMailboxEndedReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LocalAgentMailboxEnded().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LocalAgentMailboxEnded().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LocalAgentMailboxEnded().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LocalAgentMailboxEnded, a, b2);
      }
      static $() {
        return ["LocalAgentMailboxEnded|1 conversation_id 9|2 reason #0", LocalAgentMailboxEndedReason];
      }
    };
    StreamLocalAgentMailboxHeartbeat = class _StreamLocalAgentMailboxHeartbeat extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamLocalAgentMailboxHeartbeat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamLocalAgentMailboxHeartbeat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamLocalAgentMailboxHeartbeat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamLocalAgentMailboxHeartbeat, a, b2);
      }
      static $() {
        return ["StreamLocalAgentMailboxHeartbeat"];
      }
    };
    StreamLocalAgentMailboxResponse = class _StreamLocalAgentMailboxResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamLocalAgentMailboxResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamLocalAgentMailboxResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamLocalAgentMailboxResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamLocalAgentMailboxResponse, a, b2);
      }
      static $() {
        return ["StreamLocalAgentMailboxResponse|1 delivery #0 message|2 heartbeat #1 message|3 gap #2 message|4 ended #3 message", LocalAgentMailboxDelivery, StreamLocalAgentMailboxHeartbeat, LocalAgentMailboxGap, LocalAgentMailboxEnded];
      }
    };
    GetNewChatNudgeParameterizedModelPickerRequest = class _GetNewChatNudgeParameterizedModelPickerRequest extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetNewChatNudgeParameterizedModelPickerRequest, a, b2);
      }
      static $() {
        return ["GetNewChatNudgeParameterizedModelPickerRequest|1 current_model #0|2 model_nudges_enabled 8?", RequestedModel];
      }
    };
    GetNewChatNudgeParameterizedModelPickerResponse = class _GetNewChatNudgeParameterizedModelPickerResponse extends __protoMessage3139 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetNewChatNudgeParameterizedModelPickerResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetNewChatNudgeParameterizedModelPickerResponse, a, b2);
      }
      static $() {
        return ["GetNewChatNudgeParameterizedModelPickerResponse|1 nudge #0?", NewChatNudgeV2];
      }
    };
    NewChatNudgeV2 = class _NewChatNudgeV2 extends __protoMessage3139 {
      constructor(data) {
        super();
        this.nudgeId = "";
        this.experimentName = "";
        this.variant = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewChatNudgeV2().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewChatNudgeV2().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewChatNudgeV2().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewChatNudgeV2, a, b2);
      }
      static $() {
        return ["NewChatNudgeV2|1 nudge_id 9|2 target_model #0|3 experiment_name 9|4 bump #1 variant|5 ask #2 variant|6 silent_switch #3 variant", RequestedModel, NudgeBumpVariant, NudgeAskVariant, NudgeSilentSwitchVariant];
      }
    };
  }
});
