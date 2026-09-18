var BOX_DRAWING_CHARS = /* @__PURE__ */ new Set([
  // Horizontal lines
  "\u2500",
  "\u2501",
  "\u2550",
  "-",
  "_",
  // Vertical lines
  "\u2502",
  "\u2503",
  "\u2551",
  "|",
  // Corners
  "\u250C",
  "\u2510",
  "\u2514",
  "\u2518",
  "\u2554",
  "\u2557",
  "\u255A",
  "\u255D",
  "\u250F",
  "\u2513",
  "\u2517",
  "\u251B",
  "\u2553",
  "\u2556",
  "\u2559",
  "\u255C",
  // Intersections
  "\u251C",
  "\u2524",
  "\u252C",
  "\u2534",
  "\u253C",
  "\u255F",
  "\u2562",
  "\u2564",
  "\u2567",
  "\u256B",
  "\u2560",
  "\u2563",
  "\u2566",
  "\u2569",
  "\u256C",
  "\u255E",
  "\u2561",
  "\u2565",
  "\u2568",
  "\u256A",
  // Plus for simple boxes
  "+"
]);
var BINARY_LIKE_MULTI_LINE_MIN_REPETITIONS = 16;
var BINARY_LIKE_MULTI_LINE_MIN_P_TIMES_K = 16;
var BINARY_LIKE_MULTI_LINE_MIN_TOTAL_CHARS = 384;
var BINARY_LIKE_SINGLE_LINE_MIN_P_TIMES_K = 256;
var SingleMessageLoopDetector = class {
  constructor(config2, hooks) {
    this.config = config2;
    this.hooks = hooks;
    this.currentLine = "";
    this.insideCodeFence = false;
    this.startIdx = 0;
    this.lineCount = 0;
    this.detectedMultiLinePattern = null;
    this.multiLinePeriodMatchRunLengths = [];
    this.detectedSingleLineLoop = null;
    this.periodMatchRunLengths = [];
    this.didTimeout = false;
    const configuredMaxCheckTimeMs = this.config.maxCheckTimeMs();
    this.MULTI_LINE_LOOP_MIN_REPETITIONS = this.config.multiLineLoopMinRepetitions();
    this.MAX_LINE_LENGTH = this.config.maxLineLength();
    this.MAX_CHECK_TIME_MS = configuredMaxCheckTimeMs > 0 ? configuredMaxCheckTimeMs : Number.POSITIVE_INFINITY;
    this.MAX_LINE_QUEUE_SIZE = 50 * this.MULTI_LINE_LOOP_MIN_REPETITIONS;
    this.SINGLE_LINE_LOOP_MIN_REPETITIONS = this.config.singleLineLoopMinRepetitions();
    this.SINGLE_LINE_LOOP_MIN_P_TIMES_K = this.config.singleLineLoopMinPTimesK();
    this.SINGLE_LINE_LOOP_MAX_P_LIMIT = this.config.singleLineLoopMaxP();
    this.lineBuffer = new Array(this.MAX_LINE_QUEUE_SIZE);
    this.periodMatchRunLengths = new Array(this.SINGLE_LINE_LOOP_MAX_P_LIMIT + 1).fill(0);
    this.multiLinePeriodMatchRunLengths = new Array(this.MAX_LINE_QUEUE_SIZE + 1).fill(0);
  }
  loopDetected() {
    return this.detectedSingleLineLoop !== null || this.detectedMultiLinePattern !== null;
  }
  timedOut() {
    return this.didTimeout;
  }
  /**
   * Check if a line is primarily composed of ASCII box drawing characters
   * @param line The line to check
   * @returns true if the line appears to be a box border
   */
  isBoxBorderLine(line) {
    let boxCharCount = 0;
    let totalNonWhitespace = 0;
    for (const char of line) {
      if (char !== " " && char !== "	") {
        totalNonWhitespace++;
      }
      if (BOX_DRAWING_CHARS.has(char)) {
        boxCharCount++;
      }
    }
    if (totalNonWhitespace === 0) {
      return false;
    }
    return boxCharCount / totalNonWhitespace >= 0.8;
  }
  /**
   * True when a line is a binary dump (only 0/1 plus common separators).
   * Used to raise loop thresholds for legitimate structured repetition
   * such as IPv6 zero-group expansions.
   */
  isBinaryLikeLine(line) {
    let hasBit = false;
    for (const char of line) {
      if (char === "0" || char === "1") {
        hasBit = true;
        continue;
      }
      if (char === " " || char === "	" || char === "_" || char === ":" || char === "|" || char === "." || char === "-") {
        continue;
      }
      return false;
    }
    return hasBit;
  }
  /**
   * True when every line in the current multi-line period root is binary-like.
   */
  isBinaryLikeMultiLineRoot(period) {
    const startOfRoot = this.lineCount - period;
    for (let j2 = startOfRoot; j2 < this.lineCount; j2++) {
      if (!this.isBinaryLikeLine(this.getLineAt(j2))) {
        return false;
      }
    }
    return true;
  }
  /**
   * Add new text to the detector and check for loops
   * @param newText The newly streamed text
   * @param caller The environment of the caller ('ide' | 'cli' | 'nal' | 'cursor-big-sft' | 'tests')
   * @returns true if a loop is detected
   */
  addText({ newText, caller }) {
    if (this.loopDetected() || this.didTimeout) {
      return this.loopDetected();
    }
    const deadlineMs = performance.now() + this.MAX_CHECK_TIME_MS;
    for (const char of newText) {
      if (char === "\n") {
        this.updateCodeFenceStateOnLineEnd(this.currentLine);
        if (this.currentLine.trim().length > 0 && !this.isBoxBorderLine(this.currentLine)) {
          this.addLineToQueue(this.currentLine);
          const detectedPattern = this.checkForMultiLineLoop({
            caller,
            deadlineMs
          });
          if (this.didTimeout) {
            return false;
          }
          if (detectedPattern !== null) {
            this.detectedMultiLinePattern = detectedPattern;
            return true;
          }
        }
        this.currentLine = "";
        this.periodMatchRunLengths.fill(0);
      } else {
        if (this.currentLine.length >= this.MAX_LINE_LENGTH) {
          continue;
        }
        this.currentLine += char;
        const startTime = performance.now();
        if (!this.isBoxBorderLine(this.currentLine) && !/\s/.test(char)) {
          const pos = this.currentLine.length - 1;
          const maxP = Math.min(this.SINGLE_LINE_LOOP_MAX_P_LIMIT, pos);
          const minReps = this.insideCodeFence ? this.config.singleLineLoopMinRepetitionsInCodeFence() : this.SINGLE_LINE_LOOP_MIN_REPETITIONS;
          let minPTimesK = this.insideCodeFence ? this.config.singleLineLoopMinPTimesKInCodeFence() : this.SINGLE_LINE_LOOP_MIN_P_TIMES_K;
          if (this.isBinaryLikeLine(this.currentLine)) {
            minPTimesK = Math.max(minPTimesK, BINARY_LIKE_SINGLE_LINE_MIN_P_TIMES_K);
          }
          for (let p2 = 1; p2 <= maxP; p2++) {
            if ((p2 & 31) === 0 && this.markTimedOutIfNeeded({
              caller,
              deadlineMs,
              phase: "single_line",
              startTime
            })) {
              return false;
            }
            if (this.currentLine[pos] === this.currentLine[pos - p2]) {
              const matched = ++this.periodMatchRunLengths[p2];
              const repetitions = Math.floor(matched / p2) + 1;
              const pTimesK = p2 * repetitions;
              if (repetitions >= minReps && pTimesK >= minPTimesK) {
                if (this.hooks?.onSingleLineCheck) {
                  this.hooks.onSingleLineCheck({
                    latencyMs: performance.now() - startTime,
                    result: "loop_detected_single_line_substring",
                    caller
                  });
                }
                const root = this.currentLine.slice(this.currentLine.length - p2, this.currentLine.length);
                this.detectedSingleLineLoop = {
                  start: this.currentLine.length - p2,
                  period: p2,
                  repetitions,
                  root
                };
                return true;
              }
            } else {
              this.periodMatchRunLengths[p2] = 0;
            }
          }
          if (this.hooks?.onSingleLineCheck) {
            this.hooks.onSingleLineCheck({
              latencyMs: performance.now() - startTime,
              result: "no_loop_detected_single_line_substring",
              caller
            });
          }
        }
      }
    }
    return false;
  }
  /**
   * Add a line to the circular buffer (for multi-line loop detection), maintaining the size limit
   */
  addLineToQueue(line) {
    const insertIdx = (this.startIdx + this.lineCount) % this.MAX_LINE_QUEUE_SIZE;
    this.lineBuffer[insertIdx] = line;
    if (this.lineCount < this.MAX_LINE_QUEUE_SIZE) {
      this.lineCount++;
    } else {
      this.startIdx = (this.startIdx + 1) % this.MAX_LINE_QUEUE_SIZE;
    }
  }
  /**
   * Get line at a logical index in the circular buffer
   */
  getLineAt(logicalIndex) {
    const physicalIndex = (this.startIdx + logicalIndex) % this.MAX_LINE_QUEUE_SIZE;
    return this.lineBuffer[physicalIndex];
  }
  /**
   * Check for repeating patterns of lines
   * @param caller The environment of the caller ('ide' | 'cli' | 'cursor-big-sft' | 'tests')
   * @returns true if a repeating pattern is found
   */
  checkForMultiLineLoop({ caller, deadlineMs }) {
    const startTime = performance.now();
    const currentLine = this.getLineAt(this.lineCount - 1);
    const maxPeriod = Math.min(this.lineCount - 1, this.MAX_LINE_QUEUE_SIZE - 1);
    for (let p2 = 1; p2 <= maxPeriod; p2++) {
      if ((p2 & 7) === 0 && this.markTimedOutIfNeeded({
        caller,
        deadlineMs,
        phase: "multi_line",
        startTime
      })) {
        return null;
      }
      const priorIndex = this.lineCount - 1 - p2;
      const priorLine = this.getLineAt(priorIndex);
      if (currentLine === priorLine) {
        const matched = ++this.multiLinePeriodMatchRunLengths[p2];
        const repetitions = Math.floor(matched / p2) + 1;
        const pTimesK = p2 * repetitions;
        const insideFence = this.insideCodeFence;
        let minReps = insideFence ? this.config.multiLineLoopMinRepetitionsInCodeFence() : this.MULTI_LINE_LOOP_MIN_REPETITIONS;
        let minPTimesK = insideFence ? this.config.multiLineLoopMinPTimesKInCodeFence() : this.config.multiLineLoopMinPTimesK();
        let minTotalChars = insideFence ? this.config.multiLineLoopMinTotalCharsInCodeFence() : this.config.multiLineLoopMinTotalChars();
        if (this.isBinaryLikeMultiLineRoot(p2)) {
          minReps = Math.max(minReps, BINARY_LIKE_MULTI_LINE_MIN_REPETITIONS);
          minPTimesK = Math.max(minPTimesK, BINARY_LIKE_MULTI_LINE_MIN_P_TIMES_K);
          minTotalChars = Math.max(minTotalChars, BINARY_LIKE_MULTI_LINE_MIN_TOTAL_CHARS);
        }
        if (repetitions >= minReps && pTimesK >= minPTimesK) {
          const pattern = [];
          const startOfRoot = this.lineCount - 1 - p2 + 1;
          for (let j2 = startOfRoot; j2 < this.lineCount; j2++) {
            pattern.push(this.getLineAt(j2));
          }
          const rootChars = pattern.reduce((sum, line) => sum + line.length, 0);
          const totalRepeatedChars = rootChars * repetitions;
          if (totalRepeatedChars < minTotalChars) {
            continue;
          }
          this.detectedMultiLinePattern = pattern;
          if (this.hooks?.onMultiLineCheck) {
            this.hooks.onMultiLineCheck({
              latencyMs: performance.now() - startTime,
              result: "loop_detected",
              caller
            });
          }
          return pattern;
        }
      } else {
        this.multiLinePeriodMatchRunLengths[p2] = 0;
      }
    }
    if (this.hooks?.onMultiLineCheck) {
      this.hooks.onMultiLineCheck({
        latencyMs: performance.now() - startTime,
        result: "no_loop_detected",
        caller
      });
    }
    return null;
  }
  markTimedOutIfNeeded({ caller, deadlineMs, phase, startTime }) {
    if (this.didTimeout) {
      return true;
    }
    if (performance.now() < deadlineMs) {
      return false;
    }
    this.didTimeout = true;
    this.hooks?.onTimeout?.({
      latencyMs: performance.now() - startTime,
      phase,
      caller
    });
    return true;
  }
  updateCodeFenceStateOnLineEnd(line) {
    if (line.length === 0)
      return;
    const matches = line.match(/```+(?!`)/g);
    if (!matches || matches.length === 0)
      return;
    if (matches.length % 2 === 1) {
      this.insideCodeFence = !this.insideCodeFence;
    }
  }
  /**
   * Get information about the detected loop
   * @returns Object with loop information or null if no loop detected
   */
  getSingleLineLoopInfo() {
    if (!this.detectedSingleLineLoop)
      return null;
    return {
      pattern: this.detectedSingleLineLoop.root,
      repetitions: this.detectedSingleLineLoop.repetitions,
      period: this.detectedSingleLineLoop.period
    };
  }
  getMultiLineLoopInfo() {
    if (!this.detectedMultiLinePattern) {
      return null;
    }
    return {
      pattern: this.detectedMultiLinePattern.join("\n"),
      repetitions: this.MULTI_LINE_LOOP_MIN_REPETITIONS
    };
  }
  /**
   * Reset the detector state
   */
  reset() {
    this.currentLine = "";
    this.insideCodeFence = false;
    this.didTimeout = false;
    this.lineCount = 0;
    this.startIdx = 0;
    this.detectedMultiLinePattern = null;
    this.detectedSingleLineLoop = null;
    this.periodMatchRunLengths.fill(0);
    this.multiLinePeriodMatchRunLengths.fill(0);
  }
};
