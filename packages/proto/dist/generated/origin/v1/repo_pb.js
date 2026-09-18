init_esm();
init_compact();
var __protoPackage158 = "origin.v1.";
var __protoMessage3150 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage158;
  }
};
var ListHostedReposOrderBy = /* @__PURE__ */ enumType(proto3, __protoPackage158, "ListHostedReposOrderBy", [[0, "UNSPECIFIED"], [1, "NAME_ASC"], [2, "NAME_DESC"], [3, "LAST_PUSHED_DESC"], [4, "LAST_PUSHED_ASC"], [5, "ID_ASC"], [6, "ID_DESC"]], 1);
var RepoKind = /* @__PURE__ */ enumType(proto3, __protoPackage158, "RepoKind", [[0, "UNSPECIFIED"], [1, "STANDARD"], [2, "CURSOR_MARKETPLACE"], [3, "ORIGIN_NATIVE_CURSOR_MARKETPLACE"], [4, "AGENT_TEMP"]], 1);
var RepoVisibility = /* @__PURE__ */ enumType(proto3, __protoPackage158, "RepoVisibility", [[0, "UNSPECIFIED"], [1, "INTERNAL"], [2, "PRIVATE"]], 1);
var RepoMirrorTransition = /* @__PURE__ */ enumType(proto3, __protoPackage158, "RepoMirrorTransition", [[0, "UNSPECIFIED"], [1, "INBOUND_TO_OUTBOUND"], [2, "OUTBOUND_TO_INBOUND"], [3, "INITIAL_TO_INBOUND"]], 1);
var RepoMirrorTransitionJobStatus = /* @__PURE__ */ enumType(proto3, __protoPackage158, "RepoMirrorTransitionJobStatus", [[0, "UNSPECIFIED"], [1, "QUEUED"], [2, "RUNNING"], [3, "SUCCEEDED"], [4, "FAILED_ROLLED_BACK"], [5, "REQUIRES_ATTENTION"], [6, "SUPERSEDED"]], 1);
var RepoMirrorTransitionJobPhase = /* @__PURE__ */ enumType(proto3, __protoPackage158, "RepoMirrorTransitionJobPhase", [[0, "UNSPECIFIED"], [1, "QUEUED"], [2, "STARTING"], [3, "DRAINING_WRITES"], [4, "FINALIZING_MIRROR_FETCH"], [5, "FINALIZING_MIRROR_PUSH"], [6, "COMMITTING_TARGET_STATUS"], [7, "ROLLING_BACK"], [8, "COMPLETED"], [9, "INITIALIZING_MIRROR_FETCH"], [10, "ENABLING_GITHUB_FENCE"], [11, "VERIFYING_INTEGRITY"], [12, "REOPENING_INBOUND_MIRROR"], [13, "SNAPSHOTTING_REFS"]], 1);
var MirrorStatus = /* @__PURE__ */ enumType(proto3, __protoPackage158, "MirrorStatus", [[0, "UNSPECIFIED"], [1, "TRANSITIONING_TO_INBOUND"], [2, "INBOUND"], [3, "OUTBOUND"], [4, "TRANSITIONING_INBOUND_TO_OUTBOUND"], [5, "TRANSITIONING_OUTBOUND_TO_INBOUND"], [6, "INITIAL_SYNC_PENDING"]], 1);
var OriginNamespaceOwnerType = /* @__PURE__ */ enumType(proto3, __protoPackage158, "OriginNamespaceOwnerType", [[0, "UNSPECIFIED"], [1, "TEAM"], [2, "USER"]], 1);
var AuthorizedNamespaceAccessReason = /* @__PURE__ */ enumType(proto3, __protoPackage158, "AuthorizedNamespaceAccessReason", [[0, "UNSPECIFIED"], [1, "TEAM_OWNERSHIP"], [2, "USER_OWNERSHIP"], [3, "EXPLICIT_GRANT"]], 1);
var RepoSummary = class _RepoSummary extends __protoMessage3150 {
  constructor(data) {
    super();
    this.org = "";
    this.name = "";
    this.cloneUrl = "";
    this.defaultBranch = "";
    this.repoUuid = "";
    this.mirrorStatus = MirrorStatus.UNSPECIFIED;
    this.forgeEnvironment = "";
    this.originNamespaceId = "";
    this.allowMergeCommit = false;
    this.allowSquashMerge = false;
    this.visibility = RepoVisibility.UNSPECIFIED;
    this.repoKind = RepoKind.UNSPECIFIED;
    this.deleteBranchOnMerge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoSummary, a, b2);
  }
  static $() {
    return ["RepoSummary|1 org 9|2 name 9|3 clone_url 9|4 default_branch 9|6 github_node_id 9?|7 github_enterprise_id 9?|8 repo_uuid 9|9 mirror_status #0|10 last_pushed_at #1?|11 forge_environment 9|12 origin_namespace_id 9|13 allow_merge_commit 8|14 allow_squash_merge 8|15 visibility #2|16 github_mirror_info #3?|17 deleted_at #1?|18 repo_kind #4|19 owner_type 9?|20 delete_branch_on_merge 8|21 created_at #1?|22 updated_at #1?|23 github_installation_id 4?", MirrorStatus, Timestamp, RepoVisibility, RepoGithubMirrorInfo, RepoKind];
  }
};
var ListHostedReposRequest = class _ListHostedReposRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.pageSize = 0;
    this.pageToken = "";
    this.search = "";
    this.orderBy = ListHostedReposOrderBy.UNSPECIFIED;
    this.namespace = "";
    this.includeGithubMirrorInfo = false;
    this.applyRepositoryPickerPolicy = false;
    this.includeExternalCollaboratorRepos = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListHostedReposRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListHostedReposRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListHostedReposRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListHostedReposRequest, a, b2);
  }
  static $() {
    return ["ListHostedReposRequest|1 page_size 13|2 page_token 9|3 search 9|4 order_by #0|5 namespace 9|6 include_github_mirror_info 8|7 apply_repository_picker_policy 8|8 include_external_collaborator_repos 8", ListHostedReposOrderBy];
  }
};
var ListHostedReposResponse = class _ListHostedReposResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.repositories = [];
    this.nextPageToken = "";
    this.totalCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListHostedReposResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListHostedReposResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListHostedReposResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListHostedReposResponse, a, b2);
  }
  static $() {
    return ["ListHostedReposResponse|1 repositories #0*|2 next_page_token 9|3 total_count 13", RepoSummary];
  }
};
var ListReposForAppInstallRequest = class _ListReposForAppInstallRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.namespace = "";
    this.pageSize = 0;
    this.pageToken = "";
    this.search = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReposForAppInstallRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReposForAppInstallRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReposForAppInstallRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReposForAppInstallRequest, a, b2);
  }
  static $() {
    return ["ListReposForAppInstallRequest|1 namespace 9|2 page_size 13|3 page_token 9|4 search 9"];
  }
};
var CreateRepoRequest = class _CreateRepoRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoRequest, a, b2);
  }
  static $() {
    return ["CreateRepoRequest|1 identifier #0|2 default_branch 9?|6 forge_environment 9?|7 repo_kind #1?|8 visibility #2?", ClientRepoIdentifier, RepoKind, RepoVisibility];
  }
};
var CreateRepoResponse = class _CreateRepoResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoResponse, a, b2);
  }
  static $() {
    return ["CreateRepoResponse|3 repository #0", Repo];
  }
};
var PublishAgentTempRepoRequest = class _PublishAgentTempRepoRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishAgentTempRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishAgentTempRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishAgentTempRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishAgentTempRepoRequest, a, b2);
  }
  static $() {
    return ["PublishAgentTempRepoRequest|1 identifier #0|2 new_name 9?|3 visibility #1?", ClientRepoIdentifier, RepoVisibility];
  }
};
var PublishAgentTempRepoResponse = class _PublishAgentTempRepoResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.published = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PublishAgentTempRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PublishAgentTempRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PublishAgentTempRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PublishAgentTempRepoResponse, a, b2);
  }
  static $() {
    return ["PublishAgentTempRepoResponse|1 published 8|2 repository #0", Repo];
  }
};
var CreateMirroredRepoRequest = class _CreateMirroredRepoRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.targetNamespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateMirroredRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateMirroredRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateMirroredRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateMirroredRepoRequest, a, b2);
  }
  static $() {
    return ["CreateMirroredRepoRequest|1 github_source #0|2 target_namespace 9|3 forge_environment 9?|4 repo_kind #1?|6 github_installation_id 3?", GithubRepoIdentifier, RepoKind];
  }
};
var FilterMirrorableGithubReposRequest = class _FilterMirrorableGithubReposRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FilterMirrorableGithubReposRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FilterMirrorableGithubReposRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FilterMirrorableGithubReposRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FilterMirrorableGithubReposRequest, a, b2);
  }
  static $() {
    return ["FilterMirrorableGithubReposRequest|1 repos #0*|2 org_admin_only 8?", GithubRepoIdentifier];
  }
};
var FilterMirrorableGithubReposResponse = class _FilterMirrorableGithubReposResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.mirrorableRepos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FilterMirrorableGithubReposResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FilterMirrorableGithubReposResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FilterMirrorableGithubReposResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FilterMirrorableGithubReposResponse, a, b2);
  }
  static $() {
    return ["FilterMirrorableGithubReposResponse|1 mirrorable_repos #0*", GithubRepoIdentifier];
  }
};
var DetachRepoMirrorRequest = class _DetachRepoMirrorRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DetachRepoMirrorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DetachRepoMirrorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DetachRepoMirrorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DetachRepoMirrorRequest, a, b2);
  }
  static $() {
    return ["DetachRepoMirrorRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var DetachRepoMirrorResponse = class _DetachRepoMirrorResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DetachRepoMirrorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DetachRepoMirrorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DetachRepoMirrorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DetachRepoMirrorResponse, a, b2);
  }
  static $() {
    return ["DetachRepoMirrorResponse"];
  }
};
var ReattachRepoMirrorRequest = class _ReattachRepoMirrorRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.dryRun = false;
    this.allowOverwrite = false;
    this.waitForCatchUp = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReattachRepoMirrorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReattachRepoMirrorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReattachRepoMirrorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReattachRepoMirrorRequest, a, b2);
  }
  static $() {
    return ["ReattachRepoMirrorRequest|1 identifier #0|2 dry_run 8|3 allow_overwrite 8|4 wait_for_catch_up 8", ClientRepoIdentifier];
  }
};
var MirrorRefComparison = class _MirrorRefComparison extends __protoMessage3150 {
  constructor(data) {
    super();
    this.inSync = false;
    this.totalMismatches = 0;
    this.localRefCount = 0;
    this.remoteRefCount = 0;
    this.divergedRefs = [];
    this.divergedRefCount = 0;
    this.sampleComplete = false;
    this.sampledMismatchCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MirrorRefComparison().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MirrorRefComparison().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MirrorRefComparison().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MirrorRefComparison, a, b2);
  }
  static $() {
    return ["MirrorRefComparison|1 in_sync 8|2 total_mismatches 5|3 local_ref_count 5|4 remote_ref_count 5|5 diverged_refs 9*|6 diverged_ref_count 5|7 sample_complete 8|8 sampled_mismatch_count 5"];
  }
};
var ReattachRepoMirrorResponse = class _ReattachRepoMirrorResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.deployKeyPresent = false;
    this.catchUpDispatched = false;
    this.catchUpCompleted = false;
    this.githubStateSkipped = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReattachRepoMirrorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReattachRepoMirrorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReattachRepoMirrorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReattachRepoMirrorResponse, a, b2);
  }
  static $() {
    return ["ReattachRepoMirrorResponse|1 repository #0|2 github_state #1|3 deploy_key_present 8|4 catch_up_dispatched 8|5 catch_up_completed 8|6 catch_up_error 9?|7 github_state_skipped 8", Repo, MirrorRefComparison];
  }
};
var RepoMirrorDeployKeyInfo = class _RepoMirrorDeployKeyInfo extends __protoMessage3150 {
  constructor(data) {
    super();
    this.publicKeyOpenssh = "";
    this.fingerprintSha256 = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoMirrorDeployKeyInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoMirrorDeployKeyInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoMirrorDeployKeyInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoMirrorDeployKeyInfo, a, b2);
  }
  static $() {
    return ["RepoMirrorDeployKeyInfo|1 public_key_openssh 9|2 fingerprint_sha256 9|3 created_at #0|4 updated_at #0", Timestamp];
  }
};
var CreateRepoMirrorDeployKeyRequest = class _CreateRepoMirrorDeployKeyRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.rotate = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoMirrorDeployKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoMirrorDeployKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoMirrorDeployKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoMirrorDeployKeyRequest, a, b2);
  }
  static $() {
    return ["CreateRepoMirrorDeployKeyRequest|1 identifier #0|2 rotate 8", ClientRepoIdentifier];
  }
};
var CreateRepoMirrorDeployKeyResponse = class _CreateRepoMirrorDeployKeyResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoMirrorDeployKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoMirrorDeployKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoMirrorDeployKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoMirrorDeployKeyResponse, a, b2);
  }
  static $() {
    return ["CreateRepoMirrorDeployKeyResponse|1 deploy_key #0", RepoMirrorDeployKeyInfo];
  }
};
var GetRepoMirrorDeployKeyRequest = class _GetRepoMirrorDeployKeyRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoMirrorDeployKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoMirrorDeployKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoMirrorDeployKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoMirrorDeployKeyRequest, a, b2);
  }
  static $() {
    return ["GetRepoMirrorDeployKeyRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var GetRepoMirrorDeployKeyResponse = class _GetRepoMirrorDeployKeyResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoMirrorDeployKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoMirrorDeployKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoMirrorDeployKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoMirrorDeployKeyResponse, a, b2);
  }
  static $() {
    return ["GetRepoMirrorDeployKeyResponse|1 deploy_key #0?", RepoMirrorDeployKeyInfo];
  }
};
var DeleteRepoMirrorDeployKeyRequest = class _DeleteRepoMirrorDeployKeyRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRepoMirrorDeployKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRepoMirrorDeployKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRepoMirrorDeployKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRepoMirrorDeployKeyRequest, a, b2);
  }
  static $() {
    return ["DeleteRepoMirrorDeployKeyRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var DeleteRepoMirrorDeployKeyResponse = class _DeleteRepoMirrorDeployKeyResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.deleted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRepoMirrorDeployKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRepoMirrorDeployKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRepoMirrorDeployKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRepoMirrorDeployKeyResponse, a, b2);
  }
  static $() {
    return ["DeleteRepoMirrorDeployKeyResponse|1 deleted 8"];
  }
};
var TransitionRepoMirrorStatusRequest = class _TransitionRepoMirrorStatusRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.transition = RepoMirrorTransition.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TransitionRepoMirrorStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TransitionRepoMirrorStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TransitionRepoMirrorStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TransitionRepoMirrorStatusRequest, a, b2);
  }
  static $() {
    return ["TransitionRepoMirrorStatusRequest|1 identifier #0|2 transition #1", ClientRepoIdentifier, RepoMirrorTransition];
  }
};
var TransitionRepoMirrorStatusResponse = class _TransitionRepoMirrorStatusResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TransitionRepoMirrorStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TransitionRepoMirrorStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TransitionRepoMirrorStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TransitionRepoMirrorStatusResponse, a, b2);
  }
  static $() {
    return ["TransitionRepoMirrorStatusResponse|1 repository #0|2 active_job_info #1", Repo, RepoMirrorTransitionJob];
  }
};
var ForceRepoMirrorCutoverRequest = class _ForceRepoMirrorCutoverRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ForceRepoMirrorCutoverRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ForceRepoMirrorCutoverRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ForceRepoMirrorCutoverRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ForceRepoMirrorCutoverRequest, a, b2);
  }
  static $() {
    return ["ForceRepoMirrorCutoverRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var ForceRepoMirrorCutoverResponse = class _ForceRepoMirrorCutoverResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ForceRepoMirrorCutoverResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ForceRepoMirrorCutoverResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ForceRepoMirrorCutoverResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ForceRepoMirrorCutoverResponse, a, b2);
  }
  static $() {
    return ["ForceRepoMirrorCutoverResponse|1 repository #0|2 active_job_info #1", Repo, RepoMirrorTransitionJob];
  }
};
var SyncMirrorRequest = class _SyncMirrorRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.ref = "";
    this.wait = false;
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SyncMirrorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SyncMirrorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SyncMirrorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SyncMirrorRequest, a, b2);
  }
  static $() {
    return ["SyncMirrorRequest|1 identifier #0|2 ref 9|3 wait 8|4 sha 9", ClientRepoIdentifier];
  }
};
var SyncMirrorResponse = class _SyncMirrorResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.synced = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SyncMirrorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SyncMirrorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SyncMirrorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SyncMirrorResponse, a, b2);
  }
  static $() {
    return ["SyncMirrorResponse|1 synced 8"];
  }
};
var GetActiveMirrorTransitionJobRequest = class _GetActiveMirrorTransitionJobRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetActiveMirrorTransitionJobRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetActiveMirrorTransitionJobRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetActiveMirrorTransitionJobRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetActiveMirrorTransitionJobRequest, a, b2);
  }
  static $() {
    return ["GetActiveMirrorTransitionJobRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var GetActiveMirrorTransitionJobResponse = class _GetActiveMirrorTransitionJobResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetActiveMirrorTransitionJobResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetActiveMirrorTransitionJobResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetActiveMirrorTransitionJobResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetActiveMirrorTransitionJobResponse, a, b2);
  }
  static $() {
    return ["GetActiveMirrorTransitionJobResponse|1 active_job_info #0|2 last_job_info #0", RepoMirrorTransitionJob];
  }
};
var GetMirrorTransitionJobRequest = class _GetMirrorTransitionJobRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.jobId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMirrorTransitionJobRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMirrorTransitionJobRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMirrorTransitionJobRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMirrorTransitionJobRequest, a, b2);
  }
  static $() {
    return ["GetMirrorTransitionJobRequest|1 identifier #0|2 job_id 9", ClientRepoIdentifier];
  }
};
var GetMirrorTransitionJobResponse = class _GetMirrorTransitionJobResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMirrorTransitionJobResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMirrorTransitionJobResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMirrorTransitionJobResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMirrorTransitionJobResponse, a, b2);
  }
  static $() {
    return ["GetMirrorTransitionJobResponse|1 job #0|2 repository #1", RepoMirrorTransitionJob, Repo];
  }
};
var MirrorFetchProgress = class _MirrorFetchProgress extends __protoMessage3150 {
  constructor(data) {
    super();
    this.subphase = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MirrorFetchProgress().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MirrorFetchProgress().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MirrorFetchProgress().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MirrorFetchProgress, a, b2);
  }
  static $() {
    return ["MirrorFetchProgress|1 subphase 9|2 bytes_received 4?|3 heartbeat_at #0?", Timestamp];
  }
};
var RepoMirrorTransitionJob = class _RepoMirrorTransitionJob extends __protoMessage3150 {
  constructor(data) {
    super();
    this.id = "";
    this.transition = RepoMirrorTransition.UNSPECIFIED;
    this.mirrorStatus = MirrorStatus.UNSPECIFIED;
    this.status = RepoMirrorTransitionJobStatus.UNSPECIFIED;
    this.phase = RepoMirrorTransitionJobPhase.UNSPECIFIED;
    this.attemptCount = 0;
    this.createdAt = "";
    this.updatedAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoMirrorTransitionJob().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoMirrorTransitionJob().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoMirrorTransitionJob().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoMirrorTransitionJob, a, b2);
  }
  static $() {
    return ["RepoMirrorTransitionJob|1 id 9|2 identifier #0|3 transition #1|4 mirror_status #2|5 status #3|6 phase #4|7 attempt_count 13|11 drain_until 9?|12 last_error_code 9?|13 last_error_message 9?|15 started_at 9?|16 completed_at 9?|17 created_at 9|18 updated_at 9|19 fetch_progress #5?", ClientRepoIdentifier, RepoMirrorTransition, MirrorStatus, RepoMirrorTransitionJobStatus, RepoMirrorTransitionJobPhase, MirrorFetchProgress];
  }
};
var DeleteRepoClientRequest = class _DeleteRepoClientRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRepoClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRepoClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRepoClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRepoClientRequest, a, b2);
  }
  static $() {
    return ["DeleteRepoClientRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var DeleteRepoClientResponse = class _DeleteRepoClientResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.repoUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRepoClientResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRepoClientResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRepoClientResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRepoClientResponse, a, b2);
  }
  static $() {
    return ["DeleteRepoClientResponse|1 repo_uuid 9"];
  }
};
var DeleteMirroredRepoRequest = class _DeleteMirroredRepoRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteMirroredRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteMirroredRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteMirroredRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteMirroredRepoRequest, a, b2);
  }
  static $() {
    return ["DeleteMirroredRepoRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var DeleteMirroredRepoResponse = class _DeleteMirroredRepoResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.repoUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteMirroredRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteMirroredRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteMirroredRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteMirroredRepoResponse, a, b2);
  }
  static $() {
    return ["DeleteMirroredRepoResponse|1 repo_uuid 9"];
  }
};
var Repo = class _Repo extends __protoMessage3150 {
  constructor(data) {
    super();
    this.defaultBranch = "";
    this.mirrorStatus = MirrorStatus.UNSPECIFIED;
    this.repoUuid = "";
    this.forgeEnvironment = "";
    this.originNamespaceId = "";
    this.allowMergeCommit = false;
    this.allowSquashMerge = false;
    this.visibility = RepoVisibility.UNSPECIFIED;
    this.deleteBranchOnMerge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Repo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Repo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Repo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Repo, a, b2);
  }
  static $() {
    return ["Repo|1 identifier #0|2 default_branch 9|4 github_node_id 9?|5 github_enterprise_id 9?|6 mirror_status #1|7 active_mirror_transition_job_id 9?|8 repo_uuid 9|9 github_installation_id 4?|10 created_at #2?|11 updated_at #2?|12 last_pushed_at #2?|13 owner_entity_id 3?|14 owner_type 9?|15 forge_environment 9|16 origin_namespace_id 9|17 allow_merge_commit 8|18 allow_squash_merge 8|19 visibility #3|20 delete_branch_on_merge 8|21 deleted_at #2?", ClientRepoIdentifier, MirrorStatus, Timestamp, RepoVisibility];
  }
};
var UpdateRepoMergeSettingsRequest = class _UpdateRepoMergeSettingsRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.allowMergeCommit = false;
    this.allowSquashMerge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoMergeSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoMergeSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoMergeSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoMergeSettingsRequest, a, b2);
  }
  static $() {
    return ["UpdateRepoMergeSettingsRequest|1 identifier #0|2 allow_merge_commit 8|3 allow_squash_merge 8", ClientRepoIdentifier];
  }
};
var UpdateRepoMergeSettingsResponse = class _UpdateRepoMergeSettingsResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoMergeSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoMergeSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoMergeSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoMergeSettingsResponse, a, b2);
  }
  static $() {
    return ["UpdateRepoMergeSettingsResponse|1 repository #0", Repo];
  }
};
var UpdateRepoBranchDeletionSettingRequest = class _UpdateRepoBranchDeletionSettingRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoBranchDeletionSettingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoBranchDeletionSettingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoBranchDeletionSettingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoBranchDeletionSettingRequest, a, b2);
  }
  static $() {
    return ["UpdateRepoBranchDeletionSettingRequest|1 identifier #0|2 delete_branch_on_merge 8?", ClientRepoIdentifier];
  }
};
var UpdateRepoBranchDeletionSettingResponse = class _UpdateRepoBranchDeletionSettingResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoBranchDeletionSettingResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoBranchDeletionSettingResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoBranchDeletionSettingResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoBranchDeletionSettingResponse, a, b2);
  }
  static $() {
    return ["UpdateRepoBranchDeletionSettingResponse|1 repository #0", Repo];
  }
};
var ListRepoCloneKitsRequest = class _ListRepoCloneKitsRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoCloneKitsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoCloneKitsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoCloneKitsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoCloneKitsRequest, a, b2);
  }
  static $() {
    return ["ListRepoCloneKitsRequest|1 identifier #0|2 page_size 13|3 page_token 9", ClientRepoIdentifier];
  }
};
var ListRepoCloneKitsResponse = class _ListRepoCloneKitsResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.kits = [];
    this.nextPageToken = "";
    this.cloneKitEnabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoCloneKitsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoCloneKitsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoCloneKitsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoCloneKitsResponse, a, b2);
  }
  static $() {
    return ["ListRepoCloneKitsResponse|1 kits #0*|2 next_page_token 9|3 clone_kit_enabled 8", RepoCloneKitGeneration];
  }
};
var RepoCloneKitGeneration = class _RepoCloneKitGeneration extends __protoMessage3150 {
  constructor(data) {
    super();
    this.packHash = "";
    this.tipCommit = "";
    this.packSizeBytes = protoInt64.zero;
    this.idxSizeBytes = protoInt64.zero;
    this.revSizeBytes = protoInt64.zero;
    this.kitVersion = "";
    this.isCurrent = false;
    this.packSha256 = "";
    this.idxSha256 = "";
    this.revSha256 = "";
    this.chunksSha256 = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoCloneKitGeneration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoCloneKitGeneration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoCloneKitGeneration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoCloneKitGeneration, a, b2);
  }
  static $() {
    return ["RepoCloneKitGeneration|1 pack_hash 9|2 tip_commit 9|3 pack_size_bytes 3|4 idx_size_bytes 3|5 rev_size_bytes 3|6 last_published_at #0|7 kit_version 9|8 is_current 8|9 pack_sha256 9|10 idx_sha256 9|11 rev_sha256 9|12 chunks_sha256 9", Timestamp];
  }
};
var UpdateRepoVisibilityRequest = class _UpdateRepoVisibilityRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoVisibilityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoVisibilityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoVisibilityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoVisibilityRequest, a, b2);
  }
  static $() {
    return ["UpdateRepoVisibilityRequest|1 identifier #0|2 visibility #1?", ClientRepoIdentifier, RepoVisibility];
  }
};
var UpdateRepoVisibilityResponse = class _UpdateRepoVisibilityResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoVisibilityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoVisibilityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoVisibilityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoVisibilityResponse, a, b2);
  }
  static $() {
    return ["UpdateRepoVisibilityResponse|1 repository #0", Repo];
  }
};
var UpdateRepoDefaultBranchRequest = class _UpdateRepoDefaultBranchRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.defaultBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoDefaultBranchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoDefaultBranchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoDefaultBranchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoDefaultBranchRequest, a, b2);
  }
  static $() {
    return ["UpdateRepoDefaultBranchRequest|1 identifier #0|2 default_branch 9", ClientRepoIdentifier];
  }
};
var UpdateRepoDefaultBranchResponse = class _UpdateRepoDefaultBranchResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.defaultBranch = "";
    this.changed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoDefaultBranchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoDefaultBranchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoDefaultBranchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoDefaultBranchResponse, a, b2);
  }
  static $() {
    return ["UpdateRepoDefaultBranchResponse|1 default_branch 9|2 changed 8|3 repository #0", Repo];
  }
};
var GetRepoRequest = class _GetRepoRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoRequest, a, b2);
  }
  static $() {
    return ["GetRepoRequest|1 identifier #0|2 include_authenticated_viewer 8?", ClientRepoIdentifier];
  }
};
var AuthenticatedOriginViewer = class _AuthenticatedOriginViewer extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthenticatedOriginViewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthenticatedOriginViewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthenticatedOriginViewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthenticatedOriginViewer, a, b2);
  }
  static $() {
    return ["AuthenticatedOriginViewer|1 identity #0|2 profile #1|3 gate #2|4 policy #3", AuthenticatedOriginViewer_Identity, AuthenticatedOriginViewer_Profile, AuthenticatedOriginViewer_GateAttributes, AuthenticatedOriginViewer_ReviewPolicy];
  }
};
var AuthenticatedOriginViewer_OriginDisabledState = /* @__PURE__ */ enumType(proto3, __protoPackage158, "AuthenticatedOriginViewer.OriginDisabledState", [[0, "UNSPECIFIED"], [1, "NOT_DISABLED"], [2, "DISABLED"], [3, "UNAVAILABLE"]], 1);
var AuthenticatedOriginViewer_Identity = class _AuthenticatedOriginViewer_Identity extends __protoMessage3150 {
  constructor(data) {
    super();
    this.authId = "";
    this.publicUserId = "";
    this.originAuthorIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthenticatedOriginViewer_Identity().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthenticatedOriginViewer_Identity().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthenticatedOriginViewer_Identity().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthenticatedOriginViewer_Identity, a, b2);
  }
  static $() {
    return ["AuthenticatedOriginViewer.Identity|1 auth_id 9|2 public_user_id 9|3 origin_author_ids 9*"];
  }
};
var AuthenticatedOriginViewer_Profile = class _AuthenticatedOriginViewer_Profile extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthenticatedOriginViewer_Profile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthenticatedOriginViewer_Profile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthenticatedOriginViewer_Profile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthenticatedOriginViewer_Profile, a, b2);
  }
  static $() {
    return ["AuthenticatedOriginViewer.Profile|1 email 9?|2 first_name 9?|3 last_name 9?|4 avatar_url 9?"];
  }
};
var AuthenticatedOriginViewer_GateAttributes = class _AuthenticatedOriginViewer_GateAttributes extends __protoMessage3150 {
  constructor(data) {
    super();
    this.isEnterpriseUser = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthenticatedOriginViewer_GateAttributes().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthenticatedOriginViewer_GateAttributes().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthenticatedOriginViewer_GateAttributes().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthenticatedOriginViewer_GateAttributes, a, b2);
  }
  static $() {
    return ["AuthenticatedOriginViewer.GateAttributes|1 team_id 5?|2 created_at_iso 9?|3 is_enterprise_user 8|4 email_domain_type 9?|5 country 9?|6 organization_id 3?|7 organization_public_id 9?|8 is_team_admin 8?"];
  }
};
var AuthenticatedOriginViewer_ReviewPolicy = class _AuthenticatedOriginViewer_ReviewPolicy extends __protoMessage3150 {
  constructor(data) {
    super();
    this.originDisabled = AuthenticatedOriginViewer_OriginDisabledState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthenticatedOriginViewer_ReviewPolicy().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthenticatedOriginViewer_ReviewPolicy().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthenticatedOriginViewer_ReviewPolicy().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthenticatedOriginViewer_ReviewPolicy, a, b2);
  }
  static $() {
    return ["AuthenticatedOriginViewer.ReviewPolicy|1 origin_disabled #0", AuthenticatedOriginViewer_OriginDisabledState];
  }
};
var GetRepoResponse = class _GetRepoResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoResponse, a, b2);
  }
  static $() {
    return ["GetRepoResponse|1 repository #0|2 github_mirror_info #1?", Repo, RepoGithubMirrorInfo];
  }
};
var RepoGithubMirrorInfo = class _RepoGithubMirrorInfo extends __protoMessage3150 {
  constructor(data) {
    super();
    this.githubOwner = "";
    this.githubRepo = "";
    this.githubRepoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoGithubMirrorInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoGithubMirrorInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoGithubMirrorInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoGithubMirrorInfo, a, b2);
  }
  static $() {
    return ["RepoGithubMirrorInfo|1 github_owner 9|2 github_repo 9|3 github_repo_url 9"];
  }
};
var GetRepoWithMirrorInfoResponse = class _GetRepoWithMirrorInfoResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoWithMirrorInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoWithMirrorInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoWithMirrorInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoWithMirrorInfoResponse, a, b2);
  }
  static $() {
    return ["GetRepoWithMirrorInfoResponse|1 repository #0|2 github_mirror_info #1|3 viewer_can_write_changes 8?|4 authenticated_viewer #2?", Repo, RepoGithubMirrorInfo, AuthenticatedOriginViewer];
  }
};
var GetRepoByGithubMirrorRequest = class _GetRepoByGithubMirrorRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.githubNodeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoByGithubMirrorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoByGithubMirrorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoByGithubMirrorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoByGithubMirrorRequest, a, b2);
  }
  static $() {
    return ["GetRepoByGithubMirrorRequest|1 github_node_id 9|2 github_enterprise_id 9?"];
  }
};
var CloneKitTimingsMs = class _CloneKitTimingsMs extends __protoMessage3150 {
  constructor(data) {
    super();
    this.manifestMs = 0;
    this.downloadMs = 0;
    this.verifyMs = 0;
    this.fetchMs = 0;
    this.checkoutMs = 0;
    this.totalMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloneKitTimingsMs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloneKitTimingsMs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloneKitTimingsMs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloneKitTimingsMs, a, b2);
  }
  static $() {
    return ["CloneKitTimingsMs|1 manifest_ms 5|2 download_ms 5|3 verify_ms 5|4 fetch_ms 5|5 checkout_ms 5|6 total_ms 5"];
  }
};
var RecordCloneKitUsageRequest = class _RecordCloneKitUsageRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.invocationId = "";
    this.artifactBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCloneKitUsageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCloneKitUsageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCloneKitUsageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCloneKitUsageRequest, a, b2);
  }
  static $() {
    return ["RecordCloneKitUsageRequest|1 invocation_id 9|2 identifier #0|3 artifact_bytes 3|4 timings #1?", ClientRepoIdentifier, CloneKitTimingsMs];
  }
};
var RecordCloneKitUsageResponse = class _RecordCloneKitUsageResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCloneKitUsageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCloneKitUsageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCloneKitUsageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCloneKitUsageResponse, a, b2);
  }
  static $() {
    return ["RecordCloneKitUsageResponse"];
  }
};
var OriginNamespace = class _OriginNamespace extends __protoMessage3150 {
  constructor(data) {
    super();
    this.id = "";
    this.ownerType = OriginNamespaceOwnerType.UNSPECIFIED;
    this.ownerEntityId = protoInt64.zero;
    this.namespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginNamespace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginNamespace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginNamespace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginNamespace, a, b2);
  }
  static $() {
    return ["OriginNamespace|1 id 9|2 owner_type #0|3 owner_entity_id 3|4 namespace 9", OriginNamespaceOwnerType];
  }
};
var CreateOriginNamespaceRequest = class _CreateOriginNamespaceRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.ownerType = OriginNamespaceOwnerType.UNSPECIFIED;
    this.ownerEntityId = protoInt64.zero;
    this.namespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateOriginNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateOriginNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateOriginNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateOriginNamespaceRequest, a, b2);
  }
  static $() {
    return ["CreateOriginNamespaceRequest|1 owner_type #0|2 owner_entity_id 3|3 namespace 9", OriginNamespaceOwnerType];
  }
};
var CreateOriginNamespaceResponse = class _CreateOriginNamespaceResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateOriginNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateOriginNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateOriginNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateOriginNamespaceResponse, a, b2);
  }
  static $() {
    return ["CreateOriginNamespaceResponse|1 origin_namespace #0", OriginNamespace];
  }
};
var SetupTeamNamespaceRequest = class _SetupTeamNamespaceRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.ownerType = OriginNamespaceOwnerType.UNSPECIFIED;
    this.ownerEntityId = protoInt64.zero;
    this.namespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetupTeamNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetupTeamNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetupTeamNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetupTeamNamespaceRequest, a, b2);
  }
  static $() {
    return ["SetupTeamNamespaceRequest|1 owner_type #0|2 owner_entity_id 3|3 namespace 9", OriginNamespaceOwnerType];
  }
};
var SetupTeamNamespaceResponse = class _SetupTeamNamespaceResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.namespaceCreated = false;
    this.grantsChanged = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetupTeamNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetupTeamNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetupTeamNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetupTeamNamespaceResponse, a, b2);
  }
  static $() {
    return ["SetupTeamNamespaceResponse|1 origin_namespace #0|2 namespace_created 8|3 grants_changed 8", OriginNamespace];
  }
};
var SetupUserNamespaceRequest = class _SetupUserNamespaceRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.namespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetupUserNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetupUserNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetupUserNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetupUserNamespaceRequest, a, b2);
  }
  static $() {
    return ["SetupUserNamespaceRequest|1 namespace 9"];
  }
};
var SuggestOriginNamespaceRequest = class _SuggestOriginNamespaceRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.preferredSlug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestOriginNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestOriginNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestOriginNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestOriginNamespaceRequest, a, b2);
  }
  static $() {
    return ["SuggestOriginNamespaceRequest|1 preferred_slug 9"];
  }
};
var SuggestOriginNamespaceResponse = class _SuggestOriginNamespaceResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.available = false;
    this.normalizedSlug = "";
    this.suggestedSlug = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestOriginNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestOriginNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestOriginNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestOriginNamespaceResponse, a, b2);
  }
  static $() {
    return ["SuggestOriginNamespaceResponse|1 available 8|2 normalized_slug 9|3 suggested_slug 9|4 message 9"];
  }
};
var SetupUserNamespaceResponse = class _SetupUserNamespaceResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.namespaceCreated = false;
    this.grantsChanged = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetupUserNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetupUserNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetupUserNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetupUserNamespaceResponse, a, b2);
  }
  static $() {
    return ["SetupUserNamespaceResponse|1 origin_namespace #0|2 namespace_created 8|3 grants_changed 8", OriginNamespace];
  }
};
var GetRepoNamespaceRequest = class _GetRepoNamespaceRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.ownerType = OriginNamespaceOwnerType.UNSPECIFIED;
    this.ownerEntityId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoNamespaceRequest, a, b2);
  }
  static $() {
    return ["GetRepoNamespaceRequest|1 owner_type #0|2 owner_entity_id 3", OriginNamespaceOwnerType];
  }
};
var GetRepoNamespaceResponse = class _GetRepoNamespaceResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoNamespaceResponse, a, b2);
  }
  static $() {
    return ["GetRepoNamespaceResponse|1 origin_namespace #0", OriginNamespace];
  }
};
var DoesNamespaceExistForTeamRequest = class _DoesNamespaceExistForTeamRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.teamId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoesNamespaceExistForTeamRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoesNamespaceExistForTeamRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoesNamespaceExistForTeamRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoesNamespaceExistForTeamRequest, a, b2);
  }
  static $() {
    return ["DoesNamespaceExistForTeamRequest|1 team_id 3"];
  }
};
var DoesNamespaceExistForTeamResponse = class _DoesNamespaceExistForTeamResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.exists = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoesNamespaceExistForTeamResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoesNamespaceExistForTeamResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoesNamespaceExistForTeamResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoesNamespaceExistForTeamResponse, a, b2);
  }
  static $() {
    return ["DoesNamespaceExistForTeamResponse|1 exists 8"];
  }
};
var GetAuthorizedNamespacesRequest = class _GetAuthorizedNamespacesRequest extends __protoMessage3150 {
  constructor(data) {
    super();
    this.includeExplicitGrantNamespaces = false;
    this.includeAllTeams = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAuthorizedNamespacesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAuthorizedNamespacesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAuthorizedNamespacesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAuthorizedNamespacesRequest, a, b2);
  }
  static $() {
    return ["GetAuthorizedNamespacesRequest|1 include_explicit_grant_namespaces 8|2 include_all_teams 8"];
  }
};
var GetAuthorizedNamespacesResponse = class _GetAuthorizedNamespacesResponse extends __protoMessage3150 {
  constructor(data) {
    super();
    this.namespaces = [];
    this.originDisabledForTeam = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAuthorizedNamespacesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAuthorizedNamespacesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAuthorizedNamespacesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAuthorizedNamespacesResponse, a, b2);
  }
  static $() {
    return ["GetAuthorizedNamespacesResponse|1 namespaces #0*|2 origin_disabled_for_team 8", AuthorizedNamespace];
  }
};
var AuthorizedNamespace = class _AuthorizedNamespace extends __protoMessage3150 {
  constructor(data) {
    super();
    this.accessReason = AuthorizedNamespaceAccessReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthorizedNamespace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthorizedNamespace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthorizedNamespace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthorizedNamespace, a, b2);
  }
  static $() {
    return ["AuthorizedNamespace|1 namespace #0|2 access_reason #1", OriginNamespace, AuthorizedNamespaceAccessReason];
  }
};
