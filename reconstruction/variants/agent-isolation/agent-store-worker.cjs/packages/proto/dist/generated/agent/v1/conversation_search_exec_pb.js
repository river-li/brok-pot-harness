/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/conversation_search_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage71 = "agent.v1.";
var __protoMessage370 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage71;
  }
};
var ConversationSearchSource = /* @__PURE__ */ enumType(proto3, __protoPackage71, "ConversationSearchSource", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD_CACHE"]], 1);
var ConversationSearchArgs = class _ConversationSearchArgs extends __protoMessage370 {
  constructor(data) {
    super();
    this.query = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchArgs, a, b);
  }
  static $() {
    return ["ConversationSearchArgs|1 query 9|2 tool_call_id 9|3 limit 5?"];
  }
};
var ConversationSearchResult = class _ConversationSearchResult extends __protoMessage370 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchResult, a, b);
  }
  static $() {
    return ["ConversationSearchResult|1 success #0 result|2 error #1 result", ConversationSearchSuccess, ConversationSearchError];
  }
};
var ConversationSearchSuccess = class _ConversationSearchSuccess extends __protoMessage370 {
  constructor(data) {
    super();
    this.hits = [];
    this.truncated = false;
    this.partial = false;
    this.rebuilding = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchSuccess, a, b);
  }
  static $() {
    return ["ConversationSearchSuccess|1 hits #0*|2 truncated 8|3 partial 8|4 rebuilding 8", ConversationSearchHit];
  }
};
var ConversationSearchHit = class _ConversationSearchHit extends __protoMessage370 {
  constructor(data) {
    super();
    this.conversationId = "";
    this.title = "";
    this.source = ConversationSearchSource.UNSPECIFIED;
    this.updatedAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchHit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchHit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchHit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchHit, a, b);
  }
  static $() {
    return ["ConversationSearchHit|1 conversation_id 9|2 title 9|3 source #0|4 updated_at_ms 3|5 snippet 9?", ConversationSearchSource];
  }
};
var ConversationSearchError = class _ConversationSearchError extends __protoMessage370 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchError, a, b);
  }
  static $() {
    return ["ConversationSearchError|1 error 9"];
  }
};

