/** Public Internet destinations only; validate the DNS answer used by the socket. */
import * as dns from "node:dns";
import { BlockList, isIP, type LookupFunction } from "node:net";

const blocked = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10],
  ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
  ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24],
  ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) blocked.addSubnet(network, prefix, "ipv4");
// Azure platform virtual IP also exposes Host-local infrastructure services.
blocked.addAddress("168.63.129.16", "ipv4");
const globalV6 = new BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");
for (const [network, prefix] of [
  ["2001::", 23], ["2001:db8::", 32], ["2002::", 16], ["3fff::", 20],
] as const) blocked.addSubnet(network, prefix, "ipv6");

export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  return family === 4
    ? !blocked.check(address, "ipv4")
    : family === 6 && globalV6.check(address, "ipv6") && !blocked.check(address, "ipv6");
}

export class ForbiddenDestination extends Error {
  constructor() { super("Web fetch refused a non-public network destination."); }
}

export function validateDestination(url: URL): void {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if ((isIP(hostname) && !isPublicAddress(hostname)) ||
      /(^|\.)localhost\.?$/i.test(hostname)) throw new ForbiddenDestination();
}

// A fresh lookup is performed for each connection. No preflight/second-lookup
// gap and no connection pool that can reuse a socket from a different policy.
export const publicLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { all: true, verbatim: true }, (error, addresses) => {
    if (error) { callback(error, "", 4); return; }
    if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
      callback(new ForbiddenDestination(), "", 4);
      return;
    }
    const family = options.family;
    const matching = family ? addresses.filter((item) => item.family === family) : addresses;
    if (!matching.length) { callback(new Error("No matching public address."), "", 4); return; }
    if (options.all) callback(null, matching);
    else callback(null, matching[0].address, matching[0].family);
  });
};
