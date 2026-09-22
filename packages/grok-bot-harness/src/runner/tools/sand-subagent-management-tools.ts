/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-subagent-management-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
function elapsedLabel(elapsedMs3) {
  const totalSeconds = Math.max(0, Math.round(elapsedMs3 / 1e3));
  if (totalSeconds < 90) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}
function describeRunningSubagent(info2, options2) {
  const header = `- ${info2.subagentId} [${info2.subagentType}] "${info2.title}" \u2014 running for ${elapsedLabel(info2.elapsedMs)}, ${info2.toolCallCount} tool call(s)`;
  if (!options2.detailed) return header;
  const lines2 = [header];
  if (info2.recentActivity.length > 0) {
    lines2.push("  Recent activity (oldest \u2192 newest):");
    for (const entry of info2.recentActivity) {
      lines2.push(`    ${entry}`);
    }
  } else {
    lines2.push("  No tool activity recorded yet.");
  }
  if (info2.transcriptPath != null) {
    lines2.push(`  Full transcript (read it for the complete play-by-play): ${info2.transcriptPath}`);
  } else if (info2.transcriptReadable === true) {
    lines2.push(
      `  Full transcript: call ReadTranscript with subagent_id=${info2.subagentId} for the complete play-by-play.`
    );
  }
  return lines2.join("\n");
}
function notRunningMessage(subagentId, running) {
  const base = `No subagent "${subagentId}" is currently running. It may have already finished (you're revived automatically with a finished subagent's result), or the id is wrong.`;
  if (running.length === 0) {
    return `${base} No subagents are running right now.`;
  }
  return `${base} Currently running: ${running.map((info2) => info2.subagentId).join(", ")}.`;
}
var checkSubagentParameters = external_exports.object({
  subagent_id: external_exports.string().trim().optional().describe(
    "The Agent ID of the subagent to inspect (from the Task tool result that dispatched it). Omit to list every subagent currently running."
  )
});
var messageSubagentParameters = external_exports.object({
  subagent_id: external_exports.string().trim().min(1).describe(
    "The Agent ID of the running subagent to message (from the Task tool result that dispatched it)."
  ),
  message: external_exports.string().trim().min(1).describe(
    "The instruction to inject. The subagent interrupts what it is doing, reads this, and continues from where it was with its context intact."
  )
});
var stopSubagentParameters = external_exports.object({
  subagent_id: external_exports.string().trim().optional().describe(
    "The Agent ID of one running subagent to abort (from the Task tool result that dispatched it). Omit it when all is true."
  ),
  all: external_exports.boolean().optional().describe(
    "Set true to abort every background subagent you have running, in one call, instead of naming one, and with them, where this host can reach them, every other agent you handed work to: peers you messaged with priority and cloud agents you launched (the result says when it could not). Use this whenever the user asks you to stop, halt, cancel, or quit the current work: it stops each running child independently (computerUse, executor, and any other Task children, plus anything those children started), delivers a stop to each peer (which then stops its own subagents the same way), cancels each running cloud agent, and the result lists exactly which ids were stopped, which had already finished, and which could not be stopped and why. Do not combine with subagent_id."
  )
}).refine((args) => args.all === true !== hasSubagentId(args.subagent_id), {
  message: "Pass exactly one of subagent_id or all: true."
});
function hasSubagentId(subagentId) {
  return subagentId !== void 0 && subagentId.length > 0;
}
function stoppedSubagentOf(info2) {
  return { subagentId: info2.subagentId, subagentType: info2.subagentType, title: info2.title };
}
function describeStoppedSubagent(subagent) {
  return `- ${subagent.subagentId} [${subagent.subagentType}] "${subagent.title}"`;
}
async function stopAllRunningSubagents(controller, args) {
  const running = await controller.listRunningSubagents();
  const stopped2 = [];
  const alreadyFinished = [];
  const failed2 = [];
  const [outcomes, delegated] = await Promise.all([
    Promise.all(
      running.map(async (info2) => {
        try {
          return { info: info2, result: await controller.abortSubagent(info2.subagentId) };
        } catch (error42) {
          return {
            info: info2,
            result: "failed",
            error: error42 instanceof Error ? error42.message : String(error42)
          };
        }
      })
    ),
    stopDelegatedWorkSafely(controller, args)
  ]);
  for (const outcome of outcomes) {
    const subagent = stoppedSubagentOf(outcome.info);
    switch (outcome.result) {
      case "ok":
        stopped2.push(subagent);
        break;
      case "not-running":
        alreadyFinished.push(subagent);
        break;
      case "failed":
        failed2.push({ ...subagent, error: outcome.error });
        break;
    }
  }
  return {
    stopped: stopped2,
    alreadyFinished,
    failed: failed2,
    delegated,
    ...controller.stopDelegatedWork === void 0 ? { delegatedWorkUnavailable: true } : {}
  };
}
async function stopDelegatedWorkSafely(controller, args) {
  if (controller.stopDelegatedWork === void 0) return [];
  try {
    return await controller.stopDelegatedWork(args);
  } catch (error42) {
    return [
      {
        kind: "peer",
        id: "",
        name: "delegated work",
        result: "failed",
        detail: error42 instanceof Error ? error42.message : String(error42)
      }
    ];
  }
}
function delegatedWorkLabel(outcome) {
  if (outcome.kind === "cloud_agent") return `cloud agent ${outcome.id}`;
  if (outcome.id.length === 0) return outcome.name;
  return `${outcome.name} (agent ${outcome.id})`;
}
function describeDelegatedWork(outcome) {
  const label = delegatedWorkLabel(outcome);
  switch (outcome.result) {
    case "stopped":
      return outcome.kind === "cloud_agent" ? `- ${label}: run cancelled.` : `- ${label}: stop delivered; its turn is cancelled and its own subagents are being torn down.`;
    case "not_running":
      return `- ${label}: already idle, nothing to stop.`;
    case "unreachable":
      return `- ${label}: could NOT be stopped from here${outcome.detail === void 0 ? "" : ` (${outcome.detail})`}. Tell the user it may still be working.`;
    case "failed":
      return `- ${label}: stop failed${outcome.detail === void 0 ? "" : ` (${outcome.detail})`}. Retry StopSubagent with all: true; if it fails again, tell the user it may still be working.`;
    case "stale":
      return `- ${label}: not contacted; that handoff is old${outcome.detail === void 0 ? "" : ` (${outcome.detail})`} and presumed finished. If the user says this peer is the one still working, message it with SendToAgent priority: true to stop.`;
  }
}
function formatDelegatedWorkLines(delegated) {
  if (delegated.length === 0) return [];
  const stopped2 = delegated.filter((outcome) => outcome.result === "stopped").length;
  return [
    `Work you handed to other agents (${stopped2} of ${delegated.length} stopped):`,
    ...delegated.map(describeDelegatedWork)
  ];
}
var DELEGATED_WORK_UNAVAILABLE_LINE = "Agents you handed work to (peers you messaged with priority, cloud agents you launched) could NOT be reached from this host, so none of them was stopped here. If any may still be working, message each peer with SendToAgent priority: true to stop, cancel each running cloud agent you launched yourself, and tell the user what may still be running.";
function formatStopAllSubagentsReport(report) {
  const total = report.stopped.length + report.alreadyFinished.length + report.failed.length;
  if (total === 0 && report.delegated.length === 0) {
    return report.delegatedWorkUnavailable === true ? `No background subagents are running, so there was nothing of your own to stop. ${DELEGATED_WORK_UNAVAILABLE_LINE} Background shell commands you started yourself are not subagents: terminate those with their reported PIDs.` : "No background subagents are running and no work is out with other agents, so there was nothing to stop. Background shell commands you started yourself are not subagents: terminate those with their reported PIDs.";
  }
  const lines2 = [];
  if (total === 0) {
    lines2.push("No background subagents of your own are running.");
  }
  if (report.stopped.length > 0) {
    lines2.push(
      `Stopped ${report.stopped.length} of ${total} running subagent(s). They are torn down, will not report back, and anything they dispatched or ran inside their own turn ends with them:`,
      ...report.stopped.map(describeStoppedSubagent)
    );
  }
  if (report.alreadyFinished.length > 0) {
    lines2.push(
      `${report.alreadyFinished.length} had already finished before the stop reached them (you are revived with a finished subagent's result separately):`,
      ...report.alreadyFinished.map(describeStoppedSubagent)
    );
  }
  if (report.failed.length > 0) {
    lines2.push(
      `${report.failed.length} could NOT be stopped and may still be running. Retry each with StopSubagent and its id; if it still fails, tell the user which work may still be running:`,
      ...report.failed.map((subagent) => `${describeStoppedSubagent(subagent)}: ${subagent.error}`)
    );
  }
  lines2.push(...formatDelegatedWorkLines(report.delegated));
  if (report.delegatedWorkUnavailable === true) {
    lines2.push(DELEGATED_WORK_UNAVAILABLE_LINE);
  }
  lines2.push(
    "Do not resume, redispatch, or continue the stopped work unless the user asks again. Background shell commands you started yourself are not covered: terminate those with their reported PIDs."
  );
  return lines2.join("\n");
}
function createSubagentManagementTools(controller) {
  return [
    defineCommunicateTool(controller, {
      id: "CHECK_SUBAGENT",
      name: "CheckSubagent",
      description: "Check how a background subagent you dispatched (via Task) is doing without waiting for it to finish. Returns its status, how long it has been running, the tool calls it has made recently, and where to read its full play-by-play. Pass the subagent's Agent ID (from the Task result), or omit it to list every running subagent. Use this when a subagent \u2014 especially a computerUse one driving the box desktop \u2014 is taking a long time or might be stuck or looping, so you can decide whether to MessageSubagent it or StopSubagent it. This is read-only; it's not polling for completion (you're revived automatically when a subagent finishes).",
      parameters: checkSubagentParameters,
      execute: async (_ctx, args, deps) => {
        const id = args.subagent_id;
        if (id == null || id.length === 0) {
          const running = await deps.listRunningSubagents();
          if (running.length === 0) {
            return "No background subagents are running right now.";
          }
          return [
            `${running.length} subagent(s) running:`,
            ...running.map((info3) => describeRunningSubagent(info3, { detailed: false })),
            "Pass a subagent_id to see its recent activity and transcript path."
          ].join("\n");
        }
        const info2 = await deps.getRunningSubagent(id);
        if (info2 == null) {
          return notRunningMessage(id, await deps.listRunningSubagents());
        }
        return describeRunningSubagent(info2, { detailed: true });
      }
    }),
    defineCommunicateTool(controller, {
      id: "MESSAGE_SUBAGENT",
      name: "MessageSubagent",
      description: "Force a message into a running background subagent to course-correct it without aborting it. The subagent interrupts its current step, reads your message, and continues from where it was (its context is preserved \u2014 it does not start over). Use this to unstick or redirect a subagent that is looping, stuck, or heading the wrong way \u2014 for example to tell a computerUse subagent to try a different element, that the user just signed in so it can proceed, or to wrap up and report what it has. Pass the subagent's Agent ID (from the Task result). You're still revived with its result when it finishes; to follow up AFTER a subagent has already finished, use Task with the resume parameter instead.",
      parameters: messageSubagentParameters,
      execute: async (ctx, args, deps) => {
        if (deps.reviewSteer !== void 0) {
          const review = await deps.reviewSteer(ctx, {
            subagentId: args.subagent_id,
            message: args.message,
            toolCallId: deps.toolCallId
          });
          if (!review.allowed) {
            return review.reason;
          }
        }
        const result = await deps.steerSubagent(args.subagent_id, args.message);
        if (result === "not-running") {
          return notRunningMessage(args.subagent_id, await deps.listRunningSubagents());
        }
        return `Message delivered to subagent ${args.subagent_id}. It will interrupt what it's doing, take your message into account, and keep working. You'll be revived with its result when it finishes \u2014 don't wait on it.`;
      }
    }),
    defineCommunicateTool(controller, {
      id: "STOP_SUBAGENT",
      name: "StopSubagent",
      description: "Abort background subagents you dispatched (via Task). Pass one subagent's Agent ID (from the Task result) to kill a subagent that is wedged, looping with no progress, or no longer needed \u2014 for example a computerUse subagent stuck on the box desktop. Pass all: true instead to stop everything at once: every running subagent, plus, where this host can reach them, the other agents you handed work to (peers you messaged with priority and cloud agents you launched); the result says when it could not reach them. This is the call to make when the user asks you to stop, halt, cancel, or quit the current work, and it must be your first action for that request rather than checking or stopping children one by one. Stopping tears the subagent down and frees its box desktop window; it does not come back, and you are not separately revived for it (this tool's result is the confirmation, and with all: true it lists exactly which ids were stopped, which had already finished, which could not be stopped, and what happened to each peer and cloud agent). If you instead want a subagent to change course and keep going, use MessageSubagent.",
      parameters: stopSubagentParameters,
      execute: async (_ctx, args, deps) => {
        if (args.all === true || !hasSubagentId(args.subagent_id)) {
          return formatStopAllSubagentsReport(
            await stopAllRunningSubagents(deps, { toolCallId: deps.toolCallId })
          );
        }
        const subagentId = args.subagent_id;
        const result = await deps.abortSubagent(subagentId);
        if (result === "not-running") {
          return notRunningMessage(subagentId, await deps.listRunningSubagents());
        }
        return `Stopping subagent ${subagentId}. It will be torn down and won't report back.`;
      }
    })
  ];
}

