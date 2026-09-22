/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/prompt/speak-policy.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VoiceSpeakPolicy = class _VoiceSpeakPolicy {
  /**
   * How long a spoken update holds the floor against further work news.
   * Inside it, only a genuinely new outcome earns another turn from the work.
   * Caller speech always earns a turn.
   */
  static QUIET_WINDOW_SECONDS = 30;
  static ackLines() {
    return ["When a tool call will be quick, say nothing and invoke it."];
  }
  /**
   * Call send_task for the job after a short spoken beat on the same
   * response. A looping errand may still ask one or two things you
   * would otherwise guess at, as its own turn.
   */
  static receiptLines() {
    return [
      `${VOICE_CALL_NUDGE_MAIN_TOOL} is never the quick path. Speak a short beat on this response that names the job in how you talk, then call it. Never start that beat with a confirmation. Never say you are calling the tool. Checking or fetching is not that beat.`,
      `A real errand that has to loop may ask the one or two things you would otherwise guess at; call ${VOICE_CALL_NUDGE_MAIN_TOOL} anyway, and what they answer reaches the same job.`
    ];
  }
  static voiceLoopLines(tools = []) {
    return [
      "Starting something owes one short spoken beat on that same response before the tool, in your own words about the job. Never start that beat with a confirmation. Never say you are calling the tool, and it never needs saying twice.",
      `If ${VOICE_CALL_NUDGE_MAIN_TOOL} left this response silent, keep talking on the next turn: a question, a suggestion, or a beat already on this call. Do not fill that beat with a start-status or silence.`,
      `If they talked to you, speak. A take, a recap, a story, a joke, small talk they asked for is done now; do not ask what kind first, do not ${VOICE_CALL_NUDGE_MAIN_TOOL} it, and do not hold it for the errand.`,
      `Never re-announce you are still working within about ${_VoiceSpeakPolicy.QUIET_WINDOW_SECONDS} seconds of your last line.`,
      "Speak again for the outcome, a real step, a problem they need to hear, or anything they just said to you.",
      "A work update that only repeats a start you already named is not a turn.",
      "Never chase or poll the work; it reports back on its own.",
      "An empty tool result is not news. Do not announce quiet or that nothing came in.",
      ...VoiceCallToolPrompts.inFlight(tools)
    ];
  }
  /**
   * What a reply to the caller carries. Stated once, for the prompt and for
   * the `stay_silent` refusal the model actually speaks that turn from.
   */
  static NEXT_STEP = "what happens now: the job you are taking and what it is about, where the work stands and when you will say more, or the answer if you already have it. A confirmation on its own \u2014 okay, got it, sure, will do \u2014 is not a reply.";
  /** The caller spoke last, so the reply carries what happens now. */
  static replyLines() {
    return [`When they spoke last, tell them ${_VoiceSpeakPolicy.NEXT_STEP}`];
  }
  /**
   * After a complete spoken beat, keep the call alive in the same breath.
   * Like a person: a follow-up, a suggestion, or a new thread — never an
   * invented inbox item. A follow-up is talk, not a ticket you guessed.
   */
  static continueLines() {
    return [
      "After you answer, keep the call going with one natural question, the way a person would: a follow-up, a suggestion, or whatever comes next.",
      "It does not have to be about the last line.",
      ..._VoiceSpeakPolicy.noInventedWorkLines()
    ];
  }
  /**
   * The keep-talking beat is not a briefing you made up. Shared by the
   * continue cadence and the never-invent section so a rewrite of one
   * still leaves the ban on the other.
   */
  static noInventedWorkLines() {
    return [
      "A follow-up is not invented work. Do not invent work, inbox items, or product facts that no tool and no real context on this call returned."
    ];
  }
  static interruptedLines() {
    return [
      "When they talk over you, stop and listen; they heard only the start.",
      "If they have moved on, answer them; if they still want it, pick up where they cut you off without restarting the sentence."
    ];
  }
  /**
   * Tool-result error when the desktop refuses `stay_silent` because they just
   * talked. Lands in that function_call_output, never as session prompt copy.
   */
  static theyJustSpoke() {
    return `They just spoke to you and have heard nothing back. Answer out loud, and tell them ${_VoiceSpeakPolicy.NEXT_STEP} Do not stay_silent.`;
  }
  /**
   * Tool-result error when the desktop refuses `stay_silent` because a
   * `work_landed` outcome asked for a turn and has not been spoken. Lands in
   * that function_call_output, never as session prompt copy.
   */
  static newsOwed() {
    return "Work of yours just landed and they have not heard it. Say what it means out loud now.";
  }
  /**
   * Tool-result error, and the `response.create` instructions, when the
   * desktop refuses `stay_silent` on the unpaid `send_task` receipt turn.
   * Lands on that function_call_output and on the steered create, never as
   * session prompt copy.
   */
  static receiptTurnOwed(tools = []) {
    return [
      "The job is under way. Keep talking with a natural question or a suggestion. Do not announce that you started.",
      ...VoiceCallToolPrompts.receipt(tools)
    ].join(" ");
  }
  static staySilentPlan({ theyJustTalked, newsOwed, receiptOwed, alreadySpokeThisTurn = false }) {
    if (theyJustTalked) {
      return { kind: "spoken", error: _VoiceSpeakPolicy.theyJustSpoke() };
    }
    if (alreadySpokeThisTurn) {
      return { kind: "silent" };
    }
    if (newsOwed) {
      return { kind: "spoken", error: _VoiceSpeakPolicy.newsOwed() };
    }
    if (receiptOwed) {
      return {
        kind: "spoken",
        error: _VoiceSpeakPolicy.receiptTurnOwed(VoiceCallSessionTools.of([VOICE_CALL_SILENT_TOOL]))
      };
    }
    return { kind: "silent" };
  }
};

