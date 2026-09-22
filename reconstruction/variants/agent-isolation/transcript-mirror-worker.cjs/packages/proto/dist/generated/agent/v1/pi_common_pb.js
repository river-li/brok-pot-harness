/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_common_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage61 = "agent.v1.";
var __protoMessage360 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage61;
  }
};
var PiTruncation = class _PiTruncation extends __protoMessage360 {
  constructor(data) {
    super();
    this.truncated = false;
    this.truncatedBy = "";
    this.totalLines = 0;
    this.outputLines = 0;
    this.outputBytes = 0;
    this.firstLineExceedsLimit = false;
    this.lastLinePartial = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiTruncation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiTruncation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiTruncation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiTruncation, a, b);
  }
  static $() {
    return ["PiTruncation|1 truncated 8|2 truncated_by 9|3 total_lines 13|4 output_lines 13|5 output_bytes 13|6 max_lines 13?|7 max_bytes 13?|8 first_line_exceeds_limit 8|9 last_line_partial 8"];
  }
};

