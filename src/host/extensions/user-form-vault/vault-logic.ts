var VAULT_MAX_ENTRIES = 200;
var VAULT_MAX_VALUE_LENGTH = 1024;
var VAULT_BACKEND_MAX_LABEL_LENGTH = 120;
var VAULT_BACKEND_MAX_EXTRA_KEY_LENGTH = 255;
var EMAIL_FIELD_PATTERN = /\be-?mail\b/i;
var PHONE_FIELD_PATTERN = /\b(?:phone|mobile|tel(?:ephone)?|cell)\b/i;
var NAME_FIELD_PATTERN = /\b(?:full\s*name|first\s*name|last\s*name|given\s*name|family\s*name|middle\s*name|surname|name)\b/i;
var NON_PERSON_NAME_PATTERN = /user\s*name|login|account|screen\s*name|company|business/i;
var ADDRESS_FIELD_PATTERN = /\b(?:address|street|addr)\b/i;
var SITE_BOUND_USERNAME_FIELD_PATTERN = /user\s*[-_]?\s*name|user\s*[-_]?\s*id|screen\s*[-_]?\s*name/i;
var UNSAVABLE_FIELD_TYPES = /* @__PURE__ */ new Set([
  "password",
  "otp",
  "select",
  "checkbox"
]);
function isVaultSavableUserFormField(field) {
  if (UNSAVABLE_FIELD_TYPES.has(field.type)) return false;
  if (isSecretUserFormField(field)) return false;
  if (userFormFieldLooksPaymentLike(field)) return false;
  if (userFormFieldLooksCredentialLike(field)) return false;
  return true;
}
var SECRET_AUTOCOMPLETE_TOKEN_PATTERN = /^(?:current-password|new-password|one-time-code|cc-.+)$/;
function isSecretFilledControl(control) {
  if (control === void 0) return true;
  if (control.splitCharGroup === true) return true;
  if (control.type?.trim().toLowerCase() === "password") return true;
  if ((control.autoComplete ?? "").toLowerCase().split(/\s+/).some((token) => SECRET_AUTOCOMPLETE_TOKEN_PATTERN.test(token))) {
    return true;
  }
  const descriptor2 = control.descriptor?.trim() ?? "";
  if (descriptor2.length === 0) return false;
  const sniffField = { id: "", label: descriptor2 };
  return userFormFieldLooksCredentialLike(sniffField) || userFormFieldLooksPaymentLike(sniffField);
}
function normalizeVaultExtraKey(label) {
  return label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().slice(0, VAULT_BACKEND_MAX_EXTRA_KEY_LENGTH).trimEnd();
}
function resolveVaultExtraKey(raw, existingKeys) {
  if (raw === void 0) return void 0;
  const folded = raw.trim().toLowerCase();
  if (folded.length === 0) return void 0;
  const reused = existingKeys.find((key) => key.toLowerCase() === folded);
  if (reused !== void 0) return reused;
  if (userFormFieldLooksPaymentLike({ id: "", label: folded })) return void 0;
  if (userFormFieldLooksCredentialLike({ id: "", label: folded })) return void 0;
  const normalized = normalizeVaultExtraKey(raw);
  return normalized.length === 0 ? void 0 : normalized;
}
function extraKeysOf(entries) {
  return entries.flatMap(
    (entry) => entry.kind === "extra" && entry.extraKey !== void 0 ? [entry.extraKey] : []
  );
}
function classifyVaultField(field, formDomain, existingExtraKeys = []) {
  if (!isVaultSavableUserFormField(field)) return void 0;
  const text2 = `${field.id} ${field.label}`;
  if (field.type === "email" || EMAIL_FIELD_PATTERN.test(text2)) return { kind: "email" };
  if (field.type === "tel" || PHONE_FIELD_PATTERN.test(text2)) return { kind: "phone" };
  if (NAME_FIELD_PATTERN.test(text2) && !NON_PERSON_NAME_PATTERN.test(text2)) {
    return { kind: "name" };
  }
  if (ADDRESS_FIELD_PATTERN.test(text2)) return { kind: "address" };
  const hostScope = userFormVaultHostScope(formDomain);
  const globallySharedKey = resolveVaultExtraKey(field.extraKey, existingExtraKeys) ?? normalizeVaultExtraKey(field.label);
  if (globallySharedKey.length === 0) return void 0;
  if (SITE_BOUND_USERNAME_FIELD_PATTERN.test(text2)) {
    if (hostScope === void 0) return void 0;
    return {
      kind: "extra",
      extraKey: embedHostInSiteBoundKey(hostScope, globallySharedKey),
      hostScope
    };
  }
  return {
    kind: "extra",
    extraKey: globallySharedKey,
    ...hostScope !== void 0 ? { hostScope } : {}
  };
}
function embedHostInSiteBoundKey(hostScope, key) {
  if (key.startsWith(`${hostScope} `)) return key;
  return `${hostScope} ${key}`.slice(0, VAULT_BACKEND_MAX_EXTRA_KEY_LENGTH).trimEnd();
}
function entryMatchesClass(entry, cls) {
  if (entry.kind !== cls.kind) return false;
  return cls.kind !== "extra" || entry.extraKey === cls.extraKey;
}
function matchVaultEntriesLastUsedFirst(entries, cls) {
  return entries.filter((entry) => entryMatchesClass(entry, cls)).sort((a, b2) => b2.lastUsedAtMs - a.lastUsedAtMs);
}
function normalizeValue(kind, value) {
  const collapsed = value.trim().replace(/\s+/g, " ");
  if (kind === "phone") return collapsed.replace(/\D/g, "");
  if (kind === "email") return collapsed.toLowerCase();
  return collapsed;
}
var COMPARE_LENGTH_CAP = 256;
function editDistance(a, b2) {
  const left = a.slice(0, COMPARE_LENGTH_CAP);
  const right = b2.slice(0, COMPARE_LENGTH_CAP);
  let previous = Array.from({ length: right.length + 1 }, (_2, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j2 = 1; j2 <= right.length; j2 += 1) {
      current[j2] = Math.min(
        (previous[j2] ?? 0) + 1,
        (current[j2 - 1] ?? 0) + 1,
        (previous[j2 - 1] ?? 0) + (left[i - 1] === right[j2 - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length] ?? 0;
}
var ZIP_TOKEN_PATTERN = /\b\d{5}(?:-\d{4})?\b/g;
function isAdjacentTransposition(a, b2) {
  if (a.length !== b2.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b2[i]) i += 1;
  if (i >= a.length - 1) return false;
  if (a[i] !== b2[i + 1] || a[i + 1] !== b2[i]) return false;
  return a.slice(i + 2) === b2.slice(i + 2);
}
function isSmallEditOfLastUsed(kind, lastUsed, next) {
  const before = normalizeValue(kind, lastUsed);
  const after = normalizeValue(kind, next);
  if (before.toLowerCase() === after.toLowerCase()) return true;
  if (kind === "phone") return editDistance(before, after) <= 1;
  if (kind === "address") {
    const beforeZips = before.match(ZIP_TOKEN_PATTERN) ?? [];
    const afterZips = after.match(ZIP_TOKEN_PATTERN) ?? [];
    if (beforeZips.length > 0 && afterZips.length > 0 && beforeZips[0] !== afterZips[0]) {
      return false;
    }
    return editDistance(before, after) <= 4;
  }
  if (Math.max(before.length, after.length) >= 16) return editDistance(before, after) <= 4;
  return isTypoShapedEditOfShortValue(before, after);
}
function isTypoShapedEditOfShortValue(before, after) {
  if (before.length !== after.length) return editDistance(before, after) <= 1;
  return isAdjacentTransposition(before, after);
}
function decideVaultSave(matchingLastUsedFirst, cls, value) {
  const normalized = normalizeValue(cls.kind, value);
  const exact = matchingLastUsedFirst.find(
    (entry) => normalizeValue(cls.kind, entry.value) === normalized
  );
  if (exact !== void 0) return { action: "touch", entryId: exact.id };
  const lastUsed = matchingLastUsedFirst[0];
  if (lastUsed !== void 0 && isSmallEditOfLastUsed(cls.kind, lastUsed.value, value)) {
    return { action: "overwrite", entryId: lastUsed.id };
  }
  return { action: "add" };
}
var KIND_DEFAULT_LABEL = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  address: "Address"
};
function nextDefaultVaultLabel(entries, cls, fieldLabel) {
  const base = cls.kind === "extra" ? fieldLabel.trim() : KIND_DEFAULT_LABEL[cls.kind];
  const count = entries.filter((entry) => entryMatchesClass(entry, cls)).length;
  if (count === 0) return base.slice(0, VAULT_BACKEND_MAX_LABEL_LENGTH).trimEnd();
  const suffix = ` ${count + 1}`;
  return `${base.slice(0, VAULT_BACKEND_MAX_LABEL_LENGTH - suffix.length).trimEnd()}${suffix}`;
}
function applyVaultSave(args) {
  const { entries, field, value, nowMs: nowMs2, newEntryId } = args;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > VAULT_MAX_VALUE_LENGTH) return void 0;
  const cls = classifyVaultField(field, args.formDomain, extraKeysOf(entries));
  if (cls === void 0) return void 0;
  const originHost = cls.hostScope;
  const stampOrigin = (entry) => originHost !== void 0 ? { ...entry, originHost } : entry;
  const decision = decideVaultSave(matchVaultEntriesLastUsedFirst(entries, cls), cls, trimmed);
  if (decision.action === "touch") {
    return entries.map(
      (entry) => entry.id === decision.entryId ? stampOrigin({ ...entry, lastUsedAtMs: nowMs2 }) : entry
    );
  }
  if (decision.action === "overwrite") {
    return entries.map(
      (entry) => entry.id === decision.entryId ? stampOrigin({ ...entry, value: trimmed, lastUsedAtMs: nowMs2 }) : entry
    );
  }
  const added = stampOrigin({
    id: newEntryId(),
    kind: cls.kind,
    label: nextDefaultVaultLabel(entries, cls, field.label),
    ...cls.extraKey !== void 0 ? { extraKey: cls.extraKey } : {},
    value: trimmed,
    createdAtMs: nowMs2,
    lastUsedAtMs: nowMs2
  });
  const next = [...entries, added];
  if (next.length <= VAULT_MAX_ENTRIES) return next;
  const leastRecentlyUsed = next.reduce(
    (oldest, entry) => entry.lastUsedAtMs < oldest.lastUsedAtMs ? entry : oldest
  );
  return next.filter((entry) => entry.id !== leastRecentlyUsed.id);
}
