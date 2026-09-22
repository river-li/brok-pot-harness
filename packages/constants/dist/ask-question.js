/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/ask-question.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createAskQuestionAutoAnswerIdentity(kind = "timeout") {
  return {
    marker: ASK_QUESTION_AUTO_ANSWER_MARKER,
    kind
  };
}
function formatAskQuestionAutoAnswerReason(identity = createAskQuestionAutoAnswerIdentity()) {
  return `${identity.marker}:${identity.kind}|${ASK_QUESTION_AUTO_ANSWER_REASON_BODY}`;
}
function parseAskQuestionAutoAnswerIdentity(reason) {
  const trimmed = (reason !== null && reason !== void 0 ? reason : "").trim();
  const match2 = trimmed.match(new RegExp(`^${ASK_QUESTION_AUTO_ANSWER_MARKER}:(timeout|other)\\|`));
  if (match2 === null) {
    return void 0;
  }
  return createAskQuestionAutoAnswerIdentity(match2[1]);
}
function isAskQuestionAutoAnswerReason(reason) {
  if (parseAskQuestionAutoAnswerIdentity(reason) !== void 0) {
    return true;
  }
  return (reason !== null && reason !== void 0 ? reason : "").trim().startsWith(ASK_QUESTION_AUTO_ANSWER_REASON_PREFIX);
}
var ASK_QUESTION_AUTO_ANSWER_MARKER, ASK_QUESTION_AUTO_ANSWER_REASON_PREFIX, ASK_QUESTION_AUTO_ANSWER_REASON_BODY, ASK_QUESTION_AUTO_ANSWER_REASON;
var init_ask_question = __esm({
  "../packages/constants/dist/ask-question.js"() {
    "use strict";
    ASK_QUESTION_AUTO_ANSWER_MARKER = "ask_question_auto_answer";
    ASK_QUESTION_AUTO_ANSWER_REASON_PREFIX = "No response was received within the time limit";
    ASK_QUESTION_AUTO_ANSWER_REASON_BODY = `${ASK_QUESTION_AUTO_ANSWER_REASON_PREFIX}. Proceed with the recommended option(s) you offered for each question, or your best judgment based on the information already available.`;
    ASK_QUESTION_AUTO_ANSWER_REASON = formatAskQuestionAutoAnswerReason();
  }
});

