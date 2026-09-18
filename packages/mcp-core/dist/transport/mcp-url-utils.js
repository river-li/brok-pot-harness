function tryParseIpv4(input) {
  const parts = input.split(".");
  if (parts.length !== 4) {
    return void 0;
  }
  let value = BIGINT_ZERO;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return void 0;
    }
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) {
      return void 0;
    }
    value = value << BIGINT_EIGHT | BigInt(octet);
  }
  return { version: 4, value };
}
function parseIpv6Groups(part) {
  if (part.length === 0) {
    return [];
  }
  const groups = [];
  const segments = part.split(":");
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.length === 0) {
      return void 0;
    }
    if (segment.includes(".")) {
      if (i !== segments.length - 1) {
        return void 0;
      }
      const ipv42 = tryParseIpv4(segment);
      if (!ipv42) {
        return void 0;
      }
      groups.push(Number(ipv42.value >> BIGINT_SIXTEEN & IPV4_LOW_HEXTET_MASK));
      groups.push(Number(ipv42.value & IPV4_LOW_HEXTET_MASK));
      continue;
    }
    if (!/^[0-9a-f]{1,4}$/i.test(segment)) {
      return void 0;
    }
    groups.push(Number.parseInt(segment, 16));
  }
  return groups;
}
function tryParseIpv6(input) {
  const normalized = normalizePatternValue(input);
  if (normalized.length === 0 || normalized.includes(":::")) {
    return void 0;
  }
  const doubleColonIndex = normalized.indexOf("::");
  if (doubleColonIndex === -1) {
    const groups2 = parseIpv6Groups(normalized);
    if (!groups2 || groups2.length !== 8) {
      return void 0;
    }
    return {
      version: 6,
      value: groups2.reduce((acc, group) => acc << BIGINT_SIXTEEN | BigInt(group), BIGINT_ZERO)
    };
  }
  if (normalized.indexOf("::", doubleColonIndex + 1) !== -1) {
    return void 0;
  }
  const leftPart = normalized.slice(0, doubleColonIndex);
  const rightPart = normalized.slice(doubleColonIndex + 2);
  const leftGroups = parseIpv6Groups(leftPart);
  const rightGroups = parseIpv6Groups(rightPart);
  if (!leftGroups || !rightGroups) {
    return void 0;
  }
  const totalGroups = leftGroups.length + rightGroups.length;
  if (totalGroups > 7) {
    return void 0;
  }
  const groups = [
    ...leftGroups,
    ...new Array(8 - totalGroups).fill(0),
    ...rightGroups
  ];
  return {
    version: 6,
    value: groups.reduce((acc, group) => acc << BIGINT_SIXTEEN | BigInt(group), BIGINT_ZERO)
  };
}
function tryParseIpAddress(input) {
  var _a20;
  return (_a20 = tryParseIpv4(input)) !== null && _a20 !== void 0 ? _a20 : tryParseIpv6(input);
}
function computeParsedDomainPattern(pattern) {
  const normalizedPattern = normalizePatternValue(pattern);
  if (normalizedPattern === "*") {
    return { kind: "matchAll" };
  }
  if (normalizedPattern.includes("/")) {
    const slashIndex = normalizedPattern.lastIndexOf("/");
    if (slashIndex <= 0 || slashIndex === normalizedPattern.length - 1) {
      return { kind: "invalidCidr" };
    }
    const network = tryParseIpAddress(normalizedPattern.slice(0, slashIndex));
    if (!network) {
      return { kind: "invalidCidr" };
    }
    const prefixLength = Number(normalizedPattern.slice(slashIndex + 1));
    const totalBits = network.version === 4 ? 32 : 128;
    if (!Number.isInteger(prefixLength) || prefixLength < 0 || prefixLength > totalBits) {
      return { kind: "invalidCidr" };
    }
    const shift = BigInt(totalBits - prefixLength);
    return {
      kind: "cidr",
      version: network.version,
      shift,
      shiftedNetwork: network.value >> shift
    };
  }
  if (normalizedPattern.startsWith("*.")) {
    return { kind: "subdomainOrBase", suffix: normalizedPattern.slice(2) };
  }
  return { kind: "exact", value: normalizedPattern };
}
function getParsedDomainPattern(pattern) {
  const cached2 = parsedDomainPatternMemo.get(pattern);
  if (cached2) {
    return cached2;
  }
  if (parsedDomainPatternMemo.size >= VALUE_MEMO_LIMIT) {
    parsedDomainPatternMemo.clear();
  }
  const parsed = computeParsedDomainPattern(pattern);
  parsedDomainPatternMemo.set(pattern, parsed);
  return parsed;
}
function getHostIpAddress(normalizedHost) {
  if (hostIpAddressMemo.has(normalizedHost)) {
    return hostIpAddressMemo.get(normalizedHost);
  }
  if (hostIpAddressMemo.size >= VALUE_MEMO_LIMIT) {
    hostIpAddressMemo.clear();
  }
  const parsed = tryParseIpAddress(normalizedHost);
  hostIpAddressMemo.set(normalizedHost, parsed);
  return parsed;
}
function matchesParsedDomainPattern(normalizedDomain, pattern) {
  switch (pattern.kind) {
    case "matchAll":
      return true;
    case "invalidCidr":
      return false;
    case "cidr": {
      const hostIp = getHostIpAddress(normalizedDomain);
      return hostIp !== void 0 && hostIp.version === pattern.version && hostIp.value >> pattern.shift === pattern.shiftedNetwork;
    }
    case "subdomainOrBase":
      return normalizedDomain === pattern.suffix || normalizedDomain.endsWith(`.${pattern.suffix}`);
    case "exact":
      return normalizedDomain === pattern.value;
  }
}
function matchesDomainPattern(domain, pattern) {
  return matchesParsedDomainPattern(normalizePatternValue(domain), getParsedDomainPattern(pattern));
}
function stripPortFromHostPattern(pattern) {
  const firstColonIndex = pattern.indexOf(":");
  if (firstColonIndex === -1) {
    return pattern;
  }
  const port = pattern.slice(firstColonIndex + 1);
  if (!/^\d+$/.test(port)) {
    return pattern;
  }
  return pattern.slice(0, firstColonIndex);
}
function hasEmbeddedWhitespace(value) {
  return /\s/.test(value);
}
function isValidHostnamePattern(pattern) {
  const normalizedPattern = normalizePatternValue(pattern);
  return normalizedPattern.length > 0 && normalizedPattern.length <= 253 && HOSTNAME_ALLOWLIST_PATTERN_REGEX.test(normalizedPattern);
}
function isValidIpv6LiteralPattern(pattern) {
  const normalizedPattern = normalizePatternValue(pattern);
  if (!IPV6_LITERAL_REGEX.test(normalizedPattern)) {
    return false;
  }
  try {
    new URL(`https://[${normalizedPattern}]`);
    return true;
  } catch (_a20) {
    return false;
  }
}
function isValidIpLiteralPattern(pattern) {
  const normalizedPattern = normalizePatternValue(pattern);
  return IPV4_LITERAL_REGEX.test(normalizedPattern) || isValidIpv6LiteralPattern(normalizedPattern);
}
function isDefaultHttpPort(protocol, port) {
  return port === "" || protocol === "http:" && port === "80" || protocol === "https:" && port === "443";
}
function isValidCidrAllowlistPattern(pattern) {
  const normalizedPattern = normalizePatternValue(pattern);
  if (!CIDR_ALLOWLIST_PATTERN_REGEX.test(normalizedPattern)) {
    return false;
  }
  const [network] = normalizedPattern.split("/");
  return network !== void 0 && matchesDomainPattern(network, normalizedPattern);
}
function isValidExactUrlAllowlistHostname(hostname2) {
  const normalizedHostname2 = hostname2.toLowerCase();
  return !normalizedHostname2.includes("*") && (isValidHostnamePattern(normalizedHostname2) || isValidIpLiteralPattern(normalizedHostname2));
}
function isValidUrlShapedAllowlistPattern(pattern) {
  try {
    const parsed = new URL(pattern);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    if (parsed.hostname.length === 0 || parsed.username.length > 0 || parsed.password.length > 0) {
      return false;
    }
    if (parsed.hash !== "") {
      return false;
    }
    return isValidExactUrlAllowlistHostname(parsed.hostname);
  } catch (_a20) {
    return false;
  }
}
function buildCanonicalEndpointAllowlistPattern(parsed) {
  const normalized = new URL(parsed.pathname || "/", parsed.origin);
  normalized.search = parsed.search;
  if (normalized.pathname.endsWith("/") && normalized.pathname.length > 1) {
    normalized.pathname = normalized.pathname.slice(0, -1);
  }
  if (normalized.pathname === "/" && normalized.search === "") {
    const protocol2 = parsed.protocol.toLowerCase();
    const hostname3 = parsed.hostname.toLowerCase();
    let origin = `${protocol2}//${hostname3}`;
    if (!isDefaultHttpPort(protocol2, parsed.port)) {
      origin += `:${parsed.port}`;
    }
    return origin;
  }
  const protocol = parsed.protocol.toLowerCase();
  const hostname2 = parsed.hostname.toLowerCase();
  let authority = `${protocol}//${hostname2}`;
  if (!isDefaultHttpPort(protocol, parsed.port)) {
    authority += `:${parsed.port}`;
  }
  return `${authority}${normalized.pathname}${normalized.search}`;
}
function isValidNormalizedMcpAllowlistPattern(pattern) {
  if (pattern.includes("://")) {
    return isValidUrlShapedAllowlistPattern(pattern);
  }
  const normalizedPattern = normalizePatternValue(pattern);
  if (normalizedPattern === "*") {
    return true;
  }
  if (WILDCARD_HOST_ALLOWLIST_PATTERN_REGEX.test(normalizedPattern)) {
    return true;
  }
  if (normalizedPattern.includes("/")) {
    return isValidCidrAllowlistPattern(normalizedPattern);
  }
  return isValidHostnamePattern(normalizedPattern) || isValidIpLiteralPattern(normalizedPattern);
}
function normalizeMcpNetworkAllowlistPattern(entry) {
  if (normalizedAllowlistPatternMemo.has(entry)) {
    return normalizedAllowlistPatternMemo.get(entry);
  }
  if (normalizedAllowlistPatternMemo.size >= VALUE_MEMO_LIMIT) {
    normalizedAllowlistPatternMemo.clear();
  }
  const normalized = computeNormalizedMcpNetworkAllowlistPattern(entry);
  normalizedAllowlistPatternMemo.set(entry, normalized);
  return normalized;
}
function computeNormalizedMcpNetworkAllowlistPattern(entry) {
  const rawValue = entry.trim();
  if (rawValue.length === 0) {
    return void 0;
  }
  const cidrSlashIndex = rawValue.lastIndexOf("/");
  if (!rawValue.includes("://") && cidrSlashIndex > 0 && /^\d+$/.test(rawValue.slice(cidrSlashIndex + 1).trim())) {
    const networkPart = normalizePatternValue(rawValue.slice(0, cidrSlashIndex));
    const prefixPart = rawValue.slice(cidrSlashIndex + 1).trim();
    const candidate = `${networkPart}/${prefixPart}`;
    return isValidNormalizedMcpAllowlistPattern(candidate) ? candidate : void 0;
  }
  if (hasEmbeddedWhitespace(rawValue) || rawValue.includes("#") || rawValue.includes("@")) {
    return void 0;
  }
  const schemeIndex = rawValue.indexOf("://");
  if (schemeIndex !== -1) {
    const protocol = rawValue.slice(0, schemeIndex).toLowerCase();
    if (protocol !== "http" && protocol !== "https") {
      return void 0;
    }
    try {
      const parsed = new URL(rawValue);
      if (parsed.hostname.length === 0 || parsed.username.length > 0 || parsed.password.length > 0) {
        return void 0;
      }
      const hasExplicitPath = parsed.pathname !== "/" && parsed.pathname !== "";
      const hasQuery = parsed.search !== "";
      if (parsed.hostname.includes("*")) {
        return void 0;
      } else if (!hasExplicitPath && !hasQuery) {
        const canonical = buildCanonicalEndpointAllowlistPattern(parsed);
        if (!isValidNormalizedMcpAllowlistPattern(canonical)) {
          return void 0;
        }
        return canonical;
      } else {
        const canonical = buildCanonicalEndpointAllowlistPattern(parsed);
        if (!isValidNormalizedMcpAllowlistPattern(canonical)) {
          return void 0;
        }
        return canonical;
      }
    } catch (_a20) {
      return void 0;
    }
  } else if (rawValue.includes("/")) {
    return void 0;
  }
  const lowered = rawValue.trim().toLowerCase();
  const normalized = stripPortFromHostPattern(lowered);
  if (normalized.length === 0 || !isValidNormalizedMcpAllowlistPattern(normalized)) {
    return void 0;
  }
  if (normalized !== lowered && normalized === "*") {
    return void 0;
  }
  return normalized;
}
function normalizeAllowlist(entries) {
  return (entries !== null && entries !== void 0 ? entries : []).flatMap((entry) => {
    const normalized = normalizeMcpNetworkAllowlistPattern(entry);
    return normalized === void 0 ? [] : [normalized];
  });
}
function normalizePatternValue(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized.slice(1, -1);
  }
  return normalized;
}
function getEffectiveMcpNetworkAllowlist(config2) {
  return normalizeAllowlist(config2.mcpNetworkAllowlist);
}
function getStdioMcpSandboxConfig(networkControlsConfig) {
  if ((networkControlsConfig === null || networkControlsConfig === void 0 ? void 0 : networkControlsConfig.enabled) !== true) {
    return void 0;
  }
  if (networkControlsConfig.mcpNetworkMode === "no_sandbox") {
    return void 0;
  }
  return networkControlsConfig;
}
var BIGINT_ZERO, BIGINT_EIGHT, BIGINT_SIXTEEN, IPV4_LOW_HEXTET_MASK, parsedDomainPatternMemo, hostIpAddressMemo, DNS_LABEL_PATTERN, HOSTNAME_ALLOWLIST_PATTERN_REGEX, WILDCARD_HOST_ALLOWLIST_PATTERN_REGEX, IPV4_SEGMENT_PATTERN, IPV4_LITERAL_REGEX, IPV6_LITERAL_REGEX, CIDR_ALLOWLIST_PATTERN_REGEX, VALUE_MEMO_LIMIT, normalizedAllowlistPatternMemo;
var init_mcp_url_utils = __esm({
  "../packages/mcp-core/dist/transport/mcp-url-utils.js"() {
    "use strict";
    BIGINT_ZERO = BigInt(0);
    BIGINT_EIGHT = BigInt(8);
    BIGINT_SIXTEEN = BigInt(16);
    IPV4_LOW_HEXTET_MASK = BigInt(65535);
    parsedDomainPatternMemo = /* @__PURE__ */ new Map();
    hostIpAddressMemo = /* @__PURE__ */ new Map();
    DNS_LABEL_PATTERN = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
    HOSTNAME_ALLOWLIST_PATTERN_REGEX = new RegExp(`^(?:${DNS_LABEL_PATTERN}\\.)*${DNS_LABEL_PATTERN}$`);
    WILDCARD_HOST_ALLOWLIST_PATTERN_REGEX = new RegExp(`^\\*\\.(?:${DNS_LABEL_PATTERN}\\.)*${DNS_LABEL_PATTERN}$`);
    IPV4_SEGMENT_PATTERN = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
    IPV4_LITERAL_REGEX = new RegExp(`^${IPV4_SEGMENT_PATTERN}(?:\\.${IPV4_SEGMENT_PATTERN}){3}$`);
    IPV6_LITERAL_REGEX = /^[0-9a-f:]+$/;
    CIDR_ALLOWLIST_PATTERN_REGEX = new RegExp(`^(?:${IPV4_SEGMENT_PATTERN}(?:\\.${IPV4_SEGMENT_PATTERN}){3}|[0-9a-f:]+)\\/\\d{1,3}$`);
    VALUE_MEMO_LIMIT = 2048;
    normalizedAllowlistPatternMemo = /* @__PURE__ */ new Map();
  }
});
