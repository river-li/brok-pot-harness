var settingsExtension = defineHostExtension({
  id: "settings",
  dependencies: [],
  start: () => new SettingsService()
});
