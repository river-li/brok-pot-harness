/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/origin_common_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage156 = "origin.v1.";
var __protoMessage3148 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage156;
  }
};
var ClientRepoIdentifier = class _ClientRepoIdentifier extends __protoMessage3148 {
  constructor(data) {
    super();
    this.org = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ClientRepoIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ClientRepoIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ClientRepoIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ClientRepoIdentifier, a, b2);
  }
  static $() {
    return ["ClientRepoIdentifier|1 org 9|2 name 9"];
  }
};
var GithubRepoIdentifier = class _GithubRepoIdentifier extends __protoMessage3148 {
  constructor(data) {
    super();
    this.owner = "";
    this.repo = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GithubRepoIdentifier().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GithubRepoIdentifier().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GithubRepoIdentifier().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GithubRepoIdentifier, a, b2);
  }
  static $() {
    return ["GithubRepoIdentifier|1 owner 9|2 repo 9|3 enterprise_id 9?"];
  }
};

