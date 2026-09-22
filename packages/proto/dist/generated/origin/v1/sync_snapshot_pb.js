init_esm();
init_compact();
var __protoPackage181 = "origin.v1.";
var __protoMessage3172 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage181;
  }
};
var GetChangeSyncSnapshotRequest = class _GetChangeSyncSnapshotRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeSyncSnapshotRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeSyncSnapshotRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeSyncSnapshotRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeSyncSnapshotRequest, a, b2);
  }
  static $() {
    return ["GetChangeSyncSnapshotRequest|1 identifier #0|2 change_number 4", ClientRepoIdentifier];
  }
};
var GetChangeSyncSnapshotResponse = class _GetChangeSyncSnapshotResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    this.snapshotJson = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeSyncSnapshotResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeSyncSnapshotResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeSyncSnapshotResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeSyncSnapshotResponse, a, b2);
  }
  static $() {
    return ["GetChangeSyncSnapshotResponse|1 snapshot_json 9|2 viewer_state #0", ChangeSyncViewerState];
  }
};
var ChangeSyncViewerState = class _ChangeSyncViewerState extends __protoMessage3172 {
  constructor(data) {
    super();
    this.pendingReviews = [];
    this.pendingThreads = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeSyncViewerState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeSyncViewerState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeSyncViewerState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeSyncViewerState, a, b2);
  }
  static $() {
    return ["ChangeSyncViewerState|1 timeline_viewed_at #0?|2 pending_reviews #1*|3 pending_threads #2*", Timestamp, Review, CommentThread];
  }
};
