/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/agent_skills_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage79 = "agent.v1.";
var __protoMessage377 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage79;
  }
};
var AgentSkill = class _AgentSkill extends __protoMessage377 {
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
  static fromBinary(bytes, options) {
    return new _AgentSkill().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AgentSkill().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AgentSkill().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AgentSkill, a, b);
  }
  static $() {
    return ["AgentSkill|1 full_path 9|2 content 9|3 description 9|4 parse_error 9?|5 environments 9*|6 disabled_environments 9*|7 git_remote_origin 9?|8 disable_model_invocation 8|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 globs 9*|14 scoped_to 9*"];
  }
};

