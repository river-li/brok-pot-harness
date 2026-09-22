var RECONNECT_INITIAL_DELAY_MS = 1e3;
var RECONNECT_MAX_DELAY_MS = 6e4;
var NOTIFY_STREAM_STALL_MS = 35e3;
var SAFETY_POLL_DEFAULT_BEFORE_GATE_RESOLVES = true;
var notifyBusExtension = defineHostExtension({
  id: "notify-bus",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments],
  start: (context2) => {
    const handlersByTopic = {
      "automation-fires": /* @__PURE__ */ new Set(),
      "listener-events": /* @__PURE__ */ new Set()
    };
    let isStopped = false;
    const fire = (topic) => {
      for (const handler of handlersByTopic[topic]) {
        try {
          handler();
        } catch (error42) {
          context2.host.log(
            `[sand:notify-bus] ${topic} drain handler failed: ${errorLogTag(error42)}`
          );
        }
      }
    };
    const client = new SandNotifyBusClient({
      backend: context2.host.environment.backend,
      getAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      onConnected: () => {
        for (const topic of SAND_NOTIFY_TOPICS) fire(topic);
      },
      onNotify: fire,
      onStreamError: (error42) => {
        context2.host.log(`[sand:notify-bus] stream failed: ${errorLogTag(error42)}`);
      },
      reconnectBackoff: createRetryPolicy({
        name: "notify-bus.reconnect",
        mode: "until-signal",
        initialDelayMs: RECONNECT_INITIAL_DELAY_MS,
        maxDelayMs: RECONNECT_MAX_DELAY_MS
      }),
      stallWatchdog: createIdleWatchdogPolicy({
        name: "notify-bus.stall-watchdog",
        idleMs: NOTIFY_STREAM_STALL_MS
      })
    });
    let isClientStarted = false;
    const applyGate = (isOn) => {
      if (isStopped || isOn === isClientStarted) return;
      isClientStarted = isOn;
      if (isOn) {
        client.start();
      } else {
        client.stop();
      }
    };
    context2.onStop(() => {
      isStopped = true;
      client.stop();
      for (const handlers of Object.values(handlersByTopic)) handlers.clear();
    });
    let isSafetyPollEnabled = SAFETY_POLL_DEFAULT_BEFORE_GATE_RESOLVES;
    void context2.host.whenBackgroundWorkReady.then(() => {
      if (isStopped) return;
      const gate = context2.deps.experiments.getFeatureGateProperty("sand_notify_bus");
      context2.onStop(gate.subscribe(applyGate));
      applyGate(gate.get());
      const safetyGate = context2.deps.experiments.getFeatureGateProperty("sand_notify_safety_poll");
      context2.onStop(
        safetyGate.subscribe((isOn) => {
          isSafetyPollEnabled = isOn;
        })
      );
      isSafetyPollEnabled = safetyGate.get();
    });
    return {
      onNotify: (topic, handler) => {
        handlersByTopic[topic].add(handler);
        return () => {
          handlersByTopic[topic].delete(handler);
        };
      },
      isConnected: () => client.isConnected(),
      isSafetyPollEnabled: () => isSafetyPollEnabled
    };
  }
});
