function entryOfProto(proto) {
  if (!isVaultKind(proto.kind)) return void 0;
  return {
    id: proto.entryId,
    kind: proto.kind,
    label: proto.label,
    ...proto.extraKey !== void 0 && proto.extraKey.length > 0 ? { extraKey: proto.extraKey } : {},
    value: proto.value,
    ...proto.originHost !== void 0 && proto.originHost.length > 0 ? { originHost: proto.originHost } : {},
    createdAtMs: Number(proto.createdAtMs),
    lastUsedAtMs: Number(proto.lastUsedAtMs)
  };
}
function protoOfEntry(entry) {
  return {
    entryId: entry.id,
    kind: entry.kind,
    label: entry.label,
    ...entry.extraKey !== void 0 ? { extraKey: entry.extraKey } : {},
    value: entry.value,
    ...entry.originHost !== void 0 ? { originHost: entry.originHost } : {},
    createdAtMs: BigInt(entry.createdAtMs),
    lastUsedAtMs: BigInt(entry.lastUsedAtMs)
  };
}
function startUserFormVault(context2, createClient2 = createSandCursorBackendClient) {
  const client = createClient2(GrokBotService, {
    backend: context2.host.environment.backend,
    getAccessToken: context2.deps.auth.getAccessToken,
    getTeamId: context2.deps.auth.getTeamId,
    getMachineId: context2.deps.auth.getMachineId
  });
  const service = createUserFormVaultService({
    newEntryId: () => (0, import_node_crypto83.randomUUID)(),
    isVaultEnabled: () => context2.deps.experiments.checkFeatureGate("grok_bot_form_vault", {
      disableExposureLog: true
    }),
    remote: {
      list: async () => (await client.listGrokBotUserFormVaultEntries({})).entries.flatMap((proto) => {
        const entry = entryOfProto(proto);
        return entry === void 0 ? [] : [entry];
      }),
      listKeys: async () => (await client.listGrokBotUserFormVaultKeys({})).keys.flatMap((key) => {
        if (key.extraKey.length === 0) return [];
        if (key.originHost !== void 0 && key.originHost.length > 0) {
          return [{ extraKey: key.extraKey, originHost: key.originHost }];
        }
        return [{ extraKey: key.extraKey }];
      }),
      upsert: async (entry) => {
        await client.upsertGrokBotUserFormVaultEntry({ entry: protoOfEntry(entry) });
      },
      delete: async (entryId) => {
        await client.deleteGrokBotUserFormVaultEntry({ entryId });
      }
    },
    log: context2.host.log
  });
  context2.onStop(() => service.dispose());
  return service.api;
}
var userFormVaultExtension = defineHostExtension({
  id: "user-form-vault",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments],
  start: startUserFormVault
});
