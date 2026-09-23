var GrokBotService;
var init_grok_bot_connect = __esm({
  "../packages/proto/dist/generated/aiserver/v1/grok_bot_connect.js"() {
    "use strict";
    init_sand_box_pb();
    init_esm();
    init_grok_bot_pb();
    GrokBotService = {
      typeName: "aiserver.v1.GrokBotService",
      methods: {
        /**
         * @generated from rpc aiserver.v1.GrokBotService.EnsureSandBox
         */
        ensureSandBox: {
          name: "EnsureSandBox",
          I: EnsureSandBoxRequest,
          O: EnsureSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.EnsureSandBoxWindow
         */
        ensureSandBoxWindow: {
          name: "EnsureSandBoxWindow",
          I: EnsureSandBoxWindowRequest,
          O: EnsureSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.RecreateSandBox
         */
        recreateSandBox: {
          name: "RecreateSandBox",
          I: RecreateSandBoxRequest,
          O: RecreateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ForceRecreateSandBox
         */
        forceRecreateSandBox: {
          name: "ForceRecreateSandBox",
          I: ForceRecreateSandBoxRequest,
          O: RecreateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminRecreateSandBox
         */
        adminRecreateSandBox: {
          name: "AdminRecreateSandBox",
          I: AdminRecreateSandBoxRequest,
          O: RecreateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminForceRecreateSandBox
         */
        adminForceRecreateSandBox: {
          name: "AdminForceRecreateSandBox",
          I: AdminForceRecreateSandBoxRequest,
          O: RecreateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminBreakGlassDeleteSandBoxPod
         */
        adminBreakGlassDeleteSandBoxPod: {
          name: "AdminBreakGlassDeleteSandBoxPod",
          I: AdminBreakGlassDeleteSandBoxPodRequest,
          O: AdminBreakGlassDeleteSandBoxPodResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.PresignSandBoxStoreWrites
         */
        presignSandBoxStoreWrites: {
          name: "PresignSandBoxStoreWrites",
          I: PresignSandBoxStoreWritesRequest,
          O: PresignSandBoxStoreWritesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CompleteSandBoxStoreMultipartWrites
         */
        completeSandBoxStoreMultipartWrites: {
          name: "CompleteSandBoxStoreMultipartWrites",
          I: CompleteSandBoxStoreMultipartWritesRequest,
          O: CompleteSandBoxStoreMultipartWritesResponse,
          kind: MethodKind.Unary
        },
        /**
         * v2 fenced manifest write: the backend is the single writer of manifest.json.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CommitSandBoxStoreManifest
         */
        commitSandBoxStoreManifest: {
          name: "CommitSandBoxStoreManifest",
          I: CommitSandBoxStoreManifestRequest,
          O: CommitSandBoxStoreManifestResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AbortSandBoxStoreMultipartWrites
         */
        abortSandBoxStoreMultipartWrites: {
          name: "AbortSandBoxStoreMultipartWrites",
          I: AbortSandBoxStoreMultipartWritesRequest,
          O: AbortSandBoxStoreMultipartWritesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.PresignSandBoxStoreReads
         */
        presignSandBoxStoreReads: {
          name: "PresignSandBoxStoreReads",
          I: PresignSandBoxStoreReadsRequest,
          O: PresignSandBoxStoreReadsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.StatSandBoxStoreObject
         */
        statSandBoxStoreObject: {
          name: "StatSandBoxStoreObject",
          I: StatSandBoxStoreObjectRequest,
          O: StatSandBoxStoreObjectResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListSandBoxStoreObjects
         */
        listSandBoxStoreObjects: {
          name: "ListSandBoxStoreObjects",
          I: ListSandBoxStoreObjectsRequest,
          O: ListSandBoxStoreObjectsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetSandBoxStoreStatus
         */
        adminGetSandBoxStoreStatus: {
          name: "AdminGetSandBoxStoreStatus",
          I: AdminSandBoxStoreStatusRequest,
          O: AdminSandBoxStoreStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminUpdateSandBoxHost
         */
        adminUpdateSandBoxHost: {
          name: "AdminUpdateSandBoxHost",
          I: AdminUpdateSandBoxHostRequest,
          O: AdminUpdateSandBoxHostResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetSandBoxHostStatus
         */
        adminGetSandBoxHostStatus: {
          name: "AdminGetSandBoxHostStatus",
          I: AdminSandBoxHostStatusRequest,
          O: AdminSandBoxHostStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminSnapshotSandBoxStore
         */
        adminSnapshotSandBoxStore: {
          name: "AdminSnapshotSandBoxStore",
          I: AdminSnapshotSandBoxStoreRequest,
          O: AdminSnapshotSandBoxStoreResponse,
          kind: MethodKind.Unary
        },
        /**
         * Ordered to mirror SandBoxService exactly: the dual wire-identity test
         * asserts identical method-key order across the two service definitions.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminListSandBoxStoreManifestVersions
         */
        adminListSandBoxStoreManifestVersions: {
          name: "AdminListSandBoxStoreManifestVersions",
          I: AdminListSandBoxStoreManifestVersionsRequest,
          O: AdminListSandBoxStoreManifestVersionsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminRestoreSandBoxStoreSnapshot
         */
        adminRestoreSandBoxStoreSnapshot: {
          name: "AdminRestoreSandBoxStoreSnapshot",
          I: AdminRestoreSandBoxStoreSnapshotRequest,
          O: AdminRestoreSandBoxStoreSnapshotResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminHibernateSandBox
         */
        adminHibernateSandBox: {
          name: "AdminHibernateSandBox",
          I: AdminHibernateSandBoxRequest,
          O: AdminHibernateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminRefreshSandBoxEgress
         */
        adminRefreshSandBoxEgress: {
          name: "AdminRefreshSandBoxEgress",
          I: AdminRefreshSandBoxEgressRequest,
          O: AdminRefreshSandBoxEgressResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminListSandAgents
         */
        adminListSandAgents: {
          name: "AdminListSandAgents",
          I: AdminListSandAgentsRequest,
          O: AdminListSandAgentsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetSandAgentTranscriptPage
         */
        adminGetSandAgentTranscriptPage: {
          name: "AdminGetSandAgentTranscriptPage",
          I: AdminGetSandAgentTranscriptPageRequest,
          O: AdminGetSandAgentTranscriptPageResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.WatchSandBoxMigration
         */
        watchSandBoxMigration: {
          name: "WatchSandBoxMigration",
          I: WatchSandBoxMigrationRequest,
          O: SandBoxMigrationEvent,
          kind: MethodKind.ServerStreaming
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminWatchSandBoxMigration
         */
        adminWatchSandBoxMigration: {
          name: "AdminWatchSandBoxMigration",
          I: AdminWatchSandBoxMigrationRequest,
          O: SandBoxMigrationEvent,
          kind: MethodKind.ServerStreaming
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetSandBoxRunState
         */
        getSandBoxRunState: {
          name: "GetSandBoxRunState",
          I: GetSandBoxRunStateRequest,
          O: GetSandBoxRunStateResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetSandBoxUpgradeSchedule
         */
        getSandBoxUpgradeSchedule: {
          name: "GetSandBoxUpgradeSchedule",
          I: GetSandBoxUpgradeScheduleRequest,
          O: GetSandBoxUpgradeScheduleResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ScheduleSandBoxUpgrade
         */
        scheduleSandBoxUpgrade: {
          name: "ScheduleSandBoxUpgrade",
          I: ScheduleSandBoxUpgradeRequest,
          O: ScheduleSandBoxUpgradeResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CancelSandBoxUpgrade
         */
        cancelSandBoxUpgrade: {
          name: "CancelSandBoxUpgrade",
          I: CancelSandBoxUpgradeRequest,
          O: CancelSandBoxUpgradeResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.RescheduleSandBoxUpgrade
         */
        rescheduleSandBoxUpgrade: {
          name: "RescheduleSandBoxUpgrade",
          I: RescheduleSandBoxUpgradeRequest,
          O: RescheduleSandBoxUpgradeResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListSandBoxes
         */
        listSandBoxes: {
          name: "ListSandBoxes",
          I: ListSandBoxesRequest,
          O: ListSandBoxesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.NotifySandAgentTurnFinished
         */
        notifySandAgentTurnFinished: {
          name: "NotifySandAgentTurnFinished",
          I: NotifySandAgentTurnFinishedRequest,
          O: NotifySandAgentTurnFinishedResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListSandSetupManifests
         */
        listSandSetupManifests: {
          name: "ListSandSetupManifests",
          I: ListSandSetupManifestsRequest,
          O: ListSandSetupManifestsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListTeamSandSetupManifests
         */
        listTeamSandSetupManifests: {
          name: "ListTeamSandSetupManifests",
          I: ListTeamSandSetupManifestsRequest,
          O: ListTeamSandSetupManifestsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SaveTeamSandSetupManifest
         */
        saveTeamSandSetupManifest: {
          name: "SaveTeamSandSetupManifest",
          I: SaveTeamSandSetupManifestRequest,
          O: SaveTeamSandSetupManifestResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteTeamSandSetupManifest
         */
        deleteTeamSandSetupManifest: {
          name: "DeleteTeamSandSetupManifest",
          I: DeleteTeamSandSetupManifestRequest,
          O: DeleteTeamSandSetupManifestResponse,
          kind: MethodKind.Unary
        },
        /**
         * GROUP-owned setup manifests; see ListTeamGroupSandSetupManifestsRequest.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListTeamGroupSandSetupManifests
         */
        listTeamGroupSandSetupManifests: {
          name: "ListTeamGroupSandSetupManifests",
          I: ListTeamGroupSandSetupManifestsRequest,
          O: ListTeamGroupSandSetupManifestsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SaveTeamGroupSandSetupManifest
         */
        saveTeamGroupSandSetupManifest: {
          name: "SaveTeamGroupSandSetupManifest",
          I: SaveTeamGroupSandSetupManifestRequest,
          O: SaveTeamGroupSandSetupManifestResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteTeamGroupSandSetupManifest
         */
        deleteTeamGroupSandSetupManifest: {
          name: "DeleteTeamGroupSandSetupManifest",
          I: DeleteTeamGroupSandSetupManifestRequest,
          O: DeleteTeamGroupSandSetupManifestResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListTeamMemberSandBoxes
         */
        listTeamMemberSandBoxes: {
          name: "ListTeamMemberSandBoxes",
          I: ListTeamMemberSandBoxesRequest,
          O: ListTeamMemberSandBoxesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.KillTeamMemberSandBox
         */
        killTeamMemberSandBox: {
          name: "KillTeamMemberSandBox",
          I: KillTeamMemberSandBoxRequest,
          O: KillTeamMemberSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.RecreateTeamMemberSandBox
         */
        recreateTeamMemberSandBox: {
          name: "RecreateTeamMemberSandBox",
          I: RecreateTeamMemberSandBoxRequest,
          O: RecreateSandBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetTeamMemberSandBoxMigrationStatus
         */
        getTeamMemberSandBoxMigrationStatus: {
          name: "GetTeamMemberSandBoxMigrationStatus",
          I: GetTeamMemberSandBoxMigrationStatusRequest,
          O: GetTeamMemberSandBoxMigrationStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.StartBulkTeamMemberSandBoxOperation
         */
        startBulkTeamMemberSandBoxOperation: {
          name: "StartBulkTeamMemberSandBoxOperation",
          I: StartBulkTeamMemberSandBoxOperationRequest,
          O: StartBulkTeamMemberSandBoxOperationResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetBulkTeamMemberSandBoxOperationStatus
         */
        getBulkTeamMemberSandBoxOperationStatus: {
          name: "GetBulkTeamMemberSandBoxOperationStatus",
          I: GetBulkTeamMemberSandBoxOperationStatusRequest,
          O: GetBulkTeamMemberSandBoxOperationStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.MintSandVoiceCallSecret
         */
        mintSandVoiceCallSecret: {
          name: "MintSandVoiceCallSecret",
          I: MintSandVoiceCallSecretRequest,
          O: MintSandVoiceCallSecretResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.BeginOnePasswordConnection
         */
        beginOnePasswordConnection: {
          name: "BeginOnePasswordConnection",
          I: BeginOnePasswordConnectionRequest,
          O: BeginOnePasswordConnectionResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CompleteOnePasswordConnection
         */
        completeOnePasswordConnection: {
          name: "CompleteOnePasswordConnection",
          I: CompleteOnePasswordConnectionRequest,
          O: OnePasswordState,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetOnePasswordState
         */
        getOnePasswordState: {
          name: "GetOnePasswordState",
          I: GetOnePasswordStateRequest,
          O: OnePasswordState,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SyncOnePasswordConnections
         */
        syncOnePasswordConnections: {
          name: "SyncOnePasswordConnections",
          I: SyncOnePasswordConnectionsRequest,
          O: OnePasswordState,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteOnePasswordConnection
         */
        deleteOnePasswordConnection: {
          name: "DeleteOnePasswordConnection",
          I: DeleteOnePasswordConnectionRequest,
          O: OnePasswordState,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ApproveOnePasswordCredentialRequest
         */
        approveOnePasswordCredentialRequest: {
          name: "ApproveOnePasswordCredentialRequest",
          I: ApproveOnePasswordCredentialRequestRequest,
          O: OnePasswordCredentialDecisionResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DenyOnePasswordCredentialRequest
         */
        denyOnePasswordCredentialRequest: {
          name: "DenyOnePasswordCredentialRequest",
          I: DenyOnePasswordCredentialRequestRequest,
          O: OnePasswordCredentialDecisionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Upserts (and deletes) rows of an agent's client-facing transcript in the
         * off-box row index, one row per SandTranscriptEntry keyed by the box-local
         * transcript sequence. Each write lands only if its updated_seq strictly
         * advances the stored row's, so crash-retried and out-of-order persists are
         * safe to fire blindly. A body above the inline cap must already be durable
         * in the caller's per-tenant box store at blobs/<sha256> and ships as
         * blob_hash instead.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CommitGrokBotTranscriptEntries
         */
        commitGrokBotTranscriptEntries: {
          name: "CommitGrokBotTranscriptEntries",
          I: CommitGrokBotTranscriptEntriesRequest,
          O: CommitGrokBotTranscriptEntriesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the caller's transcript entry rows for one agent, newest first, so
         * a client can hydrate a conversation without waking the box. Scroll back
         * with before_seq.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotTranscriptEntries
         */
        listGrokBotTranscriptEntries: {
          name: "ListGrokBotTranscriptEntries",
          I: ListGrokBotTranscriptEntriesRequest,
          O: ListGrokBotTranscriptEntriesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Per-user live tail over every agent's transcript rows: replays rows past
         * each supplied cursor, then streams every later commit (from the box
         * publisher or the Temporal turn harness) as it lands. Heartbeats every
         * 10s; closes cleanly after its absolute lifetime (see the connected frame),
         * after which the client reconnects with its advanced cursors. Rate limited
         * per user on connect.
         *
         * @generated from rpc aiserver.v1.GrokBotService.WatchGrokBotTranscripts
         */
        watchGrokBotTranscripts: {
          name: "WatchGrokBotTranscripts",
          I: WatchGrokBotTranscriptsRequest,
          O: GrokBotTranscriptWatchFrame,
          kind: MethodKind.ServerStreaming
        },
        /**
         * Writes the caller's client-facing roster state for one of their agents
         * (read watermark / unread badge, notification and sidebar settings). The
         * new state is returned and also streamed to the caller's other desktops as
         * an agent_state frame on WatchGrokBotTranscripts. Agents on any harness may
         * be written; the Sand desktop reads it only for Temporal-hosted agents.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotAgentClientState
         */
        setGrokBotAgentClientState: {
          name: "SetGrokBotAgentClientState",
          I: SetGrokBotAgentClientStateRequest,
          O: SetGrokBotAgentClientStateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the caller's per-session conversations for one agent (future threads
         * UI). Unimplemented until a later PR; fails closed when called.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAgentSessions
         */
        listGrokBotAgentSessions: {
          name: "ListGrokBotAgentSessions",
          I: ListGrokBotAgentSessionsRequest,
          O: ListGrokBotAgentSessionsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Reads a byte range of an attachment or asset file a Temporal-hosted agent
         * wrote on the caller's box (GenerateImage output, screenshots, uploads),
         * through the box exec-daemon, for desktops whose box gateway cannot serve it.
         * The path must lie under the agent's attachments/ or assets/ directory and
         * the agent must be owned by the caller; otherwise not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReadGrokBotAgentAttachmentChunk
         */
        readGrokBotAgentAttachmentChunk: {
          name: "ReadGrokBotAgentAttachmentChunk",
          I: ReadGrokBotAgentAttachmentChunkRequest,
          O: ReadGrokBotAgentAttachmentChunkResponse,
          kind: MethodKind.Unary
        },
        /**
         * Uploads one byte range of a chat attachment into an agent's attachments/
         * directory on its computer, through the box exec-daemon, for clients with
         * no box gateway route (the server-side twin of the gateway's
         * uploadAttachmentChunk). Chunks of one upload_id arrive in offset order,
         * each at most 4 MiB; a re-sent chunk is idempotent. The response carries
         * the committed box path once the last chunk lands, and that path is what
         * SendGrokBotUserMessage.attachment_paths and ReadGrokBotAgentAttachmentChunk
         * take, so no other RPC changes shape. The owner's upload lands on the
         * owner box for any harness; a teammate's upload onto a TEAM agent lands on
         * their own DM session's box and requires a Temporal-hosted agent. Refused
         * with invalid_argument past the per-file byte limit (25 MiB, 200 MiB for
         * video) or when a raster image's bytes do not match its extension;
         * failed_precondition (retryable) while the computer cannot be reached.
         *
         * @generated from rpc aiserver.v1.GrokBotService.UploadGrokBotAgentAttachmentChunk
         */
        uploadGrokBotAgentAttachmentChunk: {
          name: "UploadGrokBotAgentAttachmentChunk",
          I: UploadGrokBotAgentAttachmentChunkRequest,
          O: UploadGrokBotAgentAttachmentChunkResponse,
          kind: MethodKind.Unary
        },
        /**
         * Reports that the caller is (or stopped) actively viewing one of their
         * agents on a client surface. Ephemeral, TTL-bounded (the response says how
         * long); a viewing client re-reports before the TTL lapses. The Temporal
         * turn harness suppresses the turn-finished mobile push while the agent is
         * on screen, as the in-box host does for box-hosted agents from desktop
         * focus. Agents on any harness may be reported.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReportGrokBotClientPresence
         */
        reportGrokBotClientPresence: {
          name: "ReportGrokBotClientPresence",
          I: ReportGrokBotClientPresenceRequest,
          O: ReportGrokBotClientPresenceResponse,
          kind: MethodKind.Unary
        },
        /**
         * The in-box host reports what only it can observe about the caller's own
         * computer: its disk pressure and the host bundle's version / update
         * verdict. Merged into the server's box-state record and streamed to the
         * caller's clients as a box_state frame on WatchGrokBotTranscripts, so a
         * phone that never dials the box still sees the disk banner and the update
         * pill. Called on host start and on every change; idempotent.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReportSandBoxHostState
         */
        reportSandBoxHostState: {
          name: "ReportSandBoxHostState",
          I: ReportSandBoxHostStateRequest,
          O: ReportSandBoxHostStateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists one of the caller's agents' routines as the server holds them: the
         * `agentPlatformWorkflow` rows the Temporal turn harness reads and writes
         * under `grok_bot_server_automations`, rendered into the same record the box
         * gateway's getAgentAutomations returns so the desktop needs no automation
         * parsers. The rows listed are the ones that run as the caller: the owner's
         * own on their agent, or a teammate's own on a TEAM-visible agent.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAgentAutomations
         */
        listGrokBotAgentAutomations: {
          name: "ListGrokBotAgentAutomations",
          I: ListGrokBotAgentAutomationsRequest,
          O: ListGrokBotAgentAutomationsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the caller's routines across the named agents with the same records
         * and visibility as ListGrokBotAgentAutomations. Every unique requested id
         * has a group, in request order, including agents with no caller-visible rows.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAccountAutomations
         */
        listGrokBotAccountAutomations: {
          name: "ListGrokBotAccountAutomations",
          I: ListGrokBotAccountAutomationsRequest,
          O: ListGrokBotAccountAutomationsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists one of the caller's agents' todo items as the server holds them: the
         * `agent.v1.TodoItem` blobs the Temporal turn's persisted working state
         * references, so the desktop reads a TEMPORAL-harness agent's list the way
         * the box gateway's getAgentTodos reads a BOX agent's. An agent the caller
         * cannot see, or one with no persisted state yet, reads as no items.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAgentTodos
         */
        listGrokBotAgentTodos: {
          name: "ListGrokBotAgentTodos",
          I: ListGrokBotAgentTodosRequest,
          O: ListGrokBotAgentTodosResponse,
          kind: MethodKind.Unary
        },
        /**
         * Pauses or resumes one of the routines ListGrokBotAgentAutomations shows the
         * caller (the same `agentPlatformWorkflow` row the Temporal turn writes) and
         * returns the caller's routines as that listing would after the write, so a
         * client swaps its list in one round trip. Only a TEMPORAL-harness agent's
         * routines live on the server: a BOX agent's are files on its box, so the
         * call is refused not_found with the `x-grok-bot-refusal: box_harness`
         * header, the same refusal the other server-routed actions return, and the
         * client keeps using the box gateway for it. A routine the caller cannot see
         * (another user's, or an unknown id) is not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotAgentAutomationEnabled
         */
        setGrokBotAgentAutomationEnabled: {
          name: "SetGrokBotAgentAutomationEnabled",
          I: SetGrokBotAgentAutomationEnabledRequest,
          O: SetGrokBotAgentAutomationEnabledResponse,
          kind: MethodKind.Unary
        },
        /**
         * Deletes one of the caller's routines on a TEMPORAL-harness agent and
         * returns the remaining ones. Same visibility, harness refusal, and
         * not_found rules as SetGrokBotAgentAutomationEnabled.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotAgentAutomation
         */
        deleteGrokBotAgentAutomation: {
          name: "DeleteGrokBotAgentAutomation",
          I: DeleteGrokBotAgentAutomationRequest,
          O: DeleteGrokBotAgentAutomationResponse,
          kind: MethodKind.Unary
        },
        /**
         * The skills the server serves to a TEMPORAL-harness agent's turns from its
         * own definition: today the skills pinned by its template recipe, the same
         * set AdminGetGrokBotAgentDefinition reports as recipe_skills. The owner and
         * any teammate who can view the agent may read them. A BOX agent's skill
         * library is on its box, so the call is refused not_found with the
         * `x-grok-bot-refusal: box_harness` header.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAgentSkills
         */
        listGrokBotAgentSkills: {
          name: "ListGrokBotAgentSkills",
          I: ListGrokBotAgentSkillsRequest,
          O: ListGrokBotAgentSkillsResponse,
          kind: MethodKind.Unary
        },
        /**
         * The caller's box-level MCP settings (per-server custom instructions and
         * disabled tools, legacy name-keyed instructions, user time zone): the
         * server of record for what the box host keeps account-scoped in
         * settings.json, shared by every agent the caller runs on either harness.
         * A Temporal turn reads these behind grok_bot_server_mcp_settings instead
         * of the box file; the desktop always writes them here and onto the box
         * host, so the rows are populated whatever that gate says.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotUserMcpSettings
         */
        getGrokBotUserMcpSettings: {
          name: "GetGrokBotUserMcpSettings",
          I: GetGrokBotUserMcpSettingsRequest,
          O: GetGrokBotUserMcpSettingsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Replaces the caller's settings with the given snapshot (last writer wins
         * per user) and returns the result. Writers always send their whole copy:
         * the desktop after every edit and on every reconnect, a Temporal turn's
         * settings store on every edit.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotUserMcpSettings
         */
        setGrokBotUserMcpSettings: {
          name: "SetGrokBotUserMcpSettings",
          I: SetGrokBotUserMcpSettingsRequest,
          O: SetGrokBotUserMcpSettingsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Reads the caller's server-owned client preferences (pinned agents, sidebar
         * sections, first-run onboarding), which the owner's devices share.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotUserRuntimeSettings
         */
        getGrokBotUserRuntimeSettings: {
          name: "GetGrokBotUserRuntimeSettings",
          I: GetGrokBotUserRuntimeSettingsRequest,
          O: GetGrokBotUserRuntimeSettingsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Applies the present fields without replacing unrelated settings.
         *
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotUserRuntimeSettings
         */
        updateGrokBotUserRuntimeSettings: {
          name: "UpdateGrokBotUserRuntimeSettings",
          I: UpdateGrokBotUserRuntimeSettingsRequest,
          O: UpdateGrokBotUserRuntimeSettingsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Makes a live AGENT the caller owns the caller's main bot (one per user,
         * replacing any previous one) and pins it if it was not already pinned; the
         * owner may unpin it afterwards. Deleting the agent clears the pointer.
         * Behind sand_grok_main_agent; fails not_found for an agent the caller does
         * not own or has deleted.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotMainAgent
         */
        setGrokBotMainAgent: {
          name: "SetGrokBotMainAgent",
          I: SetGrokBotMainAgentRequest,
          O: SetGrokBotMainAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * The primary bot chooser's "Add now": makes the default main bot ("Grok
         * Bot") the caller's main bot, creating it when the caller never had one, or
         * reports the main bot the caller already has. Idempotent: the bot's id is
         * fixed per user, so a retry or a concurrent call converges on one row.
         * Behind sand_grok_main_agent; fails invalid_argument when it is off and
         * failed_precondition when the caller is outside the Temporal harness the
         * bot runs on.
         *
         * @generated from rpc aiserver.v1.GrokBotService.EnsureGrokBotDefaultMainAgent
         */
        ensureGrokBotDefaultMainAgent: {
          name: "EnsureGrokBotDefaultMainAgent",
          I: EnsureGrokBotDefaultMainAgentRequest,
          O: EnsureGrokBotDefaultMainAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Records that a client showed the caller the Grok Bot terms notice. A
         * server-stamped latch: the first call sets the moment, later calls return
         * it unchanged. Admitted for any signed-in user, entitled or not, so the
         * landing-step display of a not-yet-entitled account is still recorded.
         *
         * @generated from rpc aiserver.v1.GrokBotService.MarkGrokBotTermsSeen
         */
        markGrokBotTermsSeen: {
          name: "MarkGrokBotTermsSeen",
          I: MarkGrokBotTermsSeenRequest,
          O: MarkGrokBotTermsSeenResponse,
          kind: MethodKind.Unary
        },
        /**
         * Creates an agent with a SERVER-minted durable row id (clients never choose
         * durable ids). Deduped per caller on agent_id (the agent's UUID id, which
         * doubles as the create idempotency key): a retry returns the existing
         * agent, and a tombstoned agent_id is never revived (fails already_exists).
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotAgent
         */
        createGrokBotAgent: {
          name: "CreateGrokBotAgent",
          I: CreateGrokBotAgentRequest,
          O: CreateGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotTemporalAgent
         */
        createGrokBotTemporalAgent: {
          name: "CreateGrokBotTemporalAgent",
          I: CreateGrokBotAgentRequest,
          O: CreateGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the caller's non-deleted agents, oldest first.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotAgents
         */
        listGrokBotAgents: {
          name: "ListGrokBotAgents",
          I: ListGrokBotAgentsRequest,
          O: ListGrokBotAgentsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Team bot discovery: the same roster as ListGrokBotAgents with
         * include_team_agents (the caller's bots plus the team-visible bots and
         * group chats they can see), most used first (accepted user turns, then
         * last use, then newest), each with the discovery signals GrokBotAgent
         * withholds. A superset of ListGrokBotAgents so a desktop can replace that
         * call with this one.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotTeamAgents
         */
        listGrokBotTeamAgents: {
          name: "ListGrokBotTeamAgents",
          I: ListGrokBotTeamAgentsRequest,
          O: ListGrokBotTeamAgentsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotRuntimeCapabilities
         */
        getGrokBotRuntimeCapabilities: {
          name: "GetGrokBotRuntimeCapabilities",
          I: GetGrokBotRuntimeCapabilitiesRequest,
          O: GetGrokBotRuntimeCapabilitiesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Starts or finds a pass; pending tells the host to keep this window fenced.
         *
         * @generated from rpc aiserver.v1.GrokBotService.EnsureGrokBotBoxHarnessMigrationPass
         */
        ensureGrokBotBoxHarnessMigrationPass: {
          name: "EnsureGrokBotBoxHarnessMigrationPass",
          I: EnsureGrokBotBoxHarnessMigrationPassRequest,
          O: EnsureGrokBotBoxHarnessMigrationPassResponse,
          kind: MethodKind.Unary
        },
        /**
         * Owner-only visibility transition for a server-backed Temporal agent.
         * TEAM stamps the caller's current team; OWNER keeps the stamped team for
         * later re-sharing. Hidden behind grok_bot_multiplayer.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotAgentVisibility
         */
        setGrokBotAgentVisibility: {
          name: "SetGrokBotAgentVisibility",
          I: SetGrokBotAgentVisibilityRequest,
          O: SetGrokBotAgentVisibilityResponse,
          kind: MethodKind.Unary
        },
        /**
         * The owner's Publish to team on a TEAM bot created under the publish step:
         * until this, only the owner can see or message it. Owner-only; idempotent
         * (a second call answers already_published and changes nothing).
         *
         * @generated from rpc aiserver.v1.GrokBotService.PublishGrokBotAgent
         */
        publishGrokBotAgent: {
          name: "PublishGrokBotAgent",
          I: PublishGrokBotAgentRequest,
          O: PublishGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * The owner's Unpublish on a published TEAM bot: clears the publish stamp so
         * the bot is the owner's alone again (Draft) until a later Publish to team.
         * The row stays TEAM. Owner-only; idempotent (a second call answers
         * not_published and changes nothing).
         *
         * @generated from rpc aiserver.v1.GrokBotService.UnpublishGrokBotAgent
         */
        unpublishGrokBotAgent: {
          name: "UnpublishGrokBotAgent",
          I: UnpublishGrokBotAgentRequest,
          O: UnpublishGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Updates a non-deleted agent the caller owns; a missing id, a tombstone, or
         * another owner's row are all not_found (an update never revives or crosses
         * owners).
         *
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotAgent
         */
        updateGrokBotAgent: {
          name: "UpdateGrokBotAgent",
          I: UpdateGrokBotAgentRequest,
          O: UpdateGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Soft-deletes an agent the caller owns; the row stays as a tombstone so its
         * durable id can never be reused. A missing or already-deleted id is
         * not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotAgent
         */
        deleteGrokBotAgent: {
          name: "DeleteGrokBotAgent",
          I: DeleteGrokBotAgentRequest,
          O: DeleteGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Static credentials the owner configures for a team-shared Temporal bot,
         * keyed by environment variable name. Values are write-only: they are
         * KMS-encrypted at rest and only ever decrypted to hand to the bot's box.
         * Owner-only; hidden behind grok_bot_multiplayer. Put requires the bot to be
         * TEAM-visible; List and Delete work on any owned Temporal bot so unsharing
         * never strands a value.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotSecrets
         */
        listGrokBotSecrets: {
          name: "ListGrokBotSecrets",
          I: ListGrokBotSecretsRequest,
          O: ListGrokBotSecretsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Create-or-replace by name. A repeated name replaces both value and description.
         *
         * @generated from rpc aiserver.v1.GrokBotService.PutGrokBotSecret
         */
        putGrokBotSecret: {
          name: "PutGrokBotSecret",
          I: PutGrokBotSecretRequest,
          O: PutGrokBotSecretResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotSecret
         */
        deleteGrokBotSecret: {
          name: "DeleteGrokBotSecret",
          I: DeleteGrokBotSecretRequest,
          O: DeleteGrokBotSecretResponse,
          kind: MethodKind.Unary
        },
        /**
         * Email inboxes. These are user-scoped, not agent-scoped: an inbox belongs
         * to a user, every bot that user owns may use every inbox they own, so no
         * request here names a bot. An inbox is addressed by its email address,
         * which is its unique routing key.
         *
         * Claiming an address is the whole of provisioning under SES, which sells no
         * inbox object: a verified domain covers every local part at it, so these
         * three RPCs touch nothing outside our own tables. Reading mail and sending
         * it are not here; they belong to the inbound worker and to the send path.
         * All hidden behind grok_bot_agent_mail.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotEmailInbox
         */
        createGrokBotEmailInbox: {
          name: "CreateGrokBotEmailInbox",
          I: CreateGrokBotEmailInboxRequest,
          O: CreateGrokBotEmailInboxResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotEmailInboxes
         */
        listGrokBotEmailInboxes: {
          name: "ListGrokBotEmailInboxes",
          I: ListGrokBotEmailInboxesRequest,
          O: ListGrokBotEmailInboxesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Stops the address routing and retires it. It is never reissued.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotEmailInbox
         */
        deleteGrokBotEmailInbox: {
          name: "DeleteGrokBotEmailInbox",
          I: DeleteGrokBotEmailInboxRequest,
          O: DeleteGrokBotEmailInboxResponse,
          kind: MethodKind.Unary
        },
        /**
         * Sends one message through SES from an inbox the caller owns and records
         * it as an OUTBOUND grok_bot_email_message row. A reply names one of our
         * own message row ids so the thread stays intact across providers.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SendGrokBotEmail
         */
        sendGrokBotEmail: {
          name: "SendGrokBotEmail",
          I: SendGrokBotEmailRequest,
          O: SendGrokBotEmailResponse,
          kind: MethodKind.Unary
        },
        /**
         * Reading mail. Both are scoped to the caller's user id and to the live
         * inboxes that user owns; a thread id or message id in a request is a
         * lookup key, never an authorization token. Bodies come from the search
         * index, which lags arrival by up to a minute and forgets purged content,
         * so a message can be listed without a body.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SearchGrokBotEmailThreads
         */
        searchGrokBotEmailThreads: {
          name: "SearchGrokBotEmailThreads",
          I: SearchGrokBotEmailThreadsRequest,
          O: SearchGrokBotEmailThreadsResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ReadGrokBotEmailThread
         */
        readGrokBotEmailThread: {
          name: "ReadGrokBotEmailThread",
          I: ReadGrokBotEmailThreadRequest,
          O: ReadGrokBotEmailThreadResponse,
          kind: MethodKind.Unary
        },
        /**
         * Opens one stored attachment of a message in the caller's scope. Text-like
         * parts come back as capped text; anything else comes back as bytes for the
         * harness to place in the agent's attachments store. Never raw bytes to the
         * model. Same scope rule as the thread read: a foreign id is not found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReadGrokBotEmailAttachment
         */
        readGrokBotEmailAttachment: {
          name: "ReadGrokBotEmailAttachment",
          I: ReadGrokBotEmailAttachmentRequest,
          O: ReadGrokBotEmailAttachmentResponse,
          kind: MethodKind.Unary
        },
        /**
         * A TEAM-visible agent's plugins live on its own team marketplace (one
         * maindb marketplaceGrokBotLink row). These RPCs are the bot-surface
         * passthroughs onto that marketplace: the server resolves the marketplace
         * from the agent and never trusts a marketplace id in the request. Writes
         * are allowed to the agent owner or a team admin (ManageTeamPlugins) of the
         * agent's team; the read is allowed to anyone who can view the agent.
         * Hidden behind grok_bot_multiplayer.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotAgentPlugins
         */
        getGrokBotAgentPlugins: {
          name: "GetGrokBotAgentPlugins",
          I: GetGrokBotAgentPluginsRequest,
          O: GetGrokBotAgentPluginsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Full-set replace of the marketplace's plugins. An entry omitted from the
         * list is removed (its inline plugin hard-deleted, its team MCP rows torn
         * down unless another team marketplace still policies the plugin). Every
         * entry gets an OPTIONAL policy so nothing auto-installs into teammates'
         * IDEs; team MCP rows are still materialized so the bot can use them.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotAgentPlugins
         */
        setGrokBotAgentPlugins: {
          name: "SetGrokBotAgentPlugins",
          I: SetGrokBotAgentPluginsRequest,
          O: SetGrokBotAgentPluginsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Writes `${VAR}` install variables onto one plugin already on this agent's
         * marketplace (policy or link). Empty / omitted `variables` clears stored
         * values. Does not change install mode, teamPluginInstall, or the team MCP
         * plane. Values never come back on Get.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotAgentPluginVariables
         */
        setGrokBotAgentPluginVariables: {
          name: "SetGrokBotAgentPluginVariables",
          I: SetGrokBotAgentPluginVariablesRequest,
          O: SetGrokBotAgentPluginVariablesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotAgentMarketplace
         */
        updateGrokBotAgentMarketplace: {
          name: "UpdateGrokBotAgentMarketplace",
          I: UpdateGrokBotAgentMarketplaceRequest,
          O: UpdateGrokBotAgentMarketplaceResponse,
          kind: MethodKind.Unary
        },
        /**
         * Skill bodies for the marketplace-owned `bot-skills` plugin live on that
         * plugin row (JSON), not in Origin or GitHub. Add copies a SKILL.md into
         * the row; Remove deletes that skill. GetGrokBotAgentPlugins already lists
         * every plugin on M (packaged + bot-skills). GetGrokBotAgentPluginFile
         * returns inline content when present and otherwise the git/artifact file.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AddGrokBotAgentSkill
         */
        addGrokBotAgentSkill: {
          name: "AddGrokBotAgentSkill",
          I: AddGrokBotAgentSkillRequest,
          O: AddGrokBotAgentSkillResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotAgentSkill
         */
        updateGrokBotAgentSkill: {
          name: "UpdateGrokBotAgentSkill",
          I: UpdateGrokBotAgentSkillRequest,
          O: UpdateGrokBotAgentSkillResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.RemoveGrokBotAgentSkill
         */
        removeGrokBotAgentSkill: {
          name: "RemoveGrokBotAgentSkill",
          I: RemoveGrokBotAgentSkillRequest,
          O: RemoveGrokBotAgentSkillResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotAgentPluginFile
         */
        getGrokBotAgentPluginFile: {
          name: "GetGrokBotAgentPluginFile",
          I: GetGrokBotAgentPluginFileRequest,
          O: GetGrokBotAgentPluginFileResponse,
          kind: MethodKind.Unary
        },
        /**
         * A team bot's context: the bot's own two-sentence account of its job,
         * written by a flash-class model after turns that wrote shared memory and
         * cached by shard version, plus the shared-memory facts themselves, read
         * verbatim from the shard on every call. Every viewer of the bot (owner and
         * members) gets the same shared-scope answer; user- and session-scope
         * memories are never read here. Get also returns the bot's skills.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTeamContextSummary
         */
        getGrokBotTeamContextSummary: {
          name: "GetGrokBotTeamContextSummary",
          I: GetGrokBotTeamContextSummaryRequest,
          O: GetGrokBotTeamContextSummaryResponse,
          kind: MethodKind.Unary
        },
        /**
         * Create-or-replace: upserts the caller's parent row by source_agent_id
         * (reusing its share id and public URL) and appends a new INACTIVE version.
         * Mints a short-lived PUT URL for that version's own S3 object key — a new
         * export never overwrites a previous version's blob. Requires the recipe
         * upload (blob content type + byte size); a create without a blob is
         * invalid_argument. The name/description/avatar request fields are
         * copied onto the immutable version as typed columns so GetPublic can serve
         * the share page without fetching S3. `published` and the currently active
         * version are never touched here.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotTemplate
         */
        createGrokBotTemplate: {
          name: "CreateGrokBotTemplate",
          I: CreateGrokBotTemplateRequest,
          O: CreateGrokBotTemplateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the caller's templates, newest first, including source_agent_id so
         * the client can group by source bot, plus `published` and
         * `active_version` so a version card can tell Publish from Copy link using
         * its own version number.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotTemplates
         */
        listGrokBotTemplates: {
          name: "ListGrokBotTemplates",
          I: ListGrokBotTemplatesRequest,
          O: ListGrokBotTemplatesResponse,
          kind: MethodKind.Unary
        },
        /**
         * HARD delete of a template the caller owns: the parent row, every
         * version, and their S3 blobs. The share URL 404s immediately, and the
         * source bot's unique binding is freed so the next export mints a fresh
         * share id. A missing or other-owner share id is not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotTemplate
         */
        deleteGrokBotTemplate: {
          name: "DeleteGrokBotTemplate",
          I: DeleteGrokBotTemplateRequest,
          O: DeleteGrokBotTemplateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Creator-only visibility transition on the parent template. PUBLIC keeps
         * USER ownership; TEAM transfers ownership to the caller's current team.
         * Every immutable version inherits the parent visibility.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotTemplateVisibility
         */
        setGrokBotTemplateVisibility: {
          name: "SetGrokBotTemplateVisibility",
          I: SetGrokBotTemplateVisibilityRequest,
          O: SetGrokBotTemplateVisibilityResponse,
          kind: MethodKind.Unary
        },
        /**
         * Owner-only confirm: atomically deactivate the template's current active
         * version (if any), mark the REQUESTED version active, and set the parent
         * published. Activating an older version than the current active one is
         * allowed (rollback); first publish and replace are the same call. A
         * missing, other-owner, or unknown (share_id, version) is not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ActivateGrokBotTemplateVersion
         */
        activateGrokBotTemplateVersion: {
          name: "ActivateGrokBotTemplateVersion",
          I: ActivateGrokBotTemplateVersionRequest,
          O: ActivateGrokBotTemplateVersionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Owner-only view-details for ANY of the caller's versions, active or not —
         * this is how the confirm modal loads a draft. Returns version metadata and
         * a short-lived presigned GET for the recipe blob; the recipe JSON itself
         * never rides the RPC. A missing, other-owner, or unknown (share_id,
         * version) is not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTemplateVersion
         */
        getGrokBotTemplateVersion: {
          name: "GetGrokBotTemplateVersion",
          I: GetGrokBotTemplateVersionRequest,
          O: GetGrokBotTemplateVersionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Owner-only lookup by source bot UUID for the right-sidebar share CTA.
         * Returns the caller's parent when this source bot is bound to a template
         * they own. A missing template or another owner's binding return unset —
         * never not_found — so the sidebar treats "none" as Share as template.
         * Card fields and active_version are unset while every version is still
         * inactive.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTemplateForSourceAgent
         */
        getGrokBotTemplateForSourceAgent: {
          name: "GetGrokBotTemplateForSourceAgent",
          I: GetGrokBotTemplateForSourceAgentRequest,
          O: GetGrokBotTemplateForSourceAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Effective export policy for the current caller after composing the
         * team-admin enum with Statsig `sand_share_bot_export_policy`. Admin
         * wins when set; otherwise Statsig. Same team resolution as
         * CreateGrokBotTemplate: selected team, else the caller's sole
         * membership, else Statsig only. Users with no team stay Statsig-only.
         * Empty request; always returns a policy and has_team so the desktop
         * picker and in-box share tool can offer TEAM before a parent row exists
         * or a team is selected locally.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTemplateExportPolicy
         */
        getGrokBotTemplateExportPolicy: {
          name: "GetGrokBotTemplateExportPolicy",
          I: GetGrokBotTemplateExportPolicyRequest,
          O: GetGrokBotTemplateExportPolicyResponse,
          kind: MethodKind.Unary
        },
        /**
         * Unauthenticated public fetch by share id. A LISTED marketplace snapshot
         * wins; otherwise the live parent must be published with an active version.
         * The endpoint reads postcard columns only and never fetches recipe bytes.
         * Does not include owner ids or email; owner_display_name is first+last
         * name only (empty when missing).
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetPublicGrokBotTemplate
         */
        getPublicGrokBotTemplate: {
          name: "GetPublicGrokBotTemplate",
          I: GetPublicGrokBotTemplateRequest,
          O: GetPublicGrokBotTemplateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Unauthenticated public marketplace browse. LISTED snapshots with valid
         * creator and avatar metadata are returned independently of their source
         * template. Internal ids, moderation state, and blob keys never enter this
         * public resource.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListPublicGrokBotMarketplaceListings
         */
        listPublicGrokBotMarketplaceListings: {
          name: "ListPublicGrokBotMarketplaceListings",
          I: ListPublicGrokBotMarketplaceListingsRequest,
          O: ListPublicGrokBotMarketplaceListingsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Unauthenticated public marketplace detail by slug. LISTED status is the
         * revocation boundary; source-template state is not consulted. The
         * short-lived recipe URL is for immediate server-side consumption and must
         * not be cached.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetPublicGrokBotMarketplaceListing
         */
        getPublicGrokBotMarketplaceListing: {
          name: "GetPublicGrokBotMarketplaceListing",
          I: GetPublicGrokBotMarketplaceListingRequest,
          O: GetPublicGrokBotMarketplaceListingResponse,
          kind: MethodKind.Unary
        },
        /**
         * Authenticated import details. A LISTED marketplace snapshot wins;
         * otherwise the live parent must be published with an active version.
         * Returns the resolved postcard plus a short-lived recipe GET; recipe JSON
         * never rides the RPC. Does not include owner ids or email.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTemplateImportDetails
         */
        getGrokBotTemplateImportDetails: {
          name: "GetGrokBotTemplateImportDetails",
          I: GetGrokBotTemplateImportDetailsRequest,
          O: GetGrokBotTemplateImportDetailsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Creates a new agent for the caller from a public template share id.
         * Copies only name + avatar_shape + avatar_color; the server mints
         * agent_id. A missing or revoked share id is not_found. Does not apply
         * template body, recipe JSON, skills, memories, or routines.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotAgentFromTemplate
         */
        createGrokBotAgentFromTemplate: {
          name: "CreateGrokBotAgentFromTemplate",
          I: CreateGrokBotAgentFromTemplateRequest,
          O: CreateGrokBotAgentFromTemplateResponse,
          kind: MethodKind.Unary
        },
        /**
         * The user's send, routed by the agent's durable grok_bot_agent.harness:
         * a BOX agent's message is posted to the owner's Sand box host as the very
         * sendPrompt command the desktop used to post itself (the host's acceptance
         * ledger dedupes on message_id); a TEMPORAL agent's message is signalled
         * into its grokBotTurnWorkflow. Idempotent on (agent_id, message_id). The
         * response's mode is telemetry only: a box-harness owner in shadow mode
         * also gets a shadow turn signalled, but the box leg has already accepted
         * the message.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SendGrokBotUserMessage
         */
        sendGrokBotUserMessage: {
          name: "SendGrokBotUserMessage",
          I: SendGrokBotUserMessageRequest,
          O: SendGrokBotUserMessageResponse,
          kind: MethodKind.Unary
        },
        /**
         * Durable acceptance status of one message_id previously sent through
         * SendGrokBotUserMessage: a restored client resolves an uncertain dispatch
         * here before deciding whether to retry the id. A pure read.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotSendStatus
         */
        getGrokBotSendStatus: {
          name: "GetGrokBotSendStatus",
          I: GetGrokBotSendStatusRequest,
          O: GetGrokBotSendStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * The caller's Grok Bot watchers registered on one cloud agent run: the
         * launch / reply / watch registrations that wake a bot at the run's next
         * completion seam, with whether each re-arms (durable). A pure read of the
         * watch registry, scoped to the caller's own bots.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotCloudAgentWatchers
         */
        getGrokBotCloudAgentWatchers: {
          name: "GetGrokBotCloudAgentWatchers",
          I: GetGrokBotCloudAgentWatchersRequest,
          O: GetGrokBotCloudAgentWatchersResponse,
          kind: MethodKind.Unary
        },
        /**
         * Stops the agent's in-flight turn (box host run or Temporal activity)
         * without queueing anything new.
         *
         * @generated from rpc aiserver.v1.GrokBotService.InterruptGrokBotAgentRun
         */
        interruptGrokBotAgentRun: {
          name: "InterruptGrokBotAgentRun",
          I: InterruptGrokBotAgentRunRequest,
          O: InterruptGrokBotAgentRunResponse,
          kind: MethodKind.Unary
        },
        /**
         * Answers a question/widget card the agent sent. The card row records the
         * pick and the answer reaches the agent as its next turn: on the box the
         * host's respondToWidget path, on Temporal a user_message signal keyed
         * widget:<entry_id>.
         *
         * @generated from rpc aiserver.v1.GrokBotService.RespondGrokBotWidget
         */
        respondGrokBotWidget: {
          name: "RespondGrokBotWidget",
          I: RespondGrokBotWidgetRequest,
          O: RespondGrokBotWidgetResponse,
          kind: MethodKind.Unary
        },
        /**
         * Stores a secret-request card's value in the agent's host-only credential
         * store, marks the card provided, and wakes the Temporal agent with an ack.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SubmitGrokBotSecret
         */
        submitGrokBotSecret: {
          name: "SubmitGrokBotSecret",
          I: SubmitGrokBotSecretRequest,
          O: SubmitGrokBotSecretResponse,
          kind: MethodKind.Unary
        },
        /**
         * Resolves a saved-credential request. Temporal agents settle the server
         * transcript, perform approved browser fill on the agent's box, and wake the
         * turn without placing credential values in the conversation.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ResolveGrokBotCredentialRequest
         */
        resolveGrokBotCredentialRequest: {
          name: "ResolveGrokBotCredentialRequest",
          I: ResolveGrokBotCredentialRequestRequest,
          O: ResolveGrokBotCredentialRequestResponse,
          kind: MethodKind.Unary
        },
        /**
         * Marks a question/widget card dismissed without answering; never wakes the
         * agent.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DismissGrokBotWidget
         */
        dismissGrokBotWidget: {
          name: "DismissGrokBotWidget",
          I: DismissGrokBotWidgetRequest,
          O: DismissGrokBotWidgetResponse,
          kind: MethodKind.Unary
        },
        /**
         * Submits a request_user_form card the Temporal agent raised: the server
         * fills the submitted values into the agent's live box browser (the same
         * host fill the box harness runs), stamps the card with per-field outcomes,
         * and wakes the agent with a status-only receipt. Values never enter the
         * transcript, the wake, or the model.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SubmitGrokBotUserForm
         */
        submitGrokBotUserForm: {
          name: "SubmitGrokBotUserForm",
          I: SubmitGrokBotUserFormRequest,
          O: SubmitGrokBotUserFormResponse,
          kind: MethodKind.Unary
        },
        /**
         * Settles a request_user_form card without filling: dismissed, or escalated
         * to doing the step on the box screen. Wakes the agent with the outcome.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DismissGrokBotUserForm
         */
        dismissGrokBotUserForm: {
          name: "DismissGrokBotUserForm",
          I: DismissGrokBotUserFormRequest,
          O: DismissGrokBotUserFormResponse,
          kind: MethodKind.Unary
        },
        /**
         * Sends an email/Slack draft card. On Temporal the card is stamped sending
         * and a user_message signal keyed draft-send:<entry_id> wakes the turn to
         * execute the connector send. On the box the host's sendDraft path runs.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SendGrokBotDraft
         */
        sendGrokBotDraft: {
          name: "SendGrokBotDraft",
          I: SendGrokBotDraftRequest,
          O: SendGrokBotDraftResponse,
          kind: MethodKind.Unary
        },
        /**
         * Marks an email/Slack draft card discarded without sending; never wakes the
         * agent.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DiscardGrokBotDraft
         */
        discardGrokBotDraft: {
          name: "DiscardGrokBotDraft",
          I: DiscardGrokBotDraftRequest,
          O: DiscardGrokBotDraftResponse,
          kind: MethodKind.Unary
        },
        /**
         * Toggles the user's emoji reaction on a transcript entry.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReactToGrokBotMessage
         */
        reactToGrokBotMessage: {
          name: "ReactToGrokBotMessage",
          I: ReactToGrokBotMessageRequest,
          O: ReactToGrokBotMessageResponse,
          kind: MethodKind.Unary
        },
        /**
         * Records feedback (thumbs up/down, categories, comment) on an agent message.
         *
         * @generated from rpc aiserver.v1.GrokBotService.VoteGrokBotFeedback
         */
        voteGrokBotFeedback: {
          name: "VoteGrokBotFeedback",
          I: VoteGrokBotFeedbackRequest,
          O: VoteGrokBotFeedbackResponse,
          kind: MethodKind.Unary
        },
        /**
         * Server-side SendToAgent gateway for mixed box/Temporal fleets: delivers one
         * agent-to-agent message from one of the caller's agents to another, routed
         * by the target's durable grok_bot_agent.harness column (box host vs the
         * Temporal turn workflow), so the sender never needs to know where the
         * target lives. Called by the Sand box host when a SendToAgent target is not
         * one of its local sessions; the Temporal harness calls the same routing
         * in-process. Idempotent on (target, message_id).
         *
         * @generated from rpc aiserver.v1.GrokBotService.SendGrokBotAgentMessage
         */
        sendGrokBotAgentMessage: {
          name: "SendGrokBotAgentMessage",
          I: SendGrokBotAgentMessageRequest,
          O: SendGrokBotAgentMessageResponse,
          kind: MethodKind.Unary
        },
        /**
         * Answers an Auto-review approval card raised by the caller's agent on the
         * Temporal turn harness (the turn parked on it). Signals the agent's
         * grokBotTurnWorkflow to resume the parked turn with the decision. NotFound
         * when the card is not the agent's pending one (stale, expired, or already
         * answered); Unavailable (retryable) when the workflow could not be
         * signalled. Box-hosted agents keep answering through the box gateway.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ResolveGrokBotAutoReviewApproval
         */
        resolveGrokBotAutoReviewApproval: {
          name: "ResolveGrokBotAutoReviewApproval",
          I: ResolveGrokBotAutoReviewApprovalRequest,
          O: ResolveGrokBotAutoReviewApprovalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Answers a user-computer permission card (the "Allow this on your
         * computer?" ask raised when the caller's standing permission is "ask").
         * For Temporal-hosted agents the turn parked on the card: this signals the
         * agent's grokBotTurnWorkflow to resume the pending tool call with the
         * decision; NotFound when the card is not the agent's pending one (stale,
         * expired, or already answered); Unavailable (retryable) when the workflow
         * could not be signalled. Box-hosted agents are answered through the box
         * gateway by this same RPC. This RPC records a machine-bound approval that
         * the server verifies before marking the resumed work as authorized.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ResolveGrokBotLocalToolPermission
         */
        resolveGrokBotLocalToolPermission: {
          name: "ResolveGrokBotLocalToolPermission",
          I: ResolveGrokBotLocalToolPermissionRequest,
          O: ResolveGrokBotLocalToolPermissionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Answers a per-turn connector-grant card ("Allow / Skip for this turn",
         * or an "Always allow") raised on the Temporal harness when the acting
         * user is in the Sand app (main or an app DM). Signals the parked
         * grokBotTurnWorkflow. NotFound when the card is not the pending ask or
         * the caller is not the acting user. Slack clicks stay on the Slack
         * interaction path. Skip covers this turn only; an Always allow is stored
         * for the acting user and then allows this turn.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ResolveGrokBotConnectorGrant
         */
        resolveGrokBotConnectorGrant: {
          name: "ResolveGrokBotConnectorGrant",
          I: ResolveGrokBotConnectorGrantRequest,
          O: ResolveGrokBotConnectorGrantResponse,
          kind: MethodKind.Unary
        },
        /**
         * Forgets every "Always allow" the caller has stored for TEAM bots, on
         * every team and in both scopes (this bot, all of a team's bots), so the
         * next connector use asks again. The caller's own rows only; idempotent,
         * a clear with nothing stored succeeds with cleared_count 0.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ClearGrokBotConnectorAlwaysAllow
         */
        clearGrokBotConnectorAlwaysAllow: {
          name: "ClearGrokBotConnectorAlwaysAllow",
          I: ClearGrokBotConnectorAlwaysAllowRequest,
          O: ClearGrokBotConnectorAlwaysAllowResponse,
          kind: MethodKind.Unary
        },
        /**
         * Answers a virtual-card approval card. On approve the backend creates the
         * Stripe Link spend request itself and returns Link's approval URL for the
         * desktop to open; the agent never has a tool that can create one.
         *
         * The request deliberately carries no amount or merchant: the backend reads
         * those off the pending card it raised, so a client cannot restate what is
         * being bought between what the user saw and what gets authorized.
         * Reserves the agent's one open virtual-card request and records the values
         * the card is about to be shown with.
         *
         * The record is what ResolveGrokBotVirtualCardApproval builds Link's spend
         * request from, so it has to live server-side for BOTH harnesses: a
         * box-hosted agent raising the card only inside its own container would
         * leave the approve click with nothing to read.
         *
         * @generated from rpc aiserver.v1.GrokBotService.RaiseGrokBotVirtualCard
         */
        raiseGrokBotVirtualCard: {
          name: "RaiseGrokBotVirtualCard",
          I: RaiseGrokBotVirtualCardRequest,
          O: RaiseGrokBotVirtualCardResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ResolveGrokBotVirtualCardApproval
         */
        resolveGrokBotVirtualCardApproval: {
          name: "ResolveGrokBotVirtualCardApproval",
          I: ResolveGrokBotVirtualCardApprovalRequest,
          O: ResolveGrokBotVirtualCardApprovalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Lists the payment methods saved in the caller's connected Link wallet, so
         * the human answering a virtual card can pick which one funds it.
         *
         * The caller is the owner and nobody else: there is deliberately no user
         * field on the request, and the backend reads the wallet for whoever the
         * bearer token authenticated. Nothing here is a payment credential — a
         * brand, a last4, an expiry, and an opaque id. The PAN lives only on an
         * approved spend request.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotStripeLinkPaymentMethods
         */
        listGrokBotStripeLinkPaymentMethods: {
          name: "ListGrokBotStripeLinkPaymentMethods",
          I: ListGrokBotStripeLinkPaymentMethodsRequest,
          O: ListGrokBotStripeLinkPaymentMethodsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Passkeys: a WebAuthn credential enrolled against the Cursor user, so the
         * backend can prove a human approved a virtual card in-app before it creates
         * the Link spend request. RP ID is cursor.com; the backend is the RP
         * verifier. Sand never handles credential material: the ceremony itself
         * (navigator.credentials.*) runs on a hosted page the client opens at
         * `<website base> + ceremony_path` with the ceremony token in the URL
         * fragment, and the client learns the outcome by polling
         * GetPasskeyCeremonyStatus.
         *
         * Enrollment step-up. Emails the session user a 6-digit code (10 min, 5
         * attempts) that VerifyPasskeyEnrollmentCode exchanges for an enrollment
         * ticket. The recipient is the caller, so the request is empty.
         *
         * @generated from rpc aiserver.v1.GrokBotService.StartPasskeyEnrollment
         */
        startPasskeyEnrollment: {
          name: "StartPasskeyEnrollment",
          I: StartPasskeyEnrollmentRequest,
          O: StartPasskeyEnrollmentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Exchanges the emailed code for a single-use enrollment ticket (5 min).
         * InvalidArgument on a wrong code; ResourceExhausted once the attempts run
         * out and the code is retired.
         *
         * @generated from rpc aiserver.v1.GrokBotService.VerifyPasskeyEnrollmentCode
         */
        verifyPasskeyEnrollmentCode: {
          name: "VerifyPasskeyEnrollmentCode",
          I: VerifyPasskeyEnrollmentCodeRequest,
          O: VerifyPasskeyEnrollmentCodeResponse,
          kind: MethodKind.Unary
        },
        /**
         * Consumes the enrollment ticket and opens a registration ceremony: the
         * WebAuthn creation options, plus the hosted-page path and the single-use
         * ceremony token (5 min) that FinishPasskeyRegistration takes.
         *
         * @generated from rpc aiserver.v1.GrokBotService.BeginPasskeyRegistration
         */
        beginPasskeyRegistration: {
          name: "BeginPasskeyRegistration",
          I: BeginPasskeyRegistrationRequest,
          O: BeginPasskeyRegistrationResponse,
          kind: MethodKind.Unary
        },
        /**
         * Verifies the attestation against the ceremony's stored options and stores
         * the credential against the user the ceremony was opened for. The hosted
         * page has no session, so the ceremony token is the only credential
         * (route-level; no session) and is consumed here. FailedPrecondition when
         * the user already holds the maximum of five passkeys.
         *
         * @generated from rpc aiserver.v1.GrokBotService.FinishPasskeyRegistration
         */
        finishPasskeyRegistration: {
          name: "FinishPasskeyRegistration",
          I: FinishPasskeyRegistrationRequest,
          O: FinishPasskeyRegistrationResponse,
          kind: MethodKind.Unary
        },
        /**
         * Token-authenticated read of what the hosted page needs to run a ceremony:
         * which kind it is, the WebAuthn options, and for approvals the amount and
         * merchant the user is confirming. Does not consume the token; the matching
         * Finish* call does. Callable with only the ceremony token.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetPasskeyCeremony
         */
        getPasskeyCeremony: {
          name: "GetPasskeyCeremony",
          I: GetPasskeyCeremonyRequest,
          O: GetPasskeyCeremonyResponse,
          kind: MethodKind.Unary
        },
        /**
         * How a ceremony ended, for the caller that opened it. This is the one
         * completion signal whether the page ran in a hidden host, a visible window,
         * or the system browser. NotFound once the ceremony record has aged out.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetPasskeyCeremonyStatus
         */
        getPasskeyCeremonyStatus: {
          name: "GetPasskeyCeremonyStatus",
          I: GetPasskeyCeremonyStatusRequest,
          O: GetPasskeyCeremonyStatusResponse,
          kind: MethodKind.Unary
        },
        /**
         * The caller's enrolled, unrevoked passkeys. Display detail only: no public
         * key material crosses the wire.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListPasskeys
         */
        listPasskeys: {
          name: "ListPasskeys",
          I: ListPasskeysRequest,
          O: ListPasskeysResponse,
          kind: MethodKind.Unary
        },
        /**
         * Soft-revokes one of the caller's passkeys. NotFound when the credential is
         * not the caller's or is already revoked.
         *
         * @generated from rpc aiserver.v1.GrokBotService.RevokePasskey
         */
        revokePasskey: {
          name: "RevokePasskey",
          I: RevokePasskeyRequest,
          O: RevokePasskeyResponse,
          kind: MethodKind.Unary
        },
        /**
         * Opens a spend-approval ceremony for the agent's pending virtual card:
         * mints a single-use challenge (5 min) bound to that request_id and the
         * amount, currency and merchant on the server-side pending card, and returns
         * the WebAuthn request options built on it. NEEDS_ENROLLMENT flows never
         * reach here: the caller enrolls first, then begins again.
         *
         * @generated from rpc aiserver.v1.GrokBotService.BeginGrokBotSpendApproval
         */
        beginGrokBotSpendApproval: {
          name: "BeginGrokBotSpendApproval",
          I: BeginGrokBotSpendApprovalRequest,
          O: BeginGrokBotSpendApprovalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Verifies the assertion for the challenge and marks it asserted, so a
         * following ResolveGrokBotVirtualCardApproval carrying the challenge_id as
         * its attestation passes. Callable with a session or with only the ceremony
         * token (route-level). Consumes the token.
         *
         * @generated from rpc aiserver.v1.GrokBotService.FinishGrokBotSpendApprovalAssertion
         */
        finishGrokBotSpendApprovalAssertion: {
          name: "FinishGrokBotSpendApprovalAssertion",
          I: FinishGrokBotSpendApprovalAssertionRequest,
          O: FinishGrokBotSpendApprovalAssertionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Mints the daemon's durable user-computer credential, bound to the caller
         * and one machine_id. Session-authenticated; the desktop hands the raw
         * credential to the daemon over a 0o600 descriptor.
         *
         * @generated from rpc aiserver.v1.GrokBotService.IssueGrokBotUserComputerCredential
         */
        issueGrokBotUserComputerCredential: {
          name: "IssueGrokBotUserComputerCredential",
          I: IssueGrokBotUserComputerCredentialRequest,
          O: IssueGrokBotUserComputerCredentialResponse,
          kind: MethodKind.Unary
        },
        /**
         * Content-free dirty-bit stream: `connected` once, `notify` whenever the
         * machine's request queue has work, heartbeat frames while idle. Registers
         * the machine's presence on connect and refreshes it on every heartbeat;
         * bounded server-side lifetime, after which the client reconnects.
         *
         * @generated from rpc aiserver.v1.GrokBotService.WatchGrokBotUserComputerRequests
         */
        watchGrokBotUserComputerRequests: {
          name: "WatchGrokBotUserComputerRequests",
          I: WatchGrokBotUserComputerRequestsRequest,
          O: WatchGrokBotUserComputerRequestsEvent,
          kind: MethodKind.ServerStreaming
        },
        /**
         * Acks previously delivered request frames and returns the frames still
         * queued for the machine (at-least-once; an unacked frame is redelivered).
         *
         * @generated from rpc aiserver.v1.GrokBotService.PollGrokBotUserComputerRequests
         */
        pollGrokBotUserComputerRequests: {
          name: "PollGrokBotUserComputerRequests",
          I: PollGrokBotUserComputerRequestsRequest,
          O: PollGrokBotUserComputerRequestsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Appends a batch of response frames to their requests' response streams.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SubmitGrokBotUserComputerResponses
         */
        submitGrokBotUserComputerResponses: {
          name: "SubmitGrokBotUserComputerResponses",
          I: SubmitGrokBotUserComputerResponsesRequest,
          O: SubmitGrokBotUserComputerResponsesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotUserComputers
         */
        listGrokBotUserComputers: {
          name: "ListGrokBotUserComputers",
          I: ListGrokBotUserComputersRequest,
          O: ListGrokBotUserComputersResponse,
          kind: MethodKind.Unary
        },
        /**
         * Queues one request frame for a machine and streams its response frames
         * until the request completes; a client disconnect cancels the request on
         * the machine.
         *
         * @generated from rpc aiserver.v1.GrokBotService.OpenGrokBotUserComputerRequest
         */
        openGrokBotUserComputerRequest: {
          name: "OpenGrokBotUserComputerRequest",
          I: OpenGrokBotUserComputerRequestRequest,
          O: GrokBotUserComputerResponseFrame,
          kind: MethodKind.ServerStreaming
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CancelGrokBotUserComputerRequest
         */
        cancelGrokBotUserComputerRequest: {
          name: "CancelGrokBotUserComputerRequest",
          I: CancelGrokBotUserComputerRequestRequest,
          O: CancelGrokBotUserComputerRequestResponse,
          kind: MethodKind.Unary
        },
        /**
         * Ends a request_box_help handoff the caller's agent raised on the Temporal
         * turn harness: the owner handed the box back (or dismissed the request).
         * Signals the agent's grokBotTurnWorkflow to run the hidden hand-back turn
         * the box host runs. NotFound when the handoff is not the agent's pending
         * one (stale or already ended); Unavailable (retryable) when the workflow
         * could not be signalled. Box-hosted agents keep handing back through the
         * box gateway.
         *
         * @generated from rpc aiserver.v1.GrokBotService.EndGrokBotBoxHandoff
         */
        endGrokBotBoxHandoff: {
          name: "EndGrokBotBoxHandoff",
          I: EndGrokBotBoxHandoffRequest,
          O: EndGrokBotBoxHandoffResponse,
          kind: MethodKind.Unary
        },
        /**
         * Asks one of the caller's Temporal-hosted agents to take a member turn in
         * a room the caller's box hosts. The member runs the turn on its own
         * unified conversation and its sends come back to the host box as the
         * gateway command deliverRoomMemberTurnResult. Idempotent on (member, nonce).
         *
         * @generated from rpc aiserver.v1.GrokBotService.RequestGrokBotRoomMemberTurn
         */
        requestGrokBotRoomMemberTurn: {
          name: "RequestGrokBotRoomMemberTurn",
          I: RequestGrokBotRoomMemberTurnRequest,
          O: RequestGrokBotRoomMemberTurnResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CancelGrokBotRoomMemberTurn
         */
        cancelGrokBotRoomMemberTurn: {
          name: "CancelGrokBotRoomMemberTurn",
          I: CancelGrokBotRoomMemberTurnRequest,
          O: CancelGrokBotRoomMemberTurnResponse,
          kind: MethodKind.Unary
        },
        /**
         * A box-hosted member's reply to a room turn that a server-hosted room
         * asked it to take (the box gateway command runRoomMemberTurn). The caller
         * is the member's owner; the server checks that `nonce` names a member turn
         * it dispatched to one of the caller's rooms for this member and consumes
         * it, so a replayed or forged reply is rejected as unknown.
         *
         * @generated from rpc aiserver.v1.GrokBotService.DeliverGrokBotRoomMemberTurnResult
         */
        deliverGrokBotRoomMemberTurnResult: {
          name: "DeliverGrokBotRoomMemberTurnResult",
          I: DeliverGrokBotRoomMemberTurnResultRequest,
          O: DeliverGrokBotRoomMemberTurnResultResponse,
          kind: MethodKind.Unary
        },
        /**
         * Creates a server-hosted room (group chat) as a grok_bot_agent row of kind
         * ROOM on the Temporal harness, with its membership in grok_bot_room_member.
         * Members must be the caller's own non-deleted agents (either harness); a
         * room can never be a member. Deduped per caller on agent_id like
         * CreateGrokBotAgent. Hidden behind grok_bot_server_rooms.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotRoom
         */
        createGrokBotRoom: {
          name: "CreateGrokBotRoom",
          I: CreateGrokBotRoomRequest,
          O: CreateGrokBotRoomResponse,
          kind: MethodKind.Unary
        },
        /**
         * Replaces a server-hosted room's membership. Only the owner may call it;
         * a missing, deleted, or non-room id is not_found.
         *
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotRoomMembers
         */
        setGrokBotRoomMembers: {
          name: "SetGrokBotRoomMembers",
          I: SetGrokBotRoomMembersRequest,
          O: SetGrokBotRoomMembersResponse,
          kind: MethodKind.Unary
        },
        /**
         * Seats more people in a live group chat. Any seated person may call it; the
         * new people must be on the room's team, and an already-seated id is a no-op.
         * A room the caller is not seated in, an ordinary agent, or a room that is
         * not a live group chat (no people, or its creator outside
         * grok_bot_group_chats) is refused.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AddGrokBotRoomPeople
         */
        addGrokBotRoomPeople: {
          name: "AddGrokBotRoomPeople",
          I: AddGrokBotRoomPeopleRequest,
          O: AddGrokBotRoomPeopleResponse,
          kind: MethodKind.Unary
        },
        /**
         * The shared group chat for an Origin pull request a Grok bot authored: one
         * ROOM per pull request, owned by the bot's owner and seating the author
         * bot, created on first open and reused after. Access is the caller's
         * Origin read permission on the pull request, checked by reading the change
         * as the caller; nobody is invited. A pull request no Grok bot authored, or
         * whose bot cannot host a group chat, returns a typed `blocked` outcome.
         * NotFound when the caller cannot read the pull request. Behind
         * grok_bot_multiplayer for the caller and grok_bot_service_account_identity,
         * grok_bot_multiplayer and grok_bot_group_chats for the bot owner.
         *
         * @generated from rpc aiserver.v1.GrokBotService.EnsureGrokBotPullRequestChat
         */
        ensureGrokBotPullRequestChat: {
          name: "EnsureGrokBotPullRequestChat",
          I: EnsureGrokBotPullRequestChatRequest,
          O: EnsureGrokBotPullRequestChatResponse,
          kind: MethodKind.Unary
        },
        /**
         * The pull request chat's timeline and composer. Both re-check the caller's
         * gate, the bot owner's gates and the caller's Origin read of the pull
         * request on every call; NotFound when any of those refuses.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotPullRequestChatEntries
         */
        listGrokBotPullRequestChatEntries: {
          name: "ListGrokBotPullRequestChatEntries",
          I: ListGrokBotPullRequestChatEntriesRequest,
          O: ListGrokBotTranscriptEntriesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SendGrokBotPullRequestChatMessage
         */
        sendGrokBotPullRequestChatMessage: {
          name: "SendGrokBotPullRequestChatMessage",
          I: SendGrokBotPullRequestChatMessageRequest,
          O: SendGrokBotPullRequestChatMessageResponse,
          kind: MethodKind.Unary
        },
        /**
         * Where the agent stands (not connected / app created but not installed /
         * connected) plus the workspaces the caller's manager grant covers.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotSlackInstallState
         */
        getGrokBotSlackInstallState: {
          name: "GetGrokBotSlackInstallState",
          I: GetGrokBotSlackInstallStateRequest,
          O: GetGrokBotSlackInstallStateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Mints the Slack consent URL that connects a workspace for the caller. The
         * browser finishes on cursor.com, which claims the grant; the desktop then
         * polls GetGrokBotSlackInstallState until the workspace appears.
         *
         * @generated from rpc aiserver.v1.GrokBotService.StartGrokBotSlackConnect
         */
        startGrokBotSlackConnect: {
          name: "StartGrokBotSlackConnect",
          I: StartGrokBotSlackConnectRequest,
          O: StartGrokBotSlackConnectResponse,
          kind: MethodKind.Unary
        },
        /**
         * Creates (or, for an app that already exists, re-installs) the agent's
         * dedicated Slack app and persists its tokens on the agent row. Expected
         * user-recoverable states come back as typed outcomes, not errors.
         *
         * @generated from rpc aiserver.v1.GrokBotService.InstallGrokBotSlackApp
         */
        installGrokBotSlackApp: {
          name: "InstallGrokBotSlackApp",
          I: InstallGrokBotSlackAppRequest,
          O: InstallGrokBotSlackAppResponse,
          kind: MethodKind.Unary
        },
        /**
         * Updates an older Socket Mode app to the current Events API manifest, then
         * reinstalls it so Slack activates the new request URL.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ReinstallGrokBotSlackApp
         */
        reinstallGrokBotSlackApp: {
          name: "ReinstallGrokBotSlackApp",
          I: ReinstallGrokBotSlackAppRequest,
          O: ReinstallGrokBotSlackAppResponse,
          kind: MethodKind.Unary
        },
        /**
         * Deletes the agent's Slack app and forgets the linkage; an app already gone
         * from Slack counts as removed.
         *
         * @generated from rpc aiserver.v1.GrokBotService.UninstallGrokBotSlackApp
         */
        uninstallGrokBotSlackApp: {
          name: "UninstallGrokBotSlackApp",
          I: UninstallGrokBotSlackAppRequest,
          O: UninstallGrokBotSlackAppResponse,
          kind: MethodKind.Unary
        },
        /**
         * Global Grok Bot marketplace operator surface (Anytool internal service +
         * acting employee). These resources are not team-scoped.
         *
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotMarketplaceListingInternal
         */
        createGrokBotMarketplaceListingInternal: {
          name: "CreateGrokBotMarketplaceListingInternal",
          I: CreateGrokBotMarketplaceListingInternalRequest,
          O: GrokBotMarketplaceListing,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotMarketplaceListingsInternal
         */
        listGrokBotMarketplaceListingsInternal: {
          name: "ListGrokBotMarketplaceListingsInternal",
          I: ListGrokBotMarketplaceListingsInternalRequest,
          O: ListGrokBotMarketplaceListingsInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotMarketplaceListingInternal
         */
        getGrokBotMarketplaceListingInternal: {
          name: "GetGrokBotMarketplaceListingInternal",
          I: GetGrokBotMarketplaceListingInternalRequest,
          O: GrokBotMarketplaceListing,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotMarketplaceListingInternal
         */
        updateGrokBotMarketplaceListingInternal: {
          name: "UpdateGrokBotMarketplaceListingInternal",
          I: UpdateGrokBotMarketplaceListingInternalRequest,
          O: GrokBotMarketplaceListing,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotMarketplaceListingStatusInternal
         */
        setGrokBotMarketplaceListingStatusInternal: {
          name: "SetGrokBotMarketplaceListingStatusInternal",
          I: SetGrokBotMarketplaceListingStatusInternalRequest,
          O: GrokBotMarketplaceListing,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.PresignGrokBotMarketplaceImageUploadInternal
         */
        presignGrokBotMarketplaceImageUploadInternal: {
          name: "PresignGrokBotMarketplaceImageUploadInternal",
          I: PresignGrokBotMarketplaceImageUploadInternalRequest,
          O: PresignGrokBotMarketplaceImageUploadInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotMarketplaceCreatorInternal
         */
        createGrokBotMarketplaceCreatorInternal: {
          name: "CreateGrokBotMarketplaceCreatorInternal",
          I: CreateGrokBotMarketplaceCreatorInternalRequest,
          O: GrokBotMarketplaceCreator,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotMarketplaceCreatorsInternal
         */
        listGrokBotMarketplaceCreatorsInternal: {
          name: "ListGrokBotMarketplaceCreatorsInternal",
          I: ListGrokBotMarketplaceCreatorsInternalRequest,
          O: ListGrokBotMarketplaceCreatorsInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotMarketplaceCreatorInternal
         */
        getGrokBotMarketplaceCreatorInternal: {
          name: "GetGrokBotMarketplaceCreatorInternal",
          I: GetGrokBotMarketplaceCreatorInternalRequest,
          O: GrokBotMarketplaceCreator,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotMarketplaceCreatorInternal
         */
        updateGrokBotMarketplaceCreatorInternal: {
          name: "UpdateGrokBotMarketplaceCreatorInternal",
          I: UpdateGrokBotMarketplaceCreatorInternalRequest,
          O: GrokBotMarketplaceCreator,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.PresignGrokBotMarketplaceCreatorProfileUploadInternal
         */
        presignGrokBotMarketplaceCreatorProfileUploadInternal: {
          name: "PresignGrokBotMarketplaceCreatorProfileUploadInternal",
          I: PresignGrokBotMarketplaceCreatorProfileUploadInternalRequest,
          O: PresignGrokBotMarketplaceImageUploadInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.PreviewGrokBotMarketplaceSourceInternal
         */
        previewGrokBotMarketplaceSourceInternal: {
          name: "PreviewGrokBotMarketplaceSourceInternal",
          I: PreviewGrokBotMarketplaceSourceInternalRequest,
          O: PreviewGrokBotMarketplaceSourceInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.CreateGrokBotMarketplaceCategoryInternal
         */
        createGrokBotMarketplaceCategoryInternal: {
          name: "CreateGrokBotMarketplaceCategoryInternal",
          I: CreateGrokBotMarketplaceCategoryInternalRequest,
          O: GrokBotMarketplaceCategory,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotMarketplaceCategoriesInternal
         */
        listGrokBotMarketplaceCategoriesInternal: {
          name: "ListGrokBotMarketplaceCategoriesInternal",
          I: ListGrokBotMarketplaceCategoriesInternalRequest,
          O: ListGrokBotMarketplaceCategoriesInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotMarketplaceCategoryInternal
         */
        getGrokBotMarketplaceCategoryInternal: {
          name: "GetGrokBotMarketplaceCategoryInternal",
          I: GetGrokBotMarketplaceCategoryInternalRequest,
          O: GrokBotMarketplaceCategory,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotMarketplaceCategoryInternal
         */
        updateGrokBotMarketplaceCategoryInternal: {
          name: "UpdateGrokBotMarketplaceCategoryInternal",
          I: UpdateGrokBotMarketplaceCategoryInternalRequest,
          O: GrokBotMarketplaceCategory,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotMarketplaceListingTemplateInternal
         */
        getGrokBotMarketplaceListingTemplateInternal: {
          name: "GetGrokBotMarketplaceListingTemplateInternal",
          I: GetGrokBotMarketplaceListingTemplateInternalRequest,
          O: GetGrokBotMarketplaceListingTemplateInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotMarketplaceListingSourceTemplateInternal
         */
        getGrokBotMarketplaceListingSourceTemplateInternal: {
          name: "GetGrokBotMarketplaceListingSourceTemplateInternal",
          I: GetGrokBotMarketplaceListingSourceTemplateInternalRequest,
          O: GetGrokBotMarketplaceListingSourceTemplateInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotMarketplaceListingInternal
         */
        deleteGrokBotMarketplaceListingInternal: {
          name: "DeleteGrokBotMarketplaceListingInternal",
          I: DeleteGrokBotMarketplaceListingInternalRequest,
          O: DeleteGrokBotMarketplaceListingInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.UpdateGrokBotMarketplaceListingTemplateInternal
         */
        updateGrokBotMarketplaceListingTemplateInternal: {
          name: "UpdateGrokBotMarketplaceListingTemplateInternal",
          I: UpdateGrokBotMarketplaceListingTemplateInternalRequest,
          O: GetGrokBotMarketplaceListingTemplateInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Any template, listed or not. Anytool internal service + acting employee.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotTemplateForOperatorInternal
         */
        getGrokBotTemplateForOperatorInternal: {
          name: "GetGrokBotTemplateForOperatorInternal",
          I: GetGrokBotTemplateForOperatorInternalRequest,
          O: GrokBotTemplateOperatorView,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.SetGrokBotTemplateCreatorAttributionInternal
         */
        setGrokBotTemplateCreatorAttributionInternal: {
          name: "SetGrokBotTemplateCreatorAttributionInternal",
          I: SetGrokBotTemplateCreatorAttributionInternalRequest,
          O: GrokBotTemplateOperatorView,
          kind: MethodKind.Unary
        },
        /**
         * BOX → Temporal harness migration operator surface (Anytool internal
         * service + acting employee), read for one owner: rollout eligibility, the
         * owner's migration hold, every live agent's harness, and recent passes.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotHarnessMigrationStatusInternal
         */
        getGrokBotHarnessMigrationStatusInternal: {
          name: "GetGrokBotHarnessMigrationStatusInternal",
          I: GetGrokBotHarnessMigrationStatusInternalRequest,
          O: GetGrokBotHarnessMigrationStatusInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Break-glass: drops the owner's migration hold whoever leased it, so
         * BOX-bound commands stop being refused. A pass still running observes
         * hold_lost on its next fence read and defers instead of flipping.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ClearGrokBotHarnessMigrationHoldInternal
         */
        clearGrokBotHarnessMigrationHoldInternal: {
          name: "ClearGrokBotHarnessMigrationHoldInternal",
          I: ClearGrokBotHarnessMigrationHoldInternalRequest,
          O: ClearGrokBotHarnessMigrationHoldInternalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Preview one page of an internal Primary Bot migration cohort for Anytool.
         * Team IDs and allowlisted email suffixes use OR semantics. Read-only:
         * previewing never writes. Pages are keyset slices ordered by user id.
         * The signed preview proof covers only the migratable owners returned.
         *
         * @generated from rpc aiserver.v1.GrokBotService.PreviewInternalPrimaryBotMigration
         */
        previewInternalPrimaryBotMigration: {
          name: "PreviewInternalPrimaryBotMigration",
          I: PreviewInternalPrimaryBotMigrationRequest,
          O: PreviewInternalPrimaryBotMigrationResponse,
          kind: MethodKind.Unary
        },
        /**
         * Execute Primary Bot migration for one confirmed batch from a preview page.
         * Revalidates filters, primary state, and live SYSTEM bot per owner;
         * catches per-user failures without aborting the batch. Does not scan or
         * write owners outside selected_user_ids.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ExecuteInternalPrimaryBotMigration
         */
        executeInternalPrimaryBotMigration: {
          name: "ExecuteInternalPrimaryBotMigration",
          I: ExecuteInternalPrimaryBotMigrationRequest,
          O: ExecuteInternalPrimaryBotMigrationResponse,
          kind: MethodKind.Unary
        },
        /**
         * The caller's user-form vault: NON-SECRET values the user already submitted
         * through a request_user_form once, stored per user so the desktop card and
         * the mobile sheet can prefill later forms on any device. A dedicated store
         * on purpose — never part of the general user-settings blob, never written
         * to the box filesystem (where an agent could read it), and never returned
         * to a model: only the Sand host reads it, to serve its own native form UIs.
         * Secrets (password/otp, secret-flagged, payment/government-ID shapes) are
         * refused at the host save gate and must never appear here.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotUserFormVaultEntries
         */
        listGrokBotUserFormVaultEntries: {
          name: "ListGrokBotUserFormVaultEntries",
          I: ListGrokBotUserFormVaultEntriesRequest,
          O: ListGrokBotUserFormVaultEntriesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Insert or replace one entry by its caller-minted entry_id (the host owns
         * add-vs-overwrite; the backend only bounds and stores).
         *
         * @generated from rpc aiserver.v1.GrokBotService.UpsertGrokBotUserFormVaultEntry
         */
        upsertGrokBotUserFormVaultEntry: {
          name: "UpsertGrokBotUserFormVaultEntry",
          I: UpsertGrokBotUserFormVaultEntryRequest,
          O: UpsertGrokBotUserFormVaultEntryResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.DeleteGrokBotUserFormVaultEntry
         */
        deleteGrokBotUserFormVaultEntry: {
          name: "DeleteGrokBotUserFormVaultEntry",
          I: DeleteGrokBotUserFormVaultEntryRequest,
          O: DeleteGrokBotUserFormVaultEntryResponse,
          kind: MethodKind.Unary
        },
        /**
         * The keys-only extras catalog the host may show a MODEL so it can reuse an
         * existing extra_key on a new form. Deliberately a separate RPC and message
         * with no value/label/timestamp fields at all — the full-entry list above
         * stays host-UI-only, and this one is physically incapable of leaking a
         * stored value.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotUserFormVaultKeys
         */
        listGrokBotUserFormVaultKeys: {
          name: "ListGrokBotUserFormVaultKeys",
          I: ListGrokBotUserFormVaultKeysRequest,
          O: ListGrokBotUserFormVaultKeysResponse,
          kind: MethodKind.Unary
        },
        /**
         * BOX sync check against the whole-user Sand `workflows/` snapshot that
         * Temporal turn-start reads. The caller is the owner: authId comes from
         * the bearer token, never the request. The box sends only the fingerprint
         * of its disk walk; a matching fingerprint leaves the snapshot alone and a
         * different one invalidates it. The box never writes the snapshot; only
         * the server turn does.
         *
         * @generated from rpc aiserver.v1.GrokBotService.PublishGrokBotUserSkillsSnapshot
         */
        publishGrokBotUserSkillsSnapshot: {
          name: "PublishGrokBotUserSkillsSnapshot",
          I: PublishGrokBotUserSkillsSnapshotRequest,
          O: PublishGrokBotUserSkillsSnapshotResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.InvalidateGrokBotUserSkillsCache
         */
        invalidateGrokBotUserSkillsCache: {
          name: "InvalidateGrokBotUserSkillsCache",
          I: InvalidateGrokBotUserSkillsCacheRequest,
          O: InvalidateGrokBotUserSkillsCacheResponse,
          kind: MethodKind.Unary
        },
        /**
         * The server copies of the caller's SHARED user memory tier, one
         * single-writer shard per agent, so the in-box Sand host can overlay the
         * shards Temporal-harness agents wrote and push its own BOX-harness agents'
         * shards. The agent's own (agent-scope) memory is not served here: a harness
         * switch backfills it once from the box instead.
         *
         * @generated from rpc aiserver.v1.GrokBotService.ListGrokBotMemoryShards
         */
        listGrokBotMemoryShards: {
          name: "ListGrokBotMemoryShards",
          I: ListGrokBotMemoryShardsRequest,
          O: ListGrokBotMemoryShardsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Replaces a BOX-harness agent's own user shard with the box folder (the box
         * is that agent's single writer); refused for a TEMPORAL-harness agent, whose
         * turns own the row.
         *
         * @generated from rpc aiserver.v1.GrokBotService.PutGrokBotMemoryShard
         */
        putGrokBotMemoryShard: {
          name: "PutGrokBotMemoryShard",
          I: PutGrokBotMemoryShardRequest,
          O: PutGrokBotMemoryShardResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin surface for per-session Grok Bot boxes, token-gated like the owner-box Admin* RPCs; reads locate/probe only (never wake or create), and every RPC returns box metadata only.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminListGrokBotSessionBoxes
         */
        adminListGrokBotSessionBoxes: {
          name: "AdminListGrokBotSessionBoxes",
          I: AdminListGrokBotSessionBoxesRequest,
          O: AdminListGrokBotSessionBoxesResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetGrokBotSessionBox
         */
        adminGetGrokBotSessionBox: {
          name: "AdminGetGrokBotSessionBox",
          I: AdminGetGrokBotSessionBoxRequest,
          O: AdminGetGrokBotSessionBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * The session-box reaper's per-row teardown for one session now, under its lease; dry_run observes only (the reaper's config floor can also force it).
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminReapGrokBotSessionBoxNow
         */
        adminReapGrokBotSessionBoxNow: {
          name: "AdminReapGrokBotSessionBoxNow",
          I: AdminReapGrokBotSessionBoxNowRequest,
          O: AdminReapGrokBotSessionBoxNowResponse,
          kind: MethodKind.Unary
        },
        /**
         * The owner-box hibernate flow pointed at the session box.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminHibernateGrokBotSessionBox
         */
        adminHibernateGrokBotSessionBox: {
          name: "AdminHibernateGrokBotSessionBox",
          I: AdminHibernateGrokBotSessionBoxRequest,
          O: AdminHibernateGrokBotSessionBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * Revoke the session box's credential and delete its pod(s), keeping the durable store, then clear the stamp so the next turn recreates the box; refused under a fresh reap lease.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminForceDeleteGrokBotSessionBox
         */
        adminForceDeleteGrokBotSessionBox: {
          name: "AdminForceDeleteGrokBotSessionBox",
          I: AdminForceDeleteGrokBotSessionBoxRequest,
          O: AdminForceDeleteGrokBotSessionBoxResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin read of one TEMPORAL-harness agent's server-held definition:
         * identity and team sharing, sessions, room seats, template lineage, memory
         * shards, routines, recipe skills, and connector settings. Reads only the
         * server tables and blobs the Temporal turn itself reads; box-resident state
         * is never fetched, so a facet the server does not hold reads as empty.
         * Token-gated like the other Admin* RPCs.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetGrokBotAgentDefinition
         */
        adminGetGrokBotAgentDefinition: {
          name: "AdminGetGrokBotAgentDefinition",
          I: AdminGetGrokBotAgentDefinitionRequest,
          O: AdminGetGrokBotAgentDefinitionResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin listing of one team's shared (TEAM-visibility) Grok Bots
         * with per-bot multiplayer counts: sessions by kind, provisioned session
         * boxes, routines, Slack install state, and the owner-pinned multiplayer
         * gate. Identity columns and counts only; never transcript, memory, or
         * routine contents. Token-gated like the other Admin* RPCs.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminListGrokBotTeamAgents
         */
        adminListGrokBotTeamAgents: {
          name: "AdminListGrokBotTeamAgents",
          I: AdminListGrokBotTeamAgentsRequest,
          O: AdminListGrokBotTeamAgentsResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin delete of one shared Grok Bot through the product's own
         * delete path, acting as the bot's owner: harness-aware stop, Slack app
         * uninstall, tombstone. Refused unless the row is a live TEAM-visibility bot
         * of the named team.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminDeleteGrokBotAgent
         */
        adminDeleteGrokBotAgent: {
          name: "AdminDeleteGrokBotAgent",
          I: AdminDeleteGrokBotAgentRequest,
          O: AdminDeleteGrokBotAgentResponse,
          kind: MethodKind.Unary
        },
        /**
         * Retries the Slack app delete for a tombstoned shared bot whose app the
         * delete could not remove (the owner's Slack grant was missing or dead).
         * Refused unless the tombstone belongs to the named team and still names an app.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminRetryGrokBotSlackAppRemoval
         */
        adminRetryGrokBotSlackAppRemoval: {
          name: "AdminRetryGrokBotSlackAppRemoval",
          I: AdminRetryGrokBotSlackAppRemovalRequest,
          O: AdminRetryGrokBotSlackAppRemovalResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin read of what one shared (TEAM-visibility) Grok Bot shares
         * across its sessions and participants: who reaches the bot (each live
         * session with the Cursor user behind it and their current team standing),
         * the agent-scope memory shard every session reads and writes, the bot
         * marketplace's plugins and connectors, routines with their creators and
         * firing sessions, recipe skills, and which sessions share a box. Refused
         * unless the row is a live TEAM-visibility bot of the named team; content is
         * read only for a TEMPORAL-harness bot. Token-gated like the other Admin*
         * RPCs.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminGetGrokBotTeamAgentSharedState
         */
        adminGetGrokBotTeamAgentSharedState: {
          name: "AdminGetGrokBotTeamAgentSharedState",
          I: AdminGetGrokBotTeamAgentSharedStateRequest,
          O: AdminGetGrokBotTeamAgentSharedStateResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin inspection of one user's Grok Bot email. Every inbox the
         * user holds, soft-deleted ones included, with per-inbox message counts,
         * plus the two facts that decide whether mail works for them at all: the
         * grok_bot_agent_mail gate evaluated for that user and the deployment's
         * configured sending domain. Token-gated like the other Admin* RPCs.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminListGrokBotEmailInboxes
         */
        adminListGrokBotEmailInboxes: {
          name: "AdminListGrokBotEmailInboxes",
          I: AdminListGrokBotEmailInboxesRequest,
          O: AdminListGrokBotEmailInboxesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin listing of one user's grok_bot_email_message rows, newest
         * first, keyed on (occurred_at, id). Metadata only: routing, delivery,
         * authentication and indexing facts, addressing and subject. Bodies live in
         * turbopuffer and are never returned here.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminListGrokBotEmailMessages
         */
        adminListGrokBotEmailMessages: {
          name: "AdminListGrokBotEmailMessages",
          I: AdminListGrokBotEmailMessagesRequest,
          O: AdminListGrokBotEmailMessagesResponse,
          kind: MethodKind.Unary
        },
        /**
         * Anytool admin test send from one of the user's inboxes, through the same
         * send path the product runs (inbox ownership, sending domain, mail gate
         * evaluated for that user). The recipient must be one address on an
         * internal domain allowlist; this proves the pipeline, nothing more.
         *
         * @generated from rpc aiserver.v1.GrokBotService.AdminSendGrokBotTestEmail
         */
        adminSendGrokBotTestEmail: {
          name: "AdminSendGrokBotTestEmail",
          I: AdminSendGrokBotTestEmailRequest,
          O: AdminSendGrokBotTestEmailResponse,
          kind: MethodKind.Unary
        },
        /**
         * The caller's effective Sand network policy — the same team/group
         * `sandNetworkControls` resolution that is stamped on the caller's box pod
         * and enforced box-side by anygress. Clients that carry box traffic off the
         * box (the egress-tunnel exit on desktop and mobile) must fetch this and
         * enforce it locally, since relayed streams exit from the user's device and
         * never pass through anygress.
         *
         * @generated from rpc aiserver.v1.GrokBotService.GetGrokBotEgressPolicy
         */
        getGrokBotEgressPolicy: {
          name: "GetGrokBotEgressPolicy",
          I: GetGrokBotEgressPolicyRequest,
          O: GetGrokBotEgressPolicyResponse,
          kind: MethodKind.Unary
        },
        /**
         * The Sand voice call's server-side harness (admitGrokBotTurnRpc; gated on
         * sand_voice_call). Session returns the realtime session.update body; Tool
         * runs one registered tool for a call in progress.
         *
         * @generated from rpc aiserver.v1.GrokBotService.VoiceCallHarnessSession
         */
        voiceCallHarnessSession: {
          name: "VoiceCallHarnessSession",
          I: VoiceCallHarnessSessionRequest,
          O: VoiceCallHarnessSessionResponse,
          kind: MethodKind.Unary
        },
        /**
         * @generated from rpc aiserver.v1.GrokBotService.VoiceCallHarnessTool
         */
        voiceCallHarnessTool: {
          name: "VoiceCallHarnessTool",
          I: VoiceCallHarnessToolRequest,
          O: VoiceCallHarnessToolResponse,
          kind: MethodKind.Unary
        }
      }
    };
  }
});
