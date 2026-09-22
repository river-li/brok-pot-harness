/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/input-event-logger.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var X11_CURSOR_MAP = {
  // Arrow cursors
  left_ptr: CursorType.ARROW,
  arrow: CursorType.ARROW,
  default: CursorType.ARROW,
  top_left_arrow: CursorType.ARROW,
  // Pointer/hand cursors
  hand: CursorType.POINTER,
  hand1: CursorType.POINTER,
  hand2: CursorType.POINTER,
  pointer: CursorType.POINTER,
  pointing_hand: CursorType.POINTER,
  // Text cursors
  xterm: CursorType.TEXT,
  ibeam: CursorType.TEXT,
  text: CursorType.TEXT,
  // Wait/loading cursors
  watch: CursorType.WAIT,
  wait: CursorType.WAIT,
  progress: CursorType.WAIT,
  left_ptr_watch: CursorType.WAIT,
  // Crosshair cursors
  crosshair: CursorType.CROSSHAIR,
  cross: CursorType.CROSSHAIR,
  tcross: CursorType.CROSSHAIR,
  // Move cursors
  move: CursorType.MOVE,
  fleur: CursorType.MOVE,
  size_all: CursorType.MOVE,
  // Resize cursors
  sb_v_double_arrow: CursorType.RESIZE_NS,
  v_double_arrow: CursorType.RESIZE_NS,
  ns_resize: CursorType.RESIZE_NS,
  row_resize: CursorType.RESIZE_NS,
  top_side: CursorType.RESIZE_NS,
  bottom_side: CursorType.RESIZE_NS,
  sb_h_double_arrow: CursorType.RESIZE_EW,
  h_double_arrow: CursorType.RESIZE_EW,
  ew_resize: CursorType.RESIZE_EW,
  col_resize: CursorType.RESIZE_EW,
  left_side: CursorType.RESIZE_EW,
  right_side: CursorType.RESIZE_EW,
  top_left_corner: CursorType.RESIZE_NWSE,
  bottom_right_corner: CursorType.RESIZE_NWSE,
  nwse_resize: CursorType.RESIZE_NWSE,
  size_fdiag: CursorType.RESIZE_NWSE,
  top_right_corner: CursorType.RESIZE_NESW,
  bottom_left_corner: CursorType.RESIZE_NESW,
  nesw_resize: CursorType.RESIZE_NESW,
  size_bdiag: CursorType.RESIZE_NESW,
  // Not allowed cursors
  not_allowed: CursorType.NOT_ALLOWED,
  no_drop: CursorType.NOT_ALLOWED,
  forbidden: CursorType.NOT_ALLOWED,
  circle: CursorType.NOT_ALLOWED,
  // Grab cursors
  grab: CursorType.GRAB,
  openhand: CursorType.GRAB,
  grabbing: CursorType.GRABBING,
  closedhand: CursorType.GRABBING
};
var InputEventLogger = class {
  constructor(config2) {
    this.events = [];
    this.recordingStartTime = 0;
    this.lastKnownPosition = { x: 0, y: 0 };
    this.isRunning = false;
    this.pending = Promise.resolve();
    const displayNum = config2.displayNum ?? 1;
    this.env = { DISPLAY: `:${displayNum}` };
    this.scaler = new CoordinateScaler(config2.resolution);
  }
  /**
   * Start logging events. Call this when recording begins.
   */
  async start() {
    this.events = [];
    this.recordingStartTime = Date.now();
    this.isRunning = true;
    this.pending = Promise.resolve();
    try {
      this.lastKnownPosition = await this.captureCurrentPosition();
    } catch {
      this.lastKnownPosition = {
        x: Math.floor(this.scaler.apiWidth / 2),
        y: Math.floor(this.scaler.apiHeight / 2)
      };
    }
  }
  /**
   * Log an input event after an xdotool command completes.
   *
   * @param action - The action that was executed
   * @param commandStartTime - When the command started (Date.now())
   * @param commandEndTime - When the command completed (Date.now())
   */
  logEvent(action, commandStartTime, commandEndTime) {
    if (!this.isRunning) {
      return;
    }
    const positionBefore = { ...this.lastKnownPosition };
    const expectedPosition = this.getExpectedPositionAfterAction(action, positionBefore);
    this.lastKnownPosition = expectedPosition;
    const task = async () => {
      let positionAfter;
      let cursorTypeAfter;
      try {
        [positionAfter, cursorTypeAfter] = await Promise.all([
          this.captureCurrentPosition(),
          this.detectCursorType()
        ]);
        this.lastKnownPosition = positionAfter;
      } catch {
        positionAfter = expectedPosition;
        cursorTypeAfter = CursorType.ARROW;
      }
      const event = {
        executionTimestampMs: commandEndTime - this.recordingStartTime,
        action,
        commandDurationMs: commandEndTime - commandStartTime,
        positionBefore,
        positionAfter,
        cursorTypeAfter
      };
      this.events.push(event);
    };
    this.pending = this.pending.then(() => task()).catch(() => {
    });
  }
  /**
   * Stop logging and return all captured events.
   */
  async stop() {
    this.isRunning = false;
    await this.pending;
    return [...this.events];
  }
  /**
   * Get all events captured so far (without stopping).
   */
  getEvents() {
    return [...this.events];
  }
  /**
   * Get the recording start time (for timestamp calculations).
   */
  getRecordingStartTime() {
    return this.recordingStartTime;
  }
  /**
   * Check if the logger is currently running.
   */
  getIsRunning() {
    return this.isRunning;
  }
  /**
   * Capture current cursor position via xdotool.
   */
  async captureCurrentPosition() {
    const output = await exec("xdotool", ["getmouselocation", "--shell"], {
      env: this.env
    });
    const xMatch = output.match(/X=(\d+)/);
    const yMatch = output.match(/Y=(\d+)/);
    if (!xMatch || !yMatch) {
      throw new Error(`Failed to parse cursor position: ${output}`);
    }
    const displayX = parseInt(xMatch[1], 10);
    const displayY = parseInt(yMatch[1], 10);
    return this.scaler.displayToApi(displayX, displayY);
  }
  /**
   * Detect current cursor type via X11.
   *
   * We use xdotool's getmouselocation which can optionally include cursor info,
   * or fall back to inferring from the action type.
   */
  async detectCursorType() {
    try {
      const output = await exec("xdotool", ["getmouselocation", "--shell"], {
        env: this.env
      });
      const cursorMatch = output.match(/CURSOR=(\S+)/i);
      if (cursorMatch) {
        const cursorName = cursorMatch[1].toLowerCase();
        return X11_CURSOR_MAP[cursorName] ?? CursorType.ARROW;
      }
      try {
        const xpropOutput = await exec("xprop", ["-root", "_XSERVER_CURSOR"], {
          env: this.env,
          timeoutMs: 500
        });
        for (const [name17, type2] of Object.entries(X11_CURSOR_MAP)) {
          if (xpropOutput.toLowerCase().includes(name17)) {
            return type2;
          }
        }
      } catch {
      }
      return CursorType.ARROW;
    } catch {
      return CursorType.ARROW;
    }
  }
  /**
   * Get expected position after an action based on the action type.
   * Used as fallback if actual position capture fails.
   */
  getExpectedPositionAfterAction(action, positionBefore) {
    const actionOneof = action.action;
    if (!actionOneof) {
      return positionBefore;
    }
    switch (actionOneof.case) {
      case "mouseMove": {
        const coord = actionOneof.value.coordinate;
        if (coord) {
          return { x: coord.x, y: coord.y };
        }
        break;
      }
      case "click": {
        const coord = actionOneof.value.coordinate;
        if (coord) {
          return { x: coord.x, y: coord.y };
        }
        break;
      }
      case "drag": {
        const path31 = actionOneof.value.path;
        if (path31.length > 0) {
          const lastPoint = path31[path31.length - 1];
          return { x: lastPoint.x, y: lastPoint.y };
        }
        break;
      }
      case "scroll": {
        const coord = actionOneof.value.coordinate;
        if (coord) {
          return { x: coord.x, y: coord.y };
        }
        break;
      }
      default:
        break;
    }
    return positionBefore;
  }
};

