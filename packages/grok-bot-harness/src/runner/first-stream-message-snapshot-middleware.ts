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
