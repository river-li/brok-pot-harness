/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-timezone/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var boxTimezoneExtension = defineHostExtension({
  id: "box-timezone",
  dependencies: [HostExtensions.Settings],
  start: (context2) => {
    const settings = context2.deps[HostExtensions.Settings];
    const applyZone = createBoxTimezoneApplier({ log: context2.host.log });
    if (applyZone === void 0) return { isEnabled: false };
    const service = createBoxTimezoneService({
      getUserTimeZone: () => settings.getUserTimeZone(),
      subscribeToUserTimeZone: (listener) => settings.subscribeToUserTimeZone(listener),
      applyZone,
      log: context2.host.log
    });
    context2.onStop(() => service.dispose());
    service.start();
    return { isEnabled: true };
  }
});

