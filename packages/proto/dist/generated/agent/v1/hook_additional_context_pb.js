var __protoPackage15, __protoMessage312, HookAdditionalContext;
var init_hook_additional_context_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/hook_additional_context_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage15 = "agent.v1.";
    __protoMessage312 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage15;
      }
    };
    HookAdditionalContext = class _HookAdditionalContext extends __protoMessage312 {
      constructor(data) {
        super();
        this.hookEventName = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _HookAdditionalContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _HookAdditionalContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _HookAdditionalContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_HookAdditionalContext, a, b2);
      }
      static $() {
        return ["HookAdditionalContext|1 hook_event_name 9|2 content 9"];
      }
    };
  }
});
