function triggerParseFailure(family, reason) {
  return { ok: false, family, reason };
}
function isTriggerParseFailure(value) {
  return "ok" in value && value.ok === false;
}
function renderTriggerParseFailure(failure2) {
  let subject = `${failure2.family} trigger`;
  if (failure2.family === "unrecognized") subject = "trigger";
  else if (failure2.family === "group") subject = "trigger set";
  return `the ${subject} ${failure2.reason}.`;
}
