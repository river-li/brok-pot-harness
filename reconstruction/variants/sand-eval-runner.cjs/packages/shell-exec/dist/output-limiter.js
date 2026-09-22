/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/output-limiter.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function coalesceAdjacentShellOutputEvents(events) {
  if (events.length === 0) {
    return [];
  }
  const coalesced = [];
  let currentType = events[0].type;
  let dataChunks = [events[0].data];
  for (let index = 1; index < events.length; index++) {
    const next = events[index];
    if (next.type === currentType) {
      dataChunks.push(next.data);
      continue;
    }
    coalesced.push({ type: currentType, data: Buffer.concat(dataChunks) });
    currentType = next.type;
    dataChunks = [next.data];
  }
  coalesced.push({ type: currentType, data: Buffer.concat(dataChunks) });
  return coalesced;
}
function toError(error3) {
  return error3 instanceof Error ? error3 : new Error(String(error3));
}
function attachShellOutputStreams(options2) {
  if (!options2.bufferOutputEvents) {
    const writeOutputEvent = (type2, data) => {
      void options2.writable.write({ type: type2, data }).catch(() => {
      });
    };
    options2.stdout?.on("data", (data) => {
      writeOutputEvent("stdout", data);
    });
    options2.stderr?.on("data", (data) => {
      writeOutputEvent("stderr", data);
    });
    return {
      async waitForOutput() {
      },
      async flush() {
      }
    };
  }
  const limiter = new ShellOutputLimiter(options2.writable, options2.outputLimiterOptions);
  let outputPumpError;
  const outputPumpPromise = Promise.all([
    pumpShellOutputStream(options2.stdout, "stdout", limiter),
    pumpShellOutputStream(options2.stderr, "stderr", limiter)
  ]).then(() => void 0).catch((error3) => {
    outputPumpError = error3;
  });
  return {
    async waitForOutput() {
      await outputPumpPromise;
      if (outputPumpError !== void 0) {
        throw toError(outputPumpError);
      }
    },
    async flush() {
      await limiter.flush();
    }
  };
}
async function pumpShellOutputStream(stream3, type2, limiter) {
  if (!stream3)
    return;
  for await (const chunk of stream3) {
    await limiter.push(type2, chunk);
  }
}
var SHELL_OUTPUT_LIMITER_DEFAULTS, ShellOutputLimiter;
var init_output_limiter = __esm({
  "../packages/shell-exec/dist/output-limiter.js"() {
    "use strict";
    SHELL_OUTPUT_LIMITER_DEFAULTS = {
      flushIntervalMs: 50,
      maxBufferedBytes: 256 * 1024
    };
    ShellOutputLimiter = class {
      writable;
      pending = [];
      pendingBytes = 0;
      flushTimeout;
      flushPromise;
      flushIntervalMs;
      maxBufferedBytes;
      constructor(writable, options2) {
        this.writable = writable;
        this.flushIntervalMs = options2?.flushIntervalMs ?? SHELL_OUTPUT_LIMITER_DEFAULTS.flushIntervalMs;
        this.maxBufferedBytes = options2?.maxBufferedBytes ?? SHELL_OUTPUT_LIMITER_DEFAULTS.maxBufferedBytes;
      }
      async push(type2, data) {
        if (data.length === 0)
          return;
        this.pending.push({ type: type2, data });
        this.pendingBytes += data.length;
        if (this.pendingBytes >= this.maxBufferedBytes) {
          await this.flush();
          return;
        }
        this.scheduleFlush();
      }
      async flush() {
        this.clearFlushTimeout();
        if (this.flushPromise) {
          await this.flushPromise;
          if (this.pendingBytes > 0) {
            await this.flush();
          }
          return;
        }
        if (this.pendingBytes === 0)
          return;
        const pendingEvents = this.pending;
        this.pending = [];
        this.pendingBytes = 0;
        this.flushPromise = this.writeBufferedOutput(pendingEvents);
        try {
          await this.flushPromise;
        } finally {
          this.flushPromise = void 0;
        }
      }
      async close() {
        await this.flush();
      }
      scheduleFlush() {
        if (this.flushTimeout !== void 0)
          return;
        this.flushTimeout = setTimeout(() => {
          this.flushTimeout = void 0;
          void this.flush();
        }, this.flushIntervalMs);
      }
      clearFlushTimeout() {
        if (this.flushTimeout === void 0)
          return;
        clearTimeout(this.flushTimeout);
        this.flushTimeout = void 0;
      }
      async writeBufferedOutput(events) {
        for (const event of coalesceAdjacentShellOutputEvents(events)) {
          try {
            await this.writable.write(event);
          } catch {
          }
        }
      }
    };
  }
});

