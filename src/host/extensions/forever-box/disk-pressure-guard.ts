var import_promises54 = require("node:fs/promises");
init_scheduling();
init_errors();
var GIB = 1024 ** 3;
var DISK_PRESSURE_HEARTBEAT_MS = 5 * 6e4;
var DISK_PRESSURE_THRESHOLDS = {
  softAvailableBytes: 8 * GIB,
  softAvailableRatio: 0.15,
  hardAvailableBytes: 2 * GIB,
  hardAvailableRatio: 0.05,
  softRecoveryBytes: 10 * GIB,
  softRecoveryRatio: 0.2,
  hardRecoveryBytes: 3 * GIB,
  hardRecoveryRatio: 0.08
};
function aggregateDiskPressureLevel(states) {
  const volumes = [...states.values()];
  if (volumes.some((state) => state.level === "hard")) return "hard";
  if (volumes.some((state) => state.level === "soft")) return "soft";
  return "healthy";
}
function classifyDiskPressure(snapshot, previous = "healthy") {
  if (snapshot.totalBytes <= 0) return "healthy";
  const availableRatio = snapshot.availableBytes / snapshot.totalBytes;
  if (snapshot.availableBytes <= DISK_PRESSURE_THRESHOLDS.hardAvailableBytes || availableRatio <= DISK_PRESSURE_THRESHOLDS.hardAvailableRatio) {
    return "hard";
  }
  if (previous === "hard" && (snapshot.availableBytes <= DISK_PRESSURE_THRESHOLDS.hardRecoveryBytes || availableRatio <= DISK_PRESSURE_THRESHOLDS.hardRecoveryRatio)) {
    return "hard";
  }
  if (snapshot.availableBytes <= DISK_PRESSURE_THRESHOLDS.softAvailableBytes || availableRatio <= DISK_PRESSURE_THRESHOLDS.softAvailableRatio) {
    return "soft";
  }
  if (previous === "soft" && (snapshot.availableBytes <= DISK_PRESSURE_THRESHOLDS.softRecoveryBytes || availableRatio <= DISK_PRESSURE_THRESHOLDS.softRecoveryRatio)) {
    return "soft";
  }
  return "healthy";
}
async function readDiskVolumeSnapshots(roots) {
  const snapshots = [];
  const seenDevices = /* @__PURE__ */ new Set();
  let complete = true;
  for (const root of roots) {
    try {
      const [pathStat, fileSystem] = await Promise.all([
        (0, import_promises54.stat)(root.path, { bigint: true }),
        (0, import_promises54.statfs)(root.path, { bigint: true })
      ]);
      const deviceId = String(pathStat.dev);
      if (seenDevices.has(deviceId)) continue;
      seenDevices.add(deviceId);
      snapshots.push({
        volume: root.volume,
        deviceId,
        totalBytes: Number(fileSystem.blocks * fileSystem.bsize),
        availableBytes: Number(fileSystem.bavail * fileSystem.bsize)
      });
    } catch (error41) {
      reportFallback("disk_pressure_guard", error41);
      complete = false;
    }
  }
  return { snapshots, complete };
}
function createDiskPressureGuard(options2) {
  const clock = options2.clock ?? realClock;
  const states = /* @__PURE__ */ new Map();
  let aggregateLevel = "healthy";
  let inFlight = false;
  let disposed = false;
  const check2 = async () => {
    const checkedAtMs = clock.monotonicNow();
    let sample;
    try {
      sample = await options2.readVolumes();
    } catch (error41) {
      options2.log(`disk-pressure sample failed: ${errorLogTag(error41)}`);
      return;
    }
    const sampledDeviceIds = /* @__PURE__ */ new Set();
    for (const snapshot of sample.snapshots) {
      if (disposed) return;
      sampledDeviceIds.add(snapshot.deviceId);
      const previous = states.get(snapshot.deviceId);
      const level = classifyDiskPressure(snapshot, previous?.level);
      const transitioned = level !== (previous?.level ?? "healthy");
      const heartbeatDue = level !== "healthy" && checkedAtMs - (previous?.lastReportedAtMs ?? Number.NEGATIVE_INFINITY) >= DISK_PRESSURE_HEARTBEAT_MS;
      const shouldReport = transitioned || heartbeatDue;
      states.set(snapshot.deviceId, {
        level,
        lastReportedAtMs: shouldReport ? checkedAtMs : previous?.lastReportedAtMs ?? checkedAtMs
      });
      if (!shouldReport) continue;
      try {
        options2.report({
          ...snapshot,
          level,
          trigger: transitioned ? "transition" : "heartbeat",
          usedPercent: snapshot.totalBytes > 0 ? (snapshot.totalBytes - snapshot.availableBytes) / snapshot.totalBytes * 100 : 0
        });
      } catch (error41) {
        options2.log(`disk-pressure report delivery failed: ${errorLogTag(error41)}`);
      }
    }
    if (sample.complete) {
      for (const deviceId of states.keys()) {
        if (!sampledDeviceIds.has(deviceId)) states.delete(deviceId);
      }
    }
    const nextAggregateLevel = aggregateDiskPressureLevel(states);
    if (sample.complete || sample.snapshots.length > 0) {
      options2.onSuccessfulSample?.(nextAggregateLevel, sample.complete);
    }
    if (nextAggregateLevel !== aggregateLevel) {
      aggregateLevel = nextAggregateLevel;
      options2.onPressureChange(nextAggregateLevel === "healthy" ? null : nextAggregateLevel);
    }
  };
  return {
    onTick: () => {
      if (disposed || inFlight) return;
      inFlight = true;
      void check2().finally(() => {
        inFlight = false;
      });
    },
    dispose: () => {
      disposed = true;
    }
  };
}
