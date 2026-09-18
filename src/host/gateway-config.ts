var SandGatewayConfigError = class extends SandDomainError {
  name = "SandGatewayConfigError";
};
function isTruthyEnv(value) {
  if (value == null) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
function readPort(raw) {
  if (raw == null || raw.length === 0) return void 0;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isInteger(parsed2) && parsed2 > 0 ? parsed2 : void 0;
}
function resolveTls(env) {
  const certPath = env.SAND_GATEWAY_TLS_CERT?.trim();
  const keyPath = env.SAND_GATEWAY_TLS_KEY?.trim();
  if ((certPath == null || certPath.length === 0) && (keyPath == null || keyPath.length === 0)) {
    return void 0;
  }
  if (certPath == null || certPath.length === 0 || keyPath == null || keyPath.length === 0) {
    throw new SandGatewayConfigError(
      "Gateway TLS needs both SAND_GATEWAY_TLS_CERT and SAND_GATEWAY_TLS_KEY."
    );
  }
  try {
    return { cert: (0, import_node_fs24.readFileSync)(certPath), key: (0, import_node_fs24.readFileSync)(keyPath) };
  } catch (error41) {
    throw new SandGatewayConfigError(
      `Failed to read gateway TLS cert/key (${certPath}, ${keyPath}): ${String(error41)}`,
      { cause: error41 }
    );
  }
}
function resolveGatewayServerConfig(env, generateToken = () => (0, import_node_crypto13.randomBytes)(32).toString("base64url")) {
  const host = env.SAND_GATEWAY_BIND_HOST?.trim() || "127.0.0.1";
  const port = readPort(env.SAND_HOST_PORT);
  const tls = resolveTls(env);
  const pinnedToken = env.SAND_GATEWAY_TOKEN?.trim();
  const requireAuth = !isLoopbackHost(host) || isTruthyEnv(env.SAND_GATEWAY_REQUIRE_AUTH) || pinnedToken != null && pinnedToken.length > 0;
  const authToken = (() => {
    if (!requireAuth) return void 0;
    if (pinnedToken != null && pinnedToken.length > 0) return pinnedToken;
    return generateToken();
  })();
  return { host, port, authToken, tls };
}
function gatewayScheme(config2) {
  return config2.tls != null ? "https" : "http";
}
