/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/credential-domain.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_tldts = __toESM(require_cjs3(), 1);
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
function isLoopbackHostname(hostname2) {
  const host = hostname2.toLowerCase();
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

