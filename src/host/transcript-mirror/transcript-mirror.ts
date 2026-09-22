/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/transcript-mirror/transcript-mirror.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto87 = require("node:crypto");
var import_promises82 = require("node:fs/promises");
var import_node_path179 = require("node:path");
init_agent_pb();
init_bounded();

// @recovered-fragment 2/2
function journalErrno(error42) {
  const code = error42?.code;
  return typeof code === "string" ? brandedErrno(code) : void 0;
}
async function requiredBlob(ctx, blobStore, blobId, label) {
  const blob = await blobStore.getBlob(ctx, blobId);
  if (blob == null) {
    throw new TranscriptJournalCorruptionError(
      `missing ${label} blob while deriving transcript checkpoint`
    );
  }
  return blob;
}
var FileTranscriptMirror = class {
  constructor(transcriptsDir, reportOutcome = () => {
  }) {
    this.transcriptsDir = transcriptsDir;
    this.reportOutcome = reportOutcome;
  }
  transcriptsDir;
  reportOutcome;
  writeLanes = /* @__PURE__ */ new Map();
  states = /* @__PURE__ */ new Map();
  durableCheckpoints = /* @__PURE__ */ new Map();
  preparedCheckpoints = /* @__PURE__ */ new Map();
  deferredSteps = /* @__PURE__ */ new Map();
  preparedDeferredSteps = /* @__PURE__ */ new Map();
  routes = /* @__PURE__ */ new Map();
  reportedFailures = /* @__PURE__ */ new WeakSet();
  reportFailureOnce(error42, report) {
    if (typeof error42 === "object" && error42 != null) {
      if (this.reportedFailures.has(error42)) return;
      this.reportedFailures.add(error42);
    }
    this.reportOutcome(report);
  }
  async withOutcomeReport(op, conversationId, mintCause, operation) {
    const startedAt = performance.now();
    try {
      const counts = await operation();
      this.reportOutcome({
        op,
        outcome: "ok",
        conversationId,
        ...counts,
        durationMs: performance.now() - startedAt
      });
    } catch (error42) {
      this.reportFailureOnce(error42, {
        op,
        outcome: "failed",
        conversationId,
        cause: mintCause(journalErrno(error42)),
        durationMs: performance.now() - startedAt
      });
      throw error42;
    }
  }
  routed(legacy, isJournalEnabled) {
    return new RoutedTranscriptMirror(this, legacy, isJournalEnabled, this.routes);
  }
  jsonlPathFor(conversationId) {
    const id = getSafeConversationId2(conversationId);
    return (0, import_node_path179.join)(this.transcriptsDir, id, `${id}.jsonl`);
  }
  pendingPathFor(conversationId) {
    const id = getSafeConversationId2(conversationId);
    return (0, import_node_path179.join)(this.transcriptsDir, id, `${id}.journal-pending.json`);
  }
  cursorPathFor(conversationId) {
    const id = getSafeConversationId2(conversationId);
    return (0, import_node_path179.join)(this.transcriptsDir, id, `${id}.journal-cursor.json`);
  }
  modePathFor(conversationId) {
    const id = getSafeConversationId2(conversationId);
    return (0, import_node_path179.join)(this.transcriptsDir, id, `${id}.journal-mode`);
  }
  async syncParentDirectory(path31) {
    const handle = await (0, import_promises82.open)((0, import_node_path179.dirname)(path31), "r");
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
  }
  async installAtomicFile(path31, write2) {
    const temporary = (0, import_node_path179.join)((0, import_node_path179.dirname)(path31), `.transcript.${(0, import_node_crypto87.randomUUID)()}.part`);
    let handle;
    try {
      handle = await (0, import_promises82.open)(temporary, "wx");
      await write2(handle);
      await handle.sync();
      await handle.close();
      handle = void 0;
      await (0, import_promises82.rename)(temporary, path31);
      await this.syncParentDirectory(path31);
    } catch (error42) {
      if (handle != null) await Promise.allSettled([handle.close()]);
      await Promise.allSettled([(0, import_promises82.unlink)(temporary)]);
      throw error42;
    }
  }
  async ownsConversation(conversationId) {
    try {
      await (0, import_promises82.stat)(this.modePathFor(conversationId));
      return true;
    } catch (error42) {
      if (isMissingFile(error42)) return false;
      throw error42;
    }
  }
  async claimConversation(conversationId) {
    const path31 = this.modePathFor(conversationId);
    await (0, import_promises82.mkdir)((0, import_node_path179.dirname)(path31), { recursive: true });
    try {
      await (0, import_promises82.stat)(path31);
      return;
    } catch (error42) {
      if (!isMissingFile(error42)) throw error42;
    }
    await this.installAtomicFile(path31, async (handle) => {
      await writeAll(handle, Buffer.from("1\n", "utf8"), 0);
    });
  }
  async createInitialJsonl(ctx, path31, checkpoint, blobStore) {
    await this.installAtomicFile(path31, async (handle) => {
      let position = 0;
      const appendOccurrence = async (occurrence) => {
        position = await writeAll(handle, Buffer.from(`${occurrence.line}
`, "utf8"), position);
      };
      for (let turnIndex = 0; turnIndex < checkpoint.turns.length; turnIndex++) {
        const derived = await this.deriveTurn(
          ctx,
          blobStore,
          turnIndex,
          checkpoint.turns[turnIndex],
          void 0,
          true
        );
        for (const occurrence of derived.occurrences) {
          await appendOccurrence(occurrence);
        }
      }
    });
  }
  async scan(path31) {
    const identity = fileIdentity(await (0, import_promises82.stat)(path31));
    return {
      bytes: identity.size,
      device: identity.device,
      inode: identity.inode
    };
  }
  async initialize(ctx, conversationId, checkpoint, blobStore) {
    const id = getSafeConversationId2(conversationId);
    await (0, import_promises82.mkdir)((0, import_node_path179.join)(this.transcriptsDir, id), { recursive: true });
    const path31 = this.jsonlPathFor(conversationId);
    let rebuild = false;
    let tail;
    try {
      const identity = await (0, import_promises82.stat)(path31);
      if (identity.size === 0) {
        rebuild = checkpoint.turns.length > 0;
        if (rebuild) tail = "empty";
      } else {
        const handle = await (0, import_promises82.open)(path31, "r");
        try {
          const byte = Buffer.allocUnsafe(1);
          const result = await handle.read(byte, 0, 1, identity.size - 1);
          rebuild = result.bytesRead !== 1 || byte[0] !== 10;
        } finally {
          await handle.close();
        }
        if (rebuild) tail = "torn";
      }
    } catch (error42) {
      if (!isMissingFile(error42)) throw error42;
      rebuild = true;
      if (checkpoint.turns.length > 0) tail = "missing";
    }
    const rebuildStartedAt = performance.now();
    if (rebuild) {
      try {
        await this.createInitialJsonl(ctx, path31, checkpoint, blobStore);
      } catch (error42) {
        if (tail != null) {
          this.reportFailureOnce(error42, {
            op: "rebuild",
            outcome: "failed",
            conversationId,
            cause: SandError.journalRebuildFailed({
              tail: brandLiteralEnum(tail),
              errno: journalErrno(error42)
            }),
            entryCount: checkpoint.turns.length,
            durationMs: performance.now() - rebuildStartedAt
          });
        }
        throw error42;
      }
    }
    const state = await this.scan(path31);
    if (rebuild && tail != null) {
      this.reportOutcome({
        op: "rebuild",
        outcome: "ok",
        conversationId,
        cause: SandError.journalCorruptTail({
          tail: brandLiteralEnum(tail)
        }),
        entryCount: checkpoint.turns.length,
        bytes: state.bytes,
        durationMs: performance.now() - rebuildStartedAt
      });
    }
    this.states.set(conversationId, state);
    return state;
  }
  serialize(conversationId, operation) {
    const key = this.jsonlPathFor(conversationId);
    const previous = this.writeLanes.get(key) ?? Promise.resolve();
    const current = previous.then(operation, operation).then(
      () => {
        if (this.writeLanes.get(key) === current) this.writeLanes.delete(key);
      },
      (error42) => {
        if (this.writeLanes.get(key) === current) this.writeLanes.delete(key);
        throw error42;
      }
    );
    this.writeLanes.set(key, current);
    return current;
  }
  async readPending(conversationId) {
    try {
      return parsePendingCheckpoint(await (0, import_promises82.readFile)(this.pendingPathFor(conversationId), "utf8"));
    } catch (error42) {
      if (isMissingFile(error42)) return null;
      throw error42;
    }
  }
  async removePending(conversationId) {
    const path31 = this.pendingPathFor(conversationId);
    try {
      await (0, import_promises82.unlink)(path31);
    } catch (error42) {
      if (isMissingFile(error42)) return;
      throw error42;
    }
    await this.syncParentDirectory(path31);
  }
  async readDeferredStep(conversationId) {
    try {
      return parseDeferredStep(
        JSON.parse(await (0, import_promises82.readFile)(this.cursorPathFor(conversationId), "utf8"))
      );
    } catch (error42) {
      if (isMissingFile(error42)) return void 0;
      throw error42;
    }
  }
  async writeDeferredStep(conversationId, deferredStep) {
    const path31 = this.cursorPathFor(conversationId);
    if (deferredStep == null) {
      try {
        await (0, import_promises82.unlink)(path31);
        await this.syncParentDirectory(path31);
      } catch (error42) {
        if (!isMissingFile(error42)) throw error42;
      }
      return;
    }
    await this.installAtomicFile(path31, async (handle) => {
      await writeAll(handle, Buffer.from(JSON.stringify(deferredStep), "utf8"), 0);
    });
  }
  async appendPending(conversationId, pending) {
    const path31 = this.jsonlPathFor(conversationId);
    const identity = fileIdentity(await (0, import_promises82.stat)(path31));
    if (identity.device !== pending.fileDevice || identity.inode !== pending.fileInode || identity.size < pending.appendOffset) {
      throw new TranscriptJournalCorruptionError("canonical transcript changed before WAL commit");
    }
    const expected = Buffer.from(pending.lines.map((line) => `${line}
`).join(""), "utf8");
    const tailLength = identity.size - pending.appendOffset;
    if (tailLength > expected.length) {
      throw new TranscriptJournalCorruptionError(
        "canonical transcript has data beyond the pending WAL"
      );
    }
    const handle = await (0, import_promises82.open)(path31, "r+");
    try {
      if (tailLength > 0) {
        const tail = Buffer.allocUnsafe(tailLength);
        await handle.read(tail, 0, tail.length, pending.appendOffset);
        if (!expected.subarray(0, tailLength).equals(tail)) {
          throw new TranscriptJournalCorruptionError(
            "canonical transcript tail conflicts with the pending WAL"
          );
        }
      }
      if (tailLength < expected.length) {
        await handle.truncate(pending.appendOffset);
        await writeAll(handle, expected, pending.appendOffset);
        await handle.sync();
      }
      const updatedIdentity = fileIdentity(await handle.stat());
      const state = {
        bytes: pending.appendOffset + expected.length,
        device: updatedIdentity.device,
        inode: updatedIdentity.inode
      };
      this.states.set(conversationId, state);
      return state;
    } finally {
      await handle.close();
    }
  }
  async hydrateUserText(ctx, blobStore, userMessage2) {
    if (userMessage2.text.length > 0 || userMessage2.textBlobId == null || userMessage2.textBlobId.length === 0) {
      return userMessage2.text;
    }
    return new TextDecoder().decode(
      await requiredBlob(ctx, blobStore, userMessage2.textBlobId, "user-message text")
    );
  }
  async deriveTurn(ctx, blobStore, turnIndex, currentBlobId, previousBlobId, finalizeTurn = false, deferredStep) {
    const current = ConversationTurnStructure.fromBinary(
      await requiredBlob(ctx, blobStore, currentBlobId, "conversation-turn")
    );
    if (current.turn.case === "shellConversationTurn") {
      throw new TranscriptJournalCorruptionError("Sand does not support shell conversation turns");
    }
    const previous = previousBlobId == null ? void 0 : ConversationTurnStructure.fromBinary(
      await requiredBlob(ctx, blobStore, previousBlobId, "previous conversation-turn")
    );
    if (previous != null && previous.turn.case !== current.turn.case) {
      throw new TranscriptJournalCorruptionError("durable conversation turn changed kind");
    }
    if (current.turn.case !== "agentConversationTurn") {
      return { occurrences: [] };
    }
    const currentTurn = current.turn.value;
    const previousTurn = previous?.turn.case === "agentConversationTurn" ? previous.turn.value : void 0;
    if (previousTurn != null && !bytesEqual(previousTurn.userMessage, currentTurn.userMessage)) {
      throw new TranscriptJournalCorruptionError(
        "durable agent user message changed after checkpoint"
      );
    }
    if (previousTurn != null && currentTurn.steps.length < previousTurn.steps.length) {
      throw new TranscriptJournalCorruptionError("durable agent steps moved backwards");
    }
    let firstChangedStep = previousTurn?.steps.length ?? 0;
    if (previousTurn != null) {
      for (let index = 0; index < previousTurn.steps.length; index++) {
        if (!bytesEqual(previousTurn.steps[index], currentTurn.steps[index])) {
          if (index + 1 !== previousTurn.steps.length) {
            throw new TranscriptJournalCorruptionError(
              "durable agent step changed before the checkpoint tail"
            );
          }
          firstChangedStep = index;
          break;
        }
      }
    }
    if (deferredStep?.turnIndex === turnIndex) {
      firstChangedStep = Math.min(firstChangedStep, deferredStep.stepIndex);
    }
    const occurrences = [];
    if (previousTurn == null) {
      const userMessage2 = UserMessage.fromBinary(
        await requiredBlob(ctx, blobStore, currentTurn.userMessage, "user-message")
      );
      const line = formatTextLine("user", await this.hydrateUserText(ctx, blobStore, userMessage2));
      if (line != null) {
        occurrences.push({
          id: `turn:${turnIndex}:user`,
          line
        });
      }
    }
    for (let stepIndex = firstChangedStep; stepIndex < currentTurn.steps.length; stepIndex++) {
      const previousStepBlob = previousTurn?.steps[stepIndex];
      const previousStep = previousStepBlob == null ? void 0 : ConversationStep.fromBinary(
        await requiredBlob(ctx, blobStore, previousStepBlob, "previous conversation-step")
      );
      const step = ConversationStep.fromBinary(
        await requiredBlob(ctx, blobStore, currentTurn.steps[stepIndex], "conversation-step")
      );
      if (previousStep != null && previousStep.message.case !== step.message.case) {
        throw new TranscriptJournalCorruptionError("durable conversation step changed kind");
      }
      if (!finalizeTurn && stepIndex + 1 === currentTurn.steps.length && (step.message.case === "assistantMessage" || step.message.case === "thinkingMessage")) {
        return {
          occurrences,
          deferredStep: { turnIndex, stepIndex }
        };
      }
      if (step.message.case === "assistantMessage" || step.message.case === "thinkingMessage") {
        const line = formatTextLine("assistant", step.message.value.text);
        if (line != null) {
          occurrences.push({
            id: `turn:${turnIndex}:step:${stepIndex}:text`,
            line
          });
        }
        continue;
      }
      const tool = toolParts(step);
      if (tool == null) continue;
      const previousTool = previousStep == null ? null : toolParts(previousStep);
      if (previousStep != null && previousTool == null) {
        throw new TranscriptJournalCorruptionError(
          "durable conversation step changed into a tool call"
        );
      }
      if (previousTool != null) {
        if (previousTool.name !== tool.name || JSON.stringify(previousTool.input) !== JSON.stringify(tool.input)) {
          throw new TranscriptJournalCorruptionError("durable tool call changed after checkpoint");
        }
        if (previousTool.result != null) {
          throw new TranscriptJournalCorruptionError(
            "completed durable tool call changed after checkpoint"
          );
        }
        if (tool.result != null) {
          occurrences.push({
            id: `turn:${turnIndex}:step:${stepIndex}:tool-result`,
            line: formatToolLine("tool", tool.name, tool.result)
          });
        }
        continue;
      }
      occurrences.push({
        id: `turn:${turnIndex}:step:${stepIndex}:tool-use`,
        line: formatToolLine("assistant", tool.name, tool.input)
      });
      if (tool.result != null) {
        occurrences.push({
          id: `turn:${turnIndex}:step:${stepIndex}:tool-result`,
          line: formatToolLine("tool", tool.name, tool.result)
        });
      }
    }
    return { occurrences };
  }
  async deriveOccurrences(ctx, conversationId, checkpoint, blobStore, finalizeCheckpoint) {
    const previous = this.durableCheckpoints.get(conversationId);
    if (previous == null) {
      throw new TranscriptJournalCorruptionError(
        "transcript checkpoint must recover before preparing"
      );
    }
    if (checkpoint.turns.length < previous.turns.length) {
      throw new TranscriptJournalCorruptionError("durable conversation turns moved backwards");
    }
    if (previous.turns.length > 1 && !bytesEqual(
      checkpoint.turns[previous.turns.length - 2],
      previous.turns[previous.turns.length - 2]
    )) {
      throw new TranscriptJournalCorruptionError(
        "durable conversation history changed before the active turn"
      );
    }
    const derived = [];
    const deferred = this.deferredSteps.get(conversationId);
    if (previous.turns.length > 0) {
      const turnIndex = previous.turns.length - 1;
      if (!bytesEqual(previous.turns[turnIndex], checkpoint.turns[turnIndex]) || deferred?.turnIndex === turnIndex) {
        derived.push({
          turnIndex,
          ...await this.deriveTurn(
            ctx,
            blobStore,
            turnIndex,
            checkpoint.turns[turnIndex],
            previous.turns[turnIndex],
            finalizeCheckpoint || turnIndex + 1 < checkpoint.turns.length,
            deferred
          )
        });
      }
    }
    for (let turnIndex = previous.turns.length; turnIndex < checkpoint.turns.length; turnIndex++) {
      derived.push({
        turnIndex,
        ...await this.deriveTurn(
          ctx,
          blobStore,
          turnIndex,
          checkpoint.turns[turnIndex],
          void 0,
          finalizeCheckpoint || turnIndex + 1 < checkpoint.turns.length,
          deferred
        )
      });
    }
    const occurrences = derived.flatMap((turn) => turn.occurrences);
    const nextDeferred = derived.find((turn) => turn.deferredStep != null)?.deferredStep;
    return {
      occurrences,
      ...nextDeferred == null ? {} : { deferredStep: nextDeferred }
    };
  }
  recover(ctx, conversationId, checkpoint, blobStore) {
    return this.serialize(
      conversationId,
      () => this.withOutcomeReport(
        "replay",
        conversationId,
        (errno) => SandError.journalReplayFailed({ errno }),
        () => this.replay(ctx, conversationId, checkpoint, blobStore)
      )
    );
  }
  async replay(ctx, conversationId, checkpoint, blobStore) {
    let applied;
    await (0, import_promises82.mkdir)((0, import_node_path179.dirname)(this.jsonlPathFor(conversationId)), { recursive: true });
    const pending = await this.readPending(conversationId);
    let state = this.states.get(conversationId);
    const previous = this.durableCheckpoints.get(conversationId);
    const currentHash = checkpointIdentity(checkpoint);
    const previousHash = previous == null ? void 0 : checkpointIdentity(previous);
    if (pending == null && previousHash != null && previousHash !== currentHash) {
      throw new TranscriptJournalCorruptionError(
        "turn started from a checkpoint other than the journal cursor"
      );
    }
    if (pending != null) {
      if (pending.checkpointHash === currentHash) {
        if (previousHash != null && previousHash !== pending.previousCheckpointHash) {
          throw new TranscriptJournalCorruptionError(
            "pending transcript WAL starts after the in-memory journal cursor"
          );
        }
        if (state == null) {
          state = {
            bytes: pending.appendOffset,
            device: pending.fileDevice,
            inode: pending.fileInode
          };
          this.states.set(conversationId, state);
        }
        state = await this.appendPending(conversationId, pending);
        applied = {
          entryCount: pending.lines.length,
          bytes: state.bytes - pending.appendOffset
        };
        await this.writeDeferredStep(conversationId, pending.cursor.deferredStep);
        await this.removePending(conversationId);
      } else if (pending.previousCheckpointHash === currentHash) {
        if (previousHash != null && previousHash !== currentHash) {
          throw new TranscriptJournalCorruptionError(
            "discarded transcript WAL does not match the in-memory journal cursor"
          );
        }
        await this.removePending(conversationId);
        state ??= await this.initialize(ctx, conversationId, checkpoint, blobStore);
      } else {
        throw new TranscriptJournalCorruptionError(
          "pending transcript WAL does not match the durable checkpoint"
        );
      }
    }
    state ??= await this.initialize(ctx, conversationId, checkpoint, blobStore);
    this.states.set(conversationId, state);
    this.preparedCheckpoints.delete(conversationId);
    this.preparedDeferredSteps.delete(conversationId);
    this.durableCheckpoints.set(conversationId, checkpoint);
    const deferred = await this.readDeferredStep(conversationId);
    if (deferred == null) {
      this.deferredSteps.delete(conversationId);
    } else if (checkpoint.turns[deferred.turnIndex] == null) {
      throw new TranscriptJournalCorruptionError(
        "deferred transcript step is absent from the durable checkpoint"
      );
    } else {
      this.deferredSteps.set(conversationId, deferred);
    }
    return applied ?? {};
  }
  prepareCheckpoint(ctx, conversationId, checkpoint, blobStore, finalizeCheckpoint = false) {
    return this.serialize(
      conversationId,
      () => this.withOutcomeReport(
        "checkpoint",
        conversationId,
        (errno) => SandError.journalCheckpointFailed({ errno }),
        () => this.prepare(ctx, conversationId, checkpoint, blobStore, finalizeCheckpoint)
      )
    );
  }
  async prepare(ctx, conversationId, checkpoint, blobStore, finalizeCheckpoint) {
    if (await this.readPending(conversationId) != null) {
      throw new TranscriptJournalCorruptionError(
        "pending transcript checkpoint must recover before preparing another"
      );
    }
    const previous = this.durableCheckpoints.get(conversationId);
    const state = this.states.get(conversationId);
    if (previous == null || state == null) {
      throw new TranscriptJournalCorruptionError(
        "transcript checkpoint must recover before preparing"
      );
    }
    const identity = fileIdentity(await (0, import_promises82.stat)(this.jsonlPathFor(conversationId)));
    if (identity.size !== state.bytes || identity.device !== state.device || identity.inode !== state.inode) {
      throw new TranscriptJournalCorruptionError(
        "canonical transcript changed outside the journal"
      );
    }
    const derived = await this.deriveOccurrences(
      ctx,
      conversationId,
      checkpoint,
      blobStore,
      finalizeCheckpoint
    );
    const seenSources = /* @__PURE__ */ new Set();
    const lines2 = derived.occurrences.map((occurrence) => {
      if (seenSources.has(occurrence.id)) {
        throw new TranscriptOccurrenceConflictError(
          `transcript occurrence ${occurrence.id} was derived twice`
        );
      }
      seenSources.add(occurrence.id);
      return occurrence.line;
    });
    const pending = {
      version: 1,
      previousCheckpointHash: checkpointIdentity(previous),
      checkpointHash: checkpointIdentity(checkpoint),
      appendOffset: state.bytes,
      fileDevice: state.device,
      fileInode: state.inode,
      lines: lines2,
      cursor: {
        turnCount: checkpoint.turns.length,
        ...derived.deferredStep == null ? {} : { deferredStep: derived.deferredStep }
      }
    };
    const pendingBytes = Buffer.from(JSON.stringify(pending), "utf8");
    await this.installAtomicFile(this.pendingPathFor(conversationId), async (handle) => {
      await writeAll(handle, pendingBytes, 0);
    });
    this.preparedCheckpoints.set(conversationId, checkpoint);
    this.preparedDeferredSteps.set(conversationId, derived.deferredStep ?? null);
    return {
      entryCount: lines2.length,
      bytes: pendingBytes.byteLength
    };
  }
  commitCheckpoint(ctx, conversationId) {
    return this.serialize(
      conversationId,
      () => this.withOutcomeReport(
        "append",
        conversationId,
        (errno) => SandError.journalAppendFailed({ errno }),
        () => this.commit(conversationId)
      )
    );
  }
  async commit(conversationId) {
    const pending = await this.readPending(conversationId);
    if (pending == null) {
      throw new TranscriptJournalCorruptionError("prepared transcript WAL is missing at commit");
    }
    const checkpoint = this.preparedCheckpoints.get(conversationId);
    if (checkpoint == null || !this.preparedDeferredSteps.has(conversationId)) {
      throw new TranscriptJournalCorruptionError(
        "prepared transcript checkpoint is missing in memory"
      );
    }
    const deferred = this.preparedDeferredSteps.get(conversationId) ?? void 0;
    const state = await this.appendPending(conversationId, pending);
    await this.writeDeferredStep(conversationId, deferred);
    await this.removePending(conversationId);
    this.preparedCheckpoints.delete(conversationId);
    this.preparedDeferredSteps.delete(conversationId);
    this.durableCheckpoints.set(conversationId, checkpoint);
    if (deferred == null) {
      this.deferredSteps.delete(conversationId);
    } else {
      this.deferredSteps.set(conversationId, deferred);
    }
    return {
      entryCount: pending.lines.length,
      bytes: state.bytes - pending.appendOffset
    };
  }
  abortCheckpoint(_ctx, conversationId) {
    return this.serialize(conversationId, async () => {
      this.preparedCheckpoints.delete(conversationId);
      this.preparedDeferredSteps.delete(conversationId);
      await this.removePending(conversationId);
    });
  }
  skipCheckpoint(_ctx, conversationId, checkpoint, _blobStore) {
    return this.serialize(conversationId, async () => {
      this.preparedCheckpoints.delete(conversationId);
      this.preparedDeferredSteps.delete(conversationId);
      this.deferredSteps.delete(conversationId);
      await this.removePending(conversationId);
      await this.writeDeferredStep(conversationId, void 0);
      this.durableCheckpoints.set(conversationId, checkpoint);
    });
  }
};

