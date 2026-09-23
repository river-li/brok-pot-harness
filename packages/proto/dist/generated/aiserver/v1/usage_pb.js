var __protoPackage128, __protoMessage3122, UsageEventKind, ModelSelectionSnapshot, ModelSelectionSnapshot_ModelParameterValue, UsageEventDetails, UsageEventDetails_PromptHook, UsageEventDetails_BugFinderTriggerV1, UsageEventDetails_BugBot, UsageEventDetails_Chat, UsageEventDetails_FastApply, UsageEventDetails_Composer, UsageEventDetails_ToolCallComposer, UsageEventDetails_WarmComposer, UsageEventDetails_ContextChat, UsageEventDetails_CmdK, UsageEventDetails_TerminalCmdK, UsageEventDetails_AiReviewAcceptedComment, UsageEventDetails_InterpreterChat, UsageEventDetails_SlashEdit, UsageEventDetails_AgentSdkManagedProduct, UsageEvent, UsageEventDisplay, TokenUsage;
var init_usage_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/usage_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage128 = "aiserver.v1.";
    __protoMessage3122 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage128;
      }
    };
    UsageEventKind = /* @__PURE__ */ enumType(proto3, __protoPackage128, "UsageEventKind", [[0, "UNSPECIFIED"], [1, "USAGE_BASED"], [2, "USER_API_KEY"], [3, "INCLUDED_IN_PRO"], [4, "INCLUDED_IN_BUSINESS"], [5, "ERRORED_NOT_CHARGED"], [6, "ABORTED_NOT_CHARGED"], [7, "CUSTOM_SUBSCRIPTION"], [8, "INCLUDED_IN_PRO_PLUS"], [9, "INCLUDED_IN_ULTRA"], [10, "FREE_CREDIT"]], 1);
    ModelSelectionSnapshot = class _ModelSelectionSnapshot extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelId = "";
        this.maxMode = false;
        this.parameters = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ModelSelectionSnapshot().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ModelSelectionSnapshot().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ModelSelectionSnapshot().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ModelSelectionSnapshot, a, b2);
      }
      static $() {
        return ["ModelSelectionSnapshot|1 model_id 9|2 max_mode 8|3 parameters #0*", ModelSelectionSnapshot_ModelParameterValue];
      }
    };
    ModelSelectionSnapshot_ModelParameterValue = class _ModelSelectionSnapshot_ModelParameterValue extends __protoMessage3122 {
      constructor(data) {
        super();
        this.id = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ModelSelectionSnapshot_ModelParameterValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ModelSelectionSnapshot_ModelParameterValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ModelSelectionSnapshot_ModelParameterValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ModelSelectionSnapshot_ModelParameterValue, a, b2);
      }
      static $() {
        return ["ModelSelectionSnapshot.ModelParameterValue|1 id 9|2 value 9"];
      }
    };
    UsageEventDetails = class _UsageEventDetails extends __protoMessage3122 {
      constructor(data) {
        super();
        this.feature = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails, a, b2);
      }
      static $() {
        return ["UsageEventDetails|1 chat #0 feature|2 context_chat #1 feature|3 cmd_k #2 feature|4 terminal_cmd_k #3 feature|5 ai_review_accepted_comment #4 feature|6 interpreter_chat #5 feature|7 slash_edit #6 feature|8 composer #7 feature|9 fast_apply #8 feature|10 warm_composer #9 feature|11 bug_finder_trigger_v1 #10 feature|12 tool_call_composer #11 feature|14 bug_bot #12 feature|15 prompt_hook #13 feature|20 agent_sdk_managed #14?|13 override_num_requests_counted 5?|16 override_num_requests_counted_millis 5?|17 routed_model 9?|18 requested_model_selection #15?|19 effective_model_selection #15?", UsageEventDetails_Chat, UsageEventDetails_ContextChat, UsageEventDetails_CmdK, UsageEventDetails_TerminalCmdK, UsageEventDetails_AiReviewAcceptedComment, UsageEventDetails_InterpreterChat, UsageEventDetails_SlashEdit, UsageEventDetails_Composer, UsageEventDetails_FastApply, UsageEventDetails_WarmComposer, UsageEventDetails_BugFinderTriggerV1, UsageEventDetails_ToolCallComposer, UsageEventDetails_BugBot, UsageEventDetails_PromptHook, UsageEventDetails_AgentSdkManagedProduct, ModelSelectionSnapshot];
      }
    };
    UsageEventDetails_PromptHook = class _UsageEventDetails_PromptHook extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_PromptHook().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_PromptHook().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_PromptHook().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_PromptHook, a, b2);
      }
      static $() {
        return ["UsageEventDetails.PromptHook|1 model_intent 9|2 token_usage #0?|3 max_mode 8?|4 is_token_based_call 8?", TokenUsage];
      }
    };
    UsageEventDetails_BugFinderTriggerV1 = class _UsageEventDetails_BugFinderTriggerV1 extends __protoMessage3122 {
      constructor(data) {
        super();
        this.inBackgroundSubsidized = false;
        this.costCents = 0;
        this.isFast = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_BugFinderTriggerV1().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_BugFinderTriggerV1().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_BugFinderTriggerV1().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_BugFinderTriggerV1, a, b2);
      }
      static $() {
        return ["UsageEventDetails.BugFinderTriggerV1|1 in_background_subsidized 8|2 cost_cents 5|3 is_fast 8"];
      }
    };
    UsageEventDetails_BugBot = class _UsageEventDetails_BugBot extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        this.isTokenBasedCall = false;
        this.maxMode = false;
        this.discount = { case: void 0 };
        this.billingMode = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_BugBot().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_BugBot().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_BugBot().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_BugBot, a, b2);
      }
      static $() {
        return ["UsageEventDetails.BugBot|1 model_intent 9|2 token_usage #0|3 is_token_based_call 8|4 max_mode 8|5 no_discount #1 discount|6 free #1 discount|7 billing_mode 9", TokenUsage, Empty];
      }
    };
    UsageEventDetails_Chat = class _UsageEventDetails_Chat extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_Chat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_Chat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_Chat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_Chat, a, b2);
      }
      static $() {
        return ["UsageEventDetails.Chat|1 model_intent 9|2 override_num_requests_counted 5?|3 is_token_based_call 8?|4 token_usage #0?|5 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_FastApply = class _UsageEventDetails_FastApply extends __protoMessage3122 {
      constructor(data) {
        super();
        this.isOptimistic = false;
        this.willingToPayExtraForSpeed = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_FastApply().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_FastApply().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_FastApply().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_FastApply, a, b2);
      }
      static $() {
        return ["UsageEventDetails.FastApply|1 is_optimistic 8|2 willing_to_pay_extra_for_speed 8"];
      }
    };
    UsageEventDetails_Composer = class _UsageEventDetails_Composer extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_Composer().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_Composer().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_Composer().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_Composer, a, b2);
      }
      static $() {
        return ["UsageEventDetails.Composer|1 model_intent 9|2 override_num_requests_counted 5?|3 is_headless 8?|4 is_token_based_call 8?|5 token_usage #0?|6 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_ToolCallComposer = class _UsageEventDetails_ToolCallComposer extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_ToolCallComposer().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_ToolCallComposer().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_ToolCallComposer().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_ToolCallComposer, a, b2);
      }
      static $() {
        return ["UsageEventDetails.ToolCallComposer|1 model_intent 9|2 override_num_requests_counted 5?|3 is_headless 8?|4 is_token_based_call 8?|5 token_usage #0?|6 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_WarmComposer = class _UsageEventDetails_WarmComposer extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_WarmComposer().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_WarmComposer().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_WarmComposer().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_WarmComposer, a, b2);
      }
      static $() {
        return ["UsageEventDetails.WarmComposer|1 model_intent 9|2 max_mode 8?"];
      }
    };
    UsageEventDetails_ContextChat = class _UsageEventDetails_ContextChat extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_ContextChat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_ContextChat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_ContextChat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_ContextChat, a, b2);
      }
      static $() {
        return ["UsageEventDetails.ContextChat|1 model_intent 9|2 override_num_requests_counted 5?|3 is_token_based_call 8?|4 token_usage #0?|5 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_CmdK = class _UsageEventDetails_CmdK extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_CmdK().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_CmdK().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_CmdK().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_CmdK, a, b2);
      }
      static $() {
        return ["UsageEventDetails.CmdK|1 model_intent 9|2 override_num_requests_counted 5?|3 is_token_based_call 8?|4 token_usage #0?|5 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_TerminalCmdK = class _UsageEventDetails_TerminalCmdK extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_TerminalCmdK().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_TerminalCmdK().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_TerminalCmdK().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_TerminalCmdK, a, b2);
      }
      static $() {
        return ["UsageEventDetails.TerminalCmdK|1 model_intent 9|2 override_num_requests_counted 5?|3 is_token_based_call 8?|4 token_usage #0?|5 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_AiReviewAcceptedComment = class _UsageEventDetails_AiReviewAcceptedComment extends __protoMessage3122 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_AiReviewAcceptedComment().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_AiReviewAcceptedComment().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_AiReviewAcceptedComment().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_AiReviewAcceptedComment, a, b2);
      }
      static $() {
        return ["UsageEventDetails.AiReviewAcceptedComment"];
      }
    };
    UsageEventDetails_InterpreterChat = class _UsageEventDetails_InterpreterChat extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_InterpreterChat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_InterpreterChat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_InterpreterChat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_InterpreterChat, a, b2);
      }
      static $() {
        return ["UsageEventDetails.InterpreterChat|1 model_intent 9|2 override_num_requests_counted 5?|3 is_token_based_call 8?|4 token_usage #0?|5 max_mode 8?", TokenUsage];
      }
    };
    UsageEventDetails_SlashEdit = class _UsageEventDetails_SlashEdit extends __protoMessage3122 {
      constructor(data) {
        super();
        this.modelIntent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_SlashEdit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_SlashEdit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_SlashEdit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_SlashEdit, a, b2);
      }
      static $() {
        return ["UsageEventDetails.SlashEdit|1 model_intent 9|2 max_mode 8?"];
      }
    };
    UsageEventDetails_AgentSdkManagedProduct = class _UsageEventDetails_AgentSdkManagedProduct extends __protoMessage3122 {
      constructor(data) {
        super();
        this.managedType = "";
        this.applicationSlug = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDetails_AgentSdkManagedProduct().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDetails_AgentSdkManagedProduct().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDetails_AgentSdkManagedProduct().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDetails_AgentSdkManagedProduct, a, b2);
      }
      static $() {
        return ["UsageEventDetails.AgentSdkManagedProduct|1 managed_type 9|2 application_slug 9"];
      }
    };
    UsageEvent = class _UsageEvent extends __protoMessage3122 {
      constructor(data) {
        super();
        this.timestamp = protoInt64.zero;
        this.isSlow = false;
        this.status = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEvent, a, b2);
      }
      static $() {
        return ["UsageEvent|1 timestamp 3|2 details #0|3 subscription_product_id 9?|4 usage_price_id 9?|5 is_slow 8|6 status 9|7 owning_user 9?|8 owning_team 9?|9 price_cents 2?|10 team_membership_type 9?", UsageEventDetails];
      }
    };
    UsageEventDisplay = class _UsageEventDisplay extends __protoMessage3122 {
      constructor(data) {
        super();
        this.timestamp = protoInt64.zero;
        this.model = "";
        this.kind = UsageEventKind.UNSPECIFIED;
        this.maxMode = false;
        this.requestsCosts = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UsageEventDisplay().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UsageEventDisplay().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UsageEventDisplay().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UsageEventDisplay, a, b2);
      }
      static $() {
        return ["UsageEventDisplay|1 timestamp 3|2 model 9|3 kind #0|4 custom_subscription_name 9?|5 max_mode 8|6 requests_costs 2|7 usage_based_costs 9?|8 is_token_based_call 8?|9 token_usage #1?|10 owning_user 9?|11 owning_team 9?|12 user_email 9?|13 cursor_token_fee 2?|14 is_chargeable 8?|15 service_account_name 9?|16 service_account_id 9?|17 is_headless 8?|18 charged_cents 2?|19 cloud_agent_id 9?|20 automation_id 9?|21 automation_managed_type 9?|22 client_type 9?|23 conversation_id 9?|24 subscription_product_id 9?|25 pr_author 9?|26 repo 9?|27 pr_number 5?", UsageEventKind, TokenUsage];
      }
    };
    TokenUsage = class _TokenUsage extends __protoMessage3122 {
      constructor(data) {
        super();
        this.inputTokens = 0;
        this.outputTokens = 0;
        this.cacheWriteTokens = 0;
        this.cacheReadTokens = 0;
        this.totalCents = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TokenUsage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TokenUsage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TokenUsage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TokenUsage, a, b2);
      }
      static $() {
        return ["TokenUsage|1 input_tokens 5|2 output_tokens 5|3 cache_write_tokens 5|4 cache_read_tokens 5|5 total_cents 2|6 discount_percent_off 5?|7 enterprise_usage_discount_percent 2?"];
      }
    };
  }
});
