/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/system_prompt_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage84 = "agent.v1.";
var __protoMessage383 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage84;
  }
};
var SystemPromptSpec = class _SystemPromptSpec extends __protoMessage383 {
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

