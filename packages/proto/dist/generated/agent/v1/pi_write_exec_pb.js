/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_write_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage112, __protoMessage3108, PiWriteExecArgs, PiWriteExecResult, PiWriteExecSuccess, PiWriteExecError, PiWriteExecRejected;
var init_pi_write_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_write_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage112 = "agent.v1.";
    __protoMessage3108 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage112;
      }
    };
    PiWriteExecArgs = class _PiWriteExecArgs extends __protoMessage3108 {
      constructor(data) {
        super();
        this.path = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteExecArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteExecArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteExecArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteExecArgs, a, b2);
      }
      static $() {
        return ["PiWriteExecArgs|1 path 9|2 content 9"];
      }
    };
    PiWriteExecResult = class _PiWriteExecResult extends __protoMessage3108 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteExecResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteExecResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteExecResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteExecResult, a, b2);
      }
      static $() {
        return ["PiWriteExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiWriteExecSuccess, PiWriteExecError, PiWriteExecRejected];
      }
    };
    PiWriteExecSuccess = class _PiWriteExecSuccess extends __protoMessage3108 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteExecSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteExecSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteExecSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteExecSuccess, a, b2);
      }
      static $() {
        return ["PiWriteExecSuccess|1 output 9"];
      }
    };
    PiWriteExecError = class _PiWriteExecError extends __protoMessage3108 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteExecError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteExecError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteExecError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteExecError, a, b2);
      }
      static $() {
        return ["PiWriteExecError|1 error 9"];
      }
    };
    PiWriteExecRejected = class _PiWriteExecRejected extends __protoMessage3108 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteExecRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteExecRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteExecRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteExecRejected, a, b2);
      }
      static $() {
        return ["PiWriteExecRejected|1 reason 9"];
      }
    };
  }
});

