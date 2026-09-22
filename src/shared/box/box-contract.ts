/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/box/box-contract.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BOX_PORTS = {
  primaryExecDaemon: 1337,
  primaryPty: 1338,
  primaryNovncWebsockify: 6080,
  windowRouter: 1339,
  forkNovncWebsockify: 6081,
  hostGateway: 1340,
  egressTunnelWebSocket: 8790,
  egressConnectProxy: 8791
};
var SAND_BOX_CDP_PORT_BASE = 9222;
var SAND_BOX_EXPOSED_PORTS = [
  SAND_BOX_PORTS.primaryExecDaemon,
  SAND_BOX_PORTS.primaryPty,
  SAND_BOX_PORTS.primaryNovncWebsockify,
  SAND_BOX_PORTS.windowRouter,
  SAND_BOX_PORTS.forkNovncWebsockify,
  SAND_BOX_PORTS.hostGateway,
  SAND_BOX_PORTS.egressTunnelWebSocket
];
var SAND_BOX_DISPLAY_HEADER = "x-sand-display";
var SAND_BOX_WINDOW_OWNER_HEADER = "x-sand-window-owner";
var SAND_BOX_WINDOW_UNAVAILABLE_EXIT_CODE = 75;
var UA_OWNER_STAMP_PATH = "/tmp/sand-ua-user";
var UA_OWNER_STAMP_LENGTH = 16;
var UA_TOKEN_DISABLED_MARKER_PATH = "/tmp/sand-ua-token-disabled";
var BROWSER_FINGERPRINT_SPOOF_MARKER_PATH = "/tmp/sand-browser-fingerprint-spoof";
var ENABLE_SPOOF_GPU_MARKER_PATH = "/tmp/sand-enable-spoof-gpu";
var WEB_BOT_AUTH_SIGNED_CACHE_PATH = "/tmp/sand-web-bot-auth-signed.json";
var WEB_BOT_AUTH_SIGNED_TTL_MS = 12e4;
var WEB_BOT_AUTH_SIGNATURE_SOURCES = ["fresh", "box_cache", "fleet_cache"];

