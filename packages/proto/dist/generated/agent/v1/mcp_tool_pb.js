var __protoPackage34, __protoMessage330, McpToolError, McpToolResult, McpToolCall;
var init_mcp_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/mcp_tool_pb.js"() {
    "use strict";
    init_esm();
    init_mcp_exec_pb();
    init_compact();
    __protoPackage34 = "agent.v1.";
    __protoMessage330 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage34;
      }
    };
    McpToolError = class _McpToolError extends __protoMessage330 {
      constructor(data) {
        super();
        this.error = "";
        this.readToolDefReminder = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpToolError, a, b2);
      }
      static $() {
        return ["McpToolError|1 error 9|2 read_tool_def_reminder 9"];
      }
    };
    McpToolResult = class _McpToolResult extends __protoMessage330 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpToolResult, a, b2);
      }
      static $() {
        return ["McpToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 permission_denied #3 result", McpSuccess, McpToolError, McpRejected, McpPermissionDenied];
      }
    };
    McpToolCall = class _McpToolCall extends __protoMessage330 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpToolCall, a, b2);
      }
      static $() {
        return ["McpToolCall|1 args #0|2 result #1|3 description 9?", McpArgs, McpToolResult];
      }
    };
  }
});
