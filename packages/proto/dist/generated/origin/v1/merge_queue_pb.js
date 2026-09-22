/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/merge_queue_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage172 = "origin.v1.";
var __protoMessage3164 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage172;
  }
};
var MergeQueueConfigOutcome = /* @__PURE__ */ enumType(proto3, __protoPackage172, "MergeQueueConfigOutcome", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "RE_ENABLED"], [3, "ALREADY_ENABLED"], [4, "DISABLED"], [5, "ALREADY_DISABLED"], [6, "UPDATED"], [7, "UNCHANGED"]], 1);
var EnqueueForMergeRequest = class _EnqueueForMergeRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.expectedHeadSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnqueueForMergeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnqueueForMergeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnqueueForMergeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnqueueForMergeRequest, a, b2);
  }
  static $() {
    return ["EnqueueForMergeRequest|1 change #0|2 expected_head_sha 9", ChangeIdentifier];
  }
};
var EnqueueForMergeResponse = class _EnqueueForMergeResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnqueueForMergeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnqueueForMergeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnqueueForMergeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnqueueForMergeResponse, a, b2);
  }
  static $() {
    return ["EnqueueForMergeResponse|1 entry #0", MergeQueueEntry];
  }
};
var CancelMergeQueueEntryRequest = class _CancelMergeQueueEntryRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelMergeQueueEntryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelMergeQueueEntryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelMergeQueueEntryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelMergeQueueEntryRequest, a, b2);
  }
  static $() {
    return ["CancelMergeQueueEntryRequest|1 change #0", ChangeIdentifier];
  }
};
var CancelMergeQueueEntryResponse = class _CancelMergeQueueEntryResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelMergeQueueEntryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelMergeQueueEntryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelMergeQueueEntryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelMergeQueueEntryResponse, a, b2);
  }
  static $() {
    return ["CancelMergeQueueEntryResponse|1 entry #0", MergeQueueEntry];
  }
};
var GetMergeQueueStatusRequest = class _GetMergeQueueStatusRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueStatusRequest, a, b2);
  }
  static $() {
    return ["GetMergeQueueStatusRequest|1 change #0", ChangeIdentifier];
  }
};
var GetMergeQueueStatusResponse = class _GetMergeQueueStatusResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueStatusResponse, a, b2);
  }
  static $() {
    return ["GetMergeQueueStatusResponse|1 entry #0", MergeQueueEntry];
  }
};
var GetMergeQueueRequest = class _GetMergeQueueRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueRequest, a, b2);
  }
  static $() {
    return ["GetMergeQueueRequest|1 identifier #0|2 target_ref 9", ClientRepoIdentifier];
  }
};
var GetMergeQueueResponse = class _GetMergeQueueResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueResponse, a, b2);
  }
  static $() {
    return ["GetMergeQueueResponse|1 queue #0", MergeQueueView];
  }
};
var MergeQueueConfig = class _MergeQueueConfig extends __protoMessage3164 {
  constructor(data) {
    super();
    this.queueId = "";
    this.targetRef = "";
    this.enabled = false;
    this.speculationDepth = 0;
    this.maxConcurrentValidations = 0;
    this.validationTimeoutMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueConfig, a, b2);
  }
  static $() {
    return ["MergeQueueConfig|1 queue_id 9|2 target_ref 9|3 enabled 8|4 speculation_depth 13|5 max_concurrent_validations 13|6 validation_timeout_ms 4"];
  }
};
var GetMergeQueueConfigRequest = class _GetMergeQueueConfigRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueConfigRequest, a, b2);
  }
  static $() {
    return ["GetMergeQueueConfigRequest|1 identifier #0|2 target_ref 9", ClientRepoIdentifier];
  }
};
var GetMergeQueueConfigResponse = class _GetMergeQueueConfigResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMergeQueueConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMergeQueueConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMergeQueueConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMergeQueueConfigResponse, a, b2);
  }
  static $() {
    return ["GetMergeQueueConfigResponse|1 config #0", MergeQueueConfig];
  }
};
var EnableMergeQueueRequest = class _EnableMergeQueueRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnableMergeQueueRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnableMergeQueueRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnableMergeQueueRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnableMergeQueueRequest, a, b2);
  }
  static $() {
    return ["EnableMergeQueueRequest|1 identifier #0|2 target_ref 9|3 speculation_depth 13?|4 max_concurrent_validations 13?|5 validation_timeout_ms 4?", ClientRepoIdentifier];
  }
};
var EnableMergeQueueResponse = class _EnableMergeQueueResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.outcome = MergeQueueConfigOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnableMergeQueueResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnableMergeQueueResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnableMergeQueueResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnableMergeQueueResponse, a, b2);
  }
  static $() {
    return ["EnableMergeQueueResponse|1 config #0|2 outcome #1", MergeQueueConfig, MergeQueueConfigOutcome];
  }
};
var DisableMergeQueueRequest = class _DisableMergeQueueRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableMergeQueueRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableMergeQueueRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableMergeQueueRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableMergeQueueRequest, a, b2);
  }
  static $() {
    return ["DisableMergeQueueRequest|1 identifier #0|2 target_ref 9", ClientRepoIdentifier];
  }
};
var DisableMergeQueueResponse = class _DisableMergeQueueResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.outcome = MergeQueueConfigOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableMergeQueueResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableMergeQueueResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableMergeQueueResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableMergeQueueResponse, a, b2);
  }
  static $() {
    return ["DisableMergeQueueResponse|1 config #0|2 outcome #1", MergeQueueConfig, MergeQueueConfigOutcome];
  }
};
var UpdateMergeQueueConfigRequest = class _UpdateMergeQueueConfigRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateMergeQueueConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateMergeQueueConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateMergeQueueConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateMergeQueueConfigRequest, a, b2);
  }
  static $() {
    return ["UpdateMergeQueueConfigRequest|1 identifier #0|2 target_ref 9|3 speculation_depth 13?|4 max_concurrent_validations 13?|5 validation_timeout_ms 4?", ClientRepoIdentifier];
  }
};
var UpdateMergeQueueConfigResponse = class _UpdateMergeQueueConfigResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    this.outcome = MergeQueueConfigOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateMergeQueueConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateMergeQueueConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateMergeQueueConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateMergeQueueConfigResponse, a, b2);
  }
  static $() {
    return ["UpdateMergeQueueConfigResponse|1 config #0|2 outcome #1", MergeQueueConfig, MergeQueueConfigOutcome];
  }
};
var MergeQueueView = class _MergeQueueView extends __protoMessage3164 {
  constructor(data) {
    super();
    this.targetRef = "";
    this.epoch = protoInt64.zero;
    this.entries = [];
    this.nodes = [];
    this.lands = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueView().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueView().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueView().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueView, a, b2);
  }
  static $() {
    return ["MergeQueueView|1 identifier #0|2 target_ref 9|3 epoch 4|4 entries #1*|5 nodes #2*|6 lands #3*", ClientRepoIdentifier, MergeQueueViewEntry, MergeQueueViewNode, MergeQueueViewLand];
  }
};
var MergeQueueViewEntry = class _MergeQueueViewEntry extends __protoMessage3164 {
  constructor(data) {
    super();
    this.entryId = "";
    this.pullRequests = [];
    this.position = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueViewEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueViewEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueViewEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueViewEntry, a, b2);
  }
  static $() {
    return ["MergeQueueViewEntry|1 entry_id 9|2 pull_requests #0*|3 position 13|4 status #1", MergeQueueViewPullRequest, MergeQueueEntryStatus];
  }
};
var MergeQueueViewPullRequest = class _MergeQueueViewPullRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.number = protoInt64.zero;
    this.headSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueViewPullRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueViewPullRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueViewPullRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueViewPullRequest, a, b2);
  }
  static $() {
    return ["MergeQueueViewPullRequest|1 number 4|2 head_sha 9"];
  }
};
var MergeQueueViewNode = class _MergeQueueViewNode extends __protoMessage3164 {
  constructor(data) {
    super();
    this.nodeId = "";
    this.state = MergeQueueViewNode_State.UNSPECIFIED;
    this.changeNumbers = [];
    this.assumedChangeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueViewNode().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueViewNode().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueViewNode().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueViewNode, a, b2);
  }
  static $() {
    return ["MergeQueueViewNode|1 node_id 9|2 state #0|3 tested_sha 9?|4 chain_ref 9?|5 started_at #1|6 change_numbers 4*|7 assumed_change_numbers 4*", MergeQueueViewNode_State, Timestamp];
  }
};
var MergeQueueViewNode_State = /* @__PURE__ */ enumType(proto3, __protoPackage172, "MergeQueueViewNode.State", [[0, "UNSPECIFIED"], [1, "PREPARING"], [2, "CONFLICT"], [3, "RUNNING"], [4, "GREEN"], [5, "RED"], [6, "CANCELLING"], [7, "CANCELLED"]], 1);
var MergeQueueViewLand = class _MergeQueueViewLand extends __protoMessage3164 {
  constructor(data) {
    super();
    this.moveId = "";
    this.expectedTrunkSha = "";
    this.landedSha = "";
    this.changeNumbers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueViewLand().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueViewLand().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueViewLand().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueViewLand, a, b2);
  }
  static $() {
    return ["MergeQueueViewLand|1 move_id 9|2 expected_trunk_sha 9|3 landed_sha 9|4 change_numbers 4*"];
  }
};
var MergeQueueEntry = class _MergeQueueEntry extends __protoMessage3164 {
  constructor(data) {
    super();
    this.entryId = "";
    this.targetRef = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueEntry, a, b2);
  }
  static $() {
    return ["MergeQueueEntry|1 entry_id 9|2 change #0|3 target_ref 9|4 status #1", ChangeIdentifier, MergeQueueEntryStatus];
  }
};
var MergeQueueEntryStatus = class _MergeQueueEntryStatus extends __protoMessage3164 {
  constructor(data) {
    super();
    this.kind = MergeQueueEntryStatus_Kind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MergeQueueEntryStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MergeQueueEntryStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MergeQueueEntryStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MergeQueueEntryStatus, a, b2);
  }
  static $() {
    return ["MergeQueueEntryStatus|1 kind #0|2 position 13?|3 blocked_on 9?|4 tested_sha 9?|5 failure 9?", MergeQueueEntryStatus_Kind];
  }
};
var MergeQueueEntryStatus_Kind = /* @__PURE__ */ enumType(proto3, __protoPackage172, "MergeQueueEntryStatus.Kind", [[0, "UNSPECIFIED"], [1, "QUEUED"], [2, "VALIDATING"], [3, "MERGING"], [4, "MERGED"], [5, "EVICTED"]], 1);

