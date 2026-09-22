/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/context_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage122, __protoMessage3118, ContextItem, ContextItem_FileChunk, ContextItem_SparseFileChunk, ContextItem_SparseFileChunk_Line, ContextItem_OutlineChunk, ContextItem_CmdKSelection, ContextItem_FileDiffHistory, ContextItem_CmdKImmediateContext, ContextItem_CmdKImmediateContext_Line, ContextItem_CmdKQuery, ContextItem_TerminalCmdKQuery, ContextItem_TerminalCmdKQueryHistory, ContextItem_CmdKQueryHistory, ContextItem_CmdKQueryHistoryInDiffSession, ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession, ContextItem_ChatHistory, ContextItem_TerminalHistory, ContextItem_CustomInstructions, ContextItem_GoToDefinitionResult, ContextItem_DocumentationChunk, ContextItem_Lints, ContextItem_Lints_Line, ContextItem_NotebookCellOutput, ContextItem_LspSubgraphChunk, ContextItem_CommitNoteChunk, ContextIntent, ContextIntent_Type, ContextIntent_Documentation, ContextIntent_File, ContextIntent_File_Mode, ContextIntent_CodeSelection, ContextIntent_CommitNotes, ContextIntent_Lints, ContextIntent_Lints_CmdKScope, ContextIntent_Lints_FileScope, ContextIntent_RecentLocations, ContextIntent_PastCmdkConversationsInDiffSessions, ContextIntent_VisibleTabs, ContextIntent_CmdKCurrentFile, ContextIntent_CmdKQueryEtc, ContextIntent_CustomInstructions, ContextIntent_CmdKDefinitions, ContextIntent_ChatHistory, ContextIntent_DiffHistory, ContextIntent_TerminalCmdKDefaults, ContextIntent_TerminalHistory, ContextIntent_LspSubgraph;
var init_context_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/context_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_cpp_pb();
    init_lsp_subgraph_pb();
    init_compact();
    __protoPackage122 = "aiserver.v1.";
    __protoMessage3118 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage122;
      }
    };
    ContextItem = class _ContextItem extends __protoMessage3118 {
      constructor(data) {
        super();
        this.item = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem, a, b2);
      }
      static $() {
        return ["ContextItem|1 intent #0|2 file_chunk #1 item|3 outline_chunk #2 item|4 cmd_k_selection #3 item|5 cmd_k_immediate_context #4 item|6 cmd_k_query #5 item|7 cmd_k_query_history #6 item|8 custom_instructions #7 item|9 go_to_definition_result #8 item|10 documentation_chunk #9 item|11 lints #10 item|12 chat_history #11 item|13 notebook_cell_output #12 item|14 terminal_history #13 item|15 terminal_cmd_k_query #14 item|16 terminal_cmd_k_query_history #15 item|17 sparse_file_chunk #16 item|18 lsp_subgraph_chunk #17 item|19 commit_note_chunk #18 item|20 file_diff_history #19 item|21 cmd_k_query_history_in_diff_session #20 item|22 project_rule #21 item", ContextIntent, ContextItem_FileChunk, ContextItem_OutlineChunk, ContextItem_CmdKSelection, ContextItem_CmdKImmediateContext, ContextItem_CmdKQuery, ContextItem_CmdKQueryHistory, ContextItem_CustomInstructions, ContextItem_GoToDefinitionResult, ContextItem_DocumentationChunk, ContextItem_Lints, ContextItem_ChatHistory, ContextItem_NotebookCellOutput, ContextItem_TerminalHistory, ContextItem_TerminalCmdKQuery, ContextItem_TerminalCmdKQueryHistory, ContextItem_SparseFileChunk, ContextItem_LspSubgraphChunk, ContextItem_CommitNoteChunk, ContextItem_FileDiffHistory, ContextItem_CmdKQueryHistoryInDiffSession, CursorRule];
      }
    };
    ContextItem_FileChunk = class _ContextItem_FileChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.chunkContents = "";
        this.startLineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_FileChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_FileChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_FileChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_FileChunk, a, b2);
      }
      static $() {
        return ["ContextItem.FileChunk|1 relative_workspace_path 9|2 chunk_contents 9|3 start_line_number 5"];
      }
    };
    ContextItem_SparseFileChunk = class _ContextItem_SparseFileChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.lines = [];
        this.totalNumberOfLinesInFile = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_SparseFileChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_SparseFileChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_SparseFileChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_SparseFileChunk, a, b2);
      }
      static $() {
        return ["ContextItem.SparseFileChunk|1 relative_workspace_path 9|2 lines #0*|3 total_number_of_lines_in_file 5|4 cell_number 5?", ContextItem_SparseFileChunk_Line];
      }
    };
    ContextItem_SparseFileChunk_Line = class _ContextItem_SparseFileChunk_Line extends __protoMessage3118 {
      constructor(data) {
        super();
        this.line = "";
        this.lineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_SparseFileChunk_Line().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_SparseFileChunk_Line().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_SparseFileChunk_Line().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_SparseFileChunk_Line, a, b2);
      }
      static $() {
        return ["ContextItem.SparseFileChunk.Line|1 line 9|2 line_number 5"];
      }
    };
    ContextItem_OutlineChunk = class _ContextItem_OutlineChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_OutlineChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_OutlineChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_OutlineChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_OutlineChunk, a, b2);
      }
      static $() {
        return ["ContextItem.OutlineChunk|1 relative_workspace_path 9|2 contents 9|3 full_range #0", LineRange];
      }
    };
    ContextItem_CmdKSelection = class _ContextItem_CmdKSelection extends __protoMessage3118 {
      constructor(data) {
        super();
        this.lines = [];
        this.startLineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKSelection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKSelection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKSelection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKSelection, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKSelection|1 lines 9*|2 start_line_number 5"];
      }
    };
    ContextItem_FileDiffHistory = class _ContextItem_FileDiffHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.howManyDiffsAgo = 0;
        this.isVeryRecent = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_FileDiffHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_FileDiffHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_FileDiffHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_FileDiffHistory, a, b2);
      }
      static $() {
        return ["ContextItem.FileDiffHistory|1 cpp_file_diff_history #0|2 how_many_diffs_ago 5|3 is_very_recent 8", CppFileDiffHistory];
      }
    };
    ContextItem_CmdKImmediateContext = class _ContextItem_CmdKImmediateContext extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.lines = [];
        this.totalNumberOfLinesInFile = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKImmediateContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKImmediateContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKImmediateContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKImmediateContext, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKImmediateContext|1 relative_workspace_path 9|2 lines #0*|3 total_number_of_lines_in_file 5|4 cell_number 5?", ContextItem_CmdKImmediateContext_Line];
      }
    };
    ContextItem_CmdKImmediateContext_Line = class _ContextItem_CmdKImmediateContext_Line extends __protoMessage3118 {
      constructor(data) {
        super();
        this.line = "";
        this.lineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKImmediateContext_Line().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKImmediateContext_Line().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKImmediateContext_Line().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKImmediateContext_Line, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKImmediateContext.Line|1 line 9|2 line_number 5"];
      }
    };
    ContextItem_CmdKQuery = class _ContextItem_CmdKQuery extends __protoMessage3118 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKQuery, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKQuery|1 query 9"];
      }
    };
    ContextItem_TerminalCmdKQuery = class _ContextItem_TerminalCmdKQuery extends __protoMessage3118 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_TerminalCmdKQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_TerminalCmdKQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_TerminalCmdKQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_TerminalCmdKQuery, a, b2);
      }
      static $() {
        return ["ContextItem.TerminalCmdKQuery|1 query 9"];
      }
    };
    ContextItem_TerminalCmdKQueryHistory = class _ContextItem_TerminalCmdKQueryHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.contextItemHashes = [];
        this.suggestedCommand = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_TerminalCmdKQueryHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_TerminalCmdKQueryHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_TerminalCmdKQueryHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_TerminalCmdKQueryHistory, a, b2);
      }
      static $() {
        return ["ContextItem.TerminalCmdKQueryHistory|1 query #0|2 query_history #1|5 context_item_hashes 9*|6 suggested_command 9", ContextItem_TerminalCmdKQuery, _ContextItem_TerminalCmdKQueryHistory];
      }
    };
    ContextItem_CmdKQueryHistory = class _ContextItem_CmdKQueryHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.contextItemHashes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKQueryHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKQueryHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKQueryHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKQueryHistory, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKQueryHistory|1 query #0|2 immediate_context #1|3 selection #2|4 query_history #3|5 context_item_hashes 9*|6 timestamp 3?|7 timestamp_double 1?", ContextItem_CmdKQuery, ContextItem_CmdKImmediateContext, ContextItem_CmdKSelection, _ContextItem_CmdKQueryHistory];
      }
    };
    ContextItem_CmdKQueryHistoryInDiffSession = class _ContextItem_CmdKQueryHistoryInDiffSession extends __protoMessage3118 {
      constructor(data) {
        super();
        this.pastCmdkQueries = [];
        this.currTimestampDouble = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKQueryHistoryInDiffSession, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKQueryHistoryInDiffSession|1 past_cmdk_queries #0*|3 curr_timestamp_double 1", ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession];
      }
    };
    ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession = class _ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.timestampDouble = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CmdKQueryHistoryInDiffSession_PastCmdKQueryInDiffSession, a, b2);
      }
      static $() {
        return ["ContextItem.CmdKQueryHistoryInDiffSession.PastCmdKQueryInDiffSession|1 query #0|2 relative_workspace_path 9|5 cmdk_was_accepted 8?|6 timestamp_double 1|7 timestamp_for_diff_interleaving 1?|8 request_id 9?", ContextItem_CmdKQuery];
      }
    };
    ContextItem_ChatHistory = class _ContextItem_ChatHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.userMessage = "";
        this.assistantResponse = "";
        this.activeForCmdK = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_ChatHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_ChatHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_ChatHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_ChatHistory, a, b2);
      }
      static $() {
        return ["ContextItem.ChatHistory|1 user_message 9|2 assistant_response 9|3 chat_history #0|4 active_for_cmd_k 8|5 timestamp 3?|6 timestamp_double 1?", _ContextItem_ChatHistory];
      }
    };
    ContextItem_TerminalHistory = class _ContextItem_TerminalHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.history = "";
        this.cwdFull = "";
        this.cwdRelativeWorkspacePath = "";
        this.activeForCmdK = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_TerminalHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_TerminalHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_TerminalHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_TerminalHistory, a, b2);
      }
      static $() {
        return ["ContextItem.TerminalHistory|1 history 9|5 cwd_full 9|6 cwd_relative_workspace_path 9|4 active_for_cmd_k 8|7 timestamp 3?|8 timestamp_double 1?"];
      }
    };
    ContextItem_CustomInstructions = class _ContextItem_CustomInstructions extends __protoMessage3118 {
      constructor(data) {
        super();
        this.instructions = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CustomInstructions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CustomInstructions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CustomInstructions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CustomInstructions, a, b2);
      }
      static $() {
        return ["ContextItem.CustomInstructions|1 instructions 9"];
      }
    };
    ContextItem_GoToDefinitionResult = class _ContextItem_GoToDefinitionResult extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.line = "";
        this.lineNumber = 0;
        this.columnNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_GoToDefinitionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_GoToDefinitionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_GoToDefinitionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_GoToDefinitionResult, a, b2);
      }
      static $() {
        return ["ContextItem.GoToDefinitionResult|1 relative_workspace_path 9|2 line 9|3 line_number 5|4 column_number 5|5 definition_chunk #0", ContextItem_FileChunk];
      }
    };
    ContextItem_DocumentationChunk = class _ContextItem_DocumentationChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        this.docName = "";
        this.pageUrl = "";
        this.documentationChunk = "";
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_DocumentationChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_DocumentationChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_DocumentationChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_DocumentationChunk, a, b2);
      }
      static $() {
        return ["ContextItem.DocumentationChunk|1 doc_name 9|2 page_url 9|3 documentation_chunk 9|4 score 2"];
      }
    };
    ContextItem_Lints = class _ContextItem_Lints extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.lints = [];
        this.contextLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_Lints().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_Lints().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_Lints().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_Lints, a, b2);
      }
      static $() {
        return ["ContextItem.Lints|1 relative_workspace_path 9|2 lints #0*|3 context_lines #1*", Lint, ContextItem_Lints_Line];
      }
    };
    ContextItem_Lints_Line = class _ContextItem_Lints_Line extends __protoMessage3118 {
      constructor(data) {
        super();
        this.line = "";
        this.lineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_Lints_Line().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_Lints_Line().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_Lints_Line().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_Lints_Line, a, b2);
      }
      static $() {
        return ["ContextItem.Lints.Line|1 line 9|2 line_number 5"];
      }
    };
    ContextItem_NotebookCellOutput = class _ContextItem_NotebookCellOutput extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.cellOutput = "";
        this.cellNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_NotebookCellOutput().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_NotebookCellOutput().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_NotebookCellOutput().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_NotebookCellOutput, a, b2);
      }
      static $() {
        return ["ContextItem.NotebookCellOutput|1 relative_workspace_path 9|2 cell_output 9|3 cell_number 5"];
      }
    };
    ContextItem_LspSubgraphChunk = class _ContextItem_LspSubgraphChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_LspSubgraphChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_LspSubgraphChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_LspSubgraphChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_LspSubgraphChunk, a, b2);
      }
      static $() {
        return ["ContextItem.LspSubgraphChunk|1 lsp_subgraph_full_context #0", LspSubgraphFullContext];
      }
    };
    ContextItem_CommitNoteChunk = class _ContextItem_CommitNoteChunk extends __protoMessage3118 {
      constructor(data) {
        super();
        this.note = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextItem_CommitNoteChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextItem_CommitNoteChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextItem_CommitNoteChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextItem_CommitNoteChunk, a, b2);
      }
      static $() {
        return ["ContextItem.CommitNoteChunk|1 note 9"];
      }
    };
    ContextIntent = class _ContextIntent extends __protoMessage3118 {
      constructor(data) {
        super();
        this.type = ContextIntent_Type.UNSPECIFIED;
        this.uuid = "";
        this.intent = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent, a, b2);
      }
      static $() {
        return ["ContextIntent|1 type #0|15 uuid 9|2 file #1 intent|3 code_selection #2 intent|5 lints #3 intent|6 recent_locations #4 intent|8 cmd_k_current_file #5 intent|9 cmd_k_query_etc #6 intent|14 terminal_cmd_k_defaults #7 intent|10 cmd_k_definitions #8 intent|11 documentation #9 intent|12 custom_instructions #10 intent|13 chat_history #11 intent|16 terminal_history #12 intent|17 visible_tabs #13 intent|18 lsp_subgraph #14 intent|19 commit_notes #15 intent|20 diff_history #16 intent|21 past_cmdk_messages_in_diff_sessions #17 intent", ContextIntent_Type, ContextIntent_File, ContextIntent_CodeSelection, ContextIntent_Lints, ContextIntent_RecentLocations, ContextIntent_CmdKCurrentFile, ContextIntent_CmdKQueryEtc, ContextIntent_TerminalCmdKDefaults, ContextIntent_CmdKDefinitions, ContextIntent_Documentation, ContextIntent_CustomInstructions, ContextIntent_ChatHistory, ContextIntent_TerminalHistory, ContextIntent_VisibleTabs, ContextIntent_LspSubgraph, ContextIntent_CommitNotes, ContextIntent_DiffHistory, ContextIntent_PastCmdkConversationsInDiffSessions];
      }
    };
    ContextIntent_Type = /* @__PURE__ */ enumType(proto3, __protoPackage122, "ContextIntent.Type", [[0, "UNSPECIFIED"], [1, "USER_ADDED"], [2, "AUTOMATIC"]], 1);
    ContextIntent_Documentation = class _ContextIntent_Documentation extends __protoMessage3118 {
      constructor(data) {
        super();
        this.documentationIdentifier = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_Documentation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_Documentation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_Documentation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_Documentation, a, b2);
      }
      static $() {
        return ["ContextIntent.Documentation|1 documentation_identifier 9"];
      }
    };
    ContextIntent_File = class _ContextIntent_File extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.mode = ContextIntent_File_Mode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_File, a, b2);
      }
      static $() {
        return ["ContextIntent.File|1 relative_workspace_path 9|2 mode #0", ContextIntent_File_Mode];
      }
    };
    ContextIntent_File_Mode = /* @__PURE__ */ enumType(proto3, __protoPackage122, "ContextIntent.File.Mode", [[0, "UNSPECIFIED"], [1, "FULL"], [2, "OUTLINE"], [3, "CHUNKS"]], 1);
    ContextIntent_CodeSelection = class _ContextIntent_CodeSelection extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CodeSelection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CodeSelection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CodeSelection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CodeSelection, a, b2);
      }
      static $() {
        return ["ContextIntent.CodeSelection|1 relative_workspace_path 9|2 potentially_out_of_date_range #0|3 text 9", SimpleRange];
      }
    };
    ContextIntent_CommitNotes = class _ContextIntent_CommitNotes extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CommitNotes().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CommitNotes().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CommitNotes().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CommitNotes, a, b2);
      }
      static $() {
        return ["ContextIntent.CommitNotes"];
      }
    };
    ContextIntent_Lints = class _ContextIntent_Lints extends __protoMessage3118 {
      constructor(data) {
        super();
        this.scope = { case: void 0 };
        this.filterToSeverities = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_Lints().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_Lints().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_Lints().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_Lints, a, b2);
      }
      static $() {
        return ["ContextIntent.Lints|1 cmdk_scope #0 scope|2 file_scope #1 scope|3 filter_to_severities #2*", ContextIntent_Lints_CmdKScope, ContextIntent_Lints_FileScope, LintSeverity];
      }
    };
    ContextIntent_Lints_CmdKScope = class _ContextIntent_Lints_CmdKScope extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_Lints_CmdKScope().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_Lints_CmdKScope().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_Lints_CmdKScope().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_Lints_CmdKScope, a, b2);
      }
      static $() {
        return ["ContextIntent.Lints.CmdKScope"];
      }
    };
    ContextIntent_Lints_FileScope = class _ContextIntent_Lints_FileScope extends __protoMessage3118 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_Lints_FileScope().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_Lints_FileScope().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_Lints_FileScope().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_Lints_FileScope, a, b2);
      }
      static $() {
        return ["ContextIntent.Lints.FileScope|1 relative_workspace_path 9|2 filter_range #0?", LineRange];
      }
    };
    ContextIntent_RecentLocations = class _ContextIntent_RecentLocations extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_RecentLocations().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_RecentLocations().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_RecentLocations().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_RecentLocations, a, b2);
      }
      static $() {
        return ["ContextIntent.RecentLocations|2 timestamp 1?"];
      }
    };
    ContextIntent_PastCmdkConversationsInDiffSessions = class _ContextIntent_PastCmdkConversationsInDiffSessions extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_PastCmdkConversationsInDiffSessions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_PastCmdkConversationsInDiffSessions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_PastCmdkConversationsInDiffSessions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_PastCmdkConversationsInDiffSessions, a, b2);
      }
      static $() {
        return ["ContextIntent.PastCmdkConversationsInDiffSessions"];
      }
    };
    ContextIntent_VisibleTabs = class _ContextIntent_VisibleTabs extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_VisibleTabs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_VisibleTabs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_VisibleTabs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_VisibleTabs, a, b2);
      }
      static $() {
        return ["ContextIntent.VisibleTabs"];
      }
    };
    ContextIntent_CmdKCurrentFile = class _ContextIntent_CmdKCurrentFile extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CmdKCurrentFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CmdKCurrentFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CmdKCurrentFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CmdKCurrentFile, a, b2);
      }
      static $() {
        return ["ContextIntent.CmdKCurrentFile"];
      }
    };
    ContextIntent_CmdKQueryEtc = class _ContextIntent_CmdKQueryEtc extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CmdKQueryEtc().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CmdKQueryEtc().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CmdKQueryEtc().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CmdKQueryEtc, a, b2);
      }
      static $() {
        return ["ContextIntent.CmdKQueryEtc"];
      }
    };
    ContextIntent_CustomInstructions = class _ContextIntent_CustomInstructions extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CustomInstructions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CustomInstructions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CustomInstructions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CustomInstructions, a, b2);
      }
      static $() {
        return ["ContextIntent.CustomInstructions"];
      }
    };
    ContextIntent_CmdKDefinitions = class _ContextIntent_CmdKDefinitions extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_CmdKDefinitions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_CmdKDefinitions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_CmdKDefinitions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_CmdKDefinitions, a, b2);
      }
      static $() {
        return ["ContextIntent.CmdKDefinitions"];
      }
    };
    ContextIntent_ChatHistory = class _ContextIntent_ChatHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_ChatHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_ChatHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_ChatHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_ChatHistory, a, b2);
      }
      static $() {
        return ["ContextIntent.ChatHistory"];
      }
    };
    ContextIntent_DiffHistory = class _ContextIntent_DiffHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_DiffHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_DiffHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_DiffHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_DiffHistory, a, b2);
      }
      static $() {
        return ["ContextIntent.DiffHistory"];
      }
    };
    ContextIntent_TerminalCmdKDefaults = class _ContextIntent_TerminalCmdKDefaults extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_TerminalCmdKDefaults().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_TerminalCmdKDefaults().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_TerminalCmdKDefaults().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_TerminalCmdKDefaults, a, b2);
      }
      static $() {
        return ["ContextIntent.TerminalCmdKDefaults"];
      }
    };
    ContextIntent_TerminalHistory = class _ContextIntent_TerminalHistory extends __protoMessage3118 {
      constructor(data) {
        super();
        this.instanceId = 0;
        this.activeForCmdK = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_TerminalHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_TerminalHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_TerminalHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_TerminalHistory, a, b2);
      }
      static $() {
        return ["ContextIntent.TerminalHistory|1 instance_id 5|2 active_for_cmd_k 8|3 use_active_instance_as_fallback 8?"];
      }
    };
    ContextIntent_LspSubgraph = class _ContextIntent_LspSubgraph extends __protoMessage3118 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextIntent_LspSubgraph().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextIntent_LspSubgraph().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextIntent_LspSubgraph().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextIntent_LspSubgraph, a, b2);
      }
      static $() {
        return ["ContextIntent.LspSubgraph"];
      }
    };
  }
});

