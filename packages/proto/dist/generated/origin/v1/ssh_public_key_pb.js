init_esm();
init_compact();
var __protoPackage161 = "origin.v1.";
var __protoMessage3153 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage161;
  }
};
var SshPublicKey = class _SshPublicKey extends __protoMessage3153 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.algo = "";
    this.fingerprint = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SshPublicKey().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SshPublicKey().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SshPublicKey().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SshPublicKey, a, b2);
  }
  static $() {
    return ["SshPublicKey|1 id 9|2 name 9|3 algo 9|4 fingerprint 9|5 created_at #0|6 last_used_at #0", Timestamp];
  }
};
var AddSshPublicKeyRequest = class _AddSshPublicKeyRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    this.publicKey = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddSshPublicKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddSshPublicKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddSshPublicKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddSshPublicKeyRequest, a, b2);
  }
  static $() {
    return ["AddSshPublicKeyRequest|1 public_key 9|2 name 9"];
  }
};
var AddSshPublicKeyResponse = class _AddSshPublicKeyResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddSshPublicKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddSshPublicKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddSshPublicKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddSshPublicKeyResponse, a, b2);
  }
  static $() {
    return ["AddSshPublicKeyResponse|1 ssh_public_key #0", SshPublicKey];
  }
};
var ListSshPublicKeysRequest = class _ListSshPublicKeysRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListSshPublicKeysRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListSshPublicKeysRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListSshPublicKeysRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListSshPublicKeysRequest, a, b2);
  }
  static $() {
    return ["ListSshPublicKeysRequest"];
  }
};
var ListSshPublicKeysResponse = class _ListSshPublicKeysResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    this.sshPublicKeys = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListSshPublicKeysResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListSshPublicKeysResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListSshPublicKeysResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListSshPublicKeysResponse, a, b2);
  }
  static $() {
    return ["ListSshPublicKeysResponse|1 ssh_public_keys #0*", SshPublicKey];
  }
};
var DeleteSshPublicKeyRequest = class _DeleteSshPublicKeyRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteSshPublicKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteSshPublicKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteSshPublicKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteSshPublicKeyRequest, a, b2);
  }
  static $() {
    return ["DeleteSshPublicKeyRequest|1 id 9"];
  }
};
var DeleteSshPublicKeyResponse = class _DeleteSshPublicKeyResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteSshPublicKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteSshPublicKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteSshPublicKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteSshPublicKeyResponse, a, b2);
  }
  static $() {
    return ["DeleteSshPublicKeyResponse"];
  }
};
