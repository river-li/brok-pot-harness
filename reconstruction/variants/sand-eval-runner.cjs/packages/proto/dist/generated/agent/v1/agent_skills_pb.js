/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/agent_skills_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage83 = "agent.v1.";
var __protoMessage382 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage83;
  }
};
var AgentSkill = class _AgentSkill extends __protoMessage382 {
  constructor(data) {
    super();
    this.fullPath = "";
    this.content = "";
    this.description = "";
    this.environments = [];
    this.disabledEnvironments = [];
    this.disableModelInvocation = false;
    this.globs = [];
    this.scopedTo = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AgentSkill().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AgentSkill().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AgentSkill().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AgentSkill, a, b2);
  }
  static $() {
    return ["AgentSkill|1 full_path 9|2 content 9|3 description 9|4 parse_error 9?|5 environments 9*|6 disabled_environments 9*|7 git_remote_origin 9?|8 disable_model_invocation 8|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 globs 9*|14 scoped_to 9*"];
  }
};

