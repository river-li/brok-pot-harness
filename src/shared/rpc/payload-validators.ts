function describeReceived2(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
function payloadValidator(expects, admit) {
  const check2 = (value, path31) => {
    const verdict = admit(value);
    if (verdict.ok) return verdict;
    return { ok: false, path: path31, expected: expects, received: describeReceived2(value) };
  };
  return {
    expects,
    check: check2,
    "~standard": {
      version: 1,
      vendor: "sand",
      validate: (value) => {
        const result = check2(value, []);
        return result.ok ? { value: result.value } : {
          issues: [
            {
              message: `must be ${result.expected}, got ${result.received}`,
              path: result.path
            }
          ]
        };
      }
    }
  };
}
function payloadShape(expects, admit) {
  return payloadValidator(
    expects,
    (value) => admit(value) ? { ok: true, value } : { ok: false }
  );
}
function payloadParsed(expects, parse11) {
  return payloadValidator(expects, (value) => {
    const result = parse11(value);
    return result.success ? { ok: true, value: result.data } : { ok: false };
  });
}
var nonEmptyString = payloadShape(
  "non-empty string",
  (value) => typeof value === "string" && value.length > 0
);
var nonBlankString = payloadShape(
  "non-blank string",
  (value) => typeof value === "string" && value.trim().length > 0
);
var mainAgentId = payloadShape(
  `non-blank string of at most ${MAIN_AGENT_ID_MAX_LENGTH} characters`,
  isMainAgentId
);
var trimmedNonEmptyString = payloadParsed("non-empty string", (value) => {
  if (typeof value !== "string") return { success: false };
  const trimmed = value.trim();
  return trimmed.length > 0 ? { success: true, data: trimmed } : { success: false };
});
function oneOf(expects, members) {
  return payloadShape(
    expects,
    (value) => members.some((member) => member === value)
  );
}
var heapMetricsReport = payloadParsed(
  "heap metrics report",
  (value) => {
    const parsed2 = parseHeapMetricsReport(value);
    return parsed2 === null ? { success: false } : { success: true, data: parsed2 };
  }
);
function describeIssues(issues) {
  return issues.map((issue2) => {
    const path31 = (issue2.path ?? []).map(
      (segment) => typeof segment === "object" && segment !== null ? String(segment.key) : String(segment)
    ).join(".");
    return path31.length === 0 ? `args: ${issue2.message}` : `args.${path31}: ${issue2.message}`;
  }).join("; ");
}
