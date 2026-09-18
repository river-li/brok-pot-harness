var __protoPackage42, __protoMessage339, FetchArgs, FetchResult, FetchSuccess, FetchError;
var init_fetch_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/fetch_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage42 = "agent.v1.";
    __protoMessage339 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage42;
      }
    };
    FetchArgs = class _FetchArgs extends __protoMessage339 {
      constructor(data) {
        super();
        this.url = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchArgs, a, b2);
      }
      static $() {
        return ["FetchArgs|1 url 9|2 tool_call_id 9"];
      }
    };
    FetchResult = class _FetchResult extends __protoMessage339 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchResult, a, b2);
      }
      static $() {
        return ["FetchResult|1 success #0 result|2 error #1 result", FetchSuccess, FetchError];
      }
    };
    FetchSuccess = class _FetchSuccess extends __protoMessage339 {
      constructor(data) {
        super();
        this.url = "";
        this.content = "";
        this.statusCode = 0;
        this.contentType = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchSuccess, a, b2);
      }
      static $() {
        return ["FetchSuccess|1 url 9|2 content 9|3 status_code 5|4 content_type 9"];
      }
    };
    FetchError = class _FetchError extends __protoMessage339 {
      constructor(data) {
        super();
        this.url = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchError, a, b2);
      }
      static $() {
        return ["FetchError|1 url 9|2 error 9"];
      }
    };
  }
});
