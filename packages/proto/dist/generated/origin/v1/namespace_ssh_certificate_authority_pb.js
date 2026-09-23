init_esm();
init_compact();
var __protoPackage160 = "origin.v1.";
var __protoMessage3152 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage160;
  }
};
var NamespaceSshCertificateAuthority = class _NamespaceSshCertificateAuthority extends __protoMessage3152 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.algo = "";
    this.fingerprint = "";
    this.publicKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamespaceSshCertificateAuthority().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamespaceSshCertificateAuthority().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamespaceSshCertificateAuthority().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamespaceSshCertificateAuthority, a, b2);
  }
  static $() {
    return ["NamespaceSshCertificateAuthority|1 id 9|2 name 9|3 algo 9|4 fingerprint 9|5 public_key 9|6 created_at #0", Timestamp];
  }
};
var GetNamespaceSshCertificateAuthoritiesRequest = class _GetNamespaceSshCertificateAuthoritiesRequest extends __protoMessage3152 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetNamespaceSshCertificateAuthoritiesRequest, a, b2);
  }
  static $() {
    return ["GetNamespaceSshCertificateAuthoritiesRequest|1 namespace_slug 9"];
  }
};
var GetNamespaceSshCertificateAuthoritiesResponse = class _GetNamespaceSshCertificateAuthoritiesResponse extends __protoMessage3152 {
  constructor(data) {
    super();
    this.certificateAuthorities = [];
    this.requireCertificates = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetNamespaceSshCertificateAuthoritiesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetNamespaceSshCertificateAuthoritiesResponse, a, b2);
  }
  static $() {
    return ["GetNamespaceSshCertificateAuthoritiesResponse|1 certificate_authorities #0*|2 require_certificates 8", NamespaceSshCertificateAuthority];
  }
};
var AddNamespaceSshCertificateAuthorityRequest = class _AddNamespaceSshCertificateAuthorityRequest extends __protoMessage3152 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.publicKey = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddNamespaceSshCertificateAuthorityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddNamespaceSshCertificateAuthorityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddNamespaceSshCertificateAuthorityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddNamespaceSshCertificateAuthorityRequest, a, b2);
  }
  static $() {
    return ["AddNamespaceSshCertificateAuthorityRequest|1 namespace_slug 9|2 public_key 9|3 name 9"];
  }
};
var AddNamespaceSshCertificateAuthorityResponse = class _AddNamespaceSshCertificateAuthorityResponse extends __protoMessage3152 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddNamespaceSshCertificateAuthorityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddNamespaceSshCertificateAuthorityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddNamespaceSshCertificateAuthorityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddNamespaceSshCertificateAuthorityResponse, a, b2);
  }
  static $() {
    return ["AddNamespaceSshCertificateAuthorityResponse|1 certificate_authority #0", NamespaceSshCertificateAuthority];
  }
};
var RemoveNamespaceSshCertificateAuthorityRequest = class _RemoveNamespaceSshCertificateAuthorityRequest extends __protoMessage3152 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveNamespaceSshCertificateAuthorityRequest, a, b2);
  }
  static $() {
    return ["RemoveNamespaceSshCertificateAuthorityRequest|1 namespace_slug 9|2 id 9"];
  }
};
var RemoveNamespaceSshCertificateAuthorityResponse = class _RemoveNamespaceSshCertificateAuthorityResponse extends __protoMessage3152 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveNamespaceSshCertificateAuthorityResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveNamespaceSshCertificateAuthorityResponse, a, b2);
  }
  static $() {
    return ["RemoveNamespaceSshCertificateAuthorityResponse"];
  }
};
var SetNamespaceSshRequireCertificatesRequest = class _SetNamespaceSshRequireCertificatesRequest extends __protoMessage3152 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.requireCertificates = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceSshRequireCertificatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceSshRequireCertificatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceSshRequireCertificatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceSshRequireCertificatesRequest, a, b2);
  }
  static $() {
    return ["SetNamespaceSshRequireCertificatesRequest|1 namespace_slug 9|2 require_certificates 8"];
  }
};
var SetNamespaceSshRequireCertificatesResponse = class _SetNamespaceSshRequireCertificatesResponse extends __protoMessage3152 {
  constructor(data) {
    super();
    this.requireCertificates = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceSshRequireCertificatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceSshRequireCertificatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceSshRequireCertificatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceSshRequireCertificatesResponse, a, b2);
  }
  static $() {
    return ["SetNamespaceSshRequireCertificatesResponse|1 require_certificates 8"];
  }
};
