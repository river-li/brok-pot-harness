function delegationTargetOf(kind) {
  return kind === "cloud_agent_launch" || kind === "cloud_agent_followup" ? "cloud_agent" : "subagent";
}
function sandAuditInitiatedByOf(options2) {
  if (options2.isConnectorWake === true) return void 0;
  if (options2.isTopLevelAutomationSubagent === true && options2.requestSource === "automation") {
    return "routine";
  }
  if (options2.isSubagentRunner) return "subagent";
  if (options2.isGroupMemberTurn === true) return "agent";
  switch (options2.requestSource) {
    case "automation":
      return "routine";
    case "agent":
      return "agent";
    case "turn":
    case "voice-call":
      return "user";
    default:
      return void 0;
  }
}
var MAX_SEQUENCED_TURNS = 1024;
function createActionAuditSequencer(options2 = {}) {
  const firstSequence = Math.max(1, Math.floor(options2.firstSequence ?? 1));
  const nextByTurn = /* @__PURE__ */ new Map();
  let highWater = firstSequence - 1;
  return {
    next(turnId) {
      const key = turnId ?? "";
      const sequence = nextByTurn.get(key) ?? firstSequence;
      nextByTurn.delete(key);
      nextByTurn.set(key, sequence + 1);
      if (nextByTurn.size > MAX_SEQUENCED_TURNS) {
        const oldest = nextByTurn.keys().next().value;
        if (oldest !== void 0) nextByTurn.delete(oldest);
      }
      highWater = Math.max(highWater, sequence);
      return sequence;
    },
    highWater: () => highWater
  };
}
function withEventSequence(auditor, sequencer) {
  return {
    record(record2) {
      auditor.record(
        record2.sequence === void 0 ? { ...record2, sequence: sequencer.next(record2.turnId) } : record2
      );
    }
  };
}
function withInitiatedBy(auditor, initiatedBy) {
  return {
    record(record2) {
      const stamp = record2.initiatedBy ?? initiatedBy();
      auditor.record(stamp === void 0 ? record2 : { ...record2, initiatedBy: stamp });
    }
  };
}
