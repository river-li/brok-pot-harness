init_compact();
var __protoPackage167 = "origin.v1.";
var __protoMessage3159 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage167;
  }
};
var ChangeStatus = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ChangeStatus", [[0, "UNSPECIFIED"], [1, "DRAFT"], [2, "OPEN"], [3, "MERGED"], [4, "CLOSED"]], 1);
var UpdateChangeBranchMethod = /* @__PURE__ */ enumType(proto3, __protoPackage167, "UpdateChangeBranchMethod", [[0, "UNSPECIFIED"], [1, "MERGE_COMMIT"]], 1);
var ReviewVerdict = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ReviewVerdict", [[0, "UNSPECIFIED"], [1, "APPROVE"], [2, "REQUEST_CHANGES"], [3, "COMMENT"]], 1);
var ChangeAssignmentKind = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ChangeAssignmentKind", [[0, "UNSPECIFIED"], [1, "REVIEW_REQUEST"], [2, "ASSIGNEE"]], 1);
var ChangeAssignmentCreatedVia = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ChangeAssignmentCreatedVia", [[0, "UNSPECIFIED"], [1, "HUMAN"], [2, "CODEOWNERS"], [3, "SYSTEM"]], 1);
var ReviewRequestEventAction = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ReviewRequestEventAction", [[0, "UNSPECIFIED"], [1, "REQUESTED"], [2, "REMOVED"]], 1);
var ChangeCodeownersMatchPathReason = /* @__PURE__ */ enumType(proto3, __protoPackage167, "ChangeCodeownersMatchPathReason", [[0, "UNSPECIFIED"], [1, "CURRENT_PATH"], [2, "DELETED_PATH"], [3, "RENAME_NEW_PATH"], [4, "RENAME_OLD_PATH"], [5, "COPY_SOURCE_PATH"]], 1);
var StackMemberParentRelation = /* @__PURE__ */ enumType(proto3, __protoPackage167, "StackMemberParentRelation", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "STRICT"], [3, "STALE"], [4, "PARENT_MERGED"], [5, "PARENT_CLOSED"]], 1);
var StackMemberRecommendedAction = /* @__PURE__ */ enumType(proto3, __protoPackage167, "StackMemberRecommendedAction", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "RESTACK_ONTO_PARENT"], [3, "REBASE_ONTO_TRUNK_IF_CONFLICTS"], [4, "RETARGET_BASE_TO_TRUNK"]], 1);
var SectionOfChangesSortField = /* @__PURE__ */ enumType(proto3, __protoPackage167, "SectionOfChangesSortField", [[0, "UNSPECIFIED"], [1, "UPDATED_AT"], [2, "CREATED_AT"], [3, "TITLE"], [4, "LINES_CHANGED"]], 1);
var SectionOfChangesStatus = /* @__PURE__ */ enumType(proto3, __protoPackage167, "SectionOfChangesStatus", [[0, "UNSPECIFIED"], [1, "DRAFT"], [2, "OPEN"], [3, "MERGED"], [4, "CLOSED"]], 1);
var SectionOfChangesVerdict = /* @__PURE__ */ enumType(proto3, __protoPackage167, "SectionOfChangesVerdict", [[0, "UNSPECIFIED"], [1, "APPROVE"], [2, "COMMENT"], [3, "REQUEST_CHANGES"]], 1);
var SectionOfChangesReviewStatusState = /* @__PURE__ */ enumType(proto3, __protoPackage167, "SectionOfChangesReviewStatusState", [[0, "UNSPECIFIED"], [1, "ONE_OR_MORE_APPROVALS"], [2, "IS_FULLY_APPROVED"], [3, "HAS_ACTIVE_REVIEW"], [4, "HAS_REQUESTED_REVIEWERS"], [5, "HAS_REREQUESTED_REVIEW"], [6, "HAS_UNADDRESSED_CHANGES_REQUESTED"], [7, "HAS_CHANGES_REQUESTED"]], 1);
var Change = class _Change extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.repoUuid = "";
    this.number = protoInt64.zero;
    this.title = "";
    this.description = "";
    this.headRef = "";
    this.baseRef = "";
    this.status = ChangeStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Change().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Change().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Change().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Change, a, b2);
  }
  static $() {
    return ["Change|1 id 9|2 repo_uuid 9|3 number 4|4 title 9|5 description 9|6 head_ref 9|7 base_ref 9|9 status #0|10 created_at #1|11 updated_at #1|12 merged_at #1?|13 closed_at #1?|14 parent_change_id 9?|15 stack_id 9?|16 merge_commit_sha 9?|22 author #2|23 merged_by #2", ChangeStatus, Timestamp, ActorWithDisplay];
  }
};
var Version2 = class _Version extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.number = protoInt64.zero;
    this.headSha = "";
    this.baseSha = "";
    this.additions = 0;
    this.deletions = 0;
    this.changedFiles = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Version().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Version().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Version().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Version, a, b2);
  }
  static $() {
    return ["Version|1 id 9|2 change_id 9|3 number 4|4 head_sha 9|5 base_sha 9|6 created_at #0|7 additions 5|8 deletions 5|9 changed_files 5|10 merge_base_sha 9?|11 ahead_by 5?|12 behind_by 5?|13 head_tree_oid 9?|14 merge_base_tree_oid 9?", Timestamp];
  }
};
var CreateChangeRequest = class _CreateChangeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.title = "";
    this.description = "";
    this.headRef = "";
    this.baseRef = "";
    this.status = ChangeStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateChangeRequest, a, b2);
  }
  static $() {
    return ["CreateChangeRequest|1 identifier #0|2 title 9|3 description 9|4 head_ref 9|5 base_ref 9|6 status #1|7 parent_change #2", ClientRepoIdentifier, ChangeStatus, ChangeIdentifier];
  }
};
var CreateChangeResponse = class _CreateChangeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateChangeResponse, a, b2);
  }
  static $() {
    return ["CreateChangeResponse|1 change #0|2 initial_version #1", Change, Version2];
  }
};
var ChangeIdentifier = class _ChangeIdentifier extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeIdentifier, a, b2);
  }
  static $() {
    return ["ChangeIdentifier|1 identifier #0|2 change_number 4", ClientRepoIdentifier];
  }
};
var RevertPullRequestRequest = class _RevertPullRequestRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.draft = false;
    this.allowStackLandingRevert = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevertPullRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevertPullRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevertPullRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevertPullRequestRequest, a, b2);
  }
  static $() {
    return ["RevertPullRequestRequest|1 change #0|2 title 9?|3 description 9?|4 draft 8|5 allow_stack_landing_revert 8", ChangeIdentifier];
  }
};
var RevertPullRequestResponse = class _RevertPullRequestResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reverseMirrorPushFailed = false;
    this.revertedChangeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevertPullRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevertPullRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevertPullRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevertPullRequestResponse, a, b2);
  }
  static $() {
    return ["RevertPullRequestResponse|1 change #0|2 reverse_mirror_push_failed 8|5 reverted_change_numbers 4*", Change];
  }
};
var UpdateChangeRequest = class _UpdateChangeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.parentUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeRequest, a, b2);
  }
  static $() {
    return ["UpdateChangeRequest|1 change #0|2 head_ref 9?|3 base_ref 9?|4 parent_change #0 parent_update|5 clear_parent 8 parent_update", ChangeIdentifier];
  }
};
var UpdateChangeResponse = class _UpdateChangeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.unchanged = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeResponse, a, b2);
  }
  static $() {
    return ["UpdateChangeResponse|1 change #0|2 latest_version #1|3 unchanged 8", Change, Version2];
  }
};
var UpdateChangeBranchRequest = class _UpdateChangeBranchRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.method = UpdateChangeBranchMethod.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeBranchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeBranchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeBranchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeBranchRequest, a, b2);
  }
  static $() {
    return ["UpdateChangeBranchRequest|1 change #0|2 method #1", ChangeIdentifier, UpdateChangeBranchMethod];
  }
};
var UpdateChangeBranchResponse = class _UpdateChangeBranchResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.unchanged = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeBranchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeBranchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeBranchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeBranchResponse, a, b2);
  }
  static $() {
    return ["UpdateChangeBranchResponse|1 change #0|2 latest_version #1|3 unchanged 8", Change, Version2];
  }
};
var DeleteChangeHeadBranchRequest = class _DeleteChangeHeadBranchRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteChangeHeadBranchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteChangeHeadBranchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteChangeHeadBranchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteChangeHeadBranchRequest, a, b2);
  }
  static $() {
    return ["DeleteChangeHeadBranchRequest|1 change #0", ChangeIdentifier];
  }
};
var DeleteChangeHeadBranchResponse = class _DeleteChangeHeadBranchResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.alreadyDeleted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteChangeHeadBranchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteChangeHeadBranchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteChangeHeadBranchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteChangeHeadBranchResponse, a, b2);
  }
  static $() {
    return ["DeleteChangeHeadBranchResponse|1 already_deleted 8"];
  }
};
var RestorePullRequestBranchRequest = class _RestorePullRequestBranchRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestorePullRequestBranchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestorePullRequestBranchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestorePullRequestBranchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestorePullRequestBranchRequest, a, b2);
  }
  static $() {
    return ["RestorePullRequestBranchRequest|1 change #0", ChangeIdentifier];
  }
};
var RestorePullRequestBranchResponse = class _RestorePullRequestBranchResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.alreadyRestored = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestorePullRequestBranchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestorePullRequestBranchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestorePullRequestBranchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestorePullRequestBranchResponse, a, b2);
  }
  static $() {
    return ["RestorePullRequestBranchResponse|1 already_restored 8"];
  }
};
var RetargetChangeRequest = class _RetargetChangeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.baseRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RetargetChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RetargetChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RetargetChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RetargetChangeRequest, a, b2);
  }
  static $() {
    return ["RetargetChangeRequest|1 change #0|2 base_ref 9", ChangeIdentifier];
  }
};
var RetargetChangeResponse = class _RetargetChangeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.unchanged = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RetargetChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RetargetChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RetargetChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RetargetChangeResponse, a, b2);
  }
  static $() {
    return ["RetargetChangeResponse|1 change #0|2 latest_version #1|3 unchanged 8", Change, Version2];
  }
};
var FoldChangeRequest = class _FoldChangeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FoldChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FoldChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FoldChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FoldChangeRequest, a, b2);
  }
  static $() {
    return ["FoldChangeRequest|1 change #0", ChangeIdentifier];
  }
};
var FoldChangeResponse = class _FoldChangeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FoldChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FoldChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FoldChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FoldChangeResponse, a, b2);
  }
  static $() {
    return ["FoldChangeResponse"];
  }
};
var LandChangeTreePathRequest = class _LandChangeTreePathRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LandChangeTreePathRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LandChangeTreePathRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LandChangeTreePathRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LandChangeTreePathRequest, a, b2);
  }
  static $() {
    return ["LandChangeTreePathRequest|1 tree #0|2 leaf #0", ChangeIdentifier];
  }
};
var LandChangeTreePathResponse = class _LandChangeTreePathResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.oldTrunkSha = "";
    this.newTrunkSha = "";
    this.mergedChangeNumbers = [];
    this.closedChangeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LandChangeTreePathResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LandChangeTreePathResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LandChangeTreePathResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LandChangeTreePathResponse, a, b2);
  }
  static $() {
    return ["LandChangeTreePathResponse|1 old_trunk_sha 9|2 new_trunk_sha 9|3 merged_change_numbers 4*|4 closed_change_numbers 4*"];
  }
};
var SplitChangeIntoStackRequest = class _SplitChangeIntoStackRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.expectedHeadSha = "";
    this.expectedBaseSha = "";
    this.groups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SplitChangeIntoStackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SplitChangeIntoStackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SplitChangeIntoStackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SplitChangeIntoStackRequest, a, b2);
  }
  static $() {
    return ["SplitChangeIntoStackRequest|1 change #0|2 expected_head_sha 9|3 expected_base_sha 9|4 groups #1*", ChangeIdentifier, SplitChangeStackGroup];
  }
};
var SplitChangeStackGroup = class _SplitChangeStackGroup extends __protoMessage3159 {
  constructor(data) {
    super();
    this.title = "";
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SplitChangeStackGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SplitChangeStackGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SplitChangeStackGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SplitChangeStackGroup, a, b2);
  }
  static $() {
    return ["SplitChangeStackGroup|1 title 9|2 paths 9*"];
  }
};
var SplitChangeIntoStackResponse = class _SplitChangeIntoStackResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SplitChangeIntoStackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SplitChangeIntoStackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SplitChangeIntoStackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SplitChangeIntoStackResponse, a, b2);
  }
  static $() {
    return ["SplitChangeIntoStackResponse|1 changes #0*", Change];
  }
};
var UpdateChangeMetadataRequest = class _UpdateChangeMetadataRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeMetadataRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeMetadataRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeMetadataRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeMetadataRequest, a, b2);
  }
  static $() {
    return ["UpdateChangeMetadataRequest|1 change #0|2 title 9?|3 description 9?", ChangeIdentifier];
  }
};
var UpdateChangeMetadataResponse = class _UpdateChangeMetadataResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeMetadataResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeMetadataResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeMetadataResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeMetadataResponse, a, b2);
  }
  static $() {
    return ["UpdateChangeMetadataResponse|1 change #0", Change];
  }
};
var UpdateChangeStatusRequest = class _UpdateChangeStatusRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.status = ChangeStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeStatusRequest, a, b2);
  }
  static $() {
    return ["UpdateChangeStatusRequest|1 change #0|2 status #1", ChangeIdentifier, ChangeStatus];
  }
};
var UpdateChangeStatusResponse = class _UpdateChangeStatusResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateChangeStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateChangeStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateChangeStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateChangeStatusResponse, a, b2);
  }
  static $() {
    return ["UpdateChangeStatusResponse|1 change #0", Change];
  }
};
var ReviewDismissal = class _ReviewDismissal extends __protoMessage3159 {
  constructor(data) {
    super();
    this.dismissalMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewDismissal().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewDismissal().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewDismissal().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewDismissal, a, b2);
  }
  static $() {
    return ["ReviewDismissal|1 dismissed_at #0|4 dismissal_message 9|5 dismissed_by #1", Timestamp, ActorWithDisplay];
  }
};
var Review = class _Review extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.versionId = "";
    this.versionNumber = protoInt64.zero;
    this.verdict = ReviewVerdict.UNSPECIFIED;
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Review().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Review().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Review().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Review, a, b2);
  }
  static $() {
    return ["Review|1 id 9|2 change_id 9|3 version_id 9|4 version_number 4|6 verdict #0|7 body 9|8 created_at #1|12 submitted_at #1?|13 dismissal #2?|14 author #3", ReviewVerdict, Timestamp, ReviewDismissal, ActorWithDisplay];
  }
};
var ChangeTimelineEvent = class _ChangeTimelineEvent extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.eventType = "";
    this.actorDisplayName = "";
    this.actorAvatarUrl = "";
    this.subjectUserId = "";
    this.subjectUserDisplayName = "";
    this.subjectUserAvatarUrl = "";
    this.subjectGroupId = "";
    this.labelName = "";
    this.labelColor = "";
    this.previousBaseRef = "";
    this.newBaseRef = "";
    this.previousTitle = "";
    this.newTitle = "";
    this.previousHeadSha = "";
    this.newHeadSha = "";
    this.headRefName = "";
    this.reviewId = "";
    this.dismissalMessage = "";
    this.relatedChangeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeTimelineEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeTimelineEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeTimelineEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeTimelineEvent, a, b2);
  }
  static $() {
    return ["ChangeTimelineEvent|1 id 9|2 event_type 9|3 created_at #0|6 actor_display_name 9|7 actor_avatar_url 9|8 subject_user_id 9|9 subject_user_display_name 9|10 subject_user_avatar_url 9|11 subject_group_id 9|12 label_name 9|13 label_color 9|14 previous_base_ref 9|15 new_base_ref 9|16 previous_title 9|17 new_title 9|18 previous_head_sha 9|19 new_head_sha 9|20 head_ref_name 9|21 review_id 9|22 dismissal_message 9|23 related_change_number 4|24 actor #1", Timestamp, ActorWithDisplay];
  }
};
var Comment2 = class _Comment extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.versionId = "";
    this.versionNumber = protoInt64.zero;
    this.body = "";
    this.threadId = "";
    this.reactionGroups = [];
    this.reviewId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Comment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Comment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Comment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Comment, a, b2);
  }
  static $() {
    return ["Comment|1 id 9|2 change_id 9|3 version_id 9|4 version_number 4|6 body 9|7 created_at #0|8 updated_at #0|9 thread_id 9|13 reaction_groups #1*|14 author #2|15 review_id 9", Timestamp, CommentReactionGroup, ActorWithDisplay];
  }
};
var CommentReactionGroup = class _CommentReactionGroup extends __protoMessage3159 {
  constructor(data) {
    super();
    this.emoji = "";
    this.count = 0;
    this.viewerHasReacted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommentReactionGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommentReactionGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommentReactionGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommentReactionGroup, a, b2);
  }
  static $() {
    return ["CommentReactionGroup|1 emoji 9|2 count 13|3 viewer_has_reacted 8"];
  }
};
var CommentReaction = class _CommentReaction extends __protoMessage3159 {
  constructor(data) {
    super();
    this.emoji = "";
    this.viewerIsReactor = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommentReaction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommentReaction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommentReaction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommentReaction, a, b2);
  }
  static $() {
    return ["CommentReaction|1 emoji 9|6 viewer_is_reactor 8|7 reactor #0", ActorWithDisplay];
  }
};
var CreateReviewRequest = class _CreateReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.verdict = ReviewVerdict.UNSPECIFIED;
    this.body = "";
    this.versionNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateReviewRequest, a, b2);
  }
  static $() {
    return ["CreateReviewRequest|1 change #0|2 verdict #1|3 body 9|4 version_number 4", ChangeIdentifier, ReviewVerdict];
  }
};
var CreateReviewResponse = class _CreateReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateReviewResponse, a, b2);
  }
  static $() {
    return ["CreateReviewResponse|1 review #0", Review];
  }
};
var UpdateReviewRequest = class _UpdateReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reviewId = "";
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateReviewRequest, a, b2);
  }
  static $() {
    return ["UpdateReviewRequest|1 change #0|2 review_id 9|3 body 9", ChangeIdentifier];
  }
};
var UpdateReviewResponse = class _UpdateReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateReviewResponse, a, b2);
  }
  static $() {
    return ["UpdateReviewResponse|1 review #0", Review];
  }
};
var DismissReviewRequest = class _DismissReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reviewId = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DismissReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DismissReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DismissReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DismissReviewRequest, a, b2);
  }
  static $() {
    return ["DismissReviewRequest|1 change #0|2 review_id 9|3 reason 9", ChangeIdentifier];
  }
};
var DismissReviewResponse = class _DismissReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DismissReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DismissReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DismissReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DismissReviewResponse, a, b2);
  }
  static $() {
    return ["DismissReviewResponse|1 review #0", Review];
  }
};
var ListReviewsRequest = class _ListReviewsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReviewsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReviewsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReviewsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReviewsRequest, a, b2);
  }
  static $() {
    return ["ListReviewsRequest|1 change #0", ChangeIdentifier];
  }
};
var ListReviewsResponse = class _ListReviewsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reviews = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReviewsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReviewsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReviewsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReviewsResponse, a, b2);
  }
  static $() {
    return ["ListReviewsResponse|1 reviews #0*", Review];
  }
};
var ListChangeTimelineEventsRequest = class _ListChangeTimelineEventsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangeTimelineEventsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangeTimelineEventsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangeTimelineEventsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangeTimelineEventsRequest, a, b2);
  }
  static $() {
    return ["ListChangeTimelineEventsRequest|1 change #0", ChangeIdentifier];
  }
};
var ListChangeTimelineEventsResponse = class _ListChangeTimelineEventsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangeTimelineEventsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangeTimelineEventsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangeTimelineEventsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangeTimelineEventsResponse, a, b2);
  }
  static $() {
    return ["ListChangeTimelineEventsResponse|1 events #0*", ChangeTimelineEvent];
  }
};
var CreateCommentRequest = class _CreateCommentRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.body = "";
    this.versionNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCommentRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCommentRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCommentRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCommentRequest, a, b2);
  }
  static $() {
    return ["CreateCommentRequest|1 change #0|2 body 9|3 version_number 4", ChangeIdentifier];
  }
};
var CreateCommentResponse = class _CreateCommentResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCommentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCommentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCommentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCommentResponse, a, b2);
  }
  static $() {
    return ["CreateCommentResponse|1 comment #0", Comment2];
  }
};
var ListCommentsRequest = class _ListCommentsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCommentsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCommentsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCommentsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCommentsRequest, a, b2);
  }
  static $() {
    return ["ListCommentsRequest|1 change #0", ChangeIdentifier];
  }
};
var ListCommentsResponse = class _ListCommentsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.comments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCommentsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCommentsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCommentsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCommentsResponse, a, b2);
  }
  static $() {
    return ["ListCommentsResponse|1 comments #0*", Comment2];
  }
};
var ChangeAssignment = class _ChangeAssignment extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.kind = ChangeAssignmentKind.UNSPECIFIED;
    this.assignedGroupId = "";
    this.createdVia = ChangeAssignmentCreatedVia.UNSPECIFIED;
    this.cursorUserId = protoInt64.zero;
    this.cursorGroupId = protoInt64.zero;
    this.assignedServiceAccountId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeAssignment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeAssignment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeAssignment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeAssignment, a, b2);
  }
  static $() {
    return ["ChangeAssignment|1 id 9|2 change_id 9|3 kind #0|5 assigned_group_id 9|6 created_via #1|8 created_at #2|9 updated_at #2|10 cursor_user_id 3|11 cursor_group_id 3|12 assigned_user #3|13 assigned_group #4|14 created_by #5|15 assigned_service_account #6|16 assigned_service_account_id 9", ChangeAssignmentKind, ChangeAssignmentCreatedVia, Timestamp, OriginReviewerCandidateUser, OriginReviewerCandidateGroup, ActorWithDisplay, OriginReviewerCandidateServiceAccount];
  }
};
var ReviewRequestEvent = class _ReviewRequestEvent extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.kind = ChangeAssignmentKind.UNSPECIFIED;
    this.action = ReviewRequestEventAction.UNSPECIFIED;
    this.assignedUserId = "";
    this.assignedGroupId = "";
    this.createdVia = ChangeAssignmentCreatedVia.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewRequestEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewRequestEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewRequestEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewRequestEvent, a, b2);
  }
  static $() {
    return ["ReviewRequestEvent|1 id 9|2 change_id 9|3 kind #0|4 action #1|13 assigned_user_id 9|6 assigned_group_id 9|7 created_via #2|9 created_at #3|10 actor #4|11 assigned_user #5|12 assigned_group #6", ChangeAssignmentKind, ReviewRequestEventAction, ChangeAssignmentCreatedVia, Timestamp, ActorWithDisplay, OriginReviewerCandidateUser, OriginReviewerCandidateGroup];
  }
};
var ListReviewRequestEventsRequest = class _ListReviewRequestEventsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReviewRequestEventsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReviewRequestEventsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReviewRequestEventsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReviewRequestEventsRequest, a, b2);
  }
  static $() {
    return ["ListReviewRequestEventsRequest|1 change #0", ChangeIdentifier];
  }
};
var ListReviewRequestEventsResponse = class _ListReviewRequestEventsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListReviewRequestEventsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListReviewRequestEventsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListReviewRequestEventsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListReviewRequestEventsResponse, a, b2);
  }
  static $() {
    return ["ListReviewRequestEventsResponse|1 events #0*", ReviewRequestEvent];
  }
};
var RequestReviewRequest = class _RequestReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestReviewRequest, a, b2);
  }
  static $() {
    return ["RequestReviewRequest|1 change #0|3 group_id 9 target|4 cursor_user_id 3 target|5 cursor_group_id 3 target|6 user_id 9 target|7 service_account_id 9 target", ChangeIdentifier];
  }
};
var RequestReviewResponse = class _RequestReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestReviewResponse, a, b2);
  }
  static $() {
    return ["RequestReviewResponse|1 assignment #0", ChangeAssignment];
  }
};
var ReviewRequestTarget = class _ReviewRequestTarget extends __protoMessage3159 {
  constructor(data) {
    super();
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewRequestTarget().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewRequestTarget().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewRequestTarget().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewRequestTarget, a, b2);
  }
  static $() {
    return ["ReviewRequestTarget|2 group_id 9 target|3 cursor_user_id 3 target|4 cursor_group_id 3 target|5 user_id 9 target|6 service_account_id 9 target"];
  }
};
var ApplyReviewRequestChangesRequest = class _ApplyReviewRequestChangesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.additions = [];
    this.removals = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApplyReviewRequestChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApplyReviewRequestChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApplyReviewRequestChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApplyReviewRequestChangesRequest, a, b2);
  }
  static $() {
    return ["ApplyReviewRequestChangesRequest|1 change #0|2 additions #1*|3 removals #1*", ChangeIdentifier, ReviewRequestTarget];
  }
};
var ApplyReviewRequestChangesResponse = class _ApplyReviewRequestChangesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApplyReviewRequestChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApplyReviewRequestChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApplyReviewRequestChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApplyReviewRequestChangesResponse, a, b2);
  }
  static $() {
    return ["ApplyReviewRequestChangesResponse"];
  }
};
var RequestReviewsRequest = class _RequestReviewsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.targets = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestReviewsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestReviewsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestReviewsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestReviewsRequest, a, b2);
  }
  static $() {
    return ["RequestReviewsRequest|1 change #0|2 targets #1*", ChangeIdentifier, ReviewRequestTarget];
  }
};
var RequestReviewsResponse = class _RequestReviewsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.assignments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestReviewsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestReviewsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestReviewsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestReviewsResponse, a, b2);
  }
  static $() {
    return ["RequestReviewsResponse|1 assignments #0*", ChangeAssignment];
  }
};
var CloseReviewRequestRequest = class _CloseReviewRequestRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloseReviewRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloseReviewRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloseReviewRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloseReviewRequestRequest, a, b2);
  }
  static $() {
    return ["CloseReviewRequestRequest|1 change #0|3 group_id 9 target|4 cursor_user_id 3 target|5 cursor_group_id 3 target|6 user_id 9 target|7 service_account_id 9 target", ChangeIdentifier];
  }
};
var CloseReviewRequestResponse = class _CloseReviewRequestResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloseReviewRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloseReviewRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloseReviewRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloseReviewRequestResponse, a, b2);
  }
  static $() {
    return ["CloseReviewRequestResponse"];
  }
};
var AddAssigneeRequest = class _AddAssigneeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAssigneeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAssigneeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAssigneeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAssigneeRequest, a, b2);
  }
  static $() {
    return ["AddAssigneeRequest|1 change #0|3 group_id 9 target|4 cursor_user_id 3 target|5 cursor_group_id 3 target|6 user_id 9 target", ChangeIdentifier];
  }
};
var AddAssigneeResponse = class _AddAssigneeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAssigneeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAssigneeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAssigneeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAssigneeResponse, a, b2);
  }
  static $() {
    return ["AddAssigneeResponse|1 assignment #0", ChangeAssignment];
  }
};
var RemoveAssigneeRequest = class _RemoveAssigneeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveAssigneeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveAssigneeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveAssigneeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveAssigneeRequest, a, b2);
  }
  static $() {
    return ["RemoveAssigneeRequest|1 change #0|3 group_id 9 target|4 cursor_user_id 3 target|5 cursor_group_id 3 target|6 user_id 9 target", ChangeIdentifier];
  }
};
var RemoveAssigneeResponse = class _RemoveAssigneeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveAssigneeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveAssigneeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveAssigneeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveAssigneeResponse, a, b2);
  }
  static $() {
    return ["RemoveAssigneeResponse"];
  }
};
var OriginReviewerCandidateUser = class _OriginReviewerCandidateUser extends __protoMessage3159 {
  constructor(data) {
    super();
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.avatarUrl = "";
    this.cursorUserId = protoInt64.zero;
    this.userId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginReviewerCandidateUser().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginReviewerCandidateUser().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginReviewerCandidateUser().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginReviewerCandidateUser, a, b2);
  }
  static $() {
    return ["OriginReviewerCandidateUser|3 first_name 9|4 last_name 9|5 email 9|6 avatar_url 9|7 cursor_user_id 3|8 user_id 9"];
  }
};
var OriginReviewerCandidateGroup = class _OriginReviewerCandidateGroup extends __protoMessage3159 {
  constructor(data) {
    super();
    this.groupPublicId = "";
    this.organizationSlug = "";
    this.groupSlug = "";
    this.name = "";
    this.cursorGroupId = protoInt64.zero;
    this.memberUserIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginReviewerCandidateGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginReviewerCandidateGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginReviewerCandidateGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginReviewerCandidateGroup, a, b2);
  }
  static $() {
    return ["OriginReviewerCandidateGroup|1 group_public_id 9|2 organization_slug 9|3 group_slug 9|4 name 9|6 cursor_group_id 3|7 member_user_ids 9*"];
  }
};
var ListOriginRepoReviewerCandidatesRequest = class _ListOriginRepoReviewerCandidatesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListOriginRepoReviewerCandidatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListOriginRepoReviewerCandidatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListOriginRepoReviewerCandidatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListOriginRepoReviewerCandidatesRequest, a, b2);
  }
  static $() {
    return ["ListOriginRepoReviewerCandidatesRequest|1 repo #0", ClientRepoIdentifier];
  }
};
var OriginReviewerCandidateServiceAccount = class _OriginReviewerCandidateServiceAccount extends __protoMessage3159 {
  constructor(data) {
    super();
    this.serviceAccountId = "";
    this.displayName = "";
    this.avatarUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginReviewerCandidateServiceAccount().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginReviewerCandidateServiceAccount().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginReviewerCandidateServiceAccount().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginReviewerCandidateServiceAccount, a, b2);
  }
  static $() {
    return ["OriginReviewerCandidateServiceAccount|1 service_account_id 9|2 display_name 9|3 avatar_url 9"];
  }
};
var ListOriginRepoReviewerCandidatesResponse = class _ListOriginRepoReviewerCandidatesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.users = [];
    this.groups = [];
    this.serviceAccounts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListOriginRepoReviewerCandidatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListOriginRepoReviewerCandidatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListOriginRepoReviewerCandidatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListOriginRepoReviewerCandidatesResponse, a, b2);
  }
  static $() {
    return ["ListOriginRepoReviewerCandidatesResponse|1 users #0*|2 groups #1*|3 service_accounts #2*", OriginReviewerCandidateUser, OriginReviewerCandidateGroup, OriginReviewerCandidateServiceAccount];
  }
};
var GetChangeRequest = class _GetChangeRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeRequest, a, b2);
  }
  static $() {
    return ["GetChangeRequest|1 change #0|2 include_head_ref_exists 8?|3 include_merge_when_ready 8?|4 include_commits_behind_base 8?|5 include_viewer_capabilities 8?", ChangeIdentifier];
  }
};
var ChangeLabel = class _ChangeLabel extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.color = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeLabel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeLabel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeLabel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeLabel, a, b2);
  }
  static $() {
    return ["ChangeLabel|1 id 9|2 name 9|3 color 9|4 description 9?"];
  }
};
var ChangeMergeWhenReadySummary = class _ChangeMergeWhenReadySummary extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.changeId = "";
    this.repoUuid = "";
    this.changeNumber = protoInt64.zero;
    this.status = "";
    this.source = "";
    this.trunkBranch = "";
    this.consecutiveFailedAttempts = 0;
    this.dev = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeMergeWhenReadySummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeMergeWhenReadySummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeMergeWhenReadySummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeMergeWhenReadySummary, a, b2);
  }
  static $() {
    return ["ChangeMergeWhenReadySummary|1 id 9|2 change_id 9|3 repo_uuid 9|4 change_number 4|6 status 9|7 source 9|8 trunk_branch 9|9 lock_expires_at #0?|10 consecutive_failed_attempts 5|11 dev 8|12 repo_org 9?|13 repo_name 9?|14 enabled_by #1", Timestamp, ActorWithDisplay];
  }
};
var ChangeViewerCapabilities = class _ChangeViewerCapabilities extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeViewerCapabilities().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeViewerCapabilities().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeViewerCapabilities().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeViewerCapabilities, a, b2);
  }
  static $() {
    return ["ChangeViewerCapabilities|1 can_write_pull_requests 8?|2 can_write_contents 8?|3 can_write_reviews 8?|4 can_merge 8?|5 can_enable_merge_when_ready 8?|6 can_disable_merge_when_ready 8?"];
  }
};
var GetChangeResponse = class _GetChangeResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.versions = [];
    this.assignments = [];
    this.labels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeResponse, a, b2);
  }
  static $() {
    return ["GetChangeResponse|1 change #0|2 versions #1*|3 assignments #2*|4 labels #3*|5 viewer_last_viewed_at #4?|6 viewer_timeline_viewed_at #4?|7 head_ref_exists 8?|8 merge_when_ready #5?|9 commits_behind_base 5?|12 commits_behind_base_as_of_version 4?|10 viewer_capabilities #6?|11 viewer_is_author 8?", Change, Version2, ChangeAssignment, ChangeLabel, Timestamp, ChangeMergeWhenReadySummary, ChangeViewerCapabilities];
  }
};
var GetChangeCodeownersApplicationRequest = class _GetChangeCodeownersApplicationRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeCodeownersApplicationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeCodeownersApplicationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeCodeownersApplicationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeCodeownersApplicationRequest, a, b2);
  }
  static $() {
    return ["GetChangeCodeownersApplicationRequest|1 change #0|2 version_number 4?", ChangeIdentifier];
  }
};
var ChangeCodeownersSnapshotMissing = class _ChangeCodeownersSnapshotMissing extends __protoMessage3159 {
  constructor(data) {
    super();
    this.checkedPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersSnapshotMissing().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersSnapshotMissing().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersSnapshotMissing().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersSnapshotMissing, a, b2);
  }
  static $() {
    return ["ChangeCodeownersSnapshotMissing|1 checked_paths 9*"];
  }
};
var ChangeCodeownersSnapshotTooLarge = class _ChangeCodeownersSnapshotTooLarge extends __protoMessage3159 {
  constructor(data) {
    super();
    this.path = "";
    this.sizeBytes = protoInt64.zero;
    this.maxSizeBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersSnapshotTooLarge().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersSnapshotTooLarge().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersSnapshotTooLarge().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersSnapshotTooLarge, a, b2);
  }
  static $() {
    return ["ChangeCodeownersSnapshotTooLarge|1 path 9|2 size_bytes 4|3 max_size_bytes 4"];
  }
};
var ChangeCodeownersSnapshotFound = class _ChangeCodeownersSnapshotFound extends __protoMessage3159 {
  constructor(data) {
    super();
    this.path = "";
    this.sizeBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersSnapshotFound().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersSnapshotFound().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersSnapshotFound().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersSnapshotFound, a, b2);
  }
  static $() {
    return ["ChangeCodeownersSnapshotFound|1 path 9|2 size_bytes 4"];
  }
};
var ChangeCodeownersSnapshot = class _ChangeCodeownersSnapshot extends __protoMessage3159 {
  constructor(data) {
    super();
    this.baseSha = "";
    this.status = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersSnapshot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersSnapshot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersSnapshot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersSnapshot, a, b2);
  }
  static $() {
    return ["ChangeCodeownersSnapshot|1 base_sha 9|2 missing #0 status|3 too_large #1 status|4 found #2 status", ChangeCodeownersSnapshotMissing, ChangeCodeownersSnapshotTooLarge, ChangeCodeownersSnapshotFound];
  }
};
var ChangeCodeownersMatchPath = class _ChangeCodeownersMatchPath extends __protoMessage3159 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = ChangeCodeownersMatchPathReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersMatchPath().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersMatchPath().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersMatchPath().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersMatchPath, a, b2);
  }
  static $() {
    return ["ChangeCodeownersMatchPath|1 path 9|2 reason #0", ChangeCodeownersMatchPathReason];
  }
};
var ChangeCodeowner = class _ChangeCodeowner extends __protoMessage3159 {
  constructor(data) {
    super();
    this.label = "";
    this.identity = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeowner().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeowner().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeowner().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeowner, a, b2);
  }
  static $() {
    return ["ChangeCodeowner|1 label 9|2 user #0 identity|3 group #1 identity", ChangeCodeowner_User, ChangeCodeowner_Group];
  }
};
var ChangeCodeowner_User = class _ChangeCodeowner_User extends __protoMessage3159 {
  constructor(data) {
    super();
    this.login = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeowner_User().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeowner_User().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeowner_User().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeowner_User, a, b2);
  }
  static $() {
    return ["ChangeCodeowner.User|1 login 9"];
  }
};
var ChangeCodeowner_Group = class _ChangeCodeowner_Group extends __protoMessage3159 {
  constructor(data) {
    super();
    this.organizationSlug = "";
    this.groupSlug = "";
    this.groupPublicId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeowner_Group().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeowner_Group().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeowner_Group().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeowner_Group, a, b2);
  }
  static $() {
    return ["ChangeCodeowner.Group|1 organization_slug 9|2 group_slug 9|3 group_public_id 9"];
  }
};
var ChangeCodeownersResolvedOwnerRule = class _ChangeCodeownersResolvedOwnerRule extends __protoMessage3159 {
  constructor(data) {
    super();
    this.owners = [];
    this.requirementGroupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersResolvedOwnerRule().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersResolvedOwnerRule().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersResolvedOwnerRule().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersResolvedOwnerRule, a, b2);
  }
  static $() {
    return ["ChangeCodeownersResolvedOwnerRule|1 match_path #0|2 owners #1*|3 requirement_group_id 9", ChangeCodeownersMatchPath, ChangeCodeowner];
  }
};
var ChangeCodeownersChangedPath = class _ChangeCodeownersChangedPath extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeKind = ChangeKind.UNSPECIFIED;
    this.canonicalPath = "";
    this.matchPaths = [];
    this.resolvedOwnerRules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersChangedPath().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersChangedPath().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersChangedPath().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersChangedPath, a, b2);
  }
  static $() {
    return ["ChangeCodeownersChangedPath|1 change_kind #0|2 canonical_path 9|3 old_path 9?|4 match_paths #1*|5 resolved_owner_rules #2*", ChangeKind, ChangeCodeownersMatchPath, ChangeCodeownersResolvedOwnerRule];
  }
};
var ChangeCodeownersRequirementPath = class _ChangeCodeownersRequirementPath extends __protoMessage3159 {
  constructor(data) {
    super();
    this.canonicalPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersRequirementPath().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersRequirementPath().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersRequirementPath().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersRequirementPath, a, b2);
  }
  static $() {
    return ["ChangeCodeownersRequirementPath|1 canonical_path 9|2 match_path #0", ChangeCodeownersMatchPath];
  }
};
var ChangeCodeownersRequirementGroup = class _ChangeCodeownersRequirementGroup extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.owners = [];
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeCodeownersRequirementGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeCodeownersRequirementGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeCodeownersRequirementGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeCodeownersRequirementGroup, a, b2);
  }
  static $() {
    return ["ChangeCodeownersRequirementGroup|1 id 9|2 owners #0*|3 paths #1*", ChangeCodeowner, ChangeCodeownersRequirementPath];
  }
};
var GetChangeCodeownersApplicationResponse = class _GetChangeCodeownersApplicationResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changedPaths = [];
    this.requirementGroups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeCodeownersApplicationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeCodeownersApplicationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeCodeownersApplicationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeCodeownersApplicationResponse, a, b2);
  }
  static $() {
    return ["GetChangeCodeownersApplicationResponse|1 snapshot #0|2 changed_paths #1*|3 requirement_groups #2*", ChangeCodeownersSnapshot, ChangeCodeownersChangedPath, ChangeCodeownersRequirementGroup];
  }
};
var GetChangeStackRequest = class _GetChangeStackRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeStackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeStackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeStackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeStackRequest, a, b2);
  }
  static $() {
    return ["GetChangeStackRequest|1 change #0", ChangeIdentifier];
  }
};
var StackMemberState = class _StackMemberState extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeId = "";
    this.headSha = "";
    this.recordedBaseSha = "";
    this.rootBaseRef = "";
    this.parentRelation = StackMemberParentRelation.UNSPECIFIED;
    this.recommendedAction = StackMemberRecommendedAction.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StackMemberState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StackMemberState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StackMemberState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StackMemberState, a, b2);
  }
  static $() {
    return ["StackMemberState|1 change_id 9|2 head_sha 9|3 recorded_base_sha 9|4 root_base_ref 9|5 parent_head_sha 9?|6 parent_relation #0|7 recommended_action #1", StackMemberParentRelation, StackMemberRecommendedAction];
  }
};
var GetChangeStackResponse = class _GetChangeStackResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    this.convergenceConflictedPaths = [];
    this.memberStates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeStackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeStackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeStackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeStackResponse, a, b2);
  }
  static $() {
    return ["GetChangeStackResponse|1 changes #0*|6 stack_id 9?|2 convergence_state 9?|3 convergence_conflicted_change_number 4?|4 convergence_conflicted_paths 9*|5 convergence_blocked_reason 9?|7 member_states #1*", Change, StackMemberState];
  }
};
var GetProjectedLatestVersionsRequest = class _GetProjectedLatestVersionsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetProjectedLatestVersionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetProjectedLatestVersionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetProjectedLatestVersionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetProjectedLatestVersionsRequest, a, b2);
  }
  static $() {
    return ["GetProjectedLatestVersionsRequest|1 identifier #0|2 change_numbers 4*", ClientRepoIdentifier];
  }
};
var ProjectedLatestVersionEntry = class _ProjectedLatestVersionEntry extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProjectedLatestVersionEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProjectedLatestVersionEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProjectedLatestVersionEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProjectedLatestVersionEntry, a, b2);
  }
  static $() {
    return ["ProjectedLatestVersionEntry|1 change_number 4|2 projected_latest_version #0", Version2];
  }
};
var GetProjectedLatestVersionsResponse = class _GetProjectedLatestVersionsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetProjectedLatestVersionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetProjectedLatestVersionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetProjectedLatestVersionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetProjectedLatestVersionsResponse, a, b2);
  }
  static $() {
    return ["GetProjectedLatestVersionsResponse|1 entries #0*", ProjectedLatestVersionEntry];
  }
};
var ListChangeCommitsRequest = class _ListChangeCommitsRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.versionNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangeCommitsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangeCommitsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangeCommitsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangeCommitsRequest, a, b2);
  }
  static $() {
    return ["ListChangeCommitsRequest|1 change #0|2 version_number 4|3 max_commits 13?", ChangeIdentifier];
  }
};
var ListChangeCommitsResponse = class _ListChangeCommitsResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.commits = [];
    this.mergeBaseSha = "";
    this.truncated = false;
    this.actorDisplaysBySha = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangeCommitsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangeCommitsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangeCommitsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangeCommitsResponse, a, b2);
  }
  static $() {
    return ["ListChangeCommitsResponse|1 commits #0*|2 merge_base_sha 9|3 truncated 8|4 actor_displays_by_sha 9,#1", Commit2, CommitActorDisplays];
  }
};
var CommitActorDisplays = class _CommitActorDisplays extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitActorDisplays().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitActorDisplays().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitActorDisplays().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitActorDisplays, a, b2);
  }
  static $() {
    return ["CommitActorDisplays|1 author #0|2 committer #0", CommitActorDisplay];
  }
};
var CommitActorDisplay = class _CommitActorDisplay extends __protoMessage3159 {
  constructor(data) {
    super();
    this.displayName = "";
    this.avatarUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitActorDisplay().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitActorDisplay().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitActorDisplay().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitActorDisplay, a, b2);
  }
  static $() {
    return ["CommitActorDisplay|1 display_name 9|2 avatar_url 9"];
  }
};
var ListChangesRequest = class _ListChangesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.file = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangesRequest, a, b2);
  }
  static $() {
    return ["ListChangesRequest|1 identifier #0|2 status 9?|3 cursor 4?|4 limit 5?|5 author_id 9?|6 base_ref 9?|7 head_ref 9?|8 file 9*", ClientRepoIdentifier];
  }
};
var ListChangesByHeadRefRequest = class _ListChangesByHeadRefRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.headRef = "";
    this.includeInactive = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangesByHeadRefRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangesByHeadRefRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangesByHeadRefRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangesByHeadRefRequest, a, b2);
  }
  static $() {
    return ["ListChangesByHeadRefRequest|1 identifier #0|2 head_ref 9|3 include_inactive 8", ClientRepoIdentifier];
  }
};
var ListChangesByHeadRefResponse = class _ListChangesByHeadRefResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangesByHeadRefResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangesByHeadRefResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangesByHeadRefResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangesByHeadRefResponse, a, b2);
  }
  static $() {
    return ["ListChangesByHeadRefResponse|1 changes #0*", Change];
  }
};
var GetCommitReferencesRequest = class _GetCommitReferencesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitReferencesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitReferencesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitReferencesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitReferencesRequest, a, b2);
  }
  static $() {
    return ["GetCommitReferencesRequest|1 identifier #0|2 sha 9", ClientRepoIdentifier];
  }
};
var CommitReference = class _CommitReference extends __protoMessage3159 {
  constructor(data) {
    super();
    this.branchName = "";
    this.pullRequestNumber = protoInt64.zero;
    this.status = ChangeStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitReference, a, b2);
  }
  static $() {
    return ["CommitReference|1 branch_name 9|2 pull_request_number 3|3 status #0", ChangeStatus];
  }
};
var GetCommitReferencesResponse = class _GetCommitReferencesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.references = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitReferencesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitReferencesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitReferencesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitReferencesResponse, a, b2);
  }
  static $() {
    return ["GetCommitReferencesResponse|1 references #0*", CommitReference];
  }
};
var ChangeWithLatestVersion = class _ChangeWithLatestVersion extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeWithLatestVersion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeWithLatestVersion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeWithLatestVersion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeWithLatestVersion, a, b2);
  }
  static $() {
    return ["ChangeWithLatestVersion|1 change #0|2 latest_version #1?", Change, Version2];
  }
};
var BatchGetChangesRequest = class _BatchGetChangesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changeNumbers = [];
    this.headRefs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetChangesRequest, a, b2);
  }
  static $() {
    return ["BatchGetChangesRequest|1 identifier #0|2 change_numbers 4*|3 head_refs 9*", ClientRepoIdentifier];
  }
};
var BatchGetChangesResponse = class _BatchGetChangesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetChangesResponse, a, b2);
  }
  static $() {
    return ["BatchGetChangesResponse|1 changes #0*", ChangeWithLatestVersion];
  }
};
var ListChangesResponse = class _ListChangesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListChangesResponse, a, b2);
  }
  static $() {
    return ["ListChangesResponse|1 changes #0*|2 next_cursor 4?", ChangeWithLatestVersion];
  }
};
var GetSectionOfChangesRequest = class _GetSectionOfChangesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.repos = [];
    this.limit = 0;
    this.sortField = SectionOfChangesSortField.UNSPECIFIED;
    this.sortIsAsc = false;
    this.skipTotalCount = false;
    this.changeIds = [];
    this.dropUnauthorizedRepos = false;
    this.viewerScoped = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSectionOfChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSectionOfChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSectionOfChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSectionOfChangesRequest, a, b2);
  }
  static $() {
    return ["GetSectionOfChangesRequest|1 repos #0*|2 filter #1|3 cursor 9?|4 limit 5|5 sort_field #2|6 sort_is_asc 8|7 skip_total_count 8|8 change_ids 9*|10 drop_unauthorized_repos 8|9 viewer_scoped 8", ClientRepoIdentifier, SectionOfChangesFilter, SectionOfChangesSortField];
  }
};
var GetSectionOfChangesResponse = class _GetSectionOfChangesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.changes = [];
    this.hasMore = false;
    this.totalCount = 0;
    this.droppedRepoCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSectionOfChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSectionOfChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSectionOfChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSectionOfChangesResponse, a, b2);
  }
  static $() {
    return ["GetSectionOfChangesResponse|1 changes #0*|2 has_more 8|3 total_count 5|4 dropped_repo_count 5", SectionOfChanges];
  }
};
var CountSectionsOfChangesRequest = class _CountSectionsOfChangesRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.repos = [];
    this.filters = [];
    this.dropUnauthorizedRepos = false;
    this.viewerScoped = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CountSectionsOfChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CountSectionsOfChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CountSectionsOfChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CountSectionsOfChangesRequest, a, b2);
  }
  static $() {
    return ["CountSectionsOfChangesRequest|1 repos #0*|2 filters #1*|3 drop_unauthorized_repos 8|4 viewer_scoped 8", ClientRepoIdentifier, SectionOfChangesFilter];
  }
};
var CountSectionsOfChangesResponse = class _CountSectionsOfChangesResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.counts = [];
    this.droppedRepoCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CountSectionsOfChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CountSectionsOfChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CountSectionsOfChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CountSectionsOfChangesResponse, a, b2);
  }
  static $() {
    return ["CountSectionsOfChangesResponse|1 counts 5*|2 dropped_repo_count 5"];
  }
};
var SectionOfChanges = class _SectionOfChanges extends __protoMessage3159 {
  constructor(data) {
    super();
    this.id = "";
    this.number = 0;
    this.repoId = "";
    this.title = "";
    this.description = "";
    this.headRef = "";
    this.baseRef = "";
    this.status = SectionOfChangesStatus.UNSPECIFIED;
    this.headSha = "";
    this.baseSha = "";
    this.additions = 0;
    this.deletions = 0;
    this.changedFiles = 0;
    this.versionCount = 0;
    this.reviewers = [];
    this.totalThreadCount = 0;
    this.unresolvedThreadCount = 0;
    this.repoNamespace = "";
    this.repoName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChanges().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChanges().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChanges().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChanges, a, b2);
  }
  static $() {
    return ["SectionOfChanges|1 id 9|2 number 5|3 repo_id 9|4 title 9|5 description 9|6 head_ref 9|7 base_ref 9|9 status #0|10 created_at #1|11 updated_at #1|12 merged_at #1?|13 closed_at #1?|14 head_sha 9|15 base_sha 9|16 additions 5|17 deletions 5|18 changed_files 5|19 version_count 5|20 review_decision 9?|21 reviewers #2*|22 total_thread_count 5|23 unresolved_thread_count 5|24 parent_change_id 9?|25 stack_id 9?|26 repo_namespace 9|27 repo_name 9|31 author #3|32 viewer_last_viewed_at #1?|33 discussion_comment_count 5?|34 agent_wrote 8?", SectionOfChangesStatus, Timestamp, SectionOfChangesReviewer, ActorWithDisplay];
  }
};
var SectionOfChangesReviewer = class _SectionOfChangesReviewer extends __protoMessage3159 {
  constructor(data) {
    super();
    this.verdict = SectionOfChangesVerdict.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesReviewer, a, b2);
  }
  static $() {
    return ["SectionOfChangesReviewer|2 verdict #0|3 reviewed_at #1|7 author #2", SectionOfChangesVerdict, Timestamp, ActorWithDisplay];
  }
};
var SectionOfChangesFilter = class _SectionOfChangesFilter extends __protoMessage3159 {
  constructor(data) {
    super();
    this.kind = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilter, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilter|1 and #0 kind|2 or #1 kind|3 not #2 kind|4 consolidated_status #3 kind|5 title_contains #4 kind|6 description_contains #5 kind|7 merge_base #6 kind|8 trunk #7 kind|9 last_updated #8 kind|10 open_review_request_for #9 kind|11 reopened_review_request_for #10 kind|12 closed_review_request_from #11 kind|13 includes_direct_reviewer #12 kind|14 author_is #13 kind|15 review_status #14 kind|16 approved_by #15 kind|17 includes_past_reviewer #16 kind|18 has_label #17 kind|19 num_files_changed #18 kind|20 num_lines_changed #19 kind|21 includes_reviewer #20 kind|22 includes_assignee #21 kind|23 includes_direct_team_reviewer #22 kind|24 mentions #23 kind|100 unsupported #24 kind", SectionOfChangesFilterAnd, SectionOfChangesFilterOr, SectionOfChangesFilterNot, SectionOfChangesFilterConsolidatedStatus, SectionOfChangesFilterTitleContains, SectionOfChangesFilterDescriptionContains, SectionOfChangesFilterMergeBase, SectionOfChangesFilterTrunk, SectionOfChangesFilterLastUpdated, SectionOfChangesFilterOpenReviewRequestFor, SectionOfChangesFilterReopenedReviewRequestFor, SectionOfChangesFilterClosedReviewRequestFrom, SectionOfChangesFilterIncludesDirectReviewer, SectionOfChangesFilterAuthorIs, SectionOfChangesFilterReviewStatus, SectionOfChangesFilterApprovedBy, SectionOfChangesFilterIncludesPastReviewer, SectionOfChangesFilterHasLabel, SectionOfChangesFilterNumFilesChanged, SectionOfChangesFilterNumLinesChanged, SectionOfChangesFilterIncludesReviewer, SectionOfChangesFilterIncludesAssignee, SectionOfChangesFilterIncludesDirectTeamReviewer, SectionOfChangesFilterMentions, SectionOfChangesFilterUnsupported];
  }
};
var SectionOfChangesFilterAnd = class _SectionOfChangesFilterAnd extends __protoMessage3159 {
  constructor(data) {
    super();
    this.exprs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterAnd().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterAnd().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterAnd().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterAnd, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterAnd|1 exprs #0*", SectionOfChangesFilter];
  }
};
var SectionOfChangesFilterOr = class _SectionOfChangesFilterOr extends __protoMessage3159 {
  constructor(data) {
    super();
    this.exprs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterOr().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterOr().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterOr().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterOr, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterOr|1 exprs #0*", SectionOfChangesFilter];
  }
};
var SectionOfChangesFilterNot = class _SectionOfChangesFilterNot extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterNot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterNot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterNot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterNot, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterNot|1 expr #0", SectionOfChangesFilter];
  }
};
var SectionOfChangesFilterConsolidatedStatus = class _SectionOfChangesFilterConsolidatedStatus extends __protoMessage3159 {
  constructor(data) {
    super();
    this.status = SectionOfChangesStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterConsolidatedStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterConsolidatedStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterConsolidatedStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterConsolidatedStatus, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterConsolidatedStatus|1 status #0", SectionOfChangesStatus];
  }
};
var SectionOfChangesFilterTitleContains = class _SectionOfChangesFilterTitleContains extends __protoMessage3159 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterTitleContains().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterTitleContains().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterTitleContains().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterTitleContains, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterTitleContains|1 text 9"];
  }
};
var SectionOfChangesFilterDescriptionContains = class _SectionOfChangesFilterDescriptionContains extends __protoMessage3159 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterDescriptionContains().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterDescriptionContains().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterDescriptionContains().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterDescriptionContains, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterDescriptionContains|1 text 9"];
  }
};
var SectionOfChangesFilterMergeBase = class _SectionOfChangesFilterMergeBase extends __protoMessage3159 {
  constructor(data) {
    super();
    this.mergeBase = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterMergeBase().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterMergeBase().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterMergeBase().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterMergeBase, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterMergeBase|1 merge_base 9"];
  }
};
var SectionOfChangesFilterTrunk = class _SectionOfChangesFilterTrunk extends __protoMessage3159 {
  constructor(data) {
    super();
    this.trunk = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterTrunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterTrunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterTrunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterTrunk, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterTrunk|1 trunk 9"];
  }
};
var SectionOfChangesFilterLastUpdated = class _SectionOfChangesFilterLastUpdated extends __protoMessage3159 {
  constructor(data) {
    super();
    this.hours = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterLastUpdated().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterLastUpdated().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterLastUpdated().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterLastUpdated, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterLastUpdated|1 hours 5"];
  }
};
var SectionOfChangesFilterOpenReviewRequestFor = class _SectionOfChangesFilterOpenReviewRequestFor extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterOpenReviewRequestFor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterOpenReviewRequestFor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterOpenReviewRequestFor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterOpenReviewRequestFor, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterOpenReviewRequestFor|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterReopenedReviewRequestFor = class _SectionOfChangesFilterReopenedReviewRequestFor extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterReopenedReviewRequestFor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterReopenedReviewRequestFor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterReopenedReviewRequestFor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterReopenedReviewRequestFor, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterReopenedReviewRequestFor|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterClosedReviewRequestFrom = class _SectionOfChangesFilterClosedReviewRequestFrom extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterClosedReviewRequestFrom().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterClosedReviewRequestFrom().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterClosedReviewRequestFrom().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterClosedReviewRequestFrom, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterClosedReviewRequestFrom|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterIncludesDirectReviewer = class _SectionOfChangesFilterIncludesDirectReviewer extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterIncludesDirectReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterIncludesDirectReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterIncludesDirectReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterIncludesDirectReviewer, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterIncludesDirectReviewer|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterAuthorIs = class _SectionOfChangesFilterAuthorIs extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterAuthorIs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterAuthorIs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterAuthorIs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterAuthorIs, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterAuthorIs|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterReviewStatus = class _SectionOfChangesFilterReviewStatus extends __protoMessage3159 {
  constructor(data) {
    super();
    this.state = SectionOfChangesReviewStatusState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterReviewStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterReviewStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterReviewStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterReviewStatus, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterReviewStatus|1 state #0", SectionOfChangesReviewStatusState];
  }
};
var SectionOfChangesFilterApprovedBy = class _SectionOfChangesFilterApprovedBy extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterApprovedBy().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterApprovedBy().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterApprovedBy().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterApprovedBy, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterApprovedBy|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterIncludesPastReviewer = class _SectionOfChangesFilterIncludesPastReviewer extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterIncludesPastReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterIncludesPastReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterIncludesPastReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterIncludesPastReviewer, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterIncludesPastReviewer|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterHasLabel = class _SectionOfChangesFilterHasLabel extends __protoMessage3159 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterHasLabel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterHasLabel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterHasLabel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterHasLabel, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterHasLabel|1 name 9"];
  }
};
var SectionOfChangesFilterNumFilesChanged = class _SectionOfChangesFilterNumFilesChanged extends __protoMessage3159 {
  constructor(data) {
    super();
    this.numFiles = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterNumFilesChanged().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterNumFilesChanged().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterNumFilesChanged().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterNumFilesChanged, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterNumFilesChanged|1 num_files 5"];
  }
};
var SectionOfChangesFilterNumLinesChanged = class _SectionOfChangesFilterNumLinesChanged extends __protoMessage3159 {
  constructor(data) {
    super();
    this.numLines = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterNumLinesChanged().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterNumLinesChanged().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterNumLinesChanged().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterNumLinesChanged, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterNumLinesChanged|1 num_lines 5"];
  }
};
var SectionOfChangesFilterIncludesReviewer = class _SectionOfChangesFilterIncludesReviewer extends __protoMessage3159 {
  constructor(data) {
    super();
    this.groupPublicIds = [];
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterIncludesReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterIncludesReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterIncludesReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterIncludesReviewer, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterIncludesReviewer|2 group_public_ids 9*|3 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterIncludesAssignee = class _SectionOfChangesFilterIncludesAssignee extends __protoMessage3159 {
  constructor(data) {
    super();
    this.cursorUserId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterIncludesAssignee().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterIncludesAssignee().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterIncludesAssignee().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterIncludesAssignee, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterIncludesAssignee|2 cursor_user_id 3"];
  }
};
var SectionOfChangesFilterIncludesDirectTeamReviewer = class _SectionOfChangesFilterIncludesDirectTeamReviewer extends __protoMessage3159 {
  constructor(data) {
    super();
    this.slug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterIncludesDirectTeamReviewer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterIncludesDirectTeamReviewer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterIncludesDirectTeamReviewer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterIncludesDirectTeamReviewer, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterIncludesDirectTeamReviewer|1 slug 9"];
  }
};
var SectionOfChangesFilterMentions = class _SectionOfChangesFilterMentions extends __protoMessage3159 {
  constructor(data) {
    super();
    this.username = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterMentions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterMentions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterMentions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterMentions, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterMentions|1 username 9"];
  }
};
var SectionOfChangesFilterUnsupported = class _SectionOfChangesFilterUnsupported extends __protoMessage3159 {
  constructor(data) {
    super();
    this.kind = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SectionOfChangesFilterUnsupported().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SectionOfChangesFilterUnsupported().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SectionOfChangesFilterUnsupported().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SectionOfChangesFilterUnsupported, a, b2);
  }
  static $() {
    return ["SectionOfChangesFilterUnsupported|1 kind 9"];
  }
};
var StartReviewRequest = class _StartReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.verdict = ReviewVerdict.UNSPECIFIED;
    this.body = "";
    this.versionNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartReviewRequest, a, b2);
  }
  static $() {
    return ["StartReviewRequest|1 change #0|2 verdict #1|3 body 9|4 version_number 4", ChangeIdentifier, ReviewVerdict];
  }
};
var StartReviewResponse = class _StartReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartReviewResponse, a, b2);
  }
  static $() {
    return ["StartReviewResponse|1 review #0", Review];
  }
};
var SubmitReviewRequest = class _SubmitReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reviewId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitReviewRequest, a, b2);
  }
  static $() {
    return ["SubmitReviewRequest|1 change #0|2 review_id 9|3 verdict #1?|4 body 9?", ChangeIdentifier, ReviewVerdict];
  }
};
var SubmitReviewResponse = class _SubmitReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SubmitReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SubmitReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SubmitReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SubmitReviewResponse, a, b2);
  }
  static $() {
    return ["SubmitReviewResponse|1 review #0", Review];
  }
};
var DiscardPendingReviewRequest = class _DiscardPendingReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    this.reviewId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiscardPendingReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiscardPendingReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiscardPendingReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiscardPendingReviewRequest, a, b2);
  }
  static $() {
    return ["DiscardPendingReviewRequest|1 change #0|2 review_id 9", ChangeIdentifier];
  }
};
var DiscardPendingReviewResponse = class _DiscardPendingReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiscardPendingReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiscardPendingReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiscardPendingReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiscardPendingReviewResponse, a, b2);
  }
  static $() {
    return ["DiscardPendingReviewResponse"];
  }
};
var GetPendingReviewRequest = class _GetPendingReviewRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPendingReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPendingReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPendingReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPendingReviewRequest, a, b2);
  }
  static $() {
    return ["GetPendingReviewRequest|1 change #0", ChangeIdentifier];
  }
};
var GetPendingReviewResponse = class _GetPendingReviewResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    this.threadCount = 0;
    this.hasPendingComments = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPendingReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPendingReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPendingReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPendingReviewResponse, a, b2);
  }
  static $() {
    return ["GetPendingReviewResponse|1 review #0?|2 thread_count 13|3 has_pending_comments 8", Review];
  }
};
var CheckChangeCreationAccessRequest = class _CheckChangeCreationAccessRequest extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckChangeCreationAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckChangeCreationAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckChangeCreationAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckChangeCreationAccessRequest, a, b2);
  }
  static $() {
    return ["CheckChangeCreationAccessRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var CheckChangeCreationAccessResponse = class _CheckChangeCreationAccessResponse extends __protoMessage3159 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckChangeCreationAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckChangeCreationAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckChangeCreationAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckChangeCreationAccessResponse, a, b2);
  }
  static $() {
    return ["CheckChangeCreationAccessResponse"];
  }
};
