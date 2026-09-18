var DEFAULT_KEEPALIVE_PROBE_DELAY_MS;
var init_mcp_fsm_timing_config = __esm({
  "../packages/mcp-core/dist/config/mcp-fsm-timing-config.js"() {
    "use strict";
    init_mcp_reconnect_config();
    DEFAULT_KEEPALIVE_PROBE_DELAY_MS = 5 * 6e4;
  }
});
