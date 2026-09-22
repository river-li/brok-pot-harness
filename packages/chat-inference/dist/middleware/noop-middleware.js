/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/middleware/noop-middleware.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NoopMiddleware = class extends BaseMiddleware {
};
var createNoopMiddleware = () => {
  return (executor) => new NoopMiddleware(executor);
};
var noopMiddleware = createNoopMiddleware();

