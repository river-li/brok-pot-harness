/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auth/selected-team-reader.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_cursor_token();
function createSelectedTeamReader(deps) {
  const acquireAccessToken = bestEffortAccessToken(deps.backend, deps);
  return async (context2) => {
    if (context2 != null) {
      return deps.getSelectedTeamIdForAccountScope(context2.expectedAccountScope);
    }
    const accessToken = deps.peekAccessToken() ?? await acquireAccessToken();
    const accountScope = tokenSubjectScope(accessToken);
    if (accountScope === void 0) return void 0;
    return deps.getSelectedTeamIdForAccountScope(accountScope);
  };
}

