function resolvePollIntervalMs(watchIntervalMsRaw) {
  const raw = Number.parseInt(watchIntervalMsRaw ?? "", 10);
  return Number.isInteger(raw) && raw > 0 ? raw : MANAGED_SETUP_POLL_INTERVAL_MS;
}
function startManagedSetupWhenAuthenticated(options2) {
  let started2 = false;
  let disposed = false;
  const start = () => {
    if (started2 || disposed) return;
    started2 = true;
    options2.startManagedSetup();
    options2.startManagedSkills();
  };
  const handleRenewal = (event) => {
    if (disposed || event.outcome !== "renewed") return;
    if (!started2) {
      if (options2.auth.peekAccessToken() !== null) start();
      return;
    }
    if (event.isFirstCredential) options2.refreshManagedSkills();
  };
  const unsubscribe = options2.auth.subscribeToRenewal(handleRenewal);
  if (options2.auth.peekAccessToken() !== null) start();
  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe();
  };
}
function startManagedSetup(context2, createTeamRulesResolver = createSandTeamRulesResolver) {
  const auth2 = context2.deps.auth;
  const settings = context2.deps.settings;
  const { backend } = context2.host.environment;
  const client = new SandManagedSetupClient(
    createSandCursorBackendClient(GrokBotService, {
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    }),
    context2.host.environment.auth.boxIdentityCredential.length > 0
  );
  const service = new ManagedSetupService({
    client,
    isInBox: context2.host.environment.inBox,
    retry: createRetryPolicy({
      name: "sand-managed-setup-startup",
      maxAttempts: 3,
      initialDelayMs: MANAGED_SETUP_RETRY_INITIAL_DELAY_MS,
      maxDelayMs: MANAGED_SETUP_RETRY_MAX_DELAY_MS,
      backoffFactor: 4
    }),
    polling: createPollingPolicy2({
      name: "sand-managed-setup-refresh",
      intervalMs: resolvePollIntervalMs(context2.host.environment.boxUpdateWatchIntervalMsRaw)
    }),
    log: (message) => context2.host.log(message)
  });
  const reportDiagnostic = (diagnostic) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic(diagnostic);
  const managedSkills = new SandManagedSkillsService({
    getCacheDir: () => getManagedSkillsDir(getSandRootDir()),
    fetch: () => fetchSandManagedSkills({
      backend,
      getAccessToken: auth2.getBestEffortAccessToken,
      getMachineId: auth2.getMachineId
    }),
    report: reportDiagnostic
  });
  const stopCredentialStartup = startManagedSetupWhenAuthenticated({
    auth: auth2,
    startManagedSetup: () => service.start(),
    startManagedSkills: () => managedSkills.start(),
    refreshManagedSkills: () => managedSkills.handleAuthChange()
  });
  const teamRules = createTeamRulesResolver({
    backend,
    getAccessToken: auth2.getAccessToken,
    getTeamId: auth2.getTeamId,
    getMachineId: auth2.getMachineId,
    getSelectedTeamId: () => auth2.getTeamId(),
    report: reportDiagnostic
  });
  const handleTeamRulesRenewal = (event) => {
    if (event?.outcome === "renewed" && event.isFirstCredential) {
      teamRules.refresh();
    }
  };
  const unsubscribeTeamRulesRenewal = auth2.subscribeToRenewal(handleTeamRulesRenewal);
  const unsubscribeTeamRulesSelectedTeam = settings.subscribeToChanges((event) => {
    if (event.fields.includes("selectedTeamId")) {
      teamRules.refresh();
    }
  });
  const dispose = () => {
    unsubscribeTeamRulesRenewal();
    unsubscribeTeamRulesSelectedTeam();
    stopCredentialStartup();
    service.dispose();
    managedSkills.dispose();
  };
  context2.onStop(dispose);
  handleTeamRulesRenewal(auth2.getLastRenewalEvent());
  teamRules.start();
  return {
    dispose,
    skillsCatalog: () => fetchSkillCatalog(
      backend,
      auth2.getBestEffortAccessToken,
      auth2.getMachineId,
      reportDiagnostic
    ),
    ensureManagedSkill: (id) => managedSkills.ensureSkill(id),
    resolveTeamRules: () => teamRules.resolveRules()
  };
}
var managedSetupExtension = defineHostExtension({
  id: "managed-setup",
  dependencies: [HostExtensions.Auth, HostExtensions.Settings, HostExtensions.Telemetry],
  start: startManagedSetup
});
