function appendHookAdditionalContexts(collector, contexts) {
  if (collector !== void 0 && contexts.length > 0) {
    collector.push(...contexts);
  }
}
