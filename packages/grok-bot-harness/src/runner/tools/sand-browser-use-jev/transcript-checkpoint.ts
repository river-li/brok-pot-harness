init_agent_pb();
async function checkpointJevTranscript(args) {
  const { ctx, blobStore } = args;
  const put = async (bytes) => {
    const id = await getBlobId(bytes);
    await blobStore.setBlob(ctx, id, bytes);
    return id;
  };
  const now = BigInt(Date.now());
  const userMessage2 = await put(
    new UserMessage({ text: args.prompt, messageId: args.requestId }).toBinary()
  );
  const steps = [];
  if (args.progress.length > 0) {
    steps.push(
      await put(
        new ConversationStep({
          message: {
            case: "thinkingMessage",
            value: new ThinkingMessage({
              text: args.progress.join("\n"),
              startedAtMs: BigInt(args.startedAtMs),
              completedAtMs: now
            })
          }
        }).toBinary()
      )
    );
  }
  steps.push(
    await put(
      new ConversationStep({
        message: {
          case: "assistantMessage",
          value: new AssistantMessage({ text: args.answer, completedAtMs: now })
        }
      }).toBinary()
    )
  );
  const turn = await put(
    new ConversationTurnStructure({
      turn: {
        case: "agentConversationTurn",
        value: new AgentConversationTurnStructure({
          userMessage: userMessage2,
          steps,
          requestId: args.requestId
        })
      }
    }).toBinary()
  );
  await blobStore.flush(ctx);
  await args.agentStore.handleCheckpoint(ctx, new ConversationStateStructure({ turns: [turn] }), {
    awaitingUserInputTurnId: void 0,
    completedTurnId: args.requestId
  });
}
