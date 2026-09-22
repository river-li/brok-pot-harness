/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/control_service_connect.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_control_service_pb();
init_esm();
init_utils_pb();
var ControlService = {
  typeName: "agent.v1.ControlService",
  methods: {
    /**
     * @generated from rpc agent.v1.ControlService.Ping
     */
    ping: {
      name: "Ping",
      I: PingRequest,
      O: PingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Capabilities supported  (e.g. computer use)
     *
     * @generated from rpc agent.v1.ControlService.GetCapabilities
     */
    getCapabilities: {
      name: "GetCapabilities",
      I: GetCapabilitiesRequest,
      O: GetCapabilitiesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Spawn
     *
     * @generated from rpc agent.v1.ControlService.Exec
     */
    exec: {
      name: "Exec",
      I: ExecRequest,
      O: ExecResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Filesystem browsing (arbitrary paths).
     *
     * @generated from rpc agent.v1.ControlService.ListDirectory
     */
    listDirectory: {
      name: "ListDirectory",
      I: ListDirectoryRequest,
      O: ListDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * File read / write (arbitrary filesystem paths).
     *
     * @generated from rpc agent.v1.ControlService.ReadTextFile
     */
    readTextFile: {
      name: "ReadTextFile",
      I: ReadTextFileRequest,
      O: ReadTextFileResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.WriteTextFile
     */
    writeTextFile: {
      name: "WriteTextFile",
      I: WriteTextFileRequest,
      O: WriteTextFileResponse,
      kind: MethodKind.Unary
    },
    /**
     * Binary file read / write
     *
     * @generated from rpc agent.v1.ControlService.ReadBinaryFile
     */
    readBinaryFile: {
      name: "ReadBinaryFile",
      I: ReadBinaryFileRequest2,
      O: ReadBinaryFileResponse2,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.WriteBinaryFile
     */
    writeBinaryFile: {
      name: "WriteBinaryFile",
      I: WriteBinaryFileRequest,
      O: WriteBinaryFileResponse,
      kind: MethodKind.Unary
    },
    /**
     * Workspace-contained streaming file export for user-initiated saves.
     *
     * @generated from rpc agent.v1.ControlService.ExportFile
     */
    exportFile: {
      name: "ExportFile",
      I: ExportFileRequest,
      O: ExportFileResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Git
     *
     * @generated from rpc agent.v1.ControlService.GetDiff
     */
    getDiff: {
      name: "GetDiff",
      I: GetDiffRequest,
      O: GetDiffResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.BatchGetDiff
     */
    batchGetDiff: {
      name: "BatchGetDiff",
      I: BatchGetDiffRequest,
      O: BatchGetDiffResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.GetWorkspaceChangesHash
     */
    getWorkspaceChangesHash: {
      name: "GetWorkspaceChangesHash",
      I: GetWorkspaceChangesHashRequest,
      O: GetWorkspaceChangesHashResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.RefreshGithubAccessToken
     */
    refreshGithubAccessToken: {
      name: "RefreshGithubAccessToken",
      I: RefreshGithubAccessTokenRequest,
      O: RefreshGithubAccessTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Remote access
     *
     * @generated from rpc agent.v1.ControlService.WarmRemoteAccessServer
     */
    warmRemoteAccessServer: {
      name: "WarmRemoteAccessServer",
      I: WarmRemoteAccessServerRequest,
      O: WarmRemoteAccessServerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Artifact uploads
     *
     * @generated from rpc agent.v1.ControlService.ListArtifacts
     */
    listArtifacts: {
      name: "ListArtifacts",
      I: ListArtifactsRequest,
      O: ListArtifactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.UploadArtifacts
     */
    uploadArtifacts: {
      name: "UploadArtifacts",
      I: UploadArtifactsRequest,
      O: UploadArtifactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.PersistArtifactsToAgentStore
     */
    persistArtifactsToAgentStore: {
      name: "PersistArtifactsToAgentStore",
      I: PersistArtifactsToAgentStoreRequest,
      O: PersistArtifactsToAgentStoreResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.PersistArtifactsToParentStore
     */
    persistArtifactsToParentStore: {
      name: "PersistArtifactsToParentStore",
      I: PersistArtifactsToParentStoreRequest,
      O: PersistArtifactsToParentStoreResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.RestoreArtifacts
     */
    restoreArtifacts: {
      name: "RestoreArtifacts",
      I: RestoreArtifactsRequest,
      O: RestoreArtifactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc agent.v1.ControlService.GetMcpRefreshTokens
     */
    getMcpRefreshTokens: {
      name: "GetMcpRefreshTokens",
      I: GetMcpRefreshTokensRequest,
      O: GetMcpRefreshTokensResponse,
      kind: MethodKind.Unary
    },
    /**
     * Download (but do not start) the cursor server for a given commit.
     * This is used to pre-download the cursor server binary so that subsequent
     * WarmRemoteAccessServer calls are faster.
     *
     * @generated from rpc agent.v1.ControlService.DownloadCursorServer
     */
    downloadCursorServer: {
      name: "DownloadCursorServer",
      I: DownloadCursorServerRequest,
      O: DownloadCursorServerResponse,
      kind: MethodKind.Unary
    },
    /**
     * Update the exec-daemon's environment variables for subsequent process spawns.
     * This does NOT affect already-running processes.
     *
     * @generated from rpc agent.v1.ControlService.UpdateEnvironmentVariables
     */
    updateEnvironmentVariables: {
      name: "UpdateEnvironmentVariables",
      I: UpdateEnvironmentVariablesRequest,
      O: UpdateEnvironmentVariablesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Per-scope secrets for shell injection: the daemon sets them on exactly the
     * shell commands whose ShellArgs.secret_scope_id matches (a Grok Bot's agent
     * id), never on the daemon-wide environment, so a bot's values are absent
     * from every other command's environment and shell snapshot by default. The
     * scope id is caller-asserted under the daemon's shared bearer token, so
     * this is not a boundary against a hostile caller that already holds that
     * token (such a caller can also Exec or rewrite the daemon environment); the
     * box is one trust domain. With `secrets` unset the call only reports the
     * revision the daemon holds; with it set the daemon replaces the scope's
     * values at `revision`, ignoring a push older than what it already holds.
     * Revisions come from the server; values live in daemon memory only.
     *
     * @generated from rpc agent.v1.ControlService.SyncScopedSecrets
     */
    syncScopedSecrets: {
      name: "SyncScopedSecrets",
      I: SyncScopedSecretsRequest,
      O: SyncScopedSecretsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reload agent skills from disk (~/.cursor/skills/, workspace skills, etc.).
     * Call after writing new SKILL.md files so the next agent turn sees them.
     *
     * @generated from rpc agent.v1.ControlService.ReloadAgentSkills
     */
    reloadAgentSkills: {
      name: "ReloadAgentSkills",
      I: ReloadAgentSkillsRequest,
      O: ReloadAgentSkillsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reload plugin-backed skills/subagents after the cloud harness materializes
     * plugin files onto disk. Empty reload_targets means "reload everything".
     *
     * @generated from rpc agent.v1.ControlService.ReloadPlugins
     */
    reloadPlugins: {
      name: "ReloadPlugins",
      I: ReloadPluginsRequest,
      O: ReloadPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Download a plugin artifact tarball from a presigned URL and extract it on the VM.
     *
     * @generated from rpc agent.v1.ControlService.InstallPluginArtifact
     */
    installPluginArtifact: {
      name: "InstallPluginArtifact",
      I: InstallPluginArtifactRequest,
      O: InstallPluginArtifactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Load (and optionally reconcile) session MCP servers on the daemon from a
     * desired MCP config. The same operation the private-worker bridge performs
     * in-process at claim time, exposed for co-located callers (e.g. the Sand
     * in-box host) whose MCP config changes while the daemon runs. Servers are
     * registered lazily (child processes spawn on first use); servers already
     * registered with the same config are left untouched.
     *
     * @generated from rpc agent.v1.ControlService.LoadMcpServers
     */
    loadMcpServers: {
      name: "LoadMcpServers",
      I: LoadMcpServersRequest,
      O: LoadMcpServersResponse,
      kind: MethodKind.Unary
    },
    /**
     * In-memory per-desktop input lease: who may drive X11 on this VM. A human
     * acquire preempts a computer-use agent and aborts its in-flight input;
     * stamped ComputerUseArgs.desktop_lease_actor_id actions are rejected while
     * another actor holds the desktop. Authoritative on this daemon only.
     *
     * @generated from rpc agent.v1.ControlService.DesktopLease
     */
    desktopLease: {
      name: "DesktopLease",
      I: DesktopLeaseRequest,
      O: DesktopLeaseResponse,
      kind: MethodKind.Unary
    },
    /**
     * Memory / CPU / disk of the machine this daemon runs on: the current 5 s
     * sample plus the samples since the caller's `cursor`, out of a 15-minute
     * ring buffer. FailedPrecondition when the daemon runs without
     * --machine-resources-enabled; daemons that predate the RPC answer
     * Unimplemented.
     *
     * @generated from rpc agent.v1.ControlService.GetResourceUsage
     */
    getResourceUsage: {
      name: "GetResourceUsage",
      I: GetResourceUsageRequest,
      O: GetResourceUsageResponse,
      kind: MethodKind.Unary
    }
  }
};

