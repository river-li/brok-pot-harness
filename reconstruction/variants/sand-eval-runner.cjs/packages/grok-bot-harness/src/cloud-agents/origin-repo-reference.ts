/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/origin-repo-reference.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
function repoReferenceAsUrl(raw) {
  const trimmed = raw?.trim() ?? "";
  if (trimmed.length === 0) return null;
  const withScheme = trimmed.replace(/^git@([^:/]+):/, "https://$1/");
  try {
    return new URL(
      /^[a-z][a-z0-9+.-]*:\/\//i.test(withScheme) ? withScheme : `https://${withScheme}`
    );
  } catch {
    return null;
  }
}
function portalRepoCloneUrl(raw) {
  const url2 = repoReferenceAsUrl(raw);
  const page = url2 == null ? void 0 : parseOriginPortalRepoPage(url2);
  if (page === void 0) return null;
  return `https://${page.gitHost}${originRepoClonePath(page)}.git`;
}
function isOriginRepoReference(raw) {
  const hostname2 = repoReferenceAsUrl(raw)?.hostname;
  return hostname2 != null && isOriginGitHost(hostname2) || portalRepoCloneUrl(raw) != null;
}

