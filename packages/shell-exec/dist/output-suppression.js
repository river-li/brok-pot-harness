/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/output-suppression.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SHELL_OUTPUT_SUPPRESSION_DEFAULTS;
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
  }
});

