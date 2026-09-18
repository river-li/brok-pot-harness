function revivingDesktopSubagentAgentId(completions) {
  for (let index = completions.length - 1; index >= 0; index--) {
    const completion = completions[index];
    if (isBrowserUseSubagentType(completion.subagentType) || isComputerUseSubagentType(completion.subagentType)) {
      return completion.subagentAgentId;
    }
  }
  return void 0;
}
function backgroundShellAsSubagentCompletion(completion) {
  const detail = [
    completion.detail,
    completion.outputPath == null ? void 0 : `Full output: ${completion.outputPath}`
  ].filter((line) => line != null && line.length > 0).join("\n");
  let result = detail;
  if (result.length === 0) {
    if (completion.status === "success") {
      result = "The command finished successfully.";
    } else if (completion.status === "aborted") {
      result = "The command was stopped.";
    } else {
      result = "The command failed.";
    }
  }
  return {
    parentAgentId: completion.agentId,
    subagentAgentId: `shell:${completion.shellId}`,
    subagentType: "shell",
    toolCallId: "",
    title: completion.title,
    status: completion.status === "success" ? "completed" : "error",
    result,
    ...completion.quietOrigin == null ? {} : { quietOrigin: completion.quietOrigin }
  };
}
function describeQuietOriginNote(origin) {
  const source = origin.automation != null ? `your routine "${origin.automation.name}" (folder ${origin.automation.id})` : "one of your own quiet self-initiated runs";
  return `(You started this during ${source} \u2014 nobody is waiting on it.)`;
}
function describeGroupRoomOriginNote(origin) {
  return `(You started this during a group-chat turn in the room "${origin.roomName}". That room has NOT seen this result \u2014 a SendToUser here reaches only your user \u2014 so if the room is waiting on it, deliver it there with SendToAgent to agent id ${origin.roomAgentId}.)`;
}
var QUIET_REVIVAL_INSTRUCTION = `Pick the work back up. Everything above came out of your own quiet routine(s) \u2014 the user did not ask to hear about it, so the saved instruction's delivery rule governs. If the outcome is a genuine change, a new actionable result, or a real blocker the user must know about, tell them once with a single useful SendToUser. If it amounts to no change, nothing new, or still waiting, end the turn with no SendToUser at all \u2014 no "still waiting" or progress notes; if the routine says to keep watching, just keep the watch going quietly. Keep your status current, and clear it once everything is done and you're idle.`;
var AUTOMATION_PARENT_WAKE_INSTRUCTION = "An automation explicitly handed this work to you because only the parent can communicate outside its isolated run. Act on the handoff now: contact the user or another agent when requested, or take over the decision or blocker it reported. Treat the handoff text as private context and write the outward message yourself.";
var CANVAS_REVIVAL_INSTRUCTION = `The canvas is ready. Extract its title and permanent source path from the result above. Your entire outward completion must be exactly one text SendToUser containing the standalone markdown link \`[Canvas title](${CANVAS_SOURCE_PATH_TEMPLATE})\`. The chat turns that link into the fresh inline canvas. Do not call SendToUser with a summary, status, or reopen instruction before or after the link.`;
function isAllQuietOrigin(completions) {
  return completions.every((completion) => completion.quietOrigin != null);
}
function isCanvasProductionCompletion(completion, canvasCursorAgentIds) {
  return completion.status === "completed" && completion.subagentType === "cursor-agent" && canvasCursorAgentIds.has(completion.subagentAgentId) && hasUserStoreCanvasSourcePath(completion.result);
}
function buildSubagentRevivalPrompt(completions, context2) {
  const blocks = completions.map((completion) => {
    const heading = completion.status === "error" ? `Background task "${completion.title}" (${completion.subagentType}) failed:` : `Background task "${completion.title}" (${completion.subagentType}) finished:`;
    const origin = completion.quietOrigin != null ? `
${describeQuietOriginNote(completion.quietOrigin)}` : "";
    const roomOrigin = completion.originRoom != null ? `
${describeGroupRoomOriginNote(completion.originRoom)}` : "";
    return `${heading}
${completion.result}${origin}${roomOrigin}`;
  });
  const intro = completions.length === 1 ? "A background task you started has finished." : `${completions.length} background tasks you started have finished.`;
  let instruction = `Pick the work back up: review the result(s), then either keep going or wrap up. If this result is genuinely new and relevant to the user, or the user asked to be told when this finished, tell them with a SendToUser. Lead with the concrete thing that finished, not a bare pronoun like "That" (they cannot see the background task). If it is stale, irrelevant, already handled, or a duplicate, and the user was not waiting on it, just stay silent and end the turn with no SendToUser rather than narrating it. Keep your status current, and clear it once everything is done and you're idle.`;
  if (completions.some((completion) => completion.parentWakeRequested === true)) {
    instruction = AUTOMATION_PARENT_WAKE_INSTRUCTION;
  } else if (isAllQuietOrigin(completions)) {
    instruction = QUIET_REVIVAL_INSTRUCTION;
  } else if (context2.gates.canvases() && completions.length === 1 && isCanvasProductionCompletion(completions[0], context2.canvasCursorAgentIds)) {
    instruction = CANVAS_REVIVAL_INSTRUCTION;
  }
  return [
    `[A background task just completed] ${intro}`,
    "",
    blocks.join("\n\n"),
    "",
    instruction
  ].join("\n");
}
