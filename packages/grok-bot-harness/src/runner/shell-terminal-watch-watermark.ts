init_agent_pb();
init_zod();
var watermarkReads = createCounter("grok_bot.confirmed_user_turn_watermark", {
  description: "Confirmed user turn watermark lookups",
  labelNames: ["source"]
});
var storedWatermarkSchema = external_exports.object({
  version: external_exports.literal(1),
  turnCount: external_exports.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  boundaryRef: external_exports.string(),
  firstTurnRef: external_exports.string(),
  compactionEpoch: external_exports.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  lastUserMessageId: external_exports.string().optional(),
  hasUserTurn: external_exports.boolean()
});
function encodeConfirmedUserTurnWatermark(cache3) {
  return new TextEncoder().encode(
    JSON.stringify({
      version: 1,
      turnCount: cache3.turnCount,
      boundaryRef: toHex3(cache3.boundaryRef),
      firstTurnRef: toHex3(cache3.firstTurnRef),
      compactionEpoch: cache3.compactionEpoch,
      lastUserMessageId: cache3.lastUserMessageId,
      hasUserTurn: cache3.hasUserTurn
    })
  );
}
function decodeConfirmedUserTurnWatermark(bytes) {
  if (bytes === void 0 || bytes.byteLength > 16384) return void 0;
  try {
    const parsed2 = storedWatermarkSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    if (!parsed2.success) return void 0;
    const value = parsed2.data;
    if (!value.hasUserTurn && value.lastUserMessageId !== void 0 || value.hasUserTurn && value.turnCount === 0)
      return void 0;
    const refPattern = value.turnCount === 0 ? /^$/ : /^[a-f0-9]{64}$/;
    if (!refPattern.test(value.boundaryRef) || !refPattern.test(value.firstTurnRef)) {
      return void 0;
    }
    return {
      turnCount: value.turnCount,
      boundaryRef: fromHex(value.boundaryRef),
      firstTurnRef: fromHex(value.firstTurnRef),
      compactionEpoch: value.compactionEpoch,
      lastUserMessageId: value.lastUserMessageId,
      hasUserTurn: value.hasUserTurn
    };
  } catch {
    return void 0;
  }
}
function isConfirmedUserTurnWatermarkValid(args) {
  const { cache: cache3, state } = args;
  if (cache3 === void 0 || cache3.compactionEpoch !== state.selfSummaryCount || !Number.isSafeInteger(cache3.turnCount) || cache3.turnCount < 0 || cache3.turnCount > state.turns.length)
    return false;
  if (cache3.turnCount === 0) return !cache3.hasUserTurn;
  const boundaryRef = state.turns[cache3.turnCount - 1];
  const firstRef = state.turns[0];
  return boundaryRef !== void 0 && firstRef !== void 0 && turnRefsEqual(boundaryRef, cache3.boundaryRef) && turnRefsEqual(firstRef, cache3.firstTurnRef);
}
async function findConfirmedUserTurnWatermark(host, state) {
  const blobStore = host.getBlobStore();
  const cached2 = host.getConfirmedUserTurnWatermarkCache();
  const turnCount = state.turns.length;
  const boundaryRef = turnCount > 0 ? state.turns[turnCount - 1].slice() : new Uint8Array();
  const firstTurnRef = turnCount > 0 ? state.turns[0].slice() : new Uint8Array();
  const compactionEpoch = state.selfSummaryCount;
  const cacheValid = isConfirmedUserTurnWatermarkValid({ cache: cached2, state });
  const stopIndex = cacheValid && cached2 !== void 0 ? cached2.turnCount : 0;
  let source = cached2 === void 0 ? "scan" : "invalid";
  if (cacheValid) {
    source = stopIndex === state.turns.length ? "cache" : "incremental";
  }
  watermarkReads.increment(host.ctx, 1, { source });
  const cacheResult = (result) => {
    const next = {
      turnCount,
      boundaryRef,
      firstTurnRef,
      compactionEpoch,
      lastUserMessageId: result.lastUserMessageId,
      hasUserTurn: result.hasUserTurn
    };
    if (!isConfirmedUserTurnWatermarkValid({ cache: next, state })) {
      return { lastUserMessageId: void 0, hasUserTurn: true };
    }
    host.setConfirmedUserTurnWatermarkCache(next);
    return result;
  };
  for (let index = turnCount - 1; index >= stopIndex; index--) {
    const turnBlobId = state.turns[index];
    if (turnBlobId == null || turnBlobId.length === 0) continue;
    let userMessage2;
    try {
      const turnBlob = await blobStore.getBlob(host.ctx, turnBlobId);
      if (turnBlob == null) {
        return { lastUserMessageId: void 0, hasUserTurn: true };
      }
      const turnStructure = ConversationTurnStructure.fromBinary(turnBlob);
      if (turnStructure.turn.case !== "agentConversationTurn") continue;
      const userMessageBlobId = turnStructure.turn.value.userMessage;
      if (userMessageBlobId == null || userMessageBlobId.length === 0) {
        return { lastUserMessageId: void 0, hasUserTurn: true };
      }
      const userMessageBlob = await blobStore.getBlob(host.ctx, userMessageBlobId);
      if (userMessageBlob == null) {
        return { lastUserMessageId: void 0, hasUserTurn: true };
      }
      userMessage2 = UserMessage.fromBinary(userMessageBlob);
    } catch {
      return { lastUserMessageId: void 0, hasUserTurn: true };
    }
    if (userMessage2.text.startsWith(SAND_HIDDEN_PROMPT_MARKER)) continue;
    if (isOffRecordMessageId(userMessage2.messageId)) continue;
    if (userMessage2.messageId.length === 0 && isGroupTurnPromptText(userMessage2.text)) {
      continue;
    }
    return cacheResult({
      lastUserMessageId: userMessage2.messageId,
      hasUserTurn: true
    });
  }
  if (cached2 != null && cacheValid && stopIndex > 0) {
    return cacheResult({
      lastUserMessageId: cached2.lastUserMessageId,
      hasUserTurn: cached2.hasUserTurn
    });
  }
  return cacheResult({ lastUserMessageId: void 0, hasUserTurn: false });
}
function turnRefsEqual(a, b2) {
  if (a.length !== b2.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b2[i]) return false;
  }
  return true;
}
