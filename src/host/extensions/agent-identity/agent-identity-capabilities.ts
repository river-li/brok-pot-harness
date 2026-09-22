/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/agent-identity/agent-identity-capabilities.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm2();
async function readAgentIdentityCapabilities(args) {
  const capabilities = await args.deadline.run(async (signal) => {
    try {
      return (await args.client.getGrokBotRuntimeCapabilities({}, { signal })).capabilities;
    } catch (error42) {
      if (error42 instanceof ConnectError && error42.code === Code.Unimplemented) return void 0;
      throw error42;
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

