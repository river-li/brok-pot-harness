/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-config-error.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandMcpConfigError = class extends SandDomainError {
  constructor(message, failure2) {
    super(message);
    this.failure = failure2;
  }
  failure;
  name = "SandMcpConfigError";
};

