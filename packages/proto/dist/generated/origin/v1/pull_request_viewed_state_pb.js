/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/pull_request_viewed_state_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage169 = "origin.v1.";
var __protoMessage3161 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage169;
  }
};
var PullRequestViewedCursor = /* @__PURE__ */ enumType(proto3, __protoPackage169, "PullRequestViewedCursor", [[0, "UNSPECIFIED"], [1, "OPENED"], [2, "TIMELINE"]], 1);
var MarkPullRequestAsViewedRequest = class _MarkPullRequestAsViewedRequest extends __protoMessage3161 {
  constructor(data) {
    super();
    this.cursor = PullRequestViewedCursor.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkPullRequestAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkPullRequestAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkPullRequestAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkPullRequestAsViewedRequest, a, b2);
  }
  static $() {
    return ["MarkPullRequestAsViewedRequest|1 change #0|2 viewed_at #1|3 cursor #2", ChangeIdentifier, Timestamp, PullRequestViewedCursor];
  }
};
var MarkPullRequestAsViewedResponse = class _MarkPullRequestAsViewedResponse extends __protoMessage3161 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkPullRequestAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkPullRequestAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkPullRequestAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkPullRequestAsViewedResponse, a, b2);
  }
  static $() {
    return ["MarkPullRequestAsViewedResponse|1 viewed_at #0|2 timeline_viewed_at #0?", Timestamp];
  }
};

