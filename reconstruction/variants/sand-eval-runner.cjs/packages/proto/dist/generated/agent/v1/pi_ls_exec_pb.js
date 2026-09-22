/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_ls_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage102 = "agent.v1.";
var __protoMessage3101 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage102;
  }
};
var PiLsExecArgs = class _PiLsExecArgs extends __protoMessage3101 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiLsExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiLsExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiLsExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiLsExecArgs, a, b2);
  }
  static $() {
    return ["PiLsExecArgs|1 path 9?|2 limit 5?"];
  }
};
var PiLsExecResult = class _PiLsExecResult extends __protoMessage3101 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiLsExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiLsExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiLsExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiLsExecResult, a, b2);
  }
  static $() {
    return ["PiLsExecResult|1 success #0 result|2 error #1 result", PiLsExecSuccess, PiLsExecError];
  }
};
var PiLsExecSuccess = class _PiLsExecSuccess extends __protoMessage3101 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiLsExecSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiLsExecSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiLsExecSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiLsExecSuccess, a, b2);
  }
  static $() {
    return ["PiLsExecSuccess|1 output 9|2 truncation #0?|3 entry_limit_reached 13?", PiTruncation];
  }
};
var PiLsExecError = class _PiLsExecError extends __protoMessage3101 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiLsExecError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiLsExecError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiLsExecError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiLsExecError, a, b2);
  }
  static $() {
    return ["PiLsExecError|1 error 9"];
  }
};

