/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/kv_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage106 = "agent.v1.";
var __protoMessage3105 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage106;
  }
};
var Error2 = class _Error extends __protoMessage3105 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Error().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Error().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Error().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Error, a, b2);
  }
  static $() {
    return ["Error|1 message 9"];
  }
};
var GetBlobArgs = class _GetBlobArgs extends __protoMessage3105 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobArgs, a, b2);
  }
  static $() {
    return ["GetBlobArgs|1 blob_id 12"];
  }
};
var GetBlobResult = class _GetBlobResult extends __protoMessage3105 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobResult, a, b2);
  }
  static $() {
    return ["GetBlobResult|1 blob_data 12?|2 error #0?", Error2];
  }
};
var SetBlobArgs = class _SetBlobArgs extends __protoMessage3105 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.blobData = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetBlobArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetBlobArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetBlobArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetBlobArgs, a, b2);
  }
  static $() {
    return ["SetBlobArgs|1 blob_id 12|2 blob_data 12"];
  }
};
var SetBlobResult = class _SetBlobResult extends __protoMessage3105 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetBlobResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetBlobResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetBlobResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetBlobResult, a, b2);
  }
  static $() {
    return ["SetBlobResult|1 error #0?", Error2];
  }
};
var KvServerMessage = class _KvServerMessage extends __protoMessage3105 {
  constructor(data) {
    super();
    this.id = 0;
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KvServerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KvServerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KvServerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KvServerMessage, a, b2);
  }
  static $() {
    return ["KvServerMessage|1 id 13|2 get_blob_args #0 message|3 set_blob_args #1 message|4 span_context #2?", GetBlobArgs, SetBlobArgs, SpanContext];
  }
};
var KvClientMessage = class _KvClientMessage extends __protoMessage3105 {
  constructor(data) {
    super();
    this.id = 0;
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KvClientMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KvClientMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KvClientMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KvClientMessage, a, b2);
  }
  static $() {
    return ["KvClientMessage|1 id 13|2 get_blob_result #0 message|3 set_blob_result #1 message", GetBlobResult, SetBlobResult];
  }
};

