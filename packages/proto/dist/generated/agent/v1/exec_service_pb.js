/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/exec_service_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_exec_pb();
init_compact();
var __protoPackage151 = "agent.v1.";
var __protoMessage3144 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage151;
  }
};
var ExecStreamElement = class _ExecStreamElement extends __protoMessage3144 {
  constructor(data) {
    super();
    this.element = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ExecStreamElement().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ExecStreamElement().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ExecStreamElement().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ExecStreamElement, a, b2);
  }
  static $() {
    return ["ExecStreamElement|1 exec_client_message #0 element|2 exec_client_control_message #1 element", ExecClientMessage, ExecClientControlMessage];
  }
};
var ReadFileRequest = class _ReadFileRequest extends __protoMessage3144 {
  constructor(data) {
    super();
    this.path = "";
    this.maxBytes = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadFileRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadFileRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadFileRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadFileRequest, a, b2);
  }
  static $() {
    return ["ReadFileRequest|1 path 9|2 max_bytes 4"];
  }
};
var ReadFileHeader = class _ReadFileHeader extends __protoMessage3144 {
  constructor(data) {
    super();
    this.size = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadFileHeader().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadFileHeader().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadFileHeader().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadFileHeader, a, b2);
  }
  static $() {
    return ["ReadFileHeader|1 size 4"];
  }
};
var ReadFileComplete = class _ReadFileComplete extends __protoMessage3144 {
  constructor(data) {
    super();
    this.size = protoInt64.zero;
    this.sha256 = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadFileComplete().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadFileComplete().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadFileComplete().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadFileComplete, a, b2);
  }
  static $() {
    return ["ReadFileComplete|1 size 4|2 sha256 12"];
  }
};
var ReadFileResponse = class _ReadFileResponse extends __protoMessage3144 {
  constructor(data) {
    super();
    this.payload = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadFileResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadFileResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadFileResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadFileResponse, a, b2);
  }
  static $() {
    return ["ReadFileResponse|1 header #0 payload|2 chunk 12 payload|3 complete #1 payload", ReadFileHeader, ReadFileComplete];
  }
};

