var __protoPackage37, __protoMessage334, CreatePlanToolCall, Phase, CreatePlanArgs, CreatePlanResult, CreatePlanSuccess, CreatePlanError, CreatePlanRequestQuery, CreatePlanRequestResponse;
var init_create_plan_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/create_plan_tool_pb.js"() {
    "use strict";
    init_esm();
    init_todo_tool_pb();
    init_compact();
    __protoPackage37 = "agent.v1.";
    __protoMessage334 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage37;
      }
    };
    CreatePlanToolCall = class _CreatePlanToolCall extends __protoMessage334 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanToolCall, a, b2);
      }
      static $() {
        return ["CreatePlanToolCall|1 args #0|2 result #1", CreatePlanArgs, CreatePlanResult];
      }
    };
    Phase = class _Phase extends __protoMessage334 {
      constructor(data) {
        super();
        this.name = "";
        this.todos = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Phase().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Phase().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Phase().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Phase, a, b2);
      }
      static $() {
        return ["Phase|1 name 9|2 todos #0*", TodoItem];
      }
    };
    CreatePlanArgs = class _CreatePlanArgs extends __protoMessage334 {
      constructor(data) {
        super();
        this.plan = "";
        this.todos = [];
        this.overview = "";
        this.name = "";
        this.isProject = false;
        this.phases = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanArgs, a, b2);
      }
      static $() {
        return ["CreatePlanArgs|1 plan 9|2 todos #0*|3 overview 9|4 name 9|5 is_project 8|6 phases #1*", TodoItem, Phase];
      }
    };
    CreatePlanResult = class _CreatePlanResult extends __protoMessage334 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        this.planUri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanResult, a, b2);
      }
      static $() {
        return ["CreatePlanResult|1 success #0 result|2 error #1 result|3 plan_uri 9", CreatePlanSuccess, CreatePlanError];
      }
    };
    CreatePlanSuccess = class _CreatePlanSuccess extends __protoMessage334 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanSuccess, a, b2);
      }
      static $() {
        return ["CreatePlanSuccess"];
      }
    };
    CreatePlanError = class _CreatePlanError extends __protoMessage334 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanError, a, b2);
      }
      static $() {
        return ["CreatePlanError|1 error 9"];
      }
    };
    CreatePlanRequestQuery = class _CreatePlanRequestQuery extends __protoMessage334 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanRequestQuery, a, b2);
      }
      static $() {
        return ["CreatePlanRequestQuery|1 args #0|2 tool_call_id 9", CreatePlanArgs];
      }
    };
    CreatePlanRequestResponse = class _CreatePlanRequestResponse extends __protoMessage334 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanRequestResponse, a, b2);
      }
      static $() {
        return ["CreatePlanRequestResponse|1 result #0", CreatePlanResult];
      }
    };
  }
});
