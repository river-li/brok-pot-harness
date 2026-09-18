init_esm2();
async function readAgentIdentityCapabilities(args) {
  const capabilities = await args.deadline.run(async (signal) => {
    try {
      return (await args.client.getGrokBotRuntimeCapabilities({}, { signal })).capabilities;
    } catch (error41) {
      if (error41 instanceof ConnectError && error41.code === Code.Unimplemented) return void 0;
      throw error41;
    }
  }, args.signal);
  const resolved = capabilities ?? args.legacy();
  return {
    isLegacy: capabilities === void 0,
    durableIdentityEnabled: resolved.durableIdentityEnabled,
    durableIdentityWritesEnabled: resolved.durableIdentityWritesEnabled,
    temporalCreationEnabled: resolved.temporalCreationEnabled
  };
}
