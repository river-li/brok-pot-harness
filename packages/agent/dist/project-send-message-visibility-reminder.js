/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/project-send-message-visibility-reminder.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PROJECT_SEND_MESSAGE_REQUEST_BOUNDARY_PROVIDER_KEY = "projectSendMessageRequestBoundary";
var PROJECT_SEND_MESSAGE_REMINDER_PROVIDER_KEY = "projectSendMessageReminder";
var PROJECT_SEND_MESSAGE_CONTINUATION_MESSAGE = "<system_reminder>Your response was not visible to the user. Call SendMessage to send a user-visible update or final response.</system_reminder>";
function getProjectSendMessageCursorProviderOptions(message) {
  const cursor = message.providerOptions?.cursor;
  if (cursor === null || typeof cursor !== "object" || Array.isArray(cursor)) {
    return void 0;
  }
  return {
    [PROJECT_SEND_MESSAGE_REQUEST_BOUNDARY_PROVIDER_KEY]: cursor[PROJECT_SEND_MESSAGE_REQUEST_BOUNDARY_PROVIDER_KEY] === true,
    [PROJECT_SEND_MESSAGE_REMINDER_PROVIDER_KEY]: cursor[PROJECT_SEND_MESSAGE_REMINDER_PROVIDER_KEY] === true
  };
}
function hasProjectSendMessageReminderForCurrentRequest(messages2) {
  for (let index = messages2.length - 1; index >= 0; index -= 1) {
    const cursor = getProjectSendMessageCursorProviderOptions(messages2[index]);
    if (cursor?.[PROJECT_SEND_MESSAGE_REMINDER_PROVIDER_KEY] === true) {
      return true;
    }
    if (cursor?.[PROJECT_SEND_MESSAGE_REQUEST_BOUNDARY_PROVIDER_KEY] === true) {
      return false;
    }
  }
  return false;
}
function createProjectSendMessageVisibilityReminder() {
  return {
    role: "user",
    content: PROJECT_SEND_MESSAGE_CONTINUATION_MESSAGE,
    providerOptions: {
      cursor: {
        [PROJECT_SEND_MESSAGE_REMINDER_PROVIDER_KEY]: true
      }
    }
  };
}

