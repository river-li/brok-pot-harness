/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_bash_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage97 = "agent.v1.";
var __protoMessage396 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage97;
  }
};
var PiBashExecArgs = class _PiBashExecArgs extends __protoMessage396 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiBashExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiBashExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiBashExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiBashExecArgs, a, b2);
  }
  static $() {
    return ["PiBashExecArgs|1 command 9|2 timeout 1?"];
  }
};
var PiBashExecResult = class _PiBashExecResult extends __protoMessage396 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiBashExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiBashExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiBashExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiBashExecResult, a, b2);
  }
  static $() {
    return ["PiBashExecResult|1 success #0 result|2 error #1 result", PiBashExecSuccess, PiBashExecError];
  }
};
var PiBashExecSuccess = class _PiBashExecSuccess extends __protoMessage396 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiBashExecSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiBashExecSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiBashExecSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiBashExecSuccess, a, b2);
  }
  static $() {
    return ["PiBashExecSuccess|1 output 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
  }
};
var PiBashExecError = class _PiBashExecError extends __protoMessage396 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PiBashExecError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PiBashExecError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PiBashExecError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PiBashExecError, a, b2);
  }
  static $() {
    return ["PiBashExecError|1 error 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
  }
};

