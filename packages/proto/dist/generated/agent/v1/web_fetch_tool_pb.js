/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/web_fetch_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage55, __protoMessage352, WebFetchArgs, WebFetchResult, WebFetchSuccess, WebFetchError, WebFetchRejected, WebFetchToolCall, WebFetchRequestQuery, WebFetchRequestResponse, WebFetchRequestResponse_Approved, WebFetchRequestResponse_Rejected;
var init_web_fetch_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/web_fetch_tool_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb2();
    init_compact();
    __protoPackage55 = "agent.v1.";
    __protoMessage352 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage55;
      }
    };
    WebFetchArgs = class _WebFetchArgs extends __protoMessage352 {
      constructor(data) {
        super();
        this.url = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchArgs, a, b2);
      }
      static $() {
        return ["WebFetchArgs|1 url 9|2 tool_call_id 9"];
      }
    };
    WebFetchResult = class _WebFetchResult extends __protoMessage352 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchResult, a, b2);
      }
      static $() {
        return ["WebFetchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebFetchSuccess, WebFetchError, WebFetchRejected];
      }
    };
    WebFetchSuccess = class _WebFetchSuccess extends __protoMessage352 {
      constructor(data) {
        super();
        this.url = "";
        this.markdown = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchSuccess, a, b2);
      }
      static $() {
        return ["WebFetchSuccess|1 url 9|2 markdown 9|3 output_location #0?", OutputLocation];
      }
    };
    WebFetchError = class _WebFetchError extends __protoMessage352 {
      constructor(data) {
        super();
        this.url = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchError, a, b2);
      }
      static $() {
        return ["WebFetchError|1 url 9|2 error 9"];
      }
    };
    WebFetchRejected = class _WebFetchRejected extends __protoMessage352 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchRejected, a, b2);
      }
      static $() {
        return ["WebFetchRejected|1 reason 9"];
      }
    };
    WebFetchToolCall = class _WebFetchToolCall extends __protoMessage352 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchToolCall, a, b2);
      }
      static $() {
        return ["WebFetchToolCall|1 args #0|2 result #1", WebFetchArgs, WebFetchResult];
      }
    };
    WebFetchRequestQuery = class _WebFetchRequestQuery extends __protoMessage352 {
      constructor(data) {
        super();
        this.skipApproval = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchRequestQuery, a, b2);
      }
      static $() {
        return ["WebFetchRequestQuery|1 args #0|2 skip_approval 8|3 smart_mode_approval #1", WebFetchArgs, SmartModeApproval];
      }
    };
    WebFetchRequestResponse = class _WebFetchRequestResponse extends __protoMessage352 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchRequestResponse, a, b2);
      }
      static $() {
        return ["WebFetchRequestResponse|1 approved #0 result|2 rejected #1 result", WebFetchRequestResponse_Approved, WebFetchRequestResponse_Rejected];
      }
    };
    WebFetchRequestResponse_Approved = class _WebFetchRequestResponse_Approved extends __protoMessage352 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchRequestResponse_Approved().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchRequestResponse_Approved().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchRequestResponse_Approved().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchRequestResponse_Approved, a, b2);
      }
      static $() {
        return ["WebFetchRequestResponse.Approved"];
      }
    };
    WebFetchRequestResponse_Rejected = class _WebFetchRequestResponse_Rejected extends __protoMessage352 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchRequestResponse_Rejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchRequestResponse_Rejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchRequestResponse_Rejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchRequestResponse_Rejected, a, b2);
      }
      static $() {
        return ["WebFetchRequestResponse.Rejected|1 reason 9"];
      }
    };
  }
});

