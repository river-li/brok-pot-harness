init_esm();
init_compact();
var __protoPackage166 = "origin.v1.";
var __protoMessage3158 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage166;
  }
};
var ActorWithDisplay = class _ActorWithDisplay extends __protoMessage3158 {
  constructor(data) {
    super();
    this.id = "";
    this.kind = "";
    this.displayName = "";
    this.avatarUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ActorWithDisplay().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ActorWithDisplay().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ActorWithDisplay().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ActorWithDisplay, a, b2);
  }
  static $() {
    return ["ActorWithDisplay|1 id 9|2 kind 9|3 display_name 9|4 avatar_url 9|6 owner #0", _ActorWithDisplay];
  }
};
