/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/cursor_rules_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage12 = "agent.v1.";
var __protoMessage312 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage12;
  }
};
var CursorRuleSource = /* @__PURE__ */ enumType(proto3, __protoPackage12, "CursorRuleSource", [[0, "UNSPECIFIED"], [1, "TEAM"], [2, "USER"]], 1);
var CursorRuleTypeGlobal = class _CursorRuleTypeGlobal extends __protoMessage312 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeGlobal().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeGlobal().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeGlobal().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeGlobal, a, b);
  }
  static $() {
    return ["CursorRuleTypeGlobal"];
  }
};
var CursorRuleTypeFileGlobs = class _CursorRuleTypeFileGlobs extends __protoMessage312 {
  constructor(data) {
    super();
    this.globs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeFileGlobs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeFileGlobs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeFileGlobs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeFileGlobs, a, b);
  }
  static $() {
    return ["CursorRuleTypeFileGlobs|1 globs 9*"];
  }
};
var CursorRuleTypeAgentFetched = class _CursorRuleTypeAgentFetched extends __protoMessage312 {
  constructor(data) {
    super();
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeAgentFetched().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeAgentFetched().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeAgentFetched().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeAgentFetched, a, b);
  }
  static $() {
    return ["CursorRuleTypeAgentFetched|1 description 9"];
  }
};
var CursorRuleTypeManuallyAttached = class _CursorRuleTypeManuallyAttached extends __protoMessage312 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeManuallyAttached().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeManuallyAttached().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeManuallyAttached().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeManuallyAttached, a, b);
  }
  static $() {
    return ["CursorRuleTypeManuallyAttached"];
  }
};
var CursorRuleType = class _CursorRuleType extends __protoMessage312 {
  constructor(data) {
    super();
    this.type = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleType().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleType().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleType().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleType, a, b);
  }
  static $() {
    return ["CursorRuleType|1 global #0 type|2 file_globbed #1 type|3 agent_fetched #2 type|4 manually_attached #3 type", CursorRuleTypeGlobal, CursorRuleTypeFileGlobs, CursorRuleTypeAgentFetched, CursorRuleTypeManuallyAttached];
  }
};
var CursorRule = class _CursorRule extends __protoMessage312 {
  constructor(data) {
    super();
    this.fullPath = "";
    this.content = "";
    this.source = CursorRuleSource.UNSPECIFIED;
    this.environments = [];
    this.disabledEnvironments = [];
    this.scopedTo = [];
    this.frontmatter = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRule().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRule().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRule().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRule, a, b);
  }
  static $() {
    return ["CursorRule|1 full_path 9|2 content 9|3 type #0|4 source #1|5 git_remote_origin 9?|6 parse_error 9?|7 environments 9*|8 disabled_environments 9*|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 scoped_to 9*|14 frontmatter 9|15 is_required 8?", CursorRuleType, CursorRuleSource];
  }
};

