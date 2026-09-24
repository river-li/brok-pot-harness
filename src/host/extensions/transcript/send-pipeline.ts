/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/send-pipeline.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
var import_node_path160 = require("node:path");
var import_node_url15 = require("node:url");

// @recovered-fragment 2/3
init_invariant();

// @recovered-fragment 3/3
var SendPipeline = class {
  constructor(tm) {
    this.tm = tm;
    this.boxRequests = new BoxRequestEntries(tm);
  }
  tm;
  sendAttachmentBatchIds = /* @__PURE__ */ new Map();
  turnEpochs = /* @__PURE__ */ new Map();
  latestRecoverySends = /* @__PURE__ */ new Map();
  recoveryBreakEpochs = /* @__PURE__ */ new Map();
  inFlightSends = /* @__PURE__ */ new Map();
  boxRequests;
  promptAcceptanceStatus(args) {
    return this.tm.acceptanceLedger.lookup(args);
  }
  async sendPrompt(prompt, options2) {
    const nonce = options2.clientNonce != null && options2.clientNonce.length > 0 ? options2.clientNonce : void 0;
    if (nonce == null) return this.sendPromptOnce(prompt, options2);
    const inFlight = this.inFlightSends.get(nonce);
    if (inFlight != null) {
      this.tm.hostLog(
        `[sand] duplicate send (nonce still in flight) \u2014 coalescing onto the running attempt`,
        "info"
      );
      return inFlight;
    }
    const digest = sendInputDigest({
      agentId: options2.agentId,
      prompt,
      richText: options2.richText,
      replyToId: options2.replyToId,
      isFork: options2.isFork,
      automationWriteProvenance: options2.automationWriteProvenance,
      recipeSetupOperationId: options2.recipeSetupOperationId,
      attachmentPaths: options2.attachmentPaths,
      attachmentNames: options2.attachmentNames
    });
    const admission = this.tm.acceptanceLedger.admitSend({
      accountSlot: HOST_ACCOUNT_SLOT,
      clientNonce: nonce,
      inputDigest: digest
    });
    if (admission.kind === "duplicate") {
      this.tm.hostLog(`[sand] duplicate send (nonce already accepted) \u2014 idempotent no-op`, "info");
      return;
    }
    const pending = this.sendPromptOnce(prompt, options2, { clientNonce: nonce, digest });
    this.inFlightSends.set(nonce, pending);
    try {
      await pending;
    } catch (error42) {
      this.tm.acceptanceLedger.clearUnlessAccepted({
        accountSlot: HOST_ACCOUNT_SLOT,
        clientNonce: nonce
      });
      throw error42;
    } finally {
      this.inFlightSends.delete(nonce);
    }
  }
  async sendPromptOnce(prompt, options2, admission) {
    var _stack = [];
    try {
      const trimmedPrompt = prompt.trim();
      const attachmentPaths = Array.isArray(options2.attachmentPaths) ? options2.attachmentPaths.filter((path31) => typeof path31 === "string") : [];
      const appendUserMessage = options2.appendUserMessage ?? true;
      if (trimmedPrompt.length === 0 && attachmentPaths.length === 0) return;
      invariant(this.tm.execution.canExecute, RUNNER_UNATTACHED_MESSAGE);
      const awaitTurn = options2.awaitTurn ?? true;
      const sendTrace = __using(_stack, beginSendTrace(options2.traceparent));
      const traceCtx = sendTrace?.ctx;
      const hostReceiptEpochMs = Date.now();
      const hostReceiptPerfMs = performance.now();
      if (options2.directAddressedAcceptance !== true) {
        await this.tm.sessions.ensureActionTarget(options2.agentId);
      }
      const targetAgentId = options2.agentId ?? (await traceSendPhase(traceCtx, "ensureSession", () => this.tm.sessions.ensureSession())).id;
      const wasInFlight = this.tm.runLifecycle.runningAgentIds().has(targetAgentId);
      const session = await this.tm.groupChat.pinMemberSessionForGroupTurn(targetAgentId);
      const _sendSessionPin = __using(_stack, {
        [Symbol.dispose]: () => this.tm.runLifecycle.endSessionRun(session)
      });
      if (this.tm.groupChat.isServerRoomSession(session)) {
        throw new SandServerRoomSendError(
          "This room runs on the server; this box can't accept messages for it."
        );
      }
      const isAddressedChatOnScreen = () => this.tm.sessions.activeSession?.id === session.id && this.tm.sessions.inMemoryTranscriptAgentId === session.id;
      const readAddressedTranscript = () => isAddressedChatOnScreen() ? getTranscript() : session.db.getTranscriptEntries();
      const appendEcho = (buildEntry, appendOptions) => appendAddressedEcho(this.tm, session, isAddressedChatOnScreen, buildEntry, appendOptions);
      let promptForRun = trimmedPrompt;
      let interruptedMessageId;
      if (process.env.GROKBOT_REMOTE_SERVER_MODE === "1" && /^\/continue-interrupted(?:\s|$)/i.test(trimmedPrompt)) {
        const match = /^\/continue-interrupted\s+([^\s]+)\s*$/i.exec(trimmedPrompt);
        if (match == null) throw new Error("Use /continue-interrupted followed by the request ID shown in this Bot's interruption notice.");
        const marker = this.tm.interruptedUserTurnStore?.find(session.id, match[1]);
        if (process.env.GROKBOT_REMOTE_SERVER_MODE !== "1" || marker?.state !== "interrupted") {
          throw new Error("That interrupted request is not pending for this Bot. Check the interruption notice and use its request ID.");
        }
        const original = readAddressedTranscript().find((entry) => entry.kind === "message" && entry.role === "user" && entry.id === marker.userMessageId);
        if (original == null || typeof original.content !== "string") {
          throw new Error("The original request is missing from this Bot's transcript. Review the transcript and send a new task.");
        }
        promptForRun = `[The user explicitly resumed interrupted request ${marker.userMessageId}. Original request: ${original.content}. Review the transcript and Box for actions already completed. Continue the unfinished work and deliver the original requested result without repeating completed side effects.]`;
        interruptedMessageId = marker.userMessageId;
      }
      try {
        sendTrace?.span.setAttribute("sand.conversation_id", session.id);
        sendTrace?.span.setAttribute("sand.attachment_count", attachmentPaths.length);
        sendTrace?.span.setAttribute(
          "sand.span_scope",
          awaitTurn ? "host-receipt-to-turn-end" : "host-receipt-to-durable-acceptance"
        );
        if (options2.clientNonce != null && options2.clientNonce.length > 0) {
          sendTrace?.span.setAttribute("sand.client_nonce", options2.clientNonce);
        }
        if (options2.isFork === true) sendTrace?.span.setAttribute("sand.is_fork", true);
      } catch {
      }
      if (!this.tm.groupChat.isGroupSession(session)) {
        this.tm.telemetry.reportUserMessageReceived({
          conversationId: session.id,
          wasInFlight
        });
      }
      session.db.setIntroductionPending(false);
      const needsRosterRefresh = applySendRosterSideEffects(
        this.tm,
        session,
        trimmedPrompt,
        readAddressedTranscript
      );
      const { replyToId, replyContext, isFork } = resolveSendReplyThreading(
        this.tm,
        options2.replyToId,
        options2.isFork === true,
        readAddressedTranscript
      );
      const attachmentNames = Array.isArray(options2.attachmentNames) ? options2.attachmentNames : [];
      const attachmentBatchId = attachmentPaths.length > 0 ? crypto.randomUUID() : void 0;
      const durableAppendStartEpochMs = Date.now();
      const durableAppendStartPerfMs = performance.now();
      let acceptedDurably = true;
      const observePersistOutcome = (isDurable) => {
        if (!isDurable) acceptedDurably = false;
      };
      const echoEntries = [];
      const rollbackAppendedEntries = () => {
        for (const { entry } of echoEntries) {
          session.db.deleteTranscriptEntry(entry.id);
          if (this.tm.sessions.inMemoryTranscriptAgentId === session.id) {
            removeEntry(entry.id);
          }
        }
      };
      let transcriptUserMessageId;
      let userMessageId;
      const attachmentByteSizes = await statAttachedFileSizes(attachmentPaths);
      try {
        for (const [index, path31] of attachmentPaths.entries()) {
          const fileName = attachmentNames[index];
          const builtAttachment = await createUserAttachmentEntry(
            this.tm.attachments,
            "pending-user-attachment-id",
            path31,
            {
              replyTo: replyToId,
              ...attachmentBatchId != null ? { batchId: attachmentBatchId } : {},
              ...typeof fileName === "string" ? { fileName } : {},
              ...isFork ? { branched: true } : {},
              clientNonce: options2.clientNonce,
              byteSize: attachmentByteSizes.get(path31),
              ...options2.composedAtMs == null ? {} : { composedAtMs: options2.composedAtMs }
            }
          );
          echoEntries.push(
            appendEcho(
              (entries) => ({
                ...builtAttachment,
                id: nextEntryId(entries, "user-attachment")
              }),
              { onPersistOutcome: observePersistOutcome }
            )
          );
        }
        if (appendUserMessage && trimmedPrompt.length > 0) {
          const appended = appendEcho(
            (entries) => createUserMessage(nextEntryId(entries, "user-message"), trimmedPrompt, {
              richText: options2.richText,
              replyTo: replyToId,
              clientNonce: options2.clientNonce,
              ...attachmentBatchId != null ? { batchId: attachmentBatchId } : {},
              ...isFork ? { branched: true } : {},
              ...options2.composedAtMs == null ? {} : { composedAtMs: options2.composedAtMs }
            }),
            { onPersistOutcome: observePersistOutcome }
          );
          transcriptUserMessageId = appended.entry.id;
          userMessageId = appended.entry.id;
          echoEntries.push(appended);
        } else if (options2.offRecordMessageId != null) {
          userMessageId = resolveUserMessageId({ id: options2.offRecordMessageId });
        } else {
          userMessageId = resolveUserMessageId({ id: crypto.randomUUID() });
        }
      } catch (error42) {
        rollbackAppendedEntries();
        throw error42;
      }
      if (!acceptedDurably) {
        this.tm.hostLog(
          `[sand] send accepted NON-durably (persist dropped on a locked db); the echo still shipped so the send proceeds, but a host crash before the next successful write would lose the entry`,
          "warn"
        );
      }
      if (admission != null) {
        this.tm.acceptanceLedger.recordPending({
          accountSlot: HOST_ACCOUNT_SLOT,
          clientNonce: admission.clientNonce,
          inputDigest: admission.digest,
          agentId: session.id,
          echoEntryId: transcriptUserMessageId ?? echoEntries[0]?.entry.id ?? null
        });
      }
      const acceptedAtMs = Date.now();
      const { groupChat } = this.tm;
      const owesAck = !groupChat.isGroupSession(session);
      if (owesAck) this.tm.ackObligations.recordAckObligationSend(session, acceptedAtMs);
      if (process.env.GROKBOT_REMOTE_SERVER_MODE === "1" && transcriptUserMessageId != null) {
        this.tm.interruptedUserTurnStore?.recordAccepted(session.id, interruptedMessageId ?? transcriptUserMessageId, acceptedAtMs);
      }
      const ackGuard = __using(_stack, this.tm.ackObligations.armSendGuard(session, acceptedAtMs, owesAck));
      const acceptance = emitSendAck({
        tm: this.tm,
        session,
        echoEntries,
        isAddressedChatOnScreen,
        directAddressedAcceptance: options2.directAddressedAcceptance === true,
        clientNonce: options2.clientNonce,
        traceCtx,
        sendTrace,
        acceptedDurably,
        durableAppendStartEpochMs,
        durableAppendStartPerfMs,
        hostReceiptEpochMs,
        hostReceiptPerfMs
      });
      if (needsRosterRefresh) await this.tm.roster.emitAgentUpdate(session.id);
      if (this.tm.roster.outlineAgentId === session.id) {
        this.tm.roster.streamingAssistantOutlineId = void 0;
        this.tm.roster.streamingThinkingOutlineId = void 0;
        if (trimmedPrompt.length > 0) {
          this.tm.roster.appendOutlineItem({
            kind: "user",
            id: crypto.randomUUID(),
            text: trimmedPrompt,
            timestampMs: Date.now()
          });
        }
      }
      const { imageAttachmentPaths, videoAttachmentPaths, fileAttachmentPaths } = splitAttachmentPathsByChannel(attachmentPaths);
      const selectedImages = await loadSelectedImageInputs(imageAttachmentPaths);
      const selectedVideos = buildSelectedVideos(videoAttachmentPaths);
      const attachedFilesOnBox = areAttachmentsOnAgentBox(session.id, attachmentPaths);
      if (groupChat.isGroupSession(session)) {
        await dispatchGroupSend(this.tm, {
          session,
          trimmedPrompt,
          attachments: {
            selectedImages,
            selectedVideos,
            filePaths: fileAttachmentPaths,
            fileSizes: attachmentByteSizes,
            onBox: attachedFilesOnBox
          },
          userMessageId,
          awaitTurn,
          acceptedAtMs,
          traceCtx,
          nextTurnEpoch: (target) => this.nextTurnEpoch(target),
          acceptance
        });
        return;
      }
      const templateSetupProvenance = options2.automationWriteProvenance;
      if (templateSetupProvenance !== void 0) {
        this.tm.turnRuntime.armTemplateSetupWriteProvenance({
          sessionId: session.id,
          messageId: userMessageId,
          provenance: templateSetupProvenance
        });
      }
      try {
        await dispatchUserTurn({
          tm: this.tm,
          session,
          trimmedPrompt: promptForRun,
          richText: options2.richText,
          composedAtMs: options2.composedAtMs,
          enterEpochMs: options2.enterEpochMs,
          clientNonce: options2.clientNonce,
          mcpConfigJson: options2.mcpConfigJson,
          senderMachineId: options2.machineId,
          awaitTurn,
          isFork,
          userMessageId,
          interruptedMessageId,
          replyContext,
          selectedImages,
          selectedVideos,
          fileAttachmentPaths,
          attachedFileSizes: attachmentByteSizes,
          attachedFilesOnBox,
          traceCtx,
          acceptedAtMs,
          wasInFlight,
          readAddressedTranscript,
          latestRecoverySends: this.latestRecoverySends,
          recoveryBreakEpochs: this.recoveryBreakEpochs,
          nextTurnEpoch: (target) => this.nextTurnEpoch(target),
          acceptance,
          ackGuard
        });
      } catch (error42) {
        if (templateSetupProvenance !== void 0) {
          this.tm.turnRuntime.disarmTemplateSetupWriteProvenance({
            sessionId: session.id,
            messageId: userMessageId
          });
        }
        throw error42;
      }
    } catch (_2) {
      var _error = _2, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  nextTurnEpoch(session) {
    const next = (this.turnEpochs.get(session.id) ?? 0) + 1;
    this.turnEpochs.set(session.id, next);
    this.tm.groupChat.cancelTemporalMemberTurns({
      roomId: session.id,
      reason: "room_turn_superseded"
    });
    return next;
  }
  currentTurnEpoch(session) {
    return this.turnEpochs.get(session.id) ?? 0;
  }
  claimSendAttachmentBatchId(sessionId) {
    const existing = this.sendAttachmentBatchIds.get(sessionId);
    if (existing != null) return existing;
    const minted = crypto.randomUUID();
    this.sendAttachmentBatchIds.set(sessionId, minted);
    return minted;
  }
  appendSendMessageEntry(entry) {
    this.boxRequests.trackBoxRequestEntry(entry);
    this.tm.appendEntry(entry);
  }
  async resolveBoxRequestEntry(agentId, requestId2, resolution, options2) {
    return this.boxRequests.resolveBoxRequestEntry(agentId, requestId2, resolution, options2);
  }
  validateAiReplyTarget(message, inFlightId, entries) {
    return validateAiReplyTarget(message, inFlightId, entries);
  }
  applyAutoReplyThread(message, session, entries) {
    return applyAutoReplyThread(this.tm, message, session, entries);
  }
  async resolveDevSendMessage(message) {
    if (message.type !== "attachment") return message;
    const filePath = filePathFromFileUrl(message.url);
    if (filePath == null) return message;
    const session = this.tm.sessions.activeSession;
    if (session == null) return message;
    try {
      const ingested = await this.tm.createAttachmentIngestor(session)(filePath);
      const fileName = (0, import_node_path160.basename)(filePath);
      const resolvedFileName = fileName.length > 0 ? fileName : message.file_name;
      return {
        type: "attachment",
        url: (0, import_node_url15.pathToFileURL)(ingested).href,
        ...message.reply_to != null ? { reply_to: message.reply_to } : {},
        ...resolvedFileName != null ? { file_name: resolvedFileName } : {},
        ...message.alt != null ? { alt: message.alt } : {},
        ...message.channel != null ? { channel: message.channel } : {},
        ...message.width != null ? { width: message.width } : {},
        ...message.height != null ? { height: message.height } : {}
      };
    } catch (error42) {
      reportFallback("send_pipeline", error42);
      return message;
    }
  }
  async devAppendSendMessage(message) {
    const resolvedMessage = await this.resolveDevSendMessage(message);
    const sendId = nextEntryId(getTranscript(), "send-message");
    const entry = createSendMessageEntry(sendId, resolvedMessage, Date.now());
    this.appendSendMessageEntry(entry);
  }
  async appendConnectorCard(args) {
    await this.tm.sessions.ensureActionTarget(args.agentId);
    const reason = args.reason != null && args.reason.length > 0 ? args.reason : void 0;
    const message = {
      type: "connector",
      connector: args.connector,
      variant: args.variant,
      ...reason != null ? { reason } : {}
    };
    const sendId = nextEntryId(getTranscript(), "send-message");
    const entry = createSendMessageEntry(sendId, message, Date.now());
    this.appendSendMessageEntry(entry);
  }
};
