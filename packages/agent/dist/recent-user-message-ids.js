var RECENT_USER_MESSAGE_ID_INDEX_LIMIT = 64;
function appendRecentUserMessageId(index, messageId, limit = RECENT_USER_MESSAGE_ID_INDEX_LIMIT) {
  const id = messageId?.trim() ?? "";
  if (id.length === 0) {
    return 0;
  }
  index.push(id);
  const overflow = index.length - limit;
  if (overflow > 0) {
    index.splice(0, overflow);
    return overflow;
  }
  return 0;
}
function resolveUserTurnMessageIdsFromIndex(index, args) {
  if (args.messageIds.size === 0) {
    return /* @__PURE__ */ new Set();
  }
  if (index.length === 0 && args.olderTurnCount !== 0) {
    return void 0;
  }
  const found = /* @__PURE__ */ new Set();
  const stopAt = args.stopAtMessageId?.trim() ?? "";
  let reachedFloor = false;
  for (let i = index.length - 1; i >= 0; i--) {
    const messageId = index[i].trim();
    if (messageId.length === 0) {
      continue;
    }
    if (args.messageIds.has(messageId)) {
      found.add(messageId);
      if (found.size === args.messageIds.size) {
        return found;
      }
    }
    if (stopAt.length > 0 && messageId === stopAt) {
      reachedFloor = true;
      break;
    }
  }
  if (found.size === args.messageIds.size) {
    return found;
  }
  if (reachedFloor || args.olderTurnCount === 0) {
    return found;
  }
  return void 0;
}
