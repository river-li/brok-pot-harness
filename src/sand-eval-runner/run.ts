/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/sand-eval-runner/run.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createRequestContext(request3) {
  return {
    resolve: () => ({
      osVersion: request3.requestContext?.osVersion,
      shell: request3.requestContext?.shell,
      timeZone: request3.requestContext?.timeZone,
      transcriptsFolder: void 0,
      userFullName: request3.requestContext?.userFullName
    }),
    resolveRules: async () => []
  };
}
function renderDeliveredMessage(message) {
  return message.type === "text" ? message.content : JSON.stringify(message);
}
async function runSandEvalRequest(request3, dependencies) {
  const updates = [];
  const toolCalls3 = [];
  const deliveredMessages = [];
  const inferenceRequestIds = [];
  const selectedImages = request3.selectedImages?.map((image2) => ({
    data: new Uint8Array(Buffer.from(image2.dataBase64, "base64")),
    ...image2.mimeType == null ? {} : { mimeType: image2.mimeType }
  }));
  let tokenUsage;
  let sentMessageCount = 0;
  let lastSentMessageId;
  let reactionApplied = false;
  const transport = {
    onUpdate(update) {
      updates.push(update);
      if (update.type === "send-message") {
        deliveredMessages.push(renderDeliveredMessage(update.message));
        sentMessageCount += 1;
        lastSentMessageId = `sand-eval-message-${sentMessageCount}`;
      } else if (update.type === "react-to-message") {
        reactionApplied = true;
      } else if (update.type === "tool-call") {
        toolCalls3.push(update);
      } else if (update.type === "turn-ended") {
        tokenUsage = mergeTurnUsage(tokenUsage, update.usage);
      }
    },
    lastSentMessageId: () => lastSentMessageId,
    lastReactionApplied: () => reactionApplied
  };
  const desktopDisplay = request3.desktop?.display;
  const box = new LocalExecSandBox(
    request3.workspacePath,
    [],
    desktopDisplay == null ? {} : { computerUseDisplay: desktopDisplay }
  );
  let turnMessages = [];
  const inference = {
    ...dependencies.inference,
    createSession: (onRequestId, options2) => dependencies.inference.createSession((requestId) => {
      inferenceRequestIds.push(requestId);
      onRequestId(requestId);
    }, options2),
    recordPostTurnLabeling: (args) => {
      turnMessages = args.messages;
      dependencies.inference.recordPostTurnLabeling?.(args);
    }
  };
  const conversationHistory = buildSandEvalConversationHistory2(request3);
  const runner = createSandEvalRunner({
    inference,
    streamTuning: dependencies.streamTuning,
    box,
    remoteBox: box,
    remoteBoxHasDesktop: desktopDisplay != null,
    transport,
    requestContext: createRequestContext(request3),
    ...request3.requestContext?.simulatedTime == null ? {} : { modelVisibleTime: new Date(request3.requestContext.simulatedTime) },
    webSearchService: dependencies.webSearchService,
    webFetchService: dependencies.webFetchService,
    ...dependencies.mcp == null ? {} : { mcp: dependencies.mcp },
    ...request3.systemPrompt == null ? {} : { systemPrompt: request3.systemPrompt },
    ...request3.disabledToolIdentifiers == null ? {} : { disabledToolIdentifiers: request3.disabledToolIdentifiers }
  });
  try {
    const result = await runSandAgentToPause(runner, {
      prompt: request3.prompt,
      runOptions: {
        inferenceRequestId: request3.runId,
        recentUserMessages: [{ id: `${request3.runId}-user`, text: request3.prompt }],
        requestSource: "turn",
        ...conversationHistory == null ? {} : { conversationHistory },
        ...selectedImages == null ? {} : { selectedImages },
        onModelResolved: () => {
        }
      },
      revivalRunOptions: (revivalIndex) => ({
        inferenceRequestId: `${request3.runId}-subagent-revival-${revivalIndex}`,
        requestSource: "turn",
        onModelResolved: () => {
        }
      })
    });
    return {
      protocolVersion: SAND_EVAL_RUNNER_PROTOCOL_VERSION,
      runId: request3.runId,
      status: "completed",
      finalAssistantMessage: selectSandEvalFinalMessage({
        deliveredMessages,
        systemPrompt: request3.systemPrompt,
        assistantText: result.text
      }),
      sentMessageCount,
      reacted: reactionApplied,
      toolCalls: toolCalls3,
      updates,
      turnMessages,
      inferenceRequestIds,
      ...tokenUsage == null ? {} : { tokenUsage }
    };
  } catch (error3) {
    return {
      protocolVersion: SAND_EVAL_RUNNER_PROTOCOL_VERSION,
      runId: request3.runId,
      status: "failed",
      finalAssistantMessage: deliveredMessages.join("\n\n"),
      sentMessageCount,
      reacted: reactionApplied,
      toolCalls: toolCalls3,
      updates,
      turnMessages,
      inferenceRequestIds,
      ...tokenUsage == null ? {} : { tokenUsage },
      error: serializeSandEvalRunnerError(error3)
    };
  }
}

