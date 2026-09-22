/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/aiserver_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/4
init_esm13();

// @recovered-fragment 2/4
init_tools_pb();
init_utils_pb2();

// @recovered-fragment 3/4
init_repository_pb();

// @recovered-fragment 4/4
init_compact();
var __protoPackage126 = "aiserver.v1.";
var __protoMessage3124 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage126;
  }
};
var TaskListItemState = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "TaskListItemState", [[0, "UNSPECIFIED"], [1, "ACTIVE"], [2, "PAUSED"], [3, "NEEDS_INPUT"], [4, "DONE"]], 1);
var AvailableModelsScope = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "AvailableModelsScope", [[0, "UNSPECIFIED"], [1, "USER_AVAILABLE"], [2, "AUTOMATIONS"], [3, "ADMIN_SETTINGS_ALL_APPLICATION_MODELS"]], 1);
var CloudAgentEffortMode = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "CloudAgentEffortMode", [[0, "UNSPECIFIED"], [1, "STANDARD"], [2, "GRIND"]], 1);
var TaskStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "TaskStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "PAUSED"], [3, "DONE"], [4, "NOT_STARTED"]], 1);
var GetComposerAutocompleteRequest = class _GetComposerAutocompleteRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.inputText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerAutocompleteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerAutocompleteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerAutocompleteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerAutocompleteRequest, a, b2);
  }
  static $() {
    return ["GetComposerAutocompleteRequest|1 input_text 9|2 composer_id 9?|3 context #0?", ComposerAutocompleteContext];
  }
};
var GetComposerAutocompleteResponse = class _GetComposerAutocompleteResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.suggestion = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerAutocompleteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerAutocompleteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerAutocompleteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerAutocompleteResponse, a, b2);
  }
  static $() {
    return ["GetComposerAutocompleteResponse|1 suggestion 9"];
  }
};
var ComposerAutocompleteContext = class _ComposerAutocompleteContext extends __protoMessage3124 {
  constructor(data) {
    super();
    this.cachedFiles = [];
    this.conversationMessages = [];
    this.firstUserMessages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerAutocompleteContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerAutocompleteContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerAutocompleteContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerAutocompleteContext, a, b2);
  }
  static $() {
    return ["ComposerAutocompleteContext|1 current_file #0?|2 cached_files #1*|3 conversation_messages #2*|4 visible_viewport_text 9?|5 first_user_messages 9*", CurrentFileContext, CachedFileContext, ConversationMessage];
  }
};
var CurrentFileContext = class _CurrentFileContext extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativePath = "";
    this.language = "";
    this.cursorLine = 0;
    this.fullContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CurrentFileContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CurrentFileContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CurrentFileContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CurrentFileContext, a, b2);
  }
  static $() {
    return ["CurrentFileContext|1 relative_path 9|2 language 9|3 cursor_line 5|4 full_content 9"];
  }
};
var CachedFileContext = class _CachedFileContext extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativePath = "";
    this.language = "";
    this.fullContent = "";
    this.lastViewedTimestamp = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CachedFileContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CachedFileContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CachedFileContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CachedFileContext, a, b2);
  }
  static $() {
    return ["CachedFileContext|1 relative_path 9|2 language 9|3 full_content 9|4 last_viewed_timestamp 3"];
  }
};
var ChatSuggestionItem = class _ChatSuggestionItem extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.reason = "";
    this.type = "";
    this.category = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChatSuggestionItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChatSuggestionItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChatSuggestionItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChatSuggestionItem, a, b2);
  }
  static $() {
    return ["ChatSuggestionItem|1 text 9|2 reason 9|3 type 9|4 category 9"];
  }
};
var RecentChat = class _RecentChat extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.messages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecentChat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecentChat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecentChat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecentChat, a, b2);
  }
  static $() {
    return ["RecentChat|1 title 9|2 timestamp 3?|3 summary 9?|4 messages #0*|5 todos 9?", RecentChatMessage];
  }
};
var RecentChatMessage = class _RecentChatMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.role = "";
    this.text = "";
    this.context = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecentChatMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecentChatMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecentChatMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecentChatMessage, a, b2);
  }
  static $() {
    return ["RecentChatMessage|1 role 9|2 text 9|3 context 9"];
  }
};
var GetChatSuggestionsRequest = class _GetChatSuggestionsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.recentChats = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChatSuggestionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChatSuggestionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChatSuggestionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChatSuggestionsRequest, a, b2);
  }
  static $() {
    return ["GetChatSuggestionsRequest|1 recent_chats #0*", RecentChat];
  }
};
var GetChatSuggestionsResponse = class _GetChatSuggestionsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.suggestions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChatSuggestionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChatSuggestionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChatSuggestionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChatSuggestionsResponse, a, b2);
  }
  static $() {
    return ["GetChatSuggestionsResponse|1 suggestions #0*", ChatSuggestionItem];
  }
};
var GetUserInstructionsRequest = class _GetUserInstructionsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chats = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetUserInstructionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetUserInstructionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetUserInstructionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetUserInstructionsRequest, a, b2);
  }
  static $() {
    return ["GetUserInstructionsRequest|1 chats #0*|2 existing_instructions 9?", RecentChatMessage];
  }
};
var GetUserInstructionsResponse = class _GetUserInstructionsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetUserInstructionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetUserInstructionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetUserInstructionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetUserInstructionsResponse, a, b2);
  }
  static $() {
    return ["GetUserInstructionsResponse|1 text 9"];
  }
};
var IsTerminalFinishedRequest = class _IsTerminalFinishedRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.terminalContent = "";
    this.checkForHangs = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsTerminalFinishedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsTerminalFinishedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsTerminalFinishedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsTerminalFinishedRequest, a, b2);
  }
  static $() {
    return ["IsTerminalFinishedRequest|1 terminal_content 9|2 check_for_hangs 8|3 chat_request_id 9?|4 command 9?"];
  }
};
var IsTerminalFinishedResponseV2 = class _IsTerminalFinishedResponseV2 extends __protoMessage3124 {
  constructor(data) {
    super();
    this.isFinished = false;
    this.isHanging = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsTerminalFinishedResponseV2().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsTerminalFinishedResponseV2().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsTerminalFinishedResponseV2().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsTerminalFinishedResponseV2, a, b2);
  }
  static $() {
    return ["IsTerminalFinishedResponseV2|1 is_finished 8|2 ended_reason #0?|3 exit_code 5?|4 is_hanging 8", RunTerminalCommandEndedReason];
  }
};
var TestBidiRequest = class _TestBidiRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestBidiRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestBidiRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestBidiRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestBidiRequest, a, b2);
  }
  static $() {
    return ["TestBidiRequest|1 message 9"];
  }
};
var TestBidiResponse = class _TestBidiResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestBidiResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestBidiResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestBidiResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestBidiResponse, a, b2);
  }
  static $() {
    return ["TestBidiResponse|1 message 9"];
  }
};
var AutoContextFile = class _AutoContextFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.fileContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoContextFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoContextFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoContextFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoContextFile, a, b2);
  }
  static $() {
    return ["AutoContextFile|1 relative_workspace_path 9|2 file_content 9"];
  }
};
var AutoContextRequest = class _AutoContextRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.candidateFiles = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoContextRequest, a, b2);
  }
  static $() {
    return ["AutoContextRequest|1 text 9|2 candidate_files #0*|3 model_details #1", AutoContextFile, ModelDetails];
  }
};
var AutoContextRankedFile = class _AutoContextRankedFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.rerankingScore = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoContextRankedFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoContextRankedFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoContextRankedFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoContextRankedFile, a, b2);
  }
  static $() {
    return ["AutoContextRankedFile|1 relative_workspace_path 9|2 reranking_score 2"];
  }
};
var AutoContextResponse = class _AutoContextResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.rankedFiles = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoContextResponse, a, b2);
  }
  static $() {
    return ["AutoContextResponse|1 ranked_files #0*", AutoContextRankedFile];
  }
};
var CheckBugBotPriceRequest = class _CheckBugBotPriceRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffCharLen = 0;
    this.iterations = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckBugBotPriceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckBugBotPriceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckBugBotPriceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckBugBotPriceRequest, a, b2);
  }
  static $() {
    return ["CheckBugBotPriceRequest|1 diff_char_len 5|2 iterations 5|3 model_details #0|4 session_id 9?", ModelDetails];
  }
};
var CheckBugBotPriceResponse = class _CheckBugBotPriceResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.cost = 0;
    this.priceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckBugBotPriceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckBugBotPriceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckBugBotPriceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckBugBotPriceResponse, a, b2);
  }
  static $() {
    return ["CheckBugBotPriceResponse|1 cost 1|2 price_id 9"];
  }
};
var AcknowledgeGracePeriodDisclaimerRequest = class _AcknowledgeGracePeriodDisclaimerRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AcknowledgeGracePeriodDisclaimerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AcknowledgeGracePeriodDisclaimerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AcknowledgeGracePeriodDisclaimerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AcknowledgeGracePeriodDisclaimerRequest, a, b2);
  }
  static $() {
    return ["AcknowledgeGracePeriodDisclaimerRequest"];
  }
};
var AcknowledgeGracePeriodDisclaimerResponse = class _AcknowledgeGracePeriodDisclaimerResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AcknowledgeGracePeriodDisclaimerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AcknowledgeGracePeriodDisclaimerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AcknowledgeGracePeriodDisclaimerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AcknowledgeGracePeriodDisclaimerResponse, a, b2);
  }
  static $() {
    return ["AcknowledgeGracePeriodDisclaimerResponse"];
  }
};
var CheckBugBotTelemetryHealthyRequest = class _CheckBugBotTelemetryHealthyRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sessionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckBugBotTelemetryHealthyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckBugBotTelemetryHealthyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckBugBotTelemetryHealthyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckBugBotTelemetryHealthyRequest, a, b2);
  }
  static $() {
    return ["CheckBugBotTelemetryHealthyRequest|1 session_id 9"];
  }
};
var CheckBugBotTelemetryHealthyResponse = class _CheckBugBotTelemetryHealthyResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.isHealthy = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckBugBotTelemetryHealthyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckBugBotTelemetryHealthyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckBugBotTelemetryHealthyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckBugBotTelemetryHealthyResponse, a, b2);
  }
  static $() {
    return ["CheckBugBotTelemetryHealthyResponse|1 is_healthy 8"];
  }
};
var RecordIdeBugReactionRequest = class _RecordIdeBugReactionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.bugId = "";
    this.reaction = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordIdeBugReactionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordIdeBugReactionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordIdeBugReactionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordIdeBugReactionRequest, a, b2);
  }
  static $() {
    return ["RecordIdeBugReactionRequest|1 bug_id 9|2 reaction 9"];
  }
};
var RecordIdeBugReactionResponse = class _RecordIdeBugReactionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordIdeBugReactionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordIdeBugReactionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordIdeBugReactionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordIdeBugReactionResponse, a, b2);
  }
  static $() {
    return ["RecordIdeBugReactionResponse|1 success 8"];
  }
};
var GetSuggestedBugBotIterationsRequest = class _GetSuggestedBugBotIterationsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffCharLen = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSuggestedBugBotIterationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSuggestedBugBotIterationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSuggestedBugBotIterationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSuggestedBugBotIterationsRequest, a, b2);
  }
  static $() {
    return ["GetSuggestedBugBotIterationsRequest|1 diff_char_len 5|2 model_details #0", ModelDetails];
  }
};
var GetSuggestedBugBotIterationsResponse = class _GetSuggestedBugBotIterationsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.iterations = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSuggestedBugBotIterationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSuggestedBugBotIterationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSuggestedBugBotIterationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSuggestedBugBotIterationsResponse, a, b2);
  }
  static $() {
    return ["GetSuggestedBugBotIterationsResponse|1 iterations 5"];
  }
};
var GetEditorBugbotAutoRunStatusRequest = class _GetEditorBugbotAutoRunStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEditorBugbotAutoRunStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEditorBugbotAutoRunStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEditorBugbotAutoRunStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEditorBugbotAutoRunStatusRequest, a, b2);
  }
  static $() {
    return ["GetEditorBugbotAutoRunStatusRequest"];
  }
};
var GetEditorBugbotAutoRunStatusResponse = class _GetEditorBugbotAutoRunStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.shouldAutoRun = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEditorBugbotAutoRunStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEditorBugbotAutoRunStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEditorBugbotAutoRunStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEditorBugbotAutoRunStatusResponse, a, b2);
  }
  static $() {
    return ["GetEditorBugbotAutoRunStatusResponse|1 should_auto_run 8"];
  }
};
var BugBotStatus = class _BugBotStatus extends __protoMessage3124 {
  constructor(data) {
    super();
    this.status = BugBotStatus_Status.UNSPECIFIED;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotStatus, a, b2);
  }
  static $() {
    return ["BugBotStatus|1 status #0|2 message 9|3 iterations_completed 5?|4 total_iterations 5?|5 total_tokens 5?|6 processed_tokens 5?|7 processed_cost 2?|8 thinking_tokens 5?|9 thinking_cost 2?", BugBotStatus_Status];
  }
};
var BugBotStatus_Status = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "BugBotStatus.Status", [[0, "UNSPECIFIED"], [1, "IN_PROGRESS"], [2, "IN_PROGRESS_ITERATIONS"], [3, "DONE"], [4, "ERROR"]], 1);
var BugbotTrialNotification = class _BugbotTrialNotification extends __protoMessage3124 {
  constructor(data) {
    super();
    this.show = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugbotTrialNotification().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugbotTrialNotification().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugbotTrialNotification().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugbotTrialNotification, a, b2);
  }
  static $() {
    return ["BugbotTrialNotification|1 show 8|2 message 9?|3 learn_more_url 9?"];
  }
};
var StreamBugBotResponse = class _StreamBugBotResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBugBotResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBugBotResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBugBotResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBugBotResponse, a, b2);
  }
  static $() {
    return ["StreamBugBotResponse|1 bug_reports #0?|2 status #1|3 summary 9?|4 trial_notification #2?|5 num_turns 5?", BugReports, BugBotStatus, BugbotTrialNotification];
  }
};
var StreamBugBotAgenticClientMessage = class _StreamBugBotAgenticClientMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBugBotAgenticClientMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBugBotAgenticClientMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBugBotAgenticClientMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBugBotAgenticClientMessage, a, b2);
  }
  static $() {
    return ["StreamBugBotAgenticClientMessage|1 start #0 message|2 exec_client_message #1 message|3 exec_client_control_message #2 message", StreamBugBotRequest, ExecClientMessage, ExecClientControlMessage];
  }
};
var StreamBugBotAgenticServerMessage = class _StreamBugBotAgenticServerMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamBugBotAgenticServerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamBugBotAgenticServerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamBugBotAgenticServerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamBugBotAgenticServerMessage, a, b2);
  }
  static $() {
    return ["StreamBugBotAgenticServerMessage|1 bugbot_response #0 message|2 exec_server_message #1 message|3 exec_server_control_message #2 message", StreamBugBotResponse, ExecServerMessage, ExecServerControlMessage];
  }
};
var UiBestOfNJudgeCandidate = class _UiBestOfNJudgeCandidate extends __protoMessage3124 {
  constructor(data) {
    super();
    this.composerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UiBestOfNJudgeCandidate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UiBestOfNJudgeCandidate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UiBestOfNJudgeCandidate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UiBestOfNJudgeCandidate, a, b2);
  }
  static $() {
    return ["UiBestOfNJudgeCandidate|1 composer_id 9|2 diff #0", GitDiff];
  }
};
var StreamUiBestOfNJudgeStartRequest = class _StreamUiBestOfNJudgeStartRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.task = "";
    this.candidates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamUiBestOfNJudgeStartRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamUiBestOfNJudgeStartRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamUiBestOfNJudgeStartRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamUiBestOfNJudgeStartRequest, a, b2);
  }
  static $() {
    return ["StreamUiBestOfNJudgeStartRequest|1 task 9|2 candidates #0*", UiBestOfNJudgeCandidate];
  }
};
var UiBestOfNJudgeFinalResult = class _UiBestOfNJudgeFinalResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.winnerComposerId = "";
    this.reasoning = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UiBestOfNJudgeFinalResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UiBestOfNJudgeFinalResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UiBestOfNJudgeFinalResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UiBestOfNJudgeFinalResult, a, b2);
  }
  static $() {
    return ["UiBestOfNJudgeFinalResult|1 winner_composer_id 9|2 reasoning 9"];
  }
};
var StreamUiBestOfNJudgeClientMessage = class _StreamUiBestOfNJudgeClientMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamUiBestOfNJudgeClientMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamUiBestOfNJudgeClientMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamUiBestOfNJudgeClientMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamUiBestOfNJudgeClientMessage, a, b2);
  }
  static $() {
    return ["StreamUiBestOfNJudgeClientMessage|1 start #0 message|2 exec_client_message #1 message|3 exec_client_control_message #2 message", StreamUiBestOfNJudgeStartRequest, ExecClientMessage, ExecClientControlMessage];
  }
};
var StreamUiBestOfNJudgeServerMessage = class _StreamUiBestOfNJudgeServerMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamUiBestOfNJudgeServerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamUiBestOfNJudgeServerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamUiBestOfNJudgeServerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamUiBestOfNJudgeServerMessage, a, b2);
  }
  static $() {
    return ["StreamUiBestOfNJudgeServerMessage|1 final_result #0 message|2 exec_server_message #1 message|3 exec_server_control_message #2 message", UiBestOfNJudgeFinalResult, ExecServerMessage, ExecServerControlMessage];
  }
};
var ContextRerankingRequest = class _ContextRerankingRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chatConversationHistory = [];
    this.cppDiffTrajectories = [];
    this.candidateFiles = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextRerankingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextRerankingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextRerankingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextRerankingRequest, a, b2);
  }
  static $() {
    return ["ContextRerankingRequest|1 current_file #0?|2 chat_conversation_history #1*|3 cpp_diff_trajectories #2*|4 candidate_files #3*", CurrentFileInfo, ConversationMessage, CppFileDiffHistory, ContextRerankingCandidateFile];
  }
};
var ContextRerankingResponse = class _ContextRerankingResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.rerankingScores = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextRerankingResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextRerankingResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextRerankingResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextRerankingResponse, a, b2);
  }
  static $() {
    return ["ContextRerankingResponse|1 reranking_scores 2*"];
  }
};
var NameTabRequest = class _NameTabRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.messages = [];
    this.isProject = false;
    this.credentials = { case: void 0 };
    this.conversationId = "";
    this.isSideChat = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NameTabRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NameTabRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NameTabRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NameTabRequest, a, b2);
  }
  static $() {
    return ["NameTabRequest|1 messages #0*|2 is_project 8|3 api_key_credentials #1 credentials|4 azure_credentials #2 credentials|5 bedrock_credentials #3 credentials|6 conversation_id 9|7 is_side_chat 8", ConversationMessage, ApiKeyCredentials, AzureCredentials, BedrockCredentials];
  }
};
var NameTabResponse = class _NameTabResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.reason = "";
    this.icon = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NameTabResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NameTabResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NameTabResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NameTabResponse, a, b2);
  }
  static $() {
    return ["NameTabResponse|1 name 9|2 reason 9|3 icon 9"];
  }
};
var TaskListItem = class _TaskListItem extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.title = "";
    this.state = TaskListItemState.UNSPECIFIED;
    this.note = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskListItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskListItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskListItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskListItem, a, b2);
  }
  static $() {
    return ["TaskListItem|1 id 9|2 title 9|3 state #0|4 note 9", TaskListItemState];
  }
};
var KeepTaskListRequest = class _KeepTaskListRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.items = [];
    this.messages = [];
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeepTaskListRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeepTaskListRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeepTaskListRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeepTaskListRequest, a, b2);
  }
  static $() {
    return ["KeepTaskListRequest|1 items #0*|2 messages #1*|3 conversation_id 9", TaskListItem, ConversationMessage];
  }
};
var TaskListChange = class _TaskListChange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.title = "";
    this.state = TaskListItemState.UNSPECIFIED;
    this.isRemoved = false;
    this.note = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskListChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskListChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskListChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskListChange, a, b2);
  }
  static $() {
    return ["TaskListChange|1 id 9|2 title 9|3 state #0|4 is_removed 8|5 note 9", TaskListItemState];
  }
};
var KeepTaskListResponse = class _KeepTaskListResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeepTaskListResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeepTaskListResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeepTaskListResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeepTaskListResponse, a, b2);
  }
  static $() {
    return ["KeepTaskListResponse|1 changes #0*", TaskListChange];
  }
};
var TestModelStatusRequest = class _TestModelStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.modelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestModelStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestModelStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestModelStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestModelStatusRequest, a, b2);
  }
  static $() {
    return ["TestModelStatusRequest|1 model_name 9"];
  }
};
var TestModelStatusResponse = class _TestModelStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.latency = 0;
    this.ttft = 0;
    this.maxTimeBetweenChunks = 0;
    this.serverTiming = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestModelStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestModelStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestModelStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestModelStatusResponse, a, b2);
  }
  static $() {
    return ["TestModelStatusResponse|1 text 9|2 latency 2|3 ttft 2|4 max_time_between_chunks 2|5 server_timing 9"];
  }
};
var LlmGatewayModelTestStage = class _LlmGatewayModelTestStage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LlmGatewayModelTestStage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LlmGatewayModelTestStage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LlmGatewayModelTestStage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LlmGatewayModelTestStage, a, b2);
  }
  static $() {
    return ["LlmGatewayModelTestStage|1 name 9|2 status 9?|3 error_class 9?"];
  }
};
var LlmGatewayModelTestInspect = class _LlmGatewayModelTestInspect extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LlmGatewayModelTestInspect().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LlmGatewayModelTestInspect().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LlmGatewayModelTestInspect().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LlmGatewayModelTestInspect, a, b2);
  }
  static $() {
    return ["LlmGatewayModelTestInspect|1 http_status 5?|2 request 9?|3 response 9?|4 latency_ms 5?"];
  }
};
var LlmGatewayModelTestUsage = class _LlmGatewayModelTestUsage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.billed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LlmGatewayModelTestUsage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LlmGatewayModelTestUsage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LlmGatewayModelTestUsage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LlmGatewayModelTestUsage, a, b2);
  }
  static $() {
    return ["LlmGatewayModelTestUsage|1 billed 8"];
  }
};
var LlmGatewayConnectionTesterRequest = class _LlmGatewayConnectionTesterRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.teamId = 0;
    this.modelId = "";
    this.prompt = "";
    this.headerOverrides = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LlmGatewayConnectionTesterRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LlmGatewayConnectionTesterRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LlmGatewayConnectionTesterRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LlmGatewayConnectionTesterRequest, a, b2);
  }
  static $() {
    return ["LlmGatewayConnectionTesterRequest|1 team_id 5|2 model_id 9|3 prompt 9|4 auth_token_override 9?|5 header_overrides 9,9"];
  }
};
var LlmGatewayConnectionTesterResponse = class _LlmGatewayConnectionTesterResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.stages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LlmGatewayConnectionTesterResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LlmGatewayConnectionTesterResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LlmGatewayConnectionTesterResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LlmGatewayConnectionTesterResponse, a, b2);
  }
  static $() {
    return ["LlmGatewayConnectionTesterResponse|1 stages #0*|2 inspect #1|3 usage #2", LlmGatewayModelTestStage, LlmGatewayModelTestInspect, LlmGatewayModelTestUsage];
  }
};
var EvaluatePromptHookRequest = class _EvaluatePromptHookRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.prompt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EvaluatePromptHookRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EvaluatePromptHookRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EvaluatePromptHookRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EvaluatePromptHookRequest, a, b2);
  }
  static $() {
    return ["EvaluatePromptHookRequest|1 prompt 9|2 hook_input_json #0|3 model_name 9?", Value];
  }
};
var EvaluatePromptHookResponse = class _EvaluatePromptHookResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.ok = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EvaluatePromptHookResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EvaluatePromptHookResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EvaluatePromptHookResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EvaluatePromptHookResponse, a, b2);
  }
  static $() {
    return ["EvaluatePromptHookResponse|1 ok 8|2 reason 9?"];
  }
};
var TryParseTypeScriptTreeSitterRequest = class _TryParseTypeScriptTreeSitterRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.workspaceRelativePath = "";
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TryParseTypeScriptTreeSitterRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TryParseTypeScriptTreeSitterRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TryParseTypeScriptTreeSitterRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TryParseTypeScriptTreeSitterRequest, a, b2);
  }
  static $() {
    return ["TryParseTypeScriptTreeSitterRequest|1 workspace_relative_path 9|2 text 9"];
  }
};
var TryParseTypeScriptTreeSitterResponse = class _TryParseTypeScriptTreeSitterResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TryParseTypeScriptTreeSitterResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TryParseTypeScriptTreeSitterResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TryParseTypeScriptTreeSitterResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TryParseTypeScriptTreeSitterResponse, a, b2);
  }
  static $() {
    return ["TryParseTypeScriptTreeSitterResponse|1 text 9"];
  }
};
var DevOnlyGetPastRequestIdsRequest = class _DevOnlyGetPastRequestIdsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DevOnlyGetPastRequestIdsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DevOnlyGetPastRequestIdsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DevOnlyGetPastRequestIdsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DevOnlyGetPastRequestIdsRequest, a, b2);
  }
  static $() {
    return ["DevOnlyGetPastRequestIdsRequest|1 count 5?|2 page 5?"];
  }
};
var DevOnlyPastRequest = class _DevOnlyPastRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.dateTime = "";
    this.modelName = "";
    this.featureName = "";
    this.s3Uri = "";
    this.status = "";
    this.numPromptTokens = 0;
    this.numCompletionTokens = 0;
    this.apiCallMethod = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DevOnlyPastRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DevOnlyPastRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DevOnlyPastRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DevOnlyPastRequest, a, b2);
  }
  static $() {
    return ["DevOnlyPastRequest|1 request_id 9|2 date_time 9|3 model_name 9|4 feature_name 9|5 s3_uri 9|6 status 9|7 num_prompt_tokens 5|8 num_completion_tokens 5|9 api_call_method 9"];
  }
};
var DevOnlyGetPastRequestIdsResponse = class _DevOnlyGetPastRequestIdsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pastRequests = [];
    this.totalCount = 0;
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DevOnlyGetPastRequestIdsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DevOnlyGetPastRequestIdsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DevOnlyGetPastRequestIdsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DevOnlyGetPastRequestIdsResponse, a, b2);
  }
  static $() {
    return ["DevOnlyGetPastRequestIdsResponse|1 past_requests #0*|10 total_count 5|11 has_more 8", DevOnlyPastRequest];
  }
};
var GetCodebaseQuestionsResponse = class _GetCodebaseQuestionsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.questions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCodebaseQuestionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCodebaseQuestionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCodebaseQuestionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCodebaseQuestionsResponse, a, b2);
  }
  static $() {
    return ["GetCodebaseQuestionsResponse|1 questions 9*"];
  }
};
var AtSymbolOption = class _AtSymbolOption extends __protoMessage3124 {
  constructor(data) {
    super();
    this.index = 0;
    this.text = "";
    this.type = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AtSymbolOption().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AtSymbolOption().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AtSymbolOption().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AtSymbolOption, a, b2);
  }
  static $() {
    return ["AtSymbolOption|1 index 5|2 text 9|3 type 9"];
  }
};
var AtSymbolDependencyInformation = class _AtSymbolDependencyInformation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.fromFile = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AtSymbolDependencyInformation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AtSymbolDependencyInformation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AtSymbolDependencyInformation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AtSymbolDependencyInformation, a, b2);
  }
  static $() {
    return ["AtSymbolDependencyInformation|1 name 9|2 from_file 9"];
  }
};
var GetAtSymbolSuggestionsRequest = class _GetAtSymbolSuggestionsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.atSymbolDependencies = [];
    this.atSymbolOptions = [];
    this.userQuery = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtSymbolSuggestionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtSymbolSuggestionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtSymbolSuggestionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtSymbolSuggestionsRequest, a, b2);
  }
  static $() {
    return ["GetAtSymbolSuggestionsRequest|1 current_file_info #0|2 at_symbol_dependencies #1*|3 at_symbol_options #2*|4 user_query 9|5 model_details #3", CurrentFileInfo, AtSymbolDependencyInformation, AtSymbolOption, ModelDetails];
  }
};
var GetAtSymbolSuggestionsResponse = class _GetAtSymbolSuggestionsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.indices = [];
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtSymbolSuggestionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtSymbolSuggestionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtSymbolSuggestionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtSymbolSuggestionsResponse, a, b2);
  }
  static $() {
    return ["GetAtSymbolSuggestionsResponse|1 indices 5*|2 explanation 9"];
  }
};
var CurrentFolderFileOrFolder = class _CurrentFolderFileOrFolder extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.isFolder = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CurrentFolderFileOrFolder().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CurrentFolderFileOrFolder().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CurrentFolderFileOrFolder().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CurrentFolderFileOrFolder, a, b2);
  }
  static $() {
    return ["CurrentFolderFileOrFolder|1 name 9|2 is_folder 8"];
  }
};
var GetTerminalCompletionRequest = class _GetTerminalCompletionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.currentCommand = "";
    this.commandHistory = [];
    this.fileDiffHistories = [];
    this.commitHistory = [];
    this.pastResults = [];
    this.userPlatform = "";
    this.currentFolder = "";
    this.currentFolderStructure = [];
    this.relevantFiles = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTerminalCompletionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTerminalCompletionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTerminalCompletionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTerminalCompletionRequest, a, b2);
  }
  static $() {
    return ["GetTerminalCompletionRequest|1 current_command 9|2 command_history 9*|3 model_name 9?|4 file_diff_histories #0*|5 git_diff 9?|6 commit_history 9*|7 past_results 9*|8 model_details #1|9 user_platform 9|10 current_folder 9|11 current_folder_structure #2*|12 relevant_files #3*", CppFileDiffHistory, ModelDetails, CurrentFolderFileOrFolder, File2];
  }
};
var GetTerminalCompletionResponse = class _GetTerminalCompletionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTerminalCompletionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTerminalCompletionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTerminalCompletionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTerminalCompletionResponse, a, b2);
  }
  static $() {
    return ["GetTerminalCompletionResponse|1 command 9"];
  }
};
var HeuristicsSelection = class _HeuristicsSelection extends __protoMessage3124 {
  constructor(data) {
    super();
    this.type = HeuristicsSelection_HeuristicsSelectionType.UNSPECIFIED;
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HeuristicsSelection().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HeuristicsSelection().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HeuristicsSelection().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HeuristicsSelection, a, b2);
  }
  static $() {
    return ["HeuristicsSelection|1 type #0|2 start_line 5|3 end_line 5", HeuristicsSelection_HeuristicsSelectionType];
  }
};
var HeuristicsSelection_HeuristicsSelectionType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "HeuristicsSelection.HeuristicsSelectionType", [[0, "UNSPECIFIED"], [1, "GROUP"], [2, "LINE"], [3, "FOLDING"]], 1);
var CalculateAutoSelectionRequest = class _CalculateAutoSelectionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.heuristicsSelections = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CalculateAutoSelectionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CalculateAutoSelectionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CalculateAutoSelectionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CalculateAutoSelectionRequest, a, b2);
  }
  static $() {
    return ["CalculateAutoSelectionRequest|1 current_file_info #0|2 cursor_position #1|3 selection_range #2|4 model_details #3|5 heuristics_selections #4*", CurrentFileInfo, CursorPosition, SimpleRange, ModelDetails, HeuristicsSelection];
  }
};
var AutoSelectionInstructions = class _AutoSelectionInstructions extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoSelectionInstructions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoSelectionInstructions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoSelectionInstructions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoSelectionInstructions, a, b2);
  }
  static $() {
    return ["AutoSelectionInstructions|1 text 9|2 start_line 5|3 end_line 5"];
  }
};
var AutoSelectionResult = class _AutoSelectionResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLine = 0;
    this.instructions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AutoSelectionResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AutoSelectionResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AutoSelectionResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AutoSelectionResult, a, b2);
  }
  static $() {
    return ["AutoSelectionResult|1 start_line 5|2 end_line 5|3 instructions #0*", AutoSelectionInstructions];
  }
};
var CalculateAutoSelectionResponse = class _CalculateAutoSelectionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CalculateAutoSelectionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CalculateAutoSelectionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CalculateAutoSelectionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CalculateAutoSelectionResponse, a, b2);
  }
  static $() {
    return ["CalculateAutoSelectionResponse|1 results #0*", AutoSelectionResult];
  }
};
var BackgroundCmdKRequest = class _BackgroundCmdKRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.instruction = "";
    this.type = BackgroundCmdKRequest_Type.UNSPECIFIED;
    this.proposedChangeHistory = [];
    this.relatedCodeBlocks = [];
    this.diffHistory = [];
    this.linterErrors = [];
    this.usefulTypes = [];
    this.recentlyViewedFiles = [];
    this.recentDiffs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest|1 instruction 9|2 current_file #0|3 selection_range #1|4 type #2|5 proposed_change_history #3*|6 related_code_blocks #4*|7 diff_history #5*|8 linter_errors #6*|9 useful_types #7*|10 recently_viewed_files #8*|11 recent_diffs #9*|12 multiple_completions 8?", CurrentFileInfo, SimpleRange, BackgroundCmdKRequest_Type, BackgroundCmdKRequest_ProposedChange, CodeBlock, CppFileDiffHistory, BackgroundCmdKRequest_Lint, BackgroundCmdKRequest_UsefulType, BackgroundCmdKRequest_RecentlyViewedFile, BackgroundCmdKRequest_Diff];
  }
};
var BackgroundCmdKRequest_Type = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "BackgroundCmdKRequest.Type", [[0, "UNSPECIFIED"], [1, "REFLECT"], [2, "LOOP_ON_LINTS"], [3, "CHAT_AND_APPLY"], [4, "COALESCE_GENERATIONS"], [5, "CODEBASE_CHUNKS"], [6, "SPEC_AND_APPLY"], [7, "ASK_CODEBASE"], [8, "FINETUNED_INSTRUCTIONS"], [9, "USEFUL_TYPES"], [10, "CHAT_AND_APPLY_UNDERSPECIFIED"]], 1);
var BackgroundCmdKRequest_Lint = class _BackgroundCmdKRequest_Lint extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.severity = "";
    this.relativeWorkspacePath = "";
    this.startLineNumberOneIndexed = 0;
    this.startColumnOneIndexed = 0;
    this.endLineNumberInclusiveOneIndexed = 0;
    this.endColumnOneIndexed = 0;
    this.quickFixes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_Lint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_Lint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_Lint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_Lint, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.Lint|1 message 9|2 severity 9|3 relative_workspace_path 9|4 start_line_number_one_indexed 5|5 start_column_one_indexed 5|6 end_line_number_inclusive_one_indexed 5|7 end_column_one_indexed 5|9 quick_fixes #0*", BackgroundCmdKRequest_Lint_QuickFix];
  }
};
var BackgroundCmdKRequest_Lint_QuickFix = class _BackgroundCmdKRequest_Lint_QuickFix extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.kind = "";
    this.isPreferred = false;
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_Lint_QuickFix, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.Lint.QuickFix|1 message 9|2 kind 9|3 is_preferred 8|4 edits #0*", BackgroundCmdKRequest_Lint_QuickFix_Edit];
  }
};
var BackgroundCmdKRequest_Lint_QuickFix_Edit = class _BackgroundCmdKRequest_Lint_QuickFix_Edit extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.text = "";
    this.startLineNumberOneIndexed = 0;
    this.startColumnOneIndexed = 0;
    this.endLineNumberInclusiveOneIndexed = 0;
    this.endColumnOneIndexed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix_Edit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix_Edit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_Lint_QuickFix_Edit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_Lint_QuickFix_Edit, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.Lint.QuickFix.Edit|1 relative_workspace_path 9|2 text 9|3 start_line_number_one_indexed 5|4 start_column_one_indexed 5|5 end_line_number_inclusive_one_indexed 5|6 end_column_one_indexed 5"];
  }
};
var BackgroundCmdKRequest_ProposedChange = class _BackgroundCmdKRequest_ProposedChange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.change = "";
    this.linterErrors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_ProposedChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_ProposedChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_ProposedChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_ProposedChange, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.ProposedChange|1 change 9|2 linter_errors #0*", BackgroundCmdKRequest_Lint];
  }
};
var BackgroundCmdKRequest_UsefulType = class _BackgroundCmdKRequest_UsefulType extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLine = 0;
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_UsefulType().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_UsefulType().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_UsefulType().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_UsefulType, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.UsefulType|1 relative_workspace_path 9|2 start_line 5|3 text 9|4 score 1?"];
  }
};
var BackgroundCmdKRequest_RecentlyViewedFile = class _BackgroundCmdKRequest_RecentlyViewedFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.visibleRanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_RecentlyViewedFile, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.RecentlyViewedFile|1 relative_workspace_path 9|2 contents 9|3 visible_ranges #0*", BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange];
  }
};
var BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange = class _BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLineNumberInclusive = 0;
    this.endLineNumberExclusive = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_RecentlyViewedFile_VisibleRange, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.RecentlyViewedFile.VisibleRange|1 start_line_number_inclusive 5|2 end_line_number_exclusive 5|3 viewed_at 5?|4 global_order_descending 5?"];
  }
};
var BackgroundCmdKRequest_Diff = class _BackgroundCmdKRequest_Diff extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.diff = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKRequest_Diff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKRequest_Diff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKRequest_Diff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKRequest_Diff, a, b2);
  }
  static $() {
    return ["BackgroundCmdKRequest.Diff|1 relative_workspace_path 9|2 diff 9"];
  }
};
var BackgroundCmdKResponse = class _BackgroundCmdKResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.proposedChange = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKResponse, a, b2);
  }
  static $() {
    return ["BackgroundCmdKResponse|1 proposed_change 9"];
  }
};
var BackgroundCmdKEvalRequest = class _BackgroundCmdKEvalRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.instruction = "";
    this.groundTruth = "";
    this.experiment = BackgroundCmdKEvalRequest_Experiment.UNSPECIFIED;
    this.runAutomatedEval = false;
    this.proposedChangeHistory = [];
    this.commitNotes = [];
    this.relatedCodeBlocks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalRequest, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalRequest|1 instruction 9|2 current_file #0|3 selection_range #1|4 ground_truth 9|5 experiment #2|6 run_automated_eval 8|7 proposed_change_history #3*|8 commit_notes #4*|9 related_code_blocks #5*", CurrentFileInfo, SimpleRange, BackgroundCmdKEvalRequest_Experiment, BackgroundCmdKEvalRequest_ProposedChange, CommitNote, CodeBlock];
  }
};
var BackgroundCmdKEvalRequest_Experiment = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "BackgroundCmdKEvalRequest.Experiment", [[0, "UNSPECIFIED"], [1, "REFLECT"], [2, "CMD_K_ORIGINAL_RADIUS"], [3, "LOOP_ON_LINTS"], [4, "CHAT_AND_APPLY"], [5, "COMMIT_NOTES"], [6, "COALESCE_GENERATIONS"], [7, "REWORD_INSTRUCTIONS"], [8, "CODEBASE_CHUNKS"], [9, "SPEC_AND_APPLY"], [10, "ASK_CODEBASE"]], 1);
var BackgroundCmdKEvalRequest_Lint = class _BackgroundCmdKEvalRequest_Lint extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.severity = "";
    this.relativeWorkspacePath = "";
    this.startLineNumberOneIndexed = 0;
    this.startColumnOneIndexed = 0;
    this.endLineNumberInclusiveOneIndexed = 0;
    this.endColumnOneIndexed = 0;
    this.quickFixes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalRequest_Lint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalRequest_Lint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalRequest_Lint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalRequest_Lint, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalRequest.Lint|1 message 9|2 severity 9|3 relative_workspace_path 9|4 start_line_number_one_indexed 5|5 start_column_one_indexed 5|6 end_line_number_inclusive_one_indexed 5|7 end_column_one_indexed 5|9 quick_fixes #0*", BackgroundCmdKEvalRequest_Lint_QuickFix];
  }
};
var BackgroundCmdKEvalRequest_Lint_QuickFix = class _BackgroundCmdKEvalRequest_Lint_QuickFix extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.kind = "";
    this.isPreferred = false;
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalRequest_Lint_QuickFix, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalRequest.Lint.QuickFix|1 message 9|2 kind 9|3 is_preferred 8|4 edits #0*", BackgroundCmdKEvalRequest_Lint_QuickFix_Edit];
  }
};
var BackgroundCmdKEvalRequest_Lint_QuickFix_Edit = class _BackgroundCmdKEvalRequest_Lint_QuickFix_Edit extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.text = "";
    this.startLineNumberOneIndexed = 0;
    this.startColumnOneIndexed = 0;
    this.endLineNumberInclusiveOneIndexed = 0;
    this.endColumnOneIndexed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix_Edit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix_Edit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalRequest_Lint_QuickFix_Edit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalRequest_Lint_QuickFix_Edit, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalRequest.Lint.QuickFix.Edit|1 relative_workspace_path 9|2 text 9|3 start_line_number_one_indexed 5|4 start_column_one_indexed 5|5 end_line_number_inclusive_one_indexed 5|6 end_column_one_indexed 5"];
  }
};
var BackgroundCmdKEvalRequest_ProposedChange = class _BackgroundCmdKEvalRequest_ProposedChange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.change = "";
    this.linterErrors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalRequest_ProposedChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalRequest_ProposedChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalRequest_ProposedChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalRequest_ProposedChange, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalRequest.ProposedChange|1 change 9|2 linter_errors #0*", BackgroundCmdKEvalRequest_Lint];
  }
};
var BackgroundCmdKEvalResponse = class _BackgroundCmdKEvalResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.proposedChange = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundCmdKEvalResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundCmdKEvalResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundCmdKEvalResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundCmdKEvalResponse, a, b2);
  }
  static $() {
    return ["BackgroundCmdKEvalResponse|1 proposed_change 9"];
  }
};
var GetThoughtAnnotationRequest = class _GetThoughtAnnotationRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetThoughtAnnotationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetThoughtAnnotationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetThoughtAnnotationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetThoughtAnnotationRequest, a, b2);
  }
  static $() {
    return ["GetThoughtAnnotationRequest|1 request_id 9"];
  }
};
var UpdateVscodeProfileRequest = class _UpdateVscodeProfileRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.machineId = "";
    this.workspaceExtensions = [];
    this.extensions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateVscodeProfileRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateVscodeProfileRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateVscodeProfileRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateVscodeProfileRequest, a, b2);
  }
  static $() {
    return ["UpdateVscodeProfileRequest|1 machine_id 9|2 workspace_extensions 9*|3 extensions 9*"];
  }
};
var UpdateVscodeProfileResponse = class _UpdateVscodeProfileResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateVscodeProfileResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateVscodeProfileResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateVscodeProfileResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateVscodeProfileResponse, a, b2);
  }
  static $() {
    return ["UpdateVscodeProfileResponse"];
  }
};
var GetThoughtAnnotationResponse = class _GetThoughtAnnotationResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetThoughtAnnotationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetThoughtAnnotationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetThoughtAnnotationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetThoughtAnnotationResponse, a, b2);
  }
  static $() {
    return ["GetThoughtAnnotationResponse|1 thought_annotation #0", AiThoughtAnnotation];
  }
};
var AiThoughtAnnotation = class _AiThoughtAnnotation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.authId = "";
    this.thought = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AiThoughtAnnotation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AiThoughtAnnotation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AiThoughtAnnotation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AiThoughtAnnotation, a, b2);
  }
  static $() {
    return ["AiThoughtAnnotation|1 request_id 9|2 auth_id 9|3 debug_info #0|4 thought 9", CmdKDebugInfo];
  }
};
var BulkEmbedRequest = class _BulkEmbedRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.texts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BulkEmbedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BulkEmbedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BulkEmbedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BulkEmbedRequest, a, b2);
  }
  static $() {
    return ["BulkEmbedRequest|1 texts 9*"];
  }
};
var BulkEmbedResponse = class _BulkEmbedResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.embeddings = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BulkEmbedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BulkEmbedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BulkEmbedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BulkEmbedResponse, a, b2);
  }
  static $() {
    return ["BulkEmbedResponse|1 embeddings #0*", EmbeddingResponse];
  }
};
var EmbeddingResponse = class _EmbeddingResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.embedding = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EmbeddingResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EmbeddingResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EmbeddingResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EmbeddingResponse, a, b2);
  }
  static $() {
    return ["EmbeddingResponse|1 embedding 1*"];
  }
};
var TakeNotesOnCommitDiffRequest = class _TakeNotesOnCommitDiffRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.commitHash = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TakeNotesOnCommitDiffRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TakeNotesOnCommitDiffRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TakeNotesOnCommitDiffRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TakeNotesOnCommitDiffRequest, a, b2);
  }
  static $() {
    return ["TakeNotesOnCommitDiffRequest|1 diff #0|2 commit_hash 9", CommitDiffString];
  }
};
var TakeNotesOnCommitDiffResponse = class _TakeNotesOnCommitDiffResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.notes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TakeNotesOnCommitDiffResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TakeNotesOnCommitDiffResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TakeNotesOnCommitDiffResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TakeNotesOnCommitDiffResponse, a, b2);
  }
  static $() {
    return ["TakeNotesOnCommitDiffResponse|1 notes #0*", CommitNoteWithEmbeddings];
  }
};
var IsCursorPredictionEnabledRequest = class _IsCursorPredictionEnabledRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsCursorPredictionEnabledRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsCursorPredictionEnabledRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsCursorPredictionEnabledRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsCursorPredictionEnabledRequest, a, b2);
  }
  static $() {
    return ["IsCursorPredictionEnabledRequest"];
  }
};
var IsCursorPredictionEnabledResponse = class _IsCursorPredictionEnabledResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsCursorPredictionEnabledResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsCursorPredictionEnabledResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsCursorPredictionEnabledResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsCursorPredictionEnabledResponse, a, b2);
  }
  static $() {
    return ["IsCursorPredictionEnabledResponse|1 enabled 8"];
  }
};
var StreamNextCursorPredictionRequest = class _StreamNextCursorPredictionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffHistory = [];
    this.contextItems = [];
    this.diffHistoryKeys = [];
    this.fileDiffHistories = [];
    this.mergedDiffHistories = [];
    this.blockDiffPatches = [];
    this.parameterHints = [];
    this.lspContexts = [];
    this.fileSyncUpdates = [];
    this.fileVisibleRanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamNextCursorPredictionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamNextCursorPredictionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamNextCursorPredictionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamNextCursorPredictionRequest, a, b2);
  }
  static $() {
    return ["StreamNextCursorPredictionRequest|1 current_file #0|2 diff_history 9*|3 model_name 9?|4 linter_errors #1?|13 context_items #2*|5 diff_history_keys 9*|6 give_debug_output 8?|7 file_diff_histories #3*|8 merged_diff_histories #3*|9 block_diff_patches #4*|10 is_nightly 8?|11 is_debug 8?|12 immediately_ack 8?|17 enable_more_context 8?|14 parameter_hints #5*|15 lsp_contexts #6*|16 cpp_intent_info #7?|18 workspace_id 9?|19 file_sync_updates #8*|20 file_visible_ranges #9*", CurrentFileInfo, LinterErrors, CppContextItem, CppFileDiffHistory, BlockDiffPatch, CppParameterHint, LspSubgraphFullContext, CppIntentInfo, FilesyncUpdateWithModelVersion, StreamNextCursorPredictionRequest_FileVisibleRange];
  }
};
var StreamNextCursorPredictionRequest_VisibleRange = class _StreamNextCursorPredictionRequest_VisibleRange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLineNumberInclusive = 0;
    this.endLineNumberExclusive = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamNextCursorPredictionRequest_VisibleRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamNextCursorPredictionRequest_VisibleRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamNextCursorPredictionRequest_VisibleRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamNextCursorPredictionRequest_VisibleRange, a, b2);
  }
  static $() {
    return ["StreamNextCursorPredictionRequest.VisibleRange|1 start_line_number_inclusive 5|2 end_line_number_exclusive 5"];
  }
};
var StreamNextCursorPredictionRequest_FileVisibleRange = class _StreamNextCursorPredictionRequest_FileVisibleRange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.filename = "";
    this.visibleRanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamNextCursorPredictionRequest_FileVisibleRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamNextCursorPredictionRequest_FileVisibleRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamNextCursorPredictionRequest_FileVisibleRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamNextCursorPredictionRequest_FileVisibleRange, a, b2);
  }
  static $() {
    return ["StreamNextCursorPredictionRequest.FileVisibleRange|1 filename 9|2 visible_ranges #0*", StreamNextCursorPredictionRequest_VisibleRange];
  }
};
var StreamNextCursorPredictionResponse = class _StreamNextCursorPredictionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamNextCursorPredictionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamNextCursorPredictionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamNextCursorPredictionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamNextCursorPredictionResponse, a, b2);
  }
  static $() {
    return ["StreamNextCursorPredictionResponse|1 text 9 response|2 line_number 5 response|3 is_not_in_range 8 response|4 file_name 9 response"];
  }
};
var StreamWebCmdKV1Request = class _StreamWebCmdKV1Request extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.fileContents = "";
    this.prompt = "";
    this.images = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamWebCmdKV1Request().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamWebCmdKV1Request().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamWebCmdKV1Request().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamWebCmdKV1Request, a, b2);
  }
  static $() {
    return ["StreamWebCmdKV1Request|1 relative_workspace_path 9|2 file_contents 9|3 prompt 9|4 selection_range #0|5 model_details #1|10 images #2*", LineRange, ModelDetails, ImageProto];
  }
};
var StreamWebCmdKV1Response = class _StreamWebCmdKV1Response extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamWebCmdKV1Response().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamWebCmdKV1Response().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamWebCmdKV1Response().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamWebCmdKV1Response, a, b2);
  }
  static $() {
    return ["StreamWebCmdKV1Response|1 cmd_k_response #0", StreamCmdKResponse];
  }
};
var ContextScoresRequest = class _ContextScoresRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sourceRange = "";
    this.methodSignatures = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextScoresRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextScoresRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextScoresRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextScoresRequest, a, b2);
  }
  static $() {
    return ["ContextScoresRequest|1 source_range 9|2 method_signatures 9*"];
  }
};
var ContextScoresResponse = class _ContextScoresResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.scores = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextScoresResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextScoresResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextScoresResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextScoresResponse, a, b2);
  }
  static $() {
    return ["ContextScoresResponse|1 scores 2*"];
  }
};
var ReportGenerationFeedbackRequest = class _ReportGenerationFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.feedbackType = ReportGenerationFeedbackRequest_FeedbackType.UNSPECIFIED;
    this.requestId = "";
    this.source = ReportGenerationFeedbackRequest_Source.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportGenerationFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportGenerationFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportGenerationFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportGenerationFeedbackRequest, a, b2);
  }
  static $() {
    return ["ReportGenerationFeedbackRequest|1 feedback_type #0|2 request_id 9|3 comment 9?|4 stars_overall 5?|6 stars_speed 5?|7 stars_accuracy 5?|8 stars_style_taste 5?|9 never_ask_again 8?|10 did_popup 8?|11 source #1", ReportGenerationFeedbackRequest_FeedbackType, ReportGenerationFeedbackRequest_Source];
  }
};
var ReportGenerationFeedbackRequest_FeedbackType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportGenerationFeedbackRequest.FeedbackType", [[0, "UNSPECIFIED"], [1, "THUMBS_UP"], [2, "THUMBS_DOWN"], [3, "NEUTRAL"], [4, "STARS"]], 1);
var ReportGenerationFeedbackRequest_Source = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportGenerationFeedbackRequest.Source", [[0, "UNSPECIFIED"], [1, "INLINE"], [2, "VIBEOMETER"]], 1);
var ReportGenerationFeedbackResponse = class _ReportGenerationFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportGenerationFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportGenerationFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportGenerationFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportGenerationFeedbackResponse, a, b2);
  }
  static $() {
    return ["ReportGenerationFeedbackResponse"];
  }
};
var ReportAgentFeedbackRequest = class _ReportAgentFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.sentiment = ReportAgentFeedbackRequest_Sentiment.UNSPECIFIED;
    this.categories = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAgentFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAgentFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAgentFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAgentFeedbackRequest, a, b2);
  }
  static $() {
    return ["ReportAgentFeedbackRequest|1 request_id 9|2 sentiment #0|3 categories 9*|4 comment 9?|5 canonical_model_name 9?|6 source #1?|7 variant #2?", ReportAgentFeedbackRequest_Sentiment, ReportAgentFeedbackRequest_Source, ReportAgentFeedbackRequest_Variant];
  }
};
var ReportAgentFeedbackRequest_Sentiment = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportAgentFeedbackRequest.Sentiment", [[0, "UNSPECIFIED"], [1, "UP"], [2, "DOWN"], [3, "RETRACTED"]], 1);
var ReportAgentFeedbackRequest_Source = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportAgentFeedbackRequest.Source", [[0, "UNSPECIFIED"], [1, "IDE"], [2, "GLASS"], [3, "SAND"]], 1);
var ReportAgentFeedbackRequest_Variant = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportAgentFeedbackRequest.Variant", [[0, "UNSPECIFIED"], [1, "PROMINENT"], [2, "INLINE"]], 1);
var ReportAgentFeedbackResponse = class _ReportAgentFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAgentFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAgentFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAgentFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAgentFeedbackResponse, a, b2);
  }
  static $() {
    return ["ReportAgentFeedbackResponse"];
  }
};
var ReportAgentMessageFeedbackRequest = class _ReportAgentMessageFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.bubbleId = "";
    this.selectedText = "";
    this.comment = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAgentMessageFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAgentMessageFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAgentMessageFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAgentMessageFeedbackRequest, a, b2);
  }
  static $() {
    return ["ReportAgentMessageFeedbackRequest|1 request_id 9|2 bubble_id 9|3 composer_id 9?|4 selected_text 9|5 selection_start 5?|6 selection_end 5?|7 comment 9|8 canonical_model_name 9?|9 category 9?|10 sentiment 9?"];
  }
};
var ReportAgentMessageFeedbackResponse = class _ReportAgentMessageFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.s3Uri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAgentMessageFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAgentMessageFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAgentMessageFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAgentMessageFeedbackResponse, a, b2);
  }
  static $() {
    return ["ReportAgentMessageFeedbackResponse|1 s3_uri 9"];
  }
};
var ReportAutoRoutingResultFeedbackRequest = class _ReportAutoRoutingResultFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.rating = "";
    this.source = "";
    this.displayedModelLabel = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAutoRoutingResultFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAutoRoutingResultFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAutoRoutingResultFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAutoRoutingResultFeedbackRequest, a, b2);
  }
  static $() {
    return ["ReportAutoRoutingResultFeedbackRequest|1 request_id 9|2 rating 9|3 source 9|4 displayed_model_label 9"];
  }
};
var ReportAutoRoutingResultFeedbackResponse = class _ReportAutoRoutingResultFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAutoRoutingResultFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAutoRoutingResultFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAutoRoutingResultFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAutoRoutingResultFeedbackResponse, a, b2);
  }
  static $() {
    return ["ReportAutoRoutingResultFeedbackResponse"];
  }
};
var ShowWelcomeScreenRequest = class _ShowWelcomeScreenRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShowWelcomeScreenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShowWelcomeScreenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShowWelcomeScreenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShowWelcomeScreenRequest, a, b2);
  }
  static $() {
    return ["ShowWelcomeScreenRequest"];
  }
};
var ShowWelcomeScreenResponse = class _ShowWelcomeScreenResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.enableCards = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShowWelcomeScreenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShowWelcomeScreenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShowWelcomeScreenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShowWelcomeScreenResponse, a, b2);
  }
  static $() {
    return ["ShowWelcomeScreenResponse|1 enable_cards 9*"];
  }
};
var AiProjectRequest = class _AiProjectRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AiProjectRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AiProjectRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AiProjectRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AiProjectRequest, a, b2);
  }
  static $() {
    return ["AiProjectRequest|1 description 9|2 model_details #0", ModelDetails];
  }
};
var AiProjectResponse = class _AiProjectResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AiProjectResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AiProjectResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AiProjectResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AiProjectResponse, a, b2);
  }
  static $() {
    return ["AiProjectResponse|1 text 9"];
  }
};
var ToCamelCaseRequest = class _ToCamelCaseRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ToCamelCaseRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ToCamelCaseRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ToCamelCaseRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ToCamelCaseRequest, a, b2);
  }
  static $() {
    return ["ToCamelCaseRequest|1 text 9"];
  }
};
var ToCamelCaseResponse = class _ToCamelCaseResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ToCamelCaseResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ToCamelCaseResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ToCamelCaseResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ToCamelCaseResponse, a, b2);
  }
  static $() {
    return ["ToCamelCaseResponse|1 text 9"];
  }
};
var StreamPriomptPromptRequest = class _StreamPriomptPromptRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.promptProps = "";
    this.promptPropsTypeName = "";
    this.skipLoginCheck = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPriomptPromptRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPriomptPromptRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPriomptPromptRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPriomptPromptRequest, a, b2);
  }
  static $() {
    return ["StreamPriomptPromptRequest|2 prompt_props 9|3 prompt_props_type_name 9|5 skip_login_check 8|4 model_details #0", ModelDetails];
  }
};
var StreamPriomptPromptResponse = class _StreamPriomptPromptResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPriomptPromptResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPriomptPromptResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPriomptPromptResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPriomptPromptResponse, a, b2);
  }
  static $() {
    return ["StreamPriomptPromptResponse|1 text 9"];
  }
};
var CheckFeatureStatusRequest = class _CheckFeatureStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.featureName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckFeatureStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckFeatureStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckFeatureStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckFeatureStatusRequest, a, b2);
  }
  static $() {
    return ["CheckFeatureStatusRequest|1 feature_name 9"];
  }
};
var CheckFeaturesStatusRequest = class _CheckFeaturesStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.featureNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckFeaturesStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckFeaturesStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckFeaturesStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckFeaturesStatusRequest, a, b2);
  }
  static $() {
    return ["CheckFeaturesStatusRequest|1 feature_names 9*"];
  }
};
var CheckFeaturesStatusResponse = class _CheckFeaturesStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.featureStatuses = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckFeaturesStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckFeaturesStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckFeaturesStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckFeaturesStatusResponse, a, b2);
  }
  static $() {
    return ["CheckFeaturesStatusResponse|1 feature_statuses #0*", CheckFeaturesStatusResponse_FeatureStatus];
  }
};
var CheckFeaturesStatusResponse_FeatureStatus = class _CheckFeaturesStatusResponse_FeatureStatus extends __protoMessage3124 {
  constructor(data) {
    super();
    this.featureName = "";
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckFeaturesStatusResponse_FeatureStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckFeaturesStatusResponse_FeatureStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckFeaturesStatusResponse_FeatureStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckFeaturesStatusResponse_FeatureStatus, a, b2);
  }
  static $() {
    return ["CheckFeaturesStatusResponse.FeatureStatus|1 feature_name 9|2 enabled 8"];
  }
};
var GetEffectiveTokenLimitRequest = class _GetEffectiveTokenLimitRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEffectiveTokenLimitRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEffectiveTokenLimitRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEffectiveTokenLimitRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEffectiveTokenLimitRequest, a, b2);
  }
  static $() {
    return ["GetEffectiveTokenLimitRequest|1 model_details #0", ModelDetails];
  }
};
var GetEffectiveTokenLimitResponse = class _GetEffectiveTokenLimitResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.tokenLimit = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEffectiveTokenLimitResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEffectiveTokenLimitResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEffectiveTokenLimitResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEffectiveTokenLimitResponse, a, b2);
  }
  static $() {
    return ["GetEffectiveTokenLimitResponse|1 token_limit 5"];
  }
};
var CheckFeatureStatusResponse = class _CheckFeatureStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckFeatureStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckFeatureStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckFeatureStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckFeatureStatusResponse, a, b2);
  }
  static $() {
    return ["CheckFeatureStatusResponse|1 enabled 8"];
  }
};
var CheckNumberConfigRequest = class _CheckNumberConfigRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.key = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckNumberConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckNumberConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckNumberConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckNumberConfigRequest, a, b2);
  }
  static $() {
    return ["CheckNumberConfigRequest|1 key 9"];
  }
};
var CheckNumberConfigResponse = class _CheckNumberConfigResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.value = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckNumberConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckNumberConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckNumberConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckNumberConfigResponse, a, b2);
  }
  static $() {
    return ["CheckNumberConfigResponse|1 value 5"];
  }
};
var CheckNumberConfigsRequest = class _CheckNumberConfigsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.configNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckNumberConfigsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckNumberConfigsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckNumberConfigsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckNumberConfigsRequest, a, b2);
  }
  static $() {
    return ["CheckNumberConfigsRequest|1 config_names 9*"];
  }
};
var CheckNumberConfigsResponse = class _CheckNumberConfigsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.configs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckNumberConfigsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckNumberConfigsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckNumberConfigsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckNumberConfigsResponse, a, b2);
  }
  static $() {
    return ["CheckNumberConfigsResponse|1 configs #0*", CheckNumberConfigsResponse_Config];
  }
};
var CheckNumberConfigsResponse_Config = class _CheckNumberConfigsResponse_Config extends __protoMessage3124 {
  constructor(data) {
    super();
    this.configName = "";
    this.value = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckNumberConfigsResponse_Config().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckNumberConfigsResponse_Config().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckNumberConfigsResponse_Config().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckNumberConfigsResponse_Config, a, b2);
  }
  static $() {
    return ["CheckNumberConfigsResponse.Config|1 config_name 9|2 value 5"];
  }
};
var IntentPredictionRequest = class _IntentPredictionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.messages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IntentPredictionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IntentPredictionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IntentPredictionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IntentPredictionRequest, a, b2);
  }
  static $() {
    return ["IntentPredictionRequest|1 messages #0*|2 context_options #1|3 model_details #2", ConversationMessage, ContextOptions, ModelDetails];
  }
};
var IntentPredictionResponse = class _IntentPredictionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.useGlobalContext = false;
    this.useWithFolderContext = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IntentPredictionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IntentPredictionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IntentPredictionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IntentPredictionResponse, a, b2);
  }
  static $() {
    return ["IntentPredictionResponse|1 chosen_documentation #0|2 chosen_file_contents #1|3 chosen_linter_diagnostics #2|4 use_global_context 8|5 use_with_folder_context 8", IntentPredictionResponse_ChosenDocumentation, IntentPredictionResponse_ChosenFileContents, IntentPredictionResponse_ChosenLinterDiagnostics];
  }
};
var IntentPredictionResponse_ChosenDocumentation = class _IntentPredictionResponse_ChosenDocumentation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.docIndices = [];
    this.docIdentifiers = [];
    this.docNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IntentPredictionResponse_ChosenDocumentation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IntentPredictionResponse_ChosenDocumentation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IntentPredictionResponse_ChosenDocumentation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IntentPredictionResponse_ChosenDocumentation, a, b2);
  }
  static $() {
    return ["IntentPredictionResponse.ChosenDocumentation|1 doc_indices 5*|2 doc_identifiers 9*|3 doc_names 9*"];
  }
};
var IntentPredictionResponse_ChosenFileContents = class _IntentPredictionResponse_ChosenFileContents extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IntentPredictionResponse_ChosenFileContents().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IntentPredictionResponse_ChosenFileContents().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IntentPredictionResponse_ChosenFileContents().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IntentPredictionResponse_ChosenFileContents, a, b2);
  }
  static $() {
    return ["IntentPredictionResponse.ChosenFileContents"];
  }
};
var IntentPredictionResponse_ChosenLinterDiagnostics = class _IntentPredictionResponse_ChosenLinterDiagnostics extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diagnosticIndices = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IntentPredictionResponse_ChosenLinterDiagnostics().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IntentPredictionResponse_ChosenLinterDiagnostics().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IntentPredictionResponse_ChosenLinterDiagnostics().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IntentPredictionResponse_ChosenLinterDiagnostics, a, b2);
  }
  static $() {
    return ["IntentPredictionResponse.ChosenLinterDiagnostics|1 diagnostic_indices 5*"];
  }
};
var ContextOptions = class _ContextOptions extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions, a, b2);
  }
  static $() {
    return ["ContextOptions|1 all_documentation #0|2 current_file_contents #1|3 linter_diagnostics #2|4 global_context #3", ContextOptions_AllDocumentation, ContextOptions_CurrentFileContents, ContextOptions_LinterDiagnostics, ContextOptions_GlobalContext];
  }
};
var ContextOptions_AllDocumentation = class _ContextOptions_AllDocumentation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.availableDocs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_AllDocumentation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_AllDocumentation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_AllDocumentation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_AllDocumentation, a, b2);
  }
  static $() {
    return ["ContextOptions.AllDocumentation|1 available_docs #0*", ContextOptions_AllDocumentation_Documentation];
  }
};
var ContextOptions_AllDocumentation_Documentation = class _ContextOptions_AllDocumentation_Documentation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.url = "";
    this.identifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_AllDocumentation_Documentation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_AllDocumentation_Documentation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_AllDocumentation_Documentation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_AllDocumentation_Documentation, a, b2);
  }
  static $() {
    return ["ContextOptions.AllDocumentation.Documentation|1 name 9|2 url 9|3 identifier 9"];
  }
};
var ContextOptions_CurrentFileContents = class _ContextOptions_CurrentFileContents extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.dataframes = [];
    this.languageId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_CurrentFileContents().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_CurrentFileContents().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_CurrentFileContents().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_CurrentFileContents, a, b2);
  }
  static $() {
    return ["ContextOptions.CurrentFileContents|1 relative_workspace_path 9|2 contents 9|3 cursor_position #0|4 dataframes #1*|5 language_id 9|6 selection #2", CursorPosition, DataframeInfo, CursorRange];
  }
};
var ContextOptions_LinterDiagnostics = class _ContextOptions_LinterDiagnostics extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.diagnostics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_LinterDiagnostics().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_LinterDiagnostics().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_LinterDiagnostics().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_LinterDiagnostics, a, b2);
  }
  static $() {
    return ["ContextOptions.LinterDiagnostics|1 relative_workspace_path 9|2 contents 9|3 diagnostics #0*", ContextOptions_LinterDiagnostics_Diagnostic];
  }
};
var ContextOptions_LinterDiagnostics_Diagnostic = class _ContextOptions_LinterDiagnostics_Diagnostic extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.source = "";
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_LinterDiagnostics_Diagnostic().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_LinterDiagnostics_Diagnostic().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_LinterDiagnostics_Diagnostic().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_LinterDiagnostics_Diagnostic, a, b2);
  }
  static $() {
    return ["ContextOptions.LinterDiagnostics.Diagnostic|1 message 9|2 source 9|3 range #0|4 relative_workspace_path 9", CursorRange];
  }
};
var ContextOptions_GlobalContext = class _ContextOptions_GlobalContext extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextOptions_GlobalContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextOptions_GlobalContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextOptions_GlobalContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextOptions_GlobalContext, a, b2);
  }
  static $() {
    return ["ContextOptions.GlobalContext"];
  }
};
var StreamCursorTutorRequest = class _StreamCursorTutorRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCursorTutorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCursorTutorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCursorTutorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCursorTutorRequest, a, b2);
  }
  static $() {
    return ["StreamCursorTutorRequest|1 conversation #0*|2 model_details #1", ConversationMessage, ModelDetails];
  }
};
var StreamCursorTutorResponse = class _StreamCursorTutorResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCursorTutorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCursorTutorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCursorTutorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCursorTutorResponse, a, b2);
  }
  static $() {
    return ["StreamCursorTutorResponse|1 text 9"];
  }
};
var ModelQueryRequest = class _ModelQueryRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.codeBlocks = [];
    this.queryType = ModelQueryRequest_QueryType.UNSPECIFIED;
    this.fasterAndStupider = false;
    this.useGlobs = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelQueryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelQueryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelQueryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelQueryRequest, a, b2);
  }
  static $() {
    return ["ModelQueryRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 code_blocks #4*|7 model_details #5|8 query_type #6|9 repository_info #2|10 faster_and_stupider 8|11 use_globs 8", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, ModelQueryRequest_QueryType];
  }
};
var ModelQueryRequest_QueryType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ModelQueryRequest.QueryType", [[0, "UNSPECIFIED"], [1, "KEYWORDS"], [2, "EMBEDDINGS"]], 1);
var ModelQueryResponse = class _ModelQueryResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.queries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelQueryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelQueryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelQueryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelQueryResponse, a, b2);
  }
  static $() {
    return ["ModelQueryResponse|1 queries #0*", ModelQueryResponse_Query];
  }
};
var ModelQueryResponse_Query = class _ModelQueryResponse_Query extends __protoMessage3124 {
  constructor(data) {
    super();
    this.query = "";
    this.successfulParse = false;
    this.goodFileExtensions = [];
    this.badFileExtensions = [];
    this.goodPaths = [];
    this.badPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelQueryResponse_Query().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelQueryResponse_Query().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelQueryResponse_Query().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelQueryResponse_Query, a, b2);
  }
  static $() {
    return ["ModelQueryResponse.Query|1 query 9|2 successful_parse 8|3 good_file_extensions 9*|4 bad_file_extensions 9*|5 good_paths 9*|6 bad_paths 9*"];
  }
};
var ModelQueryResponseV2 = class _ModelQueryResponseV2 extends __protoMessage3124 {
  constructor(data) {
    super();
    this.queryOrReasoning = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelQueryResponseV2().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelQueryResponseV2().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelQueryResponseV2().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelQueryResponseV2, a, b2);
  }
  static $() {
    return ["ModelQueryResponseV2|1 query #0 query_or_reasoning|2 reasoning 9 query_or_reasoning", ModelQueryResponseV2_QueryItem];
  }
};
var ModelQueryResponseV2_QueryItem = class _ModelQueryResponseV2_QueryItem extends __protoMessage3124 {
  constructor(data) {
    super();
    this.partialQuery = { case: void 0 };
    this.index = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelQueryResponseV2_QueryItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelQueryResponseV2_QueryItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelQueryResponseV2_QueryItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelQueryResponseV2_QueryItem, a, b2);
  }
  static $() {
    return ["ModelQueryResponseV2.QueryItem|1 text 9 partial_query|2 glob 9 partial_query|3 index 5"];
  }
};
var ApiDetails = class _ApiDetails extends __protoMessage3124 {
  constructor(data) {
    super();
    this.apiKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ApiDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ApiDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ApiDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ApiDetails, a, b2);
  }
  static $() {
    return ["ApiDetails|1 api_key 9|2 enable_ghost_mode 8?"];
  }
};
var FullFileSearchResult = class _FullFileSearchResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FullFileSearchResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FullFileSearchResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FullFileSearchResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FullFileSearchResult, a, b2);
  }
  static $() {
    return ["FullFileSearchResult|1 results #0*", FileResult];
  }
};
var CodeSearchResult = class _CodeSearchResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.results = [];
    this.allFiles = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeSearchResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeSearchResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeSearchResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeSearchResult, a, b2);
  }
  static $() {
    return ["CodeSearchResult|1 results #0*|2 all_files #1*", CodeResult, File2];
  }
};
var RerankerRequest = class _RerankerRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.codeResults = [];
    this.query = "";
    this.numBlocks = 0;
    this.conversation = [];
    this.contextResults = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RerankerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RerankerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RerankerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RerankerRequest, a, b2);
  }
  static $() {
    return ["RerankerRequest|1 code_results #0*|2 query 9|3 num_blocks 5|4 current_file #1|5 conversation #2*|6 api_details #3|7 file_search_results #4 context_results|8 code_search_results #5 context_results", CodeResult, CurrentFileInfo, ConversationMessage, ApiDetails, FullFileSearchResult, CodeSearchResult];
  }
};
var RerankerResponse = class _RerankerResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RerankerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RerankerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RerankerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RerankerResponse, a, b2);
  }
  static $() {
    return ["RerankerResponse|1 results #0*", CodeResult];
  }
};
var GenerateTldrRequest = class _GenerateTldrRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GenerateTldrRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GenerateTldrRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GenerateTldrRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GenerateTldrRequest, a, b2);
  }
  static $() {
    return ["GenerateTldrRequest|1 text 9"];
  }
};
var GenerateTldrResponse = class _GenerateTldrResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.summary = "";
    this.all = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GenerateTldrResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GenerateTldrResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GenerateTldrResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GenerateTldrResponse, a, b2);
  }
  static $() {
    return ["GenerateTldrResponse|1 summary 9|2 all 9"];
  }
};
var TaskStreamChatContextRequest = class _TaskStreamChatContextRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.requestId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextRequest, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 code_blocks #4*|7 model_details #5|8 documentation_identifiers 9*|14 linter_errors #6|15 advanced_codebase_context #7|16 is_eval 8?|17 request_id 9|18 desired_token_limit 5?", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, LinterErrors, AdvancedCodebaseContextOptions];
  }
};
var AdvancedCodebaseContextOptions = class _AdvancedCodebaseContextOptions extends __protoMessage3124 {
  constructor(data) {
    super();
    this.numResultsPerSearch = 0;
    this.reranker = RerankerAlgorithm.UNSPECIFIED;
    this.reasoningStep = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdvancedCodebaseContextOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdvancedCodebaseContextOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdvancedCodebaseContextOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdvancedCodebaseContextOptions, a, b2);
  }
  static $() {
    return ["AdvancedCodebaseContextOptions|1 num_results_per_search 5|2 include_pattern 9?|3 exclude_pattern 9?|4 reranker #0|5 index_id 9?|6 reasoning_step 8|7 rechunker #1?", RerankerAlgorithm, RechunkerChoice];
  }
};
var TaskStreamChatContextResponse = class _TaskStreamChatContextResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse|1 output #0 response|2 gathering_step #1 response|3 gathering_file #2 response|4 reranking_step #3 response|5 reranking_file #4 response|6 reasoning_step #5 response|7 reasoning_substep #6 response", TaskStreamChatContextResponse_Output, TaskStreamChatContextResponse_GatheringStep, TaskStreamChatContextResponse_GatheringFile, TaskStreamChatContextResponse_RerankingStep, TaskStreamChatContextResponse_RerankingFile, TaskStreamChatContextResponse_ReasoningStep, TaskStreamChatContextResponse_ReasoningSubstep];
  }
};
var TaskStreamChatContextResponse_Output = class _TaskStreamChatContextResponse_Output extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_Output().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_Output().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_Output().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_Output, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.Output|1 text 9"];
  }
};
var TaskStreamChatContextResponse_GatheringFile = class _TaskStreamChatContextResponse_GatheringFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.stepIndex = 0;
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_GatheringFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_GatheringFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_GatheringFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_GatheringFile, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.GatheringFile|1 relative_workspace_path 9|2 range #0|3 step_index 5|4 score 2", SimpleRange];
  }
};
var TaskStreamChatContextResponse_GatheringStep = class _TaskStreamChatContextResponse_GatheringStep extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.index = 0;
    this.query = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_GatheringStep().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_GatheringStep().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_GatheringStep().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_GatheringStep, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.GatheringStep|1 title 9|2 index 5|3 query 9"];
  }
};
var TaskStreamChatContextResponse_RerankingStep = class _TaskStreamChatContextResponse_RerankingStep extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.index = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_RerankingStep().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_RerankingStep().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_RerankingStep().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_RerankingStep, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.RerankingStep|1 title 9|2 index 5"];
  }
};
var TaskStreamChatContextResponse_RerankingFile = class _TaskStreamChatContextResponse_RerankingFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.reason = "";
    this.failed = false;
    this.score = 0;
    this.stepIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_RerankingFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_RerankingFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_RerankingFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_RerankingFile, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.RerankingFile|1 relative_workspace_path 9|2 range #0|3 reason 9|4 failed 8|5 score 2|6 step_index 5", SimpleRange];
  }
};
var TaskStreamChatContextResponse_ReasoningStep = class _TaskStreamChatContextResponse_ReasoningStep extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.index = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_ReasoningStep().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_ReasoningStep().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_ReasoningStep().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_ReasoningStep, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.ReasoningStep|1 title 9|2 index 5"];
  }
};
var TaskStreamChatContextResponse_ReasoningSubstep = class _TaskStreamChatContextResponse_ReasoningSubstep extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markdownExplanation = "";
    this.stepIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponse_ReasoningSubstep().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponse_ReasoningSubstep().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponse_ReasoningSubstep().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponse_ReasoningSubstep, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponse.ReasoningSubstep|1 markdown_explanation 9|2 step_index 5"];
  }
};
var TaskStreamChatContextResponseWrapped = class _TaskStreamChatContextResponseWrapped extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamChatContextResponseWrapped().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamChatContextResponseWrapped().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamChatContextResponseWrapped().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamChatContextResponseWrapped, a, b2);
  }
  static $() {
    return ["TaskStreamChatContextResponseWrapped|1 real_response #0 response|2 background_task_uuid 9 response", TaskStreamChatContextResponse];
  }
};
var StreamChatContextRequest = class _StreamChatContextRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.query = "";
    this.rerankResults = false;
    this.contextResults = { case: void 0 };
    this.rerankResultsV2 = false;
    this.conversationId = "";
    this.canHandleFilenamesAfterLanguageIds = false;
    this.longContextMode = false;
    this.isEval = false;
    this.requestId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextRequest, a, b2);
  }
  static $() {
    return ["StreamChatContextRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 code_blocks #4*|7 model_details #5|8 documentation_identifiers 9*|9 query 9|10 code_context #6|11 rerank_results 8|12 file_search_results #7 context_results|13 code_search_results #8 context_results|14 linter_errors #9|15 is_bash 8?|16 rerank_results_v2 8|17 conversation_id 9|18 can_handle_filenames_after_language_ids 8|19 long_context_mode 8|20 is_eval 8|21 request_id 9|22 desired_max_tokens 5?|23 runnable_code_blocks 8?", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, StreamChatContextRequest_CodeContext, FullFileSearchResult, CodeSearchResult, LinterErrors];
  }
};
var StreamChatContextRequest_CodeContext = class _StreamChatContextRequest_CodeContext extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chunks = [];
    this.scoredChunks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextRequest_CodeContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextRequest_CodeContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextRequest_CodeContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextRequest_CodeContext, a, b2);
  }
  static $() {
    return ["StreamChatContextRequest.CodeContext|1 chunks #0*|2 scored_chunks #1*", CodeBlock, CodeResult];
  }
};
var StreamChatContextResponse = class _StreamChatContextResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextResponse, a, b2);
  }
  static $() {
    return ["StreamChatContextResponse|1 text 9|2 debugging_only_chat_prompt 9?|3 debugging_only_token_count 5?|4 document_citation #0|5 filled_prompt 9?|6 used_code #1|7 code_link #2|8 chunk_identity #3?|9 docs_reference #4?|10 symbol_link #5?|11 file_link #6?", DocumentationCitation, StreamChatContextResponse_UsedCode, StreamChatContextResponse_CodeLink, StreamChatContextResponse_ChunkIdentity, DocsReference, SymbolLink, FileLink];
  }
};
var StreamChatContextResponse_UsedCode = class _StreamChatContextResponse_UsedCode extends __protoMessage3124 {
  constructor(data) {
    super();
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextResponse_UsedCode().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextResponse_UsedCode().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextResponse_UsedCode().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextResponse_UsedCode, a, b2);
  }
  static $() {
    return ["StreamChatContextResponse.UsedCode|1 code_results #0*", CodeResult];
  }
};
var StreamChatContextResponse_CodeLink = class _StreamChatContextResponse_CodeLink extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLineNumber = 0;
    this.endLineNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextResponse_CodeLink().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextResponse_CodeLink().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextResponse_CodeLink().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextResponse_CodeLink, a, b2);
  }
  static $() {
    return ["StreamChatContextResponse.CodeLink|1 relative_workspace_path 9|2 start_line_number 5|3 end_line_number 5"];
  }
};
var StreamChatContextResponse_ChunkIdentity = class _StreamChatContextResponse_ChunkIdentity extends __protoMessage3124 {
  constructor(data) {
    super();
    this.fileName = "";
    this.startLine = 0;
    this.endLine = 0;
    this.text = "";
    this.chunkType = ChunkType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatContextResponse_ChunkIdentity().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatContextResponse_ChunkIdentity().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatContextResponse_ChunkIdentity().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatContextResponse_ChunkIdentity, a, b2);
  }
  static $() {
    return ["StreamChatContextResponse.ChunkIdentity|1 file_name 9|2 start_line 5|3 end_line 5|4 text 9|5 chunk_type #0", ChunkType];
  }
};
var StreamChatDeepContextRequest = class _StreamChatDeepContextRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.rerankResults = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatDeepContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatDeepContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatDeepContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatDeepContextRequest, a, b2);
  }
  static $() {
    return ["StreamChatDeepContextRequest|1 conversation #0*|2 explicit_context #1|3 model_details #2|4 context_results #3|5 rerank_results 8", ConversationMessage, ExplicitContext, ModelDetails, SearchRepositoryDeepContextResponse];
  }
};
var StreamChatDeepContextResponse = class _StreamChatDeepContextResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatDeepContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatDeepContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatDeepContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatDeepContextResponse, a, b2);
  }
  static $() {
    return ["StreamChatDeepContextResponse|1 text 9"];
  }
};
var DocumentationInfo = class _DocumentationInfo extends __protoMessage3124 {
  constructor(data) {
    super();
    this.docIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DocumentationInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DocumentationInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DocumentationInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DocumentationInfo, a, b2);
  }
  static $() {
    return ["DocumentationInfo|1 doc_identifier 9|2 metadata #0", DocumentationMetadata];
  }
};
var AvailableDocsRequest = class _AvailableDocsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.partialDoc = { case: void 0 };
    this.additionalDocIdentifiers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableDocsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableDocsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableDocsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableDocsRequest, a, b2);
  }
  static $() {
    return ["AvailableDocsRequest|1 partial_url 9 partial_doc|2 partial_doc_name 9 partial_doc|3 get_all 8 partial_doc|4 additional_doc_identifiers 9*"];
  }
};
var AvailableDocsResponse = class _AvailableDocsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.docs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableDocsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableDocsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableDocsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableDocsResponse, a, b2);
  }
  static $() {
    return ["AvailableDocsResponse|1 docs #0*", DocumentationInfo];
  }
};
var RunWebSearchRequest = class _RunWebSearchRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.searchTerm = "";
    this.modelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebSearchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebSearchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebSearchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebSearchRequest, a, b2);
  }
  static $() {
    return ["RunWebSearchRequest|1 search_term 9|2 explanation 9?|3 model_id 9"];
  }
};
var WebSearchDocument = class _WebSearchDocument extends __protoMessage3124 {
  constructor(data) {
    super();
    this.url = "";
    this.title = "";
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WebSearchDocument().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WebSearchDocument().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WebSearchDocument().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WebSearchDocument, a, b2);
  }
  static $() {
    return ["WebSearchDocument|1 url 9|2 title 9|3 text 9"];
  }
};
var RunWebSearchResponse = class _RunWebSearchResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.documents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebSearchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebSearchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebSearchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebSearchResponse, a, b2);
  }
  static $() {
    return ["RunWebSearchResponse|1 answer 9?|2 documents #0*", WebSearchDocument];
  }
};
var RunWebFetchRequest = class _RunWebFetchRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebFetchRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebFetchRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebFetchRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebFetchRequest, a, b2);
  }
  static $() {
    return ["RunWebFetchRequest|1 url 9"];
  }
};
var RunWebFetchSuccess = class _RunWebFetchSuccess extends __protoMessage3124 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebFetchSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebFetchSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebFetchSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebFetchSuccess, a, b2);
  }
  static $() {
    return ["RunWebFetchSuccess|1 content 9"];
  }
};
var RunWebFetchError = class _RunWebFetchError extends __protoMessage3124 {
  constructor(data) {
    super();
    this.error = "";
    this.isTimeout = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebFetchError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebFetchError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebFetchError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebFetchError, a, b2);
  }
  static $() {
    return ["RunWebFetchError|1 error 9|2 is_timeout 8"];
  }
};
var RunWebFetchResponse = class _RunWebFetchResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunWebFetchResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunWebFetchResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunWebFetchResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunWebFetchResponse, a, b2);
  }
  static $() {
    return ["RunWebFetchResponse|1 success #0 result|2 error #1 result", RunWebFetchSuccess, RunWebFetchError];
  }
};
var GenerateImageReferenceImage = class _GenerateImageReferenceImage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.data = "";
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GenerateImageReferenceImage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GenerateImageReferenceImage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GenerateImageReferenceImage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GenerateImageReferenceImage, a, b2);
  }
  static $() {
    return ["GenerateImageReferenceImage|1 data 9|2 mime_type 9"];
  }
};
var RunGenerateImageRequest = class _RunGenerateImageRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.description = "";
    this.referenceImages = [];
    this.modelId = "";
    this.maxMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunGenerateImageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunGenerateImageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunGenerateImageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunGenerateImageRequest, a, b2);
  }
  static $() {
    return ["RunGenerateImageRequest|1 description 9|2 reference_images #0*|3 model_id 9|4 max_mode 8|5 aspect_ratio 9?", GenerateImageReferenceImage];
  }
};
var RunGenerateImageSuccess = class _RunGenerateImageSuccess extends __protoMessage3124 {
  constructor(data) {
    super();
    this.imageData = "";
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunGenerateImageSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunGenerateImageSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunGenerateImageSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunGenerateImageSuccess, a, b2);
  }
  static $() {
    return ["RunGenerateImageSuccess|1 image_data 9|2 mime_type 9"];
  }
};
var RunGenerateImageError = class _RunGenerateImageError extends __protoMessage3124 {
  constructor(data) {
    super();
    this.error = "";
    this.modelRestricted = false;
    this.contentSafetyBlocked = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunGenerateImageError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunGenerateImageError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunGenerateImageError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunGenerateImageError, a, b2);
  }
  static $() {
    return ["RunGenerateImageError|1 error 9|2 model_restricted 8|3 provider_status_code 5?|4 content_safety_blocked 8"];
  }
};
var RunGenerateImageResponse = class _RunGenerateImageResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunGenerateImageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunGenerateImageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunGenerateImageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunGenerateImageResponse, a, b2);
  }
  static $() {
    return ["RunGenerateImageResponse|1 success #0 result|2 error #1 result", RunGenerateImageSuccess, RunGenerateImageError];
  }
};
var RunDescribeImageRequest = class _RunDescribeImageRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.imageData = "";
    this.mimeType = "";
    this.contextText = "";
    this.modelId = "";
    this.maxMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunDescribeImageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunDescribeImageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunDescribeImageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunDescribeImageRequest, a, b2);
  }
  static $() {
    return ["RunDescribeImageRequest|1 image_data 9|2 mime_type 9|3 context_text 9|4 model_id 9|5 max_mode 8"];
  }
};
var RunDescribeImageResponse = class _RunDescribeImageResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.applicable = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RunDescribeImageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RunDescribeImageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RunDescribeImageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RunDescribeImageResponse, a, b2);
  }
  static $() {
    return ["RunDescribeImageResponse|1 applicable 8|2 description 9?"];
  }
};
var DetectShellHangRequest = class _DetectShellHangRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.command = "";
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DetectShellHangRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DetectShellHangRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DetectShellHangRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DetectShellHangRequest, a, b2);
  }
  static $() {
    return ["DetectShellHangRequest|1 command 9|2 output 9"];
  }
};
var DetectShellHangResponse = class _DetectShellHangResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.hanging = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DetectShellHangResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DetectShellHangResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DetectShellHangResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DetectShellHangResponse, a, b2);
  }
  static $() {
    return ["DetectShellHangResponse|1 hanging 8"];
  }
};
var ThrowErrorCheckRequest = class _ThrowErrorCheckRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.error = ErrorDetails_Error.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ThrowErrorCheckRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ThrowErrorCheckRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ThrowErrorCheckRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ThrowErrorCheckRequest, a, b2);
  }
  static $() {
    return ["ThrowErrorCheckRequest|1 error #0", ErrorDetails_Error];
  }
};
var ThrowErrorCheckResponse = class _ThrowErrorCheckResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ThrowErrorCheckResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ThrowErrorCheckResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ThrowErrorCheckResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ThrowErrorCheckResponse, a, b2);
  }
  static $() {
    return ["ThrowErrorCheckResponse"];
  }
};
var AvailableModelsRequest = class _AvailableModelsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.isNightly = false;
    this.includeLongContextModels = false;
    this.excludeMaxNamedModels = false;
    this.additionalModelNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsRequest, a, b2);
  }
  static $() {
    return ["AvailableModelsRequest|1 is_nightly 8|2 include_long_context_models 8|3 exclude_max_named_models 8|4 additional_model_names 9*|5 use_model_parameters 8?|6 include_hidden_models 8?|7 do_not_use_markdown 8?|8 variants_will_be_shown_in_exploded_list 8?|9 for_automations 8?|10 scope #0?|14 byok_enabled 8?|11 use_react_model_picker 8?|12 use_cloud_agent_effort_modes 8?|15 use_parameterized_automations_models 8?|13 admin_settings_group_public_id 9?|16 expected_scope #1|17 client_llm_gateway_credential #2?|18 refresh_llm_gateway_models 8?", AvailableModelsScope, CloudAgentRequestScope, ClientLlmGatewayCredential];
  }
};
var AvailableModelsResponse = class _AvailableModelsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.models = [];
    this.modelNames = [];
    this.subagentModelConfigs = {};
    this.useModelParameters = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse|2 models #0*|1 model_names 9*|4 composer_model_config #1?|5 cmd_k_model_config #1?|6 background_composer_model_config #1?|7 plan_execution_model_config #1?|8 spec_model_config #1?|9 deep_search_model_config #1?|10 quick_agent_model_config #1?|16 subagent_model_configs 9,#1|11 use_model_parameters 8|12 disable_unused_models_after_n_hours 5?|13 upgrade_unchanged_models_after_n_hours 5?|15 display_configuration #2|19 experimental_model_id 9?|20 experimental_model_display_name 9?|21 nudge_new_chats_to_auto_optimize_for 9?", AvailableModelsResponse_AvailableModel, AvailableModelsResponse_FeatureModelConfig, AvailableModelsResponse_ModelPickerDisplayConfiguration];
  }
};
var AvailableModelsResponse_DegradationStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "AvailableModelsResponse.DegradationStatus", [[0, "UNSPECIFIED"], [1, "DEGRADED"], [2, "DISABLED"]], 1);
var AvailableModelsResponse_ModelVendorId = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "AvailableModelsResponse.ModelVendorId", [[0, "UNSPECIFIED"], [1, "ANTHROPIC"], [2, "OPENAI"], [3, "GOOGLE"], [4, "XAI"], [5, "MOONSHOT"], [6, "CURSOR"], [7, "NVIDIA"], [8, "ZAI"], [9, "META"], [10, "DEEPSEEK"]], 1);
var AvailableModelsResponse_TooltipData = class _AvailableModelsResponse_TooltipData extends __protoMessage3124 {
  constructor(data) {
    super();
    this.primaryText = "";
    this.secondaryText = "";
    this.secondaryWarningText = false;
    this.icon = "";
    this.tertiaryText = "";
    this.tertiaryTextUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_TooltipData().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_TooltipData().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_TooltipData().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_TooltipData, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.TooltipData|1 primary_text 9|2 secondary_text 9|3 secondary_warning_text 8|4 icon 9|5 tertiary_text 9|6 tertiary_text_url 9|7 markdown_content 9?"];
  }
};
var AvailableModelsResponse_ModelVendor = class _AvailableModelsResponse_ModelVendor extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = AvailableModelsResponse_ModelVendorId.UNSPECIFIED;
    this.displayName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelVendor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelVendor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelVendor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelVendor, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelVendor|1 id #0|2 display_name 9", AvailableModelsResponse_ModelVendorId];
  }
};
var AvailableModelsResponse_ModelPickerBadge = class _AvailableModelsResponse_ModelPickerBadge extends __protoMessage3124 {
  constructor(data) {
    super();
    this.label = "";
    this.variant = AvailableModelsResponse_ModelPickerBadge_Variant.UNSPECIFIED;
    this.dismissOnSelection = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerBadge().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerBadge().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerBadge().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerBadge, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerBadge|1 label 9|2 variant #0|3 dismiss_on_selection 8", AvailableModelsResponse_ModelPickerBadge_Variant];
  }
};
var AvailableModelsResponse_ModelPickerBadge_Variant = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "AvailableModelsResponse.ModelPickerBadge.Variant", [[0, "UNSPECIFIED"], [1, "ACCENT"], [2, "NEUTRAL"], [3, "SUCCESS"], [4, "WARN"], [5, "DANGER"]], 1);
var AvailableModelsResponse_AvailableModel = class _AvailableModelsResponse_AvailableModel extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.defaultOn = false;
    this.parameterDefinitions = [];
    this.variants = [];
    this.legacySlugs = [];
    this.idAliases = [];
    this.cloudAgentEffortModes = [];
    this.modelPickerBadges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_AvailableModel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_AvailableModel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_AvailableModel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_AvailableModel, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.AvailableModel|1 name 9|2 default_on 8|3 is_long_context_only 8?|4 is_chat_only 8?|5 supports_agent 8?|6 degradation_status #0?|7 price 1?|8 tooltip_data #1?|20 tooltip_data_for_max_mode #1?|9 supports_thinking 8?|10 supports_images 8?|11 supports_auto_context 8?|12 auto_context_max_tokens 5?|13 auto_context_extended_max_tokens 5?|14 supports_max_mode 8?|19 supports_non_max_mode 8?|15 context_token_limit 5?|16 context_token_limit_for_max_mode 5?|17 client_display_name 9?|18 server_model_name 9?|21 is_recommended_for_background_composer 8?|22 supports_plan_mode 8?|25 supports_sandboxing 8?|23 is_user_added 8?|24 inputbox_short_model_name 9?|26 supports_cmd_k 8?|27 only_supports_cmd_k 8?|28 background_composer_sort_order 5?|29 parameter_definitions #2*|30 variants #3*|32 cloud_agent_effort_mode #4?|33 cloud_migrate_to_model 9?|34 upgrade_model_id 9?|35 is_hidden 8?|36 legacy_slugs 9*|37 id_aliases 9*|38 named_model_section_index 5?|39 tagline 9?|40 visible_in_routed_model_view 8?|41 vendor_name 9?|42 vendor #5?|43 default_disabled_in_admin_allowlist 8?|44 cloud_agent_effort_modes #4*|45 supports_smart_mode_classifier 8?|46 requires_data_retention 8?|47 reason_for_zdr_consent_block 9?|48 model_picker_badges #6*", AvailableModelsResponse_DegradationStatus, AvailableModelsResponse_TooltipData, ModelParameterDefinition, AvailableModelsResponse_ModelVariantConfig, CloudAgentEffortMode, AvailableModelsResponse_ModelVendor, AvailableModelsResponse_ModelPickerBadge];
  }
};
var AvailableModelsResponse_ModelVariantConfig = class _AvailableModelsResponse_ModelVariantConfig extends __protoMessage3124 {
  constructor(data) {
    super();
    this.parameterValues = [];
    this.displayName = "";
    this.isMaxMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelVariantConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelVariantConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelVariantConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelVariantConfig, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelVariantConfig|1 parameter_values #0*|2 display_name 9|8 display_name_outside_picker 9?|3 is_max_mode 8|4 is_default_max_config 8?|5 is_default_non_max_config 8?|6 tooltip_data #1?|7 tagline 9?|9 variant_string_representation 9?|10 confirmation_dialogue #2?|11 legacy_slug 9?", RequestedModel_ModelParameterValue, AvailableModelsResponse_TooltipData, AvailableModelsResponse_ConfirmationDialogue];
  }
};
var AvailableModelsResponse_ConfirmationDialogue = class _AvailableModelsResponse_ConfirmationDialogue extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.body = "";
    this.key = "";
    this.blocksSubmission = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ConfirmationDialogue().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ConfirmationDialogue().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ConfirmationDialogue().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ConfirmationDialogue, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ConfirmationDialogue|1 title 9|2 body 9|3 key 9|4 blocks_submission 8|5 presentation #0?", AvailableModelsResponse_ConfirmationDialogue_Presentation];
  }
};
var AvailableModelsResponse_ConfirmationDialogue_Presentation = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "AvailableModelsResponse.ConfirmationDialogue.Presentation", [[0, "UNSPECIFIED"], [1, "POST_PICKER_WARNING"]], 1);
var AvailableModelsResponse_FeatureModelConfig = class _AvailableModelsResponse_FeatureModelConfig extends __protoMessage3124 {
  constructor(data) {
    super();
    this.defaultModel = "";
    this.fallbackModels = [];
    this.bestOfNDefaultModels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_FeatureModelConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_FeatureModelConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_FeatureModelConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_FeatureModelConfig, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.FeatureModelConfig|1 default_model 9|2 fallback_models 9*|3 best_of_n_default_models 9*"];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration = class _AvailableModelsResponse_ModelPickerDisplayConfiguration extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration|1 routed_model_view_config #0|2 named_models_view_config #1|3 hide_search_bar 8?|4 hide_add_models 8?|5 model_selection_restriction_message 9?", AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig, AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.RoutedModelViewConfig|1 title 9?|2 routed_model_view_to_named_view_toggle #0?|3 routed_model_view_to_named_view_button #1?|4 hide_search_bar 8?|5 hide_routed_model_view 8?", AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle, AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle extends __protoMessage3124 {
  constructor(data) {
    super();
    this.titleMarkdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewToggle, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.RoutedModelViewConfig.RoutedModelViewToNamedViewToggle|1 title_markdown 9|2 subtitle 9?|3 set_to_last_named_model 8?"];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_RoutedModelViewConfig_RoutedModelViewToNamedViewButton, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.RoutedModelViewConfig.RoutedModelViewToNamedViewButton|1 markdown 9"];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.NamedModelsViewConfig|2 named_view_to_routed_model_view_toggle #0?|3 named_view_to_routed_model_view_no_button #1?|4 named_view_to_routed_model_view_button #2?", AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle, AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton, AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewToggle, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.NamedModelsViewConfig.NamedViewToRoutedModelViewToggle|1 markdown 9"];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewNoButton, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.NamedModelsViewConfig.NamedViewToRoutedModelViewNoButton"];
  }
};
var AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton = class _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AvailableModelsResponse_ModelPickerDisplayConfiguration_NamedModelsViewConfig_NamedViewToRoutedModelViewButton, a, b2);
  }
  static $() {
    return ["AvailableModelsResponse.ModelPickerDisplayConfiguration.NamedModelsViewConfig.NamedViewToRoutedModelViewButton|1 markdown 9"];
  }
};
var ModelParameterDefinition = class _ModelParameterDefinition extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition|1 id 9|2 name 9|3 markdown_tooltip 9?|4 parameter_type #0|5 is_cycleable_by_hotkey 8?", ModelParameterDefinition_ModelParameterType];
  }
};
var ModelParameterDefinition_ModelParameterType = class _ModelParameterDefinition_ModelParameterType extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition_ModelParameterType().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition_ModelParameterType().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition_ModelParameterType().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition_ModelParameterType, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition.ModelParameterType|1 boolean_parameter #0?|2 enum_parameter #1?", ModelParameterDefinition_BooleanParameterDefinition, ModelParameterDefinition_EnumParameterDefinition];
  }
};
var ModelParameterDefinition_BooleanParameterDefinition = class _ModelParameterDefinition_BooleanParameterDefinition extends __protoMessage3124 {
  constructor(data) {
    super();
    this.values = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition_BooleanParameterDefinition, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition.BooleanParameterDefinition|1 values #0*", ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue];
  }
};
var ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue = class _ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue extends __protoMessage3124 {
  constructor(data) {
    super();
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition_BooleanParameterDefinition_BooleanParameterValue, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition.BooleanParameterDefinition.BooleanParameterValue|1 value 9|2 display_name 9?|3 increases_model_cost 8?|4 default_blocked_in_admin_allowlist 8?|5 hide_from_user_picker_when_admin_blocked 8?|6 blocked_by_admin_allowlist 8?"];
  }
};
var ModelParameterDefinition_EnumParameterDefinition = class _ModelParameterDefinition_EnumParameterDefinition extends __protoMessage3124 {
  constructor(data) {
    super();
    this.values = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition_EnumParameterDefinition, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition.EnumParameterDefinition|1 values #0*", ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue];
  }
};
var ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue = class _ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue extends __protoMessage3124 {
  constructor(data) {
    super();
    this.value = "";
    this.modelPickerBadges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelParameterDefinition_EnumParameterDefinition_EnumParameterValue, a, b2);
  }
  static $() {
    return ["ModelParameterDefinition.EnumParameterDefinition.EnumParameterValue|1 value 9|2 display_name 9?|3 increases_model_cost 8?|4 blocked_by_admin_allowlist 8?|5 markdown_tooltip 9?|6 model_picker_badges #0*", AvailableModelsResponse_ModelPickerBadge];
  }
};
var ServerTimeRequest = class _ServerTimeRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ServerTimeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ServerTimeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ServerTimeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ServerTimeRequest, a, b2);
  }
  static $() {
    return ["ServerTimeRequest"];
  }
};
var ServerTimeResponse = class _ServerTimeResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.receiveTimestamp = 0;
    this.transmitTimestamp = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ServerTimeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ServerTimeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ServerTimeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ServerTimeResponse, a, b2);
  }
  static $() {
    return ["ServerTimeResponse|1 receive_timestamp 1|2 transmit_timestamp 1"];
  }
};
var HealthCheckRequest = class _HealthCheckRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HealthCheckRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HealthCheckRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HealthCheckRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HealthCheckRequest, a, b2);
  }
  static $() {
    return ["HealthCheckRequest"];
  }
};
var HealthCheckResponse = class _HealthCheckResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.status = HealthCheckResponse_Status.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HealthCheckResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HealthCheckResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HealthCheckResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HealthCheckResponse, a, b2);
  }
  static $() {
    return ["HealthCheckResponse|1 status #0", HealthCheckResponse_Status];
  }
};
var HealthCheckResponse_Status = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "HealthCheckResponse.Status", [[0, "UNSPECIFIED"], [1, "HEALTHY"]], 1);
var PrivacyCheckRequest = class _PrivacyCheckRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivacyCheckRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivacyCheckRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivacyCheckRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivacyCheckRequest, a, b2);
  }
  static $() {
    return ["PrivacyCheckRequest"];
  }
};
var PrivacyCheckResponse = class _PrivacyCheckResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.isOnPrivacyPod = false;
    this.isGhostModeOn = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrivacyCheckResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrivacyCheckResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrivacyCheckResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrivacyCheckResponse, a, b2);
  }
  static $() {
    return ["PrivacyCheckResponse|1 is_on_privacy_pod 8|2 is_ghost_mode_on 8"];
  }
};
var TimeLeftHealthCheckResponse = class _TimeLeftHealthCheckResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.timeLeft = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TimeLeftHealthCheckResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TimeLeftHealthCheckResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TimeLeftHealthCheckResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TimeLeftHealthCheckResponse, a, b2);
  }
  static $() {
    return ["TimeLeftHealthCheckResponse|1 time_left 9"];
  }
};
var StreamGenerateRequest = class _StreamGenerateRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.query = "";
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.promptCodeBlocks = [];
    this.sessionId = "";
    this.fastMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamGenerateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamGenerateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamGenerateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamGenerateRequest, a, b2);
  }
  static $() {
    return ["StreamGenerateRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 query 9|7 code_blocks #4*|9 model_details #5|10 documentation_identifiers 9*|11 linter_errors #6|12 prompt_code_blocks #4*|14 session_id 9|13 cmd_k_debug_info #7|15 fast_mode 8|16 original_request #8", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, LinterErrors, CmdKDebugInfo, _StreamGenerateRequest];
  }
};
var ReviewRequest = class _ReviewRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chunk = "";
    this.fileContext = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewRequest, a, b2);
  }
  static $() {
    return ["ReviewRequest|1 chunk 9|2 file_context 9|3 chunk_range #0|4 diff_string 9?|5 custom_instructions 9?", LineRange];
  }
};
var ReviewChatMessage = class _ReviewChatMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.type = ReviewChatMessage_ReviewChatMessageType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewChatMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewChatMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewChatMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewChatMessage, a, b2);
  }
  static $() {
    return ["ReviewChatMessage|1 text 9|2 type #0", ReviewChatMessage_ReviewChatMessageType];
  }
};
var ReviewChatMessage_ReviewChatMessageType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReviewChatMessage.ReviewChatMessageType", [[0, "UNSPECIFIED"], [1, "HUMAN"], [2, "AI"]], 1);
var ReviewChatRequest = class _ReviewChatRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chunk = "";
    this.fileContext = "";
    this.messages = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewChatRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewChatRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewChatRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewChatRequest, a, b2);
  }
  static $() {
    return ["ReviewChatRequest|1 chunk 9|2 file_context 9|3 chunk_range #0|4 messages #1*", LineRange, ReviewChatMessage];
  }
};
var ReviewChatResponse = class _ReviewChatResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewChatResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewChatResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewChatResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewChatResponse, a, b2);
  }
  static $() {
    return ["ReviewChatResponse|1 text 9|2 should_resolve 8?"];
  }
};
var ReviewBug = class _ReviewBug extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewBug().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewBug().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewBug().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewBug, a, b2);
  }
  static $() {
    return ["ReviewBug|1 id 9|2 start_line 5?|3 end_line 5?|4 description 9?|5 severity 5?|6 tldr 9?"];
  }
};
var ReviewResponse = class _ReviewResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.bugs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewResponse, a, b2);
  }
  static $() {
    return ["ReviewResponse|1 text 9|2 prompt 9?|3 tldr 9?|4 is_bug 8?|5 bugs #0*", ReviewBug];
  }
};
var SlashEditRequest = class _SlashEditRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.isCmdI = false;
    this.files = [];
    this.useFastApply = false;
    this.fastApplyModelType = SlashEditRequest_FastApplyModelType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlashEditRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlashEditRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlashEditRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlashEditRequest, a, b2);
  }
  static $() {
    return ["SlashEditRequest|2 current_file #0|3 conversation #1*|4 explicit_context #2|7 model_details #3|8 is_cmd_i 8|11 summary 9?|12 summary_up_until_index 5?|13 should_use_turbo_debug_prompt 8?|14 edit_selection #4?|15 files #0*|16 clicked_code_block_contents 9?|17 is_an_optimistic_request_for_caching_and_linting 8?|18 specific_instructions 9?|19 use_fast_apply 8|20 fast_apply_model_type #5|25 use_chunk_speculation_for_long_files 8?|26 parent_request_id 9?|27 source #6?|28 is_reapply 8?|29 willing_to_pay_extra_for_speed 8?|30 attempt_number 5?|31 should_throw_timeout_error 8?", CurrentFileInfo, ConversationMessage, ExplicitContext, ModelDetails, LineRange, SlashEditRequest_FastApplyModelType, FastApplySource];
  }
};
var SlashEditRequest_FastApplyModelType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "SlashEditRequest.FastApplyModelType", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "DEEPSEEK"], [3, "SONNET"], [4, "OPUS_DIFF"], [5, "SMART_REWRITE"], [6, "GPT4"], [7, "GPT4_NOSPEC"], [8, "SMART_REWRITE_NOSPEC"], [9, "OPUS"], [10, "HAIKU"], [11, "GPT4O_NOSPEC"], [12, "GPT4O_DIFF"], [13, "CODESTRAL_REWRITE"], [14, "DEEPSEEK_33B"], [15, "SONNET_35_DIFF"], [16, "SONNET_35_REWRITE"], [17, "PROMPTED_DEEPSEEK_V2"], [18, "CODESTRAL_REWRITE_OLD"], [19, "CODESTRAL_REWRITE_FP16"], [20, "DEEPSEEK_33B_V2"], [21, "CODESTRAL_V4"], [22, "CODESTRAL_V5"], [23, "CODESTRAL_V6"], [24, "CODESTRAL_V7"]], 1);
var SlashEditResponse = class _SlashEditResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlashEditResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlashEditResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlashEditResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlashEditResponse, a, b2);
  }
  static $() {
    return ["SlashEditResponse|1 cmd_k_response #0", StreamCmdKResponse];
  }
};
var SlashEditPreviousEdit = class _SlashEditPreviousEdit extends __protoMessage3124 {
  constructor(data) {
    super();
    this.originalLines = [];
    this.newLines = [];
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlashEditPreviousEdit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlashEditPreviousEdit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlashEditPreviousEdit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlashEditPreviousEdit, a, b2);
  }
  static $() {
    return ["SlashEditPreviousEdit|1 original_lines 9*|2 new_lines 9*|3 relative_workspace_path 9|4 range #0", LineRange];
  }
};
var SlashEditFollowUpWithPreviousEditsRequest = class _SlashEditFollowUpWithPreviousEditsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.previousEdits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SlashEditFollowUpWithPreviousEditsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SlashEditFollowUpWithPreviousEditsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SlashEditFollowUpWithPreviousEditsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SlashEditFollowUpWithPreviousEditsRequest, a, b2);
  }
  static $() {
    return ["SlashEditFollowUpWithPreviousEditsRequest|1 conversation #0*|2 model_details #1|3 previous_edits #2*", ConversationMessage, ModelDetails, SlashEditPreviousEdit];
  }
};
var StreamSlashEditFollowUpWithPreviousEditsResponse = class _StreamSlashEditFollowUpWithPreviousEditsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamSlashEditFollowUpWithPreviousEditsResponse, a, b2);
  }
  static $() {
    return ["StreamSlashEditFollowUpWithPreviousEditsResponse|1 chat #0 response|2 edits_to_update #1 response", StreamSlashEditFollowUpWithPreviousEditsResponse_Chat, StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate];
  }
};
var StreamSlashEditFollowUpWithPreviousEditsResponse_Chat = class _StreamSlashEditFollowUpWithPreviousEditsResponse_Chat extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_Chat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_Chat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_Chat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamSlashEditFollowUpWithPreviousEditsResponse_Chat, a, b2);
  }
  static $() {
    return ["StreamSlashEditFollowUpWithPreviousEditsResponse.Chat|1 text 9"];
  }
};
var StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate = class _StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate extends __protoMessage3124 {
  constructor(data) {
    super();
    this.previousEdits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamSlashEditFollowUpWithPreviousEditsResponse_EditsToUpdate, a, b2);
  }
  static $() {
    return ["StreamSlashEditFollowUpWithPreviousEditsResponse.EditsToUpdate|1 previous_edits #0*", SlashEditPreviousEdit];
  }
};
var StreamFastEditRequest = class _StreamFastEditRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.repositories = [];
    this.query = "";
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamFastEditRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamFastEditRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamFastEditRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamFastEditRequest, a, b2);
  }
  static $() {
    return ["StreamFastEditRequest|1 current_file #0|3 repositories #1*|4 explicit_context #2|5 workspace_root_path 9?|6 query 9|7 code_blocks #3*|9 model_details #4|10 documentation_identifiers 9*|11 linter_errors #5", CurrentFileInfo, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, LinterErrors];
  }
};
var StreamFastEditResponse = class _StreamFastEditResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.lineNumber = 0;
    this.replaceNumLines = 0;
    this.editUuid = "";
    this.resetNewLines = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamFastEditResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamFastEditResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamFastEditResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamFastEditResponse, a, b2);
  }
  static $() {
    return ["StreamFastEditResponse|2 line_number 5|3 replace_num_lines 5|5 edit_uuid 9|4 done 8?|6 new_line 9?|7 reset_new_lines 8"];
  }
};
var StreamEditRequest = class _StreamEditRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.query = "";
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.promptCodeBlocks = [];
    this.sessionId = "";
    this.fastMode = false;
    this.images = [];
    this.links = [];
    this.rules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamEditRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamEditRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamEditRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamEditRequest, a, b2);
  }
  static $() {
    return ["StreamEditRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 query 9|7 code_blocks #4*|9 model_details #5|10 documentation_identifiers 9*|11 linter_errors #6|12 prompt_code_blocks #4*|14 session_id 9|13 cmd_k_debug_info #7|15 fast_mode 8|16 original_request #8|17 images #9*|18 links #10*|19 rules #11*", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, LinterErrors, CmdKDebugInfo, _StreamEditRequest, ImageProto, CmdKExternalLink, CursorRule2];
  }
};
var PreloadEditRequest = class _PreloadEditRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreloadEditRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreloadEditRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreloadEditRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreloadEditRequest, a, b2);
  }
  static $() {
    return ["PreloadEditRequest|1 req #0", StreamEditRequest];
  }
};
var PreloadEditResponse = class _PreloadEditResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreloadEditResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreloadEditResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreloadEditResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreloadEditResponse, a, b2);
  }
  static $() {
    return ["PreloadEditResponse"];
  }
};
var StreamAiLintBugRequest = class _StreamAiLintBugRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chunksToAnalyze = [];
    this.dismissedBugs = [];
    this.activeBugs = [];
    this.lintRules = [];
    this.clients = [];
    this.forceEnableDiscriminators = [];
    this.forceDisableDiscriminators = [];
    this.forceEnableGenerators = [];
    this.forceDisableGenerators = [];
    this.version = 0;
    this.debugMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiLintBugRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiLintBugRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiLintBugRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiLintBugRequest, a, b2);
  }
  static $() {
    return ["StreamAiLintBugRequest|1 chunks_to_analyze #0*|4 explicit_context #1|5 workspace_root_path 9?|9 model_details #2|10 dismissed_bugs #3*|11 active_bugs #3*|12 lint_rules #4*|14 clients #5*|17 force_enable_discriminators #6*|18 force_disable_discriminators #6*|19 force_enable_generators #7*|20 force_disable_generators #7*|21 version 5|15 discriminator_options #8?|16 debug_mode 8", StreamAiLintBugRequest_CodeChunk, ExplicitContext, ModelDetails, AiLintBug, AiLintRule, StreamAiLintBugRequest_CodeChunkList, LintDiscriminator, LintGenerator, StreamAiLintBugRequest_DiscriminatorOptions];
  }
};
var StreamAiLintBugRequest_CodeChunk = class _StreamAiLintBugRequest_CodeChunk extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLineNumber = 0;
    this.lines = [];
    this.contextLinesBefore = [];
    this.contextLinesAfter = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiLintBugRequest_CodeChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiLintBugRequest_CodeChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiLintBugRequest_CodeChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiLintBugRequest_CodeChunk, a, b2);
  }
  static $() {
    return ["StreamAiLintBugRequest.CodeChunk|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*|4 context_lines_before 9*|5 context_lines_after 9*"];
  }
};
var StreamAiLintBugRequest_CodeChunkList = class _StreamAiLintBugRequest_CodeChunkList extends __protoMessage3124 {
  constructor(data) {
    super();
    this.chunks = [];
    this.referredStartLines = [];
    this.referredEndLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiLintBugRequest_CodeChunkList().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiLintBugRequest_CodeChunkList().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiLintBugRequest_CodeChunkList().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiLintBugRequest_CodeChunkList, a, b2);
  }
  static $() {
    return ["StreamAiLintBugRequest.CodeChunkList|13 chunks #0*|14 referred_start_lines 5*|15 referred_end_lines 5*", StreamAiLintBugRequest_CodeChunk];
  }
};
var StreamAiLintBugRequest_DiscriminatorOptions = class _StreamAiLintBugRequest_DiscriminatorOptions extends __protoMessage3124 {
  constructor(data) {
    super();
    this.specificRules = false;
    this.compileErrors = false;
    this.changeBehavior = false;
    this.matchCode = false;
    this.relevance = false;
    this.userAwareness = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiLintBugRequest_DiscriminatorOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiLintBugRequest_DiscriminatorOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiLintBugRequest_DiscriminatorOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiLintBugRequest_DiscriminatorOptions, a, b2);
  }
  static $() {
    return ["StreamAiLintBugRequest.DiscriminatorOptions|1 specific_rules 8|2 compile_errors 8|3 change_behavior 8|4 match_code 8|5 relevance 8|6 user_awareness 8"];
  }
};
var StreamAiLintBugResponse = class _StreamAiLintBugResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiLintBugResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiLintBugResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiLintBugResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiLintBugResponse, a, b2);
  }
  static $() {
    return ["StreamAiLintBugResponse|1 bug #0 response|2 background_task_uuid 9 response", AiLintBug];
  }
};
var LogUserLintReplyRequest = class _LogUserLintReplyRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.uuid = "";
    this.userAction = "";
    this.debugMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogUserLintReplyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogUserLintReplyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogUserLintReplyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogUserLintReplyRequest, a, b2);
  }
  static $() {
    return ["LogUserLintReplyRequest|1 uuid 9|2 user_action 9|3 debug_mode 8"];
  }
};
var LogUserLintReplyResponse = class _LogUserLintReplyResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogUserLintReplyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogUserLintReplyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogUserLintReplyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogUserLintReplyResponse, a, b2);
  }
  static $() {
    return ["LogUserLintReplyResponse"];
  }
};
var LogLinterExplicitUserFeedbackRequest = class _LogLinterExplicitUserFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.userFeedback = LogLinterExplicitUserFeedbackRequest_LinterUserFeedback.UNSPECIFIED;
    this.userFeedbackDetails = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogLinterExplicitUserFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogLinterExplicitUserFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogLinterExplicitUserFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogLinterExplicitUserFeedbackRequest, a, b2);
  }
  static $() {
    return ["LogLinterExplicitUserFeedbackRequest|1 bug #0|3 user_feedback #1|4 user_feedback_details 9", AiLintBug, LogLinterExplicitUserFeedbackRequest_LinterUserFeedback];
  }
};
var LogLinterExplicitUserFeedbackRequest_LinterUserFeedback = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "LogLinterExplicitUserFeedbackRequest.LinterUserFeedback", [[0, "UNSPECIFIED"], [1, "CORRECT"], [2, "INCORRECT"], [3, "OTHER"]], 1);
var LogLinterExplicitUserFeedbackResponse = class _LogLinterExplicitUserFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogLinterExplicitUserFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogLinterExplicitUserFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogLinterExplicitUserFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogLinterExplicitUserFeedbackResponse, a, b2);
  }
  static $() {
    return ["LogLinterExplicitUserFeedbackResponse"];
  }
};
var StreamNewRuleRequest = class _StreamNewRuleRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.currentRules = "";
    this.dismissedBug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamNewRuleRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamNewRuleRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamNewRuleRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamNewRuleRequest, a, b2);
  }
  static $() {
    return ["StreamNewRuleRequest|1 current_rules 9|2 dismissed_bug 9"];
  }
};
var CursorHelpConversationMessage = class _CursorHelpConversationMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.role = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CursorHelpConversationMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CursorHelpConversationMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CursorHelpConversationMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CursorHelpConversationMessage, a, b2);
  }
  static $() {
    return ["CursorHelpConversationMessage|1 id 9|2 role 9|3 content 9"];
  }
};
var StreamAiCursorHelpRequest = class _StreamAiCursorHelpRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.messages = [];
    this.userOs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiCursorHelpRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiCursorHelpRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiCursorHelpRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiCursorHelpRequest, a, b2);
  }
  static $() {
    return ["StreamAiCursorHelpRequest|1 messages #0*|2 user_os 9|3 model_details #1", CursorHelpConversationMessage, ModelDetails];
  }
};
var StreamAiCursorHelpResponse = class _StreamAiCursorHelpResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.actions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiCursorHelpResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiCursorHelpResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiCursorHelpResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiCursorHelpResponse, a, b2);
  }
  static $() {
    return ["StreamAiCursorHelpResponse|1 text 9|2 actions 9*"];
  }
};
var StreamTerminalAutocompleteRequest = class _StreamTerminalAutocompleteRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.currentCommand = "";
    this.commandHistory = [];
    this.fileDiffHistories = [];
    this.commitHistory = [];
    this.pastResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamTerminalAutocompleteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamTerminalAutocompleteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamTerminalAutocompleteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamTerminalAutocompleteRequest, a, b2);
  }
  static $() {
    return ["StreamTerminalAutocompleteRequest|1 current_command 9|2 command_history 9*|3 model_name 9?|4 file_diff_histories #0*|5 git_diff 9?|6 commit_history 9*|7 past_results 9*", CppFileDiffHistory];
  }
};
var PseudocodeTarget = class _PseudocodeTarget extends __protoMessage3124 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PseudocodeTarget().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PseudocodeTarget().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PseudocodeTarget().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PseudocodeTarget, a, b2);
  }
  static $() {
    return ["PseudocodeTarget|1 range #0|2 content 9", SimpleRange];
  }
};
var StreamPseudocodeGeneratorRequest = class _StreamPseudocodeGeneratorRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPseudocodeGeneratorRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPseudocodeGeneratorRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPseudocodeGeneratorRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPseudocodeGeneratorRequest, a, b2);
  }
  static $() {
    return ["StreamPseudocodeGeneratorRequest|1 current_file #0|2 target #1", CurrentFileInfo, PseudocodeTarget];
  }
};
var StreamPseudocodeGeneratorResponse = class _StreamPseudocodeGeneratorResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPseudocodeGeneratorResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPseudocodeGeneratorResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPseudocodeGeneratorResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPseudocodeGeneratorResponse, a, b2);
  }
  static $() {
    return ["StreamPseudocodeGeneratorResponse|1 text 9"];
  }
};
var StreamPseudocodeMapperRequest = class _StreamPseudocodeMapperRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pseudocode = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPseudocodeMapperRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPseudocodeMapperRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPseudocodeMapperRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPseudocodeMapperRequest, a, b2);
  }
  static $() {
    return ["StreamPseudocodeMapperRequest|2 target #0|1 pseudocode 9", PseudocodeTarget];
  }
};
var StreamPseudocodeMapperResponse = class _StreamPseudocodeMapperResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamPseudocodeMapperResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamPseudocodeMapperResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamPseudocodeMapperResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamPseudocodeMapperResponse, a, b2);
  }
  static $() {
    return ["StreamPseudocodeMapperResponse|1 text 9"];
  }
};
var StreamTerminalAutocompleteResponse = class _StreamTerminalAutocompleteResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamTerminalAutocompleteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamTerminalAutocompleteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamTerminalAutocompleteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamTerminalAutocompleteResponse, a, b2);
  }
  static $() {
    return ["StreamTerminalAutocompleteResponse|1 text 9|2 done_stream 8?"];
  }
};
var DebugInfo = class _DebugInfo extends __protoMessage3124 {
  constructor(data) {
    super();
    this.callStack = [];
    this.history = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugInfo, a, b2);
  }
  static $() {
    return ["DebugInfo|1 breakpoint #0|2 call_stack #1*|3 history #2*", DebugInfo_Breakpoint, DebugInfo_CallStackFrame, CodeBlock];
  }
};
var DebugInfo_Variable = class _DebugInfo_Variable extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugInfo_Variable().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugInfo_Variable().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugInfo_Variable().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugInfo_Variable, a, b2);
  }
  static $() {
    return ["DebugInfo.Variable|1 name 9|2 value 9|3 type 9?"];
  }
};
var DebugInfo_Scope = class _DebugInfo_Scope extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.variables = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugInfo_Scope().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugInfo_Scope().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugInfo_Scope().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugInfo_Scope, a, b2);
  }
  static $() {
    return ["DebugInfo.Scope|1 name 9|2 variables #0*", DebugInfo_Variable];
  }
};
var DebugInfo_CallStackFrame = class _DebugInfo_CallStackFrame extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.lineNumber = 0;
    this.functionName = "";
    this.scopes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugInfo_CallStackFrame().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugInfo_CallStackFrame().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugInfo_CallStackFrame().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugInfo_CallStackFrame, a, b2);
  }
  static $() {
    return ["DebugInfo.CallStackFrame|1 relative_workspace_path 9|2 line_number 5|3 function_name 9|4 scopes #0*", DebugInfo_Scope];
  }
};
var DebugInfo_Breakpoint = class _DebugInfo_Breakpoint extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.lineNumber = 0;
    this.linesBeforeBreakpoint = [];
    this.linesAfterBreakpoint = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugInfo_Breakpoint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugInfo_Breakpoint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugInfo_Breakpoint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugInfo_Breakpoint, a, b2);
  }
  static $() {
    return ["DebugInfo.Breakpoint|1 relative_workspace_path 9|2 line_number 5|3 lines_before_breakpoint 9*|4 lines_after_breakpoint 9*|5 exception_info 9?"];
  }
};
var GetChatRequest = class _GetChatRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.requestId = "";
    this.conversationId = "";
    this.quotes = [];
    this.externalLinks = [];
    this.commitNotes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChatRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChatRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChatRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChatRequest, a, b2);
  }
  static $() {
    return ["GetChatRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 code_blocks #4*|7 model_details #5|8 documentation_identifiers 9*|9 request_id 9|10 linter_errors #6|11 summary 9?|12 summary_up_until_index 5?|13 allow_long_file_scan 8?|14 is_bash 8?|15 conversation_id 9|16 can_handle_filenames_after_language_ids 8?|17 use_web 9?|18 quotes #7*|19 debug_info #8?|20 workspace_id 9?|21 external_links #9*|23 commit_notes #10*|22 long_context_mode 8?|24 is_eval 8?|26 desired_max_tokens 5?|25 context_ast #11|27 is_composer 8?|28 runnable_code_blocks 8?|29 should_cache 8?|30 allow_model_fallbacks 8?|31 number_of_times_shown_fallback_model_warning 5?", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails, LinterErrors, ChatQuote, DebugInfo, ChatExternalLink, CommitNote, ContextAST];
  }
};
var PotentialLocsInitialQueriesRequest = class _PotentialLocsInitialQueriesRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.query = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsInitialQueriesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsInitialQueriesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsInitialQueriesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsInitialQueriesRequest, a, b2);
  }
  static $() {
    return ["PotentialLocsInitialQueriesRequest|1 query 9"];
  }
};
var PotentialLocsInitialQueriesResponse = class _PotentialLocsInitialQueriesResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.hydeQuery = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsInitialQueriesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsInitialQueriesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsInitialQueriesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsInitialQueriesResponse, a, b2);
  }
  static $() {
    return ["PotentialLocsInitialQueriesResponse|1 hyde_query 9"];
  }
};
var PotentialLocsUnderneathRequest = class _PotentialLocsUnderneathRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.file = "";
    this.ranges = [];
    this.query = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsUnderneathRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsUnderneathRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsUnderneathRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsUnderneathRequest, a, b2);
  }
  static $() {
    return ["PotentialLocsUnderneathRequest|1 file 9|2 ranges #0*|3 query 9", SimplestRange];
  }
};
var PotentialLocsUnderneathResponse = class _PotentialLocsUnderneathResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsUnderneathResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsUnderneathResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsUnderneathResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsUnderneathResponse, a, b2);
  }
  static $() {
    return ["PotentialLocsUnderneathResponse|1 text 9"];
  }
};
var PotentialLocsRequest = class _PotentialLocsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsRequest, a, b2);
  }
  static $() {
    return ["PotentialLocsRequest|1 text 9"];
  }
};
var PotentialLocsResponse = class _PotentialLocsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.potentialLoc = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentialLocsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentialLocsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentialLocsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentialLocsResponse, a, b2);
  }
  static $() {
    return ["PotentialLocsResponse|1 potential_loc 9"];
  }
};
var GetComposerChatRequest = class _GetComposerChatRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.documentationIdentifiers = [];
    this.externalLinks = [];
    this.diffsForCompressingFiles = [];
    this.multiFileLinterErrors = [];
    this.fileDiffHistories = [];
    this.additionalRankedContext = [];
    this.quotes = [];
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerChatRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerChatRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerChatRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerChatRequest, a, b2);
  }
  static $() {
    return ["GetComposerChatRequest|1 conversation #0*|2 allow_long_file_scan 8?|3 explicit_context #1|4 can_handle_filenames_after_language_ids 8?|5 model_details #2|6 linter_errors #3|7 documentation_identifiers 9*|8 use_web 9?|9 external_links #4*|10 project_context #0?|11 diffs_for_compressing_files #5*|12 compress_edits 8?|13 should_cache 8?|14 multi_file_linter_errors #3*|15 current_file #6|16 recent_edits #7?|17 use_reference_composer_diff_prompt 8?|18 file_diff_histories #8*|19 use_new_compression_scheme 8?|20 additional_ranked_context #9*|21 quotes #10*|22 willing_to_pay_extra_for_speed 8?|23 conversation_id 9|24 use_unified_chat_prompt 8?|25 use_full_inputs_context 8?|26 is_resume 8?|27 context_bank_session_id 9?|28 context_bank_version 5?|31 context_bank_encryption_key 12?|29 uses_codebase_results #11", ConversationMessage, ExplicitContext, ModelDetails, LinterErrors, ComposerExternalLink, GetComposerChatRequest_RedDiff, CurrentFileInfo, GetComposerChatRequest_RecentEdits, ComposerFileDiffHistory, RankedContext, ChatQuote, CodeSearchResult];
  }
};
var GetComposerChatRequest_RedDiff = class _GetComposerChatRequest_RedDiff extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.redRanges = [];
    this.redRangesReversed = [];
    this.startHash = "";
    this.endHash = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerChatRequest_RedDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerChatRequest_RedDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerChatRequest_RedDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerChatRequest_RedDiff, a, b2);
  }
  static $() {
    return ["GetComposerChatRequest.RedDiff|1 relative_workspace_path 9|2 red_ranges #0*|3 red_ranges_reversed #0*|4 start_hash 9|5 end_hash 9", SimplestRange];
  }
};
var GetComposerChatRequest_RecentEdits = class _GetComposerChatRequest_RecentEdits extends __protoMessage3124 {
  constructor(data) {
    super();
    this.codeBlockInfo = [];
    this.finalFileValues = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerChatRequest_RecentEdits().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerChatRequest_RecentEdits().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerChatRequest_RecentEdits().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerChatRequest_RecentEdits, a, b2);
  }
  static $() {
    return ["GetComposerChatRequest.RecentEdits|1 code_block_info #0*|2 final_file_values #1*|3 edits_belong_to_composer_generation_uuid 9?", GetComposerChatRequest_RecentEdits_CodeBlockInfo, GetComposerChatRequest_RecentEdits_FileInfo];
  }
};
var GetComposerChatRequest_RecentEdits_CodeBlockInfo = class _GetComposerChatRequest_RecentEdits_CodeBlockInfo extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerChatRequest_RecentEdits_CodeBlockInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerChatRequest_RecentEdits_CodeBlockInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerChatRequest_RecentEdits_CodeBlockInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerChatRequest_RecentEdits_CodeBlockInfo, a, b2);
  }
  static $() {
    return ["GetComposerChatRequest.RecentEdits.CodeBlockInfo|1 relative_workspace_path 9|2 content_before 9?|3 content_after 9?|4 generation_uuid 9?|5 version 5?"];
  }
};
var GetComposerChatRequest_RecentEdits_FileInfo = class _GetComposerChatRequest_RecentEdits_FileInfo extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetComposerChatRequest_RecentEdits_FileInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetComposerChatRequest_RecentEdits_FileInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetComposerChatRequest_RecentEdits_FileInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetComposerChatRequest_RecentEdits_FileInfo, a, b2);
  }
  static $() {
    return ["GetComposerChatRequest.RecentEdits.FileInfo|1 relative_workspace_path 9|2 content 9"];
  }
};
var CheckUsageBasedPriceRequest = class _CheckUsageBasedPriceRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckUsageBasedPriceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckUsageBasedPriceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckUsageBasedPriceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckUsageBasedPriceRequest, a, b2);
  }
  static $() {
    return ["CheckUsageBasedPriceRequest|1 usage_event_details #0", UsageEventDetails];
  }
};
var CheckUsageBasedPriceResponse = class _CheckUsageBasedPriceResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markdownResponse = "";
    this.cents = 0;
    this.priceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckUsageBasedPriceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckUsageBasedPriceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckUsageBasedPriceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckUsageBasedPriceResponse, a, b2);
  }
  static $() {
    return ["CheckUsageBasedPriceResponse|1 markdown_response 9|2 cents 5|3 price_id 9"];
  }
};
var CheckQueuePositionRequest = class _CheckQueuePositionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.origRequestId = "";
    this.usageUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckQueuePositionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckQueuePositionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckQueuePositionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckQueuePositionRequest, a, b2);
  }
  static $() {
    return ["CheckQueuePositionRequest|1 orig_request_id 9|2 model_details #0|3 usage_uuid 9", ModelDetails];
  }
};
var CheckQueuePositionResponse = class _CheckQueuePositionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.position = 0;
    this.hitHardLimit = false;
    this.couldEnableUsageBasedPricingToSkip = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckQueuePositionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckQueuePositionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckQueuePositionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckQueuePositionResponse, a, b2);
  }
  static $() {
    return ["CheckQueuePositionResponse|1 position 5|2 seconds_left_to_wait 5?|7 new_queue_position 5?|3 hit_hard_limit 8|4 could_enable_usage_based_pricing_to_skip 8|5 usage_event_details #0|6 custom_link #1|8 model_for_slow_pool_nudge_data #2?", UsageEventDetails, CheckQueuePositionResponse_CustomLink, CheckQueuePositionResponse_ModelForSlowPoolNudgeData];
  }
};
var CheckQueuePositionResponse_CustomLink = class _CheckQueuePositionResponse_CustomLink extends __protoMessage3124 {
  constructor(data) {
    super();
    this.address = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckQueuePositionResponse_CustomLink().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckQueuePositionResponse_CustomLink().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckQueuePositionResponse_CustomLink().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckQueuePositionResponse_CustomLink, a, b2);
  }
  static $() {
    return ["CheckQueuePositionResponse.CustomLink|1 address 9|2 message 9"];
  }
};
var CheckQueuePositionResponse_ModelForSlowPoolNudgeData = class _CheckQueuePositionResponse_ModelForSlowPoolNudgeData extends __protoMessage3124 {
  constructor(data) {
    super();
    this.model = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckQueuePositionResponse_ModelForSlowPoolNudgeData().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckQueuePositionResponse_ModelForSlowPoolNudgeData().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckQueuePositionResponse_ModelForSlowPoolNudgeData().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckQueuePositionResponse_ModelForSlowPoolNudgeData, a, b2);
  }
  static $() {
    return ["CheckQueuePositionResponse.ModelForSlowPoolNudgeData|1 model 9|2 message 9"];
  }
};
var IsolatedTreesitterRequest = class _IsolatedTreesitterRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.fileContent = "";
    this.languageId = "";
    this.commandId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsolatedTreesitterRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsolatedTreesitterRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsolatedTreesitterRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsolatedTreesitterRequest, a, b2);
  }
  static $() {
    return ["IsolatedTreesitterRequest|1 file_content 9|2 language_id 9|3 command_id 9"];
  }
};
var IsolatedTreesitterResponse = class _IsolatedTreesitterResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.items = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsolatedTreesitterResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsolatedTreesitterResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsolatedTreesitterResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsolatedTreesitterResponse, a, b2);
  }
  static $() {
    return ["IsolatedTreesitterResponse|1 items #0*", IsolatedTreesitterResponse_TreesitterSymbolNameItem];
  }
};
var IsolatedTreesitterResponse_TreeSitterPosition = class _IsolatedTreesitterResponse_TreeSitterPosition extends __protoMessage3124 {
  constructor(data) {
    super();
    this.row = 0;
    this.column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsolatedTreesitterResponse_TreeSitterPosition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsolatedTreesitterResponse_TreeSitterPosition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsolatedTreesitterResponse_TreeSitterPosition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsolatedTreesitterResponse_TreeSitterPosition, a, b2);
  }
  static $() {
    return ["IsolatedTreesitterResponse.TreeSitterPosition|1 row 5|2 column 5"];
  }
};
var IsolatedTreesitterResponse_TreesitterSymbolNameItem = class _IsolatedTreesitterResponse_TreesitterSymbolNameItem extends __protoMessage3124 {
  constructor(data) {
    super();
    this.symbolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IsolatedTreesitterResponse_TreesitterSymbolNameItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IsolatedTreesitterResponse_TreesitterSymbolNameItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IsolatedTreesitterResponse_TreesitterSymbolNameItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IsolatedTreesitterResponse_TreesitterSymbolNameItem, a, b2);
  }
  static $() {
    return ["IsolatedTreesitterResponse.TreesitterSymbolNameItem|1 symbol_name 9|2 start_position #0?|3 end_position #0?", IsolatedTreesitterResponse_TreeSitterPosition];
  }
};
var GetSimplePromptRequest = class _GetSimplePromptRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.query = "";
    this.answerPlaceholder = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSimplePromptRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSimplePromptRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSimplePromptRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSimplePromptRequest, a, b2);
  }
  static $() {
    return ["GetSimplePromptRequest|1 query 9|2 answer_placeholder 9"];
  }
};
var GetSimplePromptResponse = class _GetSimplePromptResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.result = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetSimplePromptResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetSimplePromptResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetSimplePromptResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetSimplePromptResponse, a, b2);
  }
  static $() {
    return ["GetSimplePromptResponse|1 result 9"];
  }
};
var SuggestQuickActionsRequest = class _SuggestQuickActionsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.candidates = [];
    this.lastUserMessage = "";
    this.lastAssistantMessage = "";
    this.recentlyUsedSkillIds = [];
    this.includeSkills = false;
    this.includeText = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestQuickActionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestQuickActionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestQuickActionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestQuickActionsRequest, a, b2);
  }
  static $() {
    return ["SuggestQuickActionsRequest|1 candidates #0*|2 last_user_message 9|3 last_assistant_message 9|4 max_suggestions 5?|5 recently_used_skill_ids 9*|6 include_skills 8|7 include_text 8", QuickActionCandidate];
  }
};
var QuickActionCandidate = class _QuickActionCandidate extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _QuickActionCandidate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _QuickActionCandidate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _QuickActionCandidate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_QuickActionCandidate, a, b2);
  }
  static $() {
    return ["QuickActionCandidate|1 id 9|2 description 9"];
  }
};
var SuggestQuickActionsResponse = class _SuggestQuickActionsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.suggestions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestQuickActionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestQuickActionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestQuickActionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestQuickActionsResponse, a, b2);
  }
  static $() {
    return ["SuggestQuickActionsResponse|1 suggestions #0*", SuggestedQuickAction];
  }
};
var SuggestedQuickAction = class _SuggestedQuickAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.type = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestedQuickAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestedQuickAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestedQuickAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestedQuickAction, a, b2);
  }
  static $() {
    return ["SuggestedQuickAction|1 id 9|2 label 9|3 type 9"];
  }
};
var GetPassthroughPromptRequest = class _GetPassthroughPromptRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.query = "";
    this.modelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPassthroughPromptRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPassthroughPromptRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPassthroughPromptRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPassthroughPromptRequest, a, b2);
  }
  static $() {
    return ["GetPassthroughPromptRequest|1 query 9|2 model_name 9"];
  }
};
var GetPassthroughPromptResponse = class _GetPassthroughPromptResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.result = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPassthroughPromptResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPassthroughPromptResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPassthroughPromptResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPassthroughPromptResponse, a, b2);
  }
  static $() {
    return ["GetPassthroughPromptResponse|1 result 9"];
  }
};
var CheckLongFilesFitResponse = class _CheckLongFilesFitResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.didFit = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckLongFilesFitResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckLongFilesFitResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckLongFilesFitResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckLongFilesFitResponse, a, b2);
  }
  static $() {
    return ["CheckLongFilesFitResponse|1 did_fit 8"];
  }
};
var GetEvaluationPromptRequest = class _GetEvaluationPromptRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.promptType = GetEvaluationPromptRequest_EvaluationPromptType.UNSPECIFIED;
    this.query = "";
    this.bucketId = "";
    this.queryStrategy = "";
    this.tokenLimit = 0;
    this.rerankingStrategy = GetEvaluationPromptRequest_RerankingStrategy.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEvaluationPromptRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEvaluationPromptRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEvaluationPromptRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEvaluationPromptRequest, a, b2);
  }
  static $() {
    return ["GetEvaluationPromptRequest|1 prompt_type #0|2 current_file #1|3 query 9|4 bucket_id 9|5 query_strategy 9|6 token_limit 5|7 reranking_strategy #2", GetEvaluationPromptRequest_EvaluationPromptType, CurrentFileInfo, GetEvaluationPromptRequest_RerankingStrategy];
  }
};
var GetEvaluationPromptRequest_EvaluationPromptType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "GetEvaluationPromptRequest.EvaluationPromptType", [[0, "UNSPECIFIED"], [1, "GENERATE"], [2, "CHAT"]], 1);
var GetEvaluationPromptRequest_RerankingStrategy = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "GetEvaluationPromptRequest.RerankingStrategy", [[0, "UNSPECIFIED"], [1, "DISTANCE_ONLY"], [2, "GPT4_RELEVANCE"]], 1);
var GetEvaluationPromptResponse = class _GetEvaluationPromptResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.prompt = "";
    this.tokenCount = 0;
    this.estimatedTokenCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetEvaluationPromptResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetEvaluationPromptResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetEvaluationPromptResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetEvaluationPromptResponse, a, b2);
  }
  static $() {
    return ["GetEvaluationPromptResponse|1 prompt 9|2 token_count 5|3 estimated_token_count 5"];
  }
};
var GetChatTitleRequest = class _GetChatTitleRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChatTitleRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChatTitleRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChatTitleRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChatTitleRequest, a, b2);
  }
  static $() {
    return ["GetChatTitleRequest|2 conversation #0*", ConversationMessage];
  }
};
var GetChatTitleResponse = class _GetChatTitleResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetChatTitleResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetChatTitleResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetChatTitleResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetChatTitleResponse, a, b2);
  }
  static $() {
    return ["GetChatTitleResponse|1 title 9"];
  }
};
var ServerTimingInfo = class _ServerTimingInfo extends __protoMessage3124 {
  constructor(data) {
    super();
    this.serverStartTime = 0;
    this.serverFirstTokenTime = 0;
    this.serverRequestSentTime = 0;
    this.serverEndTime = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ServerTimingInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ServerTimingInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ServerTimingInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ServerTimingInfo, a, b2);
  }
  static $() {
    return ["ServerTimingInfo|1 server_start_time 1|2 server_first_token_time 1|3 server_request_sent_time 1|4 server_end_time 1"];
  }
};
var StreamChatResponse = class _StreamChatResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatResponse, a, b2);
  }
  static $() {
    return ["StreamChatResponse|1 text 9|22 server_bubble_id 9?|2 debugging_only_chat_prompt 9?|3 debugging_only_token_count 5?|4 document_citation #0|5 filled_prompt 9?|6 is_big_file 8?|7 intermediate_text 9?|10 is_using_slow_request 8?|8 chunk_identity #1?|9 docs_reference #2?|11 web_citation #3?|12 status_updates #4?|13 timing_info #5?|14 symbol_link #6?|15 file_link #7?|16 conversation_summary #8?|17 service_status_update #9?|18 used_code #10?|26 stop_using_dsv3_agentic_model 8?|27 usage_uuid 9?", DocumentationCitation, StreamChatResponse_ChunkIdentity, DocsReference, WebCitation, StatusUpdates, ServerTimingInfo, SymbolLink, FileLink, ConversationSummary2, ServiceStatusUpdate, StreamChatResponse_UsedCode];
  }
};
var StreamChatResponse_UsedCode = class _StreamChatResponse_UsedCode extends __protoMessage3124 {
  constructor(data) {
    super();
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatResponse_UsedCode().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatResponse_UsedCode().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatResponse_UsedCode().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatResponse_UsedCode, a, b2);
  }
  static $() {
    return ["StreamChatResponse.UsedCode|1 code_results #0*", CodeResult];
  }
};
var StreamChatResponse_ChunkIdentity = class _StreamChatResponse_ChunkIdentity extends __protoMessage3124 {
  constructor(data) {
    super();
    this.fileName = "";
    this.startLine = 0;
    this.endLine = 0;
    this.text = "";
    this.chunkType = ChunkType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatResponse_ChunkIdentity().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatResponse_ChunkIdentity().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatResponse_ChunkIdentity().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatResponse_ChunkIdentity, a, b2);
  }
  static $() {
    return ["StreamChatResponse.ChunkIdentity|1 file_name 9|2 start_line 5|3 end_line 5|4 text 9|5 chunk_type #0", ChunkType];
  }
};
var WarmComposerCacheResponse = class _WarmComposerCacheResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.didWarmCache = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WarmComposerCacheResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WarmComposerCacheResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WarmComposerCacheResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WarmComposerCacheResponse, a, b2);
  }
  static $() {
    return ["WarmComposerCacheResponse|1 did_warm_cache 8"];
  }
};
var WarmChatCacheRequest = class _WarmChatCacheRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WarmChatCacheRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WarmChatCacheRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WarmChatCacheRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WarmChatCacheRequest, a, b2);
  }
  static $() {
    return ["WarmChatCacheRequest|1 request #0", GetChatRequest];
  }
};
var WarmChatCacheResponse = class _WarmChatCacheResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.didWarmCache = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WarmChatCacheResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WarmChatCacheResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WarmChatCacheResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WarmChatCacheResponse, a, b2);
  }
  static $() {
    return ["WarmChatCacheResponse|1 did_warm_cache 8"];
  }
};
var SurroundingLines = class _SurroundingLines extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.lines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SurroundingLines().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SurroundingLines().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SurroundingLines().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SurroundingLines, a, b2);
  }
  static $() {
    return ["SurroundingLines|1 start_line 5|2 lines 9*"];
  }
};
var GetCompletionRequest = class _GetCompletionRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.suggestionsFromEditor = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCompletionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCompletionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCompletionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCompletionRequest, a, b2);
  }
  static $() {
    return ["GetCompletionRequest|1 file_identifier #0|2 cursor_position #1|3 surrounding_lines #2|4 explicit_context #3|5 suggestions_from_editor 9*", UniqueFileIdentifier, CursorPosition, SurroundingLines, ExplicitContext];
  }
};
var GetCompletionResponse = class _GetCompletionResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.completion = "";
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCompletionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCompletionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCompletionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCompletionResponse, a, b2);
  }
  static $() {
    return ["GetCompletionResponse|1 completion 9|2 score 2|3 debugging_only_completion_prompt 9?"];
  }
};
var UniqueFileIdentifier = class _UniqueFileIdentifier extends __protoMessage3124 {
  constructor(data) {
    super();
    this.projectUuid = "";
    this.relativePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UniqueFileIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UniqueFileIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UniqueFileIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UniqueFileIdentifier, a, b2);
  }
  static $() {
    return ["UniqueFileIdentifier|1 project_uuid 9|2 relative_path 9|3 language_id 9?"];
  }
};
var GetUserInfoRequest = class _GetUserInfoRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetUserInfoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetUserInfoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetUserInfoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetUserInfoRequest, a, b2);
  }
  static $() {
    return ["GetUserInfoRequest"];
  }
};
var UsageData = class _UsageData extends __protoMessage3124 {
  constructor(data) {
    super();
    this.gpt4Requests = 0;
    this.gpt4MaxRequests = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UsageData().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UsageData().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UsageData().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UsageData, a, b2);
  }
  static $() {
    return ["UsageData|2 gpt4_requests 5|3 gpt4_max_requests 5"];
  }
};
var GetUserInfoResponse = class _GetUserInfoResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.userId = "";
    this.jupyterToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetUserInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetUserInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetUserInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetUserInfoResponse, a, b2);
  }
  static $() {
    return ["GetUserInfoResponse|1 user_id 9|2 jupyter_token 9|3 usage #0", UsageData];
  }
};
var DoThisForMeCheckRequest = class _DoThisForMeCheckRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.generationUuid = "";
    this.completion = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckRequest, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckRequest|1 generation_uuid 9|2 completion 9"];
  }
};
var DoThisForMeCheckResponse = class _DoThisForMeCheckResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.action = { case: void 0 };
    this.reasoning = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckResponse, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckResponse|1 skip_action #0 action|2 edit_action #1 action|3 create_action #2 action|4 run_action #3 action|5 reasoning 9", DoThisForMeCheckResponse_SkipAction, DoThisForMeCheckResponse_EditAction, DoThisForMeCheckResponse_CreateAction, DoThisForMeCheckResponse_RunAction];
  }
};
var DoThisForMeCheckResponse_SkipAction = class _DoThisForMeCheckResponse_SkipAction extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckResponse_SkipAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckResponse_SkipAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckResponse_SkipAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckResponse_SkipAction, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckResponse.SkipAction"];
  }
};
var DoThisForMeCheckResponse_EditAction = class _DoThisForMeCheckResponse_EditAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckResponse_EditAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckResponse_EditAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckResponse_EditAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckResponse_EditAction, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckResponse.EditAction|1 relative_workspace_path 9"];
  }
};
var DoThisForMeCheckResponse_CreateAction = class _DoThisForMeCheckResponse_CreateAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckResponse_CreateAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckResponse_CreateAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckResponse_CreateAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckResponse_CreateAction, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckResponse.CreateAction|1 relative_workspace_path 9"];
  }
};
var DoThisForMeCheckResponse_RunAction = class _DoThisForMeCheckResponse_RunAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeCheckResponse_RunAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeCheckResponse_RunAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeCheckResponse_RunAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeCheckResponse_RunAction, a, b2);
  }
  static $() {
    return ["DoThisForMeCheckResponse.RunAction|1 command 9"];
  }
};
var DoThisForMeRequest = class _DoThisForMeRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.generationUuid = "";
    this.completion = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeRequest, a, b2);
  }
  static $() {
    return ["DoThisForMeRequest|1 generation_uuid 9|2 completion 9|3 action #0", DoThisForMeCheckResponse];
  }
};
var DoThisForMeResponse = class _DoThisForMeResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeResponse, a, b2);
  }
  static $() {
    return ["DoThisForMeResponse|1 update_status #0 event", DoThisForMeResponse_UpdateStatus];
  }
};
var DoThisForMeResponse_UpdateStatus = class _DoThisForMeResponse_UpdateStatus extends __protoMessage3124 {
  constructor(data) {
    super();
    this.status = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeResponse_UpdateStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeResponse_UpdateStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeResponse_UpdateStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeResponse_UpdateStatus, a, b2);
  }
  static $() {
    return ["DoThisForMeResponse.UpdateStatus|1 status 9"];
  }
};
var DoThisForMeResponseWrapped = class _DoThisForMeResponseWrapped extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DoThisForMeResponseWrapped().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DoThisForMeResponseWrapped().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DoThisForMeResponseWrapped().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DoThisForMeResponseWrapped, a, b2);
  }
  static $() {
    return ["DoThisForMeResponseWrapped|1 real_response #0 response|2 background_task_uuid 9 response", DoThisForMeResponse];
  }
};
var StreamChatToolformerContinueRequest = class _StreamChatToolformerContinueRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.toolformerSessionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatToolformerContinueRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatToolformerContinueRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatToolformerContinueRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatToolformerContinueRequest, a, b2);
  }
  static $() {
    return ["StreamChatToolformerContinueRequest|1 toolformer_session_id 9|2 tool_result #0", ToolResult];
  }
};
var StreamChatToolformerResponse = class _StreamChatToolformerResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.responseType = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatToolformerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatToolformerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatToolformerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatToolformerResponse, a, b2);
  }
  static $() {
    return ["StreamChatToolformerResponse|1 toolformer_session_id 9?|2 output #0 response_type|3 tool_action #1 response_type|4 thought #2 response_type", StreamChatToolformerResponse_Output, StreamChatToolformerResponse_ToolAction, StreamChatToolformerResponse_Thought];
  }
};
var StreamChatToolformerResponse_Output = class _StreamChatToolformerResponse_Output extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatToolformerResponse_Output().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatToolformerResponse_Output().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatToolformerResponse_Output().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatToolformerResponse_Output, a, b2);
  }
  static $() {
    return ["StreamChatToolformerResponse.Output|1 text 9"];
  }
};
var StreamChatToolformerResponse_Thought = class _StreamChatToolformerResponse_Thought extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatToolformerResponse_Thought().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatToolformerResponse_Thought().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatToolformerResponse_Thought().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatToolformerResponse_Thought, a, b2);
  }
  static $() {
    return ["StreamChatToolformerResponse.Thought|1 text 9"];
  }
};
var StreamChatToolformerResponse_ToolAction = class _StreamChatToolformerResponse_ToolAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.userFacingText = "";
    this.rawModelOutput = "";
    this.moreToCome = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamChatToolformerResponse_ToolAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamChatToolformerResponse_ToolAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamChatToolformerResponse_ToolAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamChatToolformerResponse_ToolAction, a, b2);
  }
  static $() {
    return ["StreamChatToolformerResponse.ToolAction|1 user_facing_text 9|3 raw_model_output 9|2 tool_call #0|4 more_to_come 8", ToolCall2];
  }
};
var TaskInstruction = class _TaskInstruction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.attachedCodeChunks = [];
    this.repositories = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInstruction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInstruction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInstruction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInstruction, a, b2);
  }
  static $() {
    return ["TaskInstruction|1 text 9|2 attached_code_chunks #0*|3 current_file #1|4 repositories #2*|5 explicit_context #3", TaskInstruction_CodeChunk, CurrentFileInfo, RepositoryInfo, ExplicitContext];
  }
};
var TaskInstruction_CodeChunk = class _TaskInstruction_CodeChunk extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLineNumber = 0;
    this.lines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInstruction_CodeChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInstruction_CodeChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInstruction_CodeChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInstruction_CodeChunk, a, b2);
  }
  static $() {
    return ["TaskInstruction.CodeChunk|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*"];
  }
};
var TaskUserMessage = class _TaskUserMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.attachedCodeChunks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskUserMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskUserMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskUserMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskUserMessage, a, b2);
  }
  static $() {
    return ["TaskUserMessage|1 text 9|2 attached_code_chunks #0*", TaskUserMessage_CodeChunk];
  }
};
var TaskUserMessage_CodeChunk = class _TaskUserMessage_CodeChunk extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLineNumber = 0;
    this.lines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskUserMessage_CodeChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskUserMessage_CodeChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskUserMessage_CodeChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskUserMessage_CodeChunk, a, b2);
  }
  static $() {
    return ["TaskUserMessage.CodeChunk|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*"];
  }
};
var PushAiThoughtRequest = class _PushAiThoughtRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.thought = "";
    this.automated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PushAiThoughtRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PushAiThoughtRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PushAiThoughtRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PushAiThoughtRequest, a, b2);
  }
  static $() {
    return ["PushAiThoughtRequest|1 thought 9|2 cmd_k_debug_info #0|3 automated 8|4 metadata #1?", CmdKDebugInfo, PushAiThoughtRequest_Metadata];
  }
};
var PushAiThoughtRequest_Metadata = class _PushAiThoughtRequest_Metadata extends __protoMessage3124 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PushAiThoughtRequest_Metadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PushAiThoughtRequest_Metadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PushAiThoughtRequest_Metadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PushAiThoughtRequest_Metadata, a, b2);
  }
  static $() {
    return ["PushAiThoughtRequest.Metadata|1 accepted_hallucinated_function_event #0 event", PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent];
  }
};
var PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent = class _PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent extends __protoMessage3124 {
  constructor(data) {
    super();
    this.implementationUuid = "";
    this.hallucinatedFunctionUuid = "";
    this.implementation = "";
    this.source = "";
    this.implementationReqid = "";
    this.planReqid = "";
    this.reflectionReqid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PushAiThoughtRequest_Metadata_AcceptedHallucinatedFunctionEvent, a, b2);
  }
  static $() {
    return ["PushAiThoughtRequest.Metadata.AcceptedHallucinatedFunctionEvent|1 implementation_uuid 9|2 hallucinated_function_uuid 9|3 implementation 9|4 source 9|5 implementation_reqid 9|6 plan_reqid 9|7 reflection_reqid 9"];
  }
};
var PushAiThoughtResponse = class _PushAiThoughtResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PushAiThoughtResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PushAiThoughtResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PushAiThoughtResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PushAiThoughtResponse, a, b2);
  }
  static $() {
    return ["PushAiThoughtResponse"];
  }
};
var CheckDoableAsTaskRequest = class _CheckDoableAsTaskRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.modelOutput = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckDoableAsTaskRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckDoableAsTaskRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckDoableAsTaskRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckDoableAsTaskRequest, a, b2);
  }
  static $() {
    return ["CheckDoableAsTaskRequest|1 model_output 9|2 model_details #0", ModelDetails];
  }
};
var CheckDoableAsTaskResponse = class _CheckDoableAsTaskResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.doableAsTask = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CheckDoableAsTaskResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CheckDoableAsTaskResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CheckDoableAsTaskResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CheckDoableAsTaskResponse, a, b2);
  }
  static $() {
    return ["CheckDoableAsTaskResponse|1 doable_as_task 8"];
  }
};
var InterfaceAgentInitRequest = class _InterfaceAgentInitRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.debuggingOnlyLiveMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InterfaceAgentInitRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InterfaceAgentInitRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InterfaceAgentInitRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InterfaceAgentInitRequest, a, b2);
  }
  static $() {
    return ["InterfaceAgentInitRequest|1 model_details #0|2 debugging_only_live_mode 8|3 interface_agent_client_state #1", ModelDetails, InterfaceAgentClientState];
  }
};
var InterfaceAgentInitResponse = class _InterfaceAgentInitResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    this.humanReadableTitle = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InterfaceAgentInitResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InterfaceAgentInitResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InterfaceAgentInitResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InterfaceAgentInitResponse, a, b2);
  }
  static $() {
    return ["InterfaceAgentInitResponse|1 task_uuid 9|2 human_readable_title 9"];
  }
};
var StreamInterfaceAgentStatusRequest = class _StreamInterfaceAgentStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamInterfaceAgentStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamInterfaceAgentStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamInterfaceAgentStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamInterfaceAgentStatusRequest, a, b2);
  }
  static $() {
    return ["StreamInterfaceAgentStatusRequest|1 task_uuid 9"];
  }
};
var StreamInterfaceAgentStatusResponse = class _StreamInterfaceAgentStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamInterfaceAgentStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamInterfaceAgentStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamInterfaceAgentStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamInterfaceAgentStatusResponse, a, b2);
  }
  static $() {
    return ["StreamInterfaceAgentStatusResponse|1 status #0", InterfaceAgentStatus];
  }
};
var TaskGetInterfaceAgentStatusRequest = class _TaskGetInterfaceAgentStatusRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskGetInterfaceAgentStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskGetInterfaceAgentStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskGetInterfaceAgentStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskGetInterfaceAgentStatusRequest, a, b2);
  }
  static $() {
    return ["TaskGetInterfaceAgentStatusRequest|1 interface_agent_client_state #0", InterfaceAgentClientState];
  }
};
var TaskGetInterfaceAgentStatusResponse = class _TaskGetInterfaceAgentStatusResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskGetInterfaceAgentStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskGetInterfaceAgentStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskGetInterfaceAgentStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskGetInterfaceAgentStatusResponse, a, b2);
  }
  static $() {
    return ["TaskGetInterfaceAgentStatusResponse|1 status #0", InterfaceAgentStatus];
  }
};
var TaskGetInterfaceAgentStatusResponseWrapped = class _TaskGetInterfaceAgentStatusResponseWrapped extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskGetInterfaceAgentStatusResponseWrapped().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskGetInterfaceAgentStatusResponseWrapped().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskGetInterfaceAgentStatusResponseWrapped().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskGetInterfaceAgentStatusResponseWrapped, a, b2);
  }
  static $() {
    return ["TaskGetInterfaceAgentStatusResponseWrapped|1 real_response #0 response|2 background_task_uuid 9 response", TaskGetInterfaceAgentStatusResponse];
  }
};
var TaskInitRequest = class _TaskInitRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.debuggingOnlyLiveMode = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInitRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInitRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInitRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInitRequest, a, b2);
  }
  static $() {
    return ["TaskInitRequest|1 instruction #0|2 model_details #1|3 debugging_only_live_mode 8|4 engine_id 9?", TaskInstruction, ModelDetails];
  }
};
var TaskInitResponse = class _TaskInitResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    this.humanReadableTitle = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInitResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInitResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInitResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInitResponse, a, b2);
  }
  static $() {
    return ["TaskInitResponse|1 task_uuid 9|2 human_readable_title 9"];
  }
};
var TaskStreamLogRequest = class _TaskStreamLogRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    this.startSequenceNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamLogRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamLogRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamLogRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamLogRequest, a, b2);
  }
  static $() {
    return ["TaskStreamLogRequest|1 task_uuid 9|2 start_sequence_number 5"];
  }
};
var TaskLogOutput = class _TaskLogOutput extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskLogOutput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskLogOutput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskLogOutput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskLogOutput, a, b2);
  }
  static $() {
    return ["TaskLogOutput|1 text 9"];
  }
};
var TaskLogToolAction = class _TaskLogToolAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.userFacingText = "";
    this.rawModelOutput = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskLogToolAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskLogToolAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskLogToolAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskLogToolAction, a, b2);
  }
  static $() {
    return ["TaskLogToolAction|1 user_facing_text 9|3 raw_model_output 9|2 tool_call #0", ToolCall2];
  }
};
var TaskLogThought = class _TaskLogThought extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskLogThought().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskLogThought().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskLogThought().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskLogThought, a, b2);
  }
  static $() {
    return ["TaskLogThought|1 text 9"];
  }
};
var TaskLogToolResult = class _TaskLogToolResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.actionSequenceNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskLogToolResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskLogToolResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskLogToolResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskLogToolResult, a, b2);
  }
  static $() {
    return ["TaskLogToolResult|1 tool_result #0|2 action_sequence_number 5", ToolResult];
  }
};
var TaskLogItem = class _TaskLogItem extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sequenceNumber = 0;
    this.isNotDone = false;
    this.logItem = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskLogItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskLogItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskLogItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskLogItem, a, b2);
  }
  static $() {
    return ["TaskLogItem|1 sequence_number 5|2 is_not_done 8|3 output #0 log_item|4 tool_action #1 log_item|5 thought #2 log_item|6 user_message #3 log_item|7 instruction #4 log_item|8 tool_result #5 log_item", TaskLogOutput, TaskLogToolAction, TaskLogThought, TaskUserMessage, TaskInstruction, TaskLogToolResult];
  }
};
var TaskInfoRequest = class _TaskInfoRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInfoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInfoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInfoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInfoRequest, a, b2);
  }
  static $() {
    return ["TaskInfoRequest|1 task_uuid 9"];
  }
};
var TaskPauseRequest = class _TaskPauseRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskPauseRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskPauseRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskPauseRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskPauseRequest, a, b2);
  }
  static $() {
    return ["TaskPauseRequest|1 task_uuid 9"];
  }
};
var TaskPauseResponse = class _TaskPauseResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskPauseResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskPauseResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskPauseResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskPauseResponse, a, b2);
  }
  static $() {
    return ["TaskPauseResponse"];
  }
};
var TaskInfoResponse = class _TaskInfoResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.humanReadableTitle = "";
    this.taskStatus = TaskStatus.UNSPECIFIED;
    this.lastLogSequenceNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskInfoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskInfoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskInfoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskInfoResponse, a, b2);
  }
  static $() {
    return ["TaskInfoResponse|1 human_readable_title 9|2 task_status #0|3 last_log_sequence_number 5", TaskStatus];
  }
};
var TaskStreamLogResponse = class _TaskStreamLogResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamLogResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamLogResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamLogResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamLogResponse, a, b2);
  }
  static $() {
    return ["TaskStreamLogResponse|1 streamed_log_item #0 response|2 info_update #1 response|3 initial_task_info #2 response", TaskLogItem, TaskStreamLogResponse_InfoUpdate, TaskInfoResponse];
  }
};
var TaskStreamLogResponse_InfoUpdate = class _TaskStreamLogResponse_InfoUpdate extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskStreamLogResponse_InfoUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskStreamLogResponse_InfoUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskStreamLogResponse_InfoUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskStreamLogResponse_InfoUpdate, a, b2);
  }
  static $() {
    return ["TaskStreamLogResponse.InfoUpdate|1 human_readable_title 9?|2 task_status #0?", TaskStatus];
  }
};
var TaskProvideResultRequest = class _TaskProvideResultRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    this.actionSequenceNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskProvideResultRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskProvideResultRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskProvideResultRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskProvideResultRequest, a, b2);
  }
  static $() {
    return ["TaskProvideResultRequest|1 task_uuid 9|2 action_sequence_number 5|3 tool_result #0", ToolResult];
  }
};
var TaskProvideResultResponse = class _TaskProvideResultResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskProvideResultResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskProvideResultResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskProvideResultResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskProvideResultResponse, a, b2);
  }
  static $() {
    return ["TaskProvideResultResponse"];
  }
};
var TaskSendMessageRequest = class _TaskSendMessageRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.taskUuid = "";
    this.wantsAttentionRightNow = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskSendMessageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskSendMessageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskSendMessageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskSendMessageRequest, a, b2);
  }
  static $() {
    return ["TaskSendMessageRequest|1 task_uuid 9|2 user_message #0|3 wants_attention_right_now 8", TaskUserMessage];
  }
};
var TaskSendMessageResponse = class _TaskSendMessageResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaskSendMessageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaskSendMessageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaskSendMessageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaskSendMessageResponse, a, b2);
  }
  static $() {
    return ["TaskSendMessageResponse"];
  }
};
var ReportFeedbackRequest = class _ReportFeedbackRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.feedback = "";
    this.feedbackType = ReportFeedbackRequest_FeedbackType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportFeedbackRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportFeedbackRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportFeedbackRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportFeedbackRequest, a, b2);
  }
  static $() {
    return ["ReportFeedbackRequest|1 feedback 9|2 feedback_type #0", ReportFeedbackRequest_FeedbackType];
  }
};
var ReportFeedbackRequest_FeedbackType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportFeedbackRequest.FeedbackType", [[0, "UNSPECIFIED"], [1, "LOW_PRIORITY"], [2, "HIGH_PRIORITY"]], 1);
var ReportFeedbackResponse = class _ReportFeedbackResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportFeedbackResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportFeedbackResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportFeedbackResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportFeedbackResponse, a, b2);
  }
  static $() {
    return ["ReportFeedbackResponse"];
  }
};
var LogFile = class _LogFile extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativePathToCursorFolder = "";
    this.contents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LogFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LogFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LogFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LogFile, a, b2);
  }
  static $() {
    return ["LogFile|1 relative_path_to_cursor_folder 9|2 contents 9"];
  }
};
var BugReportScreenshot = class _BugReportScreenshot extends __protoMessage3124 {
  constructor(data) {
    super();
    this.data = new Uint8Array(0);
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugReportScreenshot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugReportScreenshot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugReportScreenshot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugReportScreenshot, a, b2);
  }
  static $() {
    return ["BugReportScreenshot|1 data 12|2 mime_type 9"];
  }
};
var BugContext = class _BugContext extends __protoMessage3124 {
  constructor(data) {
    super();
    this.screenshots = [];
    this.conversation = [];
    this.logs = [];
    this.consoleLogs = "";
    this.cursorVersion = "";
    this.os = "";
    this.protoUrl = "";
    this.failingRequstId = "";
    this.connectionErrorRaw = "";
    this.binaryScreenshots = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugContext, a, b2);
  }
  static $() {
    return ["BugContext|1 screenshots 9*|2 current_file #0|3 conversation #1*|4 logs #2*|5 console_logs 9|6 cursor_version 9|7 os 9|8 proto_url 9|9 failing_requst_id 9|10 connection_error_raw 9|12 debug_info #3|13 connect_error_code 5?|14 error_detail_code #4?|15 error_detail_title 9?|16 error_detail_detail 9?|17 binary_screenshots #5*", CurrentFileInfo, ConversationMessage, LogFile, CmdKDebugInfo, ErrorDetails_Error, BugReportScreenshot];
  }
};
var ReportBugRequest = class _ReportBugRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.bug = "";
    this.bugType = ReportBugRequest_BugType.UNSPECIFIED;
    this.contactEmail = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugRequest, a, b2);
  }
  static $() {
    return ["ReportBugRequest|1 bug 9|2 bug_type #0|3 context #1|4 contact_email 9", ReportBugRequest_BugType, BugContext];
  }
};
var ReportBugRequest_BugType = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportBugRequest.BugType", [[0, "UNSPECIFIED"], [1, "LOW"], [2, "MEDIUM"], [3, "URGENT"], [4, "CRASH"], [5, "CONNECTION_ERROR"], [6, "IDEA"], [7, "MISC_AUTOMATIC_ERROR"]], 1);
var ReportBugResponse = class _ReportBugResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugResponse, a, b2);
  }
  static $() {
    return ["ReportBugResponse"];
  }
};
var FixMarkersRequest = class _FixMarkersRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.markers = [];
    this.iterationNumber = 0;
    this.sequenceId = "";
    this.userInstruction = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest, a, b2);
  }
  static $() {
    return ["FixMarkersRequest|1 markers #0*|2 model_details #1|3 iteration_number 5|4 sequence_id 9|5 user_instruction 9", FixMarkersRequest_Marker, ModelDetails];
  }
};
var FixMarkersRequest_Marker = class _FixMarkersRequest_Marker extends __protoMessage3124 {
  constructor(data) {
    super();
    this.lines = [];
    this.startLine = 0;
    this.endLineInclusive = 0;
    this.message = "";
    this.relativeWorkspacePath = "";
    this.relatedInformation = [];
    this.contextRanges = [];
    this.ancestorTypeDefinitions = [];
    this.insertedSymbolTypes = [];
    this.quickFixes = [];
    this.startColumn = 0;
    this.endColumnInclusive = 0;
    this.classInformation = [];
    this.functionSignatures = [];
    this.snapshot = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker|1 lines 9*|2 start_line 5|3 end_line_inclusive 5|4 message 9|5 relative_workspace_path 9|6 related_information #0*|7 context_ranges #1*|8 ancestor_type_definitions #2*|9 inserted_symbol_types #3*|10 quick_fixes #4*|11 start_column 5|12 end_column_inclusive 5|13 class_information #5*|14 function_signatures #6*|15 snapshot 5", FixMarkersRequest_Marker_RelatedInformation, FixMarkersRequest_Marker_ContextRange, FixMarkersRequest_Marker_AncestorTypeDefinition, FixMarkersRequest_Marker_InsertedSymbolType, FixMarkersRequest_Marker_QuickFix, FixMarkersRequest_Marker_ClassInformation, FixMarkersRequest_Marker_FunctionSignature];
  }
};
var FixMarkersRequest_Marker_RelatedInformation = class _FixMarkersRequest_Marker_RelatedInformation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.relativeWorkspacePath = "";
    this.relevantLines = [];
    this.startLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_RelatedInformation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_RelatedInformation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_RelatedInformation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_RelatedInformation, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.RelatedInformation|1 message 9|2 relative_workspace_path 9|3 relevant_lines 9*|4 start_line 5"];
  }
};
var FixMarkersRequest_Marker_ContextRange = class _FixMarkersRequest_Marker_ContextRange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLineInclusive = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_ContextRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_ContextRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_ContextRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_ContextRange, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.ContextRange|1 start_line 5|2 end_line_inclusive 5"];
  }
};
var FixMarkersRequest_Marker_AncestorTypeDefinition = class _FixMarkersRequest_Marker_AncestorTypeDefinition extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.relativeWorkspacePath = "";
    this.startLine = 0;
    this.lines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_AncestorTypeDefinition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_AncestorTypeDefinition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_AncestorTypeDefinition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_AncestorTypeDefinition, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.AncestorTypeDefinition|1 name 9|2 relative_workspace_path 9|3 start_line 5|4 lines 9*"];
  }
};
var FixMarkersRequest_Marker_InsertedSymbolType = class _FixMarkersRequest_Marker_InsertedSymbolType extends __protoMessage3124 {
  constructor(data) {
    super();
    this.symbolName = "";
    this.symbolType = "";
    this.relativeWorkspacePath = "";
    this.symbolLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_InsertedSymbolType().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_InsertedSymbolType().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_InsertedSymbolType().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_InsertedSymbolType, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.InsertedSymbolType|1 symbol_name 9|2 symbol_type 9|3 relative_workspace_path 9|4 symbol_line 5"];
  }
};
var FixMarkersRequest_Marker_QuickFix = class _FixMarkersRequest_Marker_QuickFix extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = "";
    this.kind = "";
    this.isPreferred = false;
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_QuickFix().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_QuickFix().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_QuickFix().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_QuickFix, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.QuickFix|1 message 9|2 kind 9|3 is_preferred 8|4 edits #0*", FixMarkersRequest_Marker_QuickFix_Edit];
  }
};
var FixMarkersRequest_Marker_QuickFix_Edit = class _FixMarkersRequest_Marker_QuickFix_Edit extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.startLine = 0;
    this.endLineInclusive = 0;
    this.deletedLines = [];
    this.addLines = [];
    this.snapshot = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_QuickFix_Edit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_QuickFix_Edit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_QuickFix_Edit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_QuickFix_Edit, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.QuickFix.Edit|1 relative_workspace_path 9|2 start_line 5|3 end_line_inclusive 5|4 deleted_lines 9*|5 add_lines 9*|6 snapshot 5"];
  }
};
var FixMarkersRequest_Marker_ClassInformation = class _FixMarkersRequest_Marker_ClassInformation extends __protoMessage3124 {
  constructor(data) {
    super();
    this.className = "";
    this.startLine = 0;
    this.topLevelLines = [];
    this.lines = [];
    this.constructors = [];
    this.detail = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_ClassInformation, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.ClassInformation|1 class_name 9|2 start_line 5|3 top_level_lines 5*|4 lines 9*|5 constructors #0*|6 detail 9", FixMarkersRequest_Marker_ClassInformation_Constructor];
  }
};
var FixMarkersRequest_Marker_ClassInformation_Constructor = class _FixMarkersRequest_Marker_ClassInformation_Constructor extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLineInclusive = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation_Constructor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation_Constructor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_ClassInformation_Constructor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_ClassInformation_Constructor, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.ClassInformation.Constructor|1 start_line 5|2 end_line_inclusive 5"];
  }
};
var FixMarkersRequest_Marker_FunctionSignature = class _FixMarkersRequest_Marker_FunctionSignature extends __protoMessage3124 {
  constructor(data) {
    super();
    this.label = "";
    this.documentation = "";
    this.parameters = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_FunctionSignature, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.FunctionSignature|1 label 9|2 documentation 9|3 parameters #0*", FixMarkersRequest_Marker_FunctionSignature_FunctionParameter];
  }
};
var FixMarkersRequest_Marker_FunctionSignature_FunctionParameter = class _FixMarkersRequest_Marker_FunctionSignature_FunctionParameter extends __protoMessage3124 {
  constructor(data) {
    super();
    this.label = "";
    this.documentation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature_FunctionParameter().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature_FunctionParameter().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersRequest_Marker_FunctionSignature_FunctionParameter().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersRequest_Marker_FunctionSignature_FunctionParameter, a, b2);
  }
  static $() {
    return ["FixMarkersRequest.Marker.FunctionSignature.FunctionParameter|1 label 9|2 documentation 9"];
  }
};
var FixMarkersResponse = class _FixMarkersResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.changes = [];
    this.success = false;
    this.iterationNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersResponse, a, b2);
  }
  static $() {
    return ["FixMarkersResponse|1 relative_workspace_path 9|2 changes #0*|3 success 8|4 iteration_number 5", FixMarkersResponse_Change];
  }
};
var FixMarkersResponse_Change = class _FixMarkersResponse_Change extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLineExclusive = 0;
    this.deletedLines = [];
    this.addLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FixMarkersResponse_Change().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FixMarkersResponse_Change().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FixMarkersResponse_Change().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FixMarkersResponse_Change, a, b2);
  }
  static $() {
    return ["FixMarkersResponse.Change|1 start_line 5|2 end_line_exclusive 5|3 deleted_lines 9*|4 add_lines 9*"];
  }
};
var StreamLintRequest = class _StreamLintRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.repositories = [];
    this.query = "";
    this.codeBlocks = [];
    this.documentationIdentifiers = [];
    this.badNotifications = [];
    this.lintRules = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamLintRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamLintRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamLintRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamLintRequest, a, b2);
  }
  static $() {
    return ["StreamLintRequest|1 current_file #0|2 conversation #1*|3 repositories #2*|4 explicit_context #3|5 workspace_root_path 9?|6 query 9|7 code_blocks #4*|9 model_details #5|10 documentation_identifiers 9*|11 bad_notifications 9*|12 lint_rules 9", CurrentFileInfo, ConversationMessage, RepositoryInfo, ExplicitContext, CodeBlock, ModelDetails];
  }
};
var ReportGroundTruthCandidateRequest = class _ReportGroundTruthCandidateRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.timeSinceCompletedActionMs = 0;
    this.featureType = FeatureType.UNSPECIFIED;
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.linesAboveAndBelow = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportGroundTruthCandidateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportGroundTruthCandidateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportGroundTruthCandidateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportGroundTruthCandidateRequest, a, b2);
  }
  static $() {
    return ["ReportGroundTruthCandidateRequest|1 request_id 9|2 time_since_completed_action_ms 5|3 feature_type #0|4 relative_workspace_path 9|5 contents 9|6 selection_in_question #1|7 lines_above_and_below 5", FeatureType, LineRange];
  }
};
var ReportGroundTruthCandidateResponse = class _ReportGroundTruthCandidateResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportGroundTruthCandidateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportGroundTruthCandidateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportGroundTruthCandidateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportGroundTruthCandidateResponse, a, b2);
  }
  static $() {
    return ["ReportGroundTruthCandidateResponse"];
  }
};
var ReportCmdKFateRequest = class _ReportCmdKFateRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.fate = ReportCmdKFateRequest_Fate.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportCmdKFateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportCmdKFateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportCmdKFateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportCmdKFateRequest, a, b2);
  }
  static $() {
    return ["ReportCmdKFateRequest|1 request_id 9|2 fate #0", ReportCmdKFateRequest_Fate];
  }
};
var ReportCmdKFateRequest_Fate = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "ReportCmdKFateRequest.Fate", [[0, "UNSPECIFIED"], [1, "CANCELLED"], [2, "ACCEPTED"], [3, "REJECTED"], [4, "FOLLOWED_UP"], [5, "REPROMPTED"]], 1);
var ReportCmdKFateResponse = class _ReportCmdKFateResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportCmdKFateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportCmdKFateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportCmdKFateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportCmdKFateResponse, a, b2);
  }
  static $() {
    return ["ReportCmdKFateResponse"];
  }
};
var GetFilesForComposerRequest = class _GetFilesForComposerRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.conversation = [];
    this.files = [];
    this.contextResults = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFilesForComposerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFilesForComposerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFilesForComposerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFilesForComposerRequest, a, b2);
  }
  static $() {
    return ["GetFilesForComposerRequest|1 conversation #0*|2 files #1*|3 rerank_results 8?|4 file_search_results #2 context_results|5 code_search_results #3 context_results|6 rerank_results_v2 8?|7 long_context_mode 8?|8 is_eval 8?|9 request_id 9?|10 model_details #4", ConversationMessage, CurrentFileInfo, FullFileSearchResult, CodeSearchResult, ModelDetails];
  }
};
var GetFilesForComposerResponse = class _GetFilesForComposerResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFilesForComposerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFilesForComposerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFilesForComposerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFilesForComposerResponse, a, b2);
  }
  static $() {
    return ["GetFilesForComposerResponse|1 relative_workspace_paths 9*"];
  }
};
var ComposerEnhancerClientMessage = class _ComposerEnhancerClientMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerClientMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerClientMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerClientMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerClientMessage, a, b2);
  }
  static $() {
    return ["ComposerEnhancerClientMessage|1 request #0 message|2 tool_result #1 message", ComposerEnhancerRequest, ComposerEnhancerToolResult];
  }
};
var ComposerEnhancerServerMessage = class _ComposerEnhancerServerMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerServerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerServerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerServerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerServerMessage, a, b2);
  }
  static $() {
    return ["ComposerEnhancerServerMessage|1 response #0 message|2 tool_call #1 message", ComposerEnhancerResponse, ComposerEnhancerToolCall];
  }
};
var ComposerEnhancerRequest = class _ComposerEnhancerRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.inputText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerRequest, a, b2);
  }
  static $() {
    return ["ComposerEnhancerRequest|1 input_text 9|2 composer_id 9?"];
  }
};
var ComposerEnhancerResponse = class _ComposerEnhancerResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.improvedText = "";
    this.isFinal = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerResponse, a, b2);
  }
  static $() {
    return ["ComposerEnhancerResponse|1 improved_text 9|2 is_final 8"];
  }
};
var ComposerEnhancerToolCall = class _ComposerEnhancerToolCall extends __protoMessage3124 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.toolName = "";
    this.toolArgs = "";
    this.toolIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerToolCall, a, b2);
  }
  static $() {
    return ["ComposerEnhancerToolCall|1 tool_call_id 9|2 tool_name 9|3 tool_args 9|4 tool_index 5"];
  }
};
var ComposerEnhancerToolResult = class _ComposerEnhancerToolResult extends __protoMessage3124 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.result = "";
    this.isError = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ComposerEnhancerToolResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ComposerEnhancerToolResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ComposerEnhancerToolResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ComposerEnhancerToolResult, a, b2);
  }
  static $() {
    return ["ComposerEnhancerToolResult|1 tool_call_id 9|2 result 9|3 is_error 8"];
  }
};
var FindBugsRequest = class _FindBugsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindBugsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindBugsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindBugsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindBugsRequest, a, b2);
  }
  static $() {
    return ["FindBugsRequest|1 current_file #0|2 model_details #1", CurrentFileInfo, ModelDetails];
  }
};
var FindBugsResponse = class _FindBugsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindBugsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindBugsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindBugsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindBugsResponse, a, b2);
  }
  static $() {
    return ["FindBugsResponse|1 bug #0?", FindBugsResponse_Bug];
  }
};
var FindBugsResponse_Bug = class _FindBugsResponse_Bug extends __protoMessage3124 {
  constructor(data) {
    super();
    this.description = "";
    this.lineNumber = 0;
    this.confidence = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindBugsResponse_Bug().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindBugsResponse_Bug().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindBugsResponse_Bug().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindBugsResponse_Bug, a, b2);
  }
  static $() {
    return ["FindBugsResponse.Bug|1 description 9|2 line_number 5|3 confidence 2"];
  }
};
var WriteGitCommitMessageRequest = class _WriteGitCommitMessageRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffs = [];
    this.previousCommitMessages = [];
    this.credentials = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteGitCommitMessageRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteGitCommitMessageRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteGitCommitMessageRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteGitCommitMessageRequest, a, b2);
  }
  static $() {
    return ["WriteGitCommitMessageRequest|1 diffs 9*|2 previous_commit_messages 9*|3 explicit_context #0|4 api_key_credentials #1 credentials|5 azure_credentials #2 credentials|6 bedrock_credentials #3 credentials", ExplicitContext, ApiKeyCredentials, AzureCredentials, BedrockCredentials];
  }
};
var WriteGitCommitMessageResponse = class _WriteGitCommitMessageResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.commitMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteGitCommitMessageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteGitCommitMessageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteGitCommitMessageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteGitCommitMessageResponse, a, b2);
  }
  static $() {
    return ["WriteGitCommitMessageResponse|1 commit_message 9"];
  }
};
var WriteGitBranchNameRequest = class _WriteGitBranchNameRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffs = "";
    this.credentials = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteGitBranchNameRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteGitBranchNameRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteGitBranchNameRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteGitBranchNameRequest, a, b2);
  }
  static $() {
    return ["WriteGitBranchNameRequest|1 diffs 9|2 context 9?|3 conversation_id 9?|4 api_key_credentials #0 credentials|5 azure_credentials #1 credentials|6 bedrock_credentials #2 credentials", ApiKeyCredentials, AzureCredentials, BedrockCredentials];
  }
};
var WriteGitBranchNameResponse = class _WriteGitBranchNameResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteGitBranchNameResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteGitBranchNameResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteGitBranchNameResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteGitBranchNameResponse, a, b2);
  }
  static $() {
    return ["WriteGitBranchNameResponse|1 branch_name 9"];
  }
};
var KeepComposerCacheWarmRequest = class _KeepComposerCacheWarmRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.isComposerVisible = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeepComposerCacheWarmRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeepComposerCacheWarmRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeepComposerCacheWarmRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeepComposerCacheWarmRequest, a, b2);
  }
  static $() {
    return ["KeepComposerCacheWarmRequest|1 request #0|2 request_id 9|3 is_composer_visible 8", GetComposerChatRequest];
  }
};
var KeepComposerCacheWarmResponse = class _KeepComposerCacheWarmResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.didKeepWarm = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KeepComposerCacheWarmResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KeepComposerCacheWarmResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KeepComposerCacheWarmResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KeepComposerCacheWarmResponse, a, b2);
  }
  static $() {
    return ["KeepComposerCacheWarmResponse|1 did_keep_warm 8"];
  }
};
var GetDiffReviewRequest = class _GetDiffReviewRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.diffs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffReviewRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffReviewRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffReviewRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffReviewRequest, a, b2);
  }
  static $() {
    return ["GetDiffReviewRequest|1 diffs #0*|2 model 9?", GetDiffReviewRequest_SimpleFileDiff];
  }
};
var GetDiffReviewRequest_SimpleFileDiff = class _GetDiffReviewRequest_SimpleFileDiff extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.chunks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffReviewRequest_SimpleFileDiff, a, b2);
  }
  static $() {
    return ["GetDiffReviewRequest.SimpleFileDiff|1 relative_workspace_path 9|2 chunks #0*", GetDiffReviewRequest_SimpleFileDiff_Chunk];
  }
};
var GetDiffReviewRequest_SimpleFileDiff_Chunk = class _GetDiffReviewRequest_SimpleFileDiff_Chunk extends __protoMessage3124 {
  constructor(data) {
    super();
    this.oldLines = [];
    this.newLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff_Chunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff_Chunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDiffReviewRequest_SimpleFileDiff_Chunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDiffReviewRequest_SimpleFileDiff_Chunk, a, b2);
  }
  static $() {
    return ["GetDiffReviewRequest.SimpleFileDiff.Chunk|1 old_lines 9*|2 new_lines 9*|3 old_range #0|4 new_range #0", LineRange];
  }
};
var StreamDiffReviewResponse = class _StreamDiffReviewResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamDiffReviewResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamDiffReviewResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamDiffReviewResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamDiffReviewResponse, a, b2);
  }
  static $() {
    return ["StreamDiffReviewResponse|1 text 9 response|2 groups #0 response", SemanticDiffGroups];
  }
};
var SemanticDiffGroups = class _SemanticDiffGroups extends __protoMessage3124 {
  constructor(data) {
    super();
    this.groups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemanticDiffGroups().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemanticDiffGroups().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemanticDiffGroups().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemanticDiffGroups, a, b2);
  }
  static $() {
    return ["SemanticDiffGroups|1 groups #0*|2 summary 9?", SemanticDiffGroup];
  }
};
var SemanticDiffGroup = class _SemanticDiffGroup extends __protoMessage3124 {
  constructor(data) {
    super();
    this.description = "";
    this.diffs = [];
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemanticDiffGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemanticDiffGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemanticDiffGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemanticDiffGroup, a, b2);
  }
  static $() {
    return ["SemanticDiffGroup|1 description 9|2 diffs #0*|3 title 9", SemanticDiffReference];
  }
};
var SemanticDiffReference = class _SemanticDiffReference extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.chunkIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemanticDiffReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemanticDiffReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemanticDiffReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemanticDiffReference, a, b2);
  }
  static $() {
    return ["SemanticDiffReference|1 relative_workspace_path 9|2 chunk_index 5"];
  }
};
var StreamDiffReviewByFileResponse = class _StreamDiffReviewByFileResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.response = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamDiffReviewByFileResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamDiffReviewByFileResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamDiffReviewByFileResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamDiffReviewByFileResponse, a, b2);
  }
  static $() {
    return ["StreamDiffReviewByFileResponse|1 text 9 response|2 groups #0 response", SemanticFileGroups];
  }
};
var SemanticFileGroups = class _SemanticFileGroups extends __protoMessage3124 {
  constructor(data) {
    super();
    this.groups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemanticFileGroups().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemanticFileGroups().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemanticFileGroups().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemanticFileGroups, a, b2);
  }
  static $() {
    return ["SemanticFileGroups|1 groups #0*|2 summary 9?", SemanticFileGroup];
  }
};
var SemanticFileGroup = class _SemanticFileGroup extends __protoMessage3124 {
  constructor(data) {
    super();
    this.title = "";
    this.description = "";
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemanticFileGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemanticFileGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemanticFileGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemanticFileGroup, a, b2);
  }
  static $() {
    return ["SemanticFileGroup|1 title 9|2 description 9|3 files 9*"];
  }
};
var CountTokensRequest = class _CountTokensRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.contextItems = [];
    this.modelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CountTokensRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CountTokensRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CountTokensRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CountTokensRequest, a, b2);
  }
  static $() {
    return ["CountTokensRequest|1 context_items #0*|2 model_name 9", ContextItem];
  }
};
var ContextItemTokenDetail = class _ContextItemTokenDetail extends __protoMessage3124 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.count = 0;
    this.lineCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ContextItemTokenDetail().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ContextItemTokenDetail().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ContextItemTokenDetail().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ContextItemTokenDetail, a, b2);
  }
  static $() {
    return ["ContextItemTokenDetail|1 relative_workspace_path 9|2 count 5|3 line_count 5"];
  }
};
var CountTokensResponse = class _CountTokensResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.count = 0;
    this.tokenDetails = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CountTokensResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CountTokensResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CountTokensResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CountTokensResponse, a, b2);
  }
  static $() {
    return ["CountTokensResponse|1 count 5|2 token_details #0*", ContextItemTokenDetail];
  }
};
var GetModelLabelsRequest = class _GetModelLabelsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetModelLabelsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetModelLabelsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetModelLabelsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetModelLabelsRequest, a, b2);
  }
  static $() {
    return ["GetModelLabelsRequest"];
  }
};
var GetModelLabelsResponse = class _GetModelLabelsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.modelLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetModelLabelsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetModelLabelsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetModelLabelsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetModelLabelsResponse, a, b2);
  }
  static $() {
    return ["GetModelLabelsResponse|1 model_labels #0*", GetModelLabelsResponse_ModelLabel];
  }
};
var GetModelLabelsResponse_ModelLabel = class _GetModelLabelsResponse_ModelLabel extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetModelLabelsResponse_ModelLabel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetModelLabelsResponse_ModelLabel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetModelLabelsResponse_ModelLabel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetModelLabelsResponse_ModelLabel, a, b2);
  }
  static $() {
    return ["GetModelLabelsResponse.ModelLabel|1 name 9|2 label 9|3 short_label 9?|4 supports_agent 8?"];
  }
};
var GetLastDefaultModelNudgeRequest = class _GetLastDefaultModelNudgeRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLastDefaultModelNudgeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLastDefaultModelNudgeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLastDefaultModelNudgeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLastDefaultModelNudgeRequest, a, b2);
  }
  static $() {
    return ["GetLastDefaultModelNudgeRequest"];
  }
};
var GetLastDefaultModelNudgeResponse = class _GetLastDefaultModelNudgeResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.nudgeDate = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLastDefaultModelNudgeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLastDefaultModelNudgeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLastDefaultModelNudgeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLastDefaultModelNudgeResponse, a, b2);
  }
  static $() {
    return ["GetLastDefaultModelNudgeResponse|1 nudge_date 9"];
  }
};
var GetDefaultModelNudgeDataRequest = class _GetDefaultModelNudgeDataRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.startupOpportunity = GetDefaultModelNudgeDataRequest_StartupOpportunity.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelNudgeDataRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelNudgeDataRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelNudgeDataRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelNudgeDataRequest, a, b2);
  }
  static $() {
    return ["GetDefaultModelNudgeDataRequest|1 startup_opportunity #0|2 current_model #1", GetDefaultModelNudgeDataRequest_StartupOpportunity, RequestedModel];
  }
};
var GetDefaultModelNudgeDataRequest_StartupOpportunity = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "GetDefaultModelNudgeDataRequest.StartupOpportunity", [[0, "UNSPECIFIED"], [1, "FIRST_OPEN"], [2, "REOPEN"]], 1);
var GetDefaultModelNudgeDataResponse = class _GetDefaultModelNudgeDataResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.nudgeDate = "";
    this.shouldDefaultSwitchOnNewChat = false;
    this.modelsWithNoDefaultSwitch = [];
    this.conversionModelOverride = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelNudgeDataResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelNudgeDataResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelNudgeDataResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelNudgeDataResponse, a, b2);
  }
  static $() {
    return ["GetDefaultModelNudgeDataResponse|1 nudge_date 9|2 should_default_switch_on_new_chat 8|3 models_with_no_default_switch 9*|4 conversion_model_override 9|5 initial_model #0|6 application_open_model_switch #1", GetDefaultModelNudgeDataResponse_InitialModel, GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch];
  }
};
var GetDefaultModelNudgeDataResponse_InitialModel = class _GetDefaultModelNudgeDataResponse_InitialModel extends __protoMessage3124 {
  constructor(data) {
    super();
    this.modelId = "";
    this.parameters = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelNudgeDataResponse_InitialModel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelNudgeDataResponse_InitialModel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelNudgeDataResponse_InitialModel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelNudgeDataResponse_InitialModel, a, b2);
  }
  static $() {
    return ["GetDefaultModelNudgeDataResponse.InitialModel|1 model_id 9|2 parameters #0*", RequestedModel_ModelParameterValue];
  }
};
var GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch = class _GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch extends __protoMessage3124 {
  constructor(data) {
    super();
    this.nudgeId = "";
    this.experimentName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelNudgeDataResponse_ApplicationOpenModelSwitch, a, b2);
  }
  static $() {
    return ["GetDefaultModelNudgeDataResponse.ApplicationOpenModelSwitch|1 nudge_id 9|2 experiment_name 9|3 target_model #0", GetDefaultModelNudgeDataResponse_InitialModel];
  }
};
var GetDefaultModelRequest = class _GetDefaultModelRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelRequest, a, b2);
  }
  static $() {
    return ["GetDefaultModelRequest"];
  }
};
var GetDefaultModelResponse = class _GetDefaultModelResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.model = "";
    this.thinkingModel = "";
    this.maxMode = false;
    this.nextDefaultSetDate = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetDefaultModelResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetDefaultModelResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetDefaultModelResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetDefaultModelResponse, a, b2);
  }
  static $() {
    return ["GetDefaultModelResponse|1 model 9|2 thinking_model 9|3 max_mode 8|4 next_default_set_date 9"];
  }
};
var CloudSetupBlockerAction = class _CloudSetupBlockerAction extends __protoMessage3124 {
  constructor(data) {
    super();
    this.action = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudSetupBlockerAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudSetupBlockerAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudSetupBlockerAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudSetupBlockerAction, a, b2);
  }
  static $() {
    return ["CloudSetupBlockerAction|1 url 9 action|2 open_privacy_settings #0 action|3 open_github_connect #0 action|4 open_repo_picker #0 action", Empty];
  }
};
var CloudSetupBlocker = class _CloudSetupBlocker extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.icon = "";
    this.ctaLabel = "";
    this.checklistTitle = "";
    this.checklistDescription = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CloudSetupBlocker().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CloudSetupBlocker().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CloudSetupBlocker().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CloudSetupBlocker, a, b2);
  }
  static $() {
    return ["CloudSetupBlocker|1 id 9|2 icon 9|3 action #0|4 cta_label 9|7 checklist_title 9|8 checklist_description 9", CloudSetupBlockerAction];
  }
};
var GetCloudSetupBlockersRequest = class _GetCloudSetupBlockersRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.selectedTargetRepoUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudSetupBlockersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudSetupBlockersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudSetupBlockersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudSetupBlockersRequest, a, b2);
  }
  static $() {
    return ["GetCloudSetupBlockersRequest|1 selected_target_repo_url 9"];
  }
};
var GetCloudSetupBlockersResponse = class _GetCloudSetupBlockersResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pending = [];
    this.completed = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCloudSetupBlockersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCloudSetupBlockersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCloudSetupBlockersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCloudSetupBlockersResponse, a, b2);
  }
  static $() {
    return ["GetCloudSetupBlockersResponse|1 pending #0*|2 completed #0*", CloudSetupBlocker];
  }
};
var TestBedrockCredentialsRequest = class _TestBedrockCredentialsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.accessKey = "";
    this.secretKey = "";
    this.region = "";
    this.modelName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestBedrockCredentialsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestBedrockCredentialsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestBedrockCredentialsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestBedrockCredentialsRequest, a, b2);
  }
  static $() {
    return ["TestBedrockCredentialsRequest|1 access_key 9|2 secret_key 9|3 region 9|4 model_name 9"];
  }
};
var TestBedrockCredentialsResponse = class _TestBedrockCredentialsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TestBedrockCredentialsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TestBedrockCredentialsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TestBedrockCredentialsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TestBedrockCredentialsResponse, a, b2);
  }
  static $() {
    return ["TestBedrockCredentialsResponse|1 success 8|2 error 9?"];
  }
};
var CommitLineRange = class _CommitLineRange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.start = 0;
    this.end = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitLineRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitLineRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitLineRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitLineRange, a, b2);
  }
  static $() {
    return ["CommitLineRange|1 start 5|2 end 5|3 absolute_start 5?|4 absolute_end 5?"];
  }
};
var RangeGroup = class _RangeGroup extends __protoMessage3124 {
  constructor(data) {
    super();
    this.operationType = "";
    this.ranges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RangeGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RangeGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RangeGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RangeGroup, a, b2);
  }
  static $() {
    return ["RangeGroup|1 conversation_id 9?|2 model 9?|3 operation_type 9|4 ranges #0*|5 request_id 9?", CommitLineRange];
  }
};
var FileRangeAnnotations = class _FileRangeAnnotations extends __protoMessage3124 {
  constructor(data) {
    super();
    this.filePath = "";
    this.groups = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FileRangeAnnotations().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FileRangeAnnotations().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FileRangeAnnotations().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FileRangeAnnotations, a, b2);
  }
  static $() {
    return ["FileRangeAnnotations|1 file_path 9|2 groups #0*", RangeGroup];
  }
};
var ReportCommitAiAnalyticsRequest = class _ReportCommitAiAnalyticsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.commitHash = "";
    this.totalLinesAdded = 0;
    this.totalLinesDeleted = 0;
    this.tabLinesAdded = 0;
    this.tabLinesDeleted = 0;
    this.composerLinesAdded = 0;
    this.composerLinesDeleted = 0;
    this.nonAiLinesAdded = 0;
    this.nonAiLinesDeleted = 0;
    this.changeIds = [];
    this.rangeAnnotations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportCommitAiAnalyticsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportCommitAiAnalyticsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportCommitAiAnalyticsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportCommitAiAnalyticsRequest, a, b2);
  }
  static $() {
    return ["ReportCommitAiAnalyticsRequest|1 commit_hash 9|2 total_lines_added 5|3 total_lines_deleted 5|4 tab_lines_added 5|5 tab_lines_deleted 5|6 composer_lines_added 5|7 composer_lines_deleted 5|8 branch_name 9?|9 is_primary_branch 8?|10 repo_name 9?|11 non_ai_lines_added 5|12 non_ai_lines_deleted 5|13 change_ids 9*|14 message 9?|15 commit_ts 3?|16 range_annotations #0*|17 commit_source 9?", FileRangeAnnotations];
  }
};
var ReportCommitAiAnalyticsResponse = class _ReportCommitAiAnalyticsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportCommitAiAnalyticsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportCommitAiAnalyticsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportCommitAiAnalyticsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportCommitAiAnalyticsResponse, a, b2);
  }
  static $() {
    return ["ReportCommitAiAnalyticsResponse"];
  }
};
var ReportAiCodeChangeMetricsRequest = class _ReportAiCodeChangeMetricsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.changes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAiCodeChangeMetricsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAiCodeChangeMetricsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAiCodeChangeMetricsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAiCodeChangeMetricsRequest, a, b2);
  }
  static $() {
    return ["ReportAiCodeChangeMetricsRequest|1 changes #0*", AiCodeChange];
  }
};
var AiCodeChange = class _AiCodeChange extends __protoMessage3124 {
  constructor(data) {
    super();
    this.changeId = "";
    this.source = "";
    this.metadata = [];
    this.totalLinesAdded = 0;
    this.totalLinesDeleted = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AiCodeChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AiCodeChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AiCodeChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AiCodeChange, a, b2);
  }
  static $() {
    return ["AiCodeChange|1 change_id 9|2 source 9|3 metadata #0*|4 model 9?|5 total_lines_added 5|6 total_lines_deleted 5", ScoredAiCodeMetadata];
  }
};
var ReportAiCodeChangeMetricsResponse = class _ReportAiCodeChangeMetricsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportAiCodeChangeMetricsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportAiCodeChangeMetricsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportAiCodeChangeMetricsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportAiCodeChangeMetricsResponse, a, b2);
  }
  static $() {
    return ["ReportAiCodeChangeMetricsResponse"];
  }
};
var ReportProcessMetricsRequest = class _ReportProcessMetricsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sampleStart = protoInt64.zero;
    this.sampleEnd = protoInt64.zero;
    this.numSubsamples = 0;
    this.windowSeq = protoInt64.zero;
    this.sessionId = "";
    this.rows = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportProcessMetricsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportProcessMetricsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportProcessMetricsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportProcessMetricsRequest, a, b2);
  }
  static $() {
    return ["ReportProcessMetricsRequest|1 sample_start 3|2 sample_end 3|3 num_subsamples 5|4 window_seq 3|5 session_id 9|6 rows #0*|7 os 9?|8 os_version 9?|9 arch 9?|10 client_version 9?|11 client_id 9?", ProcessMetricsRowRequest];
  }
};
var ProcessMetricsRowRequest = class _ProcessMetricsRowRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pid = 0;
    this.ppid = 0;
    this.name = "";
    this.extensionId = "";
    this.cpuTimeMsSample = protoInt64.zero;
    this.sampleAvgMemMb = 0;
    this.samplePeakMemMb = 0;
    this.sessionPeakMemMb = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProcessMetricsRowRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProcessMetricsRowRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProcessMetricsRowRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProcessMetricsRowRequest, a, b2);
  }
  static $() {
    return ["ProcessMetricsRowRequest|1 pid 5|2 ppid 5|3 name 9|4 extension_id 9|5 cpu_time_ms_sample 3|6 sample_avg_mem_mb 1|7 sample_peak_mem_mb 1|8 session_peak_mem_mb 1|9 process_name_hash 9?"];
  }
};
var ReportProcessMetricsResponse = class _ReportProcessMetricsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportProcessMetricsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportProcessMetricsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportProcessMetricsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportProcessMetricsResponse, a, b2);
  }
  static $() {
    return ["ReportProcessMetricsResponse"];
  }
};
var ReportProcessMetricsV2Request = class _ReportProcessMetricsV2Request extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sampleStart = protoInt64.zero;
    this.sampleEnd = protoInt64.zero;
    this.numSubsamples = 0;
    this.sessionId = "";
    this.rows = [];
    this.os = "";
    this.arch = "";
    this.clientVersion = "";
    this.origin = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportProcessMetricsV2Request().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportProcessMetricsV2Request().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportProcessMetricsV2Request().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportProcessMetricsV2Request, a, b2);
  }
  static $() {
    return ["ReportProcessMetricsV2Request|1 sample_start 3|2 sample_end 3|3 num_subsamples 5|4 session_id 9|5 rows #0*|6 os 9|7 arch 9|8 client_version 9|9 origin 9", ProcessMetricsV2RowRequest];
  }
};
var ProcessMetricsV2RowRequest = class _ProcessMetricsV2RowRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pid = 0;
    this.ppid = 0;
    this.processName = "";
    this.extensionId = "";
    this.processNameHash = "";
    this.sampleCpuTimeMs = protoInt64.zero;
    this.sampleAvgMemMb = 0;
    this.samplePeakMemMb = 0;
    this.sessionPeakMemMb = 0;
    this.memoryDuringSamplePeakMb = 0;
    this.cpuDuringSamplePeakPct = 0;
    this.argv = [];
    this.ownerAgentId = "";
    this.requestId = "";
    this.rendererRole = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ProcessMetricsV2RowRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ProcessMetricsV2RowRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ProcessMetricsV2RowRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ProcessMetricsV2RowRequest, a, b2);
  }
  static $() {
    return ["ProcessMetricsV2RowRequest|1 pid 5|2 ppid 5|3 process_name 9|4 extension_id 9|5 process_name_hash 9|6 sample_cpu_time_ms 3|7 sample_avg_mem_mb 1|8 sample_peak_mem_mb 1|9 session_peak_mem_mb 1|10 memory_during_sample_peak_mb 1|11 cpu_during_sample_peak_pct 1|12 argv 9*|13 owner_agent_id 9|14 request_id 9|15 renderer_role 9"];
  }
};
var ReportProcessMetricsV2Response = class _ReportProcessMetricsV2Response extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportProcessMetricsV2Response().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportProcessMetricsV2Response().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportProcessMetricsV2Response().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportProcessMetricsV2Response, a, b2);
  }
  static $() {
    return ["ReportProcessMetricsV2Response"];
  }
};
var ReportSandProcessMetricsRequest = class _ReportSandProcessMetricsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.sampleStart = protoInt64.zero;
    this.sampleEnd = protoInt64.zero;
    this.numSubsamples = 0;
    this.sampleSeqno = protoInt64.zero;
    this.sessionId = "";
    this.rows = [];
    this.os = "";
    this.osVersion = "";
    this.arch = "";
    this.clientVersion = "";
    this.clientId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportSandProcessMetricsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportSandProcessMetricsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportSandProcessMetricsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportSandProcessMetricsRequest, a, b2);
  }
  static $() {
    return ["ReportSandProcessMetricsRequest|1 sample_start 3|2 sample_end 3|3 num_subsamples 5|4 sample_seqno 3|5 session_id 9|6 rows #0*|7 os 9|8 os_version 9|9 arch 9|10 client_version 9|11 client_id 9", SandProcessMetricsRowRequest];
  }
};
var SandProcessMetricsRowRequest = class _SandProcessMetricsRowRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pid = 0;
    this.ppid = 0;
    this.processName = "";
    this.processNameHash = "";
    this.sampleCpuTimeMs = protoInt64.zero;
    this.sampleAvgMemMb = 0;
    this.samplePeakMemMb = 0;
    this.sessionPeakMemMb = 0;
    this.memoryDuringSamplePeakMb = 0;
    this.cpuDuringSamplePeakPct = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SandProcessMetricsRowRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SandProcessMetricsRowRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SandProcessMetricsRowRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SandProcessMetricsRowRequest, a, b2);
  }
  static $() {
    return ["SandProcessMetricsRowRequest|1 pid 5|2 ppid 5|3 process_name 9|4 process_name_hash 9|5 sample_cpu_time_ms 3|6 sample_avg_mem_mb 1|7 sample_peak_mem_mb 1|8 session_peak_mem_mb 1|9 memory_during_sample_peak_mb 1|10 cpu_during_sample_peak_pct 1"];
  }
};
var ReportSandProcessMetricsResponse = class _ReportSandProcessMetricsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportSandProcessMetricsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportSandProcessMetricsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportSandProcessMetricsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportSandProcessMetricsResponse, a, b2);
  }
  static $() {
    return ["ReportSandProcessMetricsResponse"];
  }
};
var ReportClientNumericMetricsRequest = class _ReportClientNumericMetricsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.metrics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportClientNumericMetricsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportClientNumericMetricsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportClientNumericMetricsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportClientNumericMetricsRequest, a, b2);
  }
  static $() {
    return ["ReportClientNumericMetricsRequest|1 metrics #0*", ClientNumericMetric];
  }
};
var ClientNumericMetric = class _ClientNumericMetric extends __protoMessage3124 {
  constructor(data) {
    super();
    this.metric = "";
    this.value = 0;
    this.timestampMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClientNumericMetric().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClientNumericMetric().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClientNumericMetric().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClientNumericMetric, a, b2);
  }
  static $() {
    return ["ClientNumericMetric|1 metric 9|2 value 1|3 session_id 9?|4 ff_hash 9?|5 timestamp_ms 3|6 client_version 9?|7 os 9?|8 enabled_extensions_hash 9?|9 ff_resolved 9?|10 extensions_resolved 9?|11 window_type 9?"];
  }
};
var ReportClientNumericMetricsResponse = class _ReportClientNumericMetricsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportClientNumericMetricsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportClientNumericMetricsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportClientNumericMetricsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportClientNumericMetricsResponse, a, b2);
  }
  static $() {
    return ["ReportClientNumericMetricsResponse"];
  }
};
var PotentiallyGenerateMemoryRequest = class _PotentiallyGenerateMemoryRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.conversation = [];
    this.composerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentiallyGenerateMemoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentiallyGenerateMemoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentiallyGenerateMemoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentiallyGenerateMemoryRequest, a, b2);
  }
  static $() {
    return ["PotentiallyGenerateMemoryRequest|1 request_id 9|2 conversation #0*|3 git_upstream_url 9?|4 composer_id 9", ConversationMessage];
  }
};
var PotentiallyGenerateMemoryResponse = class _PotentiallyGenerateMemoryResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PotentiallyGenerateMemoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PotentiallyGenerateMemoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PotentiallyGenerateMemoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PotentiallyGenerateMemoryResponse, a, b2);
  }
  static $() {
    return ["PotentiallyGenerateMemoryResponse|1 saved_memory 9?|2 knowledge_id 9?|3 title 9?"];
  }
};
var KnowledgeBaseAddRequest = class _KnowledgeBaseAddRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.knowledge = "";
    this.title = "";
    this.gitOrigin = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseAddRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseAddRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseAddRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseAddRequest, a, b2);
  }
  static $() {
    return ["KnowledgeBaseAddRequest|1 knowledge 9|2 title 9|3 git_origin 9|4 composer_id 9?"];
  }
};
var KnowledgeBaseAddResponse = class _KnowledgeBaseAddResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseAddResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseAddResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseAddResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseAddResponse, a, b2);
  }
  static $() {
    return ["KnowledgeBaseAddResponse|1 success 8|2 id 9"];
  }
};
var KnowledgeBaseRemoveRequest = class _KnowledgeBaseRemoveRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseRemoveRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseRemoveRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseRemoveRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseRemoveRequest, a, b2);
  }
  static $() {
    return ["KnowledgeBaseRemoveRequest|1 id 9"];
  }
};
var KnowledgeBaseRemoveResponse = class _KnowledgeBaseRemoveResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseRemoveResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseRemoveResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseRemoveResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseRemoveResponse, a, b2);
  }
  static $() {
    return ["KnowledgeBaseRemoveResponse|1 success 8"];
  }
};
var KnowledgeBaseUpdateRequest = class _KnowledgeBaseUpdateRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.knowledge = "";
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseUpdateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseUpdateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseUpdateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseUpdateRequest, a, b2);
  }
  static $() {
    return ["KnowledgeBaseUpdateRequest|1 id 9|2 knowledge 9|3 title 9"];
  }
};
var KnowledgeBaseUpdateResponse = class _KnowledgeBaseUpdateResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseUpdateResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseUpdateResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseUpdateResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseUpdateResponse, a, b2);
  }
  static $() {
    return ["KnowledgeBaseUpdateResponse|1 success 8"];
  }
};
var KnowledgeBaseListRequest = class _KnowledgeBaseListRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseListRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseListRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseListRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseListRequest, a, b2);
  }
  static $() {
    return ["KnowledgeBaseListRequest|1 limit 5?|2 git_origin 9?"];
  }
};
var KnowledgeBaseListResponse = class _KnowledgeBaseListResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.success = false;
    this.allResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseListResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseListResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseListResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseListResponse, a, b2);
  }
  static $() {
    return ["KnowledgeBaseListResponse|1 success 8|2 all_results #0*", KnowledgeBaseListResponse_Item];
  }
};
var KnowledgeBaseListResponse_Item = class _KnowledgeBaseListResponse_Item extends __protoMessage3124 {
  constructor(data) {
    super();
    this.id = "";
    this.knowledge = "";
    this.title = "";
    this.createdAt = "";
    this.isGenerated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _KnowledgeBaseListResponse_Item().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _KnowledgeBaseListResponse_Item().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _KnowledgeBaseListResponse_Item().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_KnowledgeBaseListResponse_Item, a, b2);
  }
  static $() {
    return ["KnowledgeBaseListResponse.Item|1 id 9|2 knowledge 9|3 title 9|4 created_at 9|5 is_generated 8"];
  }
};
var FetchRelevantKnowledgeForConversationRequest = class _FetchRelevantKnowledgeForConversationRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.requestId = "";
    this.conversation = [];
    this.taggedFilenames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchRelevantKnowledgeForConversationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchRelevantKnowledgeForConversationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchRelevantKnowledgeForConversationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchRelevantKnowledgeForConversationRequest, a, b2);
  }
  static $() {
    return ["FetchRelevantKnowledgeForConversationRequest|1 request_id 9|2 conversation #0*|3 git_origin 9?|4 limit 5?|5 tagged_filenames 9*", ConversationMessage];
  }
};
var FetchRelevantKnowledgeForConversationResponse = class _FetchRelevantKnowledgeForConversationResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.knowledgeItems = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FetchRelevantKnowledgeForConversationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FetchRelevantKnowledgeForConversationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FetchRelevantKnowledgeForConversationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FetchRelevantKnowledgeForConversationResponse, a, b2);
  }
  static $() {
    return ["FetchRelevantKnowledgeForConversationResponse|1 knowledge_items #0*", ConversationMessage_KnowledgeItem];
  }
};
var InferBackgroundComposerScriptsRequest = class _InferBackgroundComposerScriptsRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.commands = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InferBackgroundComposerScriptsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InferBackgroundComposerScriptsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InferBackgroundComposerScriptsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InferBackgroundComposerScriptsRequest, a, b2);
  }
  static $() {
    return ["InferBackgroundComposerScriptsRequest|1 commands #0*", InferBackgroundComposerScriptsRequest_Command];
  }
};
var InferBackgroundComposerScriptsRequest_Command = class _InferBackgroundComposerScriptsRequest_Command extends __protoMessage3124 {
  constructor(data) {
    super();
    this.command = "";
    this.timestamp = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InferBackgroundComposerScriptsRequest_Command().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InferBackgroundComposerScriptsRequest_Command().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InferBackgroundComposerScriptsRequest_Command().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InferBackgroundComposerScriptsRequest_Command, a, b2);
  }
  static $() {
    return ["InferBackgroundComposerScriptsRequest.Command|1 command 9|2 timestamp 2|3 cwd 9?"];
  }
};
var InferBackgroundComposerScriptsResponse = class _InferBackgroundComposerScriptsResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.installScript = "";
    this.startScript = "";
    this.terminals = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InferBackgroundComposerScriptsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InferBackgroundComposerScriptsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InferBackgroundComposerScriptsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InferBackgroundComposerScriptsResponse, a, b2);
  }
  static $() {
    return ["InferBackgroundComposerScriptsResponse|1 install_script 9|2 start_script 9|3 terminals #0*", InferBackgroundComposerScriptsResponse_Terminal];
  }
};
var InferBackgroundComposerScriptsResponse_Terminal = class _InferBackgroundComposerScriptsResponse_Terminal extends __protoMessage3124 {
  constructor(data) {
    super();
    this.name = "";
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InferBackgroundComposerScriptsResponse_Terminal().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InferBackgroundComposerScriptsResponse_Terminal().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InferBackgroundComposerScriptsResponse_Terminal().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InferBackgroundComposerScriptsResponse_Terminal, a, b2);
  }
  static $() {
    return ["InferBackgroundComposerScriptsResponse.Terminal|1 name 9|2 command 9"];
  }
};
var GetBackgroundComposerFeedbackLinkRequest = class _GetBackgroundComposerFeedbackLinkRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerFeedbackLinkRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerFeedbackLinkRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerFeedbackLinkRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerFeedbackLinkRequest, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerFeedbackLinkRequest"];
  }
};
var GetBackgroundComposerFeedbackLinkResponse = class _GetBackgroundComposerFeedbackLinkResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBackgroundComposerFeedbackLinkResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBackgroundComposerFeedbackLinkResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBackgroundComposerFeedbackLinkResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBackgroundComposerFeedbackLinkResponse, a, b2);
  }
  static $() {
    return ["GetBackgroundComposerFeedbackLinkResponse|1 url 9"];
  }
};
var ScoredAiCodeMetadata = class _ScoredAiCodeMetadata extends __protoMessage3124 {
  constructor(data) {
    super();
    this.fileExtension = "";
    this.linesAdded = 0;
    this.linesDeleted = 0;
    this.changeHashes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ScoredAiCodeMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ScoredAiCodeMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ScoredAiCodeMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ScoredAiCodeMetadata, a, b2);
  }
  static $() {
    return ["ScoredAiCodeMetadata|1 file_extension 9|2 lines_added 5|3 lines_deleted 5|5 change_hashes 9*|4 file_name 9?"];
  }
};
var SttConfig = class _SttConfig extends __protoMessage3124 {
  constructor(data) {
    super();
    this.keyterms = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SttConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SttConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SttConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SttConfig, a, b2);
  }
  static $() {
    return ["SttConfig|1 language 9?|3 keyterms 9*"];
  }
};
var SttAudioChunk = class _SttAudioChunk extends __protoMessage3124 {
  constructor(data) {
    super();
    this.pcm16 = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SttAudioChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SttAudioChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SttAudioChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SttAudioChunk, a, b2);
  }
  static $() {
    return ["SttAudioChunk|1 pcm16 12"];
  }
};
var SttControl = class _SttControl extends __protoMessage3124 {
  constructor(data) {
    super();
    this.type = SttControl_Type.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SttControl().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SttControl().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SttControl().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SttControl, a, b2);
  }
  static $() {
    return ["SttControl|1 type #0", SttControl_Type];
  }
};
var SttControl_Type = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "SttControl.Type", [[0, "UNSPECIFIED"], [1, "STOP"], [2, "CANCEL"]], 1);
var SttClientMessage = class _SttClientMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.payload = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SttClientMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SttClientMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SttClientMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SttClientMessage, a, b2);
  }
  static $() {
    return ["SttClientMessage|1 config #0 payload|2 audio #1 payload|3 control #2 payload", SttConfig, SttAudioChunk, SttControl];
  }
};
var SttServerMessage = class _SttServerMessage extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.isFinal = false;
    this.kind = SttServerMessage_Kind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SttServerMessage().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SttServerMessage().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SttServerMessage().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SttServerMessage, a, b2);
  }
  static $() {
    return ["SttServerMessage|1 text 9|2 is_final 8|3 kind #0", SttServerMessage_Kind];
  }
};
var SttServerMessage_Kind = /* @__PURE__ */ enumType2(proto3, __protoPackage126, "SttServerMessage.Kind", [[0, "UNSPECIFIED"], [1, "PARTIAL"], [2, "SEGMENT"], [3, "FINAL"]], 1);
var TranscribeAudioRequest = class _TranscribeAudioRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.audio = new Uint8Array(0);
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TranscribeAudioRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TranscribeAudioRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TranscribeAudioRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TranscribeAudioRequest, a, b2);
  }
  static $() {
    return ["TranscribeAudioRequest|1 audio 12|2 mime_type 9|3 language 9?"];
  }
};
var TranscribeAudioResponse = class _TranscribeAudioResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    this.transcriptionTimeMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TranscribeAudioResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TranscribeAudioResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TranscribeAudioResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TranscribeAudioResponse, a, b2);
  }
  static $() {
    return ["TranscribeAudioResponse|1 text 9|2 transcription_time_ms 3"];
  }
};
var TextToSpeechRequest = class _TextToSpeechRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TextToSpeechRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TextToSpeechRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TextToSpeechRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TextToSpeechRequest, a, b2);
  }
  static $() {
    return ["TextToSpeechRequest|1 text 9|2 voice_id 9?|3 language 9?|4 speed 2?|5 with_timestamps 8?"];
  }
};
var TextToSpeechResponse = class _TextToSpeechResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.audio = new Uint8Array(0);
    this.mimeType = "";
    this.synthesisTimeMs = protoInt64.zero;
    this.charStartMs = [];
    this.charEndMs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TextToSpeechResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TextToSpeechResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TextToSpeechResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TextToSpeechResponse, a, b2);
  }
  static $() {
    return ["TextToSpeechResponse|1 audio 12|2 mime_type 9|3 synthesis_time_ms 3|4 char_start_ms 5*|5 char_end_ms 5*"];
  }
};
var MintDesktopRealtimeVoiceSecretRequest = class _MintDesktopRealtimeVoiceSecretRequest extends __protoMessage3124 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintDesktopRealtimeVoiceSecretRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintDesktopRealtimeVoiceSecretRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintDesktopRealtimeVoiceSecretRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintDesktopRealtimeVoiceSecretRequest, a, b2);
  }
  static $() {
    return ["MintDesktopRealtimeVoiceSecretRequest"];
  }
};
var MintDesktopRealtimeVoiceSecretResponse = class _MintDesktopRealtimeVoiceSecretResponse extends __protoMessage3124 {
  constructor(data) {
    super();
    this.clientSecret = "";
    this.model = "";
    this.websocketUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintDesktopRealtimeVoiceSecretResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintDesktopRealtimeVoiceSecretResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintDesktopRealtimeVoiceSecretResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintDesktopRealtimeVoiceSecretResponse, a, b2);
  }
  static $() {
    return ["MintDesktopRealtimeVoiceSecretResponse|1 client_secret 9|2 model 9|3 websocket_url 9"];
  }
};

