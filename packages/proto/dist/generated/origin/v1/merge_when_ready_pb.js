/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/merge_when_ready_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage171 = "origin.v1.";
var __protoMessage3163 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage171;
  }
};
var ChangeMergeWhenReady = class _ChangeMergeWhenReady extends __protoMessage3163 {
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
    return new _ChangeMergeWhenReady().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeMergeWhenReady().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeMergeWhenReady().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeMergeWhenReady, a, b2);
  }
  static $() {
    return ["ChangeMergeWhenReady|1 id 9|2 change_id 9|3 repo_uuid 9|4 change_number 4|6 status 9|7 source 9|8 trunk_branch 9|9 lock_expires_at #0?|10 consecutive_failed_attempts 5|11 dev 8|12 repo_org 9?|13 repo_name 9?|14 enabled_by #1", Timestamp, ActorWithDisplay];
  }
};
var EnableChangeMergeWhenReadyRequest = class _EnableChangeMergeWhenReadyRequest extends __protoMessage3163 {
  constructor(data) {
    super();
    this.trunkBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnableChangeMergeWhenReadyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnableChangeMergeWhenReadyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnableChangeMergeWhenReadyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnableChangeMergeWhenReadyRequest, a, b2);
  }
  static $() {
    return ["EnableChangeMergeWhenReadyRequest|1 change #0|2 trunk_branch 9|3 source 9?|4 dev 8?", ChangeIdentifier];
  }
};
var EnableChangeMergeWhenReadyResponse = class _EnableChangeMergeWhenReadyResponse extends __protoMessage3163 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EnableChangeMergeWhenReadyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EnableChangeMergeWhenReadyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EnableChangeMergeWhenReadyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EnableChangeMergeWhenReadyResponse, a, b2);
  }
  static $() {
    return ["EnableChangeMergeWhenReadyResponse|1 record #0", ChangeMergeWhenReady];
  }
};
var GetChangeMergeWhenReadyRequest = class _GetChangeMergeWhenReadyRequest extends __protoMessage3163 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeMergeWhenReadyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeMergeWhenReadyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeMergeWhenReadyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeMergeWhenReadyRequest, a, b2);
  }
  static $() {
    return ["GetChangeMergeWhenReadyRequest|1 change #0|2 status 9?", ChangeIdentifier];
  }
};
var GetChangeMergeWhenReadyResponse = class _GetChangeMergeWhenReadyResponse extends __protoMessage3163 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeMergeWhenReadyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeMergeWhenReadyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeMergeWhenReadyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeMergeWhenReadyResponse, a, b2);
  }
  static $() {
    return ["GetChangeMergeWhenReadyResponse|1 record #0?", ChangeMergeWhenReady];
  }
};
var DisableChangeMergeWhenReadyRequest = class _DisableChangeMergeWhenReadyRequest extends __protoMessage3163 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableChangeMergeWhenReadyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableChangeMergeWhenReadyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableChangeMergeWhenReadyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableChangeMergeWhenReadyRequest, a, b2);
  }
  static $() {
    return ["DisableChangeMergeWhenReadyRequest|1 change #0", ChangeIdentifier];
  }
};
var DisableChangeMergeWhenReadyResponse = class _DisableChangeMergeWhenReadyResponse extends __protoMessage3163 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableChangeMergeWhenReadyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableChangeMergeWhenReadyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableChangeMergeWhenReadyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableChangeMergeWhenReadyResponse, a, b2);
  }
  static $() {
    return ["DisableChangeMergeWhenReadyResponse"];
  }
};

