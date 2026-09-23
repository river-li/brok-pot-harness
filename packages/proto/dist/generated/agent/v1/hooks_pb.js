var __protoPackage118, __protoMessage3113, PreCompactRequestQuery, PreCompactRequestResponse, SubagentStartRequestQuery, SubagentStartRequestResponse, SubagentStopRequestQuery, SubagentStopRequestResponse, BeforeSubmitPromptAttachment, BeforeSubmitPromptRequestQuery, BeforeSubmitPromptRequestResponse, AfterAgentResponseRequestQuery, AfterAgentResponseRequestResponse, AfterAgentThoughtRequestQuery, AfterAgentThoughtRequestResponse, StopRequestQuery, StopRequestResponse, PreToolUseRequestQuery, PreToolUseRequestResponse, PostToolUseRequestQuery, PostToolUseRequestResponse, PostToolUseFailureRequestQuery, PostToolUseFailureRequestResponse;
var init_hooks_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/hooks_pb.js"() {
    "use strict";
    init_esm();
    init_requested_model_pb();
    init_compact();
    __protoPackage118 = "agent.v1.";
    __protoMessage3113 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage118;
      }
    };
    PreCompactRequestQuery = class _PreCompactRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.trigger = "";
        this.contextUsagePercent = 0;
        this.contextTokens = protoInt64.zero;
        this.contextWindowSize = protoInt64.zero;
        this.messageCount = 0;
        this.messagesToCompact = 0;
        this.isFirstCompaction = false;
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreCompactRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreCompactRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreCompactRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreCompactRequestQuery, a, b2);
      }
      static $() {
        return ["PreCompactRequestQuery|1 trigger 9|2 context_usage_percent 1|3 context_tokens 3|4 context_window_size 3|5 message_count 5|6 messages_to_compact 5|7 is_first_compaction 8|8 conversation_id 9?|9 generation_id 9?|10 model 9?|11 model_id 9?|12 model_params #0*", RequestedModel_ModelParameterValue];
      }
    };
    PreCompactRequestResponse = class _PreCompactRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreCompactRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreCompactRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreCompactRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreCompactRequestResponse, a, b2);
      }
      static $() {
        return ["PreCompactRequestResponse|1 user_message 9?"];
      }
    };
    SubagentStartRequestQuery = class _SubagentStartRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.subagentId = "";
        this.subagentType = "";
        this.task = "";
        this.parentConversationId = "";
        this.isParallelWorker = false;
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentStartRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentStartRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentStartRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentStartRequestQuery, a, b2);
      }
      static $() {
        return ["SubagentStartRequestQuery|1 subagent_id 9|2 subagent_type 9|3 task 9|4 parent_conversation_id 9|5 tool_call_id 9?|6 subagent_model 9?|7 is_parallel_worker 8|8 git_branch 9?|9 conversation_id 9?|10 generation_id 9?|11 model 9?|12 model_id 9?|13 model_params #0*", RequestedModel_ModelParameterValue];
      }
    };
    SubagentStartRequestResponse = class _SubagentStartRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentStartRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentStartRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentStartRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentStartRequestResponse, a, b2);
      }
      static $() {
        return ["SubagentStartRequestResponse|1 permission 9?|2 user_message 9?|3 additional_context 9?"];
      }
    };
    SubagentStopRequestQuery = class _SubagentStopRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.subagentId = "";
        this.subagentType = "";
        this.status = "";
        this.durationMs = protoInt64.zero;
        this.parentConversationId = "";
        this.messageCount = 0;
        this.toolCallCount = 0;
        this.modifiedFiles = [];
        this.loopCount = 0;
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentStopRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentStopRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentStopRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentStopRequestQuery, a, b2);
      }
      static $() {
        return ["SubagentStopRequestQuery|1 subagent_id 9|2 subagent_type 9|3 status 9|4 duration_ms 3|5 summary 9?|6 parent_conversation_id 9|7 message_count 5|8 tool_call_count 5|9 error_message 9?|10 modified_files 9*|11 git_branch 9?|12 conversation_id 9?|13 generation_id 9?|14 model 9?|15 loop_count 5|16 task 9?|17 description 9?|18 model_id 9?|19 model_params #0*|20 child_conversation_id 9?", RequestedModel_ModelParameterValue];
      }
    };
    SubagentStopRequestResponse = class _SubagentStopRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentStopRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentStopRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentStopRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentStopRequestResponse, a, b2);
      }
      static $() {
        return ["SubagentStopRequestResponse|1 followup_message 9?|2 additional_context 9?"];
      }
    };
    BeforeSubmitPromptAttachment = class _BeforeSubmitPromptAttachment extends __protoMessage3113 {
      constructor(data) {
        super();
        this.type = "";
        this.filePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BeforeSubmitPromptAttachment().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BeforeSubmitPromptAttachment().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BeforeSubmitPromptAttachment().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BeforeSubmitPromptAttachment, a, b2);
      }
      static $() {
        return ["BeforeSubmitPromptAttachment|1 type 9|2 file_path 9"];
      }
    };
    BeforeSubmitPromptRequestQuery = class _BeforeSubmitPromptRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.prompt = "";
        this.attachments = [];
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BeforeSubmitPromptRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BeforeSubmitPromptRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BeforeSubmitPromptRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BeforeSubmitPromptRequestQuery, a, b2);
      }
      static $() {
        return ["BeforeSubmitPromptRequestQuery|1 prompt 9|2 attachments #0*|3 composer_mode 9?|4 conversation_id 9?|5 generation_id 9?|6 model 9?|7 model_id 9?|8 model_params #1*", BeforeSubmitPromptAttachment, RequestedModel_ModelParameterValue];
      }
    };
    BeforeSubmitPromptRequestResponse = class _BeforeSubmitPromptRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BeforeSubmitPromptRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BeforeSubmitPromptRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BeforeSubmitPromptRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BeforeSubmitPromptRequestResponse, a, b2);
      }
      static $() {
        return ["BeforeSubmitPromptRequestResponse|1 continue 8?|2 user_message 9?|3 additional_context 9?"];
      }
    };
    AfterAgentResponseRequestQuery = class _AfterAgentResponseRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.text = "";
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AfterAgentResponseRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AfterAgentResponseRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AfterAgentResponseRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AfterAgentResponseRequestQuery, a, b2);
      }
      static $() {
        return ["AfterAgentResponseRequestQuery|1 text 9|2 conversation_id 9?|3 generation_id 9?|4 model 9?|5 model_id 9?|6 model_params #0*|7 input_tokens 3?|8 output_tokens 3?|9 cache_read_tokens 3?|10 cache_write_tokens 3?", RequestedModel_ModelParameterValue];
      }
    };
    AfterAgentResponseRequestResponse = class _AfterAgentResponseRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AfterAgentResponseRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AfterAgentResponseRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AfterAgentResponseRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AfterAgentResponseRequestResponse, a, b2);
      }
      static $() {
        return ["AfterAgentResponseRequestResponse"];
      }
    };
    AfterAgentThoughtRequestQuery = class _AfterAgentThoughtRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.text = "";
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AfterAgentThoughtRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AfterAgentThoughtRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AfterAgentThoughtRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AfterAgentThoughtRequestQuery, a, b2);
      }
      static $() {
        return ["AfterAgentThoughtRequestQuery|1 text 9|2 duration_ms 3?|3 conversation_id 9?|4 generation_id 9?|5 model 9?|6 model_id 9?|7 model_params #0*", RequestedModel_ModelParameterValue];
      }
    };
    AfterAgentThoughtRequestResponse = class _AfterAgentThoughtRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AfterAgentThoughtRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AfterAgentThoughtRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AfterAgentThoughtRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AfterAgentThoughtRequestResponse, a, b2);
      }
      static $() {
        return ["AfterAgentThoughtRequestResponse"];
      }
    };
    StopRequestQuery = class _StopRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.status = "";
        this.loopCount = 0;
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StopRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StopRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StopRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StopRequestQuery, a, b2);
      }
      static $() {
        return ["StopRequestQuery|1 status 9|2 loop_count 5|3 conversation_id 9?|4 generation_id 9?|5 model 9?|6 model_id 9?|7 model_params #0*|8 input_tokens 3?|9 output_tokens 3?|10 cache_read_tokens 3?|11 cache_write_tokens 3?", RequestedModel_ModelParameterValue];
      }
    };
    StopRequestResponse = class _StopRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StopRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StopRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StopRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StopRequestResponse, a, b2);
      }
      static $() {
        return ["StopRequestResponse|1 followup_message 9?"];
      }
    };
    PreToolUseRequestQuery = class _PreToolUseRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.toolName = "";
        this.toolUseId = "";
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreToolUseRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreToolUseRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreToolUseRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreToolUseRequestQuery, a, b2);
      }
      static $() {
        return ["PreToolUseRequestQuery|1 tool_name 9|2 tool_input #0|3 tool_use_id 9|4 cwd 9?|5 conversation_id 9?|6 generation_id 9?|7 model 9?|8 model_id 9?|9 model_params #1*|10 parent_tool_call_id 9?", Struct, RequestedModel_ModelParameterValue];
      }
    };
    PreToolUseRequestResponse = class _PreToolUseRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreToolUseRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreToolUseRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreToolUseRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreToolUseRequestResponse, a, b2);
      }
      static $() {
        return ["PreToolUseRequestResponse|1 permission 9?|2 user_message 9?|3 agent_message 9?|4 updated_input 9?|5 additional_context 9?"];
      }
    };
    PostToolUseRequestQuery = class _PostToolUseRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.toolName = "";
        this.toolOutput = "";
        this.durationMs = protoInt64.zero;
        this.toolUseId = "";
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostToolUseRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostToolUseRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostToolUseRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostToolUseRequestQuery, a, b2);
      }
      static $() {
        return ["PostToolUseRequestQuery|1 tool_name 9|2 tool_input #0|3 tool_output 9|4 duration_ms 3|5 tool_use_id 9|6 cwd 9?|7 conversation_id 9?|8 generation_id 9?|9 model 9?|10 model_id 9?|11 model_params #1*|12 parent_tool_call_id 9?", Struct, RequestedModel_ModelParameterValue];
      }
    };
    PostToolUseRequestResponse = class _PostToolUseRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostToolUseRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostToolUseRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostToolUseRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostToolUseRequestResponse, a, b2);
      }
      static $() {
        return ["PostToolUseRequestResponse|1 additional_context 9?"];
      }
    };
    PostToolUseFailureRequestQuery = class _PostToolUseFailureRequestQuery extends __protoMessage3113 {
      constructor(data) {
        super();
        this.toolName = "";
        this.errorMessage = "";
        this.failureType = "";
        this.durationMs = protoInt64.zero;
        this.toolUseId = "";
        this.isInterrupt = false;
        this.modelParams = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostToolUseFailureRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostToolUseFailureRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostToolUseFailureRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostToolUseFailureRequestQuery, a, b2);
      }
      static $() {
        return ["PostToolUseFailureRequestQuery|1 tool_name 9|2 tool_input #0|3 error_message 9|4 failure_type 9|5 duration_ms 3|6 tool_use_id 9|7 is_interrupt 8|8 conversation_id 9?|9 generation_id 9?|10 model 9?|11 model_id 9?|12 model_params #1*|13 parent_tool_call_id 9?", Struct, RequestedModel_ModelParameterValue];
      }
    };
    PostToolUseFailureRequestResponse = class _PostToolUseFailureRequestResponse extends __protoMessage3113 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostToolUseFailureRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostToolUseFailureRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostToolUseFailureRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostToolUseFailureRequestResponse, a, b2);
      }
      static $() {
        return ["PostToolUseFailureRequestResponse|1 additional_context 9?"];
      }
    };
  }
});
