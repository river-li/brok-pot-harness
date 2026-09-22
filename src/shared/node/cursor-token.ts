/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/cursor-token.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseJwtPayload(token) {
  const [, payload] = token.split(".");
  if (payload == null || payload.length === 0) return null;
  try {
    const raw = Buffer.from(payload, "base64url").toString("utf8");
    const parsed2 = jwtPayloadSchema.safeParse(JSON.parse(raw));
    return parsed2.success ? parsed2.data : null;
  } catch {
    return null;
  }
}
function accountSubjectScope(subject) {
  if (subject == null || subject.length === 0) return void 0;
  return accountScopeOfPrincipal({ principal: subject });
}
function tokenSubjectScope(accessToken) {
  if (accessToken == null) return void 0;
  return accountSubjectScope(parseJwtPayload(accessToken)?.sub);
}
function accountScopeOfPrincipal({ principal }) {
  return (0, import_node_crypto5.createHash)("sha256").update(principal).digest("hex");
}
function accountScopeOfToken({ accessToken }) {
  return accountScopeOfPrincipal({ principal: parseJwtPayload(accessToken)?.sub ?? accessToken });
}
function getAccessTokenExpiryMs(token) {
  const payload = parseJwtPayload(token);
  return payload?.exp != null ? payload.exp * 1e3 : null;
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
function dashboardUrlOf(readBackendUrl) {
  let backendHostname;
  try {
    backendHostname = new URL(readBackendUrl()).hostname.toLowerCase();
  } catch {
    return DEFAULT_CURSOR_DASHBOARD_URL;
  }
  return isLocalDevBackendHostname(backendHostname) ? DEFAULT_LOCAL_DASHBOARD_URL : DEFAULT_CURSOR_DASHBOARD_URL;
}
function authClientIdOf(backendUrl, override) {
  if (override != null && override.length > 0) return override;
  const hostname3 = new URL(backendUrl).hostname;
  return isDevBackendHostname(hostname3) ? DEV_AUTH_CLIENT_ID : PROD_AUTH_CLIENT_ID;
}
function isLocalDevBackendHostname(hostname3) {
  return hostname3 === "127.0.0.1" || hostname3 === "[::1]" || !hostname3.includes(".");
}
var import_node_crypto5, DEFAULT_CURSOR_BACKEND_URL, DEFAULT_ORIGIN_BACKEND_URL, DEFAULT_CURSOR_DASHBOARD_URL, DEFAULT_LOCAL_DASHBOARD_URL, PROD_AUTH_CLIENT_ID, DEV_AUTH_CLIENT_ID, TOKEN_REFRESH_LEEWAY_MS, jwtPayloadSchema;
var init_cursor_token = __esm({
  "src/shared/node/cursor-token.ts"() {
    "use strict";
    import_node_crypto5 = require("node:crypto");
    init_zod();
    init_dev_login();
    DEFAULT_CURSOR_BACKEND_URL = "https://api2.cursor.sh";
    DEFAULT_ORIGIN_BACKEND_URL = "https://api.origin.cursor.com";
    DEFAULT_CURSOR_DASHBOARD_URL = "https://cursor.com";
    DEFAULT_LOCAL_DASHBOARD_URL = "http://localhost:4000";
    PROD_AUTH_CLIENT_ID = "KbZUR41cY7W6zRSdpSUJ7I7mLYBKOCmB";
    DEV_AUTH_CLIENT_ID = "OzaBXLClY5CAGxNzUhQ2vlknpi07tGuE";
    TOKEN_REFRESH_LEEWAY_MS = 5 * 60 * 1e3;
    jwtPayloadSchema = external_exports.object({
      email: external_exports.string().optional(),
      exp: external_exports.number().optional(),
      sub: external_exports.string().optional()
    }).passthrough();
  }
});

