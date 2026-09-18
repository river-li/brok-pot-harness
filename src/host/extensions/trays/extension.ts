var traysExtension = defineHostExtension({
  id: "trays",
  dependencies: [],
  start: () => {
    const trays = new TrayManager();
    return {
      list: () => trays.getTrays(),
      dismiss: ({ id }) => {
        trays.dismiss(id);
      },
      clearAll: () => trays.clearAll(),
      subscribe: (listener) => trays.subscribe(listener),
      pushError: (options2) => trays.pushError(options2),
      clearForAgent: (agentId) => trays.clearForAgent(agentId)
    };
  }
});
