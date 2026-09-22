/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ls_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage18, __protoMessage318, LsArgs, LsResult, LsSuccess, LsDirectoryTreeNode, LsDirectoryTreeNode_File, LsError, LsRejected, LsTimeout, TerminalMetadata, TerminalMetadata_Command;
var init_ls_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/ls_exec_pb.js"() {
    "use strict";
    init_esm13();
    init_sandbox_pb();
    init_compact();
    __protoPackage18 = "agent.v1.";
    __protoMessage318 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage18;
      }
    };
    LsArgs = class _LsArgs extends __protoMessage318 {
      constructor(data) {
        super();
        this.path = "";
        this.ignore = [];
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsArgs, a, b2);
      }
      static $() {
        return ["LsArgs|1 path 9|2 ignore 9*|3 tool_call_id 9|4 sandbox_policy #0?|5 timeout_ms 13?", SandboxPolicy];
      }
    };
    LsResult = class _LsResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsResult, a, b2);
      }
      static $() {
        return ["LsResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 timeout #3 result", LsSuccess, LsError, LsRejected, LsTimeout];
      }
    };
    LsSuccess = class _LsSuccess extends __protoMessage318 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsSuccess, a, b2);
      }
      static $() {
        return ["LsSuccess|1 directory_tree_root #0", LsDirectoryTreeNode];
      }
    };
    LsDirectoryTreeNode = class _LsDirectoryTreeNode extends __protoMessage318 {
      constructor(data) {
        super();
        this.absPath = "";
        this.childrenDirs = [];
        this.childrenFiles = [];
        this.childrenWereProcessed = false;
        this.fullSubtreeExtensionCounts = {};
        this.numFiles = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsDirectoryTreeNode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsDirectoryTreeNode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsDirectoryTreeNode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsDirectoryTreeNode, a, b2);
      }
      static $() {
        return ["LsDirectoryTreeNode|1 abs_path 9|2 children_dirs #0*|3 children_files #1*|4 children_were_processed 8|5 full_subtree_extension_counts 9,5|6 num_files 5", _LsDirectoryTreeNode, LsDirectoryTreeNode_File];
      }
    };
    LsDirectoryTreeNode_File = class _LsDirectoryTreeNode_File extends __protoMessage318 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsDirectoryTreeNode_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsDirectoryTreeNode_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsDirectoryTreeNode_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsDirectoryTreeNode_File, a, b2);
      }
      static $() {
        return ["LsDirectoryTreeNode.File|1 name 9|2 terminal_metadata #0?", TerminalMetadata];
      }
    };
    LsError = class _LsError extends __protoMessage318 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsError, a, b2);
      }
      static $() {
        return ["LsError|1 path 9|2 error 9"];
      }
    };
    LsRejected = class _LsRejected extends __protoMessage318 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsRejected, a, b2);
      }
      static $() {
        return ["LsRejected|1 path 9|2 reason 9"];
      }
    };
    LsTimeout = class _LsTimeout extends __protoMessage318 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LsTimeout().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LsTimeout().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LsTimeout().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LsTimeout, a, b2);
      }
      static $() {
        return ["LsTimeout|1 directory_tree_root #0", LsDirectoryTreeNode];
      }
    };
    TerminalMetadata = class _TerminalMetadata extends __protoMessage318 {
      constructor(data) {
        super();
        this.lastCommands = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TerminalMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TerminalMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TerminalMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TerminalMetadata, a, b2);
      }
      static $() {
        return ["TerminalMetadata|1 cwd 9?|2 last_commands #0*|3 last_modified_ms 3?|4 current_command #0?", TerminalMetadata_Command];
      }
    };
    TerminalMetadata_Command = class _TerminalMetadata_Command extends __protoMessage318 {
      constructor(data) {
        super();
        this.command = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TerminalMetadata_Command().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TerminalMetadata_Command().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TerminalMetadata_Command().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TerminalMetadata_Command, a, b2);
      }
      static $() {
        return ["TerminalMetadata.Command|1 command 9|2 exit_code 5?|3 timestamp_ms 3?|4 duration_ms 3?"];
      }
    };
  }
});

