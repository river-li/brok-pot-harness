/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/repo-url.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isOriginGitHost(host) {
  return /^origin(-[a-z0-9]+)?\.cursor\.com$/i.test(host);
}
function parseOriginPortalRepoPage(url2) {
  let parsed;
  try {
    parsed = typeof url2 === "string" ? new URL(url2) : url2;
  } catch (_a20) {
    return void 0;
  }
  if (parsed.protocol !== "https:" || parsed.port !== "" || parsed.username !== "" || parsed.password !== "") {
    return void 0;
  }
  const gitHost = ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME.get(parsed.hostname);
  const [route, owner, name17, ...pagePath] = parsed.pathname.replace(/\/$/, "").split("/").slice(1);
  if (gitHost === void 0 || route !== "codebase" || !owner || !name17 || pagePath.includes("")) {
    return void 0;
  }
  return { gitHost, owner, name: name17, pagePath };
}
function originRepoClonePath({ owner, name: name17 }) {
  return `/git/${owner}/${name17}`;
}
var ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME, AGENT_TEMP_DRAFT_REPO_NAME_PREFIX, AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH, AGENT_TEMP_DRAFT_REPO_NAME_PATTERN;
var init_repo_url = __esm({
  "../packages/utils/dist/repo-url.js"() {
    "use strict";
    ORIGIN_GIT_HOST_BY_PORTAL_HOSTNAME = /* @__PURE__ */ new Map([
      ["cursor.com", "origin.cursor.com"],
      ["www.cursor.com", "origin.cursor.com"],
      ["staging.cursor.com", "origin-staging.cursor.com"]
    ]);
    AGENT_TEMP_DRAFT_REPO_NAME_PREFIX = "tmp-";
    AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH = 16;
    AGENT_TEMP_DRAFT_REPO_NAME_PATTERN = new RegExp(`^${AGENT_TEMP_DRAFT_REPO_NAME_PREFIX}[0-9a-f]{${AGENT_TEMP_DRAFT_REPO_NAME_HEX_LENGTH}}$`);
  }
});

