init_esm();
init_compact();
var __protoPackage180 = "origin.v1.";
var __protoMessage3171 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage180;
  }
};
var RulesetEnforcement = /* @__PURE__ */ enumType(proto3, __protoPackage180, "RulesetEnforcement", [[0, "UNSPECIFIED"], [1, "ACTIVE"], [2, "EVALUATE"], [3, "DISABLED"]], 1);
var RulesetKind = /* @__PURE__ */ enumType(proto3, __protoPackage180, "RulesetKind", [[0, "UNSPECIFIED"], [1, "MERGE_BRANCH"], [2, "PUSH_BRANCH"], [3, "PUSH_TAG"], [4, "PUSH_REPOSITORY"]], 1);
var RulesetBypassMode = /* @__PURE__ */ enumType(proto3, __protoPackage180, "RulesetBypassMode", [[0, "UNSPECIFIED"], [1, "ALWAYS"], [2, "PULL_REQUEST_ONLY"]], 1);
var RulesetBypassActorKind = /* @__PURE__ */ enumType(proto3, __protoPackage180, "RulesetBypassActorKind", [[0, "UNSPECIFIED"], [1, "USER"], [2, "TEAM"], [3, "APP"], [6, "ORIGIN_ROLE"]], 1);
var RulesetRule = class _RulesetRule extends __protoMessage3171 {
  constructor(data) {
    super();
    this.id = "";
    this.ruleType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RulesetRule().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RulesetRule().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RulesetRule().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RulesetRule, a, b2);
  }
  static $() {
    return ["RulesetRule|1 id 9|2 rule_type 9|3 parameters #0", Struct];
  }
};
var RulesetBypassActor = class _RulesetBypassActor extends __protoMessage3171 {
  constructor(data) {
    super();
    this.id = "";
    this.bypassMode = RulesetBypassMode.UNSPECIFIED;
    this.actorKind = RulesetBypassActorKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RulesetBypassActor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RulesetBypassActor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RulesetBypassActor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RulesetBypassActor, a, b2);
  }
  static $() {
    return ["RulesetBypassActor|1 id 9|2 bypass_mode #0|3 actor_kind #1|4 actor_payload #2", RulesetBypassMode, RulesetBypassActorKind, Struct];
  }
};
var Ruleset = class _Ruleset extends __protoMessage3171 {
  constructor(data) {
    super();
    this.id = "";
    this.name = "";
    this.description = "";
    this.enforcement = RulesetEnforcement.UNSPECIFIED;
    this.kind = RulesetKind.UNSPECIFIED;
    this.includedRefNames = [];
    this.excludedRefNames = [];
    this.rules = [];
    this.bypassActors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Ruleset().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Ruleset().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Ruleset().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Ruleset, a, b2);
  }
  static $() {
    return ["Ruleset|1 id 9|2 repo #0|3 name 9|4 description 9|5 enforcement #1|6 kind #2|7 included_ref_names 9*|8 excluded_ref_names 9*|9 rules #3*|10 bypass_actors #4*", ClientRepoIdentifier, RulesetEnforcement, RulesetKind, RulesetRule, RulesetBypassActor];
  }
};
var RulesetRuleInput = class _RulesetRuleInput extends __protoMessage3171 {
  constructor(data) {
    super();
    this.ruleType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RulesetRuleInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RulesetRuleInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RulesetRuleInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RulesetRuleInput, a, b2);
  }
  static $() {
    return ["RulesetRuleInput|1 rule_type 9|2 parameters #0", Struct];
  }
};
var RulesetBypassActorInput = class _RulesetBypassActorInput extends __protoMessage3171 {
  constructor(data) {
    super();
    this.bypassMode = RulesetBypassMode.UNSPECIFIED;
    this.actorKind = RulesetBypassActorKind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RulesetBypassActorInput().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RulesetBypassActorInput().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RulesetBypassActorInput().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RulesetBypassActorInput, a, b2);
  }
  static $() {
    return ["RulesetBypassActorInput|1 bypass_mode #0|2 actor_kind #1|3 actor_payload #2", RulesetBypassMode, RulesetBypassActorKind, Struct];
  }
};
var ListRulesetsRequest = class _ListRulesetsRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRulesetsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRulesetsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRulesetsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRulesetsRequest, a, b2);
  }
  static $() {
    return ["ListRulesetsRequest|1 repo #0", ClientRepoIdentifier];
  }
};
var ListRulesetsResponse = class _ListRulesetsResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    this.rulesets = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRulesetsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRulesetsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRulesetsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRulesetsResponse, a, b2);
  }
  static $() {
    return ["ListRulesetsResponse|1 rulesets #0*", Ruleset];
  }
};
var GetRulesetRequest = class _GetRulesetRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    this.rulesetId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRulesetRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRulesetRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRulesetRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRulesetRequest, a, b2);
  }
  static $() {
    return ["GetRulesetRequest|1 repo #0|2 ruleset_id 9", ClientRepoIdentifier];
  }
};
var GetRulesetResponse = class _GetRulesetResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRulesetResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRulesetResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRulesetResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRulesetResponse, a, b2);
  }
  static $() {
    return ["GetRulesetResponse|1 ruleset #0", Ruleset];
  }
};
var UpsertRulesetRequest = class _UpsertRulesetRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    this.name = "";
    this.description = "";
    this.enforcement = RulesetEnforcement.UNSPECIFIED;
    this.kind = RulesetKind.UNSPECIFIED;
    this.includedRefNames = [];
    this.excludedRefNames = [];
    this.rules = [];
    this.bypassActors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertRulesetRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertRulesetRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertRulesetRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertRulesetRequest, a, b2);
  }
  static $() {
    return ["UpsertRulesetRequest|1 repo #0|2 ruleset_id 9?|3 name 9|4 description 9|5 enforcement #1|6 kind #2|7 included_ref_names 9*|8 excluded_ref_names 9*|9 rules #3*|10 bypass_actors #4*", ClientRepoIdentifier, RulesetEnforcement, RulesetKind, RulesetRuleInput, RulesetBypassActorInput];
  }
};
var UpsertRulesetResponse = class _UpsertRulesetResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertRulesetResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertRulesetResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertRulesetResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertRulesetResponse, a, b2);
  }
  static $() {
    return ["UpsertRulesetResponse|1 ruleset #0", Ruleset];
  }
};
var DeleteRulesetRequest = class _DeleteRulesetRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    this.rulesetId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRulesetRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRulesetRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRulesetRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRulesetRequest, a, b2);
  }
  static $() {
    return ["DeleteRulesetRequest|1 repo #0|2 ruleset_id 9", ClientRepoIdentifier];
  }
};
var DeleteRulesetResponse = class _DeleteRulesetResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    this.rulesetId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteRulesetResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteRulesetResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteRulesetResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteRulesetResponse, a, b2);
  }
  static $() {
    return ["DeleteRulesetResponse|1 ruleset_id 9"];
  }
};
