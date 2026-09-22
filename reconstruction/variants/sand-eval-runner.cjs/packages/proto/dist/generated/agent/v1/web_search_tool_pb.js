/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_search_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage30 = "agent.v1.";
var __protoMessage330 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage30;
  }
};
var WebSearchArgs = class _WebSearchArgs extends __protoMessage330 {
  constructor(data) {
    super();
    this.searchTerm = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchArgs, a, b2);
  }
  static $() {
    return ["WebSearchArgs|1 search_term 9|2 tool_call_id 9"];
  }
};
var WebSearchResult = class _WebSearchResult extends __protoMessage330 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchResult, a, b2);
  }
  static $() {
    return ["WebSearchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebSearchSuccess, WebSearchError, WebSearchRejected];
  }
};
var WebSearchSuccess = class _WebSearchSuccess extends __protoMessage330 {
  constructor(data) {
    super();
    this.references = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchSuccess, a, b2);
  }
  static $() {
    return ["WebSearchSuccess|1 references #0*", WebSearchReference];
  }
};
var WebSearchError = class _WebSearchError extends __protoMessage330 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchError, a, b2);
  }
  static $() {
    return ["WebSearchError|1 error 9"];
  }
};
var WebSearchRejected = class _WebSearchRejected extends __protoMessage330 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchRejected, a, b2);
  }
  static $() {
    return ["WebSearchRejected|1 reason 9"];
  }
};
var WebSearchReference = class _WebSearchReference extends __protoMessage330 {
  constructor(data) {
    super();
    this.title = "";
    this.url = "";
    this.chunk = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchReference, a, b2);
  }
  static $() {
    return ["WebSearchReference|1 title 9|2 url 9|3 chunk 9"];
  }
};
var WebSearchToolCall = class _WebSearchToolCall extends __protoMessage330 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchToolCall, a, b2);
  }
  static $() {
    return ["WebSearchToolCall|1 args #0|2 result #1", WebSearchArgs, WebSearchResult];
  }
};
var WebSearchRequestQuery = class _WebSearchRequestQuery extends __protoMessage330 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchRequestQuery().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchRequestQuery().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchRequestQuery().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchRequestQuery, a, b2);
  }
  static $() {
    return ["WebSearchRequestQuery|1 args #0", WebSearchArgs];
  }
};
var WebSearchRequestResponse = class _WebSearchRequestResponse extends __protoMessage330 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchRequestResponse, a, b2);
  }
  static $() {
    return ["WebSearchRequestResponse|1 approved #0 result|2 rejected #1 result", WebSearchRequestResponse_Approved, WebSearchRequestResponse_Rejected];
  }
};
var WebSearchRequestResponse_Approved = class _WebSearchRequestResponse_Approved extends __protoMessage330 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchRequestResponse_Approved().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchRequestResponse_Approved().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchRequestResponse_Approved().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchRequestResponse_Approved, a, b2);
  }
  static $() {
    return ["WebSearchRequestResponse.Approved"];
  }
};
var WebSearchRequestResponse_Rejected = class _WebSearchRequestResponse_Rejected extends __protoMessage330 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchRequestResponse_Rejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchRequestResponse_Rejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchRequestResponse_Rejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchRequestResponse_Rejected, a, b2);
  }
  static $() {
    return ["WebSearchRequestResponse.Rejected|1 reason 9"];
  }
};

