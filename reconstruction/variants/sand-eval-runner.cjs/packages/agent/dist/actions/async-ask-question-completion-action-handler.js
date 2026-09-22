/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/async-ask-question-completion-action-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto23 = require("node:crypto");
init_dist();
var __addDisposableResource39 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources39 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger67 = createLogger("@anysphere/agent");
var AsyncAskQuestionCompletionActionHandler = class extends AbstractUserMessageActionHandler {
  async handle(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource39(env_1, createSpan(parentCtx.withName("handleAsyncAskQuestionCompletionAction")), false);
      const ctx = span.ctx;
      logger67.info(ctx, "Handling async ask-question completion", {
        originalToolCallId: action.originalToolCallId,
        resultCase: action.result?.result.case,
        questionsCount: action.originalArgs?.questions.length ?? 0
      });
      if (!isValidAskQuestionCompletion(action)) {
        logger67.warn(ctx, "Skipping invalid async ask-question completion", {
          originalToolCallId: action.originalToolCallId,
          resultCase: action.result?.result.case
        });
        return await stateHandler.computeNewStructure(ctx);
      }
      if (hasAppliedAskQuestionCompletion(stateHandler, action.originalToolCallId)) {
        logger67.info(ctx, "Skipping duplicate async ask-question completion (already applied)", {
          originalToolCallId: action.originalToolCallId
        });
        return await stateHandler.computeNewStructure(ctx);
      }
      const lastTurnRef = stateHandler.turns.at(-1);
      if (!lastTurnRef) {
        logger67.error(ctx, "No turns available");
        return await stateHandler.computeNewStructure(ctx);
      }
      const lastTurn = await lastTurnRef.get(ctx);
      if (!(lastTurn instanceof AgentConversationTurnHandle)) {
        logger67.error(ctx, "Last turn is not an agent turn");
        return await stateHandler.computeNewStructure(ctx);
      }
      const isTurnFinished = lastTurn.steps.length === 0 || await (async () => {
        const lastStepRef = lastTurn.steps.at(-1);
        if (!lastStepRef)
          return true;
        const lastStep = await lastStepRef.get(ctx);
        return lastStep.message.case !== "toolCall";
      })();
      const requestContext = await getRedactedRequestContext(ctx, void 0, this.resourceAccessor, buildRequestContextOptions(this.config));
      const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
      if (isTurnFinished) {
        logger67.info(ctx, "Current turn is finished, creating new turn", {
          lastTurnSteps: lastTurn.steps.length
        });
        const lastUserMessage = await lastTurn.userMessage.get(ctx);
        const syntheticUserMessage = new UserMessage({
          text: "Continue with the questionnaire results.",
          messageId: (0, import_node_crypto23.randomUUID)(),
          selectedContext: lastUserMessage.selectedContext ? fromRedactedSelectedContext(lastUserMessage.selectedContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0,
          mode: lastUserMessage.mode,
          isSimulatedMsg: true,
          bestOfNGroupId: lastUserMessage.bestOfNGroupId,
          tryUseBestOfNPromotion: lastUserMessage.tryUseBestOfNPromotion
        });
        ensureUserMessageTiming(syntheticUserMessage);
        await this.interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.userMessageAppended(syntheticUserMessage), stateHandler.getPrivacyMode()));
        const newTurn = await stateHandler.createAgentTurn(ctx, syntheticUserMessage, fromRedactedRequestContext(requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED), this.config, this.resourceAccessor);
        const application = await applyAskQuestionCompletion(ctx, {
          action,
          stateHandler,
          turn: newTurn,
          rootPromptExecutor,
          resultFormat: "formatted-string"
        });
        if (application.outcome !== "applied") {
          return await stateHandler.computeNewStructure(ctx);
        }
        logger67.info(ctx, "Created new turn with tool call and result", {
          messageId: syntheticUserMessage.messageId,
          toolCallId: application.recordedToolCallId
        });
        await this.runTurnLoop(ctx, rootPromptExecutor, stateHandler, newTurn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo.map((ri2) => fromRedactedRepositoryIndexingInfo(ri2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)), fromRedactedRequestContext(requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED), onStateUpdate);
      } else {
        logger67.info(ctx, "Current turn is active, appending to existing turn");
        const application = await applyAskQuestionCompletion(ctx, {
          action,
          stateHandler,
          turn: lastTurn,
          rootPromptExecutor,
          resultFormat: "formatted-string"
        });
        if (application.outcome !== "applied") {
          return await stateHandler.computeNewStructure(ctx);
        }
        logger67.info(ctx, "Appended tool call and result to existing turn");
        await this.runTurnLoop(ctx, rootPromptExecutor, stateHandler, lastTurn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo.map((ri2) => fromRedactedRepositoryIndexingInfo(ri2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)), fromRedactedRequestContext(requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED), onStateUpdate);
      }
      logger67.info(ctx, "Async ask-question completion action handled successfully");
      return await stateHandler.computeNewStructure(ctx);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources39(env_1);
    }
  }
};

