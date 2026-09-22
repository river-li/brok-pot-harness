/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/codebase-telemetry/csnaps-process.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_child_process13 = require("node:child_process");
init_scheduling();
init_errors();

// @recovered-fragment 2/2
function spawnCsnaps(options2) {
  return CsnapsProcess.spawn(options2);
}
var CsnapsProcessError = class extends SandDomainError {
  name = "CsnapsProcessError";
};
var CsnapsRequestError = class extends CsnapsProcessError {
  constructor(method, code) {
    super(`csnaps ${method} request failed: ${code}`);
    this.method = method;
    this.code = code;
  }
  method;
  code;
  name = "CsnapsRequestError";
};
var CsnapsProcess = class _CsnapsProcess {
  constructor(child, deadlines) {
    this.child = child;
    this.deadlines = deadlines;
    const terminal = Promise.withResolvers();
    this.terminalFailure = terminal.promise;
    this.resolveTerminalFailure = terminal.resolve;
    this.childClosed = new Promise((resolve29) => {
      child.once("close", (exitCode, signal) => {
        let error42 = this.terminalError;
        if (error42 === void 0) {
          try {
            this.responseDecoder.assertComplete();
            error42 = new CsnapsProcessError(describeCsnapsExit(exitCode, signal));
          } catch (cause) {
            error42 = cause instanceof Error ? cause : new CsnapsProcessError("invalid csnaps response", { cause });
          }
        }
        this.terminalError = error42;
        this.rejectPendingRequests(error42);
        if (!this.isClosing) {
          this.resolveTerminalFailure(error42);
        }
        resolve29();
      });
    });
    child.once(
      "error",
      (error42) => this.fail(
        new CsnapsProcessError(`csnaps child process failed: ${error42.message}`, {
          cause: error42
        })
      )
    );
    child.stdin.on(
      "error",
      (error42) => this.fail(
        new CsnapsProcessError(`csnaps stdin failed: ${error42.message}`, {
          cause: error42
        })
      )
    );
    child.stdout.on(
      "error",
      (error42) => this.fail(
        new CsnapsProcessError(`csnaps stdout failed: ${error42.message}`, {
          cause: error42
        })
      )
    );
    child.stdout.on("data", (chunk) => this.handleStdoutChunk(chunk));
  }
  child;
  deadlines;
  terminalFailure;
  resolveTerminalFailure;
  childClosed;
  terminalError;
  closePromise;
  isClosing = false;
  nextRequestId = 0;
  pendingRequests = /* @__PURE__ */ new Map();
  responseDecoder = new CsnapsResponseDecoder();
  static async spawn(options2) {
    options2.signal?.throwIfAborted();
    const spawnChild = options2.spawn ?? ((executablePath) => (0, import_node_child_process13.spawn)(executablePath, [], {
      env: {},
      stdio: ["pipe", "pipe", "inherit"]
    }));
    const child = spawnChild(options2.executablePath);
    const csnaps = new _CsnapsProcess(child, options2.deadlines);
    try {
      await csnaps.ping(options2.signal);
    } catch (error42) {
      try {
        await csnaps.terminate();
      } catch (cleanupError) {
        throw new CodebaseTelemetryCleanupError(
          [cleanupError],
          "Failed to clean up csnaps after startup failure",
          { cause: error42 }
        );
      }
      throw error42;
    }
    try {
      const initialized2 = await csnaps.initialize(options2.initializeParams, options2.signal);
      return {
        handle: csnaps,
        initialState: initialized2.state
      };
    } catch (error42) {
      try {
        await csnaps.close();
      } catch (cleanupError) {
        throw new CodebaseTelemetryCleanupError(
          [cleanupError],
          "Failed to clean up csnaps after initialization failure",
          { cause: error42 }
        );
      }
      throw error42;
    }
  }
  async initialize(params, signal) {
    const operation = { method: "initialize", params };
    return parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  async getState(signal) {
    const operation = { method: "get_state" };
    return parseCsnapsOperationResult(operation, await this.request(operation, signal)).state;
  }
  async applyCodebaseSpecs(codebases, signal) {
    const operation = {
      method: "apply_codebase_specs",
      params: { codebases }
    };
    return parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  async snapshot(reason, signal) {
    const operation = { method: "snapshot", params: { reason } };
    parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  async triggerUpload(credentials, signal) {
    const operation = {
      method: "trigger_upload",
      params: credentials
    };
    parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  async flushPendingUploads(credentials, signal) {
    const operation = {
      method: "flush_pending_uploads",
      params: credentials
    };
    parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  close() {
    if (this.closePromise !== void 0) {
      return this.closePromise;
    }
    this.isClosing = true;
    this.closePromise = this.shutdown();
    return this.closePromise;
  }
  async ping(signal) {
    const operation = { method: "ping" };
    parseCsnapsOperationResult(operation, await this.request(operation, signal));
  }
  async shutdown() {
    try {
      const operation = { method: "shutdown" };
      parseCsnapsOperationResult(operation, await this.request(operation));
      await this.waitForChildClose("shutdown");
    } catch (error42) {
      try {
        await this.terminate();
      } catch (cleanupError) {
        throw new CodebaseTelemetryCleanupError(
          [cleanupError],
          "Failed to terminate csnaps after shutdown failure",
          { cause: error42 }
        );
      }
    }
  }
  async terminate() {
    if (this.child.exitCode !== null || this.child.signalCode !== null) {
      await this.waitForChildClose("exit");
      return;
    }
    this.child.stdin.destroy();
    this.child.kill("SIGTERM");
    try {
      await this.waitForChildClose("SIGTERM");
      return;
    } catch {
      this.child.kill("SIGKILL");
    }
    await this.waitForChildClose("SIGKILL");
  }
  async waitForChildClose(trigger2) {
    try {
      await this.deadlines.exit.run(async () => await this.childClosed);
    } catch (cause) {
      throw new CsnapsProcessError(describeChildCloseTimeout(trigger2), { cause });
    }
  }
  request(operation, signal) {
    const request5 = this.deadlineFor(operation.method).run(async (deadlineSignal) => {
      if (this.terminalError !== void 0) {
        throw this.terminalError;
      }
      const id = this.nextRequestId++;
      const frame = encodeCsnapsRequest(id, operation);
      const response = Promise.withResolvers();
      const onAbort = () => {
        if (!this.pendingRequests.delete(id)) {
          return;
        }
        const cause = deadlineSignal.reason;
        const error42 = cause instanceof DeadlineExceededError ? new CsnapsProcessError(`csnaps ${operation.method} request timed out`, { cause }) : new CsnapsProcessError(`csnaps ${operation.method} request cancelled`, { cause });
        response.reject(error42);
        this.fail(error42);
      };
      this.pendingRequests.set(id, {
        method: operation.method,
        resolve: response.resolve,
        reject: response.reject,
        signal: deadlineSignal,
        onAbort
      });
      deadlineSignal.addEventListener("abort", onAbort, { once: true });
      if (deadlineSignal.aborted) {
        onAbort();
        return await response.promise;
      }
      const responseSettled = response.promise.then(
        () => void 0,
        () => void 0
      );
      try {
        await writeFrame(this.child.stdin, frame);
      } catch (error42) {
        const processError = this.terminalError ?? (error42 instanceof Error ? error42 : new CsnapsProcessError("csnaps stdin write failed", { cause: error42 }));
        this.fail(processError);
        await responseSettled;
        throw processError;
      }
      return await response.promise;
    }, signal);
    return request5.catch((error42) => {
      throw this.terminalError ?? error42;
    });
  }
  deadlineFor(method) {
    switch (method) {
      case "ping":
        return this.deadlines.ping;
      case "initialize":
        return this.deadlines.initialize;
      case "get_state":
        return this.deadlines.getState;
      case "apply_codebase_specs":
        return this.deadlines.applyCodebaseSpecs;
      case "snapshot":
        return this.deadlines.snapshot;
      case "trigger_upload":
        return this.deadlines.triggerUpload;
      case "flush_pending_uploads":
        return this.deadlines.flushPendingUploads;
      case "shutdown":
        return this.deadlines.shutdown;
    }
  }
  handleStdoutChunk(chunk) {
    if (this.terminalError !== void 0) {
      return;
    }
    try {
      const responses = this.responseDecoder.decode(chunk);
      const seenResponseIds = /* @__PURE__ */ new Set();
      for (const response of responses) {
        if (seenResponseIds.has(response.id)) {
          throw new CsnapsProcessError("csnaps returned a duplicate request ID");
        }
        if (!this.pendingRequests.has(response.id)) {
          throw new CsnapsProcessError("csnaps returned an unknown request ID");
        }
        seenResponseIds.add(response.id);
      }
      for (const response of responses) {
        this.settlePendingRequest(response);
      }
    } catch (error42) {
      this.fail(
        error42 instanceof Error ? error42 : new CsnapsProcessError("invalid csnaps response", { cause: error42 })
      );
    }
  }
  settlePendingRequest(response) {
    const pending = this.pendingRequests.get(response.id);
    if (pending === void 0) {
      throw new CsnapsProcessError("csnaps returned an unknown request ID");
    }
    this.pendingRequests.delete(response.id);
    pending.signal.removeEventListener("abort", pending.onAbort);
    if (response.ok) {
      pending.resolve(response.result);
    } else {
      pending.reject(new CsnapsRequestError(pending.method, response.error));
    }
  }
  fail(error42) {
    if (this.terminalError !== void 0) {
      return;
    }
    this.terminalError = error42;
    this.child.stdin.destroy();
    this.child.kill("SIGTERM");
    this.rejectPendingRequests(error42);
    if (!this.isClosing) {
      this.resolveTerminalFailure(error42);
    }
  }
  rejectPendingRequests(error42) {
    for (const pending of this.pendingRequests.values()) {
      pending.signal.removeEventListener("abort", pending.onAbort);
      pending.reject(error42);
    }
    this.pendingRequests.clear();
  }
};
function describeCsnapsExit(exitCode, signal) {
  if (exitCode !== null) {
    return `csnaps process exited with code ${exitCode}`;
  }
  if (signal !== null) {
    return `csnaps process exited due to signal ${signal}`;
  }
  return "csnaps process exited";
}
function describeChildCloseTimeout(trigger2) {
  switch (trigger2) {
    case "shutdown":
      return "csnaps process did not close after acknowledging the shutdown request";
    case "exit":
      return "csnaps process did not close after process exit";
    case "SIGTERM":
    case "SIGKILL":
      return `csnaps process did not close after ${trigger2}`;
  }
}
function writeFrame(stream3, frame) {
  return new Promise((resolve29, reject2) => {
    try {
      stream3.write(frame, (error42) => {
        if (error42 != null) {
          reject2(csnapsStdinWriteError(error42));
        } else {
          resolve29();
        }
      });
    } catch (cause) {
      reject2(csnapsStdinWriteError(cause));
    }
  });
}
function csnapsStdinWriteError(cause) {
  const detail = cause instanceof Error ? `: ${cause.message}` : "";
  return new CsnapsProcessError(`csnaps stdin write failed${detail}`, { cause });
}

