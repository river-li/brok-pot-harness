/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/internapi/v1/blob_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage131, __protoMessage3126, BlobType, ImageBlobData, BlobData, BlobDataPerMessage;
var init_blob_pb = __esm({
  "../packages/proto/dist/generated/internapi/v1/blob_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage131 = "internapi.v1.";
    __protoMessage3126 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage131;
      }
    };
    BlobType = /* @__PURE__ */ enumType(proto3, __protoPackage131, "BlobType", [[0, "UNSPECIFIED"], [1, "IMAGE"], [2, "INVOCATION_CONTEXT"], [3, "EXTRA_CONTEXT"], [4, "GIT_PR_DIFF_SELECTION"], [5, "SELECTED_PULL_REQUEST"], [6, "TEXT"], [7, "RICH_TEXT"], [8, "EXTERNAL_LINK_PDF"], [9, "DOCUMENT"], [10, "VIDEO"]], 1);
    ImageBlobData = class _ImageBlobData extends __protoMessage3126 {
      constructor(data) {
        super();
        this.mimeType = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImageBlobData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImageBlobData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImageBlobData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImageBlobData, a, b2);
      }
      static $() {
        return ["ImageBlobData|1 mime_type 9"];
      }
    };
    BlobData = class _BlobData extends __protoMessage3126 {
      constructor(data) {
        super();
        this.blobType = BlobType.UNSPECIFIED;
        this.blobId = new Uint8Array(0);
        this.index = 0;
        this.typeSpecificData = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlobData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlobData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlobData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlobData, a, b2);
      }
      static $() {
        return ["BlobData|1 blob_type #0|2 blob_id 12|3 index 5|4 image_data #1 type_specific_data", BlobType, ImageBlobData];
      }
    };
    BlobDataPerMessage = class _BlobDataPerMessage extends __protoMessage3126 {
      constructor(data) {
        super();
        this.blobData = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlobDataPerMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlobDataPerMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlobDataPerMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlobDataPerMessage, a, b2);
      }
      static $() {
        return ["BlobDataPerMessage|1 blob_data #0*", BlobData];
      }
    };
  }
});

