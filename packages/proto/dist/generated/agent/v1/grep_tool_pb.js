var __protoPackage22, __protoMessage319, GrepToolCall;
var init_grep_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/grep_tool_pb.js"() {
    "use strict";
    init_esm();
    init_grep_exec_pb();
    init_compact();
    __protoPackage22 = "agent.v1.";
    __protoMessage319 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage22;
      }
    };
    GrepToolCall = class _GrepToolCall extends __protoMessage319 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepToolCall, a, b2);
      }
      static $() {
        return ["GrepToolCall|1 args #0|2 result #1", GrepArgs, GrepResult];
      }
    };
  }
});
