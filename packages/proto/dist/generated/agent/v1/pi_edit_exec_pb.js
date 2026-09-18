var __protoPackage111, __protoMessage3107, PiEditExecArgs, PiEditExecResult, PiEditExecSuccess, PiEditExecError, PiEditExecRejected;
var init_pi_edit_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_edit_exec_pb.js"() {
    "use strict";
    init_esm();
    init_pi_edit_tool_pb();
    init_compact();
    __protoPackage111 = "agent.v1.";
    __protoMessage3107 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage111;
      }
    };
    PiEditExecArgs = class _PiEditExecArgs extends __protoMessage3107 {
      constructor(data) {
        super();
        this.path = "";
        this.edits = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditExecArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditExecArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditExecArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditExecArgs, a, b2);
      }
      static $() {
        return ["PiEditExecArgs|1 path 9|2 edits #0*", PiEditReplacement];
      }
    };
    PiEditExecResult = class _PiEditExecResult extends __protoMessage3107 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditExecResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditExecResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditExecResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditExecResult, a, b2);
      }
      static $() {
        return ["PiEditExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiEditExecSuccess, PiEditExecError, PiEditExecRejected];
      }
    };
    PiEditExecSuccess = class _PiEditExecSuccess extends __protoMessage3107 {
      constructor(data) {
        super();
        this.output = "";
        this.diff = "";
        this.patch = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditExecSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditExecSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditExecSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditExecSuccess, a, b2);
      }
      static $() {
        return ["PiEditExecSuccess|1 output 9|2 diff 9|3 patch 9|4 first_changed_line 13?"];
      }
    };
    PiEditExecError = class _PiEditExecError extends __protoMessage3107 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditExecError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditExecError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditExecError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditExecError, a, b2);
      }
      static $() {
        return ["PiEditExecError|1 error 9"];
      }
    };
    PiEditExecRejected = class _PiEditExecRejected extends __protoMessage3107 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditExecRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditExecRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditExecRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditExecRejected, a, b2);
      }
      static $() {
        return ["PiEditExecRejected|1 reason 9"];
      }
    };
  }
});
