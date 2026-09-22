/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_ls_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage115, __protoMessage3111, PiLsExecArgs, PiLsExecResult, PiLsExecSuccess, PiLsExecError;
var init_pi_ls_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_ls_exec_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage115 = "agent.v1.";
    __protoMessage3111 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage115;
      }
    };
    PiLsExecArgs = class _PiLsExecArgs extends __protoMessage3111 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsExecArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsExecArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsExecArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsExecArgs, a, b2);
      }
      static $() {
        return ["PiLsExecArgs|1 path 9?|2 limit 5?"];
      }
    };
    PiLsExecResult = class _PiLsExecResult extends __protoMessage3111 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsExecResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsExecResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsExecResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsExecResult, a, b2);
      }
      static $() {
        return ["PiLsExecResult|1 success #0 result|2 error #1 result", PiLsExecSuccess, PiLsExecError];
      }
    };
    PiLsExecSuccess = class _PiLsExecSuccess extends __protoMessage3111 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsExecSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsExecSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsExecSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsExecSuccess, a, b2);
      }
      static $() {
        return ["PiLsExecSuccess|1 output 9|2 truncation #0?|3 entry_limit_reached 13?", PiTruncation];
      }
    };
    PiLsExecError = class _PiLsExecError extends __protoMessage3111 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsExecError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsExecError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsExecError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsExecError, a, b2);
      }
      static $() {
        return ["PiLsExecError|1 error 9"];
      }
    };
  }
});

