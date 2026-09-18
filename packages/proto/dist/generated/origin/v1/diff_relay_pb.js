init_esm();
init_compact();
var __protoPackage163 = "origin.v1.";
var __protoMessage3155 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage163;
  }
};
var DiffRelayOwnerPrivacyClass = /* @__PURE__ */ enumType(proto3, __protoPackage163, "DiffRelayOwnerPrivacyClass", [[0, "UNSPECIFIED"], [1, "NO_DURABLE"], [2, "NO_TRAINING"], [3, "TRAINING_ALLOWED"]], 1);
var DiffRelayContentEncoding = /* @__PURE__ */ enumType(proto3, __protoPackage163, "DiffRelayContentEncoding", [[0, "UNSPECIFIED"], [1, "IDENTITY"]], 1);
var DiffRelayNotServedReason = /* @__PURE__ */ enumType(proto3, __protoPackage163, "DiffRelayNotServedReason", [[0, "UNSPECIFIED"], [1, "RELAY_DISABLED"], [2, "VIEWER_GATE_OFF"], [3, "REPO_KILL_SWITCH"], [4, "GITHUB_FACT_MISSING"], [5, "GITHUB_FACT_STALE"], [6, "MIRROR_INCOMPLETE"]], 1);
var DiffRelayTarget = class _DiffRelayTarget extends __protoMessage3155 {
  constructor(data) {
    super();
    this.headCommitSha = "";
    this.baseCommitSha = "";
    this.baseIsMergeBase = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffRelayTarget().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffRelayTarget().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffRelayTarget().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffRelayTarget, a, b2);
  }
  static $() {
    return ["DiffRelayTarget|1 identifier #0|2 change_number 4?|3 version_number 4?|4 head_commit_sha 9|5 base_commit_sha 9|6 base_is_merge_base 8|7 from #1?", ClientRepoIdentifier, DiffRelayCommitPair];
  }
};
var DiffRelayCommitPair = class _DiffRelayCommitPair extends __protoMessage3155 {
  constructor(data) {
    super();
    this.headCommitSha = "";
    this.baseCommitSha = "";
    this.baseIsMergeBase = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffRelayCommitPair().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffRelayCommitPair().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffRelayCommitPair().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffRelayCommitPair, a, b2);
  }
  static $() {
    return ["DiffRelayCommitPair|1 head_commit_sha 9|2 base_commit_sha 9|3 base_is_merge_base 8"];
  }
};
var GetDiffListingClientRequest = class _GetDiffListingClientRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.serviceRequest = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffListingClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffListingClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffListingClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffListingClientRequest, a, b2);
  }
  static $() {
    return ["GetDiffListingClientRequest|1 target #0|2 service_request 12", DiffRelayTarget];
  }
};
var StreamDiffFilesClientRequest = class _StreamDiffFilesClientRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.serviceRequest = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamDiffFilesClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamDiffFilesClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamDiffFilesClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamDiffFilesClientRequest, a, b2);
  }
  static $() {
    return ["StreamDiffFilesClientRequest|1 target #0|2 service_request 12", DiffRelayTarget];
  }
};
var GetDiffFileClientRequest = class _GetDiffFileClientRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.serviceRequest = new Uint8Array(0);
    this.shadow = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffFileClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffFileClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffFileClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffFileClientRequest, a, b2);
  }
  static $() {
    return ["GetDiffFileClientRequest|1 target #0|2 service_request 12|3 shadow 8", DiffRelayTarget];
  }
};
var GetDiffEngineInfoClientRequest = class _GetDiffEngineInfoClientRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.serviceRequest = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffEngineInfoClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffEngineInfoClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffEngineInfoClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffEngineInfoClientRequest, a, b2);
  }
  static $() {
    return ["GetDiffEngineInfoClientRequest|1 service_request 12"];
  }
};
var PortAnchorsClientRequest = class _PortAnchorsClientRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.serviceRequest = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PortAnchorsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PortAnchorsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PortAnchorsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PortAnchorsClientRequest, a, b2);
  }
  static $() {
    return ["PortAnchorsClientRequest|1 target #0|2 source #0|3 service_request 12", DiffRelayTarget];
  }
};
var OriginDiffEnvelope = class _OriginDiffEnvelope extends __protoMessage3155 {
  constructor(data) {
    super();
    this.body = { case: void 0 };
    this.contentEncoding = DiffRelayContentEncoding.UNSPECIFIED;
    this.chunkIndex = 0;
    this.done = false;
    this.ownerPrivacyClass = DiffRelayOwnerPrivacyClass.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginDiffEnvelope().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginDiffEnvelope().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginDiffEnvelope().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginDiffEnvelope, a, b2);
  }
  static $() {
    return ["OriginDiffEnvelope|1 payload 12 body|2 oversized #0 body|3 not_served #1 body|4 content_encoding #2|5 chunk_index 13|6 done 8|7 owner_privacy_class #3", DiffRelayOversized, DiffRelayNotServed, DiffRelayContentEncoding, DiffRelayOwnerPrivacyClass];
  }
};
var DiffRelayOversized = class _DiffRelayOversized extends __protoMessage3155 {
  constructor(data) {
    super();
    this.sizeBytes = protoInt64.zero;
    this.maxBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffRelayOversized().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffRelayOversized().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffRelayOversized().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffRelayOversized, a, b2);
  }
  static $() {
    return ["DiffRelayOversized|1 size_bytes 4|2 max_bytes 4"];
  }
};
var DiffRelayNotServed = class _DiffRelayNotServed extends __protoMessage3155 {
  constructor(data) {
    super();
    this.reason = DiffRelayNotServedReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffRelayNotServed().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffRelayNotServed().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffRelayNotServed().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffRelayNotServed, a, b2);
  }
  static $() {
    return ["DiffRelayNotServed|1 reason #0", DiffRelayNotServedReason];
  }
};
