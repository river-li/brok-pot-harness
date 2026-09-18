var init_coordinator = __esm({
  "../packages/mcp-core/dist/fsm/coordinator.js"() {
    "use strict";
    init_auth_fsm();
    init_connection_fsm();
    init_projection();
  }
});
