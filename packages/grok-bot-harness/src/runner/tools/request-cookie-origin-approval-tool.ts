/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/request-cookie-origin-approval-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var SAND_REQUEST_COOKIE_ORIGIN_APPROVAL_TOOL_NAME = "request_cookie_origin_approval";
var COOKIE_ORIGIN_APPROVAL_MAX_ORIGINS = 32;
var requestCookieOriginApprovalParameters = external_exports.object({
  origins: external_exports.array(
    external_exports.union([
      external_exports.string(),
      external_exports.object({
        origin: external_exports.string().describe("Chrome cookie host, e.g. example.com."),
        profileId: external_exports.string().describe(
          'Chrome profile directory id exactly as listed, e.g. "Default" or "Profile 2". Never the user-visible display name: "Work" or "Person 1" are display names, not profile ids.'
        )
      })
    ])
  ).max(COOKIE_ORIGIN_APPROVAL_MAX_ORIGINS).optional().describe(
    "Chrome cookie hosts to request. Omit or pass [] to list available profile and origin pairs. A bare host asks across every profile that has it; pass { origin, profileId } to ask for one profile only. Pass one or more entries to open the approval dialog and wait."
  )
});
function normalizeCookieOriginApprovalOrigins(raw) {
  const origins = [];
  const seen = /* @__PURE__ */ new Set();
  for (const wire of raw ?? []) {
    const entry = cookieOriginRequestEntryFromWire(wire);
    const origin = entry.origin.trim().toLowerCase();
    if (origin.length === 0) continue;
    const profileId = entry.profileId?.trim() ?? null;
    if (profileId !== null && profileId.length === 0) continue;
    const key = JSON.stringify([profileId, origin]);
    if (seen.has(key)) continue;
    seen.add(key);
    origins.push({ origin, profileId });
  }
  return origins;
}
function describeCookieOriginRequestEntry(entry) {
  return entry.profileId === null ? entry.origin : `${entry.origin} (${entry.profileId})`;
}
function pinnedProfileIds(origins) {
  return [
    ...new Set(origins.flatMap((entry) => entry.profileId === null ? [] : [entry.profileId]))
  ];
}
function rejectUnknownCookieProfileIds(requestedIds, items) {
  const validIds = new Set(items.map((item) => item.profileId));
  const unknown2 = requestedIds.filter((id) => !validIds.has(id));
  if (unknown2.length === 0) return null;
  const idByDisplayName = new Map(items.map((item) => [item.profileDisplayName, item.profileId]));
  const complaints = unknown2.map((id) => {
    const idOfName = idByDisplayName.get(id);
    return idOfName === void 0 ? `Unknown Chrome profileId ${JSON.stringify(id)}.` : `${JSON.stringify(id)} is a profile display name; its profileId is ${JSON.stringify(idOfName)}.`;
  });
  const valid = [...new Map(items.map((item) => [item.profileId, item.profileDisplayName]))].map(([id, name17]) => `${JSON.stringify(id)} (display name: ${JSON.stringify(name17)})`).join(", ");
  complaints.push(`Valid profileIds: ${valid.length > 0 ? valid : "none listed"}.`);
  return complaints.join(" ");
}
var COOKIE_ORIGIN_APPROVAL_FAILURE_BY_STAGE = {
  enumerate: "the desktop failed while listing Chrome cookies, so nothing could be selected",
  collect: "the desktop failed while collecting the granted cookies",
  inject: "the box failed while injecting them into its browser"
};
function formatCookieOriginApprovalOutcome(outcome) {
  if (outcome.kind === "listed") {
    if (outcome.items.length === 0) {
      return "No Chrome cookie origins are available to request.";
    }
    return [
      "Available Chrome cookie origins:",
      ...outcome.items.map(
        (item) => `- ${item.origin} \u2014 profileId: ${JSON.stringify(item.profileId)} (display name: ${JSON.stringify(item.profileDisplayName)})`
      )
    ].join("\n");
  }
  if (outcome.kind === "refused") {
    if (outcome.reason === "denied") {
      return `${outcome.message} Do not retry unless they ask.`;
    }
    return outcome.message;
  }
  if (outcome.kind === "failed") {
    if (outcome.errorClass === "ChromeCookieImportPermissionError" || outcome.errorClass === "ChromeSafeStoragePermissionError") {
      return `The user chose ${outcome.decision} for ${describeGrants(outcome.grants)}, but ${COOKIE_ORIGIN_APPROVAL_FAILURE_BY_STAGE[outcome.stage]} (${outcome.errorClass}). No cookies were injected. Ask the user to turn on Grok Bot in System Settings \u2192 Privacy & Security \u2192 Full Disk Access and Automation (Finder), click Always Allow on Chrome Safe Storage, then retry.`;
    }
    return `The user chose ${outcome.decision} for ${describeGrants(outcome.grants)}, but ${COOKIE_ORIGIN_APPROVAL_FAILURE_BY_STAGE[outcome.stage]} (${outcome.errorClass}). No cookies were injected. Tell the user Chrome cookie import failed; do not retry unless they ask.`;
  }
  if (outcome.decision === "deny") {
    return "The user denied Chrome cookie access. Do not retry unless they ask.";
  }
  return `The user chose ${outcome.decision} for ${describeGrants(outcome.grants)}. Injected ${outcome.injected} cookie(s).`;
}
function describeGrants(grants) {
  if (grants.length === 0) return "no origins";
  return grants.map((grant) => `${grant.origin} on ${grant.profileId}`).join(", ");
}
function createRequestCookieOriginApprovalTool(deps) {
  return defineCommunicateTool(deps, {
    id: "SEND_TO_USER",
    name: SAND_REQUEST_COOKIE_ORIGIN_APPROVAL_TOOL_NAME,
    description: `List Chrome cookie origins on the user's computer, or ask the user to approve importing cookies for one or more origins. Omit origins to list. Pass origins to open the approval dialog and wait for Approve once, Always allow, or Deny. Already-granted pairs are skipped. Do not invent origins. ${cookieImportSkipToolNote()}`,
    parameters: requestCookieOriginApprovalParameters,
    describeActivity: (args) => {
      const origins = normalizeCookieOriginApprovalOrigins(args.origins);
      if (origins.length === 0) return { detail: "Listing Chrome cookie origins" };
      return {
        detail: `Requesting cookies for ${origins.map(describeCookieOriginRequestEntry).join(", ")}`
      };
    },
    execute: async (ctx, args, toolDeps) => {
      const origins = normalizeCookieOriginApprovalOrigins(args.origins);
      const request5 = () => toolDeps.request({ origins, signal: ctx.signal });
      if (origins.length === 0) return formatCookieOriginApprovalOutcome(await request5());
      const requestedIds = pinnedProfileIds(origins);
      if (requestedIds.length > 0) {
        const probe = await toolDeps.request({ origins: [], signal: ctx.signal });
        if (probe.kind === "listed") {
          const rejection = rejectUnknownCookieProfileIds(requestedIds, probe.items);
          if (rejection !== null) return rejection;
        }
      }
      return formatCookieOriginApprovalOutcome(
        await withToolExecutionTimeoutSuspended(ctx, request5)
      );
    }
  });
}

