/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/glass-perf-vote-config.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GLASS_PERF_VOTE_CONFIG_DEFAULTS;
var init_glass_perf_vote_config = __esm({
  "../packages/constants/dist/glass-perf-vote-config.js"() {
    "use strict";
    GLASS_PERF_VOTE_CONFIG_DEFAULTS = {
      /** Shows the widget; flipped on for internal users during a vote window. */
      enabled: false,
      /** Tag left of the dots; rendered uppercase. */
      tagLabel: "Perf vibe check",
      yellowTooltip: "Report slow perf experience",
      redTooltip: "Report disruptive perf experience",
      /** Note popover titles per severity. */
      yellowTitle: "Slow perf",
      redTitle: "Disruptive perf",
      noteSubtitle: "Add a note? (optional)",
      notePlaceholder: "What happened? e.g. switching chats took ~5s"
    };
  }
});

