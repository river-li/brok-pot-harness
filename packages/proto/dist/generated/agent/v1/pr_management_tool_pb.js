var __protoPackage59, __protoMessage355, PullRequestStatus, PrManagementArgs, CreatePrAction, UpdatePrAction, PostCommentAction, ResolveCommentAction, GetCiStatusAction, SetPrStatusAction, PrManagementResult, PrManagementSuccess, PrManagementError, PrManagementRejected, PrManagementRegistered, PrManagementNeedsConfirmation, PrManagementToolCall, PrManagementRequestQuery;
var init_pr_management_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pr_management_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage59 = "agent.v1.";
    __protoMessage355 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage59;
      }
    };
    PullRequestStatus = /* @__PURE__ */ enumType(proto3, __protoPackage59, "PullRequestStatus", [[0, "UNSPECIFIED"], [1, "OPEN"], [2, "CLOSED"]], 1);
    PrManagementArgs = class _PrManagementArgs extends __protoMessage355 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.action = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementArgs, a, b2);
      }
      static $() {
        return ["PrManagementArgs|1 tool_call_id 9|2 create_pr #0 action|3 update_pr #1 action|4 post_comment #2 action|5 resolve_comment #3 action|6 get_ci_status #4 action|7 set_pr_status #5 action", CreatePrAction, UpdatePrAction, PostCommentAction, ResolveCommentAction, GetCiStatusAction, SetPrStatusAction];
      }
    };
    CreatePrAction = class _CreatePrAction extends __protoMessage355 {
      constructor(data) {
        super();
        this.title = "";
        this.body = "";
        this.branchName = "";
        this.addLabels = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePrAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePrAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePrAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePrAction, a, b2);
      }
      static $() {
        return ["CreatePrAction|1 title 9|2 body 9|3 base_branch 9?|4 draft 8?|5 branch_name 9|6 add_labels 9*|7 repo_url 9?|8 skip_branch_prefix_check 8?|9 stack_on_pr_number 3?"];
      }
    };
    UpdatePrAction = class _UpdatePrAction extends __protoMessage355 {
      constructor(data) {
        super();
        this.addLabels = [];
        this.removeLabels = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdatePrAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdatePrAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdatePrAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdatePrAction, a, b2);
      }
      static $() {
        return ["UpdatePrAction|1 pr_url 9?|2 title 9?|3 body 9?|4 base_branch 9?|5 branch_name 9?|6 add_labels 9*|7 remove_labels 9*|8 repo_url 9?|9 stack_on_pr_number 3?|10 clear_stack 8?|11 draft 8?"];
      }
    };
    PostCommentAction = class _PostCommentAction extends __protoMessage355 {
      constructor(data) {
        super();
        this.body = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostCommentAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostCommentAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostCommentAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostCommentAction, a, b2);
      }
      static $() {
        return ["PostCommentAction|1 pr_url 9?|2 branch_name 9?|3 body 9|4 repo_url 9?|5 in_reply_to 3?|6 path 9?|7 line 5?|8 start_line 5?|9 side 9?|10 reply_to_reference 9?"];
      }
    };
    ResolveCommentAction = class _ResolveCommentAction extends __protoMessage355 {
      constructor(data) {
        super();
        this.commentId = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResolveCommentAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResolveCommentAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResolveCommentAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResolveCommentAction, a, b2);
      }
      static $() {
        return ["ResolveCommentAction|1 pr_url 9?|2 branch_name 9?|3 comment_id 3|4 repo_url 9?|5 comment_reference 9?"];
      }
    };
    GetCiStatusAction = class _GetCiStatusAction extends __protoMessage355 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetCiStatusAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetCiStatusAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetCiStatusAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetCiStatusAction, a, b2);
      }
      static $() {
        return ["GetCiStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?"];
      }
    };
    SetPrStatusAction = class _SetPrStatusAction extends __protoMessage355 {
      constructor(data) {
        super();
        this.status = PullRequestStatus.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetPrStatusAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetPrStatusAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetPrStatusAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetPrStatusAction, a, b2);
      }
      static $() {
        return ["SetPrStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?|4 status #0", PullRequestStatus];
      }
    };
    PrManagementResult = class _PrManagementResult extends __protoMessage355 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementResult, a, b2);
      }
      static $() {
        return ["PrManagementResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 registered #3 result|5 needs_confirmation #4 result", PrManagementSuccess, PrManagementError, PrManagementRejected, PrManagementRegistered, PrManagementNeedsConfirmation];
      }
    };
    PrManagementSuccess = class _PrManagementSuccess extends __protoMessage355 {
      constructor(data) {
        super();
        this.prUrl = "";
        this.prNumber = 0;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementSuccess, a, b2);
      }
      static $() {
        return ["PrManagementSuccess|1 pr_url 9|2 pr_number 5|3 message 9"];
      }
    };
    PrManagementError = class _PrManagementError extends __protoMessage355 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementError, a, b2);
      }
      static $() {
        return ["PrManagementError|1 error 9"];
      }
    };
    PrManagementRejected = class _PrManagementRejected extends __protoMessage355 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementRejected, a, b2);
      }
      static $() {
        return ["PrManagementRejected|1 reason 9"];
      }
    };
    PrManagementRegistered = class _PrManagementRegistered extends __protoMessage355 {
      constructor(data) {
        super();
        this.message = "";
        this.title = "";
        this.body = "";
        this.branchName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementRegistered().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementRegistered().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementRegistered().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementRegistered, a, b2);
      }
      static $() {
        return ["PrManagementRegistered|1 message 9|2 title 9|3 body 9|4 base_branch 9?|5 draft 8?|6 branch_name 9"];
      }
    };
    PrManagementNeedsConfirmation = class _PrManagementNeedsConfirmation extends __protoMessage355 {
      constructor(data) {
        super();
        this.message = "";
        this.discoveredPrUrl = "";
        this.discoveredPrNumber = 0;
        this.discoveredPrTitle = "";
        this.branchName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementNeedsConfirmation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementNeedsConfirmation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementNeedsConfirmation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementNeedsConfirmation, a, b2);
      }
      static $() {
        return ["PrManagementNeedsConfirmation|1 message 9|2 discovered_pr_url 9|3 discovered_pr_number 5|4 discovered_pr_title 9|5 branch_name 9"];
      }
    };
    PrManagementToolCall = class _PrManagementToolCall extends __protoMessage355 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementToolCall, a, b2);
      }
      static $() {
        return ["PrManagementToolCall|1 args #0|2 result #1", PrManagementArgs, PrManagementResult];
      }
    };
    PrManagementRequestQuery = class _PrManagementRequestQuery extends __protoMessage355 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PrManagementRequestQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PrManagementRequestQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PrManagementRequestQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PrManagementRequestQuery, a, b2);
      }
      static $() {
        return ["PrManagementRequestQuery|1 args #0", PrManagementArgs];
      }
    };
  }
});
