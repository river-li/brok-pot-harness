/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/filesyncserver_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_utils_pb2();
init_compact();
var __protoPackage116 = "aiserver.v1.";
var __protoMessage3115 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage116;
  }
};
var FilesyncUpdateWithModelVersion = class _FilesyncUpdateWithModelVersion extends __protoMessage3115 {
  constructor(data) {
    super();
    this.modelVersion = 0;
    this.relativeWorkspacePath = "";
    this.updates = [];
    this.expectedFileLength = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FilesyncUpdateWithModelVersion().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FilesyncUpdateWithModelVersion().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FilesyncUpdateWithModelVersion().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FilesyncUpdateWithModelVersion, a, b2);
  }
  static $() {
    return ["FilesyncUpdateWithModelVersion|1 model_version 5|2 relative_workspace_path 9|3 updates #0*|4 expected_file_length 5", SingleUpdateRequest];
  }
};
var SingleUpdateRequest = class _SingleUpdateRequest extends __protoMessage3115 {
  constructor(data) {
    super();
    this.startPosition = 0;
    this.endPosition = 0;
    this.changeLength = 0;
    this.replacedString = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SingleUpdateRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SingleUpdateRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SingleUpdateRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SingleUpdateRequest, a, b2);
  }
  static $() {
    return ["SingleUpdateRequest|1 start_position 5|2 end_position 5|3 change_length 5|4 replaced_string 9|5 range #0", SimpleRange];
  }
};

