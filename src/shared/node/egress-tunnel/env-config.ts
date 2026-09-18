var ANYRUN_NETWORK_TOKEN_HEADER = "x-anyrun-network-token";
function resolveEgressTunnelEnvConfig(env) {
  const url2 = env.SAND_EGRESS_TUNNEL_URL;
  const bearer = env.SAND_EGRESS_TUNNEL_BEARER;
  if (url2 == null || url2 === "" || bearer == null || bearer === "") return null;
  const networkToken = env.SAND_EGRESS_TUNNEL_NETWORK_TOKEN;
  return {
    url: url2,
    bearer,
    ...networkToken != null && networkToken !== "" ? { headers: { [ANYRUN_NETWORK_TOKEN_HEADER]: networkToken } } : {},
    allowPrivateTargets: env.SAND_EGRESS_TUNNEL_ALLOW_PRIVATE === "1"
  };
}
