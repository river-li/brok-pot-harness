/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/adopt_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage74 = "agent.v1.";
var __protoMessage373 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage74;
  }
};
var AdoptOutcome = /* @__PURE__ */ enumType(proto3, __protoPackage74, "AdoptOutcome", [[0, "UNSPECIFIED"], [1, "ALREADY_PARENTED"], [2, "EDGE_ONLY"], [3, "STORE_IMPORT_COMPLETED"]], 1);
var AdoptArgs = class _AdoptArgs extends __protoMessage373 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptArgs, a, b);
  }
  static $() {
    return ["AdoptArgs|1 source_agent_id 9"];
  }
};
var AdoptResult = class _AdoptResult extends __protoMessage373 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    this.targetAgentId = "";
    this.projectRootId = "";
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptResult, a, b);
  }
  static $() {
    return ["AdoptResult|1 source_agent_id 9|2 target_agent_id 9|3 project_root_id 9|4 success #0 result|5 error 9 result", AdoptOutcome];
  }
};
var AdoptToolCall = class _AdoptToolCall extends __protoMessage373 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptToolCall, a, b);
  }
  static $() {
    return ["AdoptToolCall|1 args #0|2 result #1", AdoptArgs, AdoptResult];
  }
};

