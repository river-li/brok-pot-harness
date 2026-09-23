init_errors();
function describeShellOutcome(status) {
  if (status === "success") return "finished";
  if (status === "aborted") return "was stopped";
  return "failed";
}
function buildShellRevivalPrompt(completions) {
  const blocks = completions.map((completion) => {
    const outcome = describeShellOutcome(completion.status);
    const lines2 = [`Background command "${completion.title}" ${outcome}.`];
    if (completion.detail !== void 0 && completion.detail.length > 0) {
      lines2.push(completion.detail);
    }
    if (completion.outputPath !== void 0 && completion.outputPath.length > 0) {
      lines2.push(`Full output: ${completion.outputPath}`);
    }
    if (completion.quietOrigin != null) {
      lines2.push(describeQuietOriginNote(completion.quietOrigin));
    }
    if (completion.originRoom != null) {
      lines2.push(describeGroupRoomOriginNote(completion.originRoom));
    }
    return lines2.join("\n");
  });
  const intro = completions.length === 1 ? "A command you started in the background has finished." : `${completions.length} commands you started in the background have finished.`;
  return [
    `[A background command just completed] ${intro}`,
    "",
    blocks.join("\n\n"),
    "",
    isAllQuietOrigin(completions) ? QUIET_REVIVAL_INSTRUCTION : `Pick the work back up: check the result (read the output file if you need the full logs), then either keep going or wrap up. If this result is genuinely new and relevant to the user, or the user asked to be told when this finished, tell them with a SendMessage. Lead with the concrete thing that finished, not a bare pronoun like "That" (they cannot see the background task). If it is stale, irrelevant, already handled, or a duplicate, and the user was not waiting on it, just stay silent and end the turn with no SendMessage rather than narrating it. Keep your status current, and clear it once everything is done and you're idle.`
  ].join("\n");
}
function cloudAgentWakeTurnsOf(completions) {
  return completions.filter((completion) => completion.subagentType === "cursor-agent").map((completion) => ({ status: completion.status, wakeOrigin: "none" }));
}
var SandAutomationCompletionNotPersistedError = class extends SandDomainError {
  name = "SandAutomationCompletionNotPersistedError";
};
var CompletionRevivals = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  pendingSubagentCompletions = /* @__PURE__ */ new Map();
  revivingSubagentAgentIds = /* @__PURE__ */ new Set();
  pendingShellCompletions = /* @__PURE__ */ new Map();
  revivingShellAgentIds = /* @__PURE__ */ new Set();
  automationCompletionDeliveries = /* @__PURE__ */ new Map();
  handleBackgroundSubagentCompletion(completion) {
    const parentAgentId = completion.parentAgentId;
    if (completion.automationRunUuid !== void 0 && completion.parentWakeRequested !== true) {
      const deliveryId = completion.automationRunUuid;
      const existing = this.automationCompletionDeliveries.get(deliveryId);
      if (existing !== void 0) return existing;
      const delivery = this.persistAutomationSubagentCompletion(completion, deliveryId);
      this.automationCompletionDeliveries.set(deliveryId, delivery);
      const clear = () => {
        if (this.automationCompletionDeliveries.get(deliveryId) === delivery) {
          this.automationCompletionDeliveries.delete(deliveryId);
        }
      };
      void delivery.then(clear, clear);
      return delivery;
    }
    if (this.tm.sessions.deletedAgentIds.has(parentAgentId)) {
      this.tm.telemetry.reportSubagentRevival({
        parentAgentId,
        outcome: "dropped",
        completionCount: 1,
        subagentType: completion.subagentType,
        subagentAgentId: completion.subagentAgentId,
        reason: "agent_deleted"
      });
      return;
    }
    const queued = this.pendingSubagentCompletions.get(parentAgentId) ?? [];
    if (queued.some((c) => c.subagentAgentId === completion.subagentAgentId)) {
      return;
    }
    queued.push(completion);
    this.pendingSubagentCompletions.set(parentAgentId, queued);
    void this.reviveForSubagentCompletions(parentAgentId);
  }
  async persistAutomationSubagentCompletion(completion, automationRunUuid) {
    const parentAgentId = completion.parentAgentId;
    const deliveryId = sandAutomationCompletionId(automationRunUuid);
    if (this.tm.sessions.deletedAgentIds.has(parentAgentId)) {
      this.tm.telemetry.reportSubagentRevival({
        parentAgentId,
        outcome: "dropped",
        completionCount: 1,
        subagentType: completion.subagentType,
        subagentAgentId: completion.subagentAgentId,
        reason: "agent_deleted"
      });
      return;
    }
    try {
      const session = await this.tm.sessions.resolveBackgroundSession(parentAgentId);
      if (completion.result.trim().length > 0) {
        const automationName = completion.quietOrigin?.automation?.name.trim();
        const durableCompletion = {
          id: deliveryId,
          text: formatSandAutomationCompletionText({
            automationName,
            status: completion.status === "completed" ? "completed" : "failed",
            result: completion.result
          }),
          attribution: sandAutomationCompletionAttribution(automationName)
        };
        const persistence = session.db.storeAutomationCompletion(durableCompletion);
        if (persistence === "failed") {
          throw new SandAutomationCompletionNotPersistedError(
            `Failed to persist automation completion ${deliveryId}`
          );
        }
        if (persistence === "pending") {
          this.tm.runnerRegistry.runners.get(session.id)?.enqueueAutomationCompletion(durableCompletion);
        }
      }
      this.tm.pendingWakes.clearSettledPendingWake({
        agentId: parentAgentId,
        kind: "subagent",
        workId: completion.subagentAgentId
      });
      this.tm.telemetry.reportSubagentRevival({
        parentAgentId,
        outcome: "delivered",
        completionCount: 1,
        subagentType: completion.subagentType,
        subagentAgentId: completion.subagentAgentId,
        isQuietOrigin: completion.quietOrigin != null
      });
    } catch (error42) {
      this.tm.telemetry.reportAgentError({
        source: "background_followup",
        conversationId: parentAgentId,
        error: classifyAgentError(error42),
        detail: sandErrorDetail(error42)
      });
      this.tm.telemetry.reportSubagentRevival({
        parentAgentId,
        outcome: "dropped",
        completionCount: 1,
        subagentType: completion.subagentType,
        subagentAgentId: completion.subagentAgentId,
        reason: "error"
      });
      throw error42;
    }
  }
  async reviveForSubagentCompletions(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingSubagentAgentIds.has(agentId)) return;
    this.revivingSubagentAgentIds.add(agentId);
    try {
      while ((this.pendingSubagentCompletions.get(agentId)?.length ?? 0) > 0) {
        const completions = this.pendingSubagentCompletions.get(agentId) ?? [];
        this.pendingSubagentCompletions.delete(agentId);
        for (const completion of completions) {
          this.tm.pendingWakes.clearSettledPendingWake({
            agentId,
            kind: completion.subagentType === "cursor-agent" ? "cloud-agent" : "subagent",
            workId: completion.subagentAgentId
          });
        }
        const { outcome, reason, sentMessageCount } = await this.runSubagentRevival(
          agentId,
          completions
        );
        this.tm.telemetry.reportSubagentRevival({
          parentAgentId: agentId,
          outcome,
          completionCount: completions.length,
          subagentType: completions[0]?.subagentType,
          reason,
          sentMessageCount,
          isQuietOrigin: isAllQuietOrigin(completions)
        });
      }
    } finally {
      this.revivingSubagentAgentIds.delete(agentId);
    }
  }
  async runSubagentRevival(agentId, completions) {
    if (completions.length === 0) return { outcome: "delivered" };
    if (!this.tm.execution.canExecute) {
      return { outcome: "dropped", reason: "no_runner" };
    }
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch (error42) {
      if (!isAgentAbsent(error42)) {
        this.tm.telemetry.reportAgentError({
          source: "background_followup",
          conversationId: agentId,
          error: classifyAgentError(error42),
          detail: sandErrorDetail(error42)
        });
      }
      return { outcome: "dropped", reason: "session_unavailable" };
    }
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    let result = { outcome: "delivered" };
    const cloudAgentWakes = cloudAgentWakeTurnsOf(completions);
    let wakeTurnOutcome;
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "background-revival");
        try {
          const unansweredPrompts = this.tm.widgetResponses.collectUnansweredQuestionPrompts(session);
          const runResult = await runner.run(
            buildSubagentRevival(completions, {
              canvasCursorAgentIds: runner.canvasCursorAgentIds
            }),
            {
              hidden: true,
              isSilenceAllowed: true,
              autoReviewEpoch: "continue",
              revivingDesktopSubagentAgentId: revivingDesktopSubagentAgentId(completions),
              ...unansweredPrompts
            }
          );
          wakeTurnOutcome = cloudAgentWakeTurnOutcome(runResult);
          await this.tm.roster.emitAgentUpdate(session.id);
          if (runResult.aborted) {
            result = { outcome: "superseded" };
          } else if (runResult.pausedForUpgrade === true) {
            this.tm.upgradeResume.markAgentResumePendingForPausedRevival(session);
            result = { outcome: "dropped", reason: "quiesced" };
          } else {
            result = {
              outcome: "delivered",
              sentMessageCount: runResult.sentMessageCount
            };
          }
        } catch (error42) {
          this.tm.telemetry.reportAgentError({
            source: "background_followup",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error42),
            detail: sandErrorDetail(error42)
          });
          const description9 = describeAgentRunError(error42);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description9,
            ...hostTrayTitle({ kind: "background_task_follow_up_failed", description: description9 })
          });
          result = { outcome: "dropped", reason: "error" };
        } finally {
          recordCloudAgentWakeTurns(
            this.tm.cloudAgentMetrics,
            cloudAgentWakes,
            wakeTurnOutcome ?? "aborted"
          );
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "subagent-revival" }
    );
    return result;
  }
  handleBackgroundShellCompletion(completion) {
    if (!this.tm.pendingWakes.enqueuePendingWake(this.pendingShellCompletions, completion.agentId, [
      completion
    ])) {
      this.tm.telemetry.reportShellRevival({
        conversationId: completion.agentId,
        outcome: "dropped",
        completionCount: 1,
        isQuietOrigin: completion.quietOrigin != null,
        reason: "agent_gone"
      });
      return;
    }
    void this.reviveForShellCompletions(completion.agentId);
  }
  async reviveForShellCompletions(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingShellAgentIds.has(agentId)) return;
    this.revivingShellAgentIds.add(agentId);
    try {
      while ((this.pendingShellCompletions.get(agentId)?.length ?? 0) > 0) {
        const completions = this.pendingShellCompletions.get(agentId) ?? [];
        this.pendingShellCompletions.delete(agentId);
        for (const completion of completions) {
          this.tm.pendingWakes.clearSettledPendingWake({
            agentId,
            kind: "shell",
            workId: completion.shellId
          });
        }
        await this.runShellRevival(agentId, completions);
      }
    } finally {
      this.revivingShellAgentIds.delete(agentId);
    }
  }
  async runShellRevival(agentId, completions) {
    if (completions.length === 0) return;
    const reportOutcome = (outcome, extras) => {
      this.tm.telemetry.reportShellRevival({
        conversationId: agentId,
        outcome,
        completionCount: completions.length,
        isQuietOrigin: isAllQuietOrigin(completions),
        ...extras
      });
    };
    if (!this.tm.execution.canExecute) {
      reportOutcome("dropped", { reason: "no_runner" });
      return;
    }
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      reportOutcome("dropped", { reason: "session_unavailable" });
      return;
    }
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "background-revival");
        try {
          const unansweredPrompts = this.tm.widgetResponses.collectUnansweredQuestionPrompts(session);
          const runResult = await runner.run(buildShellRevivalPrompt(completions), {
            hidden: true,
            isSilenceAllowed: true,
            autoReviewEpoch: "continue",
            ...unansweredPrompts
          });
          if (runResult.aborted) {
            reportOutcome("superseded");
          } else if (runResult.pausedForUpgrade === true) {
            this.tm.upgradeResume.markAgentResumePendingForPausedRevival(session);
            reportOutcome("dropped", { reason: "quiesced" });
          } else {
            reportOutcome("delivered", {
              sentMessageCount: runResult.sentMessageCount
            });
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error42) {
          this.tm.telemetry.reportAgentError({
            source: "background_followup",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error42),
            detail: sandErrorDetail(error42)
          });
          const description9 = describeAgentRunError(error42);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description9,
            ...hostTrayTitle({ kind: "background_command_follow_up_failed", description: description9 })
          });
          reportOutcome("dropped", { reason: "error" });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "shell-revival" }
    );
  }
};
