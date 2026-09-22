/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/send-acceptance.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path159 = require("node:path");
init_dist4();

// @recovered-fragment 2/2
var persistedSendEchoBrand = /* @__PURE__ */ Symbol("sand.persistedSendEcho");
function persistedSendEcho(entry, isOnActiveTranscript) {
  return { [persistedSendEchoBrand]: true, entry, isOnActiveTranscript };
}
function appendAddressedEcho(tm, session, isAddressedChatOnScreen, buildEntry, appendOptions) {
  if (isAddressedChatOnScreen()) {
    const entry2 = tm.appendEntry(buildEntry(getTranscript()), {
      persistBeforeEmit: true,
      deferEmit: true,
      onPersistOutcome: appendOptions.onPersistOutcome
    });
    return persistedSendEcho(entry2, true);
  }
  const entry = buildEntry(session.db.getTranscriptEntries());
  const isDurable = session.db.appendTranscriptEntry(entry);
  appendOptions.onPersistOutcome(isDurable);
  if (!isDurable) {
    throw new SandSendNotPersistedError();
  }
  if (entryRaisesUserActivitySignal(entry)) {
    tm.sessionStore.markSessionActivity(session);
  }
  return persistedSendEcho(entry, false);
}
function applySendRosterSideEffects(tm, session, trimmedPrompt, readAddressedTranscript) {
  let needsRosterRefresh = false;
  const agentDir = (0, import_node_path159.dirname)(session.dbPath);
  const profilePath = getSandProfilePath(agentDir);
  const currentProfile = readSandProfileFile(profilePath);
  const seededName = conversationNameFromPrompt(trimmedPrompt);
  if (readAddressedTranscript().length === 0 && hasPlaceholderProfileName(currentProfile)) {
    writeSandProfileFile(profilePath, {
      name: seededName,
      description: currentProfile?.description ?? "",
      title: currentProfile?.title ?? "",
      avatarShape: currentProfile?.avatarShape ?? "",
      avatarColor: currentProfile?.avatarColor ?? "",
      namedBy: "app"
    });
    tm.roster.lastKnownAgentNames.set(session.id, seededName);
    needsRosterRefresh = true;
  } else if (seedRoomProfileName({ agentDir, prompt: trimmedPrompt }) === "seeded") {
    tm.roster.lastKnownAgentNames.set(session.id, seededName);
    needsRosterRefresh = true;
  }
  tm.trayErrors.clearForAgent(session.id);
  if (session.db.getAwaitingUserResponse() != null) {
    session.db.setAwaitingUserResponse(null);
    needsRosterRefresh = true;
  }
  return needsRosterRefresh;
}
function emitSendAck(args) {
  const {
    tm,
    session,
    echoEntries,
    isAddressedChatOnScreen,
    directAddressedAcceptance,
    clientNonce,
    traceCtx,
    sendTrace,
    acceptedDurably,
    durableAppendStartEpochMs,
    durableAppendStartPerfMs,
    hostReceiptEpochMs,
    hostReceiptPerfMs
  } = args;
  const isStillOnScreenAtEmit = isAddressedChatOnScreen();
  let hasOffscreenAppendedEntries = false;
  for (const { entry, isOnActiveTranscript } of echoEntries) {
    if (isOnActiveTranscript && isStillOnScreenAtEmit) {
      tm.roster.emit({ type: "appended", entry });
    } else {
      hasOffscreenAppendedEntries = true;
      if (directAddressedAcceptance) {
        tm.roster.emit({ type: "appended", entry }, session.id);
      }
    }
  }
  if (hasOffscreenAppendedEntries) {
    void tm.roster.emitAgentUpdate(session.id);
  }
  if (traceCtx !== void 0) {
    try {
      const nonceAttributes = clientNonce != null && clientNonce.length > 0 ? { "sand.client_nonce": clientNonce } : {};
      const durableAppendMs = Math.max(0, Math.round(performance.now() - durableAppendStartPerfMs));
      recordCompletedSpanIfParented(
        traceCtx.withName("durable-append"),
        {
          startTime: new Date(durableAppendStartEpochMs),
          attributes: {
            "sand.durable_append_ms": durableAppendMs,
            "sand.durable": acceptedDurably,
            "sand.conversation_id": session.id,
            ...nonceAttributes
          }
        },
        new Date(durableAppendStartEpochMs + durableAppendMs)
      );
      const ackEmitHostMs = Math.max(0, Math.round(performance.now() - hostReceiptPerfMs));
      recordCompletedSpanIfParented(
        traceCtx.withName("send-ack-emit"),
        {
          startTime: new Date(hostReceiptEpochMs),
          attributes: {
            "sand.ack_emit_host_ms": ackEmitHostMs,
            "sand.conversation_id": session.id,
            ...nonceAttributes
          }
        },
        new Date(hostReceiptEpochMs + ackEmitHostMs)
      );
      sendTrace?.span.setAttribute("sand.ack_emit_host_ms", ackEmitHostMs);
    } catch {
    }
  }
  if (hasOffscreenAppendedEntries) {
    tm.hostLog(
      `[sand] send raced a chat switch away from ${session.id}: entries persisted to the addressed store off screen`,
      "warn"
    );
  }
  return {
    markAcceptedAfterDispatch: () => {
      if (clientNonce == null || clientNonce.length === 0) return;
      tm.acceptanceLedger.markAccepted({ accountSlot: HOST_ACCOUNT_SLOT, clientNonce });
    }
  };
}

