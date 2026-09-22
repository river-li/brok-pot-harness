init_dist4();
var logger103 = createLogger("sand:start-of-turn-ack-reminder-middleware");
function chatSilenceRemindersCoverThisTurn({
  isSubagentRunner,
  isSilenceAllowed,
  isGroupMemberTurn,
  requestSource
}) {
  if (isSubagentRunner || isSilenceAllowed || isGroupMemberTurn) return false;
  return requestSource !== "voice-call";
}
var DEFAULT_START_OF_TURN_ACK_THRESHOLD = 1;
var START_OF_TURN_ACK_REMINDER_MESSAGE = `<system_reminder>
You opened this turn by calling tools without first sending to the user, so they are watching silence and may think the app froze. Acknowledge them RIGHT NOW by actually invoking the SendToUser tool \u2014 make a real tool/function call, not text you write. Plain assistant text is NEVER shown to the user; only a real SendToUser tool invocation reaches them, so if you don't call the tool they just keep seeing silence. Make that first SendToUser a one-line text acknowledgement, before any further tool call, then continue the work. A widget, attachment, or cursor-agent card does not count as this acknowledgement. ${REQUESTED_VOICE_MEMO_SILENCE_CLAUSE}
</system_reminder>`;
function buildReminderMessage(content) {
  return {
    role: "user",
    content,
    providerOptions: {
      cursor: {
        sandStartOfTurnAckReminder: true
      }
    }
  };
}
function isStartOfTurnAckReminderMessage(message) {
  return message.providerOptions?.cursor?.sandStartOfTurnAckReminder === true;
}
function isTextSendMessageArgs(args) {
  return typeof args === "object" && args !== null && "type" in args && args.type === "text";
}
function hasTextSendMessageCall(message) {
  if (message.role !== "assistant" || typeof message.content === "string") {
    return false;
  }
  return message.content.some(
    (part) => part.type === "tool-call" && invokesFirstPartyTool(
      part,
      (toolName, args) => isSandUserDeliveryToolName(toolName) && isTextSendMessageArgs(args)
    )
  );
}
function hasTextSendMessageSinceTurnStart(messages2) {
  for (let index = messages2.length - 1; index >= 0; index--) {
    const message = messages2[index];
    if (isInjectedReminderMessage2(message)) {
      continue;
    }
    if (message.role === "user" || message.role === "system") {
      return false;
    }
    if (hasTextSendMessageCall(message)) {
      return true;
    }
  }
  return false;
}
var StartOfTurnAckReminderMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, threshold, message) {
    super(innerExecutor);
    this.threshold = threshold;
    this.message = message;
  }
  threshold;
  message;
  stream(ctx, invocationId, tools, options2) {
    const messages2 = this.innerExecutor.getMessages();
    const lastMessage = messages2.at(-1);
    if (lastMessage !== void 0 && isStartOfTurnAckReminderMessage(lastMessage)) {
      return this.innerExecutor.stream(ctx, invocationId, tools, options2);
    }
    if (hasTextSendMessageSinceTurnStart(messages2)) {
      return this.innerExecutor.stream(ctx, invocationId, tools, options2);
    }
    const toolCallsSinceLastSend = countToolCallsSinceLastSendMessage(messages2);
    if (toolCallsSinceLastSend > this.threshold) {
      logger103.info(ctx, "[sand-start-of-turn-ack] injecting reminder", {
        toolCallsSinceLastSend,
        threshold: this.threshold,
        messageCount: messages2.length
      });
      this.innerExecutor.appendMessages(this.message);
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createStartOfTurnAckReminderMiddleware(options2) {
  const threshold = options2?.threshold ?? DEFAULT_START_OF_TURN_ACK_THRESHOLD;
  const message = buildReminderMessage(options2?.message ?? START_OF_TURN_ACK_REMINDER_MESSAGE);
  return (executor) => new StartOfTurnAckReminderMiddleware(executor, threshold, message);
}
