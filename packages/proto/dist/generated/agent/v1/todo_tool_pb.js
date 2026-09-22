/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/todo_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage25, __protoMessage322, TodoStatus, TodoItem, UpdateTodosToolCall, UpdateTodosArgs, UpdateTodosResult, UpdateTodosSuccess, UpdateTodosError, ReadTodosToolCall, ReadTodosArgs, ReadTodosResult, ReadTodosSuccess, ReadTodosError;
var init_todo_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/todo_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage25 = "agent.v1.";
    __protoMessage322 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage25;
      }
    };
    TodoStatus = /* @__PURE__ */ enumType(proto3, __protoPackage25, "TodoStatus", [[0, "UNSPECIFIED"], [1, "PENDING"], [2, "IN_PROGRESS"], [3, "COMPLETED"], [4, "CANCELLED"]], 1);
    TodoItem = class _TodoItem extends __protoMessage322 {
      constructor(data) {
        super();
        this.id = "";
        this.content = "";
        this.status = TodoStatus.UNSPECIFIED;
        this.createdAt = protoInt64.zero;
        this.updatedAt = protoInt64.zero;
        this.dependencies = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoItem, a, b2);
      }
      static $() {
        return ["TodoItem|1 id 9|2 content 9|3 status #0|4 created_at 3|5 updated_at 3|6 dependencies 9*", TodoStatus];
      }
    };
    UpdateTodosToolCall = class _UpdateTodosToolCall extends __protoMessage322 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateTodosToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateTodosToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateTodosToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateTodosToolCall, a, b2);
      }
      static $() {
        return ["UpdateTodosToolCall|1 args #0|2 result #1", UpdateTodosArgs, UpdateTodosResult];
      }
    };
    UpdateTodosArgs = class _UpdateTodosArgs extends __protoMessage322 {
      constructor(data) {
        super();
        this.todos = [];
        this.merge = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateTodosArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateTodosArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateTodosArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateTodosArgs, a, b2);
      }
      static $() {
        return ["UpdateTodosArgs|1 todos #0*|2 merge 8", TodoItem];
      }
    };
    UpdateTodosResult = class _UpdateTodosResult extends __protoMessage322 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateTodosResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateTodosResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateTodosResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateTodosResult, a, b2);
      }
      static $() {
        return ["UpdateTodosResult|1 success #0 result|2 error #1 result", UpdateTodosSuccess, UpdateTodosError];
      }
    };
    UpdateTodosSuccess = class _UpdateTodosSuccess extends __protoMessage322 {
      constructor(data) {
        super();
        this.todos = [];
        this.totalCount = 0;
        this.wasMerge = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateTodosSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateTodosSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateTodosSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateTodosSuccess, a, b2);
      }
      static $() {
        return ["UpdateTodosSuccess|1 todos #0*|2 total_count 5|3 was_merge 8", TodoItem];
      }
    };
    UpdateTodosError = class _UpdateTodosError extends __protoMessage322 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateTodosError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateTodosError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateTodosError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateTodosError, a, b2);
      }
      static $() {
        return ["UpdateTodosError|1 error 9"];
      }
    };
    ReadTodosToolCall = class _ReadTodosToolCall extends __protoMessage322 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTodosToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTodosToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTodosToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTodosToolCall, a, b2);
      }
      static $() {
        return ["ReadTodosToolCall|1 args #0|2 result #1", ReadTodosArgs, ReadTodosResult];
      }
    };
    ReadTodosArgs = class _ReadTodosArgs extends __protoMessage322 {
      constructor(data) {
        super();
        this.statusFilter = [];
        this.idFilter = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTodosArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTodosArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTodosArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTodosArgs, a, b2);
      }
      static $() {
        return ["ReadTodosArgs|1 status_filter #0*|2 id_filter 9*", TodoStatus];
      }
    };
    ReadTodosResult = class _ReadTodosResult extends __protoMessage322 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTodosResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTodosResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTodosResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTodosResult, a, b2);
      }
      static $() {
        return ["ReadTodosResult|1 success #0 result|2 error #1 result", ReadTodosSuccess, ReadTodosError];
      }
    };
    ReadTodosSuccess = class _ReadTodosSuccess extends __protoMessage322 {
      constructor(data) {
        super();
        this.todos = [];
        this.totalCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTodosSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTodosSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTodosSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTodosSuccess, a, b2);
      }
      static $() {
        return ["ReadTodosSuccess|1 todos #0*|2 total_count 5", TodoItem];
      }
    };
    ReadTodosError = class _ReadTodosError extends __protoMessage322 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadTodosError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadTodosError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadTodosError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadTodosError, a, b2);
      }
      static $() {
        return ["ReadTodosError|1 error 9"];
      }
    };
  }
});

