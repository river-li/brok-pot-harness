init_grok_bot_pb();
var DISK_PRESSURE_LEVEL = {
  none: GrokBotBoxDiskPressureLevel.NONE,
  soft: GrokBotBoxDiskPressureLevel.SOFT,
  hard: GrokBotBoxDiskPressureLevel.HARD
};
var BoxLifecycleService = class {
  constructor(client) {
    this.client = client;
  }
  client;
  lastReportedHostState;
  inFlightHostState;
  async fetchImageUpdateAvailable(signal) {
    const response = await this.client.getSandBoxRunState({}, { signal });
    return response.imageUpdateAvailable;
  }
  async recreateInBox(options2) {
    const response = await this.client.recreateSandBox({
      preserveData: options2.preserveData,
      force: options2.force === true
    });
    return { started: response.started, reason: response.reason };
  }
  async reportHostState(state) {
    const key = JSON.stringify([state.diskPressure, state.hostVersion, state.hostUpdateAvailable]);
    if (key === this.lastReportedHostState || key === this.inFlightHostState) return;
    this.inFlightHostState = key;
    try {
      await this.client.reportSandBoxHostState({
        diskPressure: DISK_PRESSURE_LEVEL[state.diskPressure],
        hostVersion: state.hostVersion ?? void 0,
        hostUpdateAvailable: state.hostUpdateAvailable ?? void 0
      });
      this.lastReportedHostState = key;
    } finally {
      if (this.inFlightHostState === key) this.inFlightHostState = void 0;
    }
  }
};
