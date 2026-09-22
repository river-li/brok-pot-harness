var backgroundSummarizationTurnEndHoldMs = createHistogram("agent.background_summarization.turn_end_hold_ms", {
  description: "Wall time a turn stayed open waiting on an in-flight background summarization, by how the hold ended",
  labelNames: ["outcome", "model", "summarizer"]
});
