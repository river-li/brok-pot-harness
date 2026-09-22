/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/origin-git-auth.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
var ORIGIN_GIT_HOSTS = ["origin.cursor.com"];
var PREFER_ORIGIN_READS_HEADER = "x-prefer-origin-reads: true";
function buildOriginTokenGitConfig(token, extraOriginHosts = []) {
  const trimmedExtra = extraOriginHosts.filter((host) => host.trim() !== "");
  const hosts = trimmedExtra.length === 0 ? ORIGIN_GIT_HOSTS : [.../* @__PURE__ */ new Set([...ORIGIN_GIT_HOSTS, ...trimmedExtra])];
  const basicAuthConfig = buildTokenBasicAuthGitConfig(hosts, token);
  if (basicAuthConfig === void 0) {
    return void 0;
  }
  return Object.fromEntries(Object.entries(basicAuthConfig).map(([key, authHeader]) => [
    key,
    [authHeader, PREFER_ORIGIN_READS_HEADER]
  ]));
}

