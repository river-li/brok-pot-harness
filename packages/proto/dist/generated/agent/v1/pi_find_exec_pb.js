var __protoPackage115, __protoMessage3110, PiFindExecArgs, PiFindExecResult, PiFindExecSuccess, PiFindExecError;
var init_pi_find_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_find_exec_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage115 = "agent.v1.";
    __protoMessage3110 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage115;
      }
    };
    PiFindExecArgs = class _PiFindExecArgs extends __protoMessage3110 {
      constructor(data) {
        super();
        this.pattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindExecArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindExecArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindExecArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindExecArgs, a, b2);
      }
      static $() {
        return ["PiFindExecArgs|1 pattern 9|2 path 9?|3 limit 5?"];
      }
    };
    PiFindExecResult = class _PiFindExecResult extends __protoMessage3110 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindExecResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindExecResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindExecResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindExecResult, a, b2);
      }
      static $() {
        return ["PiFindExecResult|1 success #0 result|2 error #1 result", PiFindExecSuccess, PiFindExecError];
      }
    };
    PiFindExecSuccess = class _PiFindExecSuccess extends __protoMessage3110 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindExecSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindExecSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindExecSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindExecSuccess, a, b2);
      }
      static $() {
        return ["PiFindExecSuccess|1 output 9|2 truncation #0?|3 result_limit_reached 13?", PiTruncation];
      }
    };
    PiFindExecError = class _PiFindExecError extends __protoMessage3110 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindExecError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindExecError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindExecError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindExecError, a, b2);
      }
      static $() {
        return ["PiFindExecError|1 error 9"];
      }
    };
  }
});
