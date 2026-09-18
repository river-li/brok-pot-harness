async function applyRemindersToToolResults(responseMessages, reminders, currentTodos, conversationMessages) {
  if (reminders.length === 0) {
    return;
  }
  const context2 = buildReminderContext(conversationMessages, currentTodos, responseMessages);
  const triggeredReminders = [];
  for (const reminder of reminders) {
    if (reminder.shouldTrigger(context2)) {
      const text2 = reminder.generate(context2);
      if (text2 && text2.length > 0) {
        triggeredReminders.push(text2);
      }
    }
  }
  if (triggeredReminders.length > 0) {
    const combinedReminderText = triggeredReminders.join("\n\n");
    const toolMessages = responseMessages.filter((m2) => m2.role === "tool" && Array.isArray(m2.content));
    if (toolMessages.length > 0) {
      const lastToolMessage = toolMessages[toolMessages.length - 1];
      if (lastToolMessage && Array.isArray(lastToolMessage.content)) {
        const lastToolResult = lastToolMessage.content[lastToolMessage.content.length - 1];
        if (lastToolResult && lastToolResult.type === "tool-result") {
          if (Array.isArray(lastToolResult.experimental_content)) {
            lastToolResult.experimental_content.push({
              type: "text",
              text: combinedReminderText
            });
          }
        }
      }
    }
  }
}
