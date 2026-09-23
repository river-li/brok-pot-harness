var __protoPackage82, __protoMessage378, ConnectScmArgs, ConnectScmGithub, ConnectScmGithubRepository, ConnectScmResult, ConnectScmSuccess, ConnectScmError, ConnectScmRejected, ConnectScmToolCall, ConnectScmRequestQuery, ConnectScmRequestResponse, ConnectScmRequestResponse_Approved, ConnectScmRequestResponse_Rejected, ConnectScmRequestResponse_Failed;
var init_connect_scm_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/connect_scm_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage82 = "agent.v1.";
    __protoMessage378 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage82;
      }
    };
    ConnectScmArgs = class _ConnectScmArgs extends __protoMessage378 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.target = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmArgs, a, b2);
      }
      static $() {
        return ["ConnectScmArgs|1 tool_call_id 9|2 github #0 target", ConnectScmGithub];
      }
    };
    ConnectScmGithub = class _ConnectScmGithub extends __protoMessage378 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmGithub().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmGithub().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmGithub().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmGithub, a, b2);
      }
      static $() {
        return ["ConnectScmGithub|1 repository #0|2 ghe_application 9?", ConnectScmGithubRepository];
      }
    };
    ConnectScmGithubRepository = class _ConnectScmGithubRepository extends __protoMessage378 {
      constructor(data) {
        super();
        this.owner = "";
        this.repo = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmGithubRepository().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmGithubRepository().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmGithubRepository().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmGithubRepository, a, b2);
      }
      static $() {
        return ["ConnectScmGithubRepository|1 owner 9|2 repo 9"];
      }
    };
    ConnectScmResult = class _ConnectScmResult extends __protoMessage378 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmResult, a, b2);
      }
      static $() {
        return ["ConnectScmResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ConnectScmSuccess, ConnectScmError, ConnectScmRejected];
      }
    };
    ConnectScmSuccess = class _ConnectScmSuccess extends __protoMessage378 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmSuccess, a, b2);
      }
      static $() {
        return ["ConnectScmSuccess"];
      }
    };
    ConnectScmError = class _ConnectScmError extends __protoMessage378 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmError, a, b2);
      }
      static $() {
        return ["ConnectScmError|1 error 9"];
      }
    };
    ConnectScmRejected = class _ConnectScmRejected extends __protoMessage378 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRejected, a, b2);
      }
      static $() {
        return ["ConnectScmRejected|1 reason 9"];
      }
    };
    ConnectScmToolCall = class _ConnectScmToolCall extends __protoMessage378 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmToolCall, a, b2);
      }
      static $() {
        return ["ConnectScmToolCall|1 args #0|2 result #1", ConnectScmArgs, ConnectScmResult];
      }
    };
    ConnectScmRequestQuery = class _ConnectScmRequestQuery extends __protoMessage378 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRequestQuery, a, b2);
      }
      static $() {
        return ["ConnectScmRequestQuery|1 args #0", ConnectScmArgs];
      }
    };
    ConnectScmRequestResponse = class _ConnectScmRequestResponse extends __protoMessage378 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRequestResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRequestResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRequestResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRequestResponse, a, b2);
      }
      static $() {
        return ["ConnectScmRequestResponse|1 approved #0 result|2 rejected #1 result|3 failed #2 result", ConnectScmRequestResponse_Approved, ConnectScmRequestResponse_Rejected, ConnectScmRequestResponse_Failed];
      }
    };
    ConnectScmRequestResponse_Approved = class _ConnectScmRequestResponse_Approved extends __protoMessage378 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRequestResponse_Approved().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRequestResponse_Approved().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRequestResponse_Approved().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRequestResponse_Approved, a, b2);
      }
      static $() {
        return ["ConnectScmRequestResponse.Approved"];
      }
    };
    ConnectScmRequestResponse_Rejected = class _ConnectScmRequestResponse_Rejected extends __protoMessage378 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRequestResponse_Rejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRequestResponse_Rejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRequestResponse_Rejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRequestResponse_Rejected, a, b2);
      }
      static $() {
        return ["ConnectScmRequestResponse.Rejected|1 reason 9"];
      }
    };
    ConnectScmRequestResponse_Failed = class _ConnectScmRequestResponse_Failed extends __protoMessage378 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmRequestResponse_Failed().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmRequestResponse_Failed().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmRequestResponse_Failed().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmRequestResponse_Failed, a, b2);
      }
      static $() {
        return ["ConnectScmRequestResponse.Failed|1 error 9"];
      }
    };
  }
});
