var import_tldts = __toESM(require_cjs3());
function parseHttpUrl(raw) {
  const value = raw.trim();
  if (value.length === 0) return null;
  try {
    const url2 = new URL(value.includes("://") ? value : `https://${value}`);
    return url2.protocol === "https:" || url2.protocol === "http:" ? url2 : null;
  } catch {
    return null;
  }
}
function normalizedHostname(url2) {
  return url2.hostname.toLowerCase().replace(/\.$/, "");
}
function isLoopbackHostname(hostname3) {
  const host = hostname3.toLowerCase();
  const octets = host.split(".");
  return host === "localhost" || host === "::1" || host === "[::1]" || octets.length === 4 && octets[0] === "127" && octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) <= 255);
}
function isSecureCredentialTarget(rawTarget) {
  const target = parseHttpUrl(rawTarget);
  if (target == null) return false;
  return target.protocol === "https:" || target.protocol === "http:" && isLoopbackHostname(normalizedHostname(target));
}
function normalizeCredentialTarget(rawTarget) {
  if (!isSecureCredentialTarget(rawTarget)) return null;
  return parseHttpUrl(rawTarget)?.origin ?? null;
}
function normalizedPort(url2) {
  if (url2.port.length > 0) return Number(url2.port);
  return url2.protocol === "https:" ? 443 : 80;
}
function matchTargetRule(rule, target) {
  const targetHostname = normalizedHostname(target);
  if (targetHostname.length === 0) return null;
  if (rule.kind === "exact-host-port") {
    return target.protocol === `${rule.scheme}:` && targetHostname === rule.host.toLowerCase() && normalizedPort(target) === rule.port ? { kind: "exact", targetUrl: target.href } : null;
  }
  const targetDomain = (0, import_tldts.getDomain)(targetHostname, {
    allowPrivateDomains: true
  })?.toLowerCase();
  if (targetDomain !== rule.registrableDomain.toLowerCase()) return null;
  return {
    kind: targetHostname === targetDomain ? "exact" : "subdomain",
    targetUrl: target.href
  };
}
function matchCredentialItemToSite(item, rawTarget) {
  if (!isBrowserLoginCredential(item) || !isSecureCredentialTarget(rawTarget)) {
    return null;
  }
  const target = parseHttpUrl(rawTarget);
  if (target == null) return null;
  let best = null;
  for (const rule of item.targetRules) {
    const match2 = matchTargetRule(rule, target);
    if (match2 == null) continue;
    if (match2.kind === "exact") return match2;
    best ??= match2;
  }
  return best;
}
function isBrowserLoginCredential(item) {
  return (item.category === "Login" || item.category === "Password") && item.targetRules.length > 0;
}
