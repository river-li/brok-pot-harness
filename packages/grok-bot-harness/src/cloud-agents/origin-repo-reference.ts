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
  const hostname3 = repoReferenceAsUrl(raw)?.hostname;
  return hostname3 != null && isOriginGitHost(hostname3) || portalRepoCloneUrl(raw) != null;
}
function normalizeLaunchRepoReference(raw) {
  return portalRepoCloneUrl(raw) ?? raw;
}
