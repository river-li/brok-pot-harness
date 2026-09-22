/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/blame_by_file_path_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage50 = "agent.v1.";
var __protoMessage349 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage50;
  }
};
var BlameByFilePathArgs = class _BlameByFilePathArgs extends __protoMessage349 {
  constructor(data) {
    super();
    this.filePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathArgs, a, b);
  }
  static $() {
    return ["BlameByFilePathArgs|1 file_path 9|2 start_line 5?|3 end_line 5?"];
  }
};
var BlameByFilePathSuccess = class _BlameByFilePathSuccess extends __protoMessage349 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathSuccess, a, b);
  }
  static $() {
    return ["BlameByFilePathSuccess|1 content 9"];
  }
};
var BlameByFilePathError = class _BlameByFilePathError extends __protoMessage349 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathError, a, b);
  }
  static $() {
    return ["BlameByFilePathError|1 error_message 9"];
  }
};
var BlameByFilePathResult = class _BlameByFilePathResult extends __protoMessage349 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathResult, a, b);
  }
  static $() {
    return ["BlameByFilePathResult|1 success #0 result|2 error #1 result", BlameByFilePathSuccess, BlameByFilePathError];
  }
};
var BlameByFilePathToolCall = class _BlameByFilePathToolCall extends __protoMessage349 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathToolCall, a, b);
  }
  static $() {
    return ["BlameByFilePathToolCall|1 args #0|2 result #1", BlameByFilePathArgs, BlameByFilePathResult];
  }
};

