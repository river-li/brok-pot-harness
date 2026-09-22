/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/channel-delivery-unregistered-error.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandChannelDeliveryUnregisteredError = class extends SandDomainError {
  name = "SandChannelDeliveryUnregisteredError";
  constructor() {
    super("No channel delivery mechanism is registered.");
  }
};

