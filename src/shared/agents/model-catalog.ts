function findCatalogEntry(catalog, modelId) {
  const needle = modelId.trim().toLowerCase();
  if (needle.length === 0) {
    return void 0;
  }
  return catalog.find(
    (entry) => entry.id.toLowerCase() === needle || entry.aliases.some((alias) => alias.toLowerCase() === needle)
  );
}
function validateModelParams(entry, params) {
  const errors = [];
  for (const [id, value] of Object.entries(params)) {
    const def = entry.params.find((p2) => p2.id === id);
    if (def == null) {
      const allowedIds = entry.params.map((p2) => p2.id).join(", ");
      errors.push(
        `'${id}' is not a parameter of ${entry.id}.` + (allowedIds.length > 0 ? ` Allowed parameters: ${allowedIds}.` : " This model takes no parameters.")
      );
      continue;
    }
    if (!def.values.some((v2) => v2.value === value)) {
      const allowed = def.values.map((v2) => v2.value).join(", ");
      errors.push(
        `'${value}' is not a valid value for '${id}' on ${entry.id}. Allowed: ${allowed}.`
      );
    }
  }
  if (errors.length === 0) {
    const combinationError = validateParamCombination(entry, params);
    if (combinationError != null) {
      errors.push(combinationError);
    }
  }
  return errors;
}
function variantMatchesRequested(variant, requested) {
  const byId = new Map(variant.map((p2) => [p2.id, p2.value]));
  return requested.every(([id, value]) => byId.get(id) === value);
}
function validateParamCombination(entry, params) {
  if (entry.variants.length === 0) {
    return null;
  }
  const requested = Object.entries(params);
  if (requested.length === 0) {
    return null;
  }
  if (entry.variants.some((variant) => variantMatchesRequested(variant, requested))) {
    return null;
  }
  const conflicting = requested.filter(([dropId]) => {
    const rest = requested.filter(([id]) => id !== dropId);
    return entry.variants.some((variant) => variantMatchesRequested(variant, rest));
  }).map(([id]) => id);
  const requestedStr = requested.map(([id, value]) => `${id}=${value}`).join(", ");
  const hint = conflicting.length > 1 ? ` These parameters can't be combined on ${entry.id}: ${conflicting.join(", ")}.` : "";
  return `{${requestedStr}} is not a supported parameter combination for ${entry.id}.` + hint + ` Change one of the conflicting parameters and retry (for example, on some models a 1M context can't be combined with the fast tier).`;
}
function describeParamIncompatibilities(entry) {
  if (entry.variants.length === 0) {
    return [];
  }
  const present = [];
  const seen = /* @__PURE__ */ new Set();
  for (const variant of entry.variants) {
    for (const { id, value } of variant) {
      const key = `${id}=${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        present.push({ id, value });
      }
    }
  }
  const coOccurs = (a, b2) => entry.variants.some((variant) => {
    const byId = new Map(variant.map((p2) => [p2.id, p2.value]));
    return byId.get(a.id) === a.value && byId.get(b2.id) === b2.value;
  });
  const notes = [];
  for (const [i, a] of present.entries()) {
    for (const b2 of present.slice(i + 1)) {
      if (a.id === b2.id) {
        continue;
      }
      if (!coOccurs(a, b2)) {
        notes.push(`${a.id}=${a.value} cannot be combined with ${b2.id}=${b2.value}`);
      }
    }
  }
  return notes;
}
function toSandModelCatalogEntry(model) {
  const params = [];
  for (const def of model.parameterDefinitions) {
    const boolDef = def.parameterType?.booleanParameter;
    const enumDef = def.parameterType?.enumParameter;
    const rawValues = boolDef?.values ?? enumDef?.values ?? [];
    const values = rawValues.map((v2) => ({
      value: v2.value,
      ...v2.displayName != null && v2.displayName.trim().length > 0 ? { displayName: v2.displayName.trim() } : {}
    }));
    if (values.length === 0) {
      continue;
    }
    params.push({
      id: def.id,
      ...def.name.trim().length > 0 ? { name: def.name.trim() } : {},
      type: boolDef != null ? "boolean" : "enum",
      values
    });
  }
  const variants = model.variants.map(
    (variant) => variant.parameterValues.map((p2) => ({ id: p2.id, value: p2.value }))
  );
  return {
    id: model.name,
    ...model.clientDisplayName != null && model.clientDisplayName.trim().length > 0 ? { displayName: model.clientDisplayName.trim() } : {},
    aliases: [...model.idAliases],
    params,
    variants
  };
}
function mapAvailableModels(models) {
  return models.filter((model) => model.name.trim().length > 0).map(toSandModelCatalogEntry);
}
