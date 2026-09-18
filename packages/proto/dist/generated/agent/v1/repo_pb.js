var __protoPackage90, __protoMessage386, RepositoryIndexingInfo;
var init_repo_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/repo_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage90 = "agent.v1.";
    __protoMessage386 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage90;
      }
    };
    RepositoryIndexingInfo = class _RepositoryIndexingInfo extends __protoMessage386 {
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
        this.pathEncryptionKey = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RepositoryIndexingInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RepositoryIndexingInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RepositoryIndexingInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RepositoryIndexingInfo, a, b2);
      }
      static $() {
        return ["RepositoryIndexingInfo|1 relative_workspace_path 9|2 remote_urls 9*|3 remote_names 9*|4 repo_name 9|5 repo_owner 9|6 is_tracked 8|7 is_local 8|8 orthogonal_transform_seed 1?|9 workspace_uri 9|10 path_encryption_key 9"];
      }
    };
  }
});
