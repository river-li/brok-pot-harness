/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/agent-store.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter50 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var AgentModes = ["default", "plan", "debug", "search"];
var ApprovalModeSettings = ["allowlist", "unrestricted", "auto-review"];
var agentModeSet = new Set(AgentModes);
var approvalModeSettingSet = new Set(ApprovalModeSettings);
var todoItemSerde = new ProtoSerde(TodoItem);
var userMessageSerde = new ProtoSerde(UserMessage);
var conversationStepSerde = new ProtoSerde(ConversationStep);
var conversationTurnStructureSerde = new ProtoSerde(ConversationTurnStructure);
var conversationSummarySerde = new ProtoSerde(ConversationSummary);
var shellCommandSerde = new ProtoSerde(ShellCommand);
var shellOutputSerde = new ProtoSerde(ShellOutput);
function deriveConversationStateFromStructure(ctx, structure, blobStore) {
  return __awaiter50(this, void 0, void 0, function* () {
    const newState = new ConversationState();
    const turns = [];
    const turnBlobs = structure.turns;
    for (const turnBlobId of turnBlobs) {
      const turnBlob = yield blobStore.getBlob(ctx, turnBlobId);
      if (!turnBlob)
        continue;
      const turnStructure = conversationTurnStructureSerde.deserialize(turnBlob);
      let conversationTurn;
      switch (turnStructure.turn.case) {
        case "agentConversationTurn": {
          const agentTurnStructure = turnStructure.turn.value;
          const userMessageBlob = yield blobStore.getBlob(ctx, agentTurnStructure.userMessage);
          if (!userMessageBlob)
            continue;
          const userMessage = userMessageSerde.deserialize(userMessageBlob);
          const steps = [];
          for (const stepBlobId of agentTurnStructure.steps) {
            const stepBlob = yield blobStore.getBlob(ctx, stepBlobId);
            if (stepBlob) {
              const step = conversationStepSerde.deserialize(stepBlob);
              steps.push(step);
            }
          }
          const agentTurn = new AgentConversationTurn({ userMessage, steps });
          conversationTurn = new ConversationTurn({
            turn: { case: "agentConversationTurn", value: agentTurn }
          });
          break;
        }
        case "shellConversationTurn": {
          const shellTurnStructure = turnStructure.turn.value;
          const shellCommandBlob = yield blobStore.getBlob(ctx, shellTurnStructure.shellCommand);
          if (!shellCommandBlob)
            continue;
          const shellCommand = shellCommandSerde.deserialize(shellCommandBlob);
          const shellOutputBlob = yield blobStore.getBlob(ctx, shellTurnStructure.shellOutput);
          if (!shellOutputBlob)
            continue;
          const shellOutput = shellOutputSerde.deserialize(shellOutputBlob);
          const shellTurn = new ShellConversationTurn({
            shellCommand,
            shellOutput
          });
          conversationTurn = new ConversationTurn({
            turn: { case: "shellConversationTurn", value: shellTurn }
          });
          break;
        }
      }
      if (!conversationTurn)
        continue;
      turns.push(conversationTurn);
    }
    newState.turns = turns;
    const todos = [];
    for (const todoBlobId of structure.todos) {
      const todoBlob = yield blobStore.getBlob(ctx, todoBlobId);
      if (todoBlob) {
        const todo = todoItemSerde.deserialize(todoBlob);
        todos.push(todo);
      }
    }
    newState.todos = todos;
    if (structure.summary) {
      const summaryBlob = yield blobStore.getBlob(ctx, structure.summary);
      if (summaryBlob) {
        const summary = conversationSummarySerde.deserialize(summaryBlob);
        newState.summary = summary;
      }
    }
    return newState;
  });
}

