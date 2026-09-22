/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ls_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage16 = "agent.v1.";
var __protoMessage316 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage16;
  }
};
var LsArgs = class _LsArgs extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.ignore = [];
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsArgs, a, b);
  }
  static $() {
    return ["LsArgs|1 path 9|2 ignore 9*|3 tool_call_id 9|4 sandbox_policy #0?|5 timeout_ms 13?", SandboxPolicy];
  }
};
var LsResult = class _LsResult extends __protoMessage316 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsResult, a, b);
  }
  static $() {
    return ["LsResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 timeout #3 result", LsSuccess, LsError, LsRejected, LsTimeout];
  }
};
var LsSuccess = class _LsSuccess extends __protoMessage316 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsSuccess, a, b);
  }
  static $() {
    return ["LsSuccess|1 directory_tree_root #0", LsDirectoryTreeNode];
  }
};
var LsDirectoryTreeNode = class _LsDirectoryTreeNode extends __protoMessage316 {
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
  static fromBinary(bytes, options) {
    return new _LsDirectoryTreeNode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsDirectoryTreeNode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsDirectoryTreeNode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsDirectoryTreeNode, a, b);
  }
  static $() {
    return ["LsDirectoryTreeNode|1 abs_path 9|2 children_dirs #0*|3 children_files #1*|4 children_were_processed 8|5 full_subtree_extension_counts 9,5|6 num_files 5", _LsDirectoryTreeNode, LsDirectoryTreeNode_File];
  }
};
var LsDirectoryTreeNode_File = class _LsDirectoryTreeNode_File extends __protoMessage316 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsDirectoryTreeNode_File().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsDirectoryTreeNode_File().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsDirectoryTreeNode_File().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsDirectoryTreeNode_File, a, b);
  }
  static $() {
    return ["LsDirectoryTreeNode.File|1 name 9|2 terminal_metadata #0?", TerminalMetadata];
  }
};
var LsError = class _LsError extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsError, a, b);
  }
  static $() {
    return ["LsError|1 path 9|2 error 9"];
  }
};
var LsRejected = class _LsRejected extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsRejected, a, b);
  }
  static $() {
    return ["LsRejected|1 path 9|2 reason 9"];
  }
};
var LsTimeout = class _LsTimeout extends __protoMessage316 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsTimeout().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsTimeout().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsTimeout().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsTimeout, a, b);
  }
  static $() {
    return ["LsTimeout|1 directory_tree_root #0", LsDirectoryTreeNode];
  }
};
var TerminalMetadata = class _TerminalMetadata extends __protoMessage316 {
  constructor(data) {
    super();
    this.lastCommands = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TerminalMetadata().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TerminalMetadata().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TerminalMetadata().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TerminalMetadata, a, b);
  }
  static $() {
    return ["TerminalMetadata|1 cwd 9?|2 last_commands #0*|3 last_modified_ms 3?|4 current_command #0?", TerminalMetadata_Command];
  }
};
var TerminalMetadata_Command = class _TerminalMetadata_Command extends __protoMessage316 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TerminalMetadata_Command().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TerminalMetadata_Command().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TerminalMetadata_Command().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TerminalMetadata_Command, a, b);
  }
  static $() {
    return ["TerminalMetadata.Command|1 command 9|2 exit_code 5?|3 timestamp_ms 3?|4 duration_ms 3?"];
  }
};

