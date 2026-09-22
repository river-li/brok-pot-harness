/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/communicate_update_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage64, __protoMessage361, CommunicateUpdateArgs, CommunicateUpdateSuccess, CommunicateUpdateError, CommunicateUpdateResult, CommunicateUpdateToolCall;
var init_communicate_update_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/communicate_update_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage64 = "agent.v1.";
    __protoMessage361 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage64;
      }
    };
    CommunicateUpdateArgs = class _CommunicateUpdateArgs extends __protoMessage361 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateArgs, a, b2);
      }
      static $() {
        return ["CommunicateUpdateArgs|1 current_step 9?|3 final_summary 9?|4 completed_subtitle 9?"];
      }
    };
    CommunicateUpdateSuccess = class _CommunicateUpdateSuccess extends __protoMessage361 {
      constructor(data) {
        super();
        this.currentStep = "";
        this.messageIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateSuccess, a, b2);
      }
      static $() {
        return ["CommunicateUpdateSuccess|1 current_step 9|3 message_index 13"];
      }
    };
    CommunicateUpdateError = class _CommunicateUpdateError extends __protoMessage361 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateError, a, b2);
      }
      static $() {
        return ["CommunicateUpdateError|1 error 9"];
      }
    };
    CommunicateUpdateResult = class _CommunicateUpdateResult extends __protoMessage361 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateResult, a, b2);
      }
      static $() {
        return ["CommunicateUpdateResult|1 success #0 result|2 error #1 result", CommunicateUpdateSuccess, CommunicateUpdateError];
      }
    };
    CommunicateUpdateToolCall = class _CommunicateUpdateToolCall extends __protoMessage361 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateToolCall, a, b2);
      }
      static $() {
        return ["CommunicateUpdateToolCall|1 args #0|2 result #1", CommunicateUpdateArgs, CommunicateUpdateResult];
      }
    };
  }
});

