init_dist3();
var __awaiter26 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
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
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var logger6 = createLogger("summarization-pipeline");
function warnIfPreservedTailShapeInvalid(ctx, partitioned, options2) {
  const tail = partitioned.preservedTailMessages;
  if (tail.length === 0) {
    return;
  }
  const headIsUser = tail[0].role === "user";
  const laterUserIndex = tail.findIndex((message, index) => index > 0 && message.role === "user");
  if (headIsUser && laterUserIndex === -1) {
    return;
  }
  logger6.warn(ctx, "[summarization-pipeline] preservedTailMessages shape invariant violated", {
    summarization: {
      preservedTailLength: tail.length,
      preservedTailRoles: tail.map((message) => message.role),
      headRole: tail[0].role,
      headIsUser,
      laterUserIndex,
      messagesToSummarizeLength: partitioned.messagesToSummarize.length,
      fullSummarization: options2.fullSummarization === true,
      backgroundSummarizationMode: options2.backgroundSummarizationMode,
      triggerReason: options2.triggerReason
    }
  });
}
function runSummarizationPipeline(summarizer, ctx, messages2, options2) {
  return __awaiter26(this, void 0, void 0, function* () {
    const partitioned = summarizer.partitionMessages(messages2, options2);
    warnIfPreservedTailShapeInvalid(ctx, partitioned, options2);
    const enrichments = {
      skillBlocks: partitioned.skillBlocks,
      todoContent: options2.todoContent,
      currentPlan: options2.currentPlan,
      modePrompt: options2.modePrompt,
      customModeSkillBlock: options2.customModeSkillBlock,
      projectRootPrompt: options2.projectRootPrompt,
      automationTriggerContext: options2.automationTriggerContext,
      agentTranscriptsFolder: options2.agentTranscriptsFolder,
      conversationId: options2.conversationId
    };
    const rawSummary = yield summarizer.generateSummary(ctx, partitioned, options2);
    const builtSummary = summarizer.buildSummaryMessage(rawSummary, partitioned, enrichments, options2);
    const finalMessages = summarizer.assembleFinalMessages(partitioned, builtSummary.message);
    return {
      messagesActuallySummarized: partitioned.messagesToSummarize,
      newSummaryMessage: builtSummary.message,
      preservedOriginalTailMessages: partitioned.preservedTailMessages,
      fullReplacementMessages: finalMessages,
      rawSummary,
      summaryTextLength: builtSummary.summaryTextLength
    };
  });
}
