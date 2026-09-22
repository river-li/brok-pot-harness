/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/hook_additional_context_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage6, __protoMessage36, HookAdditionalContext;
var init_hook_additional_context_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/hook_additional_context_pb.js"() {
    "use strict";
    init_esm13();
    init_compact();
    __protoPackage6 = "agent.v1.";
    __protoMessage36 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage6;
      }
    };
    HookAdditionalContext = class _HookAdditionalContext extends __protoMessage36 {
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

