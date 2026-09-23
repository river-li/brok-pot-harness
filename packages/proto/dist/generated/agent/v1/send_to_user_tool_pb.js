var __protoPackage73, __protoMessage369, SendToUserArgs, SendToUserSuccess, SendToUserError, SendToUserResult, SendToUserToolCall;
var init_send_to_user_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/send_to_user_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage73 = "agent.v1.";
    __protoMessage369 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage73;
      }
    };
    SendToUserArgs = class _SendToUserArgs extends __protoMessage369 {
      constructor(data) {
        super();
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SendToUserArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SendToUserArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SendToUserArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SendToUserArgs, a, b2);
      }
      static $() {
        return ["SendToUserArgs|1 message 9"];
      }
    };
    SendToUserSuccess = class _SendToUserSuccess extends __protoMessage369 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SendToUserSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SendToUserSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SendToUserSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SendToUserSuccess, a, b2);
      }
      static $() {
        return ["SendToUserSuccess"];
      }
    };
    SendToUserError = class _SendToUserError extends __protoMessage369 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SendToUserError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SendToUserError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SendToUserError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SendToUserError, a, b2);
      }
      static $() {
        return ["SendToUserError|1 error 9"];
      }
    };
    SendToUserResult = class _SendToUserResult extends __protoMessage369 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SendToUserResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SendToUserResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SendToUserResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SendToUserResult, a, b2);
      }
      static $() {
        return ["SendToUserResult|1 success #0 result|2 error #1 result", SendToUserSuccess, SendToUserError];
      }
    };
    SendToUserToolCall = class _SendToUserToolCall extends __protoMessage369 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SendToUserToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SendToUserToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SendToUserToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SendToUserToolCall, a, b2);
      }
      static $() {
        return ["SendToUserToolCall|1 args #0|2 result #1", SendToUserArgs, SendToUserResult];
      }
    };
  }
});
