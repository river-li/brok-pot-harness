var __protoPackage26, __protoMessage326, CreateExperimentalIndexRequest, CreateExperimentalIndexResponse, ListExperimentalIndexFilesRequest, ListExperimentalIndexFilesResponse, ListenExperimentalIndexRequest, ListenExperimentalIndexResponse, ListenExperimentalIndexResponse_ReadyItem, ListenExperimentalIndexResponse_RegisterItem, ListenExperimentalIndexResponse_ChooseItem, ListenExperimentalIndexResponse_SummarizeItem, ListenExperimentalIndexResponse_ErrorItem, RegisterFileToIndexRequest, RegisterFileToIndexResponse, SetupIndexDependenciesRequest, SetupIndexDependenciesResponse, ComputeIndexTopoSortRequest, ComputeIndexTopoSortResponse, ChooseCodeReferencesRequest, ChooseCodeReferencesRequest_FileRequest, ChooseCodeReferencesRequest_NodeRequest, ChooseCodeReferencesResponse, ChooseCodeReferencesResponse_NodeResponse, ChooseCodeReferencesResponse_FileResponse, RegisterCodeReferencesRequest, RegisterCodeReferencesResponse, SummarizeWithReferencesRequest, SummarizeWithReferencesResponse, SummarizeWithReferencesResponse_Success, SummarizeWithReferencesResponse_Dependency, RequestReceivedResponse, ReflectionData, IndexFileData, IndexFileData_NodeData, SerializedContextNode, URIResolutionAttempt, URIResolutionResult, ExtractPathsRequest, ExtractPathsResponse, SymbolActionResults, SymbolActionResultReference, FileCodeSnippets, CodeSnippet, CodeSymbolWithAction, CodeSymbolWithAction_CodeSymbolAction;
var init_symbolic_context_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/symbolic_context_pb.js"() {
    "use strict";
    init_esm13();
    init_utils_pb2();
    init_compact();
    __protoPackage26 = "aiserver.v1.";
    __protoMessage326 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage26;
      }
    };
    CreateExperimentalIndexRequest = class _CreateExperimentalIndexRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.files = [];
        this.targetDir = "";
        this.repo = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateExperimentalIndexRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateExperimentalIndexRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateExperimentalIndexRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateExperimentalIndexRequest, a, b2);
      }
      static $() {
        return ["CreateExperimentalIndexRequest|1 files 9*|2 target_dir 9|3 repo 9"];
      }
    };
    CreateExperimentalIndexResponse = class _CreateExperimentalIndexResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateExperimentalIndexResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateExperimentalIndexResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateExperimentalIndexResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateExperimentalIndexResponse, a, b2);
      }
      static $() {
        return ["CreateExperimentalIndexResponse|1 index_id 9"];
      }
    };
    ListExperimentalIndexFilesRequest = class _ListExperimentalIndexFilesRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListExperimentalIndexFilesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListExperimentalIndexFilesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListExperimentalIndexFilesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListExperimentalIndexFilesRequest, a, b2);
      }
      static $() {
        return ["ListExperimentalIndexFilesRequest|1 index_id 9"];
      }
    };
    ListExperimentalIndexFilesResponse = class _ListExperimentalIndexFilesResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListExperimentalIndexFilesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListExperimentalIndexFilesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListExperimentalIndexFilesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListExperimentalIndexFilesResponse, a, b2);
      }
      static $() {
        return ["ListExperimentalIndexFilesResponse|1 index_id 9|2 files #0*", IndexFileData];
      }
    };
    ListenExperimentalIndexRequest = class _ListenExperimentalIndexRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexRequest, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexRequest|1 index_id 9"];
      }
    };
    ListenExperimentalIndexResponse = class _ListenExperimentalIndexResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.item = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse|1 index_id 9|2 ready #0 item|3 register #1 item|4 choose #2 item|5 summarize #3 item|6 error #4 item", ListenExperimentalIndexResponse_ReadyItem, ListenExperimentalIndexResponse_RegisterItem, ListenExperimentalIndexResponse_ChooseItem, ListenExperimentalIndexResponse_SummarizeItem, ListenExperimentalIndexResponse_ErrorItem];
      }
    };
    ListenExperimentalIndexResponse_ReadyItem = class _ListenExperimentalIndexResponse_ReadyItem extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse_ReadyItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse_ReadyItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse_ReadyItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse_ReadyItem, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse.ReadyItem|1 index_id 9|2 request #0", ListenExperimentalIndexRequest];
      }
    };
    ListenExperimentalIndexResponse_RegisterItem = class _ListenExperimentalIndexResponse_RegisterItem extends __protoMessage326 {
      constructor(data) {
        super();
        this.reqUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse_RegisterItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse_RegisterItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse_RegisterItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse_RegisterItem, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse.RegisterItem|1 response #0|2 request #1|3 req_uuid 9", RegisterFileToIndexResponse, RegisterFileToIndexRequest];
      }
    };
    ListenExperimentalIndexResponse_ChooseItem = class _ListenExperimentalIndexResponse_ChooseItem extends __protoMessage326 {
      constructor(data) {
        super();
        this.reqUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse_ChooseItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse_ChooseItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse_ChooseItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse_ChooseItem, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse.ChooseItem|1 response #0|2 request #1|3 req_uuid 9", ChooseCodeReferencesResponse, ChooseCodeReferencesRequest];
      }
    };
    ListenExperimentalIndexResponse_SummarizeItem = class _ListenExperimentalIndexResponse_SummarizeItem extends __protoMessage326 {
      constructor(data) {
        super();
        this.reqUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse_SummarizeItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse_SummarizeItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse_SummarizeItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse_SummarizeItem, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse.SummarizeItem|1 response #0|2 request #1|3 req_uuid 9", SummarizeWithReferencesResponse, SummarizeWithReferencesRequest];
      }
    };
    ListenExperimentalIndexResponse_ErrorItem = class _ListenExperimentalIndexResponse_ErrorItem extends __protoMessage326 {
      constructor(data) {
        super();
        this.message = "";
        this.statusCode = 0;
        this.request = { case: void 0 };
        this.reqUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListenExperimentalIndexResponse_ErrorItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListenExperimentalIndexResponse_ErrorItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListenExperimentalIndexResponse_ErrorItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListenExperimentalIndexResponse_ErrorItem, a, b2);
      }
      static $() {
        return ["ListenExperimentalIndexResponse.ErrorItem|1 message 9|2 status_code 5|3 register #0 request|4 choose #1 request|5 summarize #2 request|6 req_uuid 9", RegisterFileToIndexRequest, ChooseCodeReferencesRequest, SummarizeWithReferencesRequest];
      }
    };
    RegisterFileToIndexRequest = class _RegisterFileToIndexRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.workspaceRelativePath = "";
        this.content = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RegisterFileToIndexRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RegisterFileToIndexRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RegisterFileToIndexRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RegisterFileToIndexRequest, a, b2);
      }
      static $() {
        return ["RegisterFileToIndexRequest|1 index_id 9|2 workspace_relative_path 9|3 root_context_node #0|4 content 9*", SerializedContextNode];
      }
    };
    RegisterFileToIndexResponse = class _RegisterFileToIndexResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.fileId = "";
        this.rootContextNodeId = "";
        this.dependencyResolutionAttempts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RegisterFileToIndexResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RegisterFileToIndexResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RegisterFileToIndexResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RegisterFileToIndexResponse, a, b2);
      }
      static $() {
        return ["RegisterFileToIndexResponse|1 file_id 9|2 root_context_node_id 9|3 dependency_resolution_attempts #0*|4 file_data #1", URIResolutionAttempt, IndexFileData];
      }
    };
    SetupIndexDependenciesRequest = class _SetupIndexDependenciesRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.fileId = "";
        this.dependencyResolutionResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupIndexDependenciesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupIndexDependenciesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupIndexDependenciesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupIndexDependenciesRequest, a, b2);
      }
      static $() {
        return ["SetupIndexDependenciesRequest|1 index_id 9|3 file_id 9|2 dependency_resolution_results #0*", URIResolutionResult];
      }
    };
    SetupIndexDependenciesResponse = class _SetupIndexDependenciesResponse extends __protoMessage326 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetupIndexDependenciesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetupIndexDependenciesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetupIndexDependenciesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetupIndexDependenciesResponse, a, b2);
      }
      static $() {
        return ["SetupIndexDependenciesResponse"];
      }
    };
    ComputeIndexTopoSortRequest = class _ComputeIndexTopoSortRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputeIndexTopoSortRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputeIndexTopoSortRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputeIndexTopoSortRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputeIndexTopoSortRequest, a, b2);
      }
      static $() {
        return ["ComputeIndexTopoSortRequest|1 index_id 9"];
      }
    };
    ComputeIndexTopoSortResponse = class _ComputeIndexTopoSortResponse extends __protoMessage326 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputeIndexTopoSortResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputeIndexTopoSortResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputeIndexTopoSortResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputeIndexTopoSortResponse, a, b2);
      }
      static $() {
        return ["ComputeIndexTopoSortResponse"];
      }
    };
    ChooseCodeReferencesRequest = class _ChooseCodeReferencesRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.request = { case: void 0 };
        this.recompute = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesRequest, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesRequest|1 index_id 9|2 file #0 request|3 node #1 request|4 recompute 8", ChooseCodeReferencesRequest_FileRequest, ChooseCodeReferencesRequest_NodeRequest];
      }
    };
    ChooseCodeReferencesRequest_FileRequest = class _ChooseCodeReferencesRequest_FileRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.fileId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesRequest_FileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesRequest_FileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesRequest_FileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesRequest_FileRequest, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesRequest.FileRequest|1 file_id 9"];
      }
    };
    ChooseCodeReferencesRequest_NodeRequest = class _ChooseCodeReferencesRequest_NodeRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.nodeId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesRequest_NodeRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesRequest_NodeRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesRequest_NodeRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesRequest_NodeRequest, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesRequest.NodeRequest|1 node_id 9"];
      }
    };
    ChooseCodeReferencesResponse = class _ChooseCodeReferencesResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.response = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesResponse, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesResponse|1 file #0 response|2 node #1 response", ChooseCodeReferencesResponse_FileResponse, ChooseCodeReferencesResponse_NodeResponse];
      }
    };
    ChooseCodeReferencesResponse_NodeResponse = class _ChooseCodeReferencesResponse_NodeResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.nodeId = "";
        this.actions = [];
        this.skipped = false;
        this.dependencies = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesResponse_NodeResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesResponse_NodeResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesResponse_NodeResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesResponse_NodeResponse, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesResponse.NodeResponse|1 node_id 9|2 actions #0*|3 skipped 8|4 dependencies 9*", CodeSymbolWithAction];
      }
    };
    ChooseCodeReferencesResponse_FileResponse = class _ChooseCodeReferencesResponse_FileResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.fileId = "";
        this.nodeResponses = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChooseCodeReferencesResponse_FileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChooseCodeReferencesResponse_FileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChooseCodeReferencesResponse_FileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChooseCodeReferencesResponse_FileResponse, a, b2);
      }
      static $() {
        return ["ChooseCodeReferencesResponse.FileResponse|1 file_id 9|2 node_responses #0*", ChooseCodeReferencesResponse_NodeResponse];
      }
    };
    RegisterCodeReferencesRequest = class _RegisterCodeReferencesRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.nodeId = "";
        this.references = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RegisterCodeReferencesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RegisterCodeReferencesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RegisterCodeReferencesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RegisterCodeReferencesRequest, a, b2);
      }
      static $() {
        return ["RegisterCodeReferencesRequest|1 node_id 9|2 references #0*", SymbolActionResults];
      }
    };
    RegisterCodeReferencesResponse = class _RegisterCodeReferencesResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.dependencies = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RegisterCodeReferencesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RegisterCodeReferencesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RegisterCodeReferencesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RegisterCodeReferencesResponse, a, b2);
      }
      static $() {
        return ["RegisterCodeReferencesResponse|1 dependencies 9*"];
      }
    };
    SummarizeWithReferencesRequest = class _SummarizeWithReferencesRequest extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.nodeId = "";
        this.recompute = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummarizeWithReferencesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummarizeWithReferencesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummarizeWithReferencesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummarizeWithReferencesRequest, a, b2);
      }
      static $() {
        return ["SummarizeWithReferencesRequest|1 index_id 9|2 node_id 9|3 recompute 8"];
      }
    };
    SummarizeWithReferencesResponse = class _SummarizeWithReferencesResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.response = { case: void 0 };
        this.nodeId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummarizeWithReferencesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummarizeWithReferencesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummarizeWithReferencesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummarizeWithReferencesResponse, a, b2);
      }
      static $() {
        return ["SummarizeWithReferencesResponse|1 success #0 response|2 dependency #1 response|3 node_id 9", SummarizeWithReferencesResponse_Success, SummarizeWithReferencesResponse_Dependency];
      }
    };
    SummarizeWithReferencesResponse_Success = class _SummarizeWithReferencesResponse_Success extends __protoMessage326 {
      constructor(data) {
        super();
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummarizeWithReferencesResponse_Success().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummarizeWithReferencesResponse_Success().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummarizeWithReferencesResponse_Success().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummarizeWithReferencesResponse_Success, a, b2);
      }
      static $() {
        return ["SummarizeWithReferencesResponse.Success|1 summary 9"];
      }
    };
    SummarizeWithReferencesResponse_Dependency = class _SummarizeWithReferencesResponse_Dependency extends __protoMessage326 {
      constructor(data) {
        super();
        this.nodes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummarizeWithReferencesResponse_Dependency().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummarizeWithReferencesResponse_Dependency().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummarizeWithReferencesResponse_Dependency().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummarizeWithReferencesResponse_Dependency, a, b2);
      }
      static $() {
        return ["SummarizeWithReferencesResponse.Dependency|2 nodes 9*"];
      }
    };
    RequestReceivedResponse = class _RequestReceivedResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.reqUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RequestReceivedResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RequestReceivedResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RequestReceivedResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RequestReceivedResponse, a, b2);
      }
      static $() {
        return ["RequestReceivedResponse|1 req_uuid 9"];
      }
    };
    ReflectionData = class _ReflectionData extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.id = "";
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReflectionData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReflectionData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReflectionData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReflectionData, a, b2);
      }
      static $() {
        return ["ReflectionData|1 index_id 9|2 id 9|3 summary 9"];
      }
    };
    IndexFileData = class _IndexFileData extends __protoMessage326 {
      constructor(data) {
        super();
        this.indexId = "";
        this.workspaceRelativePath = "";
        this.stage = "";
        this.order = 0;
        this.nodes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _IndexFileData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _IndexFileData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _IndexFileData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_IndexFileData, a, b2);
      }
      static $() {
        return ["IndexFileData|1 index_id 9|2 workspace_relative_path 9|3 stage 9|4 order 5|5 nodes #0*", IndexFileData_NodeData];
      }
    };
    IndexFileData_NodeData = class _IndexFileData_NodeData extends __protoMessage326 {
      constructor(data) {
        super();
        this.nodeId = "";
        this.stage = "";
        this.content = "";
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _IndexFileData_NodeData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _IndexFileData_NodeData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _IndexFileData_NodeData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_IndexFileData_NodeData, a, b2);
      }
      static $() {
        return ["IndexFileData.NodeData|1 node_id 9|2 stage 9|3 content 9|4 summary 9"];
      }
    };
    SerializedContextNode = class _SerializedContextNode extends __protoMessage326 {
      constructor(data) {
        super();
        this.workspaceRelativePath = "";
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.children = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SerializedContextNode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SerializedContextNode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SerializedContextNode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SerializedContextNode, a, b2);
      }
      static $() {
        return ["SerializedContextNode|1 workspace_relative_path 9|2 start_line_number 5|3 end_line_number 5|4 children #0*|5 node_snippets #1", _SerializedContextNode, FileCodeSnippets];
      }
    };
    URIResolutionAttempt = class _URIResolutionAttempt extends __protoMessage326 {
      constructor(data) {
        super();
        this.workspaceRelativePath = "";
        this.nodeId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _URIResolutionAttempt().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _URIResolutionAttempt().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _URIResolutionAttempt().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_URIResolutionAttempt, a, b2);
      }
      static $() {
        return ["URIResolutionAttempt|1 workspace_relative_path 9|2 node_id 9|3 symbol #0", CodeSymbolWithAction];
      }
    };
    URIResolutionResult = class _URIResolutionResult extends __protoMessage326 {
      constructor(data) {
        super();
        this.resolvedPaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _URIResolutionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _URIResolutionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _URIResolutionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_URIResolutionResult, a, b2);
      }
      static $() {
        return ["URIResolutionResult|1 request #0|2 resolved_paths 9*", URIResolutionAttempt];
      }
    };
    ExtractPathsRequest = class _ExtractPathsRequest extends __protoMessage326 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExtractPathsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExtractPathsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExtractPathsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExtractPathsRequest, a, b2);
      }
      static $() {
        return ["ExtractPathsRequest|1 file_code_snippets #0", FileCodeSnippets];
      }
    };
    ExtractPathsResponse = class _ExtractPathsResponse extends __protoMessage326 {
      constructor(data) {
        super();
        this.paths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExtractPathsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExtractPathsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExtractPathsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExtractPathsResponse, a, b2);
      }
      static $() {
        return ["ExtractPathsResponse|1 paths #0*", CodeSymbolWithAction];
      }
    };
    SymbolActionResults = class _SymbolActionResults extends __protoMessage326 {
      constructor(data) {
        super();
        this.references = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SymbolActionResults().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SymbolActionResults().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SymbolActionResults().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SymbolActionResults, a, b2);
      }
      static $() {
        return ["SymbolActionResults|1 action #0|2 references #1*", CodeSymbolWithAction, SymbolActionResultReference];
      }
    };
    SymbolActionResultReference = class _SymbolActionResultReference extends __protoMessage326 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SymbolActionResultReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SymbolActionResultReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SymbolActionResultReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SymbolActionResultReference, a, b2);
      }
      static $() {
        return ["SymbolActionResultReference|1 range #0|2 reference #1", SimpleRange, FileCodeSnippets];
      }
    };
    FileCodeSnippets = class _FileCodeSnippets extends __protoMessage326 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.totalLines = 0;
        this.snippets = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileCodeSnippets().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileCodeSnippets().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileCodeSnippets().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileCodeSnippets, a, b2);
      }
      static $() {
        return ["FileCodeSnippets|1 relative_workspace_path 9|2 total_lines 5|3 snippets #0*", CodeSnippet];
      }
    };
    CodeSnippet = class _CodeSnippet extends __protoMessage326 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.lines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeSnippet().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeSnippet().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeSnippet().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeSnippet, a, b2);
      }
      static $() {
        return ["CodeSnippet|1 start_line_number 5|2 end_line_number 5|3 lines 9*"];
      }
    };
    CodeSymbolWithAction = class _CodeSymbolWithAction extends __protoMessage326 {
      constructor(data) {
        super();
        this.workspaceRelativePath = "";
        this.lineNumber = 0;
        this.symbolStartColumn = 0;
        this.symbolEndColumn = 0;
        this.action = CodeSymbolWithAction_CodeSymbolAction.UNSPECIFIED;
        this.symbol = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CodeSymbolWithAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CodeSymbolWithAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CodeSymbolWithAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CodeSymbolWithAction, a, b2);
      }
      static $() {
        return ["CodeSymbolWithAction|1 workspace_relative_path 9|2 line_number 5|3 symbol_start_column 5|4 symbol_end_column 5|5 action #0|6 symbol 9", CodeSymbolWithAction_CodeSymbolAction];
      }
    };
    CodeSymbolWithAction_CodeSymbolAction = /* @__PURE__ */ enumType2(proto3, __protoPackage26, "CodeSymbolWithAction.CodeSymbolAction", [[0, "UNSPECIFIED"], [1, "GO_TO_DEFINITION"], [2, "GO_TO_IMPLEMENTATION"], [3, "REFERENCES"]], 1);
  }
});
