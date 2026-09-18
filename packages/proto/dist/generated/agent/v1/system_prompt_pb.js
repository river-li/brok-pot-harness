var __protoPackage92, __protoMessage388, SystemPromptSpec;
var init_system_prompt_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/system_prompt_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage92 = "agent.v1.";
    __protoMessage388 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage92;
      }
    };
    SystemPromptSpec = class _SystemPromptSpec extends __protoMessage388 {
      constructor(data) {
        super();
        this.spec = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SystemPromptSpec().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SystemPromptSpec().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SystemPromptSpec().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SystemPromptSpec, a, b2);
      }
      static $() {
        return ["SystemPromptSpec|1 replace 9 spec|2 append 9 spec"];
      }
    };
  }
});
