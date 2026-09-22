/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_common_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage73, __protoMessage370, PiTruncation;
var init_pi_common_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_common_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage73 = "agent.v1.";
    __protoMessage370 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage73;
      }
    };
    PiTruncation = class _PiTruncation extends __protoMessage370 {
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
      static fromBinary(bytes, options2) {
        return new _PiTruncation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiTruncation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiTruncation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiTruncation, a, b2);
      }
      static $() {
        return ["PiTruncation|1 truncated 8|2 truncated_by 9|3 total_lines 13|4 output_lines 13|5 output_bytes 13|6 max_lines 13?|7 max_bytes 13?|8 first_line_exceeds_limit 8|9 last_line_partial 8"];
      }
    };
  }
});

