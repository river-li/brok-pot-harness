/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/utils_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage23 = "aiserver.v1.";
var __protoMessage322 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage23;
  }
};
var CursorPosition = class _CursorPosition extends __protoMessage322 {
  constructor(data) {
    super();
    this.line = 0;
    this.column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorPosition, a, b);
  }
  static $() {
    return ["CursorPosition|1 line 5|2 column 5"];
  }
};
var CursorRange = class _CursorRange extends __protoMessage322 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRange, a, b);
  }
  static $() {
    return ["CursorRange|1 start_position #0|2 end_position #0", CursorPosition];
  }
};
var DetailedLine = class _DetailedLine extends __protoMessage322 {
  constructor(data) {
    super();
    this.text = "";
    this.lineNumber = 0;
    this.isSignature = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DetailedLine().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DetailedLine().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DetailedLine().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DetailedLine, a, b);
  }
  static $() {
    return ["DetailedLine|1 text 9|2 line_number 2|3 is_signature 8"];
  }
};
var CodeBlock = class _CodeBlock extends __protoMessage322 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.detailedLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeBlock().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeBlock().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeBlock().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeBlock, a, b);
  }
  static $() {
    return ["CodeBlock|1 relative_workspace_path 9|2 file_contents 9?|9 file_contents_length 5?|3 range #0|4 contents 9|5 signatures #1|6 override_contents 9?|7 original_contents 9?|8 detailed_lines #2*|10 file_git_context #3", CursorRange, CodeBlock_Signatures, DetailedLine, FileGit];
  }
};
var CodeBlock_Signatures = class _CodeBlock_Signatures extends __protoMessage322 {
  constructor(data) {
    super();
    this.ranges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeBlock_Signatures().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeBlock_Signatures().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeBlock_Signatures().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeBlock_Signatures, a, b);
  }
  static $() {
    return ["CodeBlock.Signatures|1 ranges #0*", CursorRange];
  }
};
var GitCommit = class _GitCommit extends __protoMessage322 {
  constructor(data) {
    super();
    this.commit = "";
    this.author = "";
    this.date = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GitCommit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GitCommit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GitCommit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GitCommit, a, b);
  }
  static $() {
    return ["GitCommit|1 commit 9|2 author 9|3 date 9|4 message 9"];
  }
};
var FileGit = class _FileGit extends __protoMessage322 {
  constructor(data) {
    super();
    this.commits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileGit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileGit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileGit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileGit, a, b);
  }
  static $() {
    return ["FileGit|1 commits #0*", GitCommit];
  }
};

