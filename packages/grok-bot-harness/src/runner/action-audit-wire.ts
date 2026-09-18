init_dashboard_pb();
function nonNegativeBigInt(value) {
  return BigInt(Math.max(0, Math.round(value)));
}
function toSandAuditEventProto(record2, eventId) {
  const base = {
    eventId,
    occurredAtMs: nonNegativeBigInt(record2.occurredAtMs),
    agentId: record2.agentId,
    turnId: record2.turnId ?? "",
    rootTurnId: record2.rootTurnId ?? "",
    subagentId: record2.subagentId ?? "",
    boxId: record2.boxId ?? ""
  };
  const action = record2.action;
  switch (action.kind) {
    case "mcpToolCall":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "mcpToolCall",
          value: new SandAuditEvent_McpToolCall({
            toolCallId: action.toolCallId,
            serverIdentifier: action.serverIdentifier,
            serverName: action.serverName,
            toolName: action.toolName,
            status: action.status,
            durationMs: nonNegativeBigInt(action.durationMs)
          })
        }
      });
    case "shellCommand": {
      const allowed = action.allowed ?? true;
      return new SandAuditEvent({
        ...base,
        action: {
          case: "shellCommand",
          value: new SandAuditEvent_ShellCommand({
            command: action.command,
            kind: action.shellKind,
            target: action.target,
            allowed,
            blockedReason: allowed ? "" : action.blockedReason ?? "",
            classificationReasons: [...action.classificationReasons ?? []]
          })
        }
      });
    }
    case "browserNavigation":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "browserNavigation",
          value: new SandAuditEvent_BrowserNavigation({
            url: action.url,
            pageTitle: action.pageTitle
          })
        }
      });
    case "computerUseSession":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "computerUseSession",
          value: new SandAuditEvent_ComputerUseSession({
            toolCallId: action.toolCallId ?? "",
            actionCount: nonNegativeBigInt(action.actionCount),
            actionCounts: Object.fromEntries(
              Object.entries(action.actionCounts).map(([kind, count]) => [
                kind,
                nonNegativeBigInt(count)
              ])
            ),
            durationMs: nonNegativeBigInt(action.durationMs),
            screenshotCount: nonNegativeBigInt(action.screenshotCount)
          })
        }
      });
    default: {
      const _exhaustive = action;
      return _exhaustive;
    }
  }
}
