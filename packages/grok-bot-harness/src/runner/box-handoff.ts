function buildBoxHandBackPrompt(trigger2) {
  if (trigger2 === "dismissed") {
    return "[The user dismissed your box help request without doing the step you asked for. Treat it as declined: do not assume the step happened, and do not immediately request the box again for the same step. Continue the task without it if you can \u2014 skip the step or find another way. If the task cannot proceed without it, send the user a brief message saying what is blocked, then stop and wait for their reply.]";
  }
  if (trigger2 === "viewer-closed") {
    return "[The user closed the box desktop viewer without explicitly handing control back, so they may or may not have finished the step you asked for. Start with the read-only Screenshot tool to check the current state of the box desktop. If the step is clearly done, continue the task. If you can't tell, send the user a brief message asking whether they finished so you can keep going.]";
  }
  return "[The user handed the box back to you. Please continue your task \u2014 start with the read-only Screenshot tool to see the current state of the box desktop.]";
}
