/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/search_conversations_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();

// @recovered-fragment 2/2
init_compact();
var __protoPackage75 = "agent.v1.";
var __protoMessage375 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage75;
  }
};
var SearchConversationsToolCall = class _SearchConversationsToolCall extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchConversationsToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchConversationsToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchConversationsToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchConversationsToolCall, a, b2);
  }
  static $() {
    return ["SearchConversationsToolCall|1 args #0|2 result #1", ConversationSearchArgs, ConversationSearchResult];
  }
};

