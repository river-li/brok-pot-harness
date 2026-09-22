/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/transport/mcp-sandbox-unavailable-error.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var McpSandboxUnavailableError;
var init_mcp_sandbox_unavailable_error = __esm({
  "../packages/mcp-core/dist/transport/mcp-sandbox-unavailable-error.js"() {
    "use strict";
    McpSandboxUnavailableError = class extends Error {
      constructor(serverName, cause) {
        super(`MCP server "${serverName}" requires sandboxing because MCP Network Controls are enabled, but the sandbox is not supported on this platform or system. The server was not started.`);
        this.serverName = serverName;
        this.name = "McpSandboxUnavailableError";
        if (cause !== void 0) {
          this.cause = cause;
        }
      }
    };
  }
});

