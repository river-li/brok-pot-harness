var import_node_crypto68 = require("node:crypto");
init_errors();
var EGRESS_IP_TRACE_URL = "https://one.one.one.one/cdn-cgi/trace";
var EGRESS_IP_PROBE_INTERVAL_MS = 15 * 6e4;
var EGRESS_IP_PROBE_TIMEOUT_MS = 1e4;
function parseTraceIp(body) {
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("ip=")) continue;
    const ip = trimmed.slice("ip=".length).trim();
    if (ip.length > 0) return ip;
  }
  return void 0;
}
function pseudonymizeEgressIp(ip) {
  return (0, import_node_crypto68.createHash)("sha256").update(ip).digest("hex");
}
var EgressIpProbeError = class extends SandDomainError {
  constructor(code) {
    super(`egress ip probe failed: ${code}`);
    this.code = code;
  }
  code;
  name = "EgressIpProbeError";
};
async function probeEgressIpHash(options2) {
  const fetchImpl = options2.fetchImpl ?? fetch;
  const body = await options2.deadline.run(async (signal) => {
    const response = await fetchImpl(EGRESS_IP_TRACE_URL, { signal });
    if (!response.ok) throw new EgressIpProbeError(`http_${response.status}`);
    return await response.text();
  });
  const ip = parseTraceIp(body);
  if (ip === void 0) throw new EgressIpProbeError("no_ip_line");
  return pseudonymizeEgressIp(ip);
}
