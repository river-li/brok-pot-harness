init_errors();
async function runTurnMemory(memoryStore, episodeProgress, session, ctx, turnTs, exchange) {
  if (memoryStore.recordMemoryEvidence != null) {
    episodeProgress?.clearPendingEpisodeTurns();
    memoryStore.recordMemoryEvidence({
      occurredAt: turnTs,
      user: exchange.user,
      assistant: exchange.agent
    });
    return;
  }
  await runMemoryExtraction(memoryStore, session, ctx, exchange);
  if (episodeProgress == null) return;
  try {
    episodeProgress.recordEpisodeTurn({
      ts: turnTs,
      user: exchange.user,
      agent: exchange.agent
    });
    const pending = episodeProgress.getPendingEpisodeTurns();
    if (pending.length < getEpisodeInterval()) return;
    try {
      const narrative = await summarizeEpisode({
        executor: session.getExecutor(),
        ctx,
        turns: pending
      });
      if (narrative != null) {
        const latestTs = pending[pending.length - 1]?.ts ?? turnTs;
        memoryStore.addMemory(`${MEMORY_EPISODE_PREFIX}${narrative}`, latestTs, "log");
      }
    } finally {
      episodeProgress.clearPendingEpisodeTurns();
    }
  } catch (error42) {
    process.stderr.write(`sand.memory.episode_summary_failed error_class=${errorLogTag(error42)}
`);
  }
}
async function runMemoryExtraction(memoryStore, session, ctx, exchange) {
  try {
    const existingMemories = gatherExtractionMemories(
      memoryStore.recall(MEMORY_RECENT_PROMPT_LIMIT),
      memoryStore.listMemories(MEMORY_EXTRACTION_ARCHIVE_SCAN_LIMIT),
      `${exchange.user}
${exchange.agent}`
    );
    const extraction = await extractMemories({
      executor: session.getExecutor(),
      ctx,
      userMessage: exchange.user,
      agentMessage: exchange.agent,
      existingMemories
    });
    applyExtractedMemories(memoryStore, extraction, Date.now(), existingMemories);
  } catch (error42) {
    process.stderr.write(`sand.memory.extraction_failed error_class=${errorLogTag(error42)}
`);
  }
}
