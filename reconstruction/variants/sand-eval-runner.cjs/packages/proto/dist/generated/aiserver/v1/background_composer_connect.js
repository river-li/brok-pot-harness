/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/background_composer_connect.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();

// @recovered-fragment 2/2
var BackgroundComposerService = {
  typeName: "aiserver.v1.BackgroundComposerService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListBackgroundComposers
     */
    listBackgroundComposers: {
      name: "ListBackgroundComposers",
      I: ListBackgroundComposersRequest,
      O: ListBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPrBackgroundComposers
     */
    listPrBackgroundComposers: {
      name: "ListPrBackgroundComposers",
      I: ListPrBackgroundComposersRequest,
      O: ListPrBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.PinBackgroundComposers
     */
    pinBackgroundComposers: {
      name: "PinBackgroundComposers",
      I: PinBackgroundComposersRequest,
      O: PinBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.UnpinBackgroundComposers
     */
    unpinBackgroundComposers: {
      name: "UnpinBackgroundComposers",
      I: UnpinBackgroundComposersRequest,
      O: UnpinBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * DEPRECATED: always returns UNIMPLEMENTED. The CLI feature that backed this
     * RPC was unshipped. Retained in the proto for wire compatibility with old
     * clients.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AttachBackgroundComposer
     * @deprecated
     */
    attachBackgroundComposer: {
      name: "AttachBackgroundComposer",
      I: AttachBackgroundComposerRequest,
      O: AttachBackgroundComposerResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.StreamConversation
     */
    streamConversation: {
      name: "StreamConversation",
      I: StreamConversationRequest,
      O: StreamConversationResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetLatestAgentConversationState
     */
    getLatestAgentConversationState: {
      name: "GetLatestAgentConversationState",
      I: GetLatestAgentConversationStateRequest,
      O: GetLatestAgentConversationStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBlobForAgentKV
     */
    getBlobForAgentKV: {
      name: "GetBlobForAgentKV",
      I: GetBlobForAgentKVRequest,
      O: GetBlobForAgentKVResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.AttachBackgroundComposerLogs
     */
    attachBackgroundComposerLogs: {
      name: "AttachBackgroundComposerLogs",
      I: AttachBackgroundComposerLogsRequest,
      O: AttachBackgroundComposerLogsResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Stream agent-level (bcId-scoped) startup trace spans. Dev-only.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AttachAgentStartupTrace
     */
    attachAgentStartupTrace: {
      name: "AttachAgentStartupTrace",
      I: AttachAgentStartupTraceRequest,
      O: AttachAgentStartupTraceResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Start one or more background composers from snapshot/repo state.
     * For user-authenticated starts, backend enforces plan-based concurrency limits.
     * Service-account starts bypass this user-plan concurrency limit.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartBackgroundComposerFromSnapshot
     */
    startBackgroundComposerFromSnapshot: {
      name: "StartBackgroundComposerFromSnapshot",
      I: StartBackgroundComposerFromSnapshotRequest,
      O: StartBackgroundComposerFromSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cloud onboarding Get Started wrapper. Starts the selected onboarding
     * composer, then schedules selected and heuristic environment setup.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartCloudOnboarding
     */
    startCloudOnboarding: {
      name: "StartCloudOnboarding",
      I: StartCloudOnboardingRequest,
      O: StartBackgroundComposerFromSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * Change Monitor setup-chat kickoff. Stamps the Change Monitor source server-side.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartChangeMonitorOnboarding
     */
    startChangeMonitorOnboarding: {
      name: "StartChangeMonitorOnboarding",
      I: StartChangeMonitorOnboardingRequest,
      O: StartBackgroundComposerFromSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartCloudOnboardingHeuristicEnvSetup
     */
    startCloudOnboardingHeuristicEnvSetup: {
      name: "StartCloudOnboardingHeuristicEnvSetup",
      I: StartCloudOnboardingHeuristicEnvSetupRequest,
      O: StartCloudOnboardingHeuristicEnvSetupResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fork an existing cloud agent into a new agent.
     * Copies conversation state + blobs and forks the source agent's Anyrun pod
     * (when a live pod exists) so the new agent continues from that filesystem.
     * Reuses the source start config (MCP, skills, plugins, private worker, etc.).
     * CONVERSATION and POD modes both take this path.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ForkBackgroundComposer
     */
    forkBackgroundComposer: {
      name: "ForkBackgroundComposer",
      I: ForkBackgroundComposerRequest,
      O: ForkBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create a durable side chat (`/side`) of a cloud agent: a child composer
     * with its own bcId and followupable turn workflow, seeded from one
     * committed parent checkpoint, executing on the parent's pod and storage.
     * The only path allowed to author the AS_SIDE_CHAT_FROM_CLOUD source.
     * Owner-only for the initial launch; gated by `cloud_agent_side_chats`.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartSideChatBackgroundComposer
     */
    startSideChatBackgroundComposer: {
      name: "StartSideChatBackgroundComposer",
      I: StartSideChatBackgroundComposerRequest,
      O: StartSideChatBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * List a parent's side-chat children for durable rediscovery (Glass reload,
     * web tabs). Owner-only. Ordinary top-level lists never include side chats;
     * this parent-scoped contract is the only way to enumerate them.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListBackgroundComposerChildren
     */
    listBackgroundComposerChildren: {
      name: "ListBackgroundComposerChildren",
      I: ListBackgroundComposerChildrenRequest,
      O: ListBackgroundComposerChildrenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.MakePRBackgroundComposer
     */
    makePRBackgroundComposer: {
      name: "MakePRBackgroundComposer",
      I: MakePRBackgroundComposerRequest,
      O: MakePRBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.OpenPRBackgroundComposer
     */
    openPRBackgroundComposer: {
      name: "OpenPRBackgroundComposer",
      I: OpenPRBackgroundComposerRequest,
      O: OpenPRBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the status of a background composer (running or finished)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerStatus
     */
    getBackgroundComposerStatus: {
      name: "GetBackgroundComposerStatus",
      I: GetBackgroundComposerStatusRequest,
      O: GetBackgroundComposerStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Add followup context to a background composer session
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AddAsyncFollowupBackgroundComposer
     */
    addAsyncFollowupBackgroundComposer: {
      name: "AddAsyncFollowupBackgroundComposer",
      I: AddAsyncFollowupBackgroundComposerRequest,
      O: AddAsyncFollowupBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admit a mid-run context injection (steer) targeting the agent's active
     * run. Delivered at the next safe inner-step boundary without cancelling
     * in-flight work; an injection that loses the run-end race is converted to
     * an ordinary next-turn follow-up (outcome queued_for_next_turn) rather
     * than silently dropped. Admission is idempotent by injection_id.
     * See docs/rfcs/RFC-agent-active-context-injection.md.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.InjectBackgroundComposerContext
     */
    injectBackgroundComposerContext: {
      name: "InjectBackgroundComposerContext",
      I: InjectBackgroundComposerContextRequest,
      O: InjectBackgroundComposerContextResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.SubmitInteractionResponseBackgroundComposer
     */
    submitInteractionResponseBackgroundComposer: {
      name: "SubmitInteractionResponseBackgroundComposer",
      I: SubmitInteractionResponseBackgroundComposerRequest,
      O: SubmitInteractionResponseBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPendingFollowups
     */
    listPendingFollowups: {
      name: "ListPendingFollowups",
      I: ListPendingFollowupsRequest,
      O: ListPendingFollowupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdatePendingFollowup
     */
    updatePendingFollowup: {
      name: "UpdatePendingFollowup",
      I: UpdatePendingFollowupRequest,
      O: UpdatePendingFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeletePendingFollowup
     */
    deletePendingFollowup: {
      name: "DeletePendingFollowup",
      I: DeletePendingFollowupRequest,
      O: DeletePendingFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReorderPendingFollowup
     */
    reorderPendingFollowup: {
      name: "ReorderPendingFollowup",
      I: ReorderPendingFollowupRequest,
      O: ReorderPendingFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.SubmitPendingFollowupNow
     */
    submitPendingFollowupNow: {
      name: "SubmitPendingFollowupNow",
      I: SubmitPendingFollowupNowRequest,
      O: SubmitPendingFollowupNowResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.MarkFollowupEditing
     */
    markFollowupEditing: {
      name: "MarkFollowupEditing",
      I: MarkFollowupEditingRequest,
      O: MarkFollowupEditingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetCursorServerUrl
     */
    getCursorServerUrl: {
      name: "GetCursorServerUrl",
      I: GetCursorServerUrlRequest,
      O: GetCursorServerUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * Pre-download the cursor server binary for a given commit without starting it.
     * The server tracks which commits have already been downloaded per pod and
     * skips the download (and VM wake) if the commit is already installed.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.WarmCursorServerDownload
     */
    warmCursorServerDownload: {
      name: "WarmCursorServerDownload",
      I: WarmCursorServerDownloadRequest,
      O: WarmCursorServerDownloadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Optimistically create an anyrun pod for a future cloud-agent start and
     * cache it by the pod-shaping request config for single-use reuse.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PreWarmPod
     */
    preWarmPod: {
      name: "PreWarmPod",
      I: PreWarmPodRequest,
      O: PreWarmPodResponse,
      kind: MethodKind.Unary
    },
    /**
     * Wake an existing agent's pod. If the pod is only hibernated it is resumed;
     * if it is gone the pod is recreated with its git state restored. Async:
     * returns immediately. Observe readiness via GetMachine.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.WakeBackgroundComposer
     */
    wakeBackgroundComposer: {
      name: "WakeBackgroundComposer",
      I: WakeBackgroundComposerRequest,
      O: WakeBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.PauseBackgroundComposer
     */
    pauseBackgroundComposer: {
      name: "PauseBackgroundComposer",
      I: PauseBackgroundComposerRequest,
      O: PauseBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cancel a single in-flight tool/shell call without pausing the whole run.
     * Best-effort: accepted=true means the cancel signal was delivered to a
     * running turn, not that the tool was still in-flight when handled.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CancelBackgroundComposerToolCall
     */
    cancelBackgroundComposerToolCall: {
      name: "CancelBackgroundComposerToolCall",
      I: CancelBackgroundComposerToolCallRequest,
      O: CancelBackgroundComposerToolCallResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ResumeBackgroundComposer
     */
    resumeBackgroundComposer: {
      name: "ResumeBackgroundComposer",
      I: ResumeBackgroundComposerRequest,
      O: ResumeBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ArchiveBackgroundComposer
     */
    archiveBackgroundComposer: {
      name: "ArchiveBackgroundComposer",
      I: ArchiveBackgroundComposerRequest,
      O: ArchiveBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Bulk-archives every non-archived composer for a repository, either for the
     * caller (personal scope) or for a whole team (requires
     * team.background_composers.manage on the requested team). Archiving aborts
     * still-running agents; it never closes pull requests or deletes branches.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ArchiveRepoBackgroundComposers
     */
    archiveRepoBackgroundComposers: {
      name: "ArchiveRepoBackgroundComposers",
      I: ArchiveRepoBackgroundComposersRequest,
      O: ArchiveRepoBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeleteBackgroundComposer
     */
    deleteBackgroundComposer: {
      name: "DeleteBackgroundComposer",
      I: DeleteBackgroundComposerRequest,
      O: DeleteBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get background composer info including diff data
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerInfo
     */
    getBackgroundComposerInfo: {
      name: "GetBackgroundComposerInfo",
      I: GetBackgroundComposerInfoRequest,
      O: GetBackgroundComposerInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the current environment version summary for a background composer.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerEnvironmentVersion
     */
    getBackgroundComposerEnvironmentVersion: {
      name: "GetBackgroundComposerEnvironmentVersion",
      I: GetBackgroundComposerEnvironmentVersionRequest,
      O: GetBackgroundComposerEnvironmentVersionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the current viewer's effective environment history for a repo or repo group.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentHistory
     */
    getEnvironmentHistory: {
      name: "GetEnvironmentHistory",
      I: GetEnvironmentHistoryRequest,
      O: GetEnvironmentHistoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get recently collected cloud-agent timing events.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerTimings
     */
    getBackgroundComposerTimings: {
      name: "GetBackgroundComposerTimings",
      I: GetBackgroundComposerTimingsRequest,
      O: GetBackgroundComposerTimingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the repository info from a background composer instance
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerRepositoryInfo
     */
    getBackgroundComposerRepositoryInfo: {
      name: "GetBackgroundComposerRepositoryInfo",
      I: GetBackgroundComposerRepositoryInfoRequest,
      O: GetBackgroundComposerRepositoryInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the machine reference for a background composer
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetMachine
     */
    getMachine: {
      name: "GetMachine",
      I: GetMachineRequest,
      O: GetMachineResponse,
      kind: MethodKind.Unary
    },
    /**
     * List a cloud agent's workspace files so the Glass UI can power Cmd+P
     * quick-open. Reads through the shared MachineHandle (ControlService), so it
     * works for any backing machine without a cursor-server. File contents come
     * from the existing ReadBinaryFile RPC.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListWorkspaceFiles
     */
    listWorkspaceFiles: {
      name: "ListWorkspaceFiles",
      I: ListWorkspaceFilesRequest,
      O: ListWorkspaceFilesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Take or release the exec-daemon desktop lease for a cloud-agent VM so a
     * human can drive the Cloud Desktop without the agent's input landing.
     * Authenticated users only; the actor is always the caller. Callers must
     * stay view-only until `held` is true. Fails Unimplemented when the feature
     * is off or the VM's daemon predates the lease.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DesktopLease
     */
    desktopLease: {
      name: "DesktopLease",
      I: BackgroundComposerDesktopLeaseRequest,
      O: BackgroundComposerDesktopLeaseResponse,
      kind: MethodKind.Unary
    },
    /**
     * Relay ControlService.GetResourceUsage to the agent's machine, pod or
     * self-hosted worker; clients never dial a machine themselves. Pods are
     * read without wake or lease headers, so a hibernated pod stays asleep.
     * Same VM_ACCESS tier as GetMachine; PermissionDenied when the owner does
     * not pass cloud_agent_machine_resources; Unavailable while the machine
     * cannot answer, with a MachineResourceUnavailableDetail naming why (asleep,
     * not ready, worker not connected, or a failed hop); the daemon's
     * Unimplemented / FailedPrecondition / InvalidArgument pass through.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetMachineResourceUsage
     */
    getMachineResourceUsage: {
      name: "GetMachineResourceUsage",
      I: GetMachineResourceUsageRequest,
      O: GetResourceUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListDetailedBackgroundComposers
     */
    listDetailedBackgroundComposers: {
      name: "ListDetailedBackgroundComposers",
      I: ListDetailedBackgroundComposersRequest,
      O: ListDetailedBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListCloudAgentRunsForDashboard
     */
    listCloudAgentRunsForDashboard: {
      name: "ListCloudAgentRunsForDashboard",
      I: ListCloudAgentRunsForDashboardRequest,
      O: ListCloudAgentRunsForDashboardResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.AggregateCloudAgentRunsForDashboard
     */
    aggregateCloudAgentRunsForDashboard: {
      name: "AggregateCloudAgentRunsForDashboard",
      I: AggregateCloudAgentRunsForDashboardRequest,
      O: AggregateCloudAgentRunsForDashboardResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetCloudAgentRunForDashboard
     */
    getCloudAgentRunForDashboard: {
      name: "GetCloudAgentRunForDashboard",
      I: GetCloudAgentRunForDashboardRequest,
      O: GetCloudAgentRunForDashboardResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListCloudAgentRunEventsForDashboard
     */
    listCloudAgentRunEventsForDashboard: {
      name: "ListCloudAgentRunEventsForDashboard",
      I: ListCloudAgentRunEventsForDashboardRequest,
      O: ListCloudAgentRunEventsForDashboardResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListNamedAgents
     */
    listNamedAgents: {
      name: "ListNamedAgents",
      I: ListNamedAgentsRequest,
      O: ListNamedAgentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListNamedAgentSessions
     */
    listNamedAgentSessions: {
      name: "ListNamedAgentSessions",
      I: ListNamedAgentSessionsRequest,
      O: ListNamedAgentSessionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListEventSubscriptions
     */
    listEventSubscriptions: {
      name: "ListEventSubscriptions",
      I: ListEventSubscriptionsRequest,
      O: ListEventSubscriptionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CloseEventSubscription
     */
    closeEventSubscription: {
      name: "CloseEventSubscription",
      I: CloseEventSubscriptionRequest,
      O: CloseEventSubscriptionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetGithubAccessTokenForRepos
     */
    getGithubAccessTokenForRepos: {
      name: "GetGithubAccessTokenForRepos",
      I: GetGithubAccessTokenForReposRequest,
      O: GetGithubAccessTokenForReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * Proxies a single GitHub API call on behalf of the IDE so its traffic
     * shows up on backend's `bugbot.get_octokit.*` Datadog metrics with
     * `caller:ide-*` attribution (CS-58 / SEV-958). The IDE supplies its
     * own user OAuth token; backend never persists it. Gated by the
     * `ide_make_github_request_enabled` Statsig flag — returns Unimplemented
     * when off so old / gate-off IDE clients fall through to direct fetch.
     * Owner: team-async. Design: `canvases/github-client-phase4-plan.canvas.tsx`.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MakeGithubRequest
     */
    makeGithubRequest: {
      name: "MakeGithubRequest",
      I: MakeGithubRequestRequest,
      O: MakeGithubRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deprecated: use GetOptimizedDiffDetails instead.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerDiffDetails
     * @deprecated
     */
    getBackgroundComposerDiffDetails: {
      name: "GetBackgroundComposerDiffDetails",
      I: GetBackgroundComposerDiffDetailsRequest,
      O: GetBackgroundComposerDiffDetailsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetOptimizedDiffDetails
     */
    getOptimizedDiffDetails: {
      name: "GetOptimizedDiffDetails",
      I: GetOptimizedDiffDetailsRequest,
      O: GetOptimizedDiffDetailsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPrCodeTourRevisions
     */
    listPrCodeTourRevisions: {
      name: "ListPrCodeTourRevisions",
      I: ListPrCodeTourRevisionsRequest,
      O: ListPrCodeTourRevisionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Stack membership for the composer's pull request, so the portal can offer
     * stack-scoped tour generation only when the PR is actually in a stack.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPrCodeTourStackContext
     */
    getPrCodeTourStackContext: {
      name: "GetPrCodeTourStackContext",
      I: GetPrCodeTourStackContextRequest,
      O: GetPrCodeTourStackContextResponse,
      kind: MethodKind.Unary
    },
    /**
     * Schedules server-side generation of a code tour that narrates the whole
     * PR stack with every member's diff. The result is persisted as a
     * stack-scoped revision readable via ListPrCodeTourRevisions.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GeneratePrCodeTourForStack
     */
    generatePrCodeTourForStack: {
      name: "GeneratePrCodeTourForStack",
      I: GeneratePrCodeTourForStackRequest,
      O: GeneratePrCodeTourForStackResponse,
      kind: MethodKind.Unary
    },
    /**
     * Marks (or unmarks) one tour section as reviewed. The mark persists on the
     * COMPLETE tour revision itself, so a reload and every teammate viewing the
     * same revision see the same remaining set. Gated by
     * enable_code_tour_section_reviewed; fail-closed when the gate is off or
     * the caller has no user identity.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SetPrCodeTourSectionReviewed
     */
    setPrCodeTourSectionReviewed: {
      name: "SetPrCodeTourSectionReviewed",
      I: SetPrCodeTourSectionReviewedRequest,
      O: SetPrCodeTourSectionReviewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * get a hash that represents whether or not the background composer has changed
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerChangesHash
     */
    getBackgroundComposerChangesHash: {
      name: "GetBackgroundComposerChangesHash",
      I: GetBackgroundComposerChangesHashRequest,
      O: GetBackgroundComposerChangesHashResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch an existing pull-request URL (if any) for the background composer's branch.
     * For multi-repo composers, branch identity is scoped by the canonical repo URL
     * so same-named branches in different repos can resolve to different PRs.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerPullRequest
     */
    getBackgroundComposerPullRequest: {
      name: "GetBackgroundComposerPullRequest",
      I: GetBackgroundComposerPullRequestRequest,
      O: GetBackgroundComposerPullRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.RefreshGithubAccessTokenInBackgroundComposer
     */
    refreshGithubAccessTokenInBackgroundComposer: {
      name: "RefreshGithubAccessTokenInBackgroundComposer",
      I: RefreshGithubAccessTokenInBackgroundComposerRequest,
      O: RefreshGithubAccessTokenInBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateBackgroundComposerPod
     */
    createBackgroundComposerPod: {
      name: "CreateBackgroundComposerPod",
      I: CreateBackgroundComposerPodRequest,
      O: CreateBackgroundComposerPodResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.AttachBackgroundComposerPod
     */
    attachBackgroundComposerPod: {
      name: "AttachBackgroundComposerPod",
      I: AttachBackgroundComposerPodRequest,
      O: AttachBackgroundComposerPodResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateBackgroundComposerPodSnapshot
     */
    createBackgroundComposerPodSnapshot: {
      name: "CreateBackgroundComposerPodSnapshot",
      I: CreateBackgroundComposerPodSnapshotRequest,
      O: CreateBackgroundComposerPodSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ChangeBackgroundComposerSnapshotVisibility
     */
    changeBackgroundComposerSnapshotVisibility: {
      name: "ChangeBackgroundComposerSnapshotVisibility",
      I: ChangeBackgroundComposerSnapshotVisibilityRequest,
      O: ChangeBackgroundComposerSnapshotVisibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerSnapshotInfo
     */
    getBackgroundComposerSnapshotInfo: {
      name: "GetBackgroundComposerSnapshotInfo",
      I: GetBackgroundComposerSnapshotInfoRequest,
      O: GetBackgroundComposerSnapshotInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListBackgroundComposerSnapshotsByBcId
     */
    listBackgroundComposerSnapshotsByBcId: {
      name: "ListBackgroundComposerSnapshotsByBcId",
      I: ListBackgroundComposerSnapshotsByBcIdRequest,
      O: ListBackgroundComposerSnapshotsByBcIdResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListBackgroundComposerSnapshotStatusesByBcIds
     */
    listBackgroundComposerSnapshotStatusesByBcIds: {
      name: "ListBackgroundComposerSnapshotStatusesByBcIds",
      I: ListBackgroundComposerSnapshotStatusesByBcIdsRequest,
      O: ListBackgroundComposerSnapshotStatusesByBcIdsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the current state of a snapshot (for polling)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerSnapshotState
     */
    getBackgroundComposerSnapshotState: {
      name: "GetBackgroundComposerSnapshotState",
      I: GetBackgroundComposerSnapshotStateRequest,
      O: GetBackgroundComposerSnapshotStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * Watch snapshot state changes (for streaming)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.WatchBackgroundComposerSnapshotState
     */
    watchBackgroundComposerSnapshotState: {
      name: "WatchBackgroundComposerSnapshotState",
      I: WatchBackgroundComposerSnapshotStateRequest,
      O: WatchBackgroundComposerSnapshotStateResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerConversation
     */
    getBackgroundComposerConversation: {
      name: "GetBackgroundComposerConversation",
      I: GetBackgroundComposerConversationRequest,
      O: GetBackgroundComposerConversationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Rename a background composer
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RenameBackgroundComposer
     */
    renameBackgroundComposer: {
      name: "RenameBackgroundComposer",
      I: RenameBackgroundComposerRequest,
      O: RenameBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Update the appearance of a root Project. For a composer without a
     * background_composer_project_metadata row, the server checks its persisted
     * CloudAgentState for root-Project evidence and creates the row when found
     * (lazily migrating legacy client-owned roots); ordinary agents are
     * rejected so an appearance write can never mint Project identity.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateProjectAppearance
     */
    updateProjectAppearance: {
      name: "UpdateProjectAppearance",
      I: UpdateProjectAppearanceRequest,
      O: UpdateProjectAppearanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Seed one to three server-proposed Projects for the calling user from
     * fourteen days of cloud-agent header metadata. Current user only.
     * Idempotent per campaign: a second call returns the first call's rows. A
     * run that proposes nothing writes nothing, so a later call may seed.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SeedStagedProjects
     */
    seedStagedProjects: {
      name: "SeedStagedProjects",
      I: SeedStagedProjectsRequest,
      O: SeedStagedProjectsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Promotable staged Projects for the calling user. Stale targets (deleted
     * environment, repo access lost) are omitted; a STAGED row whose composer
     * already exists is reconciled to PROMOTED and omitted.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListStagedProjects
     */
    listStagedProjects: {
      name: "ListStagedProjects",
      I: ListStagedProjectsRequest,
      O: ListStagedProjectsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Dry run of SeedStagedProjects for the calling user. Runs the same
     * evidence-to-candidates generation and returns the parsed candidates with
     * diagnostics. Writes nothing, so it can be repeated to iterate on the
     * prompt guidance. Developers and Anysphere employees only, behind the
     * seeding gate. Never carries chat ids, prompt text, or raw model output.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PreviewStagedProjects
     */
    previewStagedProjects: {
      name: "PreviewStagedProjects",
      I: PreviewStagedProjectsRequest,
      O: PreviewStagedProjectsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Publish an AGENT_TEMP draft (Origin rename + kind flip) and persist
     * canonicalRepoUrl. Does not rewrite repoUrl, tokens, or the pod remote.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PublishBackgroundComposerTempRepo
     */
    publishBackgroundComposerTempRepo: {
      name: "PublishBackgroundComposerTempRepo",
      I: PublishBackgroundComposerTempRepoRequest,
      O: PublishBackgroundComposerTempRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Attach a parent on an existing cloud agent. Same bcId; not a migration.
     * Writes parent_bc_id + optional subagent_type. Does not accept Task or
     * EventSubscription lineage (those stay spawn-time).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReparentBackgroundComposer
     */
    reparentBackgroundComposer: {
      name: "ReparentBackgroundComposer",
      I: ReparentBackgroundComposerRequest,
      O: ReparentBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Upsert the orthogonal worker→manager membership for a cloud worker.
     * "Manager" is the generic worker→manager relationship; cloud Project
     * coordinators are its first user (nesting may come later). Membership is
     * display/grouping only and does not touch the first-class subagent
     * lineage (parent_bc_id / parent_tool_call_id / subagent_type).
     * Remapping an already-mapped worker updates the row in place.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SetWorkerManager
     */
    setWorkerManager: {
      name: "SetWorkerManager",
      I: SetWorkerManagerRequest,
      O: SetWorkerManagerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Start a Project worker as a regular top-level cloud agent and attach
     * it through worker-manager membership. This never forks the manager's
     * conversation or creates first-class subagent lineage.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateProjectWorker
     */
    createProjectWorker: {
      name: "CreateProjectWorker",
      I: CreateProjectWorkerRequest,
      O: CreateProjectWorkerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Remove the worker's manager membership. No-op when absent.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ClearWorkerManager
     */
    clearWorkerManager: {
      name: "ClearWorkerManager",
      I: ClearWorkerManagerRequest,
      O: ClearWorkerManagerResponse,
      kind: MethodKind.Unary
    },
    /**
     * List the workers attached to a manager through worker→manager membership
     * (the inverse read of SetWorkerManager). Requires read access to the
     * manager agent. Returns membership rows only, not the worker composers;
     * fetch those through the existing list/get RPCs.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListWorkersForManager
     */
    listWorkersForManager: {
      name: "ListWorkersForManager",
      I: ListWorkersForManagerRequest,
      O: ListWorkersForManagerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Push-based replacement for polling ListBackgroundComposers. Streams
     * compact list-level update events (creation, workflow-status changes,
     * archive/unarchive, sidebar-metadata invalidations, worker-manager
     * membership changes, collaborator visibility grants) for every composer
     * the caller's sidebar can see: composers owned by the calling principal
     * plus team-contained composers the caller collaborates on.
     *
     * Protocol: a fresh attach (no resume_cursor) first emits a snapshot (a
     * full ListBackgroundComposersResponse captured after the resume cursor is
     * anchored, so no update between snapshot and tail can be missed), then
     * tails live events. Reconnects pass the last received resume_cursor and
     * are at-least-once: the boundary event may be replayed, and clients must
     * dedupe by (bc_id, updated_at_ms). Events are content-free (ids, enums,
     * flags, timestamps); clients hydrate rows they don't know (CREATED /
     * METADATA_CHANGED) with a targeted ListBackgroundComposers bc_id fetch.
     * The server emits heartbeats and ends the stream at a max lifetime;
     * clients are expected to re-attach with their cursor.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StreamBackgroundComposerUpdates
     */
    streamBackgroundComposerUpdates: {
      name: "StreamBackgroundComposerUpdates",
      I: StreamBackgroundComposerUpdatesRequest,
      O: StreamBackgroundComposerUpdatesResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Update per-agent experimental training model opt-out.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateBackgroundComposerExperimentalModelOptOut
     */
    updateBackgroundComposerExperimentalModelOptOut: {
      name: "UpdateBackgroundComposerExperimentalModelOptOut",
      I: UpdateBackgroundComposerExperimentalModelOptOutRequest,
      O: UpdateBackgroundComposerExperimentalModelOptOutResponse,
      kind: MethodKind.Unary
    },
    /**
     * @deprecated: The agent should be in charge of committing changes to the branch and pushing.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CommitBackgroundComposer
     */
    commitBackgroundComposer: {
      name: "CommitBackgroundComposer",
      I: CommitBackgroundComposerRequest,
      O: CommitBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Save a personal environment. Single-repo saves maintain the legacy
     * userEnvironmentConfig current row for existing readers.
     * Multi-repo saves from setup flow, and unnamed multi-repo saves from any
     * source, are keyed by the full repo_config instead and only write logical
     * environment / environmentVersion rows; repo_url alone is not unique enough
     * to represent arbitrary repo subsets.
     * The portal automation builder also uses this RPC for user-run automations:
     * selecting multiple repos creates or reuses an unnamed personal logical
     * environment with empty JSON ("{}") during Save/Test, immediately before
     * serializing the automation workflow with that environment_public_id.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SetPersonalEnvironmentJson
     */
    setPersonalEnvironmentJson: {
      name: "SetPersonalEnvironmentJson",
      I: SetPersonalEnvironmentJsonRequest,
      O: SetPersonalEnvironmentJsonResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPersonalEnvironmentJson
     */
    getPersonalEnvironmentJson: {
      name: "GetPersonalEnvironmentJson",
      I: GetPersonalEnvironmentJsonRequest,
      O: GetPersonalEnvironmentJsonResponse,
      kind: MethodKind.Unary
    },
    /**
     * Check for environment.json candidates before starting a VM (setup flow).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentJsonCandidates
     */
    getEnvironmentJsonCandidates: {
      name: "GetEnvironmentJsonCandidates",
      I: GetEnvironmentJsonCandidatesRequest,
      O: GetEnvironmentJsonCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPersonalEnvironments
     */
    listPersonalEnvironments: {
      name: "ListPersonalEnvironments",
      I: ListPersonalEnvironmentsRequest,
      O: ListPersonalEnvironmentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeletePersonalEnvironmentJson
     */
    deletePersonalEnvironmentJson: {
      name: "DeletePersonalEnvironmentJson",
      I: DeletePersonalEnvironmentJsonRequest,
      O: DeletePersonalEnvironmentJsonResponse,
      kind: MethodKind.Unary
    },
    /**
     * Publish an environment (personal or team) to GitHub by creating a branch and PR with environment.json
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PublishEnvironment
     */
    publishEnvironment: {
      name: "PublishEnvironment",
      I: PublishEnvironmentRequest,
      O: PublishEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @deprecated Use PublishEnvironment with EnvironmentType.PERSONAL instead
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PublishPersonalEnvironment
     */
    publishPersonalEnvironment: {
      name: "PublishPersonalEnvironment",
      I: PublishPersonalEnvironmentRequest,
      O: PublishPersonalEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team environment management
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListTeamEnvironments
     */
    listTeamEnvironments: {
      name: "ListTeamEnvironments",
      I: ListTeamEnvironmentsRequest,
      O: ListTeamEnvironmentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeleteTeamEnvironment
     */
    deleteTeamEnvironment: {
      name: "DeleteTeamEnvironment",
      I: DeleteTeamEnvironmentRequest,
      O: DeleteTeamEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Save a team environment. Single-repo saves maintain the legacy
     * teamEnvironmentConfig current row for existing readers.
     * Multi-repo saves from setup flow, and unnamed multi-repo saves from any
     * source, are keyed by the full repo_config instead and only write logical
     * environment / environmentVersion rows.
     * The portal automation builder uses this RPC for service-account/team-run
     * automations: selecting multiple repos creates or reuses an unnamed team
     * logical environment with empty JSON ("{}") during Save/Test, immediately
     * before serializing the automation workflow with that environment_public_id.
     * Unlike the personal RPC, this response does not return the environment, so
     * clients that create a new logical environment must refetch and match it.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SetTeamEnvironmentJson
     */
    setTeamEnvironmentJson: {
      name: "SetTeamEnvironmentJson",
      I: SetTeamEnvironmentJsonRequest,
      O: SetTeamEnvironmentJsonResponse,
      kind: MethodKind.Unary
    },
    /**
     * Restore an existing immutable EnvironmentVersion by appending a new
     * database EnvironmentVersion that copies the selected version's content.
     * The lifecycle event references that new current version; restored-from
     * metadata lives on the restore event for display.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RestoreEnvironmentVersion
     */
    restoreEnvironmentVersion: {
      name: "RestoreEnvironmentVersion",
      I: RestoreEnvironmentVersionRequest,
      O: RestoreEnvironmentVersionResponse,
      kind: MethodKind.Unary
    },
    /**
     * List logical environments (from the `environment` table) accessible to the
     * current caller. Returns named environments owned by the caller's user or
     * team so the portal can let users select them (including multi-repo
     * environments) as a start target for background composers.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListEnvironments
     */
    listEnvironments: {
      name: "ListEnvironments",
      I: ListEnvironmentsRequest,
      O: ListEnvironmentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch a single user/team-owned logical environment by public id.
     *
     * Repository-scope ownerless environments intentionally remain on
     * ListEnvironments' dashboard-scope authorization path.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironment
     */
    getEnvironment: {
      name: "GetEnvironment",
      I: GetEnvironmentRequest,
      O: GetEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Rename display metadata without writing environment configuration or a version.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RenameEnvironment
     */
    renameEnvironment: {
      name: "RenameEnvironment",
      I: RenameEnvironmentRequest,
      O: RenameEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Duplicate a named or multi-repo GitHub environment onto its verified
     * Origin mirrors. The source environment remains unchanged.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MigrateEnvironmentToOrigin
     */
    migrateEnvironmentToOrigin: {
      name: "MigrateEnvironmentToOrigin",
      I: MigrateEnvironmentToOriginRequest,
      O: MigrateEnvironmentToOriginResponse,
      kind: MethodKind.Unary
    },
    /**
     * List builds for a logical environment (read-only builds dashboard).
     * Keyset-paginated newest-first; page size is fixed server-side. Callers
     * without read access to the environment get an empty response
     * (indistinguishable from an environment with no builds).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListEnvironmentBuilds
     */
    listEnvironmentBuilds: {
      name: "ListEnvironmentBuilds",
      I: ListEnvironmentBuildsRequest,
      O: ListEnvironmentBuildsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve the Active Build for a logical environment — the bootable build
     * new agents currently boot from (same SUCCEEDED / non-draft / snapshot
     * lookup as pod start and ListEnvironmentBuilds.latest_boot_build_id).
     * Never returns a failed build. Callers without read access get an empty
     * response (indistinguishable from an environment with no active build).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentActiveBuild
     */
    getEnvironmentActiveBuild: {
      name: "GetEnvironmentActiveBuild",
      I: GetEnvironmentActiveBuildRequest,
      O: GetEnvironmentActiveBuildResponse,
      kind: MethodKind.Unary
    },
    /**
     * Whether builds for an environment are in a persistent failure streak
     * (same threshold as Customer.io env-build failure streak mail). Newest
     * non-draft terminal (SUCCEEDED|FAILED) outcomes of any trigger type count;
     * gated by dashboard `buildsEnabled`. Callers without read access get an
     * empty response (indistinguishable from no streak).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentPersistentRecurringBuildFailures
     */
    getEnvironmentPersistentRecurringBuildFailures: {
      name: "GetEnvironmentPersistentRecurringBuildFailures",
      I: GetEnvironmentPersistentRecurringBuildFailuresRequest,
      O: GetEnvironmentPersistentRecurringBuildFailuresResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch a single environment build by build id (read-only builds
     * dashboard detail page). Requires read access to the build's environment;
     * missing build or no access both surface as NotFound so build ids cannot
     * be probed.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentBuild
     */
    getEnvironmentBuild: {
      name: "GetEnvironmentBuild",
      I: GetEnvironmentBuildRequest,
      O: GetEnvironmentBuildResponse,
      kind: MethodKind.Unary
    },
    /**
     * The environment version a build baked (install/start scripts and the
     * raw environment.json), for the builds dashboard detail page. Same
     * access rules as GetEnvironmentBuild; the raw environment.json is only
     * included when the caller may inspect that version's source.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentBuildConfig
     */
    getEnvironmentBuildConfig: {
      name: "GetEnvironmentBuildConfig",
      I: GetEnvironmentBuildConfigRequest,
      O: GetEnvironmentBuildConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * Partial update of a build's mutable attributes; absent fields are left
     * unchanged. Same access rules as GetEnvironmentBuild plus the
     * team-environment write policy for team-owned builds.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateEnvironmentBuild
     */
    updateEnvironmentBuild: {
      name: "UpdateEnvironmentBuild",
      I: UpdateEnvironmentBuildRequest,
      O: UpdateEnvironmentBuildResponse,
      kind: MethodKind.Unary
    },
    /**
     * Manually trigger an environment build from the builds dashboard. Draft
     * builds never auto-promote; non-draft builds require every repo at its
     * default branch. Same access rules as the other builds RPCs plus the
     * team-environment write policy.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.TriggerEnvironmentBuild
     */
    triggerEnvironmentBuild: {
      name: "TriggerEnvironmentBuild",
      I: TriggerEnvironmentBuildRequest,
      O: TriggerEnvironmentBuildResponse,
      kind: MethodKind.Unary
    },
    /**
     * Stream a build's Docker + install/setup log text, following live output
     * while the build is IN_PROGRESS and ending after an empty log_complete
     * marker batch. Resume with the last seen next_cursor. Same access
     * rules as GetEnvironmentBuild. Text is formatted with the same renderer
     * cursor-cloud MCP uses for environment-build-logs.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AttachEnvironmentBuildLog
     */
    attachEnvironmentBuildLog: {
      name: "AttachEnvironmentBuildLog",
      I: AttachEnvironmentBuildLogRequest,
      O: AttachEnvironmentBuildLogResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Cancel an in-flight environment build. Idempotent: cancelling an already
     * cancelled build succeeds and returns the same row. A build that already
     * reached another terminal status is refused with FailedPrecondition. Same
     * access rules as UpdateEnvironmentBuild.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CancelEnvironmentBuild
     */
    cancelEnvironmentBuild: {
      name: "CancelEnvironmentBuild",
      I: CancelEnvironmentBuildRequest,
      O: CancelEnvironmentBuildResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read the caller-scoped build settings for a logical environment.
     * Settings are keyed {(user | team), environment} — repo-file environments
     * are shared across teams, so a team's choices never leak to another team.
     * Requires read access to the environment.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetEnvironmentBuildSettings
     */
    getEnvironmentBuildSettings: {
      name: "GetEnvironmentBuildSettings",
      I: GetEnvironmentBuildSettingsRequest,
      O: GetEnvironmentBuildSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Partial update of the caller-scoped build settings for a logical
     * environment; absent fields are left unchanged. Team-scoped writes follow
     * the team-environment write policy.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateEnvironmentBuildSettings
     */
    updateEnvironmentBuildSettings: {
      name: "UpdateEnvironmentBuildSettings",
      I: UpdateEnvironmentBuildSettingsRequest,
      O: UpdateEnvironmentBuildSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve a multi-repo or no-repo selection to an existing logical
     * environment, or create an unnamed empty environment for the requested owner
     * scope when none matches.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ResolveOrCreateMultiRepoEnvironment
     */
    resolveOrCreateMultiRepoEnvironment: {
      name: "ResolveOrCreateMultiRepoEnvironment",
      I: ResolveOrCreateMultiRepoEnvironmentRequest,
      O: ResolveOrCreateMultiRepoEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve or create the hidden draft logical environment for a composer.
     * Draft environments are excluded from normal list APIs and are promoted on
     * final save.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ResolveOrCreateDraftEnvironment
     */
    resolveOrCreateDraftEnvironment: {
      name: "ResolveOrCreateDraftEnvironment",
      I: ResolveOrCreateDraftEnvironmentRequest,
      O: ResolveOrCreateDraftEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Combined snapshot + save endpoint. Creates or reuses a snapshot, then calls
     * the personal/team setup-flow save RPCs with environment_json.snapshot set.
     * For multi-repo saves, repo_config is preserved on the logical environment
     * and environmentVersion while legacy user/team current rows are skipped.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SnapshotAndSaveEnvironment
     */
    snapshotAndSaveEnvironment: {
      name: "SnapshotAndSaveEnvironment",
      I: SnapshotAndSaveEnvironmentRequest,
      O: SnapshotAndSaveEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * List repos that have a .cursor/environment.json file in the repository
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListReposWithLocalEnvironment
     */
    listReposWithLocalEnvironment: {
      name: "ListReposWithLocalEnvironment",
      I: ListReposWithLocalEnvironmentRequest,
      O: ListReposWithLocalEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mark a background composer as read
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MarkBackgroundComposerRead
     */
    markBackgroundComposerRead: {
      name: "MarkBackgroundComposerRead",
      I: MarkBackgroundComposerReadRequest,
      O: MarkBackgroundComposerReadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mark a background composer as unread
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MarkBackgroundComposerUnread
     */
    markBackgroundComposerUnread: {
      name: "MarkBackgroundComposerUnread",
      I: MarkBackgroundComposerUnreadRequest,
      O: MarkBackgroundComposerUnreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Move the transcript read watermark (last_read_at_ms) forward to the stamp
     * of the newest message the user saw, never backwards. Independent of the
     * is_unread dot. Clients call this once the user has seen the newest
     * message, not on open like MarkBackgroundComposerRead.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdvanceBackgroundComposerReadCursor
     */
    advanceBackgroundComposerReadCursor: {
      name: "AdvanceBackgroundComposerReadCursor",
      I: AdvanceBackgroundComposerReadCursorRequest,
      O: AdvanceBackgroundComposerReadCursorResponse,
      kind: MethodKind.Unary
    },
    /**
     * Called periodically while the background composer is actively visible in
     * the UI. Recent visibility should prevent destructive cleanup work, such as
     * pausing or tearing down the backing resources.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.NotifyBackgroundComposerShown
     */
    notifyBackgroundComposerShown: {
      name: "NotifyBackgroundComposerShown",
      I: NotifyBackgroundComposerShownRequest,
      O: NotifyBackgroundComposerShownResponse,
      kind: MethodKind.Unary
    },
    /**
     * DEPRECATED: always returns UNIMPLEMENTED. The CLI feature that backed this
     * RPC was unshipped. Retained in the proto for wire compatibility with old
     * clients.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.FetchBackgroundComposer
     * @deprecated
     */
    fetchBackgroundComposer: {
      name: "FetchBackgroundComposer",
      I: FetchBackgroundComposerRequest,
      O: FetchBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetTurnSummaryBackgroundComposer
     */
    getTurnSummaryBackgroundComposer: {
      name: "GetTurnSummaryBackgroundComposer",
      I: GetTurnSummaryBackgroundComposerRequest,
      O: GetTurnSummaryBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerName
     */
    getBackgroundComposerName: {
      name: "GetBackgroundComposerName",
      I: GetBackgroundComposerNameRequest,
      O: GetBackgroundComposerNameResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerPrompt
     */
    getBackgroundComposerPrompt: {
      name: "GetBackgroundComposerPrompt",
      I: GetBackgroundComposerPromptRequest,
      O: GetBackgroundComposerPromptResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read a binary file from a background composer workspace
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReadBinaryFile
     */
    readBinaryFile: {
      name: "ReadBinaryFile",
      I: ReadBinaryFileRequest,
      O: ReadBinaryFileResponse,
      kind: MethodKind.Unary
    },
    /**
     * List artifacts uploaded for a background composer
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListBackgroundComposerArtifacts
     */
    listBackgroundComposerArtifacts: {
      name: "ListBackgroundComposerArtifacts",
      I: ListBackgroundComposerArtifactsRequest,
      O: ListBackgroundComposerArtifactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get a presigned URL for a specific artifact
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerArtifact
     */
    getBackgroundComposerArtifact: {
      name: "GetBackgroundComposerArtifact",
      I: GetBackgroundComposerArtifactRequest,
      O: GetBackgroundComposerArtifactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get raw bytes for a specific artifact
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerArtifactBytes
     */
    getBackgroundComposerArtifactBytes: {
      name: "GetBackgroundComposerArtifactBytes",
      I: GetBackgroundComposerArtifactBytesRequest,
      O: GetBackgroundComposerArtifactBytesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Stream raw bytes for a specific artifact
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StreamBackgroundComposerArtifact
     */
    streamBackgroundComposerArtifact: {
      name: "StreamBackgroundComposerArtifact",
      I: StreamBackgroundComposerArtifactRequest,
      O: StreamBackgroundComposerArtifactResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * List public share rows for a background composer artifact set
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListSharedBackgroundComposerArtifacts
     */
    listSharedBackgroundComposerArtifacts: {
      name: "ListSharedBackgroundComposerArtifacts",
      I: ListSharedBackgroundComposerArtifactsRequest,
      O: ListSharedBackgroundComposerArtifactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create or reactivate a public share for a specific background composer artifact
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ShareBackgroundComposerArtifact
     */
    shareBackgroundComposerArtifact: {
      name: "ShareBackgroundComposerArtifact",
      I: ShareBackgroundComposerArtifactRequest,
      O: ShareBackgroundComposerArtifactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Revoke a public share for a specific background composer artifact
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UnshareBackgroundComposerArtifact
     */
    unshareBackgroundComposerArtifact: {
      name: "UnshareBackgroundComposerArtifact",
      I: UnshareBackgroundComposerArtifactRequest,
      O: UnshareBackgroundComposerArtifactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve an opaque public artifact ID to a presigned storage URL (no auth required)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPublicBackgroundComposerArtifact
     */
    getPublicBackgroundComposerArtifact: {
      name: "GetPublicBackgroundComposerArtifact",
      I: GetPublicBackgroundComposerArtifactRequest,
      O: GetPublicBackgroundComposerArtifactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Update the user's background composer settings, including model preferences
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateBackgroundComposerUserSettings
     */
    updateBackgroundComposerUserSettings: {
      name: "UpdateBackgroundComposerUserSettings",
      I: UpdateBackgroundComposerUserSettingsRequest,
      O: UpdateBackgroundComposerUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the user's background composer settings
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerUserSettings
     */
    getBackgroundComposerUserSettings: {
      name: "GetBackgroundComposerUserSettings",
      I: GetBackgroundComposerUserSettingsRequest,
      O: GetBackgroundComposerUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Recompute and apply environment variables for the running Cloud Agent VM.
     * This updates the exec-daemon environment for subsequent process spawns and does NOT
     * affect already-running processes.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateBackgroundComposerEnvironment
     */
    updateBackgroundComposerEnvironment: {
      name: "UpdateBackgroundComposerEnvironment",
      I: UpdateBackgroundComposerEnvironmentRequest,
      O: UpdateBackgroundComposerEnvironmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Github PR Review Interface
     * Get repository branches for a given repository
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetRepositoryBranches
     */
    getRepositoryBranches: {
      name: "GetRepositoryBranches",
      I: GetRepositoryBranchesRequest,
      O: GetRepositoryBranchesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get pull request merge status for a given pull request URL
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPullRequestMergeStatus
     */
    getPullRequestMergeStatus: {
      name: "GetPullRequestMergeStatus",
      I: GetPullRequestMergeStatusRequest,
      O: GetPullRequestMergeStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get detailed pull request status for a given pull request URL
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetDetailedPullRequestStatus
     */
    getDetailedPullRequestStatus: {
      name: "GetDetailedPullRequestStatus",
      I: GetDetailedPullRequestStatusRequest,
      O: GetDetailedPullRequestStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Check if a pull request can be merged
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CheckPullRequestMergeability
     */
    checkPullRequestMergeability: {
      name: "CheckPullRequestMergeability",
      I: CheckPullRequestMergeabilityRequest,
      O: CheckPullRequestMergeabilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch pull request discussions (review threads and top-level comments)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPullRequestDiscussions
     */
    getPullRequestDiscussions: {
      name: "GetPullRequestDiscussions",
      I: GetPullRequestDiscussionsRequest,
      O: GetPullRequestDiscussionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch pull request commits
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPullRequestCommits
     */
    getPullRequestCommits: {
      name: "GetPullRequestCommits",
      I: GetPullRequestCommitsRequest,
      O: GetPullRequestCommitsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetch pull request timeline events (labels, reviews, assignments, etc.)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPullRequestTimelineEvents
     */
    getPullRequestTimelineEvents: {
      name: "GetPullRequestTimelineEvents",
      I: GetPullRequestTimelineEventsRequest,
      O: GetPullRequestTimelineEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reply to an existing PR review thread
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReplyToReviewThread
     */
    replyToReviewThread: {
      name: "ReplyToReviewThread",
      I: ReplyToReviewThreadRequest,
      O: ReplyToReviewThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve a PR review thread
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ResolveReviewThread
     */
    resolveReviewThread: {
      name: "ResolveReviewThread",
      I: ResolveReviewThreadRequest,
      O: ResolveReviewThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Unresolve a PR review thread
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UnresolveReviewThread
     */
    unresolveReviewThread: {
      name: "UnresolveReviewThread",
      I: UnresolveReviewThreadRequest,
      O: UnresolveReviewThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Delete a PR review comment (inline thread comment)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeletePullRequestReviewComment
     */
    deletePullRequestReviewComment: {
      name: "DeletePullRequestReviewComment",
      I: DeletePullRequestReviewCommentRequest,
      O: DeletePullRequestReviewCommentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Add a new PR review comment (creates a new thread)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AddPullRequestReviewComment
     */
    addPullRequestReviewComment: {
      name: "AddPullRequestReviewComment",
      I: AddPullRequestReviewCommentRequest,
      O: AddPullRequestReviewCommentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Merge a pull request
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MergePullRequest
     */
    mergePullRequest: {
      name: "MergePullRequest",
      I: MergePullRequestRequest,
      O: MergePullRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Enable auto-merge on a pull request
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.EnablePullRequestAutoMerge
     */
    enablePullRequestAutoMerge: {
      name: "EnablePullRequestAutoMerge",
      I: EnablePullRequestAutoMergeRequest,
      O: EnablePullRequestAutoMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Disable auto-merge on a pull request
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DisablePullRequestAutoMerge
     */
    disablePullRequestAutoMerge: {
      name: "DisablePullRequestAutoMerge",
      I: DisablePullRequestAutoMergeRequest,
      O: DisablePullRequestAutoMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Convert a draft pull request to ready for review
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ConvertPullRequestFromDraft
     */
    convertPullRequestFromDraft: {
      name: "ConvertPullRequestFromDraft",
      I: ConvertPullRequestFromDraftRequest,
      O: ConvertPullRequestFromDraftResponse,
      kind: MethodKind.Unary
    },
    /**
     * Update a pull request branch by merging the base branch into it
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdatePullRequestBranch
     */
    updatePullRequestBranch: {
      name: "UpdatePullRequestBranch",
      I: UpdatePullRequestBranchRequest,
      O: UpdatePullRequestBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * Register a mobile push notification token for the current user
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RegisterPushNotificationToken
     */
    registerPushNotificationToken: {
      name: "RegisterPushNotificationToken",
      I: RegisterPushNotificationTokenRequest,
      O: RegisterPushNotificationTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deregister/remove an existing mobile push notification token for the current user
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeletePushNotificationToken
     */
    deletePushNotificationToken: {
      name: "DeletePushNotificationToken",
      I: DeletePushNotificationTokenRequest,
      O: DeletePushNotificationTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolves the approval_id shown on Cursor mobile and Cursor desktop.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ResolveOriginAgentApproval
     */
    resolveOriginAgentApproval: {
      name: "ResolveOriginAgentApproval",
      I: ResolveOriginAgentApprovalRequest,
      O: ResolveOriginAgentApprovalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Fetches the pending approval's full request text by approval_id. The APNs
     * push body is capped at 240 chars, so the mobile approval sheet loads the
     * untruncated summary (operation, target, and MCP args) through this RPC
     * before the user approves or denies.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetOriginAgentApproval
     */
    getOriginAgentApproval: {
      name: "GetOriginAgentApproval",
      I: GetOriginAgentApprovalRequest,
      O: GetOriginAgentApprovalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Upsert the device's Live Activity registration: the per-activity ActivityKit
     * push token plus the client's current lock-screen content state. The backend
     * overlays terminal transition facts onto this state and pushes it via APNs
     * (apns-push-type: liveactivity) while the app is suspended.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.SyncLiveActivity
     */
    syncLiveActivity: {
      name: "SyncLiveActivity",
      I: SyncLiveActivityRequest,
      O: SyncLiveActivityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Drop the device's Live Activity registration (activity ended, user dismissed,
     * or sign-out). The backend stops pushing and discards the stored state.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeleteLiveActivity
     */
    deleteLiveActivity: {
      name: "DeleteLiveActivity",
      I: DeleteLiveActivityRequest,
      O: DeleteLiveActivityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Verify that the current user has access to a background composer
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.VerifyBackgroundComposerAccess
     */
    verifyBackgroundComposerAccess: {
      name: "VerifyBackgroundComposerAccess",
      I: VerifyBackgroundComposerAccessRequest,
      O: VerifyBackgroundComposerAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * Start streaming for a followup background composer
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartSlackStreamingForFollowup
     */
    startSlackStreamingForFollowup: {
      name: "StartSlackStreamingForFollowup",
      I: StartSlackStreamingForFollowupRequest,
      O: StartSlackStreamingForFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartGithubStreamingForFollowup
     */
    startGithubStreamingForFollowup: {
      name: "StartGithubStreamingForFollowup",
      I: StartGithubStreamingForFollowupRequest,
      O: StartGithubStreamingForFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartLinearStreamingForFollowup
     */
    startLinearStreamingForFollowup: {
      name: "StartLinearStreamingForFollowup",
      I: StartLinearStreamingForFollowupRequest,
      O: StartLinearStreamingForFollowupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetGithubInstallations
     */
    getGithubInstallations: {
      name: "GetGithubInstallations",
      I: GetGithubInstallationsRequest,
      O: GetGithubInstallationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.FetchAllInstallationRepos
     */
    fetchAllInstallationRepos: {
      name: "FetchAllInstallationRepos",
      I: FetchAllInstallationReposRequest,
      O: FetchAllInstallationReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get accumulated VM usage for a background composer (developer-only)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetBackgroundComposerVmUsage
     */
    getBackgroundComposerVmUsage: {
      name: "GetBackgroundComposerVmUsage",
      I: GetBackgroundComposerVmUsageRequest,
      O: GetBackgroundComposerVmUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetCloudAgentDebugDetails
     */
    getCloudAgentDebugDetails: {
      name: "GetCloudAgentDebugDetails",
      I: GetCloudAgentDebugDetailsRequest,
      O: GetCloudAgentDebugDetailsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetCloudAgentMemoryDbLogs
     */
    getCloudAgentMemoryDbLogs: {
      name: "GetCloudAgentMemoryDbLogs",
      I: GetCloudAgentMemoryDbLogsRequest,
      O: GetCloudAgentMemoryDbLogsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create a shareable link for a cloud agent with OG preview
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateAgentShare
     */
    createAgentShare: {
      name: "CreateAgentShare",
      I: CreateAgentShareRequest,
      O: CreateAgentShareResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get agent share preview data (no auth required - used for OG image generation)
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetAgentSharePreview
     */
    getAgentSharePreview: {
      name: "GetAgentSharePreview",
      I: GetAgentSharePreviewRequest,
      O: GetAgentSharePreviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * List private workers with pagination and filtering
     * Returns workers the caller has access to, sorted by connection time
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPrivateWorkers
     */
    listPrivateWorkers: {
      name: "ListPrivateWorkers",
      I: ListPrivateWorkersRequest,
      O: ListPrivateWorkersResponse,
      kind: MethodKind.Unary
    },
    /**
     * List durable self-hosted worker pools, annotated with live connected/in-use
     * counts, so a pool stays discoverable even at zero connected workers.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPrivateWorkerPools
     */
    listPrivateWorkerPools: {
      name: "ListPrivateWorkerPools",
      I: ListPrivateWorkerPoolsRequest,
      O: ListPrivateWorkerPoolsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Explicitly register a durable pool without starting a worker. The owner is
     * resolved from auth; repeated registration is idempotent.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RegisterPrivateWorkerPool
     */
    registerPrivateWorkerPool: {
      name: "RegisterPrivateWorkerPool",
      I: RegisterPrivateWorkerPoolRequest,
      O: RegisterPrivateWorkerPoolResponse,
      kind: MethodKind.Unary
    },
    /**
     * Soft-delete a durable pool. USER pools require their owner, TEAM pools a
     * team admin; a later worker connect re-registers it.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeregisterPrivateWorkerPool
     */
    deregisterPrivateWorkerPool: {
      name: "DeregisterPrivateWorkerPool",
      I: DeregisterPrivateWorkerPoolRequest,
      O: DeregisterPrivateWorkerPoolResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: list a specific user's private workers and connected
     * (registered) desktop machines for the remote-control support tool.
     * Service-token authenticated (anytool); not user-scoped.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminListUserPrivateWorkers
     */
    adminListUserPrivateWorkers: {
      name: "AdminListUserPrivateWorkers",
      I: AdminListUserPrivateWorkersRequest,
      O: AdminListUserPrivateWorkersResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: permanently stop one background composer owned by a
     * specific user. Service-token authenticated (anytool); not user-scoped.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminKillBackgroundComposer
     */
    adminKillBackgroundComposer: {
      name: "AdminKillBackgroundComposer",
      I: AdminKillBackgroundComposerRequest,
      O: AdminKillBackgroundComposerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: list the complete active cloud-workload set for a specific
     * user. Includes first-class subagents and side chats, but excludes local and
     * remote-control composers. Service-token authenticated (anytool).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminListActiveBackgroundComposers
     */
    adminListActiveBackgroundComposers: {
      name: "AdminListActiveBackgroundComposers",
      I: AdminListActiveBackgroundComposersRequest,
      O: AdminListActiveBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: permanently stop the complete active cloud-workload set
     * for a specific user. Selection, pagination, and bounded fan-out are owned
     * by BCS. Service-token authenticated (anytool).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminKillAllActiveBackgroundComposers
     */
    adminKillAllActiveBackgroundComposers: {
      name: "AdminKillAllActiveBackgroundComposers",
      I: AdminKillAllActiveBackgroundComposersRequest,
      O: AdminKillAllActiveBackgroundComposersResponse,
      kind: MethodKind.Unary
    },
    /**
     * List pending private-worker requests that have not been assigned a worker.
     * Service-account only; scoped to the caller's team.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListPendingPrivateWorkerRequests
     */
    listPendingPrivateWorkerRequests: {
      name: "ListPendingPrivateWorkerRequests",
      I: ListPendingPrivateWorkerRequestsRequest,
      O: ListPendingPrivateWorkerRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Watch pending private-worker request lifecycle changes after a cursor.
     * List-then-watch: ListPendingPrivateWorkerRequests returns a stream_cursor
     * capturing the event-stream position its snapshot reflects; pass it (or a
     * previous event's cursor) here to follow transitions after that position.
     * Delivery is best-effort: events are low-latency hints and a rare
     * transition may be dropped, duplicated, or delivered out of order. The
     * list is the source of truth, and cursors hard-expire five minutes after
     * the list that issued them (heartbeats do not extend this), so callers
     * re-sync via a fresh list at least that often. An expired cursor fails
     * with FAILED_PRECONDITION ("cursor_expired"); re-list and watch from the
     * fresh stream_cursor.
     * Service-account only; scoped to the caller's team and repository permissions.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StreamPendingPrivateWorkerRequests
     */
    streamPendingPrivateWorkerRequests: {
      name: "StreamPendingPrivateWorkerRequests",
      I: StreamPendingPrivateWorkerRequestsRequest,
      O: StreamPendingPrivateWorkerRequestsResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Atomically reserve a pending private-worker request for a worker identity
     * before that worker connects. Service-account only; scoped to the caller's
     * team and repository permissions.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ClaimPendingPrivateWorkerRequest
     */
    claimPendingPrivateWorkerRequest: {
      name: "ClaimPendingPrivateWorkerRequest",
      I: ClaimPendingPrivateWorkerRequestRequest,
      O: ClaimPendingPrivateWorkerRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Release the long-term claim binding an agent to a private worker: "stop
     * preferring this machine". The claim is a routing suggestion, not live
     * state, so release always succeeds while a claim exists and never checks
     * worker liveness. A waiting follow-up returns to the queue as an
     * unclaimed entry at the next scheduling point, a connected machine
     * finishes its current turn undisturbed and is simply never routed back
     * to, and a replacement machine may claim the agent immediately.
     * Service-account only; scoped to the caller's team.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReleasePrivateWorkerClaim
     */
    releasePrivateWorkerClaim: {
      name: "ReleasePrivateWorkerClaim",
      I: ReleasePrivateWorkerClaimRequest,
      O: ReleasePrivateWorkerClaimResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get a summary of private worker usage for the authenticated user/team
     * - Non-admin users: count of their own workers + team workers in use by their agents
     * - Team admins: their own data + summary of all team workers (in use vs total)
     * - Service accounts: team workers in use vs total connected
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPrivateWorkersSummary
     */
    getPrivateWorkersSummary: {
      name: "GetPrivateWorkersSummary",
      I: GetPrivateWorkersSummaryRequest,
      O: GetPrivateWorkersSummaryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get detailed metadata for a specific private worker
     * Returns NotFound if the worker doesn't exist or the caller doesn't have access
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetPrivateWorker
     */
    getPrivateWorker: {
      name: "GetPrivateWorker",
      I: GetPrivateWorkerRequest,
      O: GetPrivateWorkerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Release a private worker by asking its connected CLI process to exit.
     * Developer-only; returns NotFound if the worker doesn't exist or the caller doesn't have access.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReleasePrivateWorker
     */
    releasePrivateWorker: {
      name: "ReleasePrivateWorker",
      I: ReleasePrivateWorkerRequest,
      O: ReleasePrivateWorkerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Refresh detailed pull request status for background composers with PRs.
     *
     * This is used by clients that need many PR statuses at once, such as the
     * cloud-agent list and PR review surfaces. Results are keyed by bc_id; callers
     * should treat failed_bc_ids as misses and fall back to per-PR status fetching
     * when needed.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.BatchRefreshPullRequestStatus
     */
    batchRefreshPullRequestStatus: {
      name: "BatchRefreshPullRequestStatus",
      I: BatchRefreshPullRequestStatusRequest,
      O: BatchRefreshPullRequestStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * List agent stores visible to the current user (portal browse).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListAgentStores
     */
    listAgentStores: {
      name: "ListAgentStores",
      I: ListAgentStoresRequest,
      O: ListAgentStoresResponse,
      kind: MethodKind.Unary
    },
    /**
     * List files and directories under a relative path within an agent store.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListAgentStoreEntries
     */
    listAgentStoreEntries: {
      name: "ListAgentStoreEntries",
      I: ListAgentStoreEntriesRequest,
      O: ListAgentStoreEntriesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read a text file from an agent store for dashboard preview.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReadAgentStoreFile
     */
    readAgentStoreFile: {
      name: "ReadAgentStoreFile",
      I: ReadAgentStoreFileRequest,
      O: ReadAgentStoreFileResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mint a short-lived capability token scoped to the given agent store.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MintAgentStoreToken
     */
    mintAgentStoreToken: {
      name: "MintAgentStoreToken",
      I: MintAgentStoreTokenRequest,
      O: MintAgentStoreTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Generic Cloud Canvas write/read for model-authored canvases.
     *
     * Named WriteCanvas (not "publish") because it compiles + persists a private
     * artifact and never changes visibility/share — "publish" would conflate it
     * with PUBLIC. It matches the model-facing WriteCanvas/ReadCanvas tools; the
     * internal CloudCanvasStore.publishCanvas that compiles/persists keeps its
     * name.
     *
     * The request carries source + an optional canvas_id/title only — no
     * principal, owner, team, or store id. The server resolves the USER store
     * owner from server-trusted provenance (the verified box pod claim / session
     * / composer row) and persists through CloudCanvasStore.publishCanvas. Any
     * BackgroundComposer principal may reach these; each is admitted by its
     * resolved provenance (Grok-only scoping lives in the tool offer, not here).
     * Distinct from any future dashboard human "Save" RPC.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.WriteCanvas
     */
    writeCanvas: {
      name: "WriteCanvas",
      I: WriteCanvasRequest,
      O: WriteCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read one canvas's source. Reads the caller's own USER store by default; an
     * explicit store_id (parsed from a canonical canvas url) is a locator only,
     * admitted through the existing read ACL (membership or an active team
     * share) — never trusted as identity.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReadCanvas
     */
    readCanvas: {
      name: "ReadCanvas",
      I: ReadCanvasRequest,
      O: ReadCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * List files in an agent's store. Accepts an agent-store capability token or
     * standard user/API-key auth (same ownership bar as dashboard browse).
     * Share targets still require a capability token.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListAgentStoreFiles
     */
    listAgentStoreFiles: {
      name: "ListAgentStoreFiles",
      I: ListAgentStoreFilesRequest,
      O: ListAgentStoreFilesResponse,
      kind: MethodKind.Unary
    },
    /**
     * List one directory in an agent's store with server-side pagination.
     * Auth matches ListAgentStoreFiles.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListAgentStoreDirectory
     */
    listAgentStoreDirectory: {
      name: "ListAgentStoreDirectory",
      I: ListAgentStoreDirectoryRequest,
      O: ListAgentStoreDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get presigned read URLs for files in an agent's store.
     * Auth matches ListAgentStoreFiles.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PresignAgentStoreReads
     */
    presignAgentStoreReads: {
      name: "PresignAgentStoreReads",
      I: PresignAgentStoreReadsRequest,
      O: PresignAgentStoreReadsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get presigned write URLs for files in an agent's store.
     * Auth matches ListAgentStoreFiles (write capability / FULL_ACCESS).
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PresignAgentStoreWrites
     */
    presignAgentStoreWrites: {
      name: "PresignAgentStoreWrites",
      I: PresignAgentStoreWritesRequest,
      O: PresignAgentStoreWritesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Complete multipart writes previously initiated by PresignAgentStoreWrites.
     * Auth matches PresignAgentStoreWrites.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CompleteAgentStoreMultipartWrites
     */
    completeAgentStoreMultipartWrites: {
      name: "CompleteAgentStoreMultipartWrites",
      I: CompleteAgentStoreMultipartWritesRequest,
      O: CompleteAgentStoreMultipartWritesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Abort multipart writes previously initiated by PresignAgentStoreWrites.
     * Auth matches PresignAgentStoreWrites.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AbortAgentStoreMultipartWrites
     */
    abortAgentStoreMultipartWrites: {
      name: "AbortAgentStoreMultipartWrites",
      I: AbortAgentStoreMultipartWritesRequest,
      O: AbortAgentStoreMultipartWritesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Prompt uploads.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.PresignPromptUpload
     */
    presignPromptUpload: {
      name: "PresignPromptUpload",
      I: PresignPromptUploadRequest,
      O: PresignPromptUploadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CompletePromptUpload
     */
    completePromptUpload: {
      name: "CompletePromptUpload",
      I: CompletePromptUploadRequest,
      O: CompletePromptUploadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.AbortPromptUpload
     */
    abortPromptUpload: {
      name: "AbortPromptUpload",
      I: AbortPromptUploadRequest,
      O: AbortPromptUploadResponse,
      kind: MethodKind.Unary
    },
    /**
     * Agent-store whole-file advisory locks.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AcquireAgentStoreFileLock
     */
    acquireAgentStoreFileLock: {
      name: "AcquireAgentStoreFileLock",
      I: AcquireAgentStoreFileLockRequest,
      O: AcquireAgentStoreFileLockResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.RenewAgentStoreFileLock
     */
    renewAgentStoreFileLock: {
      name: "RenewAgentStoreFileLock",
      I: RenewAgentStoreFileLockRequest,
      O: RenewAgentStoreFileLockResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ReleaseAgentStoreFileLock
     */
    releaseAgentStoreFileLock: {
      name: "ReleaseAgentStoreFileLock",
      I: ReleaseAgentStoreFileLockRequest,
      O: ReleaseAgentStoreFileLockResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetAgentStoreFileLock
     */
    getAgentStoreFileLock: {
      name: "GetAgentStoreFileLock",
      I: GetAgentStoreFileLockRequest,
      O: GetAgentStoreFileLockResponse,
      kind: MethodKind.Unary
    },
    /**
     * Conditionally delete files in an agent's store (same-key tombstones).
     * Auth matches PresignAgentStoreWrites.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeleteAgentStoreFiles
     */
    deleteAgentStoreFiles: {
      name: "DeleteAgentStoreFiles",
      I: DeleteAgentStoreFilesRequest,
      O: DeleteAgentStoreFilesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mark a directory as removed by writing a parent-level rmdir marker.
     * Non-empty directories return failed_precondition with
     * marker=agent_store_dir_not_empty. Auth matches DeleteAgentStoreFiles.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.RmdirAgentStore
     */
    rmdirAgentStore: {
      name: "RmdirAgentStore",
      I: RmdirAgentStoreRequest,
      O: RmdirAgentStoreResponse,
      kind: MethodKind.Unary
    },
    /**
     * Restore tombstoned files to their pre-delete contents by copying the
     * S3 noncurrent version back over the tombstone (conditional on the
     * tombstone still being the live object). Only recoverable while the
     * bucket's noncurrent-version retention keeps the pre-delete version.
     * Gated by `agent_store_undelete`. Auth: agent-store token with write
     * capability, or the ShareAgentStore ownership bar for bare principals.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.UndeleteAgentStoreFiles
     */
    undeleteAgentStoreFiles: {
      name: "UndeleteAgentStoreFiles",
      I: UndeleteAgentStoreFilesRequest,
      O: UndeleteAgentStoreFilesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Flat store-wide list of tombstoned (recently deleted) files for the
     * dashboard "Recently deleted" view feeding UndeleteAgentStoreFiles.
     * Store-target only (shares are read-only and stay tombstone-blind). Gated
     * by `agent_store_undelete`. Auth matches UndeleteAgentStoreFiles:
     * agent-store token with read capability, or the ShareAgentStore ownership
     * bar for bare principals.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListAgentStoreTombstones
     */
    listAgentStoreTombstones: {
      name: "ListAgentStoreTombstones",
      I: ListAgentStoreTombstonesRequest,
      O: ListAgentStoreTombstonesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ShareAgentStore
     */
    shareAgentStore: {
      name: "ShareAgentStore",
      I: ShareAgentStoreRequest,
      O: ShareAgentStoreResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.UnshareAgentStore
     */
    unshareAgentStore: {
      name: "UnshareAgentStore",
      I: UnshareAgentStoreRequest,
      O: UnshareAgentStoreResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListSharedAgentStores
     */
    listSharedAgentStores: {
      name: "ListSharedAgentStores",
      I: ListSharedAgentStoresRequest,
      O: ListSharedAgentStoresResponse,
      kind: MethodKind.Unary
    },
    /**
     * Bulk-provision team service accounts used as synthetics identities for the
     * cloud agent synthetics/load-test harness. Internal tooling (anytool) only;
     * authenticated with a service token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ProvisionSyntheticsServiceAccounts
     */
    provisionSyntheticsServiceAccounts: {
      name: "ProvisionSyntheticsServiceAccounts",
      I: ProvisionSyntheticsServiceAccountsRequest,
      O: ProvisionSyntheticsServiceAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Start a cloud agent load test (loadTestWorkflow on the synthetics task
     * queue). Internal tooling (anytool) only; authenticated with a service
     * token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.StartCloudAgentLoadTest
     */
    startCloudAgentLoadTest: {
      name: "StartCloudAgentLoadTest",
      I: StartCloudAgentLoadTestRequest,
      O: StartCloudAgentLoadTestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Idempotently start the provider-capacity load-test workflow
     * (modelRoutingLoadTestWorkflow on the model-routing-loadtest task queue)
     * for a persisted run row. The workflow id is derived server-side from the
     * run id, so retried calls converge on one execution and a run whose
     * workflow already reached a terminal state is never restarted. Internal
     * tooling (anytool) only; authenticated with a service token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.EnsureModelRoutingLoadTestStarted
     */
    ensureModelRoutingLoadTestStarted: {
      name: "EnsureModelRoutingLoadTestStarted",
      I: EnsureModelRoutingLoadTestStartedRequest,
      O: EnsureModelRoutingLoadTestStartedResponse,
      kind: MethodKind.Unary
    },
    /**
     * Idempotently request cancellation of the provider-capacity load-test
     * workflow for a run. Safe to repeat for running, missing, and already
     * closed workflows; the outcome reports which case applied. Internal
     * tooling (anytool) only; authenticated with a service token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CancelModelRoutingLoadTest
     */
    cancelModelRoutingLoadTest: {
      name: "CancelModelRoutingLoadTest",
      I: CancelModelRoutingLoadTestRequest,
      O: CancelModelRoutingLoadTestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mint a Customer PrivateLink proxy token for internal tooling. Internal
     * tooling (anytool) only; authenticated with a service token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.MintCustomerPrivatelinkProxyToken
     */
    mintCustomerPrivatelinkProxyToken: {
      name: "MintCustomerPrivatelinkProxyToken",
      I: MintCustomerPrivatelinkProxyTokenRequest,
      O: MintCustomerPrivatelinkProxyTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: list Named Agents owned by a team, with their session
     * rows. Internal tooling (anytool) only; authenticated with a service
     * token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminListTeamNamedAgents
     */
    adminListTeamNamedAgents: {
      name: "AdminListTeamNamedAgents",
      I: AdminListTeamNamedAgentsRequest,
      O: AdminListTeamNamedAgentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin/internal: permanently delete a Named Agent — its row, session rows,
     * event subscriptions, timers, and every backing background composer
     * (workflows, S3/KV state, runs). Internal tooling (anytool) only;
     * authenticated with a service token, not user auth.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.AdminDeleteNamedAgent
     */
    adminDeleteNamedAgent: {
      name: "AdminDeleteNamedAgent",
      I: AdminDeleteNamedAgentRequest,
      O: AdminDeleteNamedAgentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Keyrings: named secret collections. Gated by `cloud_agent_keyring`.
     * Access is limited to the authenticated user/team containment scope.
     * Secret responses contain metadata only, never plaintext.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListKeyrings
     */
    listKeyrings: {
      name: "ListKeyrings",
      I: ListKeyringsRequest,
      O: ListKeyringsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GetKeyring
     */
    getKeyring: {
      name: "GetKeyring",
      I: GetKeyringRequest,
      O: GetKeyringResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateKeyring
     */
    createKeyring: {
      name: "CreateKeyring",
      I: CreateKeyringRequest,
      O: CreateKeyringResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create a team keyring seeded with copies of the selected team secrets.
     * Team secrets belong to the whole team, so they are copied as-is; the
     * originals are left in place for the caller to delete later.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateKeyringFromTeamSecrets
     */
    createKeyringFromTeamSecrets: {
      name: "CreateKeyringFromTeamSecrets",
      I: CreateKeyringFromTeamSecretsRequest,
      O: CreateKeyringFromTeamSecretsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Copy selected team secrets into an existing team keyring without exposing
     * their values to the client. The originals remain unchanged.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.CopyTeamSecretsToKeyring
     */
    copyTeamSecretsToKeyring: {
      name: "CopyTeamSecretsToKeyring",
      I: CopyTeamSecretsToKeyringRequest,
      O: CopyTeamSecretsToKeyringResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.RenameKeyring
     */
    renameKeyring: {
      name: "RenameKeyring",
      I: RenameKeyringRequest,
      O: RenameKeyringResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.DeleteKeyring
     */
    deleteKeyring: {
      name: "DeleteKeyring",
      I: DeleteKeyringRequest,
      O: DeleteKeyringResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListKeyringSecrets
     */
    listKeyringSecrets: {
      name: "ListKeyringSecrets",
      I: ListKeyringSecretsRequest,
      O: ListKeyringSecretsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.CreateKeyringSecret
     */
    createKeyringSecret: {
      name: "CreateKeyringSecret",
      I: CreateKeyringSecretRequest,
      O: CreateKeyringSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateKeyringSecret
     */
    updateKeyringSecret: {
      name: "UpdateKeyringSecret",
      I: UpdateKeyringSecretRequest,
      O: UpdateKeyringSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.RevokeKeyringSecret
     */
    revokeKeyringSecret: {
      name: "RevokeKeyringSecret",
      I: RevokeKeyringSecretRequest,
      O: RevokeKeyringSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * AuthDB grants on a keyring (`keyring.manage` / `keyring.attach`).
     * List is visible to callers with manage or attach; mutations require manage.
     *
     * @generated from rpc aiserver.v1.BackgroundComposerService.ListKeyringGrants
     */
    listKeyringGrants: {
      name: "ListKeyringGrants",
      I: ListKeyringGrantsRequest,
      O: ListKeyringGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.GrantKeyringPermissions
     */
    grantKeyringPermissions: {
      name: "GrantKeyringPermissions",
      I: GrantKeyringPermissionsRequest,
      O: GrantKeyringPermissionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.UpdateKeyringPermissions
     */
    updateKeyringPermissions: {
      name: "UpdateKeyringPermissions",
      I: UpdateKeyringPermissionsRequest,
      O: UpdateKeyringPermissionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.BackgroundComposerService.RevokeKeyringPermissions
     */
    revokeKeyringPermissions: {
      name: "RevokeKeyringPermissions",
      I: RevokeKeyringPermissionsRequest,
      O: RevokeKeyringPermissionsResponse,
      kind: MethodKind.Unary
    }
  }
};

