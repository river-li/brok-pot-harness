var __protoPackage48, __protoMessage344, RecordScreenToolCall;
var init_record_screen_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/record_screen_tool_pb.js"() {
    "use strict";
    init_esm();
    init_record_screen_exec_pb();
    init_compact();
    __protoPackage48 = "agent.v1.";
    __protoMessage344 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage48;
      }
    };
    RecordScreenToolCall = class _RecordScreenToolCall extends __protoMessage344 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenToolCall, a, b2);
      }
      static $() {
        return ["RecordScreenToolCall|1 args #0|2 result #1", RecordScreenArgs, RecordScreenResult];
      }
    };
  }
});
