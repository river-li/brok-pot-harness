init_agent_pb();
init_selected_context_pb();
init_smart_mode_classifier_exec_pb();
var SMART_MODE_CLASSIFIER_MAX_ASSISTANT_MESSAGES = 2;
var SMART_MODE_CLASSIFIER_MAX_USER_MESSAGES = 2;
var SMART_MODE_CLASSIFIER_MAX_QUESTION_RESULTS = 2;
var SMART_MODE_CLASSIFIER_MAX_QUESTION_STEPS = 50;
var SMART_MODE_CLASSIFIER_MAX_CONTEXT_CHARS = 8e3;
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_ASSISTANT_MESSAGES = 4;
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_USER_MESSAGES = 2;
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_QUESTION_RESULTS = 2;
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_COMPUTER_MESSAGES = 10;
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_MESSAGE_CHARS = 4e3;
var SAND_AUTO_REVIEW_CLASSIFIER_MESSAGE_TRUNCATION_MARKER = "\n...[auto-review context truncated]...\n";
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_STRUCTURAL_CONTEXT_CHARS = (SAND_AUTO_REVIEW_CLASSIFIER_MAX_USER_MESSAGES + SAND_AUTO_REVIEW_CLASSIFIER_MAX_ASSISTANT_MESSAGES + SAND_AUTO_REVIEW_CLASSIFIER_MAX_QUESTION_RESULTS) * SAND_AUTO_REVIEW_CLASSIFIER_MAX_MESSAGE_CHARS;
var IDE_SMART_MODE_CLASSIFIER_CONTEXT_LIMITS = {
  maxAssistantMessages: SMART_MODE_CLASSIFIER_MAX_ASSISTANT_MESSAGES,
  maxUserMessages: SMART_MODE_CLASSIFIER_MAX_USER_MESSAGES,
  maxQuestionResults: SMART_MODE_CLASSIFIER_MAX_QUESTION_RESULTS,
  maxQuestionSteps: SMART_MODE_CLASSIFIER_MAX_QUESTION_STEPS
};
var SAND_AUTO_REVIEW_CLASSIFIER_CONTEXT_LIMITS = {
  maxAssistantMessages: SAND_AUTO_REVIEW_CLASSIFIER_MAX_ASSISTANT_MESSAGES,
  maxUserMessages: SAND_AUTO_REVIEW_CLASSIFIER_MAX_USER_MESSAGES,
  maxQuestionResults: SAND_AUTO_REVIEW_CLASSIFIER_MAX_QUESTION_RESULTS,
  maxQuestionSteps: SMART_MODE_CLASSIFIER_MAX_QUESTION_STEPS
};
function getAssistantMessageText(step) {
  if (step.message.case !== "assistantMessage") {
    return void 0;
  }
  const text2 = step.message.value.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED).trim();
  return text2.length > 0 ? text2 : void 0;
}
async function collectRecentAssistantMessages(ctx, stateHandler, maxMessages) {
  const assistantMessagesNewestFirst = [];
  for (let turnIndex = stateHandler.turns.length - 1; turnIndex >= 0 && assistantMessagesNewestFirst.length < maxMessages; turnIndex--) {
    const turn = await stateHandler.turns[turnIndex].get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle)) {
      continue;
    }
    for (let stepIndex = turn.steps.length - 1; stepIndex >= 0 && assistantMessagesNewestFirst.length < maxMessages; stepIndex--) {
      const step = await turn.steps[stepIndex].get(ctx);
      const text2 = getAssistantMessageText(step);
      if (text2 !== void 0) {
        assistantMessagesNewestFirst.push(text2);
      }
    }
  }
  return assistantMessagesNewestFirst.toReversed();
}
function formatComputerUseToolCallForClassifier(toolCall) {
  const description9 = toolCall.args?.description?.trim();
  const input = {
    ...description9 !== void 0 && description9.length > 0 ? { declared_purpose: description9 } : {},
    actions: toolCall.args?.actions.map((action) => action.toJson()) ?? []
  };
  const result = toolCall.result?.result;
  const output = result?.case === "success" ? {
    status: "success",
    actionCount: result.value.actionCount,
    durationMs: result.value.durationMs,
    ...result.value.log === void 0 ? {} : { log: result.value.log },
    ...result.value.screenshotPath === void 0 ? {} : { screenshotPath: result.value.screenshotPath },
    ...result.value.cursorPosition === void 0 ? {} : { cursorPosition: result.value.cursorPosition.toJson() },
    screenshotOmitted: result.value.screenshot !== void 0 && result.value.screenshot.length > 0
  } : result?.case === "error" ? {
    status: "error",
    error: result.value.error,
    actionCount: result.value.actionCount,
    durationMs: result.value.durationMs,
    ...result.value.log === void 0 ? {} : { log: result.value.log },
    ...result.value.screenshotPath === void 0 ? {} : { screenshotPath: result.value.screenshotPath },
    screenshotOmitted: result.value.screenshot !== void 0 && result.value.screenshot.length > 0
  } : { status: "pending" };
  return `input:
${JSON.stringify(input)}
output:
${JSON.stringify(output)}`;
}
async function collectCurrentIntentComputerToolCalls(ctx, stateHandler, userMessageFilter) {
  if (stateHandler.turns.length === 0)
    return [];
  let firstIntentTurnIndex = stateHandler.turns.length - 1;
  for (let turnIndex = stateHandler.turns.length - 1; turnIndex >= 0; turnIndex--) {
    const turn = await stateHandler.turns[turnIndex].get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle))
      continue;
    const userMessage2 = await turn.userMessage.get(ctx);
    const text2 = getUserMessageContextText(userMessage2, {
      includeInvokedWorkflowFilesAnnotation: false,
      currentTurnInvokedSkillPaths: [],
      ...userMessageFilter
    });
    if (text2 !== void 0) {
      firstIntentTurnIndex = turnIndex;
      break;
    }
  }
  const computerToolCalls = [];
  for (let turnIndex = firstIntentTurnIndex; turnIndex < stateHandler.turns.length; turnIndex++) {
    const turn = await stateHandler.turns[turnIndex].get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle))
      continue;
    for (const stepRef of turn.steps) {
      const step = await stepRef.get(ctx);
      if (step.message.case === "toolCall" && step.message.value.tool.case === "computerUseToolCall") {
        computerToolCalls.push(formatComputerUseToolCallForClassifier(fromRedactedComputerUseToolCall(step.message.value.tool.value, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)));
      }
    }
  }
  return computerToolCalls;
}
function extractInvokedSkillFilePaths(selectedContext) {
  if (selectedContext === void 0) {
    return [];
  }
  const paths = /* @__PURE__ */ new Set();
  const selectedSkills = selectedContext.selectedSkills ?? [];
  if (selectedSkills.length > 0) {
    for (const skill of selectedSkills) {
      const fullPath = skill.fullPath?.trim();
      if (fullPath !== void 0 && fullPath.length > 0) {
        paths.add(fullPath);
      }
    }
    return [...paths];
  }
  return [...paths];
}
function extractInvokedCommandFilePaths(selectedContext) {
  if (selectedContext === void 0) {
    return [];
  }
  const paths = /* @__PURE__ */ new Set();
  for (const command of selectedContext.cursorCommands) {
    const fullPath = command.fullPath?.trim();
    if (fullPath !== void 0 && fullPath.length > 0) {
      paths.add(fullPath);
    }
  }
  return [...paths];
}
var INVOKED_SKILLS_OPEN_TAG = '<invoked_skills note="skill files the user explicitly invoked for this request">';
var INVOKED_SKILLS_CLOSE_TAG = "</invoked_skills>";
var INVOKED_COMMANDS_OPEN_TAG = '<invoked_commands note="command files the user explicitly invoked for this request">';
var INVOKED_COMMANDS_CLOSE_TAG = "</invoked_commands>";
var MANUALLY_ATTACHED_SKILLS_CLOSE_TAG = "</manually_attached_skills>";
function extractPathsFromManuallyAttachedSkillsText(text2) {
  const paths = /* @__PURE__ */ new Set();
  const blocks = text2.match(/<manually_attached_skills>[\s\S]*?<\/manually_attached_skills>/g) ?? [];
  for (const block of blocks) {
    for (const line of block.split("\n")) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("Path:")) {
        const fullPath = trimmedLine.slice("Path:".length).trim();
        if (fullPath.length > 0) {
          paths.add(fullPath);
        }
      }
    }
  }
  return [...paths];
}
function getCoreMessageTextParts(message) {
  if (typeof message.content === "string") {
    return [message.content];
  }
  if (!Array.isArray(message.content)) {
    return [];
  }
  return message.content.flatMap((part) => part.type === "text" ? [part.text] : []);
}
function extractCurrentTurnInvokedSkillPathsFromRootPrompt(stateHandler) {
  const paths = /* @__PURE__ */ new Set();
  const rootPromptMessages = stateHandler.rootPromptBuilder.getState();
  for (let index = rootPromptMessages.length - 1; index >= 0; index--) {
    const redactedMessage = rootPromptMessages[index];
    const message = fromRedactedCoreMessage(redactedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    if (message.role !== "user") {
      continue;
    }
    for (const text2 of getCoreMessageTextParts(message)) {
      for (const path31 of extractPathsFromManuallyAttachedSkillsText(text2)) {
        paths.add(path31);
      }
      if (text2.includes(MANUALLY_ATTACHED_SKILLS_CLOSE_TAG)) {
        return [...paths];
      }
    }
    return [...paths];
  }
  return [];
}
function withInvokedWorkflowFilesAnnotation(baseText, paths) {
  const annotations = [];
  if (paths.skillPaths.length > 0) {
    annotations.push([
      INVOKED_SKILLS_OPEN_TAG,
      ...paths.skillPaths.map((skillPath) => `- ${skillPath}`),
      INVOKED_SKILLS_CLOSE_TAG
    ].join("\n"));
  }
  if (paths.commandPaths.length > 0) {
    annotations.push([
      INVOKED_COMMANDS_OPEN_TAG,
      ...paths.commandPaths.map((commandPath) => `- ${commandPath}`),
      INVOKED_COMMANDS_CLOSE_TAG
    ].join("\n"));
  }
  const annotation = annotations.join("\n\n");
  return baseText !== void 0 && baseText.length > 0 ? `${annotation}

${baseText}` : annotation;
}
function getUserMessageContextText(userMessage2, options2) {
  const plainUserMessage = fromRedactedUserMessage2(userMessage2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const trustedPrefix = options2.trustedUserMessageTextPrefixes.find((prefix) => plainUserMessage.text.startsWith(prefix));
  if (trustedPrefix === void 0 && (options2.trustedUserMessagesOnly === true || options2.excludedUserMessageTextPrefixes.some((prefix) => plainUserMessage.text.startsWith(prefix)))) {
    return void 0;
  }
  if (plainUserMessage.simulatedMsgReason === SimulatedMsgReason.BACKGROUND_TASK_COMPLETION || plainUserMessage.simulatedMsgReason === SimulatedMsgReason.GOAL_CONTINUATION) {
    return void 0;
  }
  const rawText = plainUserMessage.text.slice(trustedPrefix?.length ?? 0).trim();
  let baseText = rawText.length > 0 ? rawText : void 0;
  if (baseText !== void 0 && options2.projectUserMessageText !== void 0) {
    baseText = options2.projectUserMessageText(baseText);
  }
  if (plainUserMessage.isSimulatedMsg === true) {
    const simulatedText = buildSimulatedMessagePromptUserContent({
      selectedContext: plainUserMessage.selectedContext ?? new SelectedContext(),
      simulatedMsgReason: plainUserMessage.simulatedMsgReason
    }).map((part) => part.text.trim()).filter((text2) => text2.length > 0).join("\n\n").trim();
    if (simulatedText.length > 0) {
      baseText = simulatedText;
    }
  }
  if (!options2.includeInvokedWorkflowFilesAnnotation) {
    return baseText;
  }
  const invokedSkillPaths = extractInvokedSkillFilePaths(plainUserMessage.selectedContext);
  const combinedInvokedSkillPaths = [
    .../* @__PURE__ */ new Set([...invokedSkillPaths, ...options2.currentTurnInvokedSkillPaths])
  ];
  const invokedCommandPaths = extractInvokedCommandFilePaths(plainUserMessage.selectedContext);
  return combinedInvokedSkillPaths.length === 0 && invokedCommandPaths.length === 0 ? baseText : withInvokedWorkflowFilesAnnotation(baseText, {
    skillPaths: combinedInvokedSkillPaths,
    commandPaths: invokedCommandPaths
  });
}
async function collectRecentUserMessages(ctx, stateHandler, maxMessages, userMessageFilter) {
  const userMessagesNewestFirst = [];
  let isMostRecentAgentTurn = true;
  const currentTurnInvokedSkillPaths = extractCurrentTurnInvokedSkillPathsFromRootPrompt(stateHandler);
  for (let turnIndex = stateHandler.turns.length - 1; turnIndex >= 0 && userMessagesNewestFirst.length < maxMessages; turnIndex--) {
    const turn = await stateHandler.turns[turnIndex].get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle)) {
      continue;
    }
    const userMessage2 = await turn.userMessage.get(ctx);
    const text2 = getUserMessageContextText(userMessage2, {
      includeInvokedWorkflowFilesAnnotation: isMostRecentAgentTurn,
      currentTurnInvokedSkillPaths: isMostRecentAgentTurn ? currentTurnInvokedSkillPaths : [],
      ...userMessageFilter
    });
    isMostRecentAgentTurn = false;
    if (text2 !== void 0) {
      userMessagesNewestFirst.push(text2);
    }
  }
  return userMessagesNewestFirst.toReversed();
}
function formatAskQuestionAnswerForClassifier(args, result) {
  if (result?.result.case !== "success") {
    return void 0;
  }
  const questionsById = new Map((args?.questions ?? []).map((question) => [question.id, question]));
  const renderedAnswers = [];
  for (const answer of result.result.value.answers) {
    const question = questionsById.get(answer.questionId);
    const optionLabelsById = new Map((question?.options ?? []).map((option) => [option.id, option.label]));
    const answerParts = answer.selectedOptionIds.map((optionId) => optionLabelsById.get(optionId) ?? optionId);
    const freeformText = answer.freeformText?.trim();
    if (freeformText !== void 0 && freeformText.length > 0) {
      answerParts.push(freeformText);
    }
    if (answerParts.length === 0) {
      continue;
    }
    const prompt = question?.prompt.trim();
    const answerText = answerParts.join(", ");
    renderedAnswers.push(prompt !== void 0 && prompt.length > 0 ? `Q: ${prompt}
A: ${answerText}` : `A: ${answerText}`);
  }
  return renderedAnswers.length > 0 ? renderedAnswers.join("\n\n") : void 0;
}
async function collectRecentAskQuestionAnswers(ctx, stateHandler, maxResults, maxSteps) {
  const currentTurnRef = stateHandler.turns.at(-1);
  if (!currentTurnRef) {
    return [];
  }
  const currentTurn = await currentTurnRef.get(ctx);
  if (!(currentTurn instanceof AgentConversationTurnHandle)) {
    return [];
  }
  const answersNewestFirst = [];
  let stepsScanned = 0;
  for (let stepIndex = currentTurn.steps.length - 1; stepIndex >= 0 && stepsScanned < maxSteps && answersNewestFirst.length < maxResults; stepIndex--) {
    stepsScanned++;
    const step = await currentTurn.steps[stepIndex].get(ctx);
    if (step.message.case !== "toolCall" || step.message.value.tool.case !== "askQuestionToolCall") {
      continue;
    }
    const askQuestion = step.message.value.tool.value;
    const args = askQuestion.args !== void 0 ? fromRedactedAskQuestionArgs(askQuestion.args, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0;
    const result = askQuestion.result !== void 0 ? fromRedactedAskQuestionResult(askQuestion.result, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0;
    const rendered = formatAskQuestionAnswerForClassifier(args, result);
    if (rendered !== void 0) {
      answersNewestFirst.push(rendered);
    }
  }
  return answersNewestFirst.toReversed();
}
function truncateSandAutoReviewClassifierMessageContent(content, maxChars = SAND_AUTO_REVIEW_CLASSIFIER_MAX_MESSAGE_CHARS) {
  if (content.length <= maxChars) {
    return content;
  }
  const marker17 = SAND_AUTO_REVIEW_CLASSIFIER_MESSAGE_TRUNCATION_MARKER;
  const textBudget = maxChars - marker17.length;
  if (textBudget <= 0) {
    return content.slice(0, maxChars);
  }
  const headChars = Math.ceil(textBudget / 2);
  const tailChars = Math.floor(textBudget / 2);
  return `${content.slice(0, headChars)}${marker17}${content.slice(-tailChars)}`;
}
function applySmartModeClassifierMessageCountLimits(messages2, limits) {
  const assistantMessages = messages2.filter((message) => message.role === "assistant").slice(-limits.maxAssistantMessages);
  const userMessages = messages2.filter((message) => message.role === "user").slice(-limits.maxUserMessages);
  const questionMessages = messages2.filter((message) => message.role === "user_answer").slice(-limits.maxQuestionResults);
  const computerMessages = messages2.filter((message) => message.role === "computer").slice(-SAND_AUTO_REVIEW_CLASSIFIER_MAX_COMPUTER_MESSAGES);
  const includedAssistantMessages = new Set(assistantMessages);
  const includedUserMessages = new Set(userMessages);
  const includedQuestionMessages = new Set(questionMessages);
  const includedComputerMessages = new Set(computerMessages);
  return messages2.flatMap((message) => {
    const included = message.role === "assistant" ? includedAssistantMessages.has(message) : message.role === "user_answer" ? includedQuestionMessages.has(message) : message.role === "computer" ? includedComputerMessages.has(message) : includedUserMessages.has(message);
    if (!included) {
      return [];
    }
    return [message];
  });
}
function truncateSandAutoReviewClassifierContext(messages2, options2 = {}) {
  const limits = options2.limits ?? SAND_AUTO_REVIEW_CLASSIFIER_CONTEXT_LIMITS;
  const maxCharsPerMessage = options2.maxCharsPerMessage ?? SAND_AUTO_REVIEW_CLASSIFIER_MAX_MESSAGE_CHARS;
  return applySmartModeClassifierMessageCountLimits(messages2, limits).map((message) => ({
    ...message,
    content: truncateSandAutoReviewClassifierMessageContent(message.content, maxCharsPerMessage)
  })).filter((message) => message.content.length > 0);
}
function truncateSmartModeClassifierContext(messages2, options2 = {
  maxChars: SMART_MODE_CLASSIFIER_MAX_CONTEXT_CHARS,
  maxAssistantMessages: SMART_MODE_CLASSIFIER_MAX_ASSISTANT_MESSAGES,
  maxUserMessages: SMART_MODE_CLASSIFIER_MAX_USER_MESSAGES,
  maxQuestionMessages: SMART_MODE_CLASSIFIER_MAX_QUESTION_RESULTS
}) {
  const maxQuestionMessages = options2.maxQuestionMessages ?? SMART_MODE_CLASSIFIER_MAX_QUESTION_RESULTS;
  let assistantMessages = messages2.filter((message) => message.role === "assistant").slice(-options2.maxAssistantMessages);
  let userMessages = messages2.filter((message) => message.role === "user").slice(-options2.maxUserMessages);
  let questionMessages = messages2.filter((message) => message.role === "user_answer").slice(-maxQuestionMessages);
  let computerMessages = messages2.filter((message) => message.role === "computer");
  const contentOverrides = /* @__PURE__ */ new Map();
  const buildMessages = () => {
    const includedAssistantMessages = new Set(assistantMessages);
    const includedUserMessages = new Set(userMessages);
    const includedQuestionMessages = new Set(questionMessages);
    const includedComputerMessages = new Set(computerMessages);
    return messages2.flatMap((message) => {
      const included = message.role === "assistant" ? includedAssistantMessages.has(message) : message.role === "user_answer" ? includedQuestionMessages.has(message) : message.role === "computer" ? includedComputerMessages.has(message) : includedUserMessages.has(message);
      if (!included) {
        return [];
      }
      return [
        {
          ...message,
          content: contentOverrides.get(message) ?? message.content
        }
      ];
    });
  };
  let result = buildMessages();
  const totalChars = (items) => items.reduce((sum, message) => sum + message.content.length, 0);
  while (totalChars(result) > options2.maxChars && assistantMessages.length > 1) {
    assistantMessages = assistantMessages.slice(1);
    result = buildMessages();
  }
  while (totalChars(result) > options2.maxChars && computerMessages.length > 1) {
    computerMessages = computerMessages.slice(1);
    result = buildMessages();
  }
  while (totalChars(result) > options2.maxChars && questionMessages.length > 1) {
    questionMessages = questionMessages.slice(1);
    result = buildMessages();
  }
  while (totalChars(result) > options2.maxChars && userMessages.length > 1) {
    userMessages = userMessages.slice(1);
    result = buildMessages();
  }
  if (totalChars(result) > options2.maxChars) {
    let remaining = options2.maxChars;
    for (const message of [
      ...userMessages,
      ...questionMessages,
      ...computerMessages,
      ...assistantMessages
    ]) {
      if (remaining <= 0) {
        contentOverrides.set(message, "");
        continue;
      }
      const content = message.content.length <= remaining ? message.content : message.content.slice(0, remaining);
      remaining -= content.length;
      contentOverrides.set(message, content);
    }
    result = buildMessages();
  }
  return result.filter((message) => message.content.length > 0);
}
async function tryExtractSmartModeClassifierConversationContext(ctx, stateHandler) {
  try {
    return await extractSmartModeClassifierConversationContext(ctx, stateHandler);
  } catch {
    return [];
  }
}
async function extractSmartModeClassifierConversationContext(ctx, stateHandler, limits = IDE_SMART_MODE_CLASSIFIER_CONTEXT_LIMITS, truncateMessages = (messages2) => truncateSmartModeClassifierContext(messages2), options2) {
  const userMessageFilter = {
    excludedUserMessageTextPrefixes: options2?.excludedUserMessageTextPrefixes ?? [],
    trustedUserMessageTextPrefixes: options2?.trustedUserMessageTextPrefixes ?? [],
    trustedUserMessagesOnly: options2?.trustedUserMessagesOnly ?? false,
    projectUserMessageText: options2?.projectUserMessageText
  };
  const [assistantMessages, userMessages, questionAnswers, computerToolCalls] = await Promise.all([
    collectRecentAssistantMessages(ctx, stateHandler, limits.maxAssistantMessages),
    collectRecentUserMessages(ctx, stateHandler, limits.maxUserMessages, userMessageFilter),
    collectRecentAskQuestionAnswers(ctx, stateHandler, limits.maxQuestionResults, limits.maxQuestionSteps),
    options2?.includeComputerToolCalls === true ? collectCurrentIntentComputerToolCalls(ctx, stateHandler, userMessageFilter) : []
  ]);
  const messages2 = [
    ...assistantMessages.map((content) => ({
      role: "assistant",
      content
    })),
    ...userMessages.map((content) => ({
      role: "user",
      content
    })),
    ...questionAnswers.map((content) => ({
      role: "user_answer",
      content
    })),
    ...computerToolCalls.map((content) => ({
      role: "computer",
      content
    }))
  ];
  return truncateMessages(messages2).map((message) => new SmartModeClassifierConversationMessage({
    role: message.role,
    content: message.content
  }));
}
async function extractSandAutoReviewClassifierConversationContext(ctx, stateHandler, options2) {
  return extractSmartModeClassifierConversationContext(ctx, stateHandler, SAND_AUTO_REVIEW_CLASSIFIER_CONTEXT_LIMITS, truncateSandAutoReviewClassifierContext, { ...options2, includeComputerToolCalls: true });
}
async function tryExtractSandAutoReviewClassifierConversationContext(ctx, stateHandler, options2) {
  try {
    return await extractSandAutoReviewClassifierConversationContext(ctx, stateHandler, options2);
  } catch {
    return [];
  }
}
