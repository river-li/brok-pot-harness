function nonNegativeBigInt(value) {
  return BigInt(Math.max(0, Math.round(value)));
}
function settledDelegationFields(action) {
  if (action.direction !== "completed") return {};
  if (action.durationMs === void 0) return { outcome: action.outcome };
  return { outcome: action.outcome, durationMs: nonNegativeBigInt(action.durationMs) };
}
function toSandAuditEventProto(record2, eventId) {
  const base = {
    eventId,
    occurredAtMs: nonNegativeBigInt(record2.occurredAtMs),
    agentId: record2.agentId,
    turnId: record2.turnId ?? "",
    rootTurnId: record2.rootTurnId ?? "",
    subagentId: record2.subagentId ?? "",
    boxId: record2.boxId ?? "",
    eventSequence: nonNegativeBigInt(record2.sequence ?? 0),
    toolCallId: record2.toolCallId ?? "",
    initiatedBy: record2.initiatedBy ?? ""
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
            classificationReasons: [...action.classificationReasons ?? []],
            machineId: action.machineId,
            exitCode: action.exitCode,
            durationMs: action.durationMs === void 0 ? void 0 : nonNegativeBigInt(action.durationMs)
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
    case "toolResult":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "toolResult",
          value: new SandAuditEvent_ToolResult({
            toolName: action.toolName,
            outcome: action.outcome,
            durationMs: nonNegativeBigInt(action.durationMs),
            errorCategory: action.errorCategory ?? "",
            targetHost: action.targetHost ?? ""
          })
        }
      });
    case "messageDelivery":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "messageDelivery",
          value: new SandAuditEvent_MessageDelivery({
            destinationType: action.destinationType,
            destinationId: action.destinationId ?? "",
            result: action.result,
            failureCategory: action.failureCategory ?? "",
            messageId: action.messageId ?? ""
          })
        }
      });
    case "fileTransfer":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "fileTransfer",
          value: new SandAuditEvent_FileTransfer({
            direction: action.direction,
            target: action.target,
            byteCount: action.byteCount === void 0 ? void 0 : nonNegativeBigInt(action.byteCount),
            outcome: action.outcome,
            errorCategory: action.errorCategory ?? "",
            machineId: action.machineId ?? ""
          })
        }
      });
    case "guardrail":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "guardrail",
          value: new SandAuditEvent_Guardrail({
            kind: action.guardrailKind,
            detector: action.detector,
            action: action.action,
            count: nonNegativeBigInt(action.count ?? 0),
            targetHost: action.targetHost ?? "",
            source: action.source,
            toolName: action.toolName ?? "",
            resolution: action.resolution ?? "",
            durationMs: action.durationMs === void 0 ? void 0 : nonNegativeBigInt(action.durationMs),
            decisionId: action.decisionId ?? ""
          })
        }
      });
    case "automationRun":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "automationRun",
          value: new SandAuditEvent_AutomationRun({
            automationId: action.automationId,
            runId: action.runId,
            trigger: action.trigger,
            outcome: action.outcome,
            durationMs: nonNegativeBigInt(action.durationMs)
          })
        }
      });
    case "skillActivated":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "skillActivated",
          value: new SandAuditEvent_SkillActivated({
            skillName: action.skillName,
            trigger: action.trigger,
            source: action.source
          })
        }
      });
    case "toolDecision":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "toolDecision",
          value: new SandAuditEvent_ToolDecision({
            decisionId: action.decisionId,
            toolName: action.toolName,
            source: action.source,
            approvalMode: action.approvalMode,
            outcome: action.outcome,
            ruleId: action.ruleId ?? ""
          })
        }
      });
    case "delegation":
      return new SandAuditEvent({
        ...base,
        action: {
          case: "delegation",
          value: new SandAuditEvent_Delegation({
            direction: action.direction,
            kind: action.delegationKind,
            target: delegationTargetOf(action.delegationKind),
            targetId: action.targetId,
            ...settledDelegationFields(action)
          })
        }
      });
    default: {
      const _exhaustive = action;
      return _exhaustive;
    }
  }
}
