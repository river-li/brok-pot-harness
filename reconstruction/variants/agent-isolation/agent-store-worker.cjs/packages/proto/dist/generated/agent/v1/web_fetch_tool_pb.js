/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_fetch_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage44 = "agent.v1.";
var __protoMessage343 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage44;
  }
};
var WebFetchArgs = class _WebFetchArgs extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchArgs, a, b);
  }
  static $() {
    return ["WebFetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var WebFetchResult = class _WebFetchResult extends __protoMessage343 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchResult, a, b);
  }
  static $() {
    return ["WebFetchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebFetchSuccess, WebFetchError, WebFetchRejected];
  }
};
var WebFetchSuccess = class _WebFetchSuccess extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchSuccess, a, b);
  }
  static $() {
    return ["WebFetchSuccess|1 url 9|2 markdown 9|3 output_location #0?", OutputLocation];
  }
};
var WebFetchError = class _WebFetchError extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchError, a, b);
  }
  static $() {
    return ["WebFetchError|1 url 9|2 error 9"];
  }
};
var WebFetchRejected = class _WebFetchRejected extends __protoMessage343 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchRejected, a, b);
  }
  static $() {
    return ["WebFetchRejected|1 reason 9"];
  }
};
var WebFetchToolCall = class _WebFetchToolCall extends __protoMessage343 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchToolCall, a, b);
  }
  static $() {
    return ["WebFetchToolCall|1 args #0|2 result #1", WebFetchArgs, WebFetchResult];
  }
};

