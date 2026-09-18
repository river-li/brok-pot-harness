init_errors();
var SandChannelDeliveryUnregisteredError = class extends SandDomainError {
  name = "SandChannelDeliveryUnregisteredError";
  constructor() {
    super("No channel delivery mechanism is registered.");
  }
};
