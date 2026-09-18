var MAX_DESCRIPTOR_LENGTH = 80;
var MAX_ELEMENT_COUNT = 8;
function sensitiveVariants(value) {
  const variants = [value];
  try {
    variants.push(encodeURI(value), encodeURIComponent(value));
  } catch {
    return variants;
  }
  return variants;
}
function escapeRegExp3(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function sanitizeText(value, sensitiveValues) {
  let sanitized = value;
  for (const sensitiveValue of sensitiveValues) {
    if (sensitiveValue.length === 0) continue;
    for (const variant of sensitiveVariants(sensitiveValue)) {
      if (variant.length > 0) {
        sanitized = sanitized.replace(new RegExp(escapeRegExp3(variant), "gi"), "[redacted]");
      }
    }
  }
  sanitized = sanitized.replace(/\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/gi, "[redacted]@$1").replace(/\bbearer\s+\S+/gi, "Bearer [redacted]").replace(/((?:authorization|cookie|password|token|secret)\s*[:=]\s*)[^,;\s]+/gi, "$1[redacted]").replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
  return sanitized.length <= MAX_DESCRIPTOR_LENGTH ? sanitized : `${sanitized.slice(0, MAX_DESCRIPTOR_LENGTH)}\u2026`;
}
function sanitizeOptionalText(value, sensitiveValues) {
  if (value === void 0) return void 0;
  const sanitized = sanitizeText(value, sensitiveValues);
  return sanitized.length === 0 ? void 0 : sanitized;
}
function sanitizeTarget(raw, sensitiveValues) {
  const candidate = raw.includes("://") ? raw : `https://${raw}`;
  if (!URL.canParse(candidate)) return { kind: "invalid" };
  const target = new URL(candidate);
  let pathname = target.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    pathname = target.pathname;
  }
  return {
    origin: sanitizeText(target.origin, sensitiveValues),
    pathname: sanitizeText(pathname, sensitiveValues)
  };
}
function sanitizeElement(element, sensitiveValues) {
  const type2 = sanitizeOptionalText(element.type, sensitiveValues);
  const name17 = sanitizeOptionalText(element.name, sensitiveValues);
  const id = sanitizeOptionalText(element.id, sensitiveValues);
  const autocomplete = sanitizeOptionalText(element.autocomplete, sensitiveValues);
  const ariaLabel = sanitizeOptionalText(element.ariaLabel, sensitiveValues);
  const formActionOrigin = sanitizeOptionalText(element.formActionOrigin, sensitiveValues);
  const formMethod = sanitizeOptionalText(element.formMethod, sensitiveValues);
  return {
    tag: sanitizeText(element.tag, sensitiveValues),
    ...type2 !== void 0 ? { type: type2 } : {},
    ...name17 !== void 0 ? { name: name17 } : {},
    ...id !== void 0 ? { id } : {},
    ...autocomplete !== void 0 ? { autocomplete } : {},
    ...ariaLabel !== void 0 ? { ariaLabel } : {},
    ...formActionOrigin !== void 0 ? { formActionOrigin } : {},
    ...formMethod !== void 0 ? { formMethod } : {}
  };
}
function createCredentialAuditLogger(log4) {
  return (entry, sensitiveValues = []) => {
    let dom;
    if (entry.elements !== void 0 || entry.submitRequested !== void 0) {
      const elements = (entry.elements ?? []).slice(0, MAX_ELEMENT_COUNT).map((element) => sanitizeElement(element, sensitiveValues));
      if (entry.submitRequested !== void 0) {
        dom = { elements, submitRequested: entry.submitRequested };
      } else {
        dom = { elements };
      }
    }
    log4(
      `credentials: audit ${JSON.stringify({
        event: entry.event,
        operation: entry.operation,
        outcome: entry.outcome,
        reason: entry.reason,
        ...entry.approvalMode !== void 0 ? { approvalMode: entry.approvalMode } : {},
        ...entry.targetUrl !== void 0 ? { target: sanitizeTarget(entry.targetUrl, sensitiveValues) } : {},
        ...entry.credentialId !== void 0 ? { item: { credentialId: sanitizeText(entry.credentialId, sensitiveValues) } } : {},
        ...dom !== void 0 ? { dom } : {}
      })}`
    );
  };
}
