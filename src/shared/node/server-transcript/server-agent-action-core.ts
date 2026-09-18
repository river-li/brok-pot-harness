init_esm2();
init_dist4();
init_unknown_record();
init_proto();
var SERVER_AGENT_ACTION_TIMEOUT_MS = 2e4;
function approvalResolutionProto(resolution) {
  switch (resolution) {
    case "approved":
      return GrokBotAutoReviewApprovalResolution.APPROVED;
    case "denied":
      return GrokBotAutoReviewApprovalResolution.DENIED;
    case "always":
      return GrokBotAutoReviewApprovalResolution.ALWAYS;
  }
}
function handBackTriggerProto(trigger2) {
  switch (trigger2) {
    case "viewer-closed":
      return GrokBotBoxHandBackTrigger.VIEWER_CLOSED;
    case "dismissed":
      return GrokBotBoxHandBackTrigger.DISMISSED;
    case "button":
    case void 0:
      return GrokBotBoxHandBackTrigger.BUTTON;
  }
}
function clientSurfaceProto(source) {
  switch (source) {
    case "desktop":
      return GrokBotClientSurface.DESKTOP;
    case "mobile":
      return GrokBotClientSurface.MOBILE;
    case void 0:
      return GrokBotClientSurface.UNSPECIFIED;
  }
}
function feedbackActionProto(action) {
  switch (action) {
    case "up":
      return GrokBotFeedbackAction.UP;
    case "down":
      return GrokBotFeedbackAction.DOWN;
    case "submit":
      return GrokBotFeedbackAction.SUBMIT;
    case "revert":
      return GrokBotFeedbackAction.REVERT;
  }
}
function acceptanceLookupOf(args) {
  const {
    response
  } = args;
  let status;
  switch (response.status) {
    case GrokBotSendStatus.NOT_FOUND:
      status = "not-found";
      break;
    case GrokBotSendStatus.ACCEPTED:
      status = "accepted";
      break;
    case GrokBotSendStatus.REJECTED:
      status = "rejected";
      break;
    case GrokBotSendStatus.PENDING:
      status = "pending";
      break;
    case GrokBotSendStatus.UNKNOWN_DURABILITY:
    case GrokBotSendStatus.UNSPECIFIED:
      status = "unknown-durability";
      break;
    default: {
      const _exhaustive = response.status;
      status = "unknown-durability";
      break;
    }
  }
  if (status === "not-found" || status === "unknown-durability") return {
    outcome: status
  };
  const serverSideIdentity = {
    accountSlot: HOST_ACCOUNT_SLOT,
    clientNonce: args.clientNonce,
    agentId: args.agentId,
    inputDigest: ""
  };
  return {
    outcome: "found",
    record: {
      ...serverSideIdentity,
      status,
      acceptedAtMs: response.acceptedAtMs === void 0 ? 0 : Number(response.acceptedAtMs),
      echoEntryId: response.echoEntryId ?? null,
      rejectionCode: status === "rejected" ? response.rejectionCode ?? null : null
    }
  };
}
function refused(refusal, method) {
  return {
    status: "refused",
    failureCode: refusal != null && refusal.failureCode.length > 0 ? refusal.failureCode : null,
    message: refusal != null && refusal.message.length > 0 ? refusal.message : method
  };
}
function staleUserForm(method) {
  return {
    status: "refused",
    failureCode: SAND_USER_FORM_STALE,
    message: method
  };
}
function secretSaveRefused(refusal) {
  return {
    status: "refused",
    failureCode: SAND_SECRET_SAVE_REFUSED,
    message: refusal != null && refusal.message.length > 0 ? refusal.message : SAND_SECRET_SAVE_REFUSED_MESSAGE
  };
}
function unreachable2(args) {
  return {
    status: "unavailable",
    kind: args.kind,
    message: args.message
  };
}
function unreadableDelivery(delivery) {
  return {
    status: "refused",
    failureCode: null,
    message: `unknown-delivery:${delivery}`
  };
}
function isNonceDedupedSendReplayable(error41) {
  if (!(error41 instanceof ConnectError)) return true;
  return error41.code === Code.Unavailable && !error41.metadata.has("retry-after");
}
function localToolPermissionResolutionProto(resolution) {
  switch (resolution) {
    case "allow-once":
      return GrokBotLocalToolPermissionCardResolution.ALLOW_ONCE;
    case "deny":
      return GrokBotLocalToolPermissionCardResolution.DENY;
    case "always":
      return GrokBotLocalToolPermissionCardResolution.ALWAYS;
    case "never":
      return GrokBotLocalToolPermissionCardResolution.NEVER;
  }
}
function userFormClientPlatformProto(platform2) {
  switch (platform2) {
    case "desktop":
      return GrokBotUserFormClientPlatform.DESKTOP;
    case "ios":
      return GrokBotUserFormClientPlatform.IOS;
    case "android":
      return GrokBotUserFormClientPlatform.ANDROID;
    case void 0:
      return GrokBotUserFormClientPlatform.UNSPECIFIED;
  }
}
function userFormDismissModeProto(mode) {
  switch (mode) {
    case "dismissed":
      return GrokBotUserFormDismissMode.DISMISSED;
    case "escalated":
      return GrokBotUserFormDismissMode.ESCALATED;
  }
}
function virtualCardResolutionProto(resolution) {
  return resolution === "approved" ? GrokBotVirtualCardResolution.APPROVED : GrokBotVirtualCardResolution.DENIED;
}
function credentialRequestResolutionProto(resolution) {
  return resolution === "approved" ? GrokBotCredentialRequestResolution.APPROVED : GrokBotCredentialRequestResolution.DENIED;
}
function virtualCardResultOf(response) {
  switch (response.outcome) {
    case GrokBotVirtualCardOutcome.APPROVED:
      return response.spendRequestId != null && response.approvalUrl != null ? {
        status: "approved",
        spendRequestId: response.spendRequestId,
        approvalUrl: response.approvalUrl
      } : {
        status: "failed",
        message: i18n._(
          /*i18n*/
          {
            id: "gh4MsL",
            message: "The server approved the card but returned no Link approval URL."
          }
        )
      };
    case GrokBotVirtualCardOutcome.DENIED:
      return {
        status: "denied"
      };
    case GrokBotVirtualCardOutcome.NEEDS_AUTH:
      return {
        status: "needs_auth"
      };
    case GrokBotVirtualCardOutcome.FAILED:
    case GrokBotVirtualCardOutcome.UNSPECIFIED:
      return {
        status: "failed",
        message: response.message ?? i18n._(
          /*i18n*/
          {
            id: "lp7p28",
            message: "The purchase could not be authorized."
          }
        )
      };
    default: {
      const _exhaustive = response.outcome;
      return {
        status: "failed",
        message: i18n._(
          /*i18n*/
          {
            id: "QqzfGy",
            message: "The server sent an answer this version of Grok Bot can't read. Update Grok Bot, then request a new card."
          }
        )
      };
    }
  }
}
function paymentMethodKindOf(kind) {
  switch (kind) {
    case GrokBotStripeLinkPaymentMethodKind.CARD:
      return "card";
    case GrokBotStripeLinkPaymentMethodKind.BANK_ACCOUNT:
      return "bank_account";
    default:
      return "other";
  }
}
function paymentMethodOf(method) {
  return {
    id: method.id,
    name: method.name,
    isDefault: method.isDefault,
    kind: paymentMethodKindOf(method.kind),
    ...method.brand == null ? {} : {
      brand: method.brand
    },
    ...method.last4 == null ? {} : {
      last4: method.last4
    },
    ...method.expMonth == null ? {} : {
      expMonth: method.expMonth
    },
    ...method.expYear == null ? {} : {
      expYear: method.expYear
    }
  };
}
function paymentMethodsResultOf(response) {
  switch (response.outcome) {
    case GrokBotStripeLinkPaymentMethodsOutcome.OK:
      return {
        status: "ok",
        paymentMethods: response.paymentMethods.map(paymentMethodOf),
        unavailableCount: response.unavailableCount
      };
    case GrokBotStripeLinkPaymentMethodsOutcome.NEEDS_AUTH:
      return {
        status: "needs_auth"
      };
    default:
      return {
        status: "unavailable"
      };
  }
}
var GROK_BOT_REFUSAL_HEADER = "x-grok-bot-refusal";
var GROK_BOT_BOX_HARNESS_REFUSAL = "box_harness";
var GROK_BOT_LOCAL_TOOL_PERMISSION_FALLBACK_HEADER = "x-grok-bot-local-tool-permission-fallback";
function debugDetailText(detail) {
  if (!isUnknownRecord(detail)) return void 0;
  const debug = detail.debug;
  if (!isUnknownRecord(debug)) return void 0;
  const details = debug.details;
  if (!isUnknownRecord(details)) return void 0;
  const described = details.detail;
  if (typeof described !== "string" || described.length === 0) return void 0;
  return described;
}
function describeConnectFailure(error41) {
  for (const detail of error41.details) {
    const described = debugDetailText(detail);
    if (described !== void 0) return described;
  }
  return error41.rawMessage;
}
function classifyServerAgentActionError(error41, method) {
  if (method === "resolveLocalToolPermission" && error41 instanceof ConnectError && error41.code === Code.Unavailable && error41.metadata.get(GROK_BOT_LOCAL_TOOL_PERMISSION_FALLBACK_HEADER) === "gateway") {
    return {
      status: "unimplemented"
    };
  }
  if (error41 instanceof ConnectError && error41.code === Code.NotFound && error41.metadata.get(GROK_BOT_REFUSAL_HEADER) === GROK_BOT_BOX_HARNESS_REFUSAL) {
    return {
      status: "unimplemented",
      scope: "agent"
    };
  }
  if (method === "resolveAutoReviewApproval" && error41 instanceof ConnectError && error41.code === Code.NotFound) {
    return {
      status: "refused",
      failureCode: SAND_AUTO_REVIEW_STALE,
      message: describeConnectFailure(error41)
    };
  }
  if (method === "resolveVirtualCardApproval" && error41 instanceof ConnectError && error41.code === Code.NotFound) {
    return {
      status: "refused",
      failureCode: SAND_VIRTUAL_CARD_STALE,
      message: describeConnectFailure(error41)
    };
  }
  if (method === "submitSecret" && error41 instanceof ConnectError && (error41.code === Code.InvalidArgument || error41.code === Code.FailedPrecondition)) {
    return secretSaveRefused({
      message: describeConnectFailure(error41)
    });
  }
  if (!(error41 instanceof ConnectError)) {
    return unreachable2({
      kind: "network",
      message: error41 instanceof Error ? error41.message : String(error41)
    });
  }
  switch (error41.code) {
    case Code.Unimplemented:
      return {
        status: "unimplemented"
      };
    case Code.Unavailable:
    case Code.ResourceExhausted:
      return unreachable2({
        kind: "network",
        message: describeConnectFailure(error41)
      });
    case Code.DeadlineExceeded:
      return unreachable2({
        kind: "timeout",
        message: describeConnectFailure(error41)
      });
    case Code.Unauthenticated:
    case Code.PermissionDenied:
      return unreachable2({
        kind: "access_denied",
        message: describeConnectFailure(error41)
      });
    case Code.Internal:
    case Code.Unknown:
    case Code.DataLoss:
      return unreachable2({
        kind: "http_5xx",
        message: describeConnectFailure(error41)
      });
    default:
      return {
        status: "refused",
        failureCode: null,
        message: describeConnectFailure(error41)
      };
  }
}
async function perform(client, request3) {
  const callOptions = {
    timeoutMs: SERVER_AGENT_ACTION_TIMEOUT_MS
  };
  switch (request3.method) {
    case "sendPrompt": {
      const {
        args
      } = request3;
      const response = await client.sendGrokBotUserMessage({
        agentId: args.agentId,
        messageId: args.clientNonce,
        text: args.prompt,
        sentAtMs: BigInt(Date.now()),
        richText: args.richText,
        replyToId: args.replyToId,
        isFork: args.isFork === true,
        attachmentPaths: [...args.attachmentPaths ?? []],
        attachmentNames: [...args.attachmentNames ?? []],
        traceparent: args.traceparent,
        enterEpochMs: args.enterEpochMs === void 0 ? void 0 : BigInt(args.enterEpochMs),
        composedAtMs: args.composedAtMs === void 0 ? void 0 : BigInt(args.composedAtMs),
        source: clientSurfaceProto(args.source),
        ...args.sessionId != null && args.sessionId.length > 0 ? {
          sessionId: args.sessionId
        } : {},
        ...args.machineId != null && args.machineId.length > 0 ? {
          machineId: args.machineId
        } : {}
      }, callOptions);
      switch (response.delivery) {
        case GrokBotUserMessageDelivery.ACCEPTED_BOX:
        case GrokBotUserMessageDelivery.ACCEPTED_TEMPORAL:
        case GrokBotUserMessageDelivery.DUPLICATE:
          return {
            status: "ok",
            value: {
              accepted: true
            }
          };
        case GrokBotUserMessageDelivery.REFUSED:
          return refused(response.refusal, request3.method);
        case GrokBotUserMessageDelivery.UNSPECIFIED:
          return unreadableDelivery(response.delivery);
        default: {
          const _exhaustive = response.delivery;
          return unreadableDelivery(_exhaustive);
        }
      }
    }
    case "promptAcceptanceStatus": {
      const {
        args
      } = request3;
      const response = await client.getGrokBotSendStatus({
        agentId: args.agentId,
        messageId: args.clientNonce,
        ...args.sessionId != null && args.sessionId.length > 0 ? {
          sessionId: args.sessionId
        } : {}
      }, callOptions);
      return {
        status: "ok",
        value: acceptanceLookupOf({
          ...args,
          response
        })
      };
    }
    case "interruptAgentRun": {
      const response = await client.interruptGrokBotAgentRun({
        agentId: request3.args.id,
        reason: "user_interrupt",
        ...request3.args.sessionId != null ? {
          sessionId: request3.args.sessionId
        } : {}
      }, callOptions);
      return {
        status: "ok",
        value: {
          hadActiveRun: response.hadActiveRun
        }
      };
    }
    case "respondToWidget": {
      const response = await client.respondGrokBotWidget({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        value: request3.args.value
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: {
          accepted: response.accepted
        }
      };
    }
    case "submitSecret": {
      const response = await client.submitGrokBotSecret({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        value: request3.args.value,
        ...request3.args.sessionId != null && request3.args.sessionId.length > 0 ? {
          sessionId: request3.args.sessionId
        } : {}
      }, callOptions);
      if (response.refusal != null) {
        return secretSaveRefused(response.refusal);
      }
      if (!response.accepted) {
        return secretSaveRefused(void 0);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "resolveCredentialRequest": {
      const response = await client.resolveGrokBotCredentialRequest({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        resolution: credentialRequestResolutionProto(request3.args.resolution),
        ...request3.args.sessionId != null && request3.args.sessionId.length > 0 ? {
          sessionId: request3.args.sessionId
        } : {}
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      if (!response.accepted) {
        return refused(void 0, request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "dismissWidget": {
      const response = await client.dismissGrokBotWidget({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: {
          accepted: response.accepted
        }
      };
    }
    case "submitUserForm": {
      const response = await client.submitGrokBotUserForm({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        values: {
          ...request3.args.values
        },
        platform: userFormClientPlatformProto(request3.args.platform)
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      if (!response.accepted) {
        return staleUserForm(request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "dismissUserForm": {
      const response = await client.dismissGrokBotUserForm({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        mode: userFormDismissModeProto(request3.args.mode),
        platform: userFormClientPlatformProto(request3.args.platform)
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      if (!response.accepted) {
        return staleUserForm(request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "reactToMessage": {
      const response = await client.reactToGrokBotMessage({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        emoji: request3.args.emoji
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "resolveLocalToolPermission": {
      const {
        args
      } = request3;
      const response = await client.resolveGrokBotLocalToolPermission({
        agentId: args.agentId,
        entryId: args.entryId,
        requestId: args.requestId,
        resolution: localToolPermissionResolutionProto(args.resolution),
        ...args.sessionId != null && args.sessionId.length > 0 ? {
          sessionId: args.sessionId
        } : {}
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "resolveVirtualCardApproval": {
      const {
        args
      } = request3;
      const response = await client.resolveGrokBotVirtualCardApproval({
        agentId: args.agentId,
        entryId: args.entryId,
        requestId: args.requestId,
        resolution: virtualCardResolutionProto(args.resolution),
        ...args.paymentMethodId === void 0 ? {} : {
          paymentMethodId: args.paymentMethodId
        }
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: virtualCardResultOf(response)
      };
    }
    case "listVirtualCardPaymentMethods": {
      const response = await client.listGrokBotStripeLinkPaymentMethods({}, callOptions);
      return {
        status: "ok",
        value: paymentMethodsResultOf(response)
      };
    }
    case "resolveAutoReviewApproval": {
      const {
        args
      } = request3;
      await client.resolveGrokBotAutoReviewApproval({
        agentId: args.agentId,
        requestId: args.requestId,
        resolution: approvalResolutionProto(args.resolution),
        approvalPlatform: args.approvalPlatform ?? SAND_APPROVAL_PLATFORM_DESKTOP,
        approvedCommand: args.approvedCommand,
        ...args.sessionId != null && args.sessionId.length > 0 ? {
          sessionId: args.sessionId
        } : {}
      }, callOptions);
      return {
        status: "ok",
        value: null
      };
    }
    case "handBackForeverBox": {
      await client.endGrokBotBoxHandoff({
        agentId: request3.args.id,
        requestId: request3.args.requestId,
        trigger: handBackTriggerProto(request3.args.trigger)
      }, callOptions);
      return {
        status: "ok",
        value: null
      };
    }
    case "setAgentUnread": {
      await client.setGrokBotAgentClientState({
        agentId: request3.args.id,
        ...request3.args.isUnread ? {
          markUnread: true
        } : {
          markRead: true
        }
      }, callOptions);
      return {
        status: "ok",
        value: null
      };
    }
    case "setAgentHiddenFromSidebar": {
      await client.setGrokBotAgentClientState({
        agentId: request3.args.id,
        hiddenFromSidebar: request3.args.isHidden
      }, callOptions);
      return {
        status: "ok",
        value: null
      };
    }
    case "setAgentNotifyOnUpdates": {
      await client.setGrokBotAgentClientState({
        agentId: request3.args.id,
        notifyOnUpdatesEnabled: request3.args.isEnabled
      }, callOptions);
      return {
        status: "ok",
        value: null
      };
    }
    case "voteFeedback": {
      const {
        args
      } = request3;
      const response = await client.voteGrokBotFeedback({
        agentId: args.agentId,
        entryId: args.entryId,
        action: feedbackActionProto(args.action),
        categories: [...args.categories ?? []],
        comment: args.comment
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: null
      };
    }
    case "sendDraft": {
      const response = await client.sendGrokBotDraft({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        ...draftProto(request3.args.draft),
        ...request3.args.sessionId != null && request3.args.sessionId.length > 0 ? {
          sessionId: request3.args.sessionId
        } : {}
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: {
          accepted: response.accepted
        }
      };
    }
    case "discardDraft": {
      const response = await client.discardGrokBotDraft({
        agentId: request3.args.agentId,
        entryId: request3.args.entryId,
        ...request3.args.sessionId != null && request3.args.sessionId.length > 0 ? {
          sessionId: request3.args.sessionId
        } : {}
      }, callOptions);
      if (response.refusal != null) {
        return refused(response.refusal, request3.method);
      }
      return {
        status: "ok",
        value: {
          accepted: response.accepted
        }
      };
    }
  }
}
function draftProto(draft) {
  if (draft.type === "email-draft") {
    return {
      draft: {
        case: "email",
        value: {
          from: draft.draft.from,
          to: [...draft.draft.to],
          cc: [...draft.draft.cc ?? []],
          subject: draft.draft.subject,
          body: draft.draft.body
        }
      }
    };
  }
  return {
    draft: {
      case: "slack",
      value: {
        ...draft.draft.workspace === void 0 ? {} : {
          workspace: draft.draft.workspace
        },
        target: draft.draft.target,
        ...draft.draft.thread === void 0 ? {} : {
          thread: draft.draft.thread
        },
        body: draft.draft.body
      }
    }
  };
}
function createServerAgentActionCore(client) {
  return async (request3) => {
    try {
      return await perform(client, request3);
    } catch (error41) {
      if (request3.method !== "sendPrompt" || !isNonceDedupedSendReplayable(error41)) {
        return classifyServerAgentActionError(error41, request3.method);
      }
      const firstAttempt = classifyServerAgentActionError(error41);
      try {
        const {
          agentId,
          clientNonce
        } = request3.args;
        const probe = await client.getGrokBotSendStatus({
          agentId,
          messageId: clientNonce,
          ...request3.args.sessionId != null && request3.args.sessionId.length > 0 ? {
            sessionId: request3.args.sessionId
          } : {}
        }, {
          timeoutMs: SERVER_AGENT_ACTION_TIMEOUT_MS
        });
        const lookup3 = acceptanceLookupOf({
          agentId,
          clientNonce,
          response: probe
        });
        if (lookup3.outcome !== "not-found") return firstAttempt;
        return await perform(client, request3);
      } catch (retryError) {
        return classifyServerAgentActionError(retryError);
      }
    }
  };
}
