var __protoPackage13, __protoMessage310, NetworkPolicyLoggingConfig, NetworkPolicy, NetworkPolicy_DefaultAction, SandboxPolicy, SandboxPolicy_Type, SandboxPolicy_ReadBoundaryMode;
var init_sandbox_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/sandbox_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage13 = "agent.v1.";
    __protoMessage310 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage13;
      }
    };
    NetworkPolicyLoggingConfig = class _NetworkPolicyLoggingConfig extends __protoMessage310 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NetworkPolicyLoggingConfig().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NetworkPolicyLoggingConfig().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NetworkPolicyLoggingConfig().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NetworkPolicyLoggingConfig, a, b2);
      }
      static $() {
        return ["NetworkPolicyLoggingConfig|1 decision_log_path 9?|2 log_format 9?"];
      }
    };
    NetworkPolicy = class _NetworkPolicy extends __protoMessage310 {
      constructor(data) {
        super();
        this.deny = [];
        this.allow = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NetworkPolicy().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NetworkPolicy().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NetworkPolicy().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NetworkPolicy, a, b2);
      }
      static $() {
        return ["NetworkPolicy|1 version 13?|2 default_action #0?|3 deny 9*|4 allow 9*|5 logging #1?", NetworkPolicy_DefaultAction, NetworkPolicyLoggingConfig];
      }
    };
    NetworkPolicy_DefaultAction = /* @__PURE__ */ enumType(proto3, __protoPackage13, "NetworkPolicy.DefaultAction", [[0, "UNSPECIFIED"], [1, "ALLOW"], [2, "DENY"]], 1);
    SandboxPolicy = class _SandboxPolicy extends __protoMessage310 {
      constructor(data) {
        super();
        this.type = SandboxPolicy_Type.UNSPECIFIED;
        this.additionalReadwritePaths = [];
        this.additionalReadonlyPaths = [];
        this.readBoundary = SandboxPolicy_ReadBoundaryMode.UNSPECIFIED;
        this.additionalReadPaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SandboxPolicy().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SandboxPolicy().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SandboxPolicy().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SandboxPolicy, a, b2);
      }
      static $() {
        return ["SandboxPolicy|1 type #0|2 network_access 8?|3 additional_readwrite_paths 9*|4 additional_readonly_paths 9*|5 debug_output_dir 9?|7 disable_tmp_write 8?|8 allowlist_escalated 8?|9 enable_shared_build_cache 8?|10 network_policy #1?|11 network_policy_strict 8?|12 capture_denies 8?|13 skip_statsig_defaults 8?|14 read_boundary #2|15 additional_read_paths 9*", SandboxPolicy_Type, NetworkPolicy, SandboxPolicy_ReadBoundaryMode];
      }
    };
    SandboxPolicy_Type = /* @__PURE__ */ enumType(proto3, __protoPackage13, "SandboxPolicy.Type", [[0, "UNSPECIFIED"], [1, "INSECURE_NONE"], [2, "WORKSPACE_READWRITE"], [3, "WORKSPACE_READONLY"]], 1);
    SandboxPolicy_ReadBoundaryMode = /* @__PURE__ */ enumType(proto3, __protoPackage13, "SandboxPolicy.ReadBoundaryMode", [[0, "UNSPECIFIED"], [1, "SYSTEM"], [2, "WORKSPACE"]], 1);
  }
});
