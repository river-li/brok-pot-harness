init_esm();
init_compact();
var __protoPackage181 = "origin.v1.";
var __protoMessage3172 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage181;
  }
};
var Label = class _Label extends __protoMessage3172 {
  constructor(data) {
    super();
    this.id = "";
    this.repoUuid = "";
    this.name = "";
    this.color = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Label().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Label().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Label().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Label, a, b2);
  }
  static $() {
    return ["Label|1 id 9|2 repo_uuid 9|3 name 9|4 color 9|5 description 9?|6 created_at #0|7 updated_at #0", Timestamp];
  }
};
var CreateLabelRequest = class _CreateLabelRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.name = "";
    this.color = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateLabelRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateLabelRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateLabelRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateLabelRequest, a, b2);
  }
  static $() {
    return ["CreateLabelRequest|1 repo #0|2 name 9|3 color 9|4 description 9?", ClientRepoIdentifier];
  }
};
var CreateLabelResponse = class _CreateLabelResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateLabelResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateLabelResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateLabelResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateLabelResponse, a, b2);
  }
  static $() {
    return ["CreateLabelResponse|1 label #0", Label];
  }
};
var UpdateLabelRequest = class _UpdateLabelRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.labelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateLabelRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateLabelRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateLabelRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateLabelRequest, a, b2);
  }
  static $() {
    return ["UpdateLabelRequest|1 repo #0|2 label_id 9|3 name 9?|4 color 9?|5 description 9?", ClientRepoIdentifier];
  }
};
var UpdateLabelResponse = class _UpdateLabelResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateLabelResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateLabelResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateLabelResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateLabelResponse, a, b2);
  }
  static $() {
    return ["UpdateLabelResponse|1 label #0", Label];
  }
};
var DeleteLabelRequest = class _DeleteLabelRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.labelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteLabelRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteLabelRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteLabelRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteLabelRequest, a, b2);
  }
  static $() {
    return ["DeleteLabelRequest|1 repo #0|2 label_id 9", ClientRepoIdentifier];
  }
};
var DeleteLabelResponse = class _DeleteLabelResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteLabelResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteLabelResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteLabelResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteLabelResponse, a, b2);
  }
  static $() {
    return ["DeleteLabelResponse"];
  }
};
var ListLabelsRequest = class _ListLabelsRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListLabelsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListLabelsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListLabelsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListLabelsRequest, a, b2);
  }
  static $() {
    return ["ListLabelsRequest|1 repo #0|2 cursor 9?|3 limit 5?|4 search_query 9?", ClientRepoIdentifier];
  }
};
var ListLabelsResponse = class _ListLabelsResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    this.labels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListLabelsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListLabelsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListLabelsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListLabelsResponse, a, b2);
  }
  static $() {
    return ["ListLabelsResponse|1 labels #0*|2 next_cursor 9?", Label];
  }
};
var GetLabelByNameRequest = class _GetLabelByNameRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLabelByNameRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLabelByNameRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLabelByNameRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLabelByNameRequest, a, b2);
  }
  static $() {
    return ["GetLabelByNameRequest|1 repo #0|2 name 9", ClientRepoIdentifier];
  }
};
var GetLabelByNameResponse = class _GetLabelByNameResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetLabelByNameResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetLabelByNameResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetLabelByNameResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetLabelByNameResponse, a, b2);
  }
  static $() {
    return ["GetLabelByNameResponse|1 label #0?", Label];
  }
};
var AddLabelToChangeRequest = class _AddLabelToChangeRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.labelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddLabelToChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddLabelToChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddLabelToChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddLabelToChangeRequest, a, b2);
  }
  static $() {
    return ["AddLabelToChangeRequest|1 change #0|2 label_id 9", ChangeIdentifier];
  }
};
var AddLabelToChangeResponse = class _AddLabelToChangeResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddLabelToChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddLabelToChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddLabelToChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddLabelToChangeResponse, a, b2);
  }
  static $() {
    return ["AddLabelToChangeResponse"];
  }
};
var RemoveLabelFromChangeRequest = class _RemoveLabelFromChangeRequest extends __protoMessage3172 {
  constructor(data) {
    super();
    this.labelId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveLabelFromChangeRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveLabelFromChangeRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveLabelFromChangeRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveLabelFromChangeRequest, a, b2);
  }
  static $() {
    return ["RemoveLabelFromChangeRequest|1 change #0|2 label_id 9", ChangeIdentifier];
  }
};
var RemoveLabelFromChangeResponse = class _RemoveLabelFromChangeResponse extends __protoMessage3172 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RemoveLabelFromChangeResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RemoveLabelFromChangeResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RemoveLabelFromChangeResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RemoveLabelFromChangeResponse, a, b2);
  }
  static $() {
    return ["RemoveLabelFromChangeResponse"];
  }
};
