/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-analytics/dist/commit-scoring/git-repo-utils.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseGitUrl2(urlString) {
  try {
    let normalizedUrl = urlString;
    if (urlString.includes("@") && !urlString.startsWith("http")) {
      if (!urlString.startsWith("ssh://")) {
        normalizedUrl = urlString.replace(/^([^@]+)@([^:]+):(.*)/, "ssh://$1@$2/$3");
      }
    }
    return new URL(normalizedUrl);
  } catch (_a20) {
    return null;
  }
}
function extractRepoNameFromGitUrl(upstreamURL) {
  if (!upstreamURL) {
    return void 0;
  }
  const normalizedUpstreamURL = upstreamURL.replace("https///", "https://").replace("http///", "http://");
  if (normalizedUpstreamURL.startsWith("gitlab-remote://")) {
    try {
      const url3 = new URL(normalizedUpstreamURL);
      const projectId = url3.searchParams.get("project");
      if (projectId) {
        if (projectId.includes("/")) {
          return projectId;
        }
        return void 0;
      }
    } catch (_a20) {
    }
  }
  const url2 = parseGitUrl2(normalizedUpstreamURL);
  if (!url2) {
    return void 0;
  }
  const hostname2 = url2.hostname.toLowerCase();
  const pathParts = url2.pathname.split("/").filter((p2) => p2.length > 0);
  if (pathParts.length > 0 && pathParts[pathParts.length - 1].endsWith(".git")) {
    pathParts[pathParts.length - 1] = pathParts[pathParts.length - 1].slice(0, -4);
  }
  const isAzureDevOpsHost = hostname2 === "dev.azure.com" || hostname2 === "ssh.dev.azure.com" || hostname2.endsWith(".visualstudio.com");
  if (isAzureDevOpsHost) {
    const azurePathParts = [...pathParts];
    if (hostname2 === "ssh.dev.azure.com" && azurePathParts.length > 0 && azurePathParts[0].toLowerCase() === "v3") {
      azurePathParts.shift();
    }
    const filteredAzurePathParts = azurePathParts.filter((part) => part.toLowerCase() !== "_git");
    return filteredAzurePathParts.length >= 1 ? filteredAzurePathParts.join("/") : void 0;
  }
  if (hostname2.includes("github") || hostname2.endsWith(".ghe.com")) {
    return pathParts.length >= 2 ? pathParts.slice(0, 2).join("/") : void 0;
  }
  if (hostname2.includes("gitlab")) {
    return pathParts.length >= 1 ? pathParts.join("/") : void 0;
  }
  if (hostname2.includes("bitbucket") || hostname2.includes("stash")) {
    if (pathParts.length >= 3 && pathParts[0].toLowerCase() === "scm") {
      return pathParts.slice(1, 3).join("/");
    }
    if (pathParts.length >= 2) {
      return pathParts.slice(0, 2).join("/");
    }
    return void 0;
  }
  const isGerritHost = hostname2.includes("gerrit");
  const hasGerritPath = pathParts.length > 0 && pathParts[0].toLowerCase() === "gerrit";
  if (isGerritHost || hasGerritPath) {
    const gerritPathParts = [...pathParts];
    if (hasGerritPath) {
      gerritPathParts.shift();
    }
    if (gerritPathParts.length > 0 && gerritPathParts[0].toLowerCase() === "a") {
      gerritPathParts.shift();
    }
    return gerritPathParts.length >= 1 ? gerritPathParts.join("/") : void 0;
  }
  if (pathParts.length >= 2) {
    return pathParts.slice(0, 2).join("/");
  }
  return void 0;
}

