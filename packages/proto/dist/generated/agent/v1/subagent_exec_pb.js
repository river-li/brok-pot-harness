var __protoPackage104, __protoMessage399, ForceBackgroundSubagentStatus, SubagentArgs, ClientContinuationConfig, SubagentResult, SubagentAwaitArgs, SubagentAwaitResult, SubagentAwaitComplete, SubagentAwaitStillRunning, SubagentAwaitNotFound, SubagentAwaitError, SubagentSuccess, SubagentError, ForceBackgroundSubagentArgs, ForceBackgroundSubagentResult;
var init_subagent_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/subagent_exec_pb.js"() {
    "use strict";
    init_esm();
    init_requested_model_pb();
    init_subagents_pb();
    init_selected_context_pb();
    init_compact();
    __protoPackage104 = "agent.v1.";
    __protoMessage399 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage104;
      }
    };
    ForceBackgroundSubagentStatus = /* @__PURE__ */ enumType(proto3, __protoPackage104, "ForceBackgroundSubagentStatus", [[0, "UNSPECIFIED"], [1, "ACCEPTED"], [2, "NOT_FOUND"]], 1);
    SubagentArgs = class _SubagentArgs extends __protoMessage399 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.subagentType = "";
        this.modelId = "";
        this.prompt = "";
        this.readonly = false;
        this.credentials = { case: void 0 };
        this.mode = TaskMode.UNSPECIFIED;
        this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
        this.modelParameters = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentArgs, a, b2);
      }
      static $() {
        return ["SubagentArgs|1 tool_call_id 9|2 subagent_type 9|3 model_id 9|4 prompt 9|5 readonly 8|6 resume_agent_id 9?|7 run_in_background 8?|8 continuation_config #0|9 parent_conversation_id 9?|10 api_key_credentials #1 credentials|11 azure_credentials #2 credentials|12 bedrock_credentials #3 credentials|13 interrupt 8?|14 mode #4|15 fork_agent_id 9?|16 root_parent_conversation_id 9?|17 selected_context #5?|18 direct_meta_parent_child_subagent 8?|19 environment #6|20 cloud_base_branch 9?|21 model_parameters #7*", ClientContinuationConfig, ApiKeyCredentials, AzureCredentials, BedrockCredentials, TaskMode, SelectedContext, SubagentExecutionEnvironment, RequestedModel_ModelParameterValue];
      }
    };
    ClientContinuationConfig = class _ClientContinuationConfig extends __protoMessage399 {
      constructor(data) {
        super();
        this.idleThreshold = 0;
        this.maxLoops = 0;
        this.nudgeMessage = "";
        this.escapeMessageTemplate = "";
        this.collectBackgroundChildren = false;
        this.childrenCompletedMessageTemplate = "";
        this.continuationRoundDelayMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientContinuationConfig().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientContinuationConfig().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientContinuationConfig().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientContinuationConfig, a, b2);
      }
      static $() {
        return ["ClientContinuationConfig|1 idle_threshold 5|2 max_loops 5|3 nudge_message 9|4 escape_message_template 9|5 collect_background_children 8|6 children_completed_message_template 9|7 continuation_round_delay_ms 5"];
      }
    };
    SubagentResult = class _SubagentResult extends __protoMessage399 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentResult, a, b2);
      }
      static $() {
        return ["SubagentResult|1 success #0 result|2 error #1 result", SubagentSuccess, SubagentError];
      }
    };
    SubagentAwaitArgs = class _SubagentAwaitArgs extends __protoMessage399 {
      constructor(data) {
        super();
        this.agentId = "";
        this.timeoutMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitArgs, a, b2);
      }
      static $() {
        return ["SubagentAwaitArgs|1 agent_id 9|2 timeout_ms 13"];
      }
    };
    SubagentAwaitResult = class _SubagentAwaitResult extends __protoMessage399 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitResult, a, b2);
      }
      static $() {
        return ["SubagentAwaitResult|1 complete #0 result|2 still_running #1 result|3 not_found #2 result|4 error #3 result", SubagentAwaitComplete, SubagentAwaitStillRunning, SubagentAwaitNotFound, SubagentAwaitError];
      }
    };
    SubagentAwaitComplete = class _SubagentAwaitComplete extends __protoMessage399 {
      constructor(data) {
        super();
        this.agentId = "";
        this.toolCallCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitComplete().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitComplete().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitComplete().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitComplete, a, b2);
      }
      static $() {
        return ["SubagentAwaitComplete|1 agent_id 9|2 transcript_path 9?|3 tool_call_count 5|4 final_message 9?"];
      }
    };
    SubagentAwaitStillRunning = class _SubagentAwaitStillRunning extends __protoMessage399 {
      constructor(data) {
        super();
        this.agentId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitStillRunning().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitStillRunning().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitStillRunning().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitStillRunning, a, b2);
      }
      static $() {
        return ["SubagentAwaitStillRunning|1 agent_id 9|2 transcript_path 9?"];
      }
    };
    SubagentAwaitNotFound = class _SubagentAwaitNotFound extends __protoMessage399 {
      constructor(data) {
        super();
        this.agentId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitNotFound().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitNotFound().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitNotFound().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitNotFound, a, b2);
      }
      static $() {
        return ["SubagentAwaitNotFound|1 agent_id 9"];
      }
    };
    SubagentAwaitError = class _SubagentAwaitError extends __protoMessage399 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentAwaitError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentAwaitError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentAwaitError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentAwaitError, a, b2);
      }
      static $() {
        return ["SubagentAwaitError|1 agent_id 9?|2 error 9"];
      }
    };
    SubagentSuccess = class _SubagentSuccess extends __protoMessage399 {
      constructor(data) {
        super();
        this.agentId = "";
        this.toolCallCount = 0;
        this.backgroundReason = SubagentBackgroundReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentSuccess, a, b2);
      }
      static $() {
        return ["SubagentSuccess|1 agent_id 9|2 final_message 9?|3 tool_call_count 5|4 background_reason #0|5 transcript_path 9?", SubagentBackgroundReason];
      }
    };
    SubagentError = class _SubagentError extends __protoMessage399 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentError, a, b2);
      }
      static $() {
        return ["SubagentError|1 agent_id 9?|2 error 9"];
      }
    };
    ForceBackgroundSubagentArgs = class _ForceBackgroundSubagentArgs extends __protoMessage399 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ForceBackgroundSubagentArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ForceBackgroundSubagentArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ForceBackgroundSubagentArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ForceBackgroundSubagentArgs, a, b2);
      }
      static $() {
        return ["ForceBackgroundSubagentArgs|1 tool_call_id 9"];
      }
    };
    ForceBackgroundSubagentResult = class _ForceBackgroundSubagentResult extends __protoMessage399 {
      constructor(data) {
        super();
        this.status = ForceBackgroundSubagentStatus.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ForceBackgroundSubagentResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ForceBackgroundSubagentResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ForceBackgroundSubagentResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ForceBackgroundSubagentResult, a, b2);
      }
      static $() {
        return ["ForceBackgroundSubagentResult|1 status #0", ForceBackgroundSubagentStatus];
      }
    };
  }
});
