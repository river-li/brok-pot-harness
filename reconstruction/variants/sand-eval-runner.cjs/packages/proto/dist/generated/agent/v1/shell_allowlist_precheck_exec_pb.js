/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/shell_allowlist_precheck_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_shell_exec_pb();
init_compact();
var __protoPackage93 = "agent.v1.";
var __protoMessage392 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage93;
  }
};
var ShellAllowlistPrecheckArgs = class _ShellAllowlistPrecheckArgs extends __protoMessage392 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShellAllowlistPrecheckArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShellAllowlistPrecheckArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShellAllowlistPrecheckArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShellAllowlistPrecheckArgs, a, b2);
  }
  static $() {
    return ["ShellAllowlistPrecheckArgs|1 command 9|2 working_directory 9|3 parsing_result #0|4 classifier_result #1?|5 tool_call_id 9?", ShellCommandParsingResult, CommandClassifierResult];
  }
};
var ShellAllowlistPrecheckResult = class _ShellAllowlistPrecheckResult extends __protoMessage392 {
  constructor(data) {
    super();
    this.allowlisted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShellAllowlistPrecheckResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShellAllowlistPrecheckResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShellAllowlistPrecheckResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShellAllowlistPrecheckResult, a, b2);
  }
  static $() {
    return ["ShellAllowlistPrecheckResult|1 allowlisted 8"];
  }
};

