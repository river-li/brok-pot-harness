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
          } catch (error41) {
            if (error41 instanceof ConnectError && error41.code === Code.Unimplemented) {
              return "legacy";
            }
            throw error41;
          }
        }, args.signal);
      } catch (error41) {
        enabled = false;
        throw error41;
      }
    }
  };
}
