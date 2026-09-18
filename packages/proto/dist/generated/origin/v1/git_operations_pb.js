init_compact();
var __protoPackage157 = "origin.v1.";
var __protoMessage3149 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage157;
  }
};
var ResolveRepoPathClientRequest = class _ResolveRepoPathClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.refPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveRepoPathClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveRepoPathClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveRepoPathClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveRepoPathClientRequest, a, b2);
  }
  static $() {
    return ["ResolveRepoPathClientRequest|1 identifier #0|2 ref_path 9", ClientRepoIdentifier];
  }
};
var GetRepoContentClientRequest = class _GetRepoContentClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.refPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoContentClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoContentClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoContentClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoContentClientRequest, a, b2);
  }
  static $() {
    return ["GetRepoContentClientRequest|1 identifier #0|2 ref_path 9", ClientRepoIdentifier];
  }
};
var MintRawRepoFileLinkClientRequest = class _MintRawRepoFileLinkClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.refPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintRawRepoFileLinkClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintRawRepoFileLinkClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintRawRepoFileLinkClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintRawRepoFileLinkClientRequest, a, b2);
  }
  static $() {
    return ["MintRawRepoFileLinkClientRequest|1 identifier #0|2 ref_path 9", ClientRepoIdentifier];
  }
};
var MintRawRepoFileLinkClientResponse = class _MintRawRepoFileLinkClientResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.token = "";
    this.rawOrigin = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MintRawRepoFileLinkClientResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MintRawRepoFileLinkClientResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MintRawRepoFileLinkClientResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MintRawRepoFileLinkClientResponse, a, b2);
  }
  static $() {
    return ["MintRawRepoFileLinkClientResponse|1 token 9|2 path_identifier #0|3 raw_origin 9", PathIdentifier];
  }
};
var GetRepoTarballClientRequest = class _GetRepoTarballClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.ref = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoTarballClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoTarballClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoTarballClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoTarballClientRequest, a, b2);
  }
  static $() {
    return ["GetRepoTarballClientRequest|1 identifier #0|2 ref 9", ClientRepoIdentifier];
  }
};
var GetRepoTarballClientResponse = class _GetRepoTarballClientResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.downloadUrl = "";
    this.sha = "";
    this.filename = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoTarballClientResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoTarballClientResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoTarballClientResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoTarballClientResponse, a, b2);
  }
  static $() {
    return ["GetRepoTarballClientResponse|1 download_url 9|2 sha 9|3 filename 9"];
  }
};
var GetRepoContentAtShaClientRequest = class _GetRepoContentAtShaClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoContentAtShaClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoContentAtShaClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoContentAtShaClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoContentAtShaClientRequest, a, b2);
  }
  static $() {
    return ["GetRepoContentAtShaClientRequest|1 identifier #0|2 path_identifier #1|3 max_file_size 4?", ClientRepoIdentifier, PathIdentifier];
  }
};
var GetRepoContentDetailsAtShaClientRequest = class _GetRepoContentDetailsAtShaClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoContentDetailsAtShaClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoContentDetailsAtShaClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoContentDetailsAtShaClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoContentDetailsAtShaClientRequest, a, b2);
  }
  static $() {
    return ["GetRepoContentDetailsAtShaClientRequest|1 identifier #0|2 path_identifier #1", ClientRepoIdentifier, PathIdentifier];
  }
};
var BatchGetRepoContentAtShaClientRequest = class _BatchGetRepoContentAtShaClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.revision = "";
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _BatchGetRepoContentAtShaClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _BatchGetRepoContentAtShaClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _BatchGetRepoContentAtShaClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_BatchGetRepoContentAtShaClientRequest, a, b2);
  }
  static $() {
    return ["BatchGetRepoContentAtShaClientRequest|1 identifier #0|2 revision 9|3 paths 9*|4 max_file_size 4?", ClientRepoIdentifier];
  }
};
var GetRepoCodeownersClientRequest = class _GetRepoCodeownersClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.baseRef = "";
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoCodeownersClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoCodeownersClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoCodeownersClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoCodeownersClientRequest, a, b2);
  }
  static $() {
    return ["GetRepoCodeownersClientRequest|1 identifier #0|2 base_ref 9|3 paths 9*", ClientRepoIdentifier];
  }
};
var CodeownersOwners = class _CodeownersOwners extends __protoMessage3149 {
  constructor(data) {
    super();
    this.owners = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeownersOwners().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeownersOwners().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeownersOwners().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeownersOwners, a, b2);
  }
  static $() {
    return ["CodeownersOwners|1 owners 9*"];
  }
};
var GetRepoCodeownersResponse = class _GetRepoCodeownersResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.codeownersByPath = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoCodeownersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoCodeownersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoCodeownersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoCodeownersResponse, a, b2);
  }
  static $() {
    return ["GetRepoCodeownersResponse|1 codeowners_by_path 9,#0", CodeownersOwners];
  }
};
var GetCommitClientRequest = class _GetCommitClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitClientRequest, a, b2);
  }
  static $() {
    return ["GetCommitClientRequest|1 identifier #0|2 commit_sha 9", ClientRepoIdentifier];
  }
};
var GetBlobClientRequest = class _GetBlobClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.blobSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlobClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlobClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlobClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlobClientRequest, a, b2);
  }
  static $() {
    return ["GetBlobClientRequest|1 identifier #0|2 blob_sha 9", ClientRepoIdentifier];
  }
};
var GetTagClientRequest = class _GetTagClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.tagSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTagClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTagClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTagClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTagClientRequest, a, b2);
  }
  static $() {
    return ["GetTagClientRequest|1 identifier #0|2 tag_sha 9", ClientRepoIdentifier];
  }
};
var GetTreeClientRequest = class _GetTreeClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.treeSha = "";
    this.recursive = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTreeClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTreeClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTreeClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTreeClientRequest, a, b2);
  }
  static $() {
    return ["GetTreeClientRequest|1 identifier #0|2 tree_sha 9|3 recursive 8", ClientRepoIdentifier];
  }
};
var GetFileHistoryClientRequest = class _GetFileHistoryClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.startCommitSha = "";
    this.maxCommits = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryClientRequest, a, b2);
  }
  static $() {
    return ["GetFileHistoryClientRequest|1 identifier #0|2 start_commit_sha 9|3 path 9?|4 max_commits 13", ClientRepoIdentifier];
  }
};
var GetFileHistoryPageClientRequest = class _GetFileHistoryPageClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.startCommitSha = "";
    this.pageSize = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryPageClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryPageClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryPageClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryPageClientRequest, a, b2);
  }
  static $() {
    return ["GetFileHistoryPageClientRequest|1 identifier #0|2 start_commit_sha 9|3 path 9?|4 page_size 13|5 next_cursor 9?", ClientRepoIdentifier];
  }
};
var GetFileHistoryPageResponse = class _GetFileHistoryPageResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commits = [];
    this.hasMore = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryPageResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryPageResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryPageResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryPageResponse, a, b2);
  }
  static $() {
    return ["GetFileHistoryPageResponse|1 commits #0*|2 has_more 8|3 next_cursor 9?", ShortCommit];
  }
};
var GetFileHistoryPageWithDiffStatsClientRequest = class _GetFileHistoryPageWithDiffStatsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.startCommitSha = "";
    this.pageSize = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFileHistoryPageWithDiffStatsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFileHistoryPageWithDiffStatsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFileHistoryPageWithDiffStatsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFileHistoryPageWithDiffStatsClientRequest, a, b2);
  }
  static $() {
    return ["GetFileHistoryPageWithDiffStatsClientRequest|1 identifier #0|2 start_commit_sha 9|3 path 9?|4 page_size 13|5 next_cursor 9?", ClientRepoIdentifier];
  }
};
var GetBlameClientRequest = class _GetBlameClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.startCommitSha = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetBlameClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetBlameClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetBlameClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetBlameClientRequest, a, b2);
  }
  static $() {
    return ["GetBlameClientRequest|1 identifier #0|2 start_commit_sha 9|3 path 9", ClientRepoIdentifier];
  }
};
var GetTreeBlameClientRequest = class _GetTreeBlameClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.startCommitSha = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetTreeBlameClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetTreeBlameClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetTreeBlameClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetTreeBlameClientRequest, a, b2);
  }
  static $() {
    return ["GetTreeBlameClientRequest|1 identifier #0|2 start_commit_sha 9|3 path 9", ClientRepoIdentifier];
  }
};
var GetFuzzyPathsClientRequest = class _GetFuzzyPathsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.query = "";
    this.limit = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetFuzzyPathsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetFuzzyPathsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetFuzzyPathsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetFuzzyPathsClientRequest, a, b2);
  }
  static $() {
    return ["GetFuzzyPathsClientRequest|1 identifier #0|2 commit_sha 9|3 query 9|4 limit 13", ClientRepoIdentifier];
  }
};
var ListRepoPathsClientRequest = class _ListRepoPathsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.revision = "";
    this.includes = [];
    this.excludes = [];
    this.limit = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoPathsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoPathsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoPathsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoPathsClientRequest, a, b2);
  }
  static $() {
    return ["ListRepoPathsClientRequest|1 identifier #0|2 revision 9|3 includes 9*|4 excludes 9*|5 limit 13", ClientRepoIdentifier];
  }
};
var GrepRepoClientRequest = class _GrepRepoClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.revision = "";
    this.query = "";
    this.maxResults = 0;
    this.maxTotalLines = 0;
    this.priority = GrepPriority.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrepRepoClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrepRepoClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrepRepoClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrepRepoClientRequest, a, b2);
  }
  static $() {
    return ["GrepRepoClientRequest|1 identifier #0|2 revision 9|3 query 9|4 options #1|5 max_results 13|6 max_total_lines 13|7 priority #2", ClientRepoIdentifier, GrepSearchOptions, GrepPriority];
  }
};
var GetPullRequestDiffClientRequest = class _GetPullRequestDiffClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.headCommitSha = "";
    this.baseCommitSha = "";
    this.contextLines = 0;
    this.generatedAttributesRevision = GeneratedAttributesRevision.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetPullRequestDiffClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetPullRequestDiffClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetPullRequestDiffClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetPullRequestDiffClientRequest, a, b2);
  }
  static $() {
    return ["GetPullRequestDiffClientRequest|1 identifier #0|2 head_commit_sha 9|3 base_commit_sha 9|4 include_patches 8?|5 include_file_stats 8?|6 page_size 13?|7 page_cursor 9?|8 context_lines 13|9 generated_attributes_revision #1", ClientRepoIdentifier, GeneratedAttributesRevision];
  }
};
var GetCommitDiffClientRequest = class _GetCommitDiffClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.includePatches = false;
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitDiffClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitDiffClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitDiffClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitDiffClientRequest, a, b2);
  }
  static $() {
    return ["GetCommitDiffClientRequest|1 identifier #0|2 commit_sha 9|3 base_commit_sha 9?|4 include_patches 8|5 paths 9*|6 page_size 13?|7 page_cursor 9?", ClientRepoIdentifier];
  }
};
var GetCommitDiff2ClientRequest = class _GetCommitDiff2ClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.includePatches = false;
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitDiff2ClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitDiff2ClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitDiff2ClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitDiff2ClientRequest, a, b2);
  }
  static $() {
    return ["GetCommitDiff2ClientRequest|1 identifier #0|2 commit_sha 9|3 base_commit_sha 9?|4 include_patches 8|5 paths 9*", ClientRepoIdentifier];
  }
};
var GetCommitChangedPathsClientRequest = class _GetCommitChangedPathsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitChangedPathsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitChangedPathsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitChangedPathsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitChangedPathsClientRequest, a, b2);
  }
  static $() {
    return ["GetCommitChangedPathsClientRequest|1 identifier #0|2 commit_sha 9|3 base_commit_sha 9?", ClientRepoIdentifier];
  }
};
var GetCommitDiffStatsClientRequest = class _GetCommitDiffStatsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCommitDiffStatsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCommitDiffStatsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCommitDiffStatsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCommitDiffStatsClientRequest, a, b2);
  }
  static $() {
    return ["GetCommitDiffStatsClientRequest|1 identifier #0|2 commit_sha 9|3 base_commit_sha 9?", ClientRepoIdentifier];
  }
};
var ListRefsClientRequest = class _ListRefsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.filter = ListRefsFilter.UNSPECIFIED;
    this.namesOnly = false;
    this.prefix = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRefsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRefsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRefsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRefsClientRequest, a, b2);
  }
  static $() {
    return ["ListRefsClientRequest|1 identifier #0|2 filter #1|3 names_only 8|4 prefix 9|5 limit 13?|7 page_token 9?", ClientRepoIdentifier, ListRefsFilter];
  }
};
var SearchRefsClientRequest = class _SearchRefsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.filter = ListRefsFilter.UNSPECIFIED;
    this.query = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SearchRefsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SearchRefsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SearchRefsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SearchRefsClientRequest, a, b2);
  }
  static $() {
    return ["SearchRefsClientRequest|1 identifier #0|2 filter #1|3 query 9|4 limit 13?", ClientRepoIdentifier, ListRefsFilter];
  }
};
var LookupCommitsClientRequest = class _LookupCommitsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.shaPrefix = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LookupCommitsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LookupCommitsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LookupCommitsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LookupCommitsClientRequest, a, b2);
  }
  static $() {
    return ["LookupCommitsClientRequest|1 identifier #0|2 sha_prefix 9|3 limit 13?", ClientRepoIdentifier];
  }
};
var CanMergeClientRequest = class _CanMergeClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.ours = "";
    this.theirs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CanMergeClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CanMergeClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CanMergeClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CanMergeClientRequest, a, b2);
  }
  static $() {
    return ["CanMergeClientRequest|1 identifier #0|2 ours 9|3 theirs 9", ClientRepoIdentifier];
  }
};
var CompareCommitsClientRequest = class _CompareCommitsClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.baseRevision = "";
    this.headRevision = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CompareCommitsClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CompareCommitsClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CompareCommitsClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CompareCommitsClientRequest, a, b2);
  }
  static $() {
    return ["CompareCommitsClientRequest|1 identifier #0|2 base_revision 9|3 head_revision 9", ClientRepoIdentifier];
  }
};
var ListCommitsInRangeClientRequest = class _ListCommitsInRangeClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.baseRevision = "";
    this.headRevision = "";
    this.oldestFirst = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListCommitsInRangeClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListCommitsInRangeClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListCommitsInRangeClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListCommitsInRangeClientRequest, a, b2);
  }
  static $() {
    return ["ListCommitsInRangeClientRequest|1 identifier #0|2 base_revision 9|3 head_revision 9|4 max_commits 5?|5 oldest_first 8", ClientRepoIdentifier];
  }
};
var CreateMergeCommitBypassingChecksClientRequest = class _CreateMergeCommitBypassingChecksClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.oursRef = "";
    this.theirsRef = "";
    this.message = "";
    this.mode = MergeMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateMergeCommitBypassingChecksClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateMergeCommitBypassingChecksClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateMergeCommitBypassingChecksClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateMergeCommitBypassingChecksClientRequest, a, b2);
  }
  static $() {
    return ["CreateMergeCommitBypassingChecksClientRequest|1 identifier #0|2 ours_sha 9?|3 theirs_sha 9?|4 ours_ref 9|5 theirs_ref 9|6 message 9|7 author #1|8 committer #1|9 mode #2", ClientRepoIdentifier, Signature, MergeMode];
  }
};
var CreateMergeCommitBypassingChecksResponse = class _CreateMergeCommitBypassingChecksResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.mergeCommitSha = "";
    this.walEntryKey = "";
    this.reverseMirrorPushFailed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateMergeCommitBypassingChecksResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateMergeCommitBypassingChecksResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateMergeCommitBypassingChecksResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateMergeCommitBypassingChecksResponse, a, b2);
  }
  static $() {
    return ["CreateMergeCommitBypassingChecksResponse|1 merge_commit_sha 9|2 wal_entry_key 9|3 reverse_mirror_push_failed 8"];
  }
};
var CreateCommitFromFilesClientRequest = class _CreateCommitFromFilesClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.branch = "";
    this.message = "";
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCommitFromFilesClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCommitFromFilesClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCommitFromFilesClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCommitFromFilesClientRequest, a, b2);
  }
  static $() {
    return ["CreateCommitFromFilesClientRequest|1 identifier #0|2 branch 9|3 expected_head_sha 9?|4 message 9|5 author #1|6 committer #1?|7 files #2*", ClientRepoIdentifier, Signature, CommitFileOperation];
  }
};
var CreateCommitFromFilesClientResponse = class _CreateCommitFromFilesClientResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.treeSha = "";
    this.oldHeadSha = "";
    this.reverseMirrorPushFailed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateCommitFromFilesClientResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateCommitFromFilesClientResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateCommitFromFilesClientResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateCommitFromFilesClientResponse, a, b2);
  }
  static $() {
    return ["CreateCommitFromFilesClientResponse|1 commit_sha 9|2 tree_sha 9|3 old_head_sha 9|4 reverse_mirror_push_failed 8"];
  }
};
var CollectedFileDiff = class _CollectedFileDiff extends __protoMessage3149 {
  constructor(data) {
    super();
    this.path = "";
    this.changeKind = ChangeKind.UNSPECIFIED;
    this.isBinary = false;
    this.patch = "";
    this.additions = 0;
    this.deletions = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CollectedFileDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CollectedFileDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CollectedFileDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CollectedFileDiff, a, b2);
  }
  static $() {
    return ["CollectedFileDiff|1 path 9|2 old_path 9?|3 change_kind #0|4 is_binary 8|5 patch 9|6 additions 5|7 deletions 5|8 is_generated 8?|9 old_mode #1?|10 new_mode #1?", ChangeKind, FileMode];
  }
};
var GetCollectedPullRequestDiffRequest = class _GetCollectedPullRequestDiffRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.headCommitSha = "";
    this.baseCommitSha = "";
    this.contextLines = 0;
    this.generatedAttributesRevision = GeneratedAttributesRevision.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCollectedPullRequestDiffRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCollectedPullRequestDiffRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCollectedPullRequestDiffRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCollectedPullRequestDiffRequest, a, b2);
  }
  static $() {
    return ["GetCollectedPullRequestDiffRequest|1 identifier #0|2 head_commit_sha 9|3 base_commit_sha 9|4 include_patches 8?|5 include_file_stats 8?|6 page_size 13?|7 page_cursor 9?|8 change_number 4?|9 version_number 4?|10 context_lines 13|11 generated_attributes_revision #1|12 project_latest_version_base 8?", ClientRepoIdentifier, GeneratedAttributesRevision];
  }
};
var GetCollectedPullRequestDiffResponse = class _GetCollectedPullRequestDiffResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.mergeBaseSha = "";
    this.files = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetCollectedPullRequestDiffResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetCollectedPullRequestDiffResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetCollectedPullRequestDiffResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetCollectedPullRequestDiffResponse, a, b2);
  }
  static $() {
    return ["GetCollectedPullRequestDiffResponse|1 merge_base_sha 9|2 files #0*|4 next_page_cursor 9?|5 resolved_head_sha 9?|6 resolved_base_sha 9?|7 resolved_version_number 4?", CollectedFileDiff];
  }
};
var FastForwardBranchClientRequest = class _FastForwardBranchClientRequest extends __protoMessage3149 {
  constructor(data) {
    super();
    this.branch = "";
    this.expectedHeadSha = "";
    this.newHeadSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FastForwardBranchClientRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FastForwardBranchClientRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FastForwardBranchClientRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FastForwardBranchClientRequest, a, b2);
  }
  static $() {
    return ["FastForwardBranchClientRequest|1 identifier #0|2 branch 9|3 expected_head_sha 9|4 new_head_sha 9", ClientRepoIdentifier];
  }
};
var FastForwardBranchClientResponse = class _FastForwardBranchClientResponse extends __protoMessage3149 {
  constructor(data) {
    super();
    this.oldHeadSha = "";
    this.newHeadSha = "";
    this.unchanged = false;
    this.reverseMirrorPushFailed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FastForwardBranchClientResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FastForwardBranchClientResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FastForwardBranchClientResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FastForwardBranchClientResponse, a, b2);
  }
  static $() {
    return ["FastForwardBranchClientResponse|1 old_head_sha 9|2 new_head_sha 9|3 unchanged 8|4 reverse_mirror_push_failed 8"];
  }
};
