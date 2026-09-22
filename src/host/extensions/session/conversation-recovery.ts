function outlineTurnRequestIds(state) {
  const requestIds = [];
  for (const { turn } of state.turns) {
    if (turn.case === "agentConversationTurn") requestIds.push(turn.value.requestId);
    else if (turn.case === "shellConversationTurn") requestIds.push(void 0);
  }
  return requestIds;
}
function durableTimeMs(...candidates) {
  for (const candidate of candidates) {
    const timeMs = candidate == null ? void 0 : Number(candidate);
    if (isValidTimestampMs(timeMs)) return timeMs;
  }
  return void 0;
}
function outlineItemTimes(state) {
  const times = /* @__PURE__ */ new Map();
  for (const [turnIndex, { turn }] of state.turns.entries()) {
    if (turn.case !== "agentConversationTurn") continue;
    const { userMessage: userMessage2, steps } = turn.value;
    const userTimeMs = durableTimeMs(userMessage2?.startedAtMs, userMessage2?.completedAtMs);
    if (userTimeMs != null) times.set(`outline-user-${turnIndex}`, userTimeMs);
    for (const [stepIndex, { message }] of steps.entries()) {
      if (message.case !== "toolCall") continue;
      const stepTimeMs = durableTimeMs(message.value.startedAtMs, message.value.completedAtMs);
      if (stepTimeMs != null) times.set(`outline-${turnIndex}-${stepIndex}`, stepTimeMs);
    }
  }
  return times;
}
function rebuildTranscriptEntriesFromState(state) {
  return rebuildTranscriptEntriesFromOutline(
    deriveOutlineTurnsFromConversationState(state),
    outlineTurnRequestIds(state),
    outlineItemTimes(state)
  );
}
function rebuildTranscriptEntriesFromOutline(outlineTurns, requestIds, itemTimes) {
  const entries = [];
  const turnRequestIds = requestIds.length === outlineTurns.length ? requestIds : [];
  for (const [turnIndex, turn] of outlineTurns.entries()) {
    if ((turn.userMessageId.length === 0 || isOffRecordMessageId(turn.userMessageId)) && isGroupTurnPromptText(turn.rawUserText)) {
      continue;
    }
    const requestId2 = turnRequestIds[turnIndex];
    const originalOf = (itemId) => {
      const timestampMs2 = itemTimes.get(itemId);
      if (timestampMs2 == null) return {};
      return requestId2 != null && requestId2.length > 0 ? { timestampMs: timestampMs2, requestId: requestId2 } : { timestampMs: timestampMs2 };
    };
    for (const item of turn.items) {
      if (item.kind === "user") {
        if (item.hidden) continue;
        entries.push({
          kind: "message",
          id: rebuiltEntryId(item.id),
          role: "user",
          content: item.text,
          isStreaming: false,
          ...originalOf(item.id)
        });
      } else if (item.kind === "send-message") {
        entries.push({
          kind: "send-message",
          id: rebuiltEntryId(item.id),
          message: item.message,
          ...originalOf(item.id)
        });
      } else if (item.kind === "tool-call") {
        const { timestampMs: timestampMs2 } = originalOf(item.id);
        entries.push({
          kind: "tool-call",
          id: rebuiltEntryId(item.id),
          name: item.name,
          status: item.status,
          ...item.summary != null ? { summary: item.summary } : {},
          ...timestampMs2 != null ? { timestampMs: timestampMs2 } : {}
        });
      }
    }
  }
  return entries;
}
function selectHiddenArtifactEntryIds(entries, outline) {
  const outlineById = new Map(outline.map((item) => [item.id, item]));
  const ids = [];
  for (const entry of entries) {
    if (entry.kind !== "message" || entry.role !== "user") continue;
    if (!isRebuiltEntry(entry)) continue;
    const source = outlineById.get(entry.id.slice(REBUILT_ENTRY_ID_PREFIX.length));
    if (source?.kind === "user" && source.hidden === true && source.text === entry.content) {
      ids.push(entry.id);
    }
  }
  return ids;
}
async function readDurableTurnRequestIds(ctx, structure, blobStore) {
  if (structure.turns.length === 0) return null;
  const requestIds = [];
  for (const turnBlobId of structure.turns) {
    const turnBlob = await blobStore.getBlob(ctx, turnBlobId);
    if (!turnBlob) return null;
    let turnStructure;
    try {
      turnStructure = ConversationTurnStructure.fromBinary(turnBlob);
    } catch {
      return null;
    }
    switch (turnStructure.turn.case) {
      case "agentConversationTurn": {
        const agentTurn = turnStructure.turn.value;
        if (!await blobStore.getBlob(ctx, agentTurn.userMessage)) return null;
        for (const stepBlobId of agentTurn.steps) {
          if (!await blobStore.getBlob(ctx, stepBlobId)) return null;
        }
        requestIds.push(agentTurn.requestId);
        break;
      }
      case "shellConversationTurn": {
        const shellTurn = turnStructure.turn.value;
        if (!await blobStore.getBlob(ctx, shellTurn.shellCommand)) return null;
        if (!await blobStore.getBlob(ctx, shellTurn.shellOutput)) return null;
        requestIds.push(void 0);
        break;
      }
      default:
        return null;
    }
  }
  for (const todoBlobId of structure.todos) {
    if (!await blobStore.getBlob(ctx, todoBlobId)) return null;
  }
  if (structure.summary != null && structure.summary.length > 0) {
    if (!await blobStore.getBlob(ctx, structure.summary)) return null;
  }
  return requestIds;
}
async function conversationStructureFullyResolves(ctx, structure, blobStore) {
  return await readDurableTurnRequestIds(ctx, structure, blobStore) != null;
}
function applyTurnRequestIds(state, requestIds) {
  if (state.turns.length !== requestIds.length) return;
  for (const [index, requestId2] of requestIds.entries()) {
    const turn = state.turns[index]?.turn;
    if (turn?.case === "agentConversationTurn" && requestId2 != null) {
      turn.value.requestId = requestId2;
    }
  }
}
