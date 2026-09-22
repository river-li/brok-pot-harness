/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/selected_context_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage78 = "agent.v1.";
var __protoMessage377 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage78;
  }
};
var SelectedPluginCapabilityType = /* @__PURE__ */ enumType(proto3, __protoPackage78, "SelectedPluginCapabilityType", [[0, "UNSPECIFIED"], [1, "COMMAND"], [2, "SKILL"], [3, "SUBAGENT"]], 1);
var SelectedImage = class _SelectedImage extends __protoMessage377 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.path = "";
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage, a, b);
  }
  static $() {
    return ["SelectedImage|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|10 prompt_upload_ref #1 data_or_blob_id|2 uuid 9|3 path 9|4 dimension #2|7 mime_type 9", SelectedImage_BlobIdWithData, PromptUploadRef, SelectedImage_Dimension];
  }
};
var SelectedImage_BlobIdWithData = class _SelectedImage_BlobIdWithData extends __protoMessage377 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedImage.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedImage_Dimension = class _SelectedImage_Dimension extends __protoMessage377 {
  constructor(data) {
    super();
    this.width = 0;
    this.height = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage_Dimension().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage_Dimension().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage_Dimension().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage_Dimension, a, b);
  }
  static $() {
    return ["SelectedImage.Dimension|1 width 5|2 height 5"];
  }
};
var PromptUploadRef = class _PromptUploadRef extends __protoMessage377 {
  constructor(data) {
    super();
    this.uploadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptUploadRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptUploadRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptUploadRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptUploadRef, a, b);
  }
  static $() {
    return ["PromptUploadRef|1 upload_id 9"];
  }
};
var SelectedDocument = class _SelectedDocument extends __protoMessage377 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.filename = "";
    this.mimeType = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocument().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocument().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocument().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocument, a, b);
  }
  static $() {
    return ["SelectedDocument|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|10 prompt_upload_ref #1 data_or_blob_id|2 uuid 9|3 filename 9|4 mime_type 9|7 path 9", SelectedDocument_BlobIdWithData, PromptUploadRef];
  }
};
var SelectedDocument_BlobIdWithData = class _SelectedDocument_BlobIdWithData extends __protoMessage377 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocument_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocument_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocument_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocument_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedDocument.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedVideo = class _SelectedVideo extends __protoMessage377 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.path = "";
    this.mimeType = "";
    this.filename = "";
    this.materializeToFilesystem = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo, a, b);
  }
  static $() {
    return ["SelectedVideo|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|11 signed_url #1 data_or_blob_id|2 uuid 9|3 path 9|4 fps 2?|7 mime_type 9|10 filename 9|12 materialize_to_filesystem 8", SelectedVideo_BlobIdWithData, SelectedVideo_SignedUrl];
  }
};
var SelectedVideo_BlobIdWithData = class _SelectedVideo_BlobIdWithData extends __protoMessage377 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedVideo.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedVideo_SignedUrl = class _SelectedVideo_SignedUrl extends __protoMessage377 {
  constructor(data) {
    super();
    this.url = "";
    this.key = "";
    this.expiresAtUnixMs = protoInt64.zero;
    this.refreshAfterUnixMs = protoInt64.zero;
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo_SignedUrl().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo_SignedUrl().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo_SignedUrl().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo_SignedUrl, a, b);
  }
  static $() {
    return ["SelectedVideo.SignedUrl|1 url 9|2 key 9|3 expires_at_unix_ms 3|4 refresh_after_unix_ms 3|5 conversation_id 9"];
  }
};
var ExtraContextEntry = class _ExtraContextEntry extends __protoMessage377 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ExtraContextEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ExtraContextEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ExtraContextEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ExtraContextEntry, a, b);
  }
  static $() {
    return ["ExtraContextEntry|1 data 9 data_or_blob_id|2 blob_id 12 data_or_blob_id"];
  }
};
var SelectedFile = class _SelectedFile extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedFile().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedFile().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedFile().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedFile, a, b);
  }
  static $() {
    return ["SelectedFile|1 content 9|2 path 9|3 relative_path 9?"];
  }
};
var SelectedCodeSelection = class _SelectedCodeSelection extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCodeSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCodeSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCodeSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCodeSelection, a, b);
  }
  static $() {
    return ["SelectedCodeSelection|1 content 9|2 path 9|3 relative_path 9?|4 range #0", Range];
  }
};
var SelectedTerminal = class _SelectedTerminal extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedTerminal().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedTerminal().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedTerminal().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedTerminal, a, b);
  }
  static $() {
    return ["SelectedTerminal|1 content 9|2 title 9?|3 path 9?"];
  }
};
var SelectedTerminalSelection = class _SelectedTerminalSelection extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedTerminalSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedTerminalSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedTerminalSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedTerminalSelection, a, b);
  }
  static $() {
    return ["SelectedTerminalSelection|1 content 9|2 title 9?|3 path 9?|4 range #0", Range];
  }
};
var SelectedFolder = class _SelectedFolder extends __protoMessage377 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedFolder().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedFolder().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedFolder().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedFolder, a, b);
  }
  static $() {
    return ["SelectedFolder|1 path 9|2 relative_path 9?|3 directory_tree #0", LsDirectoryTreeNode];
  }
};
var SelectedExternalLink = class _SelectedExternalLink extends __protoMessage377 {
  constructor(data) {
    super();
    this.url = "";
    this.uuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedExternalLink().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedExternalLink().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedExternalLink().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedExternalLink, a, b);
  }
  static $() {
    return ["SelectedExternalLink|1 url 9|2 uuid 9|3 pdf_content 9?|4 is_pdf 8?|5 filename 9?|6 blob_id 12?"];
  }
};
var SelectedCursorRule = class _SelectedCursorRule extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCursorRule().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCursorRule().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCursorRule().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCursorRule, a, b);
  }
  static $() {
    return ["SelectedCursorRule|1 rule #0", CursorRule];
  }
};
var SelectedGitDiff = class _SelectedGitDiff extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    this.fullContentLengthCharCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitDiff().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitDiff().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitDiff().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitDiff, a, b);
  }
  static $() {
    return ["SelectedGitDiff|1 content 9|2 full_content_length_char_count 5"];
  }
};
var SelectedGitDiffFromBranchToMain = class _SelectedGitDiffFromBranchToMain extends __protoMessage377 {
  constructor(data) {
    super();
    this.content = "";
    this.fullContentLengthCharCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitDiffFromBranchToMain().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitDiffFromBranchToMain().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitDiffFromBranchToMain().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitDiffFromBranchToMain, a, b);
  }
  static $() {
    return ["SelectedGitDiffFromBranchToMain|1 content 9|2 full_content_length_char_count 5"];
  }
};
var SelectedGitCommit = class _SelectedGitCommit extends __protoMessage377 {
  constructor(data) {
    super();
    this.sha = "";
    this.message = "";
    this.diff = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitCommit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitCommit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitCommit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitCommit, a, b);
  }
  static $() {
    return ["SelectedGitCommit|1 sha 9|2 message 9|3 description 9?|4 diff 9"];
  }
};
var SelectedPullRequest = class _SelectedPullRequest extends __protoMessage377 {
  constructor(data) {
    super();
    this.number = 0;
    this.url = "";
    this.folderPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPullRequest().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPullRequest().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPullRequest().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPullRequest, a, b);
  }
  static $() {
    return ["SelectedPullRequest|1 number 5|2 url 9|3 title 9?|4 folder_path 9|5 summary_json 9?|6 description 9?|7 blob_id 12?"];
  }
};
var SelectedGitPRDiffSelection = class _SelectedGitPRDiffSelection extends __protoMessage377 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.filePath = "";
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitPRDiffSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitPRDiffSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitPRDiffSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitPRDiffSelection, a, b);
  }
  static $() {
    return ["SelectedGitPRDiffSelection|1 pr_url 9|2 file_path 9|3 start_line 5|4 end_line 5|5 diff_content 9?|6 blob_id 12?"];
  }
};
var SelectedPluginCapabilityRef = class _SelectedPluginCapabilityRef extends __protoMessage377 {
  constructor(data) {
    super();
    this.pluginId = "";
    this.capabilityType = SelectedPluginCapabilityType.UNSPECIFIED;
    this.sourcePath = "";
    this.snapshotToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPluginCapabilityRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPluginCapabilityRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPluginCapabilityRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPluginCapabilityRef, a, b);
  }
  static $() {
    return ["SelectedPluginCapabilityRef|1 plugin_id 9|2 capability_type #0|3 source_path 9|4 snapshot_token 9|5 resolved_commit_sha 9?", SelectedPluginCapabilityType];
  }
};
var SelectedCursorCommand = class _SelectedCursorCommand extends __protoMessage377 {
  constructor(data) {
    super();
    this.name = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCursorCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCursorCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCursorCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCursorCommand, a, b);
  }
  static $() {
    return ["SelectedCursorCommand|1 name 9|2 content 9|3 plugin_capability #0?|4 full_path 9?|5 display_name 9?", SelectedPluginCapabilityRef];
  }
};
var SelectedDocumentation = class _SelectedDocumentation extends __protoMessage377 {
  constructor(data) {
    super();
    this.docId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocumentation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocumentation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocumentation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocumentation, a, b);
  }
  static $() {
    return ["SelectedDocumentation|1 doc_id 9|2 name 9"];
  }
};
var SelectedPastChat = class _SelectedPastChat extends __protoMessage377 {
  constructor(data) {
    super();
    this.agentId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPastChat().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPastChat().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPastChat().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPastChat, a, b);
  }
  static $() {
    return ["SelectedPastChat|1 agent_id 9|2 name 9"];
  }
};
var RecentAgent = class _RecentAgent extends __protoMessage377 {
  constructor(data) {
    super();
    this.name = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecentAgent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecentAgent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecentAgent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecentAgent, a, b);
  }
  static $() {
    return ["RecentAgent|1 name 9|2 path 9|3 overview 9?"];
  }
};
var RecentAgentsContext = class _RecentAgentsContext extends __protoMessage377 {
  constructor(data) {
    super();
    this.recentAgents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecentAgentsContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecentAgentsContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecentAgentsContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecentAgentsContext, a, b);
  }
  static $() {
    return ["RecentAgentsContext|1 recent_agents #0*", RecentAgent];
  }
};
var CallFrame = class _CallFrame extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CallFrame().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CallFrame().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CallFrame().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CallFrame, a, b);
  }
  static $() {
    return ["CallFrame|1 function_name 9?|2 url 9?|3 line_number 5?|4 column_number 5?"];
  }
};
var StackTrace = class _StackTrace extends __protoMessage377 {
  constructor(data) {
    super();
    this.callFrames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StackTrace().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StackTrace().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StackTrace().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StackTrace, a, b);
  }
  static $() {
    return ["StackTrace|1 call_frames #0*|2 raw_stack_trace 9?", CallFrame];
  }
};
var SelectedConsoleLog = class _SelectedConsoleLog extends __protoMessage377 {
  constructor(data) {
    super();
    this.message = "";
    this.timestamp = 0;
    this.level = "";
    this.clientName = "";
    this.sessionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedConsoleLog().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedConsoleLog().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedConsoleLog().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedConsoleLog, a, b);
  }
  static $() {
    return ["SelectedConsoleLog|1 message 9|2 timestamp 1|3 level 9|4 client_name 9|5 session_id 9|6 stack_trace #0?|7 object_data_json 9?", StackTrace];
  }
};
var SelectedUIElement = class _SelectedUIElement extends __protoMessage377 {
  constructor(data) {
    super();
    this.element = "";
    this.xpath = "";
    this.textContent = "";
    this.extra = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedUIElement().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedUIElement().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedUIElement().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedUIElement, a, b);
  }
  static $() {
    return ["SelectedUIElement|1 element 9|2 xpath 9|3 text_content 9|4 extra 9|5 component 9?|6 component_props_json 9?"];
  }
};
var SelectedSubagent = class _SelectedSubagent extends __protoMessage377 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedSubagent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedSubagent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedSubagent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedSubagent, a, b);
  }
  static $() {
    return ["SelectedSubagent|1 name 9"];
  }
};
var SelectedBrowser = class _SelectedBrowser extends __protoMessage377 {
  constructor(data) {
    super();
    this.browserId = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedBrowser().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedBrowser().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedBrowser().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedBrowser, a, b);
  }
  static $() {
    return ["SelectedBrowser|1 browser_id 9|2 url 9|3 page_title 9?"];
  }
};
var SelectedAgenticGitActionCommitParams = class _SelectedAgenticGitActionCommitParams extends __protoMessage377 {
  constructor(data) {
    super();
    this.filesToCommit = [];
    this.filesToExcludeFromCommit = [];
    this.shouldStageAllChanges = false;
    this.filesToCommitWithStatus = [];
    this.filesToExcludeFromCommitWithStatus = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionCommitParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionCommitParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionCommitParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionCommitParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionCommitParams|1 files_to_commit 9*|2 files_to_exclude_from_commit 9*|3 should_stage_all_changes 8|4 create_pr_draft 8?|5 files_to_commit_with_status #0*|6 files_to_exclude_from_commit_with_status #0*", SelectedAgenticGitFileWithStatus];
  }
};
var SelectedAgenticGitActionCreateBranchParams = class _SelectedAgenticGitActionCreateBranchParams extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionCreateBranchParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionCreateBranchParams"];
  }
};
var SelectedAgenticGitFileWithStatus = class _SelectedAgenticGitFileWithStatus extends __protoMessage377 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitFileWithStatus().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitFileWithStatus().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitFileWithStatus().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitFileWithStatus, a, b);
  }
  static $() {
    return ["SelectedAgenticGitFileWithStatus|1 path 9|2 status 9?"];
  }
};
var SelectedAgenticGitActionPushParams = class _SelectedAgenticGitActionPushParams extends __protoMessage377 {
  constructor(data) {
    super();
    this.filesToPush = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionPushParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionPushParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionPushParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionPushParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionPushParams|1 files_to_push 9*|2 create_pr_draft 8?"];
  }
};
var SelectedAgenticGitActionFixMergeConflictsParams = class _SelectedAgenticGitActionFixMergeConflictsParams extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionFixMergeConflictsParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionFixMergeConflictsParams|1 base_branch 9?|2 pr_url 9?"];
  }
};
var SelectedAgenticGitActionBabysitPrInCloudParams = class _SelectedAgenticGitActionBabysitPrInCloudParams extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionBabysitPrInCloudParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionBabysitPrInCloudParams|1 base_branch 9?"];
  }
};
var SelectedAgenticGitActionUpdateBranchParams = class _SelectedAgenticGitActionUpdateBranchParams extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionUpdateBranchParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionUpdateBranchParams|1 base_branch 9?"];
  }
};
var SelectedAgenticGitActionPullLocallyParams = class _SelectedAgenticGitActionPullLocallyParams extends __protoMessage377 {
  constructor(data) {
    super();
    this.remoteBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionPullLocallyParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionPullLocallyParams|1 remote_branch 9"];
  }
};
var SelectedAgenticGitAction = class _SelectedAgenticGitAction extends __protoMessage377 {
  constructor(data) {
    super();
    this.params = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitAction, a, b);
  }
  static $() {
    return ["SelectedAgenticGitAction|2 commit_params #0 params|6 commit_and_push_params #0 params|3 push_params #1 params|7 create_pr_params #1 params|8 create_pr_with_changes_params #0 params|4 fix_merge_conflicts_params #2 params|11 babysit_pr_in_cloud_params #3 params|14 apply_locally_params #4 params|15 checkout_branch_params #4 params|12 create_branch_and_commit_params #0 params|13 create_branch_commit_and_push_params #0 params|16 update_branch_params #5 params|17 create_branch_params #6 params|5 branch_context #7?|9 path_to_template_file 9?|10 path_to_template_dir 9?", SelectedAgenticGitActionCommitParams, SelectedAgenticGitActionPushParams, SelectedAgenticGitActionFixMergeConflictsParams, SelectedAgenticGitActionBabysitPrInCloudParams, SelectedAgenticGitActionPullLocallyParams, SelectedAgenticGitActionUpdateBranchParams, SelectedAgenticGitActionCreateBranchParams, SelectedGitBranchContext];
  }
};
var SelectedGitBranchContext = class _SelectedGitBranchContext extends __protoMessage377 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitBranchContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitBranchContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitBranchContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitBranchContext, a, b);
  }
  static $() {
    return ["SelectedGitBranchContext|1 current_branch 9?|2 base_branch 9?|3 agent_branch_prefix 9?"];
  }
};
var SelectedContext = class _SelectedContext extends __protoMessage377 {
  constructor(data) {
    super();
    this.selectedImages = [];
    this.extraContext = [];
    this.extraContextEntries = [];
    this.files = [];
    this.codeSelections = [];
    this.terminals = [];
    this.terminalSelections = [];
    this.folders = [];
    this.externalLinks = [];
    this.cursorRules = [];
    this.cursorCommands = [];
    this.documentations = [];
    this.uiElements = [];
    this.consoleLogs = [];
    this.gitCommits = [];
    this.pastChats = [];
    this.gitPrDiffSelections = [];
    this.selectedPullRequests = [];
    this.selectedSubagents = [];
    this.selectedVideos = [];
    this.selectedBrowsers = [];
    this.selectedDocuments = [];
    this.selectedSkills = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedContext, a, b);
  }
  static $() {
    return ["SelectedContext|1 selected_images #0*|2 invocation_context #1?|3 extra_context 9*|16 extra_context_entries #2*|4 files #3*|5 code_selections #4*|6 terminals #5*|7 terminal_selections #6*|8 folders #7*|9 external_links #8*|10 cursor_rules #9*|18 git_diff #10?|11 git_diff_from_branch_to_main #11?|12 cursor_commands #12*|13 documentations #13*|14 ui_elements #14*|15 console_logs #15*|17 git_commits #16*|19 past_chats #17*|20 git_pr_diff_selections #18*|21 selected_pull_requests #19*|22 selected_subagents #20*|23 selected_videos #21*|24 selected_browsers #22*|25 selected_documents #23*|26 selected_skills #24*|27 recent_agents_context #25?|34 selected_agentic_git_action #26?", SelectedImage, InvocationContext, ExtraContextEntry, SelectedFile, SelectedCodeSelection, SelectedTerminal, SelectedTerminalSelection, SelectedFolder, SelectedExternalLink, SelectedCursorRule, SelectedGitDiff, SelectedGitDiffFromBranchToMain, SelectedCursorCommand, SelectedDocumentation, SelectedUIElement, SelectedConsoleLog, SelectedGitCommit, SelectedPastChat, SelectedGitPRDiffSelection, SelectedPullRequest, SelectedSubagent, SelectedVideo, SelectedBrowser, SelectedDocument, AgentSkill, RecentAgentsContext, SelectedAgenticGitAction];
  }
};
var InvocationContext = class _InvocationContext extends __protoMessage377 {
  constructor(data) {
    super();
    this.data = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext, a, b);
  }
  static $() {
    return ["InvocationContext|1 slack_thread #0 data|2 github_pr #1 data|3 ide_state #2 data|4 microsoft_teams_thread #3 data|10 blob_id 12 data", InvocationContext_SlackThread, InvocationContext_GithubPR, InvocationContext_IdeState, InvocationContext_MicrosoftTeamsThread];
  }
};
var InvocationContext_SlackThread = class _InvocationContext_SlackThread extends __protoMessage377 {
  constructor(data) {
    super();
    this.thread = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_SlackThread().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_SlackThread().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_SlackThread().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_SlackThread, a, b);
  }
  static $() {
    return ["InvocationContext.SlackThread|1 thread 9|2 channel_name 9?|3 channel_purpose 9?|4 channel_topic 9?|5 sender_name 9?|6 sender_id 9?|7 sender_type 9?|8 is_directly_addressed 8?"];
  }
};
var InvocationContext_MicrosoftTeamsThread = class _InvocationContext_MicrosoftTeamsThread extends __protoMessage377 {
  constructor(data) {
    super();
    this.thread = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_MicrosoftTeamsThread, a, b);
  }
  static $() {
    return ["InvocationContext.MicrosoftTeamsThread|1 thread 9|2 channel_name 9?|3 team_name 9?|4 channel_description 9?|5 team_description 9?"];
  }
};
var InvocationContext_GithubPR = class _InvocationContext_GithubPR extends __protoMessage377 {
  constructor(data) {
    super();
    this.title = "";
    this.description = "";
    this.comments = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_GithubPR().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_GithubPR().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_GithubPR().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_GithubPR, a, b);
  }
  static $() {
    return ["InvocationContext.GithubPR|1 title 9|2 description 9|3 comments 9|4 ci_failures 9?"];
  }
};
var InvocationContext_IdeState = class _InvocationContext_IdeState extends __protoMessage377 {
  constructor(data) {
    super();
    this.visibleFiles = [];
    this.recentlyViewedFiles = [];
    this.currentlyViewedPrs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState|1 visible_files #0*|2 recently_viewed_files #0*|3 currently_viewed_prs #1*", InvocationContext_IdeState_File, InvocationContext_IdeState_ViewedPullRequest];
  }
};
var InvocationContext_IdeState_File = class _InvocationContext_IdeState_File extends __protoMessage377 {
  constructor(data) {
    super();
    this.path = "";
    this.totalLines = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_File().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_File().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_File().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_File, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.File|1 path 9|2 relative_path 9?|3 cursor_position #0?|4 total_lines 5|5 active_command 9?", InvocationContext_IdeState_File_CursorPosition];
  }
};
var InvocationContext_IdeState_File_CursorPosition = class _InvocationContext_IdeState_File_CursorPosition extends __protoMessage377 {
  constructor(data) {
    super();
    this.line = 0;
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_File_CursorPosition, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.File.CursorPosition|1 line 5|2 text 9"];
  }
};
var InvocationContext_IdeState_ViewedPullRequest = class _InvocationContext_IdeState_ViewedPullRequest extends __protoMessage377 {
  constructor(data) {
    super();
    this.number = 0;
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_ViewedPullRequest, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.ViewedPullRequest|1 number 5|2 url 9|3 title 9?|4 folder_path 9?|5 summary_json 9?|6 description 9?"];
  }
};

