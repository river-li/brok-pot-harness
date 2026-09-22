/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/cloud-agent-canvas-prompt.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CANVAS_SCRATCH_LAUNCH_PREAMBLE = [
  "This is a Cursor canvas, not a software project. The git checkout is empty scratch. Do not list it, search it, read README or AGENTS.md, browse the web, install packages, or create a project, app, or PR.",
  `Write ${CANVAS_SOURCE_PATH_TEMPLATE} immediately from the brief below. Follow the canvas skill for the write path and exact SDK types. Do no other exploration.`
].join("\n\n");
var CANVAS_SCRATCH_LAUNCH_CLOSING = "End your final report with the canvas title and permanent source path, then stop.";
function composeCanvasScratchLaunchPrompt(prompt) {
  return `${CANVAS_SCRATCH_LAUNCH_PREAMBLE}

${prompt.trim()}

${CANVAS_SCRATCH_LAUNCH_CLOSING}`;
}

