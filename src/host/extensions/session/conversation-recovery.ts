init_agent_pb();
function rebuildTranscriptEntriesFromState(state) {
  const entries = [];
  for (const turn of deriveOutlineTurnsFromConversationState(state)) {
    if ((turn.userMessageId.length === 0 || isOffRecordMessageId(turn.userMessageId)) && isGroupTurnPromptText(turn.rawUserText)) {
      continue;
    }
    for (const item of turn.items) {
      if (item.kind === "user") {
        if (item.hidden) continue;
        entries.push({
          kind: "message",
          id: `recovered-${item.id}`,
          role: "user",
          content: item.text,
          isStreaming: false
        });
      } else if (item.kind === "send-message") {
        entries.push({
          kind: "send-message",
          id: `recovered-${item.id}`,
          message: item.message
        });
      } else if (item.kind === "tool-call") {
        entries.push({
          kind: "tool-call",
          id: `recovered-${item.id}`,
          name: item.name,
          status: item.status,
          ...item.summary != null ? { summary: item.summary } : {}
        });
      }
    }
  }
  return entries;
}
var REBUILT_ENTRY_ID_PREFIX = "recovered-";
function selectHiddenArtifactEntryIds(entries, outline) {
  const outlineById = new Map(outline.map((item) => [item.id, item]));
  const ids = [];
  for (const entry of entries) {
    if (entry.kind !== "message" || entry.role !== "user") continue;
    if (!entry.id.startsWith(REBUILT_ENTRY_ID_PREFIX)) continue;
    const source = outlineById.get(entry.id.slice(REBUILT_ENTRY_ID_PREFIX.length));
    if (source?.kind === "user" && source.hidden === true && source.text === entry.content) {
      ids.push(entry.id);
    }
  }
  return ids;
}
async function conversationStructureFullyResolves(ctx, structure, blobStore) {
  if (structure.turns.length === 0) return false;
  for (const turnBlobId of structure.turns) {
    const turnBlob = await blobStore.getBlob(ctx, turnBlobId);
    if (!turnBlob) return false;
    let turnStructure;
    try {
      turnStructure = ConversationTurnStructure.fromBinary(turnBlob);
    } catch {
      return false;
    }
    switch (turnStructure.turn.case) {
      case "agentConversationTurn": {
        const agentTurn = turnStructure.turn.value;
        if (!await blobStore.getBlob(ctx, agentTurn.userMessage)) return false;
        for (const stepBlobId of agentTurn.steps) {
          if (!await blobStore.getBlob(ctx, stepBlobId)) return false;
        }
        break;
      }
      case "shellConversationTurn": {
        const shellTurn = turnStructure.turn.value;
        if (!await blobStore.getBlob(ctx, shellTurn.shellCommand)) return false;
        if (!await blobStore.getBlob(ctx, shellTurn.shellOutput)) return false;
        break;
      }
      default:
        return false;
    }
  }
  for (const todoBlobId of structure.todos) {
    if (!await blobStore.getBlob(ctx, todoBlobId)) return false;
  }
  if (structure.summary != null && structure.summary.length > 0) {
    if (!await blobStore.getBlob(ctx, structure.summary)) return false;
  }
  return true;
}
