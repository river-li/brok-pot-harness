/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/lazy-computer-use.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_computer_use_tool_pb();
var logger11 = createLogger("computer-use-lazy");
var DEFAULT_READY_TIMEOUT_MS = 3e4;
async function defaultInitialize(display, readyTimeoutMs) {
  await waitForDisplay(display, readyTimeoutMs);
  const displayInfo = detectDisplaySync(display);
  const displayNum = parseDisplayNum(display);
  return new X11ComputerUseExecutor({
    displayNum,
    resolution: displayInfo.resolution
  });
}
var LazyX11ComputerUseExecutor = class {
  constructor(options2) {
    this.hasPendingInputEventLogger = false;
    this.display = options2.display;
    this.readyTimeoutMs = options2.readyTimeoutMs ?? DEFAULT_READY_TIMEOUT_MS;
    this.initialize = options2.initialize ?? defaultInitialize;
  }
  // Mirrors X11ComputerUseExecutor.setInputEventLogger so the record-screen
  // wiring can attach the polished-recording logger before the underlying
  // executor exists; it is (re)applied as soon as the executor is created.
  setInputEventLogger(inputEventLogger) {
    this.pendingInputEventLogger = inputEventLogger;
    this.hasPendingInputEventLogger = true;
    this.inner?.setInputEventLogger(inputEventLogger);
  }
  // Best-effort background warm-up so the common case (desktop up shortly after
  // boot) has the executor ready before the first action, without blocking daemon
  // startup and without turning a slow desktop into a hard failure. A failed
  // prime simply leaves init to the first real action, which retries.
  prime(ctx) {
    void this.ensureInner(ctx).catch(() => {
    });
  }
  async ensureInner(ctx) {
    if (this.inner !== void 0)
      return this.inner;
    if (this.initInFlight === void 0) {
      this.initInFlight = (async () => {
        const created = await this.initialize(this.display, this.readyTimeoutMs);
        if (this.hasPendingInputEventLogger) {
          created.setInputEventLogger(this.pendingInputEventLogger);
        }
        this.inner = created;
        logger11.info(ctx, "computer-use X11 executor initialized lazily", {
          display: this.display
        });
        return created;
      })();
    }
    try {
      return await this.initInFlight;
    } catch (error3) {
      this.initInFlight = void 0;
      throw error3;
    }
  }
  async execute(ctx, args) {
    let inner;
    try {
      inner = await this.ensureInner(ctx);
    } catch (error3) {
      const message = error3 instanceof Error ? error3.message : String(error3);
      logger11.warn(ctx, "computer-use X11 executor not ready", {
        display: this.display,
        error: message
      });
      return new ComputerUseResult({
        result: {
          case: "error",
          value: new ComputerUseError({
            error: `The box desktop (X11 display ${this.display}) is not available yet (${message}). It may still be starting up \u2014 try again in a moment.`,
            actionCount: 0,
            durationMs: 0
          })
        }
      });
    }
    return await inner.execute(ctx, args);
  }
};

