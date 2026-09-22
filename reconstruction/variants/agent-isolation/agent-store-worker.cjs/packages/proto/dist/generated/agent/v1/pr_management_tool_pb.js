/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pr_management_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage47 = "agent.v1.";
var __protoMessage346 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage47;
  }
};
var PullRequestStatus = /* @__PURE__ */ enumType(proto3, __protoPackage47, "PullRequestStatus", [[0, "UNSPECIFIED"], [1, "OPEN"], [2, "CLOSED"]], 1);
var PrManagementArgs = class _PrManagementArgs extends __protoMessage346 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.action = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementArgs, a, b);
  }
  static $() {
    return ["PrManagementArgs|1 tool_call_id 9|2 create_pr #0 action|3 update_pr #1 action|4 post_comment #2 action|5 resolve_comment #3 action|6 get_ci_status #4 action|7 set_pr_status #5 action", CreatePrAction, UpdatePrAction, PostCommentAction, ResolveCommentAction, GetCiStatusAction, SetPrStatusAction];
  }
};
var CreatePrAction = class _CreatePrAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.title = "";
    this.body = "";
    this.branchName = "";
    this.addLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePrAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePrAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePrAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePrAction, a, b);
  }
  static $() {
    return ["CreatePrAction|1 title 9|2 body 9|3 base_branch 9?|4 draft 8?|5 branch_name 9|6 add_labels 9*|7 repo_url 9?|8 skip_branch_prefix_check 8?|9 stack_on_pr_number 3?"];
  }
};
var UpdatePrAction = class _UpdatePrAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.addLabels = [];
    this.removeLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrAction, a, b);
  }
  static $() {
    return ["UpdatePrAction|1 pr_url 9?|2 title 9?|3 body 9?|4 base_branch 9?|5 branch_name 9?|6 add_labels 9*|7 remove_labels 9*|8 repo_url 9?|9 stack_on_pr_number 3?|10 clear_stack 8?|11 draft 8?"];
  }
};
var PostCommentAction = class _PostCommentAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PostCommentAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PostCommentAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PostCommentAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PostCommentAction, a, b);
  }
  static $() {
    return ["PostCommentAction|1 pr_url 9?|2 branch_name 9?|3 body 9|4 repo_url 9?|5 in_reply_to 3?|6 path 9?|7 line 5?|8 start_line 5?|9 side 9?|10 reply_to_reference 9?"];
  }
};
var ResolveCommentAction = class _ResolveCommentAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.commentId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ResolveCommentAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ResolveCommentAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ResolveCommentAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ResolveCommentAction, a, b);
  }
  static $() {
    return ["ResolveCommentAction|1 pr_url 9?|2 branch_name 9?|3 comment_id 3|4 repo_url 9?|5 comment_reference 9?"];
  }
};
var GetCiStatusAction = class _GetCiStatusAction extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetCiStatusAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetCiStatusAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetCiStatusAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetCiStatusAction, a, b);
  }
  static $() {
    return ["GetCiStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?"];
  }
};
var SetPrStatusAction = class _SetPrStatusAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.status = PullRequestStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetPrStatusAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetPrStatusAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetPrStatusAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetPrStatusAction, a, b);
  }
  static $() {
    return ["SetPrStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?|4 status #0", PullRequestStatus];
  }
};
var PrManagementResult = class _PrManagementResult extends __protoMessage346 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementResult, a, b);
  }
  static $() {
    return ["PrManagementResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 registered #3 result|5 needs_confirmation #4 result", PrManagementSuccess, PrManagementError, PrManagementRejected, PrManagementRegistered, PrManagementNeedsConfirmation];
  }
};
var PrManagementSuccess = class _PrManagementSuccess extends __protoMessage346 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.prNumber = 0;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementSuccess, a, b);
  }
  static $() {
    return ["PrManagementSuccess|1 pr_url 9|2 pr_number 5|3 message 9"];
  }
};
var PrManagementError = class _PrManagementError extends __protoMessage346 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementError, a, b);
  }
  static $() {
    return ["PrManagementError|1 error 9"];
  }
};
var PrManagementRejected = class _PrManagementRejected extends __protoMessage346 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementRejected, a, b);
  }
  static $() {
    return ["PrManagementRejected|1 reason 9"];
  }
};
var PrManagementRegistered = class _PrManagementRegistered extends __protoMessage346 {
  constructor(data) {
    super();
    this.message = "";
    this.title = "";
    this.body = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementRegistered().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementRegistered().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementRegistered().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementRegistered, a, b);
  }
  static $() {
    return ["PrManagementRegistered|1 message 9|2 title 9|3 body 9|4 base_branch 9?|5 draft 8?|6 branch_name 9"];
  }
};
var PrManagementNeedsConfirmation = class _PrManagementNeedsConfirmation extends __protoMessage346 {
  constructor(data) {
    super();
    this.message = "";
    this.discoveredPrUrl = "";
    this.discoveredPrNumber = 0;
    this.discoveredPrTitle = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementNeedsConfirmation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementNeedsConfirmation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementNeedsConfirmation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementNeedsConfirmation, a, b);
  }
  static $() {
    return ["PrManagementNeedsConfirmation|1 message 9|2 discovered_pr_url 9|3 discovered_pr_number 5|4 discovered_pr_title 9|5 branch_name 9"];
  }
};
var PrManagementToolCall = class _PrManagementToolCall extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementToolCall, a, b);
  }
  static $() {
    return ["PrManagementToolCall|1 args #0|2 result #1", PrManagementArgs, PrManagementResult];
  }
};

