var __protoPackage88, __protoMessage384, GetPrCodeTourArgs, PrCodeTourRevisionSnapshot, GetPrCodeTourSuccess, GetPrCodeTourError, GetPrCodeTourResult, GetPrCodeTourToolCall;
var init_get_pr_code_tour_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/get_pr_code_tour_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage88 = "agent.v1.";
    __protoMessage384 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage88;
      }
    };
    GetPrCodeTourArgs = class _GetPrCodeTourArgs extends __protoMessage384 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPrCodeTourArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPrCodeTourArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPrCodeTourArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPrCodeTourArgs, a, b2);
      }
      static $() {
        return ["GetPrCodeTourArgs|1 tool_call_id 9|2 revision_id 9?"];
      }
    };
    PrCodeTourRevisionSnapshot = class _PrCodeTourRevisionSnapshot extends __protoMessage384 {
      constructor(data) {
        super();
        this.revisionId = "";
        this.status = "";
        this.headSha = "";
        this.feedback = "";
        this.updatedAtMs = protoInt64.zero;
        this.isCurrent = false;
        this.markdown = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrCodeTourRevisionSnapshot().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrCodeTourRevisionSnapshot().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrCodeTourRevisionSnapshot().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrCodeTourRevisionSnapshot, a, b2);
      }
      static $() {
        return ["PrCodeTourRevisionSnapshot|1 revision_id 9|2 status 9|3 head_sha 9|4 feedback 9|5 updated_at_ms 3|6 is_current 8|7 markdown 9"];
      }
    };
    GetPrCodeTourSuccess = class _GetPrCodeTourSuccess extends __protoMessage384 {
      constructor(data) {
        super();
        this.revisions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPrCodeTourSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPrCodeTourSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPrCodeTourSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPrCodeTourSuccess, a, b2);
      }
      static $() {
        return ["GetPrCodeTourSuccess|1 revisions #0*", PrCodeTourRevisionSnapshot];
      }
    };
    GetPrCodeTourError = class _GetPrCodeTourError extends __protoMessage384 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPrCodeTourError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPrCodeTourError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPrCodeTourError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPrCodeTourError, a, b2);
      }
      static $() {
        return ["GetPrCodeTourError|1 error 9"];
      }
    };
    GetPrCodeTourResult = class _GetPrCodeTourResult extends __protoMessage384 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPrCodeTourResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPrCodeTourResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPrCodeTourResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPrCodeTourResult, a, b2);
      }
      static $() {
        return ["GetPrCodeTourResult|1 success #0 result|2 error #1 result", GetPrCodeTourSuccess, GetPrCodeTourError];
      }
    };
    GetPrCodeTourToolCall = class _GetPrCodeTourToolCall extends __protoMessage384 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetPrCodeTourToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetPrCodeTourToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetPrCodeTourToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetPrCodeTourToolCall, a, b2);
      }
      static $() {
        return ["GetPrCodeTourToolCall|1 args #0|2 result #1", GetPrCodeTourArgs, GetPrCodeTourResult];
      }
    };
  }
});
