/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/cursor-token.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto = require("node:crypto");
init_zod();

// @recovered-fragment 2/2
var DEFAULT_CURSOR_BACKEND_URL = "https://api2.cursor.sh";
var DEFAULT_ORIGIN_BACKEND_URL = "https://api.origin.cursor.com";
var PROD_AUTH_CLIENT_ID = "KbZUR41cY7W6zRSdpSUJ7I7mLYBKOCmB";
var DEV_AUTH_CLIENT_ID = "OzaBXLClY5CAGxNzUhQ2vlknpi07tGuE";
var TOKEN_REFRESH_LEEWAY_MS = 5 * 60 * 1e3;
var jwtPayloadSchema = external_exports.object({
  email: external_exports.string().optional(),
  exp: external_exports.number().optional(),
  sub: external_exports.string().optional()
}).passthrough();
function parseJwtPayload(token) {
  const [, payload] = token.split(".");
  if (payload == null || payload.length === 0) return null;
  try {
    const raw = Buffer.from(payload, "base64url").toString("utf8");
    const parsed = jwtPayloadSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
function accountScopeOfPrincipal({ principal }) {
  return (0, import_node_crypto.createHash)("sha256").update(principal).digest("hex");
}
function accountScopeOfToken({ accessToken }) {
  return accountScopeOfPrincipal({ principal: parseJwtPayload(accessToken)?.sub ?? accessToken });
}
function backendUrlOf(sandBackendUrl, cursorApiBaseUrl) {
  return new URL(sandBackendUrl ?? cursorApiBaseUrl ?? DEFAULT_CURSOR_BACKEND_URL).toString();
}
function originBackendUrlOf(configuredOriginBackendUrl, readBackendUrl) {
  const configured2 = configuredOriginBackendUrl?.trim();
  if (configured2 != null && configured2.length > 0) return new URL(configured2).toString();
  const cursorBackendUrl = readBackendUrl();
  return cursorBackendUrl === new URL(DEFAULT_CURSOR_BACKEND_URL).toString() ? new URL(DEFAULT_ORIGIN_BACKEND_URL).toString() : cursorBackendUrl;
}
function authClientIdOf(backendUrl, override) {
  if (override != null && override.length > 0) return override;
  const hostname2 = new URL(backendUrl).hostname;
  return isDevBackendHostname(hostname2) ? DEV_AUTH_CLIENT_ID : PROD_AUTH_CLIENT_ID;
}

