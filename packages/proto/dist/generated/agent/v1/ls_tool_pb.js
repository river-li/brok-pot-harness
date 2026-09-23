var __protoPackage29, __protoMessage325, LsToolCall;
var init_ls_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/ls_tool_pb.js"() {
    "use strict";
    init_esm();
    init_ls_exec_pb();
    init_compact();
    __protoPackage29 = "agent.v1.";
    __protoMessage325 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage29;
      }
    };
    LsToolCall = class _LsToolCall extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsToolCall, a, b2);
      }
      static $() {
        return ["LsToolCall|1 args #0|2 result #1", LsArgs, LsResult];
      }
    };
  }
});
