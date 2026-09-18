var __protoPackage54, __protoMessage351, StartGrindPlanningArgs, StartGrindPlanningResult, StartGrindPlanningSuccess, StartGrindPlanningError, StartGrindPlanningToolCall;
var init_start_grind_planning_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/start_grind_planning_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage54 = "agent.v1.";
    __protoMessage351 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage54;
      }
    };
    StartGrindPlanningArgs = class _StartGrindPlanningArgs extends __protoMessage351 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindPlanningArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindPlanningArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindPlanningArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindPlanningArgs, a, b2);
      }
      static $() {
        return ["StartGrindPlanningArgs|1 explanation 9?|2 tool_call_id 9"];
      }
    };
    StartGrindPlanningResult = class _StartGrindPlanningResult extends __protoMessage351 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindPlanningResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindPlanningResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindPlanningResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindPlanningResult, a, b2);
      }
      static $() {
        return ["StartGrindPlanningResult|1 success #0 result|2 error #1 result", StartGrindPlanningSuccess, StartGrindPlanningError];
      }
    };
    StartGrindPlanningSuccess = class _StartGrindPlanningSuccess extends __protoMessage351 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindPlanningSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindPlanningSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindPlanningSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindPlanningSuccess, a, b2);
      }
      static $() {
        return ["StartGrindPlanningSuccess"];
      }
    };
    StartGrindPlanningError = class _StartGrindPlanningError extends __protoMessage351 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindPlanningError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindPlanningError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindPlanningError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindPlanningError, a, b2);
      }
      static $() {
        return ["StartGrindPlanningError|1 error 9"];
      }
    };
    StartGrindPlanningToolCall = class _StartGrindPlanningToolCall extends __protoMessage351 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartGrindPlanningToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartGrindPlanningToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartGrindPlanningToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartGrindPlanningToolCall, a, b2);
      }
      static $() {
        return ["StartGrindPlanningToolCall|1 args #0|2 result #1", StartGrindPlanningArgs, StartGrindPlanningResult];
      }
    };
  }
});
