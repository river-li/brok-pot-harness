/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/shell_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage17, __protoMessage314, ShellToolCall, ShellToolCallStdoutDelta, ShellToolCallStderrDelta, ShellToolCallDelta;
var init_shell_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/shell_tool_pb.js"() {
    "use strict";
    init_esm();
    init_shell_exec_pb();
    init_compact();
    __protoPackage17 = "agent.v1.";
    __protoMessage314 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage17;
      }
    };
    ShellToolCall = class _ShellToolCall extends __protoMessage314 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellToolCall, a, b2);
      }
      static $() {
        return ["ShellToolCall|1 args #0|2 result #1|3 description 9?", ShellArgs, ShellResult];
      }
    };
    ShellToolCallStdoutDelta = class _ShellToolCallStdoutDelta extends __protoMessage314 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellToolCallStdoutDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellToolCallStdoutDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellToolCallStdoutDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellToolCallStdoutDelta, a, b2);
      }
      static $() {
        return ["ShellToolCallStdoutDelta|1 content 9"];
      }
    };
    ShellToolCallStderrDelta = class _ShellToolCallStderrDelta extends __protoMessage314 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellToolCallStderrDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellToolCallStderrDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellToolCallStderrDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellToolCallStderrDelta, a, b2);
      }
      static $() {
        return ["ShellToolCallStderrDelta|1 content 9"];
      }
    };
    ShellToolCallDelta = class _ShellToolCallDelta extends __protoMessage314 {
      constructor(data) {
        super();
        this.delta = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellToolCallDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellToolCallDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellToolCallDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellToolCallDelta, a, b2);
      }
      static $() {
        return ["ShellToolCallDelta|1 stdout #0 delta|2 stderr #1 delta", ShellToolCallStdoutDelta, ShellToolCallStderrDelta];
      }
    };
  }
});

