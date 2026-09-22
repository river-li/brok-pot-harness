var VAULT_KINDS = new Set(SAND_VAULT_FIELD_KINDS);
function isVaultKind(kind) {
  return VAULT_KINDS.has(kind);
}
function dropEntriesOfUnknownKind(entries) {
  return entries.filter((entry) => isVaultKind(entry.kind));
}
function createUserFormVaultService(deps) {
  const { newEntryId } = deps;
  const nowMs2 = deps.nowMs ?? Date.now;
  let mutationChain = Promise.resolve();
  const errorText = (error42) => error42 instanceof Error ? error42.message : String(error42);
  const listRemote = async () => dropEntriesOfUnknownKind(await deps.remote.list());
  const syncDiffById = async (before, next) => {
    const nextIds = new Set(next.map((entry) => entry.id));
    const evicted = before.filter((entry) => !nextIds.has(entry.id));
    for (const entry of evicted) {
      await deps.remote.delete(entry.id);
    }
    const beforeById = new Map(before.map((entry) => [entry.id, entry]));
    try {
      for (const entry of next) {
        if (beforeById.get(entry.id) !== entry) await deps.remote.upsert(entry);
      }
    } catch (error42) {
      for (const entry of evicted) {
        await deps.remote.upsert(entry).catch((restoreError) => {
          deps.log(
            `[sand:user-form-vault] restore of evicted entry after a failed upsert also failed: ${errorText(restoreError)}`
          );
        });
      }
      throw error42;
    }
  };
  const enqueueMutation = (mutation) => {
    const run = mutationChain.then(mutation);
    mutationChain = run.then(
      () => void 0,
      (error42) => {
        deps.log(`[sand:user-form-vault] queued vault mutation failed: ${errorText(error42)}`);
      }
    );
    return run;
  };
  const api = {
    listKeys: async () => deps.isVaultEnabled() ? await deps.remote.listKeys() : [],
    recordSuccessfulFill: (args) => enqueueMutation(async () => {
      if (!deps.isVaultEnabled()) return;
      const filledIds = new Set(
        args.outcomes.filter((outcome) => outcome.filled).map((outcome) => outcome.id)
      );
      let entries = await listRemote();
      for (const field of args.fields) {
        if (!filledIds.has(field.id)) continue;
        if (isSecretFilledControl(args.filledControls[field.id])) continue;
        const value = args.values[field.id];
        if (value == null) continue;
        const next = applyVaultSave({
          entries,
          field,
          value,
          nowMs: nowMs2(),
          newEntryId,
          ...args.formDomain != null ? { formDomain: args.formDomain } : {}
        });
        if (next === void 0) continue;
        await syncDiffById(entries, next);
        entries = next;
      }
    }).then(void 0, (error42) => {
      deps.log(`[sand:user-form-vault] post-fill save failed: ${errorText(error42)}`);
    })
  };
  return { api, dispose: () => {
  } };
}
