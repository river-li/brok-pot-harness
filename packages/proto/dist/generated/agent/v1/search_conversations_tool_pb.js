var __protoPackage83, __protoMessage380, SearchConversationsToolCall;
var init_search_conversations_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/search_conversations_tool_pb.js"() {
    "use strict";
    init_esm();
    init_conversation_search_exec_pb();
    init_compact();
    __protoPackage83 = "agent.v1.";
    __protoMessage380 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage83;
      }
    };
    SearchConversationsToolCall = class _SearchConversationsToolCall extends __protoMessage380 {
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
  }
});
