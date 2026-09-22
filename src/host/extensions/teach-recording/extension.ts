var CAP_SLACK_MS = 2e3;
var LEARNING_PROMPT_SEND_TIMEOUT_MS = 3e4;
var TEACH_QUEUE_KEY_FILENAME = "teach-queue-key.json";
function createLearningPromptSender({
  client
}) {
  return async (agentId, prompt) => {
    const response = await client.sendGrokBotUserMessage(
      {
        agentId,
        messageId: prompt.clientNonce,
        text: prompt.content,
        richText: prompt.richText,
        sentAtMs: BigInt(Date.now()),
        attachmentPaths: [],
        attachmentNames: []
      },
      { timeoutMs: LEARNING_PROMPT_SEND_TIMEOUT_MS }
    );
    if (response.delivery === GrokBotUserMessageDelivery.REFUSED) {
      throw new SandTeachRecordingError(
        "prompt_refused",
        `teach-recording: learning prompt refused: ${response.refusal?.message ?? "unknown"}`
      );
    }
  };
}
function parseTeachQueueKey(raw) {
  try {
    const parsed2 = JSON.parse(raw);
    if (parsed2 != null && typeof parsed2 === "object" && "version" in parsed2 && parsed2.version === 1 && "keyHex" in parsed2 && typeof parsed2.keyHex === "string" && /^[0-9a-f]{64}$/.test(parsed2.keyHex)) {
      return Buffer.from(parsed2.keyHex, "hex");
    }
  } catch {
    return null;
  }
  return null;
}
async function readTeachQueueKeyFile(keyPath) {
  try {
    return await (0, import_promises70.readFile)(keyPath, "utf8");
  } catch (error42) {
    reportFallbackUnlessAbsent("teach_recording_extension", error42);
    return null;
  }
}
async function loadTeachQueueKey() {
  const keyPath = (0, import_node_path145.join)(getSandRootDir(), TEACH_QUEUE_KEY_FILENAME);
  const raw = await readTeachQueueKeyFile(keyPath);
  const existing = raw == null ? null : parseTeachQueueKey(raw);
  if (existing != null) return existing;
  const key = (0, import_node_crypto67.randomBytes)(32);
  await (0, import_promises70.mkdir)(getSandRootDir(), { recursive: true });
  await (0, import_promises70.writeFile)(keyPath, JSON.stringify({ version: 1, keyHex: key.toString("hex") }), {
    mode: 384
  });
  return key;
}
var teachRecordingExtension = defineHostExtension({
  id: "teach-recording",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.ForeverBox,
    HostExtensions.ManagedSetup,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: async (context2) => {
    const analytics = context2.deps["telemetry"].analytics;
    const auth2 = context2.deps["auth"];
    const client = createSandCursorBackendClient(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    });
    const service = createTeachRecordingService({
      box: context2.deps["forever-box"].box,
      capPolicy: createDebouncePolicy({
        name: "teach-recording-cap",
        delayMs: SAND_TEACH_MAX_DURATION_MS + CAP_SLACK_MS
      }),
      sendLearningPrompt: createLearningPromptSender({ client }),
      listAgentIds: () => context2.deps["transcript"].listAgentIds(),
      queueSignatureKey: loadTeachQueueKey,
      ensureLearningSkill: () => context2.deps["managed-setup"].ensureManagedSkill(LEARN_FROM_DEMONSTRATION_SKILL_ID),
      trackRecordingStarted: (props) => analytics.trackEvent("sand.teach.recording_started", props),
      trackRecordingStopped: (props) => analytics.trackEvent("sand.teach.recording_stopped", props),
      reportCapStopFailed: ({ errorClass }) => context2.deps["telemetry"].logs.reportTeachRecordingCapStopFailed({
        errorClass
      }),
      reportStartFailed: ({ kind, errorClass, windowIndex, entryPoint }) => context2.deps["telemetry"].logs.reportTeachRecordingStartFailed({
        kind,
        errorClass,
        windowIndex,
        entryPoint
      })
    });
    const lifetime = new AbortController();
    context2.onStop(() => lifetime.abort());
    context2.onStop(
      schedulePendingRecovery({
        recover: () => service.recoverPending(),
        whenReady: context2.host.whenBackgroundWorkReady,
        subscribeToRenewal: auth2.subscribeToRenewal,
        signal: lifetime.signal,
        log: (message) => context2.host.log(message)
      })
    );
    context2.onStop(() => service.dispose());
    return service.api;
  }
});
function schedulePendingRecovery({
  recover,
  whenReady,
  subscribeToRenewal,
  signal,
  log: log4
}) {
  let recovered = false;
  let inFlight;
  let renewedDuringAttempt = false;
  const attempt = () => {
    if (recovered || signal.aborted) return Promise.resolve();
    if (inFlight !== void 0) {
      renewedDuringAttempt = true;
      return inFlight;
    }
    inFlight = (async () => {
      await whenReady;
      if (signal.aborted) return;
      try {
        await recover();
        recovered = true;
      } catch (error42) {
        if (!signal.aborted) {
          log4(
            `teach-recording: pending delivery recovery failed (${errorLogTag(error42)}); retrying after credential renewal`
          );
        }
      }
    })().finally(() => {
      inFlight = void 0;
      if (renewedDuringAttempt) {
        renewedDuringAttempt = false;
        void attempt();
      }
    });
    return inFlight;
  };
  const unsubscribe = subscribeToRenewal((event) => {
    if (event.outcome === "renewed") void attempt();
  });
  void attempt();
  return unsubscribe;
}
