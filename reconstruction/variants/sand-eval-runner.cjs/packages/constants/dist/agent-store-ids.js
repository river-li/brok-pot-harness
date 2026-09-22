/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/agent-store-ids.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BARE_UUID_PATTERN, AGENT_STORE_USER_MOUNT_NAME, AGENT_STORE_TEAM_MOUNT_NAME, AGENT_STORE_AUTOMATION_MOUNT_NAME, AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES, NAMED_AGENT_HOME_STORE_MOUNT_NAME, AGENT_STORE_MOUNT_ROOT2, CLOUD_CANVAS_ROOT2, CLOUD_CANVAS_SOURCE_BASENAME, USER_STORE_CANVASES_DIR, AUTOMATION_STORE_CANVASES_DIR, CANVAS_STORE_PERSIST_ROOTS;
var init_agent_store_ids = __esm({
  "../packages/constants/dist/agent-store-ids.js"() {
    "use strict";
    BARE_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    AGENT_STORE_USER_MOUNT_NAME = "user";
    AGENT_STORE_TEAM_MOUNT_NAME = "team";
    AGENT_STORE_AUTOMATION_MOUNT_NAME = "automation";
    AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
    NAMED_AGENT_HOME_STORE_MOUNT_NAME = "home";
    AGENT_STORE_MOUNT_ROOT2 = "/cursor/stores";
    CLOUD_CANVAS_ROOT2 = "canvases";
    CLOUD_CANVAS_SOURCE_BASENAME = "source.canvas.tsx";
    USER_STORE_CANVASES_DIR = `${AGENT_STORE_MOUNT_ROOT2}/${AGENT_STORE_USER_MOUNT_NAME}/${CLOUD_CANVAS_ROOT2}`;
    AUTOMATION_STORE_CANVASES_DIR = `${AGENT_STORE_MOUNT_ROOT2}/${AGENT_STORE_AUTOMATION_MOUNT_NAME}/${CLOUD_CANVAS_ROOT2}`;
    CANVAS_STORE_PERSIST_ROOTS = [
      USER_STORE_CANVASES_DIR,
      AUTOMATION_STORE_CANVASES_DIR
    ];
  }
});

