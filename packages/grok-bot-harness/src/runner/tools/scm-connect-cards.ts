var PROVIDER_DISPLAY_NAMES = {
  github: "GitHub",
  origin: "Origin",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
  "azure-devops": "Azure DevOps"
};
function scmProviderDisplayName(provider) {
  return provider === "github-enterprise" ? "GitHub" : PROVIDER_DISPLAY_NAMES[provider];
}
function isDotcomGithubHost(host) {
  const lowered = host.toLowerCase();
  return lowered === "github.com" || lowered === "www.github.com";
}
function repoUrlAsHttp(repoUrl) {
  const trimmed = repoUrl?.trim() ?? "";
  if (trimmed.length === 0) return null;
  try {
    return new URL(trimmed.replace(/^git@([^:/]+):/, "https://$1/"));
  } catch {
    return null;
  }
}
function githubRepoSlugFromUrl(repoUrl) {
  const url2 = repoUrlAsHttp(repoUrl);
  if (url2 == null || !isDotcomGithubHost(url2.hostname)) return null;
  const parts = url2.pathname.replace(/\.git$/i, "").split("/").filter((part) => part.length > 0);
  return parts.length < 2 ? null : `${parts[0]}/${parts[1]}`.toLowerCase();
}
function detectScmProviderForRepoUrl(repoUrl) {
  if (isOriginRepoReference(repoUrl)) return "origin";
  const hostname3 = repoUrlAsHttp(repoUrl)?.hostname.toLowerCase();
  if (hostname3 == null) return null;
  if (hostname3 === "github.com" || hostname3.endsWith(".github.com")) return "github";
  if (hostname3.endsWith(".ghe.com")) return "github-enterprise";
  if (hostname3 === "gitlab.com" || hostname3.endsWith(".gitlab.com")) return "gitlab";
  if (hostname3 === "bitbucket.org") return "bitbucket";
  if (hostname3 === "dev.azure.com" || hostname3.endsWith(".visualstudio.com")) {
    return "azure-devops";
  }
  return null;
}
function isScmNotConnectedShapedRejection(rejection) {
  return /is not connected to your (account|team)/i.test(rejection);
}
function isScmReconnectShapedRejection(rejection) {
  return /please reconnect (github|gitlab|bitbucket|azure|your source control integration)/i.test(
    rejection
  );
}
function isRepoAccessShapedRejection(rejection) {
  const namesRepository = /repositor/i.test(rejection);
  const deniesAccess = /deleted, renamed, made private|not linked for this workspace|do(?:es)? not have access|not accessible|no .*access token found with access|removed from the .* installation|permission denied/i.test(
    rejection
  );
  return namesRepository && deniesAccess;
}
var SCM_CONNECT_INTENTS = ["connect", "access"];
var DASHBOARD_CONNECTABLE_PROVIDERS = [
  "github",
  "gitlab",
  "bitbucket",
  "azure-devops"
];
var SAND_REQUEST_SCM_CONNECT_TOOL_NAME = "request_scm_connect";
var SCM_RECONNECT_REASON = "again; the saved connection no longer works";
function scmConnectCardFromRequest(args) {
  const repo = args.intent === "access" ? args.repo?.trim().toLowerCase() : void 0;
  return {
    type: "scm-connect",
    ...args.provider == null ? {} : { provider: args.provider },
    intent: args.intent,
    ...args.intent === "connect" && args.reconnect === true ? { reason: SCM_RECONNECT_REASON } : {},
    ...repo == null || repo.length === 0 ? {} : { repo }
  };
}
function requestExample(args) {
  const params = {
    intent: args.intent,
    ...args.provider == null ? {} : { provider: args.provider },
    ...args.repo == null ? {} : { repo: args.repo },
    ...args.reconnect === true ? { reconnect: true } : {}
  };
  return `${SAND_REQUEST_SCM_CONNECT_TOOL_NAME} ${JSON.stringify(params)}`;
}
async function armScmConnectWaits(card, registerScmConnectWait) {
  const repoScopedProvider = card.intent === "access" && card.provider === "github" && card.repo != null ? card.provider : void 0;
  const cardProvider = DASHBOARD_CONNECTABLE_PROVIDERS.find((p2) => p2 === card.provider) ?? "any";
  try {
    for (const waitProvider of DASHBOARD_CONNECTABLE_PROVIDERS) {
      await registerScmConnectWait({
        provider: waitProvider,
        intent: card.intent ?? "connect",
        cardProvider,
        ...waitProvider === repoScopedProvider && card.repo != null ? { repoSlug: card.repo } : {}
      });
    }
    return true;
  } catch (error42) {
    reportHostDiagnostic({
      kind: "scm_connect_surface_failed",
      stage: "register_wait",
      errorClass: errorClassOf(error42)
    });
    return false;
  }
}
async function describeScmConnectBlocker({
  provider,
  rejection,
  knownIntent,
  isConnected,
  blockedAction,
  repoUrl
}) {
  if (provider === "origin" || provider === "github-enterprise") return null;
  const reconnectShaped = rejection != null && isScmReconnectShapedRejection(rejection);
  if (rejection != null && !reconnectShaped && !isScmNotConnectedShapedRejection(rejection) && !isRepoAccessShapedRejection(rejection)) {
    return null;
  }
  const displayName2 = provider == null ? "a source control integration" : PROVIDER_DISPLAY_NAMES[provider];
  const probeTargets = provider == null ? DASHBOARD_CONNECTABLE_PROVIDERS : [provider];
  let hasConnectedProvider = false;
  let sawFulfilledProbe = false;
  const trustNotConnectedRejection = rejection != null && isScmNotConnectedShapedRejection(rejection);
  if (isConnected != null && knownIntent == null && !trustNotConnectedRejection) {
    const probes = await Promise.allSettled(probeTargets.map((target) => isConnected(target)));
    for (const probe of probes) {
      if (probe.status === "fulfilled") {
        sawFulfilledProbe = true;
        hasConnectedProvider = hasConnectedProvider || probe.value;
      } else {
        reportHostDiagnostic({
          kind: "scm_connect_surface_failed",
          stage: "status_probe",
          errorClass: errorClassOf(probe.reason)
        });
      }
    }
  }
  if (hasConnectedProvider && !reconnectShaped && rejection != null && !isRepoAccessShapedRejection(rejection)) {
    return null;
  }
  const preferAccessOnProbeOutage = rejection != null && isRepoAccessShapedRejection(rejection) && !sawFulfilledProbe;
  const intent = knownIntent ?? ((hasConnectedProvider || preferAccessOnProbeOutage) && !reconnectShaped ? "access" : "connect");
  const repoSlug = provider === "github" ? githubRepoSlugFromUrl(repoUrl) : null;
  const accessRepo = intent === "access" && repoSlug != null ? repoSlug : void 0;
  const example = requestExample({
    intent,
    ...provider == null ? {} : { provider },
    ...accessRepo == null ? {} : { repo: accessRepo },
    ...reconnectShaped ? { reconnect: true } : {}
  });
  let leadSentence;
  if (provider == null && knownIntent != null) {
    leadSentence = `No source control integration is connected to the user's Cursor account.`;
  } else if (provider == null) {
    leadSentence = intent === "access" ? `The repo reference didn't identify a source control integration, and the connected one can't see this repository. It may be on another provider, need an access grant, or not exist.` : `The repo reference didn't identify a source control integration, and none is connected to the user's Cursor account.`;
  } else if (intent === "access") {
    leadSentence = `${displayName2} is connected but can't see this repository. The user may need to add it to Cursor's ${displayName2} access, or the repo may not exist or be on another provider.`;
  } else if (reconnectShaped) {
    leadSentence = `${displayName2} is connected to the user's Cursor account but the saved connection no longer works; it has to be connected again.`;
  } else {
    leadSentence = `${displayName2} isn't connected to the user's Cursor account (or can't see this repository).`;
  }
  return `${leadSentence} Nothing was shown to the user. To ask them to fix it, call ${example}; its result says whether you're woken automatically when they do. Either way, confirm with the owner before retrying the blocked action (${blockedAction}). Do not reuse a parked prompt or repo URL unless they ask.`;
}
