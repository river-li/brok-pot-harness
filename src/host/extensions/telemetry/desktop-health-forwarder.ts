/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/desktop-health-forwarder.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
var DESKTOP_COMPONENT_KINDS = [
  "xvfb",
  "xfwm4",
  "picom",
  "x11vnc",
  "websockify",
  "dock",
  "fork-websockify",
  "fork-router",
  "egress-proxy"
];
var DESKTOP_COMPONENT_NAME_PATTERN = new RegExp(
  `^(d[1-9][0-9]*|shared)/(${DESKTOP_COMPONENT_KINDS.join("|")})$`
);
var DESKTOP_DOWN_REASON_BY_VALUE = {
  "port-in-use": "port-in-use",
  "x-server-active": "x-server-active",
  "already-running": "already-running",
  "no-display": "no-display",
  oom: "oom",
  glx: "glx",
  "x-io-error": "x-io-error",
  "fatal-server": "fatal-server",
  "awaiting-dependency": "awaiting-dependency",
  "compositor-disabled": "compositor-disabled",
  "port-not-listening": "port-not-listening",
  "listener-procfs-unavailable": "listener-procfs-unavailable",
  unknown: "unknown"
};
var MAX_DOWN_DETAIL_LENGTH = 256;
var MAX_COMPONENT_RESTARTS = 1e4;
function normalizeDesktopComponentName(value) {
  if (typeof value !== "string") return void 0;
  const match2 = DESKTOP_COMPONENT_NAME_PATTERN.exec(value);
  const group = match2?.[1];
  const kind = DESKTOP_COMPONENT_KINDS.find((candidate) => candidate === match2?.[2]);
  if (group === void 0 || kind === void 0) return void 0;
  let scope = "fork";
  if (group === "d1") scope = "primary";
  if (group === "shared") scope = "shared";
  return `${scope}/${kind}`;
}
function normalizeDesktopDownReason(value) {
  if (typeof value !== "string" || value.length === 0) return void 0;
  const exact = DESKTOP_DOWN_REASON_BY_VALUE[value];
  if (exact !== void 0) return exact;
  if (/^signal-SIG[A-Z0-9]+$/.test(value)) return "signal";
  if (/^exit--?[0-9]+$/.test(value)) return "exit";
  return "unknown";
}
function normalizeCount(value) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    return 0;
  }
  return Math.min(value, MAX_COMPONENT_RESTARTS);
}
function mergeDesktopComponentHealth(current, next) {
  const up = current.up && next.up;
  const currentReason = current.downReason;
  const nextReason = next.downReason;
  let downReason = nextReason ?? currentReason ?? "unknown";
  if (currentReason !== void 0 && nextReason !== void 0 && currentReason !== nextReason) {
    downReason = "multiple";
  }
  return {
    name: current.name,
    up,
    crashloop: current.crashloop || next.crashloop,
    restartsInWindow: Math.min(
      MAX_COMPONENT_RESTARTS,
      current.restartsInWindow + next.restartsInWindow
    ),
    ...!up ? { downReason } : {}
  };
}
function parseDesktopHealthSnapshot(raw) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isUnknownRecord(value)) return null;
  if (typeof value.revision !== "number" || !Number.isSafeInteger(value.revision) || value.revision < 0 || typeof value.updatedAtMs !== "number" || !Number.isSafeInteger(value.updatedAtMs) || value.updatedAtMs < 0) {
    return null;
  }
  if (!Array.isArray(value.components)) return null;
  const componentsByName = /* @__PURE__ */ new Map();
  for (const entry of value.components) {
    if (!isUnknownRecord(entry)) continue;
    const name17 = normalizeDesktopComponentName(entry.name);
    if (name17 === void 0) continue;
    const downReason = normalizeDesktopDownReason(entry.downReason);
    const component = {
      name: name17,
      up: entry.up === true,
      crashloop: entry.crashloop === true,
      restartsInWindow: normalizeCount(entry.restartsInWindow),
      ...downReason !== void 0 ? { downReason } : {}
    };
    const current = componentsByName.get(name17);
    componentsByName.set(
      name17,
      current === void 0 ? component : mergeDesktopComponentHealth(current, component)
    );
  }
  const components = [...componentsByName.values()];
  const total = components.length;
  const up = components.filter((c) => c.up).length;
  const crashlooping = components.filter((c) => c.crashloop).length;
  const restartsInWindow = components.reduce((n, c) => n + c.restartsInWindow, 0);
  return {
    updatedAtMs: value.updatedAtMs,
    revision: value.revision,
    supervisionEnabled: value.supervisionEnabled === true,
    total,
    up,
    down: Math.max(0, total - up),
    crashlooping,
    restartsInWindow,
    components
  };
}
function desktopHealthOverall(snapshot) {
  if (snapshot.crashlooping > 0) return "crashloop";
  if (snapshot.down > 0) return "degraded";
  return "healthy";
}
function desktopHealthLevel(overall) {
  return overall === "healthy" ? "info" : "warn";
}
function computeDesktopHealthMetadata(snapshot) {
  const overall = desktopHealthOverall(snapshot);
  const problems = snapshot.components.filter((c) => !c.up || c.crashloop);
  const downDetail = problems.length > 0 ? problems.map((c) => c.crashloop ? `${c.name}(crashloop)` : c.name).join(",").slice(0, MAX_DOWN_DETAIL_LENGTH) : void 0;
  const withReason = problems.filter(
    (c) => typeof c.downReason === "string" && c.downReason.length > 0
  );
  const downReason = withReason.length > 0 ? withReason.map((c) => `${c.name}=${c.downReason}`).join(",").slice(0, MAX_DOWN_DETAIL_LENGTH) : void 0;
  return {
    supervision_enabled: String(snapshot.supervisionEnabled),
    overall,
    total: String(snapshot.total),
    up: String(snapshot.up),
    down: String(snapshot.down),
    crashlooping: String(snapshot.crashlooping),
    restarts_window: String(snapshot.restartsInWindow),
    down_detail: downDetail,
    down_reason: downReason
  };
}
function decideDesktopHealthForward(args) {
  if (args.lastForwardedRevision === null || args.lastForwardedAtMs === null) {
    return true;
  }
  if (args.revision !== args.lastForwardedRevision) return true;
  return args.nowMs - args.lastForwardedAtMs >= args.heartbeatMs;
}
async function forwardDesktopHealthWith(deps) {
  const raw = await deps.readRaw();
  if (raw == null) return "absent";
  const snapshot = parseDesktopHealthSnapshot(raw);
  if (snapshot == null) return "parse_error";
  const last = deps.getLast();
  const nowMs2 = deps.now();
  if (!decideDesktopHealthForward({
    revision: snapshot.revision,
    lastForwardedRevision: last.revision,
    lastForwardedAtMs: last.atMs,
    nowMs: nowMs2,
    heartbeatMs: deps.heartbeatMs
  })) {
    return "skipped";
  }
  const metadata = computeDesktopHealthMetadata(snapshot);
  deps.emit(desktopHealthLevel(desktopHealthOverall(snapshot)), metadata);
  deps.setLast(snapshot.revision, nowMs2);
  return "emitted";
}

