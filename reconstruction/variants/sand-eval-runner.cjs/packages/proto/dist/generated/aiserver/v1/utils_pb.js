/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/utils_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage25, __protoMessage325, LintSeverity, FeatureType, EmbeddingModel, CursorPosition, SelectionWithOrientation, GetDiffRequest, GetDiffRequest_OutputFormat, GetDiffResponse, GetDiffResponse_SubmoduleDiff, SimplestRange, GitDiff, GitDiff_DiffType, FileDiff, FileDiff_Chunk, SimpleRange, CmdKDebugInfo, CmdKDebugInfo_UnsavedFiles, CmdKDebugInfo_OpenEditor, CmdKDebugInfo_CppFileDiffHistory, CmdKDebugInfo_PastThought, LineRange, CursorRange, DetailedLine, CodeBlock, CodeBlock_Signatures, GitCommit, FileGit, File2, Diagnostic2, Diagnostic_DiagnosticSeverity, Diagnostic_RelatedInformation, Lint, BM25Chunk, CurrentFileInfo, CurrentFileInfo_NotebookCell, AzureState, BedrockState, ModelDetails, CloudAgentModelSelection, CloudAgentModelSelection_ParameterValue, ModelInfo, DataframeInfo, DataframeInfo_Column, LinterError, LinterErrors, LinterErrorsWithoutFileContents, CursorRule2, ExplicitContext, MCPInstructions, DocumentSymbol, DocumentSymbol_SymbolKind, DocumentSymbol_Range, HoverDetails, UriComponents, DocumentSymbolWithText, ErrorDetails, ErrorDetails_Error, CustomErrorDetails, ErrorAnalyticsMetadata, PlanChoice, ErrorButton, ClientAction, ReloadWindowAction, DashboardAction, UpgradeChoice, UpgradeAction, SwitchModelAction, SwitchModelAction_ModelParameterValue, ConfigureSpendLimitAction, UrlAction, ImageProto, ImageProto_Dimension, ChatQuote, ChatExternalLink, ComposerExternalLink, CmdKExternalLink, CommitNote, CommitNoteWithEmbeddings, CommitDiffString, CodeChunk, CodeChunk_Intent, CodeChunk_SummarizationStrategy, RCPCallFrame, RCPStackTrace, RCPLogEntry, RCPUIElementPicked;
var init_utils_pb2 = __esm({
  "../packages/proto/dist/generated/aiserver/v1/utils_pb.js"() {
    "use strict";
    init_esm13();
    init_compact();
    __protoPackage25 = "aiserver.v1.";
    __protoMessage325 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage25;
      }
    };
    LintSeverity = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "LintSeverity", [[0, "UNSPECIFIED"], [1, "ERROR"], [2, "WARNING"], [3, "INFO"], [4, "HINT"], [5, "AI"]], 1);
    FeatureType = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "FeatureType", [[0, "UNSPECIFIED"], [1, "EDIT"], [2, "GENERATE"], [3, "INLINE_LONG_COMPLETION"]], 1);
    EmbeddingModel = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "EmbeddingModel", [[0, "UNSPECIFIED"], [1, "VOYAGE_CODE_2"], [2, "TEXT_EMBEDDINGS_LARGE_3"], [3, "QWEN_1_5B_CUSTOM"], [4, "MOCK_CHUNKER_ERROR"], [5, "QWEN_1_5B_0618_CUSTOM"], [6, "QWEN_1_5B_0618_FP8_MM_CUSTOM"]], 1);
    CursorPosition = class _CursorPosition extends __protoMessage325 {
      constructor(data) {
        super();
        this.line = 0;
        this.column = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CursorPosition().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CursorPosition().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CursorPosition().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CursorPosition, a, b2);
      }
      static $() {
        return ["CursorPosition|1 line 5|2 column 5"];
      }
    };
    SelectionWithOrientation = class _SelectionWithOrientation extends __protoMessage325 {
      constructor(data) {
        super();
        this.selectionStartLineNumber = 0;
        this.selectionStartColumn = 0;
        this.positionLineNumber = 0;
        this.positionColumn = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SelectionWithOrientation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SelectionWithOrientation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SelectionWithOrientation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SelectionWithOrientation, a, b2);
      }
      static $() {
        return ["SelectionWithOrientation|1 selection_start_line_number 5|2 selection_start_column 5|3 position_line_number 5|4 position_column 5"];
      }
    };
    GetDiffRequest = class _GetDiffRequest extends __protoMessage325 {
      constructor(data) {
        super();
        this.cwd = "";
        this.ref = "";
        this.baseRef = "";
        this.mergeBase = false;
        this.targetPaths = [];
        this.maxUntrackedFiles = 0;
        this.submoduleRecurseDepth = 0;
        this.includeSpaceChanges = false;
        this.committedOnly = false;
        this.computePatchId = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetDiffRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetDiffRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetDiffRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetDiffRequest, a, b2);
      }
      static $() {
        return ["GetDiffRequest|1 cwd 9|2 ref 9|3 base_ref 9|4 merge_base 8|5 target_paths 9*|6 unified_context_lines 5?|7 max_untracked_files 5|9 submodule_recurse_depth 5|10 include_space_changes 8|11 committed_only 8|12 compute_patch_id 8|13 return_head_sha 8?|14 max_response_bytes 5?|15 max_files_with_contents 13?|8 output_format #0?", GetDiffRequest_OutputFormat];
      }
    };
    GetDiffRequest_OutputFormat = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "GetDiffRequest.OutputFormat", [[0, "UNSPECIFIED"], [1, "NAME_STATUS"], [2, "NAME_STATUS_AND_NUMSTAT"], [3, "FILE_DIFFS"], [4, "DIFFS_WITH_BEFORE_AND_AFTER"]], 1);
    GetDiffResponse = class _GetDiffResponse extends __protoMessage325 {
      constructor(data) {
        super();
        this.submoduleDiffs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetDiffResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetDiffResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetDiffResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetDiffResponse, a, b2);
      }
      static $() {
        return ["GetDiffResponse|1 diff #0|2 submodule_diffs #1*|3 patch_id 9?|4 head_sha 9?|5 has_uncommitted_changes 8?", GitDiff, GetDiffResponse_SubmoduleDiff];
      }
    };
    GetDiffResponse_SubmoduleDiff = class _GetDiffResponse_SubmoduleDiff extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativePath = "";
        this.errored = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetDiffResponse_SubmoduleDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetDiffResponse_SubmoduleDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetDiffResponse_SubmoduleDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetDiffResponse_SubmoduleDiff, a, b2);
      }
      static $() {
        return ["GetDiffResponse.SubmoduleDiff|1 relative_path 9|2 diff #0|3 errored 8", GitDiff];
      }
    };
    SimplestRange = class _SimplestRange extends __protoMessage325 {
      constructor(data) {
        super();
        this.startLine = 0;
        this.endLineInclusive = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SimplestRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SimplestRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SimplestRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SimplestRange, a, b2);
      }
      static $() {
        return ["SimplestRange|1 start_line 5|2 end_line_inclusive 5"];
      }
    };
    GitDiff = class _GitDiff extends __protoMessage325 {
      constructor(data) {
        super();
        this.diffs = [];
        this.diffType = GitDiff_DiffType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GitDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GitDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GitDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GitDiff, a, b2);
      }
      static $() {
        return ["GitDiff|1 diffs #0*|2 diff_type #1|3 file_contents_omitted 8?", FileDiff, GitDiff_DiffType];
      }
    };
    GitDiff_DiffType = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "GitDiff.DiffType", [[0, "UNSPECIFIED"], [1, "DIFF_TO_HEAD"], [2, "DIFF_FROM_BRANCH_TO_MAIN"]], 1);
    FileDiff = class _FileDiff extends __protoMessage325 {
      constructor(data) {
        super();
        this.added = 0;
        this.removed = 0;
        this.from = "";
        this.to = "";
        this.chunks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileDiff, a, b2);
      }
      static $() {
        return ["FileDiff|4 added 5|5 removed 5|1 from 9|2 to 9|3 chunks #0*|6 before_file_contents 9?|7 after_file_contents 9?|8 is_generated 8?", FileDiff_Chunk];
      }
    };
    FileDiff_Chunk = class _FileDiff_Chunk extends __protoMessage325 {
      constructor(data) {
        super();
        this.content = "";
        this.lines = [];
        this.oldStart = 0;
        this.oldLines = 0;
        this.newStart = 0;
        this.newLines = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileDiff_Chunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileDiff_Chunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileDiff_Chunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileDiff_Chunk, a, b2);
      }
      static $() {
        return ["FileDiff.Chunk|1 content 9|2 lines 9*|3 old_start 5|4 old_lines 5|5 new_start 5|6 new_lines 5"];
      }
    };
    SimpleRange = class _SimpleRange extends __protoMessage325 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.startColumn = 0;
        this.endLineNumberInclusive = 0;
        this.endColumn = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SimpleRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SimpleRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SimpleRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SimpleRange, a, b2);
      }
      static $() {
        return ["SimpleRange|1 start_line_number 5|2 start_column 5|3 end_line_number_inclusive 5|4 end_column 5"];
      }
    };
    CmdKDebugInfo = class _CmdKDebugInfo extends __protoMessage325 {
      constructor(data) {
        super();
        this.remoteUrl = "";
        this.commitId = "";
        this.gitPatch = "";
        this.unsavedFiles = [];
        this.unixTimestampMs = 0;
        this.openEditors = [];
        this.fileDiffHistories = [];
        this.branchName = "";
        this.branchNotes = "";
        this.branchNotesRich = "";
        this.globalNotes = "";
        this.pastThoughts = [];
        this.baseBranchName = "";
        this.baseBranchCommitId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKDebugInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKDebugInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKDebugInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKDebugInfo, a, b2);
      }
      static $() {
        return ["CmdKDebugInfo|1 remote_url 9|2 commit_id 9|3 git_patch 9|4 unsaved_files #0*|5 unix_timestamp_ms 1|6 open_editors #1*|7 file_diff_histories #2*|8 branch_name 9|9 branch_notes 9|12 branch_notes_rich 9|10 global_notes 9|11 past_thoughts #3*|13 base_branch_name 9|14 base_branch_commit_id 9", CmdKDebugInfo_UnsavedFiles, CmdKDebugInfo_OpenEditor, CmdKDebugInfo_CppFileDiffHistory, CmdKDebugInfo_PastThought];
      }
    };
    CmdKDebugInfo_UnsavedFiles = class _CmdKDebugInfo_UnsavedFiles extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKDebugInfo_UnsavedFiles().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKDebugInfo_UnsavedFiles().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKDebugInfo_UnsavedFiles().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKDebugInfo_UnsavedFiles, a, b2);
      }
      static $() {
        return ["CmdKDebugInfo.UnsavedFiles|1 relative_workspace_path 9|2 contents 9"];
      }
    };
    CmdKDebugInfo_OpenEditor = class _CmdKDebugInfo_OpenEditor extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.editorGroupIndex = 0;
        this.editorGroupId = 0;
        this.isActive = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKDebugInfo_OpenEditor().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKDebugInfo_OpenEditor().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKDebugInfo_OpenEditor().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKDebugInfo_OpenEditor, a, b2);
      }
      static $() {
        return ["CmdKDebugInfo.OpenEditor|1 relative_workspace_path 9|2 editor_group_index 5|3 editor_group_id 5|4 is_active 8"];
      }
    };
    CmdKDebugInfo_CppFileDiffHistory = class _CmdKDebugInfo_CppFileDiffHistory extends __protoMessage325 {
      constructor(data) {
        super();
        this.fileName = "";
        this.diffHistory = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKDebugInfo_CppFileDiffHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKDebugInfo_CppFileDiffHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKDebugInfo_CppFileDiffHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKDebugInfo_CppFileDiffHistory, a, b2);
      }
      static $() {
        return ["CmdKDebugInfo.CppFileDiffHistory|1 file_name 9|2 diff_history 9*"];
      }
    };
    CmdKDebugInfo_PastThought = class _CmdKDebugInfo_PastThought extends __protoMessage325 {
      constructor(data) {
        super();
        this.text = "";
        this.timeInUnixSeconds = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKDebugInfo_PastThought().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKDebugInfo_PastThought().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKDebugInfo_PastThought().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKDebugInfo_PastThought, a, b2);
      }
      static $() {
        return ["CmdKDebugInfo.PastThought|1 text 9|2 time_in_unix_seconds 1"];
      }
    };
    LineRange = class _LineRange extends __protoMessage325 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.endLineNumberInclusive = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LineRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LineRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LineRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LineRange, a, b2);
      }
      static $() {
        return ["LineRange|1 start_line_number 5|2 end_line_number_inclusive 5"];
      }
    };
    CursorRange = class _CursorRange extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CursorRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CursorRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CursorRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CursorRange, a, b2);
      }
      static $() {
        return ["CursorRange|1 start_position #0|2 end_position #0", CursorPosition];
      }
    };
    DetailedLine = class _DetailedLine extends __protoMessage325 {
      constructor(data) {
        super();
        this.text = "";
        this.lineNumber = 0;
        this.isSignature = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DetailedLine().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DetailedLine().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DetailedLine().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DetailedLine, a, b2);
      }
      static $() {
        return ["DetailedLine|1 text 9|2 line_number 2|3 is_signature 8"];
      }
    };
    CodeBlock = class _CodeBlock extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        this.detailedLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeBlock().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeBlock().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeBlock().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeBlock, a, b2);
      }
      static $() {
        return ["CodeBlock|1 relative_workspace_path 9|2 file_contents 9?|9 file_contents_length 5?|3 range #0|4 contents 9|5 signatures #1|6 override_contents 9?|7 original_contents 9?|8 detailed_lines #2*|10 file_git_context #3", CursorRange, CodeBlock_Signatures, DetailedLine, FileGit];
      }
    };
    CodeBlock_Signatures = class _CodeBlock_Signatures extends __protoMessage325 {
      constructor(data) {
        super();
        this.ranges = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeBlock_Signatures().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeBlock_Signatures().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeBlock_Signatures().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeBlock_Signatures, a, b2);
      }
      static $() {
        return ["CodeBlock.Signatures|1 ranges #0*", CursorRange];
      }
    };
    GitCommit = class _GitCommit extends __protoMessage325 {
      constructor(data) {
        super();
        this.commit = "";
        this.author = "";
        this.date = "";
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GitCommit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GitCommit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GitCommit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GitCommit, a, b2);
      }
      static $() {
        return ["GitCommit|1 commit 9|2 author 9|3 date 9|4 message 9"];
      }
    };
    FileGit = class _FileGit extends __protoMessage325 {
      constructor(data) {
        super();
        this.commits = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileGit().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileGit().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileGit().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileGit, a, b2);
      }
      static $() {
        return ["FileGit|1 commits #0*", GitCommit];
      }
    };
    File2 = class _File extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_File, a, b2);
      }
      static $() {
        return ["File|1 relative_workspace_path 9|2 contents 9|3 file_git_context #0", FileGit];
      }
    };
    Diagnostic2 = class _Diagnostic extends __protoMessage325 {
      constructor(data) {
        super();
        this.message = "";
        this.severity = Diagnostic_DiagnosticSeverity.UNSPECIFIED;
        this.relatedInformation = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Diagnostic().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Diagnostic().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Diagnostic().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Diagnostic, a, b2);
      }
      static $() {
        return ["Diagnostic|1 message 9|2 range #0|3 severity #1|4 related_information #2*", CursorRange, Diagnostic_DiagnosticSeverity, Diagnostic_RelatedInformation];
      }
    };
    Diagnostic_DiagnosticSeverity = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "Diagnostic.DiagnosticSeverity", [[0, "UNSPECIFIED"], [1, "ERROR"], [2, "WARNING"], [3, "INFORMATION"], [4, "HINT"]], 1);
    Diagnostic_RelatedInformation = class _Diagnostic_RelatedInformation extends __protoMessage325 {
      constructor(data) {
        super();
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Diagnostic_RelatedInformation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Diagnostic_RelatedInformation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Diagnostic_RelatedInformation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Diagnostic_RelatedInformation, a, b2);
      }
      static $() {
        return ["Diagnostic.RelatedInformation|1 message 9|2 range #0", CursorRange];
      }
    };
    Lint = class _Lint extends __protoMessage325 {
      constructor(data) {
        super();
        this.message = "";
        this.severity = LintSeverity.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Lint().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Lint().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Lint().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Lint, a, b2);
      }
      static $() {
        return ["Lint|1 message 9|2 range #0|3 severity #1", SimpleRange, LintSeverity];
      }
    };
    BM25Chunk = class _BM25Chunk extends __protoMessage325 {
      constructor(data) {
        super();
        this.content = "";
        this.score = 0;
        this.relativePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BM25Chunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BM25Chunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BM25Chunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BM25Chunk, a, b2);
      }
      static $() {
        return ["BM25Chunk|1 content 9|2 range #0|3 score 5|4 relative_path 9", SimplestRange];
      }
    };
    CurrentFileInfo = class _CurrentFileInfo extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.contents = "";
        this.relyOnFilesync = false;
        this.cells = [];
        this.topChunks = [];
        this.contentsStartAtLine = 0;
        this.dataframes = [];
        this.totalNumberOfLines = 0;
        this.languageId = "";
        this.diagnostics = [];
        this.cellStartLines = [];
        this.workspaceRootPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CurrentFileInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CurrentFileInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CurrentFileInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CurrentFileInfo, a, b2);
      }
      static $() {
        return ["CurrentFileInfo|1 relative_workspace_path 9|2 contents 9|18 rely_on_filesync 8|17 sha_256_hash 9?|16 cells #0*|10 top_chunks #1*|9 contents_start_at_line 5|3 cursor_position #2|4 dataframes #3*|8 total_number_of_lines 5|5 language_id 9|6 selection #4|11 alternative_version_id 5?|7 diagnostics #5*|14 file_version 5?|15 cell_start_lines 5*|19 workspace_root_path 9|20 line_ending 9?", CurrentFileInfo_NotebookCell, BM25Chunk, CursorPosition, DataframeInfo, CursorRange, Diagnostic2];
      }
    };
    CurrentFileInfo_NotebookCell = class _CurrentFileInfo_NotebookCell extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CurrentFileInfo_NotebookCell().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CurrentFileInfo_NotebookCell().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CurrentFileInfo_NotebookCell().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CurrentFileInfo_NotebookCell, a, b2);
      }
      static $() {
        return ["CurrentFileInfo.NotebookCell"];
      }
    };
    AzureState = class _AzureState extends __protoMessage325 {
      constructor(data) {
        super();
        this.apiKey = "";
        this.baseUrl = "";
        this.deployment = "";
        this.useAzure = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AzureState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AzureState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AzureState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AzureState, a, b2);
      }
      static $() {
        return ["AzureState|1 api_key 9|2 base_url 9|3 deployment 9|4 use_azure 8"];
      }
    };
    BedrockState = class _BedrockState extends __protoMessage325 {
      constructor(data) {
        super();
        this.accessKey = "";
        this.secretKey = "";
        this.region = "";
        this.useBedrock = false;
        this.sessionToken = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BedrockState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BedrockState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BedrockState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BedrockState, a, b2);
      }
      static $() {
        return ["BedrockState|1 access_key 9|2 secret_key 9|3 region 9|4 use_bedrock 8|5 session_token 9"];
      }
    };
    ModelDetails = class _ModelDetails extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ModelDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ModelDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ModelDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ModelDetails, a, b2);
      }
      static $() {
        return ["ModelDetails|1 model_name 9?|2 api_key 9?|3 enable_ghost_mode 8?|4 azure_state #0?|5 enable_slow_pool 8?|6 openai_api_base_url 9?|7 bedrock_state #1?|8 max_mode 8?", AzureState, BedrockState];
      }
    };
    CloudAgentModelSelection = class _CloudAgentModelSelection extends __protoMessage325 {
      constructor(data) {
        super();
        this.modelId = "";
        this.parameters = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudAgentModelSelection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudAgentModelSelection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudAgentModelSelection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudAgentModelSelection, a, b2);
      }
      static $() {
        return ["CloudAgentModelSelection|1 model_id 9|2 parameters #0*|3 max_mode 8?", CloudAgentModelSelection_ParameterValue];
      }
    };
    CloudAgentModelSelection_ParameterValue = class _CloudAgentModelSelection_ParameterValue extends __protoMessage325 {
      constructor(data) {
        super();
        this.id = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudAgentModelSelection_ParameterValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudAgentModelSelection_ParameterValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudAgentModelSelection_ParameterValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudAgentModelSelection_ParameterValue, a, b2);
      }
      static $() {
        return ["CloudAgentModelSelection.ParameterValue|1 id 9|2 value 9"];
      }
    };
    ModelInfo = class _ModelInfo extends __protoMessage325 {
      constructor(data) {
        super();
        this.modelName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ModelInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ModelInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ModelInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ModelInfo, a, b2);
      }
      static $() {
        return ["ModelInfo|1 model_name 9"];
      }
    };
    DataframeInfo = class _DataframeInfo extends __protoMessage325 {
      constructor(data) {
        super();
        this.name = "";
        this.shape = "";
        this.dataDimensionality = 0;
        this.columns = [];
        this.rowCount = 0;
        this.indexColumn = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DataframeInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DataframeInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DataframeInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DataframeInfo, a, b2);
      }
      static $() {
        return ["DataframeInfo|1 name 9|2 shape 9|3 data_dimensionality 5|6 columns #0*|7 row_count 5|8 index_column 9", DataframeInfo_Column];
      }
    };
    DataframeInfo_Column = class _DataframeInfo_Column extends __protoMessage325 {
      constructor(data) {
        super();
        this.key = "";
        this.type = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DataframeInfo_Column().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DataframeInfo_Column().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DataframeInfo_Column().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DataframeInfo_Column, a, b2);
      }
      static $() {
        return ["DataframeInfo.Column|1 key 9|2 type 9"];
      }
    };
    LinterError = class _LinterError extends __protoMessage325 {
      constructor(data) {
        super();
        this.message = "";
        this.relatedInformation = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LinterError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LinterError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LinterError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LinterError, a, b2);
      }
      static $() {
        return ["LinterError|1 message 9|2 range #0|3 source 9?|4 related_information #1*|5 severity #2?|6 is_stale 8?", CursorRange, Diagnostic_RelatedInformation, Diagnostic_DiagnosticSeverity];
      }
    };
    LinterErrors = class _LinterErrors extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.errors = [];
        this.fileContents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LinterErrors().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LinterErrors().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LinterErrors().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LinterErrors, a, b2);
      }
      static $() {
        return ["LinterErrors|1 relative_workspace_path 9|2 errors #0*|3 file_contents 9", LinterError];
      }
    };
    LinterErrorsWithoutFileContents = class _LinterErrorsWithoutFileContents extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.errors = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LinterErrorsWithoutFileContents().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LinterErrorsWithoutFileContents().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LinterErrorsWithoutFileContents().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LinterErrorsWithoutFileContents, a, b2);
      }
      static $() {
        return ["LinterErrorsWithoutFileContents|1 relative_workspace_path 9|2 errors #0*", LinterError];
      }
    };
    CursorRule2 = class _CursorRule extends __protoMessage325 {
      constructor(data) {
        super();
        this.name = "";
        this.description = "";
        this.environments = [];
        this.disabledEnvironments = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CursorRule().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CursorRule().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CursorRule().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CursorRule, a, b2);
      }
      static $() {
        return ["CursorRule|1 name 9|2 description 9|3 body 9?|4 is_from_glob 8?|5 always_apply 8?|6 attach_to_background_agents 8?|7 full_path 9?|8 environments 9*|9 disabled_environments 9*|10 plugin 9?|11 marketplace 9?"];
      }
    };
    ExplicitContext = class _ExplicitContext extends __protoMessage325 {
      constructor(data) {
        super();
        this.context = "";
        this.rules = [];
        this.mcpInstructions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExplicitContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExplicitContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExplicitContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExplicitContext, a, b2);
      }
      static $() {
        return ["ExplicitContext|1 context 9|2 repo_context 9?|3 rules #0*|4 mode_specific_context 9?|5 mcp_instructions #1*", CursorRule2, MCPInstructions];
      }
    };
    MCPInstructions = class _MCPInstructions extends __protoMessage325 {
      constructor(data) {
        super();
        this.serverName = "";
        this.serverIdentifier = "";
        this.instructions = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPInstructions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPInstructions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPInstructions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPInstructions, a, b2);
      }
      static $() {
        return ["MCPInstructions|1 server_name 9|2 server_identifier 9|3 instructions 9"];
      }
    };
    DocumentSymbol = class _DocumentSymbol extends __protoMessage325 {
      constructor(data) {
        super();
        this.name = "";
        this.detail = "";
        this.kind = DocumentSymbol_SymbolKind.UNSPECIFIED;
        this.containerName = "";
        this.children = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentSymbol().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentSymbol().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentSymbol().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentSymbol, a, b2);
      }
      static $() {
        return ["DocumentSymbol|1 name 9|2 detail 9|3 kind #0|5 container_name 9|6 range #1|7 selection_range #1|8 children #2*", DocumentSymbol_SymbolKind, DocumentSymbol_Range, _DocumentSymbol];
      }
    };
    DocumentSymbol_SymbolKind = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "DocumentSymbol.SymbolKind", [[0, "UNSPECIFIED"], [1, "FILE"], [2, "MODULE"], [3, "NAMESPACE"], [4, "PACKAGE"], [5, "CLASS"], [6, "METHOD"], [7, "PROPERTY"], [8, "FIELD"], [9, "CONSTRUCTOR"], [10, "ENUM"], [11, "INTERFACE"], [12, "FUNCTION"], [13, "VARIABLE"], [14, "CONSTANT"], [15, "STRING"], [16, "NUMBER"], [17, "BOOLEAN"], [18, "ARRAY"], [19, "OBJECT"], [20, "KEY"], [21, "NULL"], [22, "ENUM_MEMBER"], [23, "STRUCT"], [24, "EVENT"], [25, "OPERATOR"], [26, "TYPE_PARAMETER"]], 1);
    DocumentSymbol_Range = class _DocumentSymbol_Range extends __protoMessage325 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.startColumn = 0;
        this.endLineNumber = 0;
        this.endColumn = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentSymbol_Range().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentSymbol_Range().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentSymbol_Range().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentSymbol_Range, a, b2);
      }
      static $() {
        return ["DocumentSymbol.Range|1 start_line_number 5|2 start_column 5|3 end_line_number 5|4 end_column 5"];
      }
    };
    HoverDetails = class _HoverDetails extends __protoMessage325 {
      constructor(data) {
        super();
        this.codeDetails = "";
        this.markdownBlocks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _HoverDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _HoverDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _HoverDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_HoverDetails, a, b2);
      }
      static $() {
        return ["HoverDetails|1 code_details 9|2 markdown_blocks 9*"];
      }
    };
    UriComponents = class _UriComponents extends __protoMessage325 {
      constructor(data) {
        super();
        this.scheme = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UriComponents().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UriComponents().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UriComponents().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UriComponents, a, b2);
      }
      static $() {
        return ["UriComponents|1 scheme 9|2 authority 9?|3 path 9?|4 query 9?|5 fragment 9?"];
      }
    };
    DocumentSymbolWithText = class _DocumentSymbolWithText extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.textInSymbolRange = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentSymbolWithText().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentSymbolWithText().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentSymbolWithText().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentSymbolWithText, a, b2);
      }
      static $() {
        return ["DocumentSymbolWithText|1 symbol #0|2 relative_workspace_path 9|3 text_in_symbol_range 9|4 uri_components #1", DocumentSymbol, UriComponents];
      }
    };
    ErrorDetails = class _ErrorDetails extends __protoMessage325 {
      constructor(data) {
        super();
        this.error = ErrorDetails_Error.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ErrorDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ErrorDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ErrorDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ErrorDetails, a, b2);
      }
      static $() {
        return ["ErrorDetails|1 error #0|2 details #1|3 is_expected 8?", ErrorDetails_Error, CustomErrorDetails];
      }
    };
    ErrorDetails_Error = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "ErrorDetails.Error", [[0, "UNSPECIFIED"], [1, "BAD_API_KEY"], [42, "BAD_USER_API_KEY"], [2, "NOT_LOGGED_IN"], [3, "INVALID_AUTH_ID"], [4, "NOT_HIGH_ENOUGH_PERMISSIONS"], [18, "AGENT_REQUIRES_LOGIN"], [5, "BAD_MODEL_NAME"], [39, "NOT_FOUND"], [40, "DEPRECATED"], [6, "USER_NOT_FOUND"], [7, "FREE_USER_RATE_LIMIT_EXCEEDED"], [8, "PRO_USER_RATE_LIMIT_EXCEEDED"], [9, "FREE_USER_USAGE_LIMIT"], [10, "PRO_USER_USAGE_LIMIT"], [41, "RESOURCE_EXHAUSTED"], [11, "AUTH_TOKEN_NOT_FOUND"], [12, "AUTH_TOKEN_EXPIRED"], [13, "OPENAI"], [14, "OPENAI_RATE_LIMIT_EXCEEDED"], [20, "MAX_TOKENS"], [23, "PRO_USER_ONLY"], [21, "USER_ABORTED_REQUEST"], [25, "TIMEOUT"], [22, "GENERIC_RATE_LIMIT_EXCEEDED"], [28, "GPT_4_VISION_PREVIEW_RATE_LIMIT"], [29, "CUSTOM_MESSAGE"], [30, "OUTDATED_CLIENT"], [31, "CLAUDE_IMAGE_TOO_LARGE"], [33, "FILE_NOT_FOUND"], [34, "API_KEY_RATE_LIMIT"], [35, "DEBOUNCED"], [36, "BAD_REQUEST"], [37, "REPOSITORY_SERVICE_REPOSITORY_IS_NOT_INITIALIZED"], [38, "UNAUTHORIZED"], [43, "CONVERSATION_TOO_LONG"], [44, "USAGE_PRICING_REQUIRED"], [45, "USAGE_PRICING_REQUIRED_CHANGEABLE"], [46, "GITHUB_NO_USER_CREDENTIALS"], [47, "GITHUB_USER_NO_ACCESS"], [48, "GITHUB_APP_NO_ACCESS"], [49, "GITHUB_MULTIPLE_OWNERS"], [50, "RATE_LIMITED"], [51, "RATE_LIMITED_CHANGEABLE"], [52, "CUSTOM"], [53, "HOOKS_BLOCKED"], [54, "SUSPICIOUS_USAGE_BLOCKED"], [55, "EXTENSION_HOST_TIMEOUT"], [56, "NETWORK_ERROR"], [57, "PROVIDER_ERROR"], [58, "MODEL_BLOCKED"], [59, "INTERNAL"], [60, "MAX_MODE_REQUIRED"], [61, "MODEL_NO_LONGER_SUPPORTED"], [62, "PRICING_WARNING"], [63, "SLOW_POOL"], [64, "UNSUPPORTED_REGION"], [65, "ACCOUNT_CLOSED"]], 1);
    CustomErrorDetails = class _CustomErrorDetails extends __protoMessage325 {
      constructor(data) {
        super();
        this.title = "";
        this.detail = "";
        this.buttons = [];
        this.additionalInfo = {};
        this.planChoices = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomErrorDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomErrorDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomErrorDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomErrorDetails, a, b2);
      }
      static $() {
        return ["CustomErrorDetails|1 title 9|2 detail 9|3 allow_command_links_potentially_unsafe_please_only_use_for_handwritten_trusted_markdown 8?|4 is_retryable 8?|5 show_request_id 8?|6 should_show_immediate_error 8?|8 buttons #0*|7 additional_info 9,9|9 plan_choices #1*|10 analytics_metadata #2?", ErrorButton, PlanChoice, ErrorAnalyticsMetadata];
      }
    };
    ErrorAnalyticsMetadata = class _ErrorAnalyticsMetadata extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ErrorAnalyticsMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ErrorAnalyticsMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ErrorAnalyticsMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ErrorAnalyticsMetadata, a, b2);
      }
      static $() {
        return ["ErrorAnalyticsMetadata|1 action_required 9?"];
      }
    };
    PlanChoice = class _PlanChoice extends __protoMessage325 {
      constructor(data) {
        super();
        this.label = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PlanChoice().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PlanChoice().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PlanChoice().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PlanChoice, a, b2);
      }
      static $() {
        return ["PlanChoice|1 label 9|2 sublabel 9?|3 description 9?|4 value 9"];
      }
    };
    ErrorButton = class _ErrorButton extends __protoMessage325 {
      constructor(data) {
        super();
        this.label = "";
        this.action = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ErrorButton().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ErrorButton().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ErrorButton().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ErrorButton, a, b2);
      }
      static $() {
        return ["ErrorButton|1 label 9|2 upgrade #0 action|3 switch_model #1 action|4 configure_spend_limit #2 action|5 url #3 action|6 upgrade_choice #4 action|7 dashboard_action #5 action|8 reload_window #6 action|9 client_action #7 action", UpgradeAction, SwitchModelAction, ConfigureSpendLimitAction, UrlAction, UpgradeChoice, DashboardAction, ReloadWindowAction, ClientAction];
      }
    };
    ClientAction = class _ClientAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.commandId = "";
        this.args = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientAction, a, b2);
      }
      static $() {
        return ["ClientAction|1 command_id 9|2 args 9,9"];
      }
    };
    ReloadWindowAction = class _ReloadWindowAction extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReloadWindowAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReloadWindowAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReloadWindowAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReloadWindowAction, a, b2);
      }
      static $() {
        return ["ReloadWindowAction"];
      }
    };
    DashboardAction = class _DashboardAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.action = "";
        this.args = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DashboardAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DashboardAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DashboardAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DashboardAction, a, b2);
      }
      static $() {
        return ["DashboardAction|1 action 9|2 args 9,9|3 success_message 9?"];
      }
    };
    UpgradeChoice = class _UpgradeChoice extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpgradeChoice().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpgradeChoice().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpgradeChoice().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpgradeChoice, a, b2);
      }
      static $() {
        return ["UpgradeChoice"];
      }
    };
    UpgradeAction = class _UpgradeAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.membershipToUpgradeTo = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpgradeAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpgradeAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpgradeAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpgradeAction, a, b2);
      }
      static $() {
        return ["UpgradeAction|1 membership_to_upgrade_to 9|2 try_immediate_upgrade 8?|3 allow_trial 8?|4 dashboard_action #0?", DashboardAction];
      }
    };
    SwitchModelAction = class _SwitchModelAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.parameters = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SwitchModelAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SwitchModelAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SwitchModelAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SwitchModelAction, a, b2);
      }
      static $() {
        return ["SwitchModelAction|1 suggested_model 9?|2 parameters #0*|3 max_mode 8?", SwitchModelAction_ModelParameterValue];
      }
    };
    SwitchModelAction_ModelParameterValue = class _SwitchModelAction_ModelParameterValue extends __protoMessage325 {
      constructor(data) {
        super();
        this.id = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SwitchModelAction_ModelParameterValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SwitchModelAction_ModelParameterValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SwitchModelAction_ModelParameterValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SwitchModelAction_ModelParameterValue, a, b2);
      }
      static $() {
        return ["SwitchModelAction.ModelParameterValue|1 id 9|2 value 9"];
      }
    };
    ConfigureSpendLimitAction = class _ConfigureSpendLimitAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.confirmLabel = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConfigureSpendLimitAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConfigureSpendLimitAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConfigureSpendLimitAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConfigureSpendLimitAction, a, b2);
      }
      static $() {
        return ["ConfigureSpendLimitAction|1 confirm_label 9"];
      }
    };
    UrlAction = class _UrlAction extends __protoMessage325 {
      constructor(data) {
        super();
        this.url = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UrlAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UrlAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UrlAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UrlAction, a, b2);
      }
      static $() {
        return ["UrlAction|1 url 9"];
      }
    };
    ImageProto = class _ImageProto extends __protoMessage325 {
      constructor(data) {
        super();
        this.data = new Uint8Array(0);
        this.uuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImageProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImageProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImageProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImageProto, a, b2);
      }
      static $() {
        return ["ImageProto|1 data 12|2 dimension #0|3 uuid 9|4 task_specific_description 9?", ImageProto_Dimension];
      }
    };
    ImageProto_Dimension = class _ImageProto_Dimension extends __protoMessage325 {
      constructor(data) {
        super();
        this.width = 0;
        this.height = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImageProto_Dimension().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImageProto_Dimension().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImageProto_Dimension().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImageProto_Dimension, a, b2);
      }
      static $() {
        return ["ImageProto.Dimension|1 width 5|2 height 5"];
      }
    };
    ChatQuote = class _ChatQuote extends __protoMessage325 {
      constructor(data) {
        super();
        this.markdown = "";
        this.bubbleId = "";
        this.sectionIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChatQuote().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChatQuote().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChatQuote().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChatQuote, a, b2);
      }
      static $() {
        return ["ChatQuote|1 markdown 9|2 bubble_id 9|3 section_index 5"];
      }
    };
    ChatExternalLink = class _ChatExternalLink extends __protoMessage325 {
      constructor(data) {
        super();
        this.url = "";
        this.uuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChatExternalLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChatExternalLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChatExternalLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChatExternalLink, a, b2);
      }
      static $() {
        return ["ChatExternalLink|1 url 9|2 uuid 9|3 pdf_content 9?|4 is_pdf 8?|5 filename 9?"];
      }
    };
    ComposerExternalLink = class _ComposerExternalLink extends __protoMessage325 {
      constructor(data) {
        super();
        this.url = "";
        this.uuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComposerExternalLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComposerExternalLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComposerExternalLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComposerExternalLink, a, b2);
      }
      static $() {
        return ["ComposerExternalLink|1 url 9|2 uuid 9|3 pdf_content 9?|4 is_pdf 8?|5 filename 9?"];
      }
    };
    CmdKExternalLink = class _CmdKExternalLink extends __protoMessage325 {
      constructor(data) {
        super();
        this.url = "";
        this.uuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CmdKExternalLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CmdKExternalLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CmdKExternalLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CmdKExternalLink, a, b2);
      }
      static $() {
        return ["CmdKExternalLink|1 url 9|2 uuid 9"];
      }
    };
    CommitNote = class _CommitNote extends __protoMessage325 {
      constructor(data) {
        super();
        this.note = "";
        this.commitHash = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommitNote().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommitNote().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommitNote().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommitNote, a, b2);
      }
      static $() {
        return ["CommitNote|1 note 9|2 commit_hash 9"];
      }
    };
    CommitNoteWithEmbeddings = class _CommitNoteWithEmbeddings extends __protoMessage325 {
      constructor(data) {
        super();
        this.note = "";
        this.commitHash = "";
        this.embeddings = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommitNoteWithEmbeddings().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommitNoteWithEmbeddings().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommitNoteWithEmbeddings().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommitNoteWithEmbeddings, a, b2);
      }
      static $() {
        return ["CommitNoteWithEmbeddings|1 note 9|2 commit_hash 9|3 embeddings 1*"];
      }
    };
    CommitDiffString = class _CommitDiffString extends __protoMessage325 {
      constructor(data) {
        super();
        this.diff = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommitDiffString().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommitDiffString().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommitDiffString().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommitDiffString, a, b2);
      }
      static $() {
        return ["CommitDiffString|1 diff 9"];
      }
    };
    CodeChunk = class _CodeChunk extends __protoMessage325 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.startLineNumber = 0;
        this.lines = [];
        this.languageIdentifier = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeChunk, a, b2);
      }
      static $() {
        return ["CodeChunk|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*|4 summarization_strategy #0?|5 language_identifier 9|6 intent #1?|7 is_final_version 8?|8 is_first_version 8?", CodeChunk_SummarizationStrategy, CodeChunk_Intent];
      }
    };
    CodeChunk_Intent = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "CodeChunk.Intent", [[0, "UNSPECIFIED"], [1, "COMPOSER_FILE"], [2, "COMPRESSED_COMPOSER_FILE"]], 1);
    CodeChunk_SummarizationStrategy = /* @__PURE__ */ enumType2(proto3, __protoPackage25, "CodeChunk.SummarizationStrategy", [[0, "NONE_UNSPECIFIED"], [1, "SUMMARIZED"], [2, "EMBEDDED"]], 1);
    RCPCallFrame = class _RCPCallFrame extends __protoMessage325 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RCPCallFrame().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RCPCallFrame().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RCPCallFrame().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RCPCallFrame, a, b2);
      }
      static $() {
        return ["RCPCallFrame|1 function_name 9?|2 url 9?|3 line_number 5?|4 column_number 5?"];
      }
    };
    RCPStackTrace = class _RCPStackTrace extends __protoMessage325 {
      constructor(data) {
        super();
        this.callFrames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RCPStackTrace().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RCPStackTrace().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RCPStackTrace().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RCPStackTrace, a, b2);
      }
      static $() {
        return ["RCPStackTrace|1 call_frames #0*|2 raw_stack_trace 9?", RCPCallFrame];
      }
    };
    RCPLogEntry = class _RCPLogEntry extends __protoMessage325 {
      constructor(data) {
        super();
        this.message = "";
        this.timestamp = 0;
        this.level = "";
        this.clientName = "";
        this.sessionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RCPLogEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RCPLogEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RCPLogEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RCPLogEntry, a, b2);
      }
      static $() {
        return ["RCPLogEntry|1 message 9|2 timestamp 1|3 level 9|4 client_name 9|5 session_id 9|6 stack_trace #0?|7 object_data_json 9?", RCPStackTrace];
      }
    };
    RCPUIElementPicked = class _RCPUIElementPicked extends __protoMessage325 {
      constructor(data) {
        super();
        this.element = "";
        this.xpath = "";
        this.textContent = "";
        this.extra = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RCPUIElementPicked().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RCPUIElementPicked().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RCPUIElementPicked().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RCPUIElementPicked, a, b2);
      }
      static $() {
        return ["RCPUIElementPicked|1 element 9|2 xpath 9|3 text_content 9|4 extra 9|5 component 9?|6 component_props_json 9?"];
      }
    };
  }
});

