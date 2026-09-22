/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/x11-executor.js
 * Bundle: sand-host/host-main.cjs
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

