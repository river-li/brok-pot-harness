function isReservedAgentStorePathSegment(segment) {
  return segment.slice(0, AGENT_STORE_RESERVED_CURSOR_PATH_PREFIX.length).toLowerCase() === AGENT_STORE_RESERVED_CURSOR_PATH_PREFIX;
}
function parsePositiveSafeInteger(value) {
  const parsed2 = Number(value);
  return Number.isSafeInteger(parsed2) && parsed2 > 0 ? parsed2 : void 0;
}
function parseUserAgentStoreSourceId(sourceId) {
  const match2 = AGENT_STORE_USER_SOURCE_ID_PATTERN.exec(sourceId);
  if (match2 === null || match2[2] === void 0) {
    return void 0;
  }
  const userId = parsePositiveSafeInteger(match2[2]);
  const teamId = match2[1] === void 0 ? void 0 : parsePositiveSafeInteger(match2[1]);
  if (userId === void 0 || match2[1] !== void 0 && teamId === void 0) {
    return void 0;
  }
  return { userId, teamId };
}
function parseTeamAgentStoreSourceId(sourceId) {
  const match2 = AGENT_STORE_TEAM_SOURCE_ID_PATTERN.exec(sourceId);
  if (match2 === null || match2[1] === void 0) {
    return void 0;
  }
  const teamId = parsePositiveSafeInteger(match2[1]);
  return teamId === void 0 ? void 0 : { teamId };
}
function isValidBareUuid(agentId) {
  return BARE_UUID_PATTERN.test(agentId);
}
function isCloudAgentStoreId(agentId) {
  return CLOUD_AGENT_STORE_ID_PATTERN.test(agentId);
}
function isAgentStoreId(storeId) {
  return AGENT_STORE_ID_PATTERN.test(storeId);
}
function isAgentStoreSourceId(sourceId) {
  return isCloudAgentStoreId(sourceId) || isValidBareUuid(sourceId);
}
function isAgentStoreShareMountKey(mountKey) {
  return AGENT_STORE_SHARE_ID_PATTERN.test(mountKey);
}
var BARE_UUID_PATTERN, AGENT_STORE_ID_PATTERN, AGENT_STORE_SHARE_ID_PATTERN, CLOUD_AGENT_STORE_ID_PATTERN, AGENT_STORE_USER_SOURCE_ID_PATTERN, AGENT_STORE_TEAM_SOURCE_ID_PATTERN, AGENT_STORE_USER_MOUNT_NAME, AGENT_STORE_TEAM_MOUNT_NAME, AGENT_STORE_AUTOMATION_MOUNT_NAME, AGENT_STORE_RESERVED_CURSOR_PATH_PREFIX, AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES, NAMED_AGENT_HOME_STORE_MOUNT_NAME, AGENT_STORE_MOUNT_ROOT, CLOUD_CANVAS_ROOT, CLOUD_CANVAS_SOURCE_BASENAME, USER_STORE_CANVASES_DIR, AUTOMATION_STORE_CANVASES_DIR, CANVAS_STORE_PERSIST_ROOTS;
var init_agent_store_ids = __esm({
  "../packages/constants/dist/agent-store-ids.js"() {
    "use strict";
    BARE_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    AGENT_STORE_ID_PATTERN = /^store-[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    AGENT_STORE_SHARE_ID_PATTERN = /^store-[A-Za-z0-9_-]{24}$/;
    CLOUD_AGENT_STORE_ID_PATTERN = /^bc-(?:[0-9a-z][0-9a-z-]*-)?[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    AGENT_STORE_USER_SOURCE_ID_PATTERN = /^(?:t([1-9][0-9]*)-)?u([1-9][0-9]*)$/;
    AGENT_STORE_TEAM_SOURCE_ID_PATTERN = /^t([1-9][0-9]*)$/;
    AGENT_STORE_USER_MOUNT_NAME = "user";
    AGENT_STORE_TEAM_MOUNT_NAME = "team";
    AGENT_STORE_AUTOMATION_MOUNT_NAME = "automation";
    AGENT_STORE_RESERVED_CURSOR_PATH_PREFIX = ".cursor";
    AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
    NAMED_AGENT_HOME_STORE_MOUNT_NAME = "home";
    AGENT_STORE_MOUNT_ROOT = "/cursor/stores";
    CLOUD_CANVAS_ROOT = "canvases";
    CLOUD_CANVAS_SOURCE_BASENAME = "source.canvas.tsx";
    USER_STORE_CANVASES_DIR = `${AGENT_STORE_MOUNT_ROOT}/${AGENT_STORE_USER_MOUNT_NAME}/${CLOUD_CANVAS_ROOT}`;
    AUTOMATION_STORE_CANVASES_DIR = `${AGENT_STORE_MOUNT_ROOT}/${AGENT_STORE_AUTOMATION_MOUNT_NAME}/${CLOUD_CANVAS_ROOT}`;
    CANVAS_STORE_PERSIST_ROOTS = [
      USER_STORE_CANVASES_DIR,
      AUTOMATION_STORE_CANVASES_DIR
    ];
  }
});
