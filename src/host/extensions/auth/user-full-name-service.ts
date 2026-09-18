init_dashboard_connect();
init_dashboard_pb();
init_errors();
init_cursor_inference();
init_cursor_token();
var GET_ME_TIMEOUT_MS = 1e4;
function nonEmpty(value) {
  const trimmed = value?.trim();
  return trimmed != null && trimmed.length > 0 ? trimmed : void 0;
}
function displayNameFrom(name17) {
  const parts = [name17.firstName?.trim(), name17.lastName?.trim()].filter(
    (part) => part != null && part.length > 0
  );
  return parts.length > 0 ? parts.join(" ") : void 0;
}
async function fetchFullNameOverBackend(backend, accessToken, getTeamId, getMachineId) {
  const client = createSandCursorBackendClient(DashboardService, {
    backend,
    getAccessToken: async () => accessToken,
    getTeamId,
    getMachineId
  });
  const me2 = await client.getMe(new GetMeRequest({}), {
    timeoutMs: GET_ME_TIMEOUT_MS
  });
  return nonEmpty(displayNameFrom({ firstName: me2.firstName, lastName: me2.lastName }));
}
function createSandUserFullNameResolver(options2) {
  const fetchFullName = options2.fetchFullName ?? ((accessToken) => fetchFullNameOverBackend(
    options2.backend,
    accessToken,
    options2.getTeamId,
    options2.getMachineId
  ));
  let resolvedPrincipal;
  let resolvedFullName;
  let inFlight;
  let inFlightGeneration = 0;
  const currentPrincipal = () => {
    const token = options2.peekAccessToken();
    if (token == null) return void 0;
    return parseJwtPayload(token)?.sub ?? void 0;
  };
  const resolve29 = async (principal) => {
    try {
      const accessToken = await options2.getAccessToken({
        backendUrl: options2.backend.backendUrl
      });
      if (parseJwtPayload(accessToken)?.sub !== principal) return;
      const fullName = await fetchFullName(accessToken);
      if (currentPrincipal() !== principal) return;
      resolvedPrincipal = principal;
      resolvedFullName = fullName;
    } catch (error41) {
      options2.log(`user full-name resolve failed: ${errorLogTag(error41)}`);
    }
  };
  return {
    getUserFullName: () => resolvedPrincipal !== void 0 && resolvedPrincipal === currentPrincipal() ? resolvedFullName : void 0,
    refresh: async () => {
      const principal = currentPrincipal();
      if (principal === void 0) return;
      if (resolvedPrincipal === principal) return;
      let pending = inFlight;
      if (pending === void 0 || pending.principal !== principal) {
        const generation = ++inFlightGeneration;
        pending = {
          principal,
          done: resolve29(principal).finally(() => {
            if (inFlightGeneration === generation) inFlight = void 0;
          })
        };
        inFlight = pending;
      }
      await pending.done;
    }
  };
}
