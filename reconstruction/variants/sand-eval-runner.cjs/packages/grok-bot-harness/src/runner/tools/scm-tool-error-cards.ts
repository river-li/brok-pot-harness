/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/scm-tool-error-cards.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist2();

// @recovered-fragment 2/2
function scmToolErrorFromMcpResult(result, emittingServerIdentifier) {
  if (result.result.case !== "success" || !result.result.value.isError) return void 0;
  for (const item of result.result.value.content) {
    if (item.content.case !== "text") continue;
    const error3 = parseRestMcpScmToolError({
      text: item.content.value.text,
      emittingServerIdentifier
    });
    if (error3 != null) return error3;
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
async function describeScmToolError(error3, toolName) {
  const provider = scmProviderOf(error3.provider);
  if (provider == null) return null;
  const blockedAction = `the ${toolName} call`;
  switch (error3.code) {
    case REST_MCP_SCM_ERROR_CODES.notConnected:
      return describeScmConnectBlocker({ provider, knownIntent: "connect", blockedAction });
    case REST_MCP_SCM_ERROR_CODES.tokenRejected:
      return describeScmConnectBlocker({
        provider,
        rejection: `Please reconnect ${provider}`,
        blockedAction
      });
    case REST_MCP_SCM_ERROR_CODES.repoNotAccessible: {
      const repoUrl = error3.repo == null ? void 0 : repoUrlFor(provider, error3.repo);
      return describeScmConnectBlocker({
        provider,
        knownIntent: "access",
        ...repoUrl == null ? {} : { repoUrl },
        blockedAction
      });
    }
    case REST_MCP_SCM_ERROR_CODES.tokenUnavailable:
    case REST_MCP_SCM_ERROR_CODES.orgBlocked:
      return null;
  }
}

