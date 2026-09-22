/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/trays/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

