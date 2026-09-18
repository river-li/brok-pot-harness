init_errors();
init_invariant();
init_cursor_inference();
init_cursor_token();
function dashboardIntegrationsUrl(backend) {
  return `${dashboardUrlOf(() => backend.backendUrl)}/dashboard?tab=integrations`;
}
var GITHUB_CONNECT_VERIFIER_BYTES = 32;
var MAX_PENDING_GITHUB_FLOWS = 4;
function scmConnectPlatformForState(state) {
  const provider = /^cursor_grok_bot_([a-z_]+)_v1\./.exec(state)?.[1]?.replace("_", "-");
  return provider === "gitlab" || provider === "bitbucket" || provider === "azure-devops" ? provider : "github";
}
function createListenerIntegrationReads(deps) {
  const dashboard = () => createSandCursorBackendClient(DashboardService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
  const readPlatformConnection = async (platform2) => {
    if (platform2 === "origin") return { connected: true };
    const client = dashboard();
    if (platform2 === "slack") {
      const response2 = await client.getSlackUserSettings(new GetSlackUserSettingsRequest({}));
      return { connected: response2.hasSlackAuth === true };
    }
    const gheApplication = SCM_PROVIDER_GHE_APPLICATION_UUID[platform2];
    const response = await client.getScmConnectionStatus(
      new GetScmConnectionStatusRequest(gheApplication == null ? {} : { gheApplication })
    );
    return {
      connected: response.connected === true,
      ...response.connectedAtMs === void 0 ? {} : { connectedAtMs: Number(response.connectedAtMs) }
    };
  };
  const isPlatformConnected = async (platform2) => (await readPlatformConnection(platform2)).connected;
  const verifierByMintedState = /* @__PURE__ */ new Map();
  const mintScmConnectFlow = async (fields2) => {
    const verifier = (0, import_node_crypto42.randomBytes)(GITHUB_CONNECT_VERIFIER_BYTES).toString("base64url");
    const response = await dashboard().prepareGithubConnectFlow(
      new PrepareGithubConnectFlowRequest({
        ...fields2,
        githubRepo: "",
        source: PrepareGithubConnectFlowRequest_Source.GROK_BOT,
        verifierHash: (0, import_node_crypto42.createHash)("sha256").update(verifier).digest("hex")
      })
    );
    invariant(
      response.state.length > 0 && response.githubUrl.length > 0,
      "prepareGithubConnectFlow returned no state or url"
    );
    verifierByMintedState.set(response.state, verifier);
    while (verifierByMintedState.size > MAX_PENDING_GITHUB_FLOWS) {
      const oldest = verifierByMintedState.keys().next().value;
      if (oldest === void 0) break;
      verifierByMintedState.delete(oldest);
    }
    return response.githubUrl;
  };
  const readScmConnections = async (providers) => {
    if (providers.length === 0) return /* @__PURE__ */ new Map();
    const gheApplicationOf = (provider) => SCM_PROVIDER_GHE_APPLICATION_UUID[provider] ?? "";
    const response = await dashboard().getScmConnectionStatuses(
      new GetScmConnectionStatusesRequest({
        gheApplications: [...new Set(providers.map(gheApplicationOf))]
      })
    );
    const byApplication = new Map(
      response.statuses.map((status) => [status.gheApplication, status])
    );
    return new Map(
      providers.map((provider) => {
        const status = byApplication.get(gheApplicationOf(provider));
        if (status == null || status.failed) {
          deps.log(
            `${provider} connection read degraded to disconnected: ${status == null ? "missing from batch" : "provider probe failed"}`
          );
          return [provider, { connected: false }];
        }
        return [
          provider,
          {
            connected: status.connected,
            ...status.connectedAtMs === void 0 ? {} : { connectedAtMs: Number(status.connectedAtMs) }
          }
        ];
      })
    );
  };
  return {
    isPlatformConnected,
    async getIntegrations() {
      const statuses = deps.sourceStatuses();
      const counts = countListenerPlatforms(
        (await deps.transcript.listAllAutomationDefinitions()).map((entry) => entry.automation)
      );
      const readConnected = (platform2) => readPlatformConnection(platform2).catch((error41) => {
        deps.log(`${platform2} connection read degraded to disconnected: ${errorLogTag(error41)}`);
        return { connected: false };
      });
      const neededCounts = counts;
      const cardPlatforms = [
        ...LISTENER_INTEGRATIONS.map((manifest) => manifest.platform),
        ...SCM_CONNECT_CARD_INTEGRATIONS.map((manifest) => manifest.platform)
      ];
      const desktopScmConnect = deps.isDesktopScmConnectEnabled();
      const scmProviders = desktopScmConnect ? cardPlatforms.filter(isScmConnectProvider) : [];
      const scmConnections = await readScmConnections(scmProviders).catch(
        async (error41) => {
          if (!isUnimplementedConnectError(error41)) {
            deps.log(`batched SCM connection read failed: ${errorLogTag(error41)}`);
          }
          const fallback2 = await Promise.all(scmProviders.map(readConnected));
          return new Map(scmProviders.map((provider, index) => [provider, fallback2[index]]));
        }
      );
      const connections = await Promise.all(
        cardPlatforms.map(
          (platform2) => desktopScmConnect && isScmConnectProvider(platform2) ? scmConnections.get(platform2) ?? { connected: false } : readConnected(platform2)
        )
      );
      const integrations = cardPlatforms.map((platform2, index) => {
        const status = statuses.get(platform2);
        const connection = connections[index];
        return {
          platform: platform2,
          isConnected: connection?.connected === true,
          ...!desktopScmConnect || connection?.connectedAtMs === void 0 ? {} : { connectedAtMs: connection.connectedAtMs },
          state: status?.state ?? "idle",
          ...status?.detail != null ? { detail: status.detail } : {},
          ...status?.scopeIssues != null && status.scopeIssues.length > 0 ? { scopeIssues: status.scopeIssues } : {},
          neededByCount: neededCounts[platform2] ?? 0
        };
      });
      return { integrations };
    },
    async getConnectUrl(platform2, options2) {
      const forceOauth = options2?.forceOauth === true;
      if (platform2 === "github") {
        return await mintScmConnectFlow({
          forceOauth,
          grokBotCallbackUrl: options2?.oauthRedirectUri
        });
      }
      if (platform2 === "gitlab" || platform2 === "bitbucket" || platform2 === "azure-devops") {
        return await mintScmConnectFlow({
          forceOauth,
          gheApplication: SCM_PROVIDER_GHE_APPLICATION_UUID[platform2]
        });
      }
      if (platform2 !== "slack") return dashboardIntegrationsUrl(deps.backend);
      try {
        const response = await dashboard().getSlackInstallUrl(
          new GetSlackInstallUrlRequest({ grokBotCallbackUrl: options2?.oauthRedirectUri })
        );
        return response.url.length > 0 ? response.url : dashboardIntegrationsUrl(deps.backend);
      } catch {
        return dashboardIntegrationsUrl(deps.backend);
      }
    },
    async disconnectPlatform(platform2) {
      const gheApplication = platform2 === "gitlab" || platform2 === "bitbucket" || platform2 === "azure-devops" ? SCM_PROVIDER_GHE_APPLICATION_UUID[platform2] : void 0;
      invariant(
        platform2 === "github" || gheApplication !== void 0,
        `${platform2} has no source-control connection to disconnect`
      );
      await dashboard().disconnectGithub(
        new DisconnectGithubRequest({
          userOnly: true,
          ...gheApplication === void 0 ? {} : { gheApplication }
        })
      );
    },
    async completeGithubConnect(args) {
      const verifier = verifierByMintedState.get(args.state);
      if (verifier === void 0) return { outcome: "stale" };
      if (args.error != null) {
        verifierByMintedState.delete(args.state);
        deps.log(`scm pkce connect callback carried error=${args.error}`);
        return { outcome: "failed" };
      }
      let response;
      try {
        response = await dashboard().completeGithubConnectFlow(
          new CompleteGithubConnectFlowRequest({
            state: args.state,
            verifier,
            code: args.code ?? "",
            installationId: args.installationId ?? "",
            setupAction: args.setupAction ?? ""
          })
        );
      } catch (error41) {
        deps.log(`scm pkce connect complete failed: ${errorLogTag(error41)}`);
        return { outcome: "failed" };
      }
      verifierByMintedState.delete(args.state);
      switch (response.outcome) {
        case CompleteGithubConnectFlowResponse_Outcome.CONNECTED:
          return { outcome: "connected" };
        case CompleteGithubConnectFlowResponse_Outcome.PENDING_APPROVAL:
          return { outcome: "pending_approval" };
        default:
          return { outcome: "failed" };
      }
    },
    async getAgentChannels(agentId) {
      const connections = await deps.transcript.getAgentChannels(agentId);
      const knownPlatforms = new Set(CONNECTOR_MANIFESTS.map((manifest) => manifest.platform));
      return {
        manifests: CONNECTOR_MANIFESTS,
        connections: connections.filter((connection) => knownPlatforms.has(connection.platform))
      };
    }
  };
}
