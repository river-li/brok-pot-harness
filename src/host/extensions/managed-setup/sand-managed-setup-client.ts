init_sand_team_converge();
init_sand_box_pb();
init_errors();
var SandManagedSetupClientError = class extends SandDomainError {
  name = "SandManagedSetupClientError";
};
var SandManagedSetupClient = class {
  constructor(client) {
    this.client = client;
  }
  client;
  async fetchSetupManifests() {
    const response = await this.client.listSandSetupManifests({});
    if (response.schemaVersion !== SAND_SETUP_SCHEMA_VERSION) {
      throw new SandManagedSetupClientError(
        `Unsupported managed setup schema version ${response.schemaVersion}.`
      );
    }
    return response.manifests.map((manifest) => ({
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
