/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/hook_additional_context_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage4 = "agent.v1.";
var __protoMessage34 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage4;
  }
};
var HookAdditionalContext = class _HookAdditionalContext extends __protoMessage34 {
  constructor(data) {
    super();
    this.hookEventName = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _HookAdditionalContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _HookAdditionalContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _HookAdditionalContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_HookAdditionalContext, a, b);
  }
  static $() {
    return ["HookAdditionalContext|1 hook_event_name 9|2 content 9"];
  }
};

