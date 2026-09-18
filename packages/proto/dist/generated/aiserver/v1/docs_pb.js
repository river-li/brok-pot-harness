var __protoPackage97, __protoMessage393, DocumentationMetadata, DocumentationChunk, DocumentationQueryRequest, DocumentationQueryResponse, DocumentationQueryResponse_Status;
var init_docs_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/docs_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage97 = "aiserver.v1.";
    __protoMessage393 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage97;
      }
    };
    DocumentationMetadata = class _DocumentationMetadata extends __protoMessage393 {
      constructor(data) {
        super();
        this.prefixUrl = "";
        this.docName = "";
        this.isDifferentPrefixOrigin = false;
        this.truePrefixUrl = "";
        this.public = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentationMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentationMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentationMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentationMetadata, a, b2);
      }
      static $() {
        return ["DocumentationMetadata|1 prefix_url 9|2 doc_name 9|3 is_different_prefix_origin 8|4 true_prefix_url 9|5 public 8|6 team_id 5?"];
      }
    };
    DocumentationChunk = class _DocumentationChunk extends __protoMessage393 {
      constructor(data) {
        super();
        this.docName = "";
        this.pageUrl = "";
        this.documentationChunk = "";
        this.score = 0;
        this.pageTitle = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentationChunk().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentationChunk().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentationChunk().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentationChunk, a, b2);
      }
      static $() {
        return ["DocumentationChunk|1 doc_name 9|2 page_url 9|3 documentation_chunk 9|4 score 2|5 page_title 9"];
      }
    };
    DocumentationQueryRequest = class _DocumentationQueryRequest extends __protoMessage393 {
      constructor(data) {
        super();
        this.docIdentifier = "";
        this.query = "";
        this.topK = 0;
        this.rerankResults = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentationQueryRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentationQueryRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentationQueryRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentationQueryRequest, a, b2);
      }
      static $() {
        return ["DocumentationQueryRequest|1 doc_identifier 9|2 query 9|3 top_k 13|4 rerank_results 8"];
      }
    };
    DocumentationQueryResponse = class _DocumentationQueryResponse extends __protoMessage393 {
      constructor(data) {
        super();
        this.docIdentifier = "";
        this.docName = "";
        this.docChunks = [];
        this.status = DocumentationQueryResponse_Status.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DocumentationQueryResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DocumentationQueryResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DocumentationQueryResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DocumentationQueryResponse, a, b2);
      }
      static $() {
        return ["DocumentationQueryResponse|1 doc_identifier 9|2 doc_name 9|3 doc_chunks #0*|4 status #1", DocumentationChunk, DocumentationQueryResponse_Status];
      }
    };
    DocumentationQueryResponse_Status = /* @__PURE__ */ enumType(proto3, __protoPackage97, "DocumentationQueryResponse.Status", [[0, "UNSPECIFIED"], [1, "NOT_FOUND"], [2, "SUCCESS"], [3, "FAILURE"]], 1);
  }
});
