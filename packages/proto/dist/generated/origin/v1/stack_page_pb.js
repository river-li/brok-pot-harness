init_compact();
var __protoPackage175 = "origin.v1.";
var __protoMessage3166 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage175;
  }
};
var GetChangeStackPageDataRequest = class _GetChangeStackPageDataRequest extends __protoMessage3166 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeStackPageDataRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeStackPageDataRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeStackPageDataRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeStackPageDataRequest, a, b2);
  }
  static $() {
    return ["GetChangeStackPageDataRequest|1 change #0", ChangeIdentifier];
  }
};
var GetChangeStackPageDataResponse = class _GetChangeStackPageDataResponse extends __protoMessage3166 {
  constructor(data) {
    super();
    this.mirrorStatus = MirrorStatus.UNSPECIFIED;
    this.items = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeStackPageDataResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeStackPageDataResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeStackPageDataResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeStackPageDataResponse, a, b2);
  }
  static $() {
    return ["GetChangeStackPageDataResponse|1 mirror_status #0|2 items #1*|3 reviewer_candidates #2", MirrorStatus, ChangeStackPageItem, ListOriginRepoReviewerCandidatesResponse];
  }
};
var ChangeStackPageItem = class _ChangeStackPageItem extends __protoMessage3166 {
  constructor(data) {
    super();
    this.versions = [];
    this.assignments = [];
    this.reviews = [];
    this.totalThreadCount = 0;
    this.unresolvedThreadCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeStackPageItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeStackPageItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeStackPageItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeStackPageItem, a, b2);
  }
  static $() {
    return ["ChangeStackPageItem|1 change #0|2 versions #1*|3 assignments #2*|4 reviews #3*|5 mergeability #4|6 total_thread_count 5|7 unresolved_thread_count 5", Change, Version2, ChangeAssignment, Review, GetChangesetMergeabilityResponse];
  }
};
