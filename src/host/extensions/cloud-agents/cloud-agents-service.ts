function originUrlsOf(backend) {
  const api = backend.originBackendUrl;
  const parsedApi = new URL(api);
  const gitHost = originGitHostFromBackendUrl(api) ?? parsedApi.host;
  return { api: parsedApi.toString(), git: `${parsedApi.protocol}//${gitHost}` };
}
var NO_BOX = {
  uploadFile: () => Promise.reject(new Error("cloud agent artifacts: no box attached"))
};
var SandCloudAgentManager = class {
  constructor(options2) {
    this.options = options2;
    this.originUrls = originUrlsOf(options2.backend);
    this.backend = createCloudAgentsClient({
      getClient: () => this.getClient(),
      getDashboardClient: () => this.getDashboardClient(),
      prepareNewRepo: () => this.prepareNewRepo()
    });
    this.completionPoller = new CloudAgentCompletionPoller(options2, () => this.getClient());
    this.modelCatalog = new CloudAgentModelCatalogCache(options2);
    this.artifacts = new CloudAgentArtifactCache({
      api: this,
      box: options2.artifacts?.box ?? NO_BOX,
      isEnabled: options2.artifacts?.isEnabled ?? (() => false),
      ...options2.artifacts?.isBoxFilePresent === void 0 ? {} : { isBoxFilePresent: options2.artifacts.isBoxFilePresent }
    });
    const updates = options2.updates;
    this.updatesStream = updates === void 0 ? null : new CloudAgentUpdatesStream({
      getClient: () => this.getClient(),
      isEnabled: () => this.updateConsumers > 0 && !this.isDisabledByTeamAdmin() && updates.isEnabled(),
      clock: options2.clock,
      onEvent: (event) => {
        for (const listener of [...this.updateListeners]) listener(event);
      },
      ...options2.randomFn === void 0 ? {} : { randomFn: options2.randomFn }
    });
  }
  options;
  launchedIds = /* @__PURE__ */ new Set();
  canvasCursorAgentIds = /* @__PURE__ */ new Set();
  hiddenCursorAgentCardIds = /* @__PURE__ */ new Set();
  client;
  dashboardClient;
  grokBotClient;
  originClient;
  pendingNewProject;
  originUrls;
  backend;
  completionPoller;
  modelCatalog;
  newRepoLaunches = new PromiseQueue({ max: 1 });
  updateListeners = /* @__PURE__ */ new Set();
  updatesStream;
  updateConsumers = 0;
  artifacts;
  updates = {
    subscribe: (listener) => {
      this.updateListeners.add(listener);
      this.updatesStream?.start();
      return () => {
        this.updateListeners.delete(listener);
      };
    },
    noteConsumers: (count) => {
      const hadConsumers = this.updateConsumers > 0;
      this.updateConsumers = count;
      if (count > 0 && !hadConsumers) this.updatesStream?.wake();
    }
  };
  isDisabledByTeamAdmin() {
    return this.options.isDisabledByTeamAdmin?.() ?? false;
  }
  dispose() {
    this.completionPoller.dispose();
    this.updatesStream?.dispose();
  }
  async listModels() {
    return await this.modelCatalog.listModels();
  }
  getClient() {
    if (this.options.clientForTesting != null) {
      return this.options.clientForTesting;
    }
    if (this.client == null) {
      this.client = createSandCursorBackendClient(BackgroundComposerService, {
        backend: this.options.backend,
        getAccessToken: this.options.getCursorAccessToken,
        getTeamId: this.options.getTeamId,
        getMachineId: this.options.getMachineId ?? missingMachineId,
        onRequestId: this.options.onRequestId
      });
    }
    return this.client;
  }
  getDashboardClient() {
    if (this.options.dashboardClientForTesting != null) {
      return this.options.dashboardClientForTesting;
    }
    if (this.dashboardClient == null) {
      this.dashboardClient = createSandCursorBackendClient(DashboardService, {
        backend: this.options.backend,
        getAccessToken: this.options.getCursorAccessToken,
        getTeamId: this.options.getTeamId,
        getMachineId: this.options.getMachineId ?? missingMachineId,
        onRequestId: this.options.onRequestId
      });
    }
    return this.dashboardClient;
  }
  getGrokBotClient() {
    if (this.options.grokBotClientForTesting != null) {
      return this.options.grokBotClientForTesting;
    }
    if (this.grokBotClient == null) {
      this.grokBotClient = createSandCursorBackendClient(GrokBotService, {
        backend: this.options.backend,
        getAccessToken: this.options.getCursorAccessToken,
        getTeamId: this.options.getTeamId,
        getMachineId: this.options.getMachineId ?? missingMachineId,
        onRequestId: this.options.onRequestId
      });
    }
    return this.grokBotClient;
  }
  getOriginClient() {
    if (this.options.originClientForTesting != null) {
      return this.options.originClientForTesting;
    }
    if (this.originClient == null) {
      const authBackendUrl = this.options.backend.backendUrl;
      const createClient2 = this.options.createOriginClient ?? createSandCursorBackendClient;
      this.originClient = createClient2(OriginService, {
        backend: sandBackendIdentityAt(this.options.backend, this.originUrls.api),
        getAccessToken: () => this.options.getCursorAccessToken({ backendUrl: authBackendUrl }),
        getTeamId: this.options.getTeamId,
        getMachineId: this.options.getMachineId ?? missingMachineId,
        onRequestId: this.options.onRequestId
      });
    }
    return this.originClient;
  }
  async prepareNewRepo() {
    const originClient = this.getOriginClient();
    let project2 = this.pendingNewProject;
    if (project2 == null) {
      const teamId = (await this.getDashboardClient().getMe(new GetMeRequest())).teamId;
      const teamHeaders = teamId == null || teamId <= 0 ? void 0 : { "x-cursor-team-id": teamId.toString() };
      const namespaces = await originClient.getAuthorizedNamespaces(
        new GetAuthorizedNamespacesRequest(),
        teamHeaders == null ? void 0 : { headers: teamHeaders }
      );
      if (namespaces.originDisabledForTeam) {
        throw new SandCloudAgentLaunchError(
          "New Origin projects are not enabled for this account."
        );
      }
      const namespaceEntry = namespaces.namespaces.find(
        (entry) => entry.namespace?.ownerType === OriginNamespaceOwnerType.TEAM && entry.namespace.namespace.trim().length > 0 && entry.accessReason === AuthorizedNamespaceAccessReason.TEAM_OWNERSHIP
      ) ?? namespaces.namespaces.find(
        (entry) => entry.namespace?.ownerType === OriginNamespaceOwnerType.USER && entry.namespace.namespace.trim().length > 0 && entry.accessReason === AuthorizedNamespaceAccessReason.USER_OWNERSHIP
      );
      const namespace = namespaceEntry?.namespace?.namespace.trim() ?? "";
      if (namespace.length === 0) {
        throw new SandCloudAgentLaunchError(
          "Create an Origin namespace before starting a new project: https://cursor.com/codebase/get-started"
        );
      }
      const namespaceTeamId = namespaceEntry?.namespace?.ownerType === OriginNamespaceOwnerType.TEAM && namespaceEntry.namespace.ownerEntityId > BigInt(0) ? namespaceEntry.namespace.ownerEntityId.toString() : void 0;
      const originCallOptions2 = namespaceTeamId == null ? void 0 : { headers: { "x-cursor-team-id": namespaceTeamId } };
      const response = await originClient.createRepoAndEnsureUserNamespace(
        new CreateRepoRequest({
          identifier: { org: namespace, name: "new-project" },
          repoKind: RepoKind.AGENT_TEMP,
          visibility: RepoVisibility.PRIVATE,
          defaultBranch: "main"
        }),
        originCallOptions2
      ).catch((error42) => {
        if (error42 instanceof ConnectError && error42.code === Code.FailedPrecondition) {
          throw new SandCloudAgentLaunchError(
            "Origin can't create a new project for this account. Check your plan, Privacy Mode, and team Origin settings, then try again: https://cursor.com/codebase/get-started",
            { cause: error42 }
          );
        }
        throw error42;
      });
      const defaultBranch = response.repository?.defaultBranch.trim() || "main";
      const org = response.repository?.identifier?.org.trim() ?? "";
      const name17 = response.repository?.identifier?.name.trim() ?? "";
      if (org.length === 0 || name17.length === 0) {
        throw new SandCloudAgentLaunchError(
          "Origin created the project but did not return its repository."
        );
      }
      project2 = {
        org,
        name: name17,
        defaultBranch,
        teamId: namespaceTeamId,
        seeded: false
      };
      this.pendingNewProject = project2;
    }
    const originCallOptions = project2.teamId == null ? void 0 : { headers: { "x-cursor-team-id": project2.teamId } };
    if (!project2.seeded) {
      await originClient.createCommitFromFiles(
        new CreateCommitFromFilesClientRequest({
          identifier: { org: project2.org, name: project2.name },
          branch: project2.defaultBranch,
          expectedHeadSha: "0".repeat(40),
          message: "Initialize project",
          author: new Signature({
            name: "Cursor",
            email: "noreply@cursor.com",
            timestamp: BigInt(Math.floor(Date.now() / 1e3)),
            timezoneOffset: -(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60
          }),
          files: [
            new CommitFileOperation({
              path: "README.md",
              operation: {
                case: "upsert",
                value: new CommitFileUpsert({
                  content: new TextEncoder().encode(
                    "# New project\n\nThis project was created by a Cursor cloud agent.\n"
                  )
                })
              }
            })
          ]
        }),
        originCallOptions
      );
      project2.seeded = true;
    }
    const preparedProject = project2;
    return {
      repoUrl: `${this.originUrls.git}${originRepoClonePath({
        owner: preparedProject.org,
        name: preparedProject.name
      })}.git`,
      startingRef: preparedProject.defaultBranch,
      markLaunched: () => {
        if (this.pendingNewProject === preparedProject) {
          this.pendingNewProject = void 0;
        }
      }
    };
  }
  async launch(args) {
    if (args.newRepo === true) {
      return await this.newRepoLaunches.enqueue(() => this.backend.launch(args));
    }
    return await this.backend.launch(args);
  }
  async awaitCompletion(bcId, options2) {
    return await this.completionPoller.awaitCompletion(bcId, options2);
  }
  async list(args) {
    return await this.backend.list(args);
  }
  async listRecentActivity(limit) {
    return await this.backend.listRecentActivity(limit);
  }
  async listRepositories(args) {
    return await this.backend.listRepositories(args);
  }
  async get(bcId) {
    return await this.backend.get(bcId);
  }
  async reply(args) {
    return await this.backend.reply(args);
  }
  async cancel(bcId) {
    await this.backend.cancel(bcId);
  }
  async rename(bcId, newName) {
    await this.backend.rename(bcId, newName);
  }
  async setArchived(bcId, archived) {
    await this.backend.setArchived(bcId, archived);
  }
  async delete(bcId) {
    await this.backend.delete(bcId);
  }
  async listArtifacts(bcId) {
    return await this.backend.listArtifacts(bcId);
  }
  async getArtifactBytes(args) {
    return await this.backend.getArtifactBytes(args);
  }
  async getTranscriptDump(args) {
    return await this.backend.getTranscriptDump(args);
  }
  async getConversation(args) {
    if (this.options.isConversationEnabled?.() !== true) {
      return { kind: "off" };
    }
    return await this.backend.getConversation(args);
  }
  async getInfo(bcId, options2) {
    return await this.backend.getInfo(bcId, options2);
  }
  async getWatch(bcId) {
    return await readCloudAgentWatch(
      { composer: this.getClient(), grokBot: this.getGrokBotClient() },
      bcId
    );
  }
};
