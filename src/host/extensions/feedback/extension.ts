var feedbackExtension = defineHostExtension({
  id: "feedback",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: (context2) => {
    const { auth: auth2, experiments, telemetry, transcript } = context2.deps;
    const { backend } = context2.host.environment;
    const logWarning = (line) => telemetry.logs.reportHostLog("warn", line);
    const service = new SandFeedbackService({
      transcript: transcript.feedback,
      report: createSandFeedbackReporter({
        backend,
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: auth2.getMachineId
      }),
      trackVote: (agentId, sentiment) => telemetry.analytics.trackEvent("sand.feedback.vote", {
        agent_id: agentId,
        sentiment
      }),
      trackDialogDismissed: (agentId) => telemetry.analytics.trackEvent("sand.feedback.dialog_dismissed", {
        agent_id: agentId
      }),
      trackSubmitted: (agentId, facts) => telemetry.analytics.trackEvent("sand.feedback.submitted", {
        agent_id: agentId,
        category_count: facts.categoryCount,
        has_comment: facts.hasComment
      }),
      logReportFailure: logWarning
    });
    const sampler = createFeedbackSampler({
      getConfig: () => experiments.getDynamicConfig("sand_feedback_prompt_config", { disableExposureLog: true }),
      store: new SandFeedbackPromptStore(getSandRootDir(), logWarning),
      appendPrompt: (event) => transcript.feedback.appendFeedbackPrompt(event),
      onPromptShown: (agentId) => telemetry.analytics.trackEvent("sand.feedback.prompt_shown", {
        agent_id: agentId
      }),
      reportAppendFailure: (errorClass) => logWarning(`[sand:feedback] prompt append failed (${errorClass})`)
    });
    context2.onStop(
      context2.host.events.on(
        "transcript.user-turn-settled",
        (event) => sampler.handleTurnSettled(event)
      )
    );
    const submitProductFeedback = createSandProductFeedbackSubmitter({
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      log: (message) => context2.host.log(message)
    });
    return {
      voteFeedback: (args) => service.voteFeedback(args),
      submitProductFeedback
    };
  }
});
