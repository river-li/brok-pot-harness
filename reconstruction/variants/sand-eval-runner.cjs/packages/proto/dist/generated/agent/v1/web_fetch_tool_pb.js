/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_fetch_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_utils_pb();
init_compact();
var __protoPackage47 = "agent.v1.";
var __protoMessage347 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage47;
  }
};
var WebFetchArgs = class _WebFetchArgs extends __protoMessage347 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchArgs, a, b2);
  }
  static $() {
    return ["WebFetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var WebFetchResult = class _WebFetchResult extends __protoMessage347 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchResult, a, b2);
  }
  static $() {
    return ["WebFetchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebFetchSuccess, WebFetchError, WebFetchRejected];
  }
};
var WebFetchSuccess = class _WebFetchSuccess extends __protoMessage347 {
  constructor(data) {
    super();
    this.url = "";
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchSuccess, a, b2);
  }
  static $() {
    return ["WebFetchSuccess|1 url 9|2 markdown 9|3 output_location #0?", OutputLocation];
  }
};
var WebFetchError = class _WebFetchError extends __protoMessage347 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchError, a, b2);
  }
  static $() {
    return ["WebFetchError|1 url 9|2 error 9"];
  }
};
var WebFetchRejected = class _WebFetchRejected extends __protoMessage347 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchRejected, a, b2);
  }
  static $() {
    return ["WebFetchRejected|1 reason 9"];
  }
};
var WebFetchToolCall = class _WebFetchToolCall extends __protoMessage347 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchToolCall, a, b2);
  }
  static $() {
    return ["WebFetchToolCall|1 args #0|2 result #1", WebFetchArgs, WebFetchResult];
  }
};
var WebFetchRequestQuery = class _WebFetchRequestQuery extends __protoMessage347 {
  constructor(data) {
    super();
    this.skipApproval = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchRequestQuery().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchRequestQuery().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchRequestQuery().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchRequestQuery, a, b2);
  }
  static $() {
    return ["WebFetchRequestQuery|1 args #0|2 skip_approval 8|3 smart_mode_approval #1", WebFetchArgs, SmartModeApproval];
  }
};
var WebFetchRequestResponse = class _WebFetchRequestResponse extends __protoMessage347 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchRequestResponse, a, b2);
  }
  static $() {
    return ["WebFetchRequestResponse|1 approved #0 result|2 rejected #1 result", WebFetchRequestResponse_Approved, WebFetchRequestResponse_Rejected];
  }
};
var WebFetchRequestResponse_Approved = class _WebFetchRequestResponse_Approved extends __protoMessage347 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchRequestResponse_Approved().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchRequestResponse_Approved().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchRequestResponse_Approved().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchRequestResponse_Approved, a, b2);
  }
  static $() {
    return ["WebFetchRequestResponse.Approved"];
  }
};
var WebFetchRequestResponse_Rejected = class _WebFetchRequestResponse_Rejected extends __protoMessage347 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchRequestResponse_Rejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchRequestResponse_Rejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchRequestResponse_Rejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchRequestResponse_Rejected, a, b2);
  }
  static $() {
    return ["WebFetchRequestResponse.Rejected|1 reason 9"];
  }
};

