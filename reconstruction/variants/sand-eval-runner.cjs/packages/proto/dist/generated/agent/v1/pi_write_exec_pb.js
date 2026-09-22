/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_write_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage99 = "agent.v1.";
var __protoMessage398 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage99;
  }
};
var PiWriteExecArgs = class _PiWriteExecArgs extends __protoMessage398 {
  constructor(data) {
    super();
    this.path = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiWriteExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiWriteExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiWriteExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiWriteExecArgs, a, b2);
  }
  static $() {
    return ["PiWriteExecArgs|1 path 9|2 content 9"];
  }
};
var PiWriteExecResult = class _PiWriteExecResult extends __protoMessage398 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiWriteExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiWriteExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiWriteExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiWriteExecResult, a, b2);
  }
  static $() {
    return ["PiWriteExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiWriteExecSuccess, PiWriteExecError, PiWriteExecRejected];
  }
};
var PiWriteExecSuccess = class _PiWriteExecSuccess extends __protoMessage398 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiWriteExecSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiWriteExecSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiWriteExecSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiWriteExecSuccess, a, b2);
  }
  static $() {
    return ["PiWriteExecSuccess|1 output 9"];
  }
};
var PiWriteExecError = class _PiWriteExecError extends __protoMessage398 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiWriteExecError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiWriteExecError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiWriteExecError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiWriteExecError, a, b2);
  }
  static $() {
    return ["PiWriteExecError|1 error 9"];
  }
};
var PiWriteExecRejected = class _PiWriteExecRejected extends __protoMessage398 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiWriteExecRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiWriteExecRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiWriteExecRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiWriteExecRejected, a, b2);
  }
  static $() {
    return ["PiWriteExecRejected|1 reason 9"];
  }
};

