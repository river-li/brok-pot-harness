"use strict";
// Shared authenticated ingress. Targets are fixed operator configuration, never
// client-supplied URLs. Keep the retained Host and noVNC wire protocols intact.
const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const TTL = 12 * 60 * 60;
function equal(a, b) {
  return typeof a === "string" && Buffer.byteLength(a) === Buffer.byteLength(b) && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
function createGateway({ origin, token, ports = { host: 1540, primary: 6180, fork: 6181 }, now = () => Date.now() }) {
  const publicUrl = new URL(origin);
  if (publicUrl.protocol !== "https:" || publicUrl.origin !== origin || token.length < 32) throw new Error("Invalid ingress configuration");
  const signingKey = crypto.randomBytes(32);
  function sign(value) { return crypto.createHmac("sha256", signingKey).update(value).digest("base64url"); }
  function ticket() { const value = `${Math.floor(now() / 1000) + TTL}.${crypto.randomBytes(16).toString("hex")}`; return `${value}.${sign(value)}`; }
  function valid(value) {
    if (typeof value !== "string" || !/^\d{10}\.[a-f0-9]{32}\.[A-Za-z0-9_-]{43}$/.test(value)) return false;
    const [expires, nonce, signature] = value.split(".");
    const seconds = Math.floor(now() / 1000);
    return Number(expires) > seconds && Number(expires) <= seconds + TTL && equal(signature, sign(`${expires}.${nonce}`));
  }
  function reject(res, code = 401) { res.writeHead(code, { "Cache-Control": "no-store" }); res.end(); }
  function browserAllowed(req) { return !req.headers.origin || req.headers.origin === origin; }
  function route(req) {
    // Refuse ambiguous paths rather than letting URL normalization change routes.
    if (!req.url.startsWith("/") || req.url.startsWith("//") || /[\\\x00-\x20]|%2f|%5c|%2e/i.test(req.url.split("?")[0])) return null;
    const url = new URL(req.url, origin);
    if (url.pathname.split("/").includes("..") || url.pathname !== req.url.split("?")[0]) return null;
    const match = /^\/display\/([A-Za-z0-9_.-]+)\/(primary|fork)\/(.*)$/.exec(url.pathname);
    if (match) {
      const credential = match[1];
      if (!valid(credential) || !browserAllowed(req)) return null;
      const routingToken = url.searchParams.get("token");
      url.search = "";
      if (routingToken !== null) url.searchParams.set("token", routingToken);
      return { port: ports[match[2]], display: true, credential, pathname: "/" + match[3], target: "/" + match[3] + url.search };
    }
    if (!equal(req.headers.authorization, `Bearer ${token}`) || !browserAllowed(req)) return null;
    if (req.method === "POST" && url.pathname === "/connection") return { descriptor: true };
    const get = req.method === "GET" && (/^\/avatars\//.test(url.pathname) || ["/events", "/local-exec/requests", "/webauthn/requests", "/cookie-origin-approval/requests"].includes(url.pathname));
    const post = req.method === "POST" && (/^\/api\/[A-Za-z0-9]+$/.test(url.pathname) || ["/events/echo", "/local-exec/responses", "/webauthn/responses", "/cookie-origin-approval/responses"].includes(url.pathname));
    return get || post ? { port: ports.host, target: req.url } : null;
  }
  function headers(req, dest) {
    const result = { ...req.headers, host: `127.0.0.1:${dest.port}` };
    for (const key of ["cookie", "referer", "forwarded", "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto", "x-anyrun-network-token", "proxy-authorization"]) delete result[key];
    if (dest.display) { delete result.authorization; result.origin = `http://127.0.0.1:${dest.port}`; }
    return result;
  }
  const server = http.createServer({ maxHeaderSize: 16384 }, (req, res) => {
    const dest = route(req);
    if (!dest) return reject(res);
    if (dest.descriptor) {
      const credential = ticket();
      const ws = `/display/${credential}/primary/websockify`;
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      res.end(JSON.stringify({ version: 1, expiresAt: now() + TTL * 1000, vncProxy: {
        primaryUrl: `${origin}/display/${credential}/primary/vnc.html?network_token=${credential}&path=${encodeURIComponent(ws)}`,
        forkBaseUrl: `${origin}/display/${credential}/fork`, networkToken: credential,
      } }));
      req.resume(); return;
    }
    if (dest.display && (req.method !== "GET" || dest.pathname === "/websockify")) return reject(res, 405);
    const upstream = http.request({ hostname: "127.0.0.1", port: dest.port, path: dest.target, method: req.method, headers: headers(req, dest) }, response => {
      const responseHeaders = { ...response.headers, "cache-control": "no-store", "referrer-policy": "no-referrer", "x-content-type-options": "nosniff" };
      delete responseHeaders["set-cookie"];
      if (dest.display) responseHeaders["content-security-policy"] = `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ${origin.replace('https:', 'wss:')}; object-src 'none'; base-uri 'none'; form-action 'none'`;
      // Never send a credential to an upstream redirect destination.
      if (response.statusCode >= 300 && response.statusCode < 400) { response.resume(); return reject(res, 502); }
      res.writeHead(response.statusCode, responseHeaders); response.pipe(res);
      response.on("error", () => res.destroy());
    });
    upstream.on("error", () => res.headersSent ? res.destroy() : reject(res, 502));
    upstream.setTimeout(90000, () => upstream.destroy());
    req.on("aborted", () => upstream.destroy()); res.on("close", () => upstream.destroy()); req.pipe(upstream);
  });
  server.on("upgrade", (req, socket, head) => {
    const dest = route(req);
    if (!dest?.display || dest.pathname !== "/websockify" || req.headers.origin !== origin || req.method !== "GET" || req.headers.upgrade?.toLowerCase() !== "websocket") {
      socket.end("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n"); return;
    }
    const upstream = http.request({ hostname: "127.0.0.1", port: dest.port, path: dest.target, headers: headers(req, dest) });
    upstream.setTimeout(10000, () => upstream.destroy());
    upstream.on("upgrade", (response, peer, upstreamHead) => {
      peer.setTimeout(0);
      const expiry = setTimeout(() => { peer.destroy(); socket.destroy(); }, Math.max(1, Number(dest.credential.split(".")[0]) * 1000 - now()));
      expiry.unref(); peer.on("close", () => clearTimeout(expiry));
      const allowed = ["upgrade", "connection", "sec-websocket-accept", "sec-websocket-protocol"];
      socket.write("HTTP/1.1 101 Switching Protocols\r\n" + allowed.filter(k => response.headers[k]).map(k => `${k}: ${response.headers[k]}\r\n`).join("") + "\r\n");
      if (upstreamHead.length) socket.write(upstreamHead);
      if (head.length) peer.write(head);
      socket.pipe(peer).pipe(socket);
      peer.on("error", () => socket.destroy()); socket.on("error", () => peer.destroy());
      socket.on("close", () => peer.destroy()); peer.on("close", () => socket.destroy());
    });
    upstream.on("response", response => { response.resume(); socket.end("HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n"); });
    upstream.on("error", () => socket.destroy()); socket.on("close", () => upstream.destroy()); upstream.end();
  });
  server.headersTimeout = 10000; server.requestTimeout = 30000; server.maxConnections = 256;
  return server;
}
if (require.main === module) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.env.CREDENTIALS_DIRECTORY, "gateway.json"), "utf8"));
  createGateway(settings).listen(1640, "127.0.0.1");
}
module.exports = { createGateway };
