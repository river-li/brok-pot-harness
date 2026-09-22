/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/remote-agent-messaging/remote-agent-messaging-capabilities.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm2();
function createRemoteAgentMessagingCapabilities(args) {
  let enabled = false;
  return {
    isEnabled: () => enabled === "legacy" ? args.legacy() : enabled,
    refresh: async () => {
      try {
        enabled = await args.deadline.run(async (signal) => {
          try {
            const response = await args.client.getGrokBotRuntimeCapabilities({}, { signal });
            return response.capabilities?.agentMessagingEnabled ?? "legacy";
          } catch (error42) {
            if (error42 instanceof ConnectError && error42.code === Code.Unimplemented) {
              return "legacy";
            }
            throw error42;
          }
        }, args.signal);
      } catch (error42) {
        enabled = false;
        throw error42;
      }
    }
  };
}

