// @generated SignedSource<<5b626311d02d9f60f31f2b70c2ddedf085c400f186a8c69c68bc685dbfb083fa>>
// Emitted by scripts/gen-box-contract.mts from sand/src/shared/box/box-contract.ts;
// regenerate with `pnpm --filter sand run gen:box-contract`.
export const UA_OWNER_STAMP_PATH = "/tmp/sand-ua-user";
export const UA_OWNER_STAMP_LENGTH = 16;
export const UA_TOKEN_DISABLED_MARKER_PATH = "/tmp/sand-ua-token-disabled";
export const BROWSER_FINGERPRINT_SPOOF_MARKER_PATH = "/tmp/sand-browser-fingerprint-spoof";
export const ENABLE_SPOOF_GPU_MARKER_PATH = "/tmp/sand-enable-spoof-gpu";
export const WEB_BOT_AUTH_SIGNED_CACHE_PATH = "/tmp/sand-web-bot-auth-signed.json";
export const WEB_BOT_AUTH_SIGNED_TTL_MS = 120000;
export const WEB_BOT_AUTH_SIGNATURE_SOURCES = ["fresh","box_cache","fleet_cache"];
export const SAND_BOX_PORTS = {"primaryExecDaemon":1337,"primaryPty":1338,"primaryNovncWebsockify":6080,"windowRouter":1339,"forkNovncWebsockify":6081,"hostGateway":1340,"egressTunnelWebSocket":8790,"egressConnectProxy":8791};
export const SAND_BOX_FORK_PORT_BASES = {"execDaemon":14000,"pty":13600,"vnc":5900};
export const SAND_BOX_CDP_PORT_BASE = 9222;
export const SAND_BOX_WINDOW_TOKEN_DIR = "/tmp/sand-window-tokens.d";
export const SAND_BOX_NOVNC_TOKEN_DIR = "/tmp/sand-novnc-tokens.d";
export const SAND_BOX_DISPLAY_HEADER = "x-sand-display";
export const SAND_BOX_WINDOW_OWNER_HEADER = "x-sand-window-owner";
