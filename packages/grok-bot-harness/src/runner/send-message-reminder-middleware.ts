var logger99 = createLogger("sand:send-message-reminder-middleware");
function isSandUserDeliveryToolCall(part) {
  return invokesFirstPartyTool(part, isSandUserDeliveryToolName);
}
var DEFAULT_SEND_MESSAGE_REMINDER_THRESHOLD = 6;
var DEFAULT_EARLY_RESULT_REMINDER_THRESHOLD = 0;
var SEND_MESSAGE_REMINDER_LEAD = "You have made several tool calls without a SendToUser, so the user is currently watching silence. Actually invoke the SendToUser tool now \u2014 make a real tool/function call, not text you write. Plain assistant text is NEVER shown to the user; only a real SendToUser tool invocation reaches them, so if you don't call the tool they just keep seeing silence.";
var SEND_MESSAGE_REMINDER_MESSAGE = `<system_reminder>
${SEND_MESSAGE_REMINDER_LEAD} Send a brief, specific update on what you are doing or what you just found before continuing. ${REQUESTED_VOICE_MEMO_SILENCE_CLAUSE}
</system_reminder>`;
var SEND_MESSAGE_REMINDER_MESSAGE_UPDATE_COMMUNICATION = `<system_reminder>
${SEND_MESSAGE_REMINDER_LEAD} Send one brief update in a complete sentence, saying what you found or what happens next, not a play-by-play of each step, before continuing. ${REQUESTED_VOICE_MEMO_SILENCE_CLAUSE}
</system_reminder>`;
var EARLY_RESULT_REMINDER_MESSAGE = `<system_reminder>
Remember: the user cannot see tool output or your thinking \u2014 only SendToUser reaches them. If you have produced a result or finished what they asked, send it now with a SendToUser tool call before continuing or ending the turn. If you are still mid-task, keep working and send the result once you have it.
</system_reminder>`;
var DISK_PRESSURE_REMINDER_MESSAGE = `<system_reminder>
The box is near disk capacity. Avoid disk-heavy work and do not fill the remaining capacity.
</system_reminder>`;
function getUserMessageText(message) {
  if (message.role !== "user") {
    return void 0;
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  return message.content.filter(
    (part) => part.type === "text" && typeof part.text === "string"
  ).map((part) => part.text).join("");
}
function isSendMessageReminderMessage(message) {
  const text2 = getUserMessageText(message);
  if (text2 === void 0) return false;
  return text2.includes(SEND_MESSAGE_REMINDER_MESSAGE) || text2.includes(SEND_MESSAGE_REMINDER_MESSAGE_UPDATE_COMMUNICATION);
}
function isInjectedReminderMessage(message) {
  const cursor = message.providerOptions?.cursor;
  return cursor?.sandSendMessageReminder === true || cursor?.sandEarlyResultReminder === true || cursor?.sandStartOfTurnAckReminder === true || cursor?.sandDiskPressureReminder === true || cursor?.loopReminder === true || isSendMessageReminderMessage(message) || (getUserMessageText(message)?.includes(EARLY_RESULT_REMINDER_MESSAGE) ?? false);
}
function hasSendMessageCall(message) {
  if (message.role !== "assistant" || typeof message.content === "string") {
    return false;
  }
  return message.content.some(
    (part) => part.type === "tool-call" && isSandUserDeliveryToolCall(part)
  );
}
function countNonSendMessageToolCalls(message) {
  if (message.role !== "assistant" || typeof message.content === "string") {
    return 0;
  }
  return message.content.filter(
    (part) => part.type === "tool-call" && !isSandUserDeliveryToolCall(part)
  ).length;
}
function countToolCallsSinceLastSendMessage(messages2) {
  let count = 0;
  for (let index = messages2.length - 1; index >= 0; index--) {
    const message = messages2[index];
    if (message.role === "user" || message.role === "system") {
      break;
    }
    if (hasSendMessageCall(message)) {
      break;
    }
    count += countNonSendMessageToolCalls(message);
  }
  return count;
}
function hasSendMessageSinceRealTurnStart(messages2) {
  for (let index = messages2.length - 1; index >= 0; index--) {
    const message = messages2[index];
    if (isInjectedReminderMessage(message)) {
      continue;
    }
    if (message.role === "user" || message.role === "system") {
      return false;
    }
    if (hasSendMessageCall(message)) {
      return true;
    }
  }
  return false;
}
function hasReminderFiredThisSilentStreak(messages2) {
  for (let index = messages2.length - 1; index >= 0; index--) {
    const message = messages2[index];
    if (isInjectedReminderMessage(message)) {
      return true;
    }
    if (message.role === "user" || message.role === "system") {
      return false;
    }
    if (hasSendMessageCall(message)) {
      return false;
    }
  }
  return false;
}
function createSendMessageReminderMessage(updateCommunication = false) {
  return {
    role: "user",
    content: updateCommunication ? SEND_MESSAGE_REMINDER_MESSAGE_UPDATE_COMMUNICATION : SEND_MESSAGE_REMINDER_MESSAGE,
    providerOptions: {
      cursor: {
        sandSendMessageReminder: true
      }
    }
  };
}
function createEarlyResultReminderMessage() {
  return {
    role: "user",
    content: EARLY_RESULT_REMINDER_MESSAGE,
    providerOptions: {
      cursor: {
        sandEarlyResultReminder: true
      }
    }
  };
}
var DiskPressureReminderMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, episodeId) {
    super(innerExecutor);
    this.episodeId = episodeId;
  }
  episodeId;
  stream(ctx, invocationId, tools, options2) {
    const alreadyInjected = this.innerExecutor.getMessages().some(
      (message) => message.providerOptions?.cursor?.sandDiskPressureReminderEpisodeId === this.episodeId
    );
    if (!alreadyInjected) {
      this.innerExecutor.appendMessages({
        role: "user",
        content: DISK_PRESSURE_REMINDER_MESSAGE,
        providerOptions: {
          cursor: {
            sandDiskPressureReminder: true,
            sandDiskPressureReminderEpisodeId: this.episodeId
          }
        }
      });
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createDiskPressureReminderMiddleware(episodeId) {
  return (executor) => new DiskPressureReminderMiddleware(executor, episodeId);
}
var SendMessageReminderMiddleware = class extends BaseMiddleware {
  threshold;
  earlyResultThreshold;
  updateCommunication;
  constructor(innerExecutor, thresholds) {
    super(innerExecutor);
    this.threshold = thresholds.threshold;
    this.earlyResultThreshold = thresholds.earlyResultThreshold;
    this.updateCommunication = thresholds.updateCommunication ?? (() => false);
  }
  stream(ctx, invocationId, tools, options2) {
    const messages2 = this.innerExecutor.getMessages();
    const lastMessage = messages2.at(-1);
    if (lastMessage !== void 0 && isSendMessageReminderMessage(lastMessage)) {
      return this.innerExecutor.stream(ctx, invocationId, tools, options2);
    }
    const toolCallsSinceLastSend = countToolCallsSinceLastSendMessage(messages2);
    if (toolCallsSinceLastSend > this.threshold) {
      logger99.info(ctx, "[sand-send-message-reminder] injecting reminder", {
        toolCallsSinceLastSend,
        threshold: this.threshold,
        messageCount: messages2.length
      });
      this.innerExecutor.appendMessages(
        createSendMessageReminderMessage(this.updateCommunication() === true)
      );
    } else if (toolCallsSinceLastSend > this.earlyResultThreshold && hasSendMessageSinceRealTurnStart(messages2) && !hasReminderFiredThisSilentStreak(messages2)) {
      logger99.info(ctx, "[sand-send-message-reminder] injecting early result reminder", {
        toolCallsSinceLastSend,
        earlyResultThreshold: this.earlyResultThreshold,
        messageCount: messages2.length
      });
      this.innerExecutor.appendMessages(createEarlyResultReminderMessage());
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createSendMessageReminderMiddleware(options2) {
  const threshold = options2?.threshold ?? DEFAULT_SEND_MESSAGE_REMINDER_THRESHOLD;
  const earlyResultThreshold = options2?.earlyResultThreshold ?? DEFAULT_EARLY_RESULT_REMINDER_THRESHOLD;
  return (executor) => new SendMessageReminderMiddleware(executor, {
    threshold,
    earlyResultThreshold,
    updateCommunication: options2?.updateCommunication
  });
}
