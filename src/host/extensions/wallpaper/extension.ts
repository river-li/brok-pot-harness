var wallpaperExtension = defineHostExtension({
  id: "wallpaper",
  dependencies: [HostExtensions.Settings],
  start: (context2) => {
    const settings = context2.deps[HostExtensions.Settings];
    const commands = createBoxWallpaperCommands({
      settingsPath: settings.getSettingsPath(),
      log: context2.host.log
    });
    if (!commands.isAvailable) return { isEnabled: false };
    const scheduler = new WallpaperToneScheduler({
      clock: realClock,
      resolvePlan: () => commands.resolvePlan(),
      paint: () => commands.paint(),
      subscribeToTimeZoneChange: (listener) => settings.subscribeToUserTimeZone(() => listener()),
      log: context2.host.log
    });
    context2.onStop(() => scheduler.dispose());
    scheduler.start();
    return { isEnabled: true };
  }
});
