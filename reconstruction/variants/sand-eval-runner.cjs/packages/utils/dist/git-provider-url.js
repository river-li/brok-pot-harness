/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/git-provider-url.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function stripGitSuffix(segment) {
  return segment.replace(GIT_SUFFIX, "");
}
function decodeBitbucketPathSegment(segment) {
  let decodedSegment;
  try {
    decodedSegment = decodeURIComponent(segment);
  } catch (_a20) {
    return void 0;
  }
  return decodedSegment.length > 0 && !decodedSegment.includes("/") ? decodedSegment : void 0;
}
function isGitHubDotComHost(hostname2) {
  const normalizedHostname2 = hostname2.toLowerCase();
  return normalizedHostname2 === "github.com" || normalizedHostname2.endsWith(".github.com");
}
function isGitLabHost(hostname2) {
  return hostname2.toLowerCase().split(".").includes("gitlab");
}
function isBitbucketCloudHost(hostname2) {
  const normalizedHostname2 = hostname2.toLowerCase();
  return normalizedHostname2 === "bitbucket.org" || normalizedHostname2 === "www.bitbucket.org";
}
function isAzureDevopsServicesHost(hostname2) {
  const normalizedHostname2 = hostname2.toLowerCase();
  return normalizedHostname2 === "dev.azure.com" || normalizedHostname2 === "www.dev.azure.com";
}
function parseGitHubRepositoryPathSegments(segments) {
  const owner = segments[0];
  const rawRepo = segments[1];
  if (!owner || !rawRepo) {
    return void 0;
  }
  const repo = stripGitSuffix(rawRepo);
  if (!repo) {
    return void 0;
  }
  return {
    owner,
    repo,
    hasSubpath: segments.length > 2
  };
}
function parseGitLabRepositoryPathSegments(segments) {
  const specialRouteIndex = segments.indexOf("-");
  const hasSpecialRouteSeparator = specialRouteIndex !== -1;
  const repositorySegments = hasSpecialRouteSeparator ? segments.slice(0, specialRouteIndex) : [...segments];
  if (repositorySegments.length < 2 || repositorySegments.some((segment) => segment.length === 0)) {
    return void 0;
  }
  const repo = stripGitSuffix(repositorySegments[repositorySegments.length - 1]);
  if (!repo) {
    return void 0;
  }
  repositorySegments[repositorySegments.length - 1] = repo;
  return {
    repositorySegments,
    hasSpecialRouteSeparator
  };
}
function parseBitbucketRepositoryPathSegments(segments) {
  const rawWorkspace = segments[0];
  const rawRepo = segments[1];
  if (rawWorkspace === void 0 || rawRepo === void 0) {
    return void 0;
  }
  const workspace = decodeBitbucketPathSegment(rawWorkspace);
  const decodedRepo = decodeBitbucketPathSegment(rawRepo);
  if (workspace === void 0 || decodedRepo === void 0 || BITBUCKET_NON_REPOSITORY_ROOT_PATHS.has(workspace.toLowerCase())) {
    return void 0;
  }
  const repo = stripGitSuffix(decodedRepo);
  if (!repo) {
    return void 0;
  }
  return {
    workspace: encodeURIComponent(workspace),
    repo: encodeURIComponent(repo),
    hasSubpath: segments.length > 2
  };
}
function parseAzureDevopsRepositoryPathSegments(segments) {
  const gitIndex = segments.findIndex((segment) => segment.toLowerCase() === "_git");
  if (gitIndex < 1 || gitIndex > 2) {
    return void 0;
  }
  const organization = segments[0];
  const rawRepo = segments[gitIndex + 1];
  if (!organization || !rawRepo) {
    return void 0;
  }
  const repo = stripGitSuffix(rawRepo);
  if (!repo) {
    return void 0;
  }
  const project2 = gitIndex === 2 ? segments[1] : repo;
  if (!project2) {
    return void 0;
  }
  return {
    organization,
    project: project2,
    repo,
    hasSubpath: segments.length > gitIndex + 2
  };
}
var GIT_SUFFIX, BITBUCKET_NON_REPOSITORY_ROOT_PATHS;
var init_git_provider_url = __esm({
  "../packages/utils/dist/git-provider-url.js"() {
    "use strict";
    GIT_SUFFIX = /\.git$/i;
    BITBUCKET_NON_REPOSITORY_ROOT_PATHS = /* @__PURE__ */ new Set(["account", "dashboard"]);
  }
});

