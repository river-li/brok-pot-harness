/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cookie-origin-approval.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function offersCookieOriginApproval(host) {
  return !host.isSubagentRunner && host.hasUserComputer?.() !== false && host.cookieOriginApproval != null && host.gates.agentPromptedCookieSync();
}

