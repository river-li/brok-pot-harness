function createHostEvents(options2) {
  const handlers = /* @__PURE__ */ new Map();
  return {
    async emit(topic, payload, emitOptions) {
      const subscribed = handlers.get(topic);
      if (subscribed == null || subscribed.size === 0) return;
      const settled = await Promise.allSettled(
        [...subscribed].map(
          async (handler) => handler(payload)
        )
      );
      let firstFailure;
      for (const outcome of settled) {
        if (outcome.status === "rejected") {
          options2.onHandlerFailure(topic, outcome.reason);
          if (emitOptions?.failureMode === "reject") {
            firstFailure ??= { error: outcome.reason };
          }
        }
      }
      if (firstFailure !== void 0) {
        throw firstFailure.error;
      }
    },
    on(topic, handler) {
      const subscribed = handlers.get(topic) ?? /* @__PURE__ */ new Set();
      subscribed.add(handler);
      handlers.set(topic, subscribed);
      return () => {
        subscribed.delete(handler);
      };
    }
  };
}
