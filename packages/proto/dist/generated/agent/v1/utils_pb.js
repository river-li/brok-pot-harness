/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/utils_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage14, __protoMessage311, Range2, Position, OutputLocation, SmartModeApproval;
var init_utils_pb2 = __esm({
  "../packages/proto/dist/generated/agent/v1/utils_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage14 = "agent.v1.";
    __protoMessage311 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage14;
      }
    };
    Range2 = class _Range extends __protoMessage311 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Range().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Range().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Range().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Range, a, b2);
      }
      static $() {
        return ["Range|1 start #0|2 end #0", Position];
      }
    };
    Position = class _Position extends __protoMessage311 {
      constructor(data) {
        super();
        this.line = 0;
        this.column = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Position().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Position().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Position().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Position, a, b2);
      }
      static $() {
        return ["Position|1 line 13|2 column 13"];
      }
    };
    OutputLocation = class _OutputLocation extends __protoMessage311 {
      constructor(data) {
        super();
        this.filePath = "";
        this.sizeBytes = protoInt64.zero;
        this.lineCount = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OutputLocation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OutputLocation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OutputLocation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OutputLocation, a, b2);
      }
      static $() {
        return ["OutputLocation|1 file_path 9|2 size_bytes 3|3 line_count 3"];
      }
    };
    SmartModeApproval = class _SmartModeApproval extends __protoMessage311 {
      constructor(data) {
        super();
        this.requestId = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SmartModeApproval().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SmartModeApproval().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SmartModeApproval().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SmartModeApproval, a, b2);
      }
      static $() {
        return ["SmartModeApproval|1 request_id 9|2 reason 9"];
      }
    };
  }
});

