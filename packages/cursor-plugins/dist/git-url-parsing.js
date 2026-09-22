init_dist3();
function detectNonGitHubProvider(host) {
  const lowerHost = host.toLowerCase();
  if (isGitLabHost(host)) {
    return "GitLab";
  }
  if (lowerHost.includes("bitbucket")) {
    return "Bitbucket";
  }
  if (lowerHost.includes("gitea") || lowerHost.includes("codeberg")) {
    return "Gitea/Codeberg";
  }
  if (lowerHost.includes("azure") && lowerHost.includes("dev")) {
    return "Azure DevOps";
  }
  return null;
}
function getProvider(host) {
  if (isGitHubDotComHost(host)) {
    return "github";
  }
  if (isGitLabHost(host)) {
    return "gitlab";
  }
  if (isBitbucketCloudHost(host)) {
    return "bitbucket";
  }
  if (isAzureDevopsServicesHost(host)) {
    return "azure_devops";
  }
  return "generic";
}
function parseGitUrl(gitUrl) {
  var _a19;
  let url2;
  try {
    const normalized = gitUrl.startsWith("git@") ? `ssh://${gitUrl.replace(":", "/")}` : gitUrl;
    url2 = new URL(normalized.includes("://") ? normalized : `https://${normalized}`);
  } catch (_b2) {
    return null;
  }
  const host = url2.hostname;
  let pathSegments = url2.pathname.split("/").filter(Boolean);
  if (isOriginGitHost(host) && ((_a19 = pathSegments[0]) === null || _a19 === void 0 ? void 0 : _a19.toLowerCase()) === "git") {
    pathSegments = pathSegments.slice(1);
  }
  if (pathSegments.length >= 3 && pathSegments[0].toLowerCase() === "scm") {
    pathSegments = pathSegments.slice(1);
  }
  const repositoryPath = parseGitHubRepositoryPathSegments(pathSegments);
  if (repositoryPath === void 0) {
    return null;
  }
  return {
    provider: getProvider(host),
    owner: repositoryPath.owner,
    repo: repositoryPath.repo,
    host
  };
}
function hasBitbucketServerScmPrefix(input) {
  const url2 = normalizeToUrl(input);
  if (url2 === null) {
    return false;
  }
  const segments = url2.pathname.split("/").filter(Boolean);
  return segments.length >= 3 && segments[0].toLowerCase() === "scm";
}
function normalizeToUrl(gitUrl) {
  try {
    const normalized = gitUrl.startsWith("git@") ? `ssh://${gitUrl.replace(":", "/")}` : gitUrl;
    return new URL(normalized.includes("://") ? normalized : `https://${normalized}`);
  } catch (_a19) {
    return null;
  }
}
function bitbucketPathSegments(url2) {
  const segments = url2.pathname.split("/");
  if (segments[0] === "") {
    segments.shift();
  }
  if (segments[segments.length - 1] === "") {
    segments.pop();
  }
  return segments;
}
function parseBitbucketRepositoryUrl(input) {
  const url2 = normalizeToUrl(input.trim());
  if (url2 === null || !isBitbucketCloudHost(url2.hostname)) {
    return void 0;
  }
  return parseBitbucketRepositoryPathSegments(bitbucketPathSegments(url2));
}
function parseAndValidateScmUrl(input) {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { error: "URL cannot be empty" };
  }
  const parsed2 = parseGitUrl(trimmed);
  if (parsed2 === null) {
    return {
      error: "Invalid URL format. Expected: github.com/owner/repo or gitlab.com/namespace/repo"
    };
  }
  if (isGitLabHost(parsed2.host)) {
    const url2 = normalizeToUrl(trimmed);
    const repositoryPath = url2 === null ? void 0 : parseGitLabRepositoryPathSegments(url2.pathname.split("/").filter(Boolean));
    if (url2 === null || repositoryPath === void 0) {
      return {
        error: "Invalid GitLab repository URL format. Expected: https://gitlab.com/namespace/repo"
      };
    }
    const host = url2.host.replace(/^www\./i, "");
    return {
      url: `https://${host}/${repositoryPath.repositorySegments.join("/")}`,
      owner: repositoryPath.repositorySegments[0],
      repo: repositoryPath.repositorySegments[repositoryPath.repositorySegments.length - 1],
      host,
      provider: "gitlab"
    };
  }
  if (parsed2.provider === "bitbucket") {
    const repositoryPath = parseBitbucketRepositoryUrl(trimmed);
    if (repositoryPath === void 0) {
      return {
        error: "Invalid Bitbucket repository URL format. Expected: https://bitbucket.org/{workspace}/{repo}"
      };
    }
    const host = parsed2.host.replace(/^www\./i, "");
    return {
      url: `https://${host}/${repositoryPath.workspace}/${repositoryPath.repo}`,
      owner: repositoryPath.workspace,
      repo: repositoryPath.repo,
      host,
      provider: "bitbucket"
    };
  }
  if (parsed2.provider === "azure_devops") {
    const url2 = normalizeToUrl(trimmed);
    const repositoryPath = url2 === null ? void 0 : parseAzureDevopsRepositoryPathSegments(url2.pathname.split("/").filter(Boolean));
    if (url2 === null || repositoryPath === void 0) {
      return {
        error: "Invalid Azure DevOps repository URL format. Expected: https://dev.azure.com/{organization}/{project}/_git/{repo}"
      };
    }
    const host = parsed2.host.replace(/^www\./i, "");
    return {
      url: `https://${host}/${repositoryPath.organization}/${repositoryPath.project}/_git/${repositoryPath.repo}`,
      owner: repositoryPath.organization,
      repo: repositoryPath.repo,
      host,
      provider: "azure_devops",
      project: repositoryPath.project
    };
  }
  if (isGitHubCompatibleHost(parsed2)) {
    const host = canonicalRepoHost(parsed2.host.replace(/^www\./i, ""));
    const pathPrefix = hasBitbucketServerScmPrefix(trimmed) ? "scm/" : "";
    return {
      url: `https://${host}/${pathPrefix}${parsed2.owner}/${parsed2.repo}`,
      owner: parsed2.owner,
      repo: parsed2.repo,
      host,
      provider: "github"
    };
  }
  const nonGitHubProvider = detectNonGitHubProvider(parsed2.host);
  return {
    error: `Only GitHub, GitLab, Bitbucket, and Azure DevOps URLs are currently supported.${nonGitHubProvider !== null ? ` ${nonGitHubProvider} is not supported yet.` : ""}`
  };
}
function isGitHubCompatibleHost(parsed2) {
  switch (parsed2.provider) {
    case "github":
      return true;
    case "generic":
      if (isOriginGitHost(parsed2.host)) {
        return false;
      }
      return detectNonGitHubProvider(parsed2.host) === null;
    case "gitlab":
    case "bitbucket":
    case "azure_devops":
      return false;
    default: {
      const _exhaustive = parsed2.provider;
      return false;
    }
  }
}
function toScmSshUrl(gitUrl) {
  const scm = parseAndValidateScmUrl(gitUrl);
  if ("error" in scm) {
    return null;
  }
  switch (scm.provider) {
    case "github":
      return `git@${scm.host}:${scm.owner}/${scm.repo}.git`;
    case "gitlab":
      return gitlabScmToSshUrl(scm);
    case "bitbucket":
    case "azure_devops":
      return null;
    default: {
      const _exhaustive = scm.provider;
      return null;
    }
  }
}
function gitlabScmToSshUrl(scm) {
  let pathname;
  try {
    pathname = new URL(scm.url).pathname.replace(/^\//, "").replace(/\.git$/i, "");
  } catch (_a19) {
    return null;
  }
  if (pathname.length === 0) {
    return null;
  }
  const hostWithoutPort = scm.host.replace(/:\d+$/, "");
  return `git@${hostWithoutPort}:${pathname}.git`;
}
function canonicalRepoHost(host) {
  if (isGitHubDotComHost(host)) {
    return "github.com";
  }
  return host;
}
