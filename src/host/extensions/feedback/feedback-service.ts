init_aiserver_connect();
init_aiserver_pb();
init_cursor_inference();
function createSandFeedbackReporter(deps, client = createSandCursorBackendClient(AiService, deps)) {
  return async (report) => {
    await client.reportAgentFeedback(
      new ReportAgentFeedbackRequest({
        requestId: report.requestId,
        sentiment: report.sentiment === "up" ? ReportAgentFeedbackRequest_Sentiment.UP : ReportAgentFeedbackRequest_Sentiment.DOWN,
        categories: [...report.categories],
        ...report.comment != null && report.comment.length > 0 ? { comment: report.comment } : {},
        source: ReportAgentFeedbackRequest_Source.SAND,
        variant: ReportAgentFeedbackRequest_Variant.PROMINENT
      })
    );
  };
}
var SandFeedbackService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  async voteFeedback(args) {
    const { agentId, entryId, action } = args;
    if (action === "revert") {
      const reverted = await this.deps.transcript.setFeedbackVote({
        agentId,
        entryId,
        state: "prompt"
      });
      if (reverted == null) throw new SandFeedbackVoteTargetError();
      this.deps.trackDialogDismissed(agentId);
      return;
    }
    const sentiment = action === "up" ? "up" : "down";
    const entry = await this.deps.transcript.setFeedbackVote({
      agentId,
      entryId,
      state: action === "down" ? "improve" : "voted",
      sentiment
    });
    if (entry == null) throw new SandFeedbackVoteTargetError();
    const categories = action === "submit" ? args.categories ?? [] : [];
    const comment = action === "submit" ? args.comment : void 0;
    if (action === "submit") {
      this.deps.trackSubmitted(agentId, {
        categoryCount: categories.length,
        hasComment: comment != null && comment.length > 0
      });
    } else {
      this.deps.trackVote(agentId, sentiment);
    }
    try {
      await this.deps.report({
        requestId: entry.requestId,
        sentiment,
        categories,
        ...comment != null ? { comment } : {}
      });
    } catch (error41) {
      this.deps.logReportFailure(`feedback report failed: ${String(error41)}`);
    }
  }
};
