/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_fetch_allowlist_precheck_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage95 = "agent.v1.";
var __protoMessage394 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage95;
  }
};
var WebFetchAllowlistPrecheckArgs = class _WebFetchAllowlistPrecheckArgs extends __protoMessage394 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchAllowlistPrecheckArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchAllowlistPrecheckArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchAllowlistPrecheckArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchAllowlistPrecheckArgs, a, b2);
  }
  static $() {
    return ["WebFetchAllowlistPrecheckArgs|1 url 9|2 tool_call_id 9?"];
  }
};
var WebFetchAllowlistPrecheckResult = class _WebFetchAllowlistPrecheckResult extends __protoMessage394 {
  constructor(data) {
    super();
    this.allowlisted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebFetchAllowlistPrecheckResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebFetchAllowlistPrecheckResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebFetchAllowlistPrecheckResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebFetchAllowlistPrecheckResult, a, b2);
  }
  static $() {
    return ["WebFetchAllowlistPrecheckResult|1 allowlisted 8"];
  }
};

