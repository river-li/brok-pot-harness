var __protoPackage42, __protoMessage342, BackgroundShellSpawnArgs, BackgroundShellSpawnResult, BackgroundShellSpawnSuccess, BackgroundShellSpawnError, WriteShellStdinArgs, WriteShellStdinResult, WriteShellStdinSuccess, WriteShellStdinError;
var init_background_shell_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/background_shell_exec_pb.js"() {
    "use strict";
    init_esm13();
    init_shell_exec_pb();
    init_sandbox_pb();
    init_utils_pb();
    init_compact();
    __protoPackage42 = "agent.v1.";
    __protoMessage342 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage42;
      }
    };
    BackgroundShellSpawnArgs = class _BackgroundShellSpawnArgs extends __protoMessage342 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.toolCallId = "";
        this.enableWriteShellStdinTool = false;
        this.skipApproval = false;
        this.adminCommandDenylist = [];
        this.suppressStdinLogging = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundShellSpawnArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundShellSpawnArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundShellSpawnArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundShellSpawnArgs, a, b2);
      }
      static $() {
        return ["BackgroundShellSpawnArgs|1 command 9|2 working_directory 9|3 tool_call_id 9|4 parsing_result #0|5 sandbox_policy #1?|6 enable_write_shell_stdin_tool 8|7 description 9?|8 classifier_result #2?|9 output_notification #3?|10 smart_mode_approval #4?|11 hook_approval_requirement #5?|12 skip_approval 8|13 conversation_id 9?|14 admin_command_denylist 9*|15 request_id 9?|16 suppress_stdin_logging 8|17 secret_scope_id 9?", ShellCommandParsingResult, SandboxPolicy, CommandClassifierResult, ShellOutputNotificationConfig, SmartModeApproval, ShellHookApprovalRequirement];
      }
    };
    BackgroundShellSpawnResult = class _BackgroundShellSpawnResult extends __protoMessage342 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundShellSpawnResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundShellSpawnResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundShellSpawnResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundShellSpawnResult, a, b2);
      }
      static $() {
        return ["BackgroundShellSpawnResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 permission_denied #3 result|5 sandbox_unsupported #4 result", BackgroundShellSpawnSuccess, BackgroundShellSpawnError, ShellRejected, ShellPermissionDenied, ShellSandboxUnsupported];
      }
    };
    BackgroundShellSpawnSuccess = class _BackgroundShellSpawnSuccess extends __protoMessage342 {
      constructor(data) {
        super();
        this.shellId = 0;
        this.command = "";
        this.workingDirectory = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundShellSpawnSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundShellSpawnSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundShellSpawnSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundShellSpawnSuccess, a, b2);
      }
      static $() {
        return ["BackgroundShellSpawnSuccess|1 shell_id 13|2 command 9|3 working_directory 9|4 pid 13?"];
      }
    };
    BackgroundShellSpawnError = class _BackgroundShellSpawnError extends __protoMessage342 {
      constructor(data) {
        super();
        this.command = "";
        this.workingDirectory = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundShellSpawnError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundShellSpawnError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundShellSpawnError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundShellSpawnError, a, b2);
      }
      static $() {
        return ["BackgroundShellSpawnError|1 command 9|2 working_directory 9|3 error 9"];
      }
    };
    WriteShellStdinArgs = class _WriteShellStdinArgs extends __protoMessage342 {
      constructor(data) {
        super();
        this.shellId = 0;
        this.chars = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteShellStdinArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteShellStdinArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteShellStdinArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteShellStdinArgs, a, b2);
      }
      static $() {
        return ["WriteShellStdinArgs|1 shell_id 13|2 chars 9"];
      }
    };
    WriteShellStdinResult = class _WriteShellStdinResult extends __protoMessage342 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteShellStdinResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteShellStdinResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteShellStdinResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteShellStdinResult, a, b2);
      }
      static $() {
        return ["WriteShellStdinResult|1 success #0 result|2 error #1 result", WriteShellStdinSuccess, WriteShellStdinError];
      }
    };
    WriteShellStdinSuccess = class _WriteShellStdinSuccess extends __protoMessage342 {
      constructor(data) {
        super();
        this.shellId = 0;
        this.terminalFileLengthBeforeInputWritten = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteShellStdinSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteShellStdinSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteShellStdinSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteShellStdinSuccess, a, b2);
      }
      static $() {
        return ["WriteShellStdinSuccess|1 shell_id 13|2 terminal_file_length_before_input_written 13"];
      }
    };
    WriteShellStdinError = class _WriteShellStdinError extends __protoMessage342 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteShellStdinError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteShellStdinError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteShellStdinError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteShellStdinError, a, b2);
      }
      static $() {
        return ["WriteShellStdinError|1 error 9"];
      }
    };
  }
});
