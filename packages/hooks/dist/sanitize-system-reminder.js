var SYSTEM_REMINDER_TAG_PATTERN = /<(\/?)system_reminder>/gi;
function sanitizeSystemReminderContent(content) {
  return content.replace(SYSTEM_REMINDER_TAG_PATTERN, (_match, slash) => `<${slash}system_reminder_>`);
}
