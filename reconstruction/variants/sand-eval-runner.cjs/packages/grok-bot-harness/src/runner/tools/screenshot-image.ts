/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/screenshot-image.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_buffer8 = require("node:buffer");
async function shrinkImageForModel(ctx, bytes, options2) {
  const bounded = await boundInlineImageForModel(ctx, bytes, options2);
  return {
    data: import_node_buffer8.Buffer.from(bounded.data).toString("base64"),
    mimeType: bounded.mimeType
  };
}

