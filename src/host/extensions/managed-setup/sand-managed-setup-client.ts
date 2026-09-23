init_sand_team_converge();
init_sand_box_pb();
init_errors();
var SandManagedSetupClientError = class extends SandDomainError {
  name = "SandManagedSetupClientError";
};
var SandManagedSetupClient = class {
  constructor(client, includeTeamSecrets) {
    this.client = client;
    this.includeTeamSecrets = includeTeamSecrets;
  }
  client;
  includeTeamSecrets;
  async fetchSetupManifests() {
    const response = await this.client.listSandSetupManifests({
      includeTeamSecrets: this.includeTeamSecrets
    });
    if (response.schemaVersion !== SAND_SETUP_SCHEMA_VERSION) {
      throw new SandManagedSetupClientError(
        `Unsupported managed setup schema version ${response.schemaVersion}.`
      );
    }
    const manifests = response.manifests.map((manifest) => ({
      schemaVersion: SAND_SETUP_SCHEMA_VERSION,
      scope: {
        kind: setupScopeKind(manifest.scopeKind),
        id: manifest.scopeId
      },
      manifestId: manifest.manifestId,
      revision: manifest.revision,
      entries: manifest.entries.map((entry) => ({
        id: entry.id,
        setup: entry.setup,
        ...entry.check === void 0 ? {} : { check: entry.check }
      }))
    }));
    const assignedTeamIds = new Set(manifests.map((manifest) => manifest.scope.id));
    const seenTeams = /* @__PURE__ */ new Set();
    const teamSecrets = [];
    for (const bundle of response.teamSecrets ?? []) {
      if (!assignedTeamIds.has(bundle.teamId) || seenTeams.has(bundle.teamId)) {
        throw new SandManagedSetupClientError("Managed setup Team Secrets have invalid scope.");
      }
      seenTeams.add(bundle.teamId);
      const seenNames = /* @__PURE__ */ new Set();
      const secrets = bundle.secrets.map((secret) => {
        if (seenNames.has(secret.name)) {
          throw new SandManagedSetupClientError("Managed setup Team Secret names must be unique.");
        }
        seenNames.add(secret.name);
        return { name: secret.name, value: secret.value };
      });
      teamSecrets.push({ teamId: bundle.teamId, secrets });
    }
    return { manifests, teamSecrets };
  }
};
function setupScopeKind(kind) {
  switch (kind) {
    case SandSetupManifestScopeKind.TEAM:
      return "team";
    default:
      throw new SandManagedSetupClientError(`Unsupported managed setup scope kind ${kind}.`);
  }
}
