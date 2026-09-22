/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_read_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage109, __protoMessage3105, PiReadExecArgs, PiReadExecResult, PiReadExecSuccess, PiReadExecError;
var init_pi_read_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_read_exec_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage109 = "agent.v1.";
    __protoMessage3105 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage109;
      }
    };
    PiReadExecArgs = class _PiReadExecArgs extends __protoMessage3105 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiReadExecArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiReadExecArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiReadExecArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiReadExecArgs, a, b2);
      }
      static $() {
        return ["PiReadExecArgs|1 path 9|2 offset 5?|3 limit 5?"];
      }
    };
    PiReadExecResult = class _PiReadExecResult extends __protoMessage3105 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiReadExecResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiReadExecResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiReadExecResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiReadExecResult, a, b2);
      }
      static $() {
        return ["PiReadExecResult|1 success #0 result|2 error #1 result", PiReadExecSuccess, PiReadExecError];
      }
    };
    PiReadExecSuccess = class _PiReadExecSuccess extends __protoMessage3105 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiReadExecSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiReadExecSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiReadExecSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiReadExecSuccess, a, b2);
      }
      static $() {
        return ["PiReadExecSuccess|1 output 9|2 truncation #0?", PiTruncation];
      }
    };
    PiReadExecError = class _PiReadExecError extends __protoMessage3105 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiReadExecError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiReadExecError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiReadExecError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiReadExecError, a, b2);
      }
      static $() {
        return ["PiReadExecError|1 error 9"];
      }
    };
  }
});

