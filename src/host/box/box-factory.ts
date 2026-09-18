function createSandBox(options2 = {}) {
  return new LoopbackSandBox({
    telemetry: options2.telemetry,
    protectedBoxPaths: options2.protectedBoxPaths,
    cursorDataDir: options2.cursorDataDir
  });
}
function formatSandBoxStartupSummary(args) {
  return `[sand-host] agent box backend: loopback (in-box); image: host's own container; auto-update: ${args.autoUpdateEnabled ? "on" : "off"}; build: ${args.isPackaged ? "packaged" : "dev"}`;
}
function applySharedDesktop(box, options2 = {}) {
  if (!boxSupportsMultiWindow(box)) return box;
  return new SharedDesktopSandBox(box, options2);
}
