var __protoPackage28, __protoMessage328, RerankerAlgorithm, DatabaseProvider, RechunkerChoice, QueryOnlyRepoAccess, CodeResult, FileResult, RepositoryInfo, NodeResult, ReflectionResult, SearchRepositoryDeepContextResponse;
var init_repository_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/repository_pb.js"() {
    "use strict";
    init_esm13();
    init_utils_pb2();
    init_symbolic_context_pb();
    init_compact();
    __protoPackage28 = "aiserver.v1.";
    __protoMessage328 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage28;
      }
    };
    RerankerAlgorithm = /* @__PURE__ */ enumType2(proto3, __protoPackage28, "RerankerAlgorithm", [[0, "UNSPECIFIED"], [1, "LULEA"], [2, "UMEA"], [3, "NONE"], [4, "LLAMA"], [5, "STARCODER_V1"], [6, "GPT_3_5_LOGPROBS"], [7, "LULEA_HAIKU"], [8, "COHERE"], [9, "VOYAGE"], [10, "VOYAGE_EMBEDS"], [11, "IDENTITY"], [12, "ADA_EMBEDS"]], 1);
    DatabaseProvider = /* @__PURE__ */ enumType2(proto3, __protoPackage28, "DatabaseProvider", [[0, "UNSPECIFIED"], [1, "AURORA"], [2, "PLANETSCALE"]], 1);
    RechunkerChoice = /* @__PURE__ */ enumType2(proto3, __protoPackage28, "RechunkerChoice", [[0, "RECHUNKER_CHOICE_UNSPECIFIED"], [1, "RECHUNKER_CHOICE_IDENTITY"], [2, "RECHUNKER_CHOICE_600_TOKS"], [3, "RECHUNKER_CHOICE_2400_TOKS"], [4, "RECHUNKER_CHOICE_4000_TOKS"]]);
    QueryOnlyRepoAccess = class _QueryOnlyRepoAccess extends __protoMessage328 {
      constructor(data) {
        super();
        this.ownerAuthId = "";
        this.accessToken = "";
        this.userRepoOwner = "";
        this.userRepoName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _QueryOnlyRepoAccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _QueryOnlyRepoAccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _QueryOnlyRepoAccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_QueryOnlyRepoAccess, a, b2);
      }
      static $() {
        return ["QueryOnlyRepoAccess|1 owner_auth_id 9|2 access_token 9|3 user_repo_owner 9|4 user_repo_name 9"];
      }
    };
    CodeResult = class _CodeResult extends __protoMessage328 {
      constructor(data) {
        super();
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeResult, a, b2);
      }
      static $() {
        return ["CodeResult|1 code_block #0|2 score 2", CodeBlock];
      }
    };
    FileResult = class _FileResult extends __protoMessage328 {
      constructor(data) {
        super();
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileResult, a, b2);
      }
      static $() {
        return ["FileResult|1 file #0|2 score 2", File2];
      }
    };
    RepositoryInfo = class _RepositoryInfo extends __protoMessage328 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.remoteUrls = [];
        this.remoteNames = [];
        this.repoName = "";
        this.repoOwner = "";
        this.isTracked = false;
        this.isLocal = false;
        this.workspaceUri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RepositoryInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RepositoryInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RepositoryInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RepositoryInfo, a, b2);
      }
      static $() {
        return ["RepositoryInfo|1 relative_workspace_path 9|2 remote_urls 9*|3 remote_names 9*|4 repo_name 9|5 repo_owner 9|6 is_tracked 8|7 is_local 8|8 num_files 5?|9 orthogonal_transform_seed 1?|10 preferred_embedding_model #0?|11 workspace_uri 9|12 preferred_db_provider #1?", EmbeddingModel, DatabaseProvider];
      }
    };
    NodeResult = class _NodeResult extends __protoMessage328 {
      constructor(data) {
        super();
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NodeResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NodeResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NodeResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NodeResult, a, b2);
      }
      static $() {
        return ["NodeResult|1 node #0|2 file #1|3 score 2", IndexFileData_NodeData, File2];
      }
    };
    ReflectionResult = class _ReflectionResult extends __protoMessage328 {
      constructor(data) {
        super();
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReflectionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReflectionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReflectionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReflectionResult, a, b2);
      }
      static $() {
        return ["ReflectionResult|1 reflection #0|2 score 2", ReflectionData];
      }
    };
    SearchRepositoryDeepContextResponse = class _SearchRepositoryDeepContextResponse extends __protoMessage328 {
      constructor(data) {
        super();
        this.topNodes = [];
        this.reflections = [];
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchRepositoryDeepContextResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchRepositoryDeepContextResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchRepositoryDeepContextResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchRepositoryDeepContextResponse, a, b2);
      }
      static $() {
        return ["SearchRepositoryDeepContextResponse|1 top_nodes #0*|2 reflections #1*|3 index_id 9", NodeResult, ReflectionResult];
      }
    };
  }
});
