/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/atlas_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage177 = "origin.v1.";
var __protoMessage3168 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage177;
  }
};
var AtlasFreshness = /* @__PURE__ */ enumType(proto3, __protoPackage177, "AtlasFreshness", [[0, "UNSPECIFIED"], [1, "EAGER"], [2, "BALANCED"], [3, "RELAXED"], [4, "MANUAL"]], 1);
var GetAtlasNodeRequest = class _GetAtlasNodeRequest extends __protoMessage3168 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtlasNodeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtlasNodeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtlasNodeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtlasNodeRequest, a, b2);
  }
  static $() {
    return ["GetAtlasNodeRequest|1 repo #0|2 path 9", ClientRepoIdentifier];
  }
};
var AtlasNodeLayerContent = class _AtlasNodeLayerContent extends __protoMessage3168 {
  constructor(data) {
    super();
    this.layer = "";
    this.label = "";
    this.contentMarkdown = "";
    this.digestJson = "";
    this.status = "";
    this.lastGenAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AtlasNodeLayerContent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AtlasNodeLayerContent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AtlasNodeLayerContent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AtlasNodeLayerContent, a, b2);
  }
  static $() {
    return ["AtlasNodeLayerContent|1 layer 9|2 label 9|3 content_markdown 9|4 digest_json 9|5 status 9|6 last_gen_at 9"];
  }
};
var GetAtlasNodeResponse = class _GetAtlasNodeResponse extends __protoMessage3168 {
  constructor(data) {
    super();
    this.lastCommit = "";
    this.layers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtlasNodeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtlasNodeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtlasNodeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtlasNodeResponse, a, b2);
  }
  static $() {
    return ["GetAtlasNodeResponse|1 last_commit 9|2 layers #0*", AtlasNodeLayerContent];
  }
};
var AtlasLayerStatus = class _AtlasLayerStatus extends __protoMessage3168 {
  constructor(data) {
    super();
    this.layer = "";
    this.label = "";
    this.enabled = false;
    this.generatedNodes = 0;
    this.pendingNodes = 0;
    this.lastGenAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AtlasLayerStatus().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AtlasLayerStatus().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AtlasLayerStatus().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AtlasLayerStatus, a, b2);
  }
  static $() {
    return ["AtlasLayerStatus|1 layer 9|2 label 9|3 enabled 8|4 generated_nodes 5|5 pending_nodes 5|6 last_gen_at 9"];
  }
};
var GetAtlasRepoStatusRequest = class _GetAtlasRepoStatusRequest extends __protoMessage3168 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtlasRepoStatusRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtlasRepoStatusRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtlasRepoStatusRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtlasRepoStatusRequest, a, b2);
  }
  static $() {
    return ["GetAtlasRepoStatusRequest|1 repo #0", ClientRepoIdentifier];
  }
};
var GetAtlasRepoStatusResponse = class _GetAtlasRepoStatusResponse extends __protoMessage3168 {
  constructor(data) {
    super();
    this.configured = false;
    this.enabled = false;
    this.model = "";
    this.nodeCount = 0;
    this.layers = [];
    this.refreshing = false;
    this.freshness = AtlasFreshness.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAtlasRepoStatusResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAtlasRepoStatusResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAtlasRepoStatusResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAtlasRepoStatusResponse, a, b2);
  }
  static $() {
    return ["GetAtlasRepoStatusResponse|1 configured 8|2 enabled 8|3 model 9|4 node_count 5|5 layers #0*|6 refreshing 8|7 freshness #1", AtlasLayerStatus, AtlasFreshness];
  }
};
var SetAtlasRepoConfigRequest = class _SetAtlasRepoConfigRequest extends __protoMessage3168 {
  constructor(data) {
    super();
    this.enabled = false;
    this.enabledLayers = [];
    this.freshness = AtlasFreshness.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAtlasRepoConfigRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAtlasRepoConfigRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAtlasRepoConfigRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAtlasRepoConfigRequest, a, b2);
  }
  static $() {
    return ["SetAtlasRepoConfigRequest|1 repo #0|2 enabled 8|3 enabled_layers 9*|4 freshness #1", ClientRepoIdentifier, AtlasFreshness];
  }
};
var SetAtlasRepoConfigResponse = class _SetAtlasRepoConfigResponse extends __protoMessage3168 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAtlasRepoConfigResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAtlasRepoConfigResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAtlasRepoConfigResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAtlasRepoConfigResponse, a, b2);
  }
  static $() {
    return ["SetAtlasRepoConfigResponse|1 status #0", GetAtlasRepoStatusResponse];
  }
};
var RefreshAtlasRepoRequest = class _RefreshAtlasRepoRequest extends __protoMessage3168 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshAtlasRepoRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshAtlasRepoRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshAtlasRepoRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshAtlasRepoRequest, a, b2);
  }
  static $() {
    return ["RefreshAtlasRepoRequest|1 repo #0", ClientRepoIdentifier];
  }
};
var RefreshAtlasRepoResponse = class _RefreshAtlasRepoResponse extends __protoMessage3168 {
  constructor(data) {
    super();
    this.headSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RefreshAtlasRepoResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RefreshAtlasRepoResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RefreshAtlasRepoResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RefreshAtlasRepoResponse, a, b2);
  }
  static $() {
    return ["RefreshAtlasRepoResponse|1 head_sha 9"];
  }
};
var ListAtlasNodePathsRequest = class _ListAtlasNodePathsRequest extends __protoMessage3168 {
  constructor(data) {
    super();
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAtlasNodePathsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAtlasNodePathsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAtlasNodePathsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAtlasNodePathsRequest, a, b2);
  }
  static $() {
    return ["ListAtlasNodePathsRequest|1 repo #0|2 page_size 13|3 page_token 9", ClientRepoIdentifier];
  }
};
var ListAtlasNodePathsResponse = class _ListAtlasNodePathsResponse extends __protoMessage3168 {
  constructor(data) {
    super();
    this.paths = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAtlasNodePathsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAtlasNodePathsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAtlasNodePathsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAtlasNodePathsResponse, a, b2);
  }
  static $() {
    return ["ListAtlasNodePathsResponse|1 paths 9*|2 next_page_token 9"];
  }
};

