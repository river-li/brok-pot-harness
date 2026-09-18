var __protoPackage53, __protoMessage350, StartGrindExecutionArgs, StartGrindExecutionResult, StartGrindExecutionSuccess, StartGrindExecutionError, StartGrindExecutionToolCall;
var init_start_grind_execution_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/start_grind_execution_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage53 = "agent.v1.";
    __protoMessage350 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage53;
      }
    };
    StartGrindExecutionArgs = class _StartGrindExecutionArgs extends __protoMessage350 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindExecutionArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindExecutionArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindExecutionArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindExecutionArgs, a, b2);
      }
      static $() {
        return ["StartGrindExecutionArgs|1 explanation 9?|2 tool_call_id 9"];
      }
    };
    StartGrindExecutionResult = class _StartGrindExecutionResult extends __protoMessage350 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindExecutionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindExecutionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindExecutionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindExecutionResult, a, b2);
      }
      static $() {
        return ["StartGrindExecutionResult|1 success #0 result|2 error #1 result", StartGrindExecutionSuccess, StartGrindExecutionError];
      }
    };
    StartGrindExecutionSuccess = class _StartGrindExecutionSuccess extends __protoMessage350 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindExecutionSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindExecutionSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindExecutionSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindExecutionSuccess, a, b2);
      }
      static $() {
        return ["StartGrindExecutionSuccess"];
      }
    };
    StartGrindExecutionError = class _StartGrindExecutionError extends __protoMessage350 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindExecutionError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindExecutionError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindExecutionError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindExecutionError, a, b2);
      }
      static $() {
        return ["StartGrindExecutionError|1 error 9"];
      }
    };
    StartGrindExecutionToolCall = class _StartGrindExecutionToolCall extends __protoMessage350 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindExecutionToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindExecutionToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindExecutionToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindExecutionToolCall, a, b2);
      }
      static $() {
        return ["StartGrindExecutionToolCall|1 args #0|2 result #1", StartGrindExecutionArgs, StartGrindExecutionResult];
      }
    };
  }
});
