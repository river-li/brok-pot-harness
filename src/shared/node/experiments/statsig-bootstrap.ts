/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/statsig-bootstrap.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs60 = require("node:fs");
var import_node_path104 = require("node:path");
init_request();

// @recovered-fragment 2/2
init_errors();
init_unknown_record();
init_cursor_inference();
init_sand_client_metadata();
var STATSIG_CLIENT_KEY = "client-Bm4HJ0aDjXHQVsoACMREyLNxm5p6zzuzhO50MgtoT5D";
var STATSIG_LOG_EVENT_PROXY_URL = "https://api3.cursor.sh/tev1/v1";
var STATSIG_USER_HYDRATED_EVENT = "sand_statsig_user_hydrated";
var BOOTSTRAP_CACHE_FILENAME = "sand-statsig-bootstrap.json";
function sandStatsigNetworkUrlAllowed(url2) {
  return url2.includes("/rgstr");
}
function sandStatsigNetworkOverride(url2, args) {
  if (sandStatsigNetworkUrlAllowed(url2)) {
    return fetch(url2, args);
  }
  return Promise.resolve(new Response(null, { status: 204 }));
}
function parseStatsigBootstrap(config2, appVersion) {
  const values = JSON.parse(config2);
  if (config2 === "{}" || !isUnknownRecord(values)) return { config: config2, values, user: {} };
  const user = isUnknownRecord(values.user) ? values.user : {};
  if (user.appVersion === appVersion) return { config: config2, values, user };
  const stamped = { ...values, user: { ...user, appVersion } };
  return { config: JSON.stringify(stamped), values: stamped, user: stamped.user };
}
function readStatsigBootstrapUserId(config2) {
  try {
    const parsed2 = JSON.parse(config2);
    if (parsed2 == null || typeof parsed2 !== "object" || !("user" in parsed2)) return null;
    const user = parsed2.user;
    if (user == null || typeof user !== "object" || !("userID" in user)) return null;
    return typeof user.userID === "string" ? user.userID : null;
  } catch (error42) {
    reportExperimentsDiagnostic({
      kind: "bootstrap_config_unparseable",
      errorClass: errorLogTag(error42)
    });
    return null;
  }
}
function isStatsigBootstrapTeamStateUnavailableError(error42) {
  return errorLogTag(error42) === SAND_AUTH_SELECTED_TEAM_STATE_ERROR_TAG;
}
async function fetchStatsigBootstrap(options2) {
  const { backend, deadline, getAccessToken, getMachineId, getTeamId, signal } = options2;
  const backendUrl = backend.backendUrl;
  return await deadline.run(async (runSignal) => {
    const accessToken = await getAccessToken({ backendUrl }).catch((error42) => {
      reportExperimentsDiagnostic({
        kind: "bootstrap_anonymous",
        errorClass: errorLogTag(error42)
      });
      return void 0;
    });
    const machineId = await getMachineId();
    const headers = new Headers({
      "content-type": "application/json",
      "x-cursor-checksum": createCursorChecksum(machineId),
      ...getSandBackendClientHeaders(backend),
      "x-ghost-mode": "true",
      "x-request-id": crypto.randomUUID()
    });
    if (accessToken != null) {
      const auth2 = await resolveSandBackendAuthContext({ accessToken, getTeamId }).catch(
        (error42) => {
          if (isStatsigBootstrapTeamStateUnavailableError(error42)) {
            reportExperimentsDiagnostic({
              kind: "bootstrap_team_state_unavailable",
              errorClass: errorLogTag(error42)
            });
          }
          throw error42;
        }
      );
      headers.set("authorization", `Bearer ${auth2.accessToken}`);
      if (auth2.teamId !== void 0) {
        headers.set("x-cursor-team-id", String(auth2.teamId));
      }
    }
    applyLocalCliModeHeader(headers);
    const operatingSystem = statsigClientOsOf(backend.clientOS);
    const response = await fetch(
      new URL("aiserver.v1.AnalyticsService/BootstrapStatsig", backendUrl),
      {
        method: "POST",
        headers,
        body: JSON.stringify(operatingSystem === void 0 ? {} : { operatingSystem }),
        signal: runSignal
      }
    );
    if (!response.ok) {
      return {
        retryAfterMs: parseRetryAfterHeaderMs(response.headers.get("retry-after"))
      };
    }
    const data = await response.json();
    if (data == null || typeof data !== "object" || !("config" in data)) {
      return {};
    }
    return { config: typeof data.config === "string" ? data.config : void 0 };
  }, signal);
}
function bootstrapCachePath(cacheDir) {
  return (0, import_node_path104.join)(cacheDir, BOOTSTRAP_CACHE_FILENAME);
}
function loadCachedBootstrap(cacheDir) {
  const path31 = bootstrapCachePath(cacheDir);
  try {
    if (!(0, import_node_fs60.existsSync)(path31)) {
      return null;
    }
    const parsed2 = JSON.parse((0, import_node_fs60.readFileSync)(path31, "utf-8"));
    if (parsed2 == null || typeof parsed2 !== "object" || !("config" in parsed2)) {
      return null;
    }
    if (typeof parsed2.config !== "string") {
      return null;
    }
    const userId = "userId" in parsed2 ? parsed2.userId : void 0;
    const fetchedAtMs = "fetchedAtMs" in parsed2 ? parsed2.fetchedAtMs : void 0;
    return {
      config: parsed2.config,
      userId: typeof userId === "string" ? userId : null,
      ...typeof fetchedAtMs === "number" && Number.isFinite(fetchedAtMs) && fetchedAtMs >= 0 ? { fetchedAtMs } : {}
    };
  } catch (error42) {
    reportExperimentsDiagnostic({
      kind: "bootstrap_cache_read_failed",
      errorClass: errorLogTag(error42)
    });
    return null;
  }
}
async function saveCachedBootstrap(cacheDir, cache3) {
  try {
    await writeFileAtomic(bootstrapCachePath(cacheDir), JSON.stringify(cache3));
    return true;
  } catch (error42) {
    reportExperimentsDiagnostic({
      kind: "bootstrap_cache_write_failed",
      errorClass: errorLogTag(error42)
    });
    return false;
  }
}

