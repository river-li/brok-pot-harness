function renderHookAdditionalContextContents(hookAdditionalContexts) {
  return hookAdditionalContexts.map((context2) => context2.content.trim()).filter((content) => content.length > 0);
}
function renderHookAdditionalContextSystemReminders(hookAdditionalContexts) {
  return renderHookAdditionalContextContents(hookAdditionalContexts).map((content) => `<system_reminder>
${sanitizeSystemReminderContent(content)}
</system_reminder>`);
}
function appendHookContextRemindersToCoreToolResult(textParts, toolResultContent, contexts) {
  const reminders = renderHookAdditionalContextSystemReminders(contexts);
  for (const text2 of reminders) {
    textParts.push(text2);
    toolResultContent.push({ type: "text", text: text2 });
  }
}
