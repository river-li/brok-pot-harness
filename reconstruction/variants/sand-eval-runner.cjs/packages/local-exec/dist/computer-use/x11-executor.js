/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/x11-executor.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_computer_use_tool_pb();

// @recovered-fragment 2/2
var BUTTON_MAP = {
  [MouseButton.UNSPECIFIED]: "1",
  // default to left
  [MouseButton.LEFT]: "1",
  [MouseButton.MIDDLE]: "2",
  [MouseButton.RIGHT]: "3",
  [MouseButton.BACK]: "8",
  [MouseButton.FORWARD]: "9"
};
var SCROLL_BUTTON = {
  [ScrollDirection.UNSPECIFIED]: 5,
  // default to down
  [ScrollDirection.UP]: 4,
  [ScrollDirection.DOWN]: 5,
  [ScrollDirection.LEFT]: 6,
  [ScrollDirection.RIGHT]: 7
};
function modifiersForXdotool(raw) {
  return (raw?.split("+").filter(Boolean) ?? []).map((modifier) => modifier === "meta" ? "super" : modifier);
}
function keyForXdotool(key) {
  return key.split("+").map((part) => part === "meta" ? "super" : part).join("+");
}
var KEYMAP_SETTLE_MS = 300;
function isAscii(text2) {
  for (const char of text2) {
    if ((char.codePointAt(0) ?? 0) > 127)
      return false;
  }
  return true;
}
function unmappedCharacters(text2) {
  return [...new Set([...text2].filter((char) => !isAscii(char)))];
}
function unicodeKeysym(char) {
  return `U${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
}
function runThatFits(text2, capacity) {
  const needed = /* @__PURE__ */ new Set();
  let length = 0;
  for (const char of text2) {
    if (!isAscii(char) && !needed.has(char)) {
      if (needed.size === capacity)
        break;
      needed.add(char);
    }
    length += char.length;
  }
  return text2.slice(0, length);
}
function actionRequiresSettle(action) {
  switch (action.action.case) {
    case "mouseMove":
    case "click":
    case "mouseDown":
    case "mouseUp":
    case "drag":
    case "key":
    case "scroll":
      return true;
    case "type":
      return /[\r\n]/.test(action.action.value.text);
    case "wait":
    case "screenshot":
    case "cursorPosition":
    case void 0:
      return false;
  }
}
var X11Executor = class {
  /**
   * Create an X11 executor.
   * @param config - MUST include displayNum and resolution (use detectDisplay() to get resolution)
   */
  constructor(config2) {
    this.xdotoolRuns = 0;
    if (!config2.resolution) {
      throw new Error("X11Executor requires resolution config. Use detectDisplay() to detect from system.");
    }
    this.config = {
      displayNum: config2.displayNum,
      display: config2.display ?? `:${config2.displayNum}`,
      resolution: config2.resolution,
      screenshotDelayMs: config2.screenshotDelayMs ?? DEFAULT_SCREENSHOT_DELAY_MS,
      typingDelayMs: config2.typingDelayMs ?? DEFAULT_TYPING_DELAY_MS,
      typingBatchSize: config2.typingBatchSize ?? DEFAULT_TYPING_BATCH_SIZE
    };
    this.scaler = new CoordinateScaler(this.config.resolution);
    this.env = { DISPLAY: this.config.display };
  }
  /**
   * Set the InputEventLogger to use for recording.
   * Pass undefined to disable event logging.
   */
  setInputEventLogger(logger108) {
    this.inputEventLogger = logger108;
  }
  /**
   * Get the current InputEventLogger (if any).
   */
  getInputEventLogger() {
    return this.inputEventLogger;
  }
  xdotool(args, signal) {
    return this.runXdotool(args.split(" ").filter(Boolean), signal);
  }
  /** Every xdotool invocation goes through here so the abort cleanup can tell whether this batch touched input. */
  runXdotool(argv, signal, env = this.env) {
    this.xdotoolRuns += 1;
    return exec("xdotool", argv, { env, signal });
  }
  /**
   * An xdotool killed mid-command leaves whatever it had pressed logically
   * down for whoever drives the desktop next. Best effort, never aborted.
   */
  releaseHeldInput() {
    const buttons2 = [...new Set(Object.values(BUTTON_MAP))].sort((a, b2) => Number(a) - Number(b2)).map((button) => `mouseup ${button}`).join(" ");
    return this.xdotool(`keyup ctrl shift alt super ${buttons2}`, void 0).catch(() => void 0);
  }
  scaleCoordinate(coord) {
    return this.scaler.apiToDisplay(coord.x, coord.y);
  }
  async execute(actions, options2 = {}) {
    const runsBefore = this.xdotoolRuns;
    try {
      return await this.executeActions(actions, options2);
    } catch (error3) {
      if (options2.signal?.aborted === true && this.xdotoolRuns > runsBefore) {
        await this.releaseHeldInput();
      }
      throw error3;
    }
  }
  async executeActions(actions, options2) {
    const { signal } = options2;
    const start = Date.now();
    let cursorPosition;
    let lastScreenshot;
    let screenshotTaken = false;
    let settleNeeded = false;
    for (const action of actions) {
      signal?.throwIfAborted();
      if (action.action.case === "screenshot") {
        if (settleNeeded) {
          await sleep(this.config.screenshotDelayMs, signal);
          settleNeeded = false;
        }
        lastScreenshot = await this.takeScreenshot(signal);
        screenshotTaken = true;
      } else if (action.action.case === "cursorPosition") {
        const result = await this.executeAction(action, options2);
        if (result) {
          cursorPosition = result;
        }
      } else {
        const commandStartTime = Date.now();
        await this.executeAction(action, options2);
        const commandEndTime = Date.now();
        if (this.inputEventLogger?.getIsRunning()) {
          this.inputEventLogger.logEvent(action, commandStartTime, commandEndTime);
        }
        if (actionRequiresSettle(action)) {
          settleNeeded = true;
        }
      }
    }
    if (!screenshotTaken) {
      signal?.throwIfAborted();
      if (settleNeeded) {
        await sleep(this.config.screenshotDelayMs, signal);
      }
      lastScreenshot = await this.takeScreenshot(signal);
    }
    return {
      success: true,
      screenshot: lastScreenshot ?? "",
      cursorPosition,
      actionCount: actions.length,
      durationMs: Date.now() - start
    };
  }
  async executeAction(action, options2) {
    const { action: actionOneof } = action;
    const { signal } = options2;
    switch (actionOneof.case) {
      case "mouseMove": {
        const coord = actionOneof.value.coordinate;
        if (!coord) {
          throw new Error("MouseMoveAction requires coordinate");
        }
        const { x, y } = this.scaleCoordinate(coord);
        await this.xdotool(`mousemove --sync ${x} ${y}`, signal);
        break;
      }
      case "click": {
        const { coordinate: coordinate2, button, count, modifierKeys } = actionOneof.value;
        const buttonNum = BUTTON_MAP[button] ?? BUTTON_MAP[MouseButton.LEFT];
        let clickArgs = buttonNum;
        if (count > 1) {
          clickArgs = `--repeat ${count} --delay 50 ${buttonNum}`;
        }
        const parts = [];
        const modifiers = modifiersForXdotool(modifierKeys);
        for (const mod of modifiers) {
          parts.push(`keydown ${mod}`);
        }
        if (coordinate2) {
          const { x, y } = this.scaleCoordinate(coordinate2);
          parts.push(`mousemove --sync ${x} ${y}`);
        }
        parts.push(`click ${clickArgs}`);
        for (const mod of [...modifiers].reverse()) {
          parts.push(`keyup ${mod}`);
        }
        await this.xdotool(parts.join(" "), signal);
        break;
      }
      case "mouseDown": {
        const buttonNum = BUTTON_MAP[actionOneof.value.button] ?? BUTTON_MAP[MouseButton.LEFT];
        await this.xdotool(`mousedown ${buttonNum}`, signal);
        break;
      }
      case "mouseUp": {
        const buttonNum = BUTTON_MAP[actionOneof.value.button] ?? BUTTON_MAP[MouseButton.LEFT];
        await this.xdotool(`mouseup ${buttonNum}`, signal);
        break;
      }
      case "drag": {
        const { path: path30, button, modifierKeys } = actionOneof.value;
        const buttonNum = BUTTON_MAP[button] ?? BUTTON_MAP[MouseButton.LEFT];
        if (path30.length < 2) {
          throw new Error("Drag path must have at least 2 points");
        }
        const scaledPath = path30.map((coord) => this.scaleCoordinate(coord));
        const commands = [];
        const modifiers = modifiersForXdotool(modifierKeys);
        for (const mod of modifiers) {
          commands.push(`keydown ${mod}`);
        }
        commands.push(`mousemove --sync ${scaledPath[0].x} ${scaledPath[0].y}`);
        commands.push(`mousedown ${buttonNum}`);
        for (let i = 1; i < scaledPath.length; i++) {
          commands.push(`mousemove --sync ${scaledPath[i].x} ${scaledPath[i].y}`);
        }
        commands.push(`mouseup ${buttonNum}`);
        for (const mod of [...modifiers].reverse()) {
          commands.push(`keyup ${mod}`);
        }
        await this.xdotool(commands.join(" "), signal);
        break;
      }
      case "scroll": {
        const { coordinate: coordinate2, direction, amount, modifierKeys } = actionOneof.value;
        const scrollButton = SCROLL_BUTTON[direction] ?? SCROLL_BUTTON[ScrollDirection.DOWN];
        const parts = [];
        const modifiers = modifiersForXdotool(modifierKeys);
        for (const mod of modifiers) {
          parts.push(`keydown ${mod}`);
        }
        if (coordinate2) {
          const { x, y } = this.scaleCoordinate(coordinate2);
          parts.push(`mousemove --sync ${x} ${y}`);
        }
        parts.push(`click --repeat ${amount} ${scrollButton}`);
        for (const mod of [...modifiers].reverse()) {
          parts.push(`keyup ${mod}`);
        }
        await this.xdotool(parts.join(" "), signal);
        break;
      }
      case "type":
        await this.typeText(actionOneof.value.text, options2);
        break;
      case "key": {
        const { key, holdDurationMs } = actionOneof.value;
        const xdotoolKey = keyForXdotool(key);
        if (holdDurationMs && holdDurationMs > 0) {
          await this.xdotool(`keydown ${xdotoolKey}`, signal);
          try {
            await sleep(holdDurationMs, signal);
          } finally {
            await this.xdotool(`keyup ${xdotoolKey}`, void 0);
          }
        } else {
          await this.xdotool(`key -- ${xdotoolKey}`, signal);
        }
        break;
      }
      case "wait":
        await sleep(actionOneof.value.durationMs, signal);
        break;
      case "screenshot":
        break;
      case "cursorPosition": {
        const output = await this.xdotool("getmouselocation --shell", signal);
        const xMatch = output.match(/X=(\d+)/);
        const yMatch = output.match(/Y=(\d+)/);
        if (!xMatch || !yMatch) {
          throw new Error(`Failed to parse cursor position from xdotool output: ${output}`);
        }
        const displayX = parseInt(xMatch[1], 10);
        const displayY = parseInt(yMatch[1], 10);
        const apiCoords = this.scaler.displayToApi(displayX, displayY);
        return new Coordinate({ x: apiCoords.x, y: apiCoords.y });
      }
      case void 0:
        throw new Error("Action case is undefined");
      default: {
        const _2 = actionOneof;
        throw new Error(`Unknown action case: ${JSON.stringify(_2)}`);
      }
    }
    return void 0;
  }
  /**
   * Types text, converting newlines to Return presses, because `xdotool type`
   * sends Linefeed for `\n` and most applications expect Return.
   */
  async typeText(text2, { bindUnmappedCharacters = false, signal }) {
    const lines2 = text2.split(/\r\n|\r|\n/);
    for (const [index, line] of lines2.entries()) {
      if (index > 0)
        await this.xdotool("key Return", signal);
      if (bindUnmappedCharacters && !isAscii(line)) {
        await this.typeWithBorrowedKeys(line, signal);
      } else {
        await this.sendKeystrokes(line, { signal });
      }
    }
  }
  /**
   * Types text containing characters that have no key on the keymap.
   *
   * `xdotool type` handles such a character by borrowing a spare keycode,
   * pressing it, and handing it straight back, once per character. The
   * application translates the event against its own lazily-refreshed copy of the
   * keymap, so a keystroke that overtakes the server's MappingNotify resolves
   * against the stale mapping and vanishes, while xdotool still exits 0. That is
   * how `Aprenderás` reached a live page as `Aprenders` (SAND-1271).
   *
   * Borrowing here instead means every character is already on the keymap before
   * a single key is pressed, and stays there until the run has been typed, so
   * nothing is remapped mid-type. The keymap holds only so many spare keycodes,
   * so longer text is typed as several runs that each fit.
   */
  async typeWithBorrowedKeys(text2, signal) {
    let remaining = text2;
    while (remaining !== "") {
      const spare = await this.spareKeycodes(signal);
      if (spare.length === 0) {
        throw new Error(`Cannot type ${JSON.stringify([...unmappedCharacters(remaining)].join(""))}: the X keymap has no spare keycode to bind them to.`);
      }
      const run = runThatFits(remaining, spare.length);
      remaining = remaining.slice(run.length);
      const bindings = unmappedCharacters(run).map((char, index) => [spare[index], unicodeKeysym(char)]);
      try {
        await this.changeKeymap(bindings.map(([keycode, keysym]) => `keycode ${keycode} = ${keysym} ${keysym}`), signal);
        await sleep(KEYMAP_SETTLE_MS, signal);
        await this.sendKeystrokes(run, {
          clearModifiers: true,
          byCodePoint: true,
          signal
        });
        await sleep(KEYMAP_SETTLE_MS, signal);
      } finally {
        await this.changeKeymap(bindings.map(([keycode]) => `keycode ${keycode} =`), void 0).catch(() => {
        });
      }
    }
  }
  async sendKeystrokes(text2, { clearModifiers = false, byCodePoint = false, signal } = {}) {
    const { typingDelayMs, typingBatchSize } = this.config;
    const units = byCodePoint ? [...text2] : text2.split("");
    for (let i = 0; i < units.length; i += typingBatchSize) {
      const batch = units.slice(i, i + typingBatchSize).join("");
      await this.runXdotool([
        "type",
        ...clearModifiers ? ["--clearmodifiers"] : [],
        "--delay",
        String(typingDelayMs),
        "--",
        batch
      ], signal, { ...this.env, LC_ALL: "C.UTF-8" });
    }
  }
  /** Keycodes carrying no keysyms at all, and so free to borrow. */
  async spareKeycodes(signal) {
    const table = await exec("xmodmap", ["-pke"], { env: this.env, signal });
    return table.split("\n").map((line) => /^keycode\s+(\d+)\s*=\s*$/.exec(line.trim())).filter((match2) => match2 !== null).map((match2) => Number(match2[1]));
  }
  changeKeymap(entries, signal) {
    return execWithInput("xmodmap", ["-"], {
      input: `${entries.join("\n")}
`,
      env: this.env,
      signal
    });
  }
  async takeScreenshot(signal) {
    const { width, height } = this.config.resolution.display;
    const buffer = await execBuffer("ffmpeg", [
      "-f",
      "x11grab",
      "-video_size",
      `${width}x${height}`,
      "-i",
      this.config.display,
      "-frames:v",
      "1",
      ...ffmpegScreenshotScaleArgs(width, height, this.scaler.apiWidth, this.scaler.apiHeight),
      "-c:v",
      "libwebp",
      "-preset",
      "text",
      // Optimized for UI screenshots with sharp edges and text
      "-lossless",
      "1",
      "-f",
      "webp",
      "pipe:1"
    ], { env: this.env, signal });
    const isSimpleVP8WebP = buffer.length > 20 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP" && buffer.subarray(12, 16).toString() === "VP8 ";
    if (isSimpleVP8WebP) {
      buffer.writeUInt32LE(buffer.length - 8, 4);
      buffer.writeUInt32LE(buffer.length - 20, 16);
    }
    return buffer.toString("base64");
  }
};

