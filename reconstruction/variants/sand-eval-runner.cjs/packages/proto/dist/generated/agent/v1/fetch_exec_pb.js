/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/fetch_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage34 = "agent.v1.";
var __protoMessage334 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage34;
  }
};
var FetchArgs = class _FetchArgs extends __protoMessage334 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchArgs, a, b2);
  }
  static $() {
    return ["FetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var FetchResult = class _FetchResult extends __protoMessage334 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchResult, a, b2);
  }
  static $() {
    return ["FetchResult|1 success #0 result|2 error #1 result", FetchSuccess, FetchError];
  }
};
var FetchSuccess = class _FetchSuccess extends __protoMessage334 {
  constructor(data) {
    super();
    this.url = "";
    this.content = "";
    this.statusCode = 0;
    this.contentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchSuccess, a, b2);
  }
  static $() {
    return ["FetchSuccess|1 url 9|2 content 9|3 status_code 5|4 content_type 9"];
  }
};
var FetchError = class _FetchError extends __protoMessage334 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchError, a, b2);
  }
  static $() {
    return ["FetchError|1 url 9|2 error 9"];
  }
};

