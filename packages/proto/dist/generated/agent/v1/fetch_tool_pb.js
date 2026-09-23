var __protoPackage44, __protoMessage340, FetchToolCall;
var init_fetch_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/fetch_tool_pb.js"() {
    "use strict";
    init_esm();
    init_fetch_exec_pb();
    init_compact();
    __protoPackage44 = "agent.v1.";
    __protoMessage340 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage44;
      }
    };
    FetchToolCall = class _FetchToolCall extends __protoMessage340 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchToolCall, a, b2);
      }
      static $() {
        return ["FetchToolCall|1 args #0|2 result #1", FetchArgs, FetchResult];
      }
    };
  }
});
