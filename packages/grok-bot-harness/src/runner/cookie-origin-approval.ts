function offersCookieOriginApproval(host) {
  return !host.isSubagentRunner && host.hasUserComputer?.() !== false && host.cookieOriginApproval != null && host.gates.agentPromptedCookieSync();
}
