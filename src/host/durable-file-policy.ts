/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/durable-file-policy.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_UPGRADE_RESUME_FILE_NAME = "host-upgrade-resume.json";
var SAND_ACK_OBLIGATIONS_FILE_NAME = "ack-obligations.json";
var SAND_PENDING_WAKE_FILE_NAME = "host-pending-wakes.json";
var SAND_DISK_PRESSURE_REMINDERS_FILE_NAME = "host-disk-pressure-reminders.json";
var SAND_FEEDBACK_PROMPT_FILE_NAME = "feedback-prompt.json";
var BOX_STORE_SAND_DATA_EXCLUDED_FILE_NAMES = [
  SAND_UPGRADE_RESUME_FILE_NAME,
  SAND_ACK_OBLIGATIONS_FILE_NAME,
  SAND_PENDING_WAKE_FILE_NAME,
  SAND_DISK_PRESSURE_REMINDERS_FILE_NAME,
  "sand-statsig-bootstrap.json"
];
var BOX_HOME_FOREIGN_MOUNT_NAMES = ["dev-credentials", "box-store"];
function isBoxHomeForeignMountPath(relPath) {
  return BOX_HOME_FOREIGN_MOUNT_NAMES.some((name17) => relPath.startsWith(`home/box/${name17}/`));
}

