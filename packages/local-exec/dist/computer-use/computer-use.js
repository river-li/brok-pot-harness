var sessionDuration = createHistogram("computer_use.session.duration_ms", {
  description: "Duration of computer-use session in milliseconds"
});
var sessionActionCount = createHistogram("computer_use.session.action_count", {
  description: "Number of actions executed in a computer-use session"
});
var sessionResult = createCounter("computer_use.session.result", {
  description: "Result status of computer-use session",
  labelNames: ["outcome"]
});
var sessionActionKind = createCounter("computer_use.session.action_kind", {
  description: "Requested computer-use actions by bounded kind",
  labelNames: ["kind"]
});
var logger10 = createLogger("computer-use");
var X11ComputerUseExecutor = class {
  /**
   * Create an X11 computer use executor.
   * @param config - MUST include displayNum and resolution (use detectDisplay() to get resolution)
   */
  constructor(config2, screenshotDirectory = path10.join(os8.tmpdir(), "computer-use")) {
    this.executor = new X11Executor(config2);
    this.screenshotDirectory = screenshotDirectory;
    this.errorScreenshotSettleMs = config2.screenshotDelayMs ?? DEFAULT_SCREENSHOT_DELAY_MS;
  }
  /**
   * Set the InputEventLogger on the underlying X11Executor.
   * Used for recording polished video preprocessing data.
   */
  setInputEventLogger(logger107) {
    this.executor.setInputEventLogger(logger107);
  }
  generateScreenshotFilename() {
    const randomBytes4 = crypto3.randomBytes(3);
    const uuid2 = randomBytes4.toString("hex").substring(0, 5);
    return `${uuid2}.webp`;
  }
  async saveScreenshotToTemp(ctx, screenshotBase64) {
    try {
      const tempDir = this.screenshotDirectory;
      await fs8.mkdir(tempDir, { recursive: true });
      const filename = this.generateScreenshotFilename();
      const filepath = path10.join(tempDir, filename);
      const buffer = Buffer.from(screenshotBase64, "base64");
      await fs8.writeFile(filepath, buffer);
      logger10.info(ctx, "Screenshot saved to temp", {
        filepath,
        sizeBytes: buffer.length
      });
      return filepath;
    } catch (error3) {
      const errorMessage4 = error3 instanceof Error ? error3.message : String(error3);
      logger10.error(ctx, "Failed to save screenshot to temp", error3, {
        error: errorMessage4
      });
      return void 0;
    }
  }
  async execute(ctx, args) {
    const startTime = Date.now();
    const requestedActions = summarizeComputerUseActions(args.actions);
    for (const kind of COMPUTER_USE_ACTION_KINDS) {
      const count = requestedActions.actionCounts[kind];
      if (count > 0) {
        sessionActionKind.increment(ctx, count, { kind });
      }
    }
    logger10.info(ctx, "Executing computer use actions", {
      toolCallId: args.toolCallId,
      actionCount: requestedActions.actionCount,
      actionCounts: requestedActions.actionCounts
    });
    try {
      const result = await this.executor.execute(args.actions, {
        bindUnmappedCharacters: args.bindUnmappedCharacters ?? false,
        signal: ctx.signal
      });
      const durationMs = Date.now() - startTime;
      let screenshotPath;
      if (result.screenshot) {
        screenshotPath = await this.saveScreenshotToTemp(ctx, result.screenshot);
      }
      logger10.info(ctx, "Computer use execution completed", {
        success: result.success,
        actionCount: result.actionCount,
        durationMs,
        screenshotPath
      });
      sessionDuration.histogram(ctx, durationMs);
      sessionActionCount.histogram(ctx, result.actionCount);
      if (result.success) {
        sessionResult.increment(ctx, 1, { outcome: "success" });
        const cursorPosition = result.cursorPosition ? new Coordinate({
          x: result.cursorPosition.x,
          y: result.cursorPosition.y
        }) : void 0;
        return new ComputerUseResult({
          result: {
            case: "success",
            value: new ComputerUseSuccess({
              actionCount: result.actionCount,
              durationMs: result.durationMs,
              screenshot: result.screenshot,
              screenshotPath,
              log: `Executed ${result.actionCount} actions`,
              cursorPosition
            })
          }
        });
      }
      sessionResult.increment(ctx, 1, { outcome: "error" });
      return new ComputerUseResult({
        result: {
          case: "error",
          value: new ComputerUseError({
            error: result.error ?? "Unknown error",
            actionCount: result.actionCount,
            durationMs: result.durationMs
          })
        }
      });
    } catch (error3) {
      const durationMs = Date.now() - startTime;
      const errorMessage4 = error3 instanceof Error ? error3.message : String(error3);
      logger10.error(ctx, "Computer use execution failed", error3, {
        toolCallId: args.toolCallId,
        durationMs
      });
      let errorScreenshotBase64;
      let errorScreenshotPath;
      if (!ctx.signal.aborted) {
        try {
          const screenshotResult = await this.executor.execute([
            new ComputerUseAction({
              action: {
                case: "wait",
                value: new WaitAction({
                  durationMs: this.errorScreenshotSettleMs
                })
              }
            }),
            new ComputerUseAction({
              action: { case: "screenshot", value: new ScreenshotAction() }
            })
          ], { signal: ctx.signal });
          if (screenshotResult.screenshot) {
            errorScreenshotBase64 = screenshotResult.screenshot;
            errorScreenshotPath = await this.saveScreenshotToTemp(ctx, screenshotResult.screenshot);
          }
        } catch (screenshotError) {
          logger10.warn(ctx, "Failed to take error screenshot", {
            error: screenshotError instanceof Error ? screenshotError.message : String(screenshotError)
          });
        }
      }
      sessionDuration.histogram(ctx, durationMs);
      sessionActionCount.histogram(ctx, args.actions.length);
      sessionResult.increment(ctx, 1, { outcome: "error" });
      return new ComputerUseResult({
        result: {
          case: "error",
          value: new ComputerUseError({
            error: errorMessage4,
            actionCount: args.actions.length,
            durationMs,
            log: errorScreenshotPath ? `Error screenshot saved to ${errorScreenshotPath}` : void 0,
            screenshot: errorScreenshotBase64,
            screenshotPath: errorScreenshotPath
          })
        }
      });
    }
  }
};
