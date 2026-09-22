/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/notify-drain-gate.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NOTIFY_SAFETY_POLL_MS = 12e4;
var NOTIFY_DRAIN_FLOOR_MS = 4e3;
function createNotifyDrainGate(deps) {
  let notifyPending = false;
  let lastPollAtMs = null;
  let notifySeq = 0;
  let drainedNotifySeq = 0;
  return {
    recordNotify() {
      notifyPending = true;
      notifySeq += 1;
    },
    takeDrainDecision({ hasOwedWork }) {
      drainedNotifySeq = notifySeq;
      if (hasOwedWork) return true;
      if (!(deps.isConnected?.() ?? false)) return true;
      if (lastPollAtMs == null) return true;
      const sincePollMs = deps.now() - lastPollAtMs;
      if (notifyPending && sincePollMs >= NOTIFY_DRAIN_FLOOR_MS) return true;
      return (deps.isSafetyPollEnabled?.() ?? true) && sincePollMs >= NOTIFY_SAFETY_POLL_MS;
    },
    recordPoll() {
      if (notifySeq === drainedNotifySeq) notifyPending = false;
      lastPollAtMs = deps.now();
    },
    reset() {
      lastPollAtMs = null;
    }
  };
}

