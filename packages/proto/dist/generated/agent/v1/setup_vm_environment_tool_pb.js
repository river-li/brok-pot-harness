var __protoPackage53, __protoMessage349, SetupVmEnvironmentArgs, SetupVmEnvironmentResult, SetupVmEnvironmentSuccess, SetupVmEnvironmentToolCall;
var init_setup_vm_environment_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/setup_vm_environment_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage53 = "agent.v1.";
    __protoMessage349 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage53;
      }
    };
    SetupVmEnvironmentArgs = class _SetupVmEnvironmentArgs extends __protoMessage349 {
      constructor(data) {
        super();
        this.installCommand = "";
        this.startCommand = "";
        this.dockerfileContents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupVmEnvironmentArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupVmEnvironmentArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupVmEnvironmentArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupVmEnvironmentArgs, a, b2);
      }
      static $() {
        return ["SetupVmEnvironmentArgs|2 install_command 9|3 start_command 9|4 dockerfile_contents 9"];
      }
    };
    SetupVmEnvironmentResult = class _SetupVmEnvironmentResult extends __protoMessage349 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupVmEnvironmentResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupVmEnvironmentResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupVmEnvironmentResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupVmEnvironmentResult, a, b2);
      }
      static $() {
        return ["SetupVmEnvironmentResult|1 success #0 result", SetupVmEnvironmentSuccess];
      }
    };
    SetupVmEnvironmentSuccess = class _SetupVmEnvironmentSuccess extends __protoMessage349 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupVmEnvironmentSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupVmEnvironmentSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupVmEnvironmentSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupVmEnvironmentSuccess, a, b2);
      }
      static $() {
        return ["SetupVmEnvironmentSuccess"];
      }
    };
    SetupVmEnvironmentToolCall = class _SetupVmEnvironmentToolCall extends __protoMessage349 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupVmEnvironmentToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupVmEnvironmentToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupVmEnvironmentToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupVmEnvironmentToolCall, a, b2);
      }
      static $() {
        return ["SetupVmEnvironmentToolCall|1 args #0|2 result #1", SetupVmEnvironmentArgs, SetupVmEnvironmentResult];
      }
    };
  }
});
