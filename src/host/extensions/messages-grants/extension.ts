/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/messages-grants/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();

// @recovered-fragment 2/2
var messagesGrantsExtension = defineHostExtension({
  id: "messages-grants",
  dependencies: [],
  start: () => createMessagesGrantsAsks({ clock: realClock, ttlMs: SAND_MESSAGES_GRANTS_ASK_TTL_MS })
});

