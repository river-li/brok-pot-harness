function trimRemotePath(pathname) {
  let end = pathname.length;
  while (end > 0 && pathname.charCodeAt(end - 1) === 47) {
    end--;
  }
  const normalizedPath = pathname.slice(0, end).replace(/\.git$/i, "");
  if (!normalizedPath || normalizedPath === "/") {
    return "";
  }
  return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
}
function toSanitizationCandidate(rawUrl) {
  var _a19;
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl);
  if (hasScheme) {
    return rawUrl;
  }
  const httpsCandidate = `https://${rawUrl}`;
  try {
    void new URL(httpsCandidate);
    return httpsCandidate;
  } catch (_b2) {
    const scpLikeMatch = rawUrl.match(/^([^@/\s]+@)?([^:/\s]+):(.+)$/);
    if (scpLikeMatch) {
      const userInfo = (_a19 = scpLikeMatch[1]) !== null && _a19 !== void 0 ? _a19 : "";
      const host = scpLikeMatch[2];
      const path31 = scpLikeMatch[3];
      return `ssh://${userInfo}${host}/${path31}`;
    }
    return httpsCandidate;
  }
}
function buildSanitizedRepoIdentity(host, pathname) {
  const normalizedPath = trimRemotePath(pathname);
  if (!normalizedPath) {
    return "";
  }
  return `${host}${normalizedPath}`.toLowerCase();
}
function sanitizeRemoteUrl(raw) {
  const cached2 = sanitizedRemoteUrlCache.get(raw);
  if (cached2 !== void 0) {
    return cached2;
  }
  const sanitized = computeSanitizedRemoteUrl(raw);
  if (sanitizedRemoteUrlCache.size >= SANITIZED_REMOTE_URL_CACHE_MAX_SIZE) {
    sanitizedRemoteUrlCache.clear();
  }
  sanitizedRemoteUrlCache.set(raw, sanitized);
  return sanitized;
}
function computeSanitizedRemoteUrl(raw) {
  const rawUrl = raw.trim();
  if (!rawUrl) {
    return "";
  }
  try {
    const candidate = toSanitizationCandidate(rawUrl);
    const parsed2 = new URL(candidate);
    return buildSanitizedRepoIdentity(parsed2.hostname, parsed2.pathname);
  } catch (_a19) {
    const fallback2 = rawUrl.replace(/^(?:https?|ssh|git):\/\//i, "");
    const firstSlash = fallback2.indexOf("/");
    const authority = firstSlash === -1 ? fallback2 : fallback2.slice(0, firstSlash);
    const path31 = firstSlash === -1 ? "" : fallback2.slice(firstSlash);
    const sanitizedAuthority = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
    return buildSanitizedRepoIdentity(sanitizedAuthority, path31);
  }
}
function isOriginGitHost(host) {
  return /^origin(-[a-z0-9]+)?\.cursor\.com$/i.test(host);
}
function parseOriginPortalRepoPage(url2) {
  let parsed2;
  try {
    parsed2 = typeof url2 === "string" ? new URL(url2) : url2;
  } catch (_a19) {
    return void 0;
  }
  if (parsed2.protocol !== "https:" || parsed2.port !== "" || parsed2.username !== "" || parsed2.password !== "") {
    return void 0;
  }
  const gitHost = ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME.get(parsed2.hostname);
  const [route, owner, name17, ...pagePath] = parsed2.pathname.replace(/\/$/, "").split("/").slice(1);
  if (gitHost === void 0 || route !== "codebase" || !owner || !name17 || pagePath.includes("")) {
    return void 0;
  }
  return { gitHost, owner, name: name17, pagePath };
}
function parseRemoteUrlForOriginCheck(rawUrl) {
  let url2 = rawUrl.trim();
  if (url2 === "") {
    return void 0;
  }
  if (url2.startsWith("git@")) {
    url2 = `https://${url2.slice("git@".length).replace(":", "/")}`;
  } else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url2) && !/^https?:\/\//i.test(url2)) {
    url2 = url2.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "https://");
  } else if (!/^https?:\/\//i.test(url2)) {
    url2 = `https://${url2}`;
  }
  try {
    return new URL(url2);
  } catch (_a19) {
    return void 0;
  }
}
function parseOriginRepoCloneUrlParts(remoteUrl) {
  if (remoteUrl === void 0) {
    return void 0;
  }
  if (originRepoClonePartsCache.has(remoteUrl)) {
    return originRepoClonePartsCache.get(remoteUrl);
  }
  const parts = computeOriginRepoCloneUrlParts(remoteUrl);
  if (originRepoClonePartsCache.size >= ORIGIN_REPO_CLONE_PARTS_CACHE_MAX_SIZE) {
    originRepoClonePartsCache.clear();
  }
  originRepoClonePartsCache.set(remoteUrl, parts);
  return parts;
}
function computeOriginRepoCloneUrlParts(remoteUrl) {
  var _a19, _b2;
  const parsed2 = remoteUrl ? parseRemoteUrlForOriginCheck(remoteUrl) : void 0;
  if (parsed2 === void 0 || !isOriginGitHost(parsed2.hostname)) {
    return void 0;
  }
  const segments = trimRemotePath(parsed2.pathname).split("/").filter(Boolean);
  const isLegacyShape = segments.length === 3 && ((_a19 = segments[0]) === null || _a19 === void 0 ? void 0 : _a19.toLowerCase()) === "git";
  const isRootShape = segments.length === 2 && ((_b2 = segments[0]) === null || _b2 === void 0 ? void 0 : _b2.toLowerCase()) !== "git";
  if (!isLegacyShape && !isRootShape) {
    return void 0;
  }
  const owner = isLegacyShape ? segments[1] : segments[0];
  const name17 = isLegacyShape ? segments[2] : segments[1];
  if (!owner || !name17) {
    return void 0;
  }
  return Object.freeze({ hostname: parsed2.hostname, owner, name: name17 });
}
function originRepoClonePath({ owner, name: name17 }) {
  return `/git/${owner}/${name17}`;
}
function originRepoCloneIdentity(remoteUrl) {
  const parts = parseOriginRepoCloneUrlParts(remoteUrl);
  if (parts === void 0) {
    return void 0;
  }
  return `${parts.hostname}/git/${parts.owner}/${parts.name}`.toLowerCase();
}
function repoComparisonKey(repoUrl) {
  var _a19;
  return (_a19 = originRepoCloneIdentity(repoUrl)) !== null && _a19 !== void 0 ? _a19 : sanitizeRemoteUrl(repoUrl);
}
function repoIdentityKey(repoUrl) {
  return repoComparisonKey(repoUrl);
}
function repoIdentityKeysEqual(a, b2) {
  return a.length > 0 && a === b2;
}
var sanitizedRemoteUrlCache, SANITIZED_REMOTE_URL_CACHE_MAX_SIZE, ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME, originRepoClonePartsCache, ORIGIN_REPO_CLONE_PARTS_CACHE_MAX_SIZE, AGENT_TEMP_DRAFT_REPO_NAME_PREFIX, AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH, AGENT_TEMP_DRAFT_REPO_NAME_PATTERN;
var init_repo_url = __esm({
  "../packages/utils/dist/repo-url.js"() {
    "use strict";
    sanitizedRemoteUrlCache = /* @__PURE__ */ new Map();
    SANITIZED_REMOTE_URL_CACHE_MAX_SIZE = 2048;
    ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME = /* @__PURE__ */ new Map([
      ["cursor.com", "origin.cursor.com"],
      ["www.cursor.com", "origin.cursor.com"],
      ["staging.cursor.com", "origin-staging.cursor.com"]
    ]);
    originRepoClonePartsCache = /* @__PURE__ */ new Map();
    ORIGIN_REPO_CLONE_PARTS_CACHE_MAX_SIZE = 2048;
    AGENT_TEMP_DRAFT_REPO_NAME_PREFIX = "tmp-";
    AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH = 16;
    AGENT_TEMP_DRAFT_REPO_NAME_PATTERN = new RegExp(`^${AGENT_TEMP_DRAFT_REPO_NAME_PREFIX}[0-9a-f]{${AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH}}$`);
  }
});
