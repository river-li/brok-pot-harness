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
