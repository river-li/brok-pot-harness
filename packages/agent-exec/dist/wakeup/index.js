/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/wakeup/index.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function mergeWakeup(queue, incoming) {
  if (queue.some((wakeup) => wakeup.conversationId === incoming.conversationId && wakeup.id === incoming.id)) {
    return { queue: [...queue] };
  }
  const ownedIncoming = Object.assign({}, incoming);
  if (incoming.groupKey === void 0) {
    return { queue: [...queue, ownedIncoming] };
  }
  const groupedIndex = queue.findIndex((wakeup) => wakeup.conversationId === incoming.conversationId && wakeup.groupKey === incoming.groupKey);
  if (groupedIndex === -1) {
    return { queue: [...queue, ownedIncoming] };
  }
  const merged = [...queue];
  const replaced = merged[groupedIndex];
  merged[groupedIndex] = ownedIncoming;
  return { queue: merged, replaced };
}

