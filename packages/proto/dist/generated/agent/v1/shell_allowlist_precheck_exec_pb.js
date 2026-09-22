/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/shell_allowlist_precheck_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage106, __protoMessage3102, ShellAllowlistPrecheckArgs, ShellAllowlistPrecheckResult;
var init_shell_allowlist_precheck_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/shell_allowlist_precheck_exec_pb.js"() {
    "use strict";
    init_esm();
    init_shell_exec_pb();
    init_compact();
    __protoPackage106 = "agent.v1.";
    __protoMessage3102 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage106;
      }
    };
    ShellAllowlistPrecheckArgs = class _ShellAllowlistPrecheckArgs extends __protoMessage3102 {
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
    ShellAllowlistPrecheckResult = class _ShellAllowlistPrecheckResult extends __protoMessage3102 {
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
  }
});

