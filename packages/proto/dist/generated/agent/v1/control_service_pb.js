/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/control_service_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage140, __protoMessage3133, EntryType, BatchGetDiffErrorKind, ArtifactUploadStatus, ArtifactPathErrorKind, ArtifactRootKind, ArtifactUploadDispatchStatus, PersistArtifactToAgentStoreStatus, ArtifactRestoreStatus, DesktopLeaseActorKind, DesktopLeaseStatus, ResourceScope, ResourcePressure, PingRequest, PingResponse, GetCapabilitiesRequest, GetCapabilitiesResponse, ReloadAgentSkillsRequest, ReloadAgentSkillsResponse, ReloadPluginsRequest, ReloadPluginsResponse, ExecRequest, ExecResponse, StdoutEvent, StderrEvent, ExitEvent, ListDirectoryRequest, ListDirectoryResponse, DirectoryEntry, ReadTextFileRequest, ReadTextFileResponse, WriteTextFileRequest, WriteTextFileResponse, ReadBinaryFileRequest2, ReadBinaryFileResponse2, ExportFileRequest, ExportFileMetadata, ExportFileResponse, WriteBinaryFileRequest, WriteBinaryFileResponse, GetWorkspaceChangesHashRequest, GetWorkspaceChangesHashResponse, BatchGetDiffRequest, BatchGetDiffItem, BatchGetDiffResponse, BatchGetDiffResult, BatchGetDiffUnchanged, BatchGetDiffError, RefreshGithubAccessTokenRequest, RefreshGithubAccessTokenResponse, WarmRemoteAccessServerRequest, WarmRemoteAccessServerResponse, ListArtifactsRequest, ArtifactUploadMetadata, ArtifactPathError, ListArtifactsResponse, UploadArtifactsRequest, ArtifactUploadInstruction, ArtifactUploadDispatchResult, UploadArtifactsResponse, PersistArtifactToAgentStoreInstruction, PersistArtifactsToAgentStoreRequest, PersistArtifactToAgentStoreResult, PersistArtifactsToAgentStoreResponse, PersistArtifactsToParentStoreRequest, PersistArtifactsToParentStoreResponse, RestoreArtifactInstruction, RestoreArtifactResult, RestoreArtifactsRequest, RestoreArtifactsResponse, GetMcpRefreshTokensRequest, GetMcpRefreshTokensResponse, UpdateEnvironmentVariablesRequest, RunScopedOverlay, UpdateEnvironmentVariablesResponse, ScopedSecretValues, SyncScopedSecretsRequest, SyncScopedSecretsResponse, DownloadCursorServerRequest, DownloadCursorServerResponse, InstallPluginArtifactRequest, InstallPluginArtifactResponse, LoadMcpServersRequest, LoadMcpServersResponse, DesktopLeaseAcquire, DesktopLeaseRelease, DesktopLeaseGetState, DesktopLeaseRequest, DesktopLeaseOwner, DesktopLeaseResponse, ResourceLimits, ResourceSample, GetResourceUsageRequest, GetResourceUsageResponse;
var init_control_service_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/control_service_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_compact();
    __protoPackage140 = "agent.v1.";
    __protoMessage3133 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage140;
      }
    };
    EntryType = /* @__PURE__ */ enumType(proto3, __protoPackage140, "EntryType", [[0, "UNSPECIFIED"], [1, "FILE"], [2, "DIRECTORY"], [3, "SYMLINK"]], 1);
    BatchGetDiffErrorKind = /* @__PURE__ */ enumType(proto3, __protoPackage140, "BatchGetDiffErrorKind", [[0, "UNSPECIFIED"], [1, "FETCH_FAILED"], [2, "DIFF_FAILED"], [3, "UNAUTHENTICATED"], [4, "NOT_FOUND"], [5, "INTERNAL"]], 1);
    ArtifactUploadStatus = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ArtifactUploadStatus", [[0, "UNSPECIFIED"], [1, "NOT_STARTED"], [2, "IN_PROGRESS"], [3, "COMPLETED"], [4, "FAILED"]], 1);
    ArtifactPathErrorKind = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ArtifactPathErrorKind", [[0, "UNSPECIFIED"], [1, "MISSING"], [2, "PERMISSION"], [3, "NOT_A_FILE"], [4, "INVALID_PATH"], [5, "UNKNOWN"]], 1);
    ArtifactRootKind = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ArtifactRootKind", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "AGENT_STORE_BACKED"]], 1);
    ArtifactUploadDispatchStatus = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ArtifactUploadDispatchStatus", [[0, "UNSPECIFIED"], [1, "ACCEPTED"], [2, "REJECTED"], [3, "SKIPPED_ALREADY_IN_PROGRESS"]], 1);
    PersistArtifactToAgentStoreStatus = /* @__PURE__ */ enumType(proto3, __protoPackage140, "PersistArtifactToAgentStoreStatus", [[0, "UNSPECIFIED"], [1, "PERSISTED"], [2, "REJECTED"]], 1);
    ArtifactRestoreStatus = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ArtifactRestoreStatus", [[0, "UNSPECIFIED"], [1, "RESTORED"], [2, "SKIPPED_ALREADY_EXISTS"], [3, "REJECTED"]], 1);
    DesktopLeaseActorKind = /* @__PURE__ */ enumType(proto3, __protoPackage140, "DesktopLeaseActorKind", [[0, "UNSPECIFIED"], [1, "HUMAN"], [2, "AGENT"]], 1);
    DesktopLeaseStatus = /* @__PURE__ */ enumType(proto3, __protoPackage140, "DesktopLeaseStatus", [[0, "UNSPECIFIED"], [1, "OK"], [2, "BUSY"], [3, "INVALID_REQUEST"]], 1);
    ResourceScope = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ResourceScope", [[0, "UNSPECIFIED"], [1, "POD_VM"], [2, "CONTAINER"], [3, "HOST"]], 1);
    ResourcePressure = /* @__PURE__ */ enumType(proto3, __protoPackage140, "ResourcePressure", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "HIGH"]], 1);
    PingRequest = class _PingRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PingRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PingRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PingRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PingRequest, a, b2);
      }
      static $() {
        return ["PingRequest"];
      }
    };
    PingResponse = class _PingResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PingResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PingResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PingResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PingResponse, a, b2);
      }
      static $() {
        return ["PingResponse"];
      }
    };
    GetCapabilitiesRequest = class _GetCapabilitiesRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetCapabilitiesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetCapabilitiesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetCapabilitiesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetCapabilitiesRequest, a, b2);
      }
      static $() {
        return ["GetCapabilitiesRequest"];
      }
    };
    GetCapabilitiesResponse = class _GetCapabilitiesResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetCapabilitiesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetCapabilitiesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetCapabilitiesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetCapabilitiesResponse, a, b2);
      }
      static $() {
        return ["GetCapabilitiesResponse|1 computer_use_supported 8?|2 install_plugin_artifact_supported 8?"];
      }
    };
    ReloadAgentSkillsRequest = class _ReloadAgentSkillsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReloadAgentSkillsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReloadAgentSkillsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReloadAgentSkillsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReloadAgentSkillsRequest, a, b2);
      }
      static $() {
        return ["ReloadAgentSkillsRequest"];
      }
    };
    ReloadAgentSkillsResponse = class _ReloadAgentSkillsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReloadAgentSkillsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReloadAgentSkillsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReloadAgentSkillsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReloadAgentSkillsResponse, a, b2);
      }
      static $() {
        return ["ReloadAgentSkillsResponse"];
      }
    };
    ReloadPluginsRequest = class _ReloadPluginsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.reloadTargets = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReloadPluginsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReloadPluginsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReloadPluginsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReloadPluginsRequest, a, b2);
      }
      static $() {
        return ["ReloadPluginsRequest|1 reload_targets 9*"];
      }
    };
    ReloadPluginsResponse = class _ReloadPluginsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReloadPluginsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReloadPluginsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReloadPluginsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReloadPluginsResponse, a, b2);
      }
      static $() {
        return ["ReloadPluginsResponse"];
      }
    };
    ExecRequest = class _ExecRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.command = "";
        this.args = [];
        this.environment = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecRequest, a, b2);
      }
      static $() {
        return ["ExecRequest|1 command 9|2 cwd 9?|3 args 9*|4 environment 9,9"];
      }
    };
    ExecResponse = class _ExecResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.event = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecResponse, a, b2);
      }
      static $() {
        return ["ExecResponse|1 stdout_event #0 event|2 stderr_event #1 event|3 exit_event #2 event", StdoutEvent, StderrEvent, ExitEvent];
      }
    };
    StdoutEvent = class _StdoutEvent extends __protoMessage3133 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StdoutEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StdoutEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StdoutEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StdoutEvent, a, b2);
      }
      static $() {
        return ["StdoutEvent|1 data 9"];
      }
    };
    StderrEvent = class _StderrEvent extends __protoMessage3133 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StderrEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StderrEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StderrEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StderrEvent, a, b2);
      }
      static $() {
        return ["StderrEvent|1 data 9"];
      }
    };
    ExitEvent = class _ExitEvent extends __protoMessage3133 {
      constructor(data) {
        super();
        this.exitCode = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExitEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExitEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExitEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExitEvent, a, b2);
      }
      static $() {
        return ["ExitEvent|1 exit_code 5"];
      }
    };
    ListDirectoryRequest = class _ListDirectoryRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        this.includeHidden = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirectoryRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirectoryRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirectoryRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirectoryRequest, a, b2);
      }
      static $() {
        return ["ListDirectoryRequest|1 path 9|2 include_hidden 8"];
      }
    };
    ListDirectoryResponse = class _ListDirectoryResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.entries = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirectoryResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirectoryResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirectoryResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirectoryResponse, a, b2);
      }
      static $() {
        return ["ListDirectoryResponse|1 entries #0*", DirectoryEntry];
      }
    };
    DirectoryEntry = class _DirectoryEntry extends __protoMessage3133 {
      constructor(data) {
        super();
        this.name = "";
        this.path = "";
        this.type = EntryType.UNSPECIFIED;
        this.sizeBytes = protoInt64.zero;
        this.modifiedAtUnixMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DirectoryEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DirectoryEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DirectoryEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DirectoryEntry, a, b2);
      }
      static $() {
        return ["DirectoryEntry|1 name 9|2 path 9|3 type #0|4 size_bytes 4|5 modified_at_unix_ms 3", EntryType];
      }
    };
    ReadTextFileRequest = class _ReadTextFileRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTextFileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTextFileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTextFileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTextFileRequest, a, b2);
      }
      static $() {
        return ["ReadTextFileRequest|1 path 9"];
      }
    };
    ReadTextFileResponse = class _ReadTextFileResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTextFileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTextFileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTextFileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTextFileResponse, a, b2);
      }
      static $() {
        return ["ReadTextFileResponse|1 content 9"];
      }
    };
    WriteTextFileRequest = class _WriteTextFileRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteTextFileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteTextFileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteTextFileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteTextFileRequest, a, b2);
      }
      static $() {
        return ["WriteTextFileRequest|1 path 9|2 content 9"];
      }
    };
    WriteTextFileResponse = class _WriteTextFileResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteTextFileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteTextFileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteTextFileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteTextFileResponse, a, b2);
      }
      static $() {
        return ["WriteTextFileResponse"];
      }
    };
    ReadBinaryFileRequest2 = class _ReadBinaryFileRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadBinaryFileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadBinaryFileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadBinaryFileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadBinaryFileRequest, a, b2);
      }
      static $() {
        return ["ReadBinaryFileRequest|1 path 9"];
      }
    };
    ReadBinaryFileResponse2 = class _ReadBinaryFileResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.content = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadBinaryFileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadBinaryFileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadBinaryFileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadBinaryFileResponse, a, b2);
      }
      static $() {
        return ["ReadBinaryFileResponse|1 content 12"];
      }
    };
    ExportFileRequest = class _ExportFileRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        this.workspaceRootPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExportFileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExportFileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExportFileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExportFileRequest, a, b2);
      }
      static $() {
        return ["ExportFileRequest|1 path 9|2 workspace_root_path 9"];
      }
    };
    ExportFileMetadata = class _ExportFileMetadata extends __protoMessage3133 {
      constructor(data) {
        super();
        this.totalBytes = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExportFileMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExportFileMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExportFileMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExportFileMetadata, a, b2);
      }
      static $() {
        return ["ExportFileMetadata|1 total_bytes 4"];
      }
    };
    ExportFileResponse = class _ExportFileResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.payload = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExportFileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExportFileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExportFileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExportFileResponse, a, b2);
      }
      static $() {
        return ["ExportFileResponse|1 content_chunk 12 payload|2 metadata #0 payload", ExportFileMetadata];
      }
    };
    WriteBinaryFileRequest = class _WriteBinaryFileRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.path = "";
        this.content = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteBinaryFileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteBinaryFileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteBinaryFileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteBinaryFileRequest, a, b2);
      }
      static $() {
        return ["WriteBinaryFileRequest|1 path 9|2 content 12"];
      }
    };
    WriteBinaryFileResponse = class _WriteBinaryFileResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteBinaryFileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteBinaryFileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteBinaryFileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteBinaryFileResponse, a, b2);
      }
      static $() {
        return ["WriteBinaryFileResponse"];
      }
    };
    GetWorkspaceChangesHashRequest = class _GetWorkspaceChangesHashRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.rootPath = "";
        this.baseRef = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetWorkspaceChangesHashRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetWorkspaceChangesHashRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetWorkspaceChangesHashRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetWorkspaceChangesHashRequest, a, b2);
      }
      static $() {
        return ["GetWorkspaceChangesHashRequest|1 root_path 9|2 base_ref 9"];
      }
    };
    GetWorkspaceChangesHashResponse = class _GetWorkspaceChangesHashResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.hash = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetWorkspaceChangesHashResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetWorkspaceChangesHashResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetWorkspaceChangesHashResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetWorkspaceChangesHashResponse, a, b2);
      }
      static $() {
        return ["GetWorkspaceChangesHashResponse|1 hash 9"];
      }
    };
    BatchGetDiffRequest = class _BatchGetDiffRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.items = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffRequest, a, b2);
      }
      static $() {
        return ["BatchGetDiffRequest|1 items #0*", BatchGetDiffItem];
      }
    };
    BatchGetDiffItem = class _BatchGetDiffItem extends __protoMessage3133 {
      constructor(data) {
        super();
        this.fetchBranches = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffItem, a, b2);
      }
      static $() {
        return ["BatchGetDiffItem|1 diff_request #0|2 fetch_branches 9*|3 known_base_sha 9?|4 known_head_sha 9?|5 known_workspace_hash 9?|6 use_cat_file_batch 8?", GetDiffRequest];
      }
    };
    BatchGetDiffResponse = class _BatchGetDiffResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffResponse, a, b2);
      }
      static $() {
        return ["BatchGetDiffResponse|1 results #0*", BatchGetDiffResult];
      }
    };
    BatchGetDiffResult = class _BatchGetDiffResult extends __protoMessage3133 {
      constructor(data) {
        super();
        this.itemIndex = 0;
        this.fetchedBranches = [];
        this.failedBranches = [];
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffResult, a, b2);
      }
      static $() {
        return ["BatchGetDiffResult|1 item_index 13|4 fetched_branches 9*|5 failed_branches 9*|2 diff #0 result|3 error #1 result|6 unchanged #2 result|7 resolved_base_sha 9?|8 resolved_head_sha 9?|9 resolved_workspace_hash 9?", GetDiffResponse, BatchGetDiffError, BatchGetDiffUnchanged];
      }
    };
    BatchGetDiffUnchanged = class _BatchGetDiffUnchanged extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffUnchanged().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffUnchanged().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffUnchanged().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffUnchanged, a, b2);
      }
      static $() {
        return ["BatchGetDiffUnchanged"];
      }
    };
    BatchGetDiffError = class _BatchGetDiffError extends __protoMessage3133 {
      constructor(data) {
        super();
        this.kind = BatchGetDiffErrorKind.UNSPECIFIED;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchGetDiffError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchGetDiffError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchGetDiffError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchGetDiffError, a, b2);
      }
      static $() {
        return ["BatchGetDiffError|1 kind #0|2 message 9", BatchGetDiffErrorKind];
      }
    };
    RefreshGithubAccessTokenRequest = class _RefreshGithubAccessTokenRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.githubAccessToken = "";
        this.hostname = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RefreshGithubAccessTokenRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RefreshGithubAccessTokenRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RefreshGithubAccessTokenRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RefreshGithubAccessTokenRequest, a, b2);
      }
      static $() {
        return ["RefreshGithubAccessTokenRequest|1 github_access_token 9|2 hostname 9|3 repo_url 9?|4 clone_username 9?"];
      }
    };
    RefreshGithubAccessTokenResponse = class _RefreshGithubAccessTokenResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RefreshGithubAccessTokenResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RefreshGithubAccessTokenResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RefreshGithubAccessTokenResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RefreshGithubAccessTokenResponse, a, b2);
      }
      static $() {
        return ["RefreshGithubAccessTokenResponse"];
      }
    };
    WarmRemoteAccessServerRequest = class _WarmRemoteAccessServerRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.commit = "";
        this.port = 0;
        this.connectionToken = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WarmRemoteAccessServerRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WarmRemoteAccessServerRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WarmRemoteAccessServerRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WarmRemoteAccessServerRequest, a, b2);
      }
      static $() {
        return ["WarmRemoteAccessServerRequest|1 commit 9|2 port 5|3 connection_token 9"];
      }
    };
    WarmRemoteAccessServerResponse = class _WarmRemoteAccessServerResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WarmRemoteAccessServerResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WarmRemoteAccessServerResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WarmRemoteAccessServerResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WarmRemoteAccessServerResponse, a, b2);
      }
      static $() {
        return ["WarmRemoteAccessServerResponse"];
      }
    };
    ListArtifactsRequest = class _ListArtifactsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.extraPaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListArtifactsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListArtifactsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListArtifactsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListArtifactsRequest, a, b2);
      }
      static $() {
        return ["ListArtifactsRequest|1 extra_paths 9*"];
      }
    };
    ArtifactUploadMetadata = class _ArtifactUploadMetadata extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        this.sizeBytes = protoInt64.zero;
        this.updatedAtUnixMs = protoInt64.zero;
        this.status = ArtifactUploadStatus.UNSPECIFIED;
        this.bytesUploaded = protoInt64.zero;
        this.lastError = "";
        this.uploadAttempts = 0;
        this.lastStartedAtUnixMs = protoInt64.zero;
        this.lastFinishedAtUnixMs = protoInt64.zero;
        this.uploadId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ArtifactUploadMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ArtifactUploadMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ArtifactUploadMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ArtifactUploadMetadata, a, b2);
      }
      static $() {
        return ["ArtifactUploadMetadata|1 absolute_path 9|2 size_bytes 4|3 updated_at_unix_ms 3|4 status #0|5 bytes_uploaded 4|6 last_error 9|7 upload_attempts 13|8 last_started_at_unix_ms 3|9 last_finished_at_unix_ms 3|10 upload_id 9|11 artifact_relative_path 9?", ArtifactUploadStatus];
      }
    };
    ArtifactPathError = class _ArtifactPathError extends __protoMessage3133 {
      constructor(data) {
        super();
        this.kind = ArtifactPathErrorKind.UNSPECIFIED;
        this.code = "";
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ArtifactPathError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ArtifactPathError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ArtifactPathError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ArtifactPathError, a, b2);
      }
      static $() {
        return ["ArtifactPathError|1 kind #0|2 code 9|3 message 9", ArtifactPathErrorKind];
      }
    };
    ListArtifactsResponse = class _ListArtifactsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.artifacts = [];
        this.pathErrors = {};
        this.rootKind = ArtifactRootKind.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListArtifactsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListArtifactsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListArtifactsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListArtifactsResponse, a, b2);
      }
      static $() {
        return ["ListArtifactsResponse|1 artifacts #0*|2 path_errors 9,#1|3 root_kind #2", ArtifactUploadMetadata, ArtifactPathError, ArtifactRootKind];
      }
    };
    UploadArtifactsRequest = class _UploadArtifactsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.uploads = [];
        this.waitForCompletion = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadArtifactsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadArtifactsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadArtifactsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadArtifactsRequest, a, b2);
      }
      static $() {
        return ["UploadArtifactsRequest|1 uploads #0*|2 wait_for_completion 8", ArtifactUploadInstruction];
      }
    };
    ArtifactUploadInstruction = class _ArtifactUploadInstruction extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        this.uploadUrl = "";
        this.method = "";
        this.headers = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ArtifactUploadInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ArtifactUploadInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ArtifactUploadInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ArtifactUploadInstruction, a, b2);
      }
      static $() {
        return ["ArtifactUploadInstruction|1 absolute_path 9|2 upload_url 9|3 method 9|4 headers 9,9|5 content_type 9?|6 slack_upload_url 9?|7 slack_file_id 9?|8 artifact_relative_path 9?"];
      }
    };
    ArtifactUploadDispatchResult = class _ArtifactUploadDispatchResult extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        this.status = ArtifactUploadDispatchStatus.UNSPECIFIED;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ArtifactUploadDispatchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ArtifactUploadDispatchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ArtifactUploadDispatchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ArtifactUploadDispatchResult, a, b2);
      }
      static $() {
        return ["ArtifactUploadDispatchResult|1 absolute_path 9|2 status #0|3 message 9|4 slack_file_id 9?", ArtifactUploadDispatchStatus];
      }
    };
    UploadArtifactsResponse = class _UploadArtifactsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadArtifactsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadArtifactsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadArtifactsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadArtifactsResponse, a, b2);
      }
      static $() {
        return ["UploadArtifactsResponse|1 results #0*", ArtifactUploadDispatchResult];
      }
    };
    PersistArtifactToAgentStoreInstruction = class _PersistArtifactToAgentStoreInstruction extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactToAgentStoreInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactToAgentStoreInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactToAgentStoreInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactToAgentStoreInstruction, a, b2);
      }
      static $() {
        return ["PersistArtifactToAgentStoreInstruction|1 absolute_path 9|2 artifact_relative_path 9?"];
      }
    };
    PersistArtifactsToAgentStoreRequest = class _PersistArtifactsToAgentStoreRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.artifacts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactsToAgentStoreRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactsToAgentStoreRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactsToAgentStoreRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactsToAgentStoreRequest, a, b2);
      }
      static $() {
        return ["PersistArtifactsToAgentStoreRequest|1 artifacts #0*", PersistArtifactToAgentStoreInstruction];
      }
    };
    PersistArtifactToAgentStoreResult = class _PersistArtifactToAgentStoreResult extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        this.status = PersistArtifactToAgentStoreStatus.UNSPECIFIED;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactToAgentStoreResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactToAgentStoreResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactToAgentStoreResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactToAgentStoreResult, a, b2);
      }
      static $() {
        return ["PersistArtifactToAgentStoreResult|1 absolute_path 9|2 status #0|3 message 9", PersistArtifactToAgentStoreStatus];
      }
    };
    PersistArtifactsToAgentStoreResponse = class _PersistArtifactsToAgentStoreResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactsToAgentStoreResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactsToAgentStoreResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactsToAgentStoreResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactsToAgentStoreResponse, a, b2);
      }
      static $() {
        return ["PersistArtifactsToAgentStoreResponse|1 results #0*", PersistArtifactToAgentStoreResult];
      }
    };
    PersistArtifactsToParentStoreRequest = class _PersistArtifactsToParentStoreRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.artifacts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactsToParentStoreRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactsToParentStoreRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactsToParentStoreRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactsToParentStoreRequest, a, b2);
      }
      static $() {
        return ["PersistArtifactsToParentStoreRequest|1 artifacts #0*", PersistArtifactToAgentStoreInstruction];
      }
    };
    PersistArtifactsToParentStoreResponse = class _PersistArtifactsToParentStoreResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PersistArtifactsToParentStoreResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PersistArtifactsToParentStoreResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PersistArtifactsToParentStoreResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PersistArtifactsToParentStoreResponse, a, b2);
      }
      static $() {
        return ["PersistArtifactsToParentStoreResponse|1 results #0*", PersistArtifactToAgentStoreResult];
      }
    };
    RestoreArtifactInstruction = class _RestoreArtifactInstruction extends __protoMessage3133 {
      constructor(data) {
        super();
        this.absolutePath = "";
        this.downloadUrl = "";
        this.updatedAtUnixMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RestoreArtifactInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RestoreArtifactInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RestoreArtifactInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RestoreArtifactInstruction, a, b2);
      }
      static $() {
        return ["RestoreArtifactInstruction|1 absolute_path 9|2 download_url 9|3 updated_at_unix_ms 3|4 artifact_relative_path 9?"];
      }
    };
    RestoreArtifactResult = class _RestoreArtifactResult extends __protoMessage3133 {
      constructor(data) {
        super();
        this.status = ArtifactRestoreStatus.UNSPECIFIED;
        this.errorMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RestoreArtifactResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RestoreArtifactResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RestoreArtifactResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RestoreArtifactResult, a, b2);
      }
      static $() {
        return ["RestoreArtifactResult|2 status #0|3 error_message 9", ArtifactRestoreStatus];
      }
    };
    RestoreArtifactsRequest = class _RestoreArtifactsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.artifacts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RestoreArtifactsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RestoreArtifactsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RestoreArtifactsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RestoreArtifactsRequest, a, b2);
      }
      static $() {
        return ["RestoreArtifactsRequest|1 artifacts #0*", RestoreArtifactInstruction];
      }
    };
    RestoreArtifactsResponse = class _RestoreArtifactsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RestoreArtifactsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RestoreArtifactsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RestoreArtifactsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RestoreArtifactsResponse, a, b2);
      }
      static $() {
        return ["RestoreArtifactsResponse|1 results #0*", RestoreArtifactResult];
      }
    };
    GetMcpRefreshTokensRequest = class _GetMcpRefreshTokensRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetMcpRefreshTokensRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetMcpRefreshTokensRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetMcpRefreshTokensRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetMcpRefreshTokensRequest, a, b2);
      }
      static $() {
        return ["GetMcpRefreshTokensRequest"];
      }
    };
    GetMcpRefreshTokensResponse = class _GetMcpRefreshTokensResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.refreshTokens = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetMcpRefreshTokensResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetMcpRefreshTokensResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetMcpRefreshTokensResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetMcpRefreshTokensResponse, a, b2);
      }
      static $() {
        return ["GetMcpRefreshTokensResponse|1 refresh_tokens 9,9"];
      }
    };
    UpdateEnvironmentVariablesRequest = class _UpdateEnvironmentVariablesRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.env = {};
        this.replace = false;
        this.restorePreviousValues = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateEnvironmentVariablesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateEnvironmentVariablesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateEnvironmentVariablesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateEnvironmentVariablesRequest, a, b2);
      }
      static $() {
        return ["UpdateEnvironmentVariablesRequest|1 env 9,9|2 replace 8|3 restore_previous_values 8|4 run_scoped_overlay #0", RunScopedOverlay];
      }
    };
    RunScopedOverlay = class _RunScopedOverlay extends __protoMessage3133 {
      constructor(data) {
        super();
        this.runId = "";
        this.release = false;
        this.holder = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunScopedOverlay().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunScopedOverlay().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunScopedOverlay().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunScopedOverlay, a, b2);
      }
      static $() {
        return ["RunScopedOverlay|1 run_id 9|2 release 8|3 holder 9"];
      }
    };
    UpdateEnvironmentVariablesResponse = class _UpdateEnvironmentVariablesResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.applied = 0;
        this.removed = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateEnvironmentVariablesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateEnvironmentVariablesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateEnvironmentVariablesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateEnvironmentVariablesResponse, a, b2);
      }
      static $() {
        return ["UpdateEnvironmentVariablesResponse|1 applied 13|2 removed 13"];
      }
    };
    ScopedSecretValues = class _ScopedSecretValues extends __protoMessage3133 {
      constructor(data) {
        super();
        this.values = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScopedSecretValues().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScopedSecretValues().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScopedSecretValues().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScopedSecretValues, a, b2);
      }
      static $() {
        return ["ScopedSecretValues|1 values 9,9"];
      }
    };
    SyncScopedSecretsRequest = class _SyncScopedSecretsRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.scopeId = "";
        this.revision = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SyncScopedSecretsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SyncScopedSecretsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SyncScopedSecretsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SyncScopedSecretsRequest, a, b2);
      }
      static $() {
        return ["SyncScopedSecretsRequest|1 scope_id 9|2 revision 5|3 secrets #0?", ScopedSecretValues];
      }
    };
    SyncScopedSecretsResponse = class _SyncScopedSecretsResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SyncScopedSecretsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SyncScopedSecretsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SyncScopedSecretsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SyncScopedSecretsResponse, a, b2);
      }
      static $() {
        return ["SyncScopedSecretsResponse|1 revision 5?"];
      }
    };
    DownloadCursorServerRequest = class _DownloadCursorServerRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.commit = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DownloadCursorServerRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DownloadCursorServerRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DownloadCursorServerRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DownloadCursorServerRequest, a, b2);
      }
      static $() {
        return ["DownloadCursorServerRequest|1 commit 9"];
      }
    };
    DownloadCursorServerResponse = class _DownloadCursorServerResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.alreadyDownloaded = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DownloadCursorServerResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DownloadCursorServerResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DownloadCursorServerResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DownloadCursorServerResponse, a, b2);
      }
      static $() {
        return ["DownloadCursorServerResponse|1 already_downloaded 8"];
      }
    };
    InstallPluginArtifactRequest = class _InstallPluginArtifactRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.downloadUrl = "";
        this.targetRoot = "";
        this.artifactDigest = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InstallPluginArtifactRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InstallPluginArtifactRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InstallPluginArtifactRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InstallPluginArtifactRequest, a, b2);
      }
      static $() {
        return ["InstallPluginArtifactRequest|1 download_url 9|2 target_root 9|3 artifact_digest 9"];
      }
    };
    InstallPluginArtifactResponse = class _InstallPluginArtifactResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InstallPluginArtifactResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InstallPluginArtifactResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InstallPluginArtifactResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InstallPluginArtifactResponse, a, b2);
      }
      static $() {
        return ["InstallPluginArtifactResponse"];
      }
    };
    LoadMcpServersRequest = class _LoadMcpServersRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.mcpConfigJson = "";
        this.removeMissing = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LoadMcpServersRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LoadMcpServersRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LoadMcpServersRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LoadMcpServersRequest, a, b2);
      }
      static $() {
        return ["LoadMcpServersRequest|1 mcp_config_json 9|2 remove_missing 8"];
      }
    };
    LoadMcpServersResponse = class _LoadMcpServersResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.loadedServerNames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LoadMcpServersResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LoadMcpServersResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LoadMcpServersResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LoadMcpServersResponse, a, b2);
      }
      static $() {
        return ["LoadMcpServersResponse|1 loaded_server_names 9*"];
      }
    };
    DesktopLeaseAcquire = class _DesktopLeaseAcquire extends __protoMessage3133 {
      constructor(data) {
        super();
        this.actorId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseAcquire().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseAcquire().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseAcquire().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseAcquire, a, b2);
      }
      static $() {
        return ["DesktopLeaseAcquire|1 actor_id 9"];
      }
    };
    DesktopLeaseRelease = class _DesktopLeaseRelease extends __protoMessage3133 {
      constructor(data) {
        super();
        this.actorId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseRelease().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseRelease().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseRelease().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseRelease, a, b2);
      }
      static $() {
        return ["DesktopLeaseRelease|1 actor_id 9"];
      }
    };
    DesktopLeaseGetState = class _DesktopLeaseGetState extends __protoMessage3133 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseGetState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseGetState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseGetState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseGetState, a, b2);
      }
      static $() {
        return ["DesktopLeaseGetState"];
      }
    };
    DesktopLeaseRequest = class _DesktopLeaseRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.action = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseRequest, a, b2);
      }
      static $() {
        return ["DesktopLeaseRequest|1 acquire #0 action|2 release #1 action|3 get_state #2 action", DesktopLeaseAcquire, DesktopLeaseRelease, DesktopLeaseGetState];
      }
    };
    DesktopLeaseOwner = class _DesktopLeaseOwner extends __protoMessage3133 {
      constructor(data) {
        super();
        this.kind = DesktopLeaseActorKind.UNSPECIFIED;
        this.actorId = "";
        this.expiresAtUnixMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseOwner().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseOwner().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseOwner().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseOwner, a, b2);
      }
      static $() {
        return ["DesktopLeaseOwner|1 kind #0|2 actor_id 9|3 expires_at_unix_ms 3", DesktopLeaseActorKind];
      }
    };
    DesktopLeaseResponse = class _DesktopLeaseResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.status = DesktopLeaseStatus.UNSPECIFIED;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DesktopLeaseResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DesktopLeaseResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DesktopLeaseResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DesktopLeaseResponse, a, b2);
      }
      static $() {
        return ["DesktopLeaseResponse|1 status #0|2 owner #1?|3 message 9", DesktopLeaseStatus, DesktopLeaseOwner];
      }
    };
    ResourceLimits = class _ResourceLimits extends __protoMessage3133 {
      constructor(data) {
        super();
        this.scope = ResourceScope.UNSPECIFIED;
        this.memoryLimitBytes = protoInt64.zero;
        this.cpuLimitMcores = 0;
        this.diskLimitBytes = protoInt64.zero;
        this.workspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResourceLimits().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResourceLimits().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResourceLimits().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResourceLimits, a, b2);
      }
      static $() {
        return ["ResourceLimits|1 scope #0|2 memory_limit_bytes 4|3 cpu_limit_mcores 13|4 disk_limit_bytes 4|5 workspace_path 9|6 display_label 9?", ResourceScope];
      }
    };
    ResourceSample = class _ResourceSample extends __protoMessage3133 {
      constructor(data) {
        super();
        this.sampledAtMs = protoInt64.zero;
        this.memoryUsedBytes = protoInt64.zero;
        this.memoryAvailableBytes = protoInt64.zero;
        this.cpuUsedMcores = 0;
        this.diskUsedBytes = protoInt64.zero;
        this.pressure = ResourcePressure.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResourceSample().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResourceSample().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResourceSample().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResourceSample, a, b2);
      }
      static $() {
        return ["ResourceSample|1 sampled_at_ms 3|2 memory_used_bytes 4|3 memory_available_bytes 4|4 cpu_used_mcores 13|5 disk_used_bytes 4|6 pressure #0", ResourcePressure];
      }
    };
    GetResourceUsageRequest = class _GetResourceUsageRequest extends __protoMessage3133 {
      constructor(data) {
        super();
        this.cursor = "";
        this.omitHistory = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetResourceUsageRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetResourceUsageRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetResourceUsageRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetResourceUsageRequest, a, b2);
      }
      static $() {
        return ["GetResourceUsageRequest|1 cursor 9|2 omit_history 8"];
      }
    };
    GetResourceUsageResponse = class _GetResourceUsageResponse extends __protoMessage3133 {
      constructor(data) {
        super();
        this.history = [];
        this.nextCursor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetResourceUsageResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetResourceUsageResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetResourceUsageResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetResourceUsageResponse, a, b2);
      }
      static $() {
        return ["GetResourceUsageResponse|1 limits #0|2 current #1|3 history #1*|4 next_cursor 9", ResourceLimits, ResourceSample];
      }
    };
  }
});

