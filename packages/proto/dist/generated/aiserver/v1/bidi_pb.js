/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/bidi_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage144, __protoMessage3137, BidiRequestId, BidiPollRequest, BidiPollResponse;
var init_bidi_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/bidi_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage144 = "aiserver.v1.";
    __protoMessage3137 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage144;
      }
    };
    BidiRequestId = class _BidiRequestId extends __protoMessage3137 {
      constructor(data) {
        super();
        this.requestId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BidiRequestId().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BidiRequestId().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BidiRequestId().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BidiRequestId, a, b2);
      }
      static $() {
        return ["BidiRequestId|1 request_id 9"];
      }
    };
    BidiPollRequest = class _BidiPollRequest extends __protoMessage3137 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BidiPollRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BidiPollRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BidiPollRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BidiPollRequest, a, b2);
      }
      static $() {
        return ["BidiPollRequest|1 request_id #0|2 start_request 8?", BidiRequestId];
      }
    };
    BidiPollResponse = class _BidiPollResponse extends __protoMessage3137 {
      constructor(data) {
        super();
        this.seqno = protoInt64.zero;
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BidiPollResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BidiPollResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BidiPollResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BidiPollResponse, a, b2);
      }
      static $() {
        return ["BidiPollResponse|1 seqno 3|2 data 9|3 eof 8?"];
      }
    };
  }
});

