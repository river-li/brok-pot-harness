var messagesGrantsExtension = defineHostExtension({
  id: "messages-grants",
  dependencies: [],
  start: () => createMessagesGrantsAsks({ clock: realClock, ttlMs: SAND_MESSAGES_GRANTS_ASK_TTL_MS })
});
