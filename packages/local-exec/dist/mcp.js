/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/mcp.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var logger37 = createLogger("local-exec:mcp");
function sanitizeServerName(name17) {
  const sanitized = name17.replace(/\s/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
  const normalizedDots = sanitized.replace(/\.+/g, ".");
  if (normalizedDots === "." || normalizedDots === "..") {
    return normalizedDots.replace(/\./g, "_");
  }
  return normalizedDots.length === 0 ? "_" : normalizedDots;
}

