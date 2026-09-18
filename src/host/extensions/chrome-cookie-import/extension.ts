var chromeCookieImportExtension = defineHostExtension({
  id: "chrome-cookie-import",
  dependencies: [HostExtensions.Experiments],
  start: (context2) => {
    const importer = createChromeCookieImporter({
      isEnabled: () => context2.deps["experiments"].checkFeatureGate("sand_import_chrome_cookies", {
        disableExposureLog: true
      }),
      writeBatchFile: writeCookieBatchToTmp,
      runImportScript: runCookieImportScript,
      removeBatchFile: removeCookieBatchDir,
      log: (message) => context2.host.log(message)
    });
    return {
      inject: (cookies) => importer.inject(cookies)
    };
  }
});
