init_esm();
init_compact();
var __protoPackage168 = "origin.v1.";
var __protoMessage3160 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage168;
  }
};
var MarkFileAsViewedRequest = class _MarkFileAsViewedRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    this.filePath = "";
    this.versionId = "";
    this.headCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkFileAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkFileAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkFileAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkFileAsViewedRequest, a, b2);
  }
  static $() {
    return ["MarkFileAsViewedRequest|1 change #0|2 file_path 9|3 version_id 9|4 head_commit_sha 9", ChangeIdentifier];
  }
};
var MarkFileAsViewedResponse = class _MarkFileAsViewedResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkFileAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkFileAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkFileAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkFileAsViewedResponse, a, b2);
  }
  static $() {
    return ["MarkFileAsViewedResponse"];
  }
};
var UnmarkFileAsViewedRequest = class _UnmarkFileAsViewedRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    this.filePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnmarkFileAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnmarkFileAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnmarkFileAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnmarkFileAsViewedRequest, a, b2);
  }
  static $() {
    return ["UnmarkFileAsViewedRequest|1 change #0|2 file_path 9", ChangeIdentifier];
  }
};
var UnmarkFileAsViewedResponse = class _UnmarkFileAsViewedResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnmarkFileAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnmarkFileAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnmarkFileAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnmarkFileAsViewedResponse, a, b2);
  }
  static $() {
    return ["UnmarkFileAsViewedResponse"];
  }
};
var MarkDirectoryAsViewedRequest = class _MarkDirectoryAsViewedRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    this.directoryPath = "";
    this.filePaths = [];
    this.versionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkDirectoryAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkDirectoryAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkDirectoryAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkDirectoryAsViewedRequest, a, b2);
  }
  static $() {
    return ["MarkDirectoryAsViewedRequest|1 change #0|2 directory_path 9|3 file_paths 9*|4 version_id 9", ChangeIdentifier];
  }
};
var MarkDirectoryAsViewedResponse = class _MarkDirectoryAsViewedResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkDirectoryAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkDirectoryAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkDirectoryAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkDirectoryAsViewedResponse, a, b2);
  }
  static $() {
    return ["MarkDirectoryAsViewedResponse"];
  }
};
var MarkAllFilesAsViewedRequest = class _MarkAllFilesAsViewedRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    this.filePaths = [];
    this.versionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkAllFilesAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkAllFilesAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkAllFilesAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkAllFilesAsViewedRequest, a, b2);
  }
  static $() {
    return ["MarkAllFilesAsViewedRequest|1 change #0|2 file_paths 9*|3 version_id 9", ChangeIdentifier];
  }
};
var MarkAllFilesAsViewedResponse = class _MarkAllFilesAsViewedResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MarkAllFilesAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MarkAllFilesAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MarkAllFilesAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MarkAllFilesAsViewedResponse, a, b2);
  }
  static $() {
    return ["MarkAllFilesAsViewedResponse"];
  }
};
var UnmarkAllFilesAsViewedRequest = class _UnmarkAllFilesAsViewedRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnmarkAllFilesAsViewedRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnmarkAllFilesAsViewedRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnmarkAllFilesAsViewedRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnmarkAllFilesAsViewedRequest, a, b2);
  }
  static $() {
    return ["UnmarkAllFilesAsViewedRequest|1 change #0", ChangeIdentifier];
  }
};
var UnmarkAllFilesAsViewedResponse = class _UnmarkAllFilesAsViewedResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnmarkAllFilesAsViewedResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnmarkAllFilesAsViewedResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnmarkAllFilesAsViewedResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnmarkAllFilesAsViewedResponse, a, b2);
  }
  static $() {
    return ["UnmarkAllFilesAsViewedResponse"];
  }
};
var ListFileViewedStatesRequest = class _ListFileViewedStatesRequest extends __protoMessage3160 {
  constructor(data) {
    super();
    this.headCommitSha = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListFileViewedStatesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListFileViewedStatesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListFileViewedStatesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListFileViewedStatesRequest, a, b2);
  }
  static $() {
    return ["ListFileViewedStatesRequest|1 change #0|2 head_commit_sha 9", ChangeIdentifier];
  }
};
var ListFileViewedStatesResponse = class _ListFileViewedStatesResponse extends __protoMessage3160 {
  constructor(data) {
    super();
    this.fileViewedStates = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListFileViewedStatesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListFileViewedStatesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListFileViewedStatesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListFileViewedStatesResponse, a, b2);
  }
  static $() {
    return ["ListFileViewedStatesResponse|1 file_viewed_states #0*|2 head_version_id 9?", FileViewedState];
  }
};
var FileViewedState = class _FileViewedState extends __protoMessage3160 {
  constructor(data) {
    super();
    this.filePath = "";
    this.versionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FileViewedState().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FileViewedState().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FileViewedState().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FileViewedState, a, b2);
  }
  static $() {
    return ["FileViewedState|1 file_path 9|2 version_id 9|3 stale 8?"];
  }
};
