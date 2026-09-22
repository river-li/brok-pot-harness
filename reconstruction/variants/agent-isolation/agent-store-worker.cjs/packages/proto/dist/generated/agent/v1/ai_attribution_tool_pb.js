/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ai_attribution_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage46 = "agent.v1.";
var __protoMessage345 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage46;
  }
};
var AiAttributionArgs = class _AiAttributionArgs extends __protoMessage345 {
  constructor(data) {
    super();
    this.filePaths = [];
    this.commitHashes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionArgs, a, b);
  }
  static $() {
    return ["AiAttributionArgs|5 file_paths 9*|2 start_line 5?|3 end_line 5?|6 commit_hashes 9*|7 output_mode 9?|9 max_commits 5?|10 include_line_ranges 8?"];
  }
};
var AiAttributionResult = class _AiAttributionResult extends __protoMessage345 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionResult, a, b);
  }
  static $() {
    return ["AiAttributionResult|1 success #0 result|2 error #1 result", AiAttributionSuccess, AiAttributionError];
  }
};
var AiAttributionSuccess = class _AiAttributionSuccess extends __protoMessage345 {
  constructor(data) {
    super();
    this.attributionText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionSuccess, a, b);
  }
  static $() {
    return ["AiAttributionSuccess|1 attribution_text 9|2 output_location #0?", OutputLocation];
  }
};
var AiAttributionError = class _AiAttributionError extends __protoMessage345 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionError, a, b);
  }
  static $() {
    return ["AiAttributionError|1 error 9"];
  }
};
var AiAttributionToolCall = class _AiAttributionToolCall extends __protoMessage345 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionToolCall, a, b);
  }
  static $() {
    return ["AiAttributionToolCall|1 args #0|2 result #1", AiAttributionArgs, AiAttributionResult];
  }
};

