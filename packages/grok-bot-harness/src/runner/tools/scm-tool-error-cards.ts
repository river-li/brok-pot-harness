init_dist2();
init_mcp_exec_pb();
function scmToolErrorFromMcpResult(result, emittingServerIdentifier) {
  if (result.result.case !== "success" || !result.result.value.isError) return void 0;
  for (const item of result.result.value.content) {
    if (item.content.case !== "text") continue;
    const error42 = parseRestMcpScmToolError({
      text: item.content.value.text,
      emittingServerIdentifier
    });
    if (error42 != null) return error42;
  }
  return void 0;
}
function appendNoteToMcpResult(result, note) {
  if (result.result.case === "error") {
    result.result.value.error = `${result.result.value.error}
${note}`;
    return;
  }
  if (result.result.case !== "success") return;
  result.result.value.content.push(
    new McpToolResultContentItem({
      content: { case: "text", value: new McpTextContent({ text: note }) }
    })
  );
}
function scmProviderOf(provider) {
  return DASHBOARD_CONNECTABLE_PROVIDERS.find((candidate) => candidate === provider) ?? null;
}
function repoUrlFor(provider, repo) {
  switch (provider) {
    case "github":
      return `https://github.com/${repo}`;
    case "gitlab":
      return `https://gitlab.com/${repo}`;
    case "bitbucket":
      return `https://bitbucket.org/${repo}`;
    case "azure-devops":
    case "origin":
      return void 0;
  }
}
async function describeScmToolError(error42, toolName) {
  const provider = scmProviderOf(error42.provider);
  if (provider == null) return null;
  const blockedAction = `the ${toolName} call`;
  switch (error42.code) {
    case REST_MCP_SCM_ERROR_CODES.notConnected:
      return describeScmConnectBlocker({ provider, knownIntent: "connect", blockedAction });
    case REST_MCP_SCM_ERROR_CODES.tokenRejected:
      return describeScmConnectBlocker({
        provider,
        rejection: `Please reconnect ${provider}`,
        blockedAction
      });
    case REST_MCP_SCM_ERROR_CODES.repoNotAccessible: {
      const repoUrl = error42.repo == null ? void 0 : repoUrlFor(provider, error42.repo);
      return describeScmConnectBlocker({
        provider,
        knownIntent: "access",
        ...repoUrl == null ? {} : { repoUrl },
        blockedAction
      });
    }
    case REST_MCP_SCM_ERROR_CODES.orgBlocked:
      return describeScmOrgBlocked(error42, provider, blockedAction);
    case REST_MCP_SCM_ERROR_CODES.tokenUnavailable:
      return null;
  }
}
function describeScmOrgBlocked(error42, provider, blockedAction) {
  if (error42.reason !== "sso_required") return null;
  const displayName2 = scmProviderDisplayName(provider);
  const orgPhrase = `the ${error42.org ?? error42.repo?.split("/")[0] ?? "repository's"} organization`;
  const userAction = error42.authorizationUrl == null ? `authorize Cursor's ${displayName2} App for ${orgPhrase} on ${displayName2} (${displayName2} settings \u2192 Applications \u2192 Cursor \u2192 Organization access)` : `open ${error42.authorizationUrl} and authorize Cursor's ${displayName2} App for ${orgPhrase}`;
  return `${displayName2} is connected, but ${orgPhrase} requires SAML SSO authorization for Cursor's ${displayName2} App with the user's connected account, so it refused ${blockedAction}. Nothing was shown to the user, and no connect or repository-access request helps here. Ask the user to ${userAction}; access is re-checked within about 30 seconds of authorizing, so confirm with them before retrying the blocked action.`;
}
