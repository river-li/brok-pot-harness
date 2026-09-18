init_esm();
init_compact();
var __protoPackage155 = "git_forge.v1.";
var __protoMessage3147 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage155;
  }
};
var CompareCommitsStatus = /* @__PURE__ */ enumType(proto3, __protoPackage155, "CompareCommitsStatus", [[0, "UNSPECIFIED"], [1, "IDENTICAL"], [2, "AHEAD"], [3, "BEHIND"], [4, "DIVERGED"], [5, "NO_MERGE_BASE"]], 1);
var MergeMode = /* @__PURE__ */ enumType(proto3, __protoPackage155, "MergeMode", [[0, "UNSPECIFIED"], [1, "MERGE_COMMIT"], [2, "SQUASH"]], 1);
var CommitFileMode = /* @__PURE__ */ enumType(proto3, __protoPackage155, "CommitFileMode", [[0, "UNSPECIFIED"], [1, "REGULAR"], [2, "EXECUTABLE"], [3, "SYMLINK"]], 1);
var GrepPriority = /* @__PURE__ */ enumType(proto3, __protoPackage155, "GrepPriority", [[0, "UNSPECIFIED"], [1, "INTERACTIVE"], [2, "BACKGROUND"]], 1);
var GrepLineKind = /* @__PURE__ */ enumType(proto3, __protoPackage155, "GrepLineKind", [[0, "UNSPECIFIED"], [1, "MATCH"], [2, "CONTEXT"]], 1);
var GeneratedAttributesRevision = /* @__PURE__ */ enumType(proto3, __protoPackage155, "GeneratedAttributesRevision", [[0, "UNSPECIFIED"], [3, "OFF"], [1, "MERGE_BASE"], [2, "HEAD"]], 1);
var FileMode = /* @__PURE__ */ enumType(proto3, __protoPackage155, "FileMode", [[0, "UNSPECIFIED"], [1, "REGULAR"], [2, "EXECUTABLE"], [3, "SYMLINK"], [4, "GITLINK"]], 1);
var ChangeKind = /* @__PURE__ */ enumType(proto3, __protoPackage155, "ChangeKind", [[0, "UNSPECIFIED"], [1, "ADDED"], [2, "DELETED"], [3, "MODIFIED"], [4, "RENAMED"], [5, "COPIED"]], 1);
var ListRefsFilter = /* @__PURE__ */ enumType(proto3, __protoPackage155, "ListRefsFilter", [[0, "UNSPECIFIED"], [1, "ALL"], [2, "BRANCHES"], [3, "TAGS"]], 1);
var GetCommitResponse = class _GetCommitResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitResponse, a, b2);
  }
  static $() {
    return ["GetCommitResponse|1 commit #0", Commit2];
  }
};
var GetBlobResponse = class _GetBlobResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobResponse, a, b2);
  }
  static $() {
    return ["GetBlobResponse|1 blob #0", FileContent];
  }
};
var GetTagResponse = class _GetTagResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTagResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTagResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTagResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTagResponse, a, b2);
  }
  static $() {
    return ["GetTagResponse|1 tag #0", Tag];
  }
};
var GetTreeResponse = class _GetTreeResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTreeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTreeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTreeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTreeResponse, a, b2);
  }
  static $() {
    return ["GetTreeResponse|1 tree #0", Tree];
  }
};
var Tree = class _Tree extends __protoMessage3147 {
  constructor(data) {
    super();
    this.sha = "";
    this.tree = [];
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Tree().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Tree().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Tree().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Tree, a, b2);
  }
  static $() {
    return ["Tree|1 sha 9|2 tree #0*|3 truncated 8", TreeEntry];
  }
};
var TreeEntry = class _TreeEntry extends __protoMessage3147 {
  constructor(data) {
    super();
    this.path = "";
    this.mode = "";
    this.type = "";
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TreeEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TreeEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TreeEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TreeEntry, a, b2);
  }
  static $() {
    return ["TreeEntry|1 path 9|2 mode 9|3 type 9|4 sha 9|5 size 4?"];
  }
};
var Tag = class _Tag extends __protoMessage3147 {
  constructor(data) {
    super();
    this.sha = "";
    this.name = "";
    this.message = "";
    this.objectSha = "";
    this.objectType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Tag().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Tag().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Tag().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Tag, a, b2);
  }
  static $() {
    return ["Tag|1 sha 9|2 name 9|3 message 9|4 tagger #0|5 object_sha 9|6 object_type 9", Signature];
  }
};
var LookupCommitsResponse = class _LookupCommitsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.commits = [];
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LookupCommitsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LookupCommitsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LookupCommitsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LookupCommitsResponse, a, b2);
  }
  static $() {
    return ["LookupCommitsResponse|1 commits #0*|2 truncated 8", Commit2];
  }
};
var ListCommitsInRangeResponse = class _ListCommitsInRangeResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.commits = [];
    this.baseCommitSha = "";
    this.headCommitSha = "";
    this.mergeBaseCommitSha = "";
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCommitsInRangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCommitsInRangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCommitsInRangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCommitsInRangeResponse, a, b2);
  }
  static $() {
    return ["ListCommitsInRangeResponse|1 commits #0*|2 base_commit_sha 9|3 head_commit_sha 9|4 merge_base_commit_sha 9|5 truncated 8", Commit2];
  }
};
var CompareCommitsResponse = class _CompareCommitsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.status = CompareCommitsStatus.UNSPECIFIED;
    this.aheadBy = 0;
    this.behindBy = 0;
    this.baseCommitSha = "";
    this.headCommitSha = "";
    this.mergeBaseCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CompareCommitsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CompareCommitsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CompareCommitsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CompareCommitsResponse, a, b2);
  }
  static $() {
    return ["CompareCommitsResponse|1 status #0|2 ahead_by 5|3 behind_by 5|4 base_commit_sha 9|5 head_commit_sha 9|6 merge_base_commit_sha 9", CompareCommitsStatus];
  }
};
var CanMergeResponse = class _CanMergeResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.canMergeWithoutConflicts = false;
    this.conflictedPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CanMergeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CanMergeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CanMergeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CanMergeResponse, a, b2);
  }
  static $() {
    return ["CanMergeResponse|1 can_merge_without_conflicts 8|2 merged_tree_sha 12?|3 conflicted_paths 9*"];
  }
};
var CommitFileUpsert = class _CommitFileUpsert extends __protoMessage3147 {
  constructor(data) {
    super();
    this.content = new Uint8Array(0);
    this.mode = CommitFileMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitFileUpsert().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitFileUpsert().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitFileUpsert().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitFileUpsert, a, b2);
  }
  static $() {
    return ["CommitFileUpsert|1 content 12|2 mode #0", CommitFileMode];
  }
};
var CommitFileDelete = class _CommitFileDelete extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitFileDelete().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitFileDelete().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitFileDelete().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitFileDelete, a, b2);
  }
  static $() {
    return ["CommitFileDelete"];
  }
};
var CommitFileOperation = class _CommitFileOperation extends __protoMessage3147 {
  constructor(data) {
    super();
    this.path = "";
    this.operation = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitFileOperation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitFileOperation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitFileOperation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitFileOperation, a, b2);
  }
  static $() {
    return ["CommitFileOperation|1 path 9|2 upsert #0 operation|3 delete #1 operation", CommitFileUpsert, CommitFileDelete];
  }
};
var Commit2 = class _Commit extends __protoMessage3147 {
  constructor(data) {
    super();
    this.sha = "";
    this.message = "";
    this.parentShas = [];
    this.treeSha = "";
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
    return ["Commit|1 sha 9|2 message 9|3 author #0|4 committer #0|5 parent_shas 9*|7 tree_sha 9|8 change_id 9?", Signature];
  }
};
var Signature = class _Signature extends __protoMessage3147 {
  constructor(data) {
    super();
    this.name = "";
    this.email = "";
    this.timestamp = protoInt64.zero;
    this.timezoneOffset = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Signature().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Signature().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Signature().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Signature, a, b2);
  }
  static $() {
    return ["Signature|1 name 9|2 email 9|3 timestamp 3|4 timezone_offset 5"];
  }
};
var PathIdentifier = class _PathIdentifier extends __protoMessage3147 {
  constructor(data) {
    super();
    this.revision = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PathIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PathIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PathIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PathIdentifier, a, b2);
  }
  static $() {
    return ["PathIdentifier|1 revision 9|2 path 9"];
  }
};
var FileContent = class _FileContent extends __protoMessage3147 {
  constructor(data) {
    super();
    this.size = "";
    this.encoding = "";
    this.content = "";
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FileContent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FileContent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FileContent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FileContent, a, b2);
  }
  static $() {
    return ["FileContent|1 size 9|2 encoding 9|3 content 9|4 sha 9"];
  }
};
var DirectoryContent = class _DirectoryContent extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DirectoryContent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DirectoryContent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DirectoryContent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DirectoryContent, a, b2);
  }
  static $() {
    return ["DirectoryContent|1 entries #0*|2 sha 9", RepoContentEntry];
  }
};
var ResolveRefPathResponse = class _ResolveRefPathResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.resolvedCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveRefPathResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveRefPathResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveRefPathResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveRefPathResponse, a, b2);
  }
  static $() {
    return ["ResolveRefPathResponse|1 path_identifier #0|2 resolved_commit_sha 9", PathIdentifier];
  }
};
var GetRepoContentResponse = class _GetRepoContentResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.content = { case: void 0 };
    this.resolvedCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoContentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoContentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoContentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoContentResponse, a, b2);
  }
  static $() {
    return ["GetRepoContentResponse|1 file_content #0 content|2 directory_content #1 content|3 path_identifier #2|4 resolved_commit_sha 9", FileContent, DirectoryContent, PathIdentifier];
  }
};
var BatchRepoContentResult = class _BatchRepoContentResult extends __protoMessage3147 {
  constructor(data) {
    super();
    this.path = "";
    this.found = false;
    this.content = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchRepoContentResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchRepoContentResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchRepoContentResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchRepoContentResult, a, b2);
  }
  static $() {
    return ["BatchRepoContentResult|1 path 9|2 found 8|3 file_content #0 content|4 directory_content #1 content", FileContent, DirectoryContent];
  }
};
var BatchGetRepoContentResponse = class _BatchGetRepoContentResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.results = [];
    this.resolvedCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetRepoContentResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetRepoContentResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetRepoContentResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetRepoContentResponse, a, b2);
  }
  static $() {
    return ["BatchGetRepoContentResponse|1 results #0*|2 resolved_commit_sha 9", BatchRepoContentResult];
  }
};
var RepoContentDetails = class _RepoContentDetails extends __protoMessage3147 {
  constructor(data) {
    super();
    this.type = "";
    this.isBinary = false;
    this.tooLargeToIntrospect = false;
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoContentDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoContentDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoContentDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoContentDetails, a, b2);
  }
  static $() {
    return ["RepoContentDetails|1 type 9|2 size 4?|3 is_binary 8|4 too_large_to_introspect 8|5 sha 9"];
  }
};
var GetRepoContentDetailsResponse = class _GetRepoContentDetailsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.resolvedCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoContentDetailsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoContentDetailsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoContentDetailsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoContentDetailsResponse, a, b2);
  }
  static $() {
    return ["GetRepoContentDetailsResponse|1 details #0?|2 path_identifier #1|3 resolved_commit_sha 9", RepoContentDetails, PathIdentifier];
  }
};
var GetFileHistoryResponse = class _GetFileHistoryResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.commits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryResponse, a, b2);
  }
  static $() {
    return ["GetFileHistoryResponse|1 commits #0*", ShortCommit];
  }
};
var FileHistoryCommitEntry = class _FileHistoryCommitEntry extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FileHistoryCommitEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FileHistoryCommitEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FileHistoryCommitEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FileHistoryCommitEntry, a, b2);
  }
  static $() {
    return ["FileHistoryCommitEntry|1 commit #0|2 diff_base_commit_sha 9?|8 path_stats #1?", ShortCommit, FileStats];
  }
};
var GetFileHistoryPageWithDiffStatsResponse = class _GetFileHistoryPageWithDiffStatsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryPageWithDiffStatsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryPageWithDiffStatsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryPageWithDiffStatsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryPageWithDiffStatsResponse, a, b2);
  }
  static $() {
    return ["GetFileHistoryPageWithDiffStatsResponse|1 entries #0*|2 has_more 8|3 next_cursor 9?", FileHistoryCommitEntry];
  }
};
var BlameLineRange = class _BlameLineRange extends __protoMessage3147 {
  constructor(data) {
    super();
    this.commitSha = new Uint8Array(0);
    this.startInBlamedFile = 0;
    this.len = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BlameLineRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BlameLineRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BlameLineRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BlameLineRange, a, b2);
  }
  static $() {
    return ["BlameLineRange|1 commit_sha 12|2 start_in_blamed_file 13|3 len 13"];
  }
};
var BlameChunk = class _BlameChunk extends __protoMessage3147 {
  constructor(data) {
    super();
    this.commits = [];
    this.lineRanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BlameChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BlameChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BlameChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BlameChunk, a, b2);
  }
  static $() {
    return ["BlameChunk|1 commits #0*|2 line_ranges #1*", ShortCommit, BlameLineRange];
  }
};
var TreeEntryBlame = class _TreeEntryBlame extends __protoMessage3147 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TreeEntryBlame().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TreeEntryBlame().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TreeEntryBlame().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TreeEntryBlame, a, b2);
  }
  static $() {
    return ["TreeEntryBlame|1 name 9|2 last_commit #0", ShortCommit];
  }
};
var GetTreeBlameResponse = class _GetTreeBlameResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTreeBlameResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTreeBlameResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTreeBlameResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTreeBlameResponse, a, b2);
  }
  static $() {
    return ["GetTreeBlameResponse|1 entries #0*", TreeEntryBlame];
  }
};
var GetFuzzyPathsResponse = class _GetFuzzyPathsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.paths = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFuzzyPathsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFuzzyPathsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFuzzyPathsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFuzzyPathsResponse, a, b2);
  }
  static $() {
    return ["GetFuzzyPathsResponse|1 paths 9*|2 has_more 8"];
  }
};
var ListTreePathsResponse = class _ListTreePathsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.paths = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListTreePathsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListTreePathsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListTreePathsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListTreePathsResponse, a, b2);
  }
  static $() {
    return ["ListTreePathsResponse|1 paths 9*|2 has_more 8"];
  }
};
var GrepSearchOptions = class _GrepSearchOptions extends __protoMessage3147 {
  constructor(data) {
    super();
    this.literal = false;
    this.caseInsensitive = false;
    this.wholeWord = false;
    this.contextBefore = 0;
    this.contextAfter = 0;
    this.includes = [];
    this.excludes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrepSearchOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrepSearchOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrepSearchOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrepSearchOptions, a, b2);
  }
  static $() {
    return ["GrepSearchOptions|1 literal 8|2 case_insensitive 8|3 whole_word 8|4 context_before 13|5 context_after 13|6 max_lines 4?|7 filter_path 9?|8 includes 9*|9 excludes 9*"];
  }
};
var GrepSubmatch = class _GrepSubmatch extends __protoMessage3147 {
  constructor(data) {
    super();
    this.start = 0;
    this.end = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrepSubmatch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrepSubmatch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrepSubmatch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrepSubmatch, a, b2);
  }
  static $() {
    return ["GrepSubmatch|1 start 13|2 end 13"];
  }
};
var GrepMatch = class _GrepMatch extends __protoMessage3147 {
  constructor(data) {
    super();
    this.path = "";
    this.lines = "";
    this.lineNumber = 0;
    this.absoluteOffset = protoInt64.zero;
    this.submatches = [];
    this.kind = GrepLineKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrepMatch().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrepMatch().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrepMatch().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrepMatch, a, b2);
  }
  static $() {
    return ["GrepMatch|1 path 9|2 lines 9|3 line_number 13|4 absolute_offset 4|5 submatches #0*|6 kind #1", GrepSubmatch, GrepLineKind];
  }
};
var GrepRepoChunk = class _GrepRepoChunk extends __protoMessage3147 {
  constructor(data) {
    super();
    this.matches = [];
    this.limitHit = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrepRepoChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrepRepoChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrepRepoChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrepRepoChunk, a, b2);
  }
  static $() {
    return ["GrepRepoChunk|1 matches #0*|2 limit_hit 8", GrepMatch];
  }
};
var ShortCommit = class _ShortCommit extends __protoMessage3147 {
  constructor(data) {
    super();
    this.sha = new Uint8Array(0);
    this.summary = "";
    this.authorName = "";
    this.authorEmail = "";
    this.timestamp = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ShortCommit().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ShortCommit().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ShortCommit().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ShortCommit, a, b2);
  }
  static $() {
    return ["ShortCommit|1 sha 12|2 summary 9|3 author_name 9|4 author_email 9|5 timestamp 3"];
  }
};
var RepoContentEntry = class _RepoContentEntry extends __protoMessage3147 {
  constructor(data) {
    super();
    this.type = "";
    this.name = "";
    this.path = "";
    this.sha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoContentEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoContentEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoContentEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoContentEntry, a, b2);
  }
  static $() {
    return ["RepoContentEntry|1 type 9|2 name 9|3 path 9|4 sha 9|5 size 4?"];
  }
};
var PullRequestDiffChunk = class _PullRequestDiffChunk extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PullRequestDiffChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PullRequestDiffChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PullRequestDiffChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PullRequestDiffChunk, a, b2);
  }
  static $() {
    return ["PullRequestDiffChunk|1 header #0?|3 entries #1*", DiffHeader, DiffEntry];
  }
};
var CommitDiffHeader = class _CommitDiffHeader extends __protoMessage3147 {
  constructor(data) {
    super();
    this.hasMore = false;
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiffHeader().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiffHeader().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiffHeader().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiffHeader, a, b2);
  }
  static $() {
    return ["CommitDiffHeader|1 commit #0|2 base_commit_sha 9?|3 stats #1|5 has_more 8|6 next_page_cursor 9?|7 entries #2*", Commit2, CommitDiffStats, DiffEntry];
  }
};
var CommitDiffChunk = class _CommitDiffChunk extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiffChunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiffChunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiffChunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiffChunk, a, b2);
  }
  static $() {
    return ["CommitDiffChunk|1 header #0?|3 entries #1*", CommitDiffHeader, DiffEntry];
  }
};
var CommitDiff2Header = class _CommitDiff2Header extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiff2Header().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiff2Header().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiff2Header().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiff2Header, a, b2);
  }
  static $() {
    return ["CommitDiff2Header|1 commit #0|2 base_commit_sha 9?|3 entries #1*", Commit2, DiffEntry];
  }
};
var CommitDiff2Entry = class _CommitDiff2Entry extends __protoMessage3147 {
  constructor(data) {
    super();
    this.headerIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiff2Entry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiff2Entry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiff2Entry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiff2Entry, a, b2);
  }
  static $() {
    return ["CommitDiff2Entry|1 header_index 13|2 stats #0|3 patch 9?", FileStats];
  }
};
var CommitDiff2Chunk = class _CommitDiff2Chunk extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiff2Chunk().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiff2Chunk().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiff2Chunk().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiff2Chunk, a, b2);
  }
  static $() {
    return ["CommitDiff2Chunk|1 header #0?|2 entries #1*|3 trailer #2?", CommitDiff2Header, CommitDiff2Entry, CommitDiffStats];
  }
};
var GetCommitChangedPathsResponse = class _GetCommitChangedPathsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitChangedPathsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitChangedPathsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitChangedPathsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitChangedPathsResponse, a, b2);
  }
  static $() {
    return ["GetCommitChangedPathsResponse|1 base_commit_sha 9?|2 entries #0*", DiffEntry];
  }
};
var GetCommitDiffStatsResponse = class _GetCommitDiffStatsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitDiffStatsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitDiffStatsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitDiffStatsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitDiffStatsResponse, a, b2);
  }
  static $() {
    return ["GetCommitDiffStatsResponse|1 base_commit_sha 9?|2 stats #0", CommitDiffStats];
  }
};
var DiffHeader = class _DiffHeader extends __protoMessage3147 {
  constructor(data) {
    super();
    this.mergeBaseCommitSha = "";
    this.hasMore = false;
    this.entries = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffHeader().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffHeader().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffHeader().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffHeader, a, b2);
  }
  static $() {
    return ["DiffHeader|1 merge_base_commit_sha 9|4 has_more 8|5 next_page_cursor 9?|6 entries #0*", DiffEntry];
  }
};
var FileStats = class _FileStats extends __protoMessage3147 {
  constructor(data) {
    super();
    this.additions = 0;
    this.deletions = 0;
    this.isBinary = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FileStats().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FileStats().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FileStats().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FileStats, a, b2);
  }
  static $() {
    return ["FileStats|1 additions 5|2 deletions 5|3 is_binary 8"];
  }
};
var DiffEntry = class _DiffEntry extends __protoMessage3147 {
  constructor(data) {
    super();
    this.path = "";
    this.changeKind = ChangeKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DiffEntry().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DiffEntry().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DiffEntry().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DiffEntry, a, b2);
  }
  static $() {
    return ["DiffEntry|1 path 9|2 old_path 9?|3 change_kind #0|4 old_mode #1?|5 new_mode #1?|6 old_sha 9?|7 new_sha 9?|8 stats #2?|9 patch 9?|10 is_generated 8?", ChangeKind, FileMode, FileStats];
  }
};
var CommitDiffStats = class _CommitDiffStats extends __protoMessage3147 {
  constructor(data) {
    super();
    this.filesChanged = 0;
    this.additions = 0;
    this.deletions = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CommitDiffStats().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CommitDiffStats().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CommitDiffStats().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CommitDiffStats, a, b2);
  }
  static $() {
    return ["CommitDiffStats|1 files_changed 13|2 additions 5|3 deletions 5"];
  }
};
var RefInfo = class _RefInfo extends __protoMessage3147 {
  constructor(data) {
    super();
    this.name = "";
    this.targetSha = "";
    this.objectSha = "";
    this.objectType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefInfo, a, b2);
  }
  static $() {
    return ["RefInfo|1 name 9|2 target_sha 9|3 object_sha 9|4 object_type 9"];
  }
};
var ListRefsResponse = class _ListRefsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.refs = [];
    this.refInfos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRefsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRefsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRefsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRefsResponse, a, b2);
  }
  static $() {
    return ["ListRefsResponse|1 refs 9*|2 ref_infos #0*|5 next_page_token 9?", RefInfo];
  }
};
var SearchRefsResponse = class _SearchRefsResponse extends __protoMessage3147 {
  constructor(data) {
    super();
    this.refInfos = [];
    this.exactMatch = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchRefsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchRefsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchRefsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchRefsResponse, a, b2);
  }
  static $() {
    return ["SearchRefsResponse|1 ref_infos #0*|2 exact_match 8", RefInfo];
  }
};
