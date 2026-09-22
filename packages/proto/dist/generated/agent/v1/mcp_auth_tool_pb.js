/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_auth_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage59, __protoMessage356, McpAuthArgs, McpAuthResult, McpAuthSuccess, McpAuthError, McpAuthRejected, McpAuthToolCall, McpAuthRequestQuery, McpAuthRequestResponse, McpAuthRequestResponse_Approved, McpAuthRequestResponse_Rejected;
var init_mcp_auth_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/mcp_auth_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage59 = "agent.v1.";
    __protoMessage356 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage59;
      }
    };
    McpAuthArgs = class _McpAuthArgs extends __protoMessage356 {
      constructor(data) {
        super();
        this.serverIdentifier = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthArgs, a, b2);
      }
      static $() {
        return ["McpAuthArgs|1 server_identifier 9|2 tool_call_id 9"];
      }
    };
    McpAuthResult = class _McpAuthResult extends __protoMessage356 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthResult, a, b2);
      }
      static $() {
        return ["McpAuthResult|1 success #0 result|2 error #1 result|3 rejected #2 result", McpAuthSuccess, McpAuthError, McpAuthRejected];
      }
    };
    McpAuthSuccess = class _McpAuthSuccess extends __protoMessage356 {
      constructor(data) {
        super();
        this.serverIdentifier = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthSuccess, a, b2);
      }
      static $() {
        return ["McpAuthSuccess|1 server_identifier 9"];
      }
    };
    McpAuthError = class _McpAuthError extends __protoMessage356 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthError, a, b2);
      }
      static $() {
        return ["McpAuthError|1 error 9"];
      }
    };
    McpAuthRejected = class _McpAuthRejected extends __protoMessage356 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthRejected, a, b2);
      }
      static $() {
        return ["McpAuthRejected|1 reason 9"];
      }
    };
    McpAuthToolCall = class _McpAuthToolCall extends __protoMessage356 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthToolCall, a, b2);
      }
      static $() {
        return ["McpAuthToolCall|1 args #0|2 result #1", McpAuthArgs, McpAuthResult];
      }
    };
    McpAuthRequestQuery = class _McpAuthRequestQuery extends __protoMessage356 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthRequestQuery, a, b2);
      }
      static $() {
        return ["McpAuthRequestQuery|1 args #0", McpAuthArgs];
      }
    };
    McpAuthRequestResponse = class _McpAuthRequestResponse extends __protoMessage356 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthRequestResponse, a, b2);
      }
      static $() {
        return ["McpAuthRequestResponse|1 approved #0 result|2 rejected #1 result", McpAuthRequestResponse_Approved, McpAuthRequestResponse_Rejected];
      }
    };
    McpAuthRequestResponse_Approved = class _McpAuthRequestResponse_Approved extends __protoMessage356 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthRequestResponse_Approved().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthRequestResponse_Approved().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthRequestResponse_Approved().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthRequestResponse_Approved, a, b2);
      }
      static $() {
        return ["McpAuthRequestResponse.Approved"];
      }
    };
    McpAuthRequestResponse_Rejected = class _McpAuthRequestResponse_Rejected extends __protoMessage356 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthRequestResponse_Rejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthRequestResponse_Rejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthRequestResponse_Rejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthRequestResponse_Rejected, a, b2);
      }
      static $() {
        return ["McpAuthRequestResponse.Rejected|1 reason 9"];
      }
    };
  }
});

