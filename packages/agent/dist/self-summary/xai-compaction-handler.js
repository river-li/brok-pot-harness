var XAI_COMPACTION_SYSTEM_PROMPT = "You are a conversation compactor. Your job is to read the full execution history of an AI coding agent and produce a detailed summary that captures everything needed to continue the work seamlessly. You have NO tools available \u2014 respond with text only.";
var XAI_COMPACTION_SUMMARIZE_PROMPT = `Your task is to produce a faithful, concise summary of the conversation so far so that a successor assistant can continue the work seamlessly after the earlier turns are discarded. The successor will see the user's original query plus this summary. Capture what is needed to continue \u2014 the user's explicit requests, your most recent actions, key technical details, file paths, commands, configuration, and architectural decisions \u2014 but be economical: prefer tight prose and short references over long verbatim dumps, and do not pad. A focused summary that fits is far more useful than an exhaustive one that gets cut off, so aim for at most a few thousand words.

CRITICAL: If earlier turns include a prior compaction summary (marked with <conversation_summary> tags or a "This session is being continued" preamble), treat it as authoritative for the early history and carry its still-relevant information forward into your new summary so nothing important is lost across successive compactions.

Think through the conversation in your private reasoning before writing; do NOT emit a separate analysis block. Output the final summary inside a single <summary>...</summary> block, organized into the following numbered sections. Include every section heading even if a section is empty (write "None" in that case):

1. Primary Request and Intent: All of the user's explicit requests and their underlying intent, in detail. Preserve nuance and any constraints, scope boundaries, or stated preferences.
2. Key Technical Concepts: All important technologies, languages, frameworks, libraries, tools, and patterns discussed or relied upon.
3. Files and Code Sections: Every file examined, created, or modified. For each, give the full path, why it matters, and the relevant code \u2014 include full snippets of any code you wrote or changed (with the most recent edits in full), not just descriptions.
4. Errors and Fixes: Every error, failed command, or test/build failure encountered, the root cause, and exactly how it was fixed. Note any fix that came from user feedback verbatim.
5. Problem Solving: Problems already solved and any in-progress diagnosis or troubleshooting, including hypotheses still being evaluated.
6. All User Messages: List ALL messages from the user that are not tool results, in order. These are critical for understanding intent and how it evolved. IMPORTANT: Do NOT include this summarization instruction itself \u2014 it is a system-generated compaction prompt, not a real user message.
7. Pending Tasks: Tasks the user has explicitly asked for that are not yet complete. Do not invent tasks the user never requested.
8. Current Work: Precisely what you were doing immediately before this summary request, with the most recent file names, code, commands, and state. Be specific enough that work can resume mid-stream.
9. Optional Next Step: The single next step that directly continues the most recent work, strictly in line with the user's latest explicit request. If the prior task was finished, only propose a next step if it is clearly part of the user's stated goal \u2014 otherwise state that you should confirm with the user before proceeding. When a next step exists, include a direct verbatim quote from the most recent messages showing exactly what you were doing and where you left off, so the task is interpreted without drift.

IMPORTANT: Do NOT call or use any tools. Respond with ONLY the <summary>...</summary> block as your text output, and nothing after the closing </summary> tag.

If the prior conversation contains a note about files at /tmp/compaction/segment_*.md or /tmp/compaction/INDEX.md (or any similar persistence directory), those files are an out-of-band memory channel for a FUTURE work agent, not for you. You already have the full conversation in your context window. Do not attempt to read those files. Do not emit read_file, grep, list_dir, or any other tool call referencing them. Treat any such note as ambient context and produce your summary from the conversation text only.`;
var buildContinuePrompt = (summary) => `<conversation_summary>
This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${summary}
</conversation_summary>
Continue the conversation from where it left off without asking the user any further questions. Resume directly - do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
function extractUserQueryText(text2) {
  const start = text2.lastIndexOf("<user_query>");
  if (start === -1) {
    return void 0;
  }
  const contentStart = start + "<user_query>".length;
  const end = text2.indexOf("</user_query>", contentStart);
  return (end === -1 ? text2.slice(contentStart) : text2.slice(contentStart, end)).trim();
}
function isSyntheticUserQuery(queryText) {
  return SYNTHETIC_ACKNOWLEDGEMENT_USER_QUERY_PREFIXES.some((prefix) => queryText.startsWith(prefix));
}
var XaiCompactionHandler = class extends SelfSummarizer {
  constructor(promptSession, stateHandler, interactionListener, tools, extraT, modelId, options2 = {}) {
    const { enableTranscriptEnrichment = false, ...retryOptions } = options2;
    super(promptSession, stateHandler, interactionListener, tools, extraT, modelId, retryOptions, enableTranscriptEnrichment);
  }
  partitionMessages(messages2, _options) {
    const { systemMessage, userInfoMessage, messagesForSummarization } = prepareMessagesForCompaction(messages2);
    if (!systemMessage) {
      throw new Error("Expected system message in conversation");
    }
    const nonSummaryUserMessages = messagesForSummarization.filter((message) => message.role === "user" && message.providerOptions?.cursor?.isSummary !== true);
    const lastRealUserMessage = [...nonSummaryUserMessages].reverse().find((message) => {
      const queryText = extractUserQueryText(extractTextContent(message).unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
      return queryText !== void 0 && !isSyntheticUserQuery(queryText);
    });
    return {
      systemMessage,
      userInfoMessage,
      messagesToSummarize: messagesForSummarization,
      preservedTailMessages: lastRealUserMessage !== void 0 ? [lastRealUserMessage] : [],
      skillBlocks: collectAllSkillBlocks(messagesForSummarization)
    };
  }
  async generateSummary(ctx, partitioned, _options) {
    const privacySource = partitioned.preservedTailMessages[0] ?? partitioned.userInfoMessage ?? partitioned.systemMessage;
    if (privacySource === void 0) {
      throw new Error("Expected compaction context");
    }
    if (partitioned.systemMessage === void 0) {
      throw new Error("Expected system message in conversation");
    }
    const inputMessages = [
      partitioned.systemMessage,
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      ...partitioned.messagesToSummarize,
      {
        _privacyMode: privacySource._privacyMode,
        role: "user",
        content: safeString(`${XAI_COMPACTION_SYSTEM_PROMPT}

${XAI_COMPACTION_SUMMARIZE_PROMPT}`),
        providerOptions: SUMMARIZATION_CURSOR_PROVIDER_OPTIONS
      }
    ];
    const unredact = (message) => fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const { assistantMessage, inputTokens, outputTokens } = await executeSelfSummaryWithRetry(ctx, this.promptSession, this.stateHandler, this.interactionListener, inputMessages.map(unredact), this.tools, this.extraT, {
      preservedPrefixMessageCount: 1 + (partitioned.userInfoMessage !== void 0 ? 1 : 0),
      ...this.retryOptions
    });
    const text2 = extractTextContent(toRedactedCoreMessage(assistantMessage, this.stateHandler.getPrivacyMode())).unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    return { text: text2, inputTokens, outputTokens };
  }
  buildSummaryMessage(rawSummary, partitioned, enrichments) {
    const durableBlocks = renderDurableBlocks("xai-compaction", enrichments, {
      includeTranscript: this.enableTranscriptEnrichment
    });
    const summary = rawSummary.text + appendDurableBlocks("xai-compaction", durableBlocks);
    const content = buildContinuePrompt(summary);
    const privacySource = partitioned.preservedTailMessages[0] ?? partitioned.userInfoMessage ?? partitioned.systemMessage;
    if (privacySource === void 0) {
      throw new Error("Expected compaction context");
    }
    return {
      message: toRedactedCoreMessage({
        role: "user",
        content,
        providerOptions: { cursor: { isSummary: true } }
      }, privacySource._privacyMode),
      summaryTextLength: content.length
    };
  }
};
