var __protoPackage9, __protoMessage36, ComposerCapabilityRequest, ComposerCapabilityRequest_ComposerCapabilityType, ComposerCapabilityRequest_ToolType, ComposerCapabilityRequest_ToolSchema, ComposerCapabilityRequest_SchemaProperty, ComposerCapabilityRequest_LoopOnLintsCapability, ComposerCapabilityRequest_LoopOnTestsCapability, ComposerCapabilityRequest_MegaPlannerCapability, ComposerCapabilityRequest_LoopOnCommandCapability, ComposerCapabilityRequest_ToolCallCapability, ComposerCapabilityRequest_DiffReviewCapability, ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff, ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk, ComposerCapabilityRequest_DecomposerCapability, ComposerCapabilityRequest_ContextPickingCapability, ComposerCapabilityRequest_EditTrailCapability, ComposerCapabilityRequest_AutoContextCapability, ComposerCapabilityRequest_ContextPlannerCapability, ComposerCapabilityRequest_RememberThisCapability, ComposerCapabilityRequest_CursorRulesCapability, ComposerCapabilityContext, ComposerCapabilityContext_SlackIntegrationContext, ComposerCapabilityContext_MicrosoftTeamsIntegrationContext, ComposerCapabilityContext_GithubPRContext, ComposerCapabilityContext_GithubPRContext_CodeTourContext;
var init_composer_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/composer_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_compact();
    __protoPackage9 = "aiserver.v1.";
    __protoMessage36 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage9;
      }
    };
    ComposerCapabilityRequest = class _ComposerCapabilityRequest extends __protoMessage36 {
      constructor(data) {
        super();
        this.type = ComposerCapabilityRequest_ComposerCapabilityType.UNSPECIFIED;
        this.data = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest|1 type #0|2 loop_on_lints #1 data|3 loop_on_tests #2 data|4 mega_planner #3 data|5 loop_on_command #4 data|6 tool_call #5 data|7 diff_review #6 data|8 context_picking #7 data|9 edit_trail #8 data|10 auto_context #9 data|11 context_planner #10 data|12 remember_this #11 data|13 decomposer #12 data|14 cursor_rules #13 data", ComposerCapabilityRequest_ComposerCapabilityType, ComposerCapabilityRequest_LoopOnLintsCapability, ComposerCapabilityRequest_LoopOnTestsCapability, ComposerCapabilityRequest_MegaPlannerCapability, ComposerCapabilityRequest_LoopOnCommandCapability, ComposerCapabilityRequest_ToolCallCapability, ComposerCapabilityRequest_DiffReviewCapability, ComposerCapabilityRequest_ContextPickingCapability, ComposerCapabilityRequest_EditTrailCapability, ComposerCapabilityRequest_AutoContextCapability, ComposerCapabilityRequest_ContextPlannerCapability, ComposerCapabilityRequest_RememberThisCapability, ComposerCapabilityRequest_DecomposerCapability, ComposerCapabilityRequest_CursorRulesCapability];
      }
    };
    ComposerCapabilityRequest_ComposerCapabilityType = /* @__PURE__ */ enumType(proto3, __protoPackage9, "ComposerCapabilityRequest.ComposerCapabilityType", [[0, "UNSPECIFIED"], [1, "LOOP_ON_LINTS"], [2, "LOOP_ON_TESTS"], [3, "MEGA_PLANNER"], [4, "LOOP_ON_COMMAND"], [5, "TOOL_CALL"], [6, "DIFF_REVIEW"], [7, "CONTEXT_PICKING"], [8, "EDIT_TRAIL"], [9, "AUTO_CONTEXT"], [10, "CONTEXT_PLANNER"], [11, "DIFF_HISTORY"], [12, "REMEMBER_THIS"], [13, "DECOMPOSER"], [14, "USES_CODEBASE"], [15, "TOOL_FORMER"], [16, "CURSOR_RULES"], [17, "TOKEN_COUNTER"], [18, "USAGE_DATA"], [19, "CHIMES"], [20, "CODE_DECAY_TRACKER"], [21, "BACKGROUND_COMPOSER"], [22, "SUMMARIZATION"], [23, "AI_CODE_TRACKING"], [24, "QUEUING"], [25, "MEMORIES"], [26, "RCP_LOGS"], [27, "KNOWLEDGE_FETCH"], [28, "SLACK_INTEGRATION"], [29, "SUB_COMPOSER"], [30, "THINKING"], [31, "CONTEXT_WINDOW"], [32, "ONLINE_METRICS"], [33, "NOTIFICATIONS"], [34, "SPEC"], [35, "BROWSER_AGENT"]], 1);
    ComposerCapabilityRequest_ToolType = /* @__PURE__ */ enumType(proto3, __protoPackage9, "ComposerCapabilityRequest.ToolType", [[0, "UNSPECIFIED"], [1, "ADD_FILE_TO_CONTEXT"], [3, "ITERATE"], [4, "REMOVE_FILE_FROM_CONTEXT"], [5, "SEMANTIC_SEARCH_CODEBASE"]], 1);
    ComposerCapabilityRequest_ToolSchema = class _ComposerCapabilityRequest_ToolSchema extends __protoMessage36 {
      constructor(data) {
        super();
        this.type = ComposerCapabilityRequest_ToolType.UNSPECIFIED;
        this.name = "";
        this.properties = {};
        this.required = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_ToolSchema().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_ToolSchema().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_ToolSchema().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_ToolSchema, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.ToolSchema|1 type #0|2 name 9|3 properties 9,#1|4 required 9*", ComposerCapabilityRequest_ToolType, ComposerCapabilityRequest_SchemaProperty];
      }
    };
    ComposerCapabilityRequest_SchemaProperty = class _ComposerCapabilityRequest_SchemaProperty extends __protoMessage36 {
      constructor(data) {
        super();
        this.type = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_SchemaProperty().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_SchemaProperty().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_SchemaProperty().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_SchemaProperty, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.SchemaProperty|1 type 9|2 description 9?"];
      }
    };
    ComposerCapabilityRequest_LoopOnLintsCapability = class _ComposerCapabilityRequest_LoopOnLintsCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.linterErrors = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_LoopOnLintsCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_LoopOnLintsCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_LoopOnLintsCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_LoopOnLintsCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.LoopOnLintsCapability|1 linter_errors #0*|2 custom_instructions 9?", LinterErrors];
      }
    };
    ComposerCapabilityRequest_LoopOnTestsCapability = class _ComposerCapabilityRequest_LoopOnTestsCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.testNames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_LoopOnTestsCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_LoopOnTestsCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_LoopOnTestsCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_LoopOnTestsCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.LoopOnTestsCapability|1 test_names 9*|2 custom_instructions 9?"];
      }
    };
    ComposerCapabilityRequest_MegaPlannerCapability = class _ComposerCapabilityRequest_MegaPlannerCapability extends __protoMessage36 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_MegaPlannerCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_MegaPlannerCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_MegaPlannerCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_MegaPlannerCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.MegaPlannerCapability|1 custom_instructions 9?"];
      }
    };
    ComposerCapabilityRequest_LoopOnCommandCapability = class _ComposerCapabilityRequest_LoopOnCommandCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.command = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_LoopOnCommandCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_LoopOnCommandCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_LoopOnCommandCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_LoopOnCommandCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.LoopOnCommandCapability|1 command 9|2 custom_instructions 9?|3 output 9?|4 exit_code 5?"];
      }
    };
    ComposerCapabilityRequest_ToolCallCapability = class _ComposerCapabilityRequest_ToolCallCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.toolSchemas = [];
        this.relevantFiles = [];
        this.filesInContext = [];
        this.semanticSearchFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_ToolCallCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_ToolCallCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_ToolCallCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_ToolCallCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.ToolCallCapability|1 custom_instructions 9?|2 tool_schemas #0*|3 relevant_files 9*|4 files_in_context 9*|5 semantic_search_files 9*", ComposerCapabilityRequest_ToolSchema];
      }
    };
    ComposerCapabilityRequest_DiffReviewCapability = class _ComposerCapabilityRequest_DiffReviewCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.diffs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_DiffReviewCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.DiffReviewCapability|1 custom_instructions 9?|2 diffs #0*", ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff];
      }
    };
    ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff = class _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff extends __protoMessage36 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.chunks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.DiffReviewCapability.SimpleFileDiff|1 relative_workspace_path 9|3 chunks #0*", ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk];
      }
    };
    ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk = class _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk extends __protoMessage36 {
      constructor(data) {
        super();
        this.oldLines = [];
        this.newLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_DiffReviewCapability_SimpleFileDiff_Chunk, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.DiffReviewCapability.SimpleFileDiff.Chunk|1 old_lines 9*|2 new_lines 9*|3 old_range #0|4 new_range #0", LineRange];
      }
    };
    ComposerCapabilityRequest_DecomposerCapability = class _ComposerCapabilityRequest_DecomposerCapability extends __protoMessage36 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_DecomposerCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_DecomposerCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_DecomposerCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_DecomposerCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.DecomposerCapability|1 custom_instructions 9?"];
      }
    };
    ComposerCapabilityRequest_ContextPickingCapability = class _ComposerCapabilityRequest_ContextPickingCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.potentialContextFiles = [];
        this.potentialContextCodeChunks = [];
        this.filesInContext = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_ContextPickingCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_ContextPickingCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_ContextPickingCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_ContextPickingCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.ContextPickingCapability|1 custom_instructions 9?|2 potential_context_files 9*|3 potential_context_code_chunks #0*|4 files_in_context 9*", CodeChunk];
      }
    };
    ComposerCapabilityRequest_EditTrailCapability = class _ComposerCapabilityRequest_EditTrailCapability extends __protoMessage36 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_EditTrailCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_EditTrailCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_EditTrailCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_EditTrailCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.EditTrailCapability|1 custom_instructions 9?"];
      }
    };
    ComposerCapabilityRequest_AutoContextCapability = class _ComposerCapabilityRequest_AutoContextCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.additionalFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_AutoContextCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_AutoContextCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_AutoContextCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_AutoContextCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.AutoContextCapability|1 custom_instructions 9?|2 additional_files 9*"];
      }
    };
    ComposerCapabilityRequest_ContextPlannerCapability = class _ComposerCapabilityRequest_ContextPlannerCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.attachedCodeChunks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_ContextPlannerCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_ContextPlannerCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_ContextPlannerCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_ContextPlannerCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.ContextPlannerCapability|1 custom_instructions 9?|2 attached_code_chunks #0*", CodeChunk];
      }
    };
    ComposerCapabilityRequest_RememberThisCapability = class _ComposerCapabilityRequest_RememberThisCapability extends __protoMessage36 {
      constructor(data) {
        super();
        this.memory = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_RememberThisCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_RememberThisCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_RememberThisCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_RememberThisCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.RememberThisCapability|1 custom_instructions 9?|2 memory 9"];
      }
    };
    ComposerCapabilityRequest_CursorRulesCapability = class _ComposerCapabilityRequest_CursorRulesCapability extends __protoMessage36 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityRequest_CursorRulesCapability().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityRequest_CursorRulesCapability().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityRequest_CursorRulesCapability().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityRequest_CursorRulesCapability, a, b2);
      }
      static $() {
        return ["ComposerCapabilityRequest.CursorRulesCapability|1 custom_instructions 9?"];
      }
    };
    ComposerCapabilityContext = class _ComposerCapabilityContext extends __protoMessage36 {
      constructor(data) {
        super();
        this.data = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityContext, a, b2);
      }
      static $() {
        return ["ComposerCapabilityContext|27 slack_integration #0 data|28 github_pr #1 data|29 microsoft_teams_integration #2 data", ComposerCapabilityContext_SlackIntegrationContext, ComposerCapabilityContext_GithubPRContext, ComposerCapabilityContext_MicrosoftTeamsIntegrationContext];
      }
    };
    ComposerCapabilityContext_SlackIntegrationContext = class _ComposerCapabilityContext_SlackIntegrationContext extends __protoMessage36 {
      constructor(data) {
        super();
        this.thread = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityContext_SlackIntegrationContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityContext_SlackIntegrationContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityContext_SlackIntegrationContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityContext_SlackIntegrationContext, a, b2);
      }
      static $() {
        return ["ComposerCapabilityContext.SlackIntegrationContext|1 thread 9|2 channel_name 9?|3 channel_purpose 9?|4 channel_topic 9?|5 sender_name 9?|6 sender_id 9?|7 sender_type 9?|8 is_directly_addressed 8?"];
      }
    };
    ComposerCapabilityContext_MicrosoftTeamsIntegrationContext = class _ComposerCapabilityContext_MicrosoftTeamsIntegrationContext extends __protoMessage36 {
      constructor(data) {
        super();
        this.thread = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityContext_MicrosoftTeamsIntegrationContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityContext_MicrosoftTeamsIntegrationContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityContext_MicrosoftTeamsIntegrationContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityContext_MicrosoftTeamsIntegrationContext, a, b2);
      }
      static $() {
        return ["ComposerCapabilityContext.MicrosoftTeamsIntegrationContext|1 thread 9|2 channel_name 9?|3 team_name 9?|4 channel_description 9?|5 team_description 9?"];
      }
    };
    ComposerCapabilityContext_GithubPRContext = class _ComposerCapabilityContext_GithubPRContext extends __protoMessage36 {
      constructor(data) {
        super();
        this.title = "";
        this.description = "";
        this.comments = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityContext_GithubPRContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityContext_GithubPRContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityContext_GithubPRContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityContext_GithubPRContext, a, b2);
      }
      static $() {
        return ["ComposerCapabilityContext.GithubPRContext|1 title 9|2 description 9|3 comments 9|4 ci_failures 9?|5 code_tour_context #0", ComposerCapabilityContext_GithubPRContext_CodeTourContext];
      }
    };
    ComposerCapabilityContext_GithubPRContext_CodeTourContext = class _ComposerCapabilityContext_GithubPRContext_CodeTourContext extends __protoMessage36 {
      constructor(data) {
        super();
        this.changeId = "";
        this.headSha = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerCapabilityContext_GithubPRContext_CodeTourContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerCapabilityContext_GithubPRContext_CodeTourContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerCapabilityContext_GithubPRContext_CodeTourContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerCapabilityContext_GithubPRContext_CodeTourContext, a, b2);
      }
      static $() {
        return ["ComposerCapabilityContext.GithubPRContext.CodeTourContext|1 change_id 9|2 head_sha 9|3 current_revision_id 9?|4 visible_section_id 9?|5 visible_step_id 9?|6 path_scope_prefix 9?"];
      }
    };
  }
});
