/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/mcp_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage133, __protoMessage3127, McpOAuthStoredData;
var init_mcp_pb2 = __esm({
  "../packages/proto/dist/generated/aiserver/v1/mcp_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage133 = "aiserver.v1.";
    __protoMessage3127 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage133;
      }
    };
    McpOAuthStoredData = class _McpOAuthStoredData extends __protoMessage3127 {
      constructor(data) {
        super();
        this.clientId = "";
        this.redirectUris = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpOAuthStoredData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpOAuthStoredData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpOAuthStoredData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpOAuthStoredData, a, b2);
      }
      static $() {
        return ["McpOAuthStoredData|1 refresh_token 9?|2 client_id 9|3 client_secret 9?|4 redirect_uris 9*|5 access_token 9?"];
      }
    };
  }
});

