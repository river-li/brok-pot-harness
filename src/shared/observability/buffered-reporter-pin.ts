function createBufferedReporterPin(options2) {
  let installed;
  let buffered3 = [];
  const replay = (next, args) => {
    if (options2.onReplayFailure === void 0) {
      next(...args);
      return;
    }
    try {
      next(...args);
    } catch (error42) {
      options2.onReplayFailure(error42);
    }
  };
  return {
    install(next) {
      installed = next;
      const pending = buffered3;
      buffered3 = [];
      if (next === void 0) return;
      for (const args of pending) replay(next, args);
    },
    report(...args) {
      if (installed !== void 0) {
        installed(...args);
        return;
      }
      if (buffered3.length >= options2.capacity) {
        if (options2.overflow === "drop-newest") return;
        buffered3.shift();
      }
      buffered3.push(args);
    }
  };
}
