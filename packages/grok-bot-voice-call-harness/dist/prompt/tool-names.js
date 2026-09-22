/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/prompt/tool-names.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_HANGUP_TOOL = "end_the_call";
var VOICE_CALL_NUDGE_MAIN_TOOL = "send_task";
var VOICE_CALL_RECALL_TEXTS_TOOL = "recall_text_messages";
var VOICE_CALL_SILENT_TOOL = "stay_silent";
var VOICE_CALL_WORK_LANDED_TOOL = "work_landed";
var VOICE_CALL_WORK_OVERHEARD_TOOL = "work_overheard";
var VOICE_CALL_SENT_MESSAGE_LIMIT = 8;
var VOICE_CALL_RECALL_TEXTS_SCOPE = `the written chat between you and this caller: "you" is what you sent them, "them" is what they typed to you. Nobody else writes in it, and nothing anyone else sent them is in it: not their other agents, not other people, not Slack, mail, or any other app. Word from any of those is a ${VOICE_CALL_NUDGE_MAIN_TOOL} job, never a read of this chat.`;
var VOICE_CALL_RECALL_TEXTS_WHEN = `If the answer might already be in the written chat, call ${VOICE_CALL_RECALL_TEXTS_TOOL}. Do not guess it, do not say you do not know, and do not ${VOICE_CALL_NUDGE_MAIN_TOOL} for it until you have read that chat.`;
var VOICE_CALL_RECALL_TEXTS_IF_UNREAD = `If the answer might already be in the written chat you have not read this call, ${VOICE_CALL_RECALL_TEXTS_TOOL} first.`;
var VoiceCallToolDescriptions = class {
  static sendTask() {
    return `Send a job that needs their computer, files, web, browser, or mail and chat they send. That call is a receipt, never the answer, and never the quick path. Speak a short beat on this response that names the job in how you talk, then call this. Never start that beat with a confirmation. Never say you are calling this tool. The outcome lands later as a ${VOICE_CALL_WORK_LANDED_TOOL} entry. Do not use this for a take, a recap of this call, a quiz from words already on the line, a story, a joke, talk they asked you to do yourself, or a fact already on the line. If the useful answer needs a fact you do not have about their world, ${VOICE_CALL_RECALL_TEXTS_TOOL} first when it might already be in this written chat; use this only when it is not there.`;
  }
  static sendTaskRequest() {
    return `The job itself: what to do or find out, and what to come back with. Not the caller's sentence. Add their exact words only where the wording itself is part of the job. Maximum ${VOICE_CALL_REQUEST_CHAR_LIMIT} characters; preserve every constraint, prohibition, and approval requirement. Overlong requests are rejected, never truncated.`;
  }
  static recallTextMessages() {
    return `Read ${VOICE_CALL_RECALL_TEXTS_SCOPE} Oldest first. ${VOICE_CALL_RECALL_TEXTS_WHEN} Say nothing about calling this.`;
  }
  static staySilent() {
    return `Say nothing this turn. This is only for a last-landed ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} entry, when speaking would give them nothing new. Never use it when they just talked to you. Never on the unpaid turn after ${VOICE_CALL_NUDGE_MAIN_TOOL}. Never on a ${VOICE_CALL_WORK_LANDED_TOOL} outcome they have not heard. Never on the same turn as spoken words. The caller hears nothing. Say nothing about calling this.`;
  }
  static endTheCall() {
    return `Hang up and end this call. Use it only when the caller says a parting greeting like "all done", "bye", "thanks, that's all", "stop", "go away", "shut up", "stop listening", "leave me alone", "goodbye", or "hang up". An unclear pause, a task still open, "ok" in the middle of work, or a "stop" that cancels that work is not a hang-up. ALWAYS say your goodbye out loud first, including when hanging up is the last step of something else they asked for: the line drops the moment you call this, so nothing after it is heard. Never call it while they are still asking for something.`;
  }
};

