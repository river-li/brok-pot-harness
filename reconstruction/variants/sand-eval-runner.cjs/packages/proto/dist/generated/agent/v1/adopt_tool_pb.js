/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/adopt_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage77 = "agent.v1.";
var __protoMessage377 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage77;
  }
};
var AdoptOutcome = /* @__PURE__ */ enumType2(proto3, __protoPackage77, "AdoptOutcome", [[0, "UNSPECIFIED"], [1, "ALREADY_PARENTED"], [2, "EDGE_ONLY"], [3, "STORE_IMPORT_COMPLETED"]], 1);
var AdoptArgs = class _AdoptArgs extends __protoMessage377 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdoptArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdoptArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdoptArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdoptArgs, a, b2);
  }
  static $() {
    return ["AdoptArgs|1 source_agent_id 9"];
  }
};
var AdoptResult = class _AdoptResult extends __protoMessage377 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    this.targetAgentId = "";
    this.projectRootId = "";
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdoptResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdoptResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdoptResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdoptResult, a, b2);
  }
  static $() {
    return ["AdoptResult|1 source_agent_id 9|2 target_agent_id 9|3 project_root_id 9|4 success #0 result|5 error 9 result", AdoptOutcome];
  }
};
var AdoptToolCall = class _AdoptToolCall extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdoptToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdoptToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdoptToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdoptToolCall, a, b2);
  }
  static $() {
    return ["AdoptToolCall|1 args #0|2 result #1", AdoptArgs, AdoptResult];
  }
};

