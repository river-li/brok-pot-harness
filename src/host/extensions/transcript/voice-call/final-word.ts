function freshTurn() {
  return { closingText: "", lastWrittenToTheChat: "", spokenOnTheLine: false };
}
var VoiceCallFinalWord = class _VoiceCallFinalWord {
  static CHAR_LIMIT = VoiceCallItemSeeding.OVERHEARD_CHAR_LIMIT;
  static JOB_CHAR_LIMIT = 300;
  turns = /* @__PURE__ */ new Map();
  static asAnUpdateOnTheLine({
    job,
    word
  }) {
    const askedFor = job.trim();
    if (askedFor.length === 0) return word;
    const shortened = askedFor.length > _VoiceCallFinalWord.JOB_CHAR_LIMIT ? `${askedFor.slice(0, _VoiceCallFinalWord.JOB_CHAR_LIMIT)}\u2026` : askedFor;
    return `You typed in the chat: "${shortened}". It finished with: ${word}`;
  }
  wordOwedToTheLineAfter(update, agentId) {
    const turn = this.turns.get(agentId) ?? freshTurn();
    this.turns.set(agentId, turn);
    switch (update.type) {
      case "text-delta":
        turn.closingText = (turn.closingText + update.text).slice(0, _VoiceCallFinalWord.CHAR_LIMIT);
        return null;
      case "tool-call":
        if (update.status === "pending") turn.closingText = "";
        return null;
      case "retrying":
        turn.closingText = "";
        return null;
      case "send-message": {
        const { message } = update;
        if (message.type !== "text") return null;
        const isToTheChat = message.channel === void 0 || message.channel.length === 0;
        if (isToTheChat) turn.lastWrittenToTheChat = message.content;
        return null;
      }
      case "turn-ended": {
        this.turns.delete(agentId);
        if (turn.spokenOnTheLine) return null;
        const word = (turn.closingText.trim() || turn.lastWrittenToTheChat.trim()).slice(
          0,
          _VoiceCallFinalWord.CHAR_LIMIT
        );
        return word.length === 0 ? null : word;
      }
      default:
        return null;
    }
  }
  spokenOnTheLine(agentId) {
    const turn = this.turns.get(agentId) ?? freshTurn();
    turn.spokenOnTheLine = true;
    this.turns.set(agentId, turn);
  }
  abandonTheTurn(agentId) {
    this.turns.delete(agentId);
  }
};
