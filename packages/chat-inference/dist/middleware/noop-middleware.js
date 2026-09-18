var NoopMiddleware = class extends BaseMiddleware {
};
var createNoopMiddleware = () => {
  return (executor) => new NoopMiddleware(executor);
};
var noopMiddleware = createNoopMiddleware();
