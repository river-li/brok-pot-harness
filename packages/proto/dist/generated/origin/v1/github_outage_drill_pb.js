init_esm();
init_compact();
var __protoPackage184 = "origin.v1.";
var __protoMessage3175 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage184;
  }
};
var GithubOutageDrillProbeRequest = class _GithubOutageDrillProbeRequest extends __protoMessage3175 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GithubOutageDrillProbeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GithubOutageDrillProbeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GithubOutageDrillProbeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GithubOutageDrillProbeRequest, a, b2);
  }
  static $() {
    return ["GithubOutageDrillProbeRequest"];
  }
};
var GithubOutageDrillProbeResponse = class _GithubOutageDrillProbeResponse extends __protoMessage3175 {
  constructor(data) {
    super();
    this.intercepted = false;
    this.attemptCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GithubOutageDrillProbeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GithubOutageDrillProbeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GithubOutageDrillProbeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GithubOutageDrillProbeResponse, a, b2);
  }
  static $() {
    return ["GithubOutageDrillProbeResponse|1 intercepted 8|2 attempt_count 13"];
  }
};
