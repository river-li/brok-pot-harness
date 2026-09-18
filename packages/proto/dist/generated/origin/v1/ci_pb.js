init_compact();
var __protoPackage173 = "origin.v1.";
var __protoMessage3164 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage173;
  }
};
var CommitCheckRollupState = /* @__PURE__ */ enumType(proto3, __protoPackage173, "CommitCheckRollupState", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "SUCCESS"], [3, "PENDING"], [4, "FAILURE"]], 1);
var CheckRunAnnotationLevel = /* @__PURE__ */ enumType(proto3, __protoPackage173, "CheckRunAnnotationLevel", [[0, "UNSPECIFIED"], [1, "NOTICE"], [2, "WARNING"], [3, "FAILURE"]], 1);
var MergeabilityScope = /* @__PURE__ */ enumType(proto3, __protoPackage173, "MergeabilityScope", [[0, "UNSPECIFIED"], [1, "STACK"], [2, "SINGLE_CHANGE"]], 1);
var GetCiStateRequest = class _GetCiStateRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCiStateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCiStateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCiStateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCiStateRequest, a, b2);
  }
  static $() {
    return ["GetCiStateRequest|1 identifier #0|2 sha 9|3 change_number 4?|4 version_number 4?|5 use_latest_version 8?|6 include_check_run_annotations 8?", ClientRepoIdentifier];
  }
};
var GetCiStateResponse = class _GetCiStateResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunGroups = [];
    this.missingRequiredChecks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCiStateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCiStateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCiStateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCiStateResponse, a, b2);
  }
  static $() {
    return ["GetCiStateResponse|1 check_run_groups #0*|2 missing_required_checks #1*|3 resolved_head_sha 9?", CheckRunGroup, MissingRequiredCheck];
  }
};
var BatchGetCommitCheckRollupsRequest = class _BatchGetCommitCheckRollupsRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.shas = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetCommitCheckRollupsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetCommitCheckRollupsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetCommitCheckRollupsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetCommitCheckRollupsRequest, a, b2);
  }
  static $() {
    return ["BatchGetCommitCheckRollupsRequest|1 identifier #0|2 shas 9*", ClientRepoIdentifier];
  }
};
var CommitCheckRollup = class _CommitCheckRollup extends __protoMessage3164 {
  constructor(data) {
    super();
    this.sha = "";
    this.state = CommitCheckRollupState.UNSPECIFIED;
    this.successCount = 0;
    this.pendingCount = 0;
    this.failureCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitCheckRollup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitCheckRollup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitCheckRollup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitCheckRollup, a, b2);
  }
  static $() {
    return ["CommitCheckRollup|1 sha 9|2 state #0|3 success_count 13|4 pending_count 13|5 failure_count 13", CommitCheckRollupState];
  }
};
var BatchGetCommitCheckRollupsResponse = class _BatchGetCommitCheckRollupsResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.rollups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetCommitCheckRollupsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetCommitCheckRollupsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetCommitCheckRollupsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetCommitCheckRollupsResponse, a, b2);
  }
  static $() {
    return ["BatchGetCommitCheckRollupsResponse|1 rollups #0*", CommitCheckRollup];
  }
};
var GetCheckRunRequest = class _GetCheckRunRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCheckRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCheckRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCheckRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCheckRunRequest, a, b2);
  }
  static $() {
    return ["GetCheckRunRequest|1 identifier #0|2 check_run_id 9", ClientRepoIdentifier];
  }
};
var GetCheckRunResponse = class _GetCheckRunResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCheckRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCheckRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCheckRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCheckRunResponse, a, b2);
  }
  static $() {
    return ["GetCheckRunResponse|1 check_run #0", CheckRunStatus];
  }
};
var ListRepoCheckSourcesRequest = class _ListRepoCheckSourcesRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoCheckSourcesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoCheckSourcesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoCheckSourcesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoCheckSourcesRequest, a, b2);
  }
  static $() {
    return ["ListRepoCheckSourcesRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var RepoCheckSourceRun = class _RepoCheckSourceRun extends __protoMessage3164 {
  constructor(data) {
    super();
    this.runKey = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoCheckSourceRun().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoCheckSourceRun().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoCheckSourceRun().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoCheckSourceRun, a, b2);
  }
  static $() {
    return ["RepoCheckSourceRun|1 run_key 9|2 name 9"];
  }
};
var RepoCheckSource = class _RepoCheckSource extends __protoMessage3164 {
  constructor(data) {
    super();
    this.groupKey = "";
    this.suiteName = "";
    this.runs = [];
    this.lastSeenAtUnixMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoCheckSource().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoCheckSource().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoCheckSource().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoCheckSource, a, b2);
  }
  static $() {
    return ["RepoCheckSource|1 actor #0|2 group_key 9|3 suite_name 9|4 runs #1*|5 last_seen_at_unix_ms 3", CheckRunActor, RepoCheckSourceRun];
  }
};
var ListRepoCheckSourcesResponse = class _ListRepoCheckSourcesResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.sources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoCheckSourcesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoCheckSourcesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoCheckSourcesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoCheckSourcesResponse, a, b2);
  }
  static $() {
    return ["ListRepoCheckSourcesResponse|1 sources #0*", RepoCheckSource];
  }
};
var MissingRequiredCheck = class _MissingRequiredCheck extends __protoMessage3164 {
  constructor(data) {
    super();
    this.displayName = "";
    this.identityPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MissingRequiredCheck().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MissingRequiredCheck().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MissingRequiredCheck().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MissingRequiredCheck, a, b2);
  }
  static $() {
    return ["MissingRequiredCheck|1 display_name 9|2 identity_path 9"];
  }
};
var CheckRunActor = class _CheckRunActor extends __protoMessage3164 {
  constructor(data) {
    super();
    this.kind = "";
    this.id = "";
    this.displayName = "";
    this.iconUrl = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunActor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunActor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunActor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunActor, a, b2);
  }
  static $() {
    return ["CheckRunActor|1 kind 9|2 id 9|3 display_name 9|5 icon_url 9|6 app_id 9"];
  }
};
var CheckRunOutput = class _CheckRunOutput extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunOutput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunOutput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunOutput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunOutput, a, b2);
  }
  static $() {
    return ["CheckRunOutput|1 title 9?|2 summary 9?|3 text 9?"];
  }
};
var CheckRunStatus = class _CheckRunStatus extends __protoMessage3164 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.status = CheckRunLifecycleStatus.CHECK_RUN_LIFECYCLE_STATUS_UNSPECIFIED;
    this.externalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunStatus, a, b2);
  }
  static $() {
    return ["CheckRunStatus|1 id 9|2 name 9|4 details_url 9?|5 status #0|6 conclusion #1?|7 started_at_unix_ms 3?|8 completed_at_unix_ms 3?|9 external_id 9|10 required 8?|11 output #2?|12 deadline_at_unix_ms 3?|13 is_rerequestable 8?|14 rerequested_at_unix_ms 3?|15 annotations #3?", CheckRunLifecycleStatus, CheckRunConclusion, CheckRunOutput, CheckRunAnnotationBatch];
  }
};
var CheckRunAnnotationBatch = class _CheckRunAnnotationBatch extends __protoMessage3164 {
  constructor(data) {
    super();
    this.annotations = [];
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunAnnotationBatch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunAnnotationBatch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunAnnotationBatch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunAnnotationBatch, a, b2);
  }
  static $() {
    return ["CheckRunAnnotationBatch|1 annotations #0*|2 truncated 8", CheckRunAnnotation];
  }
};
var CheckRunGroup = class _CheckRunGroup extends __protoMessage3164 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.checkRuns = [];
    this.externalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunGroup, a, b2);
  }
  static $() {
    return ["CheckRunGroup|1 id 9|2 name 9|4 details_url 9?|5 check_runs #0*|6 actor #1|7 external_id 9", CheckRunStatus, CheckRunActor];
  }
};
var CiState = class _CiState extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunGroups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CiState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CiState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CiState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CiState, a, b2);
  }
  static $() {
    return ["CiState|1 check_run_groups #0*", CheckRunGroup];
  }
};
var PostCheckRunRequest = class _PostCheckRunRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.headSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PostCheckRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PostCheckRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PostCheckRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PostCheckRunRequest, a, b2);
  }
  static $() {
    return ["PostCheckRunRequest|1 identifier #0|2 head_sha 9|3 group #1|4 check #2", ClientRepoIdentifier, CheckRunGroupInput, CheckRunInput];
  }
};
var CheckRunGroupInput = class _CheckRunGroupInput extends __protoMessage3164 {
  constructor(data) {
    super();
    this.key = "";
    this.name = "";
    this.externalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunGroupInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunGroupInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunGroupInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunGroupInput, a, b2);
  }
  static $() {
    return ["CheckRunGroupInput|1 key 9|2 name 9|3 external_id 9|4 details_url 9?"];
  }
};
var CheckRunInput = class _CheckRunInput extends __protoMessage3164 {
  constructor(data) {
    super();
    this.key = "";
    this.name = "";
    this.externalId = "";
    this.status = CheckRunLifecycleStatus.CHECK_RUN_LIFECYCLE_STATUS_UNSPECIFIED;
    this.externalUpdatedAtUnixMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunInput, a, b2);
  }
  static $() {
    return ["CheckRunInput|1 key 9|2 name 9|3 external_id 9|4 status #0|5 conclusion #1?|6 external_updated_at_unix_ms 3|7 started_at_unix_ms 3?|8 completed_at_unix_ms 3?|10 details_url 9?|11 output #2?|12 deadline_at_unix_ms 3?|13 is_rerequestable 8?", CheckRunLifecycleStatus, CheckRunConclusion, CheckRunOutput];
  }
};
var PostCheckRunResponse = class _PostCheckRunResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.repoId = "";
    this.sha = "";
    this.checkRunGroupId = "";
    this.checkRunId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PostCheckRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PostCheckRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PostCheckRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PostCheckRunResponse, a, b2);
  }
  static $() {
    return ["PostCheckRunResponse|1 repo_id 9|2 sha 9|3 check_run_group_id 9|4 check_run_id 9"];
  }
};
var CheckRunAnnotationColumnRange = class _CheckRunAnnotationColumnRange extends __protoMessage3164 {
  constructor(data) {
    super();
    this.startColumn = 0;
    this.endColumn = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunAnnotationColumnRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunAnnotationColumnRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunAnnotationColumnRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunAnnotationColumnRange, a, b2);
  }
  static $() {
    return ["CheckRunAnnotationColumnRange|1 start_column 5|2 end_column 5"];
  }
};
var CheckRunAnnotationLocation = class _CheckRunAnnotationLocation extends __protoMessage3164 {
  constructor(data) {
    super();
    this.path = "";
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunAnnotationLocation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunAnnotationLocation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunAnnotationLocation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunAnnotationLocation, a, b2);
  }
  static $() {
    return ["CheckRunAnnotationLocation|1 path 9|2 start_line 5|3 end_line 5|4 columns #0", CheckRunAnnotationColumnRange];
  }
};
var CheckRunAnnotationInput = class _CheckRunAnnotationInput extends __protoMessage3164 {
  constructor(data) {
    super();
    this.annotationLevel = CheckRunAnnotationLevel.UNSPECIFIED;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunAnnotationInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunAnnotationInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunAnnotationInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunAnnotationInput, a, b2);
  }
  static $() {
    return ["CheckRunAnnotationInput|4 annotation_level #0|5 message 9|8 title 9?|9 raw_details 9?|11 location #1", CheckRunAnnotationLevel, CheckRunAnnotationLocation];
  }
};
var CheckRunAnnotation = class _CheckRunAnnotation extends __protoMessage3164 {
  constructor(data) {
    super();
    this.id = "";
    this.checkRunId = "";
    this.annotationLevel = CheckRunAnnotationLevel.UNSPECIFIED;
    this.message = "";
    this.createdAtUnixMs = protoInt64.zero;
    this.updatedAtUnixMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckRunAnnotation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckRunAnnotation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckRunAnnotation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckRunAnnotation, a, b2);
  }
  static $() {
    return ["CheckRunAnnotation|1 id 9|2 check_run_id 9|3 annotation_level #0|4 message 9|5 title 9?|6 raw_details 9?|7 created_at_unix_ms 3|8 updated_at_unix_ms 3|9 location #1", CheckRunAnnotationLevel, CheckRunAnnotationLocation];
  }
};
var CreateCheckRunAnnotationsRequest = class _CreateCheckRunAnnotationsRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunId = "";
    this.annotations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCheckRunAnnotationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCheckRunAnnotationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCheckRunAnnotationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCheckRunAnnotationsRequest, a, b2);
  }
  static $() {
    return ["CreateCheckRunAnnotationsRequest|1 identifier #0|2 check_run_id 9|3 annotations #1*", ClientRepoIdentifier, CheckRunAnnotationInput];
  }
};
var CreateCheckRunAnnotationsResponse = class _CreateCheckRunAnnotationsResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.annotations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCheckRunAnnotationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCheckRunAnnotationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCheckRunAnnotationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCheckRunAnnotationsResponse, a, b2);
  }
  static $() {
    return ["CreateCheckRunAnnotationsResponse|1 annotations #0*", CheckRunAnnotation];
  }
};
var ListCheckRunAnnotationsRequest = class _ListCheckRunAnnotationsRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunId = "";
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCheckRunAnnotationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCheckRunAnnotationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCheckRunAnnotationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCheckRunAnnotationsRequest, a, b2);
  }
  static $() {
    return ["ListCheckRunAnnotationsRequest|1 identifier #0|2 check_run_id 9|3 page_size 5|4 page_token 9", ClientRepoIdentifier];
  }
};
var ListCheckRunAnnotationsResponse = class _ListCheckRunAnnotationsResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.annotations = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCheckRunAnnotationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCheckRunAnnotationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCheckRunAnnotationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCheckRunAnnotationsResponse, a, b2);
  }
  static $() {
    return ["ListCheckRunAnnotationsResponse|1 annotations #0*|2 next_page_token 9", CheckRunAnnotation];
  }
};
var RerequestCheckRunRequest = class _RerequestCheckRunRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.checkRunId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RerequestCheckRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RerequestCheckRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RerequestCheckRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RerequestCheckRunRequest, a, b2);
  }
  static $() {
    return ["RerequestCheckRunRequest|1 change #0|2 check_run_id 9", ChangeIdentifier];
  }
};
var RerequestCheckRunResponse = class _RerequestCheckRunResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RerequestCheckRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RerequestCheckRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RerequestCheckRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RerequestCheckRunResponse, a, b2);
  }
  static $() {
    return ["RerequestCheckRunResponse|1 check_run #0", CheckRunStatus];
  }
};
var GetChangesetMergeabilityRequest = class _GetChangesetMergeabilityRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    this.scope = MergeabilityScope.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangesetMergeabilityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangesetMergeabilityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangesetMergeabilityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangesetMergeabilityRequest, a, b2);
  }
  static $() {
    return ["GetChangesetMergeabilityRequest|1 identifier #0|2 change_number 4|3 expected_head_sha 9?|4 scope #1", ClientRepoIdentifier, MergeabilityScope];
  }
};
var GetChangesetMergeabilityResponse = class _GetChangesetMergeabilityResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.mergeable = false;
    this.ciPassing = false;
    this.meetsApprovalRequirements = false;
    this.hasMergeConflicts = false;
    this.conflictedPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangesetMergeabilityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangesetMergeabilityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangesetMergeabilityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangesetMergeabilityResponse, a, b2);
  }
  static $() {
    return ["GetChangesetMergeabilityResponse|1 mergeable 8|2 ci_passing 8|3 ci_state #0|4 meets_approval_requirements 8|5 has_merge_conflicts 8|6 mergeability #1|7 stack_mergeability #2?|8 conflicted_paths 9*", CiState, ChangesetMergeability, StackMergeability];
  }
};
var ChangesetMergeability = class _ChangesetMergeability extends __protoMessage3164 {
  constructor(data) {
    super();
    this.verdict = "";
    this.evaluations = [];
    this.blockers = [];
    this.configurationDiagnostics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetMergeability().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetMergeability().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetMergeability().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetMergeability, a, b2);
  }
  static $() {
    return ["ChangesetMergeability|1 verdict 9|2 evaluations #0*|3 blockers #1*|4 configuration_diagnostics #2*", ChangesetRuleEvaluation, ChangesetMergeBlocker, ChangesetRuleConfigurationDiagnostic];
  }
};
var ChangesetRuleEvaluation = class _ChangesetRuleEvaluation extends __protoMessage3164 {
  constructor(data) {
    super();
    this.ruleType = "";
    this.rulesetId = "";
    this.rulesetName = "";
    this.ruleId = "";
    this.enforcement = "";
    this.result = "";
    this.message = "";
    this.category = "";
    this.violations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetRuleEvaluation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetRuleEvaluation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetRuleEvaluation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetRuleEvaluation, a, b2);
  }
  static $() {
    return ["ChangesetRuleEvaluation|1 rule_type 9|2 ruleset_id 9|3 ruleset_name 9|4 rule_id 9|5 enforcement 9|6 result 9|7 message 9|8 category 9|9 violations #0*", ChangesetRuleViolation];
  }
};
var ChangesetRuleViolation = class _ChangesetRuleViolation extends __protoMessage3164 {
  constructor(data) {
    super();
    this.ruleType = "";
    this.detail = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetRuleViolation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetRuleViolation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetRuleViolation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetRuleViolation, a, b2);
  }
  static $() {
    return ["ChangesetRuleViolation|1 rule_type 9|2 detail 9|3 remediation 9?|4 actionable_signal #0?", ChangesetRuleActionableSignal];
  }
};
var ChangesetRuleActionableSignal = class _ChangesetRuleActionableSignal extends __protoMessage3164 {
  constructor(data) {
    super();
    this.kind = "";
    this.checkNames = [];
    this.ownerLabels = [];
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetRuleActionableSignal().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetRuleActionableSignal().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetRuleActionableSignal().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetRuleActionableSignal, a, b2);
  }
  static $() {
    return ["ChangesetRuleActionableSignal|1 kind 9|2 check_names 9*|3 required_count 5?|4 actual_count 5?|5 owner_labels 9*|6 paths 9*"];
  }
};
var ChangesetMergeBlocker = class _ChangesetMergeBlocker extends __protoMessage3164 {
  constructor(data) {
    super();
    this.kind = "";
    this.mergedChangeNumbers = [];
    this.openChangeNumbers = [];
    this.conflictedPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetMergeBlocker().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetMergeBlocker().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetMergeBlocker().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetMergeBlocker, a, b2);
  }
  static $() {
    return ["ChangesetMergeBlocker|1 kind 9|2 rule_failure #0?|3 merge_ref_sha 9?|4 base_tip_sha_at_computation 9?|5 current_base_tip_sha 9?|6 ruleset_id 9?|7 rule_id 9?|8 enforcement 9?|9 message 9?|10 change_number 4?|11 merge_commit_oid 9?|12 merged_change_numbers 4*|13 open_change_numbers 4*|14 top_change_number 4?|15 downstack_change_number 4?|16 top_head_sha 9?|17 downstack_head_sha 9?|18 compare_status 9?|19 topology_reason 9?|20 root_base_ref 9?|21 conflicted_paths 9*|22 conflict_inherited_from_downstack 8?|23 recorded_base_sha 9?|24 target_base_ref 9?", ChangesetRuleEvaluation];
  }
};
var ChangesetRuleConfigurationDiagnostic = class _ChangesetRuleConfigurationDiagnostic extends __protoMessage3164 {
  constructor(data) {
    super();
    this.kind = "";
    this.severity = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangesetRuleConfigurationDiagnostic().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangesetRuleConfigurationDiagnostic().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangesetRuleConfigurationDiagnostic().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangesetRuleConfigurationDiagnostic, a, b2);
  }
  static $() {
    return ["ChangesetRuleConfigurationDiagnostic|1 kind 9|2 severity 9|3 message 9|4 ruleset_id 9?|5 rule_id 9?|6 bypass_actor_id 9?|7 enforcement 9?"];
  }
};
var StackMergeability = class _StackMergeability extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetChangeNumber = protoInt64.zero;
    this.prefixChangeNumbers = [];
    this.rootBaseRef = "";
    this.verdict = "";
    this.blockers = [];
    this.memberEvaluations = [];
    this.convergenceConflictedPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StackMergeability().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StackMergeability().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StackMergeability().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StackMergeability, a, b2);
  }
  static $() {
    return ["StackMergeability|1 target_change_number 4|2 prefix_change_numbers 4*|3 root_base_ref 9|4 verdict 9|5 blockers #0*|6 member_evaluations #1*|7 convergence_state 9?|8 convergence_conflicted_change_number 4?|9 convergence_conflicted_paths 9*|10 convergence_updated_at 9?", ChangesetMergeBlocker, StackMemberEvaluation];
  }
};
var StackMemberEvaluation = class _StackMemberEvaluation extends __protoMessage3164 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    this.role = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StackMemberEvaluation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StackMemberEvaluation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StackMemberEvaluation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StackMemberEvaluation, a, b2);
  }
  static $() {
    return ["StackMemberEvaluation|1 change_number 4|2 role 9|3 mergeability #0", ChangesetMergeability];
  }
};
var MergeStackRequest = class _MergeStackRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.topChangeNumber = protoInt64.zero;
    this.mode = MergeMode.UNSPECIFIED;
    this.expectedTargetHeadSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeStackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeStackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeStackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeStackRequest, a, b2);
  }
  static $() {
    return ["MergeStackRequest|1 identifier #0|2 top_change_number 4|3 mode #1|4 expected_target_head_sha 9|5 commit_title 9?|6 commit_message 9?", ClientRepoIdentifier, MergeMode];
  }
};
var MergeStackResponse = class _MergeStackResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.mergeCommitSha = "";
    this.mergedChangeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeStackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeStackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeStackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeStackResponse, a, b2);
  }
  static $() {
    return ["MergeStackResponse|1 merge_commit_sha 9|2 merged_change_numbers 4*"];
  }
};
var RestackStackRequest = class _RestackStackRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.topChangeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestackStackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestackStackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestackStackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestackStackRequest, a, b2);
  }
  static $() {
    return ["RestackStackRequest|1 identifier #0|2 top_change_number 4", ClientRepoIdentifier];
  }
};
var RestackStackResponse = class _RestackStackResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.restackedChangeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestackStackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestackStackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestackStackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestackStackResponse, a, b2);
  }
  static $() {
    return ["RestackStackResponse|1 restacked_change_numbers 4*"];
  }
};
