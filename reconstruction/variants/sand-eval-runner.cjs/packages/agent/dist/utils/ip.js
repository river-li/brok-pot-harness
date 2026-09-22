/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/ip.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_net2 = require("node:net");
function isLoopbackIpv4(ip) {
  return ip.startsWith("127.");
}
function isPrivateIpv4(ip) {
  if (ip === "0.0.0.0")
    return true;
  if (isLoopbackIpv4(ip))
    return true;
  const parts = ip.split(".");
  if (parts.length !== 4)
    return false;
  const nums = parts.map((p2) => Number(p2));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255))
    return false;
  const [a, b2] = nums;
  if (a === 10)
    return true;
  if (a === 192 && b2 === 168)
    return true;
  if (a === 172 && b2 >= 16 && b2 <= 31)
    return true;
  if (a === 169 && b2 === 254)
    return true;
  return false;
}
function extractIpv4FromMappedIpv6(ip) {
  const lower = ip.toLowerCase();
  const dottedMatch = lower.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (dottedMatch)
    return dottedMatch[1];
  const hexMatch = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMatch) {
    const high = parseInt(hexMatch[1], 16);
    const low = parseInt(hexMatch[2], 16);
    return `${high >> 8 & 255}.${high & 255}.${low >> 8 & 255}.${low & 255}`;
  }
  return null;
}
function isPrivateIpv6(ip) {
  const h = ip.toLowerCase();
  if (h === "::1" || h === "::")
    return true;
  if (h.startsWith("fc") || h.startsWith("fd"))
    return true;
  if (h.startsWith("fe80"))
    return true;
  const mapped = extractIpv4FromMappedIpv6(h);
  if (mapped)
    return isPrivateIpv4(mapped);
  return false;
}
function isLoopbackIpHost(host) {
  const hostname2 = host.toLowerCase();
  const ipVersion = (0, import_node_net2.isIP)(hostname2);
  if (ipVersion === 4)
    return isLoopbackIpv4(hostname2);
  if (ipVersion === 6) {
    if (hostname2 === "::1")
      return true;
    const mapped = extractIpv4FromMappedIpv6(hostname2);
    return mapped !== null ? isLoopbackIpv4(mapped) : false;
  }
  return false;
}
function isPrivateIpHost(host) {
  const hostname2 = host.toLowerCase();
  const ipVersion = (0, import_node_net2.isIP)(hostname2);
  if (ipVersion === 4)
    return isPrivateIpv4(hostname2);
  if (ipVersion === 6)
    return isPrivateIpv6(hostname2);
  return false;
}

