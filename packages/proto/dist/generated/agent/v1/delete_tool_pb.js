var __protoPackage20, __protoMessage316, DeleteToolCall;
var init_delete_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/delete_tool_pb.js"() {
    "use strict";
    init_esm();
    init_delete_exec_pb();
    init_compact();
    __protoPackage20 = "agent.v1.";
    __protoMessage316 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage20;
      }
    };
    DeleteToolCall = class _DeleteToolCall extends __protoMessage316 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteToolCall, a, b2);
      }
      static $() {
        return ["DeleteToolCall|1 args #0|2 result #1", DeleteArgs, DeleteResult];
      }
    };
  }
});
