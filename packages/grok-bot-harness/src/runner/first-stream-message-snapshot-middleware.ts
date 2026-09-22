/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/first-stream-message-snapshot-middleware.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var FirstStreamMessageSnapshotMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, capture) {
    super(innerExecutor);
    this.capture = capture;
  }
  capture;
  captured = false;
  stream(ctx, invocationId, tools, options2) {
    if (!this.captured) {
      this.captured = true;
      this.capture(this.innerExecutor.getMessages());
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createFirstStreamMessageSnapshotMiddleware(capture) {
  return (executor) => new FirstStreamMessageSnapshotMiddleware(executor, capture);
}

