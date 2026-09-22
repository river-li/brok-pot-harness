/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/background_composer_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/4
init_esm13();
init_utils_pb2();

// @recovered-fragment 2/4
init_subagents_pb();

// @recovered-fragment 3/4
init_tools_pb();
init_repository_pb();

// @recovered-fragment 4/4
init_compact();
var __protoPackage146 = "aiserver.v1.";
var __protoMessage3139 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage146;
  }
};
var ManagerSpawnKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ManagerSpawnKind", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "ADOPTED"], [3, "CREATED_SAME_VM"]], 1);
var BackgroundComposerUpdateKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerUpdateKind", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "STATUS_CHANGED"], [3, "ARCHIVED"], [4, "UNARCHIVED"], [5, "METADATA_CHANGED"], [6, "MEMBERSHIP_CHANGED"], [7, "VISIBILITY_CHANGED"], [8, "DELETED"], [9, "SUBSCRIPTIONS_CHANGED"], [10, "APPROVAL_CHANGED"], [11, "MACHINE_PRESSURE_CHANGED"], [12, "READ_CURSOR_ADVANCED"], [13, "UNREAD_CHANGED"]], 1);
var BackgroundComposerMachinePressure = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerMachinePressure", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "HIGH"]], 1);
var BackgroundComposerApprovalState = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerApprovalState", [[0, "UNSPECIFIED"], [1, "PENDING"], [2, "APPROVED"], [3, "DENIED"], [4, "EXPIRED"], [5, "CANCELLED"]], 1);
var BackgroundComposerApprovalKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerApprovalKind", [[0, "UNSPECIFIED"], [1, "ORIGIN_CONTENTS_WRITE"], [2, "MCP_TOOL"]], 1);
var WakeBackgroundComposerReason = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "WakeBackgroundComposerReason", [[0, "UNSPECIFIED"], [1, "FOLLOWUP_COMPOSE"]], 1);
var PrCodeTourRevisionStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PrCodeTourRevisionStatus", [[0, "UNSPECIFIED"], [1, "GENERATING"], [2, "COMPLETE"], [3, "ERROR"]], 1);
var PrCodeTourRevisionSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PrCodeTourRevisionSource", [[0, "UNSPECIFIED"], [1, "AGENT"]], 1);
var BackgroundComposerStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "FINISHED"], [3, "ERROR"], [4, "CREATING"], [5, "EXPIRED"]], 1);
var CloudAgentWorkflowStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentWorkflowStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "IDLE"], [3, "ERROR"], [4, "ARCHIVED"], [5, "EXPIRED"], [6, "NOT_YET_STARTED"], [7, "WAITING_FOR_BACKGROUND_WORK"]], 1);
var BackgroundComposerSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerSource", [[0, "UNSPECIFIED"], [1, "EDITOR"], [2, "SLACK"], [3, "WEBSITE"], [4, "LINEAR"], [5, "IOS_APP"], [6, "API"], [7, "GITHUB"], [8, "CLI"], [9, "GITHUB_CI_AUTOFIX"], [10, "GITLAB"], [11, "ENVIRONMENT_SETUP_WEB"], [12, "GRIND_WEB"], [13, "BUGBOT_AUTOFIX"], [14, "AUTOMATIONS"], [15, "GRAPHITE_CHAT_WEB"], [16, "GLASS"], [17, "GRAPHITE_FULL_SELF_DRIVING"], [18, "TEAMS"], [19, "LOCAL"], [20, "JIRA"], [21, "SDK"], [22, "FULL_SELF_DRIVING"], [23, "QABOT_FRONTEND"], [24, "AS_SUBAGENT_FROM_LOCAL"], [25, "ENVIRONMENT_SETUP_GLASS"], [26, "SAND_CODING_SUBAGENT"], [27, "BITBUCKET"], [28, "CLOUD_META_AGENT"], [29, "AS_SUBAGENT_FROM_CLOUD"], [30, "ENVIRONMENT_SETUP_ONBOARDING_AUTO"], [31, "ORIGIN"], [32, "AS_SIDE_CHAT_FROM_CLOUD"], [33, "GROK_BOT"], [34, "CLOUD_ONBOARDING_WEB"], [35, "CHANGE_MONITOR_ONBOARDING_WEB"]], 1);
var OwnerType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "OwnerType", [[0, "UNSPECIFIED"], [1, "USER"], [2, "SERVICE_ACCOUNT"]], 1);
var CloudAgentDashboardRunStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentDashboardRunStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "FINISHED"], [3, "ERROR"], [4, "INSTALL_FAILED"]], 1);
var CloudAgentDashboardRunSortField = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentDashboardRunSortField", [[0, "UNSPECIFIED"], [1, "CREATED_AT"]], 1);
var CloudAgentDashboardRunSortDirection = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentDashboardRunSortDirection", [[0, "UNSPECIFIED"], [1, "DESC"], [2, "ASC"]], 1);
var CloudAgentRunEventCategory = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentRunEventCategory", [[0, "UNSPECIFIED"], [1, "BUILD"], [2, "AGENT_SETUP"], [3, "AGENT_RUN"]], 1);
var CloudAgentRunEventLogLevel = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentRunEventLogLevel", [[0, "UNSPECIFIED"], [1, "INFO"], [2, "WARN"], [3, "ERROR"]], 1);
var PRStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PRStatus", [[0, "PR_STATUS_UNSPECIFIED"], [1, "PR_STATUS_OPEN"], [2, "PR_STATUS_DRAFT"], [3, "PR_STATUS_MERGED"], [4, "PR_STATUS_CLOSED"]]);
var CloudSubagentParentAgentType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudSubagentParentAgentType", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD"]], 1);
var CloudSubagentParentSpawnKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudSubagentParentSpawnKind", [[0, "UNSPECIFIED"], [1, "TASK"], [2, "EVENT_SUBSCRIPTION"], [3, "ADOPTED"]], 1);
var EnsembleStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnsembleStatus", [[0, "UNSPECIFIED"], [1, "PARENT"], [2, "CHILD"]], 1);
var ForkBackgroundComposerMode = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ForkBackgroundComposerMode", [[0, "UNSPECIFIED"], [1, "CONVERSATION"], [2, "POD"]], 1);
var StreamConversationPurpose = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "StreamConversationPurpose", [[0, "UNSPECIFIED"], [1, "LIVE"], [2, "PREWARM"]], 1);
var PlanFollowupType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PlanFollowupType", [[0, "UNSPECIFIED"], [1, "PLAN"], [2, "EXECUTE"]], 1);
var CloudAgentTimingEventType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentTimingEventType", [[0, "UNSPECIFIED"], [1, "REQUEST_RECEIVED"], [2, "PREWARMED_POD_RECEIVED"], [3, "POD_REQUESTED"], [4, "POD_READY"], [5, "FIRST_TOKEN"], [6, "STALE_SNAPSHOT_USED"]], 1);
var BackgroundComposerDesktopLeaseAction = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerDesktopLeaseAction", [[0, "UNSPECIFIED"], [1, "ACQUIRE"], [2, "RELEASE"]], 1);
var GithubAccessErrorType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "GithubAccessErrorType", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "NO_AUTH_TOKEN"], [3, "APP_NOT_INSTALLED"], [4, "USER_NO_ACCESS"], [5, "APP_INSUFFICIENT_PERMS"], [6, "PUBLIC_REPO"]], 1);
var EnvironmentWriteSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentWriteSource", [[0, "UNSPECIFIED"], [1, "DASHBOARD"], [2, "SETUP_FLOW"], [3, "SDK_V1"], [4, "RESTORE"]], 1);
var EnvironmentType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentType", [[0, "UNSPECIFIED"], [1, "PERSONAL"], [2, "TEAM"]], 1);
var LogicalEnvironmentScope = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "LogicalEnvironmentScope", [[0, "UNSPECIFIED"], [1, "PERSONAL"], [2, "TEAM"], [3, "REPOSITORY"]], 1);
var EnvironmentIneligibilityReason = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentIneligibilityReason", [[0, "UNSPECIFIED"], [1, "GITHUB_REPO_REVERSE_MIRRORED"]], 1);
var EnvironmentBuildRowStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentBuildRowStatus", [[0, "UNSPECIFIED"], [1, "IN_PROGRESS"], [2, "SUCCEEDED"], [3, "FAILED"], [4, "CANCELLED"], [5, "SKIPPED"]], 1);
var EnvironmentBuildRowTriggerType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentBuildRowTriggerType", [[0, "UNSPECIFIED"], [1, "MANUAL"], [2, "RECURRING"], [3, "CONFIG_CHANGE"]], 1);
var EnvironmentBuildRowSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentBuildRowSource", [[0, "UNSPECIFIED"], [1, "SYSTEM"], [2, "WEBSITE"], [3, "API"], [4, "AGENT"]], 1);
var EnvironmentBuildRowFailureType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentBuildRowFailureType", [[0, "UNSPECIFIED"], [1, "INSTALL_FAILED"], [2, "TERMINAL_FAILURE"]], 1);
var EnvironmentBuildSnapshotReapState = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentBuildSnapshotReapState", [[0, "UNSPECIFIED"], [1, "ACTIVE"], [2, "REAP_REQUESTED"], [3, "DELETED"]], 1);
var MultiRepoEnvironmentReusePolicy = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "MultiRepoEnvironmentReusePolicy", [[0, "UNSPECIFIED"], [1, "SAME_SCOPE_ONLY"], [2, "ALLOW_TEAM_NAMED_FOR_PERSONAL"]], 1);
var EnvironmentVersionSourceKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentVersionSourceKind", [[0, "UNSPECIFIED"], [1, "REPO_FILE"], [2, "DATABASE_USER"], [3, "DATABASE_TEAM"], [4, "REQUEST_OVERRIDE"]], 1);
var EnvironmentUpdateEventKind = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "EnvironmentUpdateEventKind", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "UPDATED"], [3, "DELETED"], [4, "FORWARD_FILLED"]], 1);
var AutoCreatePrSetting = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "AutoCreatePrSetting", [[0, "UNSPECIFIED"], [1, "ALWAYS"], [2, "SINGLE"], [3, "NEVER"]], 1);
var BackgroundComposerQuickActionExecutionMode = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerQuickActionExecutionMode", [[0, "UNSPECIFIED"], [1, "SUBAGENT"], [2, "PARENT_AGENT"]], 1);
var BackgroundComposerQuickActionSubagentTemplateScope = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerQuickActionSubagentTemplateScope", [[0, "UNSPECIFIED"], [1, "BUILTIN"], [2, "USER"], [3, "TEAM"]], 1);
var BackgroundComposerQuickActionSubagentTemplateOperation = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerQuickActionSubagentTemplateOperation", [[0, "UNSPECIFIED"], [1, "CREATE"], [2, "UPDATE"], [3, "DELETE"]], 1);
var PRDeploymentState = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PRDeploymentState", [[0, "PR_DEPLOYMENT_STATE_UNSPECIFIED"], [1, "PR_DEPLOYMENT_STATE_UNKNOWN"], [2, "PR_DEPLOYMENT_STATE_PENDING"], [3, "PR_DEPLOYMENT_STATE_QUEUED"], [4, "PR_DEPLOYMENT_STATE_IN_PROGRESS"], [5, "PR_DEPLOYMENT_STATE_SUCCESS"], [6, "PR_DEPLOYMENT_STATE_FAILURE"], [7, "PR_DEPLOYMENT_STATE_ERROR"], [8, "PR_DEPLOYMENT_STATE_INACTIVE"], [9, "PR_DEPLOYMENT_STATE_WAITING"], [10, "PR_DEPLOYMENT_STATE_ACTIVE"], [11, "PR_DEPLOYMENT_STATE_ABANDONED"], [12, "PR_DEPLOYMENT_STATE_DESTROYED"], [13, "PR_DEPLOYMENT_STATE_BLOCKED"], [14, "PR_DEPLOYMENT_STATE_CANCELED"]]);
var PRDeploymentStatusState = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PRDeploymentStatusState", [[0, "PR_DEPLOYMENT_STATUS_STATE_UNSPECIFIED"], [1, "PR_DEPLOYMENT_STATUS_STATE_UNKNOWN"], [2, "PR_DEPLOYMENT_STATUS_STATE_PENDING"], [3, "PR_DEPLOYMENT_STATUS_STATE_QUEUED"], [4, "PR_DEPLOYMENT_STATUS_STATE_IN_PROGRESS"], [5, "PR_DEPLOYMENT_STATUS_STATE_SUCCESS"], [6, "PR_DEPLOYMENT_STATUS_STATE_FAILURE"], [7, "PR_DEPLOYMENT_STATUS_STATE_ERROR"], [8, "PR_DEPLOYMENT_STATUS_STATE_INACTIVE"], [9, "PR_DEPLOYMENT_STATUS_STATE_WAITING"], [10, "PR_DEPLOYMENT_STATUS_STATE_BLOCKED"], [11, "PR_DEPLOYMENT_STATUS_STATE_CANCELED"]]);
var PushPlatform = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PushPlatform", [[0, "UNSPECIFIED"], [1, "IOS"], [2, "ANDROID"], [3, "WEB"]], 1);
var OriginAgentApprovalResolution = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "OriginAgentApprovalResolution", [[0, "UNSPECIFIED"], [1, "APPROVED"], [2, "DENIED"]], 1);
var BackgroundComposerAccessDenialReason = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "BackgroundComposerAccessDenialReason", [[0, "UNSPECIFIED"], [1, "OTHER_OWNER"], [2, "TEAM_POLICY"]], 1);
var StartingMessageType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "StartingMessageType", [[0, "UNSPECIFIED"], [1, "USER_MESSAGE"], [2, "PLAN_START"], [3, "PLAN_EXECUTE"]], 1);
var CarriedRequestContextSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CarriedRequestContextSource", [[0, "UNSPECIFIED"], [1, "TURN_PERSIST"], [2, "POST_JOIN_RECOMPUTE"], [3, "POST_TURN_RECOMPUTE"], [4, "STEP0_LIVE"], [5, "STEP0_BAKE_OVERLAY"], [6, "TURN_DONE_RECOMPUTE"], [7, "STEP0_CARRIED_STALE_MCP"]], 1);
var CloudAgentStartupWarningType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentStartupWarningType", [[0, "UNSPECIFIED"], [1, "SNAPSHOT_EXPIRED"], [2, "SNAPSHOT_INVALID"], [3, "SNAPSHOT_NOT_FOUND_OR_NO_ACCESS"], [4, "SNAPSHOT_COPY_FAILED"]], 1);
var ModelRoutingLoadTestCancelOutcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ModelRoutingLoadTestCancelOutcome", [[0, "UNSPECIFIED"], [1, "CANCEL_REQUESTED"], [2, "NOT_FOUND"], [3, "ALREADY_CLOSED"]], 1);
var CloudAgentMemoryDbLogSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "CloudAgentMemoryDbLogSource", [[0, "UNSPECIFIED"], [1, "DOCKER_BUILD"], [2, "SETUP"]], 1);
var PrivateWorkerListScope = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PrivateWorkerListScope", [[0, "UNSPECIFIED"], [1, "ALL"], [2, "TEAM_POOL"], [3, "PERSONAL"]], 1);
var AdminKillBackgroundComposerSignalOutcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "AdminKillBackgroundComposerSignalOutcome", [[0, "UNSPECIFIED"], [1, "DELIVERED"], [2, "NOT_RUNNING"], [3, "FAILED"]], 1);
var AdminActiveBackgroundComposerExecutionEnvironment = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "AdminActiveBackgroundComposerExecutionEnvironment", [[0, "UNSPECIFIED"], [1, "CURSOR_CLOUD"], [2, "SELF_HOSTED_PRIVATE_WORKER"]], 1);
var PendingPrivateWorkerRequestEventType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PendingPrivateWorkerRequestEventType", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "CLAIMED"], [3, "EXPIRED"], [4, "HEARTBEAT"], [5, "CLAIMED_OFFLINE"]], 1);
var PrivateWorkerPoolScope = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PrivateWorkerPoolScope", [[0, "UNSPECIFIED"], [1, "USER"], [2, "TEAM"]], 1);
var PrivateWorkerStatusFilter = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PrivateWorkerStatusFilter", [[0, "UNSPECIFIED"], [1, "ALL"], [2, "IN_USE"], [3, "IDLE"]], 1);
var WriteCanvasFailReason2 = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "WriteCanvasFailReason", [[0, "UNSPECIFIED"], [1, "TYPECHECK_FAILED"], [2, "COMPILE_FAILED"], [3, "TOO_LARGE"], [4, "UNAVAILABLE"], [5, "NOT_FOUND"], [6, "REFUSED"]], 1);
var ReadCanvasFailReason2 = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ReadCanvasFailReason", [[0, "UNSPECIFIED"], [1, "NOT_FOUND"], [2, "UNAVAILABLE"], [3, "REFUSED"]], 1);
var PromptUploadCompletionStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PromptUploadCompletionStatus", [[0, "UNSPECIFIED"], [1, "COMPLETED"], [2, "NOT_FOUND"], [3, "NO_PARTS"], [5, "INVALID_PARTS"], [4, "SIZE_MISMATCH"]], 1);
var KeyringScope = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "KeyringScope", [[0, "UNSPECIFIED"], [1, "PERSONAL"], [2, "TEAM"]], 1);
var KeyringListMode = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "KeyringListMode", [[0, "UNSPECIFIED"], [1, "MANAGE"], [2, "ATTACH"], [3, "ANY_ACCESS"]], 1);
var KeyringPrincipalType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "KeyringPrincipalType", [[0, "UNSPECIFIED"], [1, "USER"], [2, "TEAM"], [3, "GROUP"]], 1);
var KeyringAccessLevel = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "KeyringAccessLevel", [[0, "UNSPECIFIED"], [1, "ATTACH"], [2, "MANAGE"]], 1);
var UpdateBackgroundComposerEnvironmentRequest = class _UpdateBackgroundComposerEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.replace = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerEnvironmentRequest, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerEnvironmentRequest|1 bc_id 9|2 replace 8"];
  }
};
var UpdateBackgroundComposerEnvironmentResponse = class _UpdateBackgroundComposerEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.applied = 0;
    this.removed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerEnvironmentResponse, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerEnvironmentResponse|1 applied 13|2 removed 13"];
  }
};
var GetOptimizedDiffDetailsRequest = class _GetOptimizedDiffDetailsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.excludeBeforeAfterDiffs = false;
    this.committedOnly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOptimizedDiffDetailsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOptimizedDiffDetailsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOptimizedDiffDetailsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOptimizedDiffDetailsRequest, a, b2);
  }
  static $() {
    return ["GetOptimizedDiffDetailsRequest|1 bc_id 9|2 exclude_before_after_diffs 8|3 committed_only 8|4 branch_name 9?|5 repo_url 9?"];
  }
};
var GetOptimizedDiffDetailsResponse = class _GetOptimizedDiffDetailsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.submoduleDiffs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOptimizedDiffDetailsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOptimizedDiffDetailsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOptimizedDiffDetailsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOptimizedDiffDetailsResponse, a, b2);
  }
  static $() {
    return ["GetOptimizedDiffDetailsResponse|1 diff #0|2 submodule_diffs #1*", GitDiff, GetOptimizedDiffDetailsResponse_SubmoduleDiff];
  }
};
var GetOptimizedDiffDetailsResponse_SubmoduleDiff = class _GetOptimizedDiffDetailsResponse_SubmoduleDiff extends __protoMessage3139 {
  constructor(data) {
    super();
    this.relativePath = "";
    this.errored = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOptimizedDiffDetailsResponse_SubmoduleDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOptimizedDiffDetailsResponse_SubmoduleDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOptimizedDiffDetailsResponse_SubmoduleDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOptimizedDiffDetailsResponse_SubmoduleDiff, a, b2);
  }
  static $() {
    return ["GetOptimizedDiffDetailsResponse.SubmoduleDiff|1 relative_path 9|2 diff #0|3 errored 8", GitDiff];
  }
};
var NotifyBackgroundComposerShownRequest = class _NotifyBackgroundComposerShownRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NotifyBackgroundComposerShownRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NotifyBackgroundComposerShownRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NotifyBackgroundComposerShownRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NotifyBackgroundComposerShownRequest, a, b2);
  }
  static $() {
    return ["NotifyBackgroundComposerShownRequest|1 bc_id 9"];
  }
};
var NotifyBackgroundComposerShownResponse = class _NotifyBackgroundComposerShownResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NotifyBackgroundComposerShownResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NotifyBackgroundComposerShownResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NotifyBackgroundComposerShownResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NotifyBackgroundComposerShownResponse, a, b2);
  }
  static $() {
    return ["NotifyBackgroundComposerShownResponse"];
  }
};
var RenameBackgroundComposerRequest = class _RenameBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.newName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["RenameBackgroundComposerRequest|1 bc_id 9|2 new_name 9"];
  }
};
var RenameBackgroundComposerResponse = class _RenameBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["RenameBackgroundComposerResponse|1 name 9"];
  }
};
var ProjectAppearance = class _ProjectAppearance extends __protoMessage3139 {
  constructor(data) {
    super();
    this.icon = "";
    this.colorId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProjectAppearance().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProjectAppearance().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProjectAppearance().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProjectAppearance, a, b2);
  }
  static $() {
    return ["ProjectAppearance|1 icon 9|2 color_id 9"];
  }
};
var ProjectMetadata = class _ProjectMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProjectMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProjectMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProjectMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProjectMetadata, a, b2);
  }
  static $() {
    return ["ProjectMetadata|1 appearance #0?", ProjectAppearance];
  }
};
var UpdateProjectAppearanceRequest = class _UpdateProjectAppearanceRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateProjectAppearanceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateProjectAppearanceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateProjectAppearanceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateProjectAppearanceRequest, a, b2);
  }
  static $() {
    return ["UpdateProjectAppearanceRequest|1 bc_id 9|2 appearance #0", ProjectAppearance];
  }
};
var UpdateProjectAppearanceResponse = class _UpdateProjectAppearanceResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateProjectAppearanceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateProjectAppearanceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateProjectAppearanceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateProjectAppearanceResponse, a, b2);
  }
  static $() {
    return ["UpdateProjectAppearanceResponse|1 project_metadata #0", ProjectMetadata];
  }
};
var StagedProject = class _StagedProject extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.name = "";
    this.description = "";
    this.repoUrl = "";
    this.createdAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StagedProject().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StagedProject().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StagedProject().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StagedProject, a, b2);
  }
  static $() {
    return ["StagedProject|1 bc_id 9|2 name 9|3 description 9|4 appearance #0|5 repo_url 9|6 environment_public_id 9?|7 environment_name 9?|8 created_at_ms 3", ProjectAppearance];
  }
};
var SeedStagedProjectsRequest = class _SeedStagedProjectsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SeedStagedProjectsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SeedStagedProjectsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SeedStagedProjectsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SeedStagedProjectsRequest, a, b2);
  }
  static $() {
    return ["SeedStagedProjectsRequest"];
  }
};
var SeedStagedProjectsResponse = class _SeedStagedProjectsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = SeedStagedProjectsResponse_Outcome.UNSPECIFIED;
    this.stagedProjects = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SeedStagedProjectsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SeedStagedProjectsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SeedStagedProjectsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SeedStagedProjectsResponse, a, b2);
  }
  static $() {
    return ["SeedStagedProjectsResponse|1 outcome #0|2 staged_projects #1*", SeedStagedProjectsResponse_Outcome, StagedProject];
  }
};
var SeedStagedProjectsResponse_Outcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "SeedStagedProjectsResponse.Outcome", [[0, "UNSPECIFIED"], [1, "SEEDED"], [2, "ALREADY_SEEDED"], [3, "INELIGIBLE_GATE"], [4, "INELIGIBLE_PRIVACY"], [5, "INELIGIBLE_HAS_PROJECTS"], [6, "INELIGIBLE_NO_EVIDENCE"]], 1);
var ListStagedProjectsRequest = class _ListStagedProjectsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListStagedProjectsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListStagedProjectsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListStagedProjectsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListStagedProjectsRequest, a, b2);
  }
  static $() {
    return ["ListStagedProjectsRequest"];
  }
};
var ListStagedProjectsResponse = class _ListStagedProjectsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.stagedProjects = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListStagedProjectsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListStagedProjectsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListStagedProjectsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListStagedProjectsResponse, a, b2);
  }
  static $() {
    return ["ListStagedProjectsResponse|1 staged_projects #0*", StagedProject];
  }
};
var PreviewStagedProjectsRequest = class _PreviewStagedProjectsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewStagedProjectsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewStagedProjectsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewStagedProjectsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewStagedProjectsRequest, a, b2);
  }
  static $() {
    return ["PreviewStagedProjectsRequest"];
  }
};
var PreviewStagedProjectCandidate = class _PreviewStagedProjectCandidate extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.description = "";
    this.icon = "";
    this.initDescription = "";
    this.repoLabel = "";
    this.targetKey = "";
    this.evidenceAliases = [];
    this.evidenceCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewStagedProjectCandidate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewStagedProjectCandidate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewStagedProjectCandidate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewStagedProjectCandidate, a, b2);
  }
  static $() {
    return ["PreviewStagedProjectCandidate|1 name 9|2 description 9|3 icon 9|4 init_description 9|5 repo_label 9|6 environment_name 9?|7 target_key 9|8 evidence_aliases 9*|9 evidence_count 13"];
  }
};
var PreviewStagedProjectsDiagnostics = class _PreviewStagedProjectsDiagnostics extends __protoMessage3139 {
  constructor(data) {
    super();
    this.promptAttribution = "";
    this.model = "";
    this.latencyMs = 0;
    this.evidenceChatCount = 0;
    this.groupCount = 0;
    this.deniedGroupCount = 0;
    this.selectedChatCount = 0;
    this.resultTextCount = 0;
    this.rejectedCount = 0;
    this.resultTextPolicy = PreviewStagedProjectsDiagnostics_ResultTextPolicy.UNSPECIFIED;
    this.guidanceSource = PreviewStagedProjectsDiagnostics_GuidanceSource.UNSPECIFIED;
    this.hasRootProjects = false;
    this.alreadySeeded = false;
    this.malformedShape = PreviewStagedProjectsDiagnostics_MalformedShape.UNSPECIFIED;
    this.malformedHasProjectsKey = false;
    this.malformedTopLevelKeyCount = 0;
    this.replyLength = 0;
    this.replySha8 = "";
    this.rejectedUnknownGroup = 0;
    this.rejectedBadField = 0;
    this.rejectedTooFewChats = 0;
    this.rejectedOverlappingChats = 0;
    this.rejectedDuplicateName = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewStagedProjectsDiagnostics().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewStagedProjectsDiagnostics().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewStagedProjectsDiagnostics().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewStagedProjectsDiagnostics, a, b2);
  }
  static $() {
    return ["PreviewStagedProjectsDiagnostics|1 prompt_attribution 9|2 model 9|3 latency_ms 13|4 evidence_chat_count 13|5 group_count 13|6 denied_group_count 13|7 selected_chat_count 13|8 result_text_count 13|9 rejected_count 13|10 result_text_policy #0|11 guidance_source #1|12 has_root_projects 8|13 already_seeded 8|14 malformed_shape #2|15 malformed_has_projects_key 8|16 malformed_top_level_key_count 13|17 reply_length 13|18 reply_sha8 9|19 rejected_unknown_group 13|20 rejected_bad_field 13|21 rejected_too_few_chats 13|22 rejected_overlapping_chats 13|23 rejected_duplicate_name 13", PreviewStagedProjectsDiagnostics_ResultTextPolicy, PreviewStagedProjectsDiagnostics_GuidanceSource, PreviewStagedProjectsDiagnostics_MalformedShape];
  }
};
var PreviewStagedProjectsDiagnostics_ResultTextPolicy = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PreviewStagedProjectsDiagnostics.ResultTextPolicy", [[0, "UNSPECIFIED"], [1, "TRAINING_ALLOWED"], [2, "HEADER_ONLY"]], 1);
var PreviewStagedProjectsDiagnostics_GuidanceSource = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PreviewStagedProjectsDiagnostics.GuidanceSource", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "CONFIG"], [3, "MIXED"]], 1);
var PreviewStagedProjectsDiagnostics_MalformedShape = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PreviewStagedProjectsDiagnostics.MalformedShape", [[0, "UNSPECIFIED"], [1, "NO_OBJECT"], [2, "UNTERMINATED_OBJECT"], [3, "INVALID_JSON"], [4, "NO_PROJECTS_ARRAY"]], 1);
var PreviewStagedProjectsResponse = class _PreviewStagedProjectsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = PreviewStagedProjectsResponse_Outcome.UNSPECIFIED;
    this.candidates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewStagedProjectsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewStagedProjectsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewStagedProjectsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewStagedProjectsResponse, a, b2);
  }
  static $() {
    return ["PreviewStagedProjectsResponse|1 outcome #0|2 candidates #1*|3 diagnostics #2", PreviewStagedProjectsResponse_Outcome, PreviewStagedProjectCandidate, PreviewStagedProjectsDiagnostics];
  }
};
var PreviewStagedProjectsResponse_Outcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PreviewStagedProjectsResponse.Outcome", [[0, "UNSPECIFIED"], [1, "GENERATED"], [2, "NO_EVIDENCE"], [3, "MALFORMED"], [4, "INELIGIBLE_GATE"], [5, "INELIGIBLE_PRIVACY"]], 1);
var PublishBackgroundComposerTempRepoRequest = class _PublishBackgroundComposerTempRepoRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.newName = "";
    this.visibility = PublishBackgroundComposerTempRepoRequest_Visibility.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishBackgroundComposerTempRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishBackgroundComposerTempRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishBackgroundComposerTempRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishBackgroundComposerTempRepoRequest, a, b2);
  }
  static $() {
    return ["PublishBackgroundComposerTempRepoRequest|1 bc_id 9|2 new_name 9|3 visibility #0", PublishBackgroundComposerTempRepoRequest_Visibility];
  }
};
var PublishBackgroundComposerTempRepoRequest_Visibility = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "PublishBackgroundComposerTempRepoRequest.Visibility", [[0, "UNSPECIFIED"], [1, "PRIVATE"], [2, "INTERNAL"]], 1);
var PublishBackgroundComposerTempRepoResponse = class _PublishBackgroundComposerTempRepoResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.owner = "";
    this.name = "";
    this.canonicalRepoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishBackgroundComposerTempRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishBackgroundComposerTempRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishBackgroundComposerTempRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishBackgroundComposerTempRepoResponse, a, b2);
  }
  static $() {
    return ["PublishBackgroundComposerTempRepoResponse|1 owner 9|2 name 9|3 canonical_repo_url 9"];
  }
};
var ReparentBackgroundComposerRequest = class _ReparentBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.parentAgentId = "";
    this.parentAgentType = CloudSubagentParentAgentType.UNSPECIFIED;
    this.subagentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReparentBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReparentBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReparentBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReparentBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["ReparentBackgroundComposerRequest|1 bc_id 9|2 parent_agent_id 9|3 parent_agent_type #0|4 subagent_type 9", CloudSubagentParentAgentType];
  }
};
var ReparentBackgroundComposerResponse = class _ReparentBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReparentBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReparentBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReparentBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReparentBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["ReparentBackgroundComposerResponse"];
  }
};
var SetWorkerManagerRequest = class _SetWorkerManagerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.managerBcId = "";
    this.spawnKind = ManagerSpawnKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetWorkerManagerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetWorkerManagerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetWorkerManagerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetWorkerManagerRequest, a, b2);
  }
  static $() {
    return ["SetWorkerManagerRequest|1 worker_bc_id 9|2 manager_bc_id 9|3 spawn_kind #0|4 tool_call_id 9?", ManagerSpawnKind];
  }
};
var SetWorkerManagerResponse = class _SetWorkerManagerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetWorkerManagerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetWorkerManagerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetWorkerManagerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetWorkerManagerResponse, a, b2);
  }
  static $() {
    return ["SetWorkerManagerResponse"];
  }
};
var CreateProjectWorkerRequest = class _CreateProjectWorkerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.managerBcId = "";
    this.creationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateProjectWorkerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateProjectWorkerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateProjectWorkerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateProjectWorkerRequest, a, b2);
  }
  static $() {
    return ["CreateProjectWorkerRequest|1 manager_bc_id 9|2 creation_id 9|3 start_request #0", StartBackgroundComposerFromSnapshotRequest];
  }
};
var CreateProjectWorkerResponse = class _CreateProjectWorkerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateProjectWorkerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateProjectWorkerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateProjectWorkerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateProjectWorkerResponse, a, b2);
  }
  static $() {
    return ["CreateProjectWorkerResponse|1 composer #0|2 was_swapped_to_default 8?|3 initial_run_id 9?", BackgroundComposer];
  }
};
var ClearWorkerManagerRequest = class _ClearWorkerManagerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerBcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClearWorkerManagerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClearWorkerManagerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClearWorkerManagerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClearWorkerManagerRequest, a, b2);
  }
  static $() {
    return ["ClearWorkerManagerRequest|1 worker_bc_id 9"];
  }
};
var ClearWorkerManagerResponse = class _ClearWorkerManagerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClearWorkerManagerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClearWorkerManagerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClearWorkerManagerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClearWorkerManagerResponse, a, b2);
  }
  static $() {
    return ["ClearWorkerManagerResponse"];
  }
};
var ListWorkersForManagerRequest = class _ListWorkersForManagerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.managerBcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkersForManagerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkersForManagerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkersForManagerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkersForManagerRequest, a, b2);
  }
  static $() {
    return ["ListWorkersForManagerRequest|1 manager_bc_id 9"];
  }
};
var WorkerManagerMembership = class _WorkerManagerMembership extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.managerBcId = "";
    this.spawnKind = ManagerSpawnKind.UNSPECIFIED;
    this.status = BackgroundComposerStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerManagerMembership().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerManagerMembership().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerManagerMembership().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerManagerMembership, a, b2);
  }
  static $() {
    return ["WorkerManagerMembership|1 worker_bc_id 9|2 manager_bc_id 9|3 spawn_kind #0|4 tool_call_id 9?|5 status #1", ManagerSpawnKind, BackgroundComposerStatus];
  }
};
var ListWorkersForManagerResponse = class _ListWorkersForManagerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.memberships = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkersForManagerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkersForManagerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkersForManagerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkersForManagerResponse, a, b2);
  }
  static $() {
    return ["ListWorkersForManagerResponse|1 memberships #0*", WorkerManagerMembership];
  }
};
var BackgroundComposerApprovalPullRequestFile = class _BackgroundComposerApprovalPullRequestFile extends __protoMessage3139 {
  constructor(data) {
    super();
    this.path = "";
    this.additions = 0;
    this.deletions = 0;
    this.hasStats = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerApprovalPullRequestFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerApprovalPullRequestFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerApprovalPullRequestFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerApprovalPullRequestFile, a, b2);
  }
  static $() {
    return ["BackgroundComposerApprovalPullRequestFile|1 path 9|2 additions 5|3 deletions 5|4 has_stats 8"];
  }
};
var BackgroundComposerApprovalPullRequestAuthor = class _BackgroundComposerApprovalPullRequestAuthor extends __protoMessage3139 {
  constructor(data) {
    super();
    this.login = "";
    this.displayName = "";
    this.avatarUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerApprovalPullRequestAuthor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerApprovalPullRequestAuthor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerApprovalPullRequestAuthor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerApprovalPullRequestAuthor, a, b2);
  }
  static $() {
    return ["BackgroundComposerApprovalPullRequestAuthor|1 login 9|2 display_name 9|3 avatar_url 9"];
  }
};
var BackgroundComposerApprovalPullRequest = class _BackgroundComposerApprovalPullRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.title = "";
    this.summary = "";
    this.baseRef = "";
    this.headRef = "";
    this.additions = 0;
    this.deletions = 0;
    this.changedFiles = 0;
    this.url = "";
    this.number = 0;
    this.repository = "";
    this.fileEntries = [];
    this.mergeMethod = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerApprovalPullRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerApprovalPullRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerApprovalPullRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerApprovalPullRequest, a, b2);
  }
  static $() {
    return ["BackgroundComposerApprovalPullRequest|1 title 9|2 summary 9|3 base_ref 9|4 head_ref 9|5 additions 5|6 deletions 5|7 changed_files 5|9 url 9|10 number 5|11 repository 9|12 author #0?|13 file_entries #1*|14 merge_method 9", BackgroundComposerApprovalPullRequestAuthor, BackgroundComposerApprovalPullRequestFile];
  }
};
var BackgroundComposerApprovalUpdate = class _BackgroundComposerApprovalUpdate extends __protoMessage3139 {
  constructor(data) {
    super();
    this.approvalId = "";
    this.state = BackgroundComposerApprovalState.UNSPECIFIED;
    this.kind = BackgroundComposerApprovalKind.UNSPECIFIED;
    this.headline = "";
    this.operation = "";
    this.target = "";
    this.expiresAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerApprovalUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerApprovalUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerApprovalUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerApprovalUpdate, a, b2);
  }
  static $() {
    return ["BackgroundComposerApprovalUpdate|1 approval_id 9|2 state #0|3 kind #1|4 headline 9|5 operation 9|6 target 9|7 expires_at_ms 3|8 pull_request #2?", BackgroundComposerApprovalState, BackgroundComposerApprovalKind, BackgroundComposerApprovalPullRequest];
  }
};
var BackgroundComposerUpdateEvent = class _BackgroundComposerUpdateEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.kind = BackgroundComposerUpdateKind.UNSPECIFIED;
    this.workflowStatus = CloudAgentWorkflowStatus.UNSPECIFIED;
    this.isArchived = false;
    this.isUnread = false;
    this.updatedAtMs = protoInt64.zero;
    this.source = BackgroundComposerSource.UNSPECIFIED;
    this.hasPendingInteraction = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerUpdateEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerUpdateEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerUpdateEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerUpdateEvent, a, b2);
  }
  static $() {
    return ["BackgroundComposerUpdateEvent|1 bc_id 9|2 kind #0|3 workflow_status #1|4 is_archived 8|5 is_unread 8|6 updated_at_ms 3|7 last_message_activity_at_ms 3?|8 source #2|9 manager_bc_id 9?|10 parent_bc_id 9?|11 owning_user_id 3?|12 owning_team_id 5?|13 has_pending_interaction 8|14 manager_spawn_kind 9?|15 approval #3?|16 last_read_at_ms 3?|17 machine_pressure #4?", BackgroundComposerUpdateKind, CloudAgentWorkflowStatus, BackgroundComposerSource, BackgroundComposerApprovalUpdate, BackgroundComposerMachinePressure];
  }
};
var StreamBackgroundComposerUpdatesRequest = class _StreamBackgroundComposerUpdatesRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotIncludeHiddenSources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBackgroundComposerUpdatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBackgroundComposerUpdatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBackgroundComposerUpdatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBackgroundComposerUpdatesRequest, a, b2);
  }
  static $() {
    return ["StreamBackgroundComposerUpdatesRequest|1 resume_cursor 9?|2 team_id 5?|3 snapshot_n 5?|4 snapshot_include_archived 8?|5 snapshot_include_hidden_sources #0*|6 snapshot_include_pinned_state 8?|7 snapshot_include_workers 8?|8 snapshot_include_subagents 8?", BackgroundComposerSource];
  }
};
var StreamBackgroundComposerUpdatesResponse = class _StreamBackgroundComposerUpdatesResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBackgroundComposerUpdatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBackgroundComposerUpdatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBackgroundComposerUpdatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBackgroundComposerUpdatesResponse, a, b2);
  }
  static $() {
    return ["StreamBackgroundComposerUpdatesResponse|1 snapshot #0 response|2 event #1 response|3 heartbeat #2 response", BackgroundComposerUpdatesSnapshot, BackgroundComposerUpdateEventWithCursor, BackgroundComposerUpdatesHeartbeat];
  }
};
var BackgroundComposerUpdatesSnapshot = class _BackgroundComposerUpdatesSnapshot extends __protoMessage3139 {
  constructor(data) {
    super();
    this.resumeCursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerUpdatesSnapshot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerUpdatesSnapshot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerUpdatesSnapshot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerUpdatesSnapshot, a, b2);
  }
  static $() {
    return ["BackgroundComposerUpdatesSnapshot|1 list #0|2 resume_cursor 9", ListBackgroundComposersResponse];
  }
};
var BackgroundComposerUpdateEventWithCursor = class _BackgroundComposerUpdateEventWithCursor extends __protoMessage3139 {
  constructor(data) {
    super();
    this.resumeCursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerUpdateEventWithCursor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerUpdateEventWithCursor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerUpdateEventWithCursor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerUpdateEventWithCursor, a, b2);
  }
  static $() {
    return ["BackgroundComposerUpdateEventWithCursor|1 event #0|2 resume_cursor 9", BackgroundComposerUpdateEvent];
  }
};
var BackgroundComposerUpdatesHeartbeat = class _BackgroundComposerUpdatesHeartbeat extends __protoMessage3139 {
  constructor(data) {
    super();
    this.resumeCursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerUpdatesHeartbeat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerUpdatesHeartbeat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerUpdatesHeartbeat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerUpdatesHeartbeat, a, b2);
  }
  static $() {
    return ["BackgroundComposerUpdatesHeartbeat|1 resume_cursor 9"];
  }
};
var UpdateBackgroundComposerExperimentalModelOptOutRequest = class _UpdateBackgroundComposerExperimentalModelOptOutRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.useExperimentalModelOptOut = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerExperimentalModelOptOutRequest, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerExperimentalModelOptOutRequest|1 bc_id 9|2 use_experimental_model_opt_out 8"];
  }
};
var UpdateBackgroundComposerExperimentalModelOptOutResponse = class _UpdateBackgroundComposerExperimentalModelOptOutResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerExperimentalModelOptOutResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerExperimentalModelOptOutResponse, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerExperimentalModelOptOutResponse"];
  }
};
var RefreshGithubAccessTokenInBackgroundComposerRequest = class _RefreshGithubAccessTokenInBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshGithubAccessTokenInBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["RefreshGithubAccessTokenInBackgroundComposerRequest|1 bc_id 9"];
  }
};
var RefreshGithubAccessTokenInBackgroundComposerResponse = class _RefreshGithubAccessTokenInBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshGithubAccessTokenInBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshGithubAccessTokenInBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["RefreshGithubAccessTokenInBackgroundComposerResponse"];
  }
};
var CreateBackgroundComposerPodRequest = class _CreateBackgroundComposerPodRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.includeSecrets = false;
    this.optimisticPrewarming = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateBackgroundComposerPodRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateBackgroundComposerPodRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateBackgroundComposerPodRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateBackgroundComposerPodRequest, a, b2);
  }
  static $() {
    return ["CreateBackgroundComposerPodRequest|1 devcontainer_starting_point #0|2 include_secrets 8|3 force_cluster 9?|4 force_machine_template 9?|32 client_ip 9?|5 optimistic_prewarming 8", DevcontainerStartingPoint];
  }
};
var CreateBackgroundComposerPodResponse = class _CreateBackgroundComposerPodResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.podId = "";
    this.workspaceRootPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateBackgroundComposerPodResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateBackgroundComposerPodResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateBackgroundComposerPodResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateBackgroundComposerPodResponse, a, b2);
  }
  static $() {
    return ["CreateBackgroundComposerPodResponse|1 pod_id 9|2 workspace_root_path 9"];
  }
};
var PreWarmPodRequest = class _PreWarmPodRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreWarmPodRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreWarmPodRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreWarmPodRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreWarmPodRequest, a, b2);
  }
  static $() {
    return ["PreWarmPodRequest|1 start_request #0", StartBackgroundComposerFromSnapshotRequest];
  }
};
var PreWarmPodResponse = class _PreWarmPodResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreWarmPodResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreWarmPodResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreWarmPodResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreWarmPodResponse, a, b2);
  }
  static $() {
    return ["PreWarmPodResponse"];
  }
};
var WakeBackgroundComposerRequest = class _WakeBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.reason = WakeBackgroundComposerReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WakeBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WakeBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WakeBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WakeBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["WakeBackgroundComposerRequest|1 bc_id 9|2 reason #0", WakeBackgroundComposerReason];
  }
};
var WakeBackgroundComposerResponse = class _WakeBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.signaled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WakeBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WakeBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WakeBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WakeBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["WakeBackgroundComposerResponse|1 signaled 8"];
  }
};
var AttachBackgroundComposerPodRequest = class _AttachBackgroundComposerPodRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.podId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerPodRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerPodRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerPodRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerPodRequest, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerPodRequest|1 pod_id 9|2 last_event_id 9?"];
  }
};
var AttachBackgroundComposerPodResponse = class _AttachBackgroundComposerPodResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerPodResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerPodResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerPodResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerPodResponse, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerPodResponse|1 event #0|2 updated_status #1", AttachBackgroundComposerPodResponse_Event, PodStatus];
  }
};
var AttachBackgroundComposerPodResponse_Event = class _AttachBackgroundComposerPodResponse_Event extends __protoMessage3139 {
  constructor(data) {
    super();
    this.eventId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerPodResponse_Event().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerPodResponse_Event().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerPodResponse_Event().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerPodResponse_Event, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerPodResponse.Event|1 event_id 9|2 event #0", PodEvent];
  }
};
var CreateBackgroundComposerPodSnapshotRequest = class _CreateBackgroundComposerPodSnapshotRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.podId = "";
    this.visibility = ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateBackgroundComposerPodSnapshotRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateBackgroundComposerPodSnapshotRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateBackgroundComposerPodSnapshotRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateBackgroundComposerPodSnapshotRequest, a, b2);
  }
  static $() {
    return ["CreateBackgroundComposerPodSnapshotRequest|1 pod_id 9|2 visibility #0|3 bc_id 9?", ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility];
  }
};
var CreateBackgroundComposerPodSnapshotResponse = class _CreateBackgroundComposerPodSnapshotResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateBackgroundComposerPodSnapshotResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateBackgroundComposerPodSnapshotResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateBackgroundComposerPodSnapshotResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateBackgroundComposerPodSnapshotResponse, a, b2);
  }
  static $() {
    return ["CreateBackgroundComposerPodSnapshotResponse|1 snapshot_id 9"];
  }
};
var ChangeBackgroundComposerSnapshotVisibilityRequest = class _ChangeBackgroundComposerSnapshotVisibilityRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    this.visibility = ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility.UNSPECIFIED;
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeBackgroundComposerSnapshotVisibilityRequest, a, b2);
  }
  static $() {
    return ["ChangeBackgroundComposerSnapshotVisibilityRequest|1 snapshot_id 9|2 visibility #0|3 repo_url 9", ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility];
  }
};
var ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ChangeBackgroundComposerSnapshotVisibilityRequest.Visibility", [[0, "UNSPECIFIED"], [1, "USER"], [2, "REPO_READ_WRITE"], [4, "PUBLIC"], [5, "TEAM"]], 1);
var ChangeBackgroundComposerSnapshotVisibilityResponse = class _ChangeBackgroundComposerSnapshotVisibilityResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeBackgroundComposerSnapshotVisibilityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeBackgroundComposerSnapshotVisibilityResponse, a, b2);
  }
  static $() {
    return ["ChangeBackgroundComposerSnapshotVisibilityResponse"];
  }
};
var GetBackgroundComposerSnapshotInfoRequest = class _GetBackgroundComposerSnapshotInfoRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerSnapshotInfoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerSnapshotInfoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerSnapshotInfoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerSnapshotInfoRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerSnapshotInfoRequest|1 snapshot_id 9"];
  }
};
var GetBackgroundComposerSnapshotInfoResponse = class _GetBackgroundComposerSnapshotInfoResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    this.visibility = ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility.UNSPECIFIED;
    this.repoUrl = "";
    this.createdAtMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerSnapshotInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerSnapshotInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerSnapshotInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerSnapshotInfoResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerSnapshotInfoResponse|1 snapshot_id 9|2 visibility #0|3 repo_url 9|4 created_at_ms 1", ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility];
  }
};
var ListBackgroundComposerSnapshotsByBcIdRequest = class _ListBackgroundComposerSnapshotsByBcIdRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerSnapshotsByBcIdRequest, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerSnapshotsByBcIdRequest|1 bc_id 9|2 use_primary 8?|3 limit 13?"];
  }
};
var BackgroundComposerSnapshotSummary = class _BackgroundComposerSnapshotSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    this.visibility = ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility.UNSPECIFIED;
    this.createdAtMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerSnapshotSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerSnapshotSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerSnapshotSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerSnapshotSummary, a, b2);
  }
  static $() {
    return ["BackgroundComposerSnapshotSummary|1 snapshot_id 9|2 visibility #0|3 created_at_ms 1", ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility];
  }
};
var ListBackgroundComposerSnapshotsByBcIdResponse = class _ListBackgroundComposerSnapshotsByBcIdResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshots = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerSnapshotsByBcIdResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerSnapshotsByBcIdResponse, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerSnapshotsByBcIdResponse|1 snapshots #0*", BackgroundComposerSnapshotSummary];
  }
};
var ListBackgroundComposerSnapshotStatusesByBcIdsRequest = class _ListBackgroundComposerSnapshotStatusesByBcIdsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerSnapshotStatusesByBcIdsRequest, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerSnapshotStatusesByBcIdsRequest|1 bc_ids 9*|2 use_primary 8?"];
  }
};
var BackgroundComposerSnapshotStatusByBcId = class _BackgroundComposerSnapshotStatusByBcId extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerSnapshotStatusByBcId().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerSnapshotStatusByBcId().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerSnapshotStatusByBcId().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerSnapshotStatusByBcId, a, b2);
  }
  static $() {
    return ["BackgroundComposerSnapshotStatusByBcId|1 bc_id 9|2 snapshot_id 9?|3 visibility #0?|4 created_at_ms 1?", ChangeBackgroundComposerSnapshotVisibilityRequest_Visibility];
  }
};
var ListBackgroundComposerSnapshotStatusesByBcIdsResponse = class _ListBackgroundComposerSnapshotStatusesByBcIdsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotStatuses = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerSnapshotStatusesByBcIdsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerSnapshotStatusesByBcIdsResponse, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerSnapshotStatusesByBcIdsResponse|1 snapshot_statuses #0*", BackgroundComposerSnapshotStatusByBcId];
  }
};
var GetBackgroundComposerSnapshotStateRequest = class _GetBackgroundComposerSnapshotStateRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerSnapshotStateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerSnapshotStateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerSnapshotStateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerSnapshotStateRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerSnapshotStateRequest|1 snapshot_id 9"];
  }
};
var GetBackgroundComposerSnapshotStateResponse = class _GetBackgroundComposerSnapshotStateResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    this.state = SnapshotState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerSnapshotStateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerSnapshotStateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerSnapshotStateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerSnapshotStateResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerSnapshotStateResponse|1 snapshot_id 9|2 state #0|3 error_message 9?", SnapshotState];
  }
};
var WatchBackgroundComposerSnapshotStateRequest = class _WatchBackgroundComposerSnapshotStateRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchBackgroundComposerSnapshotStateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchBackgroundComposerSnapshotStateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchBackgroundComposerSnapshotStateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchBackgroundComposerSnapshotStateRequest, a, b2);
  }
  static $() {
    return ["WatchBackgroundComposerSnapshotStateRequest|1 snapshot_id 9"];
  }
};
var WatchBackgroundComposerSnapshotStateResponse = class _WatchBackgroundComposerSnapshotStateResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    this.state = SnapshotState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchBackgroundComposerSnapshotStateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchBackgroundComposerSnapshotStateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchBackgroundComposerSnapshotStateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchBackgroundComposerSnapshotStateResponse, a, b2);
  }
  static $() {
    return ["WatchBackgroundComposerSnapshotStateResponse|1 snapshot_id 9|2 state #0|3 error_message 9?", SnapshotState];
  }
};
var GetBackgroundComposerChangesHashRequest = class _GetBackgroundComposerChangesHashRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerChangesHashRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerChangesHashRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerChangesHashRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerChangesHashRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerChangesHashRequest|1 bc_id 9|2 branch_name 9?"];
  }
};
var GetBackgroundComposerChangesHashResponse = class _GetBackgroundComposerChangesHashResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.hash = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerChangesHashResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerChangesHashResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerChangesHashResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerChangesHashResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerChangesHashResponse|1 hash 9"];
  }
};
var GetBackgroundComposerDiffDetailsRequest = class _GetBackgroundComposerDiffDetailsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerDiffDetailsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerDiffDetailsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerDiffDetailsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerDiffDetailsRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerDiffDetailsRequest|1 bc_id 9|2 branch_name 9?|3 repo_url 9?"];
  }
};
var BackgroundComposerFullDiff = class _BackgroundComposerFullDiff extends __protoMessage3139 {
  constructor(data) {
    super();
    this.path = "";
    this.originalContent = "";
    this.modifiedContent = "";
    this.fullPath = "";
    this.baseRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerFullDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerFullDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerFullDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerFullDiff, a, b2);
  }
  static $() {
    return ["BackgroundComposerFullDiff|1 path 9|2 original_content 9|3 modified_content 9|4 submodule_path 9?|5 git_diff #0|6 full_path 9|7 base_ref 9", GitDiff];
  }
};
var GetBackgroundComposerDiffDetailsResponse = class _GetBackgroundComposerDiffDetailsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.branchName = "";
    this.baseBranch = "";
    this.diffs = [];
    this.gitDiffs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerDiffDetailsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerDiffDetailsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerDiffDetailsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerDiffDetailsResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerDiffDetailsResponse|1 branch_name 9|2 base_branch 9|3 diffs #0*|4 git_diffs #1*", BackgroundComposerFullDiff, GitDiff];
  }
};
var ListPrCodeTourRevisionsRequest = class _ListPrCodeTourRevisionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrCodeTourRevisionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrCodeTourRevisionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrCodeTourRevisionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrCodeTourRevisionsRequest, a, b2);
  }
  static $() {
    return ["ListPrCodeTourRevisionsRequest|1 bc_id 9|2 include_markdown 8?|3 head_sha 9?"];
  }
};
var PrCodeTourStackMember = class _PrCodeTourStackMember extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.headSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrCodeTourStackMember().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrCodeTourStackMember().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrCodeTourStackMember().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrCodeTourStackMember, a, b2);
  }
  static $() {
    return ["PrCodeTourStackMember|1 pr_url 9|2 head_sha 9"];
  }
};
var PrCodeTourRevisionInfo = class _PrCodeTourRevisionInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.revisionId = "";
    this.source = PrCodeTourRevisionSource.UNSPECIFIED;
    this.feedback = "";
    this.status = PrCodeTourRevisionStatus.UNSPECIFIED;
    this.markdown = "";
    this.errorMessage = "";
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.headSha = "";
    this.baseSha = "";
    this.stackId = "";
    this.stackMembers = [];
    this.rangeBaseSha = "";
    this.rangeHeadSha = "";
    this.steps = [];
    this.reviewerIntent = "";
    this.reviewedSectionIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrCodeTourRevisionInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrCodeTourRevisionInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrCodeTourRevisionInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrCodeTourRevisionInfo, a, b2);
  }
  static $() {
    return ["PrCodeTourRevisionInfo|1 revision_id 9|2 source #0|3 feedback 9|4 status #1|5 markdown 9|6 error_message 9|7 created_at_ms 3|8 updated_at_ms 3|9 head_sha 9|10 base_sha 9|11 stack_id 9|12 stack_members #2*|13 range_base_sha 9|14 range_head_sha 9|15 steps #3*|16 reviewer_intent 9|17 reviewed_section_ids 9*", PrCodeTourRevisionSource, PrCodeTourRevisionStatus, PrCodeTourStackMember, PrCodeTourRevisionStep];
  }
};
var PrCodeTourRevisionStep = class _PrCodeTourRevisionStep extends __protoMessage3139 {
  constructor(data) {
    super();
    this.stepId = "";
    this.headingId = "";
    this.text = "";
    this.depth = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrCodeTourRevisionStep().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrCodeTourRevisionStep().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrCodeTourRevisionStep().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrCodeTourRevisionStep, a, b2);
  }
  static $() {
    return ["PrCodeTourRevisionStep|1 step_id 9|2 heading_id 9|3 text 9|4 depth 5"];
  }
};
var ListPrCodeTourRevisionsResponse = class _ListPrCodeTourRevisionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.revisions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrCodeTourRevisionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrCodeTourRevisionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrCodeTourRevisionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrCodeTourRevisionsResponse, a, b2);
  }
  static $() {
    return ["ListPrCodeTourRevisionsResponse|1 revisions #0*", PrCodeTourRevisionInfo];
  }
};
var GetPrCodeTourStackContextRequest = class _GetPrCodeTourStackContextRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrCodeTourStackContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrCodeTourStackContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrCodeTourStackContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrCodeTourStackContextRequest, a, b2);
  }
  static $() {
    return ["GetPrCodeTourStackContextRequest|1 bc_id 9|2 pr_url 9"];
  }
};
var GetPrCodeTourStackContextResponse = class _GetPrCodeTourStackContextResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.stackId = "";
    this.members = [];
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrCodeTourStackContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrCodeTourStackContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrCodeTourStackContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrCodeTourStackContextResponse, a, b2);
  }
  static $() {
    return ["GetPrCodeTourStackContextResponse|1 stack_id 9|2 members #0*|3 pr_url 9", PrCodeTourStackMember];
  }
};
var GeneratePrCodeTourForStackRequest = class _GeneratePrCodeTourForStackRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GeneratePrCodeTourForStackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GeneratePrCodeTourForStackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GeneratePrCodeTourForStackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GeneratePrCodeTourForStackRequest, a, b2);
  }
  static $() {
    return ["GeneratePrCodeTourForStackRequest|1 bc_id 9|2 pr_url 9"];
  }
};
var GeneratePrCodeTourForStackResponse = class _GeneratePrCodeTourForStackResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.revisionId = "";
    this.message = "";
    this.scheduled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GeneratePrCodeTourForStackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GeneratePrCodeTourForStackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GeneratePrCodeTourForStackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GeneratePrCodeTourForStackResponse, a, b2);
  }
  static $() {
    return ["GeneratePrCodeTourForStackResponse|1 revision_id 9|2 message 9|3 scheduled 8"];
  }
};
var SetPrCodeTourSectionReviewedRequest = class _SetPrCodeTourSectionReviewedRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.revisionId = "";
    this.sectionId = "";
    this.reviewed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetPrCodeTourSectionReviewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetPrCodeTourSectionReviewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetPrCodeTourSectionReviewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetPrCodeTourSectionReviewedRequest, a, b2);
  }
  static $() {
    return ["SetPrCodeTourSectionReviewedRequest|1 bc_id 9|2 revision_id 9|3 section_id 9|4 reviewed 8"];
  }
};
var SetPrCodeTourSectionReviewedResponse = class _SetPrCodeTourSectionReviewedResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.applied = false;
    this.message = "";
    this.reviewedSectionIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetPrCodeTourSectionReviewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetPrCodeTourSectionReviewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetPrCodeTourSectionReviewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetPrCodeTourSectionReviewedResponse, a, b2);
  }
  static $() {
    return ["SetPrCodeTourSectionReviewedResponse|1 applied 8|2 message 9|3 reviewed_section_ids 9*"];
  }
};
var SideChatInfo = class _SideChatInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.parentBcId = "";
    this.seedTurnCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SideChatInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SideChatInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SideChatInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SideChatInfo, a, b2);
  }
  static $() {
    return ["SideChatInfo|1 parent_bc_id 9|2 seed_turn_count 5"];
  }
};
var StartSideChatBackgroundComposerRequest = class _StartSideChatBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.parentBcId = "";
    this.creationSource = BackgroundComposerSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartSideChatBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartSideChatBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartSideChatBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartSideChatBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["StartSideChatBackgroundComposerRequest|1 parent_bc_id 9|2 name 9?|3 creation_source #0|4 creation_id 9?", BackgroundComposerSource];
  }
};
var StartSideChatBackgroundComposerResponse = class _StartSideChatBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartSideChatBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartSideChatBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartSideChatBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartSideChatBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["StartSideChatBackgroundComposerResponse|1 composer #0", BackgroundComposer];
  }
};
var ListBackgroundComposerChildrenRequest = class _ListBackgroundComposerChildrenRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.parentBcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerChildrenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerChildrenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerChildrenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerChildrenRequest, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerChildrenRequest|1 parent_bc_id 9"];
  }
};
var ListBackgroundComposerChildrenResponse = class _ListBackgroundComposerChildrenResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.composers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerChildrenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerChildrenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerChildrenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerChildrenResponse, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerChildrenResponse|1 composers #0*", BackgroundComposer];
  }
};
var OwnerIdentifier = class _OwnerIdentifier extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.ownerType = OwnerType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OwnerIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OwnerIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OwnerIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OwnerIdentifier, a, b2);
  }
  static $() {
    return ["OwnerIdentifier|1 id 9|2 owner_type #0", OwnerType];
  }
};
var OwnerFilter = class _OwnerFilter extends __protoMessage3139 {
  constructor(data) {
    super();
    this.owners = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OwnerFilter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OwnerFilter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OwnerFilter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OwnerFilter, a, b2);
  }
  static $() {
    return ["OwnerFilter|1 owners #0*", OwnerIdentifier];
  }
};
var PrAgentView = class _PrAgentView extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrAgentView().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrAgentView().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrAgentView().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrAgentView, a, b2);
  }
  static $() {
    return ["PrAgentView|1 pr_url 9|2 head_sha 9?|3 code_tour #0?", ComposerCapabilityContext_GithubPRContext_CodeTourContext];
  }
};
var ListPrBackgroundComposersRequest = class _ListPrBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.pageSize = 0;
    this.involvedPageToken = "";
    this.otherPageToken = "";
    this.includeAgentKinds = false;
    this.includeWatchers = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["ListPrBackgroundComposersRequest|1 pr_url 9|2 expected_scope #0|3 page_size 5|4 involved_page_token 9|5 other_page_token 9|6 selected_bc_id 9?|7 include_agent_kinds 8|8 include_watchers 8", CloudAgentRequestScope];
  }
};
var ListPrBackgroundComposersResponse = class _ListPrBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.involvedComposers = [];
    this.otherComposers = [];
    this.nextInvolvedPageToken = "";
    this.nextOtherPageToken = "";
    this.involvedCountCapped = 0;
    this.selectedHasDirectActivity = false;
    this.participants = [];
    this.participantDetailsUnavailable = false;
    this.subscribedBcIds = [];
    this.watchingComposers = [];
    this.coordinatorComposers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["ListPrBackgroundComposersResponse|1 involved_composers #0*|2 other_composers #0*|3 next_involved_page_token 9|4 next_other_page_token 9|5 involved_count_capped 13|6 sole_involved_bc_id 9?|7 selected_composer #0?|8 selected_has_direct_activity 8|9 participants #1*|10 participant_details_unavailable 8|11 subscribed_bc_ids 9*|12 watching_composers #0*|13 coordinator_composers #0*", BackgroundComposer, BackgroundComposerParticipant];
  }
};
var ListDetailedBackgroundComposersRequest = class _ListDetailedBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.includeTeamWide = false;
    this.includeDiff = false;
    this.bcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListDetailedBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListDetailedBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListDetailedBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListDetailedBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["ListDetailedBackgroundComposersRequest|1 include_team_wide 8|2 bc_id 9?|3 n 5?|4 include_diff 8|5 cursor 9?|6 bc_ids 9*|7 owner_filter #0?|8 repo_url_prefix 9?|9 pr_url 9?|10 include_archived 8?|11 status_only 8?|12 expected_scope #1", OwnerFilter, CloudAgentRequestScope];
  }
};
var ListDetailedBackgroundComposersResponse = class _ListDetailedBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.composers = [];
    this.participants = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListDetailedBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListDetailedBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListDetailedBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListDetailedBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["ListDetailedBackgroundComposersResponse|1 composers #0*|2 participants #1*", DetailedBackgroundComposer, BackgroundComposerParticipant];
  }
};
var CloudAgentDashboardRunSort = class _CloudAgentDashboardRunSort extends __protoMessage3139 {
  constructor(data) {
    super();
    this.field = CloudAgentDashboardRunSortField.UNSPECIFIED;
    this.direction = CloudAgentDashboardRunSortDirection.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentDashboardRunSort().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentDashboardRunSort().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentDashboardRunSort().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentDashboardRunSort, a, b2);
  }
  static $() {
    return ["CloudAgentDashboardRunSort|1 field #0|2 direction #1", CloudAgentDashboardRunSortField, CloudAgentDashboardRunSortDirection];
  }
};
var CloudAgentRunsCursor = class _CloudAgentRunsCursor extends __protoMessage3139 {
  constructor(data) {
    super();
    this.createdAtMs = protoInt64.zero;
    this.bcId = "";
    this.id = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentRunsCursor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentRunsCursor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentRunsCursor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentRunsCursor, a, b2);
  }
  static $() {
    return ["CloudAgentRunsCursor|1 created_at_ms 3|2 bc_id 9|3 id 3"];
  }
};
var CloudAgentDashboardRunFilter = class _CloudAgentDashboardRunFilter extends __protoMessage3139 {
  constructor(data) {
    super();
    this.createdAfterMs = protoInt64.zero;
    this.createdBeforeMs = protoInt64.zero;
    this.triggers = [];
    this.statuses = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentDashboardRunFilter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentDashboardRunFilter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentDashboardRunFilter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentDashboardRunFilter, a, b2);
  }
  static $() {
    return ["CloudAgentDashboardRunFilter|1 team_id 9?|2 created_after_ms 3|3 created_before_ms 3|4 triggers #0*|5 statuses #1*|6 created_by_user_id 3?", CloudAgentSourceCategory, CloudAgentDashboardRunStatus];
  }
};
var ListCloudAgentRunsForDashboardRequest = class _ListCloudAgentRunsForDashboardRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCloudAgentRunsForDashboardRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCloudAgentRunsForDashboardRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCloudAgentRunsForDashboardRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCloudAgentRunsForDashboardRequest, a, b2);
  }
  static $() {
    return ["ListCloudAgentRunsForDashboardRequest|1 filter #0|2 sort #1|3 cursor #2?", CloudAgentDashboardRunFilter, CloudAgentDashboardRunSort, CloudAgentRunsCursor];
  }
};
var CloudAgentDashboardRunRow = class _CloudAgentDashboardRunRow extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.createdAtMs = protoInt64.zero;
    this.trigger = CloudAgentSourceCategory.UNSPECIFIED;
    this.status = CloudAgentDashboardRunStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentDashboardRunRow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentDashboardRunRow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentDashboardRunRow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentDashboardRunRow, a, b2);
  }
  static $() {
    return ["CloudAgentDashboardRunRow|1 bc_id 9|2 created_at_ms 3|3 trigger #0|4 created_by_user_id 3?|5 created_by_display 9?|6 environment_name 9?|7 environment_public_id 9?|8 repo_url 9?|9 status #1", CloudAgentSourceCategory, CloudAgentDashboardRunStatus];
  }
};
var ListCloudAgentRunsForDashboardResponse = class _ListCloudAgentRunsForDashboardResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.rows = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCloudAgentRunsForDashboardResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCloudAgentRunsForDashboardResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCloudAgentRunsForDashboardResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCloudAgentRunsForDashboardResponse, a, b2);
  }
  static $() {
    return ["ListCloudAgentRunsForDashboardResponse|1 rows #0*|2 has_more 8|3 next_cursor #1?", CloudAgentDashboardRunRow, CloudAgentRunsCursor];
  }
};
var AggregateCloudAgentRunsForDashboardRequest = class _AggregateCloudAgentRunsForDashboardRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.tzOffsetMinutes = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AggregateCloudAgentRunsForDashboardRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AggregateCloudAgentRunsForDashboardRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AggregateCloudAgentRunsForDashboardRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AggregateCloudAgentRunsForDashboardRequest, a, b2);
  }
  static $() {
    return ["AggregateCloudAgentRunsForDashboardRequest|1 filter #0|2 tz_offset_minutes 5", CloudAgentDashboardRunFilter];
  }
};
var CloudAgentDashboardRunDayBucket = class _CloudAgentDashboardRunDayBucket extends __protoMessage3139 {
  constructor(data) {
    super();
    this.dayStartMs = protoInt64.zero;
    this.successCount = protoInt64.zero;
    this.warningCount = protoInt64.zero;
    this.failureCount = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentDashboardRunDayBucket().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentDashboardRunDayBucket().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentDashboardRunDayBucket().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentDashboardRunDayBucket, a, b2);
  }
  static $() {
    return ["CloudAgentDashboardRunDayBucket|1 day_start_ms 3|2 success_count 3|3 warning_count 3|4 failure_count 3"];
  }
};
var AggregateCloudAgentRunsForDashboardResponse = class _AggregateCloudAgentRunsForDashboardResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buckets = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AggregateCloudAgentRunsForDashboardResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AggregateCloudAgentRunsForDashboardResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AggregateCloudAgentRunsForDashboardResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AggregateCloudAgentRunsForDashboardResponse, a, b2);
  }
  static $() {
    return ["AggregateCloudAgentRunsForDashboardResponse|1 buckets #0*", CloudAgentDashboardRunDayBucket];
  }
};
var GetCloudAgentRunForDashboardRequest = class _GetCloudAgentRunForDashboardRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentRunForDashboardRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentRunForDashboardRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentRunForDashboardRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentRunForDashboardRequest, a, b2);
  }
  static $() {
    return ["GetCloudAgentRunForDashboardRequest|1 bc_id 9"];
  }
};
var GetCloudAgentRunForDashboardResponse = class _GetCloudAgentRunForDashboardResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentRunForDashboardResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentRunForDashboardResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentRunForDashboardResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentRunForDashboardResponse, a, b2);
  }
  static $() {
    return ["GetCloudAgentRunForDashboardResponse|1 row #0|2 name 9", CloudAgentDashboardRunRow];
  }
};
var CloudAgentRunEvent = class _CloudAgentRunEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    this.createdAtMs = protoInt64.zero;
    this.category = CloudAgentRunEventCategory.UNSPECIFIED;
    this.logLevel = CloudAgentRunEventLogLevel.UNSPECIFIED;
    this.kind = "";
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentRunEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentRunEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentRunEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentRunEvent, a, b2);
  }
  static $() {
    return ["CloudAgentRunEvent|1 public_id 9|2 created_at_ms 3|3 category #0|4 log_level #1|5 kind 9|6 title 9|7 detail 9?|8 link_url 9?", CloudAgentRunEventCategory, CloudAgentRunEventLogLevel];
  }
};
var ListCloudAgentRunEventsForDashboardRequest = class _ListCloudAgentRunEventsForDashboardRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCloudAgentRunEventsForDashboardRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCloudAgentRunEventsForDashboardRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCloudAgentRunEventsForDashboardRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCloudAgentRunEventsForDashboardRequest, a, b2);
  }
  static $() {
    return ["ListCloudAgentRunEventsForDashboardRequest|1 bc_id 9"];
  }
};
var ListCloudAgentRunEventsForDashboardResponse = class _ListCloudAgentRunEventsForDashboardResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCloudAgentRunEventsForDashboardResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCloudAgentRunEventsForDashboardResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCloudAgentRunEventsForDashboardResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCloudAgentRunEventsForDashboardResponse, a, b2);
  }
  static $() {
    return ["ListCloudAgentRunEventsForDashboardResponse|1 events #0*", CloudAgentRunEvent];
  }
};
var PauseBackgroundComposerRequest = class _PauseBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.source = BackgroundComposerSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PauseBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PauseBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PauseBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PauseBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["PauseBackgroundComposerRequest|1 bc_id 9|3 source #0|4 run_id 9?|5 expected_scope #1", BackgroundComposerSource, CloudAgentRequestScope];
  }
};
var PauseBackgroundComposerResponse = class _PauseBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PauseBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PauseBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PauseBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PauseBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["PauseBackgroundComposerResponse"];
  }
};
var CancelBackgroundComposerToolCallRequest = class _CancelBackgroundComposerToolCallRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.toolCallId = "";
    this.source = BackgroundComposerSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelBackgroundComposerToolCallRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelBackgroundComposerToolCallRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelBackgroundComposerToolCallRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelBackgroundComposerToolCallRequest, a, b2);
  }
  static $() {
    return ["CancelBackgroundComposerToolCallRequest|1 bc_id 9|2 tool_call_id 9|3 source #0", BackgroundComposerSource];
  }
};
var CancelBackgroundComposerToolCallResponse = class _CancelBackgroundComposerToolCallResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.accepted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelBackgroundComposerToolCallResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelBackgroundComposerToolCallResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelBackgroundComposerToolCallResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelBackgroundComposerToolCallResponse, a, b2);
  }
  static $() {
    return ["CancelBackgroundComposerToolCallResponse|1 accepted 8"];
  }
};
var ArchiveBackgroundComposerRequest = class _ArchiveBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.unarchive = false;
    this.onlyNotifyRunner = false;
    this.source = BackgroundComposerSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ArchiveBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ArchiveBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ArchiveBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ArchiveBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["ArchiveBackgroundComposerRequest|1 bc_id 9|2 unarchive 8|3 only_notify_runner 8|4 source #0|5 close_pull_request 8?", BackgroundComposerSource];
  }
};
var ArchiveBackgroundComposerResponse = class _ArchiveBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.closedPullRequest = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ArchiveBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ArchiveBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ArchiveBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ArchiveBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["ArchiveBackgroundComposerResponse|1 closed_pull_request 8"];
  }
};
var ArchiveRepoBackgroundComposersRequest = class _ArchiveRepoBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrls = [];
    this.source = BackgroundComposerSource.UNSPECIFIED;
    this.dryRun = false;
    this.removeRepoEnvironmentJson = false;
    this.includeSources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ArchiveRepoBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ArchiveRepoBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ArchiveRepoBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ArchiveRepoBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["ArchiveRepoBackgroundComposersRequest|1 repo_urls 9*|2 team_id 5?|3 source #0|4 dry_run 8|5 remove_repo_environment_json 8|6 environment_scope #1?|7 include_sources #0*", BackgroundComposerSource, RepoArchiveEnvironmentScope];
  }
};
var RepoArchiveEnvironmentScope = class _RepoArchiveEnvironmentScope extends __protoMessage3139 {
  constructor(data) {
    super();
    this.selector = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoArchiveEnvironmentScope().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoArchiveEnvironmentScope().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoArchiveEnvironmentScope().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoArchiveEnvironmentScope, a, b2);
  }
  static $() {
    return ["RepoArchiveEnvironmentScope|1 environment_public_id 9 selector|2 none 8 selector|3 unnamed_or_none 8 selector"];
  }
};
var ArchiveRepoBackgroundComposersResponse = class _ArchiveRepoBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.archivedBcIds = [];
    this.failedBcIds = [];
    this.remainingCount = 0;
    this.runningCount = 0;
    this.hasRepoEnvironmentJson = false;
    this.removedRepoEnvironmentJson = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ArchiveRepoBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ArchiveRepoBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ArchiveRepoBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ArchiveRepoBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["ArchiveRepoBackgroundComposersResponse|1 archived_bc_ids 9*|2 failed_bc_ids 9*|3 remaining_count 5|4 running_count 5|5 has_repo_environment_json 8|6 removed_repo_environment_json 8"];
  }
};
var DeleteBackgroundComposerRequest = class _DeleteBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["DeleteBackgroundComposerRequest|1 bc_id 9"];
  }
};
var DeleteBackgroundComposerResponse = class _DeleteBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["DeleteBackgroundComposerResponse"];
  }
};
var ResumeBackgroundComposerRequest = class _ResumeBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResumeBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResumeBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResumeBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResumeBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["ResumeBackgroundComposerRequest|1 bc_id 9"];
  }
};
var ResumeBackgroundComposerResponse = class _ResumeBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResumeBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResumeBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResumeBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResumeBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["ResumeBackgroundComposerResponse"];
  }
};
var GetCursorServerUrlRequest = class _GetCursorServerUrlRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.commit = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCursorServerUrlRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCursorServerUrlRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCursorServerUrlRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCursorServerUrlRequest, a, b2);
  }
  static $() {
    return ["GetCursorServerUrlRequest|1 bc_id 9|2 commit 9|3 connection_token 9?"];
  }
};
var GetCursorServerUrlResponse = class _GetCursorServerUrlResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.host = "";
    this.port = 0;
    this.connectionToken = "";
    this.headers = [];
    this.upgradePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCursorServerUrlResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCursorServerUrlResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCursorServerUrlResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCursorServerUrlResponse, a, b2);
  }
  static $() {
    return ["GetCursorServerUrlResponse|1 host 9|2 port 5|3 connection_token 9|4 headers #0*|5 upgrade_path 9", GetCursorServerUrlResponse_Header];
  }
};
var GetCursorServerUrlResponse_Header = class _GetCursorServerUrlResponse_Header extends __protoMessage3139 {
  constructor(data) {
    super();
    this.key = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCursorServerUrlResponse_Header().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCursorServerUrlResponse_Header().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCursorServerUrlResponse_Header().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCursorServerUrlResponse_Header, a, b2);
  }
  static $() {
    return ["GetCursorServerUrlResponse.Header|1 key 9|2 value 9"];
  }
};
var WarmCursorServerDownloadRequest = class _WarmCursorServerDownloadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.commit = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WarmCursorServerDownloadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WarmCursorServerDownloadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WarmCursorServerDownloadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WarmCursorServerDownloadRequest, a, b2);
  }
  static $() {
    return ["WarmCursorServerDownloadRequest|1 bc_id 9|2 commit 9"];
  }
};
var WarmCursorServerDownloadResponse = class _WarmCursorServerDownloadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.alreadyDownloaded = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WarmCursorServerDownloadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WarmCursorServerDownloadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WarmCursorServerDownloadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WarmCursorServerDownloadResponse, a, b2);
  }
  static $() {
    return ["WarmCursorServerDownloadResponse|1 already_downloaded 8"];
  }
};
var MakePRBackgroundComposerRequest = class _MakePRBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MakePRBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MakePRBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MakePRBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MakePRBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["MakePRBackgroundComposerRequest|1 bc_id 9|2 workflow_id 9?|3 branch_name 9?"];
  }
};
var MakePRBackgroundComposerResponse = class _MakePRBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.branchName = "";
    this.hasCommits = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MakePRBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MakePRBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MakePRBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MakePRBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["MakePRBackgroundComposerResponse|1 pr_url 9|2 branch_name 9|3 has_commits 8|4 owner 9?|5 repo 9?"];
  }
};
var OpenPRBackgroundComposerRequest = class _OpenPRBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.agentStateBlobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OpenPRBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OpenPRBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OpenPRBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OpenPRBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["OpenPRBackgroundComposerRequest|1 bc_id 9|2 title 9?|3 body 9?|4 base_branch 9?|5 draft 8?|6 open_as_cursor_github_app 8?|7 skip_reviewer_request 8?|8 agent_state_blob_id 12|9 workflow_id 9?|10 branch_name 9?|11 repo_url 9?"];
  }
};
var OpenPRBackgroundComposerResponse = class _OpenPRBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.prNumber = 0;
    this.branchName = "";
    this.baseBranch = "";
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OpenPRBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OpenPRBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OpenPRBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OpenPRBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["OpenPRBackgroundComposerResponse|1 pr_url 9|2 pr_number 5|3 branch_name 9|4 base_branch 9|5 success 8|6 error 9?"];
  }
};
var ListBackgroundComposersRequest = class _ListBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.n = 0;
    this.includeTeamWide = false;
    this.additionalRepoUrls = [];
    this.includeStatus = false;
    this.includeSources = [];
    this.includeHiddenSources = [];
    this.includeBackgroundAgentAccessAggregate = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["ListBackgroundComposersRequest|1 n 5|2 include_team_wide 8|3 bc_id 9?|4 preferred_repo_url 9?|5 additional_repo_urls 9*|6 include_status 8|7 include_sources #0*|8 owner_filter #1?|9 last_message_activity_at_ms_offset 1?|10 include_archived 8?|11 should_include_collaborators 8?|12 team_id 5?|13 include_hidden_sources #0*|14 preferred_workspace_binding_id 9?|15 include_pinned_state 8?|16 include_workers 8?|17 include_subagents 8?|18 use_page_tokens 8?|19 page_token 9?|21 include_background_agent_access_aggregate 8", BackgroundComposerSource, OwnerFilter];
  }
};
var BackgroundComposer = class _BackgroundComposer extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.createdAtMs = 0;
    this.updatedAtMs = 0;
    this.workspaceRootPath = "";
    this.isOwnedByDifferentTeamMember = false;
    this.name = "";
    this.branchName = "";
    this.hasStartedVm = false;
    this.repoUrl = "";
    this.isArchived = false;
    this.nId = "";
    this.isKilled = false;
    this.status = BackgroundComposerStatus.UNSPECIFIED;
    this.workflowStatus = CloudAgentWorkflowStatus.UNSPECIFIED;
    this.isUnread = false;
    this.source = BackgroundComposerSource.UNSPECIFIED;
    this.githubIssueId = "";
    this.slackChannelId = "";
    this.slackMessageTimestamp = "";
    this.slackTeamId = "";
    this.linearIssueId = "";
    this.linearOrgId = "";
    this.promptGroupId = "";
    this.prUrl = "";
    this.isPrMerged = false;
    this.triggeredPrincipalType = "";
    this.triggeredPrincipalId = "";
    this.visibility = "";
    this.ensembleStatus = EnsembleStatus.UNSPECIFIED;
    this.participantUserIds = [];
    this.repoUrls = [];
    this.initiatedEnvSetup = false;
    this.startedAsNewProject = false;
    this.hasPendingInteraction = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposer, a, b2);
  }
  static $() {
    return ["BackgroundComposer|1 bc_id 9|2 created_at_ms 1|20 updated_at_ms 1|3 workspace_root_path 9|4 is_owned_by_different_team_member 8|5 name 9|6 branch_name 9|7 has_started_vm 8|8 repo_url 9|9 is_archived 8|10 n_id 9|11 is_killed 8|12 status #0|77 workflow_status #1|13 is_unread 8|14 source #2|24 github_issue_id 9|15 slack_channel_id 9|16 slack_message_timestamp 9|17 slack_team_id 9|18 linear_issue_id 9|19 linear_org_id 9|21 prompt_group_id 9|22 pr_url 9|23 is_pr_merged 8|25 lines_added 5?|26 lines_removed 5?|27 files_changed 5?|28 model_details #3?|29 triggered_principal_type 9|30 triggered_principal_id 9|31 visibility 9|32 ensemble_status #4|33 workflow_id 9?|34 agent_session_id 9?|35 kickoff_message_id 9?|36 grind_phase 9?|37 commit_count 5?|38 latest_commit_sha 9?|39 latest_commit_message 9?|40 last_message_activity_at_ms 1?|41 owning_service_account 9?|42 owning_service_account_name 9?|43 pr_status #5?|57 external_source_metadata #6?|58 worker_id 9?|59 requested_model #7?|60 use_private_worker 8?|45 participant_user_ids 5*|61 cloud_subagent_parent #8?|62 repo_urls 9*|63 environment_name 9?|64 private_workspace_identifier #9?|65 private_worker_display_name 9?|66 workspace_binding #10?|67 use_experimental_model_opt_out 8?|68 side_chat_info #11?|69 manager_agent_id 9?|70 initiated_env_setup 8|71 started_as_new_project 8|72 project_metadata #12?|73 environment_public_id 9?|74 publish_button_hidden 8?|75 publish_button_reconnect 8?|76 has_pending_interaction 8|78 last_read_at_ms 3?", BackgroundComposerStatus, CloudAgentWorkflowStatus, BackgroundComposerSource, ModelDetails, EnsembleStatus, PRStatus, ExternalSourceMetadata, RequestedModel, CloudSubagentParentReference, PrivateWorkspaceIdentifier, AgentWorkspaceBinding, SideChatInfo, ProjectMetadata];
  }
};
var BackgroundComposerParticipant = class _BackgroundComposerParticipant extends __protoMessage3139 {
  constructor(data) {
    super();
    this.userId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerParticipant().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerParticipant().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerParticipant().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerParticipant, a, b2);
  }
  static $() {
    return ["BackgroundComposerParticipant|1 user_id 5|2 display_name 9?|3 email 9?|4 profile_picture_url 9?"];
  }
};
var NamedAgentProfile = class _NamedAgentProfile extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamedAgentProfile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamedAgentProfile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamedAgentProfile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamedAgentProfile, a, b2);
  }
  static $() {
    return ["NamedAgentProfile|1 profile_picture_url 9?"];
  }
};
var NamedAgentSession = class _NamedAgentSession extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.bcId = "";
    this.sessionKey = "";
    this.sessionKind = "";
    this.createdAtMs = 0;
    this.updatedAtMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamedAgentSession().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamedAgentSession().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamedAgentSession().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamedAgentSession, a, b2);
  }
  static $() {
    return ["NamedAgentSession|1 named_agent_id 9|2 bc_id 9|3 session_key 9|4 session_kind 9|10 created_at_ms 1|11 updated_at_ms 1|12 last_awakened_at_ms 1?|13 slack_channel_id 9?|14 slack_channel_name 9?|15 slack_permalink 9?"];
  }
};
var NamedAgent = class _NamedAgent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.homeBcId = "";
    this.name = "";
    this.createdAtMs = 0;
    this.updatedAtMs = 0;
    this.pinned = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamedAgent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamedAgent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamedAgent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamedAgent, a, b2);
  }
  static $() {
    return ["NamedAgent|1 named_agent_id 9|2 home_bc_id 9|3 name 9|4 creator #0?|5 created_at_ms 1|6 updated_at_ms 1|7 pinned 8|8 profile #1?", BackgroundComposerParticipant, NamedAgentProfile];
  }
};
var ListNamedAgentsRequest = class _ListNamedAgentsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamedAgentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamedAgentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamedAgentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamedAgentsRequest, a, b2);
  }
  static $() {
    return ["ListNamedAgentsRequest"];
  }
};
var ListNamedAgentsResponse = class _ListNamedAgentsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.agents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamedAgentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamedAgentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamedAgentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamedAgentsResponse, a, b2);
  }
  static $() {
    return ["ListNamedAgentsResponse|1 agents #0*", NamedAgent];
  }
};
var ListNamedAgentSessionsRequest = class _ListNamedAgentSessionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamedAgentSessionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamedAgentSessionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamedAgentSessionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamedAgentSessionsRequest, a, b2);
  }
  static $() {
    return ["ListNamedAgentSessionsRequest|1 named_agent_id 9|2 page_size 5?|3 page_token 9?"];
  }
};
var ListNamedAgentSessionsResponse = class _ListNamedAgentSessionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.sessions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamedAgentSessionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamedAgentSessionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamedAgentSessionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamedAgentSessionsResponse, a, b2);
  }
  static $() {
    return ["ListNamedAgentSessionsResponse|1 sessions #0*|2 next_page_token 9?", NamedAgentSession];
  }
};
var EventSubscription = class _EventSubscription extends __protoMessage3139 {
  constructor(data) {
    super();
    this.subscriptionId = "";
    this.subscriptionType = "";
    this.subscriptionArgsJson = "";
    this.openTimeMs = 0;
    this.expiresAtMs = 0;
    this.deliveryCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EventSubscription().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EventSubscription().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EventSubscription().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EventSubscription, a, b2);
  }
  static $() {
    return ["EventSubscription|1 subscription_id 9|2 subscription_type 9|3 subscription_args_json 9|4 subscription_metadata_json 9?|10 open_time_ms 1|11 expires_at_ms 1|12 last_delivered_at_ms 1?|13 delivery_count 5"];
  }
};
var ListEventSubscriptionsRequest = class _ListEventSubscriptionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.bcId = "";
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEventSubscriptionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEventSubscriptionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEventSubscriptionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEventSubscriptionsRequest, a, b2);
  }
  static $() {
    return ["ListEventSubscriptionsRequest|1 named_agent_id 9|2 bc_id 9|3 conversation_id 9"];
  }
};
var ListEventSubscriptionsResponse = class _ListEventSubscriptionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.subscriptions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEventSubscriptionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEventSubscriptionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEventSubscriptionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEventSubscriptionsResponse, a, b2);
  }
  static $() {
    return ["ListEventSubscriptionsResponse|1 subscriptions #0*", EventSubscription];
  }
};
var CloseEventSubscriptionRequest = class _CloseEventSubscriptionRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.subscriptionId = "";
    this.bcId = "";
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloseEventSubscriptionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloseEventSubscriptionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloseEventSubscriptionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloseEventSubscriptionRequest, a, b2);
  }
  static $() {
    return ["CloseEventSubscriptionRequest|1 named_agent_id 9|2 subscription_id 9|3 bc_id 9|4 conversation_id 9"];
  }
};
var CloseEventSubscriptionResponse = class _CloseEventSubscriptionResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.closed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloseEventSubscriptionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloseEventSubscriptionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloseEventSubscriptionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloseEventSubscriptionResponse, a, b2);
  }
  static $() {
    return ["CloseEventSubscriptionResponse|1 closed 8"];
  }
};
var ExternalSourceMetadata = class _ExternalSourceMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ExternalSourceMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ExternalSourceMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ExternalSourceMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ExternalSourceMetadata, a, b2);
  }
  static $() {
    return ["ExternalSourceMetadata|1 slack #0?|2 linear #1?|3 github #2?|4 gitlab #3?", SlackSourceMetadata, LinearSourceMetadata, GithubSourceMetadata, GitlabSourceMetadata];
  }
};
var PrivateWorkspaceIdentifier = class _PrivateWorkspaceIdentifier extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.uri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkspaceIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkspaceIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkspaceIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkspaceIdentifier, a, b2);
  }
  static $() {
    return ["PrivateWorkspaceIdentifier|1 id 9|2 uri 9"];
  }
};
var AgentWorkspaceBinding = class _AgentWorkspaceBinding extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.displayName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentWorkspaceBinding().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentWorkspaceBinding().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentWorkspaceBinding().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentWorkspaceBinding, a, b2);
  }
  static $() {
    return ["AgentWorkspaceBinding|1 id 9|2 display_name 9|3 private_workspace_identifier #0?", PrivateWorkspaceIdentifier];
  }
};
var CloudSubagentTaskLineage = class _CloudSubagentTaskLineage extends __protoMessage3139 {
  constructor(data) {
    super();
    this.parentToolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudSubagentTaskLineage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudSubagentTaskLineage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudSubagentTaskLineage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudSubagentTaskLineage, a, b2);
  }
  static $() {
    return ["CloudSubagentTaskLineage|1 parent_tool_call_id 9"];
  }
};
var CloudSubagentSubscriptionResourceLineage = class _CloudSubagentSubscriptionResourceLineage extends __protoMessage3139 {
  constructor(data) {
    super();
    this.routeId = "";
    this.routeKind = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudSubagentSubscriptionResourceLineage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudSubagentSubscriptionResourceLineage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudSubagentSubscriptionResourceLineage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudSubagentSubscriptionResourceLineage, a, b2);
  }
  static $() {
    return ["CloudSubagentSubscriptionResourceLineage|1 route_id 9|2 route_kind 9"];
  }
};
var CloudSubagentParentReference = class _CloudSubagentParentReference extends __protoMessage3139 {
  constructor(data) {
    super();
    this.parentAgentId = "";
    this.parentToolCallId = "";
    this.parentAgentType = CloudSubagentParentAgentType.UNSPECIFIED;
    this.lineage = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudSubagentParentReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudSubagentParentReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudSubagentParentReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudSubagentParentReference, a, b2);
  }
  static $() {
    return ["CloudSubagentParentReference|1 parent_agent_id 9|2 parent_tool_call_id 9|3 parent_agent_type #0|5 subagent_type_name 9?|6 parent_spawn_kind #1?|7 parent_spawn_id 9?|8 task #2 lineage|9 subscription_resource #3 lineage", CloudSubagentParentAgentType, CloudSubagentParentSpawnKind, CloudSubagentTaskLineage, CloudSubagentSubscriptionResourceLineage];
  }
};
var SlackSourceMetadata = class _SlackSourceMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackSourceMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackSourceMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackSourceMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackSourceMetadata, a, b2);
  }
  static $() {
    return ["SlackSourceMetadata|1 channel_id 9?|2 channel_name 9?|3 team_id 9?|4 message_timestamp 9?|5 message_permalink 9?"];
  }
};
var LinearSourceMetadata = class _LinearSourceMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearSourceMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearSourceMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearSourceMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearSourceMetadata, a, b2);
  }
  static $() {
    return ["LinearSourceMetadata|1 issue_id 9?|2 org_id 9?|3 issue_identifier 9?|4 issue_title 9?"];
  }
};
var GithubSourceMetadata = class _GithubSourceMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GithubSourceMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GithubSourceMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GithubSourceMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GithubSourceMetadata, a, b2);
  }
  static $() {
    return ["GithubSourceMetadata|1 issue_id 9?|2 pr_number 5?|3 pr_title 9?|4 issue_title 9?|5 issue_url 9?"];
  }
};
var GitlabSourceMetadata = class _GitlabSourceMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitlabSourceMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitlabSourceMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitlabSourceMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitlabSourceMetadata, a, b2);
  }
  static $() {
    return ["GitlabSourceMetadata|1 mr_iid 5?|2 mr_title 9?|3 mr_web_url 9?"];
  }
};
var PinBackgroundComposersRequest = class _PinBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PinBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PinBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PinBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PinBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["PinBackgroundComposersRequest|1 bc_ids 9*"];
  }
};
var PinBackgroundComposersResponse = class _PinBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PinBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PinBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PinBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PinBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["PinBackgroundComposersResponse"];
  }
};
var UnpinBackgroundComposersRequest = class _UnpinBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnpinBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnpinBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnpinBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnpinBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["UnpinBackgroundComposersRequest|1 bc_ids 9*"];
  }
};
var UnpinBackgroundComposersResponse = class _UnpinBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnpinBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnpinBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnpinBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnpinBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["UnpinBackgroundComposersResponse"];
  }
};
var ListBackgroundComposersResponse = class _ListBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.composers = [];
    this.didLoadStatus = false;
    this.hasMore = false;
    this.participants = [];
    this.pinnedBcIds = [];
    this.didLoadPinnedState = false;
    this.canUseBackgroundAgents = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["ListBackgroundComposersResponse|1 composers #0*|2 did_load_status 8|3 has_more 8|4 next_page_offset 1?|5 participants #1*|6 pinned_bc_ids 9*|7 did_load_pinned_state 8|8 next_page_token 9?|10 can_use_background_agents 8", BackgroundComposer, BackgroundComposerParticipant];
  }
};
var EnvironmentRepoEntry = class _EnvironmentRepoEntry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.scmRepoNodeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentRepoEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentRepoEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentRepoEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentRepoEntry, a, b2);
  }
  static $() {
    return ["EnvironmentRepoEntry|1 repo_url 9|2 scm_repo_node_id 9|3 git_enterprise_uuid 9?"];
  }
};
var EnvironmentJsonFileLocation = class _EnvironmentJsonFileLocation extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentJsonFileLocation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentJsonFileLocation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentJsonFileLocation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentJsonFileLocation, a, b2);
  }
  static $() {
    return ["EnvironmentJsonFileLocation|1 repo_url 9|2 path 9"];
  }
};
var EnvironmentRepoConfig = class _EnvironmentRepoConfig extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentRepoConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentRepoConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentRepoConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentRepoConfig, a, b2);
  }
  static $() {
    return ["EnvironmentRepoConfig|1 repos #0*|2 environment_json_location #1?", EnvironmentRepoEntry, EnvironmentJsonFileLocation];
  }
};
var RepoStartingRef = class _RepoStartingRef extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.ref = "";
    this.baseRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoStartingRef().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoStartingRef().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoStartingRef().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoStartingRef, a, b2);
  }
  static $() {
    return ["RepoStartingRef|1 repo_url 9|2 ref 9|3 base_ref 9"];
  }
};
var DevcontainerStartingPoint = class _DevcontainerStartingPoint extends __protoMessage3139 {
  constructor(data) {
    super();
    this.url = "";
    this.ref = "";
    this.userExtensions = [];
    this.cursorServerCommit = "";
    this.environmentJsonOverride = "";
    this.dontAllowReadingEnvironmentJsonFromDatabase = false;
    this.skipBuildCaches = false;
    this.startingRefs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DevcontainerStartingPoint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DevcontainerStartingPoint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DevcontainerStartingPoint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DevcontainerStartingPoint, a, b2);
  }
  static $() {
    return ["DevcontainerStartingPoint|1 url 9|2 ref 9|4 user_extensions 9*|5 cursor_server_commit 9|6 environment_json_override 9|8 git_diff_to_apply #0|9 dont_allow_reading_environment_json_from_database 8|10 skip_build_caches 8|11 repo_config #1?|12 environment_name 9?|13 environment_id 3?|15 environment_public_id 9?|14 starting_refs #2*", GitDiff, EnvironmentRepoConfig, RepoStartingRef];
  }
};
var GrindModeConfig = class _GrindModeConfig extends __protoMessage3139 {
  constructor(data) {
    super();
    this.timeBudgetMs = protoInt64.zero;
    this.phase = GrindModeConfig_Phase.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrindModeConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrindModeConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrindModeConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrindModeConfig, a, b2);
  }
  static $() {
    return ["GrindModeConfig|1 time_budget_ms 3|2 start_time_unix_ms 3?|3 phase #0|4 auto_proceed_after_planning 8?|5 time_budget_seconds 3?|6 grind_prompt_calibrate_effort 8?", GrindModeConfig_Phase];
  }
};
var GrindModeConfig_Phase = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "GrindModeConfig.Phase", [[0, "UNSPECIFIED"], [1, "PLANNING"], [2, "EXECUTING"], [3, "CONTROLLER"]], 1);
var EnvironmentSetupRunStartedMetadata = class _EnvironmentSetupRunStartedMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    this.setupSessionId = "";
    this.resumedSession = false;
    this.repoUrls = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentSetupRunStartedMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentSetupRunStartedMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentSetupRunStartedMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentSetupRunStartedMetadata, a, b2);
  }
  static $() {
    return ["EnvironmentSetupRunStartedMetadata|1 setup_session_id 9|2 surface 9?|3 entrypoint 9?|4 resumed_session 8|5 repo_url 9?|6 repo_urls 9*"];
  }
};
var StartBackgroundComposerFromSnapshotRequest = class _StartBackgroundComposerFromSnapshotRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotNameOrId = "";
    this.prompt = "";
    this.richPrompt = "";
    this.files = [];
    this.additionalModelDetails = [];
    this.requestedModels = [];
    this.snapshotWorkspaceRootPath = "";
    this.startForAuthIdOnTeam = "";
    this.autoBranch = false;
    this.returnImmediately = false;
    this.images = [];
    this.conversationHistory = [];
    this.documentationIdentifiers = [];
    this.externalLinks = [];
    this.bcId = "";
    this.preFetchedBlobs = [];
    this.labels = [];
    this.skills = [];
    this.customSubagents = [];
    this.requestedAdditionalStoreIds = [];
    this.storeMounts = [];
    this.runEnvVars = {};
    this.externalMetadata = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartBackgroundComposerFromSnapshotRequest, a, b2);
  }
  static $() {
    return ["StartBackgroundComposerFromSnapshotRequest|1 snapshot_name_or_id 9|11 devcontainer_starting_point #0|2 prompt 9|17 rich_prompt 9|3 files #1*|4 model_details #2|16 additional_model_details #2*|58 requested_models #3*|5 repository_info #4|6 snapshot_workspace_root_path 9|8 start_for_auth_id_on_team 9|9 auto_branch 8|10 return_immediately 8|12 force_vm_backend 9?|15 force_cluster 9?|29 force_machine_template 9?|13 images #5*|14 repo_url 9?|18 conversation_history #6*|23 source #7?|19 documentation_identifiers 9*|20 use_web 8?|21 external_links #8*|22 bc_id 9|24 slack_channel_id 9?|25 slack_message_timestamp 9?|27 slack_team_id 9?|28 linear_issue_id 9?|40 github_issue_id 9?|26 add_initial_message_to_responses 8?|30 linear_org_id 9?|33 linear_issue_identifier 9?|94 external_source_metadata #9?|31 base_branch 9?|38 custom_branch_name 9?|32 client_ip 9?|34 prompt_group_id 9?|53 should_synthesize 8?|35 pod_id 9?|36 wait_on_branch_name 8?|37 auto_create_pr 8?|39 webhook_config #10?|41 starting_message_type #11?|42 open_as_cursor_github_app 8?|43 skip_reviewer_request 8?|44 conversation_action #12?|45 test_mode_enabled 8?|60 skip_user_install_commands_and_cloud_testing 8?|46 agent_session_id 9?|47 conversation_state #13?|48 pre_fetched_blobs #14*|49 kickoff_message_id 9?|50 name 9?|51 enable_setup_vm_environment_tool 8?|52 grind_mode_config #15?|73 automation_id 9?|55 use_private_worker 8?|59 labels #16*|97 private_worker_owner_filter #17?|100 private_workspace_identifier #18?|110 workspace_binding #19?|56 force_non_chargeable 8?|57 pr_url 9?|75 effort_mode #20?|76 auto_proceed_after_planning 8?|77 time_budget_seconds 3?|78 time_budget_ms 3?|79 init_empty_repo 8?|80 skills #21*|81 cloud_plugin_manifest_json 9?|82 cloud_plugin_snapshot_token 9?|95 mcp_config_json 9?|96 custom_subagents #22*|98 team_id 5?|99 cloud_subagent_parent #23?|101 requested_additional_store_ids 9*|108 store_mounts #24*|104 is_slack_v2 8?|113 is_slack_v1_5 8?|105 named_agent_id 9?|106 named_agent_session_key 9?|107 named_agent_session_kind 9?|109 named_agent_profile #25?|111 run_env_vars 9,9|112 selected_private_worker_id 9?|114 use_experimental_model_opt_out 8?|115 forked_from_bc_id 9?|116 requested_environment_build_id 9?|117 external_metadata 9,9|118 environment_setup_run_started_metadata #26?|119 project_details #27?|120 disable_pr_management_tool 8?|121 system_prompt_spec #28?|122 project_metadata #29?|123 new_project_seeded_empty_root 8?|124 manager_spawn_kind #30?|125 grok_bot_handoff_lineage #31?|126 same_vm_machine_owner_bc_id 9?|127 manager_bc_id 9?|128 manager_tool_call_id 9?|129 expected_scope #32|130 pr_agent_view #33|131 placement_grant_id 9?|132 agent_store_owner_bc_id 9?", DevcontainerStartingPoint, StartBackgroundComposerFromSnapshotRequest_File, ModelDetails, RequestedModel, HeadlessAgenticComposerRepositoryInfo, ImageProto, ConversationMessage, BackgroundComposerSource, ComposerExternalLink, ExternalSourceMetadata, StartBackgroundComposerFromSnapshotRequest_WebhookConfig, StartingMessageType, ConversationAction, ConversationStateStructure, PreFetchedBlob2, GrindModeConfig, PrivateWorkerLabel, PrivateWorkerOwnerFilter, PrivateWorkspaceIdentifier, AgentWorkspaceBinding, CloudAgentEffortMode, AgentSkill, CustomSubagent, CloudSubagentParentReference, AgentStoreMount, NamedAgentProfile, EnvironmentSetupRunStartedMetadata, ProjectDetails, SystemPromptSpec, ProjectMetadata, ManagerSpawnKind, GrokBotHandoffLineage, CloudAgentRequestScope, PrAgentView];
  }
};
var StartBackgroundComposerFromSnapshotRequest_File = class _StartBackgroundComposerFromSnapshotRequest_File extends __protoMessage3139 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_File().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_File().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_File().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartBackgroundComposerFromSnapshotRequest_File, a, b2);
  }
  static $() {
    return ["StartBackgroundComposerFromSnapshotRequest.File|1 relative_workspace_path 9|2 contents 9"];
  }
};
var StartBackgroundComposerFromSnapshotRequest_WebhookConfig = class _StartBackgroundComposerFromSnapshotRequest_WebhookConfig extends __protoMessage3139 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_WebhookConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_WebhookConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartBackgroundComposerFromSnapshotRequest_WebhookConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartBackgroundComposerFromSnapshotRequest_WebhookConfig, a, b2);
  }
  static $() {
    return ["StartBackgroundComposerFromSnapshotRequest.WebhookConfig|1 url 9|2 secret 9?"];
  }
};
var GrokBotHandoffLineage = class _GrokBotHandoffLineage extends __protoMessage3139 {
  constructor(data) {
    super();
    this.grokBotAgentId = "";
    this.launchingRequestId = "";
    this.launchingRootRequestId = "";
    this.launchingToolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrokBotHandoffLineage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrokBotHandoffLineage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrokBotHandoffLineage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrokBotHandoffLineage, a, b2);
  }
  static $() {
    return ["GrokBotHandoffLineage|1 grok_bot_agent_id 9|2 launching_request_id 9|3 launching_root_request_id 9|4 launching_tool_call_id 9"];
  }
};
var CloudOnboardingAutoEnvSetupAcceptResult = class _CloudOnboardingAutoEnvSetupAcceptResult extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudOnboardingAutoEnvSetupAcceptResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudOnboardingAutoEnvSetupAcceptResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudOnboardingAutoEnvSetupAcceptResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudOnboardingAutoEnvSetupAcceptResult, a, b2);
  }
  static $() {
    return ["CloudOnboardingAutoEnvSetupAcceptResult|1 bc_id 9|2 repo_url 9"];
  }
};
var StartBackgroundComposerFromSnapshotResponse = class _StartBackgroundComposerFromSnapshotResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartBackgroundComposerFromSnapshotResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartBackgroundComposerFromSnapshotResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartBackgroundComposerFromSnapshotResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartBackgroundComposerFromSnapshotResponse, a, b2);
  }
  static $() {
    return ["StartBackgroundComposerFromSnapshotResponse|1 composer #0|2 was_swapped_to_default 8?|3 initial_run_id 9?|4 auto_env_setup #1?", BackgroundComposer, CloudOnboardingAutoEnvSetupAcceptResult];
  }
};
var StartCloudOnboardingRequest = class _StartCloudOnboardingRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scmProvider = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartCloudOnboardingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartCloudOnboardingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartCloudOnboardingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartCloudOnboardingRequest, a, b2);
  }
  static $() {
    return ["StartCloudOnboardingRequest|1 start_request #0|2 scm_provider 9", StartBackgroundComposerFromSnapshotRequest];
  }
};
var StartChangeMonitorOnboardingRequest = class _StartChangeMonitorOnboardingRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartChangeMonitorOnboardingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartChangeMonitorOnboardingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartChangeMonitorOnboardingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartChangeMonitorOnboardingRequest, a, b2);
  }
  static $() {
    return ["StartChangeMonitorOnboardingRequest|1 start_request #0", StartBackgroundComposerFromSnapshotRequest];
  }
};
var StartCloudOnboardingHeuristicEnvSetupRequest = class _StartCloudOnboardingHeuristicEnvSetupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scmProvider = "";
    this.excludedRepositoryKeys = [];
    this.excludedRepositoryNodeIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartCloudOnboardingHeuristicEnvSetupRequest, a, b2);
  }
  static $() {
    return ["StartCloudOnboardingHeuristicEnvSetupRequest|1 scm_provider 9|2 excluded_repository_keys 9*|3 excluded_repository_node_ids 9*|4 max_results 5?"];
  }
};
var StartCloudOnboardingHeuristicEnvSetupResponse = class _StartCloudOnboardingHeuristicEnvSetupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.admitted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartCloudOnboardingHeuristicEnvSetupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartCloudOnboardingHeuristicEnvSetupResponse, a, b2);
  }
  static $() {
    return ["StartCloudOnboardingHeuristicEnvSetupResponse|1 admitted 8"];
  }
};
var ForkBackgroundComposerRequest = class _ForkBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.sourceBcId = "";
    this.mode = ForkBackgroundComposerMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ForkBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ForkBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ForkBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ForkBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["ForkBackgroundComposerRequest|1 source_bc_id 9|2 mode #0|3 name 9?|4 turn_count 13?", ForkBackgroundComposerMode];
  }
};
var ForkBackgroundComposerResponse = class _ForkBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.sourceBcId = "";
    this.mode = ForkBackgroundComposerMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ForkBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ForkBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ForkBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ForkBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["ForkBackgroundComposerResponse|1 composer #0|2 bc_id 9|3 source_bc_id 9|4 mode #1|5 initial_run_id 9?", BackgroundComposer, ForkBackgroundComposerMode];
  }
};
var AttachBackgroundComposerLogsRequest = class _AttachBackgroundComposerLogsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerLogsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerLogsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerLogsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerLogsRequest, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerLogsRequest|1 bc_id 9|2 last_event_id 9?|3 worker_index 13?|4 last_docker_build_event_id 9?|5 last_setup_event_id 9?|6 associated_pod_key 9?|7 expected_scope #0", CloudAgentRequestScope];
  }
};
var AttachBackgroundComposerLogsResponse = class _AttachBackgroundComposerLogsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerLogsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerLogsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerLogsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerLogsResponse, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerLogsResponse|1 event #0|2 updated_status #1|3 start_error #2", AttachBackgroundComposerLogsResponse_Event, PodStatus, ErrorDetails];
  }
};
var AttachBackgroundComposerLogsResponse_Event = class _AttachBackgroundComposerLogsResponse_Event extends __protoMessage3139 {
  constructor(data) {
    super();
    this.eventId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerLogsResponse_Event().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerLogsResponse_Event().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerLogsResponse_Event().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerLogsResponse_Event, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerLogsResponse.Event|1 event_id 9|2 event #0|3 waterfall_update #1", PodEvent, WaterfallUpdate];
  }
};
var AttachBackgroundComposerRequest = class _AttachBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerRequest|1 bc_id 9|2 starting_index 5?"];
  }
};
var AttachBackgroundComposerResponse = class _AttachBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.startingCommit = "";
    this.baseBranch = "";
    this.statusUpdate = BackgroundComposerStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["AttachBackgroundComposerResponse|1 headless_agentic_composer_response #0|2 prompt #1|4 starting_commit 9|5 base_branch 9|6 status_update #2|3 diff_since_start #3", HeadlessAgenticComposerResponse, HeadlessAgenticComposerPrompt, BackgroundComposerStatus, GitDiff];
  }
};
var StreamConversationRequest = class _StreamConversationRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.shouldSendPrefetchedBlobsFirst = false;
    this.preFetchedBlobIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationRequest, a, b2);
  }
  static $() {
    return ["StreamConversationRequest|1 bc_id 9|2 offset_key 9?|3 filter_heavy_step_data 8?|4 should_send_prefetched_blobs_first 8|5 pre_fetched_blob_ids 12*|6 prefetch_only_last_step_per_turn 8?|7 send_stream_signal_after_prefetch 8?|8 max_blobs_after_prefetch 13?|9 allow_streaming_when_terminal_status 8?|10 pre_fetched_blob_filter #0?|11 include_stream_heartbeats 8?|12 purpose #1?|13 expected_scope #2|14 max_turns_to_prefetch 13?", PreFetchedBlobFilter, StreamConversationPurpose, CloudAgentRequestScope];
  }
};
var PreFetchedBlobFilter = class _PreFetchedBlobFilter extends __protoMessage3139 {
  constructor(data) {
    super();
    this.seed = 0;
    this.segmentLength = 0;
    this.segmentCount = 0;
    this.fingerprintBits = 0;
    this.slotCount = 0;
    this.packedFingerprints = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreFetchedBlobFilter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreFetchedBlobFilter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreFetchedBlobFilter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreFetchedBlobFilter, a, b2);
  }
  static $() {
    return ["PreFetchedBlobFilter|1 seed 13|2 segment_length 13|3 segment_count 13|4 fingerprint_bits 13|5 slot_count 13|6 packed_fingerprints 12"];
  }
};
var ReadOnlySharedPodLifecycleEvent = class _ReadOnlySharedPodLifecycleEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.phase = ReadOnlySharedPodLifecycleEvent_Phase.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadOnlySharedPodLifecycleEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadOnlySharedPodLifecycleEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadOnlySharedPodLifecycleEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadOnlySharedPodLifecycleEvent, a, b2);
  }
  static $() {
    return ["ReadOnlySharedPodLifecycleEvent|1 phase #0", ReadOnlySharedPodLifecycleEvent_Phase];
  }
};
var ReadOnlySharedPodLifecycleEvent_Phase = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "ReadOnlySharedPodLifecycleEvent.Phase", [[0, "UNSPECIFIED"], [2, "AWAITING_FULL_POD"], [3, "INACTIVE"]], 1);
var WorkerLifecycleEvent = class _WorkerLifecycleEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerIndex = 0;
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerLifecycleEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerLifecycleEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerLifecycleEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerLifecycleEvent, a, b2);
  }
  static $() {
    return ["WorkerLifecycleEvent|1 worker_index 13|2 creating #0 event", Empty];
  }
};
var PreFetchedBlob2 = class _PreFetchedBlob extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = new Uint8Array(0);
    this.value = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreFetchedBlob().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreFetchedBlob().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreFetchedBlob().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreFetchedBlob, a, b2);
  }
  static $() {
    return ["PreFetchedBlob|1 id 12|2 value 12"];
  }
};
var StreamConversationResponse = class _StreamConversationResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse, a, b2);
  }
  static $() {
    return ["StreamConversationResponse|3 initial_state #0 message|4 interaction_update_with_offset #1 message|5 cloud_agent_state_with_id_and_offset #2 message|6 workflow_status_with_offset #3 message|7 prefetched_blobs #4 message|8 stream_signal #5 message|9 transient_error_with_offset #6 message|10 dev_banner_message #7 message|11 worker_lifecycle_event_with_offset #8 message|12 interaction_query_with_offset #9 message|13 read_only_shared_pod_lifecycle_event_with_offset #10 message|14 stream_heartbeat #11 message", StreamConversationResponse_InitialState, StreamConversationResponse_InteractionUpdateWithOffset, StreamConversationResponse_CloudAgentStateWithIdAndOffset, StreamConversationResponse_WorkflowStatusWithOffset, StreamConversationResponse_PrefetchedBlobs, StreamConversationResponse_StreamSignal, StreamConversationResponse_TransientErrorWithOffset, StreamConversationResponse_DevBannerMessage, StreamConversationResponse_WorkerLifecycleEventWithOffset, StreamConversationResponse_InteractionQueryWithOffset, StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset, StreamConversationResponse_StreamHeartbeat];
  }
};
var StreamConversationResponse_StreamSignal = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "StreamConversationResponse.StreamSignal", [[0, "UNSPECIFIED"], [1, "END_OF_INITIAL_STATE_PREFETCH"]], 1);
var StreamConversationResponse_PrefetchedBlobs = class _StreamConversationResponse_PrefetchedBlobs extends __protoMessage3139 {
  constructor(data) {
    super();
    this.preFetchedBlobs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_PrefetchedBlobs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_PrefetchedBlobs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_PrefetchedBlobs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_PrefetchedBlobs, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.PrefetchedBlobs|1 pre_fetched_blobs #0*", PreFetchedBlob2];
  }
};
var StreamConversationResponse_InitialState = class _StreamConversationResponse_InitialState extends __protoMessage3139 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.preFetchedBlobs = [];
    this.workflowStatus = CloudAgentWorkflowStatus.UNSPECIFIED;
    this.userDisplayInfos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_InitialState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_InitialState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_InitialState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_InitialState, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.InitialState|1 blob_id 12|2 cloud_agent_state #0|4 pre_fetched_blobs #1*|5 workflow_status #2|6 user_display_infos #3*", CloudAgentState, PreFetchedBlob2, CloudAgentWorkflowStatus, UserDisplayInfo];
  }
};
var StreamConversationResponse_CloudAgentStateWithIdAndOffset = class _StreamConversationResponse_CloudAgentStateWithIdAndOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    this.blobId = new Uint8Array(0);
    this.preFetchedBlobs = [];
    this.userDisplayInfos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_CloudAgentStateWithIdAndOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_CloudAgentStateWithIdAndOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_CloudAgentStateWithIdAndOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_CloudAgentStateWithIdAndOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.CloudAgentStateWithIdAndOffset|1 offset_key 9|2 blob_id 12|3 cloud_agent_state #0|4 pre_fetched_blobs #1*|5 user_display_infos #2*", CloudAgentState, PreFetchedBlob2, UserDisplayInfo];
  }
};
var StreamConversationResponse_InteractionUpdateWithOffset = class _StreamConversationResponse_InteractionUpdateWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    this.userDisplayInfos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_InteractionUpdateWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_InteractionUpdateWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_InteractionUpdateWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_InteractionUpdateWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.InteractionUpdateWithOffset|1 offset_key 9|2 interaction_update #0|3 user_display_infos #1*", InteractionUpdate, UserDisplayInfo];
  }
};
var StreamConversationResponse_InteractionQueryWithOffset = class _StreamConversationResponse_InteractionQueryWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_InteractionQueryWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_InteractionQueryWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_InteractionQueryWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_InteractionQueryWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.InteractionQueryWithOffset|1 offset_key 9|2 interaction_query #0", InteractionQuery];
  }
};
var StreamConversationResponse_WorkflowStatusWithOffset = class _StreamConversationResponse_WorkflowStatusWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    this.workflowStatus = CloudAgentWorkflowStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_WorkflowStatusWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_WorkflowStatusWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_WorkflowStatusWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_WorkflowStatusWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.WorkflowStatusWithOffset|1 offset_key 9|2 workflow_status #0", CloudAgentWorkflowStatus];
  }
};
var StreamConversationResponse_TransientErrorWithOffset = class _StreamConversationResponse_TransientErrorWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_TransientErrorWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_TransientErrorWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_TransientErrorWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_TransientErrorWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.TransientErrorWithOffset|1 offset_key 9|2 transient_error #0", TransientError];
  }
};
var StreamConversationResponse_DevBannerMessage = class _StreamConversationResponse_DevBannerMessage extends __protoMessage3139 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_DevBannerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_DevBannerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_DevBannerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_DevBannerMessage, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.DevBannerMessage|1 text 9"];
  }
};
var StreamConversationResponse_StreamHeartbeat = class _StreamConversationResponse_StreamHeartbeat extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_StreamHeartbeat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_StreamHeartbeat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_StreamHeartbeat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_StreamHeartbeat, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.StreamHeartbeat"];
  }
};
var StreamConversationResponse_WorkerLifecycleEventWithOffset = class _StreamConversationResponse_WorkerLifecycleEventWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_WorkerLifecycleEventWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_WorkerLifecycleEventWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_WorkerLifecycleEventWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_WorkerLifecycleEventWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.WorkerLifecycleEventWithOffset|1 offset_key 9|2 worker_lifecycle_event #0", WorkerLifecycleEvent];
  }
};
var StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset = class _StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset extends __protoMessage3139 {
  constructor(data) {
    super();
    this.offsetKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamConversationResponse_ReadOnlySharedPodLifecycleEventWithOffset, a, b2);
  }
  static $() {
    return ["StreamConversationResponse.ReadOnlySharedPodLifecycleEventWithOffset|1 offset_key 9|2 read_only_shared_pod_lifecycle_event #0", ReadOnlySharedPodLifecycleEvent];
  }
};
var GetLatestAgentConversationStateRequest = class _GetLatestAgentConversationStateRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLatestAgentConversationStateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLatestAgentConversationStateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLatestAgentConversationStateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLatestAgentConversationStateRequest, a, b2);
  }
  static $() {
    return ["GetLatestAgentConversationStateRequest|1 bc_id 9"];
  }
};
var LatestAgentConversationState = class _LatestAgentConversationState extends __protoMessage3139 {
  constructor(data) {
    super();
    this.numPriorInteractionUpdates = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LatestAgentConversationState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LatestAgentConversationState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LatestAgentConversationState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LatestAgentConversationState, a, b2);
  }
  static $() {
    return ["LatestAgentConversationState|1 conversation_state #0|2 num_prior_interaction_updates 13|3 conversation_rewind_epoch 13?", ConversationStateStructure];
  }
};
var GetLatestAgentConversationStateResponse = class _GetLatestAgentConversationStateResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.preFetchedBlobs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLatestAgentConversationStateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLatestAgentConversationStateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLatestAgentConversationStateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLatestAgentConversationStateResponse, a, b2);
  }
  static $() {
    return ["GetLatestAgentConversationStateResponse|1 latest_conversation_state #0|2 pre_fetched_blobs #1*", LatestAgentConversationState, PreFetchedBlob2];
  }
};
var GetBlobForAgentKVRequest = class _GetBlobForAgentKVRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.blobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobForAgentKVRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobForAgentKVRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobForAgentKVRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobForAgentKVRequest, a, b2);
  }
  static $() {
    return ["GetBlobForAgentKVRequest|1 bc_id 9|2 blob_id 12|3 expected_scope #0", CloudAgentRequestScope];
  }
};
var GetBlobForAgentKVResponse = class _GetBlobForAgentKVResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.blobData = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobForAgentKVResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobForAgentKVResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobForAgentKVResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobForAgentKVResponse, a, b2);
  }
  static $() {
    return ["GetBlobForAgentKVResponse|1 blob_data 12"];
  }
};
var HeadlessAgenticComposerResponse = class _HeadlessAgenticComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.text = "";
    this.isMessageDone = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerResponse, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerResponse|1 text 9|2 tool_call #0?|3 final_tool_result #1?|6 streamed_back_tool_call #2?|4 user_message #3|5 is_message_done 8|7 error #4?|8 human_message #5|9 thinking #6?|10 thinking_duration_ms 5?|12 thinking_style #7?|11 status #8?", ClientSideToolV2Call, HeadlessAgenticComposerResponse_FinalToolResult, StreamedBackToolCall, HeadlessAgenticComposerResponse_UserMessage, HeadlessAgenticComposerResponse_Error, ConversationMessage, ConversationMessage_Thinking, ConversationMessage_ThinkingStyle, HeadlessAgenticComposerResponse_Status];
  }
};
var HeadlessAgenticComposerResponse_UserMessage = class _HeadlessAgenticComposerResponse_UserMessage extends __protoMessage3139 {
  constructor(data) {
    super();
    this.text = "";
    this.richText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerResponse_UserMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerResponse_UserMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerResponse_UserMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerResponse_UserMessage, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerResponse.UserMessage|1 text 9|2 rich_text 9"];
  }
};
var HeadlessAgenticComposerResponse_FinalToolResult = class _HeadlessAgenticComposerResponse_FinalToolResult extends __protoMessage3139 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerResponse_FinalToolResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerResponse_FinalToolResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerResponse_FinalToolResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerResponse_FinalToolResult, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerResponse.FinalToolResult|1 tool_call_id 9|2 result #0", ClientSideToolV2Result];
  }
};
var HeadlessAgenticComposerResponse_Error = class _HeadlessAgenticComposerResponse_Error extends __protoMessage3139 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerResponse_Error().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerResponse_Error().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerResponse_Error().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerResponse_Error, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerResponse.Error|1 message 9|2 error_details #0", ErrorDetails];
  }
};
var HeadlessAgenticComposerResponse_Status = class _HeadlessAgenticComposerResponse_Status extends __protoMessage3139 {
  constructor(data) {
    super();
    this.type = HeadlessAgenticComposerResponse_Status_StatusType.UNSPECIFIED;
    this.message = "";
    this.isComplete = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerResponse_Status().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerResponse_Status().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerResponse_Status().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerResponse_Status, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerResponse.Status|1 type #0|2 message 9|3 is_complete 8", HeadlessAgenticComposerResponse_Status_StatusType];
  }
};
var HeadlessAgenticComposerResponse_Status_StatusType = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "HeadlessAgenticComposerResponse.Status.StatusType", [[0, "UNSPECIFIED"], [1, "INDEX_SYNC"], [2, "GENERIC"]], 1);
var HeadlessAgenticComposerRepositoryInfo = class _HeadlessAgenticComposerRepositoryInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.pathEncryptionKey = "";
    this.repositoryInfoShouldQueryStaging = false;
    this.repositoryInfoShouldQueryProd = false;
    this.repoQueryAuthToken = "";
    this.shouldSyncIndex = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerRepositoryInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerRepositoryInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerRepositoryInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerRepositoryInfo, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerRepositoryInfo|1 repository_info #0|2 path_encryption_key 9|3 repository_info_should_query_staging 8|4 repository_info_should_query_prod 8|5 repo_query_auth_token 9|6 should_sync_index 8|7 query_only_repo_access #1", RepositoryInfo, QueryOnlyRepoAccess];
  }
};
var HeadlessAgenticComposerPrompt = class _HeadlessAgenticComposerPrompt extends __protoMessage3139 {
  constructor(data) {
    super();
    this.text = "";
    this.richText = "";
    this.fileSelections = [];
    this.fileAttachments = [];
    this.images = [];
    this.conversationHistory = [];
    this.documentationIdentifiers = [];
    this.externalLinks = [];
    this.blobDataPerMessage = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerPrompt().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerPrompt().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerPrompt().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerPrompt, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerPrompt|5 base_conversation_message #0|1 text 9|6 rich_text 9|2 file_selections #1*|3 file_attachments #2*|4 images #3*|7 conversation_history #0*|8 documentation_identifiers 9*|9 use_web 8?|10 external_links #4*|11 blob_data_per_message #5*", ConversationMessage, HeadlessAgenticComposerPrompt_FileSelection, HeadlessAgenticComposerPrompt_FileAttachment, ImageProto, ComposerExternalLink, BlobDataPerMessage];
  }
};
var HeadlessAgenticComposerPrompt_FileSelection = class _HeadlessAgenticComposerPrompt_FileSelection extends __protoMessage3139 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerPrompt_FileSelection().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerPrompt_FileSelection().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerPrompt_FileSelection().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerPrompt_FileSelection, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerPrompt.FileSelection|1 relative_workspace_path 9"];
  }
};
var HeadlessAgenticComposerPrompt_FileAttachment = class _HeadlessAgenticComposerPrompt_FileAttachment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.contents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeadlessAgenticComposerPrompt_FileAttachment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeadlessAgenticComposerPrompt_FileAttachment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeadlessAgenticComposerPrompt_FileAttachment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeadlessAgenticComposerPrompt_FileAttachment, a, b2);
  }
  static $() {
    return ["HeadlessAgenticComposerPrompt.FileAttachment|1 name 9|2 contents 9"];
  }
};
var GetBackgroundComposerStatusRequest = class _GetBackgroundComposerStatusRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerStatusRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerStatusRequest|1 bc_id 9|2 expected_scope #0", CloudAgentRequestScope];
  }
};
var GetBackgroundComposerStatusResponse = class _GetBackgroundComposerStatusResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.status = BackgroundComposerStatus.UNSPECIFIED;
    this.isUnread = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerStatusResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerStatusResponse|1 status #0|2 is_unread 8", BackgroundComposerStatus];
  }
};
var AddAsyncFollowupBackgroundComposerRequest = class _AddAsyncFollowupBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followup = "";
    this.richFollowup = "";
    this.synchronous = false;
    this.requestedAdditionalStoreIds = [];
    this.runEnvVars = {};
    this.storeMounts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAsyncFollowupBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAsyncFollowupBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAsyncFollowupBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAsyncFollowupBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["AddAsyncFollowupBackgroundComposerRequest|1 bc_id 9|2 followup 9|4 rich_followup 9|3 synchronous 8|5 followup_message #0|6 model_details #1?|15 requested_model #2?|7 followup_source #3?|8 continue_rebase 8?|9 plan_followup_type #4?|10 followup_conversation_action #5?|11 followup_id 9?|12 time_budget_ms 3?|13 time_budget_seconds 3?|14 followup_system_reminder 9?|16 mcp_config_json 9?|17 requested_additional_store_ids 9*|18 run_env_vars 9,9|19 store_mounts #6*|20 resubmit_from_message_id 9?|21 use_experimental_model_opt_out 8?|22 coalescing_key 9?|23 pr_head_sha 9?|24 expected_scope #7|25 pr_agent_view #8", ConversationMessage, ModelDetails, RequestedModel, BackgroundComposerSource, PlanFollowupType, ConversationAction, AgentStoreMount, CloudAgentRequestScope, PrAgentView];
  }
};
var AddAsyncFollowupBackgroundComposerResponse = class _AddAsyncFollowupBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.runId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAsyncFollowupBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAsyncFollowupBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAsyncFollowupBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAsyncFollowupBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["AddAsyncFollowupBackgroundComposerResponse|1 run_id 9"];
  }
};
var InjectBackgroundComposerContextRequest = class _InjectBackgroundComposerContextRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.source = BackgroundComposerSource.UNSPECIFIED;
    this.promoteFollowupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InjectBackgroundComposerContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InjectBackgroundComposerContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InjectBackgroundComposerContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InjectBackgroundComposerContextRequest, a, b2);
  }
  static $() {
    return ["InjectBackgroundComposerContextRequest|1 bc_id 9|2 inject_context_action #0|3 source #1|4 followup_message #2|5 promote_followup_id 9|6 expected_scope #3", InjectContextAction, BackgroundComposerSource, ConversationMessage, CloudAgentRequestScope];
  }
};
var InjectBackgroundComposerContextResponse = class _InjectBackgroundComposerContextResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = InjectBackgroundComposerContextResponse_Outcome.UNSPECIFIED;
    this.queuedRunId = "";
    this.fallbackReason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InjectBackgroundComposerContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InjectBackgroundComposerContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InjectBackgroundComposerContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InjectBackgroundComposerContextResponse, a, b2);
  }
  static $() {
    return ["InjectBackgroundComposerContextResponse|1 outcome #0|2 queued_run_id 9|3 fallback_reason 9", InjectBackgroundComposerContextResponse_Outcome];
  }
};
var InjectBackgroundComposerContextResponse_Outcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "InjectBackgroundComposerContextResponse.Outcome", [[0, "UNSPECIFIED"], [1, "QUEUED"], [2, "QUEUED_FOR_NEXT_TURN"], [3, "REJECTED"]], 1);
var SubmitInteractionResponseBackgroundComposerRequest = class _SubmitInteractionResponseBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitInteractionResponseBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitInteractionResponseBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitInteractionResponseBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitInteractionResponseBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["SubmitInteractionResponseBackgroundComposerRequest|1 bc_id 9|2 interaction_response #0|3 ask_question_tool_call_id 9?", InteractionResponse];
  }
};
var SubmitInteractionResponseBackgroundComposerResponse = class _SubmitInteractionResponseBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.resolutionOutcome = SubmitInteractionResponseBackgroundComposerResponse_ResolutionOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitInteractionResponseBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitInteractionResponseBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitInteractionResponseBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitInteractionResponseBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["SubmitInteractionResponseBackgroundComposerResponse|1 resolution_outcome #0", SubmitInteractionResponseBackgroundComposerResponse_ResolutionOutcome];
  }
};
var SubmitInteractionResponseBackgroundComposerResponse_ResolutionOutcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "SubmitInteractionResponseBackgroundComposerResponse.ResolutionOutcome", [[0, "UNSPECIFIED"], [1, "SIGNAL_ENQUEUED"], [2, "NOT_PAUSED"], [3, "QUERY_ID_SIGNAL_ENQUEUED"]], 1);
var ListPendingFollowupsRequest = class _ListPendingFollowupsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPendingFollowupsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPendingFollowupsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPendingFollowupsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPendingFollowupsRequest, a, b2);
  }
  static $() {
    return ["ListPendingFollowupsRequest|1 bc_id 9|2 expected_scope #0", CloudAgentRequestScope];
  }
};
var PendingFollowup = class _PendingFollowup extends __protoMessage3139 {
  constructor(data) {
    super();
    this.followupId = "";
    this.text = "";
    this.richText = "";
    this.createdAtMs = protoInt64.zero;
    this.source = BackgroundComposerSource.UNSPECIFIED;
    this.cursorCommands = [];
    this.cursorCommandsExplicitlySet = false;
    this.pastChats = [];
    this.pastChatsExplicitlySet = false;
    this.blobData = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PendingFollowup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PendingFollowup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PendingFollowup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PendingFollowup, a, b2);
  }
  static $() {
    return ["PendingFollowup|1 followup_id 9|2 text 9|3 rich_text 9|4 created_at_ms 3|5 source #0|6 cursor_commands #1*|7 cursor_commands_explicitly_set 8|8 past_chats #2*|9 past_chats_explicitly_set 8|10 conversation_action #3?|11 blob_data #4*|12 use_experimental_model_opt_out 8?", BackgroundComposerSource, SelectedCursorCommand, SelectedPastChat, ConversationAction, BlobData];
  }
};
var ListPendingFollowupsResponse = class _ListPendingFollowupsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.pendingFollowups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPendingFollowupsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPendingFollowupsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPendingFollowupsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPendingFollowupsResponse, a, b2);
  }
  static $() {
    return ["ListPendingFollowupsResponse|1 pending_followups #0*", PendingFollowup];
  }
};
var UpdatePendingFollowupRequest = class _UpdatePendingFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdatePendingFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdatePendingFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdatePendingFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdatePendingFollowupRequest, a, b2);
  }
  static $() {
    return ["UpdatePendingFollowupRequest|1 bc_id 9|2 followup_id 9|3 updated_message #0|4 expected_scope #1", ConversationMessage, CloudAgentRequestScope];
  }
};
var UpdatePendingFollowupResponse = class _UpdatePendingFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdatePendingFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdatePendingFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdatePendingFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdatePendingFollowupResponse, a, b2);
  }
  static $() {
    return ["UpdatePendingFollowupResponse|1 success 8|2 error_message 9"];
  }
};
var DeletePendingFollowupRequest = class _DeletePendingFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePendingFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePendingFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePendingFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePendingFollowupRequest, a, b2);
  }
  static $() {
    return ["DeletePendingFollowupRequest|1 bc_id 9|2 followup_id 9|3 expected_scope #0", CloudAgentRequestScope];
  }
};
var DeletePendingFollowupResponse = class _DeletePendingFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePendingFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePendingFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePendingFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePendingFollowupResponse, a, b2);
  }
  static $() {
    return ["DeletePendingFollowupResponse|1 success 8|2 error_message 9"];
  }
};
var ReorderPendingFollowupRequest = class _ReorderPendingFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followupId = "";
    this.targetFollowupId = "";
    this.insertAfter = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReorderPendingFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReorderPendingFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReorderPendingFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReorderPendingFollowupRequest, a, b2);
  }
  static $() {
    return ["ReorderPendingFollowupRequest|1 bc_id 9|2 followup_id 9|3 target_followup_id 9|4 insert_after 8|5 expected_scope #0", CloudAgentRequestScope];
  }
};
var ReorderPendingFollowupResponse = class _ReorderPendingFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReorderPendingFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReorderPendingFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReorderPendingFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReorderPendingFollowupResponse, a, b2);
  }
  static $() {
    return ["ReorderPendingFollowupResponse|1 success 8|2 error_message 9"];
  }
};
var SubmitPendingFollowupNowRequest = class _SubmitPendingFollowupNowRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitPendingFollowupNowRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitPendingFollowupNowRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitPendingFollowupNowRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitPendingFollowupNowRequest, a, b2);
  }
  static $() {
    return ["SubmitPendingFollowupNowRequest|1 bc_id 9|2 followup_id 9|3 expected_scope #0", CloudAgentRequestScope];
  }
};
var SubmitPendingFollowupNowResponse = class _SubmitPendingFollowupNowResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitPendingFollowupNowResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitPendingFollowupNowResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitPendingFollowupNowResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitPendingFollowupNowResponse, a, b2);
  }
  static $() {
    return ["SubmitPendingFollowupNowResponse|1 success 8|2 error_message 9"];
  }
};
var MarkFollowupEditingRequest = class _MarkFollowupEditingRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.followupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkFollowupEditingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkFollowupEditingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkFollowupEditingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkFollowupEditingRequest, a, b2);
  }
  static $() {
    return ["MarkFollowupEditingRequest|1 bc_id 9|2 followup_id 9|3 editing 8?|4 expected_scope #0", CloudAgentRequestScope];
  }
};
var MarkFollowupEditingResponse = class _MarkFollowupEditingResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkFollowupEditingResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkFollowupEditingResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkFollowupEditingResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkFollowupEditingResponse, a, b2);
  }
  static $() {
    return ["MarkFollowupEditingResponse|1 success 8|2 error_message 9"];
  }
};
var StartSlackStreamingForFollowupRequest = class _StartSlackStreamingForFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartSlackStreamingForFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartSlackStreamingForFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartSlackStreamingForFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartSlackStreamingForFollowupRequest, a, b2);
  }
  static $() {
    return ["StartSlackStreamingForFollowupRequest|1 bc_id 9"];
  }
};
var StartSlackStreamingForFollowupResponse = class _StartSlackStreamingForFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartSlackStreamingForFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartSlackStreamingForFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartSlackStreamingForFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartSlackStreamingForFollowupResponse, a, b2);
  }
  static $() {
    return ["StartSlackStreamingForFollowupResponse"];
  }
};
var StartGithubStreamingForFollowupRequest = class _StartGithubStreamingForFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGithubStreamingForFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGithubStreamingForFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGithubStreamingForFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGithubStreamingForFollowupRequest, a, b2);
  }
  static $() {
    return ["StartGithubStreamingForFollowupRequest|1 bc_id 9"];
  }
};
var StartGithubStreamingForFollowupResponse = class _StartGithubStreamingForFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGithubStreamingForFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGithubStreamingForFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGithubStreamingForFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGithubStreamingForFollowupResponse, a, b2);
  }
  static $() {
    return ["StartGithubStreamingForFollowupResponse"];
  }
};
var StartLinearStreamingForFollowupRequest = class _StartLinearStreamingForFollowupRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartLinearStreamingForFollowupRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartLinearStreamingForFollowupRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartLinearStreamingForFollowupRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartLinearStreamingForFollowupRequest, a, b2);
  }
  static $() {
    return ["StartLinearStreamingForFollowupRequest|1 bc_id 9"];
  }
};
var StartLinearStreamingForFollowupResponse = class _StartLinearStreamingForFollowupResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartLinearStreamingForFollowupResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartLinearStreamingForFollowupResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartLinearStreamingForFollowupResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartLinearStreamingForFollowupResponse, a, b2);
  }
  static $() {
    return ["StartLinearStreamingForFollowupResponse"];
  }
};
var GetBackgroundComposerInfoRequest = class _GetBackgroundComposerInfoRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.includeDiff = false;
    this.doNotThrowIfSetupNotFinished = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerInfoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerInfoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerInfoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerInfoRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerInfoRequest|1 bc_id 9|2 include_diff 8|3 do_not_throw_if_setup_not_finished 8|4 expected_scope #0", CloudAgentRequestScope];
  }
};
var GetBackgroundComposerTimingsRequest = class _GetBackgroundComposerTimingsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerTimingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerTimingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerTimingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerTimingsRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerTimingsRequest|1 bc_id 9"];
  }
};
var CloudAgentTimingEvent = class _CloudAgentTimingEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.timestampMs = 0;
    this.event = CloudAgentTimingEventType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentTimingEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentTimingEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentTimingEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentTimingEvent, a, b2);
  }
  static $() {
    return ["CloudAgentTimingEvent|1 timestamp_ms 1|2 event #0|3 turn_number 13?", CloudAgentTimingEventType];
  }
};
var UsedEnvironmentBuildInfo = class _UsedEnvironmentBuildInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UsedEnvironmentBuildInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UsedEnvironmentBuildInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UsedEnvironmentBuildInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UsedEnvironmentBuildInfo, a, b2);
  }
  static $() {
    return ["UsedEnvironmentBuildInfo|1 boot_info #0?", EnvironmentBuildBootInfo];
  }
};
var DetailedBackgroundComposer = class _DetailedBackgroundComposer extends __protoMessage3139 {
  constructor(data) {
    super();
    this.startingCommit = "";
    this.baseBranch = "";
    this.status = BackgroundComposerStatus.UNSPECIFIED;
    this.unread = false;
    this.environmentPorts = [];
    this.videoAnnotations = [];
    this.prs = [];
    this.vmProvisionedSkills = [];
    this.labels = [];
    this.startupWarnings = [];
    this.canvasStoreRoots = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DetailedBackgroundComposer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DetailedBackgroundComposer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DetailedBackgroundComposer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DetailedBackgroundComposer, a, b2);
  }
  static $() {
    return ["DetailedBackgroundComposer|1 composer #0|2 starting_commit 9|3 base_branch 9|4 prompt #1|5 status #2|6 diff_since_start #3|7 start_error #4|8 model_details #5|9 unread 8|10 summary 9?|11 environment_ports #6*|12 auto_create_pr 8?|13 open_as_cursor_github_app 8?|14 skip_reviewer_request 8?|15 local_state_branch 9?|16 permanent_error #4?|18 video_annotations #7*|19 auto_branch 8?|20 prs #8*|21 vm_provisioned_skills #9*|22 original_conversation_action #10?|23 repo_config #11?|24 environment_name 9?|25 use_private_worker 8?|26 labels #12*|27 used_environment_version #13?|28 requested_model #14?|29 cloud_subagent_parent #15?|30 startup_warnings #16*|31 used_environment_build #17?|34 use_experimental_model_opt_out 8?|36 canvas_store_roots #18*|37 full_details_version 9?", BackgroundComposer, HeadlessAgenticComposerPrompt, BackgroundComposerStatus, GitDiff, ErrorDetails, ModelDetails, EnvironmentPort, VideoAnnotationEntry, BackgroundComposerPr, VmProvisionedSkill, ConversationAction, EnvironmentRepoConfig, PrivateWorkerLabel, EnvironmentVersionSummary, RequestedModel, CloudSubagentParentReference, CloudAgentStartupWarning, UsedEnvironmentBuildInfo, CanvasStoreRoot];
  }
};
var CanvasStoreRoot = class _CanvasStoreRoot extends __protoMessage3139 {
  constructor(data) {
    super();
    this.canvasesRoot = "";
    this.storeId = "";
    this.storeKind = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CanvasStoreRoot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CanvasStoreRoot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CanvasStoreRoot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CanvasStoreRoot, a, b2);
  }
  static $() {
    return ["CanvasStoreRoot|1 canvases_root 9|2 store_id 9|3 store_kind 9"];
  }
};
var VmProvisionedSkill = class _VmProvisionedSkill extends __protoMessage3139 {
  constructor(data) {
    super();
    this.skillId = "";
    this.description = "";
    this.environments = [];
    this.disabledEnvironments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VmProvisionedSkill().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VmProvisionedSkill().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VmProvisionedSkill().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VmProvisionedSkill, a, b2);
  }
  static $() {
    return ["VmProvisionedSkill|1 skill_id 9|2 description 9|3 environments 9*|4 disabled_environments 9*|5 custom_mode #0?|6 display_name 9?|7 icon 9?|8 color 9?", CustomModeDescriptor];
  }
};
var BackgroundComposerPr = class _BackgroundComposerPr extends __protoMessage3139 {
  constructor(data) {
    super();
    this.branchName = "";
    this.baseBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerPr().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerPr().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerPr().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerPr, a, b2);
  }
  static $() {
    return ["BackgroundComposerPr|1 branch_name 9|2 base_branch 9|3 scm_repo_node_id 9?|4 pull_number 5?|5 pr_status #0?|6 pr_url 9?|7 scm_provider 9?|8 worker_bc_id 9?", PRStatus];
  }
};
var VideoTimestamp = class _VideoTimestamp extends __protoMessage3139 {
  constructor(data) {
    super();
    this.minutes = 0;
    this.seconds = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VideoTimestamp().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VideoTimestamp().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VideoTimestamp().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VideoTimestamp, a, b2);
  }
  static $() {
    return ["VideoTimestamp|1 minutes 5|2 seconds 1"];
  }
};
var VideoChapter = class _VideoChapter extends __protoMessage3139 {
  constructor(data) {
    super();
    this.label = "";
    this.shouldHide = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VideoChapter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VideoChapter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VideoChapter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VideoChapter, a, b2);
  }
  static $() {
    return ["VideoChapter|1 start_time #0|3 label 9|4 should_hide 8", VideoTimestamp];
  }
};
var VideoAnnotation = class _VideoAnnotation extends __protoMessage3139 {
  constructor(data) {
    super();
    this.labeledChapters = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VideoAnnotation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VideoAnnotation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VideoAnnotation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VideoAnnotation, a, b2);
  }
  static $() {
    return ["VideoAnnotation|1 labeled_chapters #0*|2 thumbnail_timestamp #1|3 trim_start_seconds 1?|4 trim_end_seconds 1?", VideoChapter, VideoTimestamp];
  }
};
var VideoAnnotationEntry = class _VideoAnnotationEntry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifactPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VideoAnnotationEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VideoAnnotationEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VideoAnnotationEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VideoAnnotationEntry, a, b2);
  }
  static $() {
    return ["VideoAnnotationEntry|1 artifact_path 9|2 annotation #0", VideoAnnotation];
  }
};
var GetBackgroundComposerInfoResponse = class _GetBackgroundComposerInfoResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerInfoResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerInfoResponse|1 composer #0", DetailedBackgroundComposer];
  }
};
var GetBackgroundComposerTimingsResponse = class _GetBackgroundComposerTimingsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerTimingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerTimingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerTimingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerTimingsResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerTimingsResponse|1 events #0*", CloudAgentTimingEvent];
  }
};
var GetBackgroundComposerRepositoryInfoRequest = class _GetBackgroundComposerRepositoryInfoRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerRepositoryInfoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerRepositoryInfoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerRepositoryInfoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerRepositoryInfoRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerRepositoryInfoRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerRepositoryInfoResponse = class _GetBackgroundComposerRepositoryInfoResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerRepositoryInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerRepositoryInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerRepositoryInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerRepositoryInfoResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerRepositoryInfoResponse|1 repository_info #0|2 path_encryption_key 9?|3 query_only_repo_access #1", RepositoryInfo, QueryOnlyRepoAccess];
  }
};
var GetMachineRequest = class _GetMachineRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.mintDesktopTicket = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMachineRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMachineRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMachineRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMachineRequest, a, b2);
  }
  static $() {
    return ["GetMachineRequest|1 bc_id 9|2 mint_desktop_ticket 8"];
  }
};
var PodReference = class _PodReference extends __protoMessage3139 {
  constructor(data) {
    super();
    this.podId = "";
    this.tenantId = "";
    this.networkToken = "";
    this.cluster = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PodReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PodReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PodReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PodReference, a, b2);
  }
  static $() {
    return ["PodReference|1 pod_id 9|2 tenant_id 9|3 network_token 9|4 cluster 9|5 exec_daemon_auth_token 9?|6 pty_auth_token 9?"];
  }
};
var WorkerReference = class _WorkerReference extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerId = "";
    this.workspaceRootPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerReference, a, b2);
  }
  static $() {
    return ["WorkerReference|1 worker_id 9|2 workspace_root_path 9|3 desktop #0?|4 cursor_server #1?", WorkerDesktopCapability, WorkerCursorServerCapability];
  }
};
var WorkerCursorServerCapability = class _WorkerCursorServerCapability extends __protoMessage3139 {
  constructor(data) {
    super();
    this.available = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerCursorServerCapability().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerCursorServerCapability().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerCursorServerCapability().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerCursorServerCapability, a, b2);
  }
  static $() {
    return ["WorkerCursorServerCapability|1 available 8|2 unavailable_reason 9?"];
  }
};
var WorkerDesktopCapability = class _WorkerDesktopCapability extends __protoMessage3139 {
  constructor(data) {
    super();
    this.available = false;
    this.controlAllowed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerDesktopCapability().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerDesktopCapability().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerDesktopCapability().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerDesktopCapability, a, b2);
  }
  static $() {
    return ["WorkerDesktopCapability|1 available 8|2 ws_url 9?|3 session_id 9?|4 session_secret 9?|5 protocol 9?|6 display_kind 9?|7 auth_scheme 9?|8 control_allowed 8|9 unavailable_reason 9?"];
  }
};
var MachineReference = class _MachineReference extends __protoMessage3139 {
  constructor(data) {
    super();
    this.reference = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MachineReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MachineReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MachineReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MachineReference, a, b2);
  }
  static $() {
    return ["MachineReference|1 pod #0 reference|2 worker #1 reference", PodReference, WorkerReference];
  }
};
var GetMachineResponse = class _GetMachineResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMachineResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMachineResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMachineResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMachineResponse, a, b2);
  }
  static $() {
    return ["GetMachineResponse|1 machine #0", MachineReference];
  }
};
var ListWorkspaceFilesRequest = class _ListWorkspaceFilesRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkspaceFilesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkspaceFilesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkspaceFilesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkspaceFilesRequest, a, b2);
  }
  static $() {
    return ["ListWorkspaceFilesRequest|1 bc_id 9"];
  }
};
var ListWorkspaceFilesResponse = class _ListWorkspaceFilesResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.relativePaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkspaceFilesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkspaceFilesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkspaceFilesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkspaceFilesResponse, a, b2);
  }
  static $() {
    return ["ListWorkspaceFilesResponse|1 relative_paths 9*"];
  }
};
var GetMachineResourceUsageRequest = class _GetMachineResourceUsageRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.cursor = "";
    this.omitHistory = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMachineResourceUsageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMachineResourceUsageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMachineResourceUsageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMachineResourceUsageRequest, a, b2);
  }
  static $() {
    return ["GetMachineResourceUsageRequest|1 bc_id 9|2 cursor 9|3 omit_history 8"];
  }
};
var BackgroundComposerDesktopLeaseRequest = class _BackgroundComposerDesktopLeaseRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.action = BackgroundComposerDesktopLeaseAction.UNSPECIFIED;
    this.surfaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerDesktopLeaseRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerDesktopLeaseRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerDesktopLeaseRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerDesktopLeaseRequest, a, b2);
  }
  static $() {
    return ["BackgroundComposerDesktopLeaseRequest|1 bc_id 9|2 action #0|3 surface_id 9", BackgroundComposerDesktopLeaseAction];
  }
};
var BackgroundComposerDesktopLeaseResponse = class _BackgroundComposerDesktopLeaseResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.held = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerDesktopLeaseResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerDesktopLeaseResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerDesktopLeaseResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerDesktopLeaseResponse, a, b2);
  }
  static $() {
    return ["BackgroundComposerDesktopLeaseResponse|1 held 8"];
  }
};
var GetGithubAccessTokenForReposRequest = class _GetGithubAccessTokenForReposRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.mandatoryRepoUrls = [];
    this.optionalRepoUrls = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetGithubAccessTokenForReposRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetGithubAccessTokenForReposRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetGithubAccessTokenForReposRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetGithubAccessTokenForReposRequest, a, b2);
  }
  static $() {
    return ["GetGithubAccessTokenForReposRequest|1 mandatory_repo_urls 9*|2 optional_repo_urls 9*|3 skip_cache 8?"];
  }
};
var GetGithubAccessTokenForReposResponse = class _GetGithubAccessTokenForReposResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrlStatuses = [];
    this.errorType = GithubAccessErrorType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetGithubAccessTokenForReposResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetGithubAccessTokenForReposResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetGithubAccessTokenForReposResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetGithubAccessTokenForReposResponse, a, b2);
  }
  static $() {
    return ["GetGithubAccessTokenForReposResponse|1 has_access 8?|2 error 9?|3 repo_url_statuses #0*|4 error_type #1|5 github_redirect_url 9?", GetGithubAccessTokenForReposResponse_Status, GithubAccessErrorType];
  }
};
var GetGithubAccessTokenForReposResponse_Status = class _GetGithubAccessTokenForReposResponse_Status extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.hasAccess = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetGithubAccessTokenForReposResponse_Status().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetGithubAccessTokenForReposResponse_Status().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetGithubAccessTokenForReposResponse_Status().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetGithubAccessTokenForReposResponse_Status, a, b2);
  }
  static $() {
    return ["GetGithubAccessTokenForReposResponse.Status|1 repo_url 9|2 has_access 8|3 error 9?"];
  }
};
var MakeGithubRequestRequest = class _MakeGithubRequestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.method = "";
    this.path = "";
    this.githubUserToken = "";
    this.caller = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MakeGithubRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MakeGithubRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MakeGithubRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MakeGithubRequestRequest, a, b2);
  }
  static $() {
    return ["MakeGithubRequestRequest|1 method 9|2 path 9|3 body_json 9?|4 github_user_token 9|5 caller 9|6 host 9?|7 path_template 9?|8 accept_header 9?"];
  }
};
var MakeGithubRequestResponse = class _MakeGithubRequestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.status = 0;
    this.statusText = "";
    this.headers = {};
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MakeGithubRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MakeGithubRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MakeGithubRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MakeGithubRequestResponse, a, b2);
  }
  static $() {
    return ["MakeGithubRequestResponse|1 status 5|4 status_text 9|2 headers 9,9|3 body 9"];
  }
};
var GetBackgroundComposerConversationRequest = class _GetBackgroundComposerConversationRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerConversationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerConversationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerConversationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerConversationRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerConversationRequest|1 bc_id 9|2 exchange_only 8?"];
  }
};
var GetBackgroundComposerConversationResponse = class _GetBackgroundComposerConversationResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.conversation = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerConversationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerConversationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerConversationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerConversationResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerConversationResponse|1 conversation #0*", ConversationMessage];
  }
};
var GetBackgroundComposerPullRequestRequest = class _GetBackgroundComposerPullRequestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerPullRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerPullRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerPullRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerPullRequestRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerPullRequestRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerPullRequestResponse = class _GetBackgroundComposerPullRequestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerPullRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerPullRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerPullRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerPullRequestResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerPullRequestResponse|1 pr_url 9"];
  }
};
var CommitBackgroundComposerRequest = class _CommitBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.commitMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["CommitBackgroundComposerRequest|1 bc_id 9|2 commit_message 9"];
  }
};
var CommitBackgroundComposerResponse = class _CommitBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.commitHash = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["CommitBackgroundComposerResponse|1 commit_hash 9"];
  }
};
var LiveEgressReapplyResult = class _LiveEgressReapplyResult extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = LiveEgressReapplyResult_Outcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LiveEgressReapplyResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LiveEgressReapplyResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LiveEgressReapplyResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LiveEgressReapplyResult, a, b2);
  }
  static $() {
    return ["LiveEgressReapplyResult|1 outcome #0", LiveEgressReapplyResult_Outcome];
  }
};
var LiveEgressReapplyResult_Outcome = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "LiveEgressReapplyResult.Outcome", [[0, "UNSPECIFIED"], [1, "APPLIED"], [2, "NOT_APPLICABLE"], [3, "STORED_NOT_APPLIED"], [4, "FAILED"]], 1);
var SetPersonalEnvironmentJsonRequest = class _SetPersonalEnvironmentJsonRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentJson = "";
    this.repoUrl = "";
    this.writeSource = EnvironmentWriteSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetPersonalEnvironmentJsonRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetPersonalEnvironmentJsonRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetPersonalEnvironmentJsonRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetPersonalEnvironmentJsonRequest, a, b2);
  }
  static $() {
    return ["SetPersonalEnvironmentJsonRequest|1 environment_json 9|2 repo_url 9|3 write_source #0|4 source_bc_id 9?|5 environment_name 9?|6 repo_config #1?|7 environment_id 3?|8 environment_public_id 9?", EnvironmentWriteSource, EnvironmentRepoConfig];
  }
};
var SetPersonalEnvironmentJsonResponse = class _SetPersonalEnvironmentJsonResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetPersonalEnvironmentJsonResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetPersonalEnvironmentJsonResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetPersonalEnvironmentJsonResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetPersonalEnvironmentJsonResponse, a, b2);
  }
  static $() {
    return ["SetPersonalEnvironmentJsonResponse|1 environment #0?|2 live_egress_reapply #1?|3 created 8?", LogicalEnvironment, LiveEgressReapplyResult];
  }
};
var GetPersonalEnvironmentJsonRequest = class _GetPersonalEnvironmentJsonRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPersonalEnvironmentJsonRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPersonalEnvironmentJsonRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPersonalEnvironmentJsonRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPersonalEnvironmentJsonRequest, a, b2);
  }
  static $() {
    return ["GetPersonalEnvironmentJsonRequest|1 repo_url 9"];
  }
};
var GetPersonalEnvironmentJsonResponse = class _GetPersonalEnvironmentJsonResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentJson = "";
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPersonalEnvironmentJsonResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPersonalEnvironmentJsonResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPersonalEnvironmentJsonResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPersonalEnvironmentJsonResponse, a, b2);
  }
  static $() {
    return ["GetPersonalEnvironmentJsonResponse|1 environment_json 9|2 repo_url 9"];
  }
};
var GetEnvironmentJsonCandidatesRequest = class _GetEnvironmentJsonCandidatesRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.ref = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentJsonCandidatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentJsonCandidatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentJsonCandidatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentJsonCandidatesRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentJsonCandidatesRequest|1 repo_url 9|2 ref 9"];
  }
};
var GetEnvironmentJsonCandidatesResponse = class _GetEnvironmentJsonCandidatesResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentJsonCandidatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentJsonCandidatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentJsonCandidatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentJsonCandidatesResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentJsonCandidatesResponse|1 repo_environment_json 9?|2 personal_environment_json 9?|3 team_environment_json 9?"];
  }
};
var ListPersonalEnvironmentsRequest = class _ListPersonalEnvironmentsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPersonalEnvironmentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPersonalEnvironmentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPersonalEnvironmentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPersonalEnvironmentsRequest, a, b2);
  }
  static $() {
    return ["ListPersonalEnvironmentsRequest|1 limit 5?"];
  }
};
var PersonalEnvironment = class _PersonalEnvironment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.environmentJson = "";
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.id = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PersonalEnvironment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PersonalEnvironment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PersonalEnvironment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PersonalEnvironment, a, b2);
  }
  static $() {
    return ["PersonalEnvironment|1 repo_url 9|2 environment_json 9|3 created_at_ms 3|4 updated_at_ms 3|5 id 3|6 environment_public_id 9?"];
  }
};
var ListPersonalEnvironmentsResponse = class _ListPersonalEnvironmentsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPersonalEnvironmentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPersonalEnvironmentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPersonalEnvironmentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPersonalEnvironmentsResponse, a, b2);
  }
  static $() {
    return ["ListPersonalEnvironmentsResponse|1 environments #0*", PersonalEnvironment];
  }
};
var DeletePersonalEnvironmentJsonRequest = class _DeletePersonalEnvironmentJsonRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePersonalEnvironmentJsonRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePersonalEnvironmentJsonRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePersonalEnvironmentJsonRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePersonalEnvironmentJsonRequest, a, b2);
  }
  static $() {
    return ["DeletePersonalEnvironmentJsonRequest|1 id 3|2 environment_public_id 9?"];
  }
};
var DeletePersonalEnvironmentJsonResponse = class _DeletePersonalEnvironmentJsonResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePersonalEnvironmentJsonResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePersonalEnvironmentJsonResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePersonalEnvironmentJsonResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePersonalEnvironmentJsonResponse, a, b2);
  }
  static $() {
    return ["DeletePersonalEnvironmentJsonResponse"];
  }
};
var PublishEnvironmentRequest = class _PublishEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    this.environmentType = EnvironmentType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishEnvironmentRequest, a, b2);
  }
  static $() {
    return ["PublishEnvironmentRequest|1 id 3|2 environment_type #0", EnvironmentType];
  }
};
var PublishEnvironmentResponse = class _PublishEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.prUrl = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishEnvironmentResponse, a, b2);
  }
  static $() {
    return ["PublishEnvironmentResponse|1 success 8|2 pr_url 9|3 branch_name 9|4 error 9?"];
  }
};
var PublishPersonalEnvironmentRequest = class _PublishPersonalEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishPersonalEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishPersonalEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishPersonalEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishPersonalEnvironmentRequest, a, b2);
  }
  static $() {
    return ["PublishPersonalEnvironmentRequest|1 id 3"];
  }
};
var PublishPersonalEnvironmentResponse = class _PublishPersonalEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.prUrl = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishPersonalEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishPersonalEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishPersonalEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishPersonalEnvironmentResponse, a, b2);
  }
  static $() {
    return ["PublishPersonalEnvironmentResponse|1 success 8|2 pr_url 9|3 branch_name 9|4 error 9?"];
  }
};
var ListTeamEnvironmentsRequest = class _ListTeamEnvironmentsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListTeamEnvironmentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListTeamEnvironmentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListTeamEnvironmentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListTeamEnvironmentsRequest, a, b2);
  }
  static $() {
    return ["ListTeamEnvironmentsRequest|1 limit 5?|2 existence_only 8?"];
  }
};
var TeamEnvironment = class _TeamEnvironment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    this.teamId = 0;
    this.repoUrl = "";
    this.environmentJson = "";
    this.createdByUserId = 0;
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.scmRepoNodeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TeamEnvironment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TeamEnvironment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TeamEnvironment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TeamEnvironment, a, b2);
  }
  static $() {
    return ["TeamEnvironment|1 id 3|2 team_id 5|3 repo_url 9|4 environment_json 9|5 created_by_user_id 5|6 created_at_ms 3|7 updated_at_ms 3|8 scm_repo_node_id 9|9 git_enterprise_uuid 9?|10 environment_public_id 9?"];
  }
};
var ListTeamEnvironmentsResponse = class _ListTeamEnvironmentsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environments = [];
    this.hasEnvironmentsHiddenByRepoAccess = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListTeamEnvironmentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListTeamEnvironmentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListTeamEnvironmentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListTeamEnvironmentsResponse, a, b2);
  }
  static $() {
    return ["ListTeamEnvironmentsResponse|1 environments #0*|2 has_environments_hidden_by_repo_access 8|3 has_any_team_environment 8?", TeamEnvironment];
  }
};
var ListEnvironmentsRequest = class _ListEnvironmentsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repositoryScopeRepoUrls = [];
    this.filterRepoUrls = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEnvironmentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEnvironmentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEnvironmentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEnvironmentsRequest, a, b2);
  }
  static $() {
    return ["ListEnvironmentsRequest|1 limit 5?|6 page_token 9?|7 search_query 9?|2 include_environment_json 8?|3 repository_scope_repo_urls 9*|4 include_repository_scope_environments 8?|5 include_environments_without_repo_access 8?|9 filter_repo_urls 9*"];
  }
};
var LogicalEnvironment = class _LogicalEnvironment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    this.publicId = "";
    this.name = "";
    this.scope = LogicalEnvironmentScope.UNSPECIFIED;
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.ineligibleRepoUrls = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogicalEnvironment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogicalEnvironment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogicalEnvironment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogicalEnvironment, a, b2);
  }
  static $() {
    return ["LogicalEnvironment|1 id 3|2 public_id 9|3 name 9|4 scope #0|5 owning_team 5?|6 owning_user 5?|7 repo_config #1?|8 created_at_ms 3|9 updated_at_ms 3|10 environment_json 9?|11 latest_environment_version_public_id 9?|12 ineligibility_reason #2?|13 ineligible_repo_urls 9*", LogicalEnvironmentScope, EnvironmentRepoConfig, EnvironmentIneligibilityReason];
  }
};
var ListEnvironmentsResponse = class _ListEnvironmentsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environments = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEnvironmentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEnvironmentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEnvironmentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEnvironmentsResponse, a, b2);
  }
  static $() {
    return ["ListEnvironmentsResponse|1 environments #0*|2 dashboard_scope_id 9?|3 has_more 8|4 next_page_token 9?", LogicalEnvironment];
  }
};
var GetEnvironmentRequest = class _GetEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentRequest|1 public_id 9|2 include_environment_json 8?"];
  }
};
var GetEnvironmentResponse = class _GetEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentResponse|1 environment #0?", LogicalEnvironment];
  }
};
var RenameEnvironmentRequest = class _RenameEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameEnvironmentRequest, a, b2);
  }
  static $() {
    return ["RenameEnvironmentRequest|1 public_id 9|2 name 9?"];
  }
};
var RenameEnvironmentResponse = class _RenameEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameEnvironmentResponse, a, b2);
  }
  static $() {
    return ["RenameEnvironmentResponse"];
  }
};
var MigrateEnvironmentToOriginRequest = class _MigrateEnvironmentToOriginRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MigrateEnvironmentToOriginRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MigrateEnvironmentToOriginRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MigrateEnvironmentToOriginRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MigrateEnvironmentToOriginRequest, a, b2);
  }
  static $() {
    return ["MigrateEnvironmentToOriginRequest|1 public_id 9"];
  }
};
var MigrateEnvironmentToOriginResponse = class _MigrateEnvironmentToOriginResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.newEnvironmentPublicId = "";
    this.repoUrls = [];
    this.copiedSecretCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MigrateEnvironmentToOriginResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MigrateEnvironmentToOriginResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MigrateEnvironmentToOriginResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MigrateEnvironmentToOriginResponse, a, b2);
  }
  static $() {
    return ["MigrateEnvironmentToOriginResponse|1 new_environment_public_id 9|2 repo_urls 9*|3 copied_secret_count 5"];
  }
};
var EnvironmentBuildRepoCommit = class _EnvironmentBuildRepoCommit extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.workspaceRootPath = "";
    this.commitHashHex = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentBuildRepoCommit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentBuildRepoCommit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentBuildRepoCommit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentBuildRepoCommit, a, b2);
  }
  static $() {
    return ["EnvironmentBuildRepoCommit|1 repo_url 9|2 workspace_root_path 9|3 commit_hash_hex 9"];
  }
};
var EnvironmentBuildRow = class _EnvironmentBuildRow extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    this.environmentPublicId = "";
    this.status = EnvironmentBuildRowStatus.UNSPECIFIED;
    this.triggerType = EnvironmentBuildRowTriggerType.UNSPECIFIED;
    this.source = EnvironmentBuildRowSource.UNSPECIFIED;
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.isDraft = false;
    this.hasRefOverrides = false;
    this.requestedRefs = [];
    this.repoCommits = [];
    this.willAdoptEnvironmentSettingsOnActivate = false;
    this.snapshotReapState = EnvironmentBuildSnapshotReapState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentBuildRow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentBuildRow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentBuildRow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentBuildRow, a, b2);
  }
  static $() {
    return ["EnvironmentBuildRow|1 build_id 9|2 environment_public_id 9|3 status #0|4 trigger_type #1|5 source #2|6 failure_type #3?|7 environment_version_id 3?|8 user_facing_snapshot_id 9?|9 created_at_ms 3|10 updated_at_ms 3|11 completed_at_ms 3?|12 is_draft 8|13 has_ref_overrides 8|14 requested_refs #4*|15 repo_commits #5*|16 created_by_display 9?|17 will_adopt_environment_settings_on_activate 8|18 source_bc_id 9?|19 failure_code 9?|20 snapshot_reap_state #6", EnvironmentBuildRowStatus, EnvironmentBuildRowTriggerType, EnvironmentBuildRowSource, EnvironmentBuildRowFailureType, RepoStartingRef, EnvironmentBuildRepoCommit, EnvironmentBuildSnapshotReapState];
  }
};
var EnvironmentBuildsCursor = class _EnvironmentBuildsCursor extends __protoMessage3139 {
  constructor(data) {
    super();
    this.createdAtMs = protoInt64.zero;
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentBuildsCursor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentBuildsCursor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentBuildsCursor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentBuildsCursor, a, b2);
  }
  static $() {
    return ["EnvironmentBuildsCursor|1 created_at_ms 3|2 build_id 9"];
  }
};
var ListEnvironmentBuildsRequest = class _ListEnvironmentBuildsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEnvironmentBuildsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEnvironmentBuildsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEnvironmentBuildsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEnvironmentBuildsRequest, a, b2);
  }
  static $() {
    return ["ListEnvironmentBuildsRequest|1 environment_public_id 9|2 cursor #0?", EnvironmentBuildsCursor];
  }
};
var ListEnvironmentBuildsResponse = class _ListEnvironmentBuildsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.rows = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListEnvironmentBuildsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListEnvironmentBuildsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListEnvironmentBuildsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListEnvironmentBuildsResponse, a, b2);
  }
  static $() {
    return ["ListEnvironmentBuildsResponse|1 rows #0*|2 has_more 8|3 next_cursor #1?|4 latest_boot_build_id 9?", EnvironmentBuildRow, EnvironmentBuildsCursor];
  }
};
var GetEnvironmentActiveBuildRequest = class _GetEnvironmentActiveBuildRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentActiveBuildRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentActiveBuildRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentActiveBuildRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentActiveBuildRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentActiveBuildRequest|1 environment_public_id 9"];
  }
};
var GetEnvironmentActiveBuildResponse = class _GetEnvironmentActiveBuildResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentActiveBuildResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentActiveBuildResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentActiveBuildResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentActiveBuildResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentActiveBuildResponse|1 row #0?", EnvironmentBuildRow];
  }
};
var GetEnvironmentPersistentRecurringBuildFailuresRequest = class _GetEnvironmentPersistentRecurringBuildFailuresRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentPersistentRecurringBuildFailuresRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentPersistentRecurringBuildFailuresRequest|1 environment_public_id 9"];
  }
};
var GetEnvironmentPersistentRecurringBuildFailuresResponse = class _GetEnvironmentPersistentRecurringBuildFailuresResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentPersistentRecurringBuildFailuresResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentPersistentRecurringBuildFailuresResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentPersistentRecurringBuildFailuresResponse|1 failure #0?", PersistentRecurringBuildFailure];
  }
};
var PersistentRecurringBuildFailure = class _PersistentRecurringBuildFailure extends __protoMessage3139 {
  constructor(data) {
    super();
    this.consecutiveFailedCount = 0;
    this.firstFailedAtMs = protoInt64.zero;
    this.lastFailedAtMs = protoInt64.zero;
    this.latestFailedBuildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PersistentRecurringBuildFailure().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PersistentRecurringBuildFailure().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PersistentRecurringBuildFailure().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PersistentRecurringBuildFailure, a, b2);
  }
  static $() {
    return ["PersistentRecurringBuildFailure|1 consecutive_failed_count 13|2 first_failed_at_ms 3|3 last_failed_at_ms 3|4 latest_failed_build_id 9"];
  }
};
var GetEnvironmentBuildRequest = class _GetEnvironmentBuildRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildRequest|1 build_id 9"];
  }
};
var GetEnvironmentBuildResponse = class _GetEnvironmentBuildResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildResponse|1 row #0", EnvironmentBuildRow];
  }
};
var GetEnvironmentBuildConfigRequest = class _GetEnvironmentBuildConfigRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildConfigRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildConfigRequest|1 build_id 9"];
  }
};
var GetEnvironmentBuildConfigResponse = class _GetEnvironmentBuildConfigResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildConfigResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildConfigResponse|1 environment_version #0?", EnvironmentVersionSummary];
  }
};
var UpdateEnvironmentBuildRequest = class _UpdateEnvironmentBuildRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateEnvironmentBuildRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateEnvironmentBuildRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateEnvironmentBuildRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateEnvironmentBuildRequest, a, b2);
  }
  static $() {
    return ["UpdateEnvironmentBuildRequest|1 build_id 9|2 is_draft 8?"];
  }
};
var UpdateEnvironmentBuildResponse = class _UpdateEnvironmentBuildResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateEnvironmentBuildResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateEnvironmentBuildResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateEnvironmentBuildResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateEnvironmentBuildResponse, a, b2);
  }
  static $() {
    return ["UpdateEnvironmentBuildResponse|1 row #0", EnvironmentBuildRow];
  }
};
var TriggerEnvironmentBuildRequest = class _TriggerEnvironmentBuildRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    this.refs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TriggerEnvironmentBuildRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TriggerEnvironmentBuildRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TriggerEnvironmentBuildRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TriggerEnvironmentBuildRequest, a, b2);
  }
  static $() {
    return ["TriggerEnvironmentBuildRequest|1 environment_public_id 9|2 is_draft 8?|3 refs #0*", RepoStartingRef];
  }
};
var TriggerEnvironmentBuildResponse = class _TriggerEnvironmentBuildResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TriggerEnvironmentBuildResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TriggerEnvironmentBuildResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TriggerEnvironmentBuildResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TriggerEnvironmentBuildResponse, a, b2);
  }
  static $() {
    return ["TriggerEnvironmentBuildResponse|1 build_id 9|2 row #0", EnvironmentBuildRow];
  }
};
var AttachEnvironmentBuildLogRequest = class _AttachEnvironmentBuildLogRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachEnvironmentBuildLogRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachEnvironmentBuildLogRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachEnvironmentBuildLogRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachEnvironmentBuildLogRequest, a, b2);
  }
  static $() {
    return ["AttachEnvironmentBuildLogRequest|1 build_id 9|2 cursor 9?"];
  }
};
var AttachEnvironmentBuildLogResponse = class _AttachEnvironmentBuildLogResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.text = "";
    this.nextCursor = "";
    this.status = EnvironmentBuildRowStatus.UNSPECIFIED;
    this.logComplete = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachEnvironmentBuildLogResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachEnvironmentBuildLogResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachEnvironmentBuildLogResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachEnvironmentBuildLogResponse, a, b2);
  }
  static $() {
    return ["AttachEnvironmentBuildLogResponse|1 text 9|2 next_cursor 9|3 status #0|4 log_complete 8", EnvironmentBuildRowStatus];
  }
};
var CancelEnvironmentBuildRequest = class _CancelEnvironmentBuildRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.buildId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelEnvironmentBuildRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelEnvironmentBuildRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelEnvironmentBuildRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelEnvironmentBuildRequest, a, b2);
  }
  static $() {
    return ["CancelEnvironmentBuildRequest|1 build_id 9"];
  }
};
var CancelEnvironmentBuildResponse = class _CancelEnvironmentBuildResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelEnvironmentBuildResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelEnvironmentBuildResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelEnvironmentBuildResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelEnvironmentBuildResponse, a, b2);
  }
  static $() {
    return ["CancelEnvironmentBuildResponse|1 row #0", EnvironmentBuildRow];
  }
};
var EnvironmentBuildSettings = class _EnvironmentBuildSettings extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentBuildSettings().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentBuildSettings().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentBuildSettings().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentBuildSettings, a, b2);
  }
  static $() {
    return ["EnvironmentBuildSettings|1 fast_forward_default_branch 8?|3 auto_fast_forward_staleness_hours 5?|2 builds_enabled 8?"];
  }
};
var GetEnvironmentBuildSettingsRequest = class _GetEnvironmentBuildSettingsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildSettingsRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildSettingsRequest|1 environment_public_id 9"];
  }
};
var GetEnvironmentBuildSettingsResponse = class _GetEnvironmentBuildSettingsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentBuildSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentBuildSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentBuildSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentBuildSettingsResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentBuildSettingsResponse|1 settings #0", EnvironmentBuildSettings];
  }
};
var UpdateEnvironmentBuildSettingsRequest = class _UpdateEnvironmentBuildSettingsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicId = "";
    this.clearFastForwardDefaultBranch = false;
    this.clearBuildsEnabled = false;
    this.clearAutoFastForwardStalenessHours = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateEnvironmentBuildSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateEnvironmentBuildSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateEnvironmentBuildSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateEnvironmentBuildSettingsRequest, a, b2);
  }
  static $() {
    return ["UpdateEnvironmentBuildSettingsRequest|1 environment_public_id 9|2 fast_forward_default_branch 8?|3 clear_fast_forward_default_branch 8|4 builds_enabled 8?|5 clear_builds_enabled 8|6 auto_fast_forward_staleness_hours 5?|7 clear_auto_fast_forward_staleness_hours 8"];
  }
};
var UpdateEnvironmentBuildSettingsResponse = class _UpdateEnvironmentBuildSettingsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateEnvironmentBuildSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateEnvironmentBuildSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateEnvironmentBuildSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateEnvironmentBuildSettingsResponse, a, b2);
  }
  static $() {
    return ["UpdateEnvironmentBuildSettingsResponse|1 settings #0", EnvironmentBuildSettings];
  }
};
var ResolveOrCreateMultiRepoEnvironmentRequest = class _ResolveOrCreateMultiRepoEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.ownerId = { case: void 0 };
    this.writeSource = EnvironmentWriteSource.UNSPECIFIED;
    this.reusePolicy = MultiRepoEnvironmentReusePolicy.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOrCreateMultiRepoEnvironmentRequest, a, b2);
  }
  static $() {
    return ["ResolveOrCreateMultiRepoEnvironmentRequest|1 user_id 5 owner_id|2 team_id 5 owner_id|3 service_account_id 9 owner_id|4 repo_config #0|5 write_source #1|6 reuse_policy #2", EnvironmentRepoConfig, EnvironmentWriteSource, MultiRepoEnvironmentReusePolicy];
  }
};
var ResolveOrCreateMultiRepoEnvironmentResponse = class _ResolveOrCreateMultiRepoEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.created = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOrCreateMultiRepoEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOrCreateMultiRepoEnvironmentResponse, a, b2);
  }
  static $() {
    return ["ResolveOrCreateMultiRepoEnvironmentResponse|1 environment #0|2 created 8", LogicalEnvironment];
  }
};
var ResolveOrCreateDraftEnvironmentRequest = class _ResolveOrCreateDraftEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.targetScope = LogicalEnvironmentScope.UNSPECIFIED;
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOrCreateDraftEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOrCreateDraftEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOrCreateDraftEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOrCreateDraftEnvironmentRequest, a, b2);
  }
  static $() {
    return ["ResolveOrCreateDraftEnvironmentRequest|1 bc_id 9|2 target_scope #0|3 repo_url 9|4 repo_config #1?", LogicalEnvironmentScope, EnvironmentRepoConfig];
  }
};
var ResolveOrCreateDraftEnvironmentResponse = class _ResolveOrCreateDraftEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.created = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOrCreateDraftEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOrCreateDraftEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOrCreateDraftEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOrCreateDraftEnvironmentResponse, a, b2);
  }
  static $() {
    return ["ResolveOrCreateDraftEnvironmentResponse|1 environment #0|2 created 8", LogicalEnvironment];
  }
};
var RepoConfigSummary = class _RepoConfigSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrls = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoConfigSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoConfigSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoConfigSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoConfigSummary, a, b2);
  }
  static $() {
    return ["RepoConfigSummary|1 repo_urls 9*|2 environment_json_path 9?"];
  }
};
var EnvironmentVersionRestoreMetadata = class _EnvironmentVersionRestoreMetadata extends __protoMessage3139 {
  constructor(data) {
    super();
    this.restoredFromEnvironmentVersionPublicId = "";
    this.restoredFromSourceKind = EnvironmentVersionSourceKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentVersionRestoreMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentVersionRestoreMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentVersionRestoreMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentVersionRestoreMetadata, a, b2);
  }
  static $() {
    return ["EnvironmentVersionRestoreMetadata|1 restored_from_environment_version_public_id 9|2 restored_from_source_kind #0|3 restored_from_environment_public_id 9?|4 restored_from_environment_name 9?|5 restored_from_snapshot_id 9?", EnvironmentVersionSourceKind];
  }
};
var EnvironmentVersionSummary = class _EnvironmentVersionSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    this.sourceKind = EnvironmentVersionSourceKind.UNSPECIFIED;
    this.createdAtMs = protoInt64.zero;
    this.environmentJsonEffectivelyEmpty = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentVersionSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentVersionSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentVersionSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentVersionSummary, a, b2);
  }
  static $() {
    return ["EnvironmentVersionSummary|1 public_id 9|2 source_kind #0|3 commit_hash 9?|4 environment_public_id 9?|5 repo_config #1?|6 created_at_ms 3|7 environment_json 9?|8 environment_name 9?|9 snapshot_id 9?|10 recorded_via 9?|11 update_script 9?|12 environment_json_effectively_empty 8|13 environment_json_restricted 8?", EnvironmentVersionSourceKind, RepoConfigSummary];
  }
};
var GetBackgroundComposerEnvironmentVersionRequest = class _GetBackgroundComposerEnvironmentVersionRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerEnvironmentVersionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerEnvironmentVersionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerEnvironmentVersionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerEnvironmentVersionRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerEnvironmentVersionRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerEnvironmentVersionResponse = class _GetBackgroundComposerEnvironmentVersionResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentVersionHistory = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerEnvironmentVersionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerEnvironmentVersionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerEnvironmentVersionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerEnvironmentVersionResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerEnvironmentVersionResponse|1 environment_version_history #0*", EnvironmentVersionSummary];
  }
};
var EnvironmentSetupRunLink = class _EnvironmentSetupRunLink extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.createdAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentSetupRunLink().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentSetupRunLink().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentSetupRunLink().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentSetupRunLink, a, b2);
  }
  static $() {
    return ["EnvironmentSetupRunLink|1 bc_id 9|2 status 9?|3 created_at_ms 3|4 snapshot_id 9?"];
  }
};
var EnvironmentHistoryVersion = class _EnvironmentHistoryVersion extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentHistoryVersion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentHistoryVersion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentHistoryVersion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentHistoryVersion, a, b2);
  }
  static $() {
    return ["EnvironmentHistoryVersion|1 version #0|2 setup_run #1?", EnvironmentVersionSummary, EnvironmentSetupRunLink];
  }
};
var EnvironmentHistoryLifecycleEvent = class _EnvironmentHistoryLifecycleEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    this.eventKind = EnvironmentUpdateEventKind.UNSPECIFIED;
    this.sourceKind = EnvironmentVersionSourceKind.UNSPECIFIED;
    this.recordedVia = "";
    this.createdAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentHistoryLifecycleEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentHistoryLifecycleEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentHistoryLifecycleEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentHistoryLifecycleEvent, a, b2);
  }
  static $() {
    return ["EnvironmentHistoryLifecycleEvent|1 public_id 9|2 event_kind #0|3 source_kind #1|4 recorded_via 9|5 created_at_ms 3|6 version #2?|7 setup_run #3?|8 restore_metadata #4?", EnvironmentUpdateEventKind, EnvironmentVersionSourceKind, EnvironmentVersionSummary, EnvironmentSetupRunLink, EnvironmentVersionRestoreMetadata];
  }
};
var EnvironmentHistoryObject = class _EnvironmentHistoryObject extends __protoMessage3139 {
  constructor(data) {
    super();
    this.versions = [];
    this.lifecycleEvents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentHistoryObject().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentHistoryObject().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentHistoryObject().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentHistoryObject, a, b2);
  }
  static $() {
    return ["EnvironmentHistoryObject|1 environment #0|2 versions #1*|3 lifecycle_events #2*", LogicalEnvironment, EnvironmentHistoryVersion, EnvironmentHistoryLifecycleEvent];
  }
};
var EnvironmentEffectiveHistoryEvent = class _EnvironmentEffectiveHistoryEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.createdAtMs = protoInt64.zero;
    this.scope = LogicalEnvironmentScope.UNSPECIFIED;
    this.eventKind = EnvironmentUpdateEventKind.UNSPECIFIED;
    this.title = "";
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentEffectiveHistoryEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentEffectiveHistoryEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentEffectiveHistoryEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentEffectiveHistoryEvent, a, b2);
  }
  static $() {
    return ["EnvironmentEffectiveHistoryEvent|1 id 9|2 created_at_ms 3|3 scope #0|4 event_kind #1|5 title 9|6 description 9|7 version #2?|8 fallback_version #2?|9 setup_run #3?|10 environment_public_id 9?|11 environment_name 9?|12 restore_metadata #4?", LogicalEnvironmentScope, EnvironmentUpdateEventKind, EnvironmentVersionSummary, EnvironmentSetupRunLink, EnvironmentVersionRestoreMetadata];
  }
};
var GetEnvironmentHistoryRequest = class _GetEnvironmentHistoryRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentPublicIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentHistoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentHistoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentHistoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentHistoryRequest, a, b2);
  }
  static $() {
    return ["GetEnvironmentHistoryRequest|1 repo_config #0?|2 environment_public_ids 9*|3 limit 5?|4 dashboard_scope_id 9?", EnvironmentRepoConfig];
  }
};
var GetEnvironmentHistoryResponse = class _GetEnvironmentHistoryResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.effectiveEvents = [];
    this.environmentHistories = [];
    this.truncated = false;
    this.dashboardScopeUnavailable = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEnvironmentHistoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEnvironmentHistoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEnvironmentHistoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEnvironmentHistoryResponse, a, b2);
  }
  static $() {
    return ["GetEnvironmentHistoryResponse|1 effective_events #0*|2 environment_histories #1*|3 truncated 8|4 dashboard_scope_unavailable 8", EnvironmentEffectiveHistoryEvent, EnvironmentHistoryObject];
  }
};
var DeleteTeamEnvironmentRequest = class _DeleteTeamEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteTeamEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteTeamEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteTeamEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteTeamEnvironmentRequest, a, b2);
  }
  static $() {
    return ["DeleteTeamEnvironmentRequest|1 id 3|2 environment_public_id 9?"];
  }
};
var DeleteTeamEnvironmentResponse = class _DeleteTeamEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteTeamEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteTeamEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteTeamEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteTeamEnvironmentResponse, a, b2);
  }
  static $() {
    return ["DeleteTeamEnvironmentResponse"];
  }
};
var RestoreEnvironmentVersionRequest = class _RestoreEnvironmentVersionRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentVersionPublicId = "";
    this.targetScope = LogicalEnvironmentScope.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestoreEnvironmentVersionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestoreEnvironmentVersionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestoreEnvironmentVersionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestoreEnvironmentVersionRequest, a, b2);
  }
  static $() {
    return ["RestoreEnvironmentVersionRequest|1 environment_version_public_id 9|2 target_scope #0|3 target_environment_public_id 9?|4 delete_personal_environment_public_id 9?", LogicalEnvironmentScope];
  }
};
var RestoreEnvironmentVersionResponse = class _RestoreEnvironmentVersionResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestoreEnvironmentVersionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestoreEnvironmentVersionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestoreEnvironmentVersionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestoreEnvironmentVersionResponse, a, b2);
  }
  static $() {
    return ["RestoreEnvironmentVersionResponse|1 environment #0?", LogicalEnvironment];
  }
};
var SetTeamEnvironmentJsonRequest = class _SetTeamEnvironmentJsonRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentJson = "";
    this.repoUrl = "";
    this.scmRepoNodeId = "";
    this.deletePersonalEnvironment = false;
    this.writeSource = EnvironmentWriteSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetTeamEnvironmentJsonRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetTeamEnvironmentJsonRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetTeamEnvironmentJsonRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetTeamEnvironmentJsonRequest, a, b2);
  }
  static $() {
    return ["SetTeamEnvironmentJsonRequest|1 environment_json 9|2 repo_url 9|3 scm_repo_node_id 9|4 git_enterprise_uuid 9?|5 delete_personal_environment 8|6 write_source #0|7 source_bc_id 9?|8 environment_name 9?|9 repo_config #1?|10 environment_id 3?|11 environment_public_id 9?|12 delete_personal_environment_public_id 9?", EnvironmentWriteSource, EnvironmentRepoConfig];
  }
};
var SetTeamEnvironmentJsonResponse = class _SetTeamEnvironmentJsonResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetTeamEnvironmentJsonResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetTeamEnvironmentJsonResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetTeamEnvironmentJsonResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetTeamEnvironmentJsonResponse, a, b2);
  }
  static $() {
    return ["SetTeamEnvironmentJsonResponse|1 environment #0?|2 live_egress_reapply #1?|3 created 8?", LogicalEnvironment, LiveEgressReapplyResult];
  }
};
var SnapshotAndSaveEnvironmentRequest = class _SnapshotAndSaveEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.target = SnapshotAndSaveEnvironmentRequest_Target.UNSPECIFIED;
    this.bcId = "";
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SnapshotAndSaveEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SnapshotAndSaveEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SnapshotAndSaveEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SnapshotAndSaveEnvironmentRequest, a, b2);
  }
  static $() {
    return ["SnapshotAndSaveEnvironmentRequest|1 target #0|2 bc_id 9|3 repo_url 9|4 install_command 9?|5 existing_snapshot_id 9?|6 scm_repo_node_id 9?|7 git_enterprise_uuid 9?|8 environment_name 9?|9 repo_config #1?|10 environment_public_id 9?|11 egress_config #2?|12 start_command 9?|13 environment_build_id 9?", SnapshotAndSaveEnvironmentRequest_Target, EnvironmentRepoConfig, SnapshotAndSaveEnvironmentRequest_EgressConfig];
  }
};
var SnapshotAndSaveEnvironmentRequest_Target = /* @__PURE__ */ enumType2(proto3, __protoPackage146, "SnapshotAndSaveEnvironmentRequest.Target", [[0, "UNSPECIFIED"], [1, "PERSONAL"], [2, "TEAM"]], 1);
var SnapshotAndSaveEnvironmentRequest_EgressConfig = class _SnapshotAndSaveEnvironmentRequest_EgressConfig extends __protoMessage3139 {
  constructor(data) {
    super();
    this.mode = CloudAgentEgressProtectionMode.UNSPECIFIED;
    this.allowlist = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SnapshotAndSaveEnvironmentRequest_EgressConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SnapshotAndSaveEnvironmentRequest_EgressConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SnapshotAndSaveEnvironmentRequest_EgressConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SnapshotAndSaveEnvironmentRequest_EgressConfig, a, b2);
  }
  static $() {
    return ["SnapshotAndSaveEnvironmentRequest.EgressConfig|1 mode #0|2 allowlist 9*", CloudAgentEgressProtectionMode];
  }
};
var SnapshotAndSaveEnvironmentResponse = class _SnapshotAndSaveEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.snapshotId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SnapshotAndSaveEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SnapshotAndSaveEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SnapshotAndSaveEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SnapshotAndSaveEnvironmentResponse, a, b2);
  }
  static $() {
    return ["SnapshotAndSaveEnvironmentResponse|1 snapshot_id 9"];
  }
};
var ListReposWithLocalEnvironmentRequest = class _ListReposWithLocalEnvironmentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReposWithLocalEnvironmentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReposWithLocalEnvironmentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReposWithLocalEnvironmentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReposWithLocalEnvironmentRequest, a, b2);
  }
  static $() {
    return ["ListReposWithLocalEnvironmentRequest"];
  }
};
var RepoWithLocalEnvironment = class _RepoWithLocalEnvironment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.fileExists = false;
    this.lastSeenAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoWithLocalEnvironment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoWithLocalEnvironment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoWithLocalEnvironment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoWithLocalEnvironment, a, b2);
  }
  static $() {
    return ["RepoWithLocalEnvironment|1 repo_url 9|2 file_exists 8|3 last_seen_at_ms 3"];
  }
};
var ListReposWithLocalEnvironmentResponse = class _ListReposWithLocalEnvironmentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReposWithLocalEnvironmentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReposWithLocalEnvironmentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReposWithLocalEnvironmentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReposWithLocalEnvironmentResponse, a, b2);
  }
  static $() {
    return ["ListReposWithLocalEnvironmentResponse|1 repos #0*", RepoWithLocalEnvironment];
  }
};
var MarkBackgroundComposerReadRequest = class _MarkBackgroundComposerReadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkBackgroundComposerReadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkBackgroundComposerReadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkBackgroundComposerReadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkBackgroundComposerReadRequest, a, b2);
  }
  static $() {
    return ["MarkBackgroundComposerReadRequest|1 bc_id 9"];
  }
};
var MarkBackgroundComposerReadResponse = class _MarkBackgroundComposerReadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkBackgroundComposerReadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkBackgroundComposerReadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkBackgroundComposerReadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkBackgroundComposerReadResponse, a, b2);
  }
  static $() {
    return ["MarkBackgroundComposerReadResponse"];
  }
};
var MarkBackgroundComposerUnreadRequest = class _MarkBackgroundComposerUnreadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkBackgroundComposerUnreadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkBackgroundComposerUnreadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkBackgroundComposerUnreadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkBackgroundComposerUnreadRequest, a, b2);
  }
  static $() {
    return ["MarkBackgroundComposerUnreadRequest|1 bc_id 9"];
  }
};
var MarkBackgroundComposerUnreadResponse = class _MarkBackgroundComposerUnreadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkBackgroundComposerUnreadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkBackgroundComposerUnreadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkBackgroundComposerUnreadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkBackgroundComposerUnreadResponse, a, b2);
  }
  static $() {
    return ["MarkBackgroundComposerUnreadResponse"];
  }
};
var AdvanceBackgroundComposerReadCursorRequest = class _AdvanceBackgroundComposerReadCursorRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.readUpToMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdvanceBackgroundComposerReadCursorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdvanceBackgroundComposerReadCursorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdvanceBackgroundComposerReadCursorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdvanceBackgroundComposerReadCursorRequest, a, b2);
  }
  static $() {
    return ["AdvanceBackgroundComposerReadCursorRequest|1 bc_id 9|2 read_up_to_ms 3"];
  }
};
var AdvanceBackgroundComposerReadCursorResponse = class _AdvanceBackgroundComposerReadCursorResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdvanceBackgroundComposerReadCursorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdvanceBackgroundComposerReadCursorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdvanceBackgroundComposerReadCursorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdvanceBackgroundComposerReadCursorResponse, a, b2);
  }
  static $() {
    return ["AdvanceBackgroundComposerReadCursorResponse"];
  }
};
var FetchBackgroundComposerRequest = class _FetchBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.startIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["FetchBackgroundComposerRequest|1 bc_id 9|2 start_index 5|3 limit 5?"];
  }
};
var FetchBackgroundComposerResponse = class _FetchBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.responses = [];
    this.totalResponses = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["FetchBackgroundComposerResponse|1 responses #0*|2 total_responses 5", HeadlessAgenticComposerResponse];
  }
};
var GetTurnSummaryBackgroundComposerRequest = class _GetTurnSummaryBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTurnSummaryBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTurnSummaryBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTurnSummaryBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTurnSummaryBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["GetTurnSummaryBackgroundComposerRequest|1 bc_id 9|2 source_type #0?", BackgroundComposerSource];
  }
};
var GetTurnSummaryBackgroundComposerResponse = class _GetTurnSummaryBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.summary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTurnSummaryBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTurnSummaryBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTurnSummaryBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTurnSummaryBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["GetTurnSummaryBackgroundComposerResponse|1 summary 9"];
  }
};
var GetBackgroundComposerNameRequest = class _GetBackgroundComposerNameRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerNameRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerNameRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerNameRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerNameRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerNameRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerNameResponse = class _GetBackgroundComposerNameResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerNameResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerNameResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerNameResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerNameResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerNameResponse|1 name 9"];
  }
};
var GetBackgroundComposerPromptRequest = class _GetBackgroundComposerPromptRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerPromptRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerPromptRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerPromptRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerPromptRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerPromptRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerPromptResponse = class _GetBackgroundComposerPromptResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerPromptResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerPromptResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerPromptResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerPromptResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerPromptResponse|1 prompt #0", ConversationMessage];
  }
};
var ListBackgroundComposerArtifactsRequest = class _ListBackgroundComposerArtifactsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerArtifactsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerArtifactsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerArtifactsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerArtifactsRequest, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerArtifactsRequest|1 bc_id 9"];
  }
};
var BackgroundComposerArtifact = class _BackgroundComposerArtifact extends __protoMessage3139 {
  constructor(data) {
    super();
    this.absolutePath = "";
    this.sizeBytes = protoInt64.zero;
    this.updatedAtUnixMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerArtifact().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerArtifact().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerArtifact().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerArtifact, a, b2);
  }
  static $() {
    return ["BackgroundComposerArtifact|1 absolute_path 9|2 size_bytes 3|3 updated_at_unix_ms 3"];
  }
};
var ListBackgroundComposerArtifactsResponse = class _ListBackgroundComposerArtifactsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifacts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListBackgroundComposerArtifactsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListBackgroundComposerArtifactsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListBackgroundComposerArtifactsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListBackgroundComposerArtifactsResponse, a, b2);
  }
  static $() {
    return ["ListBackgroundComposerArtifactsResponse|1 artifacts #0*", BackgroundComposerArtifact];
  }
};
var GetBackgroundComposerArtifactRequest = class _GetBackgroundComposerArtifactRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.absolutePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerArtifactRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerArtifactRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerArtifactRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerArtifactRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerArtifactRequest|1 bc_id 9|2 absolute_path 9"];
  }
};
var GetBackgroundComposerArtifactResponse = class _GetBackgroundComposerArtifactResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.url = "";
    this.expiresAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerArtifactResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerArtifactResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerArtifactResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerArtifactResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerArtifactResponse|1 url 9|2 expires_at 9"];
  }
};
var GetBackgroundComposerArtifactBytesRequest = class _GetBackgroundComposerArtifactBytesRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.absolutePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerArtifactBytesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerArtifactBytesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerArtifactBytesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerArtifactBytesRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerArtifactBytesRequest|1 bc_id 9|2 absolute_path 9"];
  }
};
var GetBackgroundComposerArtifactBytesResponse = class _GetBackgroundComposerArtifactBytesResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.content = new Uint8Array(0);
    this.contentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerArtifactBytesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerArtifactBytesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerArtifactBytesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerArtifactBytesResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerArtifactBytesResponse|1 content 12|2 content_type 9"];
  }
};
var ReadBinaryFileRequest = class _ReadBinaryFileRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
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
    return ["ReadBinaryFileRequest|1 bc_id 9|2 path 9"];
  }
};
var ReadBinaryFileResponse = class _ReadBinaryFileResponse extends __protoMessage3139 {
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
var StreamBackgroundComposerArtifactRequest = class _StreamBackgroundComposerArtifactRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.absolutePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBackgroundComposerArtifactRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBackgroundComposerArtifactRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBackgroundComposerArtifactRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBackgroundComposerArtifactRequest, a, b2);
  }
  static $() {
    return ["StreamBackgroundComposerArtifactRequest|1 bc_id 9|2 absolute_path 9"];
  }
};
var StreamBackgroundComposerArtifactResponse = class _StreamBackgroundComposerArtifactResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.contentChunk = new Uint8Array(0);
    this.contentType = "";
    this.totalSize = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBackgroundComposerArtifactResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBackgroundComposerArtifactResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBackgroundComposerArtifactResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBackgroundComposerArtifactResponse, a, b2);
  }
  static $() {
    return ["StreamBackgroundComposerArtifactResponse|1 content_chunk 12|2 content_type 9|3 total_size 3"];
  }
};
var BackgroundComposerSharedArtifact = class _BackgroundComposerSharedArtifact extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifactId = "";
    this.sourceBcId = "";
    this.sourceAbsolutePath = "";
    this.publicUrl = "";
    this.title = "";
    this.contentType = "";
    this.shareSource = "";
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerSharedArtifact().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerSharedArtifact().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerSharedArtifact().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerSharedArtifact, a, b2);
  }
  static $() {
    return ["BackgroundComposerSharedArtifact|1 artifact_id 9|2 source_bc_id 9|3 source_absolute_path 9|4 public_url 9|5 title 9|6 content_type 9|7 share_source 9|8 revoked_at_ms 3?|9 created_at_ms 3|10 updated_at_ms 3"];
  }
};
var ListSharedBackgroundComposerArtifactsRequest = class _ListSharedBackgroundComposerArtifactsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListSharedBackgroundComposerArtifactsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListSharedBackgroundComposerArtifactsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListSharedBackgroundComposerArtifactsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListSharedBackgroundComposerArtifactsRequest, a, b2);
  }
  static $() {
    return ["ListSharedBackgroundComposerArtifactsRequest|1 bc_id 9"];
  }
};
var ListSharedBackgroundComposerArtifactsResponse = class _ListSharedBackgroundComposerArtifactsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifacts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListSharedBackgroundComposerArtifactsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListSharedBackgroundComposerArtifactsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListSharedBackgroundComposerArtifactsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListSharedBackgroundComposerArtifactsResponse, a, b2);
  }
  static $() {
    return ["ListSharedBackgroundComposerArtifactsResponse|1 artifacts #0*", BackgroundComposerSharedArtifact];
  }
};
var ShareBackgroundComposerArtifactRequest = class _ShareBackgroundComposerArtifactRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.absolutePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShareBackgroundComposerArtifactRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShareBackgroundComposerArtifactRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShareBackgroundComposerArtifactRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShareBackgroundComposerArtifactRequest, a, b2);
  }
  static $() {
    return ["ShareBackgroundComposerArtifactRequest|1 bc_id 9|2 absolute_path 9|3 title 9?"];
  }
};
var ShareBackgroundComposerArtifactResponse = class _ShareBackgroundComposerArtifactResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShareBackgroundComposerArtifactResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShareBackgroundComposerArtifactResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShareBackgroundComposerArtifactResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShareBackgroundComposerArtifactResponse, a, b2);
  }
  static $() {
    return ["ShareBackgroundComposerArtifactResponse|1 artifact #0", BackgroundComposerSharedArtifact];
  }
};
var UnshareBackgroundComposerArtifactRequest = class _UnshareBackgroundComposerArtifactRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifactId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnshareBackgroundComposerArtifactRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnshareBackgroundComposerArtifactRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnshareBackgroundComposerArtifactRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnshareBackgroundComposerArtifactRequest, a, b2);
  }
  static $() {
    return ["UnshareBackgroundComposerArtifactRequest|1 artifact_id 9"];
  }
};
var UnshareBackgroundComposerArtifactResponse = class _UnshareBackgroundComposerArtifactResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnshareBackgroundComposerArtifactResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnshareBackgroundComposerArtifactResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnshareBackgroundComposerArtifactResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnshareBackgroundComposerArtifactResponse, a, b2);
  }
  static $() {
    return ["UnshareBackgroundComposerArtifactResponse|1 artifact #0?", BackgroundComposerSharedArtifact];
  }
};
var GetPublicBackgroundComposerArtifactRequest = class _GetPublicBackgroundComposerArtifactRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.artifactId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPublicBackgroundComposerArtifactRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPublicBackgroundComposerArtifactRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPublicBackgroundComposerArtifactRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPublicBackgroundComposerArtifactRequest, a, b2);
  }
  static $() {
    return ["GetPublicBackgroundComposerArtifactRequest|1 artifact_id 9"];
  }
};
var GetPublicBackgroundComposerArtifactResponse = class _GetPublicBackgroundComposerArtifactResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.url = "";
    this.contentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPublicBackgroundComposerArtifactResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPublicBackgroundComposerArtifactResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPublicBackgroundComposerArtifactResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPublicBackgroundComposerArtifactResponse, a, b2);
  }
  static $() {
    return ["GetPublicBackgroundComposerArtifactResponse|1 url 9|2 content_type 9|3 title 9?"];
  }
};
var BackgroundComposerUserEgressPolicy = class _BackgroundComposerUserEgressPolicy extends __protoMessage3139 {
  constructor(data) {
    super();
    this.allowlist = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerUserEgressPolicy().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerUserEgressPolicy().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerUserEgressPolicy().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerUserEgressPolicy, a, b2);
  }
  static $() {
    return ["BackgroundComposerUserEgressPolicy|1 allowlist 9*"];
  }
};
var BackgroundComposerQuickActionSubagentSlot = class _BackgroundComposerQuickActionSubagentSlot extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.templateId = "";
    this.subagentType = "";
    this.enabled = false;
    this.order = 0;
    this.executionMode = BackgroundComposerQuickActionExecutionMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerQuickActionSubagentSlot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerQuickActionSubagentSlot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerQuickActionSubagentSlot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerQuickActionSubagentSlot, a, b2);
  }
  static $() {
    return ["BackgroundComposerQuickActionSubagentSlot|1 id 9|2 label 9|3 template_id 9|4 subagent_type 9|5 enabled 8|6 order 5|7 execution_mode #0", BackgroundComposerQuickActionExecutionMode];
  }
};
var BackgroundComposerQuickActionSubagentTemplate = class _BackgroundComposerQuickActionSubagentTemplate extends __protoMessage3139 {
  constructor(data) {
    super();
    this.templateId = "";
    this.label = "";
    this.description = "";
    this.subagentType = "";
    this.scope = BackgroundComposerQuickActionSubagentTemplateScope.UNSPECIFIED;
    this.canEdit = false;
    this.canDelete = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerQuickActionSubagentTemplate, a, b2);
  }
  static $() {
    return ["BackgroundComposerQuickActionSubagentTemplate|1 template_id 9|2 label 9|3 description 9|4 subagent_type 9|5 prompt 9?|6 scope #0|7 can_edit 8|8 can_delete 8|9 icon_name 9?", BackgroundComposerQuickActionSubagentTemplateScope];
  }
};
var BackgroundComposerQuickActionSubagentTemplateMutation = class _BackgroundComposerQuickActionSubagentTemplateMutation extends __protoMessage3139 {
  constructor(data) {
    super();
    this.operation = BackgroundComposerQuickActionSubagentTemplateOperation.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplateMutation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplateMutation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerQuickActionSubagentTemplateMutation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerQuickActionSubagentTemplateMutation, a, b2);
  }
  static $() {
    return ["BackgroundComposerQuickActionSubagentTemplateMutation|1 operation #0|2 template #1", BackgroundComposerQuickActionSubagentTemplateOperation, BackgroundComposerQuickActionSubagentTemplate];
  }
};
var BackgroundComposerQuickActionSettings = class _BackgroundComposerQuickActionSettings extends __protoMessage3139 {
  constructor(data) {
    super();
    this.quickActionSubagentSlots = [];
    this.quickActionSubagentSlotsExplicitlySet = false;
    this.quickActionSubagentTemplates = [];
    this.quickActionSubagentTemplateMutations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerQuickActionSettings().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerQuickActionSettings().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerQuickActionSettings().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerQuickActionSettings, a, b2);
  }
  static $() {
    return ["BackgroundComposerQuickActionSettings|1 quick_action_subagent_slots #0*|2 quick_action_subagent_slots_explicitly_set 8|3 quick_action_subagent_catalog_version 13?|4 quick_action_subagent_templates #1*|5 quick_action_subagent_template_mutations #2*", BackgroundComposerQuickActionSubagentSlot, BackgroundComposerQuickActionSubagentTemplate, BackgroundComposerQuickActionSubagentTemplateMutation];
  }
};
var BackgroundComposerDefaultEnvironmentSetting = class _BackgroundComposerDefaultEnvironmentSetting extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerDefaultEnvironmentSetting().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerDefaultEnvironmentSetting().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerDefaultEnvironmentSetting().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerDefaultEnvironmentSetting, a, b2);
  }
  static $() {
    return ["BackgroundComposerDefaultEnvironmentSetting|1 repo_config #0?|2 environment_public_id 9?", EnvironmentRepoConfig];
  }
};
var UpdateBackgroundComposerUserSettingsRequest = class _UpdateBackgroundComposerUserSettingsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.defaultEnvironmentSettings = [];
    this.sidebarNamedAgentIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerUserSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerUserSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerUserSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerUserSettingsRequest, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerUserSettingsRequest|1 model_name 9?|2 slack_notifications_for_web_enabled 8?|3 ci_failure_followup_enabled 8?|4 browser_use_enabled 8?|5 auto_create_pr_setting #0?|6 pr_review_open_destination #1?|7 github_artifact_posting #2?|8 egress_protection_mode #3?|9 egress_policy #4?|10 branch_prefix 9?|11 quick_action_settings #5?|12 allow_private_workers 8?|13 bc_id 9?|14 default_environment_public_id 9?|15 default_environment_settings #6*|16 remote_control_enabled 8?|17 pr_review_open_surface #7?|18 sidebar_named_agent_ids 9*|19 sidebar_named_agent_ids_explicitly_set 8?|20 default_model_selection #8?|21 ask_question_auto_answer_timeout_minutes 5?|22 expected_scope #9", AutoCreatePrSetting, PrReviewOpenDestinationMode, GithubArtifactPostingMode, CloudAgentEgressProtectionMode, BackgroundComposerUserEgressPolicy, BackgroundComposerQuickActionSettings, BackgroundComposerDefaultEnvironmentSetting, PrReviewOpenSurfaceMode, CloudAgentModelSelection, CloudAgentRequestScope];
  }
};
var UpdateBackgroundComposerUserSettingsResponse = class _UpdateBackgroundComposerUserSettingsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateBackgroundComposerUserSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateBackgroundComposerUserSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateBackgroundComposerUserSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateBackgroundComposerUserSettingsResponse, a, b2);
  }
  static $() {
    return ["UpdateBackgroundComposerUserSettingsResponse"];
  }
};
var GetBackgroundComposerUserSettingsRequest = class _GetBackgroundComposerUserSettingsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerUserSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerUserSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerUserSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerUserSettingsRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerUserSettingsRequest|1 expected_scope #0", CloudAgentRequestScope];
  }
};
var GetBackgroundComposerUserSettingsResponse = class _GetBackgroundComposerUserSettingsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.defaultEnvironmentSettings = [];
    this.sidebarNamedAgentIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerUserSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerUserSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerUserSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerUserSettingsResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerUserSettingsResponse|1 model_name 9?|2 slack_notifications_for_web_enabled 8?|3 ci_failure_followup_enabled 8?|4 browser_use_enabled 8?|5 auto_create_pr_setting #0?|6 pr_review_open_destination #1?|7 github_artifact_posting #2?|8 egress_protection_mode #3?|9 egress_policy #4?|10 branch_prefix 9?|11 quick_action_settings #5?|12 allow_private_workers 8?|13 default_environment_public_id 9?|14 default_environment_settings #6*|15 remote_control_enabled 8?|16 pr_review_open_surface #7?|17 sidebar_named_agent_ids 9*|18 default_model_selection #8?|19 ask_question_auto_answer_timeout_minutes 5?", AutoCreatePrSetting, PrReviewOpenDestinationMode, GithubArtifactPostingMode, CloudAgentEgressProtectionMode, BackgroundComposerUserEgressPolicy, BackgroundComposerQuickActionSettings, BackgroundComposerDefaultEnvironmentSetting, PrReviewOpenSurfaceMode, CloudAgentModelSelection];
  }
};
var GetRepositoryBranchesRequest = class _GetRepositoryBranchesRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepositoryBranchesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepositoryBranchesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepositoryBranchesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepositoryBranchesRequest, a, b2);
  }
  static $() {
    return ["GetRepositoryBranchesRequest|1 repo_url 9|2 page 5?|3 query 9?|4 only_user_branches 8?|5 team_id 5?"];
  }
};
var GetRepositoryBranchesResponse = class _GetRepositoryBranchesResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.branches = [];
    this.hasMore = false;
    this.page = 0;
    this.isEmptyRepo = false;
    this.bootstrapBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepositoryBranchesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepositoryBranchesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepositoryBranchesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepositoryBranchesResponse, a, b2);
  }
  static $() {
    return ["GetRepositoryBranchesResponse|1 branches #0*|2 has_more 8|3 page 5|4 is_empty_repo 8|5 bootstrap_branch 9", GetRepositoryBranchesResponse_Branch];
  }
};
var GetRepositoryBranchesResponse_Branch = class _GetRepositoryBranchesResponse_Branch extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.isDefault = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepositoryBranchesResponse_Branch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepositoryBranchesResponse_Branch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepositoryBranchesResponse_Branch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepositoryBranchesResponse_Branch, a, b2);
  }
  static $() {
    return ["GetRepositoryBranchesResponse.Branch|1 name 9|2 is_default 8"];
  }
};
var GetPullRequestMergeStatusRequest = class _GetPullRequestMergeStatusRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestMergeStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestMergeStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestMergeStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestMergeStatusRequest, a, b2);
  }
  static $() {
    return ["GetPullRequestMergeStatusRequest|1 pr_url 9|2 include_behind_count 8?"];
  }
};
var GetPullRequestMergeStatusResponse = class _GetPullRequestMergeStatusResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.isMerged = false;
    this.isClosed = false;
    this.mergeableState = "";
    this.state = "";
    this.isDraft = false;
    this.title = "";
    this.baseBranch = "";
    this.behindBy = 0;
    this.canUpdateBranch = false;
    this.isAutoMergeEnabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestMergeStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestMergeStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestMergeStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestMergeStatusResponse, a, b2);
  }
  static $() {
    return ["GetPullRequestMergeStatusResponse|1 is_merged 8|2 is_closed 8|3 mergeable_state 9|4 state 9|5 is_draft 8|6 title 9|7 base_branch 9|8 behind_by 5|9 can_update_branch 8|10 is_auto_merge_enabled 8|11 viewer_can_enable_auto_merge 8?"];
  }
};
var GetDetailedPullRequestStatusRequest = class _GetDetailedPullRequestStatusRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDetailedPullRequestStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDetailedPullRequestStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDetailedPullRequestStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDetailedPullRequestStatusRequest, a, b2);
  }
  static $() {
    return ["GetDetailedPullRequestStatusRequest|1 pr_url 9|2 cache_expiration_seconds 5?"];
  }
};
var PRDeploymentPreviewStatus = class _PRDeploymentPreviewStatus extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environmentUrl = "";
    this.logUrl = "";
    this.state = PRDeploymentStatusState.PR_DEPLOYMENT_STATUS_STATE_UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRDeploymentPreviewStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRDeploymentPreviewStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRDeploymentPreviewStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRDeploymentPreviewStatus, a, b2);
  }
  static $() {
    return ["PRDeploymentPreviewStatus|1 environment_url 9|2 log_url 9|3 state #0", PRDeploymentStatusState];
  }
};
var PRDeploymentPreview = class _PRDeploymentPreview extends __protoMessage3139 {
  constructor(data) {
    super();
    this.environment = "";
    this.state = PRDeploymentState.PR_DEPLOYMENT_STATE_UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRDeploymentPreview().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRDeploymentPreview().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRDeploymentPreview().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRDeploymentPreview, a, b2);
  }
  static $() {
    return ["PRDeploymentPreview|1 environment 9|2 state #0|3 latest_status #1", PRDeploymentState, PRDeploymentPreviewStatus];
  }
};
var GetDetailedPullRequestStatusResponse = class _GetDetailedPullRequestStatusResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.isMerged = false;
    this.isClosed = false;
    this.mergeableState = "";
    this.state = "";
    this.isDraft = false;
    this.title = "";
    this.baseBranch = "";
    this.behindBy = 0;
    this.canUpdateBranch = false;
    this.isAutoMergeEnabled = false;
    this.deploymentPreviews = [];
    this.reviewers = [];
    this.requestedReviewers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDetailedPullRequestStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDetailedPullRequestStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDetailedPullRequestStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDetailedPullRequestStatusResponse, a, b2);
  }
  static $() {
    return ["GetDetailedPullRequestStatusResponse|1 is_merged 8|2 is_closed 8|3 mergeable_state 9|4 state 9|5 is_draft 8|6 title 9|7 base_branch 9|8 behind_by 5|9 can_update_branch 8|10 check_status #0?|11 review_decision 9?|12 is_auto_merge_enabled 8|13 head_sha 9?|14 base_sha 9?|15 viewer_can_enable_auto_merge 8?|16 deployment_previews #1*|17 additions 5?|18 deletions 5?|19 commit_count 5?|20 review_count 5?|21 reviewers #2*|22 requested_reviewers #3*|23 requires_merge_queue 8?|24 is_in_merge_queue 8?", PRCheckStatus, PRDeploymentPreview, PRReviewSummary, PRRequestedReviewer];
  }
};
var PRReviewSummary = class _PRReviewSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.authorLogin = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRReviewSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRReviewSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRReviewSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRReviewSummary, a, b2);
  }
  static $() {
    return ["PRReviewSummary|1 author_login 9|2 author_name 9?|3 author_avatar_url 9?|4 state 9?"];
  }
};
var PRRequestedReviewer = class _PRRequestedReviewer extends __protoMessage3139 {
  constructor(data) {
    super();
    this.login = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRRequestedReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRRequestedReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRRequestedReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRRequestedReviewer, a, b2);
  }
  static $() {
    return ["PRRequestedReviewer|1 login 9|2 name 9?|3 avatar_url 9?|4 kind 9?"];
  }
};
var CheckPullRequestMergeabilityRequest = class _CheckPullRequestMergeabilityRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckPullRequestMergeabilityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckPullRequestMergeabilityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckPullRequestMergeabilityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckPullRequestMergeabilityRequest, a, b2);
  }
  static $() {
    return ["CheckPullRequestMergeabilityRequest|1 pr_url 9"];
  }
};
var CheckPullRequestMergeabilityResponse = class _CheckPullRequestMergeabilityResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.canMerge = false;
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckPullRequestMergeabilityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckPullRequestMergeabilityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckPullRequestMergeabilityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckPullRequestMergeabilityResponse, a, b2);
  }
  static $() {
    return ["CheckPullRequestMergeabilityResponse|1 can_merge 8|2 error 9|3 mergeable_state 9?"];
  }
};
var PRReviewComment = class _PRReviewComment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.authorLogin = "";
    this.avatarUrl = "";
    this.body = "";
    this.createdAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRReviewComment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRReviewComment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRReviewComment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRReviewComment, a, b2);
  }
  static $() {
    return ["PRReviewComment|1 id 9|2 author_login 9|3 avatar_url 9|4 body 9|5 created_at 9|6 diff_hunk 9?|7 body_html 9?|8 author_name 9?"];
  }
};
var PRReviewThread = class _PRReviewThread extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.path = "";
    this.diffSide = "";
    this.isResolved = false;
    this.isOutdated = false;
    this.comments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRReviewThread().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRReviewThread().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRReviewThread().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRReviewThread, a, b2);
  }
  static $() {
    return ["PRReviewThread|1 id 9|2 path 9|3 line 5?|4 start_line 5?|5 original_line 5?|6 original_start_line 5?|7 diff_side 9|8 is_resolved 8|9 is_outdated 8|10 comments #0*|11 pull_request_review_id 9?", PRReviewComment];
  }
};
var PRTopLevelComment = class _PRTopLevelComment extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.authorLogin = "";
    this.avatarUrl = "";
    this.body = "";
    this.createdAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRTopLevelComment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRTopLevelComment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRTopLevelComment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRTopLevelComment, a, b2);
  }
  static $() {
    return ["PRTopLevelComment|1 id 9|2 author_login 9|3 avatar_url 9|4 body 9|5 created_at 9|6 body_html 9?|7 author_name 9?"];
  }
};
var PRCommitUser = class _PRCommitUser extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRCommitUser().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRCommitUser().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRCommitUser().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRCommitUser, a, b2);
  }
  static $() {
    return ["PRCommitUser|1 name 9?|2 email 9?|3 avatar_url 9?"];
  }
};
var PRCommit = class _PRCommit extends __protoMessage3139 {
  constructor(data) {
    super();
    this.sha = "";
    this.message = "";
    this.committedDate = "";
    this.additions = 0;
    this.deletions = 0;
    this.authors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRCommit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRCommit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRCommit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRCommit, a, b2);
  }
  static $() {
    return ["PRCommit|1 sha 9|2 message 9|3 committed_date 9|4 additions 5|5 deletions 5|6 changed_files 5?|7 author #0|8 committer #0|9 authors #0*", PRCommitUser];
  }
};
var GetPullRequestDiscussionsRequest = class _GetPullRequestDiscussionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestDiscussionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestDiscussionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestDiscussionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestDiscussionsRequest, a, b2);
  }
  static $() {
    return ["GetPullRequestDiscussionsRequest|1 pr_url 9|2 skip_cache 8?"];
  }
};
var GetPullRequestDiscussionsResponse = class _GetPullRequestDiscussionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.threads = [];
    this.topLevelComments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestDiscussionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestDiscussionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestDiscussionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestDiscussionsResponse, a, b2);
  }
  static $() {
    return ["GetPullRequestDiscussionsResponse|1 threads #0*|2 top_level_comments #1*|3 check_status #2?", PRReviewThread, PRTopLevelComment, PRCheckStatus];
  }
};
var GetPullRequestCommitsRequest = class _GetPullRequestCommitsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestCommitsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestCommitsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestCommitsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestCommitsRequest, a, b2);
  }
  static $() {
    return ["GetPullRequestCommitsRequest|1 pr_url 9|2 after_cursor 9?"];
  }
};
var GetPullRequestCommitsResponse = class _GetPullRequestCommitsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.commits = [];
    this.hasNextPage = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestCommitsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestCommitsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestCommitsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestCommitsResponse, a, b2);
  }
  static $() {
    return ["GetPullRequestCommitsResponse|1 commits #0*|2 has_next_page 8|3 end_cursor 9?", PRCommit];
  }
};
var GetPullRequestTimelineEventsRequest = class _GetPullRequestTimelineEventsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestTimelineEventsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestTimelineEventsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestTimelineEventsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestTimelineEventsRequest, a, b2);
  }
  static $() {
    return ["GetPullRequestTimelineEventsRequest|1 pr_url 9|2 page 5?"];
  }
};
var GetPullRequestTimelineEventsResponse = class _GetPullRequestTimelineEventsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.events = [];
    this.hasNextPage = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestTimelineEventsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestTimelineEventsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestTimelineEventsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestTimelineEventsResponse, a, b2);
  }
  static $() {
    return ["GetPullRequestTimelineEventsResponse|1 events #0*|2 has_next_page 8|3 next_page 5?", PRTimelineEvent];
  }
};
var PRTimelineEvent = class _PRTimelineEvent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.id = "";
    this.eventType = "";
    this.createdAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRTimelineEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRTimelineEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRTimelineEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRTimelineEvent, a, b2);
  }
  static $() {
    return ["PRTimelineEvent|1 id 9|2 event_type 9|3 created_at 9|4 actor #0?|5 label 9?|6 body 9?", PRTimelineActor];
  }
};
var PRTimelineActor = class _PRTimelineActor extends __protoMessage3139 {
  constructor(data) {
    super();
    this.login = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PRTimelineActor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PRTimelineActor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PRTimelineActor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PRTimelineActor, a, b2);
  }
  static $() {
    return ["PRTimelineActor|1 login 9|2 avatar_url 9?|3 name 9?"];
  }
};
var ReplyToReviewThreadRequest = class _ReplyToReviewThreadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.threadId = "";
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReplyToReviewThreadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReplyToReviewThreadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReplyToReviewThreadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReplyToReviewThreadRequest, a, b2);
  }
  static $() {
    return ["ReplyToReviewThreadRequest|1 pr_url 9|2 thread_id 9|3 body 9"];
  }
};
var ReplyToReviewThreadResponse = class _ReplyToReviewThreadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReplyToReviewThreadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReplyToReviewThreadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReplyToReviewThreadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReplyToReviewThreadResponse, a, b2);
  }
  static $() {
    return ["ReplyToReviewThreadResponse|1 thread #0?", PRReviewThread];
  }
};
var ResolveReviewThreadRequest = class _ResolveReviewThreadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.threadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveReviewThreadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveReviewThreadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveReviewThreadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveReviewThreadRequest, a, b2);
  }
  static $() {
    return ["ResolveReviewThreadRequest|1 pr_url 9|2 thread_id 9"];
  }
};
var ResolveReviewThreadResponse = class _ResolveReviewThreadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveReviewThreadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveReviewThreadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveReviewThreadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveReviewThreadResponse, a, b2);
  }
  static $() {
    return ["ResolveReviewThreadResponse|1 success 8"];
  }
};
var UnresolveReviewThreadRequest = class _UnresolveReviewThreadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.threadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnresolveReviewThreadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnresolveReviewThreadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnresolveReviewThreadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnresolveReviewThreadRequest, a, b2);
  }
  static $() {
    return ["UnresolveReviewThreadRequest|1 pr_url 9|2 thread_id 9"];
  }
};
var UnresolveReviewThreadResponse = class _UnresolveReviewThreadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnresolveReviewThreadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnresolveReviewThreadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnresolveReviewThreadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnresolveReviewThreadResponse, a, b2);
  }
  static $() {
    return ["UnresolveReviewThreadResponse|1 success 8"];
  }
};
var DeletePullRequestReviewCommentRequest = class _DeletePullRequestReviewCommentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.commentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePullRequestReviewCommentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePullRequestReviewCommentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePullRequestReviewCommentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePullRequestReviewCommentRequest, a, b2);
  }
  static $() {
    return ["DeletePullRequestReviewCommentRequest|1 pr_url 9|2 comment_id 9|3 comment_kind 9?"];
  }
};
var DeletePullRequestReviewCommentResponse = class _DeletePullRequestReviewCommentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePullRequestReviewCommentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePullRequestReviewCommentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePullRequestReviewCommentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePullRequestReviewCommentResponse, a, b2);
  }
  static $() {
    return ["DeletePullRequestReviewCommentResponse|1 success 8"];
  }
};
var AddPullRequestReviewCommentRequest = class _AddPullRequestReviewCommentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.path = "";
    this.body = "";
    this.line = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddPullRequestReviewCommentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddPullRequestReviewCommentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddPullRequestReviewCommentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddPullRequestReviewCommentRequest, a, b2);
  }
  static $() {
    return ["AddPullRequestReviewCommentRequest|1 pr_url 9|2 path 9|3 body 9|4 line 5|5 start_line 5?|6 diff_side 9?|7 commit_oid 9?"];
  }
};
var AddPullRequestReviewCommentResponse = class _AddPullRequestReviewCommentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddPullRequestReviewCommentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddPullRequestReviewCommentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddPullRequestReviewCommentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddPullRequestReviewCommentResponse, a, b2);
  }
  static $() {
    return ["AddPullRequestReviewCommentResponse|1 thread #0?", PRReviewThread];
  }
};
var MergePullRequestRequest = class _MergePullRequestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.useMergeQueue = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergePullRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergePullRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergePullRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergePullRequestRequest, a, b2);
  }
  static $() {
    return ["MergePullRequestRequest|1 pr_url 9|2 merge_method 9?|3 use_merge_queue 8"];
  }
};
var MergePullRequestResponse = class _MergePullRequestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.error = "";
    this.wasEnqueued = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergePullRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergePullRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergePullRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergePullRequestResponse, a, b2);
  }
  static $() {
    return ["MergePullRequestResponse|1 success 8|2 error 9|3 pr_node_id 9?|4 was_enqueued 8"];
  }
};
var EnablePullRequestAutoMergeRequest = class _EnablePullRequestAutoMergeRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnablePullRequestAutoMergeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnablePullRequestAutoMergeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnablePullRequestAutoMergeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnablePullRequestAutoMergeRequest, a, b2);
  }
  static $() {
    return ["EnablePullRequestAutoMergeRequest|1 pr_url 9|2 merge_method 9?"];
  }
};
var EnablePullRequestAutoMergeResponse = class _EnablePullRequestAutoMergeResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnablePullRequestAutoMergeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnablePullRequestAutoMergeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnablePullRequestAutoMergeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnablePullRequestAutoMergeResponse, a, b2);
  }
  static $() {
    return ["EnablePullRequestAutoMergeResponse|1 success 8|2 error 9|3 pr_node_id 9?"];
  }
};
var DisablePullRequestAutoMergeRequest = class _DisablePullRequestAutoMergeRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisablePullRequestAutoMergeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisablePullRequestAutoMergeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisablePullRequestAutoMergeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisablePullRequestAutoMergeRequest, a, b2);
  }
  static $() {
    return ["DisablePullRequestAutoMergeRequest|1 pr_url 9"];
  }
};
var DisablePullRequestAutoMergeResponse = class _DisablePullRequestAutoMergeResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisablePullRequestAutoMergeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisablePullRequestAutoMergeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisablePullRequestAutoMergeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisablePullRequestAutoMergeResponse, a, b2);
  }
  static $() {
    return ["DisablePullRequestAutoMergeResponse|1 success 8|2 error 9|3 pr_node_id 9?"];
  }
};
var EnvironmentPort = class _EnvironmentPort extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.port = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentPort().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentPort().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentPort().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentPort, a, b2);
  }
  static $() {
    return ["EnvironmentPort|1 name 9|2 port 5"];
  }
};
var RegisterPushNotificationTokenRequest = class _RegisterPushNotificationTokenRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.token = "";
    this.platform = PushPlatform.UNSPECIFIED;
    this.deviceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RegisterPushNotificationTokenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RegisterPushNotificationTokenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RegisterPushNotificationTokenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RegisterPushNotificationTokenRequest, a, b2);
  }
  static $() {
    return ["RegisterPushNotificationTokenRequest|1 token 9|2 platform #0|3 device_id 9|4 bundle_id 9?", PushPlatform];
  }
};
var RegisterPushNotificationTokenResponse = class _RegisterPushNotificationTokenResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RegisterPushNotificationTokenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RegisterPushNotificationTokenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RegisterPushNotificationTokenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RegisterPushNotificationTokenResponse, a, b2);
  }
  static $() {
    return ["RegisterPushNotificationTokenResponse"];
  }
};
var DeletePushNotificationTokenRequest = class _DeletePushNotificationTokenRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.deviceId = "";
    this.platform = PushPlatform.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePushNotificationTokenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePushNotificationTokenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePushNotificationTokenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePushNotificationTokenRequest, a, b2);
  }
  static $() {
    return ["DeletePushNotificationTokenRequest|1 device_id 9|2 platform #0", PushPlatform];
  }
};
var DeletePushNotificationTokenResponse = class _DeletePushNotificationTokenResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeletePushNotificationTokenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeletePushNotificationTokenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeletePushNotificationTokenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeletePushNotificationTokenResponse, a, b2);
  }
  static $() {
    return ["DeletePushNotificationTokenResponse"];
  }
};
var ResolveOriginAgentApprovalRequest = class _ResolveOriginAgentApprovalRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.approvalId = "";
    this.resolution = OriginAgentApprovalResolution.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOriginAgentApprovalRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOriginAgentApprovalRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOriginAgentApprovalRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOriginAgentApprovalRequest, a, b2);
  }
  static $() {
    return ["ResolveOriginAgentApprovalRequest|1 approval_id 9|2 resolution #0", OriginAgentApprovalResolution];
  }
};
var ResolveOriginAgentApprovalResponse = class _ResolveOriginAgentApprovalResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.accepted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveOriginAgentApprovalResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveOriginAgentApprovalResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveOriginAgentApprovalResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveOriginAgentApprovalResponse, a, b2);
  }
  static $() {
    return ["ResolveOriginAgentApprovalResponse|1 accepted 8"];
  }
};
var GetOriginAgentApprovalRequest = class _GetOriginAgentApprovalRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.approvalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginAgentApprovalRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginAgentApprovalRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginAgentApprovalRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginAgentApprovalRequest, a, b2);
  }
  static $() {
    return ["GetOriginAgentApprovalRequest|1 approval_id 9"];
  }
};
var GetOriginAgentApprovalResponse = class _GetOriginAgentApprovalResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.summary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginAgentApprovalResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginAgentApprovalResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginAgentApprovalResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginAgentApprovalResponse, a, b2);
  }
  static $() {
    return ["GetOriginAgentApprovalResponse|1 summary 9|2 approval #0?", BackgroundComposerApprovalUpdate];
  }
};
var LiveActivityAgentEntry = class _LiveActivityAgentEntry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.title = "";
    this.status = BackgroundComposerStatus.UNSPECIFIED;
    this.startedAtEpochSeconds = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LiveActivityAgentEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LiveActivityAgentEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LiveActivityAgentEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LiveActivityAgentEntry, a, b2);
  }
  static $() {
    return ["LiveActivityAgentEntry|1 bc_id 9|2 title 9|3 status #0|4 started_at_epoch_seconds 3|5 repo_label 9?|6 branch_name 9?|7 finished_at_epoch_seconds 3?|8 result_type 9?|9 lines_added 5?|10 lines_removed 5?|11 changed_files 5?", BackgroundComposerStatus];
  }
};
var LiveActivityContentState = class _LiveActivityContentState extends __protoMessage3139 {
  constructor(data) {
    super();
    this.agents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LiveActivityContentState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LiveActivityContentState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LiveActivityContentState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LiveActivityContentState, a, b2);
  }
  static $() {
    return ["LiveActivityContentState|1 agents #0*", LiveActivityAgentEntry];
  }
};
var SyncLiveActivityRequest = class _SyncLiveActivityRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.deviceId = "";
    this.platform = PushPlatform.UNSPECIFIED;
    this.activityPushToken = "";
    this.stateVersion = protoInt64.zero;
    this.bundleId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SyncLiveActivityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SyncLiveActivityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SyncLiveActivityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SyncLiveActivityRequest, a, b2);
  }
  static $() {
    return ["SyncLiveActivityRequest|1 device_id 9|2 platform #0|3 activity_push_token 9|4 content_state #1|5 state_version 4|6 bundle_id 9", PushPlatform, LiveActivityContentState];
  }
};
var SyncLiveActivityResponse = class _SyncLiveActivityResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SyncLiveActivityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SyncLiveActivityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SyncLiveActivityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SyncLiveActivityResponse, a, b2);
  }
  static $() {
    return ["SyncLiveActivityResponse"];
  }
};
var DeleteLiveActivityRequest = class _DeleteLiveActivityRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.deviceId = "";
    this.platform = PushPlatform.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteLiveActivityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteLiveActivityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteLiveActivityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteLiveActivityRequest, a, b2);
  }
  static $() {
    return ["DeleteLiveActivityRequest|1 device_id 9|2 platform #0", PushPlatform];
  }
};
var DeleteLiveActivityResponse = class _DeleteLiveActivityResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteLiveActivityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteLiveActivityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteLiveActivityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteLiveActivityResponse, a, b2);
  }
  static $() {
    return ["DeleteLiveActivityResponse"];
  }
};
var VerifyBackgroundComposerAccessRequest = class _VerifyBackgroundComposerAccessRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.accessType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VerifyBackgroundComposerAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VerifyBackgroundComposerAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VerifyBackgroundComposerAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VerifyBackgroundComposerAccessRequest, a, b2);
  }
  static $() {
    return ["VerifyBackgroundComposerAccessRequest|1 bc_id 9|2 access_type 9"];
  }
};
var VerifyBackgroundComposerAccessResponse = class _VerifyBackgroundComposerAccessResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.hasAccess = false;
    this.denialReason = BackgroundComposerAccessDenialReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _VerifyBackgroundComposerAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _VerifyBackgroundComposerAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _VerifyBackgroundComposerAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_VerifyBackgroundComposerAccessResponse, a, b2);
  }
  static $() {
    return ["VerifyBackgroundComposerAccessResponse|1 has_access 8|2 denial_reason #0", BackgroundComposerAccessDenialReason];
  }
};
var ConvertPullRequestFromDraftRequest = class _ConvertPullRequestFromDraftRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConvertPullRequestFromDraftRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConvertPullRequestFromDraftRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConvertPullRequestFromDraftRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConvertPullRequestFromDraftRequest, a, b2);
  }
  static $() {
    return ["ConvertPullRequestFromDraftRequest|1 bc_id 9|2 pr_url 9?"];
  }
};
var ConvertPullRequestFromDraftResponse = class _ConvertPullRequestFromDraftResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConvertPullRequestFromDraftResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConvertPullRequestFromDraftResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConvertPullRequestFromDraftResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConvertPullRequestFromDraftResponse, a, b2);
  }
  static $() {
    return ["ConvertPullRequestFromDraftResponse|1 success 8|2 error 9"];
  }
};
var UpdatePullRequestBranchRequest = class _UpdatePullRequestBranchRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdatePullRequestBranchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdatePullRequestBranchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdatePullRequestBranchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdatePullRequestBranchRequest, a, b2);
  }
  static $() {
    return ["UpdatePullRequestBranchRequest|1 pr_url 9"];
  }
};
var UpdatePullRequestBranchResponse = class _UpdatePullRequestBranchResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.success = false;
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdatePullRequestBranchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdatePullRequestBranchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdatePullRequestBranchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdatePullRequestBranchResponse, a, b2);
  }
  static $() {
    return ["UpdatePullRequestBranchResponse|1 success 8|2 error 9|3 new_head_sha 9?"];
  }
};
var CloudAgentState = class _CloudAgentState extends __protoMessage3139 {
  constructor(data) {
    super();
    this.numPriorInteractionUpdates = 0;
    this.prBody = new Uint8Array(0);
    this.summary = new Uint8Array(0);
    this.branchName = new Uint8Array(0);
    this.prUrl = new Uint8Array(0);
    this.agentName = new Uint8Array(0);
    this.lastInteractionUpdateOffsetKey = "";
    this.config = new Uint8Array(0);
    this.originalPromptBlobId = new Uint8Array(0);
    this.repositoryInfoBlobId = new Uint8Array(0);
    this.originalConversationActionBlobId = new Uint8Array(0);
    this.videoAnnotationsBlobId = new Uint8Array(0);
    this.turnStartTodoIds = [];
    this.commits = [];
    this.numCompletedTurns = 0;
    this.startRequestBlobId = new Uint8Array(0);
    this.commitReminderStateBlobId = new Uint8Array(0);
    this.grindModeTrackingStateBlobId = new Uint8Array(0);
    this.workflowControlStateBlobId = new Uint8Array(0);
    this.workerCreations = [];
    this.resolvedEgressPolicyBlobId = new Uint8Array(0);
    this.pendingPrBlobId = new Uint8Array(0);
    this.nextTurnSystemRemindersBlobId = new Uint8Array(0);
    this.cloudPluginManifestBlobId = new Uint8Array(0);
    this.perBranchOptimizedDiffs = {};
    this.startupWarnings = [];
    this.pendingSummarizationStateBlobId = new Uint8Array(0);
    this.pendingSummarizationSnapshotBlobId = new Uint8Array(0);
    this.admittedCustomModeStateBlobId = new Uint8Array(0);
    this.suggestedRepoNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentState, a, b2);
  }
  static $() {
    return ["CloudAgentState|1 conversation_state #0|2 num_prior_interaction_updates 13|3 pr_body 12|4 summary 12|5 branch_name 12|6 pr_url 12|8 agent_name 12|7 last_interaction_update_offset_key 9|9 starting_commit 9?|10 base_branch 9?|11 config 12|12 local_state_branch 9?|13 original_prompt_blob_id 12|14 repository_info_blob_id 12|15 original_conversation_action_blob_id 12|16 video_annotations_blob_id 12|17 last_user_turn_commit 9?|18 last_followup_source #1?|19 continue_rebase 8?|20 turn_start_todo_ids 9*|21 original_request_start_unix_ms 3?|22 initial_turn_latency_reported 8?|23 agent_session_id 9?|24 kickoff_message_id 9?|25 grind_mode_config #2?|26 commits #3*|27 commit_count 5?|28 user_facing_error_details #4?|29 initial_source #1?|30 num_completed_turns 13|31 synthesis_subagent_config #5?|32 start_request_blob_id 12|33 commit_reminder_state_blob_id 12|34 grind_mode_tracking_state_blob_id 12|35 workflow_control_state_blob_id 12|36 worker_creations #6*|37 is_time_limit_expired 8?|38 resolved_egress_policy_blob_id 12|39 optimized_diff #7?|40 pending_pr_blob_id 12|41 is_pod_finalized 8?|42 next_turn_system_reminders_blob_id 12|43 cloud_plugin_manifest_blob_id 12|44 per_branch_optimized_diffs 9,#7|45 startup_warnings #8*|46 private_workspace_identifier #9?|49 conversation_rewind_epoch 13?|50 pending_summarization_state_blob_id 12|51 pending_summarization_snapshot_blob_id 12|52 admitted_custom_mode_state_blob_id 12|53 agent_store_artifacts_symlink_enabled 8?|54 project_details #10?|55 uses_coordinator_membership 8?|56 suggested_repo_names 9*|57 resolved_environment_mcp_server_allowlist #11?|58 new_project_seeded_empty_root 8?|59 manager_spawn_kind #12?|60 carried_request_context #13?", ConversationStateStructure, BackgroundComposerSource, GrindModeConfig, BackgroundComposerCommit, CloudAgentErrorDetails, SynthesisSubagentConfig, WorkerCreation, OptimizedDiffState, CloudAgentStartupWarning, PrivateWorkspaceIdentifier, ProjectDetails, EnvironmentMcpServerAllowlist, ManagerSpawnKind, CarriedRequestContext];
  }
};
var CarriedRequestContext = class _CarriedRequestContext extends __protoMessage3139 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.teamOwnedHookSteps = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CarriedRequestContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CarriedRequestContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CarriedRequestContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CarriedRequestContext, a, b2);
  }
  static $() {
    return ["CarriedRequestContext|1 blob_id 12|2 pod_id 9?|4 captured_at_unix_ms 3?|5 source #0?|6 was_complete 8?|7 conversation_rewind_epoch 13?|8 team_owned_hook_steps 9*", CarriedRequestContextSource];
  }
};
var EnvironmentMcpServerAllowlist = class _EnvironmentMcpServerAllowlist extends __protoMessage3139 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentMcpServerAllowlist().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentMcpServerAllowlist().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentMcpServerAllowlist().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentMcpServerAllowlist, a, b2);
  }
  static $() {
    return ["EnvironmentMcpServerAllowlist|1 entries #0*|2 disable_all_mcp_servers 8?", EnvironmentMcpServerAllowlist_Entry];
  }
};
var EnvironmentMcpServerAllowlist_Entry = class _EnvironmentMcpServerAllowlist_Entry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.toolAllowlist = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnvironmentMcpServerAllowlist_Entry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnvironmentMcpServerAllowlist_Entry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnvironmentMcpServerAllowlist_Entry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnvironmentMcpServerAllowlist_Entry, a, b2);
  }
  static $() {
    return ["EnvironmentMcpServerAllowlist.Entry|1 server_url 9?|2 command 9?|3 tool_allowlist 9*"];
  }
};
var OptimizedDiffState = class _OptimizedDiffState extends __protoMessage3139 {
  constructor(data) {
    super();
    this.state = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OptimizedDiffState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OptimizedDiffState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OptimizedDiffState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OptimizedDiffState, a, b2);
  }
  static $() {
    return ["OptimizedDiffState|1 pending #0 state|2 diff_blob_id 12 state|3 branch_name 9?|4 base_branch 9?|5 repo_url 9?", Empty];
  }
};
var WorkerCreation = class _WorkerCreation extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerIndex = 0;
    this.createdAtUnixMs = protoInt64.zero;
    this.numCompletedTurns = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkerCreation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkerCreation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkerCreation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkerCreation, a, b2);
  }
  static $() {
    return ["WorkerCreation|1 worker_index 13|2 created_at_unix_ms 3|3 num_completed_turns 13"];
  }
};
var SynthesisSubagentConfig = class _SynthesisSubagentConfig extends __protoMessage3139 {
  constructor(data) {
    super();
    this.additionalModelNames = [];
    this.originalUserPromptBlobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SynthesisSubagentConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SynthesisSubagentConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SynthesisSubagentConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SynthesisSubagentConfig, a, b2);
  }
  static $() {
    return ["SynthesisSubagentConfig|1 additional_model_names 9*|2 original_user_prompt_blob_id 12"];
  }
};
var TransientError = class _TransientError extends __protoMessage3139 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TransientError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TransientError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TransientError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TransientError, a, b2);
  }
  static $() {
    return ["TransientError|1 error_message 9"];
  }
};
var CloudAgentErrorDetails = class _CloudAgentErrorDetails extends __protoMessage3139 {
  constructor(data) {
    super();
    this.errorMessage = "";
    this.errorCode = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentErrorDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentErrorDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentErrorDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentErrorDetails, a, b2);
  }
  static $() {
    return ["CloudAgentErrorDetails|1 error_message 9|2 error_code 9|3 dev_only_message 9?|4 error_details #0?", ErrorDetails];
  }
};
var CloudAgentStartupWarning = class _CloudAgentStartupWarning extends __protoMessage3139 {
  constructor(data) {
    super();
    this.warningType = CloudAgentStartupWarningType.UNSPECIFIED;
    this.userFacingMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentStartupWarning().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentStartupWarning().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentStartupWarning().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentStartupWarning, a, b2);
  }
  static $() {
    return ["CloudAgentStartupWarning|1 warning_type #0|2 user_facing_message 9", CloudAgentStartupWarningType];
  }
};
var GetBackgroundComposerVmUsageRequest = class _GetBackgroundComposerVmUsageRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerVmUsageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerVmUsageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerVmUsageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerVmUsageRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerVmUsageRequest|1 bc_id 9"];
  }
};
var GetBackgroundComposerVmUsageResponse = class _GetBackgroundComposerVmUsageResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.totalDurationMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerVmUsageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerVmUsageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerVmUsageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerVmUsageResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerVmUsageResponse|1 total_duration_ms 3"];
  }
};
var BackgroundComposerCommit = class _BackgroundComposerCommit extends __protoMessage3139 {
  constructor(data) {
    super();
    this.sha = "";
    this.message = "";
    this.authorName = "";
    this.authorEmail = "";
    this.timestamp = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundComposerCommit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundComposerCommit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundComposerCommit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundComposerCommit, a, b2);
  }
  static $() {
    return ["BackgroundComposerCommit|1 sha 9|2 message 9|3 author_name 9|4 author_email 9|5 timestamp 9"];
  }
};
var GetCloudAgentDebugDetailsRequest = class _GetCloudAgentDebugDetailsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentDebugDetailsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentDebugDetailsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentDebugDetailsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentDebugDetailsRequest, a, b2);
  }
  static $() {
    return ["GetCloudAgentDebugDetailsRequest|1 bc_id 9|2 agent_blob_id 12?|3 blob_id 12?"];
  }
};
var CloudAgentVmHistory = class _CloudAgentVmHistory extends __protoMessage3139 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentVmHistory().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentVmHistory().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentVmHistory().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentVmHistory, a, b2);
  }
  static $() {
    return ["CloudAgentVmHistory|1 entries #0*", CloudAgentVmHistoryEntry];
  }
};
var CloudAgentVmHistoryEntry = class _CloudAgentVmHistoryEntry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerIndex = 0;
    this.isCurrentWorker = false;
    this.info = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentVmHistoryEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentVmHistoryEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentVmHistoryEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentVmHistoryEntry, a, b2);
  }
  static $() {
    return ["CloudAgentVmHistoryEntry|1 worker_index 5|2 is_current_worker 8|3 environment_version_id 3?|4 replaced_at_unix_ms 3?|5 anyrun #0 info|6 anyrun_pending_docker_build #1 info", CloudAgentAnyrunVmInfo, CloudAgentAnyrunPendingDockerBuildVmInfo];
  }
};
var CloudAgentAnyrunVmInfo = class _CloudAgentAnyrunVmInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.tenantId = "";
    this.podId = "";
    this.anyrunCluster = "";
    this.workspaceRootPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentAnyrunVmInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentAnyrunVmInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentAnyrunVmInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentAnyrunVmInfo, a, b2);
  }
  static $() {
    return ["CloudAgentAnyrunVmInfo|1 tenant_id 9|2 pod_id 9|3 anyrun_cluster 9|4 workspace_root_path 9|5 docker_build_events_redis_stream_key 9?|6 setup_events_redis_stream_key 9?|7 prewarm_workflow_id 9?|8 environment_build_boot_info #0?", EnvironmentBuildBootInfo];
  }
};
var CloudAgentAnyrunPendingDockerBuildVmInfo = class _CloudAgentAnyrunPendingDockerBuildVmInfo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.anyrunCluster = "";
    this.dockerBuildEventsRedisStreamKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentAnyrunPendingDockerBuildVmInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentAnyrunPendingDockerBuildVmInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentAnyrunPendingDockerBuildVmInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentAnyrunPendingDockerBuildVmInfo, a, b2);
  }
  static $() {
    return ["CloudAgentAnyrunPendingDockerBuildVmInfo|1 anyrun_cluster 9|2 docker_build_events_redis_stream_key 9"];
  }
};
var GetCloudAgentDebugDetailsResponse = class _GetCloudAgentDebugDetailsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.cloudAgentStateBlobId = new Uint8Array(0);
    this.streamMessages = [];
    this.preFetchedBlobs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentDebugDetailsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentDebugDetailsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentDebugDetailsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentDebugDetailsResponse, a, b2);
  }
  static $() {
    return ["GetCloudAgentDebugDetailsResponse|1 cloud_agent_state_blob_id 12|2 cloud_agent_state #0|3 stream_messages #1*|4 pre_fetched_blobs #2*|5 vm_history #3", CloudAgentState, StreamConversationResponse, PreFetchedBlob2, CloudAgentVmHistory];
  }
};
var ProvisionSyntheticsServiceAccountsRequest = class _ProvisionSyntheticsServiceAccountsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.count = 0;
    this.namePrefix = "";
    this.poolName = "";
    this.createdBy = "";
    this.provisionOriginRepos = false;
    this.originNamespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProvisionSyntheticsServiceAccountsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProvisionSyntheticsServiceAccountsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProvisionSyntheticsServiceAccountsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProvisionSyntheticsServiceAccountsRequest, a, b2);
  }
  static $() {
    return ["ProvisionSyntheticsServiceAccountsRequest|1 team_id 5|2 count 5|3 name_prefix 9|4 pool_name 9|5 created_by 9|6 provision_origin_repos 8|7 origin_namespace 9"];
  }
};
var ProvisionedSyntheticsIdentity = class _ProvisionedSyntheticsIdentity extends __protoMessage3139 {
  constructor(data) {
    super();
    this.identityId = "";
    this.serviceAccountId = "";
    this.serviceAccountName = "";
    this.maskedApiKey = "";
    this.repoUrl = "";
    this.repoRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProvisionedSyntheticsIdentity().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProvisionedSyntheticsIdentity().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProvisionedSyntheticsIdentity().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProvisionedSyntheticsIdentity, a, b2);
  }
  static $() {
    return ["ProvisionedSyntheticsIdentity|1 identity_id 9|2 service_account_id 9|3 service_account_name 9|4 masked_api_key 9|5 repo_url 9|6 repo_ref 9"];
  }
};
var ProvisionSyntheticsServiceAccountsResponse = class _ProvisionSyntheticsServiceAccountsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.identities = [];
    this.poolId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProvisionSyntheticsServiceAccountsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProvisionSyntheticsServiceAccountsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProvisionSyntheticsServiceAccountsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProvisionSyntheticsServiceAccountsResponse, a, b2);
  }
  static $() {
    return ["ProvisionSyntheticsServiceAccountsResponse|1 identities #0*|2 pool_id 9", ProvisionedSyntheticsIdentity];
  }
};
var CloudAgentSyntheticsScenarioInput = class _CloudAgentSyntheticsScenarioInput extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.prompt = "";
    this.model = "";
    this.repoUrl = "";
    this.repoRef = "";
    this.canary = false;
    this.maxDurationSec = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentSyntheticsScenarioInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentSyntheticsScenarioInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentSyntheticsScenarioInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentSyntheticsScenarioInput, a, b2);
  }
  static $() {
    return ["CloudAgentSyntheticsScenarioInput|1 name 9|2 prompt 9|3 model 9|4 repo_url 9|5 repo_ref 9|6 canary 8|7 max_duration_sec 13"];
  }
};
var StartCloudAgentLoadTestRequest = class _StartCloudAgentLoadTestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scenarioName = "";
    this.poolId = "";
    this.count = 0;
    this.perIdentityCreatePerMin = 0;
    this.rampUpSec = 0;
    this.createdBy = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartCloudAgentLoadTestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartCloudAgentLoadTestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartCloudAgentLoadTestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartCloudAgentLoadTestRequest, a, b2);
  }
  static $() {
    return ["StartCloudAgentLoadTestRequest|1 scenario_name 9|2 custom_scenario #0|3 pool_id 9|4 count 13|5 per_identity_create_per_min 13|6 ramp_up_sec 13|7 created_by 9", CloudAgentSyntheticsScenarioInput];
  }
};
var StartCloudAgentLoadTestResponse = class _StartCloudAgentLoadTestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.temporalWorkflowId = "";
    this.temporalRunId = "";
    this.loadTestRunId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartCloudAgentLoadTestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartCloudAgentLoadTestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartCloudAgentLoadTestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartCloudAgentLoadTestResponse, a, b2);
  }
  static $() {
    return ["StartCloudAgentLoadTestResponse|1 temporal_workflow_id 9|2 temporal_run_id 9|3 load_test_run_id 9"];
  }
};
var EnsureModelRoutingLoadTestStartedRequest = class _EnsureModelRoutingLoadTestStartedRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.runId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnsureModelRoutingLoadTestStartedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnsureModelRoutingLoadTestStartedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnsureModelRoutingLoadTestStartedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnsureModelRoutingLoadTestStartedRequest, a, b2);
  }
  static $() {
    return ["EnsureModelRoutingLoadTestStartedRequest|1 run_id 9"];
  }
};
var EnsureModelRoutingLoadTestStartedResponse = class _EnsureModelRoutingLoadTestStartedResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.temporalRunId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnsureModelRoutingLoadTestStartedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnsureModelRoutingLoadTestStartedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnsureModelRoutingLoadTestStartedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnsureModelRoutingLoadTestStartedResponse, a, b2);
  }
  static $() {
    return ["EnsureModelRoutingLoadTestStartedResponse|1 temporal_run_id 9"];
  }
};
var CancelModelRoutingLoadTestRequest = class _CancelModelRoutingLoadTestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.runId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelModelRoutingLoadTestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelModelRoutingLoadTestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelModelRoutingLoadTestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelModelRoutingLoadTestRequest, a, b2);
  }
  static $() {
    return ["CancelModelRoutingLoadTestRequest|1 run_id 9"];
  }
};
var CancelModelRoutingLoadTestResponse = class _CancelModelRoutingLoadTestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = ModelRoutingLoadTestCancelOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelModelRoutingLoadTestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelModelRoutingLoadTestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelModelRoutingLoadTestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelModelRoutingLoadTestResponse, a, b2);
  }
  static $() {
    return ["CancelModelRoutingLoadTestResponse|1 outcome #0", ModelRoutingLoadTestCancelOutcome];
  }
};
var MintCustomerPrivatelinkProxyTokenRequest = class _MintCustomerPrivatelinkProxyTokenRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.allowedHosts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintCustomerPrivatelinkProxyTokenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintCustomerPrivatelinkProxyTokenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintCustomerPrivatelinkProxyTokenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintCustomerPrivatelinkProxyTokenRequest, a, b2);
  }
  static $() {
    return ["MintCustomerPrivatelinkProxyTokenRequest|1 team_id 5|2 allowed_hosts 9*"];
  }
};
var MintCustomerPrivatelinkProxyTokenResponse = class _MintCustomerPrivatelinkProxyTokenResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.proxyUsername = "";
    this.token = "";
    this.allowedHosts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintCustomerPrivatelinkProxyTokenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintCustomerPrivatelinkProxyTokenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintCustomerPrivatelinkProxyTokenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintCustomerPrivatelinkProxyTokenResponse, a, b2);
  }
  static $() {
    return ["MintCustomerPrivatelinkProxyTokenResponse|1 proxy_username 9|2 token 9|3 allowed_hosts 9*"];
  }
};
var AdminListTeamNamedAgentsRequest = class _AdminListTeamNamedAgentsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.teamId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListTeamNamedAgentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListTeamNamedAgentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListTeamNamedAgentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListTeamNamedAgentsRequest, a, b2);
  }
  static $() {
    return ["AdminListTeamNamedAgentsRequest|1 team_id 5"];
  }
};
var AdminNamedAgentSession = class _AdminNamedAgentSession extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.sessionKey = "";
    this.sessionKind = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminNamedAgentSession().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminNamedAgentSession().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminNamedAgentSession().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminNamedAgentSession, a, b2);
  }
  static $() {
    return ["AdminNamedAgentSession|1 bc_id 9|2 session_key 9|3 session_kind 9"];
  }
};
var AdminNamedAgent = class _AdminNamedAgent extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.createdAt = "";
    this.updatedAt = "";
    this.sessions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminNamedAgent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminNamedAgent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminNamedAgent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminNamedAgent, a, b2);
  }
  static $() {
    return ["AdminNamedAgent|1 named_agent_id 9|2 name 9?|3 profile_picture_url 9?|4 owning_user 5?|5 owning_team 5?|6 created_at 9|7 updated_at 9|8 sessions #0*", AdminNamedAgentSession];
  }
};
var AdminListTeamNamedAgentsResponse = class _AdminListTeamNamedAgentsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListTeamNamedAgentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListTeamNamedAgentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListTeamNamedAgentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListTeamNamedAgentsResponse, a, b2);
  }
  static $() {
    return ["AdminListTeamNamedAgentsResponse|1 named_agents #0*", AdminNamedAgent];
  }
};
var AdminDeleteNamedAgentRequest = class _AdminDeleteNamedAgentRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.namedAgentId = "";
    this.teamId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminDeleteNamedAgentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminDeleteNamedAgentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminDeleteNamedAgentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminDeleteNamedAgentRequest, a, b2);
  }
  static $() {
    return ["AdminDeleteNamedAgentRequest|1 named_agent_id 9|2 team_id 5"];
  }
};
var AdminDeleteNamedAgentResponse = class _AdminDeleteNamedAgentResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.deletedBcIds = [];
    this.failedBcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminDeleteNamedAgentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminDeleteNamedAgentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminDeleteNamedAgentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminDeleteNamedAgentResponse, a, b2);
  }
  static $() {
    return ["AdminDeleteNamedAgentResponse|1 deleted_bc_ids 9*|2 failed_bc_ids 9*"];
  }
};
var GetCloudAgentMemoryDbLogsRequest = class _GetCloudAgentMemoryDbLogsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentMemoryDbLogsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentMemoryDbLogsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentMemoryDbLogsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentMemoryDbLogsRequest, a, b2);
  }
  static $() {
    return ["GetCloudAgentMemoryDbLogsRequest|1 bc_id 9|2 worker_index 13?|3 limit 5?"];
  }
};
var GetCloudAgentMemoryDbLogsResponse = class _GetCloudAgentMemoryDbLogsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.entries = [];
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudAgentMemoryDbLogsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudAgentMemoryDbLogsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudAgentMemoryDbLogsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudAgentMemoryDbLogsResponse, a, b2);
  }
  static $() {
    return ["GetCloudAgentMemoryDbLogsResponse|1 entries #0*|2 truncated 8", CloudAgentMemoryDbLogEntry];
  }
};
var CloudAgentMemoryDbLogEntry = class _CloudAgentMemoryDbLogEntry extends __protoMessage3139 {
  constructor(data) {
    super();
    this.source = CloudAgentMemoryDbLogSource.UNSPECIFIED;
    this.log = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudAgentMemoryDbLogEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudAgentMemoryDbLogEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudAgentMemoryDbLogEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudAgentMemoryDbLogEntry, a, b2);
  }
  static $() {
    return ["CloudAgentMemoryDbLogEntry|2 source #0|3 worker_index 13?|4 event #1 log|5 waterfall_update #2 log", CloudAgentMemoryDbLogSource, PodEvent, WaterfallUpdate];
  }
};
var CreateAgentShareRequest = class _CreateAgentShareRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAgentShareRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAgentShareRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAgentShareRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAgentShareRequest, a, b2);
  }
  static $() {
    return ["CreateAgentShareRequest|1 bc_id 9"];
  }
};
var CreateAgentShareResponse = class _CreateAgentShareResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.shareId = "";
    this.shareUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAgentShareResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAgentShareResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAgentShareResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAgentShareResponse, a, b2);
  }
  static $() {
    return ["CreateAgentShareResponse|1 share_id 9|2 share_url 9"];
  }
};
var GetAgentSharePreviewRequest = class _GetAgentSharePreviewRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.shareId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAgentSharePreviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAgentSharePreviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAgentSharePreviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAgentSharePreviewRequest, a, b2);
  }
  static $() {
    return ["GetAgentSharePreviewRequest|1 share_id 9|2 include_preview_image 8?"];
  }
};
var GetAgentSharePreviewResponse = class _GetAgentSharePreviewResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.shareId = "";
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAgentSharePreviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAgentSharePreviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAgentSharePreviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAgentSharePreviewResponse, a, b2);
  }
  static $() {
    return ["GetAgentSharePreviewResponse|1 share_id 9|2 bc_id 9|3 name 9?|4 summary 9?|5 status 9?|6 error_message 9?|7 repo_url 9?|8 branch_name 9?|9 artifact_image_url 9?|10 preview_image_png 12?"];
  }
};
var ListPrivateWorkersRequest = class _ListPrivateWorkersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.statusFilter = PrivateWorkerStatusFilter.UNSPECIFIED;
    this.pageSize = 0;
    this.listScope = PrivateWorkerListScope.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrivateWorkersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrivateWorkersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrivateWorkersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrivateWorkersRequest, a, b2);
  }
  static $() {
    return ["ListPrivateWorkersRequest|1 status_filter #0|2 page_size 5|3 page_token 9?|4 list_scope #1", PrivateWorkerStatusFilter, PrivateWorkerListScope];
  }
};
var ListPrivateWorkersResponse = class _ListPrivateWorkersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workers = [];
    this.nextPageToken = "";
    this.totalCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrivateWorkersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrivateWorkersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrivateWorkersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrivateWorkersResponse, a, b2);
  }
  static $() {
    return ["ListPrivateWorkersResponse|1 workers #0*|2 next_page_token 9|3 total_count 5", PrivateWorker];
  }
};
var AdminListUserPrivateWorkersRequest = class _AdminListUserPrivateWorkersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListUserPrivateWorkersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListUserPrivateWorkersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListUserPrivateWorkersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListUserPrivateWorkersRequest, a, b2);
  }
  static $() {
    return ["AdminListUserPrivateWorkersRequest|1 auth_id 9?|2 user_id 5?|3 email 9?"];
  }
};
var AdminListUserPrivateWorkersResponse = class _AdminListUserPrivateWorkersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.userId = 0;
    this.authId = "";
    this.email = "";
    this.teamIds = [];
    this.privateWorkers = [];
    this.remoteControlEnabled = false;
    this.teamRemoteControlAllowed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListUserPrivateWorkersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListUserPrivateWorkersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListUserPrivateWorkersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListUserPrivateWorkersResponse, a, b2);
  }
  static $() {
    return ["AdminListUserPrivateWorkersResponse|1 user_id 5|2 auth_id 9|3 email 9|4 team_ids 5*|5 private_workers #0*|7 remote_control_enabled 8|8 team_remote_control_allowed 8", PrivateWorker];
  }
};
var AdminKillBackgroundComposerRequest = class _AdminKillBackgroundComposerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.expectedOwningUserId = 0;
    this.operatorEmail = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminKillBackgroundComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminKillBackgroundComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminKillBackgroundComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminKillBackgroundComposerRequest, a, b2);
  }
  static $() {
    return ["AdminKillBackgroundComposerRequest|1 bc_id 9|2 expected_owning_user_id 5|3 operator_email 9"];
  }
};
var AdminKillBackgroundComposerResponse = class _AdminKillBackgroundComposerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.signalOutcome = AdminKillBackgroundComposerSignalOutcome.UNSPECIFIED;
    this.workerReleaseSucceeded = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminKillBackgroundComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminKillBackgroundComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminKillBackgroundComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminKillBackgroundComposerResponse, a, b2);
  }
  static $() {
    return ["AdminKillBackgroundComposerResponse|1 signal_outcome #0|2 worker_release_succeeded 8", AdminKillBackgroundComposerSignalOutcome];
  }
};
var AdminActiveBackgroundComposer = class _AdminActiveBackgroundComposer extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.createdAt = "";
    this.source = "";
    this.workflowStatus = "";
    this.executionEnvironment = AdminActiveBackgroundComposerExecutionEnvironment.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminActiveBackgroundComposer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminActiveBackgroundComposer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminActiveBackgroundComposer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminActiveBackgroundComposer, a, b2);
  }
  static $() {
    return ["AdminActiveBackgroundComposer|1 bc_id 9|2 created_at 9|3 source 9|4 workflow_status 9|5 execution_environment #0|6 parent_bc_id 9?", AdminActiveBackgroundComposerExecutionEnvironment];
  }
};
var AdminListActiveBackgroundComposersRequest = class _AdminListActiveBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.expectedOwningUserId = 0;
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListActiveBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListActiveBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListActiveBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListActiveBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["AdminListActiveBackgroundComposersRequest|1 expected_owning_user_id 5|2 page_size 5|3 page_token 9"];
  }
};
var AdminListActiveBackgroundComposersResponse = class _AdminListActiveBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.agents = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminListActiveBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminListActiveBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminListActiveBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminListActiveBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["AdminListActiveBackgroundComposersResponse|1 agents #0*|2 next_page_token 9", AdminActiveBackgroundComposer];
  }
};
var AdminKillAllActiveBackgroundComposersRequest = class _AdminKillAllActiveBackgroundComposersRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.expectedOwningUserId = 0;
    this.operatorEmail = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminKillAllActiveBackgroundComposersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminKillAllActiveBackgroundComposersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminKillAllActiveBackgroundComposersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminKillAllActiveBackgroundComposersRequest, a, b2);
  }
  static $() {
    return ["AdminKillAllActiveBackgroundComposersRequest|1 expected_owning_user_id 5|2 operator_email 9"];
  }
};
var AdminKillAllActiveBackgroundComposerFailure = class _AdminKillAllActiveBackgroundComposerFailure extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminKillAllActiveBackgroundComposerFailure().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminKillAllActiveBackgroundComposerFailure().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminKillAllActiveBackgroundComposerFailure().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminKillAllActiveBackgroundComposerFailure, a, b2);
  }
  static $() {
    return ["AdminKillAllActiveBackgroundComposerFailure|1 bc_id 9|2 message 9"];
  }
};
var AdminKillAllActiveBackgroundComposersResponse = class _AdminKillAllActiveBackgroundComposersResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.matchedCount = 0;
    this.killedCount = 0;
    this.alreadyKilledCount = 0;
    this.partialCleanupCount = 0;
    this.failures = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdminKillAllActiveBackgroundComposersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdminKillAllActiveBackgroundComposersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdminKillAllActiveBackgroundComposersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdminKillAllActiveBackgroundComposersResponse, a, b2);
  }
  static $() {
    return ["AdminKillAllActiveBackgroundComposersResponse|1 matched_count 5|2 killed_count 5|3 already_killed_count 5|4 partial_cleanup_count 5|5 failures #0*", AdminKillAllActiveBackgroundComposerFailure];
  }
};
var ListPendingPrivateWorkerRequestsRequest = class _ListPendingPrivateWorkerRequestsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.pageSize = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPendingPrivateWorkerRequestsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPendingPrivateWorkerRequestsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPendingPrivateWorkerRequestsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPendingPrivateWorkerRequestsRequest, a, b2);
  }
  static $() {
    return ["ListPendingPrivateWorkerRequestsRequest|1 page_size 5|2 page_token 9?|3 repository 9?|4 pool 9?"];
  }
};
var ListPendingPrivateWorkerRequestsResponse = class _ListPendingPrivateWorkerRequestsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.requests = [];
    this.nextPageToken = "";
    this.totalCount = 0;
    this.streamCursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPendingPrivateWorkerRequestsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPendingPrivateWorkerRequestsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPendingPrivateWorkerRequestsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPendingPrivateWorkerRequestsResponse, a, b2);
  }
  static $() {
    return ["ListPendingPrivateWorkerRequestsResponse|1 requests #0*|2 next_page_token 9|3 total_count 5|4 stream_cursor 9", PendingPrivateWorkerRequest];
  }
};
var PendingPrivateWorkerRequest = class _PendingPrivateWorkerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.userId = 0;
    this.labels = [];
    this.createdAtMs = 0;
    this.repoUrls = [];
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PendingPrivateWorkerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PendingPrivateWorkerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PendingPrivateWorkerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PendingPrivateWorkerRequest, a, b2);
  }
  static $() {
    return ["PendingPrivateWorkerRequest|1 bc_id 9|2 user_id 5|3 service_account_id 9?|4 repo_owner 9?|5 repo_name 9?|6 repo_url 9?|7 labels #0*|8 created_at_ms 1|9 user_email 9?|10 repo_urls 9*|11 claimed_worker_id 9?|12 wake_timeout_ms 1?|13 repos #1*", PrivateWorkerLabel, PrivateWorkerRequestRepo];
  }
};
var PrivateWorkerRequestRepo = class _PrivateWorkerRequestRepo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.primary = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerRequestRepo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerRequestRepo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerRequestRepo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerRequestRepo, a, b2);
  }
  static $() {
    return ["PrivateWorkerRequestRepo|1 repo_url 9|2 ref 9?|3 primary 8"];
  }
};
var StreamPendingPrivateWorkerRequestsRequest = class _StreamPendingPrivateWorkerRequestsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPendingPrivateWorkerRequestsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPendingPrivateWorkerRequestsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPendingPrivateWorkerRequestsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPendingPrivateWorkerRequestsRequest, a, b2);
  }
  static $() {
    return ["StreamPendingPrivateWorkerRequestsRequest|1 repository 9?|2 cursor 9?|3 pool 9?"];
  }
};
var StreamPendingPrivateWorkerRequestsResponse = class _StreamPendingPrivateWorkerRequestsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.type = PendingPrivateWorkerRequestEventType.UNSPECIFIED;
    this.cursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPendingPrivateWorkerRequestsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPendingPrivateWorkerRequestsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPendingPrivateWorkerRequestsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPendingPrivateWorkerRequestsResponse, a, b2);
  }
  static $() {
    return ["StreamPendingPrivateWorkerRequestsResponse|1 type #0|2 request #1|3 cursor 9", PendingPrivateWorkerRequestEventType, PendingPrivateWorkerRequest];
  }
};
var ClaimPendingPrivateWorkerRequestRequest = class _ClaimPendingPrivateWorkerRequestRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClaimPendingPrivateWorkerRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClaimPendingPrivateWorkerRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClaimPendingPrivateWorkerRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClaimPendingPrivateWorkerRequestRequest, a, b2);
  }
  static $() {
    return ["ClaimPendingPrivateWorkerRequestRequest|1 bc_id 9|2 worker_id 9"];
  }
};
var ClaimPendingPrivateWorkerRequestResponse = class _ClaimPendingPrivateWorkerRequestResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClaimPendingPrivateWorkerRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClaimPendingPrivateWorkerRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClaimPendingPrivateWorkerRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClaimPendingPrivateWorkerRequestResponse, a, b2);
  }
  static $() {
    return ["ClaimPendingPrivateWorkerRequestResponse|1 bc_id 9|2 worker_id 9"];
  }
};
var ReleasePrivateWorkerClaimRequest = class _ReleasePrivateWorkerClaimRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReleasePrivateWorkerClaimRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReleasePrivateWorkerClaimRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReleasePrivateWorkerClaimRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReleasePrivateWorkerClaimRequest, a, b2);
  }
  static $() {
    return ["ReleasePrivateWorkerClaimRequest|1 bc_id 9"];
  }
};
var ReleasePrivateWorkerClaimResponse = class _ReleasePrivateWorkerClaimResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReleasePrivateWorkerClaimResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReleasePrivateWorkerClaimResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReleasePrivateWorkerClaimResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReleasePrivateWorkerClaimResponse, a, b2);
  }
  static $() {
    return ["ReleasePrivateWorkerClaimResponse|1 bc_id 9|2 worker_id 9"];
  }
};
var PrivateWorkerRepo = class _PrivateWorkerRepo extends __protoMessage3139 {
  constructor(data) {
    super();
    this.owner = "";
    this.name = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerRepo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerRepo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerRepo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerRepo, a, b2);
  }
  static $() {
    return ["PrivateWorkerRepo|1 owner 9|2 name 9|3 url 9"];
  }
};
var PrivateWorker = class _PrivateWorker extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerId = "";
    this.repoOwner = "";
    this.repoName = "";
    this.workspaceRootPath = "";
    this.connectedAtMs = 0;
    this.userId = 0;
    this.isInUse = false;
    this.labels = [];
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorker().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorker().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorker().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorker, a, b2);
  }
  static $() {
    return ["PrivateWorker|1 worker_id 9|2 repo_owner 9|3 repo_name 9|4 workspace_root_path 9|5 connected_at_ms 1|6 user_id 5|7 team_id 5?|8 service_account_id 9?|9 is_in_use 8|10 active_bc_id 9?|11 labels #0*|12 repo_url 9?|13 display_name 9?|14 machine_id 9?|15 machine_display_name 9?|16 repos #1*", PrivateWorkerLabel, PrivateWorkerRepo];
  }
};
var PrivateWorkerLabel = class _PrivateWorkerLabel extends __protoMessage3139 {
  constructor(data) {
    super();
    this.key = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerLabel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerLabel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerLabel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerLabel, a, b2);
  }
  static $() {
    return ["PrivateWorkerLabel|1 key 9|2 value 9"];
  }
};
var PrivateWorkerPool = class _PrivateWorkerPool extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scope = PrivateWorkerPoolScope.UNSPECIFIED;
    this.ownerId = 0;
    this.poolName = "";
    this.connectedWorkerCount = 0;
    this.inUseWorkerCount = 0;
    this.firstSeenAtMs = 0;
    this.lastSeenAtMs = 0;
    this.isStale = false;
    this.workerReadyTimeoutSeconds = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerPool().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerPool().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerPool().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerPool, a, b2);
  }
  static $() {
    return ["PrivateWorkerPool|1 scope #0|2 owner_id 5|3 pool_name 9|4 repo_owner 9?|5 repo_name 9?|6 repo_url 9?|7 connected_worker_count 5|8 in_use_worker_count 5|9 first_seen_at_ms 1|10 last_seen_at_ms 1|11 is_stale 8|12 worker_ready_timeout_seconds 5|13 request_counts #1?", PrivateWorkerPoolScope, PrivateWorkerPoolRequestCounts];
  }
};
var PrivateWorkerPoolRequestCounts = class _PrivateWorkerPoolRequestCounts extends __protoMessage3139 {
  constructor(data) {
    super();
    this.pending = 0;
    this.waking = 0;
    this.claimed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerPoolRequestCounts().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerPoolRequestCounts().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerPoolRequestCounts().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerPoolRequestCounts, a, b2);
  }
  static $() {
    return ["PrivateWorkerPoolRequestCounts|1 pending 5|2 waking 5|3 claimed 5"];
  }
};
var ListPrivateWorkerPoolsRequest = class _ListPrivateWorkerPoolsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.listScope = PrivateWorkerListScope.UNSPECIFIED;
    this.includeStale = false;
    this.includeRequestCounts = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrivateWorkerPoolsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrivateWorkerPoolsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrivateWorkerPoolsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrivateWorkerPoolsRequest, a, b2);
  }
  static $() {
    return ["ListPrivateWorkerPoolsRequest|1 list_scope #0|2 include_stale 8|3 include_request_counts 8", PrivateWorkerListScope];
  }
};
var ListPrivateWorkerPoolsResponse = class _ListPrivateWorkerPoolsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.pools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPrivateWorkerPoolsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPrivateWorkerPoolsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPrivateWorkerPoolsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPrivateWorkerPoolsResponse, a, b2);
  }
  static $() {
    return ["ListPrivateWorkerPoolsResponse|1 pools #0*", PrivateWorkerPool];
  }
};
var RegisterPrivateWorkerPoolRequest = class _RegisterPrivateWorkerPoolRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scope = PrivateWorkerPoolScope.UNSPECIFIED;
    this.poolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RegisterPrivateWorkerPoolRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RegisterPrivateWorkerPoolRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RegisterPrivateWorkerPoolRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RegisterPrivateWorkerPoolRequest, a, b2);
  }
  static $() {
    return ["RegisterPrivateWorkerPoolRequest|1 scope #0|2 pool_name 9|3 repo_owner 9?|4 repo_name 9?|5 repo_url 9?|6 worker_ready_timeout_seconds 5?", PrivateWorkerPoolScope];
  }
};
var RegisterPrivateWorkerPoolResponse = class _RegisterPrivateWorkerPoolResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.registered = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RegisterPrivateWorkerPoolResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RegisterPrivateWorkerPoolResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RegisterPrivateWorkerPoolResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RegisterPrivateWorkerPoolResponse, a, b2);
  }
  static $() {
    return ["RegisterPrivateWorkerPoolResponse|1 registered 8"];
  }
};
var DeregisterPrivateWorkerPoolRequest = class _DeregisterPrivateWorkerPoolRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.scope = PrivateWorkerPoolScope.UNSPECIFIED;
    this.poolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeregisterPrivateWorkerPoolRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeregisterPrivateWorkerPoolRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeregisterPrivateWorkerPoolRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeregisterPrivateWorkerPoolRequest, a, b2);
  }
  static $() {
    return ["DeregisterPrivateWorkerPoolRequest|1 scope #0|2 pool_name 9|3 repo_owner 9?|4 repo_name 9?", PrivateWorkerPoolScope];
  }
};
var DeregisterPrivateWorkerPoolResponse = class _DeregisterPrivateWorkerPoolResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.deregistered = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeregisterPrivateWorkerPoolResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeregisterPrivateWorkerPoolResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeregisterPrivateWorkerPoolResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeregisterPrivateWorkerPoolResponse, a, b2);
  }
  static $() {
    return ["DeregisterPrivateWorkerPoolResponse|1 deregistered 8"];
  }
};
var PrivateWorkerOwnerFilter = class _PrivateWorkerOwnerFilter extends __protoMessage3139 {
  constructor(data) {
    super();
    this.ownerCursorUserId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivateWorkerOwnerFilter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivateWorkerOwnerFilter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivateWorkerOwnerFilter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivateWorkerOwnerFilter, a, b2);
  }
  static $() {
    return ["PrivateWorkerOwnerFilter|1 owner_cursor_user_id 5"];
  }
};
var GetPrivateWorkersSummaryRequest = class _GetPrivateWorkersSummaryRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrivateWorkersSummaryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrivateWorkersSummaryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrivateWorkersSummaryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrivateWorkersSummaryRequest, a, b2);
  }
  static $() {
    return ["GetPrivateWorkersSummaryRequest"];
  }
};
var GetPrivateWorkersSummaryResponse = class _GetPrivateWorkersSummaryResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrivateWorkersSummaryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrivateWorkersSummaryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrivateWorkersSummaryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrivateWorkersSummaryResponse, a, b2);
  }
  static $() {
    return ["GetPrivateWorkersSummaryResponse|1 user_summary #0?|2 team_summary #1?|3 team_limit_summary #2?", UserWorkerSummary, TeamWorkerSummary, TeamWorkerLimitSummary];
  }
};
var UserWorkerSummary = class _UserWorkerSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.totalConnected = 0;
    this.inUse = 0;
    this.teamWorkersInUseByUser = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UserWorkerSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UserWorkerSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UserWorkerSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UserWorkerSummary, a, b2);
  }
  static $() {
    return ["UserWorkerSummary|1 total_connected 5|2 in_use 5|3 team_workers_in_use_by_user 5"];
  }
};
var TeamWorkerSummary = class _TeamWorkerSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.totalConnected = 0;
    this.inUse = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TeamWorkerSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TeamWorkerSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TeamWorkerSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TeamWorkerSummary, a, b2);
  }
  static $() {
    return ["TeamWorkerSummary|1 total_connected 5|2 in_use 5"];
  }
};
var TeamWorkerLimitSummary = class _TeamWorkerLimitSummary extends __protoMessage3139 {
  constructor(data) {
    super();
    this.totalConnected = 0;
    this.maxWorkers = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TeamWorkerLimitSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TeamWorkerLimitSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TeamWorkerLimitSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TeamWorkerLimitSummary, a, b2);
  }
  static $() {
    return ["TeamWorkerLimitSummary|1 total_connected 5|2 max_workers 5"];
  }
};
var GetPrivateWorkerRequest = class _GetPrivateWorkerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrivateWorkerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrivateWorkerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrivateWorkerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrivateWorkerRequest, a, b2);
  }
  static $() {
    return ["GetPrivateWorkerRequest|1 worker_id 9"];
  }
};
var GetPrivateWorkerResponse = class _GetPrivateWorkerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPrivateWorkerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPrivateWorkerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPrivateWorkerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPrivateWorkerResponse, a, b2);
  }
  static $() {
    return ["GetPrivateWorkerResponse|1 worker #0", PrivateWorker];
  }
};
var ReleasePrivateWorkerRequest = class _ReleasePrivateWorkerRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReleasePrivateWorkerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReleasePrivateWorkerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReleasePrivateWorkerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReleasePrivateWorkerRequest, a, b2);
  }
  static $() {
    return ["ReleasePrivateWorkerRequest|1 worker_id 9"];
  }
};
var ReleasePrivateWorkerResponse = class _ReleasePrivateWorkerResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReleasePrivateWorkerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReleasePrivateWorkerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReleasePrivateWorkerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReleasePrivateWorkerResponse, a, b2);
  }
  static $() {
    return ["ReleasePrivateWorkerResponse"];
  }
};
var BatchRefreshPullRequestStatusRequest = class _BatchRefreshPullRequestStatusRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchRefreshPullRequestStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchRefreshPullRequestStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchRefreshPullRequestStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchRefreshPullRequestStatusRequest, a, b2);
  }
  static $() {
    return ["BatchRefreshPullRequestStatusRequest|1 bc_ids 9*"];
  }
};
var BatchRefreshPullRequestStatusResponse = class _BatchRefreshPullRequestStatusResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.results = {};
    this.failedBcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchRefreshPullRequestStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchRefreshPullRequestStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchRefreshPullRequestStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchRefreshPullRequestStatusResponse, a, b2);
  }
  static $() {
    return ["BatchRefreshPullRequestStatusResponse|1 results 9,#0|2 failed_bc_ids 9*", GetDetailedPullRequestStatusResponse];
  }
};
var AttachAgentStartupTraceRequest = class _AttachAgentStartupTraceRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachAgentStartupTraceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachAgentStartupTraceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachAgentStartupTraceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachAgentStartupTraceRequest, a, b2);
  }
  static $() {
    return ["AttachAgentStartupTraceRequest|1 bc_id 9|2 last_event_id 9?"];
  }
};
var AttachAgentStartupTraceResponse = class _AttachAgentStartupTraceResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.eventId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AttachAgentStartupTraceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AttachAgentStartupTraceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AttachAgentStartupTraceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AttachAgentStartupTraceResponse, a, b2);
  }
  static $() {
    return ["AttachAgentStartupTraceResponse|1 event_id 9|3 trace_event #0", AgentStartupTraceEvent];
  }
};
var CloudCanvasDiagnostic = class _CloudCanvasDiagnostic extends __protoMessage3139 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudCanvasDiagnostic().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudCanvasDiagnostic().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudCanvasDiagnostic().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudCanvasDiagnostic, a, b2);
  }
  static $() {
    return ["CloudCanvasDiagnostic|1 message 9|2 code 9?|3 severity 5?|4 range #0?", CloudCanvasDiagnosticRange];
  }
};
var CloudCanvasDiagnosticRange = class _CloudCanvasDiagnosticRange extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudCanvasDiagnosticRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudCanvasDiagnosticRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudCanvasDiagnosticRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudCanvasDiagnosticRange, a, b2);
  }
  static $() {
    return ["CloudCanvasDiagnosticRange|1 start #0|2 end #0", CloudCanvasDiagnosticPosition];
  }
};
var CloudCanvasDiagnosticPosition = class _CloudCanvasDiagnosticPosition extends __protoMessage3139 {
  constructor(data) {
    super();
    this.line = 0;
    this.character = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudCanvasDiagnosticPosition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudCanvasDiagnosticPosition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudCanvasDiagnosticPosition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudCanvasDiagnosticPosition, a, b2);
  }
  static $() {
    return ["CloudCanvasDiagnosticPosition|1 line 5|2 character 5"];
  }
};
var WriteCanvasRequest = class _WriteCanvasRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.source = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteCanvasRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteCanvasRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteCanvasRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteCanvasRequest, a, b2);
  }
  static $() {
    return ["WriteCanvasRequest|1 source 9|2 canvas_id 9?|3 title 9?"];
  }
};
var WriteCanvasOk = class _WriteCanvasOk extends __protoMessage3139 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteCanvasOk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteCanvasOk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteCanvasOk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteCanvasOk, a, b2);
  }
  static $() {
    return ["WriteCanvasOk|1 canvas_id 9|2 title 9?|3 url 9"];
  }
};
var WriteCanvasFailure2 = class _WriteCanvasFailure extends __protoMessage3139 {
  constructor(data) {
    super();
    this.reason = WriteCanvasFailReason2.UNSPECIFIED;
    this.diagnostics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteCanvasFailure().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteCanvasFailure().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteCanvasFailure().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteCanvasFailure, a, b2);
  }
  static $() {
    return ["WriteCanvasFailure|1 reason #0|2 diagnostics #1*|3 detail 9?", WriteCanvasFailReason2, CloudCanvasDiagnostic];
  }
};
var WriteCanvasResponse = class _WriteCanvasResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteCanvasResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteCanvasResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteCanvasResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteCanvasResponse, a, b2);
  }
  static $() {
    return ["WriteCanvasResponse|1 ok #0 outcome|2 failure #1 outcome", WriteCanvasOk, WriteCanvasFailure2];
  }
};
var ReadCanvasRequest = class _ReadCanvasRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.canvasId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadCanvasRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadCanvasRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadCanvasRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadCanvasRequest, a, b2);
  }
  static $() {
    return ["ReadCanvasRequest|1 canvas_id 9|2 store_id 9?"];
  }
};
var ReadCanvasOk = class _ReadCanvasOk extends __protoMessage3139 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    this.source = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadCanvasOk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadCanvasOk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadCanvasOk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadCanvasOk, a, b2);
  }
  static $() {
    return ["ReadCanvasOk|1 canvas_id 9|2 title 9?|3 url 9|4 source 9"];
  }
};
var ReadCanvasFailure2 = class _ReadCanvasFailure extends __protoMessage3139 {
  constructor(data) {
    super();
    this.reason = ReadCanvasFailReason2.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadCanvasFailure().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadCanvasFailure().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadCanvasFailure().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadCanvasFailure, a, b2);
  }
  static $() {
    return ["ReadCanvasFailure|1 reason #0|2 detail 9?", ReadCanvasFailReason2];
  }
};
var ReadCanvasResponse = class _ReadCanvasResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.outcome = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadCanvasResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadCanvasResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadCanvasResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadCanvasResponse, a, b2);
  }
  static $() {
    return ["ReadCanvasResponse|1 ok #0 outcome|2 failure #1 outcome", ReadCanvasOk, ReadCanvasFailure2];
  }
};
var PromptUploadPart = class _PromptUploadPart extends __protoMessage3139 {
  constructor(data) {
    super();
    this.partNumber = 0;
    this.url = "";
    this.offsetBytes = protoInt64.zero;
    this.sizeBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PromptUploadPart().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PromptUploadPart().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PromptUploadPart().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PromptUploadPart, a, b2);
  }
  static $() {
    return ["PromptUploadPart|1 part_number 5|2 url 9|3 offset_bytes 3|4 size_bytes 3"];
  }
};
var PresignPromptUploadRequest = class _PresignPromptUploadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.filename = "";
    this.mimeType = "";
    this.contentLengthBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PresignPromptUploadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PresignPromptUploadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PresignPromptUploadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PresignPromptUploadRequest, a, b2);
  }
  static $() {
    return ["PresignPromptUploadRequest|1 filename 9|2 mime_type 9|3 content_length_bytes 3|4 team_id 5?"];
  }
};
var PresignPromptUploadResponse = class _PresignPromptUploadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.uploadId = "";
    this.urlsExpireAtMs = protoInt64.zero;
    this.upload = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PresignPromptUploadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PresignPromptUploadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PresignPromptUploadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PresignPromptUploadResponse, a, b2);
  }
  static $() {
    return ["PresignPromptUploadResponse|1 upload_id 9|3 urls_expire_at_ms 3|5 multipart #0 upload", PresignPromptUploadResponse_Multipart];
  }
};
var PresignPromptUploadResponse_Multipart = class _PresignPromptUploadResponse_Multipart extends __protoMessage3139 {
  constructor(data) {
    super();
    this.s3UploadId = "";
    this.parts = [];
    this.partSizeBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PresignPromptUploadResponse_Multipart().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PresignPromptUploadResponse_Multipart().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PresignPromptUploadResponse_Multipart().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PresignPromptUploadResponse_Multipart, a, b2);
  }
  static $() {
    return ["PresignPromptUploadResponse.Multipart|1 s3_upload_id 9|2 parts #0*|3 part_size_bytes 3", PromptUploadPart];
  }
};
var CompletePromptUploadRequest = class _CompletePromptUploadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.uploadId = "";
    this.s3UploadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CompletePromptUploadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CompletePromptUploadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CompletePromptUploadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CompletePromptUploadRequest, a, b2);
  }
  static $() {
    return ["CompletePromptUploadRequest|1 upload_id 9|2 s3_upload_id 9"];
  }
};
var CompletePromptUploadResponse = class _CompletePromptUploadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.status = PromptUploadCompletionStatus.UNSPECIFIED;
    this.sizeBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CompletePromptUploadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CompletePromptUploadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CompletePromptUploadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CompletePromptUploadResponse, a, b2);
  }
  static $() {
    return ["CompletePromptUploadResponse|1 status #0|2 size_bytes 3", PromptUploadCompletionStatus];
  }
};
var AbortPromptUploadRequest = class _AbortPromptUploadRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.uploadId = "";
    this.s3UploadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AbortPromptUploadRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AbortPromptUploadRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AbortPromptUploadRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AbortPromptUploadRequest, a, b2);
  }
  static $() {
    return ["AbortPromptUploadRequest|1 upload_id 9|2 s3_upload_id 9"];
  }
};
var AbortPromptUploadResponse = class _AbortPromptUploadResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AbortPromptUploadResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AbortPromptUploadResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AbortPromptUploadResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AbortPromptUploadResponse, a, b2);
  }
  static $() {
    return ["AbortPromptUploadResponse"];
  }
};
var Keyring = class _Keyring extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    this.name = "";
    this.scope = KeyringScope.UNSPECIFIED;
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    this.secretCount = 0;
    this.canManage = false;
    this.canAttach = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Keyring().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Keyring().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Keyring().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Keyring, a, b2);
  }
  static $() {
    return ["Keyring|1 public_id 9|2 name 9|3 scope #0|4 owning_team 5?|5 owning_user 5?|6 created_at_ms 3|7 updated_at_ms 3|8 secret_count 5|9 created_by_user_id 5?|10 can_manage 8|11 can_attach 8", KeyringScope];
  }
};
var ListKeyringsRequest = class _ListKeyringsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.mode = KeyringListMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringsRequest, a, b2);
  }
  static $() {
    return ["ListKeyringsRequest|1 mode #0", KeyringListMode];
  }
};
var ListKeyringsResponse = class _ListKeyringsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyrings = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringsResponse, a, b2);
  }
  static $() {
    return ["ListKeyringsResponse|1 keyrings #0*", Keyring];
  }
};
var GetKeyringRequest = class _GetKeyringRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetKeyringRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetKeyringRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetKeyringRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetKeyringRequest, a, b2);
  }
  static $() {
    return ["GetKeyringRequest|1 public_id 9"];
  }
};
var GetKeyringResponse = class _GetKeyringResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetKeyringResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetKeyringResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetKeyringResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetKeyringResponse, a, b2);
  }
  static $() {
    return ["GetKeyringResponse|1 keyring #0?", Keyring];
  }
};
var CreateKeyringRequest = class _CreateKeyringRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringRequest, a, b2);
  }
  static $() {
    return ["CreateKeyringRequest|1 name 9"];
  }
};
var CreateKeyringResponse = class _CreateKeyringResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringResponse, a, b2);
  }
  static $() {
    return ["CreateKeyringResponse|1 keyring #0", Keyring];
  }
};
var CreateKeyringFromTeamSecretsRequest = class _CreateKeyringFromTeamSecretsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.secretNames = [];
    this.initialGrants = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringFromTeamSecretsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringFromTeamSecretsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringFromTeamSecretsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringFromTeamSecretsRequest, a, b2);
  }
  static $() {
    return ["CreateKeyringFromTeamSecretsRequest|1 name 9|2 secret_names 9*|3 initial_grants #0*", KeyringGrant];
  }
};
var CreateKeyringFromTeamSecretsResponse = class _CreateKeyringFromTeamSecretsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.copiedSecretCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringFromTeamSecretsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringFromTeamSecretsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringFromTeamSecretsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringFromTeamSecretsResponse, a, b2);
  }
  static $() {
    return ["CreateKeyringFromTeamSecretsResponse|1 keyring #0|2 copied_secret_count 5", Keyring];
  }
};
var CopyTeamSecretsToKeyringRequest = class _CopyTeamSecretsToKeyringRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.secretNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CopyTeamSecretsToKeyringRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CopyTeamSecretsToKeyringRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CopyTeamSecretsToKeyringRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CopyTeamSecretsToKeyringRequest, a, b2);
  }
  static $() {
    return ["CopyTeamSecretsToKeyringRequest|1 keyring_public_id 9|2 secret_names 9*"];
  }
};
var CopyTeamSecretsToKeyringResponse = class _CopyTeamSecretsToKeyringResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.copiedSecretCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CopyTeamSecretsToKeyringResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CopyTeamSecretsToKeyringResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CopyTeamSecretsToKeyringResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CopyTeamSecretsToKeyringResponse, a, b2);
  }
  static $() {
    return ["CopyTeamSecretsToKeyringResponse|1 copied_secret_count 5"];
  }
};
var RenameKeyringRequest = class _RenameKeyringRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameKeyringRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameKeyringRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameKeyringRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameKeyringRequest, a, b2);
  }
  static $() {
    return ["RenameKeyringRequest|1 public_id 9|2 name 9"];
  }
};
var RenameKeyringResponse = class _RenameKeyringResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RenameKeyringResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RenameKeyringResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RenameKeyringResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RenameKeyringResponse, a, b2);
  }
  static $() {
    return ["RenameKeyringResponse|1 keyring #0", Keyring];
  }
};
var DeleteKeyringRequest = class _DeleteKeyringRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.publicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteKeyringRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteKeyringRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteKeyringRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteKeyringRequest, a, b2);
  }
  static $() {
    return ["DeleteKeyringRequest|1 public_id 9"];
  }
};
var DeleteKeyringResponse = class _DeleteKeyringResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteKeyringResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteKeyringResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteKeyringResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteKeyringResponse, a, b2);
  }
  static $() {
    return ["DeleteKeyringResponse"];
  }
};
var KeyringSecret = class _KeyringSecret extends __protoMessage3139 {
  constructor(data) {
    super();
    this.name = "";
    this.level = BackgroundComposerSecretLevel.UNSPECIFIED;
    this.createdAtMs = protoInt64.zero;
    this.updatedAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeyringSecret().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeyringSecret().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeyringSecret().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeyringSecret, a, b2);
  }
  static $() {
    return ["KeyringSecret|1 name 9|2 level #0|3 created_at_ms 3|4 updated_at_ms 3", BackgroundComposerSecretLevel];
  }
};
var ListKeyringSecretsRequest = class _ListKeyringSecretsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringSecretsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringSecretsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringSecretsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringSecretsRequest, a, b2);
  }
  static $() {
    return ["ListKeyringSecretsRequest|1 keyring_public_id 9"];
  }
};
var ListKeyringSecretsResponse = class _ListKeyringSecretsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.secrets = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringSecretsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringSecretsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringSecretsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringSecretsResponse, a, b2);
  }
  static $() {
    return ["ListKeyringSecretsResponse|1 secrets #0*", KeyringSecret];
  }
};
var CreateKeyringSecretRequest = class _CreateKeyringSecretRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.name = "";
    this.value = "";
    this.level = BackgroundComposerSecretLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringSecretRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringSecretRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringSecretRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringSecretRequest, a, b2);
  }
  static $() {
    return ["CreateKeyringSecretRequest|1 keyring_public_id 9|2 name 9|3 value 9|4 level #0", BackgroundComposerSecretLevel];
  }
};
var CreateKeyringSecretResponse = class _CreateKeyringSecretResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateKeyringSecretResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateKeyringSecretResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateKeyringSecretResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateKeyringSecretResponse, a, b2);
  }
  static $() {
    return ["CreateKeyringSecretResponse"];
  }
};
var UpdateKeyringSecretRequest = class _UpdateKeyringSecretRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateKeyringSecretRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateKeyringSecretRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateKeyringSecretRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateKeyringSecretRequest, a, b2);
  }
  static $() {
    return ["UpdateKeyringSecretRequest|1 keyring_public_id 9|2 name 9|3 value 9?|4 level #0?", BackgroundComposerSecretLevel];
  }
};
var UpdateKeyringSecretResponse = class _UpdateKeyringSecretResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateKeyringSecretResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateKeyringSecretResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateKeyringSecretResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateKeyringSecretResponse, a, b2);
  }
  static $() {
    return ["UpdateKeyringSecretResponse"];
  }
};
var RevokeKeyringSecretRequest = class _RevokeKeyringSecretRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeKeyringSecretRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeKeyringSecretRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeKeyringSecretRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeKeyringSecretRequest, a, b2);
  }
  static $() {
    return ["RevokeKeyringSecretRequest|1 keyring_public_id 9|2 name 9"];
  }
};
var RevokeKeyringSecretResponse = class _RevokeKeyringSecretResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeKeyringSecretResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeKeyringSecretResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeKeyringSecretResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeKeyringSecretResponse, a, b2);
  }
  static $() {
    return ["RevokeKeyringSecretResponse"];
  }
};
var KeyringGrant = class _KeyringGrant extends __protoMessage3139 {
  constructor(data) {
    super();
    this.principalType = KeyringPrincipalType.UNSPECIFIED;
    this.principalId = "";
    this.accessLevel = KeyringAccessLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeyringGrant().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeyringGrant().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeyringGrant().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeyringGrant, a, b2);
  }
  static $() {
    return ["KeyringGrant|1 principal_type #0|2 principal_id 9|3 access_level #1", KeyringPrincipalType, KeyringAccessLevel];
  }
};
var ListKeyringGrantsRequest = class _ListKeyringGrantsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringGrantsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringGrantsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringGrantsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringGrantsRequest, a, b2);
  }
  static $() {
    return ["ListKeyringGrantsRequest|1 keyring_public_id 9"];
  }
};
var ListKeyringGrantsResponse = class _ListKeyringGrantsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    this.grants = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListKeyringGrantsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListKeyringGrantsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListKeyringGrantsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListKeyringGrantsResponse, a, b2);
  }
  static $() {
    return ["ListKeyringGrantsResponse|1 grants #0*", KeyringGrant];
  }
};
var GrantKeyringPermissionsRequest = class _GrantKeyringPermissionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.principalType = KeyringPrincipalType.UNSPECIFIED;
    this.principalId = "";
    this.accessLevel = KeyringAccessLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrantKeyringPermissionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrantKeyringPermissionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrantKeyringPermissionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrantKeyringPermissionsRequest, a, b2);
  }
  static $() {
    return ["GrantKeyringPermissionsRequest|1 keyring_public_id 9|2 principal_type #0|3 principal_id 9|4 access_level #1", KeyringPrincipalType, KeyringAccessLevel];
  }
};
var GrantKeyringPermissionsResponse = class _GrantKeyringPermissionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrantKeyringPermissionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrantKeyringPermissionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrantKeyringPermissionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrantKeyringPermissionsResponse, a, b2);
  }
  static $() {
    return ["GrantKeyringPermissionsResponse"];
  }
};
var UpdateKeyringPermissionsRequest = class _UpdateKeyringPermissionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.principalType = KeyringPrincipalType.UNSPECIFIED;
    this.principalId = "";
    this.accessLevel = KeyringAccessLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateKeyringPermissionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateKeyringPermissionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateKeyringPermissionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateKeyringPermissionsRequest, a, b2);
  }
  static $() {
    return ["UpdateKeyringPermissionsRequest|1 keyring_public_id 9|2 principal_type #0|3 principal_id 9|4 access_level #1", KeyringPrincipalType, KeyringAccessLevel];
  }
};
var UpdateKeyringPermissionsResponse = class _UpdateKeyringPermissionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateKeyringPermissionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateKeyringPermissionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateKeyringPermissionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateKeyringPermissionsResponse, a, b2);
  }
  static $() {
    return ["UpdateKeyringPermissionsResponse"];
  }
};
var RevokeKeyringPermissionsRequest = class _RevokeKeyringPermissionsRequest extends __protoMessage3139 {
  constructor(data) {
    super();
    this.keyringPublicId = "";
    this.principalType = KeyringPrincipalType.UNSPECIFIED;
    this.principalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeKeyringPermissionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeKeyringPermissionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeKeyringPermissionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeKeyringPermissionsRequest, a, b2);
  }
  static $() {
    return ["RevokeKeyringPermissionsRequest|1 keyring_public_id 9|2 principal_type #0|3 principal_id 9", KeyringPrincipalType];
  }
};
var RevokeKeyringPermissionsResponse = class _RevokeKeyringPermissionsResponse extends __protoMessage3139 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeKeyringPermissionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeKeyringPermissionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeKeyringPermissionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeKeyringPermissionsResponse, a, b2);
  }
  static $() {
    return ["RevokeKeyringPermissionsResponse"];
  }
};

