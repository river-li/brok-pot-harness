var FileOperationLockManager = class {
  constructor() {
    this.lockedFiles = /* @__PURE__ */ new Set();
    this.exclusiveLockActive = false;
    this.waitQueue = [];
    this.nextAcquisitionOrder = BigInt(0);
  }
  get activeFileOperationCount() {
    return this.lockedFiles.size;
  }
  async waitForLock(ctx, targetPath, options2) {
    if (ctx.signal.aborted) {
      throw new ToolCallAbortedError();
    }
    const needsToWait = this.exclusiveLockActive || this.lockedFiles.has(targetPath) || this.hasExclusiveWaiterAhead();
    if (needsToWait) {
      let wasGranted = false;
      await new Promise((resolve29) => {
        const wrappedResolve = () => {
          wasGranted = true;
          ctx.signal.removeEventListener("abort", onAbort);
          resolve29();
        };
        const onAbort = () => {
          const idx = this.waitQueue.findIndex((w2) => w2.type === "file" && w2.path === targetPath && w2.resolve === wrappedResolve);
          if (idx >= 0) {
            this.waitQueue.splice(idx, 1);
          }
          resolve29();
        };
        ctx.signal.addEventListener("abort", onAbort, { once: true });
        this.waitQueue.push({
          type: "file",
          path: targetPath,
          resolve: wrappedResolve
        });
      });
      if (ctx.signal.aborted) {
        if (wasGranted) {
          this.releaseFileLock(targetPath);
        }
        throw new ToolCallAbortedError();
      }
    } else {
      this.lockedFiles.add(targetPath);
    }
    let released = false;
    const dispose = () => {
      if (released)
        return;
      released = true;
      this.releaseFileLock(targetPath);
    };
    return {
      acquisitionOrder: options2?.trackAcquisitionOrder === true ? ++this.nextAcquisitionOrder : void 0,
      [Symbol.dispose]: dispose
    };
  }
  async waitForExclusiveLock(ctx) {
    if (ctx.signal.aborted) {
      throw new ToolCallAbortedError();
    }
    const needsToWait = this.exclusiveLockActive || this.activeFileOperationCount > 0;
    if (needsToWait) {
      let wasGranted = false;
      await new Promise((resolve29) => {
        const wrappedResolve = () => {
          wasGranted = true;
          ctx.signal.removeEventListener("abort", onAbort);
          resolve29();
        };
        const onAbort = () => {
          const idx = this.waitQueue.findIndex((w2) => w2.type === "exclusive" && w2.resolve === wrappedResolve);
          if (idx >= 0) {
            this.waitQueue.splice(idx, 1);
          }
          resolve29();
        };
        ctx.signal.addEventListener("abort", onAbort, { once: true });
        this.waitQueue.push({ type: "exclusive", resolve: wrappedResolve });
      });
      if (ctx.signal.aborted) {
        if (wasGranted) {
          this.releaseExclusiveLock();
        }
        throw new ToolCallAbortedError();
      }
    } else {
      this.exclusiveLockActive = true;
    }
    let released = false;
    const dispose = () => {
      if (released)
        return;
      released = true;
      this.releaseExclusiveLock();
    };
    return {
      [Symbol.dispose]: dispose
    };
  }
  hasExclusiveWaiterAhead() {
    return this.waitQueue.some((w2) => w2.type === "exclusive");
  }
  releaseFileLock(pathKey) {
    this.lockedFiles.delete(pathKey);
    this.processQueue();
  }
  releaseExclusiveLock() {
    this.exclusiveLockActive = false;
    this.processQueue();
  }
  processQueue() {
    while (this.waitQueue.length > 0) {
      const front = this.waitQueue[0];
      if (front.type === "exclusive") {
        if (this.activeFileOperationCount > 0 || this.exclusiveLockActive) {
          break;
        }
        this.exclusiveLockActive = true;
        this.waitQueue.shift();
        front.resolve();
        break;
      } else {
        if (this.exclusiveLockActive || this.lockedFiles.has(front.path)) {
          break;
        }
        this.lockedFiles.add(front.path);
        this.waitQueue.shift();
        front.resolve();
      }
    }
  }
};
