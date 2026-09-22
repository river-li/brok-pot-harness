/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_search_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage27 = "agent.v1.";
var __protoMessage326 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage27;
  }
};
var WebSearchArgs = class _WebSearchArgs extends __protoMessage326 {
  constructor(data) {
    super();
    this.searchTerm = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchArgs, a, b);
  }
  static $() {
    return ["WebSearchArgs|1 search_term 9|2 tool_call_id 9"];
  }
};
var WebSearchResult = class _WebSearchResult extends __protoMessage326 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchResult, a, b);
  }
  static $() {
    return ["WebSearchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebSearchSuccess, WebSearchError, WebSearchRejected];
  }
};
var WebSearchSuccess = class _WebSearchSuccess extends __protoMessage326 {
  constructor(data) {
    super();
    this.references = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchSuccess, a, b);
  }
  static $() {
    return ["WebSearchSuccess|1 references #0*", WebSearchReference];
  }
};
var WebSearchError = class _WebSearchError extends __protoMessage326 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchError, a, b);
  }
  static $() {
    return ["WebSearchError|1 error 9"];
  }
};
var WebSearchRejected = class _WebSearchRejected extends __protoMessage326 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchRejected, a, b);
  }
  static $() {
    return ["WebSearchRejected|1 reason 9"];
  }
};
var WebSearchReference = class _WebSearchReference extends __protoMessage326 {
  constructor(data) {
    super();
    this.title = "";
    this.url = "";
    this.chunk = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchReference().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchReference().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchReference().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchReference, a, b);
  }
  static $() {
    return ["WebSearchReference|1 title 9|2 url 9|3 chunk 9"];
  }
};
var WebSearchToolCall = class _WebSearchToolCall extends __protoMessage326 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchToolCall, a, b);
  }
  static $() {
    return ["WebSearchToolCall|1 args #0|2 result #1", WebSearchArgs, WebSearchResult];
  }
};

