var HostReplicaWriter = class {
  epoch;
  sequences = /* @__PURE__ */ new Map();
  constructor(epoch) {
    this.epoch = epoch;
  }
  get processEpoch() {
    return this.epoch;
  }
  nextStamp(replicaKey) {
    const next = (this.sequences.get(replicaKey) ?? 0) + 1;
    this.sequences.set(replicaKey, next);
    return { replicaKey, epoch: this.epoch, sequence: next };
  }
  lastSequence(replicaKey) {
    return this.sequences.get(replicaKey) ?? 0;
  }
  captureSnapshot(replicaKey, coverage, value) {
    return {
      replicaKey,
      epoch: this.epoch,
      throughSequence: this.lastSequence(replicaKey),
      coverage,
      value
    };
  }
};
