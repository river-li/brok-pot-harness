var __protoPackage124, __protoMessage3119, StreamCmdKResponse, StreamCmdKResponse_EditStart, StreamCmdKResponse_EditStream, StreamCmdKResponse_EditEnd, StreamCmdKResponse_Chat, StreamCmdKResponse_StatusUpdate;
var init_cmdk_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/cmdk_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage124 = "aiserver.v1.";
    __protoMessage3119 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage124;
      }
    };
    StreamCmdKResponse = class _StreamCmdKResponse extends __protoMessage3119 {
      constructor(data) {
        super();
        this.response = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse|1 edit_start #0 response|2 edit_stream #1 response|3 edit_end #2 response|4 chat #3 response|5 status_update #4 response", StreamCmdKResponse_EditStart, StreamCmdKResponse_EditStream, StreamCmdKResponse_EditEnd, StreamCmdKResponse_Chat, StreamCmdKResponse_StatusUpdate];
      }
    };
    StreamCmdKResponse_EditStart = class _StreamCmdKResponse_EditStart extends __protoMessage3119 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.editId = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse_EditStart().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse_EditStart().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse_EditStart().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse_EditStart, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse.EditStart|1 start_line_number 5|2 edit_id 5|3 max_end_line_number_exclusive 5?|4 file_path 9?"];
      }
    };
    StreamCmdKResponse_EditStream = class _StreamCmdKResponse_EditStream extends __protoMessage3119 {
      constructor(data) {
        super();
        this.text = "";
        this.editId = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse_EditStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse_EditStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse_EditStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse_EditStream, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse.EditStream|1 text 9|2 edit_id 5|3 file_path 9?"];
      }
    };
    StreamCmdKResponse_EditEnd = class _StreamCmdKResponse_EditEnd extends __protoMessage3119 {
      constructor(data) {
        super();
        this.endLineNumberExclusive = 0;
        this.editId = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse_EditEnd().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse_EditEnd().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse_EditEnd().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse_EditEnd, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse.EditEnd|1 end_line_number_exclusive 5|2 edit_id 5|3 file_path 9?"];
      }
    };
    StreamCmdKResponse_Chat = class _StreamCmdKResponse_Chat extends __protoMessage3119 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse_Chat().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse_Chat().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse_Chat().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse_Chat, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse.Chat|1 text 9"];
      }
    };
    StreamCmdKResponse_StatusUpdate = class _StreamCmdKResponse_StatusUpdate extends __protoMessage3119 {
      constructor(data) {
        super();
        this.messages = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamCmdKResponse_StatusUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamCmdKResponse_StatusUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamCmdKResponse_StatusUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamCmdKResponse_StatusUpdate, a, b2);
      }
      static $() {
        return ["StreamCmdKResponse.StatusUpdate|1 messages 9*"];
      }
    };
  }
});
