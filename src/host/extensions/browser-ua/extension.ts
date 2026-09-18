var browserUaExtension = defineHostExtension({
  id: "browser-ua",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments],
  start: (context2) => {
    const auth2 = context2.deps.auth;
    const experiments = context2.deps.experiments;
    const stampUaOwner = createUaOwnerStampWriter({
      log: (message) => context2.host.log(message)
    });
    context2.onStop(
      auth2.subscribeToRenewal((event) => {
        if (event.outcome === "renewed") void stampUaOwner(auth2.peekAccessToken());
      })
    );
    if (auth2.peekAccessToken() !== null) void stampUaOwner(auth2.peekAccessToken());
    const reconcileKillSwitch = createUaTokenKillSwitchReconciler({
      isKillSwitchEnabled: () => experiments.isUaTokenKillSwitchEnabled(),
      log: (message) => context2.host.log(message)
    });
    const reconcileWebBotAuth = createWebBotAuthMarkerReconciler({
      isEnabled: () => experiments.isWebBotAuthSigningEnabled(),
      log: (message) => context2.host.log(message)
    });
    const reconcileWebBotAuthXhrFetch = createWebBotAuthMarkerReconciler({
      isEnabled: () => experiments.isWebBotAuthXhrFetchSigningEnabled(),
      log: (message) => context2.host.log(message),
      path: WEB_BOT_AUTH_XHR_FETCH_MARKER_PATH
    });
    const reconcileWebBotAuthIframes = createWebBotAuthMarkerReconciler({
      isEnabled: () => experiments.isWebBotAuthIframeSigningEnabled(),
      log: (message) => context2.host.log(message),
      path: WEB_BOT_AUTH_IFRAMES_MARKER_PATH
    });
    const reconcileFingerprintSpoof = createFingerprintSpoofReconciler({
      isEnabled: () => experiments.isBrowserFingerprintSpoofEnabled(),
      profileName: () => "windows",
      log: (message) => context2.host.log(message)
    });
    const reconcileEnableSpoofGpu = createWebBotAuthMarkerReconciler({
      isEnabled: () => experiments.isEnableSpoofGpuEnabled(),
      log: (message) => context2.host.log(message),
      path: ENABLE_SPOOF_GPU_MARKER_PATH
    });
    context2.onStop(
      experiments.subscribe(() => {
        void reconcileKillSwitch();
        void reconcileWebBotAuth();
        void reconcileWebBotAuthXhrFetch();
        void reconcileWebBotAuthIframes();
        void reconcileFingerprintSpoof();
        void reconcileEnableSpoofGpu();
      })
    );
    void reconcileKillSwitch();
    void reconcileWebBotAuth();
    void reconcileWebBotAuthXhrFetch();
    void reconcileWebBotAuthIframes();
    void reconcileFingerprintSpoof();
    void reconcileEnableSpoofGpu();
    return {};
  }
});
