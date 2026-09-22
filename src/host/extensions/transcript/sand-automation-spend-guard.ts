/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/sand-automation-spend-guard.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SPEND_GUARD_IDLE_TTL_MS = 3 * 24 * 60 * 6e4;
var SPEND_GUARD_MIN_UNREAD_COUNT = 15;
var SPEND_GUARD_MIN_FIRES_SINCE_VIEWED = 20;
var SPEND_GUARD_PAUSE_DELAY_MS = 3 * 24 * 60 * 6e4;
var SPEND_GUARD_SNOOZE_MS = 30 * 24 * 60 * 6e4;
var SPEND_GUARD_VALUE_PREFIX = "spend-guard:";
var SPEND_GUARD_ANSWER_VALUES = {
  keep: `${SPEND_GUARD_VALUE_PREFIX}keep`,
  pause: `${SPEND_GUARD_VALUE_PREFIX}pause`,
  optOut: `${SPEND_GUARD_VALUE_PREFIX}never-ask`,
  resume: `${SPEND_GUARD_VALUE_PREFIX}resume`,
  stayPaused: `${SPEND_GUARD_VALUE_PREFIX}stay-paused`
};
function interpretSpendGuardAnswer(value) {
  for (const [answer, sentinel] of Object.entries(SPEND_GUARD_ANSWER_VALUES)) {
    if (value === sentinel) return answer;
  }
  return null;
}
function evaluateAutomationSpendGuard({
  nowMs: nowMs2,
  lastViewedAtMs,
  unreadCount,
  firesSinceViewedCount,
  nudgedAtMs,
  snoozedUntilMs,
  optedOut
}) {
  if (optedOut) return "opted-out";
  if (nowMs2 - lastViewedAtMs < SPEND_GUARD_IDLE_TTL_MS) return "user-active";
  if (snoozedUntilMs != null && nowMs2 < snoozedUntilMs) return "snoozed";
  if (nudgedAtMs != null && nudgedAtMs > lastViewedAtMs) {
    return nowMs2 - nudgedAtMs >= SPEND_GUARD_PAUSE_DELAY_MS ? "pause" : "awaiting-ack";
  }
  if (unreadCount >= SPEND_GUARD_MIN_UNREAD_COUNT || firesSinceViewedCount >= SPEND_GUARD_MIN_FIRES_SINCE_VIEWED) {
    return "nudge";
  }
  return "below-thresholds";
}
function countAutomationRunsSince(automations, sinceMs) {
  let count = 0;
  for (const automation of automations) {
    for (const run of automation.runs) {
      if (run.startedAt > sinceMs) count++;
    }
  }
  return count;
}
function buildSpendGuardNudgeWidget() {
  return {
    prompt: "You've been away for a bit \u2014 keep my routines running?",
    copyKind: "automation_spend_guard_nudge",
    options: [
      { label: "Keep them running", value: SPEND_GUARD_ANSWER_VALUES.keep, style: "primary" },
      { label: "Pause them all", value: SPEND_GUARD_ANSWER_VALUES.pause },
      { label: "Keep running, don't ask again", value: SPEND_GUARD_ANSWER_VALUES.optOut }
    ]
  };
}
function buildSpendGuardPausedWidget() {
  return {
    prompt: "I paused all your routines while you were away to avoid wasted spend. Want me to start them back up?",
    copyKind: "automation_spend_guard_paused",
    options: [
      { label: "Resume routines", value: SPEND_GUARD_ANSWER_VALUES.resume, style: "primary" },
      { label: "Keep them paused", value: SPEND_GUARD_ANSWER_VALUES.stayPaused }
    ]
  };
}
var SPEND_GUARD_ANSWER_ACKS = {
  keep: "keep your routines running, and not to be asked again for a month",
  resume: "start the paused routines back up",
  optOut: "keep your routines running and never be asked about this again",
  pause: "pause every one of your routines",
  stayPaused: "leave your routines paused"
};
function renderSpendGuardAnswerAck(answer) {
  return [
    "<system_reminder>",
    `The app asked the user about the money your routines spend while they are away. They chose to ${SPEND_GUARD_ANSWER_ACKS[answer]}, and the app has ALREADY applied that itself.`,
    "Acknowledge their choice in one short line. Do NOT edit any automation.json and do NOT ask again.",
    "</system_reminder>"
  ].join("\n");
}
function isSpendGuardCard(widget, value) {
  return interpretSpendGuardAnswer(value) != null && widget.options.some((option) => option.value === value);
}
function renderSpendGuardNudgeReminder({
  nowMs: nowMs2,
  lastViewedAtMs,
  unreadCount,
  firesSinceViewedCount,
  timeZone
}) {
  const away = lastViewedAtMs > 0 ? `hasn't opened this chat since ${formatTimestamp2(lastViewedAtMs, timeZone)}` : "has never opened this chat";
  const deadline = formatTimestamp2(nowMs2 + SPEND_GUARD_PAUSE_DELAY_MS, timeZone);
  return [
    "<system_reminder>",
    `The user ${away} \u2014 ${unreadCount} of your messages are unread and your routines have run ${firesSinceViewedCount} times since then. They may be spending money on work nobody is reading.`,
    "The app has already asked them directly whether to keep your routines running, and applies their answer itself. Do NOT ask again yourself and do NOT edit any automation.json; just acknowledge their choice if it comes back as their reply.",
    `If they neither answer nor return by ${deadline}, the app will pause ALL of this agent's routines and tell them so.`,
    "</system_reminder>"
  ].join("\n");
}

