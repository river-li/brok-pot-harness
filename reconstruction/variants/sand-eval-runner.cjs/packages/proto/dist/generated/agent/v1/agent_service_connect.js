/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/agent_service_connect.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();

// @recovered-fragment 2/2
var AgentService = {
  typeName: "agent.v1.AgentService",
  methods: {
    /**
     * @generated from rpc agent.v1.AgentService.Run
     */
    run: {
      name: "Run",
      I: AgentClientMessage,
      O: AgentServerMessage,
      kind: MethodKind.BiDiStreaming
    },
    /**
     * @generated from rpc agent.v1.AgentService.RunSSE
     */
    runSSE: {
      name: "RunSSE",
      I: BidiRequestId,
      O: AgentServerMessage,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc agent.v1.AgentService.RunPoll
     */
    runPoll: {
      name: "RunPoll",
      I: BidiPollRequest,
      O: BidiPollResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Generate a very short, succinct agent name from the provided user message.
     *
     * @generated from rpc agent.v1.AgentService.NameAgent
     */
    nameAgent: {
      name: "NameAgent",
      I: NameAgentRequest,
      O: NameAgentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Update persisted metadata for a conversation.
     *
     * @generated from rpc agent.v1.AgentService.UpdateConversationMetadata
     */
    updateConversationMetadata: {
      name: "UpdateConversationMetadata",
      I: UpdateConversationMetadataRequest,
      O: UpdateConversationMetadataResponse,
      kind: MethodKind.Unary
    },
    /**
     * Generate a short overview for a formatted transcript conversation.
     *
     * @generated from rpc agent.v1.AgentService.CreateTranscriptOverview
     */
    createTranscriptOverview: {
      name: "CreateTranscriptOverview",
      I: CreateTranscriptOverviewRequest,
      O: CreateTranscriptOverviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.AgentService.GetUsableModels
     */
    getUsableModels: {
      name: "GetUsableModels",
      I: GetUsableModelsRequest,
      O: GetUsableModelsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.AgentService.GetDefaultModelForCli
     */
    getDefaultModelForCli: {
      name: "GetDefaultModelForCli",
      I: GetDefaultModelForCliRequest,
      O: GetDefaultModelForCliResponse,
      kind: MethodKind.Unary
    },
    /**
     * Internal endpoint: returns all allowed model intents for devs
     *
     * @generated from rpc agent.v1.AgentService.GetAllowedModelIntents
     */
    getAllowedModelIntents: {
      name: "GetAllowedModelIntents",
      I: GetAllowedModelIntentsRequest,
      O: GetAllowedModelIntentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Upload blobs created during conversation cloning so they reach the
     * Kafka telemetry pipeline.
     *
     * @generated from rpc agent.v1.AgentService.UploadConversationBlobs
     */
    uploadConversationBlobs: {
      name: "UploadConversationBlobs",
      I: UploadConversationBlobsRequest,
      O: UploadConversationBlobsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Explicitly publish a completed same-host local-agent run to internal
     * Prompt Quality. The server derives user identity and the destination.
     *
     * @generated from rpc agent.v1.AgentService.UploadLocalAgentRunToPromptQuality
     */
    uploadLocalAgentRunToPromptQuality: {
      name: "UploadLocalAgentRunToPromptQuality",
      I: UploadLocalAgentRunToPromptQualityRequest,
      O: UploadLocalAgentRunToPromptQualityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create or renew short-lived URLs for user-attached agent media.
     *
     * @generated from rpc agent.v1.AgentService.GetSignedUrlForAttachedMedia
     */
    getSignedUrlForAttachedMedia: {
      name: "GetSignedUrlForAttachedMedia",
      I: GetSignedUrlForAttachedMediaRequest,
      O: GetSignedUrlForAttachedMediaResponse,
      kind: MethodKind.Unary
    },
    /**
     * Record that a conversation was cloned. Called once per clone, separately
     * from blob uploads which may be chunked into multiple RPCs.
     *
     * @generated from rpc agent.v1.AgentService.NotifyConversationClone
     */
    notifyConversationClone: {
      name: "NotifyConversationClone",
      I: NotifyConversationCloneRequest,
      O: NotifyConversationCloneResponse,
      kind: MethodKind.Unary
    },
    /**
     * Called by the client on every new chat creation. The backend evaluates
     * server-side experiments and returns an optional model switch directive
     * with UI variant and copy, so nudge logic lives entirely server-side.
     *
     * @generated from rpc agent.v1.AgentService.GetNewChatNudgeLegacyModelPicker
     */
    getNewChatNudgeLegacyModelPicker: {
      name: "GetNewChatNudgeLegacyModelPicker",
      I: GetNewChatNudgeLegacyModelPickerRequest,
      O: GetNewChatNudgeLegacyModelPickerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.AgentService.GetNewChatNudgeParameterizedModelPicker
     */
    getNewChatNudgeParameterizedModelPicker: {
      name: "GetNewChatNudgeParameterizedModelPicker",
      I: GetNewChatNudgeParameterizedModelPickerRequest,
      O: GetNewChatNudgeParameterizedModelPickerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch the immutable context-usage snapshot selected by a conversation
     * checkpoint. Called only when the user opens the context usage report.
     *
     * @generated from rpc agent.v1.AgentService.GetPromptContextUsage
     */
    getPromptContextUsage: {
      name: "GetPromptContextUsage",
      I: GetPromptContextUsageRequest,
      O: GetPromptContextUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * Local subscriptions: tool definitions for the client-registered
     * `cursor-subscriptions` tool server. Definitions come from the backend so
     * cloud and local agents share exactly one source of truth. Read-only:
     * never creates subscription rows or agent store rows.
     *
     * @generated from rpc agent.v1.AgentService.ListLocalSubscriptionTools
     */
    listLocalSubscriptionTools: {
      name: "ListLocalSubscriptionTools",
      I: ListLocalSubscriptionToolsRequest,
      O: ListLocalSubscriptionToolsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Local subscriptions: execute one `cursor-subscriptions` tool call for a
     * local conversation through the same subscribe pipeline cloud agents use.
     * The caller must own the conversation's live LOCAL agent store row; the
     * server never creates a `backgroundComposer` row for a local conversation.
     *
     * @generated from rpc agent.v1.AgentService.CallLocalSubscriptionTool
     */
    callLocalSubscriptionTool: {
      name: "CallLocalSubscriptionTool",
      I: CallLocalSubscriptionToolRequest,
      O: CallLocalSubscriptionToolResponse,
      kind: MethodKind.Unary
    },
    /**
     * Local-agent mailbox: one long-lived stream per editor instance that
     * drains the per-conversation Redis mailbox of the local conversations the
     * caller owns. The mailbox is generic (delivery pointers + wake); local
     * subscriptions are the first consumer. Resumable with client-owned
     * cursors: pass each conversation's last processed offset to receive
     * everything after it.
     *
     * The stream is also the reconciler: the client puts every conversation
     * that might be worth watching into the request and lets the frames settle
     * each one — retained entries are drained first, then a conversation with
     * no open subscription ends with `NO_ACTIVE_SUBSCRIPTIONS`, and a missing,
     * deleted, or foreign store ends with `STORE_DELETED` at connect. There is
     * no separate unary discovery RPC.
     *
     * @generated from rpc agent.v1.AgentService.StreamLocalAgentMailbox
     */
    streamLocalAgentMailbox: {
      name: "StreamLocalAgentMailbox",
      I: StreamLocalAgentMailboxRequest,
      O: StreamLocalAgentMailboxResponse,
      kind: MethodKind.ServerStreaming
    }
  }
};

