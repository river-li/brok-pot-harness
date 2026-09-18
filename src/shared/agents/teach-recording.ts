var SAND_TEACH_ENTRY_POINTS = [
  "screen_hover",
  "composer_menu",
  "fullscreen_title_bar"
];
var SAND_TEACH_MAX_DURATION_MS = 10 * 60 * 1e3;
var IDLE_TEACH_RECORDING_STATUS = {
  state: "idle",
  agentId: null,
  startedAtMs: null,
  maxDurationMs: SAND_TEACH_MAX_DURATION_MS
};
