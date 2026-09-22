/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_allowlist_precheck_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage94 = "agent.v1.";
var __protoMessage393 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage94;
  }
};
var McpAllowlistPrecheckArgs = class _McpAllowlistPrecheckArgs extends __protoMessage393 {
  constructor(data) {
    super();
    this.providerIdentifier = "";
    this.toolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpAllowlistPrecheckArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpAllowlistPrecheckArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpAllowlistPrecheckArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpAllowlistPrecheckArgs, a, b2);
  }
  static $() {
    return ["McpAllowlistPrecheckArgs|1 provider_identifier 9|2 tool_name 9|3 tool_call_id 9?|4 annotations_json 9?"];
  }
};
var McpAllowlistPrecheckResult = class _McpAllowlistPrecheckResult extends __protoMessage393 {
  constructor(data) {
    super();
    this.allowlisted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpAllowlistPrecheckResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpAllowlistPrecheckResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpAllowlistPrecheckResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpAllowlistPrecheckResult, a, b2);
  }
  static $() {
    return ["McpAllowlistPrecheckResult|1 allowlisted 8"];
  }
};

