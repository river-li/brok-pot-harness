var logger61 = createLogger("tools/ask-question");
var askQuestionDegenerate = createCounter("ask_question.degenerate", {
  description: "AskQuestion calls whose title, prompt, or options are placeholder-shaped",
  labelNames: ["reason", "vendor", "model", "user.is_dev", "outcome"]
});
var PLACEHOLDER_ASK_QUESTION_CLIENT_ERROR_MESSAGE = "Placeholder question not shown";
function buildPlaceholderAskQuestionModelMessage(askQuestionToolName) {
  return `This question was not shown to the user because it looks like a placeholder. Some tools are no longer direct tools; call GetDynamicTools with namespace "cursor" to see them, and invoke them with CallDynamicTool. If you really need the user's input, call ${askQuestionToolName} again with a real prompt and options.`;
}
var FIRST_ASK_QUESTION_CLIENT_ERROR_MESSAGE = "Tool call failed";
var FIRST_ASK_QUESTION_MODEL_ERROR_MESSAGE = "Rejected: you must research first (codebase, filesystem, and other tools) before asking the user. Do not use this tool to inquire into details, solicit feedback on suggestions, or ask for confirmations. Only call this again if you absolutely need user input (i.e. you are doing some destructive action, making a major architectural decision, or the user requested it in their workflow). Don't mention this to the user.";
function shouldReceiptAskQuestionResult(result) {
  if (result === void 0) {
    return false;
  }
  const resultCase = result.result.case;
  if (resultCase === "success" || resultCase === "error") {
    return true;
  }
  if (resultCase === "rejected") {
    return !isAskQuestionAutoAnswerReason(result.result.value.reason);
  }
  return false;
}
var questionSchema = external_exports.object({
  id: external_exports.string().describe("Unique identifier for this question"),
  prompt: external_exports.string().describe("The question text to display to the user, without the options."),
  options: external_exports.array(external_exports.object({
    id: external_exports.string().describe("Unique identifier for this option"),
    label: external_exports.string().describe("Display text for this option")
  })).min(2).describe("Array of answer options (minimum 2 required)"),
  allow_multiple: external_exports.boolean().optional().describe("If true, user can select multiple options. Defaults to false.")
});
function formatAskQuestionResultAsString(result, askQuestionToolName = "AskQuestion") {
  switch (result.result.case) {
    case "success": {
      const answerDescriptions = result.result.value.answers.map((answer) => {
        const hasSelectedOptions = answer.selectedOptionIds.length > 0;
        const freeformText = answer.freeformText?.trim();
        const hasFreeformText = freeformText && freeformText.length > 0;
        if (hasSelectedOptions && hasFreeformText) {
          return `Question ${answer.questionId}: Selected option(s) ${answer.selectedOptionIds.join(", ")}, freeform: ${freeformText}`;
        }
        if (hasFreeformText) {
          return `Question ${answer.questionId}: ${freeformText}`;
        }
        if (hasSelectedOptions) {
          return `Question ${answer.questionId}: Selected option(s) ${answer.selectedOptionIds.join(", ")}`;
        }
        return `Question ${answer.questionId}: No answer provided`;
      });
      return `User questions responses:
${answerDescriptions?.join("\n") ?? ""}`;
    }
    case "async":
      return "Questions have been sent to the user asynchronously. You will receive their answers later as a separate tool result. Continue with your reasoning using current information.";
    case "rejected":
      return result.result.value.reason?.trim() || "Questions skipped by the user, continue with the information you already have";
    case "error": {
      const errorMessage6 = result.result.value.errorMessage;
      if (errorMessage6 === FIRST_ASK_QUESTION_CLIENT_ERROR_MESSAGE) {
        return `Error: ${FIRST_ASK_QUESTION_MODEL_ERROR_MESSAGE}`;
      }
      if (errorMessage6 === PLACEHOLDER_ASK_QUESTION_CLIENT_ERROR_MESSAGE) {
        return buildPlaceholderAskQuestionModelMessage(askQuestionToolName);
      }
      return `Error: ${errorMessage6}`;
    }
    case void 0:
      return "Unknown error";
    default: {
      const _exhaustiveCheck = result.result;
      throw new Error(`Unhandled result case: ${String(_exhaustiveCheck)}`);
    }
  }
}
