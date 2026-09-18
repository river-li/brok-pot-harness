function formatSuppressionReason(args) {
  const volumeReasons = [
    `output volume ${args.charsInWindow} chars in window >= min ${args.minChars}`,
    `output rate ${Math.round(args.charsPerSecond)} chars/s >= threshold ${args.triggeredThresholdCharsPerSecond} chars/s`
  ];
  const volumeSection = `volume thresholds met (${volumeReasons.join("; ")})`;
  const eventLoopSection = args.suppressWithoutPressure ? "event loop pressure gate bypassed due to extreme output rate" : args.eventLoopPressureTracker.formatSuppressionSection();
  return `${volumeSection}; ${eventLoopSection}`;
}
var SHELL_OUTPUT_SUPPRESSION_DEFAULTS, BUCKET_MS, SHELL_OUTPUT_SUPPRESSED_NOTICE, OutputSuppressionController;
var init_output_suppression = __esm({
  "../packages/shell-exec/dist/output-suppression.js"() {
    "use strict";
    init_event_loop_pressure();
    SHELL_OUTPUT_SUPPRESSION_DEFAULTS = {
      windowMs: 6e4,
      minimumThresholdCharsPerSecond: 64 * 1024,
      thresholdCharsPerSecondWithoutPressure: 2 * 1024 * 1024,
      minChars: 256 * 1024
    };
    BUCKET_MS = 1e3;
    SHELL_OUTPUT_SUPPRESSED_NOTICE = "\n[This shell is producing too much output to stream. The command will still run.]\n";
    OutputSuppressionController = class {
      bucketChars;
      bucketStarts;
      totalChars = 0;
      outputSuppressed = false;
      noticeSent = false;
      windowMs;
      minimumThresholdCharsPerSecond;
      thresholdCharsPerSecondWithoutPressure;
      minChars;
      eventLoopPressureTracker;
      disposed = false;
      constructor(options2) {
        this.windowMs = options2?.windowMs ?? SHELL_OUTPUT_SUPPRESSION_DEFAULTS.windowMs;
        this.minimumThresholdCharsPerSecond = options2?.minimumThresholdCharsPerSecond ?? SHELL_OUTPUT_SUPPRESSION_DEFAULTS.minimumThresholdCharsPerSecond;
        this.thresholdCharsPerSecondWithoutPressure = options2?.thresholdCharsPerSecondWithoutPressure ?? SHELL_OUTPUT_SUPPRESSION_DEFAULTS.thresholdCharsPerSecondWithoutPressure;
        this.minChars = options2?.minChars ?? SHELL_OUTPUT_SUPPRESSION_DEFAULTS.minChars;
        const bucketCount = Math.ceil(this.windowMs / BUCKET_MS) + 1;
        this.bucketChars = new Uint32Array(bucketCount);
        this.bucketStarts = new Float64Array(bucketCount);
      }
      // This function uses byteLength but everything outside is measured in chars.
      // This is because of the experiment config and when we're happy with the
      // values we should standardize everything on bytes.
      record(byteLength, now = Date.now()) {
        if (this.disposed) {
          return {
            shouldForward: !this.outputSuppressed,
            noticeJustTriggered: false,
            charsPerSecond: 0,
            thresholdCharsPerSecond: this.minimumThresholdCharsPerSecond
          };
        }
        this.recordChars(byteLength, now);
        const eventLoopUnderPressure = this.getEventLoopPressureTracker().isUnderPressure();
        const charsInWindow = this.getCharsInWindow(now);
        const charsPerSecond = this.getAverageCharsPerSecond(now);
        const peakBucketCharsPerSecond = this.getPeakBucketCharsPerSecond(now);
        const withoutPressureRate = Math.max(charsPerSecond, peakBucketCharsPerSecond);
        const meetsMinVolume = charsInWindow >= this.minChars;
        const suppressWithoutPressure = meetsMinVolume && withoutPressureRate >= this.thresholdCharsPerSecondWithoutPressure;
        const suppressWithPressure = meetsMinVolume && eventLoopUnderPressure && charsPerSecond >= this.minimumThresholdCharsPerSecond;
        const triggeredThresholdCharsPerSecond = suppressWithoutPressure ? this.thresholdCharsPerSecondWithoutPressure : eventLoopUnderPressure ? this.minimumThresholdCharsPerSecond : this.thresholdCharsPerSecondWithoutPressure;
        const reportedCharsPerSecond = suppressWithoutPressure ? withoutPressureRate : charsPerSecond;
        if (!this.outputSuppressed && (suppressWithoutPressure || suppressWithPressure)) {
          this.outputSuppressed = true;
        }
        const noticeJustTriggered = this.outputSuppressed && !this.noticeSent;
        if (noticeJustTriggered) {
          this.noticeSent = true;
          console.warn("[OutputSuppressionController] Suppressing shell output:", formatSuppressionReason({
            charsInWindow,
            charsPerSecond: reportedCharsPerSecond,
            minChars: this.minChars,
            triggeredThresholdCharsPerSecond,
            suppressWithoutPressure,
            eventLoopPressureTracker: this.getEventLoopPressureTracker()
          }));
        }
        return {
          shouldForward: !this.outputSuppressed,
          noticeJustTriggered,
          charsPerSecond: reportedCharsPerSecond,
          thresholdCharsPerSecond: triggeredThresholdCharsPerSecond
        };
      }
      reset() {
        if (this.disposed) {
          return;
        }
        this.bucketChars.fill(0);
        this.bucketStarts.fill(0);
        this.totalChars = 0;
        this.outputSuppressed = false;
        this.noticeSent = false;
      }
      dispose() {
        if (this.disposed) {
          return;
        }
        this.disposed = true;
        this.eventLoopPressureTracker?.dispose();
        this.eventLoopPressureTracker = void 0;
      }
      getEventLoopPressureTracker() {
        if (this.eventLoopPressureTracker === void 0) {
          this.eventLoopPressureTracker = acquireEventLoopPressureTracker();
        }
        return this.eventLoopPressureTracker;
      }
      recordChars(chars, now) {
        this.prune(now);
        if (chars <= 0)
          return;
        const bucketStart = Math.floor(now / BUCKET_MS) * BUCKET_MS;
        const bucketIndex = Math.floor(bucketStart / BUCKET_MS) % this.bucketChars.length;
        if (this.bucketStarts[bucketIndex] !== bucketStart) {
          this.totalChars -= this.bucketChars[bucketIndex];
          this.bucketStarts[bucketIndex] = bucketStart;
          this.bucketChars[bucketIndex] = 0;
        }
        this.bucketChars[bucketIndex] += chars;
        this.totalChars += chars;
      }
      getAverageCharsPerSecond(now) {
        this.prune(now);
        if (this.totalChars === 0)
          return 0;
        const cutoff = now - this.windowMs;
        let oldestBucketStart = now;
        for (let i = 0; i < this.bucketStarts.length; i++) {
          if (this.bucketChars[i] > 0 && this.bucketStarts[i] >= cutoff) {
            oldestBucketStart = Math.min(oldestBucketStart, this.bucketStarts[i]);
          }
        }
        const elapsedMs3 = Math.max(BUCKET_MS, Math.min(this.windowMs, now - oldestBucketStart + BUCKET_MS));
        return this.totalChars / (elapsedMs3 / 1e3);
      }
      getPeakBucketCharsPerSecond(now) {
        this.prune(now);
        const cutoff = now - this.windowMs;
        let peak = 0;
        for (let i = 0; i < this.bucketChars.length; i++) {
          if (this.bucketStarts[i] >= cutoff) {
            peak = Math.max(peak, this.bucketChars[i]);
          }
        }
        return peak / (BUCKET_MS / 1e3);
      }
      getCharsInWindow(now) {
        this.prune(now);
        return this.totalChars;
      }
      prune(now) {
        const cutoff = now - this.windowMs;
        for (let i = 0; i < this.bucketStarts.length; i++) {
          if (this.bucketStarts[i] !== 0 && this.bucketStarts[i] < cutoff) {
            this.totalChars -= this.bucketChars[i];
            this.bucketStarts[i] = 0;
            this.bucketChars[i] = 0;
          }
        }
      }
    };
  }
});
