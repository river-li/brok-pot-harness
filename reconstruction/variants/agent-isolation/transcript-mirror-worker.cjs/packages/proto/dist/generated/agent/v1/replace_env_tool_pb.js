/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/replace_env_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage55 = "agent.v1.";
var __protoMessage354 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage55;
  }
};
var ReplaceEnvMode = /* @__PURE__ */ enumType(proto3, __protoPackage55, "ReplaceEnvMode", [[0, "UNSPECIFIED"], [1, "CUSTOM"], [2, "CLEAN_SLATE"], [3, "DEFAULT"]], 1);
var RepoCheckoutRefOverride = class _RepoCheckoutRefOverride extends __protoMessage354 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.ref = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RepoCheckoutRefOverride().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RepoCheckoutRefOverride().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RepoCheckoutRefOverride().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RepoCheckoutRefOverride, a, b);
  }
  static $() {
    return ["RepoCheckoutRefOverride|1 repo_url 9|2 ref 9"];
  }
};
var ReplaceEnvConfig = class _ReplaceEnvConfig extends __protoMessage354 {
  constructor(data) {
    super();
    this.installScript = "";
    this.dockerfileContents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvConfig().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvConfig().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvConfig().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvConfig, a, b);
  }
  static $() {
    return ["ReplaceEnvConfig|1 install_script 9|2 dockerfile_contents 9"];
  }
};
var ReplaceEnvArgs = class _ReplaceEnvArgs extends __protoMessage354 {
  constructor(data) {
    super();
    this.mode = ReplaceEnvMode.UNSPECIFIED;
    this.checkoutRefOverrides = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvArgs, a, b);
  }
  static $() {
    return ["ReplaceEnvArgs|1 config #0|2 mode #1|3 checkout_ref_overrides #2*", ReplaceEnvConfig, ReplaceEnvMode, RepoCheckoutRefOverride];
  }
};
var ReplaceEnvSuccess = class _ReplaceEnvSuccess extends __protoMessage354 {
  constructor(data) {
    super();
    this.setupLogs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvSuccess, a, b);
  }
  static $() {
    return ["ReplaceEnvSuccess|1 setup_logs 9"];
  }
};
var ReplaceEnvFailure = class _ReplaceEnvFailure extends __protoMessage354 {
  constructor(data) {
    super();
    this.errorMessage = "";
    this.setupLogs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvFailure, a, b);
  }
  static $() {
    return ["ReplaceEnvFailure|1 error_message 9|2 setup_logs 9"];
  }
};
var ReplaceEnvResult = class _ReplaceEnvResult extends __protoMessage354 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvResult, a, b);
  }
  static $() {
    return ["ReplaceEnvResult|1 success #0 result|2 failure #1 result", ReplaceEnvSuccess, ReplaceEnvFailure];
  }
};
var ReplaceEnvToolCall = class _ReplaceEnvToolCall extends __protoMessage354 {
  constructor(data) {
    super();
    this.associatedPodKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvToolCall, a, b);
  }
  static $() {
    return ["ReplaceEnvToolCall|1 args #0|2 result #1|3 associated_pod_key 9", ReplaceEnvArgs, ReplaceEnvResult];
  }
};

