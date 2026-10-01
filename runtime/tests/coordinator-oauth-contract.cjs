"use strict";

// Isolated HTTP contracts with synthetic credentials and injected client metadata.
// These do not contact ChatGPT, a real Gateway, or any other external service.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createHash, randomBytes } = require("node:crypto");
const { createOAuthServer, oauthConfig } = require("../mcp/oauth-server.cjs");
const { createHttpServer } = require("../mcp/coordinator-server.cjs");

const CALLBACK = "https://client.example/callback";
const GATEWAY_TOKEN = "synthetic-gateway-token-never-return-to-oauth-client";
const SECOND_FACTOR = "synthetic-bridge-second-factor";
const CHATGPT_CLIENT = "https://chatgpt.com/oauth/client.json";
const NOW = Date.UTC(2026, 8, 30, 12);
const pkce = () => {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: createHash("sha256").update(verifier).digest("base64url") };
};

async function harness(t, options = {}) {
  const checkedTokens = [];
  let oauth;
  const standalone = async (req, res) => {
    try {
      if (!await oauth.handle(req, res)) res.writeHead(404).end();
    } catch {
      res.writeHead(500).end("Unexpected fixture request failure");
    }
  };
  // Model a TLS reverse proxy's fixed public origin over test-owned loopback HTTP.
  const publicOrigin = options.mcp ? "https://bridge.example" : null;
  const server = options.mcp ? createHttpServer({ publicOrigin, secondFactor: SECOND_FACTOR,
    oauth: {
      handle: (...args) => oauth.handle(...args),
      authenticate: (...args) => oauth.authenticate(...args),
      challenge: (...args) => oauth.challenge(...args),
      close: () => oauth.close(),
    },
  }) : http.createServer(standalone);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    if (!options.mcp) oauth.close();
    options.config?.storage?.cleanup?.();
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const issuer = publicOrigin || origin;
  const config = { issuer, resource: `${issuer}/mcp`, clientId: "test-client", cimd: false,
    redirectUris: [CALLBACK], secondFactor: "", ...options.config };
  const create = () => createOAuthServer(config, {
    verifyGatewayToken: async (token) => {
      checkedTokens.push(token);
      if (options.verifyGatewayToken) return options.verifyGatewayToken(token);
      if (token !== GATEWAY_TOKEN) throw new Error(`Rejected synthetic credential: ${token}`);
    },
    ...(options.openStore ? { openStore: options.openStore } : {}),
    loadClientMetadata: options.loadClientMetadata || (() => { throw new Error("Unexpected metadata fetch"); }),
  });

  oauth = create();
  const restart = () => { oauth.close(); oauth = create(); };

  async function request(path, options = {}) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual", ...options });
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { /* Consent is HTML, redirects are empty. */ }
    return { status: response.status, headers: response.headers, text, body };
  }
  const post = (path, fields, headers = {}) => request(path, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", ...headers },
    body: new URLSearchParams(fields).toString(),
  });
  function authorizationParams(overrides = {}, proof = pkce()) {
    return { response_type: "code", client_id: config.clientId, redirect_uri: CALLBACK,
      state: "state with & punctuation=+%/", resource: config.resource,
      code_challenge_method: "S256", code_challenge: proof.challenge,
      scope: "brokpot:read brokpot:write", ...overrides };
  }
  async function begin(overrides = {}, proof = pkce()) {
    const params = authorizationParams(overrides, proof);
    const response = await request(`/oauth/authorize?${new URLSearchParams(params)}`);
    assert.equal(response.status, 200, response.text);
    const transaction = response.text.match(/name="transaction" value="([A-Za-z0-9_-]+)"/)?.[1];
    assert.ok(transaction, "Consent must have a CSRF transaction");
    const cookie = response.headers.get("set-cookie")?.split(";")[0];
    assert.ok(cookie?.startsWith("brokpot_oauth="));
    return { params, proof, transaction, cookie, response };
  }
  function consent(session, overrides = {}, headers = {}) {
    return post("/oauth/authorize", { transaction: session.transaction, gateway_token: GATEWAY_TOKEN,
      decision: "approve", ...overrides }, { origin: config.issuer, cookie: session.cookie, ...headers });
  }
  async function authorize(overrides = {}, consentFields = {}) {
    const session = await begin(overrides);
    const result = await consent(session, consentFields);
    assert.equal(result.status, 303, result.text);
    const location = new URL(result.headers.get("location"));
    const code = location.searchParams.get("code");
    assert.ok(code, "Approved consent must return an authorization code");
    return { ...session, code, location, result };
  }
  const redeem = (grant, overrides = {}, headers = {}) => post("/oauth/token", {
    client_id: config.clientId, grant_type: "authorization_code", code: grant.code,
    code_verifier: grant.proof.verifier, redirect_uri: grant.params.redirect_uri,
    resource: config.resource, ...overrides,
  }, headers);
  const refresh = (token, overrides = {}) => post("/oauth/token", {
    client_id: config.clientId, grant_type: "refresh_token", refresh_token: token,
    resource: config.resource, ...overrides,
  });
  async function issue(overrides = {}, consentFields = {}) {
    const grant = await authorize(overrides, consentFields);
    const response = await redeem(grant);
    assert.equal(response.status, 200, response.text);
    return { ...grant, tokens: response.body, tokenResponse: response };
  }
  return { get oauth() { return oauth; }, restart, origin, config, checkedTokens, request, post, authorizationParams, begin,
    consent, authorize, redeem, refresh, issue };
}

function denied(response, error, status = 400) {
  assert.equal(response.status, status, response.text);
  assert.equal(response.body?.error, error, response.text);
  assert.equal(response.headers.get("location"), null, "Rejected request must not redirect");
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(response.body?.access_token, undefined);
  assert.equal(response.body?.refresh_token, undefined);
}

test("OAuth configuration is opt-in and rejects unsafe origins, callbacks, and client IDs", () => {
  const base = { BROKPOT_MCP_AUTH_MODE: "oauth", BROKPOT_MCP_PUBLIC_URL: "https://bridge.example",
    BROKPOT_MCP_OAUTH_REDIRECT_URIS: JSON.stringify([CALLBACK]) };
  assert.equal(oauthConfig({}), null);
  assert.equal(oauthConfig({ BROKPOT_MCP_AUTH_MODE: "gateway" }), null);
  assert.throws(() => oauthConfig({ BROKPOT_MCP_AUTH_MODE: "unknown" }));
  assert.deepEqual(oauthConfig(base), { issuer: "https://bridge.example", resource: "https://bridge.example/mcp",
    clientId: CHATGPT_CLIENT, cimd: true, redirectUris: [CALLBACK], secondFactor: "" });
  assert.equal(oauthConfig({ ...base, BROKPOT_MCP_PUBLIC_URL: "http://127.0.0.1:1234" }).issuer, "http://127.0.0.1:1234");
  assert.equal(oauthConfig({ ...base, BROKPOT_MCP_OAUTH_CLIENT_ID: "static-client", BROKPOT_MCP_SERVER_TOKEN: SECOND_FACTOR }).secondFactor, SECOND_FACTOR);
  for (const origin of ["http://bridge.example", "https://bridge.example/mcp", "https://bridge.example/?x=1",
    "https://user:pass@bridge.example", "https://bridge.example/#fragment"]) {
    assert.throws(() => oauthConfig({ ...base, BROKPOT_MCP_PUBLIC_URL: origin }), origin);
  }
  for (const redirects of ["not-json", "[]", "null", '[123]', JSON.stringify(Array(11).fill(CALLBACK)),
    ...["http://client.example/callback", "https://client.example/*", "https://client.example/callback#fragment",
      "https://user:pass@client.example/callback", "javascript:alert(1)"].map((uri) => JSON.stringify([uri]))]) {
    assert.throws(() => oauthConfig({ ...base, BROKPOT_MCP_OAUTH_REDIRECT_URIS: redirects }), redirects);
  }
  for (const client of ["https://evil.example/client.json", "http://169.254.169.254/latest/meta-data",
    "https://chatgpt.com.evil.example/oauth/client.json", "https://evil@chatgpt.com/oauth/client.json",
    "https://chatgpt.com/oauth/client.json?next=evil", "https://chatgpt.com/oauth/client.json#fragment"]) {
    assert.throws(() => oauthConfig({ ...base, BROKPOT_MCP_OAUTH_CLIENT_ID: client }), client);
  }
});

test("discovery documents and challenges bind the public issuer and MCP resource", async (t) => {
  const h = await harness(t);
  for (const path of ["/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp"]) {
    const response = await h.request(path);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { resource: h.config.resource, authorization_servers: [h.origin],
      scopes_supported: ["brokpot:read", "brokpot:write"], bearer_methods_supported: ["header"] });
    assert.match(response.headers.get("cache-control"), /no-store/);
  }
  const metadata = (await h.request("/.well-known/oauth-authorization-server")).body;
  assert.equal(metadata.issuer, h.origin);
  assert.equal(metadata.authorization_endpoint, `${h.origin}/oauth/authorize`);
  assert.equal(metadata.token_endpoint, `${h.origin}/oauth/token`);
  assert.equal(metadata.revocation_endpoint, `${h.origin}/oauth/revoke`);
  assert.deepEqual(metadata.token_endpoint_auth_methods_supported, ["none"]);
  assert.deepEqual(metadata.grant_types_supported, ["authorization_code", "refresh_token"]);
  assert.deepEqual(metadata.response_types_supported, ["code"]);
  assert.deepEqual(metadata.code_challenge_methods_supported, ["S256"]);
  assert.equal(metadata.authorization_response_iss_parameter_supported, true);
  assert.equal(metadata.client_id_metadata_document_supported, false);
  assert.ok(h.oauth.challenge().includes(`resource_metadata="${h.origin}/.well-known/oauth-protected-resource/mcp"`));
  assert.match(h.oauth.challenge(), /error="invalid_token"/);
  assert.match(h.oauth.challenge("insufficient_scope", ["brokpot:write"]), /scope="brokpot:write", error="insufficient_scope"/);
  assert.equal(h.oauth.authenticate(GATEWAY_TOKEN), null);
  assert.equal(h.oauth.authenticate("unknown-access-token"), null);
  assert.equal(h.oauth.authenticate(undefined), null);
  assert.equal((await h.request("/unrelated")).status, 404);
  assert.equal((await h.post("/.well-known/oauth-authorization-server", {})).status, 405);
  assert.equal((await h.request("/oauth/token")).status, 405);
});

test("explicit consent issues distinct opaque tokens and preserves state and issuer without leaking input credentials", async (t) => {
  const h = await harness(t);
  const grant = await h.issue();
  assert.equal(grant.location.origin + grant.location.pathname, CALLBACK);
  assert.equal(grant.location.searchParams.get("state"), grant.params.state);
  assert.equal(grant.location.searchParams.get("iss"), h.origin);
  assert.equal(grant.location.searchParams.get("error"), null);
  assert.match(grant.response.headers.get("set-cookie"), /HttpOnly; SameSite=Lax/);
  assert.match(grant.response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.equal(grant.response.headers.get("content-security-policy"),
    "default-src 'none'; form-action 'self' https://client.example; frame-ancestors 'none'; base-uri 'none'");
  assert.equal(grant.response.headers.get("x-frame-options"), "DENY");
  assert.equal(grant.response.headers.get("referrer-policy"), "strict-origin");
  assert.equal(grant.result.headers.get("referrer-policy"), "no-referrer");
  assert.match(grant.response.text, /brokpot:read brokpot:write/);
  assert.deepEqual(h.checkedTokens, [GATEWAY_TOKEN]);
  const { access_token: accessToken, refresh_token: refreshToken } = grant.tokens;
  assert.match(accessToken, /^[A-Za-z0-9_-]{43}$/);
  assert.match(refreshToken, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(accessToken, refreshToken);
  assert.notEqual(grant.code, accessToken);
  assert.notEqual(grant.code, refreshToken);
  assert.equal(grant.tokens.token_type.toLowerCase(), "bearer");
  assert.ok(grant.tokens.expires_in > 0 && grant.tokens.expires_in <= 900);
  assert.equal(grant.tokens.scope, "brokpot:read brokpot:write");
  assert.equal(grant.tokens.resource, h.config.resource);
  assert.deepEqual(Object.keys(grant.tokens).sort(), ["access_token", "expires_in", "refresh_token", "resource", "scope", "token_type"]);
  assert.match(grant.tokenResponse.headers.get("cache-control"), /no-store/);
  assert.equal(grant.tokenResponse.headers.get("pragma"), "no-cache");
  for (const value of [grant.response.text, grant.result.text, grant.location.href, grant.tokenResponse.text]) {
    assert.equal(value.includes(GATEWAY_TOKEN), false);
    assert.equal(value.includes(SECOND_FACTOR), false);
  }
  const auth = h.oauth.authenticate(accessToken);
  assert.equal(auth.gatewayToken, GATEWAY_TOKEN);
  assert.deepEqual(auth.scopes, ["brokpot:read", "brokpot:write"]);
  assert.equal(h.oauth.authenticate(refreshToken), null);
  assert.equal(h.oauth.authenticate(grant.code), null);
});

test("authorization rejects untrusted redirects and client identifiers before redirecting or checking Gateway credentials", async (t) => {
  const h = await harness(t);
  for (const redirect of ["https://evil.example/callback", `${CALLBACK}/`, `${CALLBACK}?extra=1`,
    "https://client.example.evil.example/callback", "http://client.example/callback",
    "https://client.example/%63allback", `${CALLBACK}#fragment`]) {
    denied(await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams({ redirect_uri: redirect }))}`), "invalid_client");
  }
  for (const client of ["wrong-client", "https://169.254.169.254/client.json", "https://evil.example/client.json"]) {
    denied(await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams({ client_id: client }))}`), "invalid_client");
  }
  assert.deepEqual(h.checkedTokens, []);
});

test("authorization requires S256 PKCE, valid state, exact resource and supported scopes", async (t) => {
  const h = await harness(t);
  const cases = [
    [{ code_challenge_method: "plain" }, "invalid_request"],
    [{ code_challenge_method: "" }, "invalid_request"],
    [{ code_challenge: "" }, "invalid_request"],
    [{ code_challenge: "short" }, "invalid_request"],
    [{ code_challenge: "!".repeat(43) }, "invalid_request"],
    [{ state: "" }, "invalid_request"],
    [{ state: "x".repeat(2049) }, "invalid_request"],
    [{ state: "state\nwith-newline" }, "invalid_request"],
    [{ resource: "https://other.example/mcp" }, "invalid_target"],
    [{ resource: "" }, "invalid_target"],
    [{ scope: "brokpot:admin" }, "invalid_scope"],
    [{ scope: "brokpot:read brokpot:admin" }, "invalid_scope"],
    [{ response_type: "token" }, "unsupported_response_type"],
  ];
  for (const [overrides, error] of cases) {
    const params = h.authorizationParams(overrides);
    const response = await h.request(`/oauth/authorize?${new URLSearchParams(params)}`);
    if (Object.hasOwn(overrides, "state")) {
      denied(response, error);
      assert.equal(response.body.iss, h.config.issuer);
    } else {
      assert.equal(response.status, 303);
      const callback = new URL(response.headers.get("location"));
      assert.equal(callback.origin + callback.pathname, CALLBACK);
      assert.equal(callback.searchParams.get("error"), error);
      assert.equal(callback.searchParams.get("state"), params.state);
      assert.equal(callback.searchParams.get("iss"), h.config.issuer);
      assert.equal(callback.searchParams.has("code"), false);
    }
  }
  const params = new URLSearchParams(h.authorizationParams());
  params.append("redirect_uri", "https://evil.example/callback");
  denied(await h.request(`/oauth/authorize?${params}`), "invalid_request");
  assert.deepEqual(h.checkedTokens, []);
});

test("consent requires same-origin browser cookie and single-use transaction", async (t) => {
  const h = await harness(t);
  const first = await h.begin();
  const other = await h.begin();
  for (const headers of [{ origin: "https://evil.example" }, { origin: "" }, { origin: "null" },
    { cookie: "" }, { cookie: "brokpot_oauth=forged" }, { cookie: other.cookie }]) {
    denied(await h.consent(first, {}, headers), "invalid_request", 403);
  }
  denied(await h.consent(first, { transaction: "forged" }), "invalid_request", 403);
  assert.deepEqual(h.checkedTokens, []);
  assert.equal((await h.consent(first)).status, 303);
  denied(await h.consent(first), "invalid_request", 403);
  assert.deepEqual(h.checkedTokens, [GATEWAY_TOKEN]);
});

test("denying consent preserves state and issuer without verifying Gateway or issuing a code", async (t) => {
  const h = await harness(t);
  const session = await h.begin();
  const response = await h.consent(session, { decision: "deny", gateway_token: "" });
  assert.equal(response.status, 303);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.origin + location.pathname, CALLBACK);
  assert.equal(location.searchParams.get("error"), "access_denied");
  assert.equal(location.searchParams.get("state"), session.params.state);
  assert.equal(location.searchParams.get("iss"), h.origin);
  assert.equal(location.searchParams.has("code"), false);
  assert.deepEqual(h.checkedTokens, []);
  denied(await h.consent(session), "invalid_request", 403);
  const ambiguous = await h.begin();
  denied(await h.consent(ambiguous, { decision: "" }), "invalid_request");
  denied(await h.consent(ambiguous), "invalid_request", 403);
});

test("consent fails closed for invalid Gateway credentials and sanitizes verifier errors", async (t) => {
  const rejected = "synthetic-rejected-token";
  const h = await harness(t, { verifyGatewayToken: () => { throw new Error(`Gateway says ${GATEWAY_TOKEN} ${rejected}`); } });
  const session = await h.begin();
  const response = await h.consent(session, { gateway_token: rejected });
  denied(response, "access_denied", 401);
  assert.equal(response.text.includes(rejected), false);
  assert.equal(response.text.includes(GATEWAY_TOKEN), false);
  denied(await h.consent(session), "invalid_request", 403);
  const empty = await h.begin();
  denied(await h.consent(empty, { gateway_token: "" }), "access_denied", 401);
  assert.deepEqual(h.checkedTokens, [rejected]);
});

test("configured second factor is mandatory in addition to the Gateway token", async (t) => {
  const h = await harness(t, { config: { secondFactor: SECOND_FACTOR } });
  for (const second_factor of ["", "incorrect-second-factor"]) {
    const session = await h.begin();
    assert.match(session.response.text, /name="second_factor"/);
    assert.equal(session.response.text.includes(SECOND_FACTOR), false);
    denied(await h.consent(session, { second_factor }), "access_denied", 401);
  }
  assert.deepEqual(h.checkedTokens, []);
  const grant = await h.issue({}, { second_factor: SECOND_FACTOR });
  assert.equal(h.oauth.authenticate(grant.tokens.access_token).gatewayToken, GATEWAY_TOKEN);
  assert.equal(grant.tokenResponse.text.includes(SECOND_FACTOR), false);
});

test("code redemption is bound to verifier, client, exact redirect and resource", async (t) => {
  const h = await harness(t);
  for (const overrides of [{ code_verifier: pkce().verifier }, { code_verifier: "" }]) {
    const grant = await h.authorize();
    denied(await h.redeem(grant, overrides), "invalid_grant");
    denied(await h.redeem(grant), "invalid_grant");
  }
  for (const redirect_uri of [`${CALLBACK}/`, `${CALLBACK}?extra=1`, "https://evil.example/callback", ""]) {
    const grant = await h.authorize();
    const response = await h.redeem(grant, { redirect_uri });
    assert.ok(response.status >= 400 && response.status < 500, response.text);
    assert.equal(response.body?.access_token, undefined);
    assert.equal(response.headers.get("location"), null);
  }
  const grant = await h.authorize();
  denied(await h.redeem(grant, { client_id: "different-client" }), "invalid_client");
  denied(await h.redeem(grant, { resource: "https://other.example/mcp" }), "invalid_target");
  denied(await h.redeem(grant, { resource: "" }), "invalid_target");
  assert.equal((await h.redeem(grant)).status, 200);
});

test("authorization code replay is rejected and revokes tokens already issued from its grant", async (t) => {
  const h = await harness(t);
  const grant = await h.issue();
  denied(await h.redeem(grant), "invalid_grant");
  assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
  denied(await h.refresh(grant.tokens.refresh_token), "invalid_grant");
});

test("token endpoint rejects client secrets, assertions, duplicate parameters and query parameters", async (t) => {
  const h = await harness(t);
  const grant = await h.authorize();
  for (const fields of [{ client_secret: "synthetic-client-secret" }, { client_assertion: "synthetic-assertion" }]) {
    denied(await h.redeem(grant, fields), "invalid_client");
  }
  denied(await h.redeem(grant, {}, { authorization: "Basic c3ludGhldGljOnNlY3JldA==" }), "invalid_client");
  denied(await h.post("/oauth/token?resource=duplicate", {}), "invalid_request");
  denied(await h.post("/oauth/token", [["client_id", "test-client"], ["client_id", "wrong-client"]]), "invalid_request");
  denied(await h.request("/oauth/token", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }), "invalid_request", 415);
  denied(await h.post("/oauth/token", { client_id: "test-client", grant_type: "password", resource: h.config.resource }), "unsupported_grant_type");
  denied(await h.post("/oauth/token", { padding: "x".repeat(16385) }), "invalid_request", 413);
  assert.equal((await h.redeem(grant)).status, 200);
});

test("refresh tokens rotate, stay resource-bound and reuse revokes the entire token family", async (t) => {
  const h = await harness(t);
  const grant = await h.issue();
  const unrelated = await h.issue();
  denied(await h.refresh(grant.tokens.refresh_token, { client_id: "wrong-client" }), "invalid_client");
  denied(await h.refresh(grant.tokens.refresh_token, { resource: "https://other.example/mcp" }), "invalid_target");
  const rotated = await h.refresh(grant.tokens.refresh_token);
  assert.equal(rotated.status, 200, rotated.text);
  assert.notEqual(rotated.body.access_token, grant.tokens.access_token);
  assert.notEqual(rotated.body.refresh_token, grant.tokens.refresh_token);
  assert.equal(rotated.body.resource, h.config.resource);
  assert.ok(h.oauth.authenticate(rotated.body.access_token));
  assert.equal(rotated.text.includes(GATEWAY_TOKEN), false);
  denied(await h.refresh(grant.tokens.refresh_token), "invalid_grant");
  assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
  assert.equal(h.oauth.authenticate(rotated.body.access_token), null);
  denied(await h.refresh(rotated.body.refresh_token), "invalid_grant");
  assert.ok(h.oauth.authenticate(unrelated.tokens.access_token), "Reuse must not revoke unrelated grants");
});

test("refresh can narrow scopes but cannot elevate a read-only grant", async (t) => {
  const h = await harness(t);
  const full = await h.issue();
  const narrowed = await h.refresh(full.tokens.refresh_token, { scope: "brokpot:read" });
  assert.equal(narrowed.status, 200, narrowed.text);
  assert.equal(narrowed.body.scope, "brokpot:read");
  assert.deepEqual(h.oauth.authenticate(narrowed.body.access_token).scopes, ["brokpot:read"]);
  denied(await h.refresh(narrowed.body.refresh_token, { scope: "brokpot:read brokpot:write" }), "invalid_scope");
  const readOnly = await h.issue({ scope: "brokpot:read" });
  assert.deepEqual(h.oauth.authenticate(readOnly.tokens.access_token).scopes, ["brokpot:read"]);
  denied(await h.refresh(readOnly.tokens.refresh_token, { scope: "brokpot:write" }), "invalid_scope");
});

test("revoking either token invalidates its whole grant without affecting another grant", async (t) => {
  const h = await harness(t);
  for (const tokenKey of ["access_token", "refresh_token"]) {
    const grant = await h.issue();
    const other = await h.issue();
    denied(await h.post("/oauth/revoke", { client_id: "wrong-client", token: grant.tokens[tokenKey] }), "invalid_client");
    assert.ok(h.oauth.authenticate(grant.tokens.access_token));
    const result = await h.post("/oauth/revoke", { client_id: "test-client", token: grant.tokens[tokenKey] });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, {});
    assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
    denied(await h.refresh(grant.tokens.refresh_token), "invalid_grant");
    assert.ok(h.oauth.authenticate(other.tokens.access_token));
  }
  assert.equal((await h.post("/oauth/revoke", { client_id: "test-client", token: "unknown-synthetic-token" })).status, 200);
  const direct = await h.issue();
  h.oauth.authenticate(direct.tokens.access_token).revoke();
  assert.equal(h.oauth.authenticate(direct.tokens.access_token), null);
  denied(await h.refresh(direct.tokens.refresh_token), "invalid_grant");
});

test("expired consent and authorization codes cannot be used", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: NOW });
  const h = await harness(t);
  const session = await h.begin();
  t.mock.timers.setTime(NOW + 300000);
  denied(await h.consent(session), "invalid_request", 403);
  assert.deepEqual(h.checkedTokens, []);
  const grant = await h.authorize();
  t.mock.timers.setTime(NOW + 360001);
  denied(await h.redeem(grant), "invalid_grant");
});

test("access expires after fifteen minutes while the refresh grant has an absolute seven-day deadline", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: NOW });
  const h = await harness(t);
  const grant = await h.issue();
  t.mock.timers.setTime(NOW + 899000);
  assert.ok(h.oauth.authenticate(grant.tokens.access_token));
  t.mock.timers.setTime(NOW + 900000);
  assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
  const refreshed = await h.refresh(grant.tokens.refresh_token);
  assert.equal(refreshed.status, 200, refreshed.text);
  const deadline = NOW + 7 * 24 * 60 * 60 * 1000;
  t.mock.timers.setTime(deadline - 1000);
  const last = await h.refresh(refreshed.body.refresh_token);
  assert.equal(last.status, 200, last.text);
  assert.ok(last.body.expires_in > 0 && last.body.expires_in <= 1, "Late refresh must not extend grant lifetime");
  assert.ok(h.oauth.authenticate(last.body.access_token));
  t.mock.timers.setTime(deadline);
  assert.equal(h.oauth.authenticate(last.body.access_token), null);
  denied(await h.refresh(last.body.refresh_token), "invalid_grant");
});

test("concurrent code redemption and refresh reuse cannot create independently live token families", async (t) => {
  const h = await harness(t);
  const code = await h.authorize();
  const redemptions = await Promise.all([h.redeem(code), h.redeem(code)]);
  assert.ok(redemptions.filter((result) => result.status === 200).length <= 1);
  assert.ok(redemptions.some((result) => result.body?.error === "invalid_grant"));
  for (const result of redemptions.filter((result) => result.status === 200)) {
    assert.equal(h.oauth.authenticate(result.body.access_token), null);
  }
  const grant = await h.issue();
  const refreshes = await Promise.all([h.refresh(grant.tokens.refresh_token), h.refresh(grant.tokens.refresh_token)]);
  assert.ok(refreshes.filter((result) => result.status === 200).length <= 1);
  assert.ok(refreshes.some((result) => result.body?.error === "invalid_grant"));
  for (const result of refreshes.filter((result) => result.status === 200)) {
    assert.equal(h.oauth.authenticate(result.body.access_token), null);
    denied(await h.refresh(result.body.refresh_token), "invalid_grant");
  }
});

function clientMetadata(overrides = {}) {
  return { client_id: CHATGPT_CLIENT, redirect_uris: [CALLBACK],
    token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"], ...overrides };
}

test("CIMD discovery fetches only the configured client and intersects exact pinned redirects", async (t) => {
  const loads = [];
  const h = await harness(t, { config: { clientId: CHATGPT_CLIENT, cimd: true },
    loadClientMetadata: (id) => {
      loads.push(id);
      return clientMetadata({ redirect_uris: [CALLBACK, "https://evil.example/callback"],
        jwks_uri: "http://169.254.169.254/latest/meta-data" });
    } });
  for (const client_id of ["http://169.254.169.254/latest/meta-data", "https://evil.example/client.json",
    "https://chatgpt.com.evil.example/oauth/client.json"]) {
    denied(await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams({ client_id }))}`), "invalid_client");
  }
  assert.deepEqual(loads, [], "Attacker-supplied client IDs must never reach metadata loading");
  denied(await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams({ redirect_uri: "https://evil.example/callback" }))}`), "invalid_client");
  const grant = await h.issue();
  assert.ok(h.oauth.authenticate(grant.tokens.access_token));
  assert.deepEqual(loads, [CHATGPT_CLIENT]);
  assert.equal((await h.request("/.well-known/oauth-authorization-server")).body.client_id_metadata_document_supported, true);
});

test("CIMD rejects incompatible metadata and metadata redirect substitution", async (t) => {
  for (const overrides of [
    { client_id: "https://evil.example/client.json" },
    { token_endpoint_auth_method: "client_secret_basic" },
    { redirect_uris: ["https://evil.example/callback"] },
    { redirect_uris: [`${CALLBACK}/`] },
    { redirect_uris: ["https://client.example/*"] },
    { grant_types: ["authorization_code"] },
    { response_types: ["token"] },
  ]) {
    const h = await harness(t, { config: { clientId: CHATGPT_CLIENT, cimd: true },
      loadClientMetadata: () => clientMetadata(overrides) });
    denied(await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams())}`), "invalid_client");
    assert.deepEqual(h.checkedTokens, []);
  }
});

test("metadata loader failures are sanitized and cannot issue authorization codes", async (t) => {
  const h = await harness(t, { config: { clientId: CHATGPT_CLIENT, cimd: true },
    loadClientMetadata: () => { throw new Error(`Synthetic discovery failure containing ${GATEWAY_TOKEN}`); } });
  const response = await h.request(`/oauth/authorize?${new URLSearchParams(h.authorizationParams())}`);
  denied(response, "server_error", 500);
  assert.equal(response.text.includes(GATEWAY_TOKEN), false);
  assert.deepEqual(h.checkedTokens, []);
});

async function gatewayHarness(t, options = {}) {
  const state = { calls: [], reject: false, transcripts: [], accepted: new Map() };
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    const method = req.url.slice("/api/".length);
    state.calls.push({ method, body, authorization: req.headers.authorization });
    res.setHeader("content-type", "application/json");
    if (state.reject || req.headers.authorization !== `Bearer ${GATEWAY_TOKEN}`) {
      res.writeHead(401).end(JSON.stringify({ error: `Fixture revoked credential ${GATEWAY_TOKEN}` }));
      return;
    }
    let result;
    if (method === "getHostStatus") result = { ok: true, isBusy: false };
    else if (method === "listAgents") result = [{ id: "test-agent", name: "Test Bot", runState: "idle" }];
    else if (method === "getAgentTranscript") result = state.transcripts;
    else if (method === "promptAcceptanceStatus") {
      const record = state.accepted.get(body.clientNonce);
      result = record ? { outcome: "found", record } : { outcome: "not-found" };
    } else if (method === "sendPrompt") {
      const entry = { kind: "message", role: "user", id: `echo-${body.clientNonce}`, clientNonce: body.clientNonce, content: body.prompt };
      state.transcripts.push(entry);
      state.accepted.set(body.clientNonce, { accountSlot: "host", clientNonce: body.clientNonce,
        agentId: body.agentId, outcome: "accepted", echoEntryId: entry.id });
      result = { accepted: true };
    } else if (["getSubagents", "getAsyncTasks", "getConversationOutline"].includes(method)) result = [];
    else { res.writeHead(404).end(JSON.stringify({ error: "Unknown fixture RPC" })); return; }
    res.end(JSON.stringify(result));
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  const previousUrl = process.env.SAND_HOST_GATEWAY_URL;
  const previousToken = process.env.SAND_HOST_GATEWAY_TOKEN;
  process.env.SAND_HOST_GATEWAY_URL = url;
  // A configured process token must never substitute for a missing MCP identity.
  process.env.SAND_HOST_GATEWAY_TOKEN = "synthetic-process-token-not-authorized";
  t.after(async () => {
    if (previousUrl === undefined) delete process.env.SAND_HOST_GATEWAY_URL;
    else process.env.SAND_HOST_GATEWAY_URL = previousUrl;
    if (previousToken === undefined) delete process.env.SAND_HOST_GATEWAY_TOKEN;
    else process.env.SAND_HOST_GATEWAY_TOKEN = previousToken;
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  const h = await harness(t, { mcp: true, config: { secondFactor: SECOND_FACTOR, ...options.config },
    verifyGatewayToken: async (token) => {
      const result = await fetch(`${url}/api/getHostStatus`, { method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ includeManagedCapabilities: false }) });
      await result.text();
      if (!result.ok) throw new Error("Fixture Gateway rejected consent credential");
    } });
  let requestId = 0;
  const rpc = (method, params = {}, accessToken, headers = {}) => h.request("/mcp", {
    method: "POST", headers: { "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}), ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++requestId, method, params }),
  });
  const call = (name, args, accessToken, headers) => rpc("tools/call", { name, arguments: args }, accessToken, headers);
  const issue = (scope = "brokpot:read brokpot:write") => h.issue({ scope }, { second_factor: SECOND_FACTOR });
  return { ...h, get oauth() { return h.oauth; }, state, rpc, call, issue };
}

test("MCP HTTP accepts issued OAuth access tokens and rejects raw Gateway or tool-argument credentials", async (t) => {
  const h = await gatewayHarness(t);
  assert.equal((await h.request("/.well-known/oauth-protected-resource/mcp")).status, 200);
  const anonymous = await h.rpc("initialize");
  denied(anonymous, "invalid_token", 401);
  assert.equal(anonymous.headers.get("www-authenticate"), h.oauth.challenge());
  denied(await h.call("brokpot_list_agents", { gateway_token: GATEWAY_TOKEN, token: GATEWAY_TOKEN }), "invalid_token", 401);
  denied(await h.rpc("initialize", {}, GATEWAY_TOKEN, { "x-brokpot-mcp-token": SECOND_FACTOR }), "invalid_token", 401);
  assert.equal(h.state.calls.length, 0, "Unauthenticated MCP requests must not contact Gateway");
  const grant = await h.issue();
  assert.match(grant.response.headers.get("set-cookie"), /; Secure(?:;|$)/);
  denied(await h.rpc("initialize", {}, grant.tokens.refresh_token), "invalid_token", 401);
  const initialized = await h.rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {},
    clientInfo: { name: "synthetic-client", version: "1" } }, grant.tokens.access_token);
  assert.equal(initialized.status, 200, initialized.text);
  assert.equal(initialized.body.result.serverInfo.name, "brokpot-gateway");
  assert.equal((await h.rpc("ping", {}, grant.tokens.access_token)).status, 200);
  const agents = await h.call("brokpot_list_agents", {}, grant.tokens.access_token);
  assert.equal(agents.status, 200, agents.text);
  assert.equal(agents.body.result.isError, undefined);
  assert.equal(JSON.parse(agents.body.result.content[0].text)[0].id, "test-agent");
  assert.ok(h.state.calls.every((call) => call.authorization === `Bearer ${GATEWAY_TOKEN}`));
  assert.equal(agents.text.includes(GATEWAY_TOKEN), false);
  const callCount = h.state.calls.length;
  const crossOrigin = await h.rpc("ping", {}, grant.tokens.access_token, { origin: "https://evil.example" });
  assert.equal(crossOrigin.status, 403);
  assert.equal(h.state.calls.length, callCount);
  assert.equal((await h.rpc("ping", {}, grant.tokens.access_token, { origin: h.config.issuer })).status, 200);
});

test("MCP tools advertise OAuth security schemes and enforce independent read and write scopes", async (t) => {
  const h = await gatewayHarness(t);
  const readOnly = await h.issue("brokpot:read");
  const listed = await h.rpc("tools/list", {}, readOnly.tokens.access_token);
  assert.equal(listed.status, 200, listed.text);
  assert.equal(listed.body.result.tools.length, 6);
  for (const tool of listed.body.result.tools) {
    const scope = tool.name === "brokpot_send_message" ? "brokpot:write" : "brokpot:read";
    assert.deepEqual(tool.securitySchemes, [{ type: "oauth2", scopes: [scope] }]);
    assert.deepEqual(tool._meta.securitySchemes, tool.securitySchemes);
    assert.equal(tool.inputSchema.additionalProperties, false);
    assert.equal(Object.hasOwn(tool.inputSchema.properties, "gateway_token"), false);
    assert.equal(Object.hasOwn(tool.inputSchema.properties, "token"), false);
  }
  for (const name of ["brokpot_list_agents", "brokpot_get_updates", "brokpot_get_agent_status", "brokpot_read_transcript"]) {
    const result = await h.call(name, { agent_id: "test-agent" }, readOnly.tokens.access_token);
    assert.equal(result.status, 200, result.text);
    assert.equal(result.body.result.isError, undefined, result.text);
  }
  const before = h.state.calls.length;
  const blockedWrite = await h.call("brokpot_send_message", { agent_id: "test-agent", message: "Synthetic message" }, readOnly.tokens.access_token);
  assert.equal(blockedWrite.status, 403, blockedWrite.text);
  assert.equal(blockedWrite.body.result.isError, true);
  assert.equal(blockedWrite.headers.get("www-authenticate"), h.oauth.challenge("insufficient_scope", ["brokpot:write"]));
  assert.deepEqual(blockedWrite.body.result._meta["mcp/www_authenticate"], [blockedWrite.headers.get("www-authenticate")]);
  assert.equal(h.state.calls.length, before, "Scope rejection must precede Gateway I/O");
  assert.equal(h.state.transcripts.length, 0);
  const writeOnly = await h.issue("brokpot:write");
  const blockedRead = await h.call("brokpot_list_agents", {}, writeOnly.tokens.access_token);
  assert.equal(blockedRead.status, 403);
  assert.match(blockedRead.headers.get("www-authenticate"), /scope="brokpot:read"/);
  const sent = await h.call("brokpot_send_message", { agent_id: "test-agent", message: "Synthetic message", message_id: "synthetic-message-id" }, writeOnly.tokens.access_token);
  assert.equal(sent.status, 200, sent.text);
  assert.equal(sent.body.result.isError, undefined, sent.text);
  assert.equal(JSON.parse(sent.body.result.content[0].text).accepted, true);
  assert.equal(h.state.calls.filter((call) => call.method === "sendPrompt").length, 1);
  assert.deepEqual(h.state.calls.find((call) => call.method === "sendPrompt").body,
    { prompt: "Synthetic message", agentId: "test-agent", clientNonce: "synthetic-message-id" });
});

test("Gateway 401 during MCP tool execution returns reauthorization metadata and revokes the OAuth family", async (t) => {
  const h = await gatewayHarness(t);
  const grant = await h.issue();
  h.state.reject = true;
  const result = await h.call("brokpot_list_agents", {}, grant.tokens.access_token);
  assert.equal(result.status, 200, result.text);
  assert.equal(result.body.result.isError, true);
  assert.deepEqual(result.body.result._meta["mcp/www_authenticate"], [h.oauth.challenge()]);
  assert.equal(result.text.includes(GATEWAY_TOKEN), false);
  assert.match(result.body.result.content[0].text, /Reconnect Brokpot/);
  assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
  denied(await h.refresh(grant.tokens.refresh_token), "invalid_grant");
  const before = h.state.calls.length;
  denied(await h.rpc("ping", {}, grant.tokens.access_token), "invalid_token", 401);
  assert.equal(h.state.calls.length, before);
});

test("Gateway 401 during MCP initialize, ping or discovery also invalidates OAuth tokens", async (t) => {
  const h = await gatewayHarness(t);
  for (const method of ["initialize", "ping", "tools/list"]) {
    h.state.reject = false;
    const grant = await h.issue();
    h.state.reject = true;
    const response = await h.rpc(method, {}, grant.tokens.access_token);
    denied(response, "invalid_token", 401);
    assert.equal(response.headers.get("www-authenticate"), h.oauth.challenge());
    assert.equal(response.text.includes(GATEWAY_TOKEN), false);
    assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
    denied(await h.refresh(grant.tokens.refresh_token), "invalid_grant");
  }
});

for (const invalidation of ["revoked", "expired"]) {
  test(`MCP revalidates tokens ${invalidation} while the request body is pending`, async (t) => {
    t.mock.timers.enable({ apis: ["Date"], now: NOW });
    const h = await gatewayHarness(t);
    const grant = await h.issue();
    let headersChecked;
    const checked = new Promise((resolve) => { headersChecked = resolve; });
    const authenticate = h.oauth.authenticate;
    h.oauth.authenticate = (...args) => {
      const authorization = authenticate(...args);
      headersChecked();
      return authorization;
    };
    const payload = JSON.stringify({ jsonrpc: "2.0", id: 99, method: "tools/call",
      params: { name: "brokpot_send_message", arguments: { agent_id: "test-agent", message: "Synthetic delayed request." } } });
    let req;
    const response = new Promise((resolve, reject) => {
      req = http.request(`${h.origin}/mcp`, { method: "POST", headers: {
        authorization: `Bearer ${grant.tokens.access_token}`, "content-type": "application/json",
        "content-length": Buffer.byteLength(payload),
      } }, (res) => {
        let text = "";
        res.on("data", (chunk) => { text += chunk; });
        res.on("end", () => resolve({ status: res.statusCode, headers: new Headers(res.headers), body: JSON.parse(text), text }));
      });
      req.on("error", reject);
      req.flushHeaders();
    });
    t.after(() => req.destroy());
    await checked;
    if (invalidation === "revoked") {
      assert.equal((await h.post("/oauth/revoke", { client_id: h.config.clientId, token: grant.tokens.access_token })).status, 200);
    } else {
      t.mock.timers.setTime(NOW + 900000);
    }
    assert.equal(h.oauth.authenticate(grant.tokens.access_token), null);
    const callsBefore = h.state.calls.length;
    req.end(payload);
    const result = await response;
    denied(result, "invalid_token", 401);
    assert.equal(result.headers.get("www-authenticate"), h.oauth.challenge());
    assert.equal(h.state.calls.length, callsBefore, "A revoked or expired request must not reach the Gateway");
  });
}


// Persistence is opt-in; CI uses Node >=22.13. Older runtimes still test memory mode.
let hasSQLite = false;
try { require("node:sqlite"); hasSQLite = true; } catch {}
function durableFiles(t) {
  const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brokpot-oauth-"));
  fs.chmodSync(root, 0o700);
  const keyFile = path.join(root, "key");
  fs.writeFileSync(keyFile, randomBytes(32), { mode: 0o600 });
  return { directory: path.join(root, "data"), keyFile, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

test("durable grants survive restart, exceed seven days, rotate with bounded state and revoke permanently", { skip: !hasSQLite }, async (t) => {
  const storage = durableFiles(t);
  const h = await harness(t, { config: { storage } });
  const grant = await h.issue();
  const oldAccess = grant.tokens.access_token;
  h.restart();
  assert.ok(h.oauth.authenticate(oldAccess));
  let tokens = grant.tokens;
  const now = Date.now;
  Date.now = () => now() + 10 * 24 * 60 * 60 * 1000;
  try {
    assert.equal(h.oauth.authenticate(oldAccess), null);
    const refreshed = await h.refresh(tokens.refresh_token);
    assert.equal(refreshed.status, 200);
    tokens = refreshed.body;
  } finally { Date.now = now; }
  for (let i = 0; i < 25; i++) {
    const result = await h.refresh(tokens.refresh_token);
    assert.equal(result.status, 200);
    tokens = result.body;
  }
  h.restart();
  assert.ok(h.oauth.authenticate(tokens.access_token));
  const fs = require("node:fs"), path = require("node:path");
  for (const file of fs.readdirSync(storage.directory)) {
    const bytes = fs.readFileSync(path.join(storage.directory, file));
    for (const secret of [GATEWAY_TOKEN, tokens.access_token, tokens.refresh_token]) assert.equal(bytes.includes(Buffer.from(secret)), false);
    assert.equal(fs.statSync(path.join(storage.directory, file)).mode & 0o077, 0);
  }
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(storage.directory, "grants.sqlite"));
  assert.ok(db.prepare("SELECT length(payload) AS n FROM state").get().n < 16000, "Rotations must not accumulate refresh history");
  db.close();
  assert.equal((await h.post("/oauth/revoke", { client_id: h.config.clientId, token: tokens.refresh_token })).status, 200);
  h.restart();
  assert.equal(h.oauth.authenticate(tokens.access_token), null);
  assert.equal((await h.refresh(tokens.refresh_token)).status, 400);
});

test("durable refresh replay after restart revokes the family, while forgery does not", { skip: !hasSQLite }, async (t) => {
  const h = await harness(t, { config: { storage: durableFiles(t) } });
  const grant = await h.issue();
  const next = await h.refresh(grant.tokens.refresh_token);
  assert.equal(next.status, 200);
  h.restart();
  assert.equal((await h.refresh(grant.tokens.refresh_token + "x")).status, 400);
  assert.ok(h.oauth.authenticate(next.body.access_token));
  assert.equal((await h.refresh(grant.tokens.refresh_token)).status, 400);
  h.restart();
  assert.equal(h.oauth.authenticate(next.body.access_token), null);
  assert.equal((await h.refresh(next.body.refresh_token)).status, 400);
});

test("durable storage rejects live owners, wrong keys, corruption and changed issuer binding without resetting data", { skip: !hasSQLite }, async (t) => {
  const fs = require("node:fs"), path = require("node:path");
  const storage = durableFiles(t);
  const h = await harness(t, { config: { storage } });
  await h.issue();
  assert.throws(() => createOAuthServer(h.config), /storage/);
  h.oauth.close();
  const before = fs.readFileSync(path.join(storage.directory, "grants.sqlite"));
  const oldKey = fs.readFileSync(storage.keyFile);
  fs.writeFileSync(storage.keyFile, randomBytes(32));
  assert.throws(() => createOAuthServer(h.config), /storage/);
  fs.writeFileSync(storage.keyFile, oldKey);
  assert.throws(() => createOAuthServer({ ...h.config, resource: "https://other.example/mcp" }), /storage/);
  assert.deepEqual(fs.readFileSync(path.join(storage.directory, "grants.sqlite")), before);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(storage.directory, "grants.sqlite"));
  db.exec("UPDATE state SET payload=zeroblob(100)"); db.close();
  assert.throws(() => createOAuthServer(h.config), /storage/);
});

test("durable commit failure latches all authorization paths unavailable before success", { skip: !hasSQLite }, async (t) => {
  const { openOAuthStore } = require("../mcp/oauth-store.cjs");
  let failSave = false;
  const h = await harness(t, { config: { storage: durableFiles(t) }, openStore: (args) => {
    const store = openOAuthStore(args);
    return { ...store, save: (value) => { if (failSave) throw new Error("synthetic disk failure"); store.save(value); } };
  } });
  const grant = await h.issue();
  failSave = true;
  const results = await Promise.all([h.refresh(grant.tokens.refresh_token), h.refresh(grant.tokens.refresh_token)]);
  assert.ok(results.every((result) => result.status >= 400));
  assert.throws(() => h.oauth.authenticate(grant.tokens.access_token), /storage/);
  assert.equal((await h.post("/oauth/revoke", { client_id: h.config.clientId, token: grant.tokens.access_token })).status, 503);
  assert.equal((await h.begin().catch((error) => error)).name, "AssertionError");
});

test("durable storage recovers a crashed local owner and preserves its committed state", { skip: !hasSQLite }, async (t) => {
  const fs = require("node:fs"), path = require("node:path");
  const { spawn } = require("node:child_process");
  const storage = durableFiles(t);
  t.after(storage.cleanup);
  const modulePath = path.resolve(__dirname, "../mcp/oauth-store.cjs");
  const child = spawn(process.execPath, ["-e", `const s=require(${JSON.stringify(modulePath)}).openOAuthStore(${JSON.stringify({ ...storage, binding: ["fixture"] })});s.save({value:"committed"});process.stdout.write("ready");setInterval(()=>{},1000);`], { stdio: ["ignore", "pipe", "pipe"] });
  t.after(() => child.kill("SIGKILL"));
  await new Promise((resolve, reject) => { child.stdout.once("data", resolve); child.once("error", reject); child.once("exit", () => reject(new Error("Fixture exited before ready"))); });
  child.kill("SIGKILL");
  await new Promise((resolve) => child.once("exit", resolve));
  const store = require("../mcp/oauth-store.cjs").openOAuthStore({ ...storage, binding: ["fixture"] });
  assert.deepEqual(store.initial, { value: "committed" }); store.close();
});


test("durable Gateway rejection persists revocation across restart", { skip: !hasSQLite }, async (t) => {
  const h = await gatewayHarness(t, { config: { storage: durableFiles(t) } });
  const grant = await h.issue();
  h.state.reject = true;
  assert.equal((await h.call("brokpot_list_agents", {}, grant.tokens.access_token)).body.result.isError, true);
  h.restart();
  h.state.reject = false;
  assert.equal((await h.rpc("tools/list", {}, grant.tokens.access_token)).status, 401);
  assert.equal((await h.refresh(grant.tokens.refresh_token)).status, 400);
});

test("durable concurrent refresh cannot create two live descendants", { skip: !hasSQLite }, async (t) => {
  const h = await harness(t, { config: { storage: durableFiles(t) } });
  const grant = await h.issue();
  const responses = await Promise.all([h.refresh(grant.tokens.refresh_token), h.refresh(grant.tokens.refresh_token)]);
  assert.ok(responses.filter((r) => r.status === 200).length <= 1);
  h.restart();
  for (const response of responses.filter((r) => r.status === 200)) {
    assert.equal(h.oauth.authenticate(response.body.access_token), null);
    assert.equal((await h.refresh(response.body.refresh_token)).status, 400);
  }
});

test("store enforces private files, rejects symlinks and allows protected read-only systemd key files", { skip: !hasSQLite }, (t) => {
  const fs = require("node:fs"), path = require("node:path");
  const storage = durableFiles(t); t.after(storage.cleanup);
  const { openOAuthStore } = require("../mcp/oauth-store.cjs");
  const config = { ...storage, binding: ["fixture"] };
  fs.chmodSync(storage.keyFile, 0o644);
  assert.throws(() => openOAuthStore(config), /storage/);
  fs.chmodSync(storage.keyFile, 0o440);
  let store = openOAuthStore(config); store.save({ fixture: true }); store.close();
  const db = path.join(storage.directory, "grants.sqlite");
  fs.chmodSync(db, 0o644); assert.throws(() => openOAuthStore(config), /storage/); fs.chmodSync(db, 0o600);
  fs.symlinkSync(storage.keyFile, db + "-journal"); assert.throws(() => openOAuthStore(config), /storage/); fs.unlinkSync(db + "-journal");
  fs.renameSync(db, db + ".saved"); fs.symlinkSync(db + ".saved", db); assert.throws(() => openOAuthStore(config), /storage/);
});
