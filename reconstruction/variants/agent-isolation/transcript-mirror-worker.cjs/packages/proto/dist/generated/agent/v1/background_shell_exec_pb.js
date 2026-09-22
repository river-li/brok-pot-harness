/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/background_shell_exec_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage37 = "agent.v1.";
var __protoMessage336 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage37;
  }
};
var WriteShellStdinArgs = class _WriteShellStdinArgs extends __protoMessage336 {
  constructor(data) {
    super();
    this.shellId = 0;
    this.chars = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinArgs, a, b);
  }
  static $() {
    return ["WriteShellStdinArgs|1 shell_id 13|2 chars 9"];
  }
};
var WriteShellStdinResult = class _WriteShellStdinResult extends __protoMessage336 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinResult, a, b);
  }
  static $() {
    return ["WriteShellStdinResult|1 success #0 result|2 error #1 result", WriteShellStdinSuccess, WriteShellStdinError];
  }
};
var WriteShellStdinSuccess = class _WriteShellStdinSuccess extends __protoMessage336 {
  constructor(data) {
    super();
    this.shellId = 0;
    this.terminalFileLengthBeforeInputWritten = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinSuccess, a, b);
  }
  static $() {
    return ["WriteShellStdinSuccess|1 shell_id 13|2 terminal_file_length_before_input_written 13"];
  }
};
var WriteShellStdinError = class _WriteShellStdinError extends __protoMessage336 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinError, a, b);
  }
  static $() {
    return ["WriteShellStdinError|1 error 9"];
  }
};

