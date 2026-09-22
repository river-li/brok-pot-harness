/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/gateway/gateway-wire.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GATEWAY_API_PREFIX = "/api";
var GATEWAY_EVENTS_PATH = "/events";
var GATEWAY_EVENTS_ECHO_PATH = "/events/echo";
var GATEWAY_EVENTS_ECHO_NONCE_PARAM = "nonce";
var GATEWAY_EVENTS_ECHO_COMMENT = ":echo ";
var GATEWAY_EVENTS_ECHO_NONCE_PATTERN = /^[A-Za-z0-9-]{1,64}$/;
var GATEWAY_HEALTH_PATH = "/health";
var GATEWAY_AUTH_SCHEME = "Bearer";
var GATEWAY_SLIM_AVATARS_HEADER = "x-sand-slim-avatars";
var GATEWAY_MINT_DEDUPE_HEADER = "x-sand-mint-dedupe";
var GATEWAY_TRACEPARENT_HEADER = "traceparent";
var GATEWAY_AVATARS_PATH = "/avatars";
var GATEWAY_UNKNOWN_METHOD_FAILURE_CODE = "gateway/unknown-method";

