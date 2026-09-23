var MacComputerUseActionRunner = class _MacComputerUseActionRunner {
  constructor({ ctx, actions, sidecar }) {
    this.startTime = Date.now();
    this.geometryPrimed = false;
    this.actionCount = 0;
    this.hasCompletedActuation = false;
    this.staleAfterWait = false;
    this.ctx = ctx;
    this.actions = actions;
    this.sidecar = sidecar;
  }
  async execute() {
    const needsControl = this.actions.some((action) => _MacComputerUseActionRunner.isInputAction(action.action.case));
    try {
      this.throwIfAborted();
      if (needsControl) {
        await this.sidecar.startControl(this.ctx);
      }
      for (const action of this.actions) {
        this.throwIfAborted();
        const a = action.action;
        if (a.case === void 0) {
          throw new Error("Computer use action case is undefined");
        }
        this.actionCount += 1;
        switch (a.case) {
          case "screenshot": {
            await this.captureScreen();
            break;
          }
          case "click": {
            if (a.value.coordinate !== void 0) {
              await this.ensureGeometryCached();
            }
            this.recordActuation(await this.sidecar.click(this.ctx, {
              coordinate: a.value.coordinate,
              button: _MacComputerUseActionRunner.mouseButtonName(a.value.button),
              count: a.value.count > 0 ? a.value.count : 1,
              modifierKeys: a.value.modifierKeys
            }), a.value.coordinate);
            break;
          }
          case "scroll": {
            if (a.value.coordinate !== void 0) {
              await this.ensureGeometryCached();
            }
            this.recordActuation(await this.sidecar.scroll(this.ctx, {
              coordinate: a.value.coordinate,
              direction: _MacComputerUseActionRunner.scrollDirectionName(a.value.direction),
              amount: a.value.amount > 0 ? a.value.amount : 3,
              modifierKeys: a.value.modifierKeys
            }), a.value.coordinate);
            break;
          }
          case "mouseMove": {
            if (a.value.coordinate === void 0) {
              throw new Error("MouseMoveAction requires coordinate");
            }
            await this.ensureGeometryCached();
            this.recordActuation(await this.sidecar.move(this.ctx, {
              x: a.value.coordinate.x,
              y: a.value.coordinate.y
            }), a.value.coordinate);
            break;
          }
          case "mouseDown": {
            this.recordActuation(await this.sidecar.mouseButton(this.ctx, {
              button: _MacComputerUseActionRunner.mouseButtonName(a.value.button),
              action: "down"
            }));
            break;
          }
          case "mouseUp": {
            this.recordActuation(await this.sidecar.mouseButton(this.ctx, {
              button: _MacComputerUseActionRunner.mouseButtonName(a.value.button),
              action: "up"
            }));
            break;
          }
          case "drag": {
            const path31 = a.value.path.map((point2) => ({
              x: point2.x,
              y: point2.y
            }));
            await this.ensureGeometryCached();
            this.recordActuation(await this.sidecar.drag(this.ctx, {
              button: _MacComputerUseActionRunner.mouseButtonName(a.value.button),
              path: path31,
              modifierKeys: a.value.modifierKeys
            }), path31.at(-1));
            break;
          }
          case "type": {
            this.recordActuation(await this.sidecar.typeText(this.ctx, a.value.text));
            break;
          }
          case "key": {
            this.recordActuation(await this.sidecar.pressKey(this.ctx, {
              key: a.value.key,
              holdDurationMs: a.value.holdDurationMs
            }));
            break;
          }
          case "wait": {
            await this.delay(Math.max(0, a.value.durationMs));
            this.staleAfterWait = true;
            break;
          }
          case "cursorPosition": {
            await this.captureScreen();
            break;
          }
          default: {
            const _exhaustive = a;
            throw new Error(`Unknown computer use action: ${JSON.stringify(_exhaustive)}`);
          }
        }
      }
      this.throwIfAborted();
      if (this.screenshot === void 0 || this.staleAfterWait) {
        await this.captureScreen();
      }
      this.throwIfAborted();
      const screenshots = await this.normalizeRetainedScreenshots();
      if (screenshots.screenshotFailed && !this.hasCompletedActuation) {
        return this.screenshotUnavailableResult(screenshots.failureReason);
      }
      this.throwIfAborted();
      return new ComputerUseResult({
        result: {
          case: "success",
          value: new ComputerUseSuccess({
            actionCount: this.actionCount,
            durationMs: Date.now() - this.startTime,
            screenshot: screenshots.screenshot,
            cursorPosition: this.cursor,
            log: screenshots.screenshotFailed ? "Screenshot unavailable" : void 0
          })
        }
      });
    } catch (error42) {
      if (this.ctx.signal.aborted) {
        return this.abortedResult();
      }
      return this.errorResult(error42);
    } finally {
      if (needsControl) {
        await this.sidecar.releaseControl(this.ctx);
      }
    }
  }
  static isInputAction(actionCase) {
    switch (actionCase) {
      case "click":
      case "scroll":
      case "mouseMove":
      case "mouseDown":
      case "mouseUp":
      case "drag":
      case "type":
      case "key":
        return true;
      default:
        return false;
    }
  }
  async captureScreen() {
    const result = await this.sidecar.screenshot(this.ctx);
    this.screenshot = result.screenshot;
    this.cursor = _MacComputerUseActionRunner.cursorFromResult(result) ?? this.cursor;
    this.geometryPrimed = true;
    this.staleAfterWait = false;
  }
  /**
   * Remote sidecar rejects model-coordinate click/scroll/move/drag until a
   * screenshot has populated in-process display geometry.
   */
  async ensureGeometryCached() {
    if (this.geometryPrimed) {
      return;
    }
    await this.captureScreen();
  }
  recordActuation(result, coordinate2) {
    this.screenshot = result.screenshot;
    this.hasCompletedActuation = true;
    this.staleAfterWait = false;
    if (result.screenshot !== void 0) {
      this.geometryPrimed = true;
    }
    this.cursor = _MacComputerUseActionRunner.cursorFromResult(result) ?? _MacComputerUseActionRunner.coordinateFromPoint(coordinate2) ?? this.cursor;
  }
  async errorResult(error42) {
    _MacComputerUseActionRunner.logger.error(this.ctx, "local-cua execute failed", void 0, {
      error: redactMacComputerUseError(error42)
    });
    let errorShot;
    if (!isMacComputerUseCaptureBlocked(error42)) {
      try {
        const result = await this.sidecar.screenshot(this.ctx);
        errorShot = (await this.normalizeScreenshot(result.screenshot, "error")).data;
      } catch (screenshotError) {
        _MacComputerUseActionRunner.logger.warn(this.ctx, "local-cua error screenshot capture failed", {
          error: redactMacComputerUseError(screenshotError)
        });
      }
    }
    const guidance = userFacingMacComputerUseError(error42);
    return new ComputerUseResult({
      result: {
        case: "error",
        value: new ComputerUseError({
          error: guidance === void 0 ? "Computer use failed" : `Computer use failed: ${guidance}`,
          actionCount: this.actionCount,
          durationMs: Date.now() - this.startTime,
          screenshot: errorShot
        })
      }
    });
  }
  screenshotUnavailableResult(reason) {
    return new ComputerUseResult({
      result: {
        case: "error",
        value: new ComputerUseError({
          error: "Screenshot unavailable",
          actionCount: this.actionCount,
          durationMs: Date.now() - this.startTime,
          log: reason
        })
      }
    });
  }
  abortedResult() {
    return new ComputerUseResult({
      result: {
        case: "error",
        value: new ComputerUseError({
          error: "Computer use aborted",
          actionCount: this.actionCount,
          durationMs: Date.now() - this.startTime
        })
      }
    });
  }
  static mouseButtonName(button) {
    return _MacComputerUseActionRunner.mouseButtonNames[button] ?? "left";
  }
  static scrollDirectionName(direction) {
    return _MacComputerUseActionRunner.scrollDirectionNames[direction] ?? "down";
  }
  async normalizeRetainedScreenshots() {
    const screenshot = await this.normalizeScreenshot(this.screenshot, "post-action");
    return {
      screenshot: screenshot.data,
      screenshotFailed: this.screenshot === void 0 || screenshot.failed,
      failureReason: this.screenshot === void 0 ? "sidecar returned no image" : screenshot.reason
    };
  }
  async normalizeScreenshot(image2, frame) {
    if (image2 === void 0) {
      return { failed: false };
    }
    try {
      return { data: await MacScreenshotCodec.normalize(image2), failed: false };
    } catch (error42) {
      const reason = redactMacComputerUseError(error42);
      _MacComputerUseActionRunner.logger.error(this.ctx, "local-cua screenshot conversion failed", void 0, { frame, error: reason });
      if (image2.mimeType === "image/png" && image2.data.length > 0) {
        return { data: image2.data, failed: false };
      }
      return { failed: true, reason };
    }
  }
  static coordinateFromPoint(point2) {
    if (point2 === void 0 || !Number.isFinite(point2.x) || !Number.isFinite(point2.y)) {
      return void 0;
    }
    return new Coordinate({
      x: Math.round(point2.x),
      y: Math.round(point2.y)
    });
  }
  static cursorFromResult(result) {
    const structured = result.structuredContent;
    if (typeof structured !== "object" || structured === null || !("cursor" in structured)) {
      return void 0;
    }
    const cursor = structured.cursor;
    if (typeof cursor === "object" && cursor !== null && "x" in cursor && "y" in cursor && typeof cursor.x === "number" && typeof cursor.y === "number" && Number.isFinite(cursor.x) && Number.isFinite(cursor.y)) {
      return new Coordinate({
        x: Math.round(cursor.x),
        y: Math.round(cursor.y)
      });
    }
    return void 0;
  }
  throwIfAborted() {
    if (this.ctx.signal.aborted) {
      throw this.ctx.signal.reason ?? new Error("Computer use aborted");
    }
  }
  delay(durationMs) {
    this.throwIfAborted();
    return new Promise((resolve29, reject2) => {
      const onAbort = () => {
        clearTimeout(timeout2);
        reject2(this.ctx.signal.reason ?? new Error("Computer use aborted"));
      };
      const timeout2 = setTimeout(() => {
        this.ctx.signal.removeEventListener("abort", onAbort);
        resolve29();
      }, durationMs);
      this.ctx.signal.addEventListener("abort", onAbort, { once: true });
      if (this.ctx.signal.aborted) {
        onAbort();
      }
    });
  }
};
MacComputerUseActionRunner.logger = createLogger("local-cua:actions");
MacComputerUseActionRunner.mouseButtonNames = {
  [MouseButton.UNSPECIFIED]: "left",
  [MouseButton.LEFT]: "left",
  [MouseButton.RIGHT]: "right",
  [MouseButton.MIDDLE]: "middle",
  // Sidecar CUMouseButton is left/right/middle only; extra buttons
  // (Linux X11 8/9, Windows X1/X2) fall back instead of failing the batch.
  [MouseButton.BACK]: "left",
  [MouseButton.FORWARD]: "left"
};
MacComputerUseActionRunner.scrollDirectionNames = {
  [ScrollDirection.UNSPECIFIED]: "down",
  [ScrollDirection.UP]: "up",
  [ScrollDirection.DOWN]: "down",
  [ScrollDirection.LEFT]: "left",
  [ScrollDirection.RIGHT]: "right"
};
