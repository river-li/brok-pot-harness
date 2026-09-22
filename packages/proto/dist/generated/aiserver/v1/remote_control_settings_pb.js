/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/remote_control_settings_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage134, __protoMessage3128, RemoteControlV2AdminSettings, RemoteControlV2Policy;
var init_remote_control_settings_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/remote_control_settings_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage134 = "aiserver.v1.";
    __protoMessage3128 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage134;
      }
    };
    RemoteControlV2AdminSettings = class _RemoteControlV2AdminSettings extends __protoMessage3128 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RemoteControlV2AdminSettings().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RemoteControlV2AdminSettings().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RemoteControlV2AdminSettings().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RemoteControlV2AdminSettings, a, b2);
      }
      static $() {
        return ["RemoteControlV2AdminSettings|1 enabled 8?|2 automatic_registration_enabled 8?"];
      }
    };
    RemoteControlV2Policy = class _RemoteControlV2Policy extends __protoMessage3128 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RemoteControlV2Policy().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RemoteControlV2Policy().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RemoteControlV2Policy().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RemoteControlV2Policy, a, b2);
      }
      static $() {
        return ["RemoteControlV2Policy|1 enabled 8?|2 automatic_registration_enabled 8?|3 available 8?|4 automatic_registration_released 8?|5 remote_control_denying_org_name 9?|6 automatic_registration_denying_org_name 9?"];
      }
    };
  }
});

