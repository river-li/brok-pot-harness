/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/sandbox_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage2 = "agent.v1.";
var __protoMessage32 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage2;
  }
};
var NetworkPolicyLoggingConfig = class _NetworkPolicyLoggingConfig extends __protoMessage32 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NetworkPolicyLoggingConfig().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NetworkPolicyLoggingConfig().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NetworkPolicyLoggingConfig().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NetworkPolicyLoggingConfig, a, b);
  }
  static $() {
    return ["NetworkPolicyLoggingConfig|1 decision_log_path 9?|2 log_format 9?"];
  }
};
var NetworkPolicy = class _NetworkPolicy extends __protoMessage32 {
  constructor(data) {
    super();
    this.deny = [];
    this.allow = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NetworkPolicy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NetworkPolicy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NetworkPolicy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NetworkPolicy, a, b);
  }
  static $() {
    return ["NetworkPolicy|1 version 13?|2 default_action #0?|3 deny 9*|4 allow 9*|5 logging #1?", NetworkPolicy_DefaultAction, NetworkPolicyLoggingConfig];
  }
};
var NetworkPolicy_DefaultAction = /* @__PURE__ */ enumType(proto3, __protoPackage2, "NetworkPolicy.DefaultAction", [[0, "UNSPECIFIED"], [1, "ALLOW"], [2, "DENY"]], 1);
var SandboxPolicy = class _SandboxPolicy extends __protoMessage32 {
  constructor(data) {
    super();
    this.type = SandboxPolicy_Type.UNSPECIFIED;
    this.additionalReadwritePaths = [];
    this.additionalReadonlyPaths = [];
    this.readBoundary = SandboxPolicy_ReadBoundaryMode.UNSPECIFIED;
    this.additionalReadPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SandboxPolicy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SandboxPolicy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SandboxPolicy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SandboxPolicy, a, b);
  }
  static $() {
    return ["SandboxPolicy|1 type #0|2 network_access 8?|3 additional_readwrite_paths 9*|4 additional_readonly_paths 9*|5 debug_output_dir 9?|7 disable_tmp_write 8?|8 allowlist_escalated 8?|9 enable_shared_build_cache 8?|10 network_policy #1?|11 network_policy_strict 8?|12 capture_denies 8?|13 skip_statsig_defaults 8?|14 read_boundary #2|15 additional_read_paths 9*", SandboxPolicy_Type, NetworkPolicy, SandboxPolicy_ReadBoundaryMode];
  }
};
var SandboxPolicy_Type = /* @__PURE__ */ enumType(proto3, __protoPackage2, "SandboxPolicy.Type", [[0, "UNSPECIFIED"], [1, "INSECURE_NONE"], [2, "WORKSPACE_READWRITE"], [3, "WORKSPACE_READONLY"]], 1);
var SandboxPolicy_ReadBoundaryMode = /* @__PURE__ */ enumType(proto3, __protoPackage2, "SandboxPolicy.ReadBoundaryMode", [[0, "UNSPECIFIED"], [1, "SYSTEM"], [2, "WORKSPACE"]], 1);

