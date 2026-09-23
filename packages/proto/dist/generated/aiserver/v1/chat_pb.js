var __protoPackage100, __protoMessage395, ChunkType, SubagentType2, ConversationSummary2, ContextToRank, RankedContext, DocumentationCitation, WebCitation, WebReference, DocsReference, AiWebSearchResult, StatusUpdate, StatusUpdates, RerankDocumentsRequest, RerankDocumentsResponse, Document, DocumentIdsWithScores, ComposerFileDiffHistory, StreamUnifiedChatRequest_UnifiedMode, ContextPiece, ContextWindowStatus, ServiceStatusUpdate, SymbolLink, FileLink, RedDiff, DiffFile, ViewableCommitProps, ViewablePRProps, ViewableDiffProps, ViewableGitContext, ConversationMessage, ConversationMessage_MessageType, ConversationMessage_ThinkingStyle, ConversationMessage_CodeChunk, ConversationMessage_CodeChunk_Intent, ConversationMessage_CodeChunk_SummarizationStrategy, ConversationMessage_CodeChunk_CodeChunkGitContext, ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo, ConversationMessage_ToolResult, ConversationMessage_NotepadContext, ConversationMessage_ComposerContext, ConversationMessage_EditLocation, ConversationMessage_EditTrailContext, ConversationMessage_ApproximateLintError, ConversationMessage_Lints, ConversationMessage_RecentLocation, ConversationMessage_RenderedDiff, ConversationMessage_HumanChange, ConversationMessage_Thinking, ConversationMessage_DiffSinceLastApply, ConversationMessage_DeletedFile, ConversationMessage_KnowledgeItem, ConversationMessage_DocumentationSelection, ConversationMessage_IdeEditorsState, ConversationMessage_IdeEditorsState_File, ConversationMessage_PlanUpdate, ConversationMessage_SimulatedMessageMetadata, ConversationMessage_McpDescriptor, ConversationMessage_McpDescriptor_Tool, CurrentFileLocationData, FolderInfo, FolderFileInfo, InterpreterResult, SimpleFileDiff, SimpleFileDiff_Chunk, Commit, PullRequest, SuggestedCodeBlock, UserResponseToSuggestedCodeBlock, UserResponseToSuggestedCodeBlock_UserResponseType, ContextRerankingCandidateFile, ComposerFileDiff, ComposerFileDiff_Editor, ComposerFileDiff_ChunkDiff, DiffHistoryData, SubagentReturnCall, DeepSearchSubagentReturnValue, DeepSearchSubagentReturnValue_ContextItem, FixLintsSubagentReturnValue, TaskSubagentReturnValue, SpecSubagentReturnValue, StringReplacement, ProjectLayout, ProjectLayoutDirectoryContent, ProjectLayoutDirectory, ProjectLayoutFile;
var init_chat_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/chat_pb.js"() {
    "use strict";
    init_esm();
    init_tools_pb();
    init_utils_pb();
    init_docs_pb();
    init_composer_pb();
    init_agent_pb();
    init_request_context_exec_pb();
    init_selected_context_pb();
    init_shadow_workspace_pb();
    init_compact();
    __protoPackage100 = "aiserver.v1.";
    __protoMessage395 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage100;
      }
    };
    ChunkType = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ChunkType", [[0, "UNSPECIFIED"], [1, "CODEBASE"], [2, "LONG_FILE"], [3, "DOCS"]], 1);
    SubagentType2 = /* @__PURE__ */ enumType(proto3, __protoPackage100, "SubagentType", [[0, "UNSPECIFIED"], [1, "DEEP_SEARCH"], [2, "FIX_LINTS"], [3, "TASK"], [4, "SPEC"]], 1);
    ConversationSummary2 = class _ConversationSummary extends __protoMessage395 {
      constructor(data) {
        super();
        this.summary = "";
        this.truncationLastBubbleIdInclusive = "";
        this.clientShouldStartSendingFromInclusiveBubbleId = "";
        this.previousConversationSummaryBubbleId = "";
        this.includesToolResults = false;
        this.strategy = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSummary().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSummary().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSummary().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSummary, a, b2);
      }
      static $() {
        return ["ConversationSummary|1 summary 9|2 truncation_last_bubble_id_inclusive 9|3 client_should_start_sending_from_inclusive_bubble_id 9|4 previous_conversation_summary_bubble_id 9|5 includes_tool_results 8|6 strategy 9"];
      }
    };
    ContextToRank = class _ContextToRank extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextToRank().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextToRank().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextToRank().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextToRank, a, b2);
      }
      static $() {
        return ["ContextToRank|1 relative_workspace_path 9|2 contents 9|3 line_range #0?|4 code_block #1?", LineRange, CodeBlock];
      }
    };
    RankedContext = class _RankedContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RankedContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RankedContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RankedContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RankedContext, a, b2);
      }
      static $() {
        return ["RankedContext|1 context #0|2 score 2", ContextToRank];
      }
    };
    DocumentationCitation = class _DocumentationCitation extends __protoMessage395 {
      constructor(data) {
        super();
        this.chunks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentationCitation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentationCitation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentationCitation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentationCitation, a, b2);
      }
      static $() {
        return ["DocumentationCitation|1 chunks #0*", DocumentationChunk];
      }
    };
    WebCitation = class _WebCitation extends __protoMessage395 {
      constructor(data) {
        super();
        this.references = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebCitation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebCitation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebCitation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebCitation, a, b2);
      }
      static $() {
        return ["WebCitation|1 references #0*", WebReference];
      }
    };
    WebReference = class _WebReference extends __protoMessage395 {
      constructor(data) {
        super();
        this.title = "";
        this.url = "";
        this.chunk = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebReference, a, b2);
      }
      static $() {
        return ["WebReference|2 title 9|1 url 9|3 chunk 9"];
      }
    };
    DocsReference = class _DocsReference extends __protoMessage395 {
      constructor(data) {
        super();
        this.title = "";
        this.url = "";
        this.chunk = "";
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocsReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocsReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocsReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocsReference, a, b2);
      }
      static $() {
        return ["DocsReference|1 title 9|2 url 9|3 chunk 9|4 name 9"];
      }
    };
    AiWebSearchResult = class _AiWebSearchResult extends __protoMessage395 {
      constructor(data) {
        super();
        this.content = "";
        this.title = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AiWebSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AiWebSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AiWebSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AiWebSearchResult, a, b2);
      }
      static $() {
        return ["AiWebSearchResult|1 content 9|2 title 9"];
      }
    };
    StatusUpdate = class _StatusUpdate extends __protoMessage395 {
      constructor(data) {
        super();
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StatusUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StatusUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StatusUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StatusUpdate, a, b2);
      }
      static $() {
        return ["StatusUpdate|1 message 9|2 metadata 9?"];
      }
    };
    StatusUpdates = class _StatusUpdates extends __protoMessage395 {
      constructor(data) {
        super();
        this.updates = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StatusUpdates().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StatusUpdates().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StatusUpdates().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StatusUpdates, a, b2);
      }
      static $() {
        return ["StatusUpdates|1 updates #0*", StatusUpdate];
      }
    };
    RerankDocumentsRequest = class _RerankDocumentsRequest extends __protoMessage395 {
      constructor(data) {
        super();
        this.query = "";
        this.documents = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RerankDocumentsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RerankDocumentsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RerankDocumentsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RerankDocumentsRequest, a, b2);
      }
      static $() {
        return ["RerankDocumentsRequest|1 query 9|2 documents #0*", Document];
      }
    };
    RerankDocumentsResponse = class _RerankDocumentsResponse extends __protoMessage395 {
      constructor(data) {
        super();
        this.documents = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RerankDocumentsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RerankDocumentsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RerankDocumentsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RerankDocumentsResponse, a, b2);
      }
      static $() {
        return ["RerankDocumentsResponse|1 documents #0*", DocumentIdsWithScores];
      }
    };
    Document = class _Document extends __protoMessage395 {
      constructor(data) {
        super();
        this.content = "";
        this.id = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Document().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Document().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Document().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Document, a, b2);
      }
      static $() {
        return ["Document|1 content 9|2 id 9"];
      }
    };
    DocumentIdsWithScores = class _DocumentIdsWithScores extends __protoMessage395 {
      constructor(data) {
        super();
        this.documentId = "";
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentIdsWithScores().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentIdsWithScores().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentIdsWithScores().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentIdsWithScores, a, b2);
      }
      static $() {
        return ["DocumentIdsWithScores|1 document_id 9|2 score 2"];
      }
    };
    ComposerFileDiffHistory = class _ComposerFileDiffHistory extends __protoMessage395 {
      constructor(data) {
        super();
        this.fileName = "";
        this.diffHistory = [];
        this.diffHistoryTimestamps = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerFileDiffHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerFileDiffHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerFileDiffHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerFileDiffHistory, a, b2);
      }
      static $() {
        return ["ComposerFileDiffHistory|1 file_name 9|2 diff_history 9*|3 diff_history_timestamps 1*"];
      }
    };
    StreamUnifiedChatRequest_UnifiedMode = /* @__PURE__ */ enumType(proto3, __protoPackage100, "StreamUnifiedChatRequest.UnifiedMode", [[0, "UNSPECIFIED"], [1, "CHAT"], [2, "AGENT"], [3, "EDIT"], [4, "CUSTOM"], [5, "PLAN"], [6, "DEBUG"]], 1);
    ContextPiece = class _ContextPiece extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.content = "";
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextPiece().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextPiece().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextPiece().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextPiece, a, b2);
      }
      static $() {
        return ["ContextPiece|1 relative_workspace_path 9|2 content 9|3 score 2"];
      }
    };
    ContextWindowStatus = class _ContextWindowStatus extends __protoMessage395 {
      constructor(data) {
        super();
        this.percentageRemaining = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextWindowStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextWindowStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextWindowStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextWindowStatus, a, b2);
      }
      static $() {
        return ["ContextWindowStatus|1 percentage_remaining 5|2 tokens_used 5?|3 token_limit 5?|4 percentage_remaining_float 2?"];
      }
    };
    ServiceStatusUpdate = class _ServiceStatusUpdate extends __protoMessage395 {
      constructor(data) {
        super();
        this.message = "";
        this.codicon = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ServiceStatusUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ServiceStatusUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ServiceStatusUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ServiceStatusUpdate, a, b2);
      }
      static $() {
        return ["ServiceStatusUpdate|1 message 9|2 codicon 9|3 allow_command_links_potentially_unsafe_please_only_use_for_handwritten_trusted_markdown 8?|4 action_to_run_on_status_update 9?"];
      }
    };
    SymbolLink = class _SymbolLink extends __protoMessage395 {
      constructor(data) {
        super();
        this.symbolName = "";
        this.symbolSearchString = "";
        this.relativeWorkspacePath = "";
        this.roughLineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SymbolLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SymbolLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SymbolLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SymbolLink, a, b2);
      }
      static $() {
        return ["SymbolLink|1 symbol_name 9|2 symbol_search_string 9|3 relative_workspace_path 9|4 rough_line_number 5"];
      }
    };
    FileLink = class _FileLink extends __protoMessage395 {
      constructor(data) {
        super();
        this.displayName = "";
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileLink, a, b2);
      }
      static $() {
        return ["FileLink|1 display_name 9|2 relative_workspace_path 9"];
      }
    };
    RedDiff = class _RedDiff extends __protoMessage395 {
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
        return new _RedDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RedDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RedDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RedDiff, a, b2);
      }
      static $() {
        return ["RedDiff|1 relative_workspace_path 9|2 red_ranges #0*|3 red_ranges_reversed #0*|4 start_hash 9|5 end_hash 9", SimplestRange];
      }
    };
    DiffFile = class _DiffFile extends __protoMessage395 {
      constructor(data) {
        super();
        this.fileDetails = "";
        this.fileName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiffFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiffFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiffFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiffFile, a, b2);
      }
      static $() {
        return ["DiffFile|1 file_details 9|2 file_name 9"];
      }
    };
    ViewableCommitProps = class _ViewableCommitProps extends __protoMessage395 {
      constructor(data) {
        super();
        this.description = "";
        this.message = "";
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ViewableCommitProps().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ViewableCommitProps().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ViewableCommitProps().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ViewableCommitProps, a, b2);
      }
      static $() {
        return ["ViewableCommitProps|1 description 9|2 message 9|3 files #0*", DiffFile];
      }
    };
    ViewablePRProps = class _ViewablePRProps extends __protoMessage395 {
      constructor(data) {
        super();
        this.title = "";
        this.body = "";
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ViewablePRProps().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ViewablePRProps().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ViewablePRProps().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ViewablePRProps, a, b2);
      }
      static $() {
        return ["ViewablePRProps|1 title 9|2 body 9|3 files #0*", DiffFile];
      }
    };
    ViewableDiffProps = class _ViewableDiffProps extends __protoMessage395 {
      constructor(data) {
        super();
        this.files = [];
        this.diffPreface = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ViewableDiffProps().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ViewableDiffProps().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ViewableDiffProps().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ViewableDiffProps, a, b2);
      }
      static $() {
        return ["ViewableDiffProps|1 files #0*|2 diff_preface 9", DiffFile];
      }
    };
    ViewableGitContext = class _ViewableGitContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.diffData = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ViewableGitContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ViewableGitContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ViewableGitContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ViewableGitContext, a, b2);
      }
      static $() {
        return ["ViewableGitContext|1 commit_data #0?|2 pull_request_data #1?|3 diff_data #2*", ViewableCommitProps, ViewablePRProps, ViewableDiffProps];
      }
    };
    ConversationMessage = class _ConversationMessage extends __protoMessage395 {
      constructor(data) {
        super();
        this.text = "";
        this.type = ConversationMessage_MessageType.UNSPECIFIED;
        this.attachedCodeChunks = [];
        this.codebaseContextChunks = [];
        this.commits = [];
        this.pullRequests = [];
        this.gitDiffs = [];
        this.assistantSuggestedDiffs = [];
        this.interpreterResults = [];
        this.images = [];
        this.attachedFolders = [];
        this.approximateLintErrors = [];
        this.bubbleId = "";
        this.attachedFoldersNew = [];
        this.lints = [];
        this.userResponsesToSuggestedCodeBlocks = [];
        this.relevantFiles = [];
        this.toolResults = [];
        this.notepads = [];
        this.capabilities = [];
        this.editTrailContexts = [];
        this.suggestedCodeBlocks = [];
        this.diffsForCompressingFiles = [];
        this.multiFileLinterErrors = [];
        this.diffHistories = [];
        this.recentlyViewedFiles = [];
        this.recentLocationsHistory = [];
        this.isAgentic = false;
        this.fileDiffTrajectories = [];
        this.existedSubsequentTerminalCommand = false;
        this.existedPreviousTerminalCommand = false;
        this.docsReferences = [];
        this.webReferences = [];
        this.aiWebSearchResults = [];
        this.attachedFoldersListDirResults = [];
        this.humanChanges = [];
        this.attachedHumanChanges = false;
        this.summarizedComposers = [];
        this.cursorRules = [];
        this.contextPieces = [];
        this.allThinkingBlocks = [];
        this.diffsSinceLastApply = [];
        this.deletedFiles = [];
        this.supportedTools = [];
        this.consoleLogs = [];
        this.knowledgeItems = [];
        this.uiElementPicked = [];
        this.documentationSelections = [];
        this.externalLinks = [];
        this.projectLayouts = [];
        this.capabilityContexts = [];
        this.todos = [];
        this.requestId = "";
        this.createdAt = "";
        this.mcpDescriptors = [];
        this.workspaceUris = [];
        this.cursorCommands = [];
        this.cursorCommandsExplicitlySet = false;
        this.pastChats = [];
        this.pastChatsExplicitlySet = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage, a, b2);
      }
      static $() {
        return ["ConversationMessage|1 text 9|2 type #0|3 attached_code_chunks #1*|4 codebase_context_chunks #2*|5 commits #3*|6 pull_requests #4*|7 git_diffs #5*|8 assistant_suggested_diffs #6*|9 interpreter_results #7*|10 images #8*|11 attached_folders 9*|12 approximate_lint_errors #9*|13 bubble_id 9|32 server_bubble_id 9?|14 attached_folders_new #10*|15 lints #11*|16 user_responses_to_suggested_code_blocks #12*|17 relevant_files 9*|18 tool_results #13*|19 notepads #14*|20 is_capability_iteration 8?|21 capabilities #15*|22 edit_trail_contexts #16*|23 suggested_code_blocks #17*|24 diffs_for_compressing_files #18*|25 multi_file_linter_errors #19*|26 diff_histories #20*|27 recently_viewed_files #1*|28 recent_locations_history #21*|29 is_agentic 8|30 file_diff_trajectories #22*|31 conversation_summary #23?|33 existed_subsequent_terminal_command 8|34 existed_previous_terminal_command 8|35 docs_references #24*|36 web_references #25*|75 ai_web_search_results #26*|37 git_context #27?|38 attached_folders_list_dir_results #28*|39 cached_conversation_summary #23?|40 human_changes #29*|41 attached_human_changes 8|42 summarized_composers #30*|43 cursor_rules #31*|44 context_pieces #32*|45 thinking #33?|46 all_thinking_blocks #33*|85 thinking_style #34?|47 unified_mode #35?|98 agent_mode #36?|48 diffs_since_last_apply #37*|49 deleted_files #38*|50 usage_uuid 9?|51 supported_tools #39*|52 current_file_location_data #40?|53 edit_tool_supports_search_and_replace 8?|54 last_terminal_cwd 9?|55 user_explicitly_asked_to_generate_cursor_rules 8?|56 console_logs #41*|57 rich_text 9?|58 knowledge_items #42*|59 ui_element_picked #43*|60 user_explicitly_asked_to_add_to_knowledge_base 8?|61 documentation_selections #44*|62 external_links #45*|63 use_web 8?|64 project_layouts #46*|65 thinking_duration_ms 5?|88 step_duration_ms 5?|66 subagent_return #47?|67 is_simple_looping_message 8?|68 capability_contexts #48*|69 checkpoint_commit_hash 9?|70 git_status_raw 9?|71 todos #49*|72 is_review_edits_followup 8?|74 request_id 9|73 ide_editors_state #50?|76 context_window_status #51?|77 is_plan_execution 8?|78 created_at 9|79 model_info #52|80 is_quick_search_query 8?|81 plan_update #53?|82 is_simulated_msg 8?|95 simulated_msg_reason #54?|97 simulated_message_metadata #55?|83 mcp_descriptors #56*|84 workspace_project_dir 9?|87 workspace_uris 9*|86 debug_mode_config #57?|89 text_blob_id 12?|90 rich_text_blob_id 12?|91 cursor_commands #58*|92 cursor_commands_explicitly_set 8|93 past_chats #59*|94 past_chats_explicitly_set 8|96 triggering_user_info #60?|99 turn_steer 8?|100 sent_by_agent_id 9?", ConversationMessage_MessageType, ConversationMessage_CodeChunk, CodeBlock, Commit, PullRequest, GitDiff, SimpleFileDiff, InterpreterResult, ImageProto, ConversationMessage_ApproximateLintError, FolderInfo, ConversationMessage_Lints, UserResponseToSuggestedCodeBlock, ConversationMessage_ToolResult, ConversationMessage_NotepadContext, ComposerCapabilityRequest, ConversationMessage_EditTrailContext, SuggestedCodeBlock, RedDiff, LinterErrorsWithoutFileContents, DiffHistoryData, ConversationMessage_RecentLocation, ComposerFileDiffHistory, ConversationSummary2, DocsReference, WebReference, AiWebSearchResult, ViewableGitContext, ListDirResult, ConversationMessage_HumanChange, ConversationMessage_ComposerContext, CursorRule, ContextPiece, ConversationMessage_Thinking, ConversationMessage_ThinkingStyle, StreamUnifiedChatRequest_UnifiedMode, AgentMode, ConversationMessage_DiffSinceLastApply, ConversationMessage_DeletedFile, ClientSideToolV2, CurrentFileLocationData, RCPLogEntry, ConversationMessage_KnowledgeItem, RCPUIElementPicked, ConversationMessage_DocumentationSelection, ComposerExternalLink, ProjectLayout, SubagentReturnCall, ComposerCapabilityContext, TodoItem2, ConversationMessage_IdeEditorsState, ContextWindowStatus, ModelInfo, ConversationMessage_PlanUpdate, SimulatedMsgReason, ConversationMessage_SimulatedMessageMetadata, ConversationMessage_McpDescriptor, DebugModeConfig, SelectedCursorCommand, SelectedPastChat, TriggeringUserInfo];
      }
    };
    ConversationMessage_MessageType = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ConversationMessage.MessageType", [[0, "UNSPECIFIED"], [1, "HUMAN"], [2, "AI"]], 1);
    ConversationMessage_ThinkingStyle = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ConversationMessage.ThinkingStyle", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "CODEX"], [3, "GPT5"]], 1);
    ConversationMessage_CodeChunk = class _ConversationMessage_CodeChunk extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.startLineNumber = 0;
        this.lines = [];
        this.languageIdentifier = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_CodeChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_CodeChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_CodeChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_CodeChunk, a, b2);
      }
      static $() {
        return ["ConversationMessage.CodeChunk|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*|4 summarization_strategy #0?|5 language_identifier 9|6 intent #1?|7 is_final_version 8?|8 is_first_version 8?|9 contents_are_missing 8?|10 is_only_included_from_folder 8?|11 code_chunk_git_context #2?", ConversationMessage_CodeChunk_SummarizationStrategy, ConversationMessage_CodeChunk_Intent, ConversationMessage_CodeChunk_CodeChunkGitContext];
      }
    };
    ConversationMessage_CodeChunk_Intent = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ConversationMessage.CodeChunk.Intent", [[0, "UNSPECIFIED"], [1, "COMPOSER_FILE"], [2, "COMPRESSED_COMPOSER_FILE"], [3, "RECENTLY_VIEWED_FILE"], [4, "OUTLINE"], [5, "MENTIONED_FILE"], [6, "CODE_SELECTION"], [7, "AI_EDITED_FILE"], [8, "VISIBLE_FILE"], [9, "TERMINAL_SELECTION"]], 1);
    ConversationMessage_CodeChunk_SummarizationStrategy = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ConversationMessage.CodeChunk.SummarizationStrategy", [[0, "NONE_UNSPECIFIED"], [1, "SUMMARIZED"], [2, "EMBEDDED"]], 1);
    ConversationMessage_CodeChunk_CodeChunkGitContext = class _ConversationMessage_CodeChunk_CodeChunkGitContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.gitInfo = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_CodeChunk_CodeChunkGitContext, a, b2);
      }
      static $() {
        return ["ConversationMessage.CodeChunk.CodeChunkGitContext|1 git_info #0*", ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo];
      }
    };
    ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo = class _ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo extends __protoMessage395 {
      constructor(data) {
        super();
        this.commit = "";
        this.author = "";
        this.date = "";
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_CodeChunk_CodeChunkGitContext_CodeChunkGitInfo, a, b2);
      }
      static $() {
        return ["ConversationMessage.CodeChunk.CodeChunkGitContext.CodeChunkGitInfo|1 commit 9|2 author 9|3 date 9|4 message 9"];
      }
    };
    ConversationMessage_ToolResult = class _ConversationMessage_ToolResult extends __protoMessage395 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.toolName = "";
        this.toolIndex = 0;
        this.args = "";
        this.rawArgs = "";
        this.attachedCodeChunks = [];
        this.images = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_ToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_ToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_ToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_ToolResult, a, b2);
      }
      static $() {
        return ["ConversationMessage.ToolResult|1 tool_call_id 9|2 tool_name 9|3 tool_index 13|12 model_call_id 9?|4 args 9|5 raw_args 9|6 attached_code_chunks #0*|7 content 9?|8 result #1|9 error #2?|10 images #3*|11 tool_call #4?|13 started_at_ms 4?|14 completed_at_ms 4?", ConversationMessage_CodeChunk, ClientSideToolV2Result, ToolResultError, ImageProto, ClientSideToolV2Call];
      }
    };
    ConversationMessage_NotepadContext = class _ConversationMessage_NotepadContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.name = "";
        this.text = "";
        this.attachedCodeChunks = [];
        this.attachedFolders = [];
        this.commits = [];
        this.pullRequests = [];
        this.gitDiffs = [];
        this.images = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_NotepadContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_NotepadContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_NotepadContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_NotepadContext, a, b2);
      }
      static $() {
        return ["ConversationMessage.NotepadContext|1 name 9|2 text 9|3 attached_code_chunks #0*|4 attached_folders 9*|5 commits #1*|6 pull_requests #2*|7 git_diffs #3*|8 images #4*", ConversationMessage_CodeChunk, Commit, PullRequest, GitDiff, ImageProto];
      }
    };
    ConversationMessage_ComposerContext = class _ConversationMessage_ComposerContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_ComposerContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_ComposerContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_ComposerContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_ComposerContext, a, b2);
      }
      static $() {
        return ["ConversationMessage.ComposerContext|1 name 9|2 conversation_summary #0", ConversationSummary2];
      }
    };
    ConversationMessage_EditLocation = class _ConversationMessage_EditLocation extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contextLines = "";
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_EditLocation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_EditLocation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_EditLocation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_EditLocation, a, b2);
      }
      static $() {
        return ["ConversationMessage.EditLocation|1 relative_workspace_path 9|3 range #0|4 initial_range #0|5 context_lines 9|6 text 9|7 text_range #0", SimplestRange];
      }
    };
    ConversationMessage_EditTrailContext = class _ConversationMessage_EditTrailContext extends __protoMessage395 {
      constructor(data) {
        super();
        this.uniqueId = "";
        this.editTrailSorted = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_EditTrailContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_EditTrailContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_EditTrailContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_EditTrailContext, a, b2);
      }
      static $() {
        return ["ConversationMessage.EditTrailContext|1 unique_id 9|2 edit_trail_sorted #0*", ConversationMessage_EditLocation];
      }
    };
    ConversationMessage_ApproximateLintError = class _ConversationMessage_ApproximateLintError extends __protoMessage395 {
      constructor(data) {
        super();
        this.message = "";
        this.value = "";
        this.startLine = 0;
        this.endLine = 0;
        this.startColumn = 0;
        this.endColumn = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_ApproximateLintError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_ApproximateLintError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_ApproximateLintError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_ApproximateLintError, a, b2);
      }
      static $() {
        return ["ConversationMessage.ApproximateLintError|1 message 9|2 value 9|3 start_line 5|4 end_line 5|5 start_column 5|6 end_column 5"];
      }
    };
    ConversationMessage_Lints = class _ConversationMessage_Lints extends __protoMessage395 {
      constructor(data) {
        super();
        this.chatCodeblockModelValue = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_Lints().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_Lints().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_Lints().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_Lints, a, b2);
      }
      static $() {
        return ["ConversationMessage.Lints|1 lints #0|2 chat_codeblock_model_value 9", GetLintsForChangeResponse];
      }
    };
    ConversationMessage_RecentLocation = class _ConversationMessage_RecentLocation extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.lineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_RecentLocation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_RecentLocation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_RecentLocation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_RecentLocation, a, b2);
      }
      static $() {
        return ["ConversationMessage.RecentLocation|1 relative_workspace_path 9|2 line_number 5"];
      }
    };
    ConversationMessage_RenderedDiff = class _ConversationMessage_RenderedDiff extends __protoMessage395 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.endLineNumberExclusive = 0;
        this.beforeContextLines = [];
        this.removedLines = [];
        this.addedLines = [];
        this.afterContextLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_RenderedDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_RenderedDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_RenderedDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_RenderedDiff, a, b2);
      }
      static $() {
        return ["ConversationMessage.RenderedDiff|1 start_line_number 5|2 end_line_number_exclusive 5|3 before_context_lines 9*|4 removed_lines 9*|5 added_lines 9*|6 after_context_lines 9*"];
      }
    };
    ConversationMessage_HumanChange = class _ConversationMessage_HumanChange extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.renderedDiffs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_HumanChange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_HumanChange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_HumanChange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_HumanChange, a, b2);
      }
      static $() {
        return ["ConversationMessage.HumanChange|1 relative_workspace_path 9|2 rendered_diffs #0*", ConversationMessage_RenderedDiff];
      }
    };
    ConversationMessage_Thinking = class _ConversationMessage_Thinking extends __protoMessage395 {
      constructor(data) {
        super();
        this.text = "";
        this.signature = "";
        this.redactedThinking = "";
        this.isLastThinkingChunk = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_Thinking().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_Thinking().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_Thinking().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_Thinking, a, b2);
      }
      static $() {
        return ["ConversationMessage.Thinking|1 text 9|2 signature 9|3 redacted_thinking 9|4 is_last_thinking_chunk 8"];
      }
    };
    ConversationMessage_DiffSinceLastApply = class _ConversationMessage_DiffSinceLastApply extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_DiffSinceLastApply().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_DiffSinceLastApply().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_DiffSinceLastApply().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_DiffSinceLastApply, a, b2);
      }
      static $() {
        return ["ConversationMessage.DiffSinceLastApply|1 relative_workspace_path 9|2 diff #0?|4 is_accepted 8?|5 is_rejected 8?|6 last_apply_chained_from_n_human_messages_ago 5?", EditFileResult_FileDiff];
      }
    };
    ConversationMessage_DeletedFile = class _ConversationMessage_DeletedFile extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_DeletedFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_DeletedFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_DeletedFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_DeletedFile, a, b2);
      }
      static $() {
        return ["ConversationMessage.DeletedFile|1 relative_workspace_path 9"];
      }
    };
    ConversationMessage_KnowledgeItem = class _ConversationMessage_KnowledgeItem extends __protoMessage395 {
      constructor(data) {
        super();
        this.title = "";
        this.knowledge = "";
        this.knowledgeId = "";
        this.isGenerated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_KnowledgeItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_KnowledgeItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_KnowledgeItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_KnowledgeItem, a, b2);
      }
      static $() {
        return ["ConversationMessage.KnowledgeItem|1 title 9|2 knowledge 9|3 knowledge_id 9|4 is_generated 8"];
      }
    };
    ConversationMessage_DocumentationSelection = class _ConversationMessage_DocumentationSelection extends __protoMessage395 {
      constructor(data) {
        super();
        this.docId = "";
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_DocumentationSelection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_DocumentationSelection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_DocumentationSelection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_DocumentationSelection, a, b2);
      }
      static $() {
        return ["ConversationMessage.DocumentationSelection|1 doc_id 9|2 name 9"];
      }
    };
    ConversationMessage_IdeEditorsState = class _ConversationMessage_IdeEditorsState extends __protoMessage395 {
      constructor(data) {
        super();
        this.isPillDisplayed = false;
        this.visibleFilePaths = [];
        this.recentlyViewedFilePaths = [];
        this.visibleFiles = [];
        this.recentlyViewedFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_IdeEditorsState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_IdeEditorsState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_IdeEditorsState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_IdeEditorsState, a, b2);
      }
      static $() {
        return ["ConversationMessage.IdeEditorsState|1 is_pill_displayed 8|2 visible_file_paths 9*|3 recently_viewed_file_paths 9*|4 visible_files #0*|5 recently_viewed_files #0*", ConversationMessage_IdeEditorsState_File];
      }
    };
    ConversationMessage_IdeEditorsState_File = class _ConversationMessage_IdeEditorsState_File extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_IdeEditorsState_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_IdeEditorsState_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_IdeEditorsState_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_IdeEditorsState_File, a, b2);
      }
      static $() {
        return ["ConversationMessage.IdeEditorsState.File|1 relative_path 9|2 is_currently_focused 8?|3 current_line_number 5?|4 current_line_text 9?|5 line_count 5?|6 absolute_path 9?"];
      }
    };
    ConversationMessage_PlanUpdate = class _ConversationMessage_PlanUpdate extends __protoMessage395 {
      constructor(data) {
        super();
        this.currentPlan = "";
        this.isFirstTimeSeen = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_PlanUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_PlanUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_PlanUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_PlanUpdate, a, b2);
      }
      static $() {
        return ["ConversationMessage.PlanUpdate|1 current_plan 9|2 is_first_time_seen 8"];
      }
    };
    ConversationMessage_SimulatedMessageMetadata = class _ConversationMessage_SimulatedMessageMetadata extends __protoMessage395 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_SimulatedMessageMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_SimulatedMessageMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_SimulatedMessageMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_SimulatedMessageMetadata, a, b2);
      }
      static $() {
        return ["ConversationMessage.SimulatedMessageMetadata|1 title 9?|2 task_id 9?|3 fsd_finding_action 9?|4 url 9?|5 subscription_source #0?|6 subscription_event_display #1?", SubscriptionSource, SubscriptionEventDisplay];
      }
    };
    ConversationMessage_McpDescriptor = class _ConversationMessage_McpDescriptor extends __protoMessage395 {
      constructor(data) {
        super();
        this.folderPath = "";
        this.tools = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_McpDescriptor().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_McpDescriptor().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_McpDescriptor().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_McpDescriptor, a, b2);
      }
      static $() {
        return ["ConversationMessage.McpDescriptor|1 folder_path 9|2 server_name 9?|3 tools #0*|4 server_use_instructions 9?", ConversationMessage_McpDescriptor_Tool];
      }
    };
    ConversationMessage_McpDescriptor_Tool = class _ConversationMessage_McpDescriptor_Tool extends __protoMessage395 {
      constructor(data) {
        super();
        this.toolName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationMessage_McpDescriptor_Tool().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationMessage_McpDescriptor_Tool().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationMessage_McpDescriptor_Tool().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationMessage_McpDescriptor_Tool, a, b2);
      }
      static $() {
        return ["ConversationMessage.McpDescriptor.Tool|1 tool_name 9|2 description 9?"];
      }
    };
    CurrentFileLocationData = class _CurrentFileLocationData extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.lineNumber = 0;
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CurrentFileLocationData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CurrentFileLocationData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CurrentFileLocationData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CurrentFileLocationData, a, b2);
      }
      static $() {
        return ["CurrentFileLocationData|1 relative_workspace_path 9|2 line_number 5|3 text 9"];
      }
    };
    FolderInfo = class _FolderInfo extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativePath = "";
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FolderInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FolderInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FolderInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FolderInfo, a, b2);
      }
      static $() {
        return ["FolderInfo|1 relative_path 9|2 files #0*", FolderFileInfo];
      }
    };
    FolderFileInfo = class _FolderFileInfo extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativePath = "";
        this.content = "";
        this.truncated = false;
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FolderFileInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FolderFileInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FolderFileInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FolderFileInfo, a, b2);
      }
      static $() {
        return ["FolderFileInfo|1 relative_path 9|2 content 9|3 truncated 8|4 score 2"];
      }
    };
    InterpreterResult = class _InterpreterResult extends __protoMessage395 {
      constructor(data) {
        super();
        this.output = "";
        this.success = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InterpreterResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InterpreterResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InterpreterResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InterpreterResult, a, b2);
      }
      static $() {
        return ["InterpreterResult|1 output 9|2 success 8"];
      }
    };
    SimpleFileDiff = class _SimpleFileDiff extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.chunks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SimpleFileDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SimpleFileDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SimpleFileDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SimpleFileDiff, a, b2);
      }
      static $() {
        return ["SimpleFileDiff|1 relative_workspace_path 9|3 chunks #0*", SimpleFileDiff_Chunk];
      }
    };
    SimpleFileDiff_Chunk = class _SimpleFileDiff_Chunk extends __protoMessage395 {
      constructor(data) {
        super();
        this.oldLines = [];
        this.newLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SimpleFileDiff_Chunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SimpleFileDiff_Chunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SimpleFileDiff_Chunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SimpleFileDiff_Chunk, a, b2);
      }
      static $() {
        return ["SimpleFileDiff.Chunk|1 old_lines 9*|2 new_lines 9*|3 old_range #0|4 new_range #0", LineRange];
      }
    };
    Commit = class _Commit extends __protoMessage395 {
      constructor(data) {
        super();
        this.sha = "";
        this.message = "";
        this.description = "";
        this.diff = [];
        this.author = "";
        this.date = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Commit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Commit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Commit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Commit, a, b2);
      }
      static $() {
        return ["Commit|1 sha 9|2 message 9|3 description 9|4 diff #0*|5 author 9|6 date 9", FileDiff];
      }
    };
    PullRequest = class _PullRequest extends __protoMessage395 {
      constructor(data) {
        super();
        this.title = "";
        this.body = "";
        this.diff = [];
        this.id = protoInt64.zero;
        this.number = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PullRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PullRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PullRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PullRequest, a, b2);
      }
      static $() {
        return ["PullRequest|1 title 9|2 body 9|3 diff #0*|4 id 3|5 number 3", FileDiff];
      }
    };
    SuggestedCodeBlock = class _SuggestedCodeBlock extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SuggestedCodeBlock().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SuggestedCodeBlock().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SuggestedCodeBlock().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SuggestedCodeBlock, a, b2);
      }
      static $() {
        return ["SuggestedCodeBlock|1 relative_workspace_path 9"];
      }
    };
    UserResponseToSuggestedCodeBlock = class _UserResponseToSuggestedCodeBlock extends __protoMessage395 {
      constructor(data) {
        super();
        this.userResponseType = UserResponseToSuggestedCodeBlock_UserResponseType.UNSPECIFIED;
        this.filePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserResponseToSuggestedCodeBlock().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserResponseToSuggestedCodeBlock().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserResponseToSuggestedCodeBlock().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserResponseToSuggestedCodeBlock, a, b2);
      }
      static $() {
        return ["UserResponseToSuggestedCodeBlock|1 user_response_type #0|2 file_path 9|3 user_modifications_to_suggested_code_blocks #1?", UserResponseToSuggestedCodeBlock_UserResponseType, FileDiff];
      }
    };
    UserResponseToSuggestedCodeBlock_UserResponseType = /* @__PURE__ */ enumType(proto3, __protoPackage100, "UserResponseToSuggestedCodeBlock.UserResponseType", [[0, "UNSPECIFIED"], [1, "ACCEPT"], [2, "REJECT"], [3, "MODIFY"]], 1);
    ContextRerankingCandidateFile = class _ContextRerankingCandidateFile extends __protoMessage395 {
      constructor(data) {
        super();
        this.fileName = "";
        this.fileContent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextRerankingCandidateFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextRerankingCandidateFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextRerankingCandidateFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextRerankingCandidateFile, a, b2);
      }
      static $() {
        return ["ContextRerankingCandidateFile|1 file_name 9|2 file_content 9"];
      }
    };
    ComposerFileDiff = class _ComposerFileDiff extends __protoMessage395 {
      constructor(data) {
        super();
        this.chunks = [];
        this.editor = ComposerFileDiff_Editor.UNSPECIFIED;
        this.hitTimeout = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerFileDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerFileDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerFileDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerFileDiff, a, b2);
      }
      static $() {
        return ["ComposerFileDiff|1 chunks #0*|2 editor #1|3 hit_timeout 8", ComposerFileDiff_ChunkDiff, ComposerFileDiff_Editor];
      }
    };
    ComposerFileDiff_Editor = /* @__PURE__ */ enumType(proto3, __protoPackage100, "ComposerFileDiff.Editor", [[0, "UNSPECIFIED"], [1, "AI"], [2, "HUMAN"]], 1);
    ComposerFileDiff_ChunkDiff = class _ComposerFileDiff_ChunkDiff extends __protoMessage395 {
      constructor(data) {
        super();
        this.diffString = "";
        this.oldStart = 0;
        this.newStart = 0;
        this.oldLines = 0;
        this.newLines = 0;
        this.linesRemoved = 0;
        this.linesAdded = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerFileDiff_ChunkDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerFileDiff_ChunkDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerFileDiff_ChunkDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerFileDiff_ChunkDiff, a, b2);
      }
      static $() {
        return ["ComposerFileDiff.ChunkDiff|1 diff_string 9|2 old_start 5|3 new_start 5|4 old_lines 5|5 new_lines 5|6 lines_removed 5|7 lines_added 5"];
      }
    };
    DiffHistoryData = class _DiffHistoryData extends __protoMessage395 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.diffs = [];
        this.timestamp = 0;
        this.uniqueId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiffHistoryData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiffHistoryData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiffHistoryData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiffHistoryData, a, b2);
      }
      static $() {
        return ["DiffHistoryData|1 relative_workspace_path 9|2 diffs #0*|3 timestamp 1|4 unique_id 9|5 start_to_end_diff #0", ComposerFileDiff];
      }
    };
    SubagentReturnCall = class _SubagentReturnCall extends __protoMessage395 {
      constructor(data) {
        super();
        this.subagentType = SubagentType2.UNSPECIFIED;
        this.returnValue = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentReturnCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentReturnCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentReturnCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentReturnCall, a, b2);
      }
      static $() {
        return ["SubagentReturnCall|1 subagent_type #0|2 deep_search_return_value #1 return_value|3 fix_lints_return_value #2 return_value|4 task_return_value #3 return_value|5 spec_return_value #4 return_value", SubagentType2, DeepSearchSubagentReturnValue, FixLintsSubagentReturnValue, TaskSubagentReturnValue, SpecSubagentReturnValue];
      }
    };
    DeepSearchSubagentReturnValue = class _DeepSearchSubagentReturnValue extends __protoMessage395 {
      constructor(data) {
        super();
        this.contextItems = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeepSearchSubagentReturnValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeepSearchSubagentReturnValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeepSearchSubagentReturnValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeepSearchSubagentReturnValue, a, b2);
      }
      static $() {
        return ["DeepSearchSubagentReturnValue|1 context_items #0*", DeepSearchSubagentReturnValue_ContextItem];
      }
    };
    DeepSearchSubagentReturnValue_ContextItem = class _DeepSearchSubagentReturnValue_ContextItem extends __protoMessage395 {
      constructor(data) {
        super();
        this.file = "";
        this.explanation = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeepSearchSubagentReturnValue_ContextItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeepSearchSubagentReturnValue_ContextItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeepSearchSubagentReturnValue_ContextItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeepSearchSubagentReturnValue_ContextItem, a, b2);
      }
      static $() {
        return ["DeepSearchSubagentReturnValue.ContextItem|1 file 9|2 line_range #0?|3 explanation 9", LineRange];
      }
    };
    FixLintsSubagentReturnValue = class _FixLintsSubagentReturnValue extends __protoMessage395 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FixLintsSubagentReturnValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FixLintsSubagentReturnValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FixLintsSubagentReturnValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FixLintsSubagentReturnValue, a, b2);
      }
      static $() {
        return ["FixLintsSubagentReturnValue"];
      }
    };
    TaskSubagentReturnValue = class _TaskSubagentReturnValue extends __protoMessage395 {
      constructor(data) {
        super();
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskSubagentReturnValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskSubagentReturnValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskSubagentReturnValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskSubagentReturnValue, a, b2);
      }
      static $() {
        return ["TaskSubagentReturnValue|1 summary 9"];
      }
    };
    SpecSubagentReturnValue = class _SpecSubagentReturnValue extends __protoMessage395 {
      constructor(data) {
        super();
        this.summary = "";
        this.stringReplacements = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SpecSubagentReturnValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SpecSubagentReturnValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SpecSubagentReturnValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SpecSubagentReturnValue, a, b2);
      }
      static $() {
        return ["SpecSubagentReturnValue|1 summary 9|2 string_replacements #0*", StringReplacement];
      }
    };
    StringReplacement = class _StringReplacement extends __protoMessage395 {
      constructor(data) {
        super();
        this.oldString = "";
        this.newString = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StringReplacement().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StringReplacement().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StringReplacement().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StringReplacement, a, b2);
      }
      static $() {
        return ["StringReplacement|1 old_string 9|2 new_string 9"];
      }
    };
    ProjectLayout = class _ProjectLayout extends __protoMessage395 {
      constructor(data) {
        super();
        this.rootPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectLayout().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectLayout().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectLayout().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectLayout, a, b2);
      }
      static $() {
        return ["ProjectLayout|1 root_path 9|2 content #0|3 list_dir_v2_result #1?", ProjectLayoutDirectoryContent, ListDirV2Result];
      }
    };
    ProjectLayoutDirectoryContent = class _ProjectLayoutDirectoryContent extends __protoMessage395 {
      constructor(data) {
        super();
        this.directories = [];
        this.files = [];
        this.hiddenFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectLayoutDirectoryContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectLayoutDirectoryContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectLayoutDirectoryContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectLayoutDirectoryContent, a, b2);
      }
      static $() {
        return ["ProjectLayoutDirectoryContent|1 directories #0*|2 files #1*|3 total_files 5?|4 total_subfolders 5?|5 hidden_files #1*", ProjectLayoutDirectory, ProjectLayoutFile];
      }
    };
    ProjectLayoutDirectory = class _ProjectLayoutDirectory extends __protoMessage395 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectLayoutDirectory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectLayoutDirectory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectLayoutDirectory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectLayoutDirectory, a, b2);
      }
      static $() {
        return ["ProjectLayoutDirectory|1 name 9|2 content #0", ProjectLayoutDirectoryContent];
      }
    };
    ProjectLayoutFile = class _ProjectLayoutFile extends __protoMessage395 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectLayoutFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectLayoutFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectLayoutFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectLayoutFile, a, b2);
      }
      static $() {
        return ["ProjectLayoutFile|1 name 9"];
      }
    };
  }
});
