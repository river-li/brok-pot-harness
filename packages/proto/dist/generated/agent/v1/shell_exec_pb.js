/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/shell_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage16, __protoMessage313, TimeoutBehavior, ShellBackgroundReason, ForceBackgroundShellStatus, ShellAbortReason, ShellCommandParsingResult, ShellCommandParsingResult_ExecutableCommandArg, ShellCommandParsingResult_ExecutableCommand, ShellCommandParsingResult_Redirect, CommandClassifierResult, CommandClassifierResult_SuggestedSandboxMode, CommandClassifierResult_ClassifiedCommand, ShellOutputNotificationConfig, ForceBackgroundShellArgs, ForceBackgroundShellResult, ShellHookApprovalRequirement, ShellHookApprovalRequirement_Kind, ShellArgs, ShellResult, ShellStreamStdout, ShellStreamStderr, ShellStreamExit, ShellStreamStart, ShellStreamBackgrounded, ShellStreamHookContext, ShellSandboxUnsupported, ShellStream, ShellSuccess, ShellFailure, ShellTimeout, ShellRejected, ShellPermissionDenied, ShellSpawnError;
var init_shell_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/shell_exec_pb.js"() {
    "use strict";
    init_esm();
    init_sandbox_pb();
    init_utils_pb2();
    init_hook_additional_context_pb();
    init_compact();
    __protoPackage16 = "agent.v1.";
    __protoMessage313 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage16;
      }
    };
    TimeoutBehavior = /* @__PURE__ */ enumType(proto3, __protoPackage16, "TimeoutBehavior", [[0, "UNSPECIFIED"], [1, "CANCEL"], [2, "BACKGROUND"]], 1);
    ShellBackgroundReason = /* @__PURE__ */ enumType(proto3, __protoPackage16, "ShellBackgroundReason", [[0, "UNSPECIFIED"], [1, "TIMEOUT"], [2, "USER_REQUEST"]], 1);
    ForceBackgroundShellStatus = /* @__PURE__ */ enumType(proto3, __protoPackage16, "ForceBackgroundShellStatus", [[0, "UNSPECIFIED"], [1, "ACCEPTED"], [2, "NOT_FOUND"]], 1);
    ShellAbortReason = /* @__PURE__ */ enumType(proto3, __protoPackage16, "ShellAbortReason", [[0, "UNSPECIFIED"], [1, "USER_ABORT"], [2, "TIMEOUT"]], 1);
    ShellCommandParsingResult = class _ShellCommandParsingResult extends __protoMessage313 {
      constructor(data) {
        super();
        this.parsingFailed = false;
        this.executableCommands = [];
        this.hasRedirects = false;
        this.hasCommandSubstitution = false;
        this.redirects = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult|1 parsing_failed 8|2 executable_commands #0*|3 has_redirects 8|4 has_command_substitution 8|5 all_redirects_are_dev_null 8?|6 redirects #1*", ShellCommandParsingResult_ExecutableCommand, ShellCommandParsingResult_Redirect];
      }
    };
    ShellCommandParsingResult_ExecutableCommandArg = class _ShellCommandParsingResult_ExecutableCommandArg extends __protoMessage313 {
      constructor(data) {
        super();
        this.type = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommandArg, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.ExecutableCommandArg|1 type 9|2 value 9"];
      }
    };
    ShellCommandParsingResult_ExecutableCommand = class _ShellCommandParsingResult_ExecutableCommand extends __protoMessage313 {
      constructor(data) {
        super();
        this.name = "";
        this.args = [];
        this.fullText = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommand, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.ExecutableCommand|1 name 9|2 args #0*|3 full_text 9", ShellCommandParsingResult_ExecutableCommandArg];
      }
    };
    ShellCommandParsingResult_Redirect = class _ShellCommandParsingResult_Redirect extends __protoMessage313 {
      constructor(data) {
        super();
        this.operator = "";
        this.destinationFds = [];
        this.targetNodeType = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_Redirect().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_Redirect().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_Redirect().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_Redirect, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.Redirect|1 operator 9|2 destination_fds 13*|3 target_node_type 9|4 target_text 9?"];
      }
    };
    CommandClassifierResult = class _CommandClassifierResult extends __protoMessage313 {
      constructor(data) {
        super();
        this.commands = [];
        this.suggestedSandboxMode = CommandClassifierResult_SuggestedSandboxMode.UNSPECIFIED;
        this.classificationFailed = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommandClassifierResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommandClassifierResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommandClassifierResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommandClassifierResult, a, b2);
      }
      static $() {
        return ["CommandClassifierResult|1 commands #0*|2 suggested_sandbox_mode #1|3 classification_failed 8", CommandClassifierResult_ClassifiedCommand, CommandClassifierResult_SuggestedSandboxMode];
      }
    };
    CommandClassifierResult_SuggestedSandboxMode = /* @__PURE__ */ enumType(proto3, __protoPackage16, "CommandClassifierResult.SuggestedSandboxMode", [[0, "UNSPECIFIED"], [1, "SANDBOX"], [2, "NO_SANDBOX"], [3, "UNDETERMINED"]], 1);
    CommandClassifierResult_ClassifiedCommand = class _CommandClassifierResult_ClassifiedCommand extends __protoMessage313 {
      constructor(data) {
        super();
        this.name = "";
        this.arguments = [];
        this.subcommandTokens = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommandClassifierResult_ClassifiedCommand().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommandClassifierResult_ClassifiedCommand().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommandClassifierResult_ClassifiedCommand().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommandClassifierResult_ClassifiedCommand, a, b2);
      }
      static $() {
        return ["CommandClassifierResult.ClassifiedCommand|1 name 9|2 arguments 9*|3 suggested_allowlist_entry 9?|4 subcommand_tokens 9*"];
      }
    };
    ShellOutputNotificationConfig = class _ShellOutputNotificationConfig extends __protoMessage313 {
      constructor(data) {
        super();
        this.pattern = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellOutputNotificationConfig().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellOutputNotificationConfig().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellOutputNotificationConfig().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellOutputNotificationConfig, a, b2);
      }
      static $() {
        return ["ShellOutputNotificationConfig|1 pattern 9|2 reason 9|3 debounce 1?|4 notification_limit 5?"];
      }
    };
    ForceBackgroundShellArgs = class _ForceBackgroundShellArgs extends __protoMessage313 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ForceBackgroundShellArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ForceBackgroundShellArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ForceBackgroundShellArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ForceBackgroundShellArgs, a, b2);
      }
      static $() {
        return ["ForceBackgroundShellArgs|1 tool_call_id 9"];
      }
    };
    ForceBackgroundShellResult = class _ForceBackgroundShellResult extends __protoMessage313 {
      constructor(data) {
        super();
        this.status = ForceBackgroundShellStatus.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ForceBackgroundShellResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ForceBackgroundShellResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ForceBackgroundShellResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ForceBackgroundShellResult, a, b2);
      }
      static $() {
        return ["ForceBackgroundShellResult|1 status #0|2 shell_result #1?", ForceBackgroundShellStatus, ShellResult];
      }
    };
    ShellHookApprovalRequirement = class _ShellHookApprovalRequirement extends __protoMessage313 {
      constructor(data) {
        super();
        this.kind = ShellHookApprovalRequirement_Kind.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellHookApprovalRequirement().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellHookApprovalRequirement().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellHookApprovalRequirement().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellHookApprovalRequirement, a, b2);
      }
      static $() {
        return ["ShellHookApprovalRequirement|1 kind #0|2 reason 9?", ShellHookApprovalRequirement_Kind];
      }
    };
    ShellHookApprovalRequirement_Kind = /* @__PURE__ */ enumType(proto3, __protoPackage16, "ShellHookApprovalRequirement.Kind", [[0, "UNSPECIFIED"], [1, "FORCE_PROMPT"]], 1);
    ShellArgs = class _ShellArgs extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.timeout = 0;
        this.toolCallId = "";
        this.simpleCommands = [];
        this.hasInputRedirect = false;
        this.hasOutputRedirect = false;
        this.isBackground = false;
        this.skipApproval = false;
        this.timeoutBehavior = TimeoutBehavior.UNSPECIFIED;
        this.closeStdin = false;
        this.adminCommandDenylist = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellArgs, a, b2);
      }
      static $() {
        return ["ShellArgs|1 command 9|2 working_directory 9|3 timeout 5|4 tool_call_id 9|5 simple_commands 9*|6 has_input_redirect 8|7 has_output_redirect 8|8 parsing_result #0|9 requested_sandbox_policy #1?|10 file_output_threshold_bytes 4?|11 is_background 8|12 skip_approval 8|13 timeout_behavior #2|14 hard_timeout 5?|15 description 9?|16 classifier_result #3?|17 close_stdin 8|18 output_notification #4?|19 smart_mode_approval #5?|20 hook_approval_requirement #6?|21 conversation_id 9?|22 admin_command_denylist 9*|23 request_id 9?|24 secret_scope_id 9?", ShellCommandParsingResult, SandboxPolicy, TimeoutBehavior, CommandClassifierResult, ShellOutputNotificationConfig, SmartModeApproval, ShellHookApprovalRequirement];
      }
    };
    ShellResult = class _ShellResult extends __protoMessage313 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellResult, a, b2);
      }
      static $() {
        return ["ShellResult|1 success #0 result|2 failure #1 result|3 timeout #2 result|4 rejected #3 result|5 spawn_error #4 result|7 permission_denied #5 result|101 sandbox_policy #6?|102 is_background 8?|103 terminals_folder 9?|104 pid 13?", ShellSuccess, ShellFailure, ShellTimeout, ShellRejected, ShellSpawnError, ShellPermissionDenied, SandboxPolicy];
      }
    };
    ShellStreamStdout = class _ShellStreamStdout extends __protoMessage313 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamStdout().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamStdout().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamStdout().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamStdout, a, b2);
      }
      static $() {
        return ["ShellStreamStdout|1 data 9"];
      }
    };
    ShellStreamStderr = class _ShellStreamStderr extends __protoMessage313 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamStderr().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamStderr().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamStderr().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamStderr, a, b2);
      }
      static $() {
        return ["ShellStreamStderr|1 data 9"];
      }
    };
    ShellStreamExit = class _ShellStreamExit extends __protoMessage313 {
      constructor(data) {
        super();
        this.code = 0;
        this.cwd = "";
        this.aborted = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamExit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamExit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamExit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamExit, a, b2);
      }
      static $() {
        return ["ShellStreamExit|1 code 13|2 cwd 9|3 output_location #0?|4 aborted 8|5 abort_reason #1?|6 local_execution_time_ms 5?", OutputLocation, ShellAbortReason];
      }
    };
    ShellStreamStart = class _ShellStreamStart extends __protoMessage313 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamStart().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamStart().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamStart().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamStart, a, b2);
      }
      static $() {
        return ["ShellStreamStart|1 sandbox_policy #0?", SandboxPolicy];
      }
    };
    ShellStreamBackgrounded = class _ShellStreamBackgrounded extends __protoMessage313 {
      constructor(data) {
        super();
        this.shellId = 0;
        this.command = "";
        this.workingDirectory = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamBackgrounded().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamBackgrounded().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamBackgrounded().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamBackgrounded, a, b2);
      }
      static $() {
        return ["ShellStreamBackgrounded|1 shell_id 13|2 command 9|3 working_directory 9|4 pid 13?|5 ms_to_wait 5?|6 reason #0?", ShellBackgroundReason];
      }
    };
    ShellStreamHookContext = class _ShellStreamHookContext extends __protoMessage313 {
      constructor(data) {
        super();
        this.hookAdditionalContexts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStreamHookContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStreamHookContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStreamHookContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStreamHookContext, a, b2);
      }
      static $() {
        return ["ShellStreamHookContext|1 hook_additional_contexts #0*", HookAdditionalContext];
      }
    };
    ShellSandboxUnsupported = class _ShellSandboxUnsupported extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.sandboxPolicyType = "";
        this.reason = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellSandboxUnsupported().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellSandboxUnsupported().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellSandboxUnsupported().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellSandboxUnsupported, a, b2);
      }
      static $() {
        return ["ShellSandboxUnsupported|1 command 9|2 working_directory 9|3 sandbox_policy_type 9|4 reason 9|5 is_readonly 8"];
      }
    };
    ShellStream = class _ShellStream extends __protoMessage313 {
      constructor(data) {
        super();
        this.event = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellStream, a, b2);
      }
      static $() {
        return ["ShellStream|1 stdout #0 event|2 stderr #1 event|3 exit #2 event|4 start #3 event|5 rejected #4 event|6 permission_denied #5 event|7 backgrounded #6 event|8 hook_context #7 event|9 sandbox_unsupported #8 event", ShellStreamStdout, ShellStreamStderr, ShellStreamExit, ShellStreamStart, ShellRejected, ShellPermissionDenied, ShellStreamBackgrounded, ShellStreamHookContext, ShellSandboxUnsupported];
      }
    };
    ShellSuccess = class _ShellSuccess extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.exitCode = 0;
        this.signal = "";
        this.stdout = "";
        this.stderr = "";
        this.executionTime = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellSuccess, a, b2);
      }
      static $() {
        return ["ShellSuccess|1 command 9|2 working_directory 9|3 exit_code 5|4 signal 9|5 stdout 9|6 stderr 9|7 execution_time 5|8 output_location #0?|9 shell_id 13?|10 interleaved_output 9?|11 pid 13?|12 ms_to_wait 5?|13 local_execution_time_ms 5?|14 background_reason #1?|15 output_head 9?|16 output_tail 9?|17 elided_chars 13?", OutputLocation, ShellBackgroundReason];
      }
    };
    ShellFailure = class _ShellFailure extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.exitCode = 0;
        this.signal = "";
        this.stdout = "";
        this.stderr = "";
        this.executionTime = 0;
        this.aborted = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellFailure, a, b2);
      }
      static $() {
        return ["ShellFailure|1 command 9|2 working_directory 9|3 exit_code 5|4 signal 9|5 stdout 9|6 stderr 9|7 execution_time 5|8 output_location #0?|9 interleaved_output 9?|10 abort_reason #1?|11 aborted 8|12 local_execution_time_ms 5?|13 output_head 9?|14 output_tail 9?|15 elided_chars 13?", OutputLocation, ShellAbortReason];
      }
    };
    ShellTimeout = class _ShellTimeout extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.timeoutMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellTimeout().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellTimeout().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellTimeout().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellTimeout, a, b2);
      }
      static $() {
        return ["ShellTimeout|1 command 9|2 working_directory 9|3 timeout_ms 5"];
      }
    };
    ShellRejected = class _ShellRejected extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.reason = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellRejected, a, b2);
      }
      static $() {
        return ["ShellRejected|1 command 9|2 working_directory 9|3 reason 9|4 is_readonly 8"];
      }
    };
    ShellPermissionDenied = class _ShellPermissionDenied extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.error = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellPermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellPermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellPermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellPermissionDenied, a, b2);
      }
      static $() {
        return ["ShellPermissionDenied|1 command 9|2 working_directory 9|3 error 9|4 is_readonly 8"];
      }
    };
    ShellSpawnError = class _ShellSpawnError extends __protoMessage313 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellSpawnError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellSpawnError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellSpawnError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellSpawnError, a, b2);
      }
      static $() {
        return ["ShellSpawnError|1 command 9|2 working_directory 9|3 error 9"];
      }
    };
  }
});

