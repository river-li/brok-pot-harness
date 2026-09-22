/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/connect_scm_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage69 = "agent.v1.";
var __protoMessage368 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage69;
  }
};
var ConnectScmArgs = class _ConnectScmArgs extends __protoMessage368 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmArgs, a, b);
  }
  static $() {
    return ["ConnectScmArgs|1 tool_call_id 9|2 github #0 target", ConnectScmGithub];
  }
};
var ConnectScmGithub = class _ConnectScmGithub extends __protoMessage368 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmGithub().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmGithub().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmGithub().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmGithub, a, b);
  }
  static $() {
    return ["ConnectScmGithub|1 repository #0|2 ghe_application 9?", ConnectScmGithubRepository];
  }
};
var ConnectScmGithubRepository = class _ConnectScmGithubRepository extends __protoMessage368 {
  constructor(data) {
    super();
    this.owner = "";
    this.repo = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmGithubRepository().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmGithubRepository().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmGithubRepository().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmGithubRepository, a, b);
  }
  static $() {
    return ["ConnectScmGithubRepository|1 owner 9|2 repo 9"];
  }
};
var ConnectScmResult = class _ConnectScmResult extends __protoMessage368 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmResult, a, b);
  }
  static $() {
    return ["ConnectScmResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ConnectScmSuccess, ConnectScmError, ConnectScmRejected];
  }
};
var ConnectScmSuccess = class _ConnectScmSuccess extends __protoMessage368 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmSuccess, a, b);
  }
  static $() {
    return ["ConnectScmSuccess"];
  }
};
var ConnectScmError = class _ConnectScmError extends __protoMessage368 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmError, a, b);
  }
  static $() {
    return ["ConnectScmError|1 error 9"];
  }
};
var ConnectScmRejected = class _ConnectScmRejected extends __protoMessage368 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmRejected, a, b);
  }
  static $() {
    return ["ConnectScmRejected|1 reason 9"];
  }
};
var ConnectScmToolCall = class _ConnectScmToolCall extends __protoMessage368 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmToolCall, a, b);
  }
  static $() {
    return ["ConnectScmToolCall|1 args #0|2 result #1", ConnectScmArgs, ConnectScmResult];
  }
};

