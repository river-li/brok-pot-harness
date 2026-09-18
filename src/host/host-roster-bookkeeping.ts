function createHostRosterBookkeeping(extensions) {
  let latestActiveAgentId = null;
  let runningAgentIds = /* @__PURE__ */ new Set();
  let isBusy = false;
  return {
    get latestActiveAgentId() {
      return latestActiveAgentId;
    },
    get isBusy() {
      return isBusy;
    },
    apply(activeAgentId) {
      const normalizedActiveAgentId = activeAgentId != null && activeAgentId.length > 0 ? activeAgentId : null;
      latestActiveAgentId = normalizedActiveAgentId;
      extensions.api("attachments").setFallbackAgentId(normalizedActiveAgentId);
      const previouslyRunning = runningAgentIds;
      runningAgentIds = new Set(extensions.api("transcript").liveRunningAgentIds());
      isBusy = runningAgentIds.size > 0;
      const reminders = extensions.api("forever-box").diskPressureReminder;
      const started2 = new Set([...runningAgentIds].filter((id) => !previouslyRunning.has(id)));
      if (started2.size > 0) reminders.enroll(started2);
      extensions.api("forever-box").setBusy(isBusy);
      const stateBackstop = extensions.api("state-backstop");
      const boxStore = extensions.api("box-store-sync");
      if (stateBackstop.isEnabled || boxStore.isEnabled) {
        for (const agentId of previouslyRunning) {
          if (!runningAgentIds.has(agentId)) {
            stateBackstop.scheduleSnapshot(agentId);
            boxStore.scheduleStoreDbSnapshot(agentId);
            if (boxStore.isEnabled) {
              extensions.api("working-state-export").scheduleWarm(agentId);
            }
          }
        }
      }
      if (normalizedActiveAgentId != null) {
        void extensions.api("source-map").getOrCreate(normalizedActiveAgentId);
      }
    }
  };
}
