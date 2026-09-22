/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/search_conversations_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage72 = "agent.v1.";
var __protoMessage371 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage72;
  }
};
var SearchConversationsToolCall = class _SearchConversationsToolCall extends __protoMessage371 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SearchConversationsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SearchConversationsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SearchConversationsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SearchConversationsToolCall, a, b);
  }
  static $() {
    return ["SearchConversationsToolCall|1 args #0|2 result #1", ConversationSearchArgs, ConversationSearchResult];
  }
};

