/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/cloud_agent_scope_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage9, __protoMessage37, CloudAgentRequestScope, CloudAgentPersonalScope;
var init_cloud_agent_scope_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/cloud_agent_scope_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage9 = "aiserver.v1.";
    __protoMessage37 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage9;
      }
    };
    CloudAgentRequestScope = class _CloudAgentRequestScope extends __protoMessage37 {
      constructor(data) {
        super();
        this.scope = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudAgentRequestScope().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudAgentRequestScope().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudAgentRequestScope().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudAgentRequestScope, a, b2);
      }
      static $() {
        return ["CloudAgentRequestScope|1 personal #0 scope|2 team_id 5 scope", CloudAgentPersonalScope];
      }
    };
    CloudAgentPersonalScope = class _CloudAgentPersonalScope extends __protoMessage37 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudAgentPersonalScope().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudAgentPersonalScope().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudAgentPersonalScope().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudAgentPersonalScope, a, b2);
      }
      static $() {
        return ["CloudAgentPersonalScope"];
      }
    };
  }
});

