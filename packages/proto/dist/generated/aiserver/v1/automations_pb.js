init_esm();
init_compact();
var __protoPackage154 = "aiserver.v1.";
var __protoMessage3146 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage154;
  }
};
var AutomationDefaultTool = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationDefaultTool", [[0, "UNSPECIFIED"], [1, "OPEN_GIT_PR"]], 1);
var SlackCompletionReactionMode = /* @__PURE__ */ enumType(proto3, __protoPackage154, "SlackCompletionReactionMode", [[0, "UNSPECIFIED"], [1, "ON"], [2, "OFF"], [3, "CUSTOM"]], 1);
var AutomationScope = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationScope", [[0, "UNSPECIFIED"], [1, "USER"], [2, "TEAM"], [3, "TEAM_VISIBLE"], [4, "TEAM_EDITABLE"], [5, "TEAM_EDITABLE_USER"]], 1);
var AutomationCreationSource = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationCreationSource", [[0, "UNSPECIFIED"], [1, "PORTAL_WEB"], [2, "GLASS_UI"], [3, "SKILL_MCP"], [4, "CONFIG_AS_CODE"]], 1);
var AutomationManagedBy = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationManagedBy", [[0, "UNSPECIFIED"], [1, "UI"], [2, "DEPLOY"], [3, "ANY"]], 1);
var PromptEffortLevel = /* @__PURE__ */ enumType(proto3, __protoPackage154, "PromptEffortLevel", [[0, "UNSPECIFIED"], [1, "STANDARD"], [10, "HARD"]], 1);
var PromptRunMode = /* @__PURE__ */ enumType(proto3, __protoPackage154, "PromptRunMode", [[0, "UNSPECIFIED"], [1, "SAME_CHAT"], [2, "NEW_AGENT"]], 1);
var GitPullRequestAction = /* @__PURE__ */ enumType(proto3, __protoPackage154, "GitPullRequestAction", [[0, "UNSPECIFIED"], [1, "OPENED"], [2, "PUSHED"], [3, "MERGED"], [4, "COMMENTED"], [5, "DRAFT_OPENED"], [6, "LABELED"], [7, "UNLABELED"], [8, "CLOSED"]], 1);
var GitCICompletionCondition = /* @__PURE__ */ enumType(proto3, __protoPackage154, "GitCICompletionCondition", [[0, "GIT_CI_COMPLETION_CONDITION_UNSPECIFIED"], [1, "GIT_CI_COMPLETION_CONDITION_FAILURE"], [2, "GIT_CI_COMPLETION_CONDITION_SUCCESS"], [3, "GIT_CI_COMPLETION_CONDITION_ANY"]]);
var GitWorkflowRunConclusion = /* @__PURE__ */ enumType(proto3, __protoPackage154, "GitWorkflowRunConclusion", [[0, "UNSPECIFIED"], [1, "ANY"], [2, "SUCCESS"], [3, "FAILURE"], [4, "CANCELLED"]], 1);
var PlatformActionStatus = /* @__PURE__ */ enumType(proto3, __protoPackage154, "PlatformActionStatus", [[0, "UNSPECIFIED"], [1, "PENDING"], [2, "SUCCESS"], [3, "ERROR"], [4, "SKIPPED"]], 1);
var PlatformActionScope = /* @__PURE__ */ enumType(proto3, __protoPackage154, "PlatformActionScope", [[0, "UNSPECIFIED"], [1, "WORKFLOW"], [2, "TRIGGER"]], 1);
var PlatformTriggerType = /* @__PURE__ */ enumType(proto3, __protoPackage154, "PlatformTriggerType", [[0, "UNSPECIFIED"], [1, "GIT"], [2, "SLACK"], [3, "LINEAR"], [4, "CRON"], [5, "WEBHOOK"], [6, "SLACK_CHANNEL_CREATED"], [7, "PAGERDUTY"], [8, "SENTRY"], [9, "MICROSOFT_TEAMS"], [10, "MICROSOFT_TEAMS_CHANNEL_CREATED"], [11, "SLACK_REACTION_ADDED"], [12, "EMAIL_RECEIVED"]], 1);
var McpAuthState = /* @__PURE__ */ enumType(proto3, __protoPackage154, "McpAuthState", [[0, "UNSPECIFIED"], [1, "UNKNOWN"], [2, "AUTHENTICATED"], [3, "NEEDS_AUTH"]], 1);
var AutomationRunListKind = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationRunListKind", [[0, "UNSPECIFIED"], [1, "EXECUTION_RUNS"], [2, "FILTER_EVALUATIONS"]], 1);
var AutomationFilterDecision = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationFilterDecision", [[0, "UNSPECIFIED"], [1, "ALLOW"], [2, "BLOCK"], [3, "ERROR"]], 1);
var AutomationRunStatus = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationRunStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "FAILED"], [3, "SUCCEEDED"], [4, "SKIPPED"]], 1);
var AutomationRunFailureCode = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationRunFailureCode", [[0, "UNSPECIFIED"], [2, "UNAUTHENTICATED_REPO_ACCESS"], [3, "RESOURCE_EXHAUSTED"], [4, "UNAVAILABLE"], [5, "CI_SIGNAL_FAILURE"], [6, "UNKNOWN"], [7, "FAILED_TO_START_AGENT"], [8, "CANCELLED_BY_USER"], [9, "CANCELLED_AUTOMATION_DISABLED"], [10, "CONCURRENT_LIMIT_EXCEEDED"], [11, "BRANCH_NOT_FOUND"], [12, "MODEL_BLOCKED"], [13, "PRIVATE_WORKERS_DISABLED"], [14, "PRIVATE_WORKER_RESOURCE_EXHAUSTED"], [15, "GITHUB_IP_ALLOWLIST"], [16, "INVALID_REQUEST"], [17, "CLOUD_AGENT_PLAN_RESTRICTED"], [18, "PRIVATE_WORKER_MISSING_REPO"], [19, "ENVIRONMENT_BUILD_FAILED"], [20, "FORK_PR_UNSUPPORTED"], [21, "PROTECTED_SCOPE_BLOCKED"], [22, "CANCELLED_SUPERSEDED_BY_NEWER_EVENT"], [23, "USER_BLOCKED"], [24, "PAYLOAD_TOO_LARGE"]], 1);
var AutomationRunRetryIneligibleReason = /* @__PURE__ */ enumType(proto3, __protoPackage154, "AutomationRunRetryIneligibleReason", [[0, "UNSPECIFIED"], [1, "LAUNCH_CONTEXT_MISSING"], [2, "PERMISSION_DENIED"]], 1);
var Trigger = class _Trigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.trigger = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Trigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Trigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Trigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Trigger, a, b2);
  }
  static $() {
    return ["Trigger|1 cron #0 trigger|2 git #1 trigger|7 slack_trigger #2 trigger|9 linear #3 trigger|11 webhook #4 trigger|12 slack_channel_created #5 trigger|13 pagerduty #6 trigger|15 sentry #7 trigger|16 microsoft_teams_trigger #8 trigger|17 microsoft_teams_channel_created #9 trigger|18 slack_reaction_added #10 trigger|19 slack_mention #11 trigger|20 slack_any_reaction_added #12 trigger|21 email_received #13 trigger|14 agentic_filter_prompt 9?", CronTrigger, GitTrigger, SlackTrigger, LinearTrigger, WebhookTrigger, SlackChannelCreatedTrigger, PagerDutyTrigger, SentryTrigger, MicrosoftTeamsTrigger, MicrosoftTeamsChannelCreatedTrigger, SlackReactionAddedTrigger, SlackMentionTrigger, SlackAnyReactionAddedTrigger, EmailReceivedTrigger];
  }
};
var Action = class _Action extends __protoMessage3146 {
  constructor(data) {
    super();
    this.action = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Action().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Action().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Action().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Action, a, b2);
  }
  static $() {
    return ["Action|4 git_pr #0 action|5 pr_comment #1 action|6 slack #2 action|7 mcp #3 action|8 manage_check_run #4 action|9 request_reviewers #5 action|10 read_slack #6 action|11 approve_pr #7 action|12 resolve_review_threads #8 action|13 microsoft_teams #9 action|14 read_microsoft_teams #10 action", GitPrAction, PrCommentAction, SlackAction, McpAction, ManageCheckRunAction, RequestReviewersAction, ReadSlackAction, ApprovePrAction, ResolveReviewThreadsAction, MicrosoftTeamsAction, ReadMicrosoftTeamsAction];
  }
};
var McpAction = class _McpAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpAction, a, b2);
  }
  static $() {
    return ["McpAction|1 server #0", McpServerConfig];
  }
};
var McpServerConfig = class _McpServerConfig extends __protoMessage3146 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpServerConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpServerConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpServerConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpServerConfig, a, b2);
  }
  static $() {
    return ["McpServerConfig|4 id 3?|1 name 9"];
  }
};
var AgentPrivateWorkerLabel = class _AgentPrivateWorkerLabel extends __protoMessage3146 {
  constructor(data) {
    super();
    this.key = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentPrivateWorkerLabel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentPrivateWorkerLabel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentPrivateWorkerLabel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentPrivateWorkerLabel, a, b2);
  }
  static $() {
    return ["AgentPrivateWorkerLabel|1 key 9|2 value 9"];
  }
};
var AgentPrivateWorkerConfig = class _AgentPrivateWorkerConfig extends __protoMessage3146 {
  constructor(data) {
    super();
    this.labels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentPrivateWorkerConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentPrivateWorkerConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentPrivateWorkerConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentPrivateWorkerConfig, a, b2);
  }
  static $() {
    return ["AgentPrivateWorkerConfig|1 labels #0*", AgentPrivateWorkerLabel];
  }
};
var AgentOptions = class _AgentOptions extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentOptions, a, b2);
  }
  static $() {
    return ["AgentOptions|1 skip_install 8?|2 private_worker #0?|3 environment_public_id 9?", AgentPrivateWorkerConfig];
  }
};
var Workflow = class _Workflow extends __protoMessage3146 {
  constructor(data) {
    super();
    this.triggers = [];
    this.actions = [];
    this.prompts = [];
    this.slackNotifiedChannels = [];
    this.disabledDefaultTools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Workflow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Workflow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Workflow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Workflow, a, b2);
  }
  static $() {
    return ["Workflow|10 triggers #0*|11 actions #1*|3 prompts #2*|8 model 9?|12 git_config #3?|13 agent_options #4?|14 memory_enabled 8?|15 slack_notified_channels 9*|16 slack_completion_reaction_mode #5?|17 slack_completion_reaction_custom_emoji 9?|18 managed_config #6?|19 disabled_default_tools #7*|20 grok_bot_session_id 9?|21 grok_bot_creator_auth_id 9?|22 model_selection #8?", Trigger, Action, Prompt, GitConfig, AgentOptions, SlackCompletionReactionMode, Struct, AutomationDefaultTool, AutomationModelSelection];
  }
};
var Prompt = class _Prompt extends __protoMessage3146 {
  constructor(data) {
    super();
    this.prompt = "";
    this.effortLevel = PromptEffortLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Prompt().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Prompt().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Prompt().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Prompt, a, b2);
  }
  static $() {
    return ["Prompt|1 prompt 9|2 effort_level #0|3 model 9?|4 is_filter 8?|5 run_mode #1?|6 suppress_slack_reaction 8?|7 model_selection #2?", PromptEffortLevel, PromptRunMode, AutomationModelSelection];
  }
};
var AutomationModelSelection = class _AutomationModelSelection extends __protoMessage3146 {
  constructor(data) {
    super();
    this.modelId = "";
    this.parameters = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationModelSelection().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationModelSelection().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationModelSelection().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationModelSelection, a, b2);
  }
  static $() {
    return ["AutomationModelSelection|1 model_id 9|2 parameters #0*|3 max_mode 8?", AutomationModelSelection_ParameterValue];
  }
};
var AutomationModelSelection_ParameterValue = class _AutomationModelSelection_ParameterValue extends __protoMessage3146 {
  constructor(data) {
    super();
    this.id = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationModelSelection_ParameterValue().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationModelSelection_ParameterValue().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationModelSelection_ParameterValue().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationModelSelection_ParameterValue, a, b2);
  }
  static $() {
    return ["AutomationModelSelection.ParameterValue|1 id 9|2 value 9"];
  }
};
var GitConfig = class _GitConfig extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repo = "";
    this.branch = "";
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitConfig, a, b2);
  }
  static $() {
    return ["GitConfig|3 repo 9|4 branch 9|5 repos 9*"];
  }
};
var CronTrigger = class _CronTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.cron = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CronTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CronTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CronTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CronTrigger, a, b2);
  }
  static $() {
    return ["CronTrigger|1 cron 9"];
  }
};
var GitTrigger = class _GitTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    this.userAllowlist = [];
    this.prNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitTrigger, a, b2);
  }
  static $() {
    return ["GitTrigger|1 pull_request #0 event|2 push #1 event|4 ci_completed #2 event|5 issue_labeled #3 event|6 label #4 event|7 issue_comment #5 event|8 pull_request_review_comment #6 event|9 pull_request_review #7 event|10 review_thread #8 event|11 workflow_run #9 event|12 pull_request_review_requested #10 event|13 issue_assigned #11 event|3 user_allowlist 9*|14 pr_number 5", GitPullRequestEvent, GitPushEvent, GitCICompletedEvent, GitIssueLabeledEvent, GitLabelEvent, GitIssueCommentEvent, GitPullRequestReviewCommentEvent, GitPullRequestReviewEvent, GitReviewThreadEvent, GitWorkflowRunEvent, GitPullRequestReviewRequestedEvent, GitIssueAssignedEvent];
  }
};
var GitPullRequestEvent = class _GitPullRequestEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repo = "";
    this.repos = [];
    this.ignoreDraftPrs = false;
    this.onlyOnce = false;
    this.prAction = GitPullRequestAction.UNSPECIFIED;
    this.commenterAllowlist = [];
    this.commentContains = "";
    this.commentContainsIsRegex = false;
    this.labelName = "";
    this.orgs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPullRequestEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPullRequestEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPullRequestEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPullRequestEvent, a, b2);
  }
  static $() {
    return ["GitPullRequestEvent|1 repo 9|2 repos 9*|3 ignore_draft_prs 8|4 only_once 8|5 pr_action #0|6 commenter_allowlist 9*|7 comment_contains 9|10 comment_contains_is_regex 8|8 label_name 9|9 orgs 9*", GitPullRequestAction];
  }
};
var GitPullRequestReviewRequestedEvent = class _GitPullRequestReviewRequestedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPullRequestReviewRequestedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPullRequestReviewRequestedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPullRequestReviewRequestedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPullRequestReviewRequestedEvent, a, b2);
  }
  static $() {
    return ["GitPullRequestReviewRequestedEvent|1 repos 9*"];
  }
};
var GitIssueAssignedEvent = class _GitIssueAssignedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitIssueAssignedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitIssueAssignedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitIssueAssignedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitIssueAssignedEvent, a, b2);
  }
  static $() {
    return ["GitIssueAssignedEvent|1 repos 9*"];
  }
};
var GitPushEvent = class _GitPushEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repo = "";
    this.branch = "";
    this.repos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPushEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPushEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPushEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPushEvent, a, b2);
  }
  static $() {
    return ["GitPushEvent|1 repo 9|2 branch 9|3 repos 9*"];
  }
};
var GitCICompletedEvent = class _GitCICompletedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.condition = GitCICompletionCondition.GIT_CI_COMPLETION_CONDITION_UNSPECIFIED;
    this.ignoreBaseFailures = false;
    this.branch = "";
    this.prNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitCICompletedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitCICompletedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitCICompletedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitCICompletedEvent, a, b2);
  }
  static $() {
    return ["GitCICompletedEvent|1 repos 9*|2 condition #0|3 ignore_base_failures 8|4 branch 9|5 pr_number 5", GitCICompletionCondition];
  }
};
var GitIssueLabeledEvent = class _GitIssueLabeledEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.labelName = "";
    this.unlabeled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitIssueLabeledEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitIssueLabeledEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitIssueLabeledEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitIssueLabeledEvent, a, b2);
  }
  static $() {
    return ["GitIssueLabeledEvent|1 repos 9*|2 label_name 9|3 unlabeled 8"];
  }
};
var GitIssueCommentEvent = class _GitIssueCommentEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.commenterAllowlist = [];
    this.commentContains = "";
    this.commentContainsIsRegex = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitIssueCommentEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitIssueCommentEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitIssueCommentEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitIssueCommentEvent, a, b2);
  }
  static $() {
    return ["GitIssueCommentEvent|1 repos 9*|2 commenter_allowlist 9*|3 comment_contains 9|4 comment_contains_is_regex 8"];
  }
};
var GitPullRequestReviewCommentEvent = class _GitPullRequestReviewCommentEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.commenterAllowlist = [];
    this.commentContains = "";
    this.commentContainsIsRegex = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPullRequestReviewCommentEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPullRequestReviewCommentEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPullRequestReviewCommentEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPullRequestReviewCommentEvent, a, b2);
  }
  static $() {
    return ["GitPullRequestReviewCommentEvent|1 repos 9*|2 commenter_allowlist 9*|3 comment_contains 9|4 comment_contains_is_regex 8"];
  }
};
var GitPullRequestReviewEvent = class _GitPullRequestReviewEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.onApproved = false;
    this.onChangesRequested = false;
    this.onCommented = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPullRequestReviewEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPullRequestReviewEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPullRequestReviewEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPullRequestReviewEvent, a, b2);
  }
  static $() {
    return ["GitPullRequestReviewEvent|1 repos 9*|2 on_approved 8|3 on_changes_requested 8|4 on_commented 8"];
  }
};
var GitReviewThreadEvent = class _GitReviewThreadEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.onResolved = false;
    this.onUnresolved = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitReviewThreadEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitReviewThreadEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitReviewThreadEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitReviewThreadEvent, a, b2);
  }
  static $() {
    return ["GitReviewThreadEvent|1 repos 9*|2 on_resolved 8|3 on_unresolved 8"];
  }
};
var GitWorkflowRunEvent = class _GitWorkflowRunEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.workflowNames = [];
    this.branch = "";
    this.conclusion = GitWorkflowRunConclusion.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitWorkflowRunEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitWorkflowRunEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitWorkflowRunEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitWorkflowRunEvent, a, b2);
  }
  static $() {
    return ["GitWorkflowRunEvent|1 repos 9*|2 workflow_names 9*|3 branch 9|4 conclusion #0", GitWorkflowRunConclusion];
  }
};
var GitLabelEvent = class _GitLabelEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repos = [];
    this.labelName = "";
    this.onAdded = false;
    this.onRemoved = false;
    this.pullRequests = false;
    this.issues = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitLabelEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitLabelEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitLabelEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitLabelEvent, a, b2);
  }
  static $() {
    return ["GitLabelEvent|1 repos 9*|2 label_name 9|3 on_added 8|4 on_removed 8|5 pull_requests 8|6 issues 8"];
  }
};
var SlackTrigger = class _SlackTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channel = "";
    this.messageContains = "";
    this.messageContainsIsRegex = false;
    this.channels = [];
    this.blockUnauthenticatedSlackUsers = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackTrigger, a, b2);
  }
  static $() {
    return ["SlackTrigger|1 channel 9|3 message_contains 9|4 message_contains_is_regex 8|5 channels 9*|6 block_unauthenticated_slack_users 8|7 slack_completion_reaction_mode #0?|8 slack_completion_reaction_custom_emoji 9?|9 top_level_only 8?", SlackCompletionReactionMode];
  }
};
var SlackChannelCreatedTrigger = class _SlackChannelCreatedTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channelNameContains = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackChannelCreatedTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackChannelCreatedTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackChannelCreatedTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackChannelCreatedTrigger, a, b2);
  }
  static $() {
    return ["SlackChannelCreatedTrigger|1 channel_name_contains 9"];
  }
};
var SlackReactionAddedTrigger = class _SlackReactionAddedTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channel = "";
    this.emojiName = "";
    this.channels = [];
    this.blockUnauthenticatedSlackUsers = false;
    this.onlyOwnerReactions = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackReactionAddedTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackReactionAddedTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackReactionAddedTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackReactionAddedTrigger, a, b2);
  }
  static $() {
    return ["SlackReactionAddedTrigger|1 channel 9|3 emoji_name 9|5 channels 9*|6 block_unauthenticated_slack_users 8|9 only_owner_reactions 8"];
  }
};
var SlackMentionTrigger = class _SlackMentionTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channel = "";
    this.channels = [];
    this.blockUnauthenticatedSlackUsers = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackMentionTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackMentionTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackMentionTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackMentionTrigger, a, b2);
  }
  static $() {
    return ["SlackMentionTrigger|1 channel 9|2 channels 9*|3 block_unauthenticated_slack_users 8"];
  }
};
var SlackAnyReactionAddedTrigger = class _SlackAnyReactionAddedTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channel = "";
    this.channels = [];
    this.blockUnauthenticatedSlackUsers = false;
    this.onlyOwnerReactions = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackAnyReactionAddedTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackAnyReactionAddedTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackAnyReactionAddedTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackAnyReactionAddedTrigger, a, b2);
  }
  static $() {
    return ["SlackAnyReactionAddedTrigger|1 channel 9|2 channels 9*|3 block_unauthenticated_slack_users 8|4 only_owner_reactions 8"];
  }
};
var EmailReceivedTrigger = class _EmailReceivedTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.inboxEmail = "";
    this.fromAddresses = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EmailReceivedTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EmailReceivedTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EmailReceivedTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EmailReceivedTrigger, a, b2);
  }
  static $() {
    return ["EmailReceivedTrigger|1 inbox_email 9|2 from_addresses 9*|3 require_auth_pass 8?"];
  }
};
var LinearTrigger = class _LinearTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    this.projectIds = [];
    this.teamIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearTrigger, a, b2);
  }
  static $() {
    return ["LinearTrigger|1 issue_created #0 event|2 status_changed #1 event|3 end_of_cycle #2 event|4 project_ids 9*|6 team_ids 9*", LinearIssueCreatedEvent, LinearStatusChangedEvent, LinearEndOfCycleEvent];
  }
};
var LinearIssueCreatedEvent = class _LinearIssueCreatedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearIssueCreatedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearIssueCreatedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearIssueCreatedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearIssueCreatedEvent, a, b2);
  }
  static $() {
    return ["LinearIssueCreatedEvent"];
  }
};
var LinearStatusChangedEvent = class _LinearStatusChangedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.statusIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearStatusChangedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearStatusChangedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearStatusChangedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearStatusChangedEvent, a, b2);
  }
  static $() {
    return ["LinearStatusChangedEvent|1 status_ids 9*"];
  }
};
var LinearEndOfCycleEvent = class _LinearEndOfCycleEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    this.cycleIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearEndOfCycleEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearEndOfCycleEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearEndOfCycleEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearEndOfCycleEvent, a, b2);
  }
  static $() {
    return ["LinearEndOfCycleEvent|1 cycle_ids 9*"];
  }
};
var WebhookTrigger = class _WebhookTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebhookTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebhookTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebhookTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebhookTrigger, a, b2);
  }
  static $() {
    return ["WebhookTrigger"];
  }
};
var PagerDutyTrigger = class _PagerDutyTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    this.serviceIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyTrigger, a, b2);
  }
  static $() {
    return ["PagerDutyTrigger|1 incident_triggered #0 event|2 incident_acknowledged #1 event|3 incident_resolved #2 event|4 incident_escalated #3 event|5 incident_any #4 event|6 service_ids 9*", PagerDutyIncidentTriggeredEvent, PagerDutyIncidentAcknowledgedEvent, PagerDutyIncidentResolvedEvent, PagerDutyIncidentEscalatedEvent, PagerDutyIncidentAnyEvent];
  }
};
var PagerDutyIncidentTriggeredEvent = class _PagerDutyIncidentTriggeredEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyIncidentTriggeredEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyIncidentTriggeredEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyIncidentTriggeredEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyIncidentTriggeredEvent, a, b2);
  }
  static $() {
    return ["PagerDutyIncidentTriggeredEvent"];
  }
};
var PagerDutyIncidentAcknowledgedEvent = class _PagerDutyIncidentAcknowledgedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyIncidentAcknowledgedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyIncidentAcknowledgedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyIncidentAcknowledgedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyIncidentAcknowledgedEvent, a, b2);
  }
  static $() {
    return ["PagerDutyIncidentAcknowledgedEvent"];
  }
};
var PagerDutyIncidentResolvedEvent = class _PagerDutyIncidentResolvedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyIncidentResolvedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyIncidentResolvedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyIncidentResolvedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyIncidentResolvedEvent, a, b2);
  }
  static $() {
    return ["PagerDutyIncidentResolvedEvent"];
  }
};
var PagerDutyIncidentEscalatedEvent = class _PagerDutyIncidentEscalatedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyIncidentEscalatedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyIncidentEscalatedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyIncidentEscalatedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyIncidentEscalatedEvent, a, b2);
  }
  static $() {
    return ["PagerDutyIncidentEscalatedEvent"];
  }
};
var PagerDutyIncidentAnyEvent = class _PagerDutyIncidentAnyEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutyIncidentAnyEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutyIncidentAnyEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutyIncidentAnyEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutyIncidentAnyEvent, a, b2);
  }
  static $() {
    return ["PagerDutyIncidentAnyEvent"];
  }
};
var SentryTrigger = class _SentryTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    this.projectIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryTrigger, a, b2);
  }
  static $() {
    return ["SentryTrigger|1 issue_created #0 event|2 issue_resolved #1 event|3 issue_assigned #2 event|4 issue_archived #3 event|5 issue_unresolved #4 event|6 issue_any #5 event|7 project_ids 9*", SentryIssueCreatedEvent, SentryIssueResolvedEvent, SentryIssueAssignedEvent, SentryIssueArchivedEvent, SentryIssueUnresolvedEvent, SentryIssueAnyEvent];
  }
};
var SentryIssueCreatedEvent = class _SentryIssueCreatedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueCreatedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueCreatedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueCreatedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueCreatedEvent, a, b2);
  }
  static $() {
    return ["SentryIssueCreatedEvent"];
  }
};
var SentryIssueResolvedEvent = class _SentryIssueResolvedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueResolvedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueResolvedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueResolvedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueResolvedEvent, a, b2);
  }
  static $() {
    return ["SentryIssueResolvedEvent"];
  }
};
var SentryIssueAssignedEvent = class _SentryIssueAssignedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueAssignedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueAssignedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueAssignedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueAssignedEvent, a, b2);
  }
  static $() {
    return ["SentryIssueAssignedEvent"];
  }
};
var SentryIssueArchivedEvent = class _SentryIssueArchivedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueArchivedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueArchivedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueArchivedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueArchivedEvent, a, b2);
  }
  static $() {
    return ["SentryIssueArchivedEvent"];
  }
};
var SentryIssueUnresolvedEvent = class _SentryIssueUnresolvedEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueUnresolvedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueUnresolvedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueUnresolvedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueUnresolvedEvent, a, b2);
  }
  static $() {
    return ["SentryIssueUnresolvedEvent"];
  }
};
var SentryIssueAnyEvent = class _SentryIssueAnyEvent extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryIssueAnyEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryIssueAnyEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryIssueAnyEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryIssueAnyEvent, a, b2);
  }
  static $() {
    return ["SentryIssueAnyEvent"];
  }
};
var MicrosoftTeamsTrigger = class _MicrosoftTeamsTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.tenantId = "";
    this.teamId = "";
    this.teamIds = [];
    this.channelIds = [];
    this.messageContains = "";
    this.messageContainsIsRegex = false;
    this.blockUnauthenticatedTeamsUsers = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MicrosoftTeamsTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MicrosoftTeamsTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MicrosoftTeamsTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MicrosoftTeamsTrigger, a, b2);
  }
  static $() {
    return ["MicrosoftTeamsTrigger|1 tenant_id 9|2 team_id 9|3 team_ids 9*|4 channel_ids 9*|5 message_contains 9|6 message_contains_is_regex 8|7 block_unauthenticated_teams_users 8"];
  }
};
var MicrosoftTeamsChannelCreatedTrigger = class _MicrosoftTeamsChannelCreatedTrigger extends __protoMessage3146 {
  constructor(data) {
    super();
    this.tenantId = "";
    this.teamIds = [];
    this.channelNameContains = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MicrosoftTeamsChannelCreatedTrigger().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MicrosoftTeamsChannelCreatedTrigger().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MicrosoftTeamsChannelCreatedTrigger().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MicrosoftTeamsChannelCreatedTrigger, a, b2);
  }
  static $() {
    return ["MicrosoftTeamsChannelCreatedTrigger|1 tenant_id 9|2 team_ids 9*|3 channel_name_contains 9"];
  }
};
var GitPrAction = class _GitPrAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitPrAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitPrAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitPrAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitPrAction, a, b2);
  }
  static $() {
    return ["GitPrAction"];
  }
};
var PrCommentAction = class _PrCommentAction extends __protoMessage3146 {
  constructor(data) {
    super();
    this.minimizePreviousComments = false;
    this.allowInlineComments = false;
    this.resolveStaleThreads = false;
    this.allowApprove = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrCommentAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrCommentAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrCommentAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrCommentAction, a, b2);
  }
  static $() {
    return ["PrCommentAction|1 minimize_previous_comments 8|2 allow_inline_comments 8|3 resolve_stale_threads 8|4 allow_approve 8"];
  }
};
var ManageCheckRunAction = class _ManageCheckRunAction extends __protoMessage3146 {
  constructor(data) {
    super();
    this.deterministic = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ManageCheckRunAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ManageCheckRunAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ManageCheckRunAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ManageCheckRunAction, a, b2);
  }
  static $() {
    return ["ManageCheckRunAction|1 deterministic 8"];
  }
};
var RequestReviewersAction = class _RequestReviewersAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestReviewersAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestReviewersAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestReviewersAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestReviewersAction, a, b2);
  }
  static $() {
    return ["RequestReviewersAction"];
  }
};
var ApprovePrAction = class _ApprovePrAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApprovePrAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApprovePrAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApprovePrAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApprovePrAction, a, b2);
  }
  static $() {
    return ["ApprovePrAction"];
  }
};
var ReadSlackAction = class _ReadSlackAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadSlackAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadSlackAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadSlackAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadSlackAction, a, b2);
  }
  static $() {
    return ["ReadSlackAction"];
  }
};
var ResolveReviewThreadsAction = class _ResolveReviewThreadsAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveReviewThreadsAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveReviewThreadsAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveReviewThreadsAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveReviewThreadsAction, a, b2);
  }
  static $() {
    return ["ResolveReviewThreadsAction"];
  }
};
var SlackAction = class _SlackAction extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channel = "";
    this.generalized = false;
    this.respondInThread = false;
    this.postAsThread = false;
    this.channels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackAction, a, b2);
  }
  static $() {
    return ["SlackAction|1 channel 9|2 generalized 8|3 respond_in_thread 8|4 post_as_thread 8|5 channels 9*"];
  }
};
var MicrosoftTeamsAction = class _MicrosoftTeamsAction extends __protoMessage3146 {
  constructor(data) {
    super();
    this.tenantId = "";
    this.teamId = "";
    this.channelId = "";
    this.channelIds = [];
    this.generalized = false;
    this.respondInThread = false;
    this.postAsThread = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MicrosoftTeamsAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MicrosoftTeamsAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MicrosoftTeamsAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MicrosoftTeamsAction, a, b2);
  }
  static $() {
    return ["MicrosoftTeamsAction|1 tenant_id 9|2 team_id 9|3 channel_id 9|4 channel_ids 9*|5 generalized 8|6 respond_in_thread 8|7 post_as_thread 8"];
  }
};
var ReadMicrosoftTeamsAction = class _ReadMicrosoftTeamsAction extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMicrosoftTeamsAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMicrosoftTeamsAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMicrosoftTeamsAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMicrosoftTeamsAction, a, b2);
  }
  static $() {
    return ["ReadMicrosoftTeamsAction"];
  }
};
var PlatformActionEntry = class _PlatformActionEntry extends __protoMessage3146 {
  constructor(data) {
    super();
    this.scope = PlatformActionScope.UNSPECIFIED;
    this.actionIndex = 0;
    this.actionType = "";
    this.status = PlatformActionStatus.UNSPECIFIED;
    this.errorMessage = "";
    this.metadata = {};
    this.timestamp = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PlatformActionEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PlatformActionEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PlatformActionEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PlatformActionEntry, a, b2);
  }
  static $() {
    return ["PlatformActionEntry|1 scope #0|2 action_index 5|3 action_type 9|4 status #1|5 error_message 9|6 metadata 9,9|8 timestamp 3", PlatformActionScope, PlatformActionStatus];
  }
};
var PlatformActionsPayload = class _PlatformActionsPayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.actions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PlatformActionsPayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PlatformActionsPayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PlatformActionsPayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PlatformActionsPayload, a, b2);
  }
  static $() {
    return ["PlatformActionsPayload|1 actions #0*", PlatformActionEntry];
  }
};
var TriggerMetadataEntry = class _TriggerMetadataEntry extends __protoMessage3146 {
  constructor(data) {
    super();
    this.triggerType = PlatformTriggerType.UNSPECIFIED;
    this.metadata = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TriggerMetadataEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TriggerMetadataEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TriggerMetadataEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TriggerMetadataEntry, a, b2);
  }
  static $() {
    return ["TriggerMetadataEntry|1 trigger_type #0|2 metadata 9,9", PlatformTriggerType];
  }
};
var TriggerMetadataPayload = class _TriggerMetadataPayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TriggerMetadataPayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TriggerMetadataPayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TriggerMetadataPayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TriggerMetadataPayload, a, b2);
  }
  static $() {
    return ["TriggerMetadataPayload|1 entries #0*", TriggerMetadataEntry];
  }
};
var AutomationDeploySource = class _AutomationDeploySource extends __protoMessage3146 {
  constructor(data) {
    super();
    this.kind = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationDeploySource().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationDeploySource().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationDeploySource().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationDeploySource, a, b2);
  }
  static $() {
    return ["AutomationDeploySource|1 kind 9|2 repo_instance_key 9?|3 repo_node_id 9?|4 repo_name 9?|5 path 9?|6 ref 9?|7 commit_sha 9?|8 tool_version 9?"];
  }
};
var AutomationDeploySpec = class _AutomationDeploySpec extends __protoMessage3146 {
  constructor(data) {
    super();
    this.version = 0;
    this.key = "";
    this.name = "";
    this.enabled = false;
    this.scope = AutomationScope.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationDeploySpec().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationDeploySpec().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationDeploySpec().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationDeploySpec, a, b2);
  }
  static $() {
    return ["AutomationDeploySpec|1 version 5|2 source #0|3 key 9|4 name 9|5 description 9?|6 enabled 8|7 scope #1|8 workflow #2|9 managed_by #3?", AutomationDeploySource, AutomationScope, Workflow, AutomationManagedBy];
  }
};
var ValidateAutomationSpecRequest = class _ValidateAutomationSpecRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ValidateAutomationSpecRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ValidateAutomationSpecRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ValidateAutomationSpecRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ValidateAutomationSpecRequest, a, b2);
  }
  static $() {
    return ["ValidateAutomationSpecRequest|1 spec #0", AutomationDeploySpec];
  }
};
var ValidateAutomationSpecResponse = class _ValidateAutomationSpecResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.wouldCreate = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ValidateAutomationSpecResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ValidateAutomationSpecResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ValidateAutomationSpecResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ValidateAutomationSpecResponse, a, b2);
  }
  static $() {
    return ["ValidateAutomationSpecResponse|1 would_create 8|2 automation_id 9?"];
  }
};
var ApplyAutomationSpecRequest = class _ApplyAutomationSpecRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApplyAutomationSpecRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApplyAutomationSpecRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApplyAutomationSpecRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApplyAutomationSpecRequest, a, b2);
  }
  static $() {
    return ["ApplyAutomationSpecRequest|1 spec #0", AutomationDeploySpec];
  }
};
var ApplyAutomationSpecResponse = class _ApplyAutomationSpecResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.created = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApplyAutomationSpecResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApplyAutomationSpecResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApplyAutomationSpecResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApplyAutomationSpecResponse, a, b2);
  }
  static $() {
    return ["ApplyAutomationSpecResponse|1 workflow #0|2 created 8", AutomationWithOwner];
  }
};
var CreateAutomationRequest = class _CreateAutomationRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.name = "";
    this.creationSource = AutomationCreationSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAutomationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAutomationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAutomationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAutomationRequest, a, b2);
  }
  static $() {
    return ["CreateAutomationRequest|1 name 9|2 workflow #0|3 description 9?|4 scope #1?|5 template_id 9?|6 managed_type 9?|7 hidden 8?|8 team_id 5?|9 creation_source #2|10 enabled 8?|11 sand_agent_id 9?|12 sand_automation_id 9?", Workflow, AutomationScope, AutomationCreationSource];
  }
};
var CreateAutomationResponse = class _CreateAutomationResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAutomationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAutomationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAutomationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAutomationResponse, a, b2);
  }
  static $() {
    return ["CreateAutomationResponse|1 workflow #0", AutomationWithOwner];
  }
};
var ListSandAutomationsRequest = class _ListSandAutomationsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.sandAgentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListSandAutomationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListSandAutomationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListSandAutomationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListSandAutomationsRequest, a, b2);
  }
  static $() {
    return ["ListSandAutomationsRequest|1 sand_agent_id 9"];
  }
};
var ListAutomationsRequest = class _ListAutomationsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationsRequest, a, b2);
  }
  static $() {
    return ["ListAutomationsRequest|1 team_id 5?"];
  }
};
var ListAutomationsResponse = class _ListAutomationsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.workflows = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationsResponse, a, b2);
  }
  static $() {
    return ["ListAutomationsResponse|1 workflows #0*", AutomationWithOwner];
  }
};
var GetAutomationRequest = class _GetAutomationRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationRequest, a, b2);
  }
  static $() {
    return ["GetAutomationRequest|2 automation_id 9|3 team_id 5?"];
  }
};
var RestrictedAutomationSummary = class _RestrictedAutomationSummary extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.name = "";
    this.enabled = false;
    this.ownerName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RestrictedAutomationSummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RestrictedAutomationSummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RestrictedAutomationSummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RestrictedAutomationSummary, a, b2);
  }
  static $() {
    return ["RestrictedAutomationSummary|1 automation_id 9|2 name 9|3 enabled 8|4 owner_name 9"];
  }
};
var GetAutomationResponse = class _GetAutomationResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationResponse, a, b2);
  }
  static $() {
    return ["GetAutomationResponse|1 workflow #0 result|2 restricted_summary #1 result", AutomationWithOwner, RestrictedAutomationSummary];
  }
};
var UpdateAutomationRequest = class _UpdateAutomationRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationRequest, a, b2);
  }
  static $() {
    return ["UpdateAutomationRequest|2 name 9?|3 workflow #0?|4 enabled 8?|5 description 9?|6 automation_id 9|7 scope #1?|8 managed_type 9?|9 hidden 8?", Workflow, AutomationScope];
  }
};
var UpdateAutomationResponse = class _UpdateAutomationResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationResponse, a, b2);
  }
  static $() {
    return ["UpdateAutomationResponse|1 workflow #0", AutomationWithOwner];
  }
};
var ReassignAutomationOwnerRequest = class _ReassignAutomationOwnerRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.newOwnerUserId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReassignAutomationOwnerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReassignAutomationOwnerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReassignAutomationOwnerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReassignAutomationOwnerRequest, a, b2);
  }
  static $() {
    return ["ReassignAutomationOwnerRequest|1 automation_id 9|2 new_owner_user_id 5"];
  }
};
var ReassignAutomationOwnerResponse = class _ReassignAutomationOwnerResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReassignAutomationOwnerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReassignAutomationOwnerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReassignAutomationOwnerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReassignAutomationOwnerResponse, a, b2);
  }
  static $() {
    return ["ReassignAutomationOwnerResponse|1 workflow #0", AutomationWithOwner];
  }
};
var UpdateAutomationAuthoringModeRequest = class _UpdateAutomationAuthoringModeRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.managedBy = AutomationManagedBy.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationAuthoringModeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationAuthoringModeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationAuthoringModeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationAuthoringModeRequest, a, b2);
  }
  static $() {
    return ["UpdateAutomationAuthoringModeRequest|1 automation_id 9|2 managed_by #0|3 deploy_key 9?", AutomationManagedBy];
  }
};
var UpdateAutomationAuthoringModeResponse = class _UpdateAutomationAuthoringModeResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationAuthoringModeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationAuthoringModeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationAuthoringModeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationAuthoringModeResponse, a, b2);
  }
  static $() {
    return ["UpdateAutomationAuthoringModeResponse|1 workflow #0", AutomationWithOwner];
  }
};
var DeleteAutomationRequest = class _DeleteAutomationRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAutomationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAutomationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAutomationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAutomationRequest, a, b2);
  }
  static $() {
    return ["DeleteAutomationRequest|2 automation_id 9"];
  }
};
var DeleteAutomationResponse = class _DeleteAutomationResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAutomationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAutomationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAutomationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAutomationResponse, a, b2);
  }
  static $() {
    return ["DeleteAutomationResponse"];
  }
};
var TestAutomationRequest = class _TestAutomationRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.samplePayload = { case: void 0 };
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestAutomationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestAutomationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestAutomationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestAutomationRequest, a, b2);
  }
  static $() {
    return ["TestAutomationRequest|2 cron #0 sample_payload|3 pull_request #1 sample_payload|4 push #2 sample_payload|5 slack #3 sample_payload|6 linear #4 sample_payload|7 ci_completed #5 sample_payload|9 webhook #6 sample_payload|10 slack_channel_created #7 sample_payload|11 pagerduty #8 sample_payload|15 sentry #9 sample_payload|16 microsoft_teams #10 sample_payload|17 microsoft_teams_channel_created #11 sample_payload|18 slack_reaction_added #12 sample_payload|20 email_received #13 sample_payload|8 automation_id 9|12 trigger_index 5?|13 test_repo 9?|14 test_branch 9?|19 grok_bot_session_id 9?", CronSamplePayload, PullRequestSamplePayload, PushSamplePayload, SlackSamplePayload, LinearSamplePayload, CICompletedSamplePayload, WebhookSamplePayload, SlackChannelCreatedSamplePayload, PagerDutySamplePayload, SentrySamplePayload, MicrosoftTeamsSamplePayload, MicrosoftTeamsChannelCreatedSamplePayload, SlackReactionAddedSamplePayload, EmailReceivedSamplePayload];
  }
};
var CronSamplePayload = class _CronSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CronSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CronSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CronSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CronSamplePayload, a, b2);
  }
  static $() {
    return ["CronSamplePayload"];
  }
};
var PullRequestSamplePayload = class _PullRequestSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.headBranch = "";
    this.baseBranch = "";
    this.repo = "";
    this.prUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PullRequestSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PullRequestSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PullRequestSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PullRequestSamplePayload, a, b2);
  }
  static $() {
    return ["PullRequestSamplePayload|2 head_branch 9|3 base_branch 9|4 repo 9|5 pr_url 9"];
  }
};
var PushSamplePayload = class _PushSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.repo = "";
    this.ref = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PushSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PushSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PushSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PushSamplePayload, a, b2);
  }
  static $() {
    return ["PushSamplePayload|1 repo 9|2 ref 9"];
  }
};
var SlackSamplePayload = class _SlackSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.message = "";
    this.isThreadReply = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackSamplePayload, a, b2);
  }
  static $() {
    return ["SlackSamplePayload|1 message 9|2 is_thread_reply 8"];
  }
};
var LinearSamplePayload = class _LinearSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.issueId = "";
    this.issueIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LinearSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LinearSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LinearSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LinearSamplePayload, a, b2);
  }
  static $() {
    return ["LinearSamplePayload|1 issue_id 9|2 issue_identifier 9"];
  }
};
var CICompletedSamplePayload = class _CICompletedSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.prNumber = 0;
    this.repo = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CICompletedSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CICompletedSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CICompletedSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CICompletedSamplePayload, a, b2);
  }
  static $() {
    return ["CICompletedSamplePayload|1 pr_number 5|2 repo 9"];
  }
};
var SlackChannelCreatedSamplePayload = class _SlackChannelCreatedSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackChannelCreatedSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackChannelCreatedSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackChannelCreatedSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackChannelCreatedSamplePayload, a, b2);
  }
  static $() {
    return ["SlackChannelCreatedSamplePayload|1 channel_name 9"];
  }
};
var SlackReactionAddedSamplePayload = class _SlackReactionAddedSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.emojiName = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlackReactionAddedSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlackReactionAddedSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlackReactionAddedSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlackReactionAddedSamplePayload, a, b2);
  }
  static $() {
    return ["SlackReactionAddedSamplePayload|1 emoji_name 9|2 message 9"];
  }
};
var EmailReceivedSamplePayload = class _EmailReceivedSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.fromAddress = "";
    this.subject = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EmailReceivedSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EmailReceivedSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EmailReceivedSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EmailReceivedSamplePayload, a, b2);
  }
  static $() {
    return ["EmailReceivedSamplePayload|1 from_address 9|2 subject 9"];
  }
};
var WebhookSamplePayload = class _WebhookSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.context = "";
    this.webhookPayloadJson = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebhookSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebhookSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebhookSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebhookSamplePayload, a, b2);
  }
  static $() {
    return ["WebhookSamplePayload|1 context 9|2 webhook_payload_json 9"];
  }
};
var SentrySamplePayload = class _SentrySamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.issueId = "";
    this.action = "";
    this.projectId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentrySamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentrySamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentrySamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentrySamplePayload, a, b2);
  }
  static $() {
    return ["SentrySamplePayload|1 issue_id 9|2 action 9|3 project_id 9"];
  }
};
var PagerDutySamplePayload = class _PagerDutySamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.incidentId = "";
    this.eventType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PagerDutySamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PagerDutySamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PagerDutySamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PagerDutySamplePayload, a, b2);
  }
  static $() {
    return ["PagerDutySamplePayload|1 incident_id 9|2 event_type 9"];
  }
};
var MicrosoftTeamsSamplePayload = class _MicrosoftTeamsSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MicrosoftTeamsSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MicrosoftTeamsSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MicrosoftTeamsSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MicrosoftTeamsSamplePayload, a, b2);
  }
  static $() {
    return ["MicrosoftTeamsSamplePayload|1 message 9"];
  }
};
var MicrosoftTeamsChannelCreatedSamplePayload = class _MicrosoftTeamsChannelCreatedSamplePayload extends __protoMessage3146 {
  constructor(data) {
    super();
    this.channelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MicrosoftTeamsChannelCreatedSamplePayload().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MicrosoftTeamsChannelCreatedSamplePayload().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MicrosoftTeamsChannelCreatedSamplePayload().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MicrosoftTeamsChannelCreatedSamplePayload, a, b2);
  }
  static $() {
    return ["MicrosoftTeamsChannelCreatedSamplePayload|1 channel_name 9"];
  }
};
var TestAutomationResponse = class _TestAutomationResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestAutomationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestAutomationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestAutomationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestAutomationResponse, a, b2);
  }
  static $() {
    return ["TestAutomationResponse|1 message 9|2 background_composer_id 9?|3 run_uuid 9?"];
  }
};
var Automation = class _Automation extends __protoMessage3146 {
  constructor(data) {
    super();
    this.name = "";
    this.enabled = false;
    this.createdAt = protoInt64.zero;
    this.updatedAt = protoInt64.zero;
    this.automationId = "";
    this.scope = AutomationScope.UNSPECIFIED;
    this.managedBy = AutomationManagedBy.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Automation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Automation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Automation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Automation, a, b2);
  }
  static $() {
    return ["Automation|2 name 9|3 enabled 8|4 workflow #0|5 created_at 3|6 updated_at 3|7 description 9?|8 automation_id 9|9 scope #1|10 service_account_id 9?|11 managed_by #2|12 deploy_key 9?|13 deploy_last_applied_at 3?|14 deploy_last_apply_error 9?|15 managed_type 9?|16 hidden 8?|17 template_id 9?|18 sand_last_run_at_ms 3?", Workflow, AutomationScope, AutomationManagedBy];
  }
};
var AutomationMcpAuthState = class _AutomationMcpAuthState extends __protoMessage3146 {
  constructor(data) {
    super();
    this.serverName = "";
    this.authState = McpAuthState.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationMcpAuthState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationMcpAuthState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationMcpAuthState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationMcpAuthState, a, b2);
  }
  static $() {
    return ["AutomationMcpAuthState|1 server_id 3?|2 server_name 9|3 auth_state #0", McpAuthState];
  }
};
var AutomationWithOwner = class _AutomationWithOwner extends __protoMessage3146 {
  constructor(data) {
    super();
    this.userId = 0;
    this.ownerName = "";
    this.mcpAuthStates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationWithOwner().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationWithOwner().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationWithOwner().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationWithOwner, a, b2);
  }
  static $() {
    return ["AutomationWithOwner|1 workflow #0|2 user_id 5|3 owner_name 9|4 mcp_auth_states #1*|5 team_id 5?", Automation, AutomationMcpAuthState];
  }
};
var ListAutomationRunsRequest = class _ListAutomationRunsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.runKind = AutomationRunListKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationRunsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationRunsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationRunsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationRunsRequest, a, b2);
  }
  static $() {
    return ["ListAutomationRunsRequest|2 limit 5?|3 automation_id 9|4 cursor 9?|5 run_kind #0", AutomationRunListKind];
  }
};
var ListAutomationRunsResponse = class _ListAutomationRunsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.runs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationRunsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationRunsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationRunsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationRunsResponse, a, b2);
  }
  static $() {
    return ["ListAutomationRunsResponse|1 runs #0*|2 next_cursor 9?", AutomationRun];
  }
};
var GetAutomationRunRequest = class _GetAutomationRunRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.backgroundComposerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationRunRequest, a, b2);
  }
  static $() {
    return ["GetAutomationRunRequest|1 background_composer_id 9"];
  }
};
var GetAutomationRunResponse = class _GetAutomationRunResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationRunResponse, a, b2);
  }
  static $() {
    return ["GetAutomationRunResponse|1 run #0?", AutomationRun];
  }
};
var ListAllRunsRequest = class _ListAllRunsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.runKind = AutomationRunListKind.UNSPECIFIED;
    this.ownerOnly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAllRunsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAllRunsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAllRunsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAllRunsRequest, a, b2);
  }
  static $() {
    return ["ListAllRunsRequest|1 automation_id 9?|2 limit 5?|3 cursor 9?|4 run_kind #0|5 team_id 5?|6 owner_only 8", AutomationRunListKind];
  }
};
var ListAllRunsResponse = class _ListAllRunsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.runs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAllRunsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAllRunsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAllRunsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAllRunsResponse, a, b2);
  }
  static $() {
    return ["ListAllRunsResponse|1 runs #0*|2 next_cursor 9?", AutomationRun];
  }
};
var AgentSdkAutomationRun = class _AgentSdkAutomationRun extends __protoMessage3146 {
  constructor(data) {
    super();
    this.uuid = "";
    this.automationId = "";
    this.sessionId = "";
    this.status = AutomationRunStatus.UNSPECIFIED;
    this.triggerMetadata = {};
    this.createdAt = protoInt64.zero;
    this.updatedAt = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentSdkAutomationRun().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentSdkAutomationRun().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentSdkAutomationRun().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentSdkAutomationRun, a, b2);
  }
  static $() {
    return ["AgentSdkAutomationRun|1 uuid 9|2 automation_id 9|3 session_id 9|4 deployment_slug 9?|5 temporal_workflow_id 9?|6 status #0|7 skip_reason 9?|8 trigger_metadata 9,9|9 workflow #1|10 created_at 3|11 updated_at 3|12 completed_at 3?", AutomationRunStatus, Workflow];
  }
};
var ListAgentSdkAutomationRunsRequest = class _ListAgentSdkAutomationRunsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAgentSdkAutomationRunsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAgentSdkAutomationRunsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAgentSdkAutomationRunsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAgentSdkAutomationRunsRequest, a, b2);
  }
  static $() {
    return ["ListAgentSdkAutomationRunsRequest|1 automation_id 9|2 limit 5?|3 cursor 9?"];
  }
};
var ListAgentSdkAutomationRunsResponse = class _ListAgentSdkAutomationRunsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.runs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAgentSdkAutomationRunsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAgentSdkAutomationRunsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAgentSdkAutomationRunsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAgentSdkAutomationRunsResponse, a, b2);
  }
  static $() {
    return ["ListAgentSdkAutomationRunsResponse|1 runs #0*|2 next_cursor 9?", AgentSdkAutomationRun];
  }
};
var TestAutomationFilterRequest = class _TestAutomationFilterRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.samplePayload = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestAutomationFilterRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestAutomationFilterRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestAutomationFilterRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestAutomationFilterRequest, a, b2);
  }
  static $() {
    return ["TestAutomationFilterRequest|1 automation_id 9|2 cron #0 sample_payload|3 pull_request #1 sample_payload|4 push #2 sample_payload|5 slack #3 sample_payload|6 linear #4 sample_payload|7 ci_completed #5 sample_payload|8 webhook #6 sample_payload|9 slack_channel_created #7 sample_payload|10 pagerduty #8 sample_payload|15 sentry #9 sample_payload|16 microsoft_teams #10 sample_payload|17 microsoft_teams_channel_created #11 sample_payload|18 slack_reaction_added #12 sample_payload|20 email_received #13 sample_payload|11 trigger_index 5?|12 test_repo 9?|13 test_branch 9?", CronSamplePayload, PullRequestSamplePayload, PushSamplePayload, SlackSamplePayload, LinearSamplePayload, CICompletedSamplePayload, WebhookSamplePayload, SlackChannelCreatedSamplePayload, PagerDutySamplePayload, SentrySamplePayload, MicrosoftTeamsSamplePayload, MicrosoftTeamsChannelCreatedSamplePayload, SlackReactionAddedSamplePayload, EmailReceivedSamplePayload];
  }
};
var TestAutomationFilterResponse = class _TestAutomationFilterResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.decision = AutomationFilterDecision.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestAutomationFilterResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestAutomationFilterResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestAutomationFilterResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestAutomationFilterResponse, a, b2);
  }
  static $() {
    return ["TestAutomationFilterResponse|1 decision #0|2 rationale 9?|3 error_message 9?", AutomationFilterDecision];
  }
};
var ListAutomationMemoriesRequest = class _ListAutomationMemoriesRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationMemoriesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationMemoriesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationMemoriesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationMemoriesRequest, a, b2);
  }
  static $() {
    return ["ListAutomationMemoriesRequest|1 automation_id 9"];
  }
};
var ListAutomationMemoriesResponse = class _ListAutomationMemoriesResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAutomationMemoriesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAutomationMemoriesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAutomationMemoriesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAutomationMemoriesResponse, a, b2);
  }
  static $() {
    return ["ListAutomationMemoriesResponse|1 files 9*"];
  }
};
var GetAutomationMemoryRequest = class _GetAutomationMemoryRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.file = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationMemoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationMemoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationMemoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationMemoryRequest, a, b2);
  }
  static $() {
    return ["GetAutomationMemoryRequest|1 automation_id 9|2 file 9"];
  }
};
var GetAutomationMemoryResponse = class _GetAutomationMemoryResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.file = "";
    this.content = "";
    this.exists = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAutomationMemoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAutomationMemoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAutomationMemoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAutomationMemoryResponse, a, b2);
  }
  static $() {
    return ["GetAutomationMemoryResponse|1 file 9|2 content 9|3 exists 8|4 version 9?"];
  }
};
var UpdateAutomationMemoryRequest = class _UpdateAutomationMemoryRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.file = "";
    this.content = "";
    this.expected = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationMemoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationMemoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationMemoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationMemoryRequest, a, b2);
  }
  static $() {
    return ["UpdateAutomationMemoryRequest|1 automation_id 9|2 file 9|3 content 9|4 expected_version 9 expected|5 expect_missing 8 expected"];
  }
};
var UpdateAutomationMemoryResponse = class _UpdateAutomationMemoryResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.file = "";
    this.content = "";
    this.conflict = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAutomationMemoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAutomationMemoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAutomationMemoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAutomationMemoryResponse, a, b2);
  }
  static $() {
    return ["UpdateAutomationMemoryResponse|1 file 9|2 content 9|3 version 9?|4 conflict 8"];
  }
};
var DeleteAutomationMemoryRequest = class _DeleteAutomationMemoryRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    this.file = "";
    this.expected = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAutomationMemoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAutomationMemoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAutomationMemoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAutomationMemoryRequest, a, b2);
  }
  static $() {
    return ["DeleteAutomationMemoryRequest|1 automation_id 9|2 file 9|3 expected_version 9 expected|4 expect_missing 8 expected"];
  }
};
var DeleteAutomationMemoryResponse = class _DeleteAutomationMemoryResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.file = "";
    this.conflict = false;
    this.content = "";
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAutomationMemoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAutomationMemoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAutomationMemoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAutomationMemoryResponse, a, b2);
  }
  static $() {
    return ["DeleteAutomationMemoryResponse|1 file 9|2 conflict 8|3 content 9|4 version 9?|5 files 9*"];
  }
};
var AutomationRunFailureDetails = class _AutomationRunFailureDetails extends __protoMessage3146 {
  constructor(data) {
    super();
    this.code = AutomationRunFailureCode.UNSPECIFIED;
    this.title = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationRunFailureDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationRunFailureDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationRunFailureDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationRunFailureDetails, a, b2);
  }
  static $() {
    return ["AutomationRunFailureDetails|1 code #0|2 title 9|3 message 9|4 cta_label 9?|5 cta_path 9?", AutomationRunFailureCode];
  }
};
var AutomationRun = class _AutomationRun extends __protoMessage3146 {
  constructor(data) {
    super();
    this.backgroundComposerId = "";
    this.namespacedWorkflowId = "";
    this.createdAt = protoInt64.zero;
    this.updatedAt = protoInt64.zero;
    this.uuid = "";
    this.automationId = "";
    this.status = AutomationRunStatus.UNSPECIFIED;
    this.errorMessage = "";
    this.canRetry = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutomationRun().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutomationRun().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutomationRun().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutomationRun, a, b2);
  }
  static $() {
    return ["AutomationRun|3 background_composer_id 9|4 namespaced_workflow_id 9|5 workflow #0|6 created_at 3|7 updated_at 3|8 platform_actions #1?|9 trigger_metadata #2?|10 uuid 9|11 automation_id 9|12 status #3|13 error_message 9|14 failure_details #4?|15 completed_at 3?|16 filter_decision #5?|17 filter_rationale 9?|18 filter_error_message 9?|19 can_retry 8|20 retry_ineligible_reason 9?|21 retry_ineligible_reason_code #6?|22 skip_reason 9?", Workflow, PlatformActionsPayload, TriggerMetadataPayload, AutomationRunStatus, AutomationRunFailureDetails, AutomationFilterDecision, AutomationRunRetryIneligibleReason];
  }
};
var GetRunSummaryRequest = class _GetRunSummaryRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.ownerOnly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRunSummaryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRunSummaryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRunSummaryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRunSummaryRequest, a, b2);
  }
  static $() {
    return ["GetRunSummaryRequest|1 automation_id 9?|2 team_id 5?|3 owner_only 8"];
  }
};
var GetRunSummaryResponse = class _GetRunSummaryResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.windows = [];
    this.histogram = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRunSummaryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRunSummaryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRunSummaryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRunSummaryResponse, a, b2);
  }
  static $() {
    return ["GetRunSummaryResponse|1 windows #0*|2 histogram #1*", RunSummaryWindow, HistogramBucket];
  }
};
var RunSummaryWindow = class _RunSummaryWindow extends __protoMessage3146 {
  constructor(data) {
    super();
    this.key = "";
    this.succeeded = 0;
    this.failed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunSummaryWindow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunSummaryWindow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunSummaryWindow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunSummaryWindow, a, b2);
  }
  static $() {
    return ["RunSummaryWindow|1 key 9|2 succeeded 5|3 failed 5"];
  }
};
var HistogramBucket = class _HistogramBucket extends __protoMessage3146 {
  constructor(data) {
    super();
    this.startTime = protoInt64.zero;
    this.count = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HistogramBucket().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HistogramBucket().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HistogramBucket().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HistogramBucket, a, b2);
  }
  static $() {
    return ["HistogramBucket|1 start_time 3|2 count 5"];
  }
};
var GetSecuritybotResolutionStatsRequest = class _GetSecuritybotResolutionStatsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSecuritybotResolutionStatsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSecuritybotResolutionStatsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSecuritybotResolutionStatsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSecuritybotResolutionStatsRequest, a, b2);
  }
  static $() {
    return ["GetSecuritybotResolutionStatsRequest|1 automation_id 9?|2 team_id 5?"];
  }
};
var GetSecuritybotResolutionStatsResponse = class _GetSecuritybotResolutionStatsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.vulnerabilitiesCount = 0;
    this.fixedCount = 0;
    this.automationCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSecuritybotResolutionStatsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSecuritybotResolutionStatsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSecuritybotResolutionStatsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSecuritybotResolutionStatsResponse, a, b2);
  }
  static $() {
    return ["GetSecuritybotResolutionStatsResponse|1 vulnerabilities_count 13|2 fixed_count 13|3 automation_count 13"];
  }
};
var GetApprovalAgentAnalyticsRequest = class _GetApprovalAgentAnalyticsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetApprovalAgentAnalyticsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetApprovalAgentAnalyticsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetApprovalAgentAnalyticsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetApprovalAgentAnalyticsRequest, a, b2);
  }
  static $() {
    return ["GetApprovalAgentAnalyticsRequest|1 automation_id 9?|2 team_id 5?"];
  }
};
var GetApprovalAgentAnalyticsResponse = class _GetApprovalAgentAnalyticsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.approvedPrCount = 0;
    this.reviewedPrCount = 0;
    this.automationCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetApprovalAgentAnalyticsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetApprovalAgentAnalyticsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetApprovalAgentAnalyticsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetApprovalAgentAnalyticsResponse, a, b2);
  }
  static $() {
    return ["GetApprovalAgentAnalyticsResponse|1 approved_pr_count 13|2 reviewed_pr_count 13|3 automation_count 13"];
  }
};
var ManagedAutomationTeamSettings = class _ManagedAutomationTeamSettings extends __protoMessage3146 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.securityAgentDisabled = false;
    this.approvalAgentDisabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ManagedAutomationTeamSettings().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ManagedAutomationTeamSettings().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ManagedAutomationTeamSettings().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ManagedAutomationTeamSettings, a, b2);
  }
  static $() {
    return ["ManagedAutomationTeamSettings|1 team_id 5|2 security_agent_disabled 8|3 approval_agent_disabled 8"];
  }
};
var GetManagedAutomationTeamSettingsRequest = class _GetManagedAutomationTeamSettingsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.teamId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetManagedAutomationTeamSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetManagedAutomationTeamSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetManagedAutomationTeamSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetManagedAutomationTeamSettingsRequest, a, b2);
  }
  static $() {
    return ["GetManagedAutomationTeamSettingsRequest|1 team_id 5"];
  }
};
var GetManagedAutomationTeamSettingsResponse = class _GetManagedAutomationTeamSettingsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetManagedAutomationTeamSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetManagedAutomationTeamSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetManagedAutomationTeamSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetManagedAutomationTeamSettingsResponse, a, b2);
  }
  static $() {
    return ["GetManagedAutomationTeamSettingsResponse|1 settings #0", ManagedAutomationTeamSettings];
  }
};
var UpdateManagedAutomationTeamSettingsRequest = class _UpdateManagedAutomationTeamSettingsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.securityAgentDisabled = false;
    this.approvalAgentDisabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateManagedAutomationTeamSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateManagedAutomationTeamSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateManagedAutomationTeamSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateManagedAutomationTeamSettingsRequest, a, b2);
  }
  static $() {
    return ["UpdateManagedAutomationTeamSettingsRequest|1 team_id 5|2 security_agent_disabled 8|3 approval_agent_disabled 8|4 security_agent_disabled_patch 8?|5 approval_agent_disabled_patch 8?"];
  }
};
var UpdateManagedAutomationTeamSettingsResponse = class _UpdateManagedAutomationTeamSettingsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateManagedAutomationTeamSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateManagedAutomationTeamSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateManagedAutomationTeamSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateManagedAutomationTeamSettingsResponse, a, b2);
  }
  static $() {
    return ["UpdateManagedAutomationTeamSettingsResponse|1 settings #0", ManagedAutomationTeamSettings];
  }
};
var GetChangeMonitorTeamSettingsRequest = class _GetChangeMonitorTeamSettingsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.teamId = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeMonitorTeamSettingsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeMonitorTeamSettingsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeMonitorTeamSettingsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeMonitorTeamSettingsRequest, a, b2);
  }
  static $() {
    return ["GetChangeMonitorTeamSettingsRequest|1 team_id 5"];
  }
};
var GetChangeMonitorTeamSettingsResponse = class _GetChangeMonitorTeamSettingsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChangeMonitorTeamSettingsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChangeMonitorTeamSettingsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChangeMonitorTeamSettingsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChangeMonitorTeamSettingsResponse, a, b2);
  }
  static $() {
    return ["GetChangeMonitorTeamSettingsResponse|1 enabled 8"];
  }
};
var CancelAutomationRunRequest = class _CancelAutomationRunRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.backgroundComposerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelAutomationRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelAutomationRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelAutomationRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelAutomationRunRequest, a, b2);
  }
  static $() {
    return ["CancelAutomationRunRequest|1 background_composer_id 9"];
  }
};
var CancelAutomationRunResponse = class _CancelAutomationRunResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.success = false;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelAutomationRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelAutomationRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelAutomationRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelAutomationRunResponse, a, b2);
  }
  static $() {
    return ["CancelAutomationRunResponse|1 success 8|2 message 9"];
  }
};
var CancelAllAutomationRunsRequest = class _CancelAllAutomationRunsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelAllAutomationRunsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelAllAutomationRunsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelAllAutomationRunsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelAllAutomationRunsRequest, a, b2);
  }
  static $() {
    return ["CancelAllAutomationRunsRequest|1 automation_id 9"];
  }
};
var CancelAllAutomationRunsResponse = class _CancelAllAutomationRunsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.cancelledCount = 0;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelAllAutomationRunsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelAllAutomationRunsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelAllAutomationRunsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelAllAutomationRunsResponse, a, b2);
  }
  static $() {
    return ["CancelAllAutomationRunsResponse|1 cancelled_count 5|2 message 9"];
  }
};
var RetryAutomationRunRequest = class _RetryAutomationRunRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.runUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RetryAutomationRunRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RetryAutomationRunRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RetryAutomationRunRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RetryAutomationRunRequest, a, b2);
  }
  static $() {
    return ["RetryAutomationRunRequest|1 run_uuid 9"];
  }
};
var RetryAutomationRunResponse = class _RetryAutomationRunResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.backgroundComposerId = "";
    this.runUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RetryAutomationRunResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RetryAutomationRunResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RetryAutomationRunResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RetryAutomationRunResponse, a, b2);
  }
  static $() {
    return ["RetryAutomationRunResponse|1 background_composer_id 9|2 run_uuid 9"];
  }
};
var WorkflowTemplate = class _WorkflowTemplate extends __protoMessage3146 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.description = "";
    this.category = "";
    this.icon = "";
    this.mcpHints = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorkflowTemplate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorkflowTemplate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorkflowTemplate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorkflowTemplate, a, b2);
  }
  static $() {
    return ["WorkflowTemplate|1 id 9|2 name 9|3 description 9|4 category 9|5 workflow #0|6 input_schema #1|7 icon 9|8 featured_index 5?|9 mcp_hints #2*", Workflow, InputSchema, McpTemplateHint];
  }
};
var McpTemplateHint = class _McpTemplateHint extends __protoMessage3146 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpTemplateHint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpTemplateHint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpTemplateHint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpTemplateHint, a, b2);
  }
  static $() {
    return ["McpTemplateHint|1 name 9|2 url 9?"];
  }
};
var InputSchema = class _InputSchema extends __protoMessage3146 {
  constructor(data) {
    super();
    this.fields = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InputSchema().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InputSchema().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InputSchema().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InputSchema, a, b2);
  }
  static $() {
    return ["InputSchema|1 fields #0*", InputField];
  }
};
var InputField = class _InputField extends __protoMessage3146 {
  constructor(data) {
    super();
    this.key = "";
    this.displayName = "";
    this.description = "";
    this.type = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InputField().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InputField().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InputField().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InputField, a, b2);
  }
  static $() {
    return ["InputField|1 key 9|2 display_name 9|3 description 9|4 string_value 9 type|5 string_list_value #0 type|6 bool_value 8 type", StringList];
  }
};
var StringList = class _StringList extends __protoMessage3146 {
  constructor(data) {
    super();
    this.values = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StringList().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StringList().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StringList().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StringList, a, b2);
  }
  static $() {
    return ["StringList|1 values 9*"];
  }
};
var InputValues = class _InputValues extends __protoMessage3146 {
  constructor(data) {
    super();
    this.values = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InputValues().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InputValues().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InputValues().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InputValues, a, b2);
  }
  static $() {
    return ["InputValues|1 values #0*", InputValue];
  }
};
var InputValue = class _InputValue extends __protoMessage3146 {
  constructor(data) {
    super();
    this.key = "";
    this.value = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InputValue().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InputValue().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InputValue().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InputValue, a, b2);
  }
  static $() {
    return ["InputValue|1 key 9|2 string_value 9 value|3 string_list_value #0 value|4 bool_value 8 value", StringList];
  }
};
var ListWorkflowTemplatesRequest = class _ListWorkflowTemplatesRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkflowTemplatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkflowTemplatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkflowTemplatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkflowTemplatesRequest, a, b2);
  }
  static $() {
    return ["ListWorkflowTemplatesRequest|1 category 9?"];
  }
};
var ListWorkflowTemplatesResponse = class _ListWorkflowTemplatesResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.templates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListWorkflowTemplatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListWorkflowTemplatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListWorkflowTemplatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListWorkflowTemplatesResponse, a, b2);
  }
  static $() {
    return ["ListWorkflowTemplatesResponse|1 templates #0*", WorkflowTemplate];
  }
};
var GetWorkflowTemplateRequest = class _GetWorkflowTemplateRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.templateId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetWorkflowTemplateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetWorkflowTemplateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetWorkflowTemplateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetWorkflowTemplateRequest, a, b2);
  }
  static $() {
    return ["GetWorkflowTemplateRequest|1 template_id 9"];
  }
};
var GetWorkflowTemplateResponse = class _GetWorkflowTemplateResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetWorkflowTemplateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetWorkflowTemplateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetWorkflowTemplateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetWorkflowTemplateResponse, a, b2);
  }
  static $() {
    return ["GetWorkflowTemplateResponse|1 template #0", WorkflowTemplate];
  }
};
var CreateWorkflowFromTemplateRequest = class _CreateWorkflowFromTemplateRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.templateId = "";
    this.name = "";
    this.creationSource = AutomationCreationSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateWorkflowFromTemplateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateWorkflowFromTemplateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateWorkflowFromTemplateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateWorkflowFromTemplateRequest, a, b2);
  }
  static $() {
    return ["CreateWorkflowFromTemplateRequest|1 template_id 9|2 name 9|3 input_values #0|4 description 9?|5 creation_source #1", InputValues, AutomationCreationSource];
  }
};
var CreateWorkflowFromTemplateResponse = class _CreateWorkflowFromTemplateResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateWorkflowFromTemplateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateWorkflowFromTemplateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateWorkflowFromTemplateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateWorkflowFromTemplateResponse, a, b2);
  }
  static $() {
    return ["CreateWorkflowFromTemplateResponse|1 workflow #0", Automation];
  }
};
var ValidateAutomationToolsRequest = class _ValidateAutomationToolsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.prompt = "";
    this.triggerTypes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ValidateAutomationToolsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ValidateAutomationToolsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ValidateAutomationToolsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ValidateAutomationToolsRequest, a, b2);
  }
  static $() {
    return ["ValidateAutomationToolsRequest|1 prompt 9|2 trigger_types 9*"];
  }
};
var ValidateAutomationToolsResponse = class _ValidateAutomationToolsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.suggestions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ValidateAutomationToolsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ValidateAutomationToolsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ValidateAutomationToolsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ValidateAutomationToolsResponse, a, b2);
  }
  static $() {
    return ["ValidateAutomationToolsResponse|1 suggestions #0*", ToolSuggestion];
  }
};
var ToolSuggestion = class _ToolSuggestion extends __protoMessage3146 {
  constructor(data) {
    super();
    this.slug = "";
    this.label = "";
    this.evidence = [];
    this.configNote = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ToolSuggestion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ToolSuggestion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ToolSuggestion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ToolSuggestion, a, b2);
  }
  static $() {
    return ["ToolSuggestion|1 slug 9|2 label 9|3 evidence 9*|4 config_note 9"];
  }
};
var BuilderCompletionMessage = class _BuilderCompletionMessage extends __protoMessage3146 {
  constructor(data) {
    super();
    this.role = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BuilderCompletionMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BuilderCompletionMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BuilderCompletionMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BuilderCompletionMessage, a, b2);
  }
  static $() {
    return ["BuilderCompletionMessage|1 role 9|2 content 9"];
  }
};
var BuilderCompletionContext = class _BuilderCompletionContext extends __protoMessage3146 {
  constructor(data) {
    super();
    this.stage = "";
    this.currentConfigJson = "";
    this.githubConnected = false;
    this.slackConnected = false;
    this.linearConnected = false;
    this.pagerdutyConnected = false;
    this.microsoftTeamsConnected = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BuilderCompletionContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BuilderCompletionContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BuilderCompletionContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BuilderCompletionContext, a, b2);
  }
  static $() {
    return ["BuilderCompletionContext|1 stage 9|2 current_config_json 9|3 github_connected 8|4 slack_connected 8|5 linear_connected 8|6 pagerduty_connected 8|7 microsoft_teams_connected 8"];
  }
};
var BuilderCompletionRequest = class _BuilderCompletionRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.messages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BuilderCompletionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BuilderCompletionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BuilderCompletionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BuilderCompletionRequest, a, b2);
  }
  static $() {
    return ["BuilderCompletionRequest|1 messages #0*|2 context #1", BuilderCompletionMessage, BuilderCompletionContext];
  }
};
var BuilderCompletionResponse = class _BuilderCompletionResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BuilderCompletionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BuilderCompletionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BuilderCompletionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BuilderCompletionResponse, a, b2);
  }
  static $() {
    return ["BuilderCompletionResponse|1 content 9"];
  }
};
var DisableAutomationForTeamShutdownRequest = class _DisableAutomationForTeamShutdownRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.automationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableAutomationForTeamShutdownRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableAutomationForTeamShutdownRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableAutomationForTeamShutdownRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableAutomationForTeamShutdownRequest, a, b2);
  }
  static $() {
    return ["DisableAutomationForTeamShutdownRequest|1 team_id 5|2 automation_id 9"];
  }
};
var DisableAutomationForTeamShutdownResponse = class _DisableAutomationForTeamShutdownResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableAutomationForTeamShutdownResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableAutomationForTeamShutdownResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableAutomationForTeamShutdownResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableAutomationForTeamShutdownResponse, a, b2);
  }
  static $() {
    return ["DisableAutomationForTeamShutdownResponse"];
  }
};
var GetSentryAuthUrlRequest = class _GetSentryAuthUrlRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryAuthUrlRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryAuthUrlRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryAuthUrlRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryAuthUrlRequest, a, b2);
  }
  static $() {
    return ["GetSentryAuthUrlRequest"];
  }
};
var GetSentryAuthUrlResponse = class _GetSentryAuthUrlResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.installUrl = "";
    this.csrfToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryAuthUrlResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryAuthUrlResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryAuthUrlResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryAuthUrlResponse, a, b2);
  }
  static $() {
    return ["GetSentryAuthUrlResponse|1 install_url 9|2 csrf_token 9"];
  }
};
var ConnectSentryCallbackRequest = class _ConnectSentryCallbackRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    this.code = "";
    this.installationId = "";
    this.state = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConnectSentryCallbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConnectSentryCallbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConnectSentryCallbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConnectSentryCallbackRequest, a, b2);
  }
  static $() {
    return ["ConnectSentryCallbackRequest|1 code 9|2 installation_id 9|3 state 9|4 organization_slug 9?"];
  }
};
var ConnectSentryCallbackResponse = class _ConnectSentryCallbackResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConnectSentryCallbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConnectSentryCallbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConnectSentryCallbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConnectSentryCallbackResponse, a, b2);
  }
  static $() {
    return ["ConnectSentryCallbackResponse|1 success 8"];
  }
};
var GetSentryStatusRequest = class _GetSentryStatusRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryStatusRequest, a, b2);
  }
  static $() {
    return ["GetSentryStatusRequest"];
  }
};
var GetSentryStatusResponse = class _GetSentryStatusResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.isConnected = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryStatusResponse, a, b2);
  }
  static $() {
    return ["GetSentryStatusResponse|1 is_connected 8|2 organization_slug 9?"];
  }
};
var GetSentryProjectsRequest = class _GetSentryProjectsRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryProjectsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryProjectsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryProjectsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryProjectsRequest, a, b2);
  }
  static $() {
    return ["GetSentryProjectsRequest"];
  }
};
var SentryProject = class _SentryProject extends __protoMessage3146 {
  constructor(data) {
    super();
    this.id = "";
    this.slug = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SentryProject().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SentryProject().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SentryProject().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SentryProject, a, b2);
  }
  static $() {
    return ["SentryProject|1 id 9|2 slug 9|3 name 9"];
  }
};
var GetSentryProjectsResponse = class _GetSentryProjectsResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.projects = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSentryProjectsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSentryProjectsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSentryProjectsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSentryProjectsResponse, a, b2);
  }
  static $() {
    return ["GetSentryProjectsResponse|1 projects #0*|2 organization_slug 9?", SentryProject];
  }
};
var DisconnectSentryRequest = class _DisconnectSentryRequest extends __protoMessage3146 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisconnectSentryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisconnectSentryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisconnectSentryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisconnectSentryRequest, a, b2);
  }
  static $() {
    return ["DisconnectSentryRequest"];
  }
};
var DisconnectSentryResponse = class _DisconnectSentryResponse extends __protoMessage3146 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisconnectSentryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisconnectSentryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisconnectSentryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisconnectSentryResponse, a, b2);
  }
  static $() {
    return ["DisconnectSentryResponse|1 success 8"];
  }
};
