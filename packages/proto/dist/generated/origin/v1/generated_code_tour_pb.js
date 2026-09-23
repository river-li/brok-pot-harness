init_esm();
init_compact();
var __protoPackage172 = "origin.v1.";
var __protoMessage3164 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage172;
  }
};
var GeneratedCodeTourStackMember = class _GeneratedCodeTourStackMember extends __protoMessage3164 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.headSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GeneratedCodeTourStackMember().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GeneratedCodeTourStackMember().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GeneratedCodeTourStackMember().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GeneratedCodeTourStackMember, a, b2);
  }
  static $() {
    return ["GeneratedCodeTourStackMember|1 pr_url 9|2 head_sha 9"];
  }
};
var GeneratedCodeTour = class _GeneratedCodeTour extends __protoMessage3164 {
  constructor(data) {
    super();
    this.id = "";
    this.storageKey = "";
    this.result = "";
    this.machineGenerated = false;
    this.updatedAtMs = protoInt64.zero;
    this.stackId = "";
    this.stackMembers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GeneratedCodeTour().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GeneratedCodeTour().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GeneratedCodeTour().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GeneratedCodeTour, a, b2);
  }
  static $() {
    return ["GeneratedCodeTour|1 id 9|2 storage_key 9|3 result 9|4 agentic_markdown 9?|5 agentic_error_message 9?|6 format_version 13?|7 prompt_revision 13?|8 machine_generated 8|9 updated_at_ms 3|10 stack_id 9|11 stack_members #0*", GeneratedCodeTourStackMember];
  }
};
var GetGeneratedCodeTourRequest = class _GetGeneratedCodeTourRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.storageKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetGeneratedCodeTourRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetGeneratedCodeTourRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetGeneratedCodeTourRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetGeneratedCodeTourRequest, a, b2);
  }
  static $() {
    return ["GetGeneratedCodeTourRequest|1 change #0|2 storage_key 9", ChangeIdentifier];
  }
};
var GetGeneratedCodeTourResponse = class _GetGeneratedCodeTourResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetGeneratedCodeTourResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetGeneratedCodeTourResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetGeneratedCodeTourResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetGeneratedCodeTourResponse, a, b2);
  }
  static $() {
    return ["GetGeneratedCodeTourResponse|1 tour #0?", GeneratedCodeTour];
  }
};
var UpsertGeneratedCodeTourRequest = class _UpsertGeneratedCodeTourRequest extends __protoMessage3164 {
  constructor(data) {
    super();
    this.storageKey = "";
    this.headSha = "";
    this.result = "";
    this.featureConfigurationJson = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertGeneratedCodeTourRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertGeneratedCodeTourRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertGeneratedCodeTourRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertGeneratedCodeTourRequest, a, b2);
  }
  static $() {
    return ["UpsertGeneratedCodeTourRequest|1 change #0|2 storage_key 9|3 head_sha 9|4 result 9|5 agentic_markdown 9?|6 agentic_error_message 9?|7 feature_configuration_json 9", ChangeIdentifier];
  }
};
var UpsertGeneratedCodeTourResponse = class _UpsertGeneratedCodeTourResponse extends __protoMessage3164 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertGeneratedCodeTourResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertGeneratedCodeTourResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertGeneratedCodeTourResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertGeneratedCodeTourResponse, a, b2);
  }
  static $() {
    return ["UpsertGeneratedCodeTourResponse|1 tour #0", GeneratedCodeTour];
  }
};
