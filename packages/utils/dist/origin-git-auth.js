function base64Ascii(input) {
  return typeof Buffer !== "undefined" ? Buffer.from(input).toString("base64") : btoa(input);
}
function originGitHostFromBackendUrl(originBackendUrl) {
  var _a19;
  if (originBackendUrl === void 0 || originBackendUrl.trim() === "") {
    return void 0;
  }
  try {
    const url2 = new URL(originBackendUrl);
    const host = (_a19 = GIT_HOSTNAME_BY_API_HOSTNAME.get(url2.hostname)) !== null && _a19 !== void 0 ? _a19 : url2.host;
    return host.length > 0 ? host : void 0;
  } catch (_b2) {
    return void 0;
  }
}
function buildTokenBasicAuthGitConfig(hosts, token) {
  if (token === void 0 || token.length === 0) {
    return void 0;
  }
  const header = `Authorization: Basic ${base64Ascii(`x-access-token:${token}`)}`;
  return Object.fromEntries(hosts.map((host) => [`http.https://${host}/.extraheader`, header]));
}
var GIT_HOSTNAME_BY_API_HOSTNAME;
var init_origin_git_auth = __esm({
  "../packages/utils/dist/origin-git-auth.js"() {
    "use strict";
    GIT_HOSTNAME_BY_API_HOSTNAME = /* @__PURE__ */ new Map([
      ["api.origin.cursor.com", "origin.cursor.com"],
      ["api.origin-staging.cursor.com", "origin-staging.cursor.com"],
      ["api.origin-test.cursor.com", "origin-test.cursor.com"]
    ]);
  }
});
