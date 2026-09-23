var __protoPackage119, __protoMessage3114, ExecClientStreamClose, ExecClientThrow, ExecClientHeartbeat, ExecClientControlMessage, ExecServerAbort, ExecServerControlMessage, SpanContext, ExecServerMessage, ExecClientMessage, ExecuteHookArgs, ExecuteHookResult, ExecuteHookRequest, ExecuteHookResponse;
var init_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/exec_pb.js"() {
    "use strict";
    init_esm();
    init_shell_exec_pb();
    init_write_exec_pb();
    init_delete_exec_pb();
    init_grep_exec_pb();
    init_read_exec_pb();
    init_ls_exec_pb();
    init_diagnostics_exec_pb();
    init_request_context_exec_pb();
    init_mcp_exec_pb();
    init_background_shell_exec_pb();
    init_fetch_exec_pb();
    init_record_screen_exec_pb();
    init_computer_use_tool_pb();
    init_subagent_exec_pb();
    init_smart_mode_classifier_exec_pb();
    init_canvas_diagnostics_exec_pb();
    init_shell_allowlist_precheck_exec_pb();
    init_mcp_allowlist_precheck_exec_pb();
    init_web_fetch_allowlist_precheck_exec_pb();
    init_utils_pb();
    init_pi_read_exec_pb();
    init_pi_bash_exec_pb();
    init_pi_edit_exec_pb();
    init_pi_write_exec_pb();
    init_pi_grep_exec_pb();
    init_pi_find_exec_pb();
    init_pi_ls_exec_pb();
    init_conversation_search_exec_pb();
    init_agent_store_conflict_exec_pb();
    init_adopt_tool_pb();
    init_hook_additional_context_pb();
    init_hooks_pb();
    init_compact();
    __protoPackage119 = "agent.v1.";
    __protoMessage3114 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage119;
      }
    };
    ExecClientStreamClose = class _ExecClientStreamClose extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecClientStreamClose().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecClientStreamClose().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecClientStreamClose().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecClientStreamClose, a, b2);
      }
      static $() {
        return ["ExecClientStreamClose|1 id 13"];
      }
    };
    ExecClientThrow = class _ExecClientThrow extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecClientThrow().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecClientThrow().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecClientThrow().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecClientThrow, a, b2);
      }
      static $() {
        return ["ExecClientThrow|1 id 13|2 error 9|3 stack_trace 9?|4 error_code 9?"];
      }
    };
    ExecClientHeartbeat = class _ExecClientHeartbeat extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecClientHeartbeat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecClientHeartbeat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecClientHeartbeat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecClientHeartbeat, a, b2);
      }
      static $() {
        return ["ExecClientHeartbeat|1 id 13"];
      }
    };
    ExecClientControlMessage = class _ExecClientControlMessage extends __protoMessage3114 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecClientControlMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecClientControlMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecClientControlMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecClientControlMessage, a, b2);
      }
      static $() {
        return ["ExecClientControlMessage|1 stream_close #0 message|2 throw #1 message|3 heartbeat #2 message", ExecClientStreamClose, ExecClientThrow, ExecClientHeartbeat];
      }
    };
    ExecServerAbort = class _ExecServerAbort extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecServerAbort().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecServerAbort().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecServerAbort().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecServerAbort, a, b2);
      }
      static $() {
        return ["ExecServerAbort|1 id 13"];
      }
    };
    ExecServerControlMessage = class _ExecServerControlMessage extends __protoMessage3114 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecServerControlMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecServerControlMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecServerControlMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecServerControlMessage, a, b2);
      }
      static $() {
        return ["ExecServerControlMessage|1 abort #0 message", ExecServerAbort];
      }
    };
    SpanContext = class _SpanContext extends __protoMessage3114 {
      constructor(data) {
        super();
        this.traceId = "";
        this.spanId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SpanContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SpanContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SpanContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SpanContext, a, b2);
      }
      static $() {
        return ["SpanContext|1 trace_id 9|2 span_id 9|3 trace_flags 13?|4 trace_state 9?"];
      }
    };
    ExecServerMessage = class _ExecServerMessage extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        this.execId = "";
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecServerMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecServerMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecServerMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecServerMessage, a, b2);
      }
      static $() {
        return ["ExecServerMessage|1 id 13|15 exec_id 9|57 machine_id 9?|2 shell_args #0 message|3 write_args #1 message|4 delete_args #2 message|5 grep_args #3 message|7 read_args #4 message|29 redacted_read_args #4 message|8 ls_args #5 message|9 diagnostics_args #6 message|10 request_context_args #7 message|11 mcp_args #8 message|14 shell_stream_args #0 message|16 background_shell_spawn_args #9 message|17 list_mcp_resources_exec_args #10 message|18 read_mcp_resource_exec_args #11 message|36 mcp_state_exec_args #12 message|20 fetch_args #13 message|21 record_screen_args #14 message|22 computer_use_args #15 message|23 write_shell_stdin_args #16 message|27 execute_hook_args #17 message|28 subagent_args #18 message|30 force_background_shell_args #19 message|31 force_background_subagent_args #20 message|37 subagent_await_args #21 message|38 smart_mode_classifier_args #22 message|40 canvas_diagnostics_args #23 message|41 shell_allowlist_precheck_args #24 message|42 mcp_allowlist_precheck_args #25 message|43 web_fetch_allowlist_precheck_args #26 message|44 git_diff_request #27 message|45 pi_read_args #28 message|46 pi_bash_args #29 message|47 pi_edit_args #30 message|48 pi_write_args #31 message|49 pi_grep_args #32 message|50 pi_find_args #33 message|51 pi_ls_args #34 message|52 mini_swe_agent_bash_args #0 message|53 conversation_search_args #35 message|54 agent_store_conflict_args #36 message|56 adopt_args #37 message|19 span_context #38?|55 accept_hook_additional_contexts 8?", ShellArgs, WriteArgs, DeleteArgs, GrepArgs, ReadArgs, LsArgs, DiagnosticsArgs, RequestContextArgs, McpArgs, BackgroundShellSpawnArgs, ListMcpResourcesExecArgs, ReadMcpResourceExecArgs, McpStateExecArgs, FetchArgs, RecordScreenArgs, ComputerUseArgs, WriteShellStdinArgs, ExecuteHookArgs, SubagentArgs, ForceBackgroundShellArgs, ForceBackgroundSubagentArgs, SubagentAwaitArgs, SmartModeClassifierArgs, CanvasDiagnosticsArgs, ShellAllowlistPrecheckArgs, McpAllowlistPrecheckArgs, WebFetchAllowlistPrecheckArgs, GetDiffRequest, PiReadExecArgs, PiBashExecArgs, PiEditExecArgs, PiWriteExecArgs, PiGrepExecArgs, PiFindExecArgs, PiLsExecArgs, ConversationSearchArgs, AgentStoreConflictArgs, AdoptArgs, SpanContext];
      }
    };
    ExecClientMessage = class _ExecClientMessage extends __protoMessage3114 {
      constructor(data) {
        super();
        this.id = 0;
        this.execId = "";
        this.hookAdditionalContexts = [];
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecClientMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecClientMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecClientMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecClientMessage, a, b2);
      }
      static $() {
        return ["ExecClientMessage|1 id 13|15 exec_id 9|39 local_execution_time_ms 5?|45 hook_additional_contexts #0*|2 shell_result #1 message|3 write_result #2 message|4 delete_result #3 message|5 grep_result #4 message|7 read_result #5 message|29 redacted_read_result #5 message|8 ls_result #6 message|9 diagnostics_result #7 message|10 request_context_result #8 message|11 mcp_result #9 message|14 shell_stream #10 message|16 background_shell_spawn_result #11 message|17 list_mcp_resources_exec_result #12 message|18 read_mcp_resource_exec_result #13 message|36 mcp_state_exec_result #14 message|20 fetch_result #15 message|21 record_screen_result #16 message|22 computer_use_result #17 message|23 write_shell_stdin_result #18 message|27 execute_hook_result #19 message|28 subagent_result #20 message|30 force_background_shell_result #21 message|31 force_background_subagent_result #22 message|37 subagent_await_result #23 message|38 smart_mode_classifier_result #24 message|40 canvas_diagnostics_result #25 message|41 shell_allowlist_precheck_result #26 message|42 mcp_allowlist_precheck_result #27 message|43 web_fetch_allowlist_precheck_result #28 message|44 git_diff_response #29 message|46 pi_read_result #30 message|47 pi_bash_result #31 message|48 pi_edit_result #32 message|49 pi_write_result #33 message|50 pi_grep_result #34 message|51 pi_find_result #35 message|52 pi_ls_result #36 message|53 conversation_search_result #37 message|54 agent_store_conflict_result #38 message|55 mini_swe_agent_bash_result #1 message|56 adopt_result #39 message", HookAdditionalContext, ShellResult, WriteResult, DeleteResult, GrepResult, ReadResult, LsResult, DiagnosticsResult, RequestContextResult, McpResult, ShellStream, BackgroundShellSpawnResult, ListMcpResourcesExecResult, ReadMcpResourceExecResult, McpStateExecResult, FetchResult, RecordScreenResult, ComputerUseResult, WriteShellStdinResult, ExecuteHookResult, SubagentResult, ForceBackgroundShellResult, ForceBackgroundSubagentResult, SubagentAwaitResult, SmartModeClassifierResult, CanvasDiagnosticsResult, ShellAllowlistPrecheckResult, McpAllowlistPrecheckResult, WebFetchAllowlistPrecheckResult, GetDiffResponse, PiReadExecResult, PiBashExecResult, PiEditExecResult, PiWriteExecResult, PiGrepExecResult, PiFindExecResult, PiLsExecResult, ConversationSearchResult, AgentStoreConflictResult, AdoptResult];
      }
    };
    ExecuteHookArgs = class _ExecuteHookArgs extends __protoMessage3114 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecuteHookArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecuteHookArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecuteHookArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecuteHookArgs, a, b2);
      }
      static $() {
        return ["ExecuteHookArgs|1 request #0", ExecuteHookRequest];
      }
    };
    ExecuteHookResult = class _ExecuteHookResult extends __protoMessage3114 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecuteHookResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecuteHookResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecuteHookResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecuteHookResult, a, b2);
      }
      static $() {
        return ["ExecuteHookResult|1 response #0", ExecuteHookResponse];
      }
    };
    ExecuteHookRequest = class _ExecuteHookRequest extends __protoMessage3114 {
      constructor(data) {
        super();
        this.request = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecuteHookRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecuteHookRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecuteHookRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecuteHookRequest, a, b2);
      }
      static $() {
        return ["ExecuteHookRequest|1 pre_compact #0 request|2 subagent_start #1 request|3 subagent_stop #2 request|4 pre_tool_use #3 request|5 post_tool_use #4 request|6 post_tool_use_failure #5 request|7 before_submit_prompt #6 request|8 after_agent_response #7 request|9 after_agent_thought #8 request|11 stop #9 request", PreCompactRequestQuery, SubagentStartRequestQuery, SubagentStopRequestQuery, PreToolUseRequestQuery, PostToolUseRequestQuery, PostToolUseFailureRequestQuery, BeforeSubmitPromptRequestQuery, AfterAgentResponseRequestQuery, AfterAgentThoughtRequestQuery, StopRequestQuery];
      }
    };
    ExecuteHookResponse = class _ExecuteHookResponse extends __protoMessage3114 {
      constructor(data) {
        super();
        this.response = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecuteHookResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecuteHookResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecuteHookResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecuteHookResponse, a, b2);
      }
      static $() {
        return ["ExecuteHookResponse|1 pre_compact #0 response|2 subagent_start #1 response|3 subagent_stop #2 response|4 pre_tool_use #3 response|5 post_tool_use #4 response|6 post_tool_use_failure #5 response|7 before_submit_prompt #6 response|8 after_agent_response #7 response|9 after_agent_thought #8 response|11 stop #9 response", PreCompactRequestResponse, SubagentStartRequestResponse, SubagentStopRequestResponse, PreToolUseRequestResponse, PostToolUseRequestResponse, PostToolUseFailureRequestResponse, BeforeSubmitPromptRequestResponse, AfterAgentResponseRequestResponse, AfterAgentThoughtRequestResponse, StopRequestResponse];
      }
    };
  }
});
