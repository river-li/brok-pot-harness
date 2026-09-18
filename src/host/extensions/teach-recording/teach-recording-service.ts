init_errors();
var TEACH_SESSIONS_DIR = "/workspace/teach-sessions";
var TEACH_QUEUES_DIR = `${TEACH_SESSIONS_DIR}/queues`;
var TEACH_PRIVATE_MONITOR_MESSAGE = "Teach recording requires a private desktop monitor.";
function isForkWindowIndex(windowIndex) {
  return windowIndex != null && Number.isInteger(windowIndex) && windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX;
}
function startFailureKind(error41) {
  if (error41 instanceof SandTeachRecordingError) return error41.kind;
  if (error41 instanceof SandBoxNoMonitorAvailableError) return "no_monitor";
  return "box";
}
var SandTeachRecordingError = class extends SandDomainError {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
  }
  kind;
  name = "SandTeachRecordingError";
};
function createTeachRecordingService(deps) {
  const ctx = createContext().withName("teachRecording");
  const listeners2 = /* @__PURE__ */ new Set();
  let active = null;
  let failedStart = null;
  let startInFlight = null;
  let capWake = null;
  let finalizing = null;
  let stopInFlight = null;
  let disposeInFlight = null;
  let isDisposing = false;
  let queuePersisted = false;
  let queueKeyPromise = null;
  const queueKey = () => queueKeyPromise ??= deps.queueSignatureKey();
  const statusOf2 = () => active == null ? IDLE_TEACH_RECORDING_STATUS : {
    state: "recording",
    agentId: active.agentId,
    startedAtMs: active.startedAtMs,
    maxDurationMs: SAND_TEACH_MAX_DURATION_MS
  };
  const emit = () => {
    const status = statusOf2();
    for (const listener of listeners2) listener(status);
  };
  const runShell = async (connection, command, toolCallId) => {
    const shell = connection.remoteAccessor.get(shellExecutorResource);
    const result = await shell.execute(
      ctx,
      buildHostShellArgs({
        command,
        name: "bash",
        workingDirectory: "/workspace",
        toolCallId
      })
    );
    if (result.result.case !== "success") {
      throw new SandTeachRecordingError(
        "shell",
        `teach-recording shell failed: ${result.result.case}`
      );
    }
    return result.result.value;
  };
  const resolveCaptureInput = (windowIndex) => ({
    inputArgs: `-video_size ${SAND_MONITOR_WIDTH}x${SAND_MONITOR_HEIGHT} -i :${windowIndex}.0`,
    displayLabel: `:${windowIndex}`
  });
  const sessionJson = ({
    recording,
    end
  }) => JSON.stringify(
    {
      startedAt: new Date(recording.startedAtMs).toISOString(),
      display: recording.displayLabel,
      maxDurationMs: SAND_TEACH_MAX_DURATION_MS,
      videoPath: `${recording.sessionDir}/demo.mp4`,
      ffmpegPid: "__FFMPEG_PID__",
      ...end === void 0 ? {} : {
        endedAt: new Date(end.endedAtMs).toISOString(),
        endReason: end.endReason
      }
    },
    null,
    2
  ).replace('"__FFMPEG_PID__"', "$pid");
  const completedSessionJson = ({
    recording,
    endedAtMs,
    signature
  }) => JSON.stringify(
    {
      agentId: recording.agentId,
      sessionDir: recording.sessionDir,
      clientNonce: learningPromptNonce(recording),
      signature,
      startedAt: new Date(recording.startedAtMs).toISOString(),
      endedAt: new Date(endedAtMs).toISOString()
    },
    null,
    2
  );
  const queueScope = (agentId) => (0, import_node_crypto66.createHash)("sha256").update(agentId).digest("hex");
  const clientNonceForQueue = (agentId, file2) => `${TEACH_RECORDING_NONCE_PREFIX}${queueScope(agentId)}:${file2}`;
  const signQueueEntry = ({
    key,
    agentId,
    queuedFile
  }) => (0, import_node_crypto66.createHmac)("sha256", key).update(`${agentId}
${queuedFile}`).digest("hex");
  const queueFileForSessionDir = (sessionDir) => `${sessionDir.split("/").at(-1) ?? ""}.json`;
  const queueFile = (recording) => queueFileForSessionDir(recording.sessionDir);
  const learningPromptNonce = (recording) => clientNonceForQueue(recording.agentId, queueFile(recording));
  const learningPrompt = () => teachRecordingPromptForPersistence();
  const learningPromptRichText = (agentId) => JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: SKILL_REFERENCE_NODE_TYPE,
            attrs: {
              id: LEARN_FROM_DEMONSTRATION_SKILL_ID,
              label: learnFromDemonstrationLabelForPersistence(),
              teachQueueScope: queueScope(agentId)
            }
          }
        ]
      }
    ]
  });
  const ffmpegCmdlineOwnsVideo = ({
    pidExpr,
    videoPath
  }) => `kill -0 ${pidExpr} 2>/dev/null && tr '\\0' ' ' < /proc/${pidExpr}/cmdline 2>/dev/null | grep -qF ${JSON.stringify(videoPath)}`;
  const discardRecording = ({
    connection,
    recording,
    verifyCmdline
  }) => runShell(
    connection,
    [
      `pid=$(tr -d '[:space:]' < ${recording.sessionDir}/ffmpeg.pid 2>/dev/null || true)`,
      `if [ -n "$pid" ] && ${verifyCmdline}; then`,
      `  kill -INT "$pid" || true`,
      `  sleep 1`,
      `  if ${verifyCmdline}; then kill -KILL "$pid" || true; fi`,
      `  for _ in 1 2 3 4 5; do`,
      `    if ! ( ${verifyCmdline} ); then break; fi`,
      `    sleep 0.2`,
      `  done`,
      `  if ${verifyCmdline}; then`,
      `    : > ${recording.sessionDir}/startup.invalid`,
      `    exit 1`,
      `  fi`,
      `fi`,
      `queue_dir=${TEACH_QUEUES_DIR}/${queueScope(recording.agentId)}`,
      `queue_file="$queue_dir/pending/${queueFile(recording)}"`,
      `rm -f "$queue_file" "$queue_file.prompt-delivered" "$queue_dir/claimed/${queueFile(recording)}"`,
      `rm -rf ${recording.sessionDir}`
    ].join("\n"),
    "sand-teach-recording-discard"
  );
  const cleanupFailedStart = async ({
    connection,
    recording
  }) => {
    const result = await discardRecording({
      connection,
      recording,
      verifyCmdline: ffmpegCmdlineOwnsVideo({
        pidExpr: '"$pid"',
        videoPath: `${recording.sessionDir}/demo.mp4`
      })
    });
    if (result.exitCode !== 0) {
      throw new SandTeachRecordingError(
        "cleanup_failed",
        `teach-recording: failed to clean up recording startup: ${result.stdout} ${result.stderr}`
      );
    }
  };
  const recoverFailedStart = async () => {
    const recording = failedStart;
    if (recording == null) return;
    const connection = await deps.box.ensureReady(ctx, recording.agentId);
    await cleanupFailedStart({ connection, recording });
    if (failedStart === recording) failedStart = null;
  };
  const armCap = (recording) => {
    if (isDisposing || capWake != null) return;
    capWake = deps.capPolicy.wrap(() => {
      capWake = null;
      if (isDisposing) return;
      void stop({
        agentId: recording.agentId,
        save: true,
        trackCompletion: true
      }).catch((error41) => {
        deps.reportCapStopFailed({
          errorClass: error41 instanceof Error ? error41.name || "Error" : "unknown"
        });
      });
    });
    capWake();
  };
  const disposeCap = () => {
    capWake?.dispose();
    capWake = null;
  };
  const markPromptDelivered = async ({
    connection,
    pending
  }) => {
    const result = await runShell(
      connection,
      [
        `queue_dir=${TEACH_QUEUES_DIR}/${queueScope(pending.agentId)}`,
        `queue_file="$queue_dir/pending/${pending.queueFile}"`,
        `if [ -f "$queue_file" ]; then : > "$queue_file.prompt-delivered"; fi`
      ].join("\n"),
      "sand-teach-recording-mark-prompt-delivered"
    );
    if (result.exitCode !== 0) {
      throw new SandTeachRecordingError(
        "mark_prompt_failed",
        `teach-recording: failed to mark learning prompt delivered: ${result.stdout} ${result.stderr}`
      );
    }
  };
  const pendingRecording = ({
    agentId,
    key,
    queuedFile,
    content
  }) => {
    try {
      const value = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
      if (value == null || typeof value !== "object" || !("agentId" in value) || value.agentId !== agentId || !("sessionDir" in value) || typeof value.sessionDir !== "string" || value.sessionDir !== `${TEACH_SESSIONS_DIR}/${queuedFile.slice(0, -".json".length)}` || !("clientNonce" in value) || value.clientNonce !== clientNonceForQueue(agentId, queuedFile) || !("signature" in value) || typeof value.signature !== "string" || !/^[0-9a-f]{64}$/.test(value.signature)) {
        return null;
      }
      const expected = Buffer.from(signQueueEntry({ key, agentId, queuedFile }), "hex");
      const given = Buffer.from(value.signature, "hex");
      if (given.length !== expected.length || !(0, import_node_crypto66.timingSafeEqual)(given, expected)) {
        return null;
      }
      return {
        agentId,
        queueFile: queuedFile,
        clientNonce: clientNonceForQueue(agentId, queuedFile)
      };
    } catch {
      return null;
    }
  };
  const queueScanCommand = (glob) => [
    `for queue_file in ${glob}; do`,
    `  [ -f "$queue_file" ] || continue`,
    `  if [ -e "$queue_file.prompt-delivered" ]; then marker=1; else marker=0; fi`,
    `  printf '%s\\t%s\\t%s\\t' "$(basename "$(dirname "$(dirname "$queue_file")")")" "$(basename "$queue_file")" "$marker"`,
    `  base64 "$queue_file" | tr -d '\\n'`,
    `  printf '\\n'`,
    `done`
  ].join("\n");
  const parseQueueScan = ({
    stdout,
    key,
    agentsByScope
  }) => stdout.split("\n").flatMap((line) => {
    const fields2 = line.split("	");
    if (fields2.length !== 4) return [];
    const [scope, queuedFile, marker17, content] = fields2;
    if (scope == null || queuedFile == null || marker17 == null || content == null || !/^[0-9a-f]{64}$/.test(scope) || !/^teach-\d{8}T\d{6}Z-[0-9a-f-]{36}\.json$/.test(queuedFile) || marker17 !== "0" && marker17 !== "1") {
      return [];
    }
    const agentId = agentsByScope.get(scope);
    if (agentId === void 0) return [];
    return [
      {
        scope,
        queueFile: queuedFile,
        delivered: marker17 === "1",
        recording: pendingRecording({ agentId, key, queuedFile, content })
      }
    ];
  });
  const quarantineQueueFiles = async ({
    connection,
    entries
  }) => {
    if (entries.length === 0) return;
    const result = await runShell(
      connection,
      entries.flatMap(({ scope, queueFile: queuedFile }) => {
        const queueDir = `${TEACH_QUEUES_DIR}/${scope}`;
        return [
          `mkdir -p ${queueDir}/rejected`,
          `mv -f ${queueDir}/pending/${queuedFile} ${queueDir}/rejected/${queuedFile} 2>/dev/null || true`,
          `rm -f ${queueDir}/pending/${queuedFile}.prompt-delivered`
        ];
      }).join("\n"),
      "sand-teach-recording-quarantine"
    );
    if (result.exitCode !== 0) {
      throw new SandTeachRecordingError(
        "quarantine_failed",
        `teach-recording: failed to quarantine forged queue entries: ${result.stdout} ${result.stderr}`
      );
    }
  };
  const ensureAuthenticQueue = async ({
    connection,
    agentId
  }) => {
    const key = await queueKey();
    const scope = queueScope(agentId);
    const result = await runShell(
      connection,
      queueScanCommand(`${TEACH_QUEUES_DIR}/${scope}/pending/*.json`),
      "sand-teach-recording-verify"
    );
    if (result.exitCode !== 0) {
      throw new SandTeachRecordingError(
        "finalize_failed",
        `teach-recording: failed to verify queue authenticity: ${result.stdout} ${result.stderr}`
      );
    }
    const entries = parseQueueScan({
      stdout: result.stdout,
      key,
      agentsByScope: /* @__PURE__ */ new Map([[scope, agentId]])
    });
    await quarantineQueueFiles({
      connection,
      entries: entries.filter((entry) => entry.recording == null)
    });
  };
  const recoverPending = async () => {
    const agentIds = await deps.listAgentIds();
    const agentsByScope = new Map(
      agentIds.map((agentId) => [queueScope(agentId), agentId])
    );
    const [firstAgentId] = agentIds;
    if (firstAgentId === void 0) return;
    const key = await queueKey();
    const connection = await deps.box.ensureReady(ctx, firstAgentId);
    const result = await runShell(
      connection,
      queueScanCommand(`${TEACH_QUEUES_DIR}/*/pending/*.json`),
      "sand-teach-recording-recover"
    );
    if (result.exitCode !== 0) {
      throw new SandTeachRecordingError(
        "recover_failed",
        `teach-recording: failed to recover pending recordings: ${result.stdout} ${result.stderr}`
      );
    }
    const entries = parseQueueScan({
      stdout: result.stdout,
      key,
      agentsByScope
    });
    await quarantineQueueFiles({
      connection,
      entries: entries.filter((entry) => entry.recording == null)
    });
    const pending = entries.flatMap(
      (entry) => entry.recording != null && !entry.delivered ? [entry.recording] : []
    );
    if (pending.length === 0) return;
    if (!await deps.ensureLearningSkill()) return;
    for (const recording of pending) {
      await deps.sendLearningPrompt(recording.agentId, {
        content: learningPrompt(),
        richText: learningPromptRichText(recording.agentId),
        clientNonce: recording.clientNonce
      });
      await markPromptDelivered({ connection, pending: recording });
    }
  };
  const startRecording = async ({
    agentId,
    entryPoint
  }) => {
    await recoverFailedStart();
    const connection = await deps.box.ensureReady(ctx, agentId);
    const windowIndex = deps.box.getAgentWindowIndex?.(agentId);
    if (!isForkWindowIndex(windowIndex)) {
      throw new SandBoxNoMonitorAvailableError(TEACH_PRIVATE_MONITOR_MESSAGE);
    }
    const { inputArgs, displayLabel } = resolveCaptureInput(windowIndex);
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const recording = {
      agentId,
      startedAtMs: Date.now(),
      sessionDir: `${TEACH_SESSIONS_DIR}/teach-${stamp}-${crypto.randomUUID()}`,
      displayLabel
    };
    const videoPath = `${recording.sessionDir}/demo.mp4`;
    const maxSeconds = Math.round(SAND_TEACH_MAX_DURATION_MS / 1e3);
    failedStart = recording;
    try {
      const result = await runShell(
        connection,
        [
          `mkdir -p ${recording.sessionDir}`,
          `nohup ffmpeg -y -v error -f x11grab ${inputArgs} -framerate 15 -t ${maxSeconds} -c:v libx264 -preset ultrafast -g 75 -pix_fmt yuv420p -an ${videoPath} > ${recording.sessionDir}/ffmpeg.log 2>&1 &`,
          `printf '%s\\n' "$!" > ${recording.sessionDir}/ffmpeg.pid`,
          `sleep 0.4`,
          `pid=$(tr -d '[:space:]' < ${recording.sessionDir}/ffmpeg.pid)`,
          `case "$pid" in ''|*[!0-9]*) cat ${recording.sessionDir}/ffmpeg.log; exit 1 ;; esac`,
          `${ffmpegCmdlineOwnsVideo({ pidExpr: '"$pid"', videoPath })} || { cat ${recording.sessionDir}/ffmpeg.log; exit 1; }`,
          `cat > ${recording.sessionDir}/session.json <<SESSION_JSON`,
          sessionJson({ recording }),
          `SESSION_JSON`
        ].join("\n"),
        "sand-teach-recording-start"
      );
      if (result.exitCode !== 0) {
        throw new SandTeachRecordingError(
          "start_failed",
          `teach-recording: ffmpeg failed to start: ${result.stdout} ${result.stderr}`
        );
      }
    } catch (error41) {
      try {
        await cleanupFailedStart({ connection, recording });
        if (failedStart === recording) failedStart = null;
      } catch (cleanupError) {
        throw new SandTeachRecordingError(
          "cleanup_failed",
          `teach-recording: ffmpeg startup cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`
        );
      }
      throw error41;
    }
    if (failedStart === recording) failedStart = null;
    active = recording;
    queuePersisted = false;
    armCap(recording);
    deps.trackRecordingStarted({ agent_id: agentId, entry_point: entryPoint });
    emit();
    return statusOf2();
  };
  const reportStartFailure = ({ agentId, entryPoint }, error41) => {
    deps.reportStartFailed({
      kind: startFailureKind(error41),
      errorClass: error41 instanceof Error ? error41.name || "Error" : "unknown",
      windowIndex: deps.box.getAgentWindowIndex?.(agentId),
      entryPoint
    });
  };
  const start = async (args) => {
    if (isDisposing) {
      const error41 = new SandTeachRecordingError(
        "shutting_down",
        "teach-recording: recording service is shutting down"
      );
      reportStartFailure(args, error41);
      throw error41;
    }
    if (active != null) return statusOf2();
    if (startInFlight != null) return await startInFlight;
    const startup = startRecording(args);
    startInFlight = startup;
    try {
      return await startup;
    } catch (error41) {
      reportStartFailure(args, error41);
      throw error41;
    } finally {
      if (startInFlight === startup) startInFlight = null;
    }
  };
  const stop = async ({
    agentId,
    save,
    trackCompletion
  }) => {
    const recording = active;
    if (recording != null && recording.agentId !== agentId) {
      throw new SandTeachRecordingError(
        "agent_mismatch",
        "teach-recording: recording belongs to a different agent"
      );
    }
    if (finalizing != null) {
      if (!save && finalizing.phase !== "dispatching-prompt") {
        finalizing.intent = "discard";
      }
      const status = await stopInFlight;
      return status ?? statusOf2();
    }
    if (recording == null) return statusOf2();
    const finalizationState = {
      endedAtMs: Date.now(),
      intent: save ? "save" : "discard",
      phase: "preparing"
    };
    finalizing = finalizationState;
    const finalization = (async () => {
      const { endedAtMs } = finalizationState;
      const videoPath = `${recording.sessionDir}/demo.mp4`;
      const connection = await deps.box.ensureReady(ctx, recording.agentId);
      const readPid = `pid=$(tr -d '[:space:]' < ${recording.sessionDir}/ffmpeg.pid) || exit 1`;
      const validatePid = `case "$pid" in ''|*[!0-9]*) exit 1 ;; esac`;
      const verifyCmdline = ffmpegCmdlineOwnsVideo({
        pidExpr: '"$pid"',
        videoPath
      });
      const shouldDiscard = () => finalizationState.intent === "discard";
      finalizationState.phase = "winding-down";
      const windDownWasSave = finalizationState.intent === "save";
      const queueSignature = windDownWasSave ? signQueueEntry({
        key: await queueKey(),
        agentId: recording.agentId,
        queuedFile: queueFile(recording)
      }) : "";
      const windDown = windDownWasSave ? runShell(
        connection,
        [
          "set -e",
          readPid,
          validatePid,
          `if ${verifyCmdline}; then kill -INT "$pid"; fi`,
          `cat > ${recording.sessionDir}/session.json <<SESSION_JSON`,
          sessionJson({
            recording,
            end: { endedAtMs, endReason: "stopped" }
          }),
          `SESSION_JSON`,
          `queue_dir=${TEACH_QUEUES_DIR}/${queueScope(recording.agentId)}`,
          `queue_file="$queue_dir/pending/${queueFile(recording)}"`,
          `mkdir -p "$queue_dir/pending" "$queue_dir/claimed"`,
          `cat > "$queue_file.tmp.$$" <<COMPLETED_SESSION_JSON`,
          completedSessionJson({
            recording,
            endedAtMs,
            signature: queueSignature
          }),
          `COMPLETED_SESSION_JSON`,
          `if [ ! -e "$queue_file" ] && [ ! -e "$queue_dir/claimed/$(basename "$queue_file")" ]; then mv "$queue_file.tmp.$$" "$queue_file"; else rm -f "$queue_file.tmp.$$"; fi`
        ].join("\n"),
        "sand-teach-recording-stop"
      ) : discardRecording({ connection, recording, verifyCmdline });
      const windDownResult = await windDown;
      if (windDownWasSave) {
        if (windDownResult.exitCode === 0) queuePersisted = true;
      } else {
        queuePersisted = false;
      }
      if (shouldDiscard() && windDownWasSave) {
        const discardResult = await discardRecording({
          connection,
          recording,
          verifyCmdline
        });
        queuePersisted = false;
        if (discardResult.exitCode !== 0) {
          throw new SandTeachRecordingError(
            "finalize_failed",
            `teach-recording: failed to finalize recording: ${discardResult.stdout} ${discardResult.stderr}`
          );
        }
      } else if (windDownResult.exitCode !== 0) {
        throw new SandTeachRecordingError(
          "finalize_failed",
          `teach-recording: failed to finalize recording: ${windDownResult.stdout} ${windDownResult.stderr}`
        );
      }
      if (!shouldDiscard()) {
        finalizationState.phase = "checking-skill";
        const skillAvailable = await deps.ensureLearningSkill();
        if (shouldDiscard()) {
          const discardResult = await discardRecording({
            connection,
            recording,
            verifyCmdline
          });
          queuePersisted = false;
          if (discardResult.exitCode !== 0) {
            throw new SandTeachRecordingError(
              "finalize_failed",
              `teach-recording: failed to finalize recording: ${discardResult.stdout} ${discardResult.stderr}`
            );
          }
        } else if (!skillAvailable) {
          throw new SandTeachRecordingError(
            "skill_unavailable",
            "teach-recording: learning skill is unavailable"
          );
        } else {
          finalizationState.phase = "dispatching-prompt";
          await ensureAuthenticQueue({
            connection,
            agentId: recording.agentId
          });
          await deps.sendLearningPrompt(recording.agentId, {
            content: learningPrompt(),
            richText: learningPromptRichText(recording.agentId),
            clientNonce: learningPromptNonce(recording)
          });
          await markPromptDelivered({
            connection,
            pending: {
              agentId: recording.agentId,
              queueFile: queueFile(recording),
              clientNonce: learningPromptNonce(recording)
            }
          });
        }
      }
      active = null;
      disposeCap();
      emit();
      if (trackCompletion) {
        deps.trackRecordingStopped({
          agent_id: recording.agentId,
          outcome: finalizationState.intent === "save" ? "saved" : "discarded",
          duration_seconds: Math.round((endedAtMs - recording.startedAtMs) / 1e3)
        });
      }
      return statusOf2();
    })();
    stopInFlight = finalization;
    try {
      return await finalization;
    } finally {
      if (stopInFlight === finalization) stopInFlight = null;
      if (finalizing === finalizationState) finalizing = null;
      if (active === recording && !isDisposing) armCap(recording);
    }
  };
  const dispose = () => {
    if (disposeInFlight != null) return disposeInFlight;
    isDisposing = true;
    const teardown = (async () => {
      try {
        if (startInFlight != null) {
          try {
            await startInFlight;
          } catch {
            await recoverFailedStart();
          }
        }
        if (stopInFlight != null) {
          try {
            await stopInFlight;
          } catch {
            const recording = active;
            if (recording != null && !queuePersisted) {
              await stop({
                agentId: recording.agentId,
                save: false,
                trackCompletion: false
              });
            }
          }
        } else {
          const recording = active;
          if (recording != null && !queuePersisted) {
            await stop({
              agentId: recording.agentId,
              save: false,
              trackCompletion: false
            });
          }
        }
      } finally {
        disposeCap();
        listeners2.clear();
      }
    })();
    disposeInFlight = teardown;
    return teardown;
  };
  return {
    api: {
      start,
      stop: ({ agentId, save }) => stop({ agentId, save, trackCompletion: true }),
      getStatus: statusOf2,
      subscribe: (listener) => {
        listeners2.add(listener);
        return () => listeners2.delete(listener);
      }
    },
    recoverPending,
    dispose
  };
}
