"use strict";

// The library owns code redemption, PKCE verification, and refresh rotation.
// This adapter owns MCP discovery, Gateway consent, resource binding and storage.
const OAuth2Server = require("@node-oauth/oauth2-server");
const { createHash, createHmac, randomBytes, timingSafeEqual } = require("node:crypto");

const SCOPES = ["brokpot:read", "brokpot:write"];
const CHATGPT_CLIENT_ID = "https://chatgpt.com/oauth/client.json";
const ACCESS_SECONDS = 900;
const GRANT_SECONDS = 7 * 24 * 60 * 60;
const FORM_SECONDS = 300;
const MAX_ENTRIES = 4096;
const MAX_TOKEN_ENTRIES = 16384;
const MAX_BODY = 16384;
const opaque = () => randomBytes(32).toString("base64url");
const digest = (value) => createHash("sha256").update(value).digest("hex");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function equal(a, b) {
  return typeof a === "string" && typeof b === "string" && timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
}

function fail(error, message, status = 400) {
  const failure = new Error(message);
  Object.assign(failure, { oauthError: error, status });
  throw failure;
}

function secureUrl(value, label, allowLoopback = false) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label} must be an absolute URL.`); }
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if ((url.protocol !== "https:" && !(allowLoopback && local && url.protocol === "http:")) || url.username || url.password || url.hash)
    throw new Error(`${label} must use HTTPS without credentials or a fragment.`);
  return url;
}

function oauthConfig(env = process.env) {
  const mode = env.BROKPOT_MCP_AUTH_MODE || "gateway";
  if (mode === "gateway") return null;
  if (mode !== "oauth") throw new Error("BROKPOT_MCP_AUTH_MODE must be gateway or oauth.");
  const base = secureUrl(env.BROKPOT_MCP_PUBLIC_URL, "BROKPOT_MCP_PUBLIC_URL", true);
  if (base.pathname !== "/" || base.search) throw new Error("BROKPOT_MCP_PUBLIC_URL must be an origin, without a path or query.");
  let redirects;
  try { redirects = JSON.parse(env.BROKPOT_MCP_OAUTH_REDIRECT_URIS); } catch { /* checked below */ }
  if (!Array.isArray(redirects) || !redirects.length || redirects.length > 10 || redirects.some((uri) => typeof uri !== "string"))
    throw new Error("BROKPOT_MCP_OAUTH_REDIRECT_URIS must be a JSON array of exact approved callback URLs.");
  for (const uri of redirects) {
    secureUrl(uri, "OAuth redirect URI");
    if (uri.includes("*")) throw new Error("OAuth redirect URIs cannot contain wildcards.");
  }
  const clientId = env.BROKPOT_MCP_OAUTH_CLIENT_ID || CHATGPT_CLIENT_ID;
  // Only an explicitly configured OpenAI document can cause outbound discovery.
  // No arbitrary client-provided URL, JWKS URL, or redirect is ever fetched.
  const cimd = /^https:\/\/chatgpt\.com\/oauth\/(?:[A-Za-z0-9_-]+\/)?client\.json$/.test(clientId);
  if (!cimd && !/^[A-Za-z0-9_-]{1,128}$/.test(clientId))
    throw new Error("OAuth client ID must be a ChatGPT metadata URL or a static public-client identifier.");
  const directory = env.BROKPOT_MCP_OAUTH_STORE_DIR;
  const keyFile = env.BROKPOT_MCP_OAUTH_KEY_FILE;
  if (Boolean(directory) !== Boolean(keyFile)) throw new Error("OAuth persistence requires both store directory and key file.");
  if (directory) {
    const path = require("node:path");
    if (!path.isAbsolute(directory) || !path.isAbsolute(keyFile) ||
        path.resolve(keyFile).startsWith(path.resolve(directory) + path.sep))
      throw new Error("OAuth storage and key paths must be absolute; keep the key outside the store directory.");
  }
  const storage = directory ? { directory, keyFile } : undefined;
  return { ...(storage ? { storage } : {}), issuer: base.origin, resource: `${base.origin}/mcp`, clientId, cimd, redirectUris: redirects, secondFactor: env.BROKPOT_MCP_SERVER_TOKEN || "" };
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) fail("invalid_request", "Request body is too large.", 413);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function singleParams(params) {
  const result = Object.create(null);
  for (const [key, value] of params) {
    if (Object.hasOwn(result, key)) fail("invalid_request", "Repeated parameters are not supported.");
    result[key] = value;
  }
  return result;
}

async function formBody(req) {
  if ((req.headers["content-type"] || "").split(";")[0].trim() !== "application/x-www-form-urlencoded")
    fail("invalid_request", "Use application/x-www-form-urlencoded.", 415);
  return singleParams(new URLSearchParams(await readBody(req)));
}

async function fetchClientMetadata(clientId) {
  const response = await fetch(clientId, { redirect: "error", signal: AbortSignal.timeout(5000), headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Client discovery failed.");
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("Client metadata is too large.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function createOAuthServer(config, { verifyGatewayToken, loadClientMetadata = fetchClientMetadata, openStore = require("./oauth-store.cjs").openOAuthStore } = {}) {
  const forms = new Map();
  const codes = new Map();
  const access = new Map();
  const refresh = new Map();
  const grants = new Map();
  const store = config.storage ? openStore({ ...config.storage,
    binding: [config.issuer, config.resource, config.clientId] }) : null;
  let storageFailed = false;
  let cachedClient;
  let clientExpires = 0;
  let clientLoading;
  let pendingTokens = 0;
  const active = (user) => user && !user.revoked && (user.expiresAt === null || user.expiresAt > Date.now()) && user.resource === config.resource;
  function healthy() {
    if (storageFailed) fail("temporarily_unavailable", "OAuth storage is unavailable.", 503);
    try { store?.check(); } catch { storageFailed = true; fail("temporarily_unavailable", "OAuth storage is unavailable.", 503); }
  }
  function persist() {
    if (!store) return;
    healthy();
    const live = [...grants.values()].filter(active);
    const records = (map) => [...map].filter(([, item]) => active(item.user)).map(([hash, item]) =>
      [hash, { userId: item.user.id, scope: item.scope, used: item.used,
        accessExpires: item.accessTokenExpiresAt.getTime(), refreshExpires: item.refreshTokenExpiresAt?.getTime() ?? null }]);
    try { store.save({ version: 1, grants: live, access: records(access), refresh: records(refresh) }); }
    catch { storageFailed = true; fail("temporarily_unavailable", "OAuth storage is unavailable.", 503); }
  }
  const revoke = (user) => {
    user.revoked = true; user.gatewayToken = "";
    grants.delete(user.id);
    for (const map of [access, refresh]) for (const [hash, item] of map) if (item.user === user) map.delete(hash);
    persist();
  };
  function restore(snapshot) {
    if (!snapshot) return;
    const valid = (condition) => { if (!condition) throw new Error("Invalid OAuth storage snapshot."); };
    valid(snapshot.version === 1 && Array.isArray(snapshot.grants) && snapshot.grants.length <= MAX_ENTRIES);
    for (const user of snapshot.grants) {
      valid(/^[A-Za-z0-9_-]{43}$/.test(user.id) && typeof user.gatewayToken === "string" && user.gatewayToken.length > 0 &&
        user.resource === config.resource && user.expiresAt === null && !user.revoked &&
        /^[A-Za-z0-9_-]{43}$/.test(user.refreshSecret) && Number.isSafeInteger(user.generation) && user.generation > 0 && !grants.has(user.id));
      grants.set(user.id, user);
    }
    for (const [name, map] of [["access", access], ["refresh", refresh]]) {
      valid(Array.isArray(snapshot[name]) && snapshot[name].length <= MAX_TOKEN_ENTRIES);
      for (const [hash, record] of snapshot[name]) {
        valid(/^[a-f0-9]{64}$/.test(hash) && !map.has(hash) && grants.has(record.userId) &&
          Array.isArray(record.scope) && record.scope.length > 0 && record.scope.every((scope) => SCOPES.includes(scope)) &&
          typeof record.used === "boolean" && Number.isFinite(record.accessExpires) && record.refreshExpires === null);
        map.set(hash, { user: grants.get(record.userId), client: { id: config.clientId, grants: ["authorization_code", "refresh_token"] },
          scope: record.scope, used: record.used, accessTokenExpiresAt: new Date(record.accessExpires), refreshTokenExpiresAt: undefined });
      }
    }
  }
  try { restore(store?.initial); } catch { store?.close(); throw new Error("Invalid OAuth storage snapshot."); }
  const signRefresh = (user, generation) => createHmac("sha256", Buffer.from(user.refreshSecret, "base64url"))
    .update(`rt1.${user.id}.${generation}`).digest("base64url");
  function durableRefresh(token) {
    const parts = typeof token === "string" ? token.split(".") : [];
    if (parts.length !== 4 || parts[0] !== "rt1" || !/^[1-9][0-9]{0,15}$/.test(parts[2])) return null;
    const user = grants.get(parts[1]);
    const generation = Number(parts[2]);
    if (!active(user) || !Number.isSafeInteger(generation) || !equal(parts[3], signRefresh(user, generation))) return null;
    if (generation < user.generation) { revoke(user); return null; }
    return generation === user.generation ? user : null;
  }

  function sweep() {
    const now = Date.now();
    for (const [key, item] of forms) if (item.expiresAt <= now) forms.delete(key);
    for (const [key, item] of codes) if (item.expiresAt <= now || !active(item.user)) codes.delete(key);
    for (const [key, item] of access) if (item.accessTokenExpiresAt <= now || !active(item.user)) access.delete(key);
    for (const [key, item] of refresh) if ((item.refreshTokenExpiresAt && item.refreshTokenExpiresAt <= now) || !active(item.user)) refresh.delete(key);
  }
  // Also release expired Gateway credentials while the bridge is idle.
  const cleanup = setInterval(sweep, 30000);
  cleanup.unref();

  function room(map) {
    const limit = map === access || map === refresh ? MAX_TOKEN_ENTRIES : MAX_ENTRIES;
    if (map.size >= limit) fail("temporarily_unavailable", "Authorization capacity reached. Retry later.", 503);
  }

  async function getClient(id, secret) {
    if (id !== config.clientId || secret) return false;
    if (cachedClient && clientExpires > Date.now()) return cachedClient;
    if (!clientLoading) clientLoading = (async () => {
      let redirects = config.redirectUris;
      if (config.cimd) {
        const metadata = await loadClientMetadata(config.clientId);
        const methods = metadata.token_endpoint_auth_methods_supported || [metadata.token_endpoint_auth_method];
        if (metadata.client_id !== config.clientId || !Array.isArray(methods) || !methods.includes("none") ||
            !Array.isArray(metadata.redirect_uris) || !metadata.grant_types?.includes("authorization_code") ||
            !metadata.grant_types?.includes("refresh_token") || !metadata.response_types?.includes("code"))
          fail("invalid_client", "Client metadata is incompatible.");
        redirects = config.redirectUris.filter((uri) => metadata.redirect_uris.includes(uri));
        if (!redirects.length) fail("invalid_client", "Configured callbacks do not match client metadata.");
      }
      cachedClient = { id, redirectUris: redirects, grants: ["authorization_code", "refresh_token"] };
      clientExpires = Date.now() + 3600000;
      return cachedClient;
    })().finally(() => { clientLoading = null; });
    return clientLoading;
  }

  const model = {
    getClient,
    generateAccessToken: opaque,
    generateRefreshToken: (_client, user) => {
      if (!store) return opaque();
      if (!Number.isSafeInteger(user.generation + 1)) throw new Error("Refresh generation exhausted.");
      user.generation += 1;
      return `rt1.${user.id}.${user.generation}.${signRefresh(user, user.generation)}`;
    },
    generateAuthorizationCode: opaque,
    validateScope: (_user, _client, scopes) => scopes?.length && scopes.every((scope) => SCOPES.includes(scope)) ? scopes : false,
    validateRedirectUri: (uri, client) => client.redirectUris.includes(uri),
    saveAuthorizationCode(code, client, user) {
      healthy();
      room(codes);
      const record = { ...code, client, user, used: false };
      codes.set(digest(code.authorizationCode), record);
      return record;
    },
    getAuthorizationCode(code) {
      healthy();
      const record = codes.get(digest(code));
      if (record?.used) { revoke(record.user); return false; }
      return record && active(record.user) ? record : false;
    },
    revokeAuthorizationCode(code) {
      healthy();
      if (code.used) { revoke(code.user); return false; }
      code.used = true;
      return true;
    },
    saveToken(token, client, user) {
      healthy();
      if (!active(user)) throw new OAuth2Server.InvalidGrantError("Grant expired or revoked.");
      room(access);
      if (store) {
        if (!grants.has(user.id) && grants.size >= MAX_ENTRIES) fail("temporarily_unavailable", "Grant capacity reached.", 503);
        grants.set(user.id, user);
        for (const [hash, record] of refresh) if (record.user === user) refresh.delete(hash);
      }
      room(refresh);
      token.accessTokenExpiresAt = new Date(Math.min(token.accessTokenExpiresAt.getTime(), user.expiresAt ?? Infinity));
      token.refreshTokenExpiresAt = store ? undefined : new Date(Math.min(token.refreshTokenExpiresAt.getTime(), user.expiresAt));
      const stored = { ...token, accessToken: undefined, refreshToken: undefined, client, user, used: false };
      access.set(digest(token.accessToken), stored);
      refresh.set(digest(token.refreshToken), stored);
      persist();
      return { ...token, client, user };
    },
    getRefreshToken(token) {
      healthy();
      if (store && !durableRefresh(token)) return false;
      const record = refresh.get(digest(token));
      if (record?.used) { revoke(record.user); return false; }
      return record && active(record.user) ? { ...record, refreshToken: token } : false;
    },
    revokeToken(token) {
      healthy();
      const record = refresh.get(digest(token.refreshToken));
      if (!record || record.used) { if (record) revoke(record.user); return false; }
      record.used = true;
      persist();
      return true;
    },
  };
  const oauth = new OAuth2Server({ model, authorizationCodeLifetime: 60, accessTokenLifetime: ACCESS_SECONDS,
    refreshTokenLifetime: GRANT_SECONDS, allowExtendedTokenAttributes: false, enablePlainPKCE: false,
    requireClientAuthentication: { authorization_code: false, refresh_token: false }, alwaysIssueNewRefreshToken: true });

  function json(res, status, body) {
    res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store", pragma: "no-cache", "x-content-type-options": "nosniff" });
    res.end(JSON.stringify(body));
  }

  function redirect(res, params, result) {
    const target = new URL(params.redirect_uri);
    for (const [key, value] of Object.entries({ ...result, state: params.state, iss: config.issuer })) target.searchParams.set(key, value);
    res.writeHead(303, { location: target.href, "cache-control": "no-store", "referrer-policy": "no-referrer" }).end();
  }

  function challenge(error = "invalid_token", scopes = SCOPES) {
    return `Bearer resource_metadata="${config.issuer}/.well-known/oauth-protected-resource/mcp", scope="${scopes.join(" ")}", error="${error}", error_description="${error === "insufficient_scope" ? "Additional Brokpot permission is required" : "Connect your Brokpot account"}"`;
  }

  function authenticate(token) {
    healthy();
    sweep();
    const record = typeof token === "string" && token ? access.get(digest(token)) : null;
    return record && active(record.user) && record.accessTokenExpiresAt > Date.now()
      ? { gatewayToken: record.user.gatewayToken, scopes: record.scope, revoke: () => revoke(record.user) } : null;
  }

  async function handle(req, res) {
    const url = new URL(req.url, config.issuer);
    const route = url.pathname;
    if (!["/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp", "/.well-known/oauth-authorization-server", "/oauth/authorize", "/oauth/token", "/oauth/revoke"].includes(route)) return false;
    let trustedRedirect;
    try {
      healthy();
      sweep();
      if (route.startsWith("/.well-known/")) {
        if (req.method !== "GET") { res.writeHead(405, { allow: "GET" }).end(); return true; }
        json(res, 200, route.includes("oauth-protected-resource") ? {
          resource: config.resource, authorization_servers: [config.issuer], scopes_supported: SCOPES, bearer_methods_supported: ["header"],
        } : {
          issuer: config.issuer, authorization_endpoint: `${config.issuer}/oauth/authorize`, token_endpoint: `${config.issuer}/oauth/token`,
          revocation_endpoint: `${config.issuer}/oauth/revoke`, token_endpoint_auth_methods_supported: ["none"],
          revocation_endpoint_auth_methods_supported: ["none"], response_types_supported: ["code"],
          grant_types_supported: ["authorization_code", "refresh_token"], code_challenge_methods_supported: ["S256"],
          scopes_supported: SCOPES, authorization_response_iss_parameter_supported: true, client_id_metadata_document_supported: config.cimd,
        });
        return true;
      }
      if (route === "/oauth/authorize" && req.method === "GET") {
        const params = singleParams(url.searchParams);
        const client = await getClient(params.client_id);
        // Never redirect a validation error until the callback is trusted.
        if (!client || !client.redirectUris.includes(params.redirect_uri)) fail("invalid_client", "Unrecognized client or callback.");
        if (!params.state || params.state.length > 2048 || !/^[\x20-\x7e]+$/.test(params.state)) fail("invalid_request", "A valid state is required.");
        trustedRedirect = params;
        if (params.response_type !== "code") fail("unsupported_response_type", "Only authorization codes are supported.");
        if (params.resource !== config.resource) fail("invalid_target", "Resource does not match this MCP server.");
        if (params.code_challenge_method !== "S256" || !/^[A-Za-z0-9_-]{43}$/.test(params.code_challenge || "")) fail("invalid_request", "PKCE S256 is required.");
        params.scope = params.scope || SCOPES.join(" ");
        if (!model.validateScope(null, client, params.scope.split(" "))) fail("invalid_scope", "Unsupported scope.");
        room(forms);
        const transaction = opaque();
        const browser = opaque();
        forms.set(digest(transaction), { params, browserHash: digest(browser), expiresAt: Date.now() + FORM_SECONDS * 1000 });
        const secure = config.issuer.startsWith("https:") ? "; Secure" : "";
        // Native form POSTs need a non-null Origin for the consent CSRF check.
        // Only the origin is sent; the code redirect below still uses no-referrer.
        const callbackOrigin = new URL(params.redirect_uri).origin;
        res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "referrer-policy": "strict-origin",
          "x-frame-options": "DENY", "x-content-type-options": "nosniff",
          // Chromium also applies form-action to the 303 callback destination.
          "content-security-policy": `default-src 'none'; form-action 'self' ${callbackOrigin}; frame-ancestors 'none'; base-uri 'none'`,
          "set-cookie": `brokpot_oauth=${browser}; Path=/oauth/authorize; HttpOnly; SameSite=Lax; Max-Age=${FORM_SECONDS}${secure}` });
        res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Brokpot</title><main><h1>Connect Brokpot</h1><p>Client: ${escapeHtml(config.clientId)}</p><p>Callback: ${escapeHtml(params.redirect_uri)}</p><p>Permissions: ${escapeHtml(params.scope)}</p><p>Read permission exposes all Bots and their conversations on this Host. Write permission lets this client send messages that can start Bot work. Existing Brokpot approvals still apply.</p><p>Enter your Gateway token only on this trusted Brokpot page, never in a chat or a tool argument. It ${store ? "is encrypted on this server until you revoke access" : "stays in this bridge's memory for up to seven days"}; the client receives separate short-lived MCP tokens.</p><form method="post" action="/oauth/authorize"><input type="hidden" name="transaction" value="${transaction}"><label>Gateway token <input type="password" name="gateway_token" autocomplete="off" required></label>${config.secondFactor ? '<label>Bridge second factor <input type="password" name="second_factor" autocomplete="off" required></label>' : ""}<button type="submit" name="decision" value="approve">Approve connection</button><button type="submit" name="decision" value="deny" formnovalidate>Cancel</button></form></main></html>`);
        return true;
      }
      if (req.method !== "POST") { res.writeHead(405, { allow: route === "/oauth/authorize" ? "GET, POST" : "POST" }).end(); return true; }
      if (url.search) fail("invalid_request", "POST parameters must be in the request body.");
      const body = await formBody(req);
      if (route === "/oauth/authorize") {
        if (req.headers.origin !== config.issuer) fail("invalid_request", "Consent must come from this server's origin.", 403);
        const transaction = forms.get(digest(body.transaction || ""));
        const cookies = (req.headers.cookie || "").split(";").map((part) => part.trim());
        const cookie = cookies.find((part) => part.startsWith("brokpot_oauth="))?.slice("brokpot_oauth=".length);
        if (!transaction || transaction.expiresAt <= Date.now() || !cookie || !equal(digest(cookie), transaction.browserHash)) fail("invalid_request", "Consent session expired or invalid.", 403);
        forms.delete(digest(body.transaction)); // consume before any asynchronous Gateway I/O
        if (body.decision === "deny") { redirect(res, transaction.params, { error: "access_denied" }); return true; }
        if (body.decision !== "approve") fail("invalid_request", "Explicit consent is required.");
        if (!body.gateway_token || (config.secondFactor && !equal(body.second_factor, config.secondFactor))) fail("access_denied", "Gateway credentials were not accepted.", 401);
        try { await verifyGatewayToken(body.gateway_token); } catch { fail("access_denied", "Gateway credentials were not accepted or Gateway is unavailable.", 401); }
        const user = { id: opaque(), gatewayToken: body.gateway_token, resource: transaction.params.resource, expiresAt: store ? null : Date.now() + GRANT_SECONDS * 1000,
          ...(store ? { refreshSecret: opaque(), generation: 0 } : {}) };
        const request = new OAuth2Server.Request({ method: "GET", query: transaction.params, headers: {}, body: {} });
        const response = new OAuth2Server.Response();
        const code = await oauth.authorize(request, response, { authenticateHandler: { handle: () => user } });
        redirect(res, transaction.params, { code: code.authorizationCode });
        return true;
      }
      if (req.headers.authorization || body.client_secret || body.client_assertion) fail("invalid_client", "Only the public-client PKCE flow is supported.");
      if (body.client_id !== config.clientId) fail("invalid_client", "Unrecognized client.");
      if (route === "/oauth/revoke") {
        const token = body.token || "";
        const signedUser = store ? durableRefresh(token) : null;
        if (signedUser) revoke(signedUser);
        const record = refresh.get(digest(token)) || access.get(digest(token));
        if (record && record.client.id === body.client_id) revoke(record.user);
        json(res, 200, {});
        return true;
      }
      if (body.resource !== config.resource) fail("invalid_target", "Resource does not match this MCP server.");
      if (!["authorization_code", "refresh_token"].includes(body.grant_type)) fail("unsupported_grant_type", "Unsupported grant type.");
      const request = new OAuth2Server.Request({ method: "POST", query: {}, headers: req.headers, body });
      const response = new OAuth2Server.Response();
      // Reserve before the library consumes a one-use code/refresh token. The
      // reservation also covers concurrent exchanges across asynchronous hooks.
      if (access.size + pendingTokens >= MAX_TOKEN_ENTRIES || refresh.size + pendingTokens >= MAX_TOKEN_ENTRIES ||
          (store && body.grant_type === "authorization_code" && grants.size + pendingTokens >= MAX_ENTRIES))
        fail("temporarily_unavailable", "Authorization capacity reached. Retry later.", 503);
      pendingTokens += 1;
      try { await oauth.token(request, response); } finally { pendingTokens -= 1; }
      json(res, 200, { ...response.body, resource: config.resource });
    } catch (error) {
      // Never reflect Gateway/library exception text: it may contain credentials.
      const known = error instanceof OAuth2Server.OAuthError;
      const name = error.oauthError || (known ? error.name : "server_error");
      const status = error.status || (known ? error.code : 500);
      const description = error.oauthError ? error.message : "OAuth request could not be completed. Restart authorization if necessary.";
      if (trustedRedirect) redirect(res, trustedRedirect, { error: name, error_description: description });
      else json(res, status >= 400 && status < 600 ? status : 500, { error: name, error_description: description, ...(route === "/oauth/authorize" ? { iss: config.issuer } : {}) });
    }
    return true;
  }

  return { handle, authenticate, challenge, scopes: SCOPES, close: () => { clearInterval(cleanup); forms.clear(); codes.clear(); access.clear(); refresh.clear(); grants.clear(); store?.close(); } };
}

module.exports = { createOAuthServer, oauthConfig };
