var SYSTEM_NOTIFICATION_TAG, SYSTEM_NOTIFICATION_OPEN_TAG, SYSTEM_NOTIFICATION_CLOSE_TAG;
var init_system_notification = __esm({
  "../packages/constants/dist/system-notification.js"() {
    "use strict";
    SYSTEM_NOTIFICATION_TAG = "system_notification";
    SYSTEM_NOTIFICATION_OPEN_TAG = `<${SYSTEM_NOTIFICATION_TAG}>`;
    SYSTEM_NOTIFICATION_CLOSE_TAG = `</${SYSTEM_NOTIFICATION_TAG}>`;
  }
});
