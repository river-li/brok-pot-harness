var __protoPackage105, __protoMessage3100, SmartModeClassifierDecision, SmartModeClassifierConversationMessage, SmartModeClassifierArgs, SmartModeRiskTarget, SmartModeClassifierResult, SmartModeClassifierSuccess, SmartModeClassifierError;
var init_smart_mode_classifier_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/smart_mode_classifier_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage105 = "agent.v1.";
    __protoMessage3100 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage105;
      }
    };
    SmartModeClassifierDecision = /* @__PURE__ */ enumType(proto3, __protoPackage105, "SmartModeClassifierDecision", [[0, "UNSPECIFIED"], [1, "ALLOW"], [2, "BLOCK"]], 1);
    SmartModeClassifierConversationMessage = class _SmartModeClassifierConversationMessage extends __protoMessage3100 {
      constructor(data) {
        super();
        this.role = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeClassifierConversationMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeClassifierConversationMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeClassifierConversationMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeClassifierConversationMessage, a, b2);
      }
      static $() {
        return ["SmartModeClassifierConversationMessage|1 role 9|2 content 9"];
      }
    };
    SmartModeClassifierArgs = class _SmartModeClassifierArgs extends __protoMessage3100 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.conversationContext = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeClassifierArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeClassifierArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeClassifierArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeClassifierArgs, a, b2);
      }
      static $() {
        return ["SmartModeClassifierArgs|1 tool_call_id 9|2 parent_conversation_id 9?|3 target #0|4 conversation_context #1*", SmartModeRiskTarget, SmartModeClassifierConversationMessage];
      }
    };
    SmartModeRiskTarget = class _SmartModeRiskTarget extends __protoMessage3100 {
      constructor(data) {
        super();
        this.action = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeRiskTarget().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeRiskTarget().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeRiskTarget().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeRiskTarget, a, b2);
      }
      static $() {
        return ["SmartModeRiskTarget|1 action 9|2 arguments #0", Struct];
      }
    };
    SmartModeClassifierResult = class _SmartModeClassifierResult extends __protoMessage3100 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeClassifierResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeClassifierResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeClassifierResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeClassifierResult, a, b2);
      }
      static $() {
        return ["SmartModeClassifierResult|1 success #0 result|2 error #1 result", SmartModeClassifierSuccess, SmartModeClassifierError];
      }
    };
    SmartModeClassifierSuccess = class _SmartModeClassifierSuccess extends __protoMessage3100 {
      constructor(data) {
        super();
        this.decision = SmartModeClassifierDecision.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeClassifierSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeClassifierSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeClassifierSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeClassifierSuccess, a, b2);
      }
      static $() {
        return ["SmartModeClassifierSuccess|1 decision #0|2 block_reason 9?|3 proposed_allow_rule 9?", SmartModeClassifierDecision];
      }
    };
    SmartModeClassifierError = class _SmartModeClassifierError extends __protoMessage3100 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeClassifierError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeClassifierError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeClassifierError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeClassifierError, a, b2);
      }
      static $() {
        return ["SmartModeClassifierError|1 error 9"];
      }
    };
  }
});
