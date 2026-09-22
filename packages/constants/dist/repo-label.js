/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/repo-label.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isKnownGitHostingDomain(hostname3) {
  const lowerHostname = hostname3.toLowerCase();
  if (KNOWN_GIT_HOSTING_DOMAINS.has(lowerHostname)) {
    return true;
  }
  for (const domain2 of KNOWN_GIT_HOSTING_DOMAINS) {
    if (lowerHostname.endsWith(`.${domain2}`)) {
      return true;
    }
  }
  return false;
}
function rewriteScpGitUrl(raw) {
  if (raw.includes("://")) {
    return raw;
  }
  const scpMatch = raw.match(/^[^@/]+@([^:]+):(.+)$/);
  if (scpMatch === null) {
    return raw;
  }
  return `https://${scpMatch[1]}/${scpMatch[2]}`;
}
function trimRepoPath(pathname) {
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "").replace(/\.git$/, "");
}
function extractOwnerRepoFromPath(pathname) {
  const normalizedPath = trimRepoPath(pathname);
  const pathParts = normalizedPath.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    return void 0;
  }
  const owner = pathParts[0];
  const repo = pathParts.slice(1).join("/");
  return `${owner}/${repo}`;
}
function parseRepoNameFromUrl(repoUrl) {
  if (repoUrl === null || repoUrl === void 0) {
    return void 0;
  }
  try {
    const trimmedRepoUrl = repoUrl.trim();
    if (trimmedRepoUrl.length === 0) {
      return void 0;
    }
    if (trimmedRepoUrl.includes("://")) {
      const parsedUrl = new URL(trimmedRepoUrl);
      if (isOriginRepoHost(parsedUrl.hostname)) {
        return extractOwnerRepoFromOriginPath(parsedUrl.pathname);
      }
      return extractOwnerRepoFromPath(parsedUrl.pathname);
    }
    const firstSlashIndex = trimmedRepoUrl.indexOf("/");
    if (firstSlashIndex === -1) {
      return void 0;
    }
    const firstSegment = trimmedRepoUrl.slice(0, firstSlashIndex);
    const remainingPath = trimmedRepoUrl.slice(firstSlashIndex);
    if (isOriginRepoHost(firstSegment.replace(/:\d+$/, ""))) {
      return extractOwnerRepoFromOriginPath(remainingPath);
    }
    if (isKnownGitHostingDomain(firstSegment)) {
      return extractOwnerRepoFromPath(remainingPath);
    }
    return extractOwnerRepoFromPath(`/${trimmedRepoUrl}`);
  } catch (_a19) {
    return void 0;
  }
}
function isOriginRepoHost(hostname3) {
  return ORIGIN_WEB_HOST_PATTERN.test(hostname3);
}
function extractOwnerRepoFromOriginPath(pathname) {
  const segments = trimRepoPath(pathname).split("/").filter(Boolean);
  const isLegacyShape = segments.length === 3 && segments[0].toLowerCase() === "git";
  if (isLegacyShape) {
    return `${segments[1]}/${segments[2]}`;
  }
  const isRootShape = segments.length === 2 && segments[0].toLowerCase() !== "git";
  if (isRootShape) {
    return `${segments[0]}/${segments[1]}`;
  }
  return void 0;
}
function parseSelfHostedRepoScope(repoUrl) {
  let parseCandidate = repoUrl;
  if (!parseCandidate.includes("://")) {
    const firstSlashIndex = parseCandidate.indexOf("/");
    if (firstSlashIndex === -1) {
      return void 0;
    }
    const firstSegment = parseCandidate.slice(0, firstSlashIndex);
    if (!firstSegment.includes(".") || isKnownGitHostingDomain(firstSegment)) {
      return void 0;
    }
    parseCandidate = `https://${parseCandidate}`;
  }
  try {
    const parsedUrl = new URL(parseCandidate);
    if (isKnownGitHostingDomain(parsedUrl.hostname) || isOriginRepoHost(parsedUrl.hostname)) {
      return void 0;
    }
    const pathParts = trimRepoPath(parsedUrl.pathname).split("/").filter(Boolean);
    if (pathParts.length === 0) {
      return void 0;
    }
    return `${parsedUrl.host}/${pathParts.join("/")}`;
  } catch (_a19) {
    return void 0;
  }
}
function deriveRepoLabelValueFromUrl(repoUrl) {
  var _a19;
  if (repoUrl === null || repoUrl === void 0) {
    return void 0;
  }
  const trimmed = repoUrl.trim();
  if (trimmed === "") {
    return void 0;
  }
  const rewritten = rewriteScpGitUrl(trimmed);
  return (_a19 = parseSelfHostedRepoScope(rewritten)) !== null && _a19 !== void 0 ? _a19 : parseRepoNameFromUrl(rewritten);
}
var KNOWN_GIT_HOSTING_DOMAINS, ORIGIN_WEB_HOST_PATTERN;
var init_repo_label = __esm({
  "../packages/constants/dist/repo-label.js"() {
    "use strict";
    KNOWN_GIT_HOSTING_DOMAINS = /* @__PURE__ */ new Set([
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "bitbucket.com",
      "codeberg.org",
      "gitea.com",
      "sr.ht"
    ]);
    ORIGIN_WEB_HOST_PATTERN = /^origin(?:-[a-z0-9]+)?\.cursor\.com$/i;
  }
});

