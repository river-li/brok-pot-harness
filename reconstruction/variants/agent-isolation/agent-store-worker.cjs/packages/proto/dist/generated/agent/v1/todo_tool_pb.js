/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/todo_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage14 = "agent.v1.";
var __protoMessage314 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage14;
  }
};
var TodoStatus = /* @__PURE__ */ enumType(proto3, __protoPackage14, "TodoStatus", [[0, "UNSPECIFIED"], [1, "PENDING"], [2, "IN_PROGRESS"], [3, "COMPLETED"], [4, "CANCELLED"]], 1);
var TodoItem = class _TodoItem extends __protoMessage314 {
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
  static fromBinary(bytes, options) {
    return new _TodoItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TodoItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TodoItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TodoItem, a, b);
  }
  static $() {
    return ["TodoItem|1 id 9|2 content 9|3 status #0|4 created_at 3|5 updated_at 3|6 dependencies 9*", TodoStatus];
  }
};
var UpdateTodosToolCall = class _UpdateTodosToolCall extends __protoMessage314 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosToolCall, a, b);
  }
  static $() {
    return ["UpdateTodosToolCall|1 args #0|2 result #1", UpdateTodosArgs, UpdateTodosResult];
  }
};
var UpdateTodosArgs = class _UpdateTodosArgs extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.merge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosArgs, a, b);
  }
  static $() {
    return ["UpdateTodosArgs|1 todos #0*|2 merge 8", TodoItem];
  }
};
var UpdateTodosResult = class _UpdateTodosResult extends __protoMessage314 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosResult, a, b);
  }
  static $() {
    return ["UpdateTodosResult|1 success #0 result|2 error #1 result", UpdateTodosSuccess, UpdateTodosError];
  }
};
var UpdateTodosSuccess = class _UpdateTodosSuccess extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.totalCount = 0;
    this.wasMerge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosSuccess, a, b);
  }
  static $() {
    return ["UpdateTodosSuccess|1 todos #0*|2 total_count 5|3 was_merge 8", TodoItem];
  }
};
var UpdateTodosError = class _UpdateTodosError extends __protoMessage314 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosError, a, b);
  }
  static $() {
    return ["UpdateTodosError|1 error 9"];
  }
};
var ReadTodosToolCall = class _ReadTodosToolCall extends __protoMessage314 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosToolCall, a, b);
  }
  static $() {
    return ["ReadTodosToolCall|1 args #0|2 result #1", ReadTodosArgs, ReadTodosResult];
  }
};
var ReadTodosArgs = class _ReadTodosArgs extends __protoMessage314 {
  constructor(data) {
    super();
    this.statusFilter = [];
    this.idFilter = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosArgs, a, b);
  }
  static $() {
    return ["ReadTodosArgs|1 status_filter #0*|2 id_filter 9*", TodoStatus];
  }
};
var ReadTodosResult = class _ReadTodosResult extends __protoMessage314 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosResult, a, b);
  }
  static $() {
    return ["ReadTodosResult|1 success #0 result|2 error #1 result", ReadTodosSuccess, ReadTodosError];
  }
};
var ReadTodosSuccess = class _ReadTodosSuccess extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.totalCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosSuccess, a, b);
  }
  static $() {
    return ["ReadTodosSuccess|1 todos #0*|2 total_count 5", TodoItem];
  }
};
var ReadTodosError = class _ReadTodosError extends __protoMessage314 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosError, a, b);
  }
  static $() {
    return ["ReadTodosError|1 error 9"];
  }
};

