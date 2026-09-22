/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/fetch_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage31 = "agent.v1.";
var __protoMessage330 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage31;
  }
};
var FetchArgs = class _FetchArgs extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchArgs, a, b);
  }
  static $() {
    return ["FetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var FetchResult = class _FetchResult extends __protoMessage330 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchResult, a, b);
  }
  static $() {
    return ["FetchResult|1 success #0 result|2 error #1 result", FetchSuccess, FetchError];
  }
};
var FetchSuccess = class _FetchSuccess extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.content = "";
    this.statusCode = 0;
    this.contentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchSuccess, a, b);
  }
  static $() {
    return ["FetchSuccess|1 url 9|2 content 9|3 status_code 5|4 content_type 9"];
  }
};
var FetchError = class _FetchError extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchError, a, b);
  }
  static $() {
    return ["FetchError|1 url 9|2 error 9"];
  }
};

