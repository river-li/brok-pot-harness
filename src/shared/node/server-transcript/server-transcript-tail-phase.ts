init_invariant();
var SERVER_TRANSCRIPT_TAIL_INITIAL_PHASE = {
  kind: "idle",
  legacy: { kind: "serving" },
  gate: false,
  announced: false,
  generations: { fallback: 0, recovery: 0, destructive: 0 }
};
function isLegacyActive(phase) {
  return phase.kind === "running" && phase.connected && phase.gate && phase.legacy.kind === "serving";
}
function canFallBack(phase, { recoverable }) {
  return phase.kind !== "stopped" && phase.announced && phase.legacy.kind !== "retired" && !(recoverable && phase.legacy.kind === "recovering");
}
function lifetimeOf(phase) {
  return phase.kind === "running" ? phase.lifetime : null;
}
function recoveryTimerOf(phase) {
  return phase.kind !== "stopped" && phase.legacy.kind === "recovering" ? phase.legacy.timer : null;
}
function runningFor(phase, transition) {
  invariant(
    phase.kind === "running",
    () => `server transcript tail: ${transition} needs a running loop, the tail is ${phase.kind}`
  );
  return phase;
}
function announcedIfActive(next) {
  return next.announced || !isLegacyActive(next) ? next : { ...next, announced: true };
}
function started(phase, lifetime) {
  invariant(phase.kind !== "running", "server transcript tail: started while a loop is running");
  const resumed = phase.legacy.kind === "retired" ? { kind: "retired" } : { kind: "serving" };
  return {
    kind: "running",
    lifetime,
    connected: false,
    parked: null,
    legacy: resumed,
    gate: phase.gate,
    announced: phase.announced,
    generations: phase.legacy.kind === "recovering" ? { ...phase.generations, recovery: phase.generations.recovery + 1 } : phase.generations
  };
}
function connected(phase) {
  return announcedIfActive({ ...runningFor(phase, "connected"), connected: true });
}
function gated(phase, enabled) {
  return announcedIfActive({ ...runningFor(phase, "gated"), gate: enabled });
}
function fallenBack(phase, legacy) {
  invariant(
    phase.kind !== "stopped" && canFallBack(phase, { recoverable: legacy.kind === "recovering" }),
    () => `server transcript tail: fallen back to ${legacy.kind} from a phase that refuses it`
  );
  return {
    ...phase,
    legacy,
    generations: {
      fallback: phase.generations.fallback + 1,
      recovery: phase.generations.recovery,
      destructive: phase.generations.destructive + (legacy.kind === "retired" ? 1 : 0)
    }
  };
}
function tornDown(phase) {
  const { legacy, gate, announced, generations } = runningFor(phase, "tornDown");
  return { kind: "idle", legacy, gate, announced, generations };
}
function parked(phase, loop) {
  const running = runningFor(phase, "parked");
  invariant(running.parked === null, "server transcript tail: parked while already parked");
  return { ...running, parked: loop };
}
function unparked(phase) {
  const running = runningFor(phase, "unparked");
  invariant(running.parked !== null, "server transcript tail: unparked while not parked");
  return { ...running, parked: null };
}
function stopped(phase) {
  return {
    kind: "stopped",
    legacy: { kind: phase.legacy.kind },
    gate: phase.gate,
    announced: phase.announced,
    generations: {
      fallback: phase.generations.fallback + 1,
      recovery: phase.generations.recovery,
      destructive: phase.generations.destructive + 1
    }
  };
}
