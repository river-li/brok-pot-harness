var __protoPackage149, __protoMessage3142, CredentialLifecycleState, CredentialExpirationMode, CredentialTargetRuleKind, OnePasswordSyncTrigger, SandCredentialDecisionHarness, SandSetupManifestScopeKind, BulkTeamMemberSandBoxAction, BulkTeamMemberSandBoxItemState, BulkTeamMemberSandBoxOperationState, SandBoxMigrationPhase, SandBoxRunState, SandBoxUpgradeScheduleState, SandBoxStoreMultipartOperationFailureCode, SandBoxStoreManifestCommitStatus, CredentialTargetRule, OnePasswordCredentialItem, OnePasswordConnection, OnePasswordState, BeginOnePasswordConnectionRequest, BeginOnePasswordConnectionResponse, CompleteOnePasswordConnectionRequest, GetOnePasswordStateRequest, SyncOnePasswordConnectionsRequest, DeleteOnePasswordConnectionRequest, SetOnePasswordAlwaysAllowRequest, ApproveOnePasswordCredentialRequestRequest, DenyOnePasswordCredentialRequestRequest, OnePasswordCredentialDecisionResponse, NotifySandAgentTurnFinishedRequest, NotifySandAgentTurnFinishedResponse, ListSandSetupManifestsRequest, SandSetupManifestEntry, SandAssignedSetupManifest, ListSandSetupManifestsResponse, SandTeamSetupManifest, ListTeamSandSetupManifestsRequest, ListTeamSandSetupManifestsResponse, SaveTeamSandSetupManifestRequest, SaveTeamSandSetupManifestResponse, DeleteTeamSandSetupManifestRequest, DeleteTeamSandSetupManifestResponse, ListTeamGroupSandSetupManifestsRequest, ListTeamGroupSandSetupManifestsResponse, SaveTeamGroupSandSetupManifestRequest, SaveTeamGroupSandSetupManifestResponse, DeleteTeamGroupSandSetupManifestRequest, DeleteTeamGroupSandSetupManifestResponse, ListTeamMemberSandBoxesRequest, TeamMemberSandBoxPod, ListTeamMemberSandBoxesResponse, KillTeamMemberSandBoxRequest, KillTeamMemberSandBoxResponse, RecreateTeamMemberSandBoxRequest, GetTeamMemberSandBoxMigrationStatusRequest, GetTeamMemberSandBoxMigrationStatusResponse, StartBulkTeamMemberSandBoxOperationRequest, StartBulkTeamMemberSandBoxOperationResponse, GetBulkTeamMemberSandBoxOperationStatusRequest, BulkTeamMemberSandBoxOperationItem, GetBulkTeamMemberSandBoxOperationStatusResponse, EnsureSandBoxRequest, EnsureSandBoxWindowRequest, EnsureSandBoxResponse, RecreateSandBoxRequest, ForceRecreateSandBoxRequest, RecreateSandBoxResponse, AdminRecreateSandBoxRequest, AdminForceRecreateSandBoxRequest, AdminSandBoxStoreStatusRequest, AdminSandBoxStoreStatusResponse, AdminUpdateSandBoxHostRequest, AdminUpdateSandBoxHostResponse, AdminSandBoxHostStatusRequest, AdminSandBoxHostStatusResponse, AdminSnapshotSandBoxStoreRequest, AdminSnapshotSandBoxStoreResponse, AdminListSandBoxStoreManifestVersionsRequest, SandBoxStoreManifestVersion, AdminListSandBoxStoreManifestVersionsResponse, AdminRestoreSandBoxStoreSnapshotRequest, AdminRestoreSandBoxStoreSnapshotResponse, AdminHibernateSandBoxRequest, AdminHibernateSandBoxResponse, AdminListSandAgentsRequest, AdminListSandAgentsResponse, AdminGetSandAgentTranscriptPageRequest, AdminGetSandAgentTranscriptPageResponse, WatchSandBoxMigrationRequest, AdminWatchSandBoxMigrationRequest, SandBoxMigrationEvent, GetSandBoxRunStateRequest, GetSandBoxRunStateResponse, SandBoxUpgradeSchedule, GetSandBoxUpgradeScheduleRequest, GetSandBoxUpgradeScheduleResponse, ScheduleSandBoxUpgradeRequest, ScheduleSandBoxUpgradeResponse, CancelSandBoxUpgradeRequest, CancelSandBoxUpgradeResponse, RescheduleSandBoxUpgradeRequest, RescheduleSandBoxUpgradeResponse, SandBoxDescriptor, ListSandBoxesRequest, ListSandBoxesResponse, SandBoxStoreMultipartPart, SandBoxStoreWriteFile, PresignSandBoxStoreWritesRequest, SandBoxStoreMultipartUploadPartInstruction, SandBoxStoreMultipartUploadContext, SandBoxStoreMultipartWriteInstruction, SandBoxStoreWriteInstruction, PresignSandBoxStoreWritesResponse, SandBoxStoreMultipartUploadedPart, SandBoxStoreMultipartWriteCompletion, CompleteSandBoxStoreMultipartWritesRequest, SandBoxStoreMultipartWriteSuccess, SandBoxStoreMultipartOperationFailure, SandBoxStoreMultipartWriteResult, CompleteSandBoxStoreMultipartWritesResponse, CommitSandBoxStoreManifestRequest, CommitSandBoxStoreManifestResponse, SandBoxStoreMultipartWriteAbort, AbortSandBoxStoreMultipartWritesRequest, SandBoxStoreMultipartAbortSuccess, SandBoxStoreMultipartAbortResult, AbortSandBoxStoreMultipartWritesResponse, PresignSandBoxStoreReadsRequest, SandBoxStoreReadInstruction, PresignSandBoxStoreReadsResponse, StatSandBoxStoreObjectRequest, StatSandBoxStoreObjectResponse, ListSandBoxStoreObjectsRequest, SandBoxStoreObjectEntry, ListSandBoxStoreObjectsResponse, MintSandVoiceCallSecretRequest, MintSandVoiceCallSecretResponse;
var init_sand_box_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/sand_box_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage149 = "aiserver.v1.";
    __protoMessage3142 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage149;
      }
    };
    CredentialLifecycleState = /* @__PURE__ */ enumType(proto3, __protoPackage149, "CredentialLifecycleState", [[0, "UNSPECIFIED"], [1, "ACTIVE"], [2, "EXPIRING"], [3, "GRACE"], [4, "EXPIRED"], [5, "PROVIDER_REJECTED"]], 1);
    CredentialExpirationMode = /* @__PURE__ */ enumType(proto3, __protoPackage149, "CredentialExpirationMode", [[0, "UNSPECIFIED"], [1, "DISABLED"], [2, "WARN"], [3, "ENFORCE"]], 1);
    CredentialTargetRuleKind = /* @__PURE__ */ enumType(proto3, __protoPackage149, "CredentialTargetRuleKind", [[0, "UNSPECIFIED"], [1, "EXACT_HOST_PORT"], [2, "REGISTRABLE_DOMAIN"]], 1);
    OnePasswordSyncTrigger = /* @__PURE__ */ enumType(proto3, __protoPackage149, "OnePasswordSyncTrigger", [[0, "UNSPECIFIED"], [1, "MANUAL"], [2, "APP_FOCUS"]], 1);
    SandCredentialDecisionHarness = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandCredentialDecisionHarness", [[0, "UNSPECIFIED"], [1, "BOX"], [2, "TEMPORAL"]], 1);
    SandSetupManifestScopeKind = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandSetupManifestScopeKind", [[0, "UNSPECIFIED"], [1, "USER"], [2, "TEAM"], [3, "ORGANIZATION"]], 1);
    BulkTeamMemberSandBoxAction = /* @__PURE__ */ enumType(proto3, __protoPackage149, "BulkTeamMemberSandBoxAction", [[0, "UNSPECIFIED"], [1, "KILL"], [2, "RECREATE"], [3, "PERMANENT_DELETE"]], 1);
    BulkTeamMemberSandBoxItemState = /* @__PURE__ */ enumType(proto3, __protoPackage149, "BulkTeamMemberSandBoxItemState", [[0, "UNSPECIFIED"], [1, "QUEUED"], [2, "RUNNING"], [3, "SUCCEEDED"], [4, "SKIPPED"], [5, "FAILED"]], 1);
    BulkTeamMemberSandBoxOperationState = /* @__PURE__ */ enumType(proto3, __protoPackage149, "BulkTeamMemberSandBoxOperationState", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "SUCCEEDED"], [3, "PARTIALLY_SUCCEEDED"], [4, "FAILED"]], 1);
    SandBoxMigrationPhase = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandBoxMigrationPhase", [[0, "UNSPECIFIED"], [1, "BACKING_UP"], [2, "CREATING"], [3, "MOVING"], [4, "CLEANING_UP"], [5, "WIPING"], [6, "DONE"], [7, "FAILED"]], 1);
    SandBoxRunState = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandBoxRunState", [[0, "UNSPECIFIED"], [1, "ABSENT"], [2, "HIBERNATED"], [3, "RUNNING"], [4, "STARTING"]], 1);
    SandBoxUpgradeScheduleState = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandBoxUpgradeScheduleState", [[0, "UNSPECIFIED"], [1, "SCHEDULED"], [2, "CLAIMED"], [3, "RUNNING"], [4, "WAITING_FOR_IMAGE"], [5, "COMPLETED"], [6, "MISSED"], [7, "FAILED"], [8, "CANCELLED"]], 1);
    SandBoxStoreMultipartOperationFailureCode = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandBoxStoreMultipartOperationFailureCode", [[0, "UNSPECIFIED"], [1, "PRECONDITION_FAILED"], [2, "UPLOAD_NOT_FOUND"], [3, "INVALID_PARTS"], [4, "CHECKSUM_MISMATCH"], [5, "TRANSIENT"], [6, "INTERNAL"], [7, "RESTART_REQUIRED"]], 1);
    SandBoxStoreManifestCommitStatus = /* @__PURE__ */ enumType(proto3, __protoPackage149, "SandBoxStoreManifestCommitStatus", [[0, "UNSPECIFIED"], [1, "COMMITTED"], [2, "RETRY"], [3, "FENCED"]], 1);
    CredentialTargetRule = class _CredentialTargetRule extends __protoMessage3142 {
      constructor(data) {
        super();
        this.kind = CredentialTargetRuleKind.UNSPECIFIED;
        this.scheme = "";
        this.host = "";
        this.port = 0;
        this.registrableDomain = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CredentialTargetRule().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CredentialTargetRule().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CredentialTargetRule().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CredentialTargetRule, a, b2);
      }
      static $() {
        return ["CredentialTargetRule|1 kind #0|2 scheme 9|3 host 9|4 port 5|5 registrable_domain 9", CredentialTargetRuleKind];
      }
    };
    OnePasswordCredentialItem = class _OnePasswordCredentialItem extends __protoMessage3142 {
      constructor(data) {
        super();
        this.credentialId = "";
        this.title = "";
        this.category = "";
        this.sites = [];
        this.targetRules = [];
        this.vaultName = "";
        this.connectionId = "";
        this.catalogRevision = "";
        this.hasOneTimeCode = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OnePasswordCredentialItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OnePasswordCredentialItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OnePasswordCredentialItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OnePasswordCredentialItem, a, b2);
      }
      static $() {
        return ["OnePasswordCredentialItem|1 credential_id 9|2 title 9|3 category 9|4 sites 9*|5 target_rules #0*|6 vault_name 9|7 connection_id 9|8 catalog_revision 9|9 has_one_time_code 8", CredentialTargetRule];
      }
    };
    OnePasswordConnection = class _OnePasswordConnection extends __protoMessage3142 {
      constructor(data) {
        super();
        this.connectionId = "";
        this.accountUuid = "";
        this.accountEmail = "";
        this.accountUrl = "";
        this.vaultId = "";
        this.vaultName = "";
        this.itemCount = 0;
        this.catalogRevision = "";
        this.lastSuccessfulSyncAtMs = protoInt64.zero;
        this.lastSyncErrorCode = "";
        this.credentialGeneration = 0;
        this.issuedAtMs = protoInt64.zero;
        this.expiresAtMs = protoInt64.zero;
        this.renewByAtMs = protoInt64.zero;
        this.reminderAtMs = protoInt64.zero;
        this.lifecycleState = CredentialLifecycleState.UNSPECIFIED;
        this.expirationMode = CredentialExpirationMode.UNSPECIFIED;
        this.providerExpiryRequested = false;
        this.alwaysAllow = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OnePasswordConnection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OnePasswordConnection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OnePasswordConnection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OnePasswordConnection, a, b2);
      }
      static $() {
        return ["OnePasswordConnection|1 connection_id 9|2 account_uuid 9|3 account_email 9|4 account_url 9|5 vault_id 9|6 vault_name 9|7 item_count 5|8 catalog_revision 9|9 last_successful_sync_at_ms 3|10 last_sync_error_code 9|11 credential_generation 5|12 issued_at_ms 3|13 expires_at_ms 3|14 renew_by_at_ms 3|15 reminder_at_ms 3|16 lifecycle_state #0|17 expiration_mode #1|18 provider_expiry_requested 8|19 always_allow 8", CredentialLifecycleState, CredentialExpirationMode];
      }
    };
    OnePasswordState = class _OnePasswordState extends __protoMessage3142 {
      constructor(data) {
        super();
        this.connections = [];
        this.items = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OnePasswordState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OnePasswordState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OnePasswordState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OnePasswordState, a, b2);
      }
      static $() {
        return ["OnePasswordState|1 connections #0*|2 items #1*", OnePasswordConnection, OnePasswordCredentialItem];
      }
    };
    BeginOnePasswordConnectionRequest = class _BeginOnePasswordConnectionRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.connectionId = "";
        this.vaultId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BeginOnePasswordConnectionRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BeginOnePasswordConnectionRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BeginOnePasswordConnectionRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BeginOnePasswordConnectionRequest, a, b2);
      }
      static $() {
        return ["BeginOnePasswordConnectionRequest|1 connection_id 9|2 vault_id 9"];
      }
    };
    BeginOnePasswordConnectionResponse = class _BeginOnePasswordConnectionResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.mintTicket = "";
        this.connectionId = "";
        this.expectedGeneration = 0;
        this.expirationMode = CredentialExpirationMode.UNSPECIFIED;
        this.providerExpiresInSeconds = protoInt64.zero;
        this.credentialExpiresAtMs = protoInt64.zero;
        this.ticketExpiresAtMs = protoInt64.zero;
        this.policyVersion = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BeginOnePasswordConnectionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BeginOnePasswordConnectionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BeginOnePasswordConnectionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BeginOnePasswordConnectionResponse, a, b2);
      }
      static $() {
        return ["BeginOnePasswordConnectionResponse|1 mint_ticket 9|2 connection_id 9|3 expected_generation 5|4 expiration_mode #0|5 provider_expires_in_seconds 3|6 credential_expires_at_ms 3|7 ticket_expires_at_ms 3|8 policy_version 5", CredentialExpirationMode];
      }
    };
    CompleteOnePasswordConnectionRequest = class _CompleteOnePasswordConnectionRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.mintTicket = "";
        this.serviceAccountToken = "";
        this.accountUuid = "";
        this.accountEmail = "";
        this.accountUrl = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CompleteOnePasswordConnectionRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CompleteOnePasswordConnectionRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CompleteOnePasswordConnectionRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CompleteOnePasswordConnectionRequest, a, b2);
      }
      static $() {
        return ["CompleteOnePasswordConnectionRequest|1 mint_ticket 9|2 service_account_token 9|3 account_uuid 9|4 account_email 9|5 account_url 9"];
      }
    };
    GetOnePasswordStateRequest = class _GetOnePasswordStateRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetOnePasswordStateRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetOnePasswordStateRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetOnePasswordStateRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetOnePasswordStateRequest, a, b2);
      }
      static $() {
        return ["GetOnePasswordStateRequest"];
      }
    };
    SyncOnePasswordConnectionsRequest = class _SyncOnePasswordConnectionsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.trigger = OnePasswordSyncTrigger.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SyncOnePasswordConnectionsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SyncOnePasswordConnectionsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SyncOnePasswordConnectionsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SyncOnePasswordConnectionsRequest, a, b2);
      }
      static $() {
        return ["SyncOnePasswordConnectionsRequest|1 trigger #0", OnePasswordSyncTrigger];
      }
    };
    DeleteOnePasswordConnectionRequest = class _DeleteOnePasswordConnectionRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.connectionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteOnePasswordConnectionRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteOnePasswordConnectionRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteOnePasswordConnectionRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteOnePasswordConnectionRequest, a, b2);
      }
      static $() {
        return ["DeleteOnePasswordConnectionRequest|1 connection_id 9"];
      }
    };
    SetOnePasswordAlwaysAllowRequest = class _SetOnePasswordAlwaysAllowRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.connectionId = "";
        this.alwaysAllow = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetOnePasswordAlwaysAllowRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetOnePasswordAlwaysAllowRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetOnePasswordAlwaysAllowRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetOnePasswordAlwaysAllowRequest, a, b2);
      }
      static $() {
        return ["SetOnePasswordAlwaysAllowRequest|1 connection_id 9|2 always_allow 8"];
      }
    };
    ApproveOnePasswordCredentialRequestRequest = class _ApproveOnePasswordCredentialRequestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.entryId = "";
        this.agentId = "";
        this.credentialId = "";
        this.connectionId = "";
        this.catalogRevision = "";
        this.targetSite = "";
        this.harness = SandCredentialDecisionHarness.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ApproveOnePasswordCredentialRequestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ApproveOnePasswordCredentialRequestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ApproveOnePasswordCredentialRequestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ApproveOnePasswordCredentialRequestRequest, a, b2);
      }
      static $() {
        return ["ApproveOnePasswordCredentialRequestRequest|1 entry_id 9|2 agent_id 9|3 credential_id 9|4 connection_id 9|5 catalog_revision 9|6 target_site 9|7 harness #0", SandCredentialDecisionHarness];
      }
    };
    DenyOnePasswordCredentialRequestRequest = class _DenyOnePasswordCredentialRequestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.entryId = "";
        this.agentId = "";
        this.harness = SandCredentialDecisionHarness.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DenyOnePasswordCredentialRequestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DenyOnePasswordCredentialRequestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DenyOnePasswordCredentialRequestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DenyOnePasswordCredentialRequestRequest, a, b2);
      }
      static $() {
        return ["DenyOnePasswordCredentialRequestRequest|1 entry_id 9|2 agent_id 9|3 harness #0", SandCredentialDecisionHarness];
      }
    };
    OnePasswordCredentialDecisionResponse = class _OnePasswordCredentialDecisionResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.ok = false;
        this.detail = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OnePasswordCredentialDecisionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OnePasswordCredentialDecisionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OnePasswordCredentialDecisionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OnePasswordCredentialDecisionResponse, a, b2);
      }
      static $() {
        return ["OnePasswordCredentialDecisionResponse|1 ok 8|2 detail 9"];
      }
    };
    NotifySandAgentTurnFinishedRequest = class _NotifySandAgentTurnFinishedRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.agentId = "";
        this.agentName = "";
        this.messagePreview = "";
        this.lastMessageId = "";
        this.awaitingUserResponse = false;
        this.memberAgentIds = [];
        this.senderAgentId = "";
        this.messageContentJson = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NotifySandAgentTurnFinishedRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NotifySandAgentTurnFinishedRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NotifySandAgentTurnFinishedRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NotifySandAgentTurnFinishedRequest, a, b2);
      }
      static $() {
        return ["NotifySandAgentTurnFinishedRequest|1 agent_id 9|2 agent_name 9|3 message_preview 9|4 last_message_id 9|5 awaiting_user_response 8|7 member_agent_ids 9*|8 sender_agent_id 9|9 message_content_json 9"];
      }
    };
    NotifySandAgentTurnFinishedResponse = class _NotifySandAgentTurnFinishedResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NotifySandAgentTurnFinishedResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NotifySandAgentTurnFinishedResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NotifySandAgentTurnFinishedResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NotifySandAgentTurnFinishedResponse, a, b2);
      }
      static $() {
        return ["NotifySandAgentTurnFinishedResponse"];
      }
    };
    ListSandSetupManifestsRequest = class _ListSandSetupManifestsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandSetupManifestsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandSetupManifestsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandSetupManifestsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandSetupManifestsRequest, a, b2);
      }
      static $() {
        return ["ListSandSetupManifestsRequest"];
      }
    };
    SandSetupManifestEntry = class _SandSetupManifestEntry extends __protoMessage3142 {
      constructor(data) {
        super();
        this.id = "";
        this.setup = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandSetupManifestEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandSetupManifestEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandSetupManifestEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandSetupManifestEntry, a, b2);
      }
      static $() {
        return ["SandSetupManifestEntry|1 id 9|2 setup 9|3 check 9?"];
      }
    };
    SandAssignedSetupManifest = class _SandAssignedSetupManifest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.scopeKind = SandSetupManifestScopeKind.UNSPECIFIED;
        this.scopeId = "";
        this.manifestId = "";
        this.revision = "";
        this.entries = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandAssignedSetupManifest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandAssignedSetupManifest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandAssignedSetupManifest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandAssignedSetupManifest, a, b2);
      }
      static $() {
        return ["SandAssignedSetupManifest|1 scope_kind #0|2 scope_id 9|3 manifest_id 9|4 revision 9|5 entries #1*", SandSetupManifestScopeKind, SandSetupManifestEntry];
      }
    };
    ListSandSetupManifestsResponse = class _ListSandSetupManifestsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.schemaVersion = 0;
        this.manifests = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandSetupManifestsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandSetupManifestsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandSetupManifestsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandSetupManifestsResponse, a, b2);
      }
      static $() {
        return ["ListSandSetupManifestsResponse|1 schema_version 13|2 manifests #0*", SandAssignedSetupManifest];
      }
    };
    SandTeamSetupManifest = class _SandTeamSetupManifest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.manifestId = "";
        this.revision = "";
        this.etag = "";
        this.entries = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandTeamSetupManifest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandTeamSetupManifest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandTeamSetupManifest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandTeamSetupManifest, a, b2);
      }
      static $() {
        return ["SandTeamSetupManifest|1 manifest_id 9|2 revision 9|3 etag 9|4 entries #0*", SandSetupManifestEntry];
      }
    };
    ListTeamSandSetupManifestsRequest = class _ListTeamSandSetupManifestsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamSandSetupManifestsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamSandSetupManifestsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamSandSetupManifestsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamSandSetupManifestsRequest, a, b2);
      }
      static $() {
        return ["ListTeamSandSetupManifestsRequest"];
      }
    };
    ListTeamSandSetupManifestsResponse = class _ListTeamSandSetupManifestsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = "";
        this.canManage = false;
        this.manifests = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamSandSetupManifestsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamSandSetupManifestsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamSandSetupManifestsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamSandSetupManifestsResponse, a, b2);
      }
      static $() {
        return ["ListTeamSandSetupManifestsResponse|1 team_id 9|2 can_manage 8|3 manifests #0*", SandTeamSetupManifest];
      }
    };
    SaveTeamSandSetupManifestRequest = class _SaveTeamSandSetupManifestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.manifestId = "";
        this.expectedEtag = "";
        this.entries = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveTeamSandSetupManifestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveTeamSandSetupManifestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveTeamSandSetupManifestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveTeamSandSetupManifestRequest, a, b2);
      }
      static $() {
        return ["SaveTeamSandSetupManifestRequest|1 manifest_id 9|2 expected_etag 9|3 entries #0*", SandSetupManifestEntry];
      }
    };
    SaveTeamSandSetupManifestResponse = class _SaveTeamSandSetupManifestResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveTeamSandSetupManifestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveTeamSandSetupManifestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveTeamSandSetupManifestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveTeamSandSetupManifestResponse, a, b2);
      }
      static $() {
        return ["SaveTeamSandSetupManifestResponse|1 manifest #0", SandTeamSetupManifest];
      }
    };
    DeleteTeamSandSetupManifestRequest = class _DeleteTeamSandSetupManifestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.manifestId = "";
        this.expectedEtag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTeamSandSetupManifestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTeamSandSetupManifestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTeamSandSetupManifestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTeamSandSetupManifestRequest, a, b2);
      }
      static $() {
        return ["DeleteTeamSandSetupManifestRequest|1 manifest_id 9|2 expected_etag 9"];
      }
    };
    DeleteTeamSandSetupManifestResponse = class _DeleteTeamSandSetupManifestResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTeamSandSetupManifestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTeamSandSetupManifestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTeamSandSetupManifestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTeamSandSetupManifestResponse, a, b2);
      }
      static $() {
        return ["DeleteTeamSandSetupManifestResponse"];
      }
    };
    ListTeamGroupSandSetupManifestsRequest = class _ListTeamGroupSandSetupManifestsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.groupPublicId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamGroupSandSetupManifestsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamGroupSandSetupManifestsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamGroupSandSetupManifestsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamGroupSandSetupManifestsRequest, a, b2);
      }
      static $() {
        return ["ListTeamGroupSandSetupManifestsRequest|1 group_public_id 9"];
      }
    };
    ListTeamGroupSandSetupManifestsResponse = class _ListTeamGroupSandSetupManifestsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = "";
        this.canManage = false;
        this.manifests = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamGroupSandSetupManifestsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamGroupSandSetupManifestsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamGroupSandSetupManifestsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamGroupSandSetupManifestsResponse, a, b2);
      }
      static $() {
        return ["ListTeamGroupSandSetupManifestsResponse|1 team_id 9|2 can_manage 8|3 manifests #0*", SandTeamSetupManifest];
      }
    };
    SaveTeamGroupSandSetupManifestRequest = class _SaveTeamGroupSandSetupManifestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.groupId = protoInt64.zero;
        this.manifestId = "";
        this.expectedEtag = "";
        this.entries = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveTeamGroupSandSetupManifestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveTeamGroupSandSetupManifestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveTeamGroupSandSetupManifestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveTeamGroupSandSetupManifestRequest, a, b2);
      }
      static $() {
        return ["SaveTeamGroupSandSetupManifestRequest|1 group_id 3|2 manifest_id 9|3 expected_etag 9|4 entries #0*", SandSetupManifestEntry];
      }
    };
    SaveTeamGroupSandSetupManifestResponse = class _SaveTeamGroupSandSetupManifestResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveTeamGroupSandSetupManifestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveTeamGroupSandSetupManifestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveTeamGroupSandSetupManifestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveTeamGroupSandSetupManifestResponse, a, b2);
      }
      static $() {
        return ["SaveTeamGroupSandSetupManifestResponse|1 manifest #0", SandTeamSetupManifest];
      }
    };
    DeleteTeamGroupSandSetupManifestRequest = class _DeleteTeamGroupSandSetupManifestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.groupId = protoInt64.zero;
        this.manifestId = "";
        this.expectedEtag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTeamGroupSandSetupManifestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTeamGroupSandSetupManifestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTeamGroupSandSetupManifestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTeamGroupSandSetupManifestRequest, a, b2);
      }
      static $() {
        return ["DeleteTeamGroupSandSetupManifestRequest|1 group_id 3|2 manifest_id 9|3 expected_etag 9"];
      }
    };
    DeleteTeamGroupSandSetupManifestResponse = class _DeleteTeamGroupSandSetupManifestResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTeamGroupSandSetupManifestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTeamGroupSandSetupManifestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTeamGroupSandSetupManifestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTeamGroupSandSetupManifestResponse, a, b2);
      }
      static $() {
        return ["DeleteTeamGroupSandSetupManifestResponse"];
      }
    };
    ListTeamMemberSandBoxesRequest = class _ListTeamMemberSandBoxesRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.userId = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamMemberSandBoxesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamMemberSandBoxesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamMemberSandBoxesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamMemberSandBoxesRequest, a, b2);
      }
      static $() {
        return ["ListTeamMemberSandBoxesRequest|1 team_id 5|2 user_id 5"];
      }
    };
    TeamMemberSandBoxPod = class _TeamMemberSandBoxPod extends __protoMessage3142 {
      constructor(data) {
        super();
        this.cluster = "";
        this.podId = "";
        this.tenantId = "";
        this.flavor = "";
        this.runState = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TeamMemberSandBoxPod().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TeamMemberSandBoxPod().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TeamMemberSandBoxPod().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TeamMemberSandBoxPod, a, b2);
      }
      static $() {
        return ["TeamMemberSandBoxPod|1 cluster 9|2 pod_id 9|3 tenant_id 9|4 flavor 9|5 run_state 9|6 image_tag 9?|7 created_at_ms 3?|8 last_active_at_ms 3?|9 node_id 9?|10 failure_reason 9?"];
      }
    };
    ListTeamMemberSandBoxesResponse = class _ListTeamMemberSandBoxesResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.userId = 0;
        this.email = "";
        this.name = "";
        this.boxes = [];
        this.scanIncomplete = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListTeamMemberSandBoxesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListTeamMemberSandBoxesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListTeamMemberSandBoxesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListTeamMemberSandBoxesResponse, a, b2);
      }
      static $() {
        return ["ListTeamMemberSandBoxesResponse|1 user_id 5|2 email 9|3 name 9|4 boxes #0*|5 scan_incomplete 8", TeamMemberSandBoxPod];
      }
    };
    KillTeamMemberSandBoxRequest = class _KillTeamMemberSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.userId = 0;
        this.podId = "";
        this.cluster = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KillTeamMemberSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KillTeamMemberSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KillTeamMemberSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KillTeamMemberSandBoxRequest, a, b2);
      }
      static $() {
        return ["KillTeamMemberSandBoxRequest|1 team_id 5|2 user_id 5|3 pod_id 9|4 cluster 9"];
      }
    };
    KillTeamMemberSandBoxResponse = class _KillTeamMemberSandBoxResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.killed = false;
        this.reason = "";
        this.deletedCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KillTeamMemberSandBoxResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KillTeamMemberSandBoxResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KillTeamMemberSandBoxResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KillTeamMemberSandBoxResponse, a, b2);
      }
      static $() {
        return ["KillTeamMemberSandBoxResponse|1 killed 8|2 reason 9|3 deleted_count 13"];
      }
    };
    RecreateTeamMemberSandBoxRequest = class _RecreateTeamMemberSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.userId = 0;
        this.force = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecreateTeamMemberSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecreateTeamMemberSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecreateTeamMemberSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecreateTeamMemberSandBoxRequest, a, b2);
      }
      static $() {
        return ["RecreateTeamMemberSandBoxRequest|1 team_id 5|2 user_id 5|3 force 8"];
      }
    };
    GetTeamMemberSandBoxMigrationStatusRequest = class _GetTeamMemberSandBoxMigrationStatusRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.userId = 0;
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetTeamMemberSandBoxMigrationStatusRequest, a, b2);
      }
      static $() {
        return ["GetTeamMemberSandBoxMigrationStatusRequest|1 team_id 5|2 user_id 5|3 operation_id 9"];
      }
    };
    GetTeamMemberSandBoxMigrationStatusResponse = class _GetTeamMemberSandBoxMigrationStatusResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetTeamMemberSandBoxMigrationStatusResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetTeamMemberSandBoxMigrationStatusResponse, a, b2);
      }
      static $() {
        return ["GetTeamMemberSandBoxMigrationStatusResponse|1 event #0?", SandBoxMigrationEvent];
      }
    };
    StartBulkTeamMemberSandBoxOperationRequest = class _StartBulkTeamMemberSandBoxOperationRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.userIds = [];
        this.action = BulkTeamMemberSandBoxAction.UNSPECIFIED;
        this.force = false;
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartBulkTeamMemberSandBoxOperationRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartBulkTeamMemberSandBoxOperationRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartBulkTeamMemberSandBoxOperationRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartBulkTeamMemberSandBoxOperationRequest, a, b2);
      }
      static $() {
        return ["StartBulkTeamMemberSandBoxOperationRequest|1 team_id 5|2 user_ids 5*|3 action #0|4 force 8|5 operation_id 9", BulkTeamMemberSandBoxAction];
      }
    };
    StartBulkTeamMemberSandBoxOperationResponse = class _StartBulkTeamMemberSandBoxOperationResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartBulkTeamMemberSandBoxOperationResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartBulkTeamMemberSandBoxOperationResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartBulkTeamMemberSandBoxOperationResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartBulkTeamMemberSandBoxOperationResponse, a, b2);
      }
      static $() {
        return ["StartBulkTeamMemberSandBoxOperationResponse|1 operation_id 9"];
      }
    };
    GetBulkTeamMemberSandBoxOperationStatusRequest = class _GetBulkTeamMemberSandBoxOperationStatusRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.teamId = 0;
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetBulkTeamMemberSandBoxOperationStatusRequest, a, b2);
      }
      static $() {
        return ["GetBulkTeamMemberSandBoxOperationStatusRequest|1 team_id 5|2 operation_id 9"];
      }
    };
    BulkTeamMemberSandBoxOperationItem = class _BulkTeamMemberSandBoxOperationItem extends __protoMessage3142 {
      constructor(data) {
        super();
        this.userId = 0;
        this.state = BulkTeamMemberSandBoxItemState.UNSPECIFIED;
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BulkTeamMemberSandBoxOperationItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BulkTeamMemberSandBoxOperationItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BulkTeamMemberSandBoxOperationItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BulkTeamMemberSandBoxOperationItem, a, b2);
      }
      static $() {
        return ["BulkTeamMemberSandBoxOperationItem|1 user_id 5|2 state #0|3 reason 9|4 recreate_operation_id 9?", BulkTeamMemberSandBoxItemState];
      }
    };
    GetBulkTeamMemberSandBoxOperationStatusResponse = class _GetBulkTeamMemberSandBoxOperationStatusResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.operationId = "";
        this.action = BulkTeamMemberSandBoxAction.UNSPECIFIED;
        this.state = BulkTeamMemberSandBoxOperationState.UNSPECIFIED;
        this.totalCount = 0;
        this.queuedCount = 0;
        this.runningCount = 0;
        this.succeededCount = 0;
        this.skippedCount = 0;
        this.failedCount = 0;
        this.items = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetBulkTeamMemberSandBoxOperationStatusResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetBulkTeamMemberSandBoxOperationStatusResponse, a, b2);
      }
      static $() {
        return ["GetBulkTeamMemberSandBoxOperationStatusResponse|1 operation_id 9|2 action #0|3 state #1|4 total_count 13|5 queued_count 13|6 running_count 13|7 succeeded_count 13|8 skipped_count 13|9 failed_count 13|10 items #2*", BulkTeamMemberSandBoxAction, BulkTeamMemberSandBoxOperationState, BulkTeamMemberSandBoxOperationItem];
      }
    };
    EnsureSandBoxRequest = class _EnsureSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EnsureSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EnsureSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EnsureSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EnsureSandBoxRequest, a, b2);
      }
      static $() {
        return ["EnsureSandBoxRequest|2 wake 8?"];
      }
    };
    EnsureSandBoxWindowRequest = class _EnsureSandBoxWindowRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.windowIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EnsureSandBoxWindowRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EnsureSandBoxWindowRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EnsureSandBoxWindowRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EnsureSandBoxWindowRequest, a, b2);
      }
      static $() {
        return ["EnsureSandBoxWindowRequest|2 window_index 5"];
      }
    };
    EnsureSandBoxResponse = class _EnsureSandBoxResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.cluster = "";
        this.tenantId = "";
        this.podId = "";
        this.networkToken = "";
        this.execDaemonAuthToken = "";
        this.execDaemonUrl = "";
        this.vncUrl = "";
        this.terminalsFolder = "";
        this.forkVncBaseUrl = "";
        this.gatewayUrl = "";
        this.gatewayToken = "";
        this.runState = SandBoxRunState.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EnsureSandBoxResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EnsureSandBoxResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EnsureSandBoxResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EnsureSandBoxResponse, a, b2);
      }
      static $() {
        return ["EnsureSandBoxResponse|1 cluster 9|2 tenant_id 9|3 pod_id 9|4 network_token 9|5 exec_daemon_auth_token 9|6 exec_daemon_url 9|7 vnc_url 9|8 terminals_folder 9|12 fork_vnc_base_url 9|9 image_update_available 8?|10 gateway_url 9|11 gateway_token 9|13 run_state #0", SandBoxRunState];
      }
    };
    RecreateSandBoxRequest = class _RecreateSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.preserveData = false;
        this.force = false;
        this.acknowledgeTerminalUpgradeSchedule = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecreateSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecreateSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecreateSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecreateSandBoxRequest, a, b2);
      }
      static $() {
        return ["RecreateSandBoxRequest|1 preserve_data 8|2 force 8|3 acknowledge_terminal_upgrade_schedule 8"];
      }
    };
    ForceRecreateSandBoxRequest = class _ForceRecreateSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ForceRecreateSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ForceRecreateSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ForceRecreateSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ForceRecreateSandBoxRequest, a, b2);
      }
      static $() {
        return ["ForceRecreateSandBoxRequest"];
      }
    };
    RecreateSandBoxResponse = class _RecreateSandBoxResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.started = false;
        this.reason = "";
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecreateSandBoxResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecreateSandBoxResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecreateSandBoxResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecreateSandBoxResponse, a, b2);
      }
      static $() {
        return ["RecreateSandBoxResponse|1 started 8|2 reason 9|3 operation_id 9"];
      }
    };
    AdminRecreateSandBoxRequest = class _AdminRecreateSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.preserveData = false;
        this.force = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminRecreateSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminRecreateSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminRecreateSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminRecreateSandBoxRequest, a, b2);
      }
      static $() {
        return ["AdminRecreateSandBoxRequest|1 auth_id 9|2 flavor 9|3 preserve_data 8|4 force 8"];
      }
    };
    AdminForceRecreateSandBoxRequest = class _AdminForceRecreateSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminForceRecreateSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminForceRecreateSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminForceRecreateSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminForceRecreateSandBoxRequest, a, b2);
      }
      static $() {
        return ["AdminForceRecreateSandBoxRequest|1 auth_id 9|2 flavor 9"];
      }
    };
    AdminSandBoxStoreStatusRequest = class _AdminSandBoxStoreStatusRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSandBoxStoreStatusRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSandBoxStoreStatusRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSandBoxStoreStatusRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSandBoxStoreStatusRequest, a, b2);
      }
      static $() {
        return ["AdminSandBoxStoreStatusRequest|1 auth_id 9|2 flavor 9"];
      }
    };
    AdminSandBoxStoreStatusResponse = class _AdminSandBoxStoreStatusResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.durable = false;
        this.entryCount = protoInt64.zero;
        this.totalBytes = protoInt64.zero;
        this.lastSnapshotAtMs = protoInt64.zero;
        this.reachable = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSandBoxStoreStatusResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSandBoxStoreStatusResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSandBoxStoreStatusResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSandBoxStoreStatusResponse, a, b2);
      }
      static $() {
        return ["AdminSandBoxStoreStatusResponse|1 durable 8|2 entry_count 3|3 total_bytes 3|4 last_snapshot_at_ms 3|5 reachable 8"];
      }
    };
    AdminUpdateSandBoxHostRequest = class _AdminUpdateSandBoxHostRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.force = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminUpdateSandBoxHostRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminUpdateSandBoxHostRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminUpdateSandBoxHostRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminUpdateSandBoxHostRequest, a, b2);
      }
      static $() {
        return ["AdminUpdateSandBoxHostRequest|1 auth_id 9|2 flavor 9|3 force 8"];
      }
    };
    AdminUpdateSandBoxHostResponse = class _AdminUpdateSandBoxHostResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.started = false;
        this.reason = "";
        this.version = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminUpdateSandBoxHostResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminUpdateSandBoxHostResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminUpdateSandBoxHostResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminUpdateSandBoxHostResponse, a, b2);
      }
      static $() {
        return ["AdminUpdateSandBoxHostResponse|1 started 8|2 reason 9|3 version 9"];
      }
    };
    AdminSandBoxHostStatusRequest = class _AdminSandBoxHostStatusRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSandBoxHostStatusRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSandBoxHostStatusRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSandBoxHostStatusRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSandBoxHostStatusRequest, a, b2);
      }
      static $() {
        return ["AdminSandBoxHostStatusRequest|1 auth_id 9|2 flavor 9"];
      }
    };
    AdminSandBoxHostStatusResponse = class _AdminSandBoxHostStatusResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.gatewayReachable = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSandBoxHostStatusResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSandBoxHostStatusResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSandBoxHostStatusResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSandBoxHostStatusResponse, a, b2);
      }
      static $() {
        return ["AdminSandBoxHostStatusResponse|1 gateway_reachable 8|2 host_version 9?|3 host_update_available 8?|4 latest_host_version 9?|5 is_busy 8?|6 last_busy_at_ms 3?"];
      }
    };
    AdminSnapshotSandBoxStoreRequest = class _AdminSnapshotSandBoxStoreRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSnapshotSandBoxStoreRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSnapshotSandBoxStoreRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSnapshotSandBoxStoreRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSnapshotSandBoxStoreRequest, a, b2);
      }
      static $() {
        return ["AdminSnapshotSandBoxStoreRequest|1 auth_id 9|2 flavor 9"];
      }
    };
    AdminSnapshotSandBoxStoreResponse = class _AdminSnapshotSandBoxStoreResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.ok = false;
        this.manifestEntries = protoInt64.zero;
        this.filesUploaded = protoInt64.zero;
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminSnapshotSandBoxStoreResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminSnapshotSandBoxStoreResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminSnapshotSandBoxStoreResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminSnapshotSandBoxStoreResponse, a, b2);
      }
      static $() {
        return ["AdminSnapshotSandBoxStoreResponse|1 ok 8|2 manifest_entries 3|3 files_uploaded 3|4 reason 9"];
      }
    };
    AdminListSandBoxStoreManifestVersionsRequest = class _AdminListSandBoxStoreManifestVersionsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.cursor = "";
        this.maxVersions = 0;
        this.parseLimit = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminListSandBoxStoreManifestVersionsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminListSandBoxStoreManifestVersionsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminListSandBoxStoreManifestVersionsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminListSandBoxStoreManifestVersionsRequest, a, b2);
      }
      static $() {
        return ["AdminListSandBoxStoreManifestVersionsRequest|1 auth_id 9|2 flavor 9|3 cursor 9|4 max_versions 5|5 parse_limit 5|6 before_timestamp_ms 3?"];
      }
    };
    SandBoxStoreManifestVersion = class _SandBoxStoreManifestVersion extends __protoMessage3142 {
      constructor(data) {
        super();
        this.versionId = "";
        this.lastModifiedMs = protoInt64.zero;
        this.sizeBytes = protoInt64.zero;
        this.isLatest = false;
        this.etag = "";
        this.parseError = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreManifestVersion().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreManifestVersion().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreManifestVersion().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreManifestVersion, a, b2);
      }
      static $() {
        return ["SandBoxStoreManifestVersion|1 version_id 9|2 last_modified_ms 3|3 size_bytes 3|4 is_latest 8|5 etag 9|6 entry_count 3?|7 total_bytes 3?|8 fully_hydrated 8?|9 parse_error 9"];
      }
    };
    AdminListSandBoxStoreManifestVersionsResponse = class _AdminListSandBoxStoreManifestVersionsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.storeId = "";
        this.versions = [];
        this.nextCursor = "";
        this.truncated = false;
        this.timeScanCapped = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminListSandBoxStoreManifestVersionsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminListSandBoxStoreManifestVersionsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminListSandBoxStoreManifestVersionsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminListSandBoxStoreManifestVersionsResponse, a, b2);
      }
      static $() {
        return ["AdminListSandBoxStoreManifestVersionsResponse|1 store_id 9|2 versions #0*|3 next_cursor 9|4 truncated 8|5 time_scan_capped 8", SandBoxStoreManifestVersion];
      }
    };
    AdminRestoreSandBoxStoreSnapshotRequest = class _AdminRestoreSandBoxStoreSnapshotRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.manifestVersionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminRestoreSandBoxStoreSnapshotRequest, a, b2);
      }
      static $() {
        return ["AdminRestoreSandBoxStoreSnapshotRequest|1 auth_id 9|2 flavor 9|3 manifest_version_id 9|4 expected_entry_count 3?"];
      }
    };
    AdminRestoreSandBoxStoreSnapshotResponse = class _AdminRestoreSandBoxStoreSnapshotResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.started = false;
        this.reason = "";
        this.operationId = "";
        this.currentEntryCount = protoInt64.zero;
        this.targetEntryCount = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminRestoreSandBoxStoreSnapshotResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminRestoreSandBoxStoreSnapshotResponse, a, b2);
      }
      static $() {
        return ["AdminRestoreSandBoxStoreSnapshotResponse|1 started 8|2 reason 9|3 operation_id 9|4 current_entry_count 3|5 target_entry_count 3"];
      }
    };
    AdminHibernateSandBoxRequest = class _AdminHibernateSandBoxRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.force = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminHibernateSandBoxRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminHibernateSandBoxRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminHibernateSandBoxRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminHibernateSandBoxRequest, a, b2);
      }
      static $() {
        return ["AdminHibernateSandBoxRequest|1 auth_id 9|2 flavor 9|3 force 8"];
      }
    };
    AdminHibernateSandBoxResponse = class _AdminHibernateSandBoxResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.started = false;
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminHibernateSandBoxResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminHibernateSandBoxResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminHibernateSandBoxResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminHibernateSandBoxResponse, a, b2);
      }
      static $() {
        return ["AdminHibernateSandBoxResponse|1 started 8|2 reason 9"];
      }
    };
    AdminListSandAgentsRequest = class _AdminListSandAgentsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminListSandAgentsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminListSandAgentsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminListSandAgentsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminListSandAgentsRequest, a, b2);
      }
      static $() {
        return ["AdminListSandAgentsRequest|1 auth_id 9|2 flavor 9"];
      }
    };
    AdminListSandAgentsResponse = class _AdminListSandAgentsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.reachable = false;
        this.agentsJson = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminListSandAgentsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminListSandAgentsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminListSandAgentsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminListSandAgentsResponse, a, b2);
      }
      static $() {
        return ["AdminListSandAgentsResponse|1 reachable 8|2 agents_json 9|3 reason 9"];
      }
    };
    AdminGetSandAgentTranscriptPageRequest = class _AdminGetSandAgentTranscriptPageRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.agentId = "";
        this.beforeSeq = protoInt64.zero;
        this.limit = 0;
        this.sinceMs = protoInt64.zero;
        this.untilMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminGetSandAgentTranscriptPageRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminGetSandAgentTranscriptPageRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminGetSandAgentTranscriptPageRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminGetSandAgentTranscriptPageRequest, a, b2);
      }
      static $() {
        return ["AdminGetSandAgentTranscriptPageRequest|1 auth_id 9|2 flavor 9|3 agent_id 9|4 before_seq 3|5 limit 13|6 since_ms 3|7 until_ms 3"];
      }
    };
    AdminGetSandAgentTranscriptPageResponse = class _AdminGetSandAgentTranscriptPageResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.reachable = false;
        this.entriesJson = "";
        this.reason = "";
        this.nextBeforeSeq = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminGetSandAgentTranscriptPageResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminGetSandAgentTranscriptPageResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminGetSandAgentTranscriptPageResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminGetSandAgentTranscriptPageResponse, a, b2);
      }
      static $() {
        return ["AdminGetSandAgentTranscriptPageResponse|1 reachable 8|2 entries_json 9|3 reason 9|4 next_before_seq 3"];
      }
    };
    WatchSandBoxMigrationRequest = class _WatchSandBoxMigrationRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.fromOffsetKey = "";
        this.includeFinished = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WatchSandBoxMigrationRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WatchSandBoxMigrationRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WatchSandBoxMigrationRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WatchSandBoxMigrationRequest, a, b2);
      }
      static $() {
        return ["WatchSandBoxMigrationRequest|1 from_offset_key 9|2 include_finished 8"];
      }
    };
    AdminWatchSandBoxMigrationRequest = class _AdminWatchSandBoxMigrationRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.authId = "";
        this.flavor = "";
        this.fromOffsetKey = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AdminWatchSandBoxMigrationRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AdminWatchSandBoxMigrationRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AdminWatchSandBoxMigrationRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AdminWatchSandBoxMigrationRequest, a, b2);
      }
      static $() {
        return ["AdminWatchSandBoxMigrationRequest|1 auth_id 9|2 flavor 9|3 from_offset_key 9"];
      }
    };
    SandBoxMigrationEvent = class _SandBoxMigrationEvent extends __protoMessage3142 {
      constructor(data) {
        super();
        this.phase = SandBoxMigrationPhase.UNSPECIFIED;
        this.detail = "";
        this.atMs = protoInt64.zero;
        this.offsetKey = "";
        this.operationId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxMigrationEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxMigrationEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxMigrationEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxMigrationEvent, a, b2);
      }
      static $() {
        return ["SandBoxMigrationEvent|1 phase #0|2 detail 9|3 at_ms 3|4 offset_key 9|5 operation_id 9", SandBoxMigrationPhase];
      }
    };
    GetSandBoxRunStateRequest = class _GetSandBoxRunStateRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSandBoxRunStateRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSandBoxRunStateRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSandBoxRunStateRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSandBoxRunStateRequest, a, b2);
      }
      static $() {
        return ["GetSandBoxRunStateRequest"];
      }
    };
    GetSandBoxRunStateResponse = class _GetSandBoxRunStateResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.state = SandBoxRunState.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSandBoxRunStateResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSandBoxRunStateResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSandBoxRunStateResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSandBoxRunStateResponse, a, b2);
      }
      static $() {
        return ["GetSandBoxRunStateResponse|1 state #0|2 image_update_available 8?", SandBoxRunState];
      }
    };
    SandBoxUpgradeSchedule = class _SandBoxUpgradeSchedule extends __protoMessage3142 {
      constructor(data) {
        super();
        this.timezone = "";
        this.localTime = "";
        this.recurring = false;
        this.state = SandBoxUpgradeScheduleState.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxUpgradeSchedule().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxUpgradeSchedule().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxUpgradeSchedule().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxUpgradeSchedule, a, b2);
      }
      static $() {
        return ["SandBoxUpgradeSchedule|1 timezone 9|2 local_time 9|3 recurring 8|4 target_image_tag 9?|5 next_fire_at_ms 3?|6 state #0|7 last_completed_image_tag 9?|8 failure_reason 9?", SandBoxUpgradeScheduleState];
      }
    };
    GetSandBoxUpgradeScheduleRequest = class _GetSandBoxUpgradeScheduleRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSandBoxUpgradeScheduleRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSandBoxUpgradeScheduleRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSandBoxUpgradeScheduleRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSandBoxUpgradeScheduleRequest, a, b2);
      }
      static $() {
        return ["GetSandBoxUpgradeScheduleRequest"];
      }
    };
    GetSandBoxUpgradeScheduleResponse = class _GetSandBoxUpgradeScheduleResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSandBoxUpgradeScheduleResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSandBoxUpgradeScheduleResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSandBoxUpgradeScheduleResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSandBoxUpgradeScheduleResponse, a, b2);
      }
      static $() {
        return ["GetSandBoxUpgradeScheduleResponse|1 schedule #0", SandBoxUpgradeSchedule];
      }
    };
    ScheduleSandBoxUpgradeRequest = class _ScheduleSandBoxUpgradeRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.timezone = "";
        this.localTime = "";
        this.recurring = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScheduleSandBoxUpgradeRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScheduleSandBoxUpgradeRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScheduleSandBoxUpgradeRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScheduleSandBoxUpgradeRequest, a, b2);
      }
      static $() {
        return ["ScheduleSandBoxUpgradeRequest|1 timezone 9|2 local_time 9|3 recurring 8"];
      }
    };
    ScheduleSandBoxUpgradeResponse = class _ScheduleSandBoxUpgradeResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScheduleSandBoxUpgradeResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScheduleSandBoxUpgradeResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScheduleSandBoxUpgradeResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScheduleSandBoxUpgradeResponse, a, b2);
      }
      static $() {
        return ["ScheduleSandBoxUpgradeResponse|1 schedule #0", SandBoxUpgradeSchedule];
      }
    };
    CancelSandBoxUpgradeRequest = class _CancelSandBoxUpgradeRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.dismissTerminalOutcome = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CancelSandBoxUpgradeRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CancelSandBoxUpgradeRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CancelSandBoxUpgradeRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CancelSandBoxUpgradeRequest, a, b2);
      }
      static $() {
        return ["CancelSandBoxUpgradeRequest|1 dismiss_terminal_outcome 8"];
      }
    };
    CancelSandBoxUpgradeResponse = class _CancelSandBoxUpgradeResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CancelSandBoxUpgradeResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CancelSandBoxUpgradeResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CancelSandBoxUpgradeResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CancelSandBoxUpgradeResponse, a, b2);
      }
      static $() {
        return ["CancelSandBoxUpgradeResponse|1 schedule #0", SandBoxUpgradeSchedule];
      }
    };
    RescheduleSandBoxUpgradeRequest = class _RescheduleSandBoxUpgradeRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.timezone = "";
        this.localTime = "";
        this.recurring = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RescheduleSandBoxUpgradeRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RescheduleSandBoxUpgradeRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RescheduleSandBoxUpgradeRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RescheduleSandBoxUpgradeRequest, a, b2);
      }
      static $() {
        return ["RescheduleSandBoxUpgradeRequest|1 timezone 9|2 local_time 9|3 recurring 8"];
      }
    };
    RescheduleSandBoxUpgradeResponse = class _RescheduleSandBoxUpgradeResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RescheduleSandBoxUpgradeResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RescheduleSandBoxUpgradeResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RescheduleSandBoxUpgradeResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RescheduleSandBoxUpgradeResponse, a, b2);
      }
      static $() {
        return ["RescheduleSandBoxUpgradeResponse|1 schedule #0", SandBoxUpgradeSchedule];
      }
    };
    SandBoxDescriptor = class _SandBoxDescriptor extends __protoMessage3142 {
      constructor(data) {
        super();
        this.running = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxDescriptor().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxDescriptor().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxDescriptor().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxDescriptor, a, b2);
      }
      static $() {
        return ["SandBoxDescriptor|2 running 8"];
      }
    };
    ListSandBoxesRequest = class _ListSandBoxesRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandBoxesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandBoxesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandBoxesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandBoxesRequest, a, b2);
      }
      static $() {
        return ["ListSandBoxesRequest"];
      }
    };
    ListSandBoxesResponse = class _ListSandBoxesResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.boxes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandBoxesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandBoxesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandBoxesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandBoxesResponse, a, b2);
      }
      static $() {
        return ["ListSandBoxesResponse|1 boxes #0*", SandBoxDescriptor];
      }
    };
    SandBoxStoreMultipartPart = class _SandBoxStoreMultipartPart extends __protoMessage3142 {
      constructor(data) {
        super();
        this.partNumber = 0;
        this.sizeBytes = protoInt64.zero;
        this.sha256 = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartPart().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartPart().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartPart().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartPart, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartPart|1 part_number 13|2 size_bytes 3|3 sha256 9"];
      }
    };
    SandBoxStoreWriteFile = class _SandBoxStoreWriteFile extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPath = "";
        this.sha256 = "";
        this.sizeBytes = protoInt64.zero;
        this.contentAddressed = false;
        this.ifMatchEtag = "";
        this.expectAbsent = false;
        this.multipartParts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreWriteFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreWriteFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreWriteFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreWriteFile, a, b2);
      }
      static $() {
        return ["SandBoxStoreWriteFile|1 rel_path 9|2 sha256 9|3 size_bytes 3|4 content_addressed 8|5 if_match_etag 9|6 expect_absent 8|7 multipart_parts #0*", SandBoxStoreMultipartPart];
      }
    };
    PresignSandBoxStoreWritesRequest = class _PresignSandBoxStoreWritesRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PresignSandBoxStoreWritesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PresignSandBoxStoreWritesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PresignSandBoxStoreWritesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PresignSandBoxStoreWritesRequest, a, b2);
      }
      static $() {
        return ["PresignSandBoxStoreWritesRequest|1 files #0*", SandBoxStoreWriteFile];
      }
    };
    SandBoxStoreMultipartUploadPartInstruction = class _SandBoxStoreMultipartUploadPartInstruction extends __protoMessage3142 {
      constructor(data) {
        super();
        this.partNumber = 0;
        this.url = "";
        this.headers = {};
        this.offsetBytes = protoInt64.zero;
        this.sizeBytes = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartUploadPartInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartUploadPartInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartUploadPartInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartUploadPartInstruction, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartUploadPartInstruction|1 part_number 13|2 url 9|3 headers 9,9|4 offset_bytes 3|5 size_bytes 3"];
      }
    };
    SandBoxStoreMultipartUploadContext = class _SandBoxStoreMultipartUploadContext extends __protoMessage3142 {
      constructor(data) {
        super();
        this.uploadId = "";
        this.relPath = "";
        this.sizeBytes = protoInt64.zero;
        this.sha256 = "";
        this.expectedPartCount = 0;
        this.partSha256s = [];
        this.precondition = { case: void 0 };
        this.sessionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartUploadContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartUploadContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartUploadContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartUploadContext, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartUploadContext|1 upload_id 9|2 rel_path 9|3 size_bytes 3|4 sha256 9|5 expected_part_count 13|6 part_sha256s 9*|7 if_match_etag 9 precondition|8 expect_absent 8 precondition|9 session_id 9"];
      }
    };
    SandBoxStoreMultipartWriteInstruction = class _SandBoxStoreMultipartWriteInstruction extends __protoMessage3142 {
      constructor(data) {
        super();
        this.parts = [];
        this.partUrlsExpiresAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartWriteInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartWriteInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartWriteInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartWriteInstruction, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartWriteInstruction|1 context #0|2 parts #1*|3 part_urls_expires_at_ms 3", SandBoxStoreMultipartUploadContext, SandBoxStoreMultipartUploadPartInstruction];
      }
    };
    SandBoxStoreWriteInstruction = class _SandBoxStoreWriteInstruction extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPath = "";
        this.url = "";
        this.headers = {};
        this.expiresAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreWriteInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreWriteInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreWriteInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreWriteInstruction, a, b2);
      }
      static $() {
        return ["SandBoxStoreWriteInstruction|1 rel_path 9|2 url 9|3 headers 9,9|4 expires_at_ms 3|5 multipart #0?", SandBoxStoreMultipartWriteInstruction];
      }
    };
    PresignSandBoxStoreWritesResponse = class _PresignSandBoxStoreWritesResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.instructions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PresignSandBoxStoreWritesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PresignSandBoxStoreWritesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PresignSandBoxStoreWritesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PresignSandBoxStoreWritesResponse, a, b2);
      }
      static $() {
        return ["PresignSandBoxStoreWritesResponse|1 instructions #0*", SandBoxStoreWriteInstruction];
      }
    };
    SandBoxStoreMultipartUploadedPart = class _SandBoxStoreMultipartUploadedPart extends __protoMessage3142 {
      constructor(data) {
        super();
        this.partNumber = 0;
        this.etag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartUploadedPart().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartUploadedPart().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartUploadedPart().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartUploadedPart, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartUploadedPart|1 part_number 13|2 etag 9"];
      }
    };
    SandBoxStoreMultipartWriteCompletion = class _SandBoxStoreMultipartWriteCompletion extends __protoMessage3142 {
      constructor(data) {
        super();
        this.parts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartWriteCompletion().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartWriteCompletion().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartWriteCompletion().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartWriteCompletion, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartWriteCompletion|1 context #0|2 parts #1*", SandBoxStoreMultipartUploadContext, SandBoxStoreMultipartUploadedPart];
      }
    };
    CompleteSandBoxStoreMultipartWritesRequest = class _CompleteSandBoxStoreMultipartWritesRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.completions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CompleteSandBoxStoreMultipartWritesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CompleteSandBoxStoreMultipartWritesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CompleteSandBoxStoreMultipartWritesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CompleteSandBoxStoreMultipartWritesRequest, a, b2);
      }
      static $() {
        return ["CompleteSandBoxStoreMultipartWritesRequest|1 completions #0*", SandBoxStoreMultipartWriteCompletion];
      }
    };
    SandBoxStoreMultipartWriteSuccess = class _SandBoxStoreMultipartWriteSuccess extends __protoMessage3142 {
      constructor(data) {
        super();
        this.etag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartWriteSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartWriteSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartWriteSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartWriteSuccess, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartWriteSuccess|1 etag 9"];
      }
    };
    SandBoxStoreMultipartOperationFailure = class _SandBoxStoreMultipartOperationFailure extends __protoMessage3142 {
      constructor(data) {
        super();
        this.code = SandBoxStoreMultipartOperationFailureCode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartOperationFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartOperationFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartOperationFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartOperationFailure, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartOperationFailure|1 code #0", SandBoxStoreMultipartOperationFailureCode];
      }
    };
    SandBoxStoreMultipartWriteResult = class _SandBoxStoreMultipartWriteResult extends __protoMessage3142 {
      constructor(data) {
        super();
        this.inputIndex = 0;
        this.relPath = "";
        this.outcome = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartWriteResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartWriteResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartWriteResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartWriteResult, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartWriteResult|1 input_index 13|2 rel_path 9|3 success #0 outcome|4 failure #1 outcome", SandBoxStoreMultipartWriteSuccess, SandBoxStoreMultipartOperationFailure];
      }
    };
    CompleteSandBoxStoreMultipartWritesResponse = class _CompleteSandBoxStoreMultipartWritesResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CompleteSandBoxStoreMultipartWritesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CompleteSandBoxStoreMultipartWritesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CompleteSandBoxStoreMultipartWritesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CompleteSandBoxStoreMultipartWritesResponse, a, b2);
      }
      static $() {
        return ["CompleteSandBoxStoreMultipartWritesResponse|1 results #0*", SandBoxStoreMultipartWriteResult];
      }
    };
    CommitSandBoxStoreManifestRequest = class _CommitSandBoxStoreManifestRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.manifest = new Uint8Array(0);
        this.baseEtag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommitSandBoxStoreManifestRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommitSandBoxStoreManifestRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommitSandBoxStoreManifestRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommitSandBoxStoreManifestRequest, a, b2);
      }
      static $() {
        return ["CommitSandBoxStoreManifestRequest|1 manifest 12|2 base_etag 9"];
      }
    };
    CommitSandBoxStoreManifestResponse = class _CommitSandBoxStoreManifestResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.status = SandBoxStoreManifestCommitStatus.UNSPECIFIED;
        this.etag = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommitSandBoxStoreManifestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommitSandBoxStoreManifestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommitSandBoxStoreManifestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommitSandBoxStoreManifestResponse, a, b2);
      }
      static $() {
        return ["CommitSandBoxStoreManifestResponse|1 status #0|2 etag 9", SandBoxStoreManifestCommitStatus];
      }
    };
    SandBoxStoreMultipartWriteAbort = class _SandBoxStoreMultipartWriteAbort extends __protoMessage3142 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartWriteAbort().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartWriteAbort().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartWriteAbort().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartWriteAbort, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartWriteAbort|1 context #0", SandBoxStoreMultipartUploadContext];
      }
    };
    AbortSandBoxStoreMultipartWritesRequest = class _AbortSandBoxStoreMultipartWritesRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.uploads = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AbortSandBoxStoreMultipartWritesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AbortSandBoxStoreMultipartWritesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AbortSandBoxStoreMultipartWritesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AbortSandBoxStoreMultipartWritesRequest, a, b2);
      }
      static $() {
        return ["AbortSandBoxStoreMultipartWritesRequest|1 uploads #0*", SandBoxStoreMultipartWriteAbort];
      }
    };
    SandBoxStoreMultipartAbortSuccess = class _SandBoxStoreMultipartAbortSuccess extends __protoMessage3142 {
      constructor(data) {
        super();
        this.alreadyFinished = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartAbortSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartAbortSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartAbortSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartAbortSuccess, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartAbortSuccess|1 already_finished 8"];
      }
    };
    SandBoxStoreMultipartAbortResult = class _SandBoxStoreMultipartAbortResult extends __protoMessage3142 {
      constructor(data) {
        super();
        this.inputIndex = 0;
        this.relPath = "";
        this.outcome = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreMultipartAbortResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreMultipartAbortResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreMultipartAbortResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreMultipartAbortResult, a, b2);
      }
      static $() {
        return ["SandBoxStoreMultipartAbortResult|1 input_index 13|2 rel_path 9|3 success #0 outcome|4 failure #1 outcome", SandBoxStoreMultipartAbortSuccess, SandBoxStoreMultipartOperationFailure];
      }
    };
    AbortSandBoxStoreMultipartWritesResponse = class _AbortSandBoxStoreMultipartWritesResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AbortSandBoxStoreMultipartWritesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AbortSandBoxStoreMultipartWritesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AbortSandBoxStoreMultipartWritesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AbortSandBoxStoreMultipartWritesResponse, a, b2);
      }
      static $() {
        return ["AbortSandBoxStoreMultipartWritesResponse|1 results #0*", SandBoxStoreMultipartAbortResult];
      }
    };
    PresignSandBoxStoreReadsRequest = class _PresignSandBoxStoreReadsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PresignSandBoxStoreReadsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PresignSandBoxStoreReadsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PresignSandBoxStoreReadsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PresignSandBoxStoreReadsRequest, a, b2);
      }
      static $() {
        return ["PresignSandBoxStoreReadsRequest|1 rel_paths 9*"];
      }
    };
    SandBoxStoreReadInstruction = class _SandBoxStoreReadInstruction extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPath = "";
        this.url = "";
        this.expiresAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreReadInstruction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreReadInstruction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreReadInstruction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreReadInstruction, a, b2);
      }
      static $() {
        return ["SandBoxStoreReadInstruction|1 rel_path 9|2 url 9|3 expires_at_ms 3"];
      }
    };
    PresignSandBoxStoreReadsResponse = class _PresignSandBoxStoreReadsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.instructions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PresignSandBoxStoreReadsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PresignSandBoxStoreReadsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PresignSandBoxStoreReadsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PresignSandBoxStoreReadsResponse, a, b2);
      }
      static $() {
        return ["PresignSandBoxStoreReadsResponse|1 instructions #0*", SandBoxStoreReadInstruction];
      }
    };
    StatSandBoxStoreObjectRequest = class _StatSandBoxStoreObjectRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StatSandBoxStoreObjectRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StatSandBoxStoreObjectRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StatSandBoxStoreObjectRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StatSandBoxStoreObjectRequest, a, b2);
      }
      static $() {
        return ["StatSandBoxStoreObjectRequest|1 rel_path 9"];
      }
    };
    StatSandBoxStoreObjectResponse = class _StatSandBoxStoreObjectResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.exists = false;
        this.etag = "";
        this.sizeBytes = protoInt64.zero;
        this.lastModifiedMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StatSandBoxStoreObjectResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StatSandBoxStoreObjectResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StatSandBoxStoreObjectResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StatSandBoxStoreObjectResponse, a, b2);
      }
      static $() {
        return ["StatSandBoxStoreObjectResponse|1 exists 8|2 etag 9|3 size_bytes 3|4 last_modified_ms 3"];
      }
    };
    ListSandBoxStoreObjectsRequest = class _ListSandBoxStoreObjectsRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.prefix = "";
        this.cursor = "";
        this.maxEntries = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandBoxStoreObjectsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandBoxStoreObjectsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandBoxStoreObjectsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandBoxStoreObjectsRequest, a, b2);
      }
      static $() {
        return ["ListSandBoxStoreObjectsRequest|1 prefix 9|2 cursor 9|3 max_entries 5"];
      }
    };
    SandBoxStoreObjectEntry = class _SandBoxStoreObjectEntry extends __protoMessage3142 {
      constructor(data) {
        super();
        this.relPath = "";
        this.etag = "";
        this.sizeBytes = protoInt64.zero;
        this.lastModifiedMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandBoxStoreObjectEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandBoxStoreObjectEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandBoxStoreObjectEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandBoxStoreObjectEntry, a, b2);
      }
      static $() {
        return ["SandBoxStoreObjectEntry|1 rel_path 9|2 etag 9|3 size_bytes 3|4 last_modified_ms 3"];
      }
    };
    ListSandBoxStoreObjectsResponse = class _ListSandBoxStoreObjectsResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.entries = [];
        this.nextCursor = "";
        this.truncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListSandBoxStoreObjectsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListSandBoxStoreObjectsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListSandBoxStoreObjectsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListSandBoxStoreObjectsResponse, a, b2);
      }
      static $() {
        return ["ListSandBoxStoreObjectsResponse|1 entries #0*|2 next_cursor 9|3 truncated 8", SandBoxStoreObjectEntry];
      }
    };
    MintSandVoiceCallSecretRequest = class _MintSandVoiceCallSecretRequest extends __protoMessage3142 {
      constructor(data) {
        super();
        this.model = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MintSandVoiceCallSecretRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MintSandVoiceCallSecretRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MintSandVoiceCallSecretRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MintSandVoiceCallSecretRequest, a, b2);
      }
      static $() {
        return ["MintSandVoiceCallSecretRequest|1 model 9"];
      }
    };
    MintSandVoiceCallSecretResponse = class _MintSandVoiceCallSecretResponse extends __protoMessage3142 {
      constructor(data) {
        super();
        this.clientSecret = "";
        this.expiresAtUnixSeconds = protoInt64.zero;
        this.model = "";
        this.websocketUrl = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MintSandVoiceCallSecretResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MintSandVoiceCallSecretResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MintSandVoiceCallSecretResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MintSandVoiceCallSecretResponse, a, b2);
      }
      static $() {
        return ["MintSandVoiceCallSecretResponse|1 client_secret 9|2 expires_at_unix_seconds 3|3 model 9|4 websocket_url 9"];
      }
    };
  }
});
