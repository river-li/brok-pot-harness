/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/cursor-backend/process-environment.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function settledOnFirstRead(compute) {
  let settled;
  return () => {
    settled ??= { value: compute() };
    return settled.value;
  };
}
function sandBackendIdentityOf(raw) {
  const readBackendUrl = settledOnFirstRead(
    () => backendUrlOf(raw.sandBackendUrl, raw.cursorApiBaseUrl)
  );
  const readOriginBackendUrl = settledOnFirstRead(
    () => originBackendUrlOf(raw.cursorOriginBackendUrl, readBackendUrl)
  );
  const readAuthClientId = settledOnFirstRead(
    () => authClientIdOf(readBackendUrl(), raw.authClientIdOverride)
  );
  const boxNamespace = sandBoxNamespaceOf(raw.boxOwnerNamespace, raw.variant);
  return {
    get backendUrl() {
      return readBackendUrl();
    },
    get originBackendUrl() {
      return readOriginBackendUrl();
    },
    get authClientId() {
      return readAuthClientId();
    },
    clientVersion: sandClientVersionOf(raw.clientAppVersion, boxNamespace),
    boxNamespace,
    clientOS: raw.platform
  };
}
function readSandProcessEnvironment(env, platform = process.platform) {
  const packaged = env.SAND_PACKAGED === "1";
  const labBuild = env.SAND_LAB === "1";
  const variant = sandVariantOf(packaged, labBuild);
  return {
    backend: sandBackendIdentityOf({
      sandBackendUrl: env.SAND_BACKEND_URL,
      cursorApiBaseUrl: env.CURSOR_API_BASE_URL,
      cursorOriginBackendUrl: env.CURSOR_ORIGIN_BACKEND_URL,
      authClientIdOverride: env.SAND_AUTH_CLIENT_ID,
      clientAppVersion: env.SAND_CLIENT_APP_VERSION,
      boxOwnerNamespace: env.SAND_BOX_OWNER_NAMESPACE,
      variant,
      platform
    }),
    rawBackendUrl: env.SAND_BACKEND_URL,
    authClientIdOverride: env.SAND_AUTH_CLIENT_ID,
    packaged,
    labBuild,
    variant,
    telemetryDisabled: env.SAND_DISABLE_TELEMETRY === "1",
    analyticsOptedOut: env.SAND_DISABLE_TELEMETRY === "1" || env.SAND_DISABLE_ANALYTICS === "1",
    analyticsDebug: env.SAND_ANALYTICS_DEBUG === "1",
    featureGateOverrides: parseGateOverrides(env.SAND_FEATURE_GATE_OVERRIDES),
    dynamicConfigOverrides: env.SAND_DYNAMIC_CONFIG_OVERRIDES,
    modelExperimentOverride: parseSandModelExperimentOverride(env.SAND_MODEL_EXPERIMENT_OVERRIDE),
    groupChatDiscouragementExperimentOverride: parseGroupChatDiscouragementPolicy(
      env.SAND_GROUP_CHAT_DISCOURAGEMENT_EXPERIMENT_OVERRIDE
    ),
    egressTunnel: resolveEgressTunnelEnvConfig(env),
    boxComputer: {
      runtime: resolveBoxComputerRuntime({ boxMcpActive: false }, env),
      entry: resolveBoxComputerEntry(env)
    },
    childProcessEnvironment: env
  };
}

