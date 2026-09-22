/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/cpp_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();
init_utils_pb2();

// @recovered-fragment 2/2
init_repository_pb();
init_compact();
var __protoPackage117 = "aiserver.v1.";
var __protoMessage3116 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage117;
  }
};
var CppSource = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "CppSource", [[0, "UNSPECIFIED"], [1, "LINE_CHANGE"], [2, "TYPING"], [3, "OPTION_HOLD"], [4, "LINTER_ERRORS"], [5, "PARAMETER_HINTS"], [6, "CURSOR_PREDICTION"], [7, "MANUAL_TRIGGER"], [8, "EDITOR_CHANGE"], [9, "LSP_SUGGESTIONS"]], 1);
var CppIntentInfo = class _CppIntentInfo extends __protoMessage3116 {
  constructor(data) {
    super();
    this.source = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppIntentInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppIntentInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppIntentInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppIntentInfo, a, b2);
  }
  static $() {
    return ["CppIntentInfo|1 source 9"];
  }
};
var LspSuggestion = class _LspSuggestion extends __protoMessage3116 {
  constructor(data) {
    super();
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSuggestion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSuggestion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSuggestion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSuggestion, a, b2);
  }
  static $() {
    return ["LspSuggestion|1 label 9"];
  }
};
var LspSuggestedItems = class _LspSuggestedItems extends __protoMessage3116 {
  constructor(data) {
    super();
    this.suggestions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSuggestedItems().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSuggestedItems().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSuggestedItems().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSuggestedItems, a, b2);
  }
  static $() {
    return ["LspSuggestedItems|1 suggestions #0*", LspSuggestion];
  }
};
var ShouldTurnOnCppOnboardingRequest = class _ShouldTurnOnCppOnboardingRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShouldTurnOnCppOnboardingRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShouldTurnOnCppOnboardingRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShouldTurnOnCppOnboardingRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShouldTurnOnCppOnboardingRequest, a, b2);
  }
  static $() {
    return ["ShouldTurnOnCppOnboardingRequest"];
  }
};
var ShouldTurnOnCppOnboardingResponse = class _ShouldTurnOnCppOnboardingResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.shouldTurnOnCppOnboarding = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShouldTurnOnCppOnboardingResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShouldTurnOnCppOnboardingResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShouldTurnOnCppOnboardingResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShouldTurnOnCppOnboardingResponse, a, b2);
  }
  static $() {
    return ["ShouldTurnOnCppOnboardingResponse|1 should_turn_on_cpp_onboarding 8"];
  }
};
var StreamCppRequest = class _StreamCppRequest extends __protoMessage3116 {
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
    this.additionalFiles = [];
    this.filesyncUpdates = [];
    this.timeSinceRequestStart = 0;
    this.timeAtRequestSend = 0;
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCppRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCppRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCppRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCppRequest, a, b2);
  }
  static $() {
    return ["StreamCppRequest|1 current_file #0|2 diff_history 9*|3 model_name 9?|4 linter_errors #1?|13 context_items #2*|5 diff_history_keys 9*|6 give_debug_output 8?|7 file_diff_histories #3*|8 merged_diff_histories #3*|9 block_diff_patches #4*|10 is_nightly 8?|11 is_debug 8?|12 immediately_ack 8?|17 enable_more_context 8?|14 parameter_hints #5*|15 lsp_contexts #6*|16 cpp_intent_info #7?|18 workspace_id 9?|19 additional_files #8*|20 control_token #9?|21 client_time 1?|22 filesync_updates #10*|23 time_since_request_start 1|24 time_at_request_send 1|25 client_timezone_offset 1?|26 lsp_suggested_items #11?|27 supports_cpt 8?|28 supports_crlf_cpt 8?|29 code_results #12*", CurrentFileInfo, LinterErrors, CppContextItem, CppFileDiffHistory, BlockDiffPatch, CppParameterHint, LspSubgraphFullContext, CppIntentInfo, AdditionalFile, StreamCppRequest_ControlToken, FilesyncUpdateWithModelVersion, LspSuggestedItems, CodeResult];
  }
};
var StreamCppRequest_ControlToken = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "StreamCppRequest.ControlToken", [[0, "UNSPECIFIED"], [1, "QUIET"], [2, "LOUD"], [3, "OP"]], 1);
var StreamCppResponse = class _StreamCppResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCppResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCppResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCppResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCppResponse, a, b2);
  }
  static $() {
    return ["StreamCppResponse|1 text 9|2 suggestion_start_line 5?|3 suggestion_confidence 5?|4 done_stream 8?|5 debug_model_output 9?|6 debug_model_input 9?|7 debug_stream_time 9?|8 debug_total_time 9?|9 debug_ttft_time 9?|10 debug_server_timing 9?|11 range_to_replace #0?|12 cursor_prediction_target #1?|13 done_edit 8?|14 model_info #2?|15 begin_edit 8?|16 should_remove_leading_eol 8?|17 binding_id 9?", LineRange, StreamCppResponse_CursorPredictionTarget, StreamCppResponse_ModelInfo];
  }
};
var StreamCppResponse_CursorPredictionTarget = class _StreamCppResponse_CursorPredictionTarget extends __protoMessage3116 {
  constructor(data) {
    super();
    this.relativePath = "";
    this.lineNumberOneIndexed = 0;
    this.expectedContent = "";
    this.shouldRetriggerCpp = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCppResponse_CursorPredictionTarget().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCppResponse_CursorPredictionTarget().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCppResponse_CursorPredictionTarget().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCppResponse_CursorPredictionTarget, a, b2);
  }
  static $() {
    return ["StreamCppResponse.CursorPredictionTarget|1 relative_path 9|2 line_number_one_indexed 5|3 expected_content 9|4 should_retrigger_cpp 8"];
  }
};
var StreamCppResponse_ModelInfo = class _StreamCppResponse_ModelInfo extends __protoMessage3116 {
  constructor(data) {
    super();
    this.isFusedCursorPredictionModel = false;
    this.isMultidiffModel = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamCppResponse_ModelInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamCppResponse_ModelInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamCppResponse_ModelInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamCppResponse_ModelInfo, a, b2);
  }
  static $() {
    return ["StreamCppResponse.ModelInfo|1 is_fused_cursor_prediction_model 8|2 is_multidiff_model 8"];
  }
};
var CppConfigRequest = class _CppConfigRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    this.model = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigRequest, a, b2);
  }
  static $() {
    return ["CppConfigRequest|1 is_nightly 8?|2 model 9|3 supports_cpt 8?"];
  }
};
var CppConfigResponse = class _CppConfigResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.heuristics = [];
    this.excludeRecentlyViewedFilesPatterns = [];
    this.enableRvfTracking = false;
    this.globalDebounceDurationMillis = 0;
    this.clientDebounceDurationMillis = 0;
    this.cppUrl = "";
    this.useWhitespaceDiffHistory = false;
    this.enableFilesyncDebounceSkipping = false;
    this.checkFilesyncHashPercent = 0;
    this.geoCppBackendUrl = "";
    this.isFusedCursorPredictionModel = false;
    this.includeUnchangedLines = false;
    this.shouldFetchRvfText = false;
    this.allowsTabChunks = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigResponse, a, b2);
  }
  static $() {
    return ["CppConfigResponse|1 above_radius 5?|2 below_radius 5?|4 merge_behavior #0?|5 is_on 8?|6 is_ghost_text 8?|7 should_let_user_enable_cpp_even_if_not_pro 8?|8 heuristics #1*|9 exclude_recently_viewed_files_patterns 9*|10 enable_rvf_tracking 8|11 global_debounce_duration_millis 5|12 client_debounce_duration_millis 5|13 cpp_url 9|14 use_whitespace_diff_history 8|15 import_prediction_config #2|16 enable_filesync_debounce_skipping 8|17 check_filesync_hash_percent 2|18 geo_cpp_backend_url 9|19 recently_rejected_edit_thresholds #3?|20 is_fused_cursor_prediction_model 8|21 include_unchanged_lines 8|22 should_fetch_rvf_text 8|23 max_number_of_cleared_suggestions_since_last_accept 5?|24 suggestion_hint_config #4?|25 allows_tab_chunks 8|26 tab_context_refresh_debounce_ms 5?|27 tab_context_refresh_editor_change_debounce_ms 5?", CppConfigResponse_MergeBehavior, CppConfigResponse_Heuristic, CppConfigResponse_ImportPredictionConfig, CppConfigResponse_RecentlyRejectedEditThresholds, CppConfigResponse_SuggestionHintConfig];
  }
};
var CppConfigResponse_Heuristic = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "CppConfigResponse.Heuristic", [[0, "UNSPECIFIED"], [1, "LOTS_OF_ADDED_TEXT"], [2, "DUPLICATING_LINE_AFTER_SUGGESTION"], [3, "DUPLICATING_MULTIPLE_LINES_AFTER_SUGGESTION"], [4, "REVERTING_USER_CHANGE"], [5, "OUTPUT_EXTENDS_BEYOND_RANGE_AND_IS_REPEATED"], [6, "SUGGESTING_RECENTLY_REJECTED_EDIT"]], 1);
var CppConfigResponse_ImportPredictionConfig = class _CppConfigResponse_ImportPredictionConfig extends __protoMessage3116 {
  constructor(data) {
    super();
    this.isDisabledByBackend = false;
    this.shouldTurnOnAutomatically = false;
    this.pythonEnabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigResponse_ImportPredictionConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigResponse_ImportPredictionConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigResponse_ImportPredictionConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigResponse_ImportPredictionConfig, a, b2);
  }
  static $() {
    return ["CppConfigResponse.ImportPredictionConfig|1 is_disabled_by_backend 8|2 should_turn_on_automatically 8|3 python_enabled 8"];
  }
};
var CppConfigResponse_MergeBehavior = class _CppConfigResponse_MergeBehavior extends __protoMessage3116 {
  constructor(data) {
    super();
    this.type = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigResponse_MergeBehavior().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigResponse_MergeBehavior().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigResponse_MergeBehavior().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigResponse_MergeBehavior, a, b2);
  }
  static $() {
    return ["CppConfigResponse.MergeBehavior|1 type 9|2 limit 5?|3 radius 5?"];
  }
};
var CppConfigResponse_RecentlyRejectedEditThresholds = class _CppConfigResponse_RecentlyRejectedEditThresholds extends __protoMessage3116 {
  constructor(data) {
    super();
    this.hardRejectThreshold = 0;
    this.softRejectThreshold = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigResponse_RecentlyRejectedEditThresholds().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigResponse_RecentlyRejectedEditThresholds().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigResponse_RecentlyRejectedEditThresholds().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigResponse_RecentlyRejectedEditThresholds, a, b2);
  }
  static $() {
    return ["CppConfigResponse.RecentlyRejectedEditThresholds|1 hard_reject_threshold 5|2 soft_reject_threshold 5"];
  }
};
var CppConfigResponse_SuggestionHintConfig = class _CppConfigResponse_SuggestionHintConfig extends __protoMessage3116 {
  constructor(data) {
    super();
    this.importantLspExtensions = [];
    this.enabledForPathExtensions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppConfigResponse_SuggestionHintConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppConfigResponse_SuggestionHintConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppConfigResponse_SuggestionHintConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppConfigResponse_SuggestionHintConfig, a, b2);
  }
  static $() {
    return ["CppConfigResponse.SuggestionHintConfig|1 important_lsp_extensions 9*|2 enabled_for_path_extensions 9*"];
  }
};
var SuggestedEdit = class _SuggestedEdit extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestedEdit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestedEdit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestedEdit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestedEdit, a, b2);
  }
  static $() {
    return ["SuggestedEdit|1 edit_range #0|2 text 9", SimpleRange];
  }
};
var GetCppEditClassificationRequest = class _GetCppEditClassificationRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    this.suggestedEdits = [];
    this.markerTouchesGreen = false;
    this.currentFileContentsForLinterErrors = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCppEditClassificationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCppEditClassificationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCppEditClassificationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCppEditClassificationRequest, a, b2);
  }
  static $() {
    return ["GetCppEditClassificationRequest|1 cpp_request #0|25 suggested_edits #1*|26 marker_touches_green 8|27 current_file_contents_for_linter_errors 9", StreamCppRequest, SuggestedEdit];
  }
};
var GetCppEditClassificationResponse = class _GetCppEditClassificationResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.scoredEdits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCppEditClassificationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCppEditClassificationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCppEditClassificationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCppEditClassificationResponse, a, b2);
  }
  static $() {
    return ["GetCppEditClassificationResponse|1 scored_edits #0*|2 noop_edit #0|3 should_noop 8?|4 generation_edit #0", GetCppEditClassificationResponse_ScoredEdit];
  }
};
var GetCppEditClassificationResponse_LogProbs = class _GetCppEditClassificationResponse_LogProbs extends __protoMessage3116 {
  constructor(data) {
    super();
    this.tokens = [];
    this.tokenLogprobs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCppEditClassificationResponse_LogProbs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCppEditClassificationResponse_LogProbs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCppEditClassificationResponse_LogProbs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCppEditClassificationResponse_LogProbs, a, b2);
  }
  static $() {
    return ["GetCppEditClassificationResponse.LogProbs|1 tokens 9*|2 token_logprobs 1*"];
  }
};
var GetCppEditClassificationResponse_ScoredEdit = class _GetCppEditClassificationResponse_ScoredEdit extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCppEditClassificationResponse_ScoredEdit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCppEditClassificationResponse_ScoredEdit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCppEditClassificationResponse_ScoredEdit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCppEditClassificationResponse_ScoredEdit, a, b2);
  }
  static $() {
    return ["GetCppEditClassificationResponse.ScoredEdit|1 edit #0|2 log_probs #1", SuggestedEdit, GetCppEditClassificationResponse_LogProbs];
  }
};
var AdditionalFile = class _AdditionalFile extends __protoMessage3116 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.isOpen = false;
    this.visibleRangeContent = [];
    this.startLineNumberOneIndexed = [];
    this.visibleRanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AdditionalFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AdditionalFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AdditionalFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AdditionalFile, a, b2);
  }
  static $() {
    return ["AdditionalFile|1 relative_workspace_path 9|2 is_open 8|3 visible_range_content 9*|4 last_viewed_at 1?|5 start_line_number_one_indexed 5*|6 visible_ranges #0*", LineRange];
  }
};
var CppFileDiffHistory = class _CppFileDiffHistory extends __protoMessage3116 {
  constructor(data) {
    super();
    this.fileName = "";
    this.diffHistory = [];
    this.diffHistoryTimestamps = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppFileDiffHistory().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppFileDiffHistory().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppFileDiffHistory().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppFileDiffHistory, a, b2);
  }
  static $() {
    return ["CppFileDiffHistory|1 file_name 9|2 diff_history 9*|3 diff_history_timestamps 1*"];
  }
};
var RefreshTabContextRequest = class _RefreshTabContextRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    this.fileDiffHistories = [];
    this.additionalFiles = [];
    this.timeSinceRequestStart = 0;
    this.timeAtRequestSend = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshTabContextRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshTabContextRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshTabContextRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshTabContextRequest, a, b2);
  }
  static $() {
    return ["RefreshTabContextRequest|1 current_file #0|2 model_name 9?|3 linter_errors #1?|4 file_diff_histories #2*|5 additional_files #3*|6 client_time 1?|7 time_since_request_start 1|8 time_at_request_send 1|9 is_debug 8?|10 workspace_id 9?|11 supports_cpt 8?|12 supports_crlf_cpt 8?|13 repository_info #4", CurrentFileInfo, LinterErrors, CppFileDiffHistory, AdditionalFile, RepositoryInfo];
  }
};
var RefreshTabContextResponse = class _RefreshTabContextResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshTabContextResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshTabContextResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshTabContextResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshTabContextResponse, a, b2);
  }
  static $() {
    return ["RefreshTabContextResponse|1 code_results #0*", CodeResult];
  }
};
var CppContextItem = class _CppContextItem extends __protoMessage3116 {
  constructor(data) {
    super();
    this.contents = "";
    this.relativeWorkspacePath = "";
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppContextItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppContextItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppContextItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppContextItem, a, b2);
  }
  static $() {
    return ["CppContextItem|1 contents 9|2 symbol 9?|3 relative_workspace_path 9|4 score 2"];
  }
};
var CppParameterHint = class _CppParameterHint extends __protoMessage3116 {
  constructor(data) {
    super();
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppParameterHint().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppParameterHint().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppParameterHint().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppParameterHint, a, b2);
  }
  static $() {
    return ["CppParameterHint|1 label 9|2 documentation 9?"];
  }
};
var IRange = class _IRange extends __protoMessage3116 {
  constructor(data) {
    super();
    this.startLineNumber = 0;
    this.startColumn = 0;
    this.endLineNumber = 0;
    this.endColumn = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _IRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _IRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _IRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_IRange, a, b2);
  }
  static $() {
    return ["IRange|1 start_line_number 5|2 start_column 5|3 end_line_number 5|4 end_column 5"];
  }
};
var OneIndexedPosition = class _OneIndexedPosition extends __protoMessage3116 {
  constructor(data) {
    super();
    this.lineNumberOneIndexed = 0;
    this.columnOneIndexed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OneIndexedPosition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OneIndexedPosition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OneIndexedPosition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OneIndexedPosition, a, b2);
  }
  static $() {
    return ["OneIndexedPosition|1 line_number_one_indexed 5|2 column_one_indexed 5"];
  }
};
var CursorSelection = class _CursorSelection extends __protoMessage3116 {
  constructor(data) {
    super();
    this.selectionStartLineNumber = 0;
    this.selectionStartColumn = 0;
    this.positionLineNumber = 0;
    this.positionColumn = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CursorSelection().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CursorSelection().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CursorSelection().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CursorSelection, a, b2);
  }
  static $() {
    return ["CursorSelection|1 selection_start_line_number 5|2 selection_start_column 5|3 position_line_number 5|4 position_column 5"];
  }
};
var ModelChange = class _ModelChange extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    this.modelIsAttachedToEditor = false;
    this.modelIsAttachedToTheActiveEditor = false;
    this.cursorSelections = [];
    this.modelVersionAtMetadataRetrievalTime = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelChange, a, b2);
  }
  static $() {
    return ["ModelChange|1 text 9|2 range #0|3 final_model_hash 9?|4 model_version_immediately_after_this_change 5?|5 performance_now_timestamp 1?|7 is_undoing 8?|8 is_redoing 8?|9 model_is_attached_to_editor 8|10 model_is_attached_to_the_active_editor 8|11 cursor_selections #1*|12 model_version_at_metadata_retrieval_time 5|13 global_index 3?|14 performance_now_flush_time 1?|15 change_index 5?|16 flush_index 5?|17 global_index_v2 5?", IRange, CursorSelection];
  }
};
var CurrentlyShownCppSuggestion = class _CurrentlyShownCppSuggestion extends __protoMessage3116 {
  constructor(data) {
    super();
    this.suggestionId = 0;
    this.suggestionText = "";
    this.modelVersionWhenTheChangeIsFirstIndicatedToTheUserButNotShownInTheModel = 0;
    this.originalText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CurrentlyShownCppSuggestion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CurrentlyShownCppSuggestion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CurrentlyShownCppSuggestion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CurrentlyShownCppSuggestion, a, b2);
  }
  static $() {
    return ["CurrentlyShownCppSuggestion|1 suggestion_id 5|2 suggestion_text 9|3 model_version_when_the_change_is_first_indicated_to_the_user_but_not_shown_in_the_model 5|4 range_of_suggestion_in_current_model #0?|5 original_text 9|6 binding_id 9?", IRange];
  }
};
var CppAcceptEventNew = class _CppAcceptEventNew extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppAcceptEventNew().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppAcceptEventNew().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppAcceptEventNew().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppAcceptEventNew, a, b2);
  }
  static $() {
    return ["CppAcceptEventNew|1 cpp_suggestion #0|7 point_in_time_model #1", CurrentlyShownCppSuggestion, PointInTimeModel];
  }
};
var RecoverableCppData = class _RecoverableCppData extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.suggestionText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecoverableCppData().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecoverableCppData().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecoverableCppData().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecoverableCppData, a, b2);
  }
  static $() {
    return ["RecoverableCppData|1 request_id 9|2 suggestion_text 9|3 suggestion_range #0|4 position #1", IRange, OneIndexedPosition];
  }
};
var CppSuggestEvent = class _CppSuggestEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppSuggestEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppSuggestEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppSuggestEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppSuggestEvent, a, b2);
  }
  static $() {
    return ["CppSuggestEvent|1 cpp_suggestion #0|2 point_in_time_model #1|3 recoverable_cpp_data #2", CurrentlyShownCppSuggestion, PointInTimeModel, RecoverableCppData];
  }
};
var CppTriggerEvent = class _CppTriggerEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.generationUuid = "";
    this.modelVersion = 0;
    this.source = CppSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppTriggerEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppTriggerEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppTriggerEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppTriggerEvent, a, b2);
  }
  static $() {
    return ["CppTriggerEvent|1 generation_uuid 9|2 model_version 5|3 cursor_position #0|4 point_in_time_model #1|5 source #2", OneIndexedPosition, PointInTimeModel, CppSource];
  }
};
var FinishedCppGenerationEvent = class _FinishedCppGenerationEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FinishedCppGenerationEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FinishedCppGenerationEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FinishedCppGenerationEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FinishedCppGenerationEvent, a, b2);
  }
  static $() {
    return ["FinishedCppGenerationEvent|1 point_in_time_model #0|2 recoverable_cpp_data #1", PointInTimeModel, RecoverableCppData];
  }
};
var CppRejectEventNew = class _CppRejectEventNew extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppRejectEventNew().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppRejectEventNew().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppRejectEventNew().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppRejectEventNew, a, b2);
  }
  static $() {
    return ["CppRejectEventNew|1 cpp_suggestion #0|7 point_in_time_model #1", CurrentlyShownCppSuggestion, PointInTimeModel];
  }
};
var Edit = class _Edit extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Edit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Edit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Edit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Edit, a, b2);
  }
  static $() {
    return ["Edit|1 text 9|2 range #0", IRange];
  }
};
var CppPartialAcceptEvent = class _CppPartialAcceptEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppPartialAcceptEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppPartialAcceptEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppPartialAcceptEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppPartialAcceptEvent, a, b2);
  }
  static $() {
    return ["CppPartialAcceptEvent|1 cpp_suggestion #0|2 edit #1|3 point_in_time_model #2", CurrentlyShownCppSuggestion, Edit, PointInTimeModel];
  }
};
var CursorPrediction = class _CursorPrediction extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.predictionId = 0;
    this.lineNumber = 0;
    this.source = CursorPrediction_CursorPredictionSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CursorPrediction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CursorPrediction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CursorPrediction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CursorPrediction, a, b2);
  }
  static $() {
    return ["CursorPrediction|1 request_id 9|2 prediction_id 5|3 line_number 5|4 source #0|5 binding_id 9?", CursorPrediction_CursorPredictionSource];
  }
};
var CursorPrediction_CursorPredictionSource = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "CursorPrediction.CursorPredictionSource", [[0, "UNSPECIFIED"], [1, "ALWAYS_ON"], [2, "ACCEPT"], [3, "UNDO"], [4, "EDITOR_CHANGE"]], 1);
var SuggestCursorPredictionEvent = class _SuggestCursorPredictionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuggestCursorPredictionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuggestCursorPredictionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuggestCursorPredictionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuggestCursorPredictionEvent, a, b2);
  }
  static $() {
    return ["SuggestCursorPredictionEvent|1 cursor_prediction #0|2 point_in_time_model #1", CursorPrediction, PointInTimeModel];
  }
};
var AcceptCursorPredictionEvent = class _AcceptCursorPredictionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AcceptCursorPredictionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AcceptCursorPredictionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AcceptCursorPredictionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AcceptCursorPredictionEvent, a, b2);
  }
  static $() {
    return ["AcceptCursorPredictionEvent|1 cursor_prediction #0|2 point_in_time_model #1", CursorPrediction, PointInTimeModel];
  }
};
var RejectCursorPredictionEvent = class _RejectCursorPredictionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RejectCursorPredictionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RejectCursorPredictionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RejectCursorPredictionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RejectCursorPredictionEvent, a, b2);
  }
  static $() {
    return ["RejectCursorPredictionEvent|1 cursor_prediction #0|2 point_in_time_model #1", CursorPrediction, PointInTimeModel];
  }
};
var MaybeDefinedPointInTimeModel = class _MaybeDefinedPointInTimeModel extends __protoMessage3116 {
  constructor(data) {
    super();
    this.modelVersion = 0;
    this.relativePath = "";
    this.modelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MaybeDefinedPointInTimeModel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MaybeDefinedPointInTimeModel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MaybeDefinedPointInTimeModel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MaybeDefinedPointInTimeModel, a, b2);
  }
  static $() {
    return ["MaybeDefinedPointInTimeModel|1 model_uuid 9?|2 model_version 5|3 relative_path 9|4 model_id 9"];
  }
};
var PointInTimeModel = class _PointInTimeModel extends __protoMessage3116 {
  constructor(data) {
    super();
    this.modelUuid = "";
    this.modelVersion = 0;
    this.relativePath = "";
    this.modelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PointInTimeModel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PointInTimeModel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PointInTimeModel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PointInTimeModel, a, b2);
  }
  static $() {
    return ["PointInTimeModel|1 model_uuid 9|2 model_version 5|3 relative_path 9|4 model_id 9"];
  }
};
var CppManualTriggerEventNew = class _CppManualTriggerEventNew extends __protoMessage3116 {
  constructor(data) {
    super();
    this.lineNumberOneIndexed = 0;
    this.columnNumberOneIndexed = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppManualTriggerEventNew().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppManualTriggerEventNew().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppManualTriggerEventNew().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppManualTriggerEventNew, a, b2);
  }
  static $() {
    return ["CppManualTriggerEventNew|1 line_number_one_indexed 5|2 column_number_one_indexed 5|7 point_in_time_model #0", PointInTimeModel];
  }
};
var CppStoppedTrackingModelEvent = class _CppStoppedTrackingModelEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.modelUuid = "";
    this.relativePath = "";
    this.reason = CppStoppedTrackingModelEvent_StoppedTrackingModelReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppStoppedTrackingModelEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppStoppedTrackingModelEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppStoppedTrackingModelEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppStoppedTrackingModelEvent, a, b2);
  }
  static $() {
    return ["CppStoppedTrackingModelEvent|1 model_uuid 9|2 relative_path 9|3 reason #0", CppStoppedTrackingModelEvent_StoppedTrackingModelReason];
  }
};
var CppStoppedTrackingModelEvent_StoppedTrackingModelReason = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "CppStoppedTrackingModelEvent.StoppedTrackingModelReason", [[0, "UNSPECIFIED"], [1, "FILE_TOO_BIG"], [2, "FILE_DISPOSED"], [3, "CHANGE_TOO_BIG"]], 1);
var CppLinterErrorEvent = class _CppLinterErrorEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.addedErrors = [];
    this.removedErrors = [];
    this.errors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppLinterErrorEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppLinterErrorEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppLinterErrorEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppLinterErrorEvent, a, b2);
  }
  static $() {
    return ["CppLinterErrorEvent|1 point_in_time_model #0|2 added_errors #1*|3 removed_errors #1*|4 errors #1*", PointInTimeModel, LinterError];
  }
};
var CppDebouncedCursorMovementEvent = class _CppDebouncedCursorMovementEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppDebouncedCursorMovementEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppDebouncedCursorMovementEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppDebouncedCursorMovementEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppDebouncedCursorMovementEvent, a, b2);
  }
  static $() {
    return ["CppDebouncedCursorMovementEvent|1 point_in_time_model #0|2 cursor_position #1", PointInTimeModel, OneIndexedPosition];
  }
};
var CppEditorChangedEvent = class _CppEditorChangedEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.visibleRanges = [];
    this.editorId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppEditorChangedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppEditorChangedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppEditorChangedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppEditorChangedEvent, a, b2);
  }
  static $() {
    return ["CppEditorChangedEvent|1 point_in_time_model #0|2 cursor_position #1|3 visible_ranges #2*|4 editor_id 9", PointInTimeModel, OneIndexedPosition, IRange];
  }
};
var CppCopyEvent = class _CppCopyEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.clipboardContents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppCopyEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppCopyEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppCopyEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppCopyEvent, a, b2);
  }
  static $() {
    return ["CppCopyEvent|1 clipboard_contents 9"];
  }
};
var CppQuickActionCommand = class _CppQuickActionCommand extends __protoMessage3116 {
  constructor(data) {
    super();
    this.title = "";
    this.id = "";
    this.arguments = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppQuickActionCommand().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppQuickActionCommand().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppQuickActionCommand().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppQuickActionCommand, a, b2);
  }
  static $() {
    return ["CppQuickActionCommand|1 title 9|2 id 9|3 arguments 9*"];
  }
};
var CppQuickAction = class _CppQuickAction extends __protoMessage3116 {
  constructor(data) {
    super();
    this.title = "";
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppQuickAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppQuickAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppQuickAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppQuickAction, a, b2);
  }
  static $() {
    return ["CppQuickAction|1 title 9|2 edits #0*|3 is_preferred 8?|4 command #1", CppQuickAction_Edit, CppQuickActionCommand];
  }
};
var CppQuickAction_Edit = class _CppQuickAction_Edit extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppQuickAction_Edit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppQuickAction_Edit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppQuickAction_Edit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppQuickAction_Edit, a, b2);
  }
  static $() {
    return ["CppQuickAction.Edit|1 text 9|2 range #0", IRange];
  }
};
var CppChangeQuickActionEvent = class _CppChangeQuickActionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.added = [];
    this.removed = [];
    this.actions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppChangeQuickActionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppChangeQuickActionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppChangeQuickActionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppChangeQuickActionEvent, a, b2);
  }
  static $() {
    return ["CppChangeQuickActionEvent|1 point_in_time_model #0|2 added #1*|3 removed #1*|4 actions #1*", PointInTimeModel, CppQuickAction];
  }
};
var CppQuickActionFireEvent = class _CppQuickActionFireEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.actionIdentifier = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppQuickActionFireEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppQuickActionFireEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppQuickActionFireEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppQuickActionFireEvent, a, b2);
  }
  static $() {
    return ["CppQuickActionFireEvent|1 point_in_time_model #0|2 quick_action_command #1 action_identifier|3 quick_action_event #2 action_identifier", PointInTimeModel, CppQuickActionCommand, CppQuickAction];
  }
};
var CmdKEvent = class _CmdKEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.eventType = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent, a, b2);
  }
  static $() {
    return ["CmdKEvent|1 point_in_time_model #0|2 request_id 9|20 prompt_bar_id 9?|3 submit_prompt #1 event_type|4 end_of_generation #2 event_type|5 interrupt_generation #3 event_type|6 accept_all #4 event_type|7 reject_all #5 event_type|8 reject_partial_diff #6 event_type|9 accept_partial_diff #7 event_type|10 after_reject #8 event_type", PointInTimeModel, CmdKEvent_SubmitPrompt, CmdKEvent_EndOfGeneration, CmdKEvent_InterruptGeneration, CmdKEvent_AcceptDiffs, CmdKEvent_RejectDiffs, CmdKEvent_RejectPartialDiff, CmdKEvent_AcceptPartialDiff, CmdKEvent_AfterReject];
  }
};
var CmdKEvent_SubmitPrompt = class _CmdKEvent_SubmitPrompt extends __protoMessage3116 {
  constructor(data) {
    super();
    this.originalText = "";
    this.prompt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_SubmitPrompt().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_SubmitPrompt().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_SubmitPrompt().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_SubmitPrompt, a, b2);
  }
  static $() {
    return ["CmdKEvent.SubmitPrompt|1 original_range #0|2 original_text 9|3 prompt 9", IRange];
  }
};
var CmdKEvent_EndOfGeneration = class _CmdKEvent_EndOfGeneration extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_EndOfGeneration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_EndOfGeneration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_EndOfGeneration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_EndOfGeneration, a, b2);
  }
  static $() {
    return ["CmdKEvent.EndOfGeneration"];
  }
};
var CmdKEvent_InterruptGeneration = class _CmdKEvent_InterruptGeneration extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_InterruptGeneration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_InterruptGeneration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_InterruptGeneration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_InterruptGeneration, a, b2);
  }
  static $() {
    return ["CmdKEvent.InterruptGeneration"];
  }
};
var CmdKEvent_AcceptDiffs = class _CmdKEvent_AcceptDiffs extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_AcceptDiffs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_AcceptDiffs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_AcceptDiffs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_AcceptDiffs, a, b2);
  }
  static $() {
    return ["CmdKEvent.AcceptDiffs"];
  }
};
var CmdKEvent_RejectDiffs = class _CmdKEvent_RejectDiffs extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_RejectDiffs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_RejectDiffs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_RejectDiffs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_RejectDiffs, a, b2);
  }
  static $() {
    return ["CmdKEvent.RejectDiffs|1 actor_request_id 9?|2 silent 8?"];
  }
};
var CmdKEvent_AcceptPartialDiff = class _CmdKEvent_AcceptPartialDiff extends __protoMessage3116 {
  constructor(data) {
    super();
    this.greenLines = [];
    this.redLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_AcceptPartialDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_AcceptPartialDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_AcceptPartialDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_AcceptPartialDiff, a, b2);
  }
  static $() {
    return ["CmdKEvent.AcceptPartialDiff|1 green_range #0|2 green_lines 9*|3 red_lines 9*", IRange];
  }
};
var CmdKEvent_RejectPartialDiff = class _CmdKEvent_RejectPartialDiff extends __protoMessage3116 {
  constructor(data) {
    super();
    this.greenLines = [];
    this.redLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_RejectPartialDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_RejectPartialDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_RejectPartialDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_RejectPartialDiff, a, b2);
  }
  static $() {
    return ["CmdKEvent.RejectPartialDiff|1 green_range #0|2 green_lines 9*|3 red_lines 9*", IRange];
  }
};
var CmdKEvent_AfterReject = class _CmdKEvent_AfterReject extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CmdKEvent_AfterReject().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CmdKEvent_AfterReject().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CmdKEvent_AfterReject().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CmdKEvent_AfterReject, a, b2);
  }
  static $() {
    return ["CmdKEvent.AfterReject"];
  }
};
var ChatEvent = class _ChatEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.eventType = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChatEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChatEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChatEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChatEvent, a, b2);
  }
  static $() {
    return ["ChatEvent|1 request_id 9|2 submit_prompt #0 event_type|3 end_of_any_generation #1 event_type|4 end_of_uninterrupted_generation #2 event_type", ChatEvent_SubmitPrompt, ChatEvent_EndOfAnyGeneration, ChatEvent_EndOfUninterruptedGeneration];
  }
};
var ChatEvent_SubmitPrompt = class _ChatEvent_SubmitPrompt extends __protoMessage3116 {
  constructor(data) {
    super();
    this.prompt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChatEvent_SubmitPrompt().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChatEvent_SubmitPrompt().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChatEvent_SubmitPrompt().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChatEvent_SubmitPrompt, a, b2);
  }
  static $() {
    return ["ChatEvent.SubmitPrompt|1 prompt 9"];
  }
};
var ChatEvent_EndOfAnyGeneration = class _ChatEvent_EndOfAnyGeneration extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChatEvent_EndOfAnyGeneration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChatEvent_EndOfAnyGeneration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChatEvent_EndOfAnyGeneration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChatEvent_EndOfAnyGeneration, a, b2);
  }
  static $() {
    return ["ChatEvent.EndOfAnyGeneration"];
  }
};
var ChatEvent_EndOfUninterruptedGeneration = class _ChatEvent_EndOfUninterruptedGeneration extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChatEvent_EndOfUninterruptedGeneration().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChatEvent_EndOfUninterruptedGeneration().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChatEvent_EndOfUninterruptedGeneration().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChatEvent_EndOfUninterruptedGeneration, a, b2);
  }
  static $() {
    return ["ChatEvent.EndOfUninterruptedGeneration"];
  }
};
var BugBotLinterEvent = class _BugBotLinterEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.eventType = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent|1 request_id 9|2 point_in_time_model #0|3 lint_generated #1 event_type|4 lint_dismissed #2 event_type|5 user_feedback #3 event_type|6 viewed_report #4 event_type|7 unviewed_report #5 event_type|8 started #6 event_type|9 not_shown_because_heuristic #7 event_type", PointInTimeModel, BugBotLinterEvent_LintGenerated, BugBotLinterEvent_LintDismissed, BugBotLinterEvent_UserFeedback, BugBotLinterEvent_ViewedReport, BugBotLinterEvent_UnviewedReport, BugBotLinterEvent_Started, BugBotLinterEvent_NotShownBecauseHeuristic];
  }
};
var BugBotLinterEvent_Started = class _BugBotLinterEvent_Started extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_Started().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_Started().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_Started().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_Started, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.Started"];
  }
};
var BugBotLinterEvent_LintGenerated = class _BugBotLinterEvent_LintGenerated extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_LintGenerated().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_LintGenerated().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_LintGenerated().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_LintGenerated, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.LintGenerated|1 bug_report #0", BugReport];
  }
};
var BugBotLinterEvent_LintDismissed = class _BugBotLinterEvent_LintDismissed extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_LintDismissed().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_LintDismissed().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_LintDismissed().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_LintDismissed, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.LintDismissed|1 bug_report_id 9"];
  }
};
var BugBotLinterEvent_UserFeedback = class _BugBotLinterEvent_UserFeedback extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    this.feedback = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_UserFeedback().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_UserFeedback().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_UserFeedback().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_UserFeedback, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.UserFeedback|1 bug_report_id 9|2 feedback 9"];
  }
};
var BugBotLinterEvent_ViewedReport = class _BugBotLinterEvent_ViewedReport extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_ViewedReport().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_ViewedReport().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_ViewedReport().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_ViewedReport, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.ViewedReport|1 bug_report_id 9"];
  }
};
var BugBotLinterEvent_UnviewedReport = class _BugBotLinterEvent_UnviewedReport extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_UnviewedReport().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_UnviewedReport().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_UnviewedReport().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_UnviewedReport, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.UnviewedReport|1 bug_report_id 9"];
  }
};
var BugBotLinterEvent_NotShownBecauseHeuristic = class _BugBotLinterEvent_NotShownBecauseHeuristic extends __protoMessage3116 {
  constructor(data) {
    super();
    this.heuristic = BugBotLinterEvent_NotShownBecauseHeuristic_Heuristic.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotLinterEvent_NotShownBecauseHeuristic().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotLinterEvent_NotShownBecauseHeuristic().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotLinterEvent_NotShownBecauseHeuristic().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotLinterEvent_NotShownBecauseHeuristic, a, b2);
  }
  static $() {
    return ["BugBotLinterEvent.NotShownBecauseHeuristic|1 heuristic #0", BugBotLinterEvent_NotShownBecauseHeuristic_Heuristic];
  }
};
var BugBotLinterEvent_NotShownBecauseHeuristic_Heuristic = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "BugBotLinterEvent.NotShownBecauseHeuristic.Heuristic", [[0, "UNSPECIFIED"], [1, "LINT_OVERLAP"], [2, "LINES_MISMATCH"]], 1);
var BugBotEvent = class _BugBotEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestId = "";
    this.eventType = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent, a, b2);
  }
  static $() {
    return ["BugBotEvent|1 request_id 9|2 started #0 event_type|3 reports_generated #1 event_type|4 pressed_fix_in_composer #2 event_type|5 pressed_open_in_editor #3 event_type|6 viewed_report #4 event_type|7 user_feedback #5 event_type|8 pressed_add_to_chat #6 event_type|9 background_interval_started #7 event_type|10 background_interval_ended #8 event_type|11 background_interval_interrupted #9 event_type|12 background_interval_errored #10 event_type", BugBotEvent_Started, BugBotEvent_ReportsGenerated, BugBotEvent_PressedFixInComposer, BugBotEvent_PressedOpenInEditor, BugBotEvent_ViewedReport, BugBotEvent_UserFeedback, BugBotEvent_PressedAddToChat, BugBotEvent_BackgroundIntervalStarted, BugBotEvent_BackgroundIntervalEnded, BugBotEvent_BackgroundIntervalInterrupted, BugBotEvent_BackgroundIntervalErrored];
  }
};
var BugBotEvent_BackgroundIntervalInterruptedReason = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "BugBotEvent.BackgroundIntervalInterruptedReason", [[0, "UNSPECIFIED"], [1, "DISABLED"], [2, "TOO_RECENT"], [3, "UNVIEWED_BUG_REPORTS"], [4, "NOT_IN_GIT_REPO"], [5, "DEFAULT_BRANCH_IS_NOT_CURRENT_BRANCH"], [6, "NO_GIT_USER"], [7, "NO_LAST_COMMIT"], [8, "LAST_COMMIT_NOT_MADE_BY_USER"], [9, "LAST_COMMIT_TOO_OLD"], [10, "DIFF_TOO_LONG"], [11, "DIFF_TOO_SHORT"], [12, "TELEMETRY_UNHEALTHY"]], 1);
var BugBotEvent_Started = class _BugBotEvent_Started extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_Started().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_Started().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_Started().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_Started, a, b2);
  }
  static $() {
    return ["BugBotEvent.Started"];
  }
};
var BugBotEvent_ReportsGenerated = class _BugBotEvent_ReportsGenerated extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_ReportsGenerated().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_ReportsGenerated().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_ReportsGenerated().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_ReportsGenerated, a, b2);
  }
  static $() {
    return ["BugBotEvent.ReportsGenerated|1 bug_reports #0", BugReports];
  }
};
var BugBotEvent_PressedFixInComposer = class _BugBotEvent_PressedFixInComposer extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_PressedFixInComposer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_PressedFixInComposer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_PressedFixInComposer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_PressedFixInComposer, a, b2);
  }
  static $() {
    return ["BugBotEvent.PressedFixInComposer|1 bug_report_id 9"];
  }
};
var BugBotEvent_PressedAddToChat = class _BugBotEvent_PressedAddToChat extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_PressedAddToChat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_PressedAddToChat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_PressedAddToChat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_PressedAddToChat, a, b2);
  }
  static $() {
    return ["BugBotEvent.PressedAddToChat|1 bug_report_id 9"];
  }
};
var BugBotEvent_PressedOpenInEditor = class _BugBotEvent_PressedOpenInEditor extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_PressedOpenInEditor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_PressedOpenInEditor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_PressedOpenInEditor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_PressedOpenInEditor, a, b2);
  }
  static $() {
    return ["BugBotEvent.PressedOpenInEditor|1 bug_location #0|2 bug_report_id 9", BugLocation];
  }
};
var BugBotEvent_ViewedReport = class _BugBotEvent_ViewedReport extends __protoMessage3116 {
  constructor(data) {
    super();
    this.secondsViewed = 0;
    this.reportViews = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_ViewedReport().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_ViewedReport().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_ViewedReport().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_ViewedReport, a, b2);
  }
  static $() {
    return ["BugBotEvent.ViewedReport|1 seconds_viewed 5|2 report_views #0*", BugBotEvent_ViewedReport_ReportView];
  }
};
var BugBotEvent_ViewedReport_ReportView = class _BugBotEvent_ViewedReport_ReportView extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    this.viewPercentage = 0;
    this.textPercentage = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_ViewedReport_ReportView().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_ViewedReport_ReportView().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_ViewedReport_ReportView().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_ViewedReport_ReportView, a, b2);
  }
  static $() {
    return ["BugBotEvent.ViewedReport.ReportView|1 bug_report_id 9|2 view_percentage 1|3 text_percentage 1"];
  }
};
var BugBotEvent_UserFeedback = class _BugBotEvent_UserFeedback extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bugReportId = "";
    this.feedback = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_UserFeedback().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_UserFeedback().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_UserFeedback().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_UserFeedback, a, b2);
  }
  static $() {
    return ["BugBotEvent.UserFeedback|1 bug_report_id 9|2 feedback 9"];
  }
};
var BugBotEvent_BackgroundIntervalStarted = class _BugBotEvent_BackgroundIntervalStarted extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_BackgroundIntervalStarted().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_BackgroundIntervalStarted().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_BackgroundIntervalStarted().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_BackgroundIntervalStarted, a, b2);
  }
  static $() {
    return ["BugBotEvent.BackgroundIntervalStarted"];
  }
};
var BugBotEvent_BackgroundIntervalEnded = class _BugBotEvent_BackgroundIntervalEnded extends __protoMessage3116 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_BackgroundIntervalEnded().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_BackgroundIntervalEnded().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_BackgroundIntervalEnded().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_BackgroundIntervalEnded, a, b2);
  }
  static $() {
    return ["BugBotEvent.BackgroundIntervalEnded|1 success 8"];
  }
};
var BugBotEvent_BackgroundIntervalInterrupted = class _BugBotEvent_BackgroundIntervalInterrupted extends __protoMessage3116 {
  constructor(data) {
    super();
    this.reason = BugBotEvent_BackgroundIntervalInterruptedReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_BackgroundIntervalInterrupted().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_BackgroundIntervalInterrupted().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_BackgroundIntervalInterrupted().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_BackgroundIntervalInterrupted, a, b2);
  }
  static $() {
    return ["BugBotEvent.BackgroundIntervalInterrupted|1 reason #0", BugBotEvent_BackgroundIntervalInterruptedReason];
  }
};
var BugBotEvent_BackgroundIntervalErrored = class _BugBotEvent_BackgroundIntervalErrored extends __protoMessage3116 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BugBotEvent_BackgroundIntervalErrored().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BugBotEvent_BackgroundIntervalErrored().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BugBotEvent_BackgroundIntervalErrored().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BugBotEvent_BackgroundIntervalErrored, a, b2);
  }
  static $() {
    return ["BugBotEvent.BackgroundIntervalErrored|1 error_message 9"];
  }
};
var AiRequestEvent = class _AiRequestEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.requestType = AiRequestEvent_RequestType.UNSPECIFIED;
    this.requestId = "";
    this.source = AiRequestEvent_Source.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AiRequestEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AiRequestEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AiRequestEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AiRequestEvent, a, b2);
  }
  static $() {
    return ["AiRequestEvent|1 request_type #0|2 request_id 9|3 source #1", AiRequestEvent_RequestType, AiRequestEvent_Source];
  }
};
var AiRequestEvent_RequestType = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "AiRequestEvent.RequestType", [[0, "UNSPECIFIED"], [1, "START"], [2, "END"]], 1);
var AiRequestEvent_Source = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "AiRequestEvent.Source", [[0, "UNSPECIFIED"], [1, "CHAT"], [2, "CMDK"], [3, "APPLY"], [4, "COMPOSER"], [5, "TASK"], [6, "CODE_INTERPRETER"], [7, "INTERPRETER_EXECUTION"], [8, "BUGBOT"]], 1);
var ModelOpenedEvent = class _ModelOpenedEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelOpenedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelOpenedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelOpenedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelOpenedEvent, a, b2);
  }
  static $() {
    return ["ModelOpenedEvent|1 point_in_time_model #0|2 maybe_defined_point_in_time_model #1", PointInTimeModel, MaybeDefinedPointInTimeModel];
  }
};
var BackgroundFilesEvent = class _BackgroundFilesEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundFilesEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundFilesEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundFilesEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundFilesEvent, a, b2);
  }
  static $() {
    return ["BackgroundFilesEvent|2 files #0*", BackgroundFilesEvent_BackgroundFile];
  }
};
var BackgroundFilesEvent_BackgroundFile = class _BackgroundFilesEvent_BackgroundFile extends __protoMessage3116 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.hash = "";
    this.fullPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BackgroundFilesEvent_BackgroundFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BackgroundFilesEvent_BackgroundFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BackgroundFilesEvent_BackgroundFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BackgroundFilesEvent_BackgroundFile, a, b2);
  }
  static $() {
    return ["BackgroundFilesEvent.BackgroundFile|1 relative_workspace_path 9|2 contents 9|3 hash 9|4 full_path 9"];
  }
};
var ScrollEvent = class _ScrollEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.visibleRanges = [];
    this.editorId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ScrollEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ScrollEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ScrollEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ScrollEvent, a, b2);
  }
  static $() {
    return ["ScrollEvent|1 point_in_time_model #0|2 visible_ranges #1*|3 editor_id 9", PointInTimeModel, IRange];
  }
};
var EditorCloseEvent = class _EditorCloseEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.editorId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EditorCloseEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EditorCloseEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EditorCloseEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EditorCloseEvent, a, b2);
  }
  static $() {
    return ["EditorCloseEvent|1 editor_id 9"];
  }
};
var TabCloseEvent = class _TabCloseEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TabCloseEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TabCloseEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TabCloseEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TabCloseEvent, a, b2);
  }
  static $() {
    return ["TabCloseEvent|1 point_in_time_model #0", MaybeDefinedPointInTimeModel];
  }
};
var ModelAddedEvent = class _ModelAddedEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.fullUri = "";
    this.modelId = "";
    this.uriScheme = "";
    this.isTooLargeForSyncing = false;
    this.isTooLargeForTokenization = false;
    this.isTooLargeForHeapOperation = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ModelAddedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ModelAddedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ModelAddedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ModelAddedEvent, a, b2);
  }
  static $() {
    return ["ModelAddedEvent|1 point_in_time_model #0|2 full_uri 9|3 model_id 9|4 uri_scheme 9|5 is_too_large_for_syncing 8|6 is_too_large_for_tokenization 8|7 is_too_large_for_heap_operation 8", MaybeDefinedPointInTimeModel];
  }
};
var AnythingQuickAccessItem = class _AnythingQuickAccessItem extends __protoMessage3116 {
  constructor(data) {
    super();
    this.item = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AnythingQuickAccessItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AnythingQuickAccessItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AnythingQuickAccessItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AnythingQuickAccessItem, a, b2);
  }
  static $() {
    return ["AnythingQuickAccessItem|1 resource #0 item|2 separator 9 item|3 section 9 item", AnythingQuickAccessItem_Resource];
  }
};
var AnythingQuickAccessItem_Resource = class _AnythingQuickAccessItem_Resource extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AnythingQuickAccessItem_Resource().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AnythingQuickAccessItem_Resource().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AnythingQuickAccessItem_Resource().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AnythingQuickAccessItem_Resource, a, b2);
  }
  static $() {
    return ["AnythingQuickAccessItem.Resource|1 model #0?|2 range #1?|3 uri 9?", PointInTimeModel, IRange];
  }
};
var AnythingQuickAccessSelectionEvent = class _AnythingQuickAccessSelectionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.query = "";
    this.items = [];
    this.selectedIndices = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AnythingQuickAccessSelectionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AnythingQuickAccessSelectionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AnythingQuickAccessSelectionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AnythingQuickAccessSelectionEvent, a, b2);
  }
  static $() {
    return ["AnythingQuickAccessSelectionEvent|1 query 9|2 items #0*|3 selected_indices 5*", AnythingQuickAccessItem];
  }
};
var LspSuggestionEvent = class _LspSuggestionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.suggestions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSuggestionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSuggestionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSuggestionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSuggestionEvent, a, b2);
  }
  static $() {
    return ["LspSuggestionEvent|1 suggestions 9*|2 request_id 9?|3 editor_id 9?|4 point_in_time_model #0", PointInTimeModel];
  }
};
var CppSessionEvent = class _CppSessionEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    this.performanceNowTimestamp = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppSessionEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppSessionEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppSessionEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppSessionEvent, a, b2);
  }
  static $() {
    return ["CppSessionEvent|2 accept_event #0 event|3 reject_event #1 event|4 manual_trigger_event #2 event|6 stopped_tracking_model_event #3 event|7 suggest_event #4 event|8 linter_error_event #5 event|9 debounced_cursor_movement_event #6 event|10 editor_changed_event #7 event|11 copy_event #8 event|13 quick_action_event #9 event|14 quick_action_fire_event #10 event|15 model_opened_event #11 event|17 cmd_k_event #12 event|18 chat_event #13 event|19 ai_event #14 event|21 scroll_event #15 event|22 editor_close_event #16 event|23 tab_close_event #17 event|33 model_added_event #18 event|26 partial_accept_event #19 event|27 accept_cursor_prediction_event #20 event|28 reject_cursor_prediction_event #21 event|29 suggest_cursor_prediction_event #22 event|30 cpp_trigger_event #23 event|31 finished_cpp_generation_event #24 event|32 bug_bot_event #25 event|34 bug_bot_linter_event #26 event|35 anything_quick_access_selection_event #27 event|36 lsp_suggestion_event #28 event|37 ntp_event #29 event|38 repo_event #30 event|39 git_event #31 event|40 tool_call_event #32 event|46 before_ai_edit_event #33 event|47 search_event #34 event|48 terminal_event #35 event|49 worktree_event #36 event|50 review_changes_opened_event #37 event|51 browser_event #38 event|16 background_files_event #39 event|5 performance_now_timestamp 1|25 performance_time_origin 1?|41 global_index 3?|42 performance_now_flush_time 1?|43 event_index 5?|44 flush_index 5?|45 global_index_v2 5?", CppAcceptEventNew, CppRejectEventNew, CppManualTriggerEventNew, CppStoppedTrackingModelEvent, CppSuggestEvent, CppLinterErrorEvent, CppDebouncedCursorMovementEvent, CppEditorChangedEvent, CppCopyEvent, CppChangeQuickActionEvent, CppQuickActionFireEvent, ModelOpenedEvent, CmdKEvent, ChatEvent, AiRequestEvent, ScrollEvent, EditorCloseEvent, TabCloseEvent, ModelAddedEvent, CppPartialAcceptEvent, AcceptCursorPredictionEvent, RejectCursorPredictionEvent, SuggestCursorPredictionEvent, CppTriggerEvent, FinishedCppGenerationEvent, BugBotEvent, BugBotLinterEvent, AnythingQuickAccessSelectionEvent, LspSuggestionEvent, NtpEvent, RepoEvent, GitEvent, ToolCallEvent, BeforeAiEditEvent, SearchEvent, TerminalEvent, WorktreeEvent, ReviewChangesOpenedEvent, BrowserEvent, BackgroundFilesEvent];
  }
};
var BeforeAiEditEvent = class _BeforeAiEditEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.model = { case: void 0 };
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BeforeAiEditEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BeforeAiEditEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BeforeAiEditEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BeforeAiEditEvent, a, b2);
  }
  static $() {
    return ["BeforeAiEditEvent|1 point_in_time_model #0 model|5 relative_workspace_path 9 model|2 tool_call_id 9|3 request_id 9?|4 tool_name 9?", PointInTimeModel];
  }
};
var CppAppendRequest = class _CppAppendRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    this.changes = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppAppendRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppAppendRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppAppendRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppAppendRequest, a, b2);
  }
  static $() {
    return ["CppAppendRequest|1 changes 12"];
  }
};
var CppAppendResponse = class _CppAppendResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppAppendResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppAppendResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppAppendResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppAppendResponse, a, b2);
  }
  static $() {
    return ["CppAppendResponse|1 success 8"];
  }
};
var EditHistoryAppendChangesRequest = class _EditHistoryAppendChangesRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    this.sessionId = "";
    this.modelUuid = "";
    this.relativePath = "";
    this.uri = "";
    this.clientVersion = "";
    this.changes = [];
    this.sessionEvents = [];
    this.modelChangesMayBeOutOfOrder = false;
    this.privacyModeStatus = EditHistoryAppendChangesRequest_PrivacyModeStatus.UNSPECIFIED;
    this.events = [];
    this.timeOrigin = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EditHistoryAppendChangesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EditHistoryAppendChangesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EditHistoryAppendChangesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EditHistoryAppendChangesRequest, a, b2);
  }
  static $() {
    return ["EditHistoryAppendChangesRequest|1 session_id 9|2 model_uuid 9|3 starting_model_value 9?|10 starting_model_version 5?|5 relative_path 9|14 uri 9|6 client_version 9|8 client_commit 9?|4 changes #0*|9 session_events #1*|11 model_changes_may_be_out_of_order 8|12 privacy_mode_status #2|7 events #3*|13 time_origin 2", ModelChange, CppSessionEvent, EditHistoryAppendChangesRequest_PrivacyModeStatus, CppHistoryAppendEvent];
  }
};
var EditHistoryAppendChangesRequest_PrivacyModeStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "EditHistoryAppendChangesRequest.PrivacyModeStatus", [[0, "UNSPECIFIED"], [1, "PRIVACY_ENABLED"], [2, "IMPLICIT_NO_PRIVACY"], [3, "EXPLICIT_NO_PRIVACY"]], 1);
var EditHistoryAppendChangesResponse = class _EditHistoryAppendChangesResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.success = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _EditHistoryAppendChangesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _EditHistoryAppendChangesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _EditHistoryAppendChangesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_EditHistoryAppendChangesResponse, a, b2);
  }
  static $() {
    return ["EditHistoryAppendChangesResponse|1 success 8"];
  }
};
var CppEditHistoryStatusRequest = class _CppEditHistoryStatusRequest extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppEditHistoryStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppEditHistoryStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppEditHistoryStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppEditHistoryStatusRequest, a, b2);
  }
  static $() {
    return ["CppEditHistoryStatusRequest"];
  }
};
var CppEditHistoryStatusResponse = class _CppEditHistoryStatusResponse extends __protoMessage3116 {
  constructor(data) {
    super();
    this.on = false;
    this.onlyIfExplicit = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppEditHistoryStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppEditHistoryStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppEditHistoryStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppEditHistoryStatusResponse, a, b2);
  }
  static $() {
    return ["CppEditHistoryStatusResponse|1 on 8|2 only_if_explicit 8"];
  }
};
var BlockDiffPatch = class _BlockDiffPatch extends __protoMessage3116 {
  constructor(data) {
    super();
    this.changes = [];
    this.relativePath = "";
    this.modelUuid = "";
    this.startFromChangeIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BlockDiffPatch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BlockDiffPatch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BlockDiffPatch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BlockDiffPatch, a, b2);
  }
  static $() {
    return ["BlockDiffPatch|1 start_model_window #0|3 changes #1*|4 relative_path 9|7 model_uuid 9|5 start_from_change_index 5", BlockDiffPatch_ModelWindow, BlockDiffPatch_Change];
  }
};
var BlockDiffPatch_Change = class _BlockDiffPatch_Change extends __protoMessage3116 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BlockDiffPatch_Change().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BlockDiffPatch_Change().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BlockDiffPatch_Change().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BlockDiffPatch_Change, a, b2);
  }
  static $() {
    return ["BlockDiffPatch.Change|1 text 9|2 range #0", IRange];
  }
};
var BlockDiffPatch_ModelWindow = class _BlockDiffPatch_ModelWindow extends __protoMessage3116 {
  constructor(data) {
    super();
    this.lines = [];
    this.startLineNumber = 0;
    this.endLineNumber = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BlockDiffPatch_ModelWindow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BlockDiffPatch_ModelWindow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BlockDiffPatch_ModelWindow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BlockDiffPatch_ModelWindow, a, b2);
  }
  static $() {
    return ["BlockDiffPatch.ModelWindow|1 lines 9*|2 start_line_number 5|3 end_line_number 5"];
  }
};
var CppHistoryAppendEvent = class _CppHistoryAppendEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppHistoryAppendEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppHistoryAppendEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppHistoryAppendEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppHistoryAppendEvent, a, b2);
  }
  static $() {
    return ["CppHistoryAppendEvent|1 model_change #0 event|2 accept_event #1 event|3 reject_event #2 event|4 manual_trigger_event #3 event|10 final_model_hash 9?", ModelChange, CppAcceptEvent, CppRejectEvent, CppManualTriggerEvent];
  }
};
var CppManualTriggerEvent = class _CppManualTriggerEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppManualTriggerEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppManualTriggerEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppManualTriggerEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppManualTriggerEvent, a, b2);
  }
  static $() {
    return ["CppManualTriggerEvent|2 position #0", CursorPosition];
  }
};
var CppAcceptEvent = class _CppAcceptEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppAcceptEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppAcceptEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppAcceptEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppAcceptEvent, a, b2);
  }
  static $() {
    return ["CppAcceptEvent|1 cpp_suggestion #0", CppSuggestion];
  }
};
var CppRejectEvent = class _CppRejectEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppRejectEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppRejectEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppRejectEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppRejectEvent, a, b2);
  }
  static $() {
    return ["CppRejectEvent|1 cpp_suggestion #0", CppSuggestion];
  }
};
var CppSuggestion = class _CppSuggestion extends __protoMessage3116 {
  constructor(data) {
    super();
    this.suggestionText = "";
    this.seen = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CppSuggestion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CppSuggestion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CppSuggestion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CppSuggestion, a, b2);
  }
  static $() {
    return ["CppSuggestion|1 suggestion_text 9|2 range #0|5 seen 8|6 editor_selection_before_peek #1|7 binding_id 9?", IRange, SelectionWithOrientation];
  }
};
var TerminalEvent = class _TerminalEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.uri = "";
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TerminalEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TerminalEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TerminalEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TerminalEvent, a, b2);
  }
  static $() {
    return ["TerminalEvent|1 uri 9|2 create #0 event|3 exit #1 event|4 command_start #2 event|5 command_finish #3 event", TerminalEvent_Create, TerminalEvent_Exit, TerminalEvent_CommandStart, TerminalEvent_CommandFinish];
  }
};
var TerminalEvent_Create = class _TerminalEvent_Create extends __protoMessage3116 {
  constructor(data) {
    super();
    this.isRemote = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TerminalEvent_Create().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TerminalEvent_Create().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TerminalEvent_Create().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TerminalEvent_Create, a, b2);
  }
  static $() {
    return ["TerminalEvent.Create|1 is_remote 8"];
  }
};
var TerminalEvent_Exit = class _TerminalEvent_Exit extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TerminalEvent_Exit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TerminalEvent_Exit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TerminalEvent_Exit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TerminalEvent_Exit, a, b2);
  }
  static $() {
    return ["TerminalEvent.Exit|1 exit_code 5?"];
  }
};
var TerminalEvent_CommandStart = class _TerminalEvent_CommandStart extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TerminalEvent_CommandStart().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TerminalEvent_CommandStart().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TerminalEvent_CommandStart().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TerminalEvent_CommandStart, a, b2);
  }
  static $() {
    return ["TerminalEvent.CommandStart|1 point_in_time_model #0|2 cwd 9?", PointInTimeModel];
  }
};
var TerminalEvent_CommandFinish = class _TerminalEvent_CommandFinish extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TerminalEvent_CommandFinish().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TerminalEvent_CommandFinish().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TerminalEvent_CommandFinish().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TerminalEvent_CommandFinish, a, b2);
  }
  static $() {
    return ["TerminalEvent.CommandFinish|1 point_in_time_model #0|2 exit_code 5?", PointInTimeModel];
  }
};
var BrowserEvent = class _BrowserEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.viewId = "";
    this.event = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BrowserEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BrowserEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BrowserEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BrowserEvent, a, b2);
  }
  static $() {
    return ["BrowserEvent|1 view_id 9|2 tab_created #0 event|3 tab_closed #1 event|4 navigation #2 event|5 tool_action #3 event", BrowserEvent_TabCreated, BrowserEvent_TabClosed, BrowserEvent_Navigation, BrowserEvent_ToolAction];
  }
};
var BrowserEvent_TabCreated = class _BrowserEvent_TabCreated extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BrowserEvent_TabCreated().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BrowserEvent_TabCreated().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BrowserEvent_TabCreated().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BrowserEvent_TabCreated, a, b2);
  }
  static $() {
    return ["BrowserEvent.TabCreated"];
  }
};
var BrowserEvent_TabClosed = class _BrowserEvent_TabClosed extends __protoMessage3116 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BrowserEvent_TabClosed().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BrowserEvent_TabClosed().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BrowserEvent_TabClosed().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BrowserEvent_TabClosed, a, b2);
  }
  static $() {
    return ["BrowserEvent.TabClosed"];
  }
};
var BrowserEvent_Navigation = class _BrowserEvent_Navigation extends __protoMessage3116 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BrowserEvent_Navigation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BrowserEvent_Navigation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BrowserEvent_Navigation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BrowserEvent_Navigation, a, b2);
  }
  static $() {
    return ["BrowserEvent.Navigation|1 url 9|2 title 9?"];
  }
};
var BrowserEvent_ToolAction = class _BrowserEvent_ToolAction extends __protoMessage3116 {
  constructor(data) {
    super();
    this.toolName = "";
    this.argsJson = "";
    this.source = BrowserEvent_ToolAction_Source.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BrowserEvent_ToolAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BrowserEvent_ToolAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BrowserEvent_ToolAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BrowserEvent_ToolAction, a, b2);
  }
  static $() {
    return ["BrowserEvent.ToolAction|1 tool_name 9|2 args_json 9|3 success 8?|4 post_snapshot_yaml 9?|5 post_url 9?|6 post_title 9?|7 source #0", BrowserEvent_ToolAction_Source];
  }
};
var BrowserEvent_ToolAction_Source = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "BrowserEvent.ToolAction.Source", [[0, "UNSPECIFIED"], [1, "MCP_TOOL"], [2, "MANUAL_USER"]], 1);
var NtpEvent = class _NtpEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.originateTimestamp = 0;
    this.receiveTimestamp = 0;
    this.transmitTimestamp = 0;
    this.destinationTimestamp = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NtpEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NtpEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NtpEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NtpEvent, a, b2);
  }
  static $() {
    return ["NtpEvent|1 originate_timestamp 1|2 receive_timestamp 1|3 transmit_timestamp 1|4 destination_timestamp 1"];
  }
};
var RepoEvent = class _RepoEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.repoOwner = "";
    this.repoName = "";
    this.eventType = RepoEvent_Type.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoEvent, a, b2);
  }
  static $() {
    return ["RepoEvent|1 repo_owner 9|2 repo_name 9|3 event_type #0", RepoEvent_Type];
  }
};
var RepoEvent_Type = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "RepoEvent.Type", [[0, "UNSPECIFIED"], [1, "SYNCED"], [2, "LOADING"], [3, "INDEXING_SETUP"], [4, "INDEXING_INIT_FROM_SIMILAR_CODEBASE"], [5, "PAUSED"], [6, "INDEXING"], [7, "ERROR"], [8, "NOT_AUTO_INDEXING"], [9, "NOT_INDEXED"]], 1);
var GitEvent = class _GitEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.operationType = GitEvent_OperationType.UNSPECIFIED;
    this.repositoryPath = "";
    this.operationSuccess = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitEvent, a, b2);
  }
  static $() {
    return ["GitEvent|1 operation_type #0|2 repository_path 9|3 operation_success 8|4 branch_name 9?|5 error_message 9?|6 is_default_branch 8?|7 default_branch_name 9?|8 commit_hash 9?|9 previous_commit_hash 9?|10 remote_url 9?", GitEvent_OperationType];
  }
};
var GitEvent_OperationType = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "GitEvent.OperationType", [[0, "UNSPECIFIED"], [1, "COMMIT"], [2, "CHECKOUT"], [3, "PULL"], [4, "FETCH"], [5, "MERGE"], [6, "REBASE"], [7, "STASH"], [8, "BRANCH"], [9, "TAG"]], 1);
var WorktreeEvent = class _WorktreeEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.eventType = WorktreeEvent_EventType.UNSPECIFIED;
    this.allWorktreePaths = [];
    this.worktreeComposerMappings = [];
    this.backgroundAgentComposerMappings = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorktreeEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorktreeEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorktreeEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorktreeEvent, a, b2);
  }
  static $() {
    return ["WorktreeEvent|1 event_type #0|2 model_name 9?|3 best_of_n_group_id 9?|4 all_worktree_paths 9*|5 applied_worktree_path 9?|6 worktree_composer_mappings #1*|7 background_agent_composer_mappings #2*|8 applied_composer_id 9?|9 viewed_composer_id 9?", WorktreeEvent_EventType, WorktreeEvent_WorktreeComposerMapping, WorktreeEvent_BackgroundAgentComposerMapping];
  }
};
var WorktreeEvent_EventType = /* @__PURE__ */ enumType2(proto3, __protoPackage117, "WorktreeEvent.EventType", [[0, "UNSPECIFIED"], [1, "APPLY_TO_MAIN"], [2, "UNDO_APPLY"], [3, "VIEW_SUBCOMPOSER"]], 1);
var WorktreeEvent_WorktreeComposerMapping = class _WorktreeEvent_WorktreeComposerMapping extends __protoMessage3116 {
  constructor(data) {
    super();
    this.worktreePath = "";
    this.composerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorktreeEvent_WorktreeComposerMapping().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorktreeEvent_WorktreeComposerMapping().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorktreeEvent_WorktreeComposerMapping().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorktreeEvent_WorktreeComposerMapping, a, b2);
  }
  static $() {
    return ["WorktreeEvent.WorktreeComposerMapping|1 worktree_path 9|2 composer_id 9"];
  }
};
var WorktreeEvent_BackgroundAgentComposerMapping = class _WorktreeEvent_BackgroundAgentComposerMapping extends __protoMessage3116 {
  constructor(data) {
    super();
    this.bcId = "";
    this.composerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WorktreeEvent_BackgroundAgentComposerMapping().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WorktreeEvent_BackgroundAgentComposerMapping().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WorktreeEvent_BackgroundAgentComposerMapping().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WorktreeEvent_BackgroundAgentComposerMapping, a, b2);
  }
  static $() {
    return ["WorktreeEvent.BackgroundAgentComposerMapping|1 bc_id 9|2 composer_id 9"];
  }
};
var ReviewChangesOpenedEvent = class _ReviewChangesOpenedEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.composerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReviewChangesOpenedEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReviewChangesOpenedEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReviewChangesOpenedEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReviewChangesOpenedEvent, a, b2);
  }
  static $() {
    return ["ReviewChangesOpenedEvent|1 composer_id 9|2 best_of_n_group_id 9?"];
  }
};
var ToolCallEvent = class _ToolCallEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.requestId = "";
    this.toolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ToolCallEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ToolCallEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ToolCallEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ToolCallEvent, a, b2);
  }
  static $() {
    return ["ToolCallEvent|1 tool_call_id 9|2 request_id 9|3 tool_name 9"];
  }
};
var SearchMatch = class _SearchMatch extends __protoMessage3116 {
  constructor(data) {
    super();
    this.lineNumber = 0;
    this.column = 0;
    this.matchText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchMatch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchMatch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchMatch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchMatch, a, b2);
  }
  static $() {
    return ["SearchMatch|1 line_number 5|2 column 5|3 match_text 9"];
  }
};
var SearchResultFile = class _SearchResultFile extends __protoMessage3116 {
  constructor(data) {
    super();
    this.filePath = "";
    this.matchCount = 0;
    this.matches = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchResultFile().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchResultFile().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchResultFile().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchResultFile, a, b2);
  }
  static $() {
    return ["SearchResultFile|1 file_path 9|2 match_count 5|3 matches #0*", SearchMatch];
  }
};
var SearchEvent = class _SearchEvent extends __protoMessage3116 {
  constructor(data) {
    super();
    this.query = "";
    this.resultCount = 0;
    this.fileCount = 0;
    this.isRegex = false;
    this.isCaseSensitive = false;
    this.isWholeWord = false;
    this.durationMs = 0;
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchEvent, a, b2);
  }
  static $() {
    return ["SearchEvent|1 query 9|2 result_count 5|3 file_count 5|4 is_regex 8|5 is_case_sensitive 8|6 is_whole_word 8|7 files_to_include 9?|8 files_to_exclude 9?|9 duration_ms 5|10 results #0*", SearchResultFile];
  }
};

