var __protoPackage138, __protoMessage3131, AgentStartupTraceEvent, AgentStartupTraceEvent_ContextLink, AgentStartupTraceEvent_SpanStarted, AgentStartupTraceEvent_SpanEnded, AgentStartupTraceEvent_UserAction, AgentStartupTraceEvent_TurnClose;
var init_agent_startup_trace_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/agent_startup_trace_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage138 = "aiserver.v1.";
    __protoMessage3131 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage138;
      }
    };
    AgentStartupTraceEvent = class _AgentStartupTraceEvent extends __protoMessage3131 {
      constructor(data) {
        super();
        this.creationTimestampMs = protoInt64.zero;
        this.payload = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent|1 creation_timestamp_ms 4|2 span_started #0 payload|3 span_ended #1 payload|4 user_action #2 payload|5 turn_close #3 payload|6 context_link #4 payload", AgentStartupTraceEvent_SpanStarted, AgentStartupTraceEvent_SpanEnded, AgentStartupTraceEvent_UserAction, AgentStartupTraceEvent_TurnClose, AgentStartupTraceEvent_ContextLink];
      }
    };
    AgentStartupTraceEvent_ContextLink = class _AgentStartupTraceEvent_ContextLink extends __protoMessage3131 {
      constructor(data) {
        super();
        this.name = "";
        this.href = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent_ContextLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent_ContextLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent_ContextLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent_ContextLink, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent.ContextLink|1 name 9|2 href 9"];
      }
    };
    AgentStartupTraceEvent_SpanStarted = class _AgentStartupTraceEvent_SpanStarted extends __protoMessage3131 {
      constructor(data) {
        super();
        this.spanId = "";
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent_SpanStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent_SpanStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent_SpanStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent_SpanStarted, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent.SpanStarted|1 span_id 9|2 name 9|3 parent_span_id 9?|4 href 9?|5 temporal_run_id 9?|6 temporal_activity_id 9?"];
      }
    };
    AgentStartupTraceEvent_SpanEnded = class _AgentStartupTraceEvent_SpanEnded extends __protoMessage3131 {
      constructor(data) {
        super();
        this.spanId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent_SpanEnded().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent_SpanEnded().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent_SpanEnded().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent_SpanEnded, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent.SpanEnded|1 span_id 9"];
      }
    };
    AgentStartupTraceEvent_UserAction = class _AgentStartupTraceEvent_UserAction extends __protoMessage3131 {
      constructor(data) {
        super();
        this.turnIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent_UserAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent_UserAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent_UserAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent_UserAction, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent.UserAction|1 turn_index 13"];
      }
    };
    AgentStartupTraceEvent_TurnClose = class _AgentStartupTraceEvent_TurnClose extends __protoMessage3131 {
      constructor(data) {
        super();
        this.turnIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentStartupTraceEvent_TurnClose().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentStartupTraceEvent_TurnClose().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentStartupTraceEvent_TurnClose().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentStartupTraceEvent_TurnClose, a, b2);
      }
      static $() {
        return ["AgentStartupTraceEvent.TurnClose|1 turn_index 13"];
      }
    };
  }
});
