/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_grep_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage100 = "agent.v1.";
var __protoMessage399 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage100;
  }
};
var PiGrepExecArgs = class _PiGrepExecArgs extends __protoMessage399 {
  constructor(data) {
    super();
    this.pattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiGrepExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiGrepExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiGrepExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiGrepExecArgs, a, b2);
  }
  static $() {
    return ["PiGrepExecArgs|1 pattern 9|2 path 9?|3 glob 9?|4 ignore_case 8?|5 literal 8?|6 context 5?|7 limit 5?"];
  }
};
var PiGrepExecResult = class _PiGrepExecResult extends __protoMessage399 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiGrepExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiGrepExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiGrepExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiGrepExecResult, a, b2);
  }
  static $() {
    return ["PiGrepExecResult|1 success #0 result|2 error #1 result", PiGrepExecSuccess, PiGrepExecError];
  }
};
var PiGrepExecSuccess = class _PiGrepExecSuccess extends __protoMessage399 {
  constructor(data) {
    super();
    this.output = "";
    this.linesTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiGrepExecSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiGrepExecSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiGrepExecSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiGrepExecSuccess, a, b2);
  }
  static $() {
    return ["PiGrepExecSuccess|1 output 9|2 truncation #0?|3 match_limit_reached 13?|4 lines_truncated 8", PiTruncation];
  }
};
var PiGrepExecError = class _PiGrepExecError extends __protoMessage399 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiGrepExecError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiGrepExecError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiGrepExecError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiGrepExecError, a, b2);
  }
  static $() {
    return ["PiGrepExecError|1 error 9"];
  }
};

