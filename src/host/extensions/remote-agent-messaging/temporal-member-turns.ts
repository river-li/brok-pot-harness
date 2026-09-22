init_grok_bot_pb();
init_errors();
var TEMPORAL_MEMBER_TURN_RPC_TIMEOUT_MS = 2e4;
var SERVER_ROOM_RESULT_ATTEMPTS_WHILE_SERVER_RESTORES_NONCE = 3;
var SERVER_ROOM_RESULT_RETRY_DELAY_MS = 500;
var TEMPORAL_MEMBER_TURN_DEADLINE_MS = 3e5;
var TEMPORAL_MEMBER_TURN_HOST_TIMEOUT_MS = 6e5;
var OUTCOMES = {
  delivered: true,
  pass: true,
  skipped: true,
  timeout: true,
  cancelled: true,
  error: true
};
function isTemporalMemberTurnOutcome(value) {
  return isKeyOf(OUTCOMES, value);
}
function parseTemporalMemberTurnOutcome(value) {
  return typeof value === "string" && isTemporalMemberTurnOutcome(value) ? value : "error";
}
var SERVER_ROOM_OUTCOMES = {
  sent: GrokBotRoomMemberTurnOutcome.SENT,
  pass: GrokBotRoomMemberTurnOutcome.PASS,
  skipped: GrokBotRoomMemberTurnOutcome.SKIPPED,
  timeout: GrokBotRoomMemberTurnOutcome.TIMEOUT,
  cancelled: GrokBotRoomMemberTurnOutcome.CANCELLED,
  error: GrokBotRoomMemberTurnOutcome.ERROR
};
function serverRoomIntakeToDelivery(intake) {
  switch (intake) {
    case GrokBotRoomMemberTurnResultIntake.ACCEPTED:
      return "accepted";
    case GrokBotRoomMemberTurnResultIntake.UNKNOWN_NONCE:
      return "unknown_nonce";
    case GrokBotRoomMemberTurnResultIntake.HOST_UNAVAILABLE:
    case GrokBotRoomMemberTurnResultIntake.UNSPECIFIED:
      return "host_unavailable";
  }
}
function speakerKindToProto(kind) {
  return kind === "agent" ? GrokBotRoomMemberTurnMessage_SpeakerKind.AGENT : GrokBotRoomMemberTurnMessage_SpeakerKind.HUMAN;
}
function createTemporalMemberTurns(deps) {
  const pending = /* @__PURE__ */ new Map();
  const settle = (nonce, result) => {
    const turn = pending.get(nonce);
    if (turn === void 0) return false;
    pending.delete(nonce);
    turn.resolve(result);
    return true;
  };
  const cancelUpstream = (args) => {
    void deps.client.cancelGrokBotRoomMemberTurn(args, { timeoutMs: TEMPORAL_MEMBER_TURN_RPC_TIMEOUT_MS }).catch((error42) => deps.reportFailure(errorLogTag(error42)));
  };
  return {
    isEnabled: deps.isEnabled,
    async requestTemporalMemberTurn(args) {
      const nonce = deps.mintNonce();
      const resultPromise = new Promise((resolve29) => {
        pending.set(nonce, { roomId: args.room.id, memberAgentId: args.member.id, resolve: resolve29 });
      });
      let dispatch;
      try {
        const response = await deps.client.requestGrokBotRoomMemberTurn(
          {
            nonce,
            room: {
              id: args.room.id,
              name: args.room.name,
              description: args.room.description
            },
            memberAgentId: args.member.id,
            peers: args.peers.map((peer) => ({
              id: peer.id,
              name: peer.name,
              description: peer.description
            })),
            newMessages: toRoomTurnMessages(args.newMessages, args.member.id).map((message) => ({
              speakerKind: speakerKindToProto(message.speakerKind),
              speakerName: message.speakerName,
              isSelf: message.isSelf === true,
              text: message.text,
              ...message.replyTo == null ? {} : {
                replyTo: {
                  speakerKind: speakerKindToProto(message.replyTo.speakerKind),
                  speakerName: message.replyTo.speakerName,
                  isSelf: message.replyTo.isSelf === true,
                  quote: message.replyTo.quote
                }
              }
            })),
            isWindingDown: args.isWindingDown,
            deadlineMs: BigInt(deps.clock.now() + TEMPORAL_MEMBER_TURN_DEADLINE_MS),
            ...args.lineage == null ? {} : {
              parentRequestId: args.lineage.parentRequestId,
              rootParentRequestId: args.lineage.rootParentRequestId
            }
          },
          { timeoutMs: TEMPORAL_MEMBER_TURN_RPC_TIMEOUT_MS }
        );
        dispatch = response.dispatch;
      } catch (error42) {
        pending.delete(nonce);
        deps.reportFailure(errorLogTag(error42));
        return { outcome: "error", messages: [] };
      }
      switch (dispatch) {
        case GrokBotRoomMemberTurnDispatch.ACCEPTED:
        case GrokBotRoomMemberTurnDispatch.DUPLICATE:
          break;
        case GrokBotRoomMemberTurnDispatch.NOT_TEMPORAL:
        case GrokBotRoomMemberTurnDispatch.TARGET_NOT_FOUND:
          pending.delete(nonce);
          return { outcome: "skipped", messages: [] };
        case GrokBotRoomMemberTurnDispatch.TEMPORAL_UNAVAILABLE:
        case GrokBotRoomMemberTurnDispatch.UNSPECIFIED:
          pending.delete(nonce);
          return { outcome: "error", messages: [] };
      }
      try {
        return await deps.turnDeadline.run(async () => await resultPromise);
      } catch {
        if (settle(nonce, { outcome: "timeout", messages: [] })) {
          cancelUpstream({ nonce, memberAgentId: args.member.id, reason: "host_timeout" });
        }
        return { outcome: "timeout", messages: [] };
      }
    },
    receiveRoomMemberTurnResult(args) {
      const turn = pending.get(args.nonce);
      if (turn === void 0 || turn.roomId !== args.roomId) return "unknown";
      const outcome = parseTemporalMemberTurnOutcome(args.outcome);
      settle(args.nonce, {
        outcome,
        messages: outcome === "delivered" ? args.messages.filter((message) => typeof message === "string").map((message) => message.trim()).filter((message) => message.length > 0) : []
      });
      return "accepted";
    },
    cancelTemporalMemberTurns(args) {
      for (const [nonce, turn] of [...pending]) {
        if (turn.roomId !== args.roomId) continue;
        settle(nonce, { outcome: "cancelled", messages: [] });
        cancelUpstream({ nonce, memberAgentId: turn.memberAgentId, reason: args.reason });
      }
    },
    async deliverServerRoomMemberTurnResult(args) {
      let failedAttemptMayStillHoldNonce = false;
      for (let attempt = 1; ; attempt++) {
        let delivery;
        try {
          const response = await deps.client.deliverGrokBotRoomMemberTurnResult(
            {
              roomId: args.roomId,
              nonce: args.nonce,
              memberAgentId: args.memberAgentId,
              outcome: SERVER_ROOM_OUTCOMES[args.outcome],
              messages: [...args.messages],
              error: args.error ?? ""
            },
            { timeoutMs: TEMPORAL_MEMBER_TURN_RPC_TIMEOUT_MS }
          );
          delivery = serverRoomIntakeToDelivery(response.intake);
          if (delivery !== "unknown_nonce" || !failedAttemptMayStillHoldNonce) {
            return delivery;
          }
        } catch (error42) {
          deps.reportFailure(errorLogTag(error42));
          failedAttemptMayStillHoldNonce = true;
          delivery = "unreachable";
        }
        if (attempt >= SERVER_ROOM_RESULT_ATTEMPTS_WHILE_SERVER_RESTORES_NONCE) {
          return delivery;
        }
        await new Promise((resolve29) => {
          deps.clock.schedule(SERVER_ROOM_RESULT_RETRY_DELAY_MS * attempt, resolve29);
        });
      }
    }
  };
}
