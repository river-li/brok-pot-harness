/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/coordinator_tools_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage75 = "agent.v1.";
var __protoMessage374 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage75;
  }
};
var CreateAgentPlacementApprovalState = /* @__PURE__ */ enumType(proto3, __protoPackage75, "CreateAgentPlacementApprovalState", [[0, "UNSPECIFIED"], [1, "REQUIRED"], [2, "DENIED"]], 1);
var GetAgentStatusArgs = class _GetAgentStatusArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusArgs, a, b);
  }
  static $() {
    return ["GetAgentStatusArgs|1 tool_call_id 9|2 agent_ids 9*"];
  }
};
var GetAgentStatusWorker = class _GetAgentStatusWorker extends __protoMessage374 {
  constructor(data) {
    super();
    this.bcId = "";
    this.name = "";
    this.lifecycle = "";
    this.turnInFlight = false;
    this.lastTerminalTurnStatus = "";
    this.prUrl = "";
    this.lastActivityAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusWorker().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusWorker().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusWorker().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusWorker, a, b);
  }
  static $() {
    return ["GetAgentStatusWorker|1 bc_id 9|2 name 9|3 lifecycle 9|4 turn_in_flight 8|5 last_terminal_turn_status 9|6 pr_url 9|7 last_activity_at_ms 4"];
  }
};
var GetAgentStatusSuccess = class _GetAgentStatusSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workers = [];
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusSuccess, a, b);
  }
  static $() {
    return ["GetAgentStatusSuccess|1 workers #0*|2 message 9", GetAgentStatusWorker];
  }
};
var GetAgentStatusError = class _GetAgentStatusError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusError, a, b);
  }
  static $() {
    return ["GetAgentStatusError|1 error 9"];
  }
};
var GetAgentStatusResult = class _GetAgentStatusResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusResult, a, b);
  }
  static $() {
    return ["GetAgentStatusResult|1 success #0 result|2 error #1 result", GetAgentStatusSuccess, GetAgentStatusError];
  }
};
var GetAgentStatusToolCall = class _GetAgentStatusToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusToolCall, a, b);
  }
  static $() {
    return ["GetAgentStatusToolCall|1 args #0|2 result #1", GetAgentStatusArgs, GetAgentStatusResult];
  }
};
var SendToAgentArgs = class _SendToAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    this.message = "";
    this.delivery = "";
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentArgs, a, b);
  }
  static $() {
    return ["SendToAgentArgs|1 tool_call_id 9|2 agent_id 9|3 message 9|4 delivery 9|5 title 9"];
  }
};
var SendToAgentSuccess = class _SendToAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.deliveredAs = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentSuccess, a, b);
  }
  static $() {
    return ["SendToAgentSuccess|1 worker_bc_id 9|2 delivered_as 9|3 message 9"];
  }
};
var SendToAgentError = class _SendToAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentError, a, b);
  }
  static $() {
    return ["SendToAgentError|1 error 9"];
  }
};
var SendToAgentResult = class _SendToAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentResult, a, b);
  }
  static $() {
    return ["SendToAgentResult|1 success #0 result|2 error #1 result", SendToAgentSuccess, SendToAgentError];
  }
};
var SendToAgentToolCall = class _SendToAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentToolCall, a, b);
  }
  static $() {
    return ["SendToAgentToolCall|1 args #0|2 result #1", SendToAgentArgs, SendToAgentResult];
  }
};
var ReadAgentTranscriptArgs = class _ReadAgentTranscriptArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    this.mode = "";
    this.maxTurns = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptArgs, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptArgs|1 tool_call_id 9|2 agent_id 9|3 mode 9|4 max_turns 13"];
  }
};
var ReadAgentTranscriptSuccess = class _ReadAgentTranscriptSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.transcript = "";
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptSuccess, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptSuccess|1 transcript 9|2 truncated 8"];
  }
};
var ReadAgentTranscriptError = class _ReadAgentTranscriptError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptError, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptError|1 error 9"];
  }
};
var ReadAgentTranscriptResult = class _ReadAgentTranscriptResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptResult, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptResult|1 success #0 result|2 error #1 result", ReadAgentTranscriptSuccess, ReadAgentTranscriptError];
  }
};
var ReadAgentTranscriptToolCall = class _ReadAgentTranscriptToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptToolCall, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptToolCall|1 args #0|2 result #1", ReadAgentTranscriptArgs, ReadAgentTranscriptResult];
  }
};
var CreateAgentArgs = class _CreateAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.prompt = "";
    this.labels = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentArgs, a, b);
  }
  static $() {
    return ["CreateAgentArgs|1 tool_call_id 9|2 prompt 9|3 name 9?|4 model 9?|5 base_branch 9?|6 machine_type 9?|7 worker_id 9?|8 pool 9?|9 labels 9,9|10 environment_build_id 9?"];
  }
};
var CreateAgentSuccess = class _CreateAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.agentId = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentSuccess, a, b);
  }
  static $() {
    return ["CreateAgentSuccess|1 agent_id 9|2 message 9"];
  }
};
var CreateAgentError = class _CreateAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentError, a, b);
  }
  static $() {
    return ["CreateAgentError|1 error 9|2 placement_approval_state #0?", CreateAgentPlacementApprovalState];
  }
};
var CreateAgentResult = class _CreateAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentResult, a, b);
  }
  static $() {
    return ["CreateAgentResult|1 success #0 result|2 error #1 result", CreateAgentSuccess, CreateAgentError];
  }
};
var CreateAgentToolCall = class _CreateAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentToolCall, a, b);
  }
  static $() {
    return ["CreateAgentToolCall|1 args #0|2 result #1", CreateAgentArgs, CreateAgentResult];
  }
};
var StopAgentArgs = class _StopAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentArgs, a, b);
  }
  static $() {
    return ["StopAgentArgs|1 tool_call_id 9|2 agent_id 9"];
  }
};
var StopAgentSuccess = class _StopAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentSuccess, a, b);
  }
  static $() {
    return ["StopAgentSuccess|1 worker_bc_id 9|2 message 9"];
  }
};
var StopAgentError = class _StopAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentError, a, b);
  }
  static $() {
    return ["StopAgentError|1 error 9"];
  }
};
var StopAgentResult = class _StopAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentResult, a, b);
  }
  static $() {
    return ["StopAgentResult|1 success #0 result|2 error #1 result", StopAgentSuccess, StopAgentError];
  }
};
var StopAgentToolCall = class _StopAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentToolCall, a, b);
  }
  static $() {
    return ["StopAgentToolCall|1 args #0|2 result #1", StopAgentArgs, StopAgentResult];
  }
};

