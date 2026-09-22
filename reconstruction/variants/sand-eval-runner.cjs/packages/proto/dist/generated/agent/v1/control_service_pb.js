/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/control_service_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage147 = "agent.v1.";
var __protoMessage3140 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage147;
  }
};
var ResourceScope = /* @__PURE__ */ enumType2(proto3, __protoPackage147, "ResourceScope", [[0, "UNSPECIFIED"], [1, "POD_VM"], [2, "CONTAINER"], [3, "HOST"]], 1);
var ResourcePressure = /* @__PURE__ */ enumType2(proto3, __protoPackage147, "ResourcePressure", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "HIGH"]], 1);
var ResourceLimits = class _ResourceLimits extends __protoMessage3140 {
  constructor(data) {
    super();
    this.scope = ResourceScope.UNSPECIFIED;
    this.memoryLimitBytes = protoInt64.zero;
    this.cpuLimitMcores = 0;
    this.diskLimitBytes = protoInt64.zero;
    this.workspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResourceLimits().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResourceLimits().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResourceLimits().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResourceLimits, a, b2);
  }
  static $() {
    return ["ResourceLimits|1 scope #0|2 memory_limit_bytes 4|3 cpu_limit_mcores 13|4 disk_limit_bytes 4|5 workspace_path 9|6 display_label 9?", ResourceScope];
  }
};
var ResourceSample = class _ResourceSample extends __protoMessage3140 {
  constructor(data) {
    super();
    this.sampledAtMs = protoInt64.zero;
    this.memoryUsedBytes = protoInt64.zero;
    this.memoryAvailableBytes = protoInt64.zero;
    this.cpuUsedMcores = 0;
    this.diskUsedBytes = protoInt64.zero;
    this.pressure = ResourcePressure.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResourceSample().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResourceSample().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResourceSample().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResourceSample, a, b2);
  }
  static $() {
    return ["ResourceSample|1 sampled_at_ms 3|2 memory_used_bytes 4|3 memory_available_bytes 4|4 cpu_used_mcores 13|5 disk_used_bytes 4|6 pressure #0", ResourcePressure];
  }
};
var GetResourceUsageResponse = class _GetResourceUsageResponse extends __protoMessage3140 {
  constructor(data) {
    super();
    this.history = [];
    this.nextCursor = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetResourceUsageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetResourceUsageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetResourceUsageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetResourceUsageResponse, a, b2);
  }
  static $() {
    return ["GetResourceUsageResponse|1 limits #0|2 current #1|3 history #1*|4 next_cursor 9", ResourceLimits, ResourceSample];
  }
};

