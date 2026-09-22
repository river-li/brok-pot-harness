/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/conversation_search_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage82, __protoMessage379, ConversationSearchSource, ConversationSearchArgs, ConversationSearchResult, ConversationSearchSuccess, ConversationSearchHit, ConversationSearchError;
var init_conversation_search_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/conversation_search_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage82 = "agent.v1.";
    __protoMessage379 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage82;
      }
    };
    ConversationSearchSource = /* @__PURE__ */ enumType(proto3, __protoPackage82, "ConversationSearchSource", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD_CACHE"]], 1);
    ConversationSearchArgs = class _ConversationSearchArgs extends __protoMessage379 {
      constructor(data) {
        super();
        this.query = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSearchArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSearchArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSearchArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSearchArgs, a, b2);
      }
      static $() {
        return ["ConversationSearchArgs|1 query 9|2 tool_call_id 9|3 limit 5?"];
      }
    };
    ConversationSearchResult = class _ConversationSearchResult extends __protoMessage379 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSearchResult, a, b2);
      }
      static $() {
        return ["ConversationSearchResult|1 success #0 result|2 error #1 result", ConversationSearchSuccess, ConversationSearchError];
      }
    };
    ConversationSearchSuccess = class _ConversationSearchSuccess extends __protoMessage379 {
      constructor(data) {
        super();
        this.hits = [];
        this.truncated = false;
        this.partial = false;
        this.rebuilding = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSearchSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSearchSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSearchSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSearchSuccess, a, b2);
      }
      static $() {
        return ["ConversationSearchSuccess|1 hits #0*|2 truncated 8|3 partial 8|4 rebuilding 8", ConversationSearchHit];
      }
    };
    ConversationSearchHit = class _ConversationSearchHit extends __protoMessage379 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.title = "";
        this.source = ConversationSearchSource.UNSPECIFIED;
        this.updatedAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSearchHit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSearchHit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSearchHit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSearchHit, a, b2);
      }
      static $() {
        return ["ConversationSearchHit|1 conversation_id 9|2 title 9|3 source #0|4 updated_at_ms 3|5 snippet 9?", ConversationSearchSource];
      }
    };
    ConversationSearchError = class _ConversationSearchError extends __protoMessage379 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSearchError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSearchError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSearchError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSearchError, a, b2);
      }
      static $() {
        return ["ConversationSearchError|1 error 9"];
      }
    };
  }
});

