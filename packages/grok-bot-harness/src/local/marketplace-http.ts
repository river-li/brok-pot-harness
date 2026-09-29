/** Bounded public-network transport for registry metadata and immutable files. */
import * as https from "node:https";
import { publicLookup, validateDestination } from "./web-fetch-network.js";

export function publicHttpsUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.hash)
    throw Error("An HTTPS URL without credentials or fragments is required.");
  validateDestination(url);
  return url;
}
export type CatalogFetch = (url: string) => Promise<Response>;
export const catalogFetch: CatalogFetch = async (input) => {
  const url = publicHttpsUrl(input);
  try {
    return await new Promise<Response>((resolve, reject) => {
      const req = https.get(url, {
        agent: false, lookup: publicLookup, signal: AbortSignal.timeout(20000),
        headers: { accept: "application/json, text/plain, */*", "accept-encoding": "identity", "user-agent": "Brokpot-Marketplace/1" },
      }, (res) => {
        const parts: Buffer[] = []; let size = 0;
        res.on("data", (part: Buffer) => {
          size += part.length;
          if (size > 4 * 1024 * 1024) { res.destroy(); reject(Error("Marketplace response exceeds the size limit.")); }
          else parts.push(part);
        });
        res.on("error", reject);
        res.on("end", () => {
          try {
            const status = res.statusCode ?? 502;
            resolve(new Response([204,205,304].includes(status) ? null : Buffer.concat(parts), {
              status,
              headers: { "content-type": String(res.headers["content-type"] ?? ""), "retry-after": String(res.headers["retry-after"] ?? "60") },
            }));
          } catch { reject(Error("Invalid marketplace response.")); }
        });
      });
      req.on("error", reject);
    });
  } catch { throw Error("Cannot reach the public marketplace endpoint."); }
};
